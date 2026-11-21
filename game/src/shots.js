// Screenshot staging behind ?shot=hunt|hint|clear|select: each plays the real game forward with
// real clicks and hints at fixed times, so the frame is a true state of the game and always the same.

import { SCENES } from './sceneRegistry.js';
import { markAt, startScene, updateGame, useHint } from './game.js';

const STEP = 1 / 60;

function wait(game, seconds) {
  for (let t = 0; t < seconds - 1e-9; t += STEP) updateGame(game, STEP);
}

function findById(game, id) {
  const d = game.hunt.scene.differences.find((x) => x.id === id);
  markAt(game, 1, d.x, d.y);
}

function sceneIndexById(id) {
  return Math.max(0, SCENES.findIndex((s) => s.id === id));
}

const STAGES = {
  hunt(game, opts) {
    startScene(game, sceneIndexById(opts.scene));
    const ids = game.hunt.scene.differences.map((d) => d.id);
    const order = opts.order ?? ids;
    wait(game, opts.warmup ?? 14);
    findById(game, order[0]);
    wait(game, 9);
    findById(game, order[1]);
    wait(game, 3.2);
    findById(game, order[2]);
    wait(game, 2.4);
    findById(game, order[3]);
    wait(game, 0.45);
  },
  hint(game, opts) {
    startScene(game, sceneIndexById(opts.scene));
    const order = opts.order ?? game.hunt.scene.differences.map((d) => d.id);
    wait(game, 18);
    findById(game, order[0]);
    wait(game, 11);
    findById(game, order[1]);
    wait(game, 7);
    findById(game, order[2]);
    wait(game, 6);
    useHint(game);
    wait(game, 0.4);
    markAt(game, 1, opts.missX, opts.missY);
    wait(game, 0.3);
  },
  clear(game, opts) {
    startScene(game, sceneIndexById(opts.scene));
    for (const d of game.hunt.scene.differences) {
      wait(game, 4.1);
      markAt(game, 1, d.x, d.y);
    }
    wait(game, 1.6);
  },
  select(game, opts) {
    for (const id of opts.cleared) game.stars[id] = opts.starsEach;
    game.selected = opts.selected;
    game.screen = 'title';
    game.clock = 0.4;
  },
};

/** Stages the named shot; the options pick the scene and the moments it shows. */
export function stageShot(game, name, opts) {
  const stage = STAGES[name];
  if (!stage) return false;
  stage(game, opts);
  return true;
}

export const SHOT_PLANS = {
  hunt: { scene: 'harbor', warmup: 34, order: ['sailStripe', 'litWindow', 'crates', 'sun'] },
  hint: { scene: 'observatory', order: ['globe', 'planet', 'clockHand'], missX: 566, missY: 474 },
  clear: { scene: 'market' },
  select: { cleared: ['harbor', 'glasshouse', 'market', 'rooftops'], starsEach: 3, selected: 4 },
};
