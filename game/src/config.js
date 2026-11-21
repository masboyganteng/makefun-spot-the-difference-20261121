// Mirrorwick tuning: every size, rule, colour and set rule in one place.
// Sets get harder in three ways at once: a shorter clock, fewer hint charges, subtler changes.

export const VIEW_W = 1280;
export const VIEW_H = 800;

/** Every scene is drawn in its own 600 x 520 space, once per panel. */
export const SCENE_W = 600;
export const SCENE_H = 520;

export const LAYOUT = {
  headerH: 92,
  timerY: 98,
  timerH: 16,
  panelY: 126,
  leftX: 24,
  rightX: 656,
  footerY: 660,
};

export const RULES = {
  findPoints: 150,
  comboWindow: 7,
  maxCombo: 4,
  missPenalty: 5,
  missLockout: 0.35,
  hitSlop: 8,
  timeBonusPerSecond: 10,
  hintSeconds: 4.5,
  lowTimeSeconds: 15,
};

export const SETS = [
  { name: 'Daybreak', seconds: 120, hints: 3, tint: '#ffc35a' },
  { name: 'Lamplight', seconds: 100, hints: 2, tint: '#7ccfff' },
  { name: 'Deep Hours', seconds: 85, hints: 1, tint: '#c99bff' },
];

export const PALETTE = {
  ink: '#15121f',
  inkSoft: '#211c33',
  edge: '#3a3258',
  text: '#fff6e6',
  muted: '#a99fc4',
  gold: '#ffcf5a',
  found: '#3ef0a0',
  miss: '#ff4d5e',
  hint: '#7fd8ff',
  danger: '#ff5a4f',
};

export const FONT = 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
