import { WORLD_MAP_CONFIG_2 as CONFIG } from "../config/worldMapConfig2.js";

/*
 * =========================================================
 * BANDENKICK – ENDLOSKARTE 2
 * Datei: js/worldmap/worldMap2.js
 * =========================================================
 *
 * Läuft parallel zur bisherigen StageMap.
 *
 * Erwartete Bridge aus script.js:
 *   window.BK_openMainLevel(levelNumber)
 *
 * Erwarteter Fortschritt:
 *   window.BK_getMainProgress()
 *
 * Falls die Bridge noch nicht eingebaut ist, läuft die Karte trotzdem
 * als Demo und zeigt einen Hinweis beim Antippen eines Levels.
 */

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

function stageNameFor(level) {
  const stageIndex = Math.floor((level - 1) / CONFIG.levelsPerStage);
  return CONFIG.stageNames[stageIndex % CONFIG.stageNames.length]
    || `Stage ${stageIndex + 1}`;
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
    requestAnimationFrame(() => this.scrollToCurrent(false));
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

// Der alte einzelne SVG-Hintergrund wird nicht mehr verwendet.
this.world.style.backgroundImage = "none";

this.world.innerHTML = "";

// 10 Endloskarten-Bilder von unten nach oben aufbauen.
this.renderBackgroundSegments(totalHeight);

this.renderRoadLine();
    this.renderDecorations();

    for (let level = 1; level <= CONFIG.totalLevels; level++) {
      this.renderLevel(level, progress);
      this.renderMilestones(level, progress);
    }

    const stageNo = Math.ceil(unlockedLevel / CONFIG.levelsPerStage);
    $("worldMap2StageLabel").textContent =
      `Stage ${stageNo} · ${stageNameFor(unlockedLevel)}`;

    $("worldMap2ProgressLabel").textContent =
      `Aktuell Level ${unlockedLevel}`;
  },

  renderBackgroundSegments(totalHeight) {

  const images = CONFIG.backgroundImages;

  if (!Array.isArray(images) || images.length === 0) {
    console.warn("[WorldMap2] Keine backgroundImages gefunden.");
    return;
  }

  const segmentHeight = CONFIG.backgroundSegmentHeight;

  const segmentCount =
    Math.ceil(totalHeight / segmentHeight) + 1;

  for (let i = 0; i < segmentCount; i++) {

    // Loop 1 → 2 → 3 ... → 10 → wieder 1
    const imageIndex = i % images.length;

    const segment = document.createElement("div");

    segment.className = "world2-background-segment";

    segment.style.position = "absolute";
    segment.style.left = "0";
    segment.style.width = "100%";
    segment.style.height = `${segmentHeight}px`;

    // Wichtig:
    // Level 1 liegt unten, deshalb beginnen auch die Bilder unten.
    segment.style.bottom =
      `${i * segmentHeight}px`;

    segment.style.backgroundImage =
      `url("${images[imageIndex]}")`;

    segment.style.backgroundSize =
      "100% 100%";

    segment.style.backgroundRepeat =
      "no-repeat";

    segment.style.backgroundPosition =
      "center";

    segment.style.pointerEvents =
      "none";

    segment.style.zIndex =
      "0";

    this.world.appendChild(segment);
  }
},

  yForLevel(level) {
    // Level 1 liegt unten, höhere Level laufen nach oben.
    return CONFIG.bottomPadding + (level - 1) * CONFIG.levelSpacing;
  },

  xForLevel(level) {
    const idx = (level - 1) % CONFIG.roadPattern.length;
    return CONFIG.roadPattern[idx];
  },

  renderRoadLine() {
    // SVG-Verbindungslinie wird zusätzlich über die Hintergrundstraße gelegt.
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.classList.add("world2-path-svg");
    svg.setAttribute("viewBox", `0 0 100 ${this.world.offsetHeight || 10000}`);
    svg.setAttribute("preserveAspectRatio", "none");

    const points = [];
    for (let level = 1; level <= CONFIG.totalLevels; level++) {
      const x = this.xForLevel(level);
      const y = this.world.clientHeight - this.yForLevel(level);
      points.push(`${x},${y}`);
    }

    const polyline = document.createElementNS(ns, "polyline");
    polyline.setAttribute("points", points.join(" "));
    polyline.setAttribute("vector-effect", "non-scaling-stroke");
    polyline.classList.add("world2-path-line");

    svg.appendChild(polyline);
    this.world.appendChild(svg);
  },

  renderLevel(level, progress) {
    const unlockedLevel = Number(progress.unlockedLevel || 1);
    const result = (progress.results || {})[level];
    const unlocked = level <= unlockedLevel;
    const completed = Boolean(result);
    const current = level === unlockedLevel;

    const node = document.createElement("button");
    node.type = "button";
    node.className = "world2-level";
    node.dataset.level = String(level);

    if (completed) node.classList.add("completed");
    if (current) node.classList.add("current");
    if (!unlocked) node.classList.add("locked");

    node.style.left = `${this.xForLevel(level)}%`;
    node.style.bottom = `${this.yForLevel(level)}px`;

    const stars = getStars(result);

    node.innerHTML = `
      <span class="world2-level-orb">
        <span class="world2-level-number">${unlocked ? level : "🔒"}</span>
      </span>
      <span class="world2-stars" aria-label="${stars} Sterne">
        ${completed ? `${"★".repeat(stars)}${"☆".repeat(3 - stars)}` : ""}
      </span>
    `;

    if (!unlocked) {
      node.disabled = true;
      node.setAttribute("aria-label", `Level ${level} gesperrt`);
    } else {
      node.setAttribute("aria-label", `Level ${level} öffnen`);
      node.addEventListener("click", () => this.openLevel(level));
    }

    this.world.appendChild(node);
  },

  renderMilestones(level, progress) {
    const entries = CONFIG.milestones.filter(m => m.level === level);
    if (!entries.length) return;

    entries.forEach((entry, i) => {
      const el = document.createElement("div");
      el.className = `world2-milestone ${entry.type || ""}`;

      const passed = Number(progress.unlockedLevel || 1) > level;
      if (passed) el.classList.add("passed");

      const x = this.xForLevel(level);
      const side = x < 50 ? 1 : -1;
      const offset = 22 + i * 12;

      el.style.left = `${clamp(x + side * offset, 12, 88)}%`;
      el.style.bottom = `${this.yForLevel(level) + 16}px`;

      el.innerHTML = `
        <span class="world2-milestone-icon">${entry.icon || "★"}</span>
        <span class="world2-milestone-text">${entry.label || ""}</span>
      `;

      this.world.appendChild(el);
    });
  },

  renderDecorations() {
    CONFIG.decorations.forEach(rule => {
      for (let level = rule.every; level <= CONFIG.totalLevels; level += rule.every) {
        const el = document.createElement("div");
        el.className = `world2-decoration ${rule.side}`;
        el.textContent = rule.icon;
        el.style.bottom =
          `${this.yForLevel(level) + Math.round(CONFIG.levelSpacing * 0.48)}px`;
        el.style.transform = `scale(${Number(rule.scale || 1)})`;
        this.world.appendChild(el);
      }
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
        `Level ${level} ist anklickbar. Für den echten Spielstart fehlt nur noch die kleine Bridge in script.js.`;
      hint.classList.add("show");
      clearTimeout(this.hintTimer);
      this.hintTimer = setTimeout(() => hint.classList.remove("show"), 3200);
    }
  },

  scrollToCurrent(smooth = true) {
    const node = this.world.querySelector(
      `.world2-level[data-level="${this.currentLevel}"]`
    );

    if (!node) return;

    const viewportHeight = this.viewport.clientHeight;
    const nodeBottom = parseFloat(node.style.bottom || "0");
    const worldHeight = this.world.clientHeight;

    // CSS bottom -> ScrollTop umrechnen.
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
  }
};

function boot() {
  WorldMap2.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

window.WorldMap2 = WorldMap2;
