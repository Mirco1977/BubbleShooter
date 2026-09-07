import { WORLD_MAP_CONFIG_2 as CONFIG } from "../config/worldMapConfig2.js";
import { getWorldMapPlayers } from "../api/bandenkickSupabase.js?v=20260831-worldmap-players";


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

    // MOBILE-SCROLL-FIX:
    // Falls eine Fortschrittsanimation durch Navigation/Browserzustand
    // unterbrochen wurde, kann auf Touch-Geraeten ein altes
    // touchAction: none zurueckbleiben. Mausrad-Scrolling am Laptop
    // funktioniert dann weiterhin, Touch-Scrolling auf dem Handy aber nicht.
    // Beim normalen Oeffnen der Karte stellen wir deshalb garantiert den
    // scrollbaren Grundzustand wieder her.
    this.ensureViewportScrollable();

    this.render();
    this.loadPlayerMarkers();

    requestAnimationFrame(() => {
      this.ensureViewportScrollable();
      this.scrollToCurrent(false);
    });
  },

  close() {
  this.screen.classList.add("hidden");
  $("homeScreen")?.classList.remove("hidden");

  document.querySelector(".app-header")?.classList.remove("world2-header-hidden");
},

  ensureViewportScrollable() {
    if (!this.viewport || this.progressAnimating) return;

    // Eventuell liegengebliebenen Animations-Lock entfernen.
    this.animationLock?.remove();
    this.animationLock = null;
    this.screen?.classList.remove("world2-progress-moving");

    // Wichtig fuer Samsung Browser / Android Chromium:
    // touch-action:none blockiert Finger-Scrolling, waehrend das Mausrad am
    // Desktop trotzdem funktionieren kann. Darum hier explizit pan-y setzen.
    this.viewport.style.overflowY = "auto";
    this.viewport.style.touchAction = "pan-y";
    this.viewport.style.scrollBehavior = "smooth";

    // Ein alter Body-Lock darf nach einer abgeschlossenen/unterbrochenen
    // Kartenanimation nicht bestehen bleiben.
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
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

const stageCount =
  Math.ceil(CONFIG.totalLevels / CONFIG.levelsPerStage);

const totalHeight =
  (
    CONFIG.stageLayouts.first.height +
    Math.max(0, stageCount - 1) * CONFIG.stageLayouts.standard.height +
    CONFIG.topPadding
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

  async loadPlayerMarkers() {
    if (!this.world) return;

    this.world.querySelectorAll(".world2-player-marker").forEach(el => el.remove());

    try {
      const data = await getWorldMapPlayers();
      const players = Array.isArray(data?.players) ? data.players : [];
      const byLevel = new Map();

      players.forEach(player => {
        const level = Number(player?.current_level) || 0;
        if (level < 1 || level > CONFIG.totalLevels) return;
        if (!byLevel.has(level)) byLevel.set(level, []);
        byLevel.get(level).push(player);
      });

      byLevel.forEach((levelPlayers, level) => {
        const node = this.world.querySelector(`.world2-level[data-level="${level}"]`);
        if (!node) return;
        this.addPlayerMarker(node, levelPlayers);
      });
    } catch (error) {
      console.warn("[WorldMap2] Spielerpositionen konnten nicht geladen werden:", error);
    }
  },

  getCrestUrls(crestValue) {
    const raw = String(crestValue || "").trim();
    if (!raw) return { primary: "", fallback: "" };
    if (/^https?:\/\//i.test(raw)) return { primary: raw, fallback: "" };

    const clean = raw.replace(/^\/+/, "");
    if (clean.startsWith("storage/")) {
      return {
        primary: `https://bandenkick.de/${clean}`,
        fallback: `https://bandenkick.de/${clean.replace(/^storage\//, "")}`
      };
    }
    return {
      primary: `https://bandenkick.de/storage/${clean}`,
      fallback: `https://bandenkick.de/${clean}`
    };
  },

  addPlayerMarker(levelNode, players) {
    const cleanPlayers = players
      .filter(player => String(player?.username || "").trim())
      .sort((a, b) => String(a.username).localeCompare(String(b.username), "de"));
    if (!cleanPlayers.length) return;

    const teamKeys = new Set();
    let allHaveSameTeam = true;
    cleanPlayers.forEach(player => {
      const isBandenkick = String(player?.account_type || "").toLowerCase() === "bandenkick";
      const teamId = Number(player?.team_id) || 0;
      if (!isBandenkick || !teamId) allHaveSameTeam = false;
      else teamKeys.add(teamId);
    });
    allHaveSameTeam = allHaveSameTeam && teamKeys.size === 1;

    const marker = document.createElement("span");
    marker.className = "world2-player-marker";
    marker.tabIndex = 0;
    marker.setAttribute("role", "button");
    marker.setAttribute("aria-label", `Spieler auf Level ${levelNode.dataset.level || ""}`);

    if (allHaveSameTeam) {
      const crest = this.getCrestUrls(cleanPlayers[0]?.crest);
      if (crest.primary) {
        const img = document.createElement("img");
        img.className = "world2-player-crest";
        img.src = crest.primary;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", () => {
          if (crest.fallback && img.dataset.fallbackTried !== "1") {
            img.dataset.fallbackTried = "1";
            img.src = crest.fallback;
            return;
          }
          marker.classList.add("world2-player-ball");
          img.remove();
          marker.textContent = "⚽";
        });
        marker.appendChild(img);
      } else {
        marker.classList.add("world2-player-ball");
        marker.textContent = "⚽";
      }
    } else {
      marker.classList.add("world2-player-ball");
      marker.textContent = "⚽";
    }

    const showPopup = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      this.showPlayerPopup(cleanPlayers, levelNode.dataset.level);
    };
    marker.addEventListener("click", showPopup);
    marker.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") showPopup(event);
    });

    // Desktop/Laptop: Marker NICHT in den skalierten Levelbutton legen.
    // Dadurch werden Wappen und Gastball in ihrer echten CSS-Endgroesse
    // gerendert und nicht zusammen mit .world2-level (scale .78) weichgerechnet.
    const desktopOverlay = window.matchMedia?.("(min-width: 769px)")?.matches;

    if (desktopOverlay) {
      marker.classList.add("world2-player-marker-overlay");
      marker.dataset.level = String(levelNode.dataset.level || "");

      const levelBottom = Number.parseFloat(levelNode.style.bottom) || 0;
      marker.style.left = levelNode.style.left || "50%";
      marker.style.bottom = `${levelBottom + 15}px`;

      this.world.appendChild(marker);
    } else {
      // Mobile bleibt exakt beim bisherigen Verhalten.
      levelNode.appendChild(marker);
    }
  },

  showPlayerPopup(players, level) {
    document.querySelector(".world2-player-popup-backdrop")?.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "world2-player-popup-backdrop";

    const popup = document.createElement("div");
    popup.className = "world2-player-popup";

    const title = document.createElement("strong");
    title.textContent = `Spieler auf Level ${level}`;
    popup.appendChild(title);

    const list = document.createElement("ul");
    players.forEach(player => {
      const item = document.createElement("li");
      item.textContent = String(player.username || "Spieler");
      list.appendChild(item);
    });
    popup.appendChild(list);

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Schließen";
    close.addEventListener("click", () => backdrop.remove());
    popup.appendChild(close);

    backdrop.appendChild(popup);
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) backdrop.remove();
    });
    document.body.appendChild(backdrop);
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
    45: "assets/ui/thunder-ball.png",
    55: "assets/ui/color-bomb.png",
    65: "assets/ui/hourglass.png",
    75: "assets/ui/fire-ball.png",
    85: "assets/ui/frost-ball.png"
  };

  return images[level] || "";
},

  renderMilestones(level, progress) {

  const itemMilestones = {
    5:  { level: 5,  type: "item", label: "Ball Switch" },
    15: { level: 15, type: "item", label: "Regenbogenball" },
    25: { level: 25, type: "item", label: "Zielhilfe" },
    35: { level: 35, type: "item", label: "Bombenball" },
    45: { level: 45, type: "item", label: "Blitzball" },
    55: { level: 55, type: "item", label: "Farbbombe" },
    65: { level: 65, type: "item", label: "Sanduhr" },
    75: { level: 75, type: "item", label: "Feuerball" },
    85: { level: 85, type: "item", label: "Frostball" }
  };

  const entry = itemMilestones[level];
  const entries = entry ? [entry] : [];

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

    // Erst alle Kartenassets laden, solange das Ergebnis-Popup noch sichtbar ist.
    await this.preloadMapAssets();

    document.querySelector(".app-header")?.classList.add("world2-header-hidden");

    // Karte fuer die Positionsmessung aktivieren, aber noch unsichtbar halten.
    this.screen.style.visibility = "hidden";
    this.screen.classList.remove("hidden");
    this.screen.classList.add("world2-progress-moving");

    this.currentLevel = to;
    this.render();

    // WICHTIG: Karte bleibt waehrend der kompletten Punktfahrt FEST stehen.
    // Wir positionieren sie einmal auf dem geschafften Level und scrollen danach
    // bis zum Ende der Animation keinen einzigen Pixel mehr.
    this.scrollToLevel(from, false);

    await new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    document.querySelectorAll(".screen").forEach(screen => {
      if (screen !== this.screen) screen.classList.add("hidden");
    });

    const prepared = this.prepareProgressMover(from, to);

    this.screen.style.visibility = "visible";

    // Ergebnis-Popup darf jetzt verschwinden; die Karte ist fertig aufgebaut.
    document.getElementById("winResultOverlay")?.classList.add("hidden");

    // Einen kurzen sichtbaren Stillstand am Startpunkt erzwingen.
    await new Promise(resolve => requestAnimationFrame(resolve));
    window.setTimeout(() => {
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
    // kann die Geometrie waehrend der Fahrt veraendern.
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
    const fromNode = this.world.querySelector(
      `.world2-level[data-level="${fromLevel}"]`
    );
    const toNode = this.world.querySelector(
      `.world2-level[data-level="${toLevel}"]`
    );

    if (!fromNode || !toNode || fromLevel === toLevel) {
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

    // Das Ziellevel bleibt waehrend der Fahrt sichtbar.
    // Es wird bis zur Ankunft optisch wieder als gesperrtes Level dargestellt.
    // So bleibt die Karte vollstaendig und der rote Punkt setzt sich sichtbar darauf.
    toNode.classList.add("world2-animation-target");
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

    // FIX 8: Der Marker darf NICHT im scrollenden Viewport liegen.
    // Ein absolut positioniertes Kind von #worldMap2Viewport wird durch scrollTop
    // mitverschoben. Bei z.B. scrollTop 1831 und top 502 lag der Marker bei -1329px
    // und war deshalb unsichtbar, obwohl requestAnimationFrame korrekt lief.
    //
    // .world2-shell ist position:relative und selbst NICHT gescrollt. Da der Viewport
    // inset:0 in dieser Shell liegt, koennen die bereits gemessenen viewport-relativen
    // Koordinaten 1:1 fuer die Shell verwendet werden.
    const shell = this.screen.querySelector(".world2-shell");
    if (!shell) {
      toNode.classList.remove("world2-animation-target");
      toNode.style.pointerEvents = "";
      return null;
    }

    shell.appendChild(mover);

    this.lockProgressScreen();

    // Der Lock wurde nach dem Mover eingefuegt und liegt normal darueber.
    // Mover bewusst auf hoehere Ebene setzen.
    mover.style.zIndex = "1002";

    const distance = Math.hypot(endX - startX, endY - startY);

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

    if (!prepared?.mover || !prepared?.toNode) {
      this.finishProgressMover(prepared);
      return;
    }

    this.preparedProgress = prepared;

    // Bei einem Stagewechsel (10 -> 11, 20 -> 21, ...) wird die Fahrt
    // bewusst am Finish-Tor unterbrochen. Dort findet die Stage-Celebration
    // statt; danach faehrt derselbe rote Punkt weiter zum neuen Level.
    if (this.isStageFinishTransition(prepared.fromLevel, prepared.toLevel)) {
      this.startStageFinishSequence(prepared);
      return;
    }

    this.animateProgressSegment(
      prepared,
      prepared.startX,
      prepared.startY,
      prepared.endX,
      prepared.endY,
      2200,
      () => this.finishProgressMover(prepared)
    );
  },

  isStageFinishTransition(fromLevel, toLevel) {
    const perStage = Number(CONFIG.levelsPerStage || 10);
    return (
      fromLevel > 0 &&
      fromLevel % perStage === 0 &&
      toLevel === fromLevel + 1
    );
  },

  getStageFinishPoint(prepared) {
    const scale = this.getMapScale();
    const fromBottom = this.yForLevel(prepared.fromLevel);
    const toBottom = this.yForLevel(prepared.toLevel);
    const nextStageIndex = Math.floor((prepared.toLevel - 1) / CONFIG.levelsPerStage);

    // Die Finish-Grenze ist exakt die Unterkante des naechsten Stage-Bildes.
    // Stage 1 besitzt ein eigenes Geruest, danach folgen Standard-Gerueste.
    const boundaryUnscaled = nextStageIndex <= 0
      ? CONFIG.stageLayouts.first.height
      : CONFIG.stageLayouts.first.height +
        ((nextStageIndex - 1) * CONFIG.stageLayouts.standard.height);

    const boundaryBottom = boundaryUnscaled * scale;
    const denominator = toBottom - fromBottom;

    let t = denominator !== 0
      ? (boundaryBottom - fromBottom) / denominator
      : 0.58;

    // Sicherheitsnetz fuer kuenftige Layoutaenderungen.
    t = clamp(t, 0.35, 0.78);

    return {
      x: prepared.startX + (prepared.endX - prepared.startX) * t,
      y: prepared.startY + (prepared.endY - prepared.startY) * t,
      t
    };
  },

  animateProgressSegment(prepared, startX, startY, endX, endY, duration, onDone) {
    const mover = prepared?.mover;

    if (!mover || !this.progressAnimating || this.preparedProgress !== prepared) {
      onDone?.();
      return;
    }

    if (this.progressRaf) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }

    const startedAt = performance.now();

    const easeInOut = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
      if (!this.progressAnimating || this.preparedProgress !== prepared) return;

      const raw = clamp((now - startedAt) / duration, 0, 1);
      const eased = easeInOut(raw);

      // Leicht geschwungene Bahn statt einer starren Geraden.
      // Dadurch laeuft der Statuspunkt bei engen Levelpositionen
      // optisch sauberer und nicht mitten durch Schloss/Levelpunkte.
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.hypot(dx, dy) || 1;

      const normalX = -dy / distance;
      const normalY = dx / distance;

      // Dezente Kurve; bei kurzen Wegen kleiner, bei langen Wegen etwas staerker.
      const curveStrength = Math.min(
        30,
        Math.max(10, distance * 0.13)
      );

      // Kurvenrichtung stabil anhand der horizontalen Bewegungsrichtung.
      const curveDirection = dx >= 0 ? 1 : -1;

      const controlX =
        (startX + endX) / 2 +
        normalX * curveStrength * curveDirection;

      const controlY =
        (startY + endY) / 2 +
        normalY * curveStrength * curveDirection;

      const inv = 1 - eased;

      const currentX =
        (inv * inv * startX) +
        (2 * inv * eased * controlX) +
        (eased * eased * endX);

      const currentY =
        (inv * inv * startY) +
        (2 * inv * eased * controlY) +
        (eased * eased * endY);

      mover.style.left = `${currentX}px`;
      mover.style.top = `${currentY}px`;

      // Das Ziel-Schloss bleibt bis kurz vor Ankunft sichtbar.
      // In den letzten 20 % blendet es weich aus, damit der rote Punkt
      // sauber "darauf landet" und kein optisches Uebereinander entsteht.
      if (prepared.toNode) {
        const fadeStart = 0.80;

        if (raw >= fadeStart) {
          const fadeProgress =
            (raw - fadeStart) / (1 - fadeStart);

          prepared.toNode.style.opacity =
            String(Math.max(0, 1 - fadeProgress));
        } else {
          prepared.toNode.style.opacity = "";
        }
      }

      if (raw < 1) {
        this.progressRaf = requestAnimationFrame(tick);
      } else {
        this.progressRaf = null;
        onDone?.();
      }
    };

    this.progressRaf = requestAnimationFrame(tick);
  },

  startStageFinishSequence(prepared) {
    const gate = this.getStageFinishPoint(prepared);

    // Etwas schneller bis zum Tor, damit die Celebration der eigentliche
    // Hoehepunkt bleibt.
    this.animateProgressSegment(
      prepared,
      prepared.startX,
      prepared.startY,
      gate.x,
      gate.y,
      1250,
      () => {
        if (!this.progressAnimating || this.preparedProgress !== prepared) return;

        prepared.mover.classList.add("world2-at-finish");

        this.showStageFinishCelebration(prepared, gate, () => {
          if (!this.progressAnimating || this.preparedProgress !== prepared) return;

          prepared.mover.classList.remove("world2-at-finish");

          this.animateProgressSegment(
            prepared,
            gate.x,
            gate.y,
            prepared.endX,
            prepared.endY,
            1400,
            () => this.finishProgressMover(prepared)
          );
        });
      }
    );
  },

  showStageFinishCelebration(prepared, gate, onDone) {
    this.removeStageFinishCelebration();

    const shell = this.screen?.querySelector(".world2-shell");
    if (!shell) {
      onDone?.();
      return;
    }

    const finishedStageNo = Math.ceil(prepared.fromLevel / CONFIG.levelsPerStage);
    const stage = getStage(prepared.fromLevel);

    const celebration = document.createElement("div");
    celebration.className = "world2-stage-finish-celebration";
    celebration.setAttribute("aria-hidden", "true");
    celebration.style.left = `${gate.x}px`;
    celebration.style.top = `${gate.y}px`;
    celebration.style.setProperty("--stage-accent", stage.accent || "#860000");

    const particleAngles = [-78,-62,-46,-30,-14,14,30,46,62,78,105,128,152,208,232,255];
    const particles = particleAngles.map((angle, index) => {
      const distance = 76 + (index % 4) * 18;
      return `<i class="world2-stage-particle" style="--a:${angle}deg;--d:${distance}px;--delay:${(index % 5) * 45}ms"></i>`;
    }).join("");

    // Nach "Stage geschafft" wird wieder die Vorschau der NEUEN Stage
    // eingeblendet. getStage() arbeitet zyklisch mit den vorhandenen Themes,
    // dadurch funktioniert die Vorschau auch bei Stage 13/14/15 usw.
    const nextStageLevel = prepared.toLevel;
    const nextStageNo = getStageIndex(nextStageLevel) + 1;
    const nextStage = getStage(nextStageLevel);

    celebration.innerHTML = `
      <div class="world2-stage-finish-burst"></div>
      <div class="world2-stage-particles">${particles}</div>

      <div class="world2-stage-unlock-card">
        <span class="world2-stage-unlock-kicker">— NEUE STAGE FREIGESCHALTET —</span>
        <div class="world2-stage-unlock-logo-wrap">
          ${nextStage.logo ? `<img class="world2-stage-unlock-logo" src="${nextStage.logo}" alt="${nextStage.name || `Stage ${nextStageNo}`}" draggable="false">` : ""}
        </div>
        <strong class="world2-stage-unlock-name">${nextStage.name || `Stage ${nextStageNo}`}</strong>
        <span class="world2-stage-unlock-number">STAGE ${nextStageNo}</span>
      </div>

      <div class="world2-stage-finish-card">
        <div class="world2-stage-finish-crown" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span class="world2-stage-finish-kicker">STAGE ${finishedStageNo}</span>
        <strong>GESCHAFFT!</strong>
        <span class="world2-stage-finish-name">${stage.name || `Stage ${finishedStageNo}`}</span>
        <div class="world2-stage-finish-shine"></div>
      </div>
    `;

    shell.appendChild(celebration);
    this.stageFinishCelebration = celebration;

    requestAnimationFrame(() => {
      celebration.classList.add("show");
    });

    // Phase 2: Erst nach der "Stage geschafft"-Animation erscheint darüber
    // wieder die Vorschau der soeben freigeschalteten nächsten Stage.
    this.stageUnlockTimer = window.setTimeout(() => {
      if (this.stageFinishCelebration === celebration) {
        const finishCard = celebration.querySelector(".world2-stage-finish-card");
        const unlockCard = celebration.querySelector(".world2-stage-unlock-card");

        if (finishCard && unlockCard) {
          // Beide Karten als gemeinsames Paar im sichtbaren Kartenbereich zentrieren.
          const shellCenterY = shell.clientHeight / 2;
          const anchorY = Number.parseFloat(celebration.style.top) || celebration.offsetTop || 0;

          const finishTop = finishCard.offsetTop;
          const finishHeight = finishCard.offsetHeight;
          const unlockTop = unlockCard.offsetTop;
          const unlockHeight = unlockCard.offsetHeight;

          const finishCenterY = anchorY + finishTop + (finishHeight * 0.33);
          const unlockCenterY = anchorY + unlockTop - (unlockHeight * 1.40);
          const pairCenterY = (finishCenterY + unlockCenterY) / 2;
          const shiftY = shellCenterY - pairCenterY;

          celebration.style.setProperty(
            "--world2-stage-pair-shift",
            `${shiftY.toFixed(2)}px`
          );
        }

        celebration.classList.add("unlock-show");
      }
    }, 1050);

    // Beide Karten kurz gemeinsam stehen lassen, danach fährt der Statuspunkt
    // wie bisher automatisch zum ersten Level der neuen Stage weiter.
    this.stageFinishTimer = window.setTimeout(() => {
      celebration.classList.add("leave");

      this.stageFinishTimer = window.setTimeout(() => {
        this.removeStageFinishCelebration();
        onDone?.();
      }, 430);
    }, 3300);
  },

  removeStageFinishCelebration() {
    if (this.stageUnlockTimer) {
      clearTimeout(this.stageUnlockTimer);
      this.stageUnlockTimer = null;
    }

    if (this.stageFinishTimer) {
      clearTimeout(this.stageFinishTimer);
      this.stageFinishTimer = null;
    }

    this.stageFinishCelebration?.remove();
    this.stageFinishCelebration = null;
  },

  finishProgressMover(prepared) {
    if (this.progressRaf) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }

    const data = prepared || this.preparedProgress;
    const level = data?.toLevel || this.currentLevel;

    this.removeStageFinishCelebration();
    data?.mover?.remove();

    if (data?.toNode) {
      data.toNode.style.visibility = "";
      data.toNode.style.pointerEvents = "";
      data.toNode.style.opacity = "";

      // WICHTIG:
      // Das Ziellevel wurde waehrend der Fahrt absichtlich mit
      // "world2-animation-target" als Schloss dargestellt.
      // Bei Ankunft muss diese Hilfsklasse SOFORT entfernt werden,
      // damit der bereits vorhandene "current"-Status wieder sichtbar
      // wird und der rote Statuspunkt nicht bis zum Reload verschwindet.
      data.toNode.classList.remove("world2-animation-target");
      data.toNode.classList.add("current");

      // Erst JETZT beginnt wieder der normale Puls des echten aktuellen Levels.
      const orb = data.toNode.querySelector(".world2-level-orb");
      if (orb) orb.style.animation = "";

      data.toNode.classList.add("world2-arrival");
      window.setTimeout(() => {
        data.toNode?.classList.remove("world2-arrival");
      }, 700);
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
