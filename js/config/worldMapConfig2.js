/*
 * =========================================================
 * BANDENKICK BUBBLE CHALLENGE – ENDLOSKARTE 2
 * EINZELNE LANGE COMIC-WELTKARTE
 * =========================================================
 *
 * Nur dieses neue Endloskarten-System wird gesteuert.
 * Die alte StageMap bleibt unangetastet.
 */

export const WORLD_MAP_CONFIG_2 = {
  enabled: true,

  totalLevels: 100,
  levelsPerStage: 10,

  levelSpacing: 82,
  stageGap: -80,
  bottomPadding: 200,
  topPadding: 320,

  /*
   * EINE lange Karte.
   * 530 x 6600 und oben/unten loopfähig.
   * Sie wiederholt sich automatisch vertikal.
   */
  backgroundImage: "assets/world/world-road-long.svg",
  backgroundSegmentHeight: 6000,

  /*
   * 50 Positionen = exakt ein kompletter Hintergrund-Zyklus.
   * Danach wiederholt sich das Muster.
   */
  roadPattern: [62.6, 62.7, 57.4, 49.7, 43.8, 42.7, 46.4, 52.5, 57.0, 56.8, 51.6, 44.0, 37.9, 36.9, 41.9, 50.7, 59.2, 63.3, 61.4, 54.9, 47.3, 42.8, 43.5, 48.4, 54.4, 57.5, 55.6, 49.2, 41.6, 36.9, 38.0, 44.6, 53.8, 61.2, 63.3, 59.6, 52.2, 45.3, 42.5, 44.8, 50.5, 55.9, 57.5, 53.8, 46.6, 39.5, 36.6, 39.7, 47.6, 56.7],

stageLayouts: {
  first: {
    image: "assets/world/stages/world-stage-01.png",
    height: 1600,

    roadPattern: [
      50, 43, 55, 64, 51,
      39, 50, 63, 53, 43
    ]
  },

  standard: {
    image: "assets/world/stages/world-stage-standard.png",
    height: 1000,

    roadPattern: [
      50, 43, 55, 64, 51,
      39, 50, 63, 53, 43
    ]
  }
},

  stages: [
    {
      name: "Bandenkick Arena",
      logo: "assets/logos/LigaLogoBordered.png",
      accent: "#860000"
    },
    {
      name: "World Cup",
      logo: "assets/logos/WM-Pokal.png",
      accent: "#d2a62b"
    },
    {
      name: "Tropical Paradise",
      logo: "assets/logos/Wasser-surfer.png",
      accent: "#2f8fbd"
    },
    {
      name: "Volcano Stadium",
      logo: "assets/logos/volcano.png",
      accent: "#d55428"
    },
    {
      name: "Pirate Island",
      logo: "assets/logos/pirate.png",
      accent: "#9a7132"
    },
    {
      name: "Jungle Arena",
      logo: "assets/logos/dragon.png",
      accent: "#2e8b57"
    },
    {
      name: "Royal Kingdom",
      logo: "assets/logos/kingdom.png",
      accent: "#d4af37"
    },
    {
      name: "Dragon Fantasy",
      logo: "assets/logos/dragon.png",
      accent: "#8b0000"
    },
    {
      name: "Crystal Cave",
      logo: "assets/logos/crystal.png",
      accent: "#557ee8"
    },
    {
      name: "Monster Stadium",
      logo: "assets/logos/monster.png",
      accent: "#6b8e23"
    }

  ],

  /*
   * Nur echte Sonderpunkte.
   * Stage-Logos werden separat automatisch am Stage-Start angezeigt.
   */
  milestones: [
    { level: 5,  type: "item", icon: "↔", label: "Ball Switch" },
    { level: 15, type: "item", icon: "🌈", label: "Regenbogenball" },
    { level: 25, type: "item", icon: "🔍", label: "Zielhilfe" },
    { level: 35, type: "item", icon: "💣", label: "Bombenball" },
    { level: 45, type: "item", icon: "⚡", label: "Thunder Ball" }
  ]
};
