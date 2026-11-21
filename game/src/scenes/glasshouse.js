// Sunroom Glasshouse: a greenhouse at noon, shelves of pots, hanging baskets and a sleeping cat.

import { circle, ellipse, line, placed, poly, rect, roundRect, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const glasshouseScene = {
  id: 'glasshouse',
  name: 'Sunroom Glasshouse',
  set: 0,
  differences: [
    { id: 'tulip', kind: 'colour', x: 352, y: 205, r: 18 },
    { id: 'butterfly', kind: 'missing', x: 500, y: 190, r: 18 },
    { id: 'wateringCan', kind: 'flipped', x: 252, y: 392, r: 30 },
    { id: 'potPattern', kind: 'pattern', x: 290, y: 240, r: 16 },
    { id: 'vines', kind: 'count', x: 404, y: 125, r: 32 },
    { id: 'yarn', kind: 'moved', x: 418, y: 489, r: 26 },
    { id: 'ladybug', kind: 'added', x: 104, y: 246, r: 14 },
  ],
  draw: drawGlasshouseScene,
};

function drawGlasshouseScene(ctx, has) {
  const rng = createRandom(202);
  rect(ctx, 0, 0, 600, 420, verticalGradient(ctx, 0, 420, [[0, '#a9dcec'], [0.6, '#dff1e4'], [1, '#f3f6e4']]));
  for (let i = 0; i < 14; i++) ellipse(ctx, rng.range(-20, 620), rng.range(250, 330), rng.range(30, 70), rng.range(26, 50), 'rgba(110,170,120,0.35)');
  drawGlassFrame(ctx);
  drawFloor(ctx);
  for (let i = 0; i < 5; i++) poly(ctx, [120 + i * 90, 0, 170 + i * 90, 0, 60 + i * 90, 420, 20 + i * 90, 420], 'rgba(255,255,230,0.12)');
  drawShelves(ctx, has, rng);
  drawPalm(ctx, has);
  drawMonstera(ctx);
  drawHangingBasket(ctx, 228, 3);
  drawHangingBasket(ctx, 404, has('vines') ? 2 : 3);
  drawBench(ctx, has);
  drawCat(ctx, 318, 478);
  drawYarn(ctx, has('yarn') ? 404 : 432, has('yarn') ? 492 : 486);
  if (!has('butterfly')) drawButterfly(ctx, 500, 190);
  drawFloorPots(ctx);
}

function drawFloorPots(ctx) {
  pot(ctx, 150, 470, 34, 26, '#b85f3c');
  for (let i = 0; i < 5; i++) placed(ctx, 150, 466, { rot: -1 + i * 0.5 }, () => ellipse(ctx, 0, -12, 4, 12, '#4c9a5a'));
  circle(ctx, 140, 452, 3.5, '#ffd75e');
  circle(ctx, 160, 450, 3.5, '#ffd75e');
  roundRect(ctx, 470, 470, 30, 22, 4, '#7a5a36');
  ellipse(ctx, 485, 470, 15, 4, '#4a3420');
  for (let i = 0; i < 3; i++) line(ctx, [478 + i * 7, 470, 476 + i * 8, 456], '#6e4a2d', 1.5);
}

function drawGlassFrame(ctx) {
  for (let x = 0; x <= 600; x += 75) rect(ctx, x - 3, 0, 6, 420, '#f4f7f2');
  for (const y of [120, 250]) rect(ctx, 0, y - 3, 600, 6, '#f4f7f2');
  ctx.strokeStyle = '#f4f7f2';
  ctx.lineWidth = 5;
  for (let x = 0; x < 600; x += 150) {
    ctx.beginPath();
    ctx.arc(x + 75, 120, 75, Math.PI, 0);
    ctx.stroke();
  }
  rect(ctx, 0, 0, 600, 8, '#dfe6e0');
}

function drawFloor(ctx) {
  rect(ctx, 0, 420, 600, 100, '#c97b55');
  for (let y = 430; y < 520; y += 22) line(ctx, [0, y, 600, y], '#a9603f', 1.5);
  for (let x = -100; x < 700; x += 50) line(ctx, [x, 420, x + (x - 300) * 0.3, 520], '#a9603f', 1.5);
  rect(ctx, 0, 416, 600, 6, '#8d6a52');
}

function pot(ctx, x, y, w, h, color, rim = '#a45535') {
  poly(ctx, [x - w / 2, y, x + w / 2, y, x + w * 0.38, y + h, x - w * 0.38, y + h], color);
  rect(ctx, x - w / 2 - 2, y - 5, w + 4, 7, rim);
}

function drawShelves(ctx, has, rng) {
  for (const y of [250, 342]) {
    rect(ctx, 136, y, 330, 10, '#9b6b43');
    rect(ctx, 136, y + 10, 330, 3, '#6e4a2d');
  }
  rect(ctx, 146, 250, 8, 170, '#6e4a2d');
  rect(ctx, 448, 250, 8, 170, '#6e4a2d');
  // Top shelf, left to right: fern, cactus, patterned pot, tulip, succulent.
  for (let i = 0; i < 6; i++) placed(ctx, 172, 228, { rot: -1.2 + i * 0.48 }, () => ellipse(ctx, 0, -18, 5, 20, '#3f8f4e'));
  pot(ctx, 172, 230, 30, 20, '#c46a43');
  roundRect(ctx, 222, 190, 16, 40, 8, '#4c9a5a');
  roundRect(ctx, 210, 204, 10, 18, 5, '#4c9a5a');
  roundRect(ctx, 240, 198, 10, 16, 5, '#4c9a5a');
  for (let i = 0; i < 6; i++) circle(ctx, 226 + rng.range(-6, 6), 196 + i * 5, 1.2, '#f1f1d0');
  circle(ctx, 230, 188, 4, '#ff7aa8');
  pot(ctx, 230, 230, 30, 20, '#d98a5c');
  for (let i = 0; i < 5; i++) placed(ctx, 290, 226, { rot: -0.9 + i * 0.45 }, () => ellipse(ctx, 0, -12, 4, 13, '#5aa860'));
  pot(ctx, 290, 230, 32, 20, '#eae2cf', '#b9ac90');
  if (has('potPattern')) {
    for (const dx of [-9, 0, 9]) for (const dy of [5, 13]) circle(ctx, 290 + dx, 230 + dy, 2.2, '#3f7fb5');
  } else {
    for (const dy of [5, 11, 17]) rect(ctx, 277 + dy * 0.2, 230 + dy - 1, 26 - dy * 0.4, 2.6, '#3f7fb5');
  }
  line(ctx, [352, 230, 352, 204], '#3f8f4e', 2.5);
  ellipse(ctx, 346, 220, 4, 9, '#4c9a5a', -0.5);
  const petal = has('tulip') ? '#9b5ad8' : '#e2484f';
  ellipse(ctx, 347, 200, 5, 9, petal, -0.3);
  ellipse(ctx, 357, 200, 5, 9, petal, 0.3);
  ellipse(ctx, 352, 198, 5, 10, petal);
  pot(ctx, 352, 230, 28, 20, '#c46a43');
  for (let i = 0; i < 7; i++) placed(ctx, 412, 222, { rot: (i / 7) * Math.PI * 2 }, () => ellipse(ctx, 0, -8, 4, 8, '#7fb98a'));
  pot(ctx, 412, 230, 28, 20, '#8fb4c9', '#6a8ea3');
  // Lower shelf: seed boxes, a radio and seedlings.
  for (let i = 0; i < 4; i++) {
    rect(ctx, 166 + i * 34, 318, 28, 24, ['#e8c36a', '#d9a3c8', '#9fd1e6', '#c9e29a'][i]);
    for (let s = 0; s < 3; s++) ellipse(ctx, 172 + i * 34 + s * 8, 314, 2.5, 5, '#3f8f4e');
  }
  roundRect(ctx, 318, 304, 60, 38, 6, '#c7503f');
  circle(ctx, 334, 323, 10, '#3b2b27');
  for (let i = 0; i < 4; i++) rect(ctx, 352, 310 + i * 7, 18, 3, '#f1e3cf');
  line(ctx, [372, 304, 384, 282], '#3b2b27', 2);
  pot(ctx, 420, 318, 36, 24, '#c46a43');
  for (let i = 0; i < 4; i++) placed(ctx, 420, 314, { rot: -0.8 + i * 0.55 }, () => ellipse(ctx, 0, -16, 6, 17, '#2f7a43'));
}

function drawPalm(ctx, has) {
  pot(ctx, 70, 430, 74, 50, '#b85f3c');
  line(ctx, [70, 432, 66, 330, 74, 250], '#7a5a36', 9);
  for (let i = 0; i < 9; i++) {
    const a = -2.9 + i * 0.36;
    placed(ctx, 74, 250, { rot: a + Math.PI / 2 }, () => {
      ellipse(ctx, 0, -46, 11, 48, i % 2 ? '#2f8a4c' : '#3fa05a');
      line(ctx, [0, -2, 0, -90], '#256b3b', 1.5);
    });
  }
  if (has('ladybug')) {
    circle(ctx, 104, 246, 5.5, '#d8342e');
    circle(ctx, 108, 243, 2.6, '#1d1d1d');
    line(ctx, [100.5, 246, 106, 246], '#1d1d1d', 1);
    circle(ctx, 102, 248, 1, '#1d1d1d');
  }
}

function drawMonstera(ctx) {
  pot(ctx, 534, 432, 70, 46, '#e9e2d0', '#bfb59c');
  for (const [a, len] of [[-0.6, 140], [-0.15, 170], [0.35, 150], [0.8, 110], [-1.0, 100]]) {
    placed(ctx, 534, 430, { rot: a }, () => {
      line(ctx, [0, 0, 0, -len], '#2f7a43', 3);
      ellipse(ctx, 0, -len, 32, 26, '#2e8b4a');
      for (const dx of [-14, 14]) ellipse(ctx, dx, -len + 4, 6, 3, '#dff1e4');
      line(ctx, [0, -len + 24, 0, -len - 22], '#256b3b', 1.5);
    });
  }
}

function drawHangingBasket(ctx, x, vines) {
  line(ctx, [x, 0, x - 16, 86], '#6e4a2d', 1.5);
  line(ctx, [x, 0, x + 16, 86], '#6e4a2d', 1.5);
  ctx.beginPath();
  ctx.arc(x, 86, 22, 0, Math.PI);
  ctx.fillStyle = '#a7743f';
  ctx.fill();
  for (let i = 0; i < vines; i++) {
    const vx = x - 14 + i * 14;
    const len = 44 + (i % 2) * 22;
    line(ctx, [vx, 92, vx + 3, 92 + len / 2, vx - 2, 92 + len], '#2f7a43', 1.8);
    for (let k = 0; k < 5; k++) ellipse(ctx, vx + (k % 2 ? 4 : -3), 98 + (k * len) / 5, 4, 3, '#3fa05a');
  }
  for (let i = 0; i < 6; i++) ellipse(ctx, x - 18 + i * 7, 84, 6, 5, '#3fa05a');
}

function drawBench(ctx, has) {
  rect(ctx, 186, 418, 240, 10, '#9b6b43');
  rect(ctx, 196, 428, 8, 60, '#6e4a2d');
  rect(ctx, 408, 428, 8, 60, '#6e4a2d');
  placed(ctx, 252, 400, { flip: has('wateringCan') }, () => {
    roundRect(ctx, -18, -14, 36, 32, 6, '#5d9bb5');
    line(ctx, [16, 6, 38, -16], '#5d9bb5', 6);
    rect(ctx, 34, -22, 10, 8, '#4b8199');
    ctx.beginPath();
    ctx.arc(-6, -14, 14, Math.PI, 0);
    ctx.strokeStyle = '#4b8199';
    ctx.lineWidth = 4;
    ctx.stroke();
  });
  line(ctx, [300, 412, 340, 406], '#7a5a36', 4);
  poly(ctx, [338, 400, 356, 404, 340, 412], '#a3a8ad');
  for (let i = 0; i < 3; i++) placed(ctx, 374 + i * 14, 406, { rot: -0.2 + i * 0.15 }, () => rect(ctx, -6, -10, 12, 18, ['#f2c94c', '#eb6f6f', '#7fc9a0'][i]));
}

function drawCat(ctx, x, y) {
  ellipse(ctx, x, y, 40, 20, '#e08a3c');
  circle(ctx, x - 34, y - 6, 15, '#e08a3c');
  poly(ctx, [x - 46, y - 14, x - 42, y - 30, x - 34, y - 18], '#e08a3c');
  poly(ctx, [x - 30, y - 18, x - 24, y - 30, x - 22, y - 14], '#e08a3c');
  line(ctx, [x - 40, y - 6, x - 35, y - 4], '#5a3a1c', 1.6);
  line(ctx, [x - 31, y - 4, x - 26, y - 6], '#5a3a1c', 1.6);
  for (const dx of [-10, 6, 20]) line(ctx, [x + dx, y - 18, x + dx + 4, y - 8], '#c06a24', 2.5);
  line(ctx, [x + 36, y + 4, x + 50, y + 14, x + 30, y + 20], '#e08a3c', 7);
}

function drawYarn(ctx, x, y) {
  circle(ctx, x, y, 12, '#6f8fe0');
  for (const a of [-0.6, 0, 0.6]) placed(ctx, x, y, { rot: a }, () => ellipse(ctx, 0, 0, 11, 4, 'rgba(40,60,140,0.35)'));
  line(ctx, [x - 10, y + 6, x - 30, y + 14, x - 44, y + 8], '#6f8fe0', 1.6);
}

function drawButterfly(ctx, x, y) {
  ellipse(ctx, x - 7, y - 4, 8, 6, '#ffb03a', -0.5);
  ellipse(ctx, x + 7, y - 4, 8, 6, '#ffb03a', 0.5);
  ellipse(ctx, x - 6, y + 5, 5, 4, '#ff7a3a', 0.4);
  ellipse(ctx, x + 6, y + 5, 5, 4, '#ff7a3a', -0.4);
  rect(ctx, x - 1, y - 6, 2, 14, '#2b2236');
  line(ctx, [x, y - 6, x - 4, y - 12], '#2b2236', 1);
  line(ctx, [x, y - 6, x + 4, y - 12], '#2b2236', 1);
}
