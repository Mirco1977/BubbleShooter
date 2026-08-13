(function () {
  function getInfo(level) {
    const cfg = window.BK_WORLD_MAP_CONFIG;
    if (!cfg) return null;
    const layoutNo = cfg.getLayoutNumber(level);
    const start = cfg.getStageStart(level);
    return {
      level,
      layoutNo,
      cycle: cfg.getCycleNumber(level),
      start,
      end: start + 9,
      layout: cfg.layouts[layoutNo] || null
    };
  }

  window.BKWorldMapStageSystem = {
    getInfo,

    applyStageBackground(element, level) {
      const data = getInfo(level);
      if (!element || !data || !data.layout) return false;
      element.style.backgroundImage = 'url("' + data.layout.image + '")';
      element.dataset.worldLayout = String(data.layoutNo);
      element.dataset.worldCycle = String(data.cycle);
      return true;
    }
  };
})();