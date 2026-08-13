window.BK_WORLD_MAP_CONFIG = {
  levelsPerStage: 10,
  layoutsPerCycle: 10,

  getLayoutNumber(level) {
    const block = Math.floor((Math.max(1, level) - 1) / 10);
    return (block % 10) + 1;
  },

  getCycleNumber(level) {
    return Math.floor((Math.max(1, level) - 1) / 100) + 1;
  },

  getStageStart(level) {
    return Math.floor((Math.max(1, level) - 1) / 10) * 10 + 1;
  },

  layouts: {
    1: {
      name: "Bandenkick Arena",
      image: "assets/world/stages/world-stage-01.png"
    }
  }
};