/*
 * =========================================================
 * BANDENKICK BUBBLE CHALLENGE – ENDLOSKARTE / TESTSYSTEM
 * Datei: js/config/worldMapConfig2.js
 * =========================================================
 *
 * Dieses System läuft absichtlich parallel zur bisherigen Levelkarte.
 * Es ersetzt weder STAGES noch StageMap.
 */

export const WORLD_MAP_CONFIG_2 = {
  enabled: true,

  // Für den ersten Test reichen 100 Level.
  // Später kann dieser Wert praktisch beliebig erhöht werden.
  totalLevels: 100,

  // Alle 10 Level wird ein Stage-Meilenstein gesetzt.
  levelsPerStage: 10,

  // Abstand der Levelpunkte in Pixeln.
  levelSpacing: 132,

  // Zusätzlicher Platz unten / oben.
  bottomPadding: 230,
  topPadding: 320,

// 10 Segmente der Endloskarte.
// Reihenfolge von unten nach oben:
// Stage → Übergang → Stage → Übergang usw.
backgroundImages: [
  "assets/world/world-road-loop1.png",
  "assets/world/world-road-loop2.png",
  "assets/world/world-road-loop3.png",
  "assets/world/world-road-loop4.png",
  "assets/world/world-road-loop5.png",
  "assets/world/world-road-loop6.png",
  "assets/world/world-road-loop7.png",
  "assets/world/world-road-loop8.png",
  "assets/world/world-road-loop9.png",
  "assets/world/world-road-loop10.png"
],

backgroundSegmentHeight: 1400,

  // Positionen auf der Straße in Prozent der Kartenbreite.
  // Das Muster wiederholt sich automatisch.
  roadPattern: [
    50, 42, 35, 40, 51, 62, 68, 60, 48, 38,
    34, 43, 55, 66, 61, 50, 39, 33, 41, 54
  ],

  stageNames: [
    "Bandenkick Arena",
    "World Cup",
    "Tropical Paradise",
    "Pirate Island",
    "Volcano Stadium",
    "Jungle Arena",
    "Royal Kingdom",
    "Dragon Fantasy",
    "Crystal Cave",
    "Monster Stadium"
  ],

  // Besondere Punkte können jederzeit ergänzt werden.
  milestones: [
    { level: 5,  type: "item", icon: "↔", label: "Ball Switch" },
    { level: 10, type: "stage", icon: "🏆", label: "Stage geschafft" },
    { level: 15, type: "item", icon: "🌈", label: "Regenbogenball" },
    { level: 20, type: "stage", icon: "🏆", label: "Stage geschafft" },
    { level: 25, type: "item", icon: "🔍", label: "Zielhilfe" },
    { level: 30, type: "stage", icon: "🏆", label: "Stage geschafft" },
    { level: 35, type: "item", icon: "💣", label: "Bombenball" },
    { level: 40, type: "stage", icon: "🏆", label: "Stage geschafft" },
    { level: 45, type: "item", icon: "⚡", label: "Thunder Ball" },
    { level: 50, type: "stage", icon: "🏆", label: "Stage geschafft" }
  ],

  // Optionale Deko-Objekte neben der Straße.
  decorations: [
    { every: 7, side: "left",  icon: "⚽", scale: 1.00 },
    { every: 9, side: "right", icon: "🏟️", scale: 1.05 },
    { every: 13, side: "left", icon: "🏆", scale: 0.90 },
    { every: 17, side: "right", icon: "⭐", scale: 0.90 }
  ]
};
