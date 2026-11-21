// Brass Observatory: a domed study at night, a great telescope, star charts and a planet mobile.

import { circle, ellipse, line, placed, poly, radialGlow, rect, roundRect, star, verticalGradient } from '../paint.js';
import { createRandom } from '../random.js';

export const observatoryScene = {
  id: 'observatory',
  name: 'Brass Observatory',
  set: 2,
  differences: [
    { id: 'chartStar', kind: 'missing', x: 132, y: 150, r: 12 },
    { id: 'book', kind: 'colour', x: 527, y: 240, r: 14 },
    { id: 'planet', kind: 'size', x: 196, y: 102, r: 16 },
    { id: 'clockHand', kind: 'moved', x: 404, y: 236, r: 18 },
    { id: 'globe', kind: 'flipped', x: 82, y: 352, r: 30 },
    { id: 'rug', kind: 'pattern', x: 300, y: 486, r: 26 },
    { id: 'bookStack', kind: 'count', x: 560, y: 304, r: 14 },
    { id: 'inkBottle', kind: 'added', x: 372, y: 410, r: 12 },
    { id: 'compass', kind: 'moved', x: 216, y: 420, r: 18 },
  ],
  draw: drawObservatoryScene,
};

function drawObservatoryScene(ctx, has) {
  const rng = createRandom(606);
  rect(ctx, 0, 0, 600, 270, verticalGradient(ctx, 0, 270, [[0, '#141a3a'], [1, '#2a2d58']]));
  poly(ctx, [262, 0, 338, 0, 328, 150, 272, 150], '#070a1c');
  for (let i = 0; i < 26; i++) circle(ctx, rng.range(276, 326), rng.range(4, 146), rng.range(0.5, 1.5), '#ffffff');
  ctx.strokeStyle = '#3d3f70';
  ctx.lineWidth = 4;
  for (const x of [60, 160, 440, 540]) {
    ctx.beginPath();
    ctx.moveTo(x, 270);
    ctx.quadraticCurveTo(300 + (x - 300) * 0.4, -60, 300 + (x - 300) * 0.15, 0);
    ctx.stroke();
  }
  rect(ctx, 0, 262, 600, 12, '#8a6a3a');
  rect(ctx, 0, 274, 600, 160, '#5a3a26');
  for (let x = 0; x < 600; x += 50) line(ctx, [x, 274, x, 434], '#4a2e1c', 2);
  rect(ctx, 0, 434, 600, 86, '#3a2618');
  drawRug(ctx, has);
  drawChart(ctx, has);
  drawMobile(ctx, has);
  drawClock(ctx, has);
  drawShelf(ctx, has);
  drawTelescope(ctx);
  drawGlobe(ctx, has);
  drawDesk(ctx, has);
  drawCat(ctx, 520, 470);
}

function drawCat(ctx, x, y) {
  ellipse(ctx, x, y, 30, 13, '#2b2236');
  circle(ctx, x - 26, y - 8, 11, '#2b2236');
  poly(ctx, [x - 35, y - 13, x - 33, y - 25, x - 27, y - 16], '#2b2236');
  poly(ctx, [x - 24, y - 17, x - 18, y - 26, x - 17, y - 12], '#2b2236');
  line(ctx, [x - 31, y - 9, x - 28, y - 8], '#ffd27a', 1.4);
  line(ctx, [x - 24, y - 8, x - 21, y - 9], '#ffd27a', 1.4);
  line(ctx, [x + 28, y + 2, x + 44, y - 6, x + 50, y + 6], '#2b2236', 5);
}

function drawChart(ctx, has) {
  rect(ctx, 30, 110, 150, 110, '#c9a86a');
  rect(ctx, 36, 116, 138, 98, '#1f2a55');
  const pts = [[56, 190], [80, 160], [108, 172], [132, 150], [156, 132], [146, 192]];
  line(ctx, pts.flatMap((p) => p).slice(0, 10), 'rgba(255,230,160,0.6)', 1.2);
  line(ctx, [108, 172, 146, 192], 'rgba(255,230,160,0.6)', 1.2);
  pts.forEach(([x, y], i) => {
    if (i === 3 && has('chartStar')) return;
    star(ctx, x, y, 4, 1.8, 4, '#ffe9a8');
  });
  ctx.beginPath();
  ctx.arc(105, 165, 40, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,230,160,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawMobile(ctx, has) {
  line(ctx, [170, 0, 170, 52], '#c9a86a', 1.5);
  line(ctx, [120, 52, 220, 52], '#c9a86a', 2);
  const planets = [[124, 90, 10, '#e8915a'], [156, 112, 7, '#9ad0e8'], [196, 102, has('planet') ? 13 : 9, '#d8c06a'], [218, 80, 6, '#c96a6a']];
  for (const [x, y, r, c] of planets) {
    line(ctx, [x, 52, x, y - r], '#c9a86a', 1);
    circle(ctx, x, y, r, c);
    circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.3, 'rgba(255,255,255,0.35)');
  }
  ctx.beginPath();
  ctx.ellipse(124, 90, 16, 4, -0.3, 0, Math.PI * 2);
  ctx.strokeStyle = '#f1d9a8';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawClock(ctx, has) {
  circle(ctx, 404, 236, 22, '#c9a86a');
  circle(ctx, 404, 236, 18, '#f4ead2');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 404 + Math.cos(a) * 14, 236 + Math.sin(a) * 14, 1, '#4a2e1c');
  }
  const minute = has('clockHand') ? 0.6 : -0.9;
  line(ctx, [404, 236, 404 + Math.cos(minute) * 13, 236 + Math.sin(minute) * 13], '#2b2236', 1.6);
  line(ctx, [404, 236, 404 + Math.cos(2.2) * 8, 236 + Math.sin(2.2) * 8], '#2b2236', 2.4);
}

