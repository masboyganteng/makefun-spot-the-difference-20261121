// Whole-screen and card states: the title with its scene select, pause, scene clear and time's up.

import { FONT, PALETTE, SETS, VIEW_H, VIEW_W } from './config.js';
import { drawLogo } from './hud.js';

const TAU = Math.PI * 2;
export const THUMB = { w: 200, h: 173, gapX: 56, gapY: 64, top: 214 };

function text(ctx, str, x, y, size, weight, color, align = 'center') {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

function drawStarShape(ctx, x, y, r, filled) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = filled ? PALETTE.gold : 'rgba(255,255,255,0.08)';
  ctx.fill();
  ctx.strokeStyle = filled ? '#8a5a00' : PALETTE.edge;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/** Where the thumbnail of scene i sits on the title screen: one column per set. */
export function thumbRect(i, scenes) {
  const set = scenes[i].set;
  const row = scenes.filter((s, j) => s.set === set && j < i).length;
  const cols = SETS.length;
  const x0 = (VIEW_W - (cols * THUMB.w + (cols - 1) * THUMB.gapX)) / 2;
  return { x: x0 + set * (THUMB.w + THUMB.gapX), y: THUMB.top + row * (THUMB.h + THUMB.gapY), w: THUMB.w, h: THUMB.h };
}

export function drawTitleScreen(ctx, { scenes, thumbs, selected, stars, unlocked, clock }) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, '#2a2142');
  g.addColorStop(1, '#0f0c18');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawLogo(ctx, VIEW_W / 2, 96, 76, 'center');
  text(ctx, 'Two pictures. One of them is lying.', VIEW_W / 2, 134, 22, 600, PALETTE.muted);
  scenes.forEach((scene, i) => {
    const r = thumbRect(i, scenes);
    if (scenes.findIndex((s) => s.set === scene.set) === i) {
      const set = SETS[scene.set];
      text(ctx, `SET ${scene.set + 1} · ${set.name.toUpperCase()}`, r.x + r.w / 2, r.y - 30, 16, 900, set.tint);
      text(ctx, `${set.seconds}s clock · ${set.hints} hint${set.hints > 1 ? 's' : ''}`, r.x + r.w / 2, r.y - 12, 13, 700, PALETTE.muted);
    }
    const open = i < unlocked;
    ctx.save();
    ctx.drawImage(thumbs[i], r.x, r.y, r.w, r.h);
    if (!open) {
      ctx.fillStyle = 'rgba(12,10,20,0.72)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      drawLock(ctx, r.x + r.w / 2, r.y + r.h / 2);
    }
    const isSel = i === selected;
    ctx.lineWidth = isSel ? 5 : 2;
    ctx.strokeStyle = isSel ? PALETTE.gold : PALETTE.edge;
    if (isSel) {
      ctx.shadowColor = PALETTE.gold;
      ctx.shadowBlur = 14 + 6 * Math.sin(clock * 4);
    }
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.restore();
    text(ctx, scene.name, r.x + r.w / 2, r.y + r.h + 22, 15, 800, open ? PALETTE.text : PALETTE.muted, 'center');
    text(ctx, `${scene.differences.length} differences`, r.x + 6, r.y + r.h + 42, 12, 700, PALETTE.muted, 'left');
    for (let s = 0; s < 3; s++) drawStarShape(ctx, r.x + r.w - 46 + s * 17, r.y + r.h + 38, 7, s < (stars[scene.id] || 0));
  });
  drawTitleSidebars(ctx);
  const pulse = 0.7 + 0.3 * Math.sin(clock * 3);
  ctx.globalAlpha = pulse;
  text(ctx, 'CLICK A SCENE  ·  OR  ARROWS + ENTER', VIEW_W / 2, 762, 20, 900, PALETTE.gold);
  ctx.globalAlpha = 1;
}

function drawLock(ctx, x, y) {
  ctx.lineWidth = 5;
  ctx.strokeStyle = PALETTE.muted;
  ctx.beginPath();
  ctx.arc(x, y - 6, 12, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 18, y - 6, 36, 28, 5);
  ctx.fillStyle = PALETTE.muted;
  ctx.fill();
}

function drawTitleSidebars(ctx) {
  const how = ['Spot what changed between', 'the two pictures.', '', 'Click a difference in', 'either picture to ring it.', '', 'A wrong click costs 5 s.', 'Quick finds build a combo.', 'H shows a hint lens.'];
  text(ctx, 'HOW TO PLAY', 128, 220, 16, 900, PALETTE.gold);
  how.forEach((l, i) => text(ctx, l, 128, 248 + i * 22, 14, 600, PALETTE.text));
  const kinds = ['Missing or added', 'Colour swapped', 'Moved a little', 'Bigger or smaller', 'Flipped around', 'Pattern changed', 'Count changed'];
  text(ctx, 'WHAT CHANGES', VIEW_W - 128, 220, 16, 900, PALETTE.gold);
  kinds.forEach((l, i) => text(ctx, l, VIEW_W - 128, 248 + i * 24, 14, 600, PALETTE.text));
  text(ctx, 'Later sets hide', VIEW_W - 128, 432, 14, 600, PALETTE.muted);
  text(ctx, 'subtler changes, with', VIEW_W - 128, 454, 14, 600, PALETTE.muted);
  text(ctx, 'less time and fewer hints.', VIEW_W - 128, 476, 14, 600, PALETTE.muted);
}

