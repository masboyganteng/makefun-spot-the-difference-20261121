// Find rings, sparkles, floating points and the miss cross, drawn in scene space.
// Every effect is a function of its birth time and the game clock, so a frozen clock gives a frozen frame.

import { FONT, PALETTE } from './config.js';

const TAU = Math.PI * 2;
const RING_DRAW_SECONDS = 0.38;

export function createEffects() {
  return { list: [] };
}

export function spawnFindEffects(fx, diff, points, combo, clock) {
  for (let i = 0; i < 14; i++) {
    fx.list.push({ type: 'spark', x: diff.x, y: diff.y, angle: (i / 14) * TAU + 0.2, speed: 80 + (i % 3) * 34, born: clock, life: 0.75 });
  }
  fx.list.push({ type: 'float', x: diff.x, y: diff.y - diff.r - 10, text: `+${points}`, sub: combo > 1 ? `x${combo} COMBO` : '', born: clock, life: 1.4 });
}

export function spawnMissEffect(fx, x, y, panel, clock) {
  fx.list.push({ type: 'miss', x, y, panel, born: clock, life: 0.95 });
  fx.list.push({ type: 'float', x, y: y - 26, text: '-5s', sub: '', bad: true, panel, born: clock, life: 1.0 });
}

export function pruneEffects(fx, clock) {
  fx.list = fx.list.filter((e) => clock - e.born < e.life);
}

/** The ring on a found difference: it draws itself round, pops, then stays as a calm mark. */
export function drawFoundMarkers(ctx, hunt, clock) {
  for (const diff of hunt.scene.differences) {
    if (!hunt.found.includes(diff.id)) continue;
    const t = Math.min(1, (clock - hunt.foundAt[diff.id]) / RING_DRAW_SECONDS);
    const pop = 1 + 0.22 * Math.sin(Math.PI * t);
    const r = (diff.r + 4) * pop;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, -Math.PI / 2, -Math.PI / 2 + t * TAU);
    ctx.strokeStyle = 'rgba(10, 30, 20, 0.75)';
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.strokeStyle = PALETTE.found;
    ctx.lineWidth = 4.5;
    ctx.stroke();
    if (t >= 1) drawCheckBadge(ctx, diff.x + r * 0.72, diff.y - r * 0.72);
    ctx.restore();
  }
}

function drawCheckBadge(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, TAU);
  ctx.fillStyle = PALETTE.found;
  ctx.fill();
  ctx.strokeStyle = '#0b2418';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x - 1, y + 3.5);
  ctx.lineTo(x + 4.5, y - 3.5);
  ctx.strokeStyle = '#0b2418';
  ctx.lineWidth = 2.4;
  ctx.stroke();
}

/** After time runs out, every difference left is shown in a dashed red ring. */
export function drawMissedMarkers(ctx, hunt, clock) {
  const age = clock - (hunt.endedClock ?? clock);
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -age * 20;
  for (const diff of hunt.scene.differences) {
    if (hunt.found.includes(diff.id)) continue;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 5, 0, TAU);
    ctx.strokeStyle = 'rgba(30, 0, 6, 0.7)';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = PALETTE.miss;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }
  ctx.restore();
}

/** Sparkles, floating points and miss crosses; a miss shows only in the panel that was clicked. */
export function drawPanelEffects(ctx, fx, clock, panel) {
  for (const e of fx.list) {
    const age = clock - e.born;
    const k = age / e.life;
    if (k < 0 || k > 1) continue;
    if (e.panel !== undefined && e.panel !== panel) continue;
    if (e.type === 'spark') drawSpark(ctx, e, age, k);
    else if (e.type === 'float') drawFloatText(ctx, e, age, k);
    else if (e.type === 'miss') drawMissCross(ctx, e, age, k);
  }
}

function drawSpark(ctx, e, age, k) {
  const d = e.speed * age * (1 - k * 0.5);
  const x = e.x + Math.cos(e.angle) * d;
  const y = e.y + Math.sin(e.angle) * d;
  const s = 5 * (1 - k);
  ctx.save();
  ctx.globalAlpha = 1 - k;
  ctx.fillStyle = k < 0.3 ? '#ffffff' : PALETTE.gold;
  ctx.beginPath();
  ctx.moveTo(x, y - s * 1.8);
  ctx.lineTo(x + s * 0.5, y);
  ctx.lineTo(x, y + s * 1.8);
  ctx.lineTo(x - s * 0.5, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFloatText(ctx, e, age, k) {
  const y = e.y - age * 34;
  ctx.save();
  ctx.globalAlpha = k < 0.75 ? 1 : 1 - (k - 0.75) / 0.25;
  ctx.textAlign = 'center';
  ctx.font = `900 26px ${FONT}`;
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(12, 8, 20, 0.85)';
  ctx.strokeText(e.text, e.x, y);
  ctx.fillStyle = e.bad ? PALETTE.miss : PALETTE.gold;
  ctx.fillText(e.text, e.x, y);
  if (e.sub) {
    ctx.font = `800 14px ${FONT}`;
    ctx.lineWidth = 4;
    ctx.strokeText(e.sub, e.x, y + 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(e.sub, e.x, y + 18);
  }
  ctx.restore();
}

function drawMissCross(ctx, e, age, k) {
  const shake = Math.sin(age * 55) * 7 * Math.max(0, 1 - age * 2.5);
  const x = e.x + shake;
  const s = 14;
  ctx.save();
  ctx.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
  ctx.lineCap = 'round';
  for (const [w, c] of [[10, 'rgba(30,0,6,0.8)'], [5, PALETTE.miss]]) {
    ctx.beginPath();
    ctx.moveTo(x - s, e.y - s);
    ctx.lineTo(x + s, e.y + s);
    ctx.moveTo(x + s, e.y - s);
    ctx.lineTo(x - s, e.y + s);
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.stroke();
  }
  ctx.restore();
}
