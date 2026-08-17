/*
 * =========================================================
 * BANDENKICK – ZENTRALE STAGE-KONFIGURATION
 * =========================================================
 * Neue Stages werden NUR HIER ergänzt.
 * Reihenfolge = Stage-Nummer, jede Stage umfasst LEVELS_PER_STAGE Level.
 * Logo steuert die Endloskarte/Stage-Animation, background das Spiel-Level.
 */

export const LEVELS_PER_STAGE = 10;

export const STAGES = Object.freeze([
  { name: "Bandenkick Arena",    logo: "assets/logos/LigaLogoBordered.png", background: "assets/backgrounds/Bandenkick-Arena.png",     accent: "#860000" },
  { name: "World Cup",           logo: "assets/logos/WM-Pokal.png",          background: "assets/backgrounds/World-Cup.png",            accent: "#d2a62b" },
  { name: "Tropical Paradise",   logo: "assets/logos/Wasser-surfer.png",     background: "assets/backgrounds/Tropical Paradise.png",    accent: "#2f8fbd" },
  { name: "Volcano Stadium",     logo: "assets/logos/volcano.png",          background: "assets/backgrounds/volcano-stadium.png",      accent: "#d55428" },
  { name: "Pirate Island",       logo: "assets/logos/pirate.png",           background: "assets/backgrounds/pirate-island.png",        accent: "#9a7132" },
  { name: "Jungle Arena",        logo: "assets/logos/junglearena.png",      background: "assets/backgrounds/jungle-arena.png",         accent: "#2e8b57" },
  { name: "Royal Kingdom",       logo: "assets/logos/kingdom.png",          background: "assets/backgrounds/royal-kingdom.png",        accent: "#d4af37" },
  { name: "Dragon Fantasy",      logo: "assets/logos/dragon.png",           background: "assets/backgrounds/dragon-fantasy.png",       accent: "#8b0000" },
  { name: "Crystal Cave",        logo: "assets/logos/crystal.png",          background: "assets/backgrounds/crystal-cave.png",         accent: "#557ee8" },
  { name: "Monster Stadium",     logo: "assets/logos/monster.png",          background: "assets/backgrounds/monster-stadium.png",      accent: "#6b8e23" },
  { name: "Candy Island",        logo: "assets/logos/candyisland.png",       background: "assets/backgrounds/candyisland.png",           accent: "#ff69b4" },
  { name: "Emerald Jungle",      logo: "assets/logos/emeraldjungle.png",     background: "assets/backgrounds/emeraldjungle.png",         accent: "#159447" },
  { name: "Frozen World",        logo: "assets/logos/frozenworld.png",       background: "assets/backgrounds/frozenworld.png",           accent: "#8fd8ff" },
  { name: "Golden Desert",       logo: "assets/logos/goldendesert.png",      background: "assets/backgrounds/goldendesert.png",          accent: "#d9a520" },
  { name: "Lost Temple",         logo: "assets/logos/losttemple.png",        background: "assets/backgrounds/losttemple.png",            accent: "#8b6b3e" },
  { name: "Moonlight Bay",       logo: "assets/logos/moonlightbay.png",      background: "assets/backgrounds/moonlightbay.png",          accent: "#5967c9" },
  { name: "Mystic Forest",       logo: "assets/logos/mysticforest.png",      background: "assets/backgrounds/mysticforest.png",          accent: "#5a3d8f" },
  { name: "Fire Island",         logo: "assets/logos/fireisland.png",        background: "assets/backgrounds/fireisland.png",            accent: "#d84315" },
  { name: "Thunder Mountain",    logo: "assets/logos/thundermountain.png",   background: "assets/backgrounds/thundermountain.png",       accent: "#6657a8" }
]);

export const TOTAL_STAGES = STAGES.length;
export const TOTAL_LEVELS = TOTAL_STAGES * LEVELS_PER_STAGE;

export function getStageNumberForLevel(level) {
  const safeLevel = Math.max(1, Number(level) || 1);
  return Math.min(TOTAL_STAGES, Math.ceil(safeLevel / LEVELS_PER_STAGE));
}

export function getStageForLevel(level) {
  return STAGES[getStageNumberForLevel(level) - 1] || STAGES[0];
}
