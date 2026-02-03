var express = require("express");
var router = express.Router();
const Tone = require("tone");
const WavEncoder = require("wav-encoder");

const getRng = require("../utils/seed.utils");
const { generateLikes } = require("../services/likeGenerator.service");
const { generateSong } = require("../services/songGenerator.service");

const locales = {
  "en-US": require("../locales/en-US"),
  "de-DE": require("../locales/de-DE"),
};

router.get("/", function (req, res) {
  const {
    locale = "en-US",
    seed = 1,
    page = 1,
    limit = 20,
    likes = 0,
  } = req.query;

  const localeData = locales[locale];
  if (!localeData) {
    return res.status(400).json({ error: "Invalid locale" });
  }

  const rng = getRng(seed, page);
  const songs = [];
  const startIndex = (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const index = startIndex + i + 1;

    const song = generateSong({
      rng,
      locale,
      artistPatterns: localeData.artistPatterns,
      albumPatterns: localeData.albumPatterns,
      genres: localeData.genres,
    });

    songs.push({
      index,
      ...song,
      likes: generateLikes(Number(likes), rng),
    });
  }

  res.json({
    page: Number(page),
    locale,
    seed,
    songs,
  });
});

router.get("/random", (req, res) => {
  const seed = BigInt.asUintN(
    64,
    BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
  ).toString();

  res.json({ seed });
});

router.get("/:index/details", (req, res) => {
  const { locale = "en-US", seed = "1", likes = 0 } = req.query;

  const { index } = req.params;

  const localeData = locales[locale];
  if (!localeData) {
    return res.status(400).json({ error: "Invalid locale" });
  }

  // Song deterministic
  const songRng = getRng(seed, index);

  const song = generateSong({
    rng: songRng,
    locale,
    artistPatterns: localeData.artistPatterns,
    albumPatterns: localeData.albumPatterns,
    genres: localeData.genres,
  });

  // Likes deterministic (independent)
  const likeRng = getRng(seed, `likes-${index}`);
  const songLikes = generateLikes(Number(likes), likeRng);

  // Cover metadata (frontend will render)
  const cover = {
    style: ["gradient", "noise", "pattern"][Math.floor(songRng() * 3)],
    title: song.title,
    artist: song.artist,
  };

  // Fake review (seeded)
  const reviews = localeData.reviews;
  const review = reviews[Math.floor(songRng() * reviews.length)];

  // Lyrics (seeded lines)
  const lyrics = localeData.lyrics.sort(() => songRng() - 0.5).slice(0, 6);

  res.json({
    index: Number(index),
    ...song,
    likes: songLikes,
    duration: "2:12",
    label: "Apple Records",
    year: 2019,
    cover,
    review,
    lyrics,
  });
});

// router.get("/:index/preview", async (req, res) => {
//   const { seed = "1" } = req.query;
//   const { index } = req.params;

//   const rng = getRng(seed, `audio-${index}`);

//   const sampleRate = 44100;
//   const duration = 5; // seconds
//   const length = sampleRate * duration;

//   const channelData = new Float32Array(length);

//   // Simple melody (seeded)
//   const baseFreq = 220 + Math.floor(rng() * 220);

//   for (let i = 0; i < length; i++) {
//     const t = i / sampleRate;
//     const freq = baseFreq * (1 + (Math.floor(t) % 4) * 0.25);
//     channelData[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
//   }

//   const audioData = {
//     sampleRate,
//     getChannelData: () => [channelData],
//   };

//   const buffer = await WavEncoder.encode(audioData);

//   res.set({
//     "Content-Type": "audio/wav",
//     "Content-Length": buffer.byteLength,
//   });

//   res.send(Buffer.from(buffer));
// });

router.get("/:index/preview", async (req, res) => {
  try {
    const { seed = "1" } = req.query;
    const { index } = req.params;

    const rng = getRng(seed, `audio-${index}`);

    const sampleRate = 44100;
    const duration = 5; // seconds
    const length = sampleRate * duration;

    const channelData = new Float32Array(length);

    // Seeded melody
    const baseFreq = 220 + Math.floor(rng() * 220);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const step = Math.floor(t) % 4;
      const freq = baseFreq * (1 + step * 0.25);

      channelData[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
    }

    // ✅ CORRECT AudioData format
    const audioData = {
      sampleRate,
      channelData: [channelData], // MUST be array
    };

    const buffer = await WavEncoder.encode(audioData);

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": buffer.byteLength,
    });

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Audio generation failed:", err);
    res.status(500).json({ error: "Audio generation failed" });
  }
});

module.exports = router;