function card(ctx, x, y, w, h, edge) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 22);
  ctx.fillStyle = 'rgba(21,18,31,0.95)';
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 22);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function keyButton(ctx, x, y, w, key, label, accent) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, 44, 12);
  ctx.fillStyle = accent ? PALETTE.gold : PALETTE.inkSoft;
  ctx.fill();
  ctx.strokeStyle = accent ? PALETTE.gold : PALETTE.edge;
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, `${key}  ${label}`, x + w / 2, y + 29, 17, 900, accent ? PALETTE.ink : PALETTE.text);
}

/** The scene clear card: stars rising in one by one, then the tally. */
export function drawClearCard(ctx, hunt, clock, hasNext) {
  const age = clock - hunt.endedClock;
  const w = 420;
  const h = 318;
  const x = (VIEW_W - w) / 2;
  const y = 236;
  card(ctx, x, y, w, h, PALETTE.gold);
  text(ctx, 'SCENE CLEAR', VIEW_W / 2, y + 56, 40, 900, PALETTE.gold);
  for (let s = 0; s < 3; s++) {
    const t = Math.max(0, Math.min(1, (age - 0.25 - s * 0.22) / 0.3));
    const scale = t === 0 ? 1 : 1 + 0.35 * Math.sin(Math.PI * t);
    drawStarShape(ctx, VIEW_W / 2 + (s - 1) * 64, y + 104 - (s === 1 ? 8 : 0), 24 * scale, s < hunt.stars && t > 0.5);
  }
  const rows = [
    [`${hunt.found.length} differences found`, hunt.findScore],
    [`Time bonus (${Math.ceil(hunt.timeLeft)} s left)`, hunt.bonus],
    [`Misses ${hunt.misses}  ·  Hints used ${hunt.hintsUsed}`, null],
  ];
  rows.forEach(([label, value], i) => {
    text(ctx, label, x + 36, y + 150 + i * 26, 16, 700, PALETTE.text, 'left');
    if (value !== null) text(ctx, value.toLocaleString('en-US'), x + w - 36, y + 150 + i * 26, 16, 900, PALETTE.text, 'right');
  });
  ctx.fillStyle = PALETTE.edge;
  ctx.fillRect(x + 36, y + 214, w - 72, 2);
  text(ctx, 'TOTAL', x + 36, y + 242, 20, 900, PALETTE.gold, 'left');
  text(ctx, hunt.score.toLocaleString('en-US'), x + w - 36, y + 242, 24, 900, PALETTE.gold, 'right');
  keyButton(ctx, x + 24, y + h - 60, 180, 'N', hasNext ? 'NEXT SCENE' : 'SCENE LIST', true);
  keyButton(ctx, x + w - 204, y + h - 60, 180, 'R', 'PLAY AGAIN', false);
}

export function drawTimeUpCard(ctx, hunt) {
  const left = hunt.scene.differences.length - hunt.found.length;
  const w = 430;
  const h = 190;
  const x = (VIEW_W - w) / 2;
  const y = 300;
  card(ctx, x, y, w, h, PALETTE.miss);
  text(ctx, "TIME'S UP", VIEW_W / 2, y + 56, 40, 900, PALETTE.miss);
  text(ctx, `${left} still hiding, ringed in red`, VIEW_W / 2, y + 90, 17, 700, PALETTE.text);
  keyButton(ctx, x + 24, y + h - 66, 180, 'R', 'TRY AGAIN', true);
  keyButton(ctx, x + w - 204, y + h - 66, 180, 'ESC', 'SCENES', false);
}

export function drawPauseOverlay(ctx) {
  ctx.fillStyle = 'rgba(10,8,18,0.82)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  text(ctx, 'PAUSED', VIEW_W / 2, 360, 64, 900, PALETTE.text);
  text(ctx, 'P to play on  ·  R restart  ·  Esc scene list', VIEW_W / 2, 410, 20, 700, PALETTE.muted);
  text(ctx, 'The pictures hide while paused, so no peeking.', VIEW_W / 2, 446, 16, 600, PALETTE.muted);
}

export function drawStars(ctx, x, y, count) {
  for (let s = 0; s < 3; s++) drawStarShape(ctx, x + s * 20, y, 8, s < count);
}
