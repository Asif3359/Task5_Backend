/**
 * Returns a like count for one song so that the average across many songs is `avg`.
 * Range 0–10. Uses a Poisson-like distribution so each song gets a different count.
 * - avg 0 → always 0; avg 10 → always 10 (per spec).
 * - Otherwise: integer count in [0, 10] with mean ≈ avg.
 */
function generateLikes(avg, rng) {
  const a = Number(avg);
  if (a <= 0) return 0;
  if (a >= 10) return 10;

  // Sample from Poisson(λ) clamped to [0, 10]; mean ≈ a
  const L = Math.exp(-a);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L && k < 11);
  const raw = k - 1;
  return Math.min(10, Math.max(0, raw));
}

module.exports = { generateLikes };
