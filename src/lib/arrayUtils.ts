/**
 * Fisher-Yates shuffle. Returns a new array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick `count` random items from `arr` without replacement.
 */
export function sampleSize<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}
