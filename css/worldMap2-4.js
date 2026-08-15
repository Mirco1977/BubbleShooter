import { WORLD_MAP_CONFIG_2 as CONFIG } from "../config/worldMapConfig2.js";

console.log("%c[BK DEBUG] FIX 6 DEBUG worldMap2.js GELADEN", "background:#860000;color:#fff;font-weight:bold;padding:4px 8px");
console.log("[BK DEBUG] worldMap2 timestamp", new Date().toISOString());

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
  totalLevels: CONFIG.totalLevels,
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

    console.group("[BK DEBUG] openAfterLevelWin");
    console.log("[BK DEBUG] START", { fromLevel, toLevel, from, to });
    console.log("[BK DEBUG] screen vorhanden", !!this.screen, "viewport", !!this.viewport, "world", !!this.world);
    console.log("[BK DEBUG] progress vor Animation", getProgress());
    console.groupEnd();

    this.progressAnimating = true;

    // Erst alle Kartenassets laden, solange das Ergebnis-Popup noch sichtbar ist.
    console.time("[BK DEBUG] preloadMapAssets");
    await this.preloadMapAssets();
    console.timeEnd("[BK DEBUG] preloadMapAssets");
    console.log("[BK DEBUG] Kartenassets vorgeladen");

    document.querySelector(".app-header")?.classList.add("world2-header-hidden");

    // Karte fuer die Positionsmessung aktivieren, aber noch unsichtbar halten.
    this.screen.style.visibility = "hidden";
    this.screen.classList.remove("hidden");
    this.screen.classList.add("world2-progress-moving");

    this.currentLevel = to;
    this.render();
    console.log("[BK DEBUG] render() fertig", { currentLevel: this.currentLevel, levelNodes: this.world.querySelectorAll(".world2-level").length });

    // WICHTIG: Karte bleibt waehrend der kompletten Punktfahrt FEST stehen.
    // Wir positionieren sie einmal auf dem geschafften Level und scrollen danach
    // bis zum Ende der Animation keinen einzigen Pixel mehr.
    this.scrollToLevel(from, false);
    console.log("[BK DEBUG] Karte auf FROM-Level positioniert", { from, scrollTop: this.viewport.scrollTop });

    await new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    document.querySelectorAll(".screen").forEach(screen => {
      if (screen !== this.screen) screen.classList.add("hidden");
    });

    const prepared = this.prepareProgressMover(from, to);
    console.log("[BK DEBUG] prepareProgressMover RESULT", prepared);

    this.screen.style.visibility = "visible";

    // Ergebnis-Popup darf jetzt verschwinden; die Karte ist fertig aufgebaut.
    document.getElementById("winResultOverlay")?.classList.add("hidden");

    // Einen kurzen sichtbaren Stillstand am Startpunkt erzwingen.
    await new Promise(resolve => requestAnimationFrame(resolve));
    console.log("[BK DEBUG] Karte sichtbar; Animation wird in 350ms gestartet");
    window.setTimeout(() => {
      console.log("[BK DEBUG] 350ms TIMER ausgelöst -> startProgressMover");
      this.startProgressMover(prepared);
    }, 350);
  },

  lockProgressScreen() {
    // Vorhandenen Lock entfernen, falls durch einen abgebrochenen Test noch einer da ist.
    this.unlockProgressScreen();

    const lock = document.createElement("div");
    lock.className = "world2-animation-lock";
    lock.setAttribute("aria-hidden", "true");

    // Lock liegt ueber Toolbar UND Karte. Keine Maus-, Touch- oder Scroll-Eingabe
    // kann die Geometrie waehrend der Testfahrt veraendern.
    this.screen.appendChild(lock);
    this.animationLock = lock;

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    this.previousViewportOverflow = this.viewport.style.overflowY;
    this.previousViewportScrollBehavior = this.viewport.style.scrollBehavior;
    this.previousViewportTouchAction = this.viewport.style.touchAction;

    this.viewport.style.overflowY = "hidden";
    this.viewport.style.scrollBehavior = "auto";
    this.viewport.style.touchAction = "none";
  },

  unlockProgressScreen() {
    this.animationLock?.remove();
    this.animationLock = null;

    if (this.viewport) {
      this.viewport.style.overflowY = this.previousViewportOverflow ?? "";
      this.viewport.style.scrollBehavior = this.previousViewportScrollBehavior ?? "";
      this.viewport.style.touchAction = this.previousViewportTouchAction ?? "";
    }

    if (typeof this.previousBodyOverflow === "string") {
      document.body.style.overflow = this.previousBodyOverflow;
    }

    this.previousBodyOverflow = undefined;
    this.previousViewportOverflow = undefined;
    this.previousViewportScrollBehavior = undefined;
    this.previousViewportTouchAction = undefined;
  },

  prepareProgressMover(fromLevel, toLevel) {
    console.log("[BK DEBUG] prepareProgressMover START", { fromLevel, toLevel });
    const fromNode = this.world.querySelector(
      `.world2-level[data-level="${fromLevel}"]`
    );
    const toNode = this.world.querySelector(
      `.world2-level[data-level="${toLevel}"]`
    );

    console.log("[BK DEBUG] LEVELPUNKTE gefunden", {
      fromLevel,
      fromNodeGefunden: !!fromNode,
      toLevel,
      toNodeGefunden: !!toNode,
      gleichesLevel: fromLevel === toLevel
    });

    if (!fromNode || !toNode || fromLevel === toLevel) {
      console.error("[BK DEBUG] prepareProgressMover ABBRUCH", { fromNode, toNode, fromLevel, toLevel });
      return null;
    }

    const fromOrb = fromNode.querySelector(".world2-level-orb") || fromNode;
    const toOrb = toNode.querySelector(".world2-level-orb") || toNode;

    const viewportRect = this.viewport.getBoundingClientRect();
    const fromRect = fromOrb.getBoundingClientRect();
    const toRect = toOrb.getBoundingClientRect();

    // Feste Pixelkoordinaten INNERHALB des sichtbaren Viewports.
    // Damit sind CSS transform/scale der Levelbuttons fuer die Bewegung irrelevant.
    const startX = fromRect.left + fromRect.width / 2 - viewportRect.left;
    const startY = fromRect.top + fromRect.height / 2 - viewportRect.top;
    const endX = toRect.left + toRect.width / 2 - viewportRect.left;
    const endY = toRect.top + toRect.height / 2 - viewportRect.top;

    console.log("[BK DEBUG] GEMESSENE KOORDINATEN", {
      viewportRect: { left: viewportRect.left, top: viewportRect.top, width: viewportRect.width, height: viewportRect.height },
      fromRect: { left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height },
      toRect: { left: toRect.left, top: toRect.top, width: toRect.width, height: toRect.height },
      startX, startY, endX, endY,
      deltaX: endX - startX, deltaY: endY - startY
    });

    // Der echte neue rote Punkt darf waehrend der Fahrt NICHT sichtbar sein.
    // So existiert visuell garantiert nur genau EIN roter Punkt.
    toNode.style.visibility = "hidden";
    toNode.style.pointerEvents = "none";

    const mover = document.createElement("div");
    mover.className = "world2-progress-mover";
    mover.innerHTML = `
      <span class="world2-progress-mover-orb">
        <span class="world2-progress-mover-number">${fromLevel}</span>
      </span>
    `;

    mover.style.left = `${startX}px`;
    mover.style.top = `${startY}px`;

    // Der Marker liegt innerhalb des Viewports, nicht innerhalb der langen Welt.
    // Dadurch kann Scroll-/Stage-Geometrie seine Flugbahn nicht beeinflussen.
    this.viewport.appendChild(mover);
    console.log("[BK DEBUG] MOVER erzeugt und eingefuegt", {
      connected: mover.isConnected,
      left: mover.style.left,
      top: mover.style.top,
      className: mover.className
    });

    this.lockProgressScreen();
    console.log("[BK DEBUG] SCREEN LOCK aktiv", { lockConnected: !!this.animationLock?.isConnected, viewportOverflowY: this.viewport.style.overflowY });

    // Der Lock wurde nach dem Mover eingefuegt und liegt normal darueber.
    // Mover bewusst auf hoehere Ebene setzen.
    mover.style.zIndex = "1002";

    const distance = Math.hypot(endX - startX, endY - startY);

    console.info("[WorldMap2] SLOW TEST", {
      fromLevel,
      toLevel,
      startX,
      startY,
      endX,
      endY,
      distance
    });

    return {
      fromLevel,
      toLevel,
      toNode,
      mover,
      startX,
      startY,
      endX,
      endY
    };
  },

  startProgressMover(prepared) {
    console.log("[BK DEBUG] startProgressMover AUFGERUFEN", {
      preparedVorhanden: !!prepared,
      moverVorhanden: !!prepared?.mover,
      moverConnected: !!prepared?.mover?.isConnected,
      toNodeVorhanden: !!prepared?.toNode,
      progressAnimating: this.progressAnimating
    });

    if (!prepared?.mover || !prepared?.toNode) {
      console.error("[BK DEBUG] ANIMATION KANN NICHT STARTEN", prepared);
      this.finishProgressMover(prepared);
      return;
    }

    const { mover, startX, startY, endX, endY } = prepared;

    // ABSICHTLICH SEHR LANGSAM zum Testen.
    // Spaeter kann nur diese Zahl reduziert werden, z.B. 1600 oder 2200 ms.
    const duration = 8000;
    const startedAt = performance.now();

    console.log("[BK DEBUG] ANIMATION START", {
      fromLevel: prepared.fromLevel,
      toLevel: prepared.toLevel,
      startX, startY, endX, endY, duration, startedAt
    });

    this.preparedProgress = prepared;
    let debugQuarter = -1;

    const easeInOut = (t) =>
      t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const tick = (now) => {
      if (!this.progressAnimating || this.preparedProgress !== prepared) return;

      const raw = clamp((now - startedAt) / duration, 0, 1);
      const eased = easeInOut(raw);

      const x = startX + (endX - startX) * eased;
      const y = startY + (endY - startY) * eased;

      mover.style.left = `${x}px`;
      mover.style.top = `${y}px`;

      const quarter = Math.min(4, Math.floor(raw * 4));
      if (quarter !== debugQuarter) {
        debugQuarter = quarter;
        console.log(`[BK DEBUG] RAF ${quarter * 25}%`, { raw, eased, x, y, connected: mover.isConnected, visibility: getComputedStyle(mover).visibility, display: getComputedStyle(mover).display, opacity: getComputedStyle(mover).opacity });
      }

      if (raw < 1) {
        this.progressRaf = requestAnimationFrame(tick);
      } else {
        this.finishProgressMover(prepared);
      }
    };

    this.progressRaf = requestAnimationFrame(tick);
  },

  finishProgressMover(prepared) {
    console.log("[BK DEBUG] finishProgressMover AUFGERUFEN", {
      preparedVorhanden: !!prepared,
      currentLevel: this.currentLevel,
      progressAnimating: this.progressAnimating
    });
    if (this.progressRaf) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }

    const data = prepared || this.preparedProgress;
    const level = data?.toLevel || this.currentLevel;

    data?.mover?.remove();

    if (data?.toNode) {
      data.toNode.style.visibility = "";
      data.toNode.style.pointerEvents = "";

      // Erst JETZT beginnt wieder der normale Puls des echten aktuellen Levels.
      const orb = data.toNode.querySelector(".world2-level-orb");
      if (orb) orb.style.animation = "";
    }

    this.preparedProgress = null;
    this.unlockProgressScreen();

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
        2600
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
