// Lantern Harbor: a fishing town at sunset, a lighthouse on the cliff and boats in the bay.

import { circle, cloud, ellipse, house, line, poly, radialGlow, rect, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const harborScene = {
  id: 'harbor',
  name: 'Lantern Harbor',
  set: 0,
  differences: [
    { id: 'sailStripe', kind: 'colour', x: 232, y: 306, r: 22 },
    { id: 'railGull', kind: 'missing', x: 492, y: 103, r: 16 },
    { id: 'litWindow', kind: 'colour', x: 53, y: 243, r: 14 },
    { id: 'buoy', kind: 'moved', x: 331, y: 378, r: 24 },
    { id: 'crates', kind: 'count', x: 470, y: 392, r: 28 },
    { id: 'pennant', kind: 'flipped', x: 510, y: 38, r: 22 },
    { id: 'sun', kind: 'size', x: 300, y: 282, r: 36 },
  ],
  draw: drawHarborScene,
};

function drawHarborScene(ctx, has) {
  const rng = createRandom(101);
  rect(ctx, 0, 0, 600, 300, verticalGradient(ctx, 0, 300, [[0, '#2c2a63'], [0.45, '#8f4a86'], [0.8, '#f08a6c'], [1, '#ffc27a']]));
  for (let i = 0; i < 40; i++) circle(ctx, rng.range(0, 600), rng.range(0, 110), rng.range(0.5, 1.4), 'rgba(255,255,255,0.55)');
  radialGlow(ctx, 300, 282, 130, 'rgba(255,210,140,0.6)');
  circle(ctx, 300, 282, has('sun') ? 41 : 32, '#ffe3a1');
  cloud(ctx, 120, 110, 150, 'rgba(255,190,200,0.55)');
  cloud(ctx, 405, 66, 190, 'rgba(255,170,190,0.45)');
  cloud(ctx, 250, 196, 120, 'rgba(255,200,170,0.5)');
  for (const [x, y, s] of [[176, 150, 7], [204, 138, 5], [352, 124, 6], [92, 70, 5]]) {
    line(ctx, [x - s, y - s * 0.6, x, y, x + s, y - s * 0.6], '#2b2240', 1.8);
  }
  poly(ctx, [0, 300, 0, 262, 70, 250, 150, 268, 230, 256, 330, 274, 420, 258, 520, 270, 600, 262, 600, 300], '#5a3d6e');
  drawSea(ctx, rng);
  drawHillTown(ctx, has);
  drawLighthouse(ctx, has);
  drawSailboat(ctx, has);
  drawBuoy(ctx, has('buoy') ? 322 : 340, has('buoy') ? 388 : 384);
  drawRowboat(ctx, 240, 468);
  drawPier(ctx, has, rng);
}

function drawSea(ctx, rng) {
  rect(ctx, 0, 300, 600, 220, verticalGradient(ctx, 300, 520, [[0, '#3a4f86'], [1, '#122247']]));
  for (let i = 0; i < 9; i++) {
    const w = 74 - i * 6 + rng.range(-6, 6);
    rect(ctx, 300 - w / 2 + rng.range(-5, 5), 305 + i * 9, w, 2.5, `rgba(255,214,150,${0.7 - i * 0.06})`);
  }
  for (let i = 0; i < 70; i++) {
    const x = rng.range(0, 600);
    const y = rng.range(318, 515);
    const w = rng.range(6, 16);
    line(ctx, [x - w, y, x, y - 2, x + w, y], 'rgba(170,200,255,0.25)', 1.5);
  }
}

function drawHillTown(ctx, has) {
  poly(ctx, [0, 330, 0, 186, 40, 178, 90, 192, 150, 210, 205, 246, 246, 296, 262, 330], '#3b2c4f');
  house(ctx, 14, 168, 46, 40, { wall: '#e7c9a0', roof: '#a0453f', lit: [0] });
  house(ctx, 68, 178, 40, 34, { wall: '#b9d0d8', roof: '#3f5d8a', lit: [1] });
  house(ctx, 114, 198, 50, 38, { wall: '#f0dcb4', roof: '#7b3f6a', lit: [0, 1] });
  house(ctx, 170, 228, 40, 32, { wall: '#d9a88c', roof: '#45475e' });
  house(ctx, 26, 230, 54, 44, { wall: '#c7b7d9', roof: '#a0453f', cols: 3, lit: has('litWindow') ? [0, 1, 2] : [0, 2] });
  house(ctx, 88, 246, 48, 38, { wall: '#efe2c6', roof: '#3f5d8a', lit: [0] });
  house(ctx, 142, 266, 44, 34, { wall: '#a9c7b1', roof: '#7b3f6a', lit: [1] });
  house(ctx, 194, 284, 34, 28, { wall: '#e9b9a6', roof: '#45475e', lit: [0] });
  for (const [x, y] of [[48, 152], [140, 182]]) {
    rect(ctx, x, y, 7, 14, '#5b4a66');
    ellipse(ctx, x + 6, y - 8, 7, 5, 'rgba(220,210,230,0.45)');
    ellipse(ctx, x + 12, y - 18, 9, 6, 'rgba(220,210,230,0.3)');
  }
  rect(ctx, 0, 322, 266, 14, '#6b5876');
  for (let x = 0; x < 266; x += 22) line(ctx, [x, 322, x, 336], '#54435f', 1.5);
  line(ctx, [0, 329, 266, 329], '#54435f', 1.2);
}

function drawLighthouse(ctx, has) {
  poly(ctx, [492, 92, 320, 52, 320, 140], 'rgba(255,240,180,0.16)');
  poly(ctx, [418, 520, 428, 332, 458, 302, 520, 292, 600, 296, 600, 520], '#3a2b45');
  poly(ctx, [428, 332, 458, 302, 520, 292, 600, 296, 600, 306, 522, 302, 462, 312, 434, 340], '#4f6b4a');
  for (const [x, y, w] of [[450, 360, 40], [500, 400, 60], [462, 450, 50], [540, 340, 40]]) line(ctx, [x, y, x + w, y + 6], '#2c2036', 2);
  const top = 128;
  const bottom = 298;
  const bands = 6;
  for (let i = 0; i < bands; i++) {
    const y0 = top + ((bottom - top) * i) / bands;
    const y1 = top + ((bottom - top) * (i + 1)) / bands;
    const w0 = 19 + (9 * (y0 - top)) / (bottom - top);
    const w1 = 19 + (9 * (y1 - top)) / (bottom - top);
    poly(ctx, [510 - w0, y0, 510 + w0, y0, 510 + w1, y1, 510 - w1, y1], i % 2 ? '#d8463d' : '#f4efe6');
  }
  rect(ctx, 503, 270, 14, 28, '#2b2236');
  for (const y of [170, 222]) rect(ctx, 507, y, 6, 12, '#2b2236');
  radialGlow(ctx, 510, 96, 46, 'rgba(255,236,160,0.7)');
  rect(ctx, 492, 82, 36, 30, '#ffe9a8');
  for (const x of [500, 510, 520]) line(ctx, [x, 82, x, 112], '#6b4b3b', 2);
  poly(ctx, [488, 84, 510, 64, 532, 84], '#2b2236');
  rect(ctx, 482, 112, 56, 6, '#2b2236');
  line(ctx, [484, 104, 536, 104], '#2b2236', 2);
  for (let x = 486; x <= 534; x += 6) line(ctx, [x, 104, x, 112], '#2b2236', 1.4);
  line(ctx, [510, 64, 510, 28], '#2b2236', 2.2);
  const dir = has('pennant') ? -1 : 1;
  poly(ctx, [510, 30, 510 + dir * 28, 37, 510, 44], '#ffcf5a');
  if (!has('railGull')) {
    ellipse(ctx, 492, 99, 8, 5, '#ffffff');
    circle(ctx, 498, 94, 3.6, '#ffffff');
    poly(ctx, [501, 94, 506, 95, 501, 96], '#f29a2e');
    ellipse(ctx, 489, 99, 5, 3, '#9aa3b5');
  }
}

function drawSailboat(ctx, has) {
  poly(ctx, [158, 350, 264, 350, 250, 372, 174, 372], '#5b2f2a');
  rect(ctx, 166, 354, 92, 4, '#e8c36a');
  line(ctx, [211, 350, 211, 230], '#3a2622', 3);
  const sail = [214, 234, 214, 344, 268, 344];
  poly(ctx, sail, '#f6eedf');
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sail[0], sail[1]);
  ctx.lineTo(sail[2], sail[3]);
  ctx.lineTo(sail[4], sail[5]);
  ctx.closePath();
  ctx.clip();
  rect(ctx, 200, 298, 80, 15, has('sailStripe') ? '#3b78d9' : '#d9483b');
  ctx.restore();
  poly(ctx, [208, 244, 208, 344, 166, 344], '#efe3cf');
  line(ctx, [211, 230, 226, 226, 211, 238], '#ffcf5a', 2);
  for (let i = 0; i < 5; i++) rect(ctx, 172 + i * 4, 378 + i * 6, 80 - i * 10, 2.5, 'rgba(90,50,45,0.35)');
}

