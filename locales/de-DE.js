module.exports = {
  genres: ["Rock", "Elektronisch", "Volksmusik", "Metall"],
  artistPatterns: [
    { type: "person", pattern: "{first} {last}" },
    { type: "band", pattern: "Die {word}" },
  ],
  albumPatterns: ["Single", "{word} Nacht", "Mein {word}"],
  reviews: [
    "A warm, melodic track with nostalgic undertones.",
    "An energetic composition with subtle emotional depth.",
    "A smooth rhythm that feels both modern and timeless.",
  ],

  lyrics: [
    "Every beat reminds me of you, tearing me apart",
    "In the million suns that shine, you're the brightest star",
    "At the break of dawn, you're all I want",
    "Oh Melanie, I try to move on",
    "The night fades slow when you're not here",
    "Echoes of your voice remain",
  ],
};
