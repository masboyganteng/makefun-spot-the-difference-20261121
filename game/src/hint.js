// The hint: a pulsing lens over the area around one unfound difference, never its exact centre.

import { FONT, PALETTE, RULES, SCENE_H, SCENE_W } from './config.js';

const TAU = Math.PI * 2;

function idAngle(id) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 360) * (Math.PI / 180);
}

export function startHint(diff, clock) {
  // Offset the lens centre by a fixed, per-difference angle so the hint narrows the search, not solves it.
  const a = idAngle(diff.id);
  const r = Math.max(58, diff.r * 2.5);
  return {
    diffId: diff.id,
    born: clock,
    x: diff.x + Math.cos(a) * diff.r * 0.7,
    y: diff.y + Math.sin(a) * diff.r * 0.7,
    r,
  };
}

/** Lens strength 0..1: it eases in, holds, then fades out; 0 once the difference is found. */
export function hintStrength(hint, clock, foundIds) {
  if (!hint || foundIds.includes(hint.diffId)) return 0;
  const age = clock - hint.born;
  if (age < 0 || age > RULES.hintSeconds) return 0;
  return Math.min(1, age / 0.25, (RULES.hintSeconds - age) / 0.9);
}

export function drawHintLens(ctx, hint, clock, strength) {
  if (strength <= 0) return;
  const age = clock - hint.born;
  const r = hint.r * (1 + 0.07 * Math.sin(age * 7));
  ctx.save();
  ctx.globalAlpha = strength;
  ctx.beginPath();
  ctx.rect(0, 0, SCENE_W, SCENE_H);
  ctx.arc(hint.x, hint.y, r, 0, TAU, true);
  ctx.fillStyle = 'rgba(6, 10, 26, 0.42)';
  ctx.fill('evenodd');
  ctx.beginPath();
  ctx.arc(hint.x, hint.y, r, 0, TAU);
  ctx.strokeStyle = 'rgba(4, 20, 40, 0.8)';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.strokeStyle = PALETTE.hint;
  ctx.lineWidth = 4;
  ctx.stroke();
  const hx = hint.x + Math.cos(Math.PI / 4) * r;
  const hy = hint.y + Math.sin(Math.PI / 4) * r;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(hx + 30, hy + 30);
  ctx.strokeStyle = 'rgba(4, 20, 40, 0.85)';
  ctx.lineWidth = 15;
  ctx.stroke();
  ctx.strokeStyle = PALETTE.hint;
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.font = `900 15px ${FONT}`;
  ctx.textAlign = 'center';
  const ly = hint.y - r - 12 < 18 ? hint.y + r + 24 : hint.y - r - 12;
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(4, 20, 40, 0.9)';
  ctx.strokeText('SOMETHING HERE', hint.x, ly);
  ctx.fillStyle = PALETTE.hint;
  ctx.fillText('SOMETHING HERE', hint.x, ly);
  ctx.restore();
}