function drawBuoy(ctx, x, y) {
  poly(ctx, [x - 12, y + 10, x + 12, y + 10, x + 7, y - 14, x - 7, y - 14], '#e0473e');
  rect(ctx, x - 9, y - 4, 18, 5, '#f4efe6');
  line(ctx, [x, y - 14, x, y - 24], '#2b2236', 2);
  circle(ctx, x, y - 26, 4, '#ffe08a');
  ellipse(ctx, x, y + 11, 18, 4, 'rgba(255,255,255,0.25)');
}

function drawRowboat(ctx, x, y) {
  poly(ctx, [x - 44, y, x + 44, y, x + 32, y + 16, x - 32, y + 16], '#8a5a3c');
  rect(ctx, x - 40, y, 80, 4, '#c98f5e');
  line(ctx, [x - 20, y + 2, x - 54, y + 22], '#c9a87a', 3);
  line(ctx, [x + 20, y + 2, x + 54, y + 22], '#c9a87a', 3);
  ellipse(ctx, x, y + 20, 50, 4, 'rgba(255,255,255,0.18)');
}

function drawPier(ctx, has, rng) {
  for (let x = 340; x < 600; x += 38) rect(ctx, x, 444, 9, 80, '#3a2822');
  rect(ctx, 326, 428, 274, 18, '#7a5236');
  for (let x = 330; x < 600; x += 16) line(ctx, [x, 428, x, 446], '#5d3e2a', 1.2);
  line(ctx, [326, 446, 600, 446], '#3a2822', 2);
  line(ctx, [388, 428, 388, 352], '#2b2236', 3.5);
  radialGlow(ctx, 388, 346, 34, 'rgba(255,220,140,0.65)');
  rect(ctx, 381, 338, 14, 14, '#ffe3a1');
  poly(ctx, [378, 338, 388, 330, 398, 338], '#2b2236');
  const bulbs = ['#ff6b6b', '#ffcf5a', '#6bd6ff', '#9dff8a'];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const x = 392 + t * 208;
    const y = 352 + t * 14 + Math.sin(t * Math.PI) * 18;
    if (i < 10) {
      const nx = 392 + (t + 0.1) * 208;
      const ny = 352 + (t + 0.1) * 14 + Math.sin((t + 0.1) * Math.PI) * 18;
      line(ctx, [x, y, nx, ny], '#2b2236', 1.2);
    }
    circle(ctx, x, y + 3, 3, bulbs[i % 4]);
  }
  drawCrate(ctx, 442, 400, 28);
  drawCrate(ctx, 472, 400, 28);
  if (!has('crates')) drawCrate(ctx, 457, 372, 28);
  for (const x of [520, 540]) {
    ellipse(ctx, x, 412, 9, 16, '#8a5a3c');
    line(ctx, [x - 9, 404, x + 9, 404], '#3a2822', 2);
    line(ctx, [x - 9, 420, x + 9, 420], '#3a2822', 2);
  }
  ctx.beginPath();
  ctx.ellipse(574, 422, 14, 6, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#d9c08a';
  ctx.lineWidth = 3;
  ctx.stroke();
  rng.next();
}

function drawCrate(ctx, x, y, s) {
  rect(ctx, x, y, s, s, '#b07a46');
  ctx.strokeStyle = '#6b4526';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
  line(ctx, [x + 2, y + 2, x + s - 2, y + s - 2], '#6b4526', 2);
  line(ctx, [x + s - 2, y + 2, x + 2, y + s - 2], '#6b4526', 2);
}
