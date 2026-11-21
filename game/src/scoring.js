// Points, combos, the clear bonus and the star rating.

import { RULES } from './config.js';

/** The combo after a find: it climbs when finds come within the window, else starts again at 1. */
export function nextCombo(previousCombo, secondsSinceLastFind) {
  if (secondsSinceLastFind <= RULES.comboWindow) return Math.min(RULES.maxCombo, previousCombo + 1);
  return 1;
}

export function pointsForFind(combo) {
  return RULES.findPoints * combo;
}

export function timeBonus(secondsLeft) {
  return Math.ceil(secondsLeft) * RULES.timeBonusPerSecond;
}

/** Three stars for a clean, quick clear; one for any clear. Shared by the clear card and the scene list. */
export function starRating(hunt) {
  let stars = 1;
  const share = hunt.timeLeft / hunt.timeTotal;
  if (share >= 0.25 && hunt.misses <= 3) stars++;
  if (share >= 0.45 && hunt.misses <= 1 && hunt.hintsUsed === 0) stars++;
  return stars;
}
