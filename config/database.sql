CREATE TABLE locales (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,   -- en-US, de-DE
    name VARCHAR(50) NOT NULL
);


CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_genre_locale
        FOREIGN KEY (locale_code)
        REFERENCES locales(code)
        ON DELETE CASCADE
);


CREATE TABLE artist_name_patterns (
    id SERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL,
    pattern_type VARCHAR(20) CHECK (pattern_type IN ('person','band')),
    pattern TEXT NOT NULL,
    CONSTRAINT fk_artist_locale
        FOREIGN KEY (locale_code)
        REFERENCES locales(code)
        ON DELETE CASCADE
);


CREATE TABLE album_title_patterns (
    id SERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    CONSTRAINT fk_album_locale
        FOREIGN KEY (locale_code)
        REFERENCES locales(code)
        ON DELETE CASCADE
);


CREATE TABLE review_templates (
    id SERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    CONSTRAINT fk_review_locale
        FOREIGN KEY (locale_code)
        REFERENCES locales(code)
        ON DELETE CASCADE
);
