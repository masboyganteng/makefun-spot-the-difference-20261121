// Small canvas drawing helpers the scenes are painted with.
// Each helper sets its own fill or stroke, so scenes read as a list of shapes, back to front.

const TAU = Math.PI * 2;

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Fills a polygon given as a flat list x0, y0, x1, y1, ... */
export function poly(ctx, pts, fill) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Strokes an open polyline given as a flat list. */
export function line(ctx, pts, color, width = 2, cap = 'round') {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = cap;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

export function verticalGradient(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  return g;
}

export function radialGlow(ctx, x, y, r, inner, outer = 'rgba(0,0,0,0)') {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

export function star(ctx, x, y, outer, inner, points, fill, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + (i * Math.PI) / points;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Runs draw() with the canvas moved to x, y, turned and scaled; flip mirrors it left to right. */
export function placed(ctx, x, y, { rot = 0, scale = 1, flip = false } = {}, draw) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.scale(flip ? -scale : scale, scale);
  draw();
  ctx.restore();
}

export function cloud(ctx, x, y, w, fill) {
  ellipse(ctx, x, y, w * 0.5, w * 0.16, fill);
  ellipse(ctx, x - w * 0.18, y - w * 0.08, w * 0.2, w * 0.14, fill);
  ellipse(ctx, x + w * 0.12, y - w * 0.12, w * 0.24, w * 0.17, fill);
}

/** A gabled house: walls, roof, door and a grid of windows; lit is a list of window indexes that glow. */
export function house(ctx, x, y, w, h, { wall, roof, trim = '#2a2236', lit = [], dark = '#3b3352', glow = '#ffd36e', cols = 2, rows = 1, door = true }) {
  rect(ctx, x, y, w, h, wall);
  poly(ctx, [x - 5, y + 1, x + w / 2, y - h * 0.55, x + w + 5, y + 1], roof);
  line(ctx, [x - 5, y + 1, x + w / 2, y - h * 0.55, x + w + 5, y + 1], trim, 2);
  const ww = w * 0.2;
  const wh = h * 0.24;
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + (w / (cols + 1)) * (c + 1) - ww / 2;
      const wy = y + h * 0.16 + r * (wh + h * 0.12);
      rect(ctx, wx - 1.5, wy - 1.5, ww + 3, wh + 3, trim);
      rect(ctx, wx, wy, ww, wh, lit.includes(index) ? glow : dark);
      index++;
    }
  }
  if (door) rect(ctx, x + w / 2 - w * 0.1, y + h - h * 0.34, w * 0.2, h * 0.34, trim);
}
