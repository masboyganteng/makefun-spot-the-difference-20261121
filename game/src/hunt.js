// One hunt through one scene: the clock, finds, misses, hints and how it ends.
// Pure state: no drawing and no sound, so the game and the screenshot stager share it.

import { RULES } from './config.js';
import { hitTestDifference, isOnFoundDifference, unfoundDifferences } from './differences.js';
import { nextCombo, pointsForFind, starRating, timeBonus } from './scoring.js';

export function createHunt(scene, set, sceneIndex) {
  return {
    scene,
    set,
    sceneIndex,
    found: [],
    foundAt: {},
    clock: 0,
    timeTotal: set.seconds,
    timeLeft: set.seconds,
    hints: set.hints,
    hintsUsed: 0,
    misses: 0,
    score: 0,
    combo: 1,
    lastFindClock: -Infinity,
    lockedUntil: 0,
    outcome: null,
  };
}

export function remainingCount(hunt) {
  return hunt.scene.differences.length - hunt.found.length;
}

/**
 * A click at scene point (x, y): a find, a miss (time penalty), or nothing (a found spot, or the
 * short lockout after a miss that keeps the mouse from being spammed).
 */
export function tryFindAt(hunt, x, y) {
  if (hunt.outcome || hunt.clock < hunt.lockedUntil) return { result: 'ignored' };
  const diff = hitTestDifference(hunt.scene, hunt.found, x, y, RULES.hitSlop);
  if (diff) {
    hunt.combo = nextCombo(hunt.combo, hunt.clock - hunt.lastFindClock);
    const points = pointsForFind(hunt.combo);
    hunt.score += points;
    hunt.found.push(diff.id);
    hunt.foundAt[diff.id] = hunt.clock;
    hunt.lastFindClock = hunt.clock;
    if (remainingCount(hunt) === 0) finishHunt(hunt, 'clear');
    return { result: 'found', diff, points, combo: hunt.combo };
  }
  if (isOnFoundDifference(hunt.scene, hunt.found, x, y, RULES.hitSlop)) return { result: 'ignored' };
  hunt.misses++;
  hunt.combo = 1;
  hunt.timeLeft = Math.max(0, hunt.timeLeft - RULES.missPenalty);
  hunt.lockedUntil = hunt.clock + RULES.missLockout;
  if (hunt.timeLeft <= 0) finishHunt(hunt, 'timeup');
  return { result: 'miss' };
}

/** Spends a hint charge on an unfound difference, the one listed first; null when none can be had. */
export function takeHint(hunt) {
  if (hunt.outcome || hunt.hints <= 0) return null;
  const open = unfoundDifferences(hunt.scene, hunt.found);
  if (!open.length) return null;
  hunt.hints--;
  hunt.hintsUsed++;
  return open[0];
}

/** Moves the clock on; returns 'timeup' on the frame time runs out. */
export function advanceHunt(hunt, dt) {
  hunt.clock += dt;
  if (hunt.outcome) return null;
  hunt.timeLeft = Math.max(0, hunt.timeLeft - dt);
  if (hunt.timeLeft <= 0) {
    finishHunt(hunt, 'timeup');
    return 'timeup';
  }
  return null;
}

function finishHunt(hunt, outcome) {
  hunt.outcome = outcome;
  hunt.endedClock = hunt.clock;
  if (outcome === 'clear') {
    hunt.bonus = timeBonus(hunt.timeLeft);
    hunt.stars = starRating(hunt);
    hunt.findScore = hunt.score;
    hunt.score += hunt.bonus;
  } else {
    hunt.stars = 0;
  }
}
