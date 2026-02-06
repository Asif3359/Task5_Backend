const seedrandom = require("seedrandom");

function toSeedValue(val) {
  const n = Number(val);
  if (!Number.isNaN(n)) return n;
  // String (e.g. "likes-49", "audio-49"): deterministic numeric hash
  const str = String(val);
  return [...str].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
}

module.exports = function getRng(seed, page) {
  const seedNum = Number(seed);
  const base = Number.isNaN(seedNum) ? toSeedValue(String(seed)) : seedNum;
  return seedrandom(base * 31 + toSeedValue(page));
};
