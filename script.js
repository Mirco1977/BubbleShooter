  import { GAME_CONFIG } from "./js/config/gameConfig.js";
  import { AudioManager } from "./js/managers/AudioManager.js";
  import { StorageManager } from "./js/managers/StorageManager.js";
  import { calculateStars, STAR_CONFIG } from "./js/config/starConfig.js";

  (() => {
  "use strict";

  /*
   * =========================================================
   * BANDENKICK BUBBLE CHALLENGE – VERSION 0.2
   * =========================================================
   *
   * Für JSFiddle:
   * 1. HTML-Datei ins HTML-Feld
   * 2. CSS-Datei ins CSS-Feld
   * 3. Diese Datei ins JavaScript-Feld
   * 4. Load type: No wrap – body
   */

  

  const THEMES = {
    arena: {
      id: "arena",
      name: "Bandenkick Arena",
      description: "Dein Start in eine neue Welt",
      logo: "assets/logos/LigaLogoBordered.png",

      colors: {
        brand: "#860000",
        brandDark: "#530000",
        page: "#161921"
      },
      previews: {
        card: "linear-gradient(135deg, #860000, #1b1f2b)"
      }
    },
      worldCup: {
      id: "worldCup",
      name: "World Cup",
      description: "Fußballweltmeisterschaft 2026",
      logo: "assets/logos/WM-Pokal.png",

      colors: {
        brand: "#c9972b",
        brandDark: "#75151b",
        page: "#071b26"
     },
      previews: {
        card: "linear-gradient(135deg, #75151b, #c9972b, #087e79)"
      }
    },
      wasser: {
      id: "wasser",
      name: "Tropical Paradise",
      description: "Heiße Tage - Wasserspaß",
      logo: "assets/logos/Wasser-surfer.png",
      colors: {
        brand: "#245b91",
        brandDark: "#12314f",
        page: "#17202b"
      },
      previews: {
        card: "linear-gradient(135deg, #2c6ca9, #c4e9ff)"
      }
    }
  };

  const STAGES = [
    { number: 1, name: "Bandenkick Arena", 
      mapBackground: "assets/backgrounds/Bandenkick-Arena.png"
    },
    { number: 2, name: "World Cup",
      mapBackground: "assets/backgrounds/World-Cup.png"
    },
    { number: 3, name: "Tropical Paradise",
      mapBackground: "assets/backgrounds/Tropical Paradise.png"
     },
    { number: 4, name: "Vulkan-Cup" },
    { number: 5, name: "Champions Space" }
  ];

  const DEMO_RANKING = [
    { username: "RWE_Prinz10x", score: 18450 },
    { username: "xDoPe_Zeus", score: 16320 },
    { username: "ELU_Niick", score: 14980 },
    { username: "L3G3ND_PG_FCB85", score: 13840 },
    { username: "M3MENTOMORI", score: 12500 },
    { username: "Bandenkick-Spieler", score: 9800, me: true }
  ];

  const $ = (id) => document.getElementById(id);

  const dom = {

    screens: {
      home: $("homeScreen"),
      map: $("mapScreen"),
      level: $("levelScreen"),
      play: $("playScreen"),
      themes: $("themesScreen"),
      ranking: $("rankingScreen"),
      settings: $("settingsScreen")
    },

    profileName: $("profileName"),
    loginButton: $("loginButton"),
    continueButton: $("continueButton"),
    newGameButton: $("newGameButton"),
    openMapButton: $("openMapButton"),
    openThemesButton: $("openThemesButton"),
    openRankingButton: $("openRankingButton"),
    openSettingsButton: $("openSettingsButton"),
    bombItemButton: $("bombItemButton"),
    thunderItemButton: $("thunderItemButton"),
    switchItemButton: $("switchItemButton"),
    settingsItemButton: $("settingsItemButton"),

    stageTitle: $("stageTitle"),
    stageName: $("stageName"),
    stageRange: $("stageRange"),
    starCounter: $("starCounter"),
    stageBanner: $("stageBanner"),
    previousStage: $("previousStage"),
    nextStage: $("nextStage"),
    progressText: $("progressText"),
    progressPercent: $("progressPercent"),
    progressFill: $("progressFill"),
    levelMap: $("levelMap"),

    selectedLevelTitle: $("selectedLevelTitle"),
    selectedStageBadge: $("selectedStageBadge"),
    levelPreviewGraphic: $("levelPreviewGraphic"),
    levelGoalText: $("levelGoalText"),
    levelColors: $("levelColors"),
    levelTarget: $("levelTarget"),
    levelBest: $("levelBest"),
    startLevelButton: $("startLevelButton"),

    playLevelTitle: $("playLevelTitle"),
    playScore: $("playScore"),
    leaveGameButton: $("leaveGameButton"),
    targetScoreDisplay: $("targetScoreDisplay"),
    shotsDisplay: $("shotsDisplay"),
    colorsDisplay: $("colorsDisplay"),
    gameCanvas: $("gameCanvas"),
  
    stageCompleteOverlay: $("stageCompleteOverlay"),
    stageCompleteName: document.getElementById("stageCompleteName"),
    stageCompleteText: document.getElementById("stageCompleteText"),
    stageCompleteStars: document.getElementById("stageCompleteStars"),
    stageCompleteButton: document.getElementById("stageCompleteButton"),
    retryLevelButton: $("retryLevelButton"),
    resultMapButton: $("resultMapButton"),

    winPopup: $("winResultOverlay"),

    winResultOverlay: $("winResultOverlay"),
    winResultTitle: $("winResultTitle"),
    winResultStars: $("winResultStars"),
    winResultText: $("winResultText"),
    nextLevelButton: $("nextLevelButton"),

    loseBoundaryPopup: $("loseBoundaryOverlay"),
    loseBoundaryTitle: $("loseBoundaryTitle"),
    loseBoundaryText: $("loseBoundaryText"),

    loseShotsPopup: $("loseShotsOverlay"),
    loseShotsTitle: $("loseShotsTitle"),
    loseShotsStars: $("loseShotsStars"),
    loseShotsText: $("loseShotsText"),

    retryShotsButton: $("retryShotsButton"),
    shotsMapButton: $("shotsMapButton"),

    activeThemeLabel: $("activeThemeLabel"),
    themeList: $("themeList"),
    rankingList: $("rankingList"),

    musicSetting: $("musicSetting"),
    soundSetting: $("soundSetting"),
    aimSetting: $("aimSetting"),
    speedOptions: document.querySelectorAll(".speed-option"),
    resetProgressButton: $("resetProgressButton"),

    toast: $("toast")
  };


  const SaveManager = new StorageManager();

  const state = {
    progress: SaveManager.loadProgress(),
    settings: SaveManager.loadSettings(),
    user: SaveManager.loadUser(),
    selectedLevel: 1
  };

  const Backend = {
    async getCurrentUser() {
      if (GAME_CONFIG.backendMode === "mock") {
        return state.user;
      }

      return this.request(GAME_CONFIG.api.endpoints.me);
    },

    async login() {
      if (GAME_CONFIG.backendMode === "mock") {
        const user = {
          id: 77,
          username: "Bandenkick-Spieler"
        };

        SaveManager.saveUser(user);
        return user;
      }

      window.location.href = "https://bandenkick.de/login";
      return null;
    },

    async getRanking() {
      if (GAME_CONFIG.backendMode === "mock") {
        return DEMO_RANKING
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
      }

      return this.request(GAME_CONFIG.api.endpoints.ranking);
    },

    async saveProgress(payload) {
      if (GAME_CONFIG.backendMode === "mock") {
        return { success: true };
      }

      return this.request(GAME_CONFIG.api.endpoints.progress, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },

    async request(path, options = {}) {
      const response = await fetch(GAME_CONFIG.api.baseUrl + path, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API-Fehler ${response.status}`);
      }

      return response.json();
    }
  };

  let currentBallTheme = "bk-arena-balls";

  const Audio = new AudioManager({
        getSettings: () => state.settings
    });

    Audio.enableBackgroundOnFirstInteraction();


  const ThemeManager = {
    apply(themeId) {
      const theme = THEMES[themeId] || THEMES.arena;
      const root = document.documentElement;

      root.style.setProperty("--brand", theme.colors.brand);
      root.style.setProperty("--brand-dark", theme.colors.brandDark);
      root.style.setProperty("--page-bg", theme.colors.page);

      root.style.setProperty(
        "--app-background",
        GAME_CONFIG.assets.appBackground
          ? `url("${GAME_CONFIG.assets.appBackground}")`
          : "none"
      );

      root.style.setProperty(
        "--hero-background",
        GAME_CONFIG.assets.heroBackground
          ? `url("${GAME_CONFIG.assets.heroBackground}")`
          : "none"
      );

      state.progress.activeTheme = theme.id;
      SaveManager.saveProgress(state.progress);
      dom.activeThemeLabel.textContent = theme.name;
    },

    applyStageAssets(stageNumber) {
      const root = document.documentElement;

      const stageBackground =
        GAME_CONFIG.assets.stageBackgrounds[stageNumber];

      const mapBackground =
        STAGES[stageNumber - 1]?.mapBackground || GAME_CONFIG.assets.mapBackgrounds[stageNumber];

      const gameBackground =
        GAME_CONFIG.assets.gameBackgrounds[stageNumber];

      root.style.setProperty(
        "--stage-background",
        stageBackground ? `url("${stageBackground}")` : "none"
      );

      root.style.setProperty(
        "--map-background",
        mapBackground ? `url("${mapBackground}")` : "none"
      );

      root.style.setProperty(
        "--game-background",
        gameBackground ? `url("${gameBackground}")` : "none"
      );
    },

    applyLevelAsset(levelNumber) {
      const stage = getStageForLevel(levelNumber);
      const levelBackground =
        GAME_CONFIG.assets.levelBackgrounds[levelNumber] ||
        GAME_CONFIG.assets.levelBackgrounds[stage];

      document.documentElement.style.setProperty(
        "--level-background",
        levelBackground ? `url("${levelBackground}")` : "none"
      );
    },

    renderList() {
      dom.themeList.innerHTML = "";

      Object.values(THEMES).forEach((theme) => {
        const button = document.createElement("button");
        button.className = "theme-card";

        if (state.progress.activeTheme === theme.id) {
          button.classList.add("active");
        }

        button.style.background = theme.previews.card;
        button.innerHTML = `
        <div class="theme-card-text">
        <strong>${escapeHtml(theme.name)}</strong>
        <span>${escapeHtml(theme.description)}</span>
        </div>

  ${
    theme.logo
      ? `<img
          src="${escapeHtml(theme.logo)}"
          class="theme-card-logo"
          alt="${escapeHtml(theme.name)} Logo"
        >`
      : ""
  }

  <b class="theme-card-status">
    ${state.progress.activeTheme === theme.id ? "Aktiv" : "Auswählen"}
  </b>
`;

        button.addEventListener("click", () => {
          this.apply(theme.id);
          this.renderList();
          showToast(`${theme.name} wurde aktiviert.`);
        });

        dom.themeList.appendChild(button);
      });
    }
  };

  const Navigation = {
    show(screenName) {
      Object.entries(dom.screens).forEach(([name, element]) => {
        element.classList.toggle("hidden", name !== screenName);
      });

      if (screenName === "map") {
        StageMap.render();
      }

      if (screenName === "themes") {
        ThemeManager.renderList();
      }

      if (screenName === "ranking") {
        Ranking.render();
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const StageMap = {
    getStageStart(stageNumber) {
      return (stageNumber - 1) * GAME_CONFIG.levelsPerStage + 1;
    },

    getStageEnd(stageNumber) {
      return stageNumber * GAME_CONFIG.levelsPerStage;
    },

    isStageUnlocked(stageNumber) {
      return this.getStageStart(stageNumber) <= state.progress.unlockedLevel;
    },

    render() {
      const stageNumber = Number(state.progress.selectedStage) || 1;
      const stage = STAGES.find(s => s.number === stageNumber) || STAGES[0];
      const startLevel = this.getStageStart(stageNumber);
      const endLevel = this.getStageEnd(stageNumber);

      ThemeManager.applyStageAssets(stageNumber);

      dom.stageTitle.textContent = `Stage ${stageNumber}`;
      dom.stageName.textContent = stage.name;
      dom.stageRange.textContent = `Level ${startLevel}–${endLevel}`;
      dom.starCounter.textContent = `${getTotalStars()} ⭐`;

      let completed = 0;
      dom.levelMap.innerHTML = "";

      for (let level = startLevel; level <= endLevel; level++) {
        const result = (state.progress.results || {})[level];
        const unlocked = level <= Number(state.progress.unlockedLevel || 1);

        if (result) {
          completed++;
        }

        const row = document.createElement("div");
        row.className = "level-row";
        row.dataset.level = level;

        const button = document.createElement("button");
        button.className = "level-button";

        if (result) {
          button.classList.add("completed");
          button.innerHTML = `
            <span class="level-stars">${"★".repeat(result.stars)}</span>
            ${level}
          `;
        } else if (unlocked) {
          button.textContent = level;

          if (level === state.progress.unlockedLevel) {
            button.classList.add("current");
          }
        } else {
          button.classList.add("locked");
          button.disabled = true;
          button.textContent = "🔒";
        }

        if (unlocked) {
          button.addEventListener("click", () => LevelPreview.open(level));
        }

        row.appendChild(button);
        dom.levelMap.appendChild(row);
      }

      const percent = Math.round(
        completed / GAME_CONFIG.levelsPerStage * 100
      );

      dom.progressText.textContent =
        `${completed} von ${GAME_CONFIG.levelsPerStage} abgeschlossen`;

      dom.progressPercent.textContent = `${percent} %`;
      dom.progressFill.style.width = `${percent}%`;

      dom.previousStage.disabled = stageNumber === 1;
      dom.nextStage.disabled =
        stageNumber === GAME_CONFIG.totalStages ||
        !this.isStageUnlocked(stageNumber + 1);
    }
  };

  const LevelPreview = {
    open(levelNumber) {
      state.selectedLevel = levelNumber;

      const stage = getStageForLevel(levelNumber);
      const levelConfig = STAR_CONFIG[levelNumber];
      const colors = levelConfig?.ballTypes ?? 3;
      const target = levelConfig?.targetScore ?? 1000;
      const result = state.progress.results[levelNumber];

      ThemeManager.applyStageAssets(stage);
      ThemeManager.applyLevelAsset(levelNumber);

      dom.selectedLevelTitle.textContent = `Level ${levelNumber}`;
      dom.selectedStageBadge.textContent = `Stage ${stage}`;
      dom.levelGoalText.textContent =
        `Erreiche mindestens ${target.toLocaleString("de-DE")} Punkte.`;
      dom.levelColors.textContent = String(colors);
      dom.levelTarget.textContent = target.toLocaleString("de-DE");
      dom.levelBest.textContent = result ? `${result.stars} ⭐` : "–";

      Navigation.show("level");
    }
  };

  const BubbleGame = {
    canvas: null,
    ctx: null,
    width: 480,
    height: 700,
    radius: 18,
    rowHeight: 31,
    columnWidth: 36,
    bubbles: [],
    particles: [],
    explosions: [],
    thunders: [],
    explosions: [],
    hasSwitchItem: true,
    hasBombItem: true,
    switchBallActive: false,
    screenShake: 0,
    shooter: null,
    nextColor: null,
    aimX: 240,
    aimY: 280,
    score: 0,
    shots: 0,
    targetScore: 1000,
    activeColors: [],
    animationFrame: null,
    running: false,
    levelFinished: false,

    activateBombBall() {
    if (!this.shooter || this.shooter.moving) return;

    this.shooter.isBomb = true;
    },

    activateThunderBall() {
      if (!this.shooter || this.shooter.moving) return;

      this.shooter.isThunder = true;
    },

    activateSwitchBall() {
    if (!this.shooter || this.shooter.moving) return;

    this.swapShooterBall();
    },

    testBombBall() {
      this.activateBombBall();
    },

    palette: 
    [
    {
        id: "red",
        color: "#dc3434",
        image: null
    },
    {
        id: "blue",
        color: "#3789ce",
        image: null
    },
    {
        id: "green",
        color: "#39bd6d",
        image: null
    },
    {
        id: "yellow",
        color: "#f0c83c",
        image: null
    },
    {
        id: "purple",
        color: "#9a54df",
        image: null
    }
    ],

    loadBallImages() {
      const activePalette = currentBallTheme === "world-cup-balls"
      ? [
          { id: "usa", color: "#fff", image: null },
          { id: "germany", color: "#fff", image: null },
          { id: "brazil", color: "#fff", image: null },
          { id: "spain", color: "#fff", image: null },
          { id: "australia", color: "#fff", image: null }
        ]
      : this.palette;
        activePalette.forEach((ball) => {
        const image = new Image();

        image.src = `assets/balls/${currentBallTheme}/${ball.id}.png`;

        image.onload = () => {
            ball.image = image;
            ball.loaded = true;
        };

        image.onerror = () => {
          console.error("Ballbild nicht gefunden", image.src);
            ball.image = null;
        };
    });
    },

    start(levelNumber) {
      state.selectedLevel = levelNumber;
      this.victoryAnimation = false;
      this.levelFinished = false;
      this.particles = [];
      this.lightningHits = [];
      const stageNumber = getStageForLevel(levelNumber);
      this.ballImageCache = {};

      currentBallTheme =
      stageNumber === 2
      ? "world-cup-balls"
      : "bk-arena-balls";
      this.nextColor = null;


      if (stageNumber === 2) {

    this.palette = [
        { id:"usa" },
        { id:"germany" },
        { id:"brazil" },
        { id:"spain" },
        { id:"australia" }
    ];

    } else {

    this.palette = [
        { id:"red" },
        { id:"blue" },
        { id:"green" },
        { id:"yellow" },
        { id:"purple" }
    ];
  }
      this.switchImage = new Image();
      this.switchImage.src = "assets/ui/ballswitch.png";

      this.bombImage = new Image();
      this.bombImage.src = "assets/ui/bomb-ball.png";
      
      this.thunderImage = new Image();
      this.thunderImage.src = "assets/ui/thunder-ball.png";

      this.canvas = dom.gameCanvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.score = 0;
      this.shots = 0;
      this.running = true;
      this.levelFinished = false;

    const levelConfig = STAR_CONFIG[levelNumber];
    const colorCount = Math.min(
    levelConfig?.ballTypes ?? 3,
    this.palette.length
    );

    const shuffledColors = [...this.palette];

    for (let i = shuffledColors.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffledColors[i], shuffledColors[randomIndex]] =
            [shuffledColors[randomIndex], shuffledColors[i]];
    }

    this.activeColors = shuffledColors.slice(0, colorCount);

      this.activeColors = this.palette.slice(0, colorCount);
      
      this.targetScore = levelConfig?.targetScore ?? 1000;

      dom.playLevelTitle.textContent = `Level ${levelNumber}`;
      dom.playScore.textContent = "0 Punkte";
      dom.targetScoreDisplay.textContent =
        this.targetScore.toLocaleString("de-DE");
      dom.shotsDisplay.textContent = "0";
      dom.colorsDisplay.textContent = String(colorCount);
      dom.winPopup?.classList.add("hidden");
      dom.loseShotsPopup?.classList.add("hidden");
      dom.loseBoundaryPopup?.classList.add("hidden");

      ThemeManager.applyStageAssets(getStageForLevel(levelNumber));

      this.createBoard(levelNumber);
      this.createShooter();

      Navigation.show("play");
      this.bindCanvasEvents();
      this.startLoop();

    },
    createBoard(levelNumber) {
      this.bubbles = [];
      this.topRowOffset = 0;

      // Horizontale Grundposition für ein zentriertes Raster
      this.gridBaseX =
      (this.width - 12 * this.columnWidth) / 2;

    const levelConfig = STAR_CONFIG[levelNumber];

    const rows = levelConfig?.rows ?? 5;
      for (let row = 0; row < rows; row++) {
    const offset =
        row % 2
            ? this.columnWidth / 2
            : 0;

    // Volle Reihe: 13 Bälle
    // Versetzte Reihe: 12 Bälle
    const columns = offset === 0 ? 13 : 12;

    for (let col = 0; col < columns; col++) {
    const x =
            this.gridBaseX +
            col * this.columnWidth +
            offset;

    const y =
            this.radius +
            row * this.rowHeight;

          if (x > this.width - this.radius) continue;
          
    const color = this.randomColor();
          this.bubbles.push({
            x,
            y,
            color: color,
            image: color.image
          });
        }
      }
    },

    addNewTopRow() {
      console.log("NEUE REIHE AUFGERUFEN");
    const levelConfig = STAR_CONFIG[state.selectedLevel];

    // Funktion für dieses Level ausgeschaltet
    if (levelConfig?.addRowAfterShot !== "y") {
        return;
    }

    // Vorhandene Bälle eine Reihe nach unten verschieben
    this.bubbles.forEach((bubble) => {
        bubble.y += this.rowHeight;

        // Bälle innerhalb des Spielfeldes halten
        bubble.x = Math.max(
            this.radius,
            Math.min(
                this.width - this.radius,
                bubble.x
            )
        );
    });

   

    // Ausrichtung der bisherigen obersten Reihe erkennen
    const previousTopRow = this.bubbles.filter(
        (bubble) =>
            Math.abs(bubble.y - (this.radius + this.rowHeight)) < 2
    );

    const previousTopWasOffset =
        previousTopRow.length > 0 &&
        previousTopRow[0].x > this.radius + 2;

    // Neue Reihe bekommt die entgegengesetzte Ausrichtung
        this.topRowOffset =
        this.topRowOffset === 0
            ? this.columnWidth / 2
            : 0;

    const newRowOffset = this.topRowOffset;

    const columns =
    newRowOffset === 0
        ? 13
        : 12;

    for (let col = 0; col < columns; col++) {
        const x =
        this.gridBaseX +
        col * this.columnWidth +
        newRowOffset;

        if (x > this.width - this.radius) {
            continue;
        }

        const color = this.randomColor();

            this.bubbles.push({
        x,
        y: this.radius,
        color,
        image: color.image,

        isNewRow: true,
        rowFlashStart: performance.now(),
        rowFlashDuration: 450
    });
        }
    }, 

    randomColor() {
      return this.activeColors[
        Math.floor(Math.random() * this.activeColors.length)
      ];
    },

    createPopEffect(x, y, color) {

    // kurzer heller Glow beim Zerplatzen
    this.explosions.push({
        x,
        y,
        radius: 5,
        alpha: 0.7,
        popGlow: true
    });


    // bestehende Partikel
    for (let i = 0; i < 10; i++) {

        this.particles.push({
            x,
            y,
            color,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: 5 + Math.random() * 4,
            life: 25
        });

    }
},

    updateParticles(deltaTime = 1) {
    this.particles.forEach((particle) => {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;

        particle.vy += 0.08 * deltaTime;
        particle.life -= deltaTime;
        particle.size *= Math.pow(0.96, deltaTime);
    });

    this.particles = this.particles.filter(
        (particle) => particle.life > 0
    );
    },

    drawParticles() {
    this.particles.forEach((particle) => {
        this.ctx.save();

        this.ctx.globalAlpha = particle.life / 25;
        this.ctx.fillStyle = particle.color.color;

        this.ctx.beginPath();
        this.ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        this.ctx.fill();
        this.ctx.restore();
    });
    

        this.explosions.forEach((explosion) => {
        this.ctx.save();

        this.ctx.globalAlpha = explosion.alpha;
        this.ctx.globalCompositeOperation = "lighter";

        this.ctx.shadowColor = "#ffb000";
        this.ctx.shadowBlur = 20;

        this.ctx.strokeStyle = "#ffd84d";
        this.ctx.lineWidth = 8;

        this.ctx.beginPath();
        this.ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius,
            0,
            Math.PI * 2
        );
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius * 0.30,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.restore();
    });

    
    this.thunders.forEach((thunder) => {

    this.ctx.save();

    const gradient = this.ctx.createLinearGradient(
    thunder.x,
    thunder.y - 50,
    thunder.x,
    thunder.y + 50
);

gradient.addColorStop(0, "#ffffff");
gradient.addColorStop(0.4, "#9fffff");
gradient.addColorStop(0.7, "#00bfff");
gradient.addColorStop(1, "#0066ff");

this.ctx.strokeStyle = gradient;

this.ctx.lineWidth = 3;

this.ctx.shadowColor = "#00aaff";
this.ctx.shadowBlur = 25;

    this.ctx.beginPath();

    this.ctx.moveTo(
        thunder.x,
        thunder.y
    );

    let currentX = thunder.x;
    let currentY = thunder.y;

    while (currentY > 50) {

        currentX += (Math.random() - 0.5) * 40;
        currentY -= 40;

        this.ctx.lineTo(
            currentX,
            currentY
        );
    }

    this.ctx.stroke();

    this.ctx.restore();

    });
},
drawThunders() {

    this.thunders.forEach((thunder) => {

        this.ctx.save();

        const alpha = thunder.alpha ?? 1;

        this.ctx.globalAlpha = alpha;

        /*
         * Dünner Energie-Strahl
         * kein Blitz, nur dezenter Lichtfaden
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            thunder.x,
            thunder.y
        );

        this.ctx.lineTo(
            thunder.x,
            thunder.y - 160
        );

        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 1.5;

        this.ctx.shadowColor = "#8eeaff";
        this.ctx.shadowBlur = 12;

        this.ctx.stroke();


        /*
         * Einschlag Glow
         */

        const pulse =
            Math.sin(performance.now() * 0.04) * 0.15 + 0.85;


        this.ctx.globalAlpha =
            alpha * pulse;


        const glow =
            this.ctx.createRadialGradient(
                thunder.x,
                thunder.y,
                0,
                thunder.x,
                thunder.y,
                35
            );


        glow.addColorStop(
            0,
            "rgba(255,255,255,0.9)"
        );

        glow.addColorStop(
            0.3,
            "rgba(180,240,255,0.5)"
        );

        glow.addColorStop(
            1,
            "rgba(0,180,255,0)"
        );


        this.ctx.fillStyle = glow;

        this.ctx.beginPath();

        this.ctx.arc(
            thunder.x,
            thunder.y,
            35,
            0,
            Math.PI * 2
        );

        this.ctx.fill();


        /*
         * kleiner weißer Kern
         */

        this.ctx.fillStyle = "#ffffff";

        this.ctx.shadowBlur = 8;

        this.ctx.beginPath();

        this.ctx.arc(
            thunder.x,
            thunder.y,
            6,
            0,
            Math.PI * 2
        );

        this.ctx.fill();


        this.ctx.restore();

    });

},
createShooter() {

    const color = this.nextColor || this.randomColor();

    this.shooter = {
        x: this.width / 2,
        y: this.height - 62,
        vx: 0,
        vy: 0,
        moving: false,
        isBomb: false,
        isThunder: false,
        color: color,
        image: color.image || null
    };

    this.nextColor = this.randomColor();
    },

    swapShooterBall() {
    if (
        !this.shooter ||
        this.shooter.moving ||
        !this.nextColor
    ) {
        return;
    }

    const currentColor = this.shooter.color;

    this.shooter.color = this.nextColor;
    this.nextColor = currentColor;
    },

    shoot(targetX, targetY) {
      if (
        !this.running ||
        this.levelFinished ||
        !this.shooter ||
        this.shooter.moving
      ) return;

      const dx = targetX - this.shooter.x;
      const dy = Math.min(targetY - this.shooter.y, -40);
      const length = Math.hypot(dx, dy) || 1;
      const speed = 9.6 *
        (state.settings.gameSpeed === "slow"
          ? 0.50
          : state.settings.gameSpeed === "fast"
          ? 1.50
          : 1);

      this.shooter.vx = dx / length * speed;
      this.shooter.vy = dy / length * speed;
      this.shooter.moving = true;

      this.shots++;

      dom.shotsDisplay.textContent = String(this.shots);
    },

    update(deltaTime = 1) {
      let speedMultiplier = 1;

      switch (state.settings.gameSpeed) {
          case "slow":
              speedMultiplier = 0.75;
              break;
          case "fast":
              speedMultiplier = 1.25;
              break;
      }
    this.updateParticles(deltaTime);

    if (this.victoryAnimation) {
        this.updateVictoryAnimation(deltaTime);
        return;
    }
    this.explosions = this.explosions.filter((explosion) => {
      explosion.radius += 8;
      explosion.alpha -= 0.06;

      return explosion.alpha > 0;
    });

    if (this.screenShake > 0) {
    this.screenShake *= 0.85;
      if (this.screenShake < 0.5) {
          this.screenShake = 0;
      }
    }

    this.thunders = this.thunders.filter((thunder) => {

    thunder.life--;

    thunder.alpha -= 0.03;

    return thunder.life > 0;

    });

    this.thunders.forEach((thunder) => {

    if (thunder.targets.length > 0 && thunder.hitTimer <= 0) {

        const target = thunder.targets[thunder.currentTarget];

        if (target) {

    console.log("Thunder trifft Kugel", thunder.currentTarget);

    this.explosions.push({
        x: target.x,
        y: target.y,
        radius: 0,
        alpha: 1
    });

    this.lightningHits.push({
        x: target.x,
        y: target.y,
        life: 15
    });

    this.particles.push({
        x: target.x,
        y: target.y,
        size: 22,
        life: 30,
        color: "#ffffff"
    });

    const removedByThunder = thunder.targets.length;

    this.bubbles = this.bubbles.filter(
        (bubble) => !thunder.targets.includes(bubble) || bubble === target
    );

    this.score += removedByThunder * 100;

    dom.playScore.textContent = `${this.score.toLocaleString("de-DE")} Punkte`;

    this.removeFloatingBubbles();

    this.bubbles = this.bubbles.filter(
        (bubble) => !thunder.targets.includes(bubble) || bubble === target
    );

    this.removeFloatingBubbles();

    thunder.currentTarget++;
    thunder.hitTimer = 25;
}
    }

    thunder.hitTimer--;

    });

    if (!this.running || !this.shooter?.moving) return;

      this.shooter.x += this.shooter.vx * deltaTime * speedMultiplier;
      this.shooter.y += this.shooter.vy * deltaTime * speedMultiplier;
      
      if (
        this.shooter.x <= this.radius ||
        this.shooter.x >= this.width - this.radius
      ) {
        this.shooter.vx *= -1;
        this.shooter.x = Math.max(
          this.radius,
          Math.min(this.width - this.radius, this.shooter.x)
        );
      }

      const ceilingHit = this.shooter.y <= this.radius;
      const bubbleHit = this.bubbles.some((bubble) =>
        Math.hypot(
          bubble.x - this.shooter.x,
          bubble.y - this.shooter.y
        ) <= this.radius * 2 - 2
      );

      if (ceilingHit || bubbleHit) {
      this.attachShooter();

        // Max Schüsse prüfen nach abgeschlossenem Schuss
        const maxShots = STAR_CONFIG[state.selectedLevel].maxShots;

        if (!this.levelFinished && this.shots >= maxShots) {
        this.finish(false);
        return;
    }
    }
},

    attachShooter() {
      if(this.shooter.isBomb) {
        
        this.explodeBomb();
        this.createShooter();
        return;
      }

      if (this.shooter.isThunder) {
        
        this.explodeThunder();
        this.createShooter();
        return;
      }

      const row = Math.max(
          0,
          Math.round((this.shooter.y - this.radius) / this.rowHeight)
      );

      const halfOffset = this.columnWidth / 2;

      const offset =
          row % 2 === 0
              ? this.topRowOffset
              : this.topRowOffset === 0
                  ? halfOffset
                  : 0;

      const column = Math.round(
      (
        this.shooter.x -
        this.gridBaseX -
        offset
      ) / this.columnWidth
      );

      const placed = {
      x: Math.max(
          this.radius,
          Math.min(
              this.width - this.radius,
              this.gridBaseX +
                  column * this.columnWidth +
                  offset
          )
      ),
      y: this.radius + row * this.rowHeight,
      color: this.shooter.color
      };

      this.bubbles.push(placed);

      const connected = this.findConnectedSameColor(placed);

      const removedBubbles = connected.length >= 3;

      if (removedBubbles) {
        Audio.playEffect("hit");

        connected.forEach((bubble) => {
          this.createPopEffect(
            bubble.x,
            bubble.y,
            bubble.color
          );
        });

        const removalSet = new Set(connected);
        this.bubbles = this.bubbles.filter(
          (bubble) => !removalSet.has(bubble)
        );

        this.score += connected.length * 100;
        this.removeFloatingBubbles();

        dom.playScore.textContent = `${this.score.toLocaleString("de-DE")} Punkte`;
      }

      if (
      this.score >= this.targetScore
      ) {
      this.victoryAnimation = true;
      return;
      }

      if (!removedBubbles) {
      this.addNewTopRow();
      }
      
      if (this.bubbles.some(
        (bubble) => bubble.y > this.height - 145
      )) {
        this.finish(false);
        return;
      }

      this.createShooter();
  },

explodeBomb() {
  Audio.playEffect("bomb");

  this.explosions.push({
    x: this.shooter.x,
    y: this.shooter.y,
    radius: 0,
    alpha: 1
  });

  this.screenShake = 12;

  const explosionRadius = this.radius * 2.5;

  const removedByBomb = this.bubbles.filter((bubble) => {
    const distance = Math.hypot(
      bubble.x - this.shooter.x,
      bubble.y - this.shooter.y
    );

    return distance <= explosionRadius;
  });

  // Score: jede zerstörte Kugel = 100 Punkte
  this.score += removedByBomb.length * 100;

  dom.playScore.textContent =
    `${this.score.toLocaleString("de-DE")} Punkte`;

  this.bubbles = this.bubbles.filter((bubble) => {
    const distance = Math.hypot(
      bubble.x - this.shooter.x,
      bubble.y - this.shooter.y
    );

    return distance > explosionRadius;
  });

  this.removeFloatingBubbles();
},

explodeThunder() {

    Audio.playEffect("thunder");

    this.thunders.push({
        x: this.shooter.x,
        y: this.shooter.y,
        alpha: 1,
        life: 8,
        targets: this.findThunderTargets(
          this.shooter.x,
          this.shooter.y
        ),
        currentTarget: 0,
        hitTimer: 0
    });
    console.log(this.thunders[this.thunders.length - 1].targets
    );
},
findThunderTargets(startX, startY) {

  const targets = [];

  let x = startX;
  let y = startY;

  const steps = 20;
  const stepHeight = 25;

  for (let i = 0; i < steps; i++) {

    x += 0;
    y -= stepHeight;

    this.bubbles.forEach((bubble) => {

        const distance = Math.hypot(
            bubble.x - x,
            bubble.y - y
        );

        if (distance < this.radius * 1.3) {

            if (!targets.includes(bubble)) {
                targets.push(bubble);
            }

        }

    });
}


// mindestens eine Kugel pro Reihe treffen
const rows = {};

targets.forEach((bubble) => {

    const row = Math.round(bubble.y / (this.radius * 1,7));

    if (!rows[row]) {
        rows[row] = bubble;
    }

});


return targets;

},

findConnectedSameColor(origin) {
      const result = [];
      const visited = new Set();
      const queue = [origin];

      while (queue.length) {
        const current = queue.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        if (current.color.id !== origin.color.id) continue;
        result.push(current);

        for (const candidate of this.bubbles) {
          if (
            !visited.has(candidate) &&
            candidate.color.id === origin.color.id &&
            Math.hypot(
              candidate.x - current.x,
              candidate.y - current.y
            ) <= this.radius * 2.35
          ) {
            queue.push(candidate);
          }
        }
      }

      return result;
    },

    removeFloatingBubbles() {
      const connectedToTop = new Set();
      const queue = this.bubbles.filter(
        (bubble) => bubble.y <= this.radius + 8
      );

      while (queue.length) {
        const current = queue.shift();

        if (connectedToTop.has(current)) continue;
        connectedToTop.add(current);

        for (const candidate of this.bubbles) {
          if (
            !connectedToTop.has(candidate) &&
            Math.hypot(
              candidate.x - current.x,
              candidate.y - current.y
            ) <= this.radius * 2.35
          ) {
            queue.push(candidate);
          }
        }
      }

      const floating = this.bubbles.filter(
        (bubble) => !connectedToTop.has(bubble)
      );

      if (floating.length) {
        this.score += floating.length * 150;
        this.bubbles = this.bubbles.filter(
          (bubble) => connectedToTop.has(bubble)
        );
      }
    },

    drawBubble(bubble) {

    // Bombenkugel
    if (bubble.isBomb && this.bombImage?.complete) {

        const size = this.radius * 2;

        this.ctx.drawImage(
            this.bombImage,
            bubble.x - this.radius,
            bubble.y - this.radius,
            size,
            size
        );

        return;
    }

    // Thunderkugel
    if (bubble.isThunder && this.thunderImage?.complete) {

    const size = this.radius * 2;

    this.ctx.drawImage(
        this.thunderImage,
        bubble.x - this.radius,
        bubble.y - this.radius,
        size,
        size
    );

    return;
    }

    const size = this.radius * 2;

    // Bildpfad automatisch erzeugen
    const imagePath = `assets/balls/${currentBallTheme}/${bubble.color.id}.png`;


    // Bild aus Cache holen
    if (!this.ballImageCache) {
        this.ballImageCache = {};
    }


    if (!this.ballImageCache[imagePath]) {

        const img = new Image();

        img.src = imagePath;

        this.ballImageCache[imagePath] = img;

        return;
    }


    const img = this.ballImageCache[imagePath];


    // nur zeichnen wenn geladen
    if (img.complete && img.naturalWidth > 0) {

        this.ctx.drawImage(
            img,
            bubble.x - this.radius,
            bubble.y - this.radius,
            size,
            size
        );

        this.drawNewRowFlash(bubble);

        return;
    }


    // Fallback falls Bild noch lädt
    this.ctx.beginPath();

    this.ctx.arc(
        bubble.x,
        bubble.y,
        this.radius,
        0,
        Math.PI * 2
    );

    this.ctx.fillStyle = "#ffffff";

    this.ctx.fill();

    this.drawNewRowFlash(bubble);
    },

    drawNewRowFlash(bubble) {
    if (
        !bubble.isNewRow ||
        !bubble.rowFlashStart ||
        !bubble.rowFlashDuration
    ) {
        return;
    }

    const elapsed = performance.now() - bubble.rowFlashStart;
    const progress = elapsed / bubble.rowFlashDuration;

    if (progress >= 1) {
        bubble.isNewRow = false;
        return;
    }

    const pulse = Math.abs(
        Math.sin(progress * Math.PI * 2)
    );

    const alpha = (1 - progress) * pulse * 0.9;

    this.ctx.save();

    this.ctx.globalAlpha = alpha;
    this.ctx.globalCompositeOperation = "lighter";

    this.ctx.fillStyle = "#ffffff";
    this.ctx.shadowColor = "#ffffff";
    this.ctx.shadowBlur = 18;

    this.ctx.beginPath();
    this.ctx.arc(
        bubble.x,
        bubble.y,
        this.radius + 2,
        0,
        Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.restore();
},

    drawAimGuide() {
      if (!state.settings.aimGuide || this.shooter?.moving) return;

      const dx = this.aimX - this.shooter.x;
      const dy = Math.min(this.aimY - this.shooter.y, -40);
      const length = Math.hypot(dx, dy) || 1;

      this.ctx.save();
      this.ctx.setLineDash([7, 9]);
      this.ctx.strokeStyle = "rgba(255,255,255,.72)";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.shooter.x, this.shooter.y);
      this.ctx.lineTo(
        this.shooter.x + dx / length * 220,
        this.shooter.y + dy / length * 220
      );
      this.ctx.stroke();
      this.ctx.restore();
    },

    draw() {

      if (!this.ctx) return;
      // Zeichenfläche vor jedem Bild vollständig zurücksetzen
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.save();
      if (this.screenShake > 0) {
          const dx = (Math.random() - 0.5) * this.screenShake;
          const dy = (Math.random() - 0.5) * this.screenShake;

          this.ctx.translate(dx, dy);
      }   

      //this.ctx.fillStyle = "rgba(0,0,0,.12)";
      //this.ctx.fillRect(0, 0, this.width, this.height);

      this.bubbles.forEach((bubble) => this.drawBubble(bubble));
      this.drawParticles();
      this.drawThunders();
      this.drawAimGuide();

      if (this.shooter && !this.victoryAnimation) {
        this.drawBubble(this.shooter);
      }

      this.ctx.fillStyle = "rgba(225,225,225,.12)";
      this.ctx.fillRect(0, this.height - 105, this.width, 105);

      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 15px Arial";
      this.ctx.textAlign = "left";
      this.ctx.fillText("Nächste Kugel:", 18, this.height - 28);

      this.ctx.textAlign = "right";

      this.ctx.fillStyle = "rgba(255,255,255,0.75)";
      this.ctx.font = "bold 12px Arial";
      this.ctx.fillText(
          "PUNKTESTAND | ZIEL",
          this.width - 18,
          this.height - 48
      );

      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 17px Arial";
      this.ctx.fillText(
          `${this.score.toLocaleString("de-DE")} | ${this.targetScore.toLocaleString("de-DE")}`,
          this.width - 18,
          this.height - 25
      );

      if (this.nextColor) {
        this.drawBubble({
          x: 160,
          y: this.height - 34,
          color: this.nextColor
        });
      }
    // Ganz wichtig
    this.ctx.restore();
    },

    updateVictoryAnimation(deltaTime) {

      this.bubbles.forEach((bubble) => {

        if (bubble.vy === undefined) {
            bubble.vy = Math.random() * 2;
            bubble.vx =(Math.random() - 0.5) * 1.5;
        }

        bubble.vy += 0.35 * deltaTime;
        bubble.y += bubble.vy * deltaTime;
        bubble.x += bubble.vx * deltaTime; 

        if (bubble.y >= this.height - this.radius) {

          bubble.y = this.height - this.radius;

        if (!bubble.bounced) {

          bubble.bounced = true;
          bubble.vy = -4;

         } else {

        this.createPopEffect(
            bubble.x,
            bubble.y,
            bubble.color
        );

        bubble.remove = true;
      }

    }

        });
        this.bubbles = this.bubbles.filter(b => !b.remove);

        if (this.bubbles.length === 0 && this.score >= this.targetScore) {
            this.finish(true);
        }

    },

    startLoop() {
      cancelAnimationFrame(this.animationFrame);

      let lastTime = performance.now();

      const frame = (currentTime) => {
        if (!this.running) return;

        const deltaTime = Math.min(
          (currentTime - lastTime) / 16.6667,
          2
        );

        lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        this.animationFrame = requestAnimationFrame(frame);
      };

      this.animationFrame = requestAnimationFrame(frame);
      },
    stop() {
      this.running = false;
      cancelAnimationFrame(this.animationFrame);
    },

showLoseShotsPopup(text) {

    dom.loseShotsTitle.textContent = "Leider verloren";

    dom.loseShotsStars.textContent = "";

    dom.loseShotsText.textContent = text;

    dom.nextLevelButton.classList.add("hidden");

    dom.loseShotsPopup.classList.remove("hidden");

    this.levelFinished = true;

    dom.retryShotsButton.onclick = () => {
    dom.loseShotsPopup.classList.add("hidden");
    this.start(state.selectedLevel);
};

dom.shotsMapButton.onclick = () => {
    dom.loseShotsPopup.classList.add("hidden");
    Navigation.show("map");
};
},


    async finish(won) {

    if (this.levelFinished) return;

    this.stop();

    if (!won) {
    this.showLoseShotsPopup(
        "Level verloren!"
    );
    return;
}

    const starsCheck = calculateStars(
    state.selectedLevel,
    {
        shots: this.shots,
        score: this.score
    }
);

if (starsCheck === 0) {

    this.showLoseShotsPopup(
        "Zu viele Schüsse verbraucht."
    );

    return;
}

this.levelFinished = true;
    this.score += 0;

    dom.winResultTitle.textContent = "Level geschafft!";


const level = state.selectedLevel;


const stars = calculateStars(
    level,
    {
        shots: this.shots,
        score: this.score
    }
);


    // 0 Sterne = verloren
    if (stars === 0) {

        dom.loseShotsTitle.textContent = "Leider verloren!";

        dom.loseShotsStars.textContent = "";

        dom.loseShotsText.textContent =
            "Zu viele Schüsse verbraucht.";

        dom.loseShotsPopup.classList.remove("hidden");

        return false;
    }


    // Sterne anzeigen
    dom.winResultStars.textContent = "⭐".repeat(stars);


    dom.winResultText.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte mit ${this.shots} Schüssen.`;

    dom.winResultOverlay.classList.remove("hidden");
    
    const oldResult = (state.progress.results || {})[level];

      if (
        !oldResult ||
        stars > oldResult.stars ||
        this.score > oldResult.score
      ) {
        state.progress.results[level] = {
          stars,
          score: this.score,
          shots: this.shots,
          completedAt: new Date().toISOString()
        };
      }

      if (
        level === state.progress.unlockedLevel &&
        state.progress.unlockedLevel <
          GAME_CONFIG.totalStages * GAME_CONFIG.levelsPerStage
      ) {
        state.progress.unlockedLevel++;
      }
      
      if (won) {

    dom.nextLevelButton.classList.remove("hidden");

    const currentUnlocked =
        Number(state.progress.unlockedLevel) || 1;

    state.progress.unlockedLevel = Math.max(
        currentUnlocked,
        level + 1
    );

    }

      SaveManager.saveProgress(state.progress);

      try {
        await Backend.saveProgress({
          level,
          stars,
          score: this.score,
          shots: this.shots,
          unlockedLevel: state.progress.unlockedLevel
        });
      } catch (error) {
        console.warn("API-Speicherung fehlgeschlagen:", error);
      }

      dom.winResultTitle.textContent = "Level geschafft!";

      const nextButton = document.querySelector("#nextLevelButton");
      if (nextButton) {
    
     nextButton.onclick = () => {
      dom.winResultOverlay.classList.add("hidden");

      state.progress.unlockedLevel = Math.max(
          state.progress.unlockedLevel,
          level + 1
      );

      SaveManager.saveProgress(state.progress);

      setTimeout(() => {
          this.start(level + 1);
      }, 300);
    };
        nextButton.style.display = "block";
      }

      dom.winResultStars.textContent = "★".repeat(stars);
      dom.winResultText.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte mit ` +
        `${this.shots} Schüssen.`;

          // Stage Abschluss prüfen
      const finishedStage = getStageForLevel(level);

      if (level % GAME_CONFIG.levelsPerStage === 0) {

          setTimeout(() => {

              dom.stageCompleteOverlay.classList.remove("hidden");

              dom.stageCompleteName.textContent =
                  `Stage ${finishedStage} geschafft!`;

              dom.stageCompleteText.textContent =
                  "Du hast diese Themenwelt gemeistert!";

              dom.stageCompleteStars.textContent =
                  "⭐".repeat(stars);

          }, 1200);

      }

    },

    getCanvasPosition(event) {
      const rect = this.canvas.getBoundingClientRect();
      const source =
        event.touches?.[0] ||
        event.changedTouches?.[0] ||
        event;

      return {
        x: (source.clientX - rect.left) *
          (this.canvas.width / rect.width),
        y: (source.clientY - rect.top) *
          (this.canvas.height / rect.height)
      };
    },

    bindCanvasEvents() {
      if (this.canvas.dataset.eventsBound === "true") return;
      this.canvas.dataset.eventsBound = "true";

      this.canvas.addEventListener("mousemove", (event) => {
        const position = this.getCanvasPosition(event);
        this.aimX = position.x;
        this.aimY = position.y;
      });

    this.canvas.addEventListener("click", (event) => {
      const position = this.getCanvasPosition(event);

      this.shoot(position.x, position.y);
    });

      this.canvas.addEventListener(
          "touchmove",
          (event) => {
            event.preventDefault();
            const position = this.getCanvasPosition(event);
            this.aimX = position.x;
            this.aimY = position.y;
          },
          { passive: false }
      );

          this.canvas.addEventListener(
      "touchend",
      (event) => {

          event.preventDefault();

          const position = this.getCanvasPosition(event);

          this.shoot(position.x, position.y);

      },
      { passive:false }
      );
    }
  };

  const Ranking = {
    async render() {
      dom.rankingList.innerHTML = "<p style='padding:16px'>Ranking wird geladen …</p>";

      try {
        const entries = await Backend.getRanking();

        dom.rankingList.innerHTML = entries.map((entry) => `
          <div class="ranking-row ${entry.me ? "me" : ""}">
            <strong>#${entry.rank}</strong>
            <span>${escapeHtml(entry.username)}</span>
            <b>${Number(entry.score).toLocaleString("de-DE")}</b>
          </div>
        `).join("");
      } catch {
        dom.rankingList.innerHTML =
          "<p style='padding:16px'>Ranking konnte nicht geladen werden.</p>";
      }
    }
  };

  function getStageForLevel(levelNumber) {
    return Math.ceil(levelNumber / GAME_CONFIG.levelsPerStage);
  }

  function getTotalStars() {
    const results = state.progress.results || {};

    return Object.values(results)
        .reduce((sum, result) => {
            return sum + Number(result.stars || 0);
        }, 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  let toastTimer = null;

  function showToast(message) {
    clearTimeout(toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.remove("hidden");

    toastTimer = setTimeout(() => {
      dom.toast.classList.add("hidden");
    }, 2400);
  }

  function applySettingsToForm() {
    dom.musicSetting.checked = state.settings.music;
    dom.soundSetting.checked = state.settings.sound;
    dom.aimSetting.checked = state.settings.aimGuide;

    dom.speedOptions.forEach((option) => {
    option.classList.toggle(
        "active",
        option.dataset.speed === state.settings.gameSpeed
    );
  });
  }

  function saveSettingsFromForm() {
    state.settings.music = dom.musicSetting.checked;
    state.settings.sound = dom.soundSetting.checked;
    Audio.syncSettings();
    state.settings.aimGuide = dom.aimSetting.checked;
    state.settings.gameSpeed = dom.gameSpeedSetting.value;

    SaveManager.saveSettings(state.settings);
    showToast("Einstellungen gespeichert.");
  }

  function updateUserUi() {
    dom.profileName.textContent =
      state.user?.username || "Gast";

    dom.loginButton.textContent =
      state.user ? "Angemeldet" : "Login-Demo";

    dom.loginButton.disabled = Boolean(state.user);
  }

  dom.loginButton.addEventListener("click", async () => {
    state.user = await Backend.login();
    updateUserUi();
    showToast("Demo-Nutzer wurde angemeldet.");
  });

  dom.continueButton.addEventListener("click", () => {
    state.progress.selectedStage =
      getStageForLevel(state.progress.unlockedLevel);

    SaveManager.saveProgress(state.progress);
    Navigation.show("map");
  });

  dom.newGameButton.addEventListener("click", () => {
    const confirmed = confirm(
      "Soll der aktuelle Fortschritt wirklich gelöscht werden?"
    );

    if (!confirmed) return;

    localStorage.clear();
    state.progress = SaveManager.loadProgress();
    ThemeManager.apply(state.progress.activeTheme);
    showToast("Neuer Spielstand wurde angelegt.");
  });

  dom.openMapButton.addEventListener("click", () => Navigation.show("map"));
  dom.openThemesButton.addEventListener("click", () => Navigation.show("themes"));
  dom.openRankingButton.addEventListener("click", () => Navigation.show("ranking"));
  dom.openSettingsButton.addEventListener("click", () => Navigation.show("settings"));
  
  dom.bombItemButton.addEventListener("click", () => {
    BubbleGame.activateBombBall();
  });

  dom.switchItemButton.addEventListener("click", () => {
    BubbleGame.activateSwitchBall();
  })

  dom.thunderItemButton.addEventListener("click", () => {
    BubbleGame.activateThunderBall();
  });

  dom.settingsItemButton.addEventListener("click", () => {
      Navigation.show("settings");
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
      Navigation.show(button.dataset.back);
    });
  });

  dom.previousStage.addEventListener("click", () => {
    if (state.progress.selectedStage > 1) {
      state.progress.selectedStage--;
      SaveManager.saveProgress(state.progress);
      StageMap.render();
    }
  });

  dom.nextStage.addEventListener("click", () => {
    const next = state.progress.selectedStage + 1;

    if (
      next <= GAME_CONFIG.totalStages &&
      StageMap.isStageUnlocked(next)
    ) {
      state.progress.selectedStage = next;
      SaveManager.saveProgress(state.progress);
      StageMap.render();
    }
  });

  function scrollToGame(speed = "comfortable") {
    const durations = {
        fast: 400,
        comfortable: 700,
        premium: 1200
    };

    const duration = durations[speed] || durations.comfortable;

    const startPosition = window.scrollY;

    const targetPosition =
        dom.gameCanvas.getBoundingClientRect().top +
        window.scrollY -
        20;

    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        window.scrollTo(
            0,
            startPosition + distance * easedProgress
        );

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

  dom.startLevelButton.addEventListener("click", () => {
    Audio.stopBackground();
    Audio.playEffect("levelStart");

    BubbleGame.start(state.selectedLevel);

    setTimeout(() => {
      scrollToGame("premium")
    }, 300);
  });

  dom.leaveGameButton.addEventListener("click", () => {
    BubbleGame.stop();
    Navigation.show("level");
  });

  dom.retryLevelButton.addEventListener("click", () => {
    BubbleGame.start(state.selectedLevel);
  });

  dom.resultMapButton.addEventListener("click", () => {
    BubbleGame.stop();
    state.progress.selectedStage =
      getStageForLevel(state.selectedLevel);
    SaveManager.saveProgress(state.progress);
    Navigation.show("map");
  });

  dom.stageCompleteButton.addEventListener("click", () => {
    dom.stageCompleteOverlay.classList.add("hidden");

    state.progress.selectedStage =
        getStageForLevel(state.progress.unlockedLevel);

    SaveManager.saveProgress(state.progress);

    Navigation.show("map");
  });

  [
      dom.musicSetting,
      dom.soundSetting,
      dom.aimSetting,
  ].forEach((input) => {
    input.addEventListener("change", saveSettingsFromForm);
  });

  dom.speedOptions.forEach((option) => {
    option.addEventListener("click", () => {

        dom.speedOptions.forEach((item) =>
            item.classList.remove("active")
        );

        option.classList.add("active");

        state.settings.gameSpeed = option.dataset.speed;

        SaveManager.saveSettings(state.settings);

        showToast("Einstellungen gespeichert.");
    });
  });

  dom.resetProgressButton.addEventListener("click", () => {
    const confirmed = confirm(
        "Alle Level, Sterne und Freischaltungen löschen?"
    );

    if (!confirmed) return;

    localStorage.clear();

    location.reload();
});

  function init() {
    ThemeManager.apply(state.progress.activeTheme);
    ThemeManager.applyStageAssets(state.progress.selectedStage);
    applySettingsToForm();
    updateUserUi();
    Navigation.show("home");
  }

  init();
})();
