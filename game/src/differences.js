// What a difference is and how a click is matched to one.

export const KIND_LABELS = {
  missing: 'Missing',
  added: 'Added',
  colour: 'Colour',
  moved: 'Moved',
  size: 'Size',
  flipped: 'Flipped',
  pattern: 'Pattern',
  count: 'Count',
};

/** The lookup a scene draws with: has(id) is true when the panel shows that change. */
export function variantLookup(changedIds) {
  const set = new Set(changedIds);
  return (id) => set.has(id);
}

/** The unfound difference whose circle holds (x, y), the nearest one when circles overlap. */
export function hitTestDifference(scene, foundIds, x, y, slop) {
  let best = null;
  let bestGap = Infinity;
  for (const diff of scene.differences) {
    if (foundIds.includes(diff.id)) continue;
    // Compare by how far inside the circle the click sits, so a small circle wins inside a big one.
    const gap = (Math.hypot(x - diff.x, y - diff.y) - (diff.r + slop)) / (diff.r + slop);
    if (gap <= 0 && gap < bestGap) {
      best = diff;
      bestGap = gap;
    }
  }
  return best;
}

export function unfoundDifferences(scene, foundIds) {
  return scene.differences.filter((d) => !foundIds.includes(d.id));
}

/** True when a click lands on a difference already found, so it costs nothing. */
export function isOnFoundDifference(scene, foundIds, x, y, slop) {
  return scene.differences.some((d) => foundIds.includes(d.id) && Math.hypot(x - d.x, y - d.y) <= d.r + slop);
}
