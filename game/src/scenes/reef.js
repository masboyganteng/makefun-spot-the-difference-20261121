// Sunken Garden Reef: corals, a sea turtle, a fish shoal and a chest half sunk in the sand.

import { circle, ellipse, line, placed, poly, rect, roundRect, star, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const reefScene = {
  id: 'reef',
  name: 'Sunken Garden Reef',
  set: 2,
  differences: [
    { id: 'fishStripes', kind: 'pattern', x: 196, y: 196, r: 30 },
    { id: 'starfish', kind: 'colour', x: 334, y: 468, r: 18 },
    { id: 'bubbles', kind: 'count', x: 158, y: 256, r: 16 },
    { id: 'kelp', kind: 'size', x: 380, y: 282, r: 22 },
    { id: 'shell', kind: 'flipped', x: 254, y: 488, r: 14 },
    { id: 'latch', kind: 'colour', x: 510, y: 451, r: 12 },
    { id: 'minnow', kind: 'moved', x: 473, y: 133, r: 18 },
    { id: 'branch', kind: 'missing', x: 98, y: 355, r: 16 },
    { id: 'pebble', kind: 'added', x: 430, y: 496, r: 10 },
  ],
  draw: drawReefScene,
};

function drawReefScene(ctx, has) {
  const rng = createRandom(505);
  rect(ctx, 0, 0, 600, 520, verticalGradient(ctx, 0, 520, [[0, '#1d8fb0'], [0.55, '#0f5a82'], [1, '#0a2e52']]));
  for (let i = 0; i < 6; i++) {
    const x = 40 + i * 100 + rng.range(-20, 20);
    poly(ctx, [x, 0, x + 36, 0, x - 40, 420, x - 90, 420], 'rgba(200,245,255,0.07)');
  }
  for (let i = 0; i < 5; i++) ellipse(ctx, rng.range(0, 600), rng.range(320, 400), rng.range(60, 110), rng.range(30, 50), 'rgba(10,50,80,0.55)');
  rect(ctx, 0, 420, 600, 100, verticalGradient(ctx, 420, 520, [[0, '#d9c48f'], [1, '#b89d63']]));
  ctx.beginPath();
  ctx.moveTo(0, 424);
  for (let x = 0; x <= 600; x += 30) ctx.quadraticCurveTo(x + 15, 414 + rng.range(-4, 4), x + 30, 424);
  ctx.lineTo(600, 430);
  ctx.lineTo(0, 430);
  ctx.fillStyle = '#d9c48f';
  ctx.fill();
  for (let i = 0; i < 30; i++) {
    const x = rng.range(0, 600);
    const y = rng.range(440, 515);
    line(ctx, [x - 10, y, x, y - 2, x + 10, y], 'rgba(140,110,60,0.45)', 1.4);
  }
  drawRocks(ctx);
  drawKelp(ctx, has);
  drawBranchCoral(ctx, has);
  drawBrainCoral(ctx, 252, 430);
  drawFanCoral(ctx, 440, 420);
  drawTubeCoral(ctx, 560, 430);
  drawTurtle(ctx, 392, 236);
  drawJelly(ctx, 556, 60);
  drawStripedFish(ctx, 196, 196, has('fishStripes') ? 2 : 3);
  drawShoal(ctx, has);
  drawChest(ctx, has);
  placed(ctx, 334, 468, { rot: 0.2 }, () => star(ctx, 0, 0, 16, 6, 5, has('starfish') ? '#f2606e' : '#f07a3a'));
  placed(ctx, 254, 488, { flip: has('shell') }, () => drawSpiralShell(ctx));
  for (const [x, y, r] of [[80, 494, 6], [120, 500, 4], [460, 500, 5], [560, 492, 7], [300, 506, 4]]) ellipse(ctx, x, y, r * 1.4, r, '#8d7a5a');
  if (has('pebble')) ellipse(ctx, 430, 496, 7, 5, '#8d7a5a');
  const bubbles = has('bubbles') ? 4 : 5;
  for (let i = 0; i < bubbles; i++) {
    const y = 350 - i * 24;
    ctx.beginPath();
    ctx.arc(156 + Math.sin(i * 1.7) * 5, y, 4 + i * 0.8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(220,250,255,0.8)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  for (let i = 0; i < 26; i++) circle(ctx, rng.range(0, 600), rng.range(0, 420), rng.range(0.6, 1.8), 'rgba(220,250,255,0.35)');
}

function drawRocks(ctx) {
  ellipse(ctx, 40, 430, 90, 50, '#2f4f63');
  ellipse(ctx, 560, 426, 80, 46, '#2f4f63');
  ellipse(ctx, 320, 434, 60, 26, '#35586c');
}

function drawKelp(ctx, has) {
  const strands = [[24, 200, '#3f8f5a'], [62, 150, '#4ba366'], [376, has('kelp') ? 166 : 130, '#3f8f5a'], [592, 180, '#4ba366'], [520, 120, '#3f8f5a']];
  for (const [x, h, c] of strands) {
    ctx.beginPath();
    ctx.moveTo(x, 430);
    for (let y = 0; y <= h; y += 10) ctx.lineTo(x + Math.sin(y / 18) * 8, 430 - y);
    ctx.strokeStyle = c;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
    for (let y = 20; y < h; y += 26) ellipse(ctx, x + Math.sin(y / 18) * 8 + 7, 430 - y, 8, 4, c, -0.5);
  }
}

function drawBranchCoral(ctx, has) {
  const c = '#ff7fa6';
  line(ctx, [110, 432, 110, 380], c, 9);
  line(ctx, [110, 400, 84, 370, 80, 340], c, 7);
  line(ctx, [110, 392, 136, 362, 140, 336], c, 7);
  line(ctx, [110, 380, 112, 330], c, 6);
  if (!has('branch')) line(ctx, [84, 370, 104, 352, 108, 340], c, 5);
  for (const [x, y] of [[80, 340], [140, 336], [112, 330]]) circle(ctx, x, y, 4, '#ffc0d2');
}

function drawBrainCoral(ctx, x, y) {
  ellipse(ctx, x, y - 14, 40, 28, '#c9d45a');
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y - 14, 34 - i * 8, 22 - i * 5, 0, Math.PI * 1.05, Math.PI * 1.95);
    ctx.strokeStyle = '#8f9a35';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawFanCoral(ctx, x, y) {
  ctx.strokeStyle = '#a65ad8';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 - 0.9 + (i * 1.8) / 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 70, y + Math.sin(a) * 70);
    ctx.stroke();
  }
  for (let r = 20; r <= 70; r += 12) {
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9);
    ctx.stroke();
  }
}

