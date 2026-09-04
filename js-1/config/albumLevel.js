import { ALBUM_CONFIG } from "./albumConfig.js";

/*
 * =========================================================
 * BANDENKICK – SAMMELALBUM-SPEZIALLEVEL
 * =========================================================
 *
 * Diese Datei ist ausschließlich für die spielbaren
 * Sammelalbum-Level zuständig.
 *
 * Aktueller Ablauf für ALLE Sammelalbum-Level:
 * - Goldball sitzt in Reihe 3, mindestens 2 Reihen darüber
 * - Goldball muss freigespielt werden
 * - Goldball blitzt kurz auf und fällt
 * - jeweiliges Sammelstück wird groß eingeblendet
 * - "XY ERSPIELT!" + Album-Hinweis
 * - Sammelstück bläht sich auf und platzt
 * - danach normale Level-gewonnen-Animation
 *
 * Die eigentliche Animations-/Treffer-Engine bleibt in script.js.
 * Hier werden nur Level, Bild, Name und gemeinsame Eckdaten definiert.
 */

export const ALBUM_LEVEL_DEFAULTS = Object.freeze({
  mode: "sword",       // interner Engine-Modus für die Goldball/Sammelstück-Mechanik
  goldBallRow: 3,       // 1-basiert: zwei komplette Reihen liegen darüber
  goldBallCol: 7,
  minimumRows: 7,
  addRowAfterShot: "n"
});

/**
 * Baut aus albumConfig.js eine Leveldefinition für jede Sammelkarte.
 * Dadurch müssen neue Alben später nicht mehr in script.js eingetragen werden.
 */
export function buildAlbumLevelDefinitions() {
  const definitions = {};

  ALBUM_CONFIG.forEach((album) => {
    (album.cards || []).forEach((card) => {
      const level = Number(card.unlockLevel);
      if (!Number.isFinite(level) || level <= 0) return;

      definitions[level] = {
        albumId: album.id,
        albumName: album.name,
        cardId: card.id,
        name: card.name,
        image: card.image,
        row: ALBUM_LEVEL_DEFAULTS.goldBallRow,
        col: ALBUM_LEVEL_DEFAULTS.goldBallCol,
        minimumRows: ALBUM_LEVEL_DEFAULTS.minimumRows
      };
    });
  });

  return definitions;
}

export const ALBUM_LEVELS = Object.freeze(buildAlbumLevelDefinitions());

export function getAlbumLevel(level) {
  return ALBUM_LEVELS[Number(level)] || null;
}

/**
 * Überträgt alle Sammelalbum-Level in STAR_CONFIG.
 * Bestehende Levelwerte (z. B. ballTypes) bleiben erhalten,
 * nur die für das Sammelalbum nötigen Spezialwerte werden ergänzt/überschrieben.
 */
export function applyAlbumLevelConfig(starConfig) {
  if (!starConfig || typeof starConfig !== "object") return starConfig;

  Object.entries(ALBUM_LEVELS).forEach(([levelKey, collectible]) => {
    const level = Number(levelKey);
    const original = starConfig[level] || {};

    starConfig[level] = {
      ...original,
      ballTypes: original.ballTypes ?? 5,
      rows: Math.max(
        collectible.minimumRows,
        Number(original.rows) || collectible.minimumRows
      ),
      addRowAfterShot: ALBUM_LEVEL_DEFAULTS.addRowAfterShot,
      mode: ALBUM_LEVEL_DEFAULTS.mode,
      sword: {
        // "sword" ist derzeit der interne Name der vorhandenen Engine-Struktur.
        // Die Struktur wird auch für Kronen und weitere Sammelstücke verwendet.
        row: collectible.row,
        col: collectible.col,
        image: collectible.image,
        name: collectible.name,
        cardId: collectible.cardId,
        albumId: collectible.albumId,
        albumName: collectible.albumName
      }
    };
  });

  return starConfig;
}
