// Screenshot and playtest driver (not part of the game): serves game/ on a local port, starts headless
// Chrome, and runs a script of steps over CDP: open a URL, click, press keys, wait, capture.
//   node tools/shoot.mjs <script.json> <outdir>
// A step is {"open": "?shot=hunt"}, {"click": [x, y]}, {"key": "h"}, {"wait": 500} or {"shot": "name.jpg"}.

import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = process.env.CHROME_BIN;
const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..', 'game');
const [scriptPath, outDir] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(scriptPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = join(root, path.endsWith('/') ? `${path}index.html` : path);
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(8765, '127.0.0.1', r));

const chrome = spawn(CHROME, ['--headless', '--single-process', '--no-zygote', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9333', '--user-data-dir=/tmp/mirrorwick-chrome', '--window-size=1280,800', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pageWs;
for (let i = 0; i < 60 && !pageWs; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9333/json/list')).json();
    pageWs = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
}
if (!pageWs) throw new Error('chrome did not start');

const ws = new WebSocket(pageWs);
await new Promise((r) => ws.addEventListener('open', r));
let nextId = 1;
const waiting = new Map();
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && waiting.has(msg.id)) {
    waiting.get(msg.id)(msg);
    waiting.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    waiting.set(id, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Runtime.enable');
const KEYS = { h: ['h', 'KeyH', 72], ' ': [' ', 'Space', 32], enter: ['Enter', 'Enter', 13], r: ['r', 'KeyR', 82], n: ['n', 'KeyN', 78], p: ['p', 'KeyP', 80], escape: ['Escape', 'Escape', 27], arrowright: ['ArrowRight', 'ArrowRight', 39], arrowdown: ['ArrowDown', 'ArrowDown', 40] };

for (const step of steps) {
  if (step.open !== undefined) {
    await send('Page.navigate', { url: `http://127.0.0.1:8765/index.html${step.open}` });
    for (let i = 0; i < 80; i++) {
      await sleep(100);
      const r = await send('Runtime.evaluate', { expression: 'document.readyState === "complete" && (!location.search.includes("shot=") || document.body.dataset.ready === "1")', returnByValue: true });
      if (r.result.value) break;
    }
    await sleep(300);
  } else if (step.click) {
    const [x, y] = step.click;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  } else if (step.key) {
    const [key, code, vk] = KEYS[step.key];
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk, text: key.length === 1 ? key : undefined });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk });
  } else if (step.wait) {
    await sleep(step.wait);
  } else if (step.shot) {
    const jpeg = step.shot.endsWith('.jpg');
    const r = await send('Page.captureScreenshot', jpeg ? { format: 'jpeg', quality: step.quality ?? 90 } : { format: 'png' });
    writeFileSync(join(outDir, step.shot), Buffer.from(r.data, 'base64'));
    console.log('wrote', step.shot);
  }
}

ws.close();
chrome.kill('SIGKILL');
server.close();