function drawTubeCoral(ctx, x, y) {
  for (const [dx, h] of [[-16, 40], [0, 56], [16, 34]]) {
    roundRect(ctx, x + dx - 6, y - h, 12, h, 4, '#ff9a3c');
    ellipse(ctx, x + dx, y - h, 6, 3, '#7a3a10');
  }
}

function drawTurtle(ctx, x, y) {
  ellipse(ctx, x - 36, y + 10, 16, 6, '#6fa56a', 0.6);
  ellipse(ctx, x + 30, y - 18, 22, 8, '#6fa56a', -0.7);
  ellipse(ctx, x - 26, y - 16, 14, 6, '#6fa56a', -0.6);
  ellipse(ctx, x, y, 42, 28, '#7a5a36');
  for (const [dx, dy] of [[-14, -8], [8, -10], [-4, 8], [18, 6], [-24, 4]]) ellipse(ctx, x + dx, y + dy, 9, 7, '#9a7445');
  circle(ctx, x + 46, y - 4, 11, '#6fa56a');
  circle(ctx, x + 50, y - 7, 2, '#1d1a26');
}

function drawStripedFish(ctx, x, y, stripes) {
  poly(ctx, [x - 30, y, x - 46, y - 14, x - 46, y + 14], '#ff8a2e');
  ellipse(ctx, x, y, 34, 20, '#ff8a2e');
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, 34, 20, 0, 0, Math.PI * 2);
  ctx.clip();
  const xs = stripes === 3 ? [-16, 2, 20] : [-12, 12];
  for (const dx of xs) rect(ctx, x + dx - 3.5, y - 22, 7, 44, '#fff4e6');
  ctx.restore();
  circle(ctx, x + 22, y - 5, 4, '#ffffff');
  circle(ctx, x + 23, y - 5, 2, '#1d1a26');
}

function drawShoal(ctx, has) {
  const fish = [[420, 100], [446, 112], [472, 98], [440, 134], [496, 120], has('minnow') ? [480, 140] : [466, 126], [512, 104]];
  for (const [x, y] of fish) {
    ellipse(ctx, x, y, 10, 4.5, '#8fd8ff');
    poly(ctx, [x - 9, y, x - 15, y - 5, x - 15, y + 5], '#8fd8ff');
    circle(ctx, x + 6, y - 1, 1.2, '#1d1a26');
  }
}

function drawChest(ctx, has) {
  roundRect(ctx, 474, 438, 74, 40, 4, '#7a4a2a');
  ctx.beginPath();
  ctx.ellipse(511, 440, 37, 16, 0, Math.PI, 0);
  ctx.fillStyle = '#8b5a37';
  ctx.fill();
  for (const dx of [-26, 26]) rect(ctx, 511 + dx - 3, 424, 6, 54, '#4a2e1c');
  roundRect(ctx, 504, 444, 13, 15, 2, has('latch') ? '#c9ced6' : '#e8b84a');
  circle(ctx, 510.5, 451, 2, '#4a2e1c');
  poly(ctx, [462, 478, 560, 478, 552, 486, 470, 486], '#d9c48f');
  for (const [x, y] of [[492, 432], [528, 434]]) circle(ctx, x, y, 3, '#ffd75e');
}

function drawJelly(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 16, Math.PI, 0);
  ctx.fillStyle = 'rgba(255,170,220,0.7)';
  ctx.fill();
  for (let i = 0; i < 5; i++) line(ctx, [x - 12 + i * 6, y, x - 14 + i * 6, y + 16, x - 10 + i * 6, y + 30], 'rgba(255,170,220,0.6)', 1.5);
}

function drawSpiralShell(ctx) {
  ellipse(ctx, 0, 0, 13, 9, '#f1d9c2');
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.2) ctx.lineTo(4 + Math.cos(a) * a * 0.8, Math.sin(a) * a * 0.6);
  ctx.strokeStyle = '#b98a6a';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  poly(ctx, [-12, 2, -20, 6, -12, 7], '#e3c2a6');
}