const BOOK_WIDTHS = [12, 10, 14, 9, 13, 11, 12, 10, 14, 9, 12];

function drawShelf(ctx, has) {
  rect(ctx, 450, 150, 140, 250, '#4a2e1c');
  for (const y of [200, 260, 330, 396]) rect(ctx, 450, y, 140, 6, '#7a5a36');
  const colours = ['#a8423a', '#3a6aa8', '#5a8a4a', '#c9a24a', '#7a4a8a', '#3a8a8a'];
  for (const [y, h] of [[160, 40], [216, 44]]) {
    let x = 458;
    let n = 0;
    while (x < 580) {
      const w = BOOK_WIDTHS[n % BOOK_WIDTHS.length];
      let c = colours[n % colours.length];
      if (y === 216 && n === 5 && has('book')) c = '#b8604a';
      rect(ctx, x, y + (h - 34) - (n % 3) * 3, w, 34 + (n % 3) * 3, c);
      rect(ctx, x + 2, y + h - 22, w - 4, 2, 'rgba(255,230,160,0.5)');
      x += w + 1;
      n++;
    }
  }
  const stack = has('bookStack') ? 3 : 4;
  for (let i = 0; i < stack; i++) rect(ctx, 536 + (i % 2) * 4, 322 - i * 7, 40, 7, colours[(i + 2) % 6]);
  roundRect(ctx, 466, 300, 34, 30, 4, '#c9a86a');
  circle(ctx, 483, 315, 9, '#2b2236');
  for (let i = 0; i < 5; i++) ellipse(ctx, 470 + i * 24, 386, 9, 9, ['#d8c06a', '#9ad0e8', '#e8915a', '#c9ced6', '#a8423a'][i]);
}

function drawTelescope(ctx) {
  line(ctx, [300, 330, 250, 430], '#3a2618', 6);
  line(ctx, [300, 330, 350, 430], '#3a2618', 6);
  line(ctx, [300, 330, 300, 430], '#3a2618', 6);
  placed(ctx, 300, 300, { rot: -0.85 }, () => {
    roundRect(ctx, -70, -20, 230, 40, 10, '#c9963a');
    roundRect(ctx, 150, -26, 30, 52, 6, '#a8782a');
    roundRect(ctx, -96, -12, 30, 24, 4, '#a8782a');
    for (const x of [-30, 40, 110]) rect(ctx, x, -21, 8, 42, '#8a5a1c');
    rect(ctx, -60, -16, 200, 5, 'rgba(255,240,190,0.45)');
  });
  circle(ctx, 300, 300, 14, '#8a5a1c');
  radialGlow(ctx, 404, 132, 30, 'rgba(255,240,190,0.3)');
}

function drawGlobe(ctx, has) {
  line(ctx, [82, 390, 82, 432], '#8a6a3a', 5);
  rect(ctx, 62, 430, 40, 6, '#8a6a3a');
  ctx.beginPath();
  ctx.arc(82, 352, 36, -2.2, 1.0);
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 3;
  ctx.stroke();
  circle(ctx, 82, 352, 30, '#3a7ab8');
  placed(ctx, 82, 352, { flip: has('globe') }, () => {
    poly(ctx, [-18, -18, -2, -24, 6, -12, -4, 0, -16, -4], '#6fa56a');
    poly(ctx, [4, 4, 18, 0, 22, 14, 8, 22], '#6fa56a');
    ellipse(ctx, -14, 14, 6, 4, '#6fa56a');
  });
  circle(ctx, 72, 340, 6, 'rgba(255,255,255,0.25)');
}

function drawDesk(ctx, has) {
  rect(ctx, 150, 426, 300, 12, '#7a4a2a');
  rect(ctx, 160, 438, 10, 60, '#5a3a26');
  rect(ctx, 430, 438, 10, 60, '#5a3a26');
  poly(ctx, [250, 424, 300, 414, 350, 424], '#f4ead2');
  line(ctx, [300, 414, 300, 424], '#c9a86a', 1.5);
  for (let i = 0; i < 3; i++) line(ctx, [262 + i * 6, 420, 290, 416 + i * 2], 'rgba(60,40,30,0.4)', 1);
  roundRect(ctx, 404, 404, 12, 22, 2, '#f4ead2');
  radialGlow(ctx, 410, 394, 30, 'rgba(255,200,110,0.5)');
  ellipse(ctx, 410, 396, 4, 8, '#ffc94a');
  const cx = has('compass') ? 206 : 226;
  circle(ctx, cx, 420, 9, '#c9a86a');
  circle(ctx, cx, 420, 6.5, '#f4ead2');
  line(ctx, [cx - 4, 424, cx + 4, 416], '#d8342e', 1.8);
  if (has('inkBottle')) {
    roundRect(ctx, 366, 410, 12, 16, 3, '#1f2a55');
    rect(ctx, 368, 405, 8, 6, '#2b2236');
    line(ctx, [374, 405, 382, 388], '#f1f1f1', 1.5);
  }
}

function drawRug(ctx, has) {
  ellipse(ctx, 300, 486, 220, 34, '#8a2f3a');
  ctx.beginPath();
  ctx.ellipse(300, 486, 200, 26, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#e8b84a';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = -6; i <= 6; i++) {
    const x = 300 + i * 26;
    const y = 486 + (Math.abs(i) > 4 ? -2 : 0);
    if (has('rug') && Math.abs(i) <= 1) circle(ctx, x, y, 5, '#e8b84a');
    else poly(ctx, [x, y - 7, x + 6, y, x, y + 7, x - 6, y], '#e8b84a');
  }
}
