import { WORLD_MAP_CONFIG_2 as CONFIG } from "../config/worldMapConfig2.js";

const $ = (id) => document.getElementById(id);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getProgress() {
  if (typeof window.BK_getMainProgress === "function") {
    const p = window.BK_getMainProgress();
    if (p) return p;
  }

  return {
    unlockedLevel: 1,
    results: {}
  };
}

function getStars(result) {
  return clamp(Number(result?.stars || 0), 0, 3);
}

function getStageIndex(level) {
  return Math.floor((level - 1) / CONFIG.levelsPerStage);
}

function getStage(level) {
  const index = getStageIndex(level);
  return CONFIG.stages[index % CONFIG.stages.length] || {
    name: `Stage ${index + 1}`,
    logo: "",
    accent: "#860000"
  };
}

const WorldMap2 = {
  screen: null,
  viewport: null,
  world: null,
  currentLevel: 1,
  initialized: false,

  init() {
    if (!CONFIG.enabled || this.initialized) return;

    this.screen = $("worldMap2Screen");
    this.viewport = $("worldMap2Viewport");
    this.world = $("worldMap2World");

    if (!this.screen || !this.viewport || !this.world) {
      console.warn("[WorldMap2] HTML-Elemente fehlen.");
      return;
    }

    $("openWorldMap2Button")?.addEventListener("click", () => this.open());
    $("worldMap2BackButton")?.addEventListener("click", () => this.close());

    $("worldMap2ToCurrent")?.addEventListener("click", () => {
      this.scrollToCurrent(true);
    });

    this.initialized = true;
  },

  open() {
    const progress = getProgress();

    this.currentLevel = clamp(
      Number(progress.unlockedLevel || 1),
      1,
      CONFIG.totalLevels
    );

    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.add("hidden");
    });

    this.screen.classList.remove("hidden");

    this.render();

    requestAnimationFrame(() => {
      this.scrollToCurrent(false);
    });
  },

  close() {
    this.screen.classList.add("hidden");
    $("homeScreen")?.classList.remove("hidden");
  },

  render() {
    const progress = getProgress();

    const unlockedLevel = clamp(
      Number(progress.unlockedLevel || 1),
      1,
      CONFIG.totalLevels
    );

    this.currentLevel = unlockedLevel;

    const totalHeight =
      CONFIG.bottomPadding +
      CONFIG.topPadding +
      (CONFIG.totalLevels - 1) * CONFIG.levelSpacing;

    this.world.style.height = `${totalHeight}px`;

    /*
     * Eine einzige lange Karte.
     * CSS wiederholt sie automatisch nach oben.
     */
// Die alte eine Hintergrundgrafik wird nicht mehr
// über die komplette Endloskarte gelegt.
this.world.style.backgroundImage = "none";

this.world.innerHTML = "";

// Wiederverwendbare 10-Level-Gerüste zeichnen
this.renderStageBackgrounds();

this.renderStageMarkers(progress);

    for (let level = 1; level <= CONFIG.totalLevels; level++) {
      this.renderLevel(level, progress);
      this.renderMilestones(level, progress);
    }

    const stageNo =
      Math.floor((unlockedLevel - 1) / CONFIG.levelsPerStage) + 1;

    const stage = getStage(unlockedLevel);

    $("worldMap2StageLabel").textContent =
      `Stage ${stageNo} · ${stage.name}`;

    $("worldMap2ProgressLabel").textContent =
      `Aktuell Level ${unlockedLevel}`;
  },

  renderStageBackgrounds() {

  const stageCount =
    Math.ceil(
      CONFIG.totalLevels / CONFIG.levelsPerStage
    );

  for (
    let stageIndex = 0;
    stageIndex < stageCount;
    stageIndex++
  ) {

    /*
     * GERÜST 1 erscheint bei:
     *
     * Level 1–10
     * Level 101–110
     * Level 201–210
     * usw.
     */
    const layoutNumber =
      (stageIndex % 10) + 1;

    

    const firstLevel =
      stageIndex * CONFIG.levelsPerStage + 1;

    const block =
      document.createElement("div");

    block.className =
      "world2-stage-background";

    const isFirstStage = stageIndex === 0;

const layout = isFirstStage
  ? CONFIG.stageLayouts.first
  : CONFIG.stageLayouts.standard;

const blockHeight = layout.height;

let blockBottom;

if (isFirstStage) {
  blockBottom = 0;
} else {
  blockBottom =
    CONFIG.stageLayouts.first.height +
    ((stageIndex - 1) * CONFIG.stageLayouts.standard.height);
}

block.style.position = "absolute";
block.style.left = "0";
block.style.width = "100%";

block.style.height =
  `${blockHeight}px`;

block.style.bottom =
  `${blockBottom}px`;

  
    block.style.backgroundImage =
      `url("${layout.image}")`;

    block.style.backgroundSize =
      "100% 100%";

    block.style.backgroundRepeat =
      "no-repeat";

    block.style.backgroundPosition =
      "center bottom";

    block.style.pointerEvents =
      "none";

    block.style.zIndex =
      "0";

    this.world.appendChild(block);
  }

},

 yForLevel(level) {

  const stageIndex =
    Math.floor((level - 1) / CONFIG.levelsPerStage);

  const localLevelIndex =
    (level - 1) % CONFIG.levelsPerStage;

  // Stage 1 = Sonderbild
  if (stageIndex === 0) {
    return (
      CONFIG.bottomPadding +
      (localLevelIndex * CONFIG.levelSpacing)
    );
  }

  // Ab Stage 2 immer gleicher Startpunkt im Standardbild,
  // aber mit EINEM festen Extra-Abstand zwischen den 10er-Blöcken.
  const blockBottom =
    CONFIG.stageLayouts.first.height +
    ((stageIndex - 1) * CONFIG.stageLayouts.standard.height);

  return (
    blockBottom +
    CONFIG.stageGap +
    CONFIG.bottomPadding +
    (localLevelIndex * CONFIG.levelSpacing)
  );
},

