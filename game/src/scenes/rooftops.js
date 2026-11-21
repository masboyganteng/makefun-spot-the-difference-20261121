// Snowfall Rooftops: a winter village at dusk, smoking chimneys, a snowman and a lit fir.

import { circle, ellipse, line, placed, poly, radialGlow, rect, roundRect, star, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const rooftopsScene = {
  id: 'rooftops',
  name: 'Snowfall Rooftops',
  set: 1,
  differences: [
    { id: 'smoke', kind: 'missing', x: 168, y: 150, r: 22 },
    { id: 'scarf', kind: 'colour', x: 114, y: 421, r: 16 },
    { id: 'icicles', kind: 'count', x: 194, y: 263, r: 13 },
    { id: 'cat', kind: 'moved', x: 355, y: 234, r: 24 },
    { id: 'treeStar', kind: 'size', x: 520, y: 330, r: 16 },
    { id: 'vane', kind: 'flipped', x: 500, y: 132, r: 20 },
    { id: 'attic', kind: 'pattern', x: 310, y: 240, r: 15 },
    { id: 'wreath', kind: 'added', x: 470, y: 336, r: 14 },
  ],
  draw: drawRooftopsScene,
};

function drawRooftopsScene(ctx, has) {
  const rng = createRandom(404);
  rect(ctx, 0, 0, 600, 520, verticalGradient(ctx, 0, 330, [[0, '#18204a'], [1, '#5a5f9e']]));
  for (let i = 0; i < 50; i++) circle(ctx, rng.range(0, 600), rng.range(0, 160), rng.range(0.5, 1.4), 'rgba(255,255,255,0.75)');
  radialGlow(ctx, 470, 70, 80, 'rgba(220,230,255,0.4)');
  circle(ctx, 470, 70, 28, '#f1f3ff');
  for (const [x, y, r] of [[462, 62, 5], [478, 78, 4], [470, 84, 3]]) circle(ctx, x, y, r, 'rgba(180,190,220,0.6)');
  drawFarRoofs(ctx, rng);
  drawHouseA(ctx, has);
  drawHouseB(ctx, has);
  drawHouseC(ctx, has);
  drawLights(ctx);
  rect(ctx, 0, 400, 600, 120, verticalGradient(ctx, 400, 520, [[0, '#dfe6fb'], [1, '#b9c4ea']]));
  for (let x = 0; x < 600; x += 18) {
    rect(ctx, x, 384, 6, 30, '#6b4f3f');
    ellipse(ctx, x + 3, 384, 5, 3, '#ffffff');
  }
  rect(ctx, 0, 392, 600, 4, '#6b4f3f');
  drawSnowman(ctx, has);
  drawFir(ctx, has);
  drawSled(ctx, 300, 470);
  for (let i = 0; i < 90; i++) circle(ctx, rng.range(0, 600), rng.range(0, 520), rng.range(0.8, 2.4), 'rgba(255,255,255,0.8)');
}

function drawSled(ctx, x, y) {
  roundRect(ctx, x - 40, y - 12, 80, 12, 4, '#b8412f');
  for (const dx of [-26, 26]) line(ctx, [x + dx, y, x + dx, y + 10], '#4a3a2e', 3);
  line(ctx, [x - 46, y + 10, x + 40, y + 10, x + 50, y + 2], '#4a3a2e', 3);
  for (let i = 0; i < 6; i++) circle(ctx, x - 70 - i * 22, y + 20 + (i % 2) * 4, 3, 'rgba(150,160,200,0.6)');
}

function drawFarRoofs(ctx, rng) {
  for (let i = 0; i < 8; i++) {
    const x = i * 80 - 20;
    const top = 210 + rng.range(-20, 20);
    poly(ctx, [x, 330, x, top + 30, x + 40, top, x + 80, top + 30, x + 80, 330], '#3a4078');
    poly(ctx, [x - 2, top + 32, x + 40, top, x + 82, top + 32, x + 70, top + 26, x + 40, top + 8, x + 10, top + 26], '#c9d2f2');
    if (rng.next() < 0.7) rect(ctx, x + 32, top + 44, 12, 12, 'rgba(255,200,110,0.6)');
  }
}

function snowRoof(ctx, x0, x1, apexX, apexY, eaveY, roof) {
  poly(ctx, [x0 - 10, eaveY, apexX, apexY, x1 + 10, eaveY], roof);
  poly(ctx, [x0 - 12, eaveY + 2, apexX, apexY - 6, x1 + 12, eaveY + 2, x1 + 4, eaveY - 6, apexX, apexY + 10, x0 - 4, eaveY - 6], '#f4f7ff');
}

function windowLit(ctx, x, y, w, h) {
  radialGlow(ctx, x + w / 2, y + h / 2, w * 1.4, 'rgba(255,190,90,0.35)');
  rect(ctx, x, y, w, h, '#ffd27a');
  line(ctx, [x + w / 2, y, x + w / 2, y + h], '#6b4f3f', 2);
  line(ctx, [x, y + h / 2, x + w, y + h / 2], '#6b4f3f', 2);
  rect(ctx, x - 3, y + h, w + 6, 4, '#f4f7ff');
}

function drawHouseA(ctx, has) {
  rect(ctx, 150, 180, 26, 50, '#7a4a3c');
  rect(ctx, 146, 176, 34, 8, '#f4f7ff');
  if (!has('smoke')) {
    for (const [dx, dy, r] of [[2, -10, 8], [10, -24, 10], [4, -40, 12]]) ellipse(ctx, 163 + dx, 176 + dy, r, r * 0.75, 'rgba(220,225,240,0.55)');
  }
  rect(ctx, 30, 252, 180, 150, '#c56b52');
  for (let y = 262; y < 400; y += 14) line(ctx, [30, y, 210, y], 'rgba(90,40,30,0.25)', 1);
  snowRoof(ctx, 30, 210, 120, 170, 254, '#5b3a52');
  const icicles = has('icicles') ? 5 : 6;
  for (let i = 0; i < icicles; i++) poly(ctx, [100 + i * 18, 256, 108 + i * 18, 256, 104 + i * 18, 270 + (i % 2) * 6], '#e8f4ff');
  windowLit(ctx, 52, 290, 34, 40);
  windowLit(ctx, 150, 290, 34, 40);
  rect(ctx, 104, 330, 30, 70, '#3d2a2a');
  circle(ctx, 128, 366, 2.5, '#ffd27a');
}

function drawHouseB(ctx, has) {
  rect(ctx, 230, 270, 160, 132, '#e1c79a');
  snowRoof(ctx, 230, 390, 310, 196, 272, '#3c5a7a');
  circle(ctx, 310, 240, 13, '#ffd27a');
  ctx.strokeStyle = '#4a3a2e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(310, 240, 13, 0, Math.PI * 2);
  if (has('attic')) {
    for (const dy of [-5, 0, 5]) {
      ctx.moveTo(298, 240 + dy);
      ctx.lineTo(322, 240 + dy);
    }
  } else {
    ctx.moveTo(310, 227);
    ctx.lineTo(310, 253);
    ctx.moveTo(297, 240);
    ctx.lineTo(323, 240);
  }
  ctx.stroke();
  windowLit(ctx, 250, 300, 30, 36);
  windowLit(ctx, 340, 300, 30, 36);
  rect(ctx, 292, 340, 36, 62, '#5b3a2e');
  rect(ctx, 288, 334, 44, 6, '#f4f7ff');
  const [cx, cy] = has('cat') ? [344, 244] : [366, 224];
  ellipse(ctx, cx, cy, 10, 7, '#1d1a26');
  circle(ctx, cx - 8, cy - 6, 6, '#1d1a26');
  poly(ctx, [cx - 13, cy - 9, cx - 12, cy - 16, cx - 8, cy - 11], '#1d1a26');
  poly(ctx, [cx - 6, cy - 11, cx - 3, cy - 16, cx - 3, cy - 8], '#1d1a26');
  circle(ctx, cx - 10, cy - 7, 1.4, '#ffe27a');
  circle(ctx, cx - 6, cy - 7, 1.4, '#ffe27a');
  line(ctx, [cx + 9, cy, cx + 16, cy - 10, cx + 13, cy - 16], '#1d1a26', 3);
}

function drawHouseC(ctx, has) {
  rect(ctx, 410, 240, 180, 162, '#8fa6c9');
  for (let x = 420; x < 590; x += 16) line(ctx, [x, 246, x, 400], 'rgba(40,50,90,0.2)', 1);
  snowRoof(ctx, 410, 590, 500, 160, 242, '#6a3d5e');
  line(ctx, [500, 160, 500, 124], '#2b2236', 2);
  const f = has('vane') ? -1 : 1;
  poly(ctx, [500 - f * 14, 128, 500 + f * 10, 128, 500 + f * 16, 132, 500 + f * 10, 136, 500 - f * 14, 136, 500 - f * 10, 132], '#2b2236');
  line(ctx, [494, 140, 506, 140], '#2b2236', 1.5);
  windowLit(ctx, 426, 270, 32, 40);
  windowLit(ctx, 540, 270, 32, 40);
  rect(ctx, 452, 320, 36, 82, '#3a3058');
  rect(ctx, 448, 314, 44, 6, '#f4f7ff');
  if (has('wreath')) {
    ctx.beginPath();
    ctx.arc(470, 336, 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#2f7a43';
    ctx.lineWidth = 5;
    ctx.stroke();
    circle(ctx, 470, 345, 2.5, '#d8342e');
  }
  roundRect(ctx, 520, 340, 50, 34, 4, '#6b4f3f');
  for (let i = 0; i < 3; i++) rect(ctx, 524 + i * 15, 344, 12, 26, '#ffd27a');
}

function drawLights(ctx) {
  const bulbs = ['#ff6b6b', '#ffd75e', '#7fd0ff', '#9dff8a'];
  for (const [x0, y0, x1, y1] of [[210, 254, 390, 272], [390, 272, 590, 242]]) {
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * 16;
      circle(ctx, x, y + 3, 3, bulbs[i % 4]);
      radialGlow(ctx, x, y + 3, 8, 'rgba(255,220,150,0.35)');
    }
  }
}

function drawSnowman(ctx, has) {
  circle(ctx, 112, 470, 30, '#f7f9ff');
  circle(ctx, 112, 430, 22, '#f7f9ff');
  circle(ctx, 112, 398, 16, '#f7f9ff');
  for (const dy of [424, 436, 448]) circle(ctx, 112, dy + 10, 2.5, '#2b2236');
  circle(ctx, 106, 394, 2, '#2b2236');
  circle(ctx, 118, 394, 2, '#2b2236');
  poly(ctx, [112, 398, 126, 401, 112, 403], '#f08a2e');
  const scarf = has('scarf') ? '#3f9f5e' : '#d8342e';
  roundRect(ctx, 96, 410, 32, 8, 4, scarf);
  rect(ctx, 118, 414, 8, 22, scarf);
  rect(ctx, 100, 376, 24, 8, '#2b2236');
  rect(ctx, 104, 360, 16, 18, '#2b2236');
  line(ctx, [90, 430, 64, 412], '#6b4f3f', 3);
  line(ctx, [134, 430, 160, 414], '#6b4f3f', 3);
}

function drawFir(ctx, has) {
  rect(ctx, 514, 450, 12, 26, '#5a3d2e');
  for (let i = 0; i < 4; i++) {
    const y = 344 + i * 28;
    const w = 26 + i * 14;
    poly(ctx, [520, y - 10, 520 + w, y + 30, 520 - w, y + 30], i % 2 ? '#2f6a4a' : '#357a52');
    poly(ctx, [520 - w + 6, y + 30, 520 + w - 6, y + 30, 520 + w - 14, y + 25, 520 - w + 14, y + 25], '#f4f7ff');
  }
  const ornaments = [[506, 380, '#ff6b6b'], [534, 400, '#ffd75e'], [498, 424, '#7fd0ff'], [540, 440, '#ff6b6b'], [516, 452, '#9dff8a']];
  for (const [x, y, c] of ornaments) circle(ctx, x, y, 4, c);
  const s = has('treeStar') ? 1.5 : 1;
  radialGlow(ctx, 520, 330, 22 * s, 'rgba(255,230,120,0.5)');
  placed(ctx, 520, 330, { scale: s }, () => star(ctx, 0, 0, 10, 4.5, 5, '#ffd75e'));
}
