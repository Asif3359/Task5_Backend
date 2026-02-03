const seedrandom = require("seedrandom");

module.exports = function getRng(seed, page) {
  return seedrandom(Number(seed) * 31 + Number(page));
};
