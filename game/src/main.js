// Boot: fit the canvas to the window, wire input, run the loop, or stage a screenshot.

import { VIEW_H, VIEW_W } from './config.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createGame, handleClick, handleKey, setRenderScale, steerCursor, updateGame } from './game.js';
import { remainingCount } from './hunt.js';
import { SHOT_PLANS, stageShot } from './shots.js';
import { drawFrame } from './view.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const game = createGame(createAudio());
let k = 1;

function fitCanvas() {
  const s = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  const cssW = Math.floor(VIEW_W * s);
  const cssH = Math.floor(VIEW_H * s);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.style.left = `${Math.floor((window.innerWidth - cssW) / 2)}px`;
  canvas.style.top = `${Math.floor((window.innerHeight - cssH) / 2)}px`;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  k = canvas.width / VIEW_W;
  setRenderScale(game, k);
}

function toView(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return { x: ((clientX - r.left) * VIEW_W) / r.width, y: ((clientY - r.top) * VIEW_H) / r.height };
}

function render() {
  ctx.setTransform(k, 0, 0, k, 0, 0);
  drawFrame(ctx, game);
}

function announce() {
  const h = game.hunt;
  const line = game.screen === 'title' ? 'Choose a scene' : h.outcome === 'clear' ? 'Scene clear' : h.outcome ? "Time's up" : `${remainingCount(h)} differences left`;
  if (status.textContent !== line) status.textContent = line;
}

const input = createInput(canvas, toView);
let last = 0;

function frame(t) {
  const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
  last = t;
  for (const ev of input.drain()) {
    if (ev.type === 'click') handleClick(game, ev.x, ev.y);
    else handleKey(game, ev.key);
  }
  if (game.screen === 'play' && !game.paused) steerCursor(game, input.held, dt);
  updateGame(game, dt);
  render();
  announce();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', fitCanvas);
fitCanvas();

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const plan = { ...SHOT_PLANS[shot], ...(params.get('scene') ? { scene: params.get('scene') } : {}) };
if (shot && stageShot(game, shot, plan)) {
  render();
  document.body.dataset.ready = '1';
} else {
  requestAnimationFrame(frame);
}
