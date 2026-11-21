// Lantern Row Night Market: three stalls under a string of paper lanterns on a cobbled lane.

import { circle, ellipse, line, poly, radialGlow, rect, roundRect, star, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const marketScene = {
  id: 'market',
  name: 'Lantern Row Market',
  set: 1,
  differences: [
    { id: 'lantern', kind: 'colour', x: 262, y: 88, r: 18 },
    { id: 'awning', kind: 'pattern', x: 300, y: 196, r: 30 },
    { id: 'oranges', kind: 'count', x: 118, y: 292, r: 20 },
    { id: 'steam', kind: 'missing', x: 316, y: 246, r: 26 },
    { id: 'newStar', kind: 'added', x: 470, y: 36, r: 12 },
    { id: 'cup', kind: 'moved', x: 359, y: 325, r: 24 },
    { id: 'sign', kind: 'flipped', x: 488, y: 160, r: 22 },
    { id: 'bell', kind: 'size', x: 214, y: 186, r: 16 },
  ],
  draw: drawMarketScene,
};

function drawMarketScene(ctx, has) {
  const rng = createRandom(303);
  rect(ctx, 0, 0, 600, 520, verticalGradient(ctx, 0, 300, [[0, '#0d1238'], [1, '#2b2c6b']]));
  for (let i = 0; i < 70; i++) circle(ctx, rng.range(0, 600), rng.range(0, 150), rng.range(0.5, 1.5), 'rgba(255,255,255,0.7)');
  if (has('newStar')) star(ctx, 470, 36, 5, 2.2, 4, '#fffbe0');
  circle(ctx, 80, 60, 26, '#fff4cf');
  circle(ctx, 92, 52, 24, '#111640');
  drawSkyline(ctx, rng);
  drawLanternString(ctx, has);
  drawCobbles(ctx, rng);
  drawStall(ctx, 18, 190, 176, '#d8463d', '#f4e7cf', 7);
  drawStall(ctx, 212, 190, 176, '#2f8f86', '#f4e7cf', has('awning') ? 6 : 7);
  drawStall(ctx, 406, 190, 176, '#7d4aa8', '#f4e7cf', 7);
  drawFruitStall(ctx, has);
  drawNoodleStall(ctx, has);
  drawTrinketStall(ctx, has);
  drawBell(ctx, 214, 186, has('bell') ? 1.45 : 1);
  drawForeground(ctx);
}

function drawForeground(ctx) {
  ellipse(ctx, 200, 452, 70, 14, 'rgba(120,140,220,0.28)');
  for (const [x, c] of [[160, '#ff5a4f'], [196, '#ffb13b'], [232, '#ffd75e']]) ellipse(ctx, x, 452, 6, 3, c);
  rect(ctx, 438, 410, 54, 40, '#8b5a37');
  rect(ctx, 438, 410, 54, 6, '#a8703f');
  line(ctx, [438, 430, 492, 430], '#6b4128', 2);
  rect(ctx, 500, 424, 44, 26, '#7a4a2a');
  for (let i = 0; i < 4; i++) circle(ctx, 450 + i * 12, 406, 6, '#9dd46a');
  for (let i = 0; i < 3; i++) circle(ctx, 510 + i * 12, 420, 5, '#d93a4a');
  rect(ctx, 566, 300, 6, 160, '#2a2236');
  radialGlow(ctx, 569, 296, 40, 'rgba(255,200,110,0.45)');
  roundRect(ctx, 558, 282, 22, 24, 4, '#ffd27a');
  rect(ctx, 556, 278, 26, 5, '#2a2236');
  ellipse(ctx, 62, 470, 26, 9, '#2a2236');
  ellipse(ctx, 50, 456, 10, 12, '#2a2236');
  poly(ctx, [44, 448, 46, 438, 52, 446], '#2a2236');
  poly(ctx, [54, 446, 58, 438, 60, 448], '#2a2236');
  line(ctx, [86, 470, 100, 458, 96, 448], '#2a2236', 4);
  circle(ctx, 47, 455, 1.6, '#ffe27a');
  circle(ctx, 54, 455, 1.6, '#ffe27a');
}

function drawSkyline(ctx, rng) {
  for (let i = 0; i < 9; i++) {
    const x = i * 70 - 10;
    const h = 80 + rng.range(0, 70);
    rect(ctx, x, 200 - h, 62, h, '#1b1d4a');
    for (let k = 0; k < 6; k++) {
      if (rng.next() < 0.5) rect(ctx, x + 8 + (k % 3) * 18, 210 - h + Math.floor(k / 3) * 22, 8, 10, 'rgba(255,200,110,0.55)');
    }
  }
}

function drawLanternString(ctx, has) {
  const colours = ['#ff5a4f', '#ffb13b', '#ff5a4f', '#ffd75e', '#ff5a4f', '#ffb13b', '#ff5a4f', '#ffd75e'];
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(300, 110, 600, 40);
  ctx.strokeStyle = '#1a1026';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const t = (i + 0.5) / 8;
    const x = t * 600;
    const y = 40 + 2 * t * (1 - t) * 70 + 14;
    let c = colours[i];
    if (i === 3 && has('lantern')) c = '#7fd0ff';
    radialGlow(ctx, x, y, 30, 'rgba(255,170,80,0.35)');
    line(ctx, [x, y - 16, x, y - 10], '#1a1026', 2);
    ellipse(ctx, x, y, 12, 14, c);
    rect(ctx, x - 7, y - 14, 14, 3, '#3a2018');
    rect(ctx, x - 7, y + 12, 14, 3, '#3a2018');
    line(ctx, [x - 6, y, x + 6, y], 'rgba(60,20,10,0.35)', 1);
    line(ctx, [x, y + 15, x, y + 22], '#ffd75e', 1.5);
  }
}

