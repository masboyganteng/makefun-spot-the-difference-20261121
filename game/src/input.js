// Mouse and keyboard, turned into a queue of clicks and key presses in view coordinates.

const GAME_KEYS = new Set(['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'enter', 'escape', 'tab']);

export function createInput(canvas, toView) {
  const queue = [];
  const held = new Set();
  const pointer = { x: 0, y: 0, moved: false };

  canvas.addEventListener('pointermove', (e) => {
    const p = toView(e.clientX, e.clientY);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.moved = true;
  });
  canvas.addEventListener('pointerdown', (e) => {
    const p = toView(e.clientX, e.clientY);
    queue.push({ type: 'click', x: p.x, y: p.y });
  });
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (GAME_KEYS.has(key)) e.preventDefault();
    held.add(key);
    if (!e.repeat) queue.push({ type: 'key', key, shift: e.shiftKey });
  });
  window.addEventListener('keyup', (e) => held.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  return {
    drain: () => queue.splice(0),
    held,
    pointer,
  };
}
