export function generateLikes(avg, rng) {
  const base = Math.floor(avg);
  const fraction = avg - base;
  return base + (rng() < fraction ? 1 : 0);
}