function drawCobbles(ctx, rng) {
  rect(ctx, 0, 360, 600, 160, '#3a3450');
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 16; c++) {
      const x = c * 40 + (r % 2) * 20 + rng.range(-3, 3);
      const y = 372 + r * 22;
      ellipse(ctx, x, y, 17, 8, r % 2 ? '#4a4363' : '#453e5d');
    }
  }
  radialGlow(ctx, 300, 380, 260, 'rgba(255,170,90,0.18)');
}

function drawStall(ctx, x, y, w, stripe, base, stripes) {
  rect(ctx, x + 6, y, 6, 170, '#3a2018');
  rect(ctx, x + w - 12, y, 6, 170, '#3a2018');
  rect(ctx, x, y + 120, w, 50, '#6b4128');
  rect(ctx, x, y + 120, w, 6, '#8b5a37');
  rect(ctx, x + 12, y + 34, w - 24, 86, 'rgba(255,190,110,0.14)');
  const sw = w / stripes;
  for (let i = 0; i < stripes; i++) {
    poly(ctx, [x + i * sw, y - 10, x + (i + 1) * sw, y - 10, x + (i + 1) * sw + 4, y + 22, x + i * sw + 4, y + 22], i % 2 ? base : stripe);
    ctx.beginPath();
    ctx.arc(x + i * sw + sw / 2 + 4, y + 22, sw / 2, 0, Math.PI);
    ctx.fillStyle = i % 2 ? base : stripe;
    ctx.fill();
  }
  rect(ctx, x - 4, y - 16, w + 8, 8, '#3a2018');
}

