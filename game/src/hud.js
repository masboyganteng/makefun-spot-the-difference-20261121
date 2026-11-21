// The frame around the panels: title, the big remaining counter, score, timer bar and footer.

import { FONT, LAYOUT, PALETTE, RULES, SCENE_H, SCENE_W, VIEW_W } from './config.js';
import { KIND_LABELS } from './differences.js';
import { remainingCount } from './hunt.js';
import { PANEL_LABELS, panelOrigin } from './panels.js';

const TAU = Math.PI * 2;

function text(ctx, str, x, y, { size = 16, weight = 700, color = PALETTE.text, align = 'left', base = 'alphabetic' } = {}) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

export function drawLogo(ctx, x, y, size, align = 'left') {
  ctx.save();
  ctx.font = `900 ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  const left = 'MIRROR';
  const right = 'WICK';
  const wl = ctx.measureText(left).width;
  const wr = ctx.measureText(right).width;
  const x0 = align === 'center' ? x - (wl + wr) / 2 : x;
  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.text;
  ctx.fillText(left, x0, y);
  ctx.fillStyle = PALETTE.gold;
  ctx.fillText(right, x0 + wl, y);
  ctx.restore();
}

export function drawHeader(ctx, hunt, meta) {
  const g = ctx.createLinearGradient(0, 0, 0, LAYOUT.headerH);
  g.addColorStop(0, '#231d38');
  g.addColorStop(1, PALETTE.ink);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, LAYOUT.headerH);
  drawLogo(ctx, 26, 44, 32);
  text(ctx, `SET ${meta.setNumber} · ${meta.setName.toUpperCase()}  ·  SCENE ${meta.sceneNumber}`, 28, 68, { size: 13, weight: 800, color: meta.tint });
  text(ctx, meta.sceneName, 28, 86, { size: 15, weight: 600, color: PALETTE.muted });
  drawRemainingCounter(ctx, VIEW_W / 2, hunt);
  drawScore(ctx, VIEW_W - 26, hunt);
}

/** The big "3 LEFT" with one pip per difference: filled with a tick when found, hollow while hiding. */
export function drawRemainingCounter(ctx, cx, hunt) {
  const left = remainingCount(hunt);
  const total = hunt.scene.differences.length;
  ctx.save();
  ctx.font = `900 54px ${FONT}`;
  const numW = ctx.measureText(String(left)).width;
  ctx.font = `900 24px ${FONT}`;
  const word = 'LEFT TO FIND';
  const wordW = ctx.measureText(word).width;
  const x0 = cx - (numW + 10 + wordW) / 2;
  const color = left === 0 ? PALETTE.found : PALETTE.gold;
  text(ctx, String(left), x0, 56, { size: 54, weight: 900, color });
  text(ctx, word, x0 + numW + 10, 50, { size: 24, weight: 900, color: PALETTE.text });
  const gap = 22;
  const px0 = cx - ((total - 1) * gap) / 2;
  for (let i = 0; i < total; i++) {
    const done = i < hunt.found.length;
    const x = px0 + i * gap;
    ctx.beginPath();
    ctx.arc(x, 76, 7.5, 0, TAU);
    if (done) {
      ctx.fillStyle = PALETTE.found;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 3.5, 76);
      ctx.lineTo(x - 1, 79);
      ctx.lineTo(x + 4, 73);
      ctx.strokeStyle = '#0b2418';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    } else {
      ctx.strokeStyle = PALETTE.muted;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawScore(ctx, right, hunt) {
  text(ctx, 'SCORE', right, 30, { size: 13, weight: 800, color: PALETTE.muted, align: 'right' });
  text(ctx, hunt.score.toLocaleString('en-US'), right, 66, { size: 36, weight: 900, color: PALETTE.text, align: 'right' });
  if (hunt.combo > 1 && !hunt.outcome) {
    const label = `x${hunt.combo} COMBO`;
    ctx.font = `900 14px ${FONT}`;
    const w = ctx.measureText(label).width + 18;
    ctx.beginPath();
    ctx.roundRect(right - w, 72, w, 20, 10);
    ctx.fillStyle = PALETTE.gold;
    ctx.fill();
    text(ctx, label, right - w / 2, 87, { size: 14, weight: 900, color: PALETTE.ink, align: 'center' });
  }
}

function timerColor(share) {
  if (share > 0.5) return '#43e08c';
  if (share > 0.25) return '#ffc93d';
  return PALETTE.danger;
}

/** The draining timer bar; under the low-time mark it turns red and throbs. */
export function drawTimerBar(ctx, hunt) {
  const x = LAYOUT.leftX;
  const w = VIEW_W - LAYOUT.leftX * 2;
  const y = LAYOUT.timerY;
  const h = LAYOUT.timerH;
  const share = hunt.timeLeft / hunt.timeTotal;
  const low = hunt.timeLeft <= RULES.lowTimeSeconds && !hunt.outcome;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = '#2b2442';
  ctx.fill();
  if (share > 0) {
    const throb = low ? 0.55 + 0.45 * Math.abs(Math.sin(hunt.clock * 6)) : 1;
    ctx.globalAlpha = throb;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(h, w * share), h, h / 2);
    ctx.fillStyle = timerColor(share);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 3, Math.max(0, w * share - 12), 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  ctx.restore();
  const secs = Math.ceil(hunt.timeLeft);
  const label = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  ctx.save();
  ctx.font = `900 13px ${FONT}`;
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(10,8,18,0.8)';
  ctx.textAlign = 'right';
  ctx.strokeText(label, x + Math.max(44, w * share) - 8, y + 12.5);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, x + Math.max(44, w * share) - 8, y + 12.5);
  ctx.restore();
}

/** The frame and the corner label of each panel. */
export function drawPanelFrames(ctx) {
  for (let i = 0; i < 2; i++) {
    const o = panelOrigin(i);
    ctx.save();
    ctx.strokeStyle = PALETTE.edge;
    ctx.lineWidth = 4;
    ctx.strokeRect(o.x - 2, o.y - 2, SCENE_W + 4, SCENE_H + 4);
    ctx.font = `900 13px ${FONT}`;
    const w = ctx.measureText(PANEL_LABELS[i]).width + 20;
    ctx.beginPath();
    ctx.roundRect(o.x + 10, o.y + 10, w, 24, 12);
    ctx.fillStyle = i === 0 ? 'rgba(21,18,31,0.82)' : 'rgba(255,207,90,0.92)';
    ctx.fill();
    text(ctx, PANEL_LABELS[i], o.x + 10 + w / 2, o.y + 27, { size: 13, weight: 900, color: i === 0 ? PALETTE.text : PALETTE.ink, align: 'center' });
    ctx.restore();
  }
}

/** Hint button with its charges, the hunt's numbers, the keys, and one chip per difference. */
export function drawFooter(ctx, hunt, { muted }) {
  const y = LAYOUT.footerY;
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(0, y - 6, VIEW_W, 800 - y + 6);
  drawHintButton(ctx, 24, y + 10, hunt);
  const stats = [
    ['FOUND', `${hunt.found.length}/${hunt.scene.differences.length}`, PALETTE.found],
    ['MISSES', String(hunt.misses), hunt.misses ? PALETTE.miss : PALETTE.text],
    ['COMBO', `x${hunt.combo}`, PALETTE.gold],
  ];
  stats.forEach(([label, value, color], i) => {
    const sx = 330 + i * 122;
    ctx.beginPath();
    ctx.roundRect(sx, y + 10, 110, 58, 12);
    ctx.fillStyle = PALETTE.inkSoft;
    ctx.fill();
    text(ctx, label, sx + 55, y + 30, { size: 11, weight: 800, color: PALETTE.muted, align: 'center' });
    text(ctx, value, sx + 55, y + 58, { size: 24, weight: 900, color, align: 'center' });
  });
  const keys = [
    'CLICK either picture where they differ',
    'ARROWS + SPACE aim and mark   ·   H hint',
    `P pause  ·  R restart  ·  M sound ${muted ? 'off' : 'on'}`,
  ];
  keys.forEach((k, i) => text(ctx, k, VIEW_W - 26, y + 26 + i * 20, { size: 13, weight: 700, color: i === 0 ? PALETTE.text : PALETTE.muted, align: 'right' }));
  drawDifferenceChips(ctx, hunt, y + 84);
}

function drawHintButton(ctx, x, y, hunt) {
  const ready = hunt.hints > 0 && !hunt.outcome;
  ctx.beginPath();
  ctx.roundRect(x, y, 290, 58, 14);
  ctx.fillStyle = ready ? '#16324a' : PALETTE.inkSoft;
  ctx.fill();
  ctx.strokeStyle = ready ? PALETTE.hint : PALETTE.edge;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x + 12, y + 13, 32, 32, 8);
  ctx.fillStyle = ready ? PALETTE.hint : PALETTE.edge;
  ctx.fill();
  text(ctx, 'H', x + 28, y + 36, { size: 20, weight: 900, color: PALETTE.ink, align: 'center' });
  text(ctx, 'HINT', x + 56, y + 36, { size: 20, weight: 900, color: ready ? PALETTE.text : PALETTE.muted });
  for (let i = 0; i < hunt.set.hints; i++) {
    const lx = x + 140 + i * 44;
    const full = i < hunt.hints;
    ctx.beginPath();
    ctx.arc(lx, y + 27, 11, 0, TAU);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = full ? PALETTE.hint : PALETTE.edge;
    ctx.stroke();
    if (full) {
      ctx.fillStyle = 'rgba(127,216,255,0.25)';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(lx + 8, y + 35);
    ctx.lineTo(lx + 15, y + 42);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

/** One chip per difference: its kind once found, a question mark while it hides. */
function drawDifferenceChips(ctx, hunt, y) {
  const diffs = hunt.scene.differences;
  const gap = 8;
  const w = Math.min(130, (VIEW_W - 48 - gap * (diffs.length - 1)) / diffs.length);
  const x0 = (VIEW_W - (w * diffs.length + gap * (diffs.length - 1))) / 2;
  const order = [...hunt.found, ...diffs.filter((d) => !hunt.found.includes(d.id)).map((d) => d.id)];
  order.forEach((id, i) => {
    const diff = diffs.find((d) => d.id === id);
    const done = hunt.found.includes(id);
    const missed = hunt.outcome === 'timeup' && !done;
    const x = x0 + i * (w + gap);
    ctx.beginPath();
    ctx.roundRect(x, y, w, 30, 15);
    ctx.fillStyle = done ? 'rgba(62,240,160,0.16)' : missed ? 'rgba(255,77,94,0.16)' : PALETTE.inkSoft;
    ctx.fill();
    ctx.strokeStyle = done ? PALETTE.found : missed ? PALETTE.miss : PALETTE.edge;
    ctx.lineWidth = 2;
    ctx.stroke();
    const label = done || missed ? KIND_LABELS[diff.kind].toUpperCase() : '? ? ?';
    text(ctx, label, x + w / 2, y + 20, { size: 13, weight: 900, color: done ? PALETTE.found : missed ? PALETTE.miss : PALETTE.muted, align: 'center' });
  });
}
