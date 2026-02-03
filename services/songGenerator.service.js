const { fakerEN, fakerDE } = require("@faker-js/faker");

function generatePattern(text, faker) {
  return text
    .replaceAll("{first}", faker.person.firstName())
    .replaceAll("{last}", faker.person.lastName())
    .replaceAll("{word}", faker.word.noun());
}

function generateSong({ rng, locale, artistPatterns, albumPatterns, genres }) {
  const faker = locale === "de-DE" ? fakerDE : fakerEN;

  const title = faker.music.songName();

  const artistTemplate =
    artistPatterns[Math.floor(rng() * artistPatterns.length)].pattern;

  const albumTemplate = albumPatterns[Math.floor(rng() * albumPatterns.length)];

  const genre = genres[Math.floor(rng() * genres.length)];

  return {
    title,
    artist: generatePattern(artistTemplate, faker),
    album: generatePattern(albumTemplate, faker),
    genre,
  };
}

module.exports = { generateSong };