function drawFruitStall(ctx, has) {
  const rows = [[4, 316], [3, 302], [2, 288]];
  for (const [n, y] of rows) {
    for (let i = 0; i < n; i++) {
      const x = 112 - (n - 1) * 9 + i * 18;
      if (has('oranges') && n === 2 && i === 1) continue;
      circle(ctx, x, y, 9, '#ff9a2e');
      circle(ctx, x - 3, y - 3, 2.5, '#ffd28a');
    }
  }
  for (let i = 0; i < 5; i++) {
    circle(ctx, 46 + i * 11, 316, 7, '#d93a4a');
    line(ctx, [46 + i * 11, 309, 48 + i * 11, 304], '#3f8f4e', 1.5);
  }
  for (let i = 0; i < 3; i++) ellipse(ctx, 160 + i * 6, 312 - i * 4, 12, 5, '#f2d25c', -0.5);
  roundRect(ctx, 54, 236, 70, 30, 6, '#f4e7cf');
  for (const [dx, w] of [[8, 20], [34, 26]]) rect(ctx, 54 + dx, 248, w, 6, '#d8463d');
  line(ctx, [62, 226, 62, 236], '#3a2018', 1.5);
  line(ctx, [116, 226, 116, 236], '#3a2018', 1.5);
}

function drawNoodleStall(ctx, has) {
  roundRect(ctx, 286, 280, 66, 34, 8, '#5a5f6b');
  rect(ctx, 282, 276, 74, 8, '#3d414a');
  radialGlow(ctx, 318, 300, 50, 'rgba(255,120,60,0.3)');
  if (!has('steam')) {
    for (const [dx, dy, s] of [[-6, -18, 10], [8, -34, 12], [-4, -52, 9]]) ellipse(ctx, 318 + dx, 280 + dy, s, s * 0.7, 'rgba(235,235,255,0.5)');
  }
  for (let i = 0; i < 3; i++) {
    roundRect(ctx, 236 + i * 20, 302, 16, 12, 4, '#f4e7cf');
    rect(ctx, 236 + i * 20, 302, 16, 3, '#2f8f86');
  }
  line(ctx, [256, 296, 272, 280], '#c9a06b', 2);
  line(ctx, [260, 296, 278, 282], '#c9a06b', 2);
  const cx = has('cup') ? 342 : 372;
  roundRect(ctx, cx - 7, 318, 14, 14, 3, '#f4e7cf');
  ctx.beginPath();
  ctx.arc(cx + 8, 325, 4, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#f4e7cf';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    circle(ctx, 236 + i * 14, 226, 5, '#ffd75e');
    line(ctx, [236 + i * 14, 212, 236 + i * 14, 221], '#3a2018', 1);
  }
}

function drawTrinketStall(ctx, has) {
  for (let i = 0; i < 4; i++) {
    const x = 432 + i * 34;
    roundRect(ctx, x - 12, 244, 24, 30, 12, ['#e8c36a', '#7fd0ff', '#ff8ab0', '#9dff8a'][i]);
    circle(ctx, x - 5, 256, 3, '#2b2236');
    circle(ctx, x + 5, 256, 3, '#2b2236');
    rect(ctx, x - 5, 265, 10, 2.5, '#2b2236');
    line(ctx, [x, 232, x, 244], '#3a2018', 1.2);
  }
  for (let i = 0; i < 6; i++) circle(ctx, 430 + i * 22, 304, 6, ['#b88cff', '#ffd75e', '#7fd0ff'][i % 3]);
  for (let i = 0; i < 6; i++) circle(ctx, 430 + i * 22, 304, 2, '#ffffff');
  const flip = has('sign') ? -1 : 1;
  roundRect(ctx, 466, 146, 44, 28, 5, '#f4e7cf');
  line(ctx, [474, 134, 474, 146], '#3a2018', 1.5);
  line(ctx, [502, 134, 502, 146], '#3a2018', 1.5);
  poly(ctx, [488 - flip * 12, 152, 488 + flip * 12, 160, 488 - flip * 12, 168], '#7d4aa8');
  circle(ctx, 488 + flip * 14, 160, 3, '#7d4aa8');
}

function drawBell(ctx, x, y, s) {
  line(ctx, [x, y - 16 * s, x, y - 8 * s], '#3a2018', 1.5);
  poly(ctx, [x - 8 * s, y + 6 * s, x - 5 * s, y - 8 * s, x + 5 * s, y - 8 * s, x + 8 * s, y + 6 * s], '#e8b84a');
  circle(ctx, x, y + 7 * s, 2.4 * s, '#a7742a');
}
