// Game state and every action on it: choosing a scene, clicks, keys, hints and the clock.
// Screens: 'title' (scene select) and 'play'; a hunt's outcome ('clear' or 'timeup') shows its card.

import { RULES, SCENE_H, SCENE_W, SETS } from './config.js';
import { spawnFindEffects, spawnMissEffect, createEffects, pruneEffects } from './effects.js';
import { startHint } from './hint.js';
import { advanceHunt, createHunt, takeHint, tryFindAt } from './hunt.js';
import { bakeScenePanels, bakeScenePicture, viewToScene } from './panels.js';
import { SCENES } from './sceneRegistry.js';
import { thumbRect, THUMB } from './screens.js';

export function createGame(audio) {
  return {
    screen: 'title',
    paused: false,
    selected: 0,
    stars: {},
    hunt: null,
    hint: null,
    effects: createEffects(),
    cursor: { x: SCENE_W / 2, y: SCENE_H / 2, panel: 1, keyboard: false },
    pictures: null,
    thumbs: null,
    scale: 1,
    clock: 0,
    audio,
  };
}

/** Scenes open in order: the first, then each one after a cleared scene. */
export function unlockedCount(game) {
  let n = 1;
  while (n < SCENES.length && game.stars[SCENES[n - 1].id]) n++;
  return n;
}

export function setRenderScale(game, scale) {
  game.scale = scale;
  game.thumbs = SCENES.map((s) => bakeScenePicture(s, (THUMB.w / SCENE_W) * scale, []));
  if (game.hunt) game.pictures = bakeScenePanels(game.hunt.scene, scale);
}

export function startScene(game, index) {
  const scene = SCENES[index];
  game.selected = index;
  game.hunt = createHunt(scene, SETS[scene.set], index);
  game.hint = null;
  game.effects = createEffects();
  game.pictures = bakeScenePanels(scene, game.scale);
  game.screen = 'play';
  game.paused = false;
  game.lastTickSecond = null;
}

export function sceneMeta(index) {
  const scene = SCENES[index];
  const set = SETS[scene.set];
  return {
    sceneName: scene.name,
    setName: set.name,
    setNumber: scene.set + 1,
    sceneNumber: index + 1,
    tint: set.tint,
  };
}

/** A click (or Space) at scene point (x, y) in a panel. */
export function markAt(game, panel, x, y) {
  const hunt = game.hunt;
  if (game.screen !== 'play' || game.paused || !hunt) return null;
  const res = tryFindAt(hunt, x, y);
  if (res.result === 'found') {
    spawnFindEffects(game.effects, res.diff, res.points, res.combo, hunt.clock);
    game.audio.play('find', res.combo);
    if (hunt.outcome === 'clear') {
      game.stars[hunt.scene.id] = Math.max(game.stars[hunt.scene.id] || 0, hunt.stars);
      game.audio.play('clear');
    }
  } else if (res.result === 'miss') {
    spawnMissEffect(game.effects, x, y, panel, hunt.clock);
    game.audio.play('miss');
    if (hunt.outcome === 'timeup') game.audio.play('timeup');
  }
  return res;
}

export function useHint(game) {
  if (game.screen !== 'play' || game.paused || !game.hunt) return null;
  const diff = takeHint(game.hunt);
  if (!diff) return null;
  game.hint = startHint(diff, game.hunt.clock);
  game.audio.play('hint');
  return diff;
}

export function handleClick(game, vx, vy) {
  game.audio.unlock();
  if (game.screen === 'title') {
    const open = unlockedCount(game);
    for (let i = 0; i < SCENES.length; i++) {
      const r = thumbRect(i, SCENES);
      if (vx >= r.x && vx <= r.x + r.w && vy >= r.y && vy <= r.y + r.h && i < open) {
        game.audio.play('select');
        startScene(game, i);
      }
    }
    return;
  }
  if (game.hunt?.outcome) return;
  const hit = viewToScene(vx, vy);
  if (hit) {
    game.cursor = { x: hit.x, y: hit.y, panel: hit.panel, keyboard: false };
    markAt(game, hit.panel, hit.x, hit.y);
  }
}

export function goToNextScene(game) {
  const next = game.hunt.sceneIndex + 1;
  if (next < SCENES.length) startScene(game, next);
  else game.screen = 'title';
}

export function handleKey(game, key) {
  game.audio.unlock();
  if (key === 'm') {
    game.audio.toggleMute();
    return;
  }
  if (game.screen === 'title') {
    const open = unlockedCount(game);
    if (key === 'arrowright' || key === 'd') game.selected = Math.min(SCENES.length - 1, game.selected + 2);
    if (key === 'arrowleft' || key === 'a') game.selected = Math.max(0, game.selected - 2);
    if (key === 'arrowdown' || key === 's') game.selected = Math.min(SCENES.length - 1, game.selected + 1);
    if (key === 'arrowup' || key === 'w') game.selected = Math.max(0, game.selected - 1);
    if ((key === 'enter' || key === ' ') && game.selected < open) startScene(game, game.selected);
    return;
  }
  const hunt = game.hunt;
  if (key === 'escape' && (game.paused || hunt.outcome)) {
    game.screen = 'title';
    game.paused = false;
    return;
  }
  if (key === 'p' || key === 'escape') {
    if (!hunt.outcome) game.paused = !game.paused;
    return;
  }
  if (key === 'r') {
    startScene(game, hunt.sceneIndex);
    return;
  }
  if (hunt.outcome === 'clear' && (key === 'n' || key === 'enter')) {
    goToNextScene(game);
    return;
  }
  if (key === 'h') useHint(game);
  if (key === ' ' || key === 'enter') {
    game.cursor.keyboard = true;
    markAt(game, game.cursor.panel, game.cursor.x, game.cursor.y);
  }
  if (key === 'tab') game.cursor.panel = 1 - game.cursor.panel;
}

/** Arrow keys or WASD glide the crosshair; faster with Shift held. */
export function steerCursor(game, held, dt) {
  let dx = 0;
  let dy = 0;
  if (held.has('arrowleft') || held.has('a')) dx--;
  if (held.has('arrowright') || held.has('d')) dx++;
  if (held.has('arrowup') || held.has('w')) dy--;
  if (held.has('arrowdown') || held.has('s')) dy++;
  if (!dx && !dy) return;
  const speed = held.has('shift') ? 520 : 260;
  game.cursor.keyboard = true;
  game.cursor.x = Math.max(0, Math.min(SCENE_W, game.cursor.x + dx * speed * dt));
  game.cursor.y = Math.max(0, Math.min(SCENE_H, game.cursor.y + dy * speed * dt));
}

export function updateGame(game, dt) {
  game.clock += dt;
  if (game.screen !== 'play' || game.paused) return;
  const hunt = game.hunt;
  const was = hunt.outcome;
  if (advanceHunt(hunt, dt) === 'timeup' && !was) game.audio.play('timeup');
  if (!hunt.outcome && hunt.timeLeft <= RULES.lowTimeSeconds) {
    const sec = Math.ceil(hunt.timeLeft);
    if (sec !== game.lastTickSecond) {
      game.lastTickSecond = sec;
      game.audio.play('tick');
    }
  }
  pruneEffects(game.effects, hunt.clock);
}
