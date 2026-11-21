// The two side-by-side panels: where they sit, mapping clicks into scene space, and baking each picture.
// Both pictures come from the same draw function; only the copy is told which changes to show.

import { LAYOUT, SCENE_H, SCENE_W } from './config.js';
import { variantLookup } from './differences.js';

export const PANEL_LABELS = ['ORIGINAL', 'THE COPY'];

export function panelOrigin(index) {
  return { x: index === 0 ? LAYOUT.leftX : LAYOUT.rightX, y: LAYOUT.panelY };
}

/** Which panel a view point is in, and where in scene space; null outside both. */
export function viewToScene(vx, vy) {
  for (let i = 0; i < 2; i++) {
    const o = panelOrigin(i);
    const x = vx - o.x;
    const y = vy - o.y;
    if (x >= 0 && y >= 0 && x <= SCENE_W && y <= SCENE_H) return { panel: i, x, y };
  }
  return null;
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/** Paints one picture of the scene at the given scale; changed lists the differences it shows. */
export function bakeScenePicture(scene, scale, changed) {
  const canvas = makeCanvas(SCENE_W * scale, SCENE_H * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.rect(0, 0, SCENE_W, SCENE_H);
  ctx.clip();
  scene.draw(ctx, variantLookup(changed));
  return canvas;
}

/** The original (no change) and the copy (every change) for a scene. */
export function bakeScenePanels(scene, scale) {
  return [
    bakeScenePicture(scene, scale, []),
    bakeScenePicture(scene, scale, scene.differences.map((d) => d.id)),
  ];
}

/** Runs draw() once per panel with the canvas moved into that panel and clipped to it. */
export function eachPanel(ctx, draw) {
  for (let i = 0; i < 2; i++) {
    const o = panelOrigin(i);
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.beginPath();
    ctx.rect(0, 0, SCENE_W, SCENE_H);
    ctx.clip();
    draw(i);
    ctx.restore();
  }
}
