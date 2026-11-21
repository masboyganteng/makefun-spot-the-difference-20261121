// Draws one whole frame from the game state: header, both pictures with their marks, footer, cards.

import { PALETTE, SCENE_H, SCENE_W, VIEW_H, VIEW_W } from './config.js';
import { drawFoundMarkers, drawMissedMarkers, drawPanelEffects } from './effects.js';
import { sceneMeta, unlockedCount } from './game.js';
import { drawHintLens, hintStrength } from './hint.js';
import { drawFooter, drawHeader, drawPanelFrames, drawTimerBar } from './hud.js';
import { eachPanel } from './panels.js';
import { SCENES } from './sceneRegistry.js';
import { drawClearCard, drawPauseOverlay, drawTimeUpCard, drawTitleScreen } from './screens.js';

export function drawFrame(ctx, game) {
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  if (game.screen === 'title') {
    drawTitleScreen(ctx, { scenes: SCENES, thumbs: game.thumbs, selected: game.selected, stars: game.stars, unlocked: unlockedCount(game), clock: game.clock });
    return;
  }
  const hunt = game.hunt;
  drawHeader(ctx, hunt, sceneMeta(hunt.sceneIndex));
  drawTimerBar(ctx, hunt);
  drawPictures(ctx, game);
  drawPanelFrames(ctx);
  drawFooter(ctx, hunt, { muted: game.audio.muted });
  if (game.paused) drawPauseOverlay(ctx);
  else if (hunt.outcome === 'clear') drawClearCard(ctx, hunt, hunt.clock, hunt.sceneIndex + 1 < SCENES.length);
  else if (hunt.outcome === 'timeup') drawTimeUpCard(ctx, hunt);
}

function drawPictures(ctx, game) {
  const hunt = game.hunt;
  const strength = hintStrength(game.hint, hunt.clock, hunt.found);
  eachPanel(ctx, (panel) => {
    ctx.drawImage(game.pictures[panel], 0, 0, SCENE_W, SCENE_H);
    if (hunt.outcome === 'clear') {
      ctx.fillStyle = 'rgba(10,8,18,0.25)';
      ctx.fillRect(0, 0, SCENE_W, SCENE_H);
    }
    drawHintLens(ctx, game.hint, hunt.clock, strength);
    drawFoundMarkers(ctx, hunt, hunt.clock);
    if (hunt.outcome === 'timeup') drawMissedMarkers(ctx, hunt, hunt.clock);
    drawPanelEffects(ctx, game.effects, hunt.clock, panel);
    if (!hunt.outcome) drawCrosshair(ctx, game.cursor, panel);
  });
}

/** The aiming crosshair: solid in the panel being aimed at, a faint twin in the other. */
function drawCrosshair(ctx, cursor, panel) {
  if (!cursor.keyboard) return;
  const solid = panel === cursor.panel;
  const { x, y } = cursor;
  ctx.save();
  ctx.globalAlpha = solid ? 1 : 0.45;
  for (const [w, c] of [[6, 'rgba(10,8,18,0.8)'], [2.5, '#ffffff']]) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.moveTo(x - 24, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 24, y);
    ctx.moveTo(x, y - 24);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 24);
    ctx.stroke();
  }
  ctx.restore();
}
