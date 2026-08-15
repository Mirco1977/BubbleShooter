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
  progressAnimating: false,
  assetReadyPromise: null,

getMapScale() {
    if (!this.world) return 1;

    const width = this.world.clientWidth || CONFIG.baseWidth;

    return Math.min(
      1,
      width / CONFIG.baseWidth
    );
  },

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

    // Kartenbilder frühzeitig in den Browser-Cache laden. Dadurch gibt es
    // beim Rücksprung aus einem gewonnenen Level keinen blauen Leerzustand.
    this.preloadMapAssets();

    this.initialized = true;
  },

  preloadMapAssets() {
    if (this.assetReadyPromise) return this.assetReadyPromise;

    const urls = new Set();

    if (CONFIG.stageLayouts?.first?.image) {
      urls.add(CONFIG.stageLayouts.first.image);
    }

    if (CONFIG.stageLayouts?.standard?.image) {
      urls.add(CONFIG.stageLayouts.standard.image);
    }

    (CONFIG.stages || []).forEach(stage => {
      if (stage?.logo) urls.add(stage.logo);
    });

    this.assetReadyPromise = Promise.all(
      [...urls].map(url => new Promise(resolve => {
        const img = new Image();
        img.onload = async () => {
          try {
            if (typeof img.decode === "function") await img.decode();
          } catch (_) {}
          resolve();
        };
        img.onerror = resolve;
        img.src = url;
        if (img.complete) img.onload();
      }))
    );

    return this.assetReadyPromise;
  },

  open() {
    const progress = getProgress();
    document.querySelector(".app-header")?.classList.add("world2-header-hidden");

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

  document.querySelector(".app-header")?.classList.remove("world2-header-hidden");
},

  render() {
    const progress = getProgress();

    const unlockedLevel = clamp(
      Number(progress.unlockedLevel || 1),
      1,
      CONFIG.totalLevels
    );

    this.currentLevel = unlockedLevel;

    const scale = this.getMapScale();

const totalHeight =
  (
    CONFIG.bottomPadding +
    CONFIG.topPadding +
    (CONFIG.totalLevels - 1) * CONFIG.levelSpacing
  ) * scale;

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

const scale = this.getMapScale();
const blockHeight = layout.height * scale;

let blockBottom;

if (isFirstStage) {
  blockBottom = 0;
} else {
  blockBottom =
    (
      CONFIG.stageLayouts.first.height +
      ((stageIndex - 1) * CONFIG.stageLayouts.standard.height)
    ) * scale;
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

  const scale = this.getMapScale();

  const stageIndex =
    Math.floor((level - 1) / CONFIG.levelsPerStage);

  const localLevelIndex =
    (level - 1) % CONFIG.levelsPerStage;

  // Stage 1
  if (stageIndex === 0) {
    return (
      CONFIG.bottomPadding -50 +
      (localLevelIndex * CONFIG.levelSpacing)
    ) * scale;
  }

  // Ab Stage 2
  const blockBottom =
    CONFIG.stageLayouts.first.height +
    ((stageIndex - 1) * CONFIG.stageLayouts.standard.height);

  return (
    blockBottom +
    CONFIG.stageGap +
    CONFIG.bottomPadding +
    (localLevelIndex * CONFIG.levelSpacing)
  ) * scale;
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
      if (stageNo === 1) {
        marker.classList.add("stage-1");
      }

      const scale = this.getMapScale();

/*
 * Stage-Logo immer an derselben festen Position
 * innerhalb jedes 10-Level-Bildes.
 */
marker.classList.add("fixed");

/*
 * Unterkante des jeweiligen Stage-Bildes bestimmen.
 */
let stageBottom;

if (stageIndex === 0) {
  stageBottom = 0;
} else {
  stageBottom =
    (
      CONFIG.stageLayouts.first.height +
      ((stageIndex - 1) * CONFIG.stageLayouts.standard.height)
    ) * scale;
}

/*
 * Feste vertikale Position innerhalb des Stage-Bildes.
 */
marker.style.bottom =
  `${stageBottom + (180 * scale)}px`;

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

  getMilestoneImage(level) {
  const images = {
    5:  "assets/ui/ballswitch.png",
    15: "assets/ui/rainbow-ball.png",
    25: "assets/ui/lupe.png",
    35: "assets/ui/bomb-ball.png",
    45: "assets/ui/thunder-ball.png"
  };

  return images[level] || "";
},

  renderMilestones(level, progress) {

  const entries =
    CONFIG.milestones.filter(
      milestone => milestone.level === level
    );

  if (!entries.length) return;

  const scale = this.getMapScale();

  const stageIndex =
    Math.floor((level - 1) / CONFIG.levelsPerStage);

  let stageBottom;

  if (stageIndex === 0) {
    stageBottom = 0;
  } else {
    stageBottom =
      (
        CONFIG.stageLayouts.first.height +
        ((stageIndex - 1) * CONFIG.stageLayouts.standard.height)
      ) * scale;
  }

  entries.forEach((entry) => {

    /* =========================
       NEXT-ITEM PNG LINKS
       ========================= */

    const nextItem =
      document.createElement("div");

    nextItem.className =
      "world2-next-item";

    if (stageIndex === 0) {
  // FIRST STAGE
  nextItem.style.left = "35%";
  nextItem.style.bottom =
    `${stageBottom + (400 * scale)}px`;
} else {
  // STANDARD STAGES
  nextItem.style.left = "35%";
  nextItem.style.bottom =
    `${stageBottom + (350 * scale)}px`;
}

    nextItem.innerHTML = `
      <img
        src="assets/ui/next-item.png"
        alt=""
        draggable="false">
    `;

    this.world.appendChild(nextItem);


    /* =========================
       EIGENTLICHES ITEM RECHTS
       ========================= */

    const el =
      document.createElement("div");

    el.className =
      `world2-milestone ${entry.type || ""}`;

    const passed =
      Number(progress.unlockedLevel || 1) > level;

    if (passed) {
      el.classList.add("passed");
    }

    if (stageIndex === 0) {
  // FIRST STAGE
  el.style.left = "70%";
  el.style.bottom =
    `${stageBottom + (500 * scale)}px`;
} else {
  // STANDARD STAGES
  el.style.left = "70%";
  el.style.bottom =
    `${stageBottom + (475 * scale)}px`;
}

    const itemImage = this.getMilestoneImage(level);

    el.innerHTML = `
      <span class="world2-milestone-icon">
        ${itemImage
          ? `<img
              src="${itemImage}"
              alt="${entry.label || "Item"}"
              draggable="false">`
          : ""}
      </span>

      <span class="world2-milestone-text">
        ${entry.label || ""}
      </span>
    `;

    this.world.appendChild(el);
  });
},

  async openAfterLevelWin(fromLevel, toLevel) {
    const from = clamp(Number(fromLevel || 1), 1, CONFIG.totalLevels);
    const to = clamp(Number(toLevel || from), 1, CONFIG.totalLevels);

    this.progressAnimating = true;

    // Karte + Bilder vorbereiten, WAehrend das Ergebnis-Popup noch sichtbar ist.
    // Dadurch gibt es beim Umschalten keinen blauen/leeren Zwischenframe mehr.
    await this.preloadMapAssets();

    document.querySelector(".app-header")?.classList.add("world2-header-hidden");

    // Endloskarte fuer Layout-Berechnung aktivieren, aber noch unsichtbar halten.
    this.screen.style.visibility = "hidden";
    this.screen.classList.remove("hidden");
    this.screen.classList.add("world2-progress-moving");

    this.currentLevel = to;
    this.render();

    // Die Karte wird auf das gerade geschaffte Level gesetzt. Kein Smooth-Scroll.
    this.scrollToLevel(from, false);

    // Zwei Paint-Zyklen abwarten, damit Hintergrund und Levelpunkte wirklich
    // ihre finalen Bildschirmpositionen haben.
    await new Promise(resolve =>
      requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      )
    );

    // Jetzt erst alle anderen Screens ausblenden. Bis hierhin blieb das
    // Ergebnis-Popup sichtbar und verdeckte den Kartenaufbau.
    document.querySelectorAll(".screen").forEach(screen => {
      if (screen !== this.screen) screen.classList.add("hidden");
    });

    this.prepareProgressPoint(from, to);

    this.screen.style.visibility = "visible";

    // Einen Frame sichtbar am Startpunkt stehen lassen, dann losfahren.
    await new Promise(resolve => requestAnimationFrame(resolve));
    this.startPreparedProgressPoint(from, to);
  },

  prepareProgressPoint(fromLevel, toLevel) {
    const fromNode = this.world.querySelector(
      `.world2-level[data-level="${fromLevel}"]`
    );
    const toNode = this.world.querySelector(
      `.world2-level[data-level="${toLevel}"]`
    );

    if (!fromNode || !toNode || fromLevel === toLevel) {
      this.preparedProgress = null;
      return;
    }

    const fromOrb = fromNode.querySelector(".world2-level-orb") || fromNode;
    const toOrb = toNode.querySelector(".world2-level-orb") || toNode;

    const fromRect = fromOrb.getBoundingClientRect();
    const toRect = toOrb.getBoundingClientRect();

    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;

    const dx = fromX - toX;
    const dy = fromY - toY;

    // WICHTIG: Kein zusaetzlicher Ghost-Punkt mehr. Der ECHTE rote neue
    // Levelpunkt wird optisch auf die Position des alten Levels gesetzt und
    // faehrt von dort zu seiner echten Zielposition. Somit kann nie ein zweiter
    // roter Punkt am Ziel stehen oder eine Gegenbewegung entstehen.
    toNode.style.zIndex = "60";
    toNode.style.pointerEvents = "none";
    toNode.style.transform =
      `translateX(-50%) translate(${dx}px, ${dy}px) scale(.78)`;
    toNode.style.willChange = "transform";

    const orb = toNode.querySelector(".world2-level-orb");
    if (orb) orb.style.animation = "none";

    // Karte waehrend der Fahrt hart sperren. Nicht nur per CSS, damit der Fix
    // auch dann funktioniert, wenn der Browser noch eine alte CSS-Datei cached.
    this.viewport.style.overflowY = "hidden";
    this.viewport.style.scrollBehavior = "auto";
    this.viewport.style.touchAction = "none";

    this.preparedProgress = { toNode, orb, dx, dy, toLevel };
  },

  startPreparedProgressPoint(fromLevel, toLevel) {
    const prepared = this.preparedProgress;

    if (!prepared || !prepared.toNode) {
      this.finishProgressAnimation(toLevel);
      return;
    }

    const { toNode } = prepared;

    // Web-Animations-API statt left/top-CSS-Transition. Transform laeuft in
    // einem einzigen Koordinatensystem und kann deshalb nicht scheinbar
    // rueckwaerts springen, wenn die Karte skaliert ist.
    const animation = toNode.animate(
      [
        {
          transform: toNode.style.transform,
          offset: 0
        },
        {
          transform: "translateX(-50%) translate(0px, 0px) scale(.78)",
          offset: 1
        }
      ],
      {
        duration: 1050,
        easing: "cubic-bezier(.22,.72,.20,1)",
        fill: "forwards"
      }
    );

    this.progressAnimation = animation;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      this.finishProgressAnimation(toLevel);
    };

    animation.addEventListener("finish", finish, { once: true });
    animation.addEventListener("cancel", finish, { once: true });
    window.setTimeout(finish, 1400);
  },

  finishProgressAnimation(level) {
    const prepared = this.preparedProgress;
    const target = prepared?.toNode || this.world.querySelector(
      `.world2-level[data-level="${level}"]`
    );

    try {
      this.progressAnimation?.cancel();
    } catch (_) {}

    this.progressAnimation = null;

    if (target) {
      // Endzustand exakt auf die normale Kartenposition zuruecksetzen.
      target.style.transform = "";
      target.style.willChange = "";
      target.style.pointerEvents = "";
      target.style.zIndex = "";

      const orb = target.querySelector(".world2-level-orb");
      if (orb) orb.style.animation = "";

      // Kurzer, ruhiger Ankunftsimpuls direkt auf dem echten Zielpunkt.
      try {
        target.animate(
          [
            { transform: "translateX(-50%) scale(.78)" },
            { transform: "translateX(-50%) scale(.88)" },
            { transform: "translateX(-50%) scale(.78)" }
          ],
          { duration: 380, easing: "ease-out" }
        );
      } catch (_) {}
    }

    this.preparedProgress = null;

    this.viewport.style.overflowY = "";
    this.viewport.style.scrollBehavior = "";
    this.viewport.style.touchAction = "";

    this.progressAnimating = false;
    this.screen.classList.remove("world2-progress-moving");
    this.currentLevel = level;

    const hint = $("worldMap2Hint");
    if (hint) {
      hint.textContent = `Level ${level} freigeschaltet – roten Punkt antippen.`;
      hint.classList.add("show");
      clearTimeout(this.hintTimer);
      this.hintTimer = window.setTimeout(
        () => hint.classList.remove("show"),
        2200
      );
    }
  },

  scrollToLevel(level, smooth = true) {
    const node = this.world.querySelector(
      `.world2-level[data-level="${level}"]`
    );

    if (!node) return;

    const viewportHeight = this.viewport.clientHeight;
    const nodeBottom = parseFloat(node.style.bottom || "0");
    const worldHeight = this.world.clientHeight;
    const nodeTop = worldHeight - nodeBottom - node.offsetHeight / 2;

    const target = clamp(
      nodeTop - viewportHeight * 0.62,
      0,
      Math.max(0, worldHeight - viewportHeight)
    );

    this.viewport.scrollTo({
      top: target,
      behavior: smooth ? "smooth" : "auto"
    });
  },

  openLevel(level) {
    if (this.progressAnimating) return;

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
    this.scrollToLevel(this.currentLevel, smooth);
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
