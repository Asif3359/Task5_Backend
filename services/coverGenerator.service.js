const { createCanvas } = require("canvas");

module.exports = function generateCover(title, artist) {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, 300, 300);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Sans";
  ctx.fillText(title, 20, 150);

  ctx.font = "14px Sans";
  ctx.fillText(artist, 20, 180);

  return canvas.toBuffer();
};