xForLevel(level) {

  const index =
    (level - 1) % 10;

  const layout =
    level <= 10
      ? CONFIG.stageLayouts.first
      : CONFIG.stageLayouts.standard;

  return layout.roadPattern[index];
},

  renderStageMarkers(progress) {
    const stageCount =
      Math.ceil(CONFIG.totalLevels / CONFIG.levelsPerStage);

    for (let stageIndex = 0; stageIndex < stageCount; stageIndex++) {
      const stageNo = stageIndex + 1;
      const firstLevel =
        stageIndex * CONFIG.levelsPerStage + 1;

      if (firstLevel > CONFIG.totalLevels) break;

      const stage =
        CONFIG.stages[stageIndex % CONFIG.stages.length];

      const marker = document.createElement("div");
      marker.className = "world2-stage-marker";

      const x = this.xForLevel(firstLevel);

      /*
       * Logo bewusst seitlich neben der Straße.
       * Wechselt automatisch links/rechts.
       */
      const sideLeft = stageIndex % 2 === 0;

      marker.classList.add(sideLeft ? "left" : "right");

      marker.style.bottom =
        `${this.yForLevel(firstLevel) + 54}px`;

      marker.style.setProperty(
        "--stage-accent",
        stage.accent || "#860000"
      );

      marker.innerHTML = `
        <div class="world2-stage-logo-wrap">
          ${stage.logo
            ? `<img class="world2-stage-logo"
                    src="${stage.logo}"
                    alt="${stage.name}"
                    draggable="false">`
            : ""}
        </div>

        <div class="world2-stage-copy">
          <span>STAGE ${stageNo}</span>
          <strong>${stage.name}</strong>
        </div>
      `;

      this.world.appendChild(marker);
    }
  },

  renderLevel(level, progress) {
    const unlockedLevel =
      Number(progress.unlockedLevel || 1);

    const result =
      (progress.results || {})[level];

    const unlocked =
      level <= unlockedLevel;

    const completed =
      Boolean(result);

    const current =
      level === unlockedLevel;

    const node =
      document.createElement("button");

    node.type = "button";
    node.className = "world2-level";
    node.dataset.level = String(level);

    if (completed) node.classList.add("completed");
    if (current) node.classList.add("current");
    if (!unlocked) node.classList.add("locked");

    node.style.left =
      `${this.xForLevel(level)}%`;

    node.style.bottom =
      `${this.yForLevel(level)}px`;

    const stars = getStars(result);

    node.innerHTML = `
      <span class="world2-level-orb">
        <span class="world2-level-number">
          ${unlocked ? level : "🔒"}
        </span>
      </span>

      <span
        class="world2-stars"
        aria-label="${stars} Sterne">
        ${
          completed
            ? `${"★".repeat(stars)}${"☆".repeat(3 - stars)}`
            : ""
        }
      </span>
    `;

    if (!unlocked) {
      node.disabled = true;
      node.setAttribute(
        "aria-label",
        `Level ${level} gesperrt`
      );
    } else {
      node.setAttribute(
        "aria-label",
        `Level ${level} öffnen`
      );

      node.addEventListener(
        "click",
        () => this.openLevel(level)
      );
    }

    this.world.appendChild(node);
  },

  renderMilestones(level, progress) {
    const entries =
      CONFIG.milestones.filter(
        milestone => milestone.level === level
      );

    if (!entries.length) return;

    entries.forEach((entry, i) => {
      const el = document.createElement("div");

      el.className =
        `world2-milestone ${entry.type || ""}`;

      const passed =
        Number(progress.unlockedLevel || 1) > level;

      if (passed) {
        el.classList.add("passed");
      }

      const x =
        this.xForLevel(level);

      const side =
        x < 50 ? 1 : -1;

      const offset =
        23 + i * 12;

      el.style.left =
        `${clamp(x + side * offset, 12, 88)}%`;

      el.style.bottom =
        `${this.yForLevel(level) + 18}px`;

      el.innerHTML = `
        <span class="world2-milestone-icon">
          ${entry.icon || "★"}
        </span>

        <span class="world2-milestone-text">
          ${entry.label || ""}
        </span>
      `;

      this.world.appendChild(el);
    });
  },

  openLevel(level) {
    if (typeof window.BK_openMainLevel === "function") {
      window.BK_openMainLevel(level);
      return;
    }

    const hint = $("worldMap2Hint");

    if (hint) {
      hint.textContent =
        `Level ${level} ist anklickbar.`;

      hint.classList.add("show");

      clearTimeout(this.hintTimer);

      this.hintTimer = setTimeout(
        () => hint.classList.remove("show"),
        3200
      );
    }
  },

  scrollToCurrent(smooth = true) {
    const node =
      this.world.querySelector(
        `.world2-level[data-level="${this.currentLevel}"]`
      );

    if (!node) return;

    const viewportHeight =
      this.viewport.clientHeight;

    const nodeBottom =
      parseFloat(node.style.bottom || "0");

    const worldHeight =
      this.world.clientHeight;

    const nodeTop =
      worldHeight -
      nodeBottom -
      node.offsetHeight / 2;

    const target =
      clamp(
        nodeTop - viewportHeight * 0.62,
        0,
        Math.max(0, worldHeight - viewportHeight)
      );

    this.viewport.scrollTo({
      top: target,
      behavior: smooth ? "smooth" : "auto"
    });
  }
};

function boot() {
  WorldMap2.init();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    boot,
    { once: true }
  );
} else {
  boot();
}

window.WorldMap2 = WorldMap2;
