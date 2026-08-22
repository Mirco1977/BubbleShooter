  import { GAME_CONFIG } from "./js/config/gameConfig.js";
  import { STAGES, getStageNumberForLevel } from "./js/config/stageConfig.js";
  import { SHOP_CONFIG } from "./js/config/shopConfig.js";
  import { WHEEL_CONFIG } from "./js/config/wheelConfig.js";
  import { EPISODE_CONFIG, getEpisodeById, getEpisodeStatus, calculateEpisodeStars } from "./js/config/episodeConfig.js";
  import { AudioManager } from "./js/managers/AudioManager.js";
  import { StorageManager } from "./js/managers/StorageManager.js";
  import { calculateStars, STAR_CONFIG } from "./js/config/starConfig.js";
  import { ALBUM_CONFIG, getAlbumCardForLevel } from "./js/config/albumConfig.js";

  (() => {

  "use strict";

  // LEVEL 70 – SCHWERT-SPEZIALLEVEL
  // Das Longsword aus Sammelalbum 1 steht im Spielfeld.
  // Der Goldball muss freigespielt werden; erst sein Fall startet den Sieg-Ablauf.
  STAR_CONFIG[70] = {
    ...(STAR_CONFIG[70] || {}),
    ballTypes: STAR_CONFIG[70]?.ballTypes ?? 5,
    rows: STAR_CONFIG[70]?.rows ?? 7,
    addRowAfterShot: "n",
    mode: "sword",
    sword: {
      // Reihe 3 = zwei vollständige Kugelreihen oberhalb des Goldballs.
      row: 3,
      col: 7,
      image: "assets/albums/swords/longsword.png",
      name: "Longsword"
    }
  };

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
    description: "Fußballweltmeisterschaft",
    logo: "assets/logos/WM-Pokal.png",

    colors: {
      brand: "#c9972b",
      brandDark: "#75151b",
      page: "#071b26"
    },

    previews: {
      card: "linear-gradient(135deg, #75151b, #c9972b)"
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
  },


  volcano: {
    id: "volcano",
    name: "Volcano Stadium",
    description: "Feuer, Lava und Vulkane",
    logo: "assets/logos/volcano.png",

    colors: {
      brand: "#c0392b",
      brandDark: "#541000",
      page: "#21100d"
    },

    previews: {
      card: "linear-gradient(135deg, #541000, #c0392b)"
    }
  },


  pirate: {
    id: "pirate",
    name: "Pirate Island",
    description: "Schätze, Inseln und Abenteuer",
    logo: "assets/logos/pirate.png",

    colors: {
      brand: "#8b6b32",
      brandDark: "#3b2a12",
      page: "#17231c"
    },

    previews: {
      card: "linear-gradient(135deg, #3b2a12, #8b6b32)"
    }
  },


  jungle: {
    id: "jungle",
    name: "Jungle Arena",
    description: "Dschungel und wilde Natur",
    logo: "assets/logos/dragon.png",

    colors: {
      brand: "#2e8b57",
      brandDark: "#12351f",
      page: "#101d14"
    },

    previews: {
      card: "linear-gradient(135deg, #12351f, #2e8b57)"
    }
  },


  kingdom: {
    id: "kingdom",
    name: "Royal Kingdom",
    description: "Ritter, Könige und Burgen",
    logo: "assets/logos/kingdom.png",

    colors: {
      brand: "#d4af37",
      brandDark: "#5b4210",
      page: "#18140a"
    },

    previews: {
      card: "linear-gradient(135deg, #5b4210, #d4af37)"
    }
  },


  dragon: {
    id: "dragon",
    name: "Dragon Fantasy",
    description: "Drachen und Fantasywelten",
    logo: "assets/logos/dragon.png",

    colors: {
      brand: "#8b0000",
      brandDark: "#250000",
      page: "#180d14"
    },

    previews: {
      card: "linear-gradient(135deg, #250000, #8b0000)"
    }
  },


  crystal: {
    id: "crystal",
    name: "Crystal Cave",
    description: "Kristalle und geheimnisvolle Höhlen",
    logo: "assets/logos/crystal.png",

    colors: {
      brand: "#4b7bec",
      brandDark: "#172554",
      page: "#10182b"
    },

    previews: {
      card: "linear-gradient(135deg, #172554, #4b7bec)"
    }
  },


  monster: {
    id: "monster",
    name: "Monster Stadium",
    description: "Monster, Kreaturen und Herausforderungen",
    logo: "assets/logos/monster.png",

    colors: {
      brand: "#6b8e23",
      brandDark: "#182400",
      page: "#10140a"
    },

    previews: {
      card: "linear-gradient(135deg, #182400, #6b8e23)"
    }
  }

};

const THEME_PATH = [
  { stage: 1, row: 1, col: 1, arrow:"right" },
  { stage: 2, row: 1, col: 2, arrow:"down" },

  { stage: 3, row: 2, col: 2, arrow:"left" },
  { stage: 4, row: 2, col: 1, arrow:"down" },

  { stage: 5, row: 3, col: 1, arrow:"right" },
  { stage: 6, row: 3, col: 2, arrow:"down" },

  { stage: 7, row: 4, col: 2, arrow:"left" },
  { stage: 8, row: 4, col: 1, arrow:"down" },

  { stage: 9, row: 5, col: 1, arrow:"right" },
  { stage: 10, row: 5, col: 2 }
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
      level: $("levelScreen"),
      play: $("playScreen"),
      themes: $("themesScreen"),
      ranking: $("rankingScreen"),
      shop: $("shopScreen"),
      wheel: $("wheelScreen"),
      episodes: $("episodesScreen"),
      albums: $("albumsScreen"),
      settings: $("settingsScreen"),
      wolrdMap2: $("worldMap2Screen")
    },

    profileName: $("profileName"),
    loginButton: $("loginButton"),
    continueButton: $("continueButton"),
    newGameButton: $("newGameButton"),
    openMapButton: $("openMapButton"),
  
    openRankingButton: $("openRankingButton"),
    openShopButton: $("openShopButton"),
    openWheelButton: $("openWheelButton"),
    openEpisodesButton: $("openEpisodesButton"),
    openAlbumsButton: $("openAlbumsButton"),
    albumHomeStatus: $("albumHomeStatus"),
    albumScreenCounter: $("albumScreenCounter"),
    albumProgressFill: $("albumProgressFill"),
    albumProgressText: $("albumProgressText"),
    albumCardGrid: $("albumCardGrid"),
    albumRewardState: $("albumRewardState"),
    albumCompletionShowcase: $("albumCompletionShowcase"),
    albumCompletionImage: $("albumCompletionImage"),
    albumRewardOverlay: $("albumRewardOverlay"),
    albumRewardItems: $("albumRewardItems"),
    albumRewardClose: $("albumRewardClose"),
    albumCardReward: $("albumCardReward"),
    albumUnlockImage: $("albumUnlockImage"),
    albumUnlockName: $("albumUnlockName"),
    albumUnlockProgress: $("albumUnlockProgress"),
    albumUnlockBonus: $("albumUnlockBonus"),
    episodeHomeStatus: $("episodeHomeStatus"),
    episodeList: $("episodeList"),
    episodeScreenBadge: $("episodeScreenBadge"),
    levelBackButton: $("levelBackButton"),
    openSettingsButton: $("openSettingsButton"),
    bombItemButton: $("bombItemButton"),
    thunderItemButton: $("thunderItemButton"),
    rainbowItemButton: $("rainbowItemButton"),
    colorBombItemButton: $("colorBombItemButton"),
    hourglassItemButton: $("hourglassItemButton"),
    switchItemButton: $("switchItemButton"),
    aimItemButton: $("aimItemButton"),
    settingsItemButton: $("settingsItemButton"),

    stageBanner: $("stageBanner"),

    selectedLevelTitle: $("selectedLevelTitle"),
    selectedStageBadge: $("selectedStageBadge"),
    levelPreviewGraphic: $("levelPreviewGraphic"),
    levelGoalText: $("levelGoalText"),
    levelColors: $("levelColors"),
    levelTarget: $("levelTarget"),
    levelBest: $("levelBest"),
    preLevelLoadout: $("preLevelLoadout"),
    preLevelLoadoutSlots: $("preLevelLoadoutSlots"),
    preLevelLoadoutItems: $("preLevelLoadoutItems"),
    preLevelLoadoutHint: $("preLevelLoadoutHint"),
    startLevelButton: $("startLevelButton"),

    playLevelTitle: $("playLevelTitle"),
    playScore: $("playScore"),
    leaveGameButton: $("leaveGameButton"),
    targetScoreDisplay: $("targetScoreDisplay"),
    shotsDisplay: $("shotsDisplay"),
    colorsDisplay: $("colorsDisplay"),
    speedTimerHud: $("speedTimerHud"),
    speedTimerDisplay: $("speedTimerDisplay"),
    speedCountdownOverlay: $("speedCountdownOverlay"),
    speedCountdownText: $("speedCountdownText"),
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
    itemUnlockReward: $("itemUnlockReward"),
    itemUnlockImage: $("itemUnlockImage"),
    itemUnlockName: $("itemUnlockName"),

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
    shopOffers: $("shopOffers"),
    wheelStatus: $("wheelStatus"),
    wheelDisc: $("wheelDisc"),
    wheelSegments: $("wheelSegments"),
    wheelSpinButton: $("wheelSpinButton"),
    wheelReward: $("wheelReward"),
    wheelRewardImage: $("wheelRewardImage"),
    wheelRewardTitle: $("wheelRewardTitle"),
    wheelRewardText: $("wheelRewardText"),
    wheelRewardItems: $("wheelRewardItems"),
    wheelWinLock: $("wheelWinLock"),
    wheelVictoryCard: $("wheelVictoryCard"),
    wheelPaidSpinButton: $("wheelPaidSpinButton"),
    wheelVictoryBackButton: $("wheelVictoryBackButton"),

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
    selectedLevel: 1,
    gameMode: "standard",
    activeEpisodeId: null
  };

const ITEM_START_AMOUNT = 5;

const ITEM_UNLOCKS = {

  ballswitch: {
    button: dom.switchItemButton,
    unlockLevel: 5,
    label: "Ball Switch",
    image: "assets/ui/ballswitch.png"
  },

  rainbow: {
    button: dom.rainbowItemButton,
    unlockLevel: 15,
    label: "Regenbogenball",
    image: "assets/ui/rainbow-ball.png"
  },

  aim: {
    button: dom.aimItemButton,
    unlockLevel: 25,
    label: "Zielhilfe",
    image: "assets/ui/lupe.png"
  },

  bomb: {
    button: dom.bombItemButton,
    unlockLevel: 35,
    label: "Bombenball",
    image: "assets/ui/bomb-ball.png"
  },

  thunder: {
    button: dom.thunderItemButton,
    unlockLevel: 45,
    label: "Thunder Ball",
    image: "assets/ui/thunder-ball.png"
  },

  colorbomb: {
    button: dom.colorBombItemButton,
    unlockLevel: 55,
    label: "Farbbombe",
    image: "assets/ui/color-bomb.png"
  },

  hourglass: {
    button: dom.hourglassItemButton,
    unlockLevel: 65,
    label: "Sanduhr",
    image: "assets/ui/hourglass.png"
  }

};

function ensureItemInventory() {
  if (!state.progress.inventory || typeof state.progress.inventory !== "object") {
    state.progress.inventory = {};
  }

  if (!state.progress.itemStarterRewards || typeof state.progress.itemStarterRewards !== "object") {
    state.progress.itemStarterRewards = {};
  }

  Object.keys(ITEM_UNLOCKS).forEach((itemKey) => {
    const currentAmount = Number(state.progress.inventory[itemKey]);
    if (!Number.isFinite(currentAmount)) {
      state.progress.inventory[itemKey] = 0;
    }
  });
}

function isItemUnlocked(itemKey) {
  const item = ITEM_UNLOCKS[itemKey];
  if (!item) return false;

  return Boolean(
    (state.progress.results || {})[item.unlockLevel]
  );
}

function getItemAmount(itemKey) {
  ensureItemInventory();
  return Math.max(0, Number(state.progress.inventory[itemKey]) || 0);
}

function addItemAmount(itemKey, amount = 1, save = true) {
  if (!ITEM_UNLOCKS[itemKey]) return false;

  ensureItemInventory();

  const addAmount = Math.max(0, Number(amount) || 0);
  state.progress.inventory[itemKey] = getItemAmount(itemKey) + addAmount;

  if (save) {
    SaveManager.saveProgress(state.progress);
  }

  updateItemBarLocks();
  return true;
}

function consumeItem(itemKey, amount = 1) {
  if (!ITEM_UNLOCKS[itemKey]) return false;
  if (!isItemUnlocked(itemKey)) return false;

  ensureItemInventory();

  const consumeAmount = Math.max(1, Number(amount) || 1);
  const currentAmount = getItemAmount(itemKey);

  if (currentAmount < consumeAmount) {
    showToast(`${ITEM_UNLOCKS[itemKey].label} ist nicht mehr verfügbar.`);
    updateItemBarLocks();
    return false;
  }

  state.progress.inventory[itemKey] = currentAmount - consumeAmount;
  SaveManager.saveProgress(state.progress);
  updateItemBarLocks();

  return true;
}

function grantUnlockedItemStarterRewards() {
  ensureItemInventory();

  let changed = false;

  Object.entries(ITEM_UNLOCKS).forEach(([itemKey]) => {
    const unlocked = isItemUnlocked(itemKey);
    const alreadyGranted = Boolean(state.progress.itemStarterRewards[itemKey]);

    if (unlocked && !alreadyGranted) {
      state.progress.inventory[itemKey] = getItemAmount(itemKey) + ITEM_START_AMOUNT;
      state.progress.itemStarterRewards[itemKey] = true;
      changed = true;
    }
  });

  if (changed) {
    SaveManager.saveProgress(state.progress);
  }
}

function updateItemBarLocks() {
  ensureItemInventory();

  Object.entries(ITEM_UNLOCKS).forEach(([itemKey, item]) => {
    const unlocked = isItemUnlocked(itemKey);
    const amount = getItemAmount(itemKey);
    const empty = unlocked && amount <= 0;
    const speedOnlyUnavailable =
      itemKey === "hourglass" &&
      (!BubbleGame.speedMode || !BubbleGame.running || BubbleGame.levelFinished);
    const notEquipped =
      Boolean(BubbleGame.running) &&
      !BubbleGame.equippedItems?.has(itemKey);
    const countElement = item.button.querySelector(".item-count");

    if (countElement) {
      countElement.textContent = String(amount);
    }

    item.button.classList.toggle("locked-item", !unlocked);
    item.button.classList.toggle("item-mode-disabled", unlocked && speedOnlyUnavailable);
    item.button.classList.toggle("item-not-equipped", unlocked && notEquipped);
    item.button.disabled = !unlocked || empty || speedOnlyUnavailable || notEquipped;

    if (!unlocked) {
      item.button.setAttribute(
        "aria-label",
        `${item.label} – gesperrt bis Level ${item.unlockLevel}`
      );
      item.button.title = `Wird nach dem Gewinn von Level ${item.unlockLevel} freigeschaltet`;
    } else if (empty) {
      item.button.setAttribute("aria-label", `${item.label} – Bestand 0`);
      item.button.title = `${item.label}: 0 verfügbar`;
    } else if (notEquipped) {
      item.button.setAttribute("aria-label", `${item.label} – nicht für dieses Level ausgewählt`);
      item.button.title = `${item.label}: nicht im Loadout`;
    } else if (speedOnlyUnavailable) {
      item.button.setAttribute("aria-label", `${item.label} – nur im Speedgame nutzbar`);
      item.button.title = `${item.label}: nur im Speedgame nutzbar`;
    } else {
      item.button.setAttribute("aria-label", `${item.label} – ${amount} verfügbar`);
      item.button.title = `${item.label}: ${amount} verfügbar`;
    }
  });
}

const PreLevelLoadout = {
  maxItems: 4,
  selected: [],
  levelConfig: null,

  open(levelConfig) {
    this.levelConfig = levelConfig || {};
    this.selected = [];
    this.render();
  },

  isSpeedGame() {
    return this.levelConfig?.mode === "speed";
  },

  isAvailable(itemKey) {
    if (!isItemUnlocked(itemKey)) return false;
    if (getItemAmount(itemKey) <= 0) return false;
    if (itemKey === "hourglass" && !this.isSpeedGame()) return false;
    return true;
  },

  toggle(itemKey) {
    if (!this.isAvailable(itemKey)) return;

    const index = this.selected.indexOf(itemKey);
    if (index >= 0) {
      this.selected.splice(index, 1);
      this.render();
      return;
    }

    if (this.selected.length >= this.maxItems) {
      if (dom.preLevelLoadoutHint) {
        dom.preLevelLoadoutHint.textContent = "Maximal 4 Items pro Level.";
        dom.preLevelLoadoutHint.classList.add("show");
        setTimeout(() => dom.preLevelLoadoutHint?.classList.remove("show"), 1200);
      }
      return;
    }

    this.selected.push(itemKey);
    this.render();
  },

  removeAt(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.selected.length) return;
    this.selected.splice(slotIndex, 1);
    this.render();
  },

  getSelected() {
    return [...this.selected];
  },

  render() {
    if (!dom.preLevelLoadoutItems || !dom.preLevelLoadoutSlots) return;

    ensureItemInventory();

    const slots = [...dom.preLevelLoadoutSlots.querySelectorAll(".prelevel-loadout-slot")];
    slots.forEach((slot, index) => {
      const itemKey = this.selected[index];
      const item = itemKey ? ITEM_UNLOCKS[itemKey] : null;
      slot.innerHTML = item
        ? `<img src="${item.image}" alt="${item.label}"><span class="prelevel-slot-remove" aria-hidden="true">×</span>`
        : `<span class="prelevel-slot-plus" aria-hidden="true">+</span>`;
      slot.classList.toggle("filled", Boolean(item));
      slot.title = item ? `${item.label} entfernen` : `Freier Item-Slot ${index + 1}`;
    });

    dom.preLevelLoadoutItems.innerHTML = "";

    // Statische 3x3-Auswahl: alle sieben existierenden Items bleiben immer
    // sichtbar. Noch nicht freigeschaltete Items sind abgedunkelt und mit
    // einem Schloss überlagert. Die Felder 8 und 9 bleiben reserviert.
    Object.entries(ITEM_UNLOCKS).forEach(([itemKey, item]) => {
      const unlocked = isItemUnlocked(itemKey);
      const amount = getItemAmount(itemKey);
      const selected = this.selected.includes(itemKey);
      const speedBlocked = unlocked && itemKey === "hourglass" && !this.isSpeedGame();
      const empty = unlocked && amount <= 0;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "prelevel-item-button";
      button.classList.toggle("selected", selected);
      button.classList.toggle("locked", !unlocked);
      button.classList.toggle("mode-disabled", speedBlocked);
      button.classList.toggle("empty", empty);
      button.disabled = false; // Info-i bleibt auch bei gesperrten Items anklickbar.
      button.setAttribute("aria-disabled", !unlocked || speedBlocked || empty ? "true" : "false");
      button.dataset.itemKey = itemKey;
      button.innerHTML = `
        <img src="${item.image}" alt="${item.label}">
        <span class="item-info-button prelevel-item-info" data-item="${itemKey}" role="button" aria-label="Info zu ${item.label}" tabindex="0">i</span>
        <span class="prelevel-item-count">${unlocked ? amount : ""}</span>
        <span class="prelevel-item-name">${item.label}</span>
        ${!unlocked ? '<span class="prelevel-item-lock" aria-hidden="true">🔒</span>' : ""}
        ${selected ? '<span class="prelevel-item-check">✓</span>' : ""}
      `;

      if (!unlocked) {
        button.title = `Wird nach dem Gewinn von Level ${item.unlockLevel} freigeschaltet`;
        button.setAttribute("aria-label", `${item.label} – gesperrt bis Level ${item.unlockLevel}`);
      } else if (speedBlocked) {
        button.title = "Nur im Speedgame auswählbar";
        button.setAttribute("aria-label", `${item.label} – nur im Speedgame auswählbar`);
      } else if (empty) {
        button.title = `${item.label}: kein Bestand`;
        button.setAttribute("aria-label", `${item.label} – kein Bestand`);
      } else {
        button.title = selected ? `${item.label} abwählen` : `${item.label} auswählen`;
        button.setAttribute("aria-label", `${item.label} – Bestand ${amount}`);
      }

      button.addEventListener("click", (event) => {
        if (event.target.closest(".item-info-button")) return;
        this.toggle(itemKey);
      });
      dom.preLevelLoadoutItems.appendChild(button);
    });

    // Zwei feste Reservefelder, bis weitere Items hinzukommen.
    for (let reserve = 0; reserve < 2; reserve += 1) {
      const placeholder = document.createElement("div");
      placeholder.className = "prelevel-item-button prelevel-item-placeholder";
      placeholder.setAttribute("aria-label", "Noch nicht verfügbares Item");
      placeholder.innerHTML = '<span class="prelevel-placeholder-lock" aria-hidden="true">🔒</span>';
      dom.preLevelLoadoutItems.appendChild(placeholder);
    }

    if (dom.preLevelLoadoutHint && !dom.preLevelLoadoutHint.classList.contains("show")) {
      dom.preLevelLoadoutHint.textContent = `${this.selected.length}/${this.maxItems} Items ausgewählt`;
    }
  }
};

function showUnlockedItemReward(levelNumber, wasAlreadyCompleted) {
  const unlockedEntry = Object.entries(ITEM_UNLOCKS).find(
    ([, item]) => item.unlockLevel === Number(levelNumber)
  );

  if (!unlockedEntry) {
    dom.itemUnlockReward.classList.add("hidden");
    dom.itemUnlockImage.removeAttribute("src");
    dom.itemUnlockImage.alt = "";
    dom.itemUnlockName.textContent = "";
    return;
  }

  const [itemKey, unlockedItem] = unlockedEntry;

  ensureItemInventory();

  // Merkt sich separat, ob die Freischalt-Animation bereits gezeigt wurde.
  // Das ist besonders für nachträglich eingebaute Items wichtig: Ein Spieler
  // kann Level 55/65 schon vor der Einführung des Items geschafft haben.
  // In diesem Fall darf ein vorhandenes altes Level-Ergebnis die neue
  // Freischalt-Animation nicht unterdrücken.
  if (!state.progress.itemUnlockAnimationsShown ||
      typeof state.progress.itemUnlockAnimationsShown !== "object") {
    state.progress.itemUnlockAnimationsShown = {};
  }

  const retroactiveItems = new Set(["colorbomb", "hourglass"]);
  const animationAlreadyShown = Boolean(
    state.progress.itemUnlockAnimationsShown[itemKey]
  );

  // Für die bisherigen Items bleibt das alte Verhalten erhalten.
  // Farbbombe und Sanduhr dürfen dagegen einmalig auch bei einem bereits
  // früher absolvierten Level ihre Freischalt-Animation nachholen.
  if (animationAlreadyShown || (wasAlreadyCompleted && !retroactiveItems.has(itemKey))) {
    dom.itemUnlockReward.classList.add("hidden");
    dom.itemUnlockImage.removeAttribute("src");
    dom.itemUnlockImage.alt = "";
    dom.itemUnlockName.textContent = "";
    return;
  }

  const alreadyGranted = Boolean(state.progress.itemStarterRewards[itemKey]);

  if (!alreadyGranted) {
    state.progress.inventory[itemKey] = getItemAmount(itemKey) + ITEM_START_AMOUNT;
    state.progress.itemStarterRewards[itemKey] = true;
  }

  state.progress.itemUnlockAnimationsShown[itemKey] = true;
  SaveManager.saveProgress(state.progress);

  dom.itemUnlockImage.src = unlockedItem.image;
  dom.itemUnlockImage.alt = unlockedItem.label;
  dom.itemUnlockName.textContent = `${unlockedItem.label} ×${ITEM_START_AMOUNT}`;
  dom.itemUnlockReward.classList.remove("hidden");

  // Animation auch dann zuverlässig neu starten, wenn das Ergebnis-Popup
  // bereits zuvor im selben Browser-Lauf geöffnet war.
  dom.itemUnlockReward.classList.remove("item-unlock-replay");
  void dom.itemUnlockReward.offsetWidth;
  dom.itemUnlockReward.classList.add("item-unlock-replay");

  updateItemBarLocks();
}

function startVictoryImpact(stars) {

    const starAmount =
        Math.max(0, Number(stars) || 0);

    dom.winResultStars.innerHTML =
        Array.from(
            { length: starAmount },
            (_, index) => `
                <span
                    class="victory-impact-star"
                    style="--star-index:${index};"
                    aria-hidden="true">
                    ★
                </span>
            `
        ).join("");

    dom.winResultStars.setAttribute(
        "aria-label",
        `${starAmount} von 3 Sternen`
    );

    dom.winResultOverlay.classList.remove(
        "victory-impact-active"
    );

    dom.winResultOverlay.classList.remove("hidden");

    void dom.winResultOverlay.offsetWidth;

    dom.winResultOverlay.classList.add(
        "victory-impact-active"
    );

}

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

      const stageData = STAGES[stageNumber - 1] || STAGES[0];
      const stageBackground = stageData?.background;
      const mapBackground = stageData?.background;
      const gameBackground = stageData?.background;

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
      const levelBackground = STAGES[stage - 1]?.background || null;

      document.documentElement.style.setProperty(
        "--level-background",
        levelBackground ? `url("${levelBackground}")` : "none"
      );
    },

    renderList() {
      dom.themeList.innerHTML = "";
      const path = THEME_PATH;

      const arrows = [
      {
        symbol:"→",
        row:1,
        col:1
      },
      {
        symbol:"↓",
        row:2,
        col:2
      },
      {
        symbol:"←",
        row:2,
        col:1
      },
      {
        symbol:"↓",
        row:3,
        col:1
      },
      {
        symbol:"→",
        row:3,
        col:1
      }
    ];

      Object.values(THEMES).forEach((theme, index) => {

      const currentPath = path[index];

      const nextPath = path[index + 1];

      if (nextPath && currentPath.arrow) {

      const arrow = document.createElement("div");

      arrow.className = "theme-path-arrow";

      arrow.textContent =
          currentPath.arrow === "right" ? "→" :
          currentPath.arrow === "left" ? "←" :
          "↓";


            arrow.style.position = "absolute";

      if (currentPath.arrow === "right") {
          arrow.style.left = "calc(50% + 0)";
          arrow.style.top = `${(currentPath.row - 1) * 150 + 65}px`;
      }

      if (currentPath.arrow === "left") {
          arrow.style.left = "calc(50% + 0px)";
          arrow.style.top = `${(currentPath.row - 1) * 150 + 65}px`;
      }

      if (currentPath.arrow === "down") {
          arrow.style.left = currentPath.col === 1 ? "25%" : "75%";
          arrow.style.transform = "translateX(-50%)";
      }


      dom.themeList.appendChild(arrow);

      }

      const button = document.createElement("button");

      const stageNumber = index + 1;

      const position = THEME_PATH[index];

      button.className = `theme-card stage-${stageNumber}`;

      button.style.gridColumn = position.col;

      button.style.gridRow = position.row;

        if (state.progress.activeTheme === theme.id) {
          button.classList.add("active");
        }

        button.style.background = theme.previews.card;
      
        button.innerHTML = `

      ${
      theme.logo
      ?
      `
      <img
      src="${escapeHtml(theme.logo)}"
      class="theme-card-logo"
      alt="${escapeHtml(theme.name)} Logo">
      `
      :
      ""
      }


      <div class="theme-card-text">

      <strong>
      ${escapeHtml(theme.name)}
      </strong>

      </div>


      ${
      state.progress.activeTheme === theme.id
      ?
      `
      <div class="theme-active-mark">
      ✓
      </div>
      `
      :
      ""
      }

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


  const EpisodeRace = {
    storageKey: "bandenkick_episode_progress_v1",

    loadProgress() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (error) {
        console.warn("Episoden-Fortschritt konnte nicht geladen werden:", error);
        return {};
      }
    },

    saveProgress(progress) {
      localStorage.setItem(this.storageKey, JSON.stringify(progress || {}));
    },

    getEpisodeProgress(episodeId) {
      const all = this.loadProgress();
      if (!all[episodeId] || typeof all[episodeId] !== "object") {
        all[episodeId] = { results: {}, unlockedLevel: 1, completedAt: null };
        this.saveProgress(all);
      }
      if (!all[episodeId].results || typeof all[episodeId].results !== "object") {
        all[episodeId].results = {};
      }
      all[episodeId].unlockedLevel = Math.max(1, Number(all[episodeId].unlockedLevel) || 1);
      return all[episodeId];
    },

    updateEpisodeProgress(episodeId, updater) {
      const all = this.loadProgress();
      const current = all[episodeId] || { results: {}, unlockedLevel: 1, completedAt: null };
      current.results = current.results || {};
      current.unlockedLevel = Math.max(1, Number(current.unlockedLevel) || 1);
      updater(current);
      all[episodeId] = current;
      this.saveProgress(all);
      return current;
    },

    getActiveEpisode() {
      return getEpisodeById(state.activeEpisodeId);
    },

    getLevelConfig(levelNumber = state.selectedLevel) {
      const episode = this.getActiveEpisode();
      if (!episode) return null;
      return episode.levels.find((level) => Number(level.id) === Number(levelNumber)) || null;
    },

    getThemeStage() {
      return Number(this.getActiveEpisode()?.themeStage) || 1;
    },

    formatDate(value) {
      const date = new Date(value);
      return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
    },

    statusLabel(status) {
      if (status === "active") return "AKTIV";
      if (status === "upcoming") return "BALD";
      if (status === "ended") return "BEENDET";
      return "–";
    },

    renderHomeStatus() {
      if (!dom.episodeHomeStatus) return;
      const active = EPISODE_CONFIG.find((episode) => getEpisodeStatus(episode) === "active");
      if (active) {
        const progress = this.getEpisodeProgress(active.id);
        const done = Object.keys(progress.results || {}).length;
        dom.episodeHomeStatus.textContent = `${active.name}: ${done}/${active.levels.length} Level geschafft`;
        return;
      }
      const upcoming = EPISODE_CONFIG.find((episode) => getEpisodeStatus(episode) === "upcoming");
      dom.episodeHomeStatus.textContent = upcoming
        ? `${upcoming.name} startet am ${this.formatDate(upcoming.startAt)}`
        : "Aktuell kein Episodenrennen aktiv";
    },

    render() {
      if (!dom.episodeList) return;
      this.renderHomeStatus();
      dom.episodeList.innerHTML = "";

      if (!EPISODE_CONFIG.length) {
        dom.episodeList.innerHTML = '<div class="episode-empty">Aktuell sind keine Episoden angelegt.</div>';
        return;
      }

      EPISODE_CONFIG.forEach((episode) => {
        const status = getEpisodeStatus(episode);
        const progress = this.getEpisodeProgress(episode.id);
        const results = progress.results || {};
        const completed = episode.levels.filter((level) => results[level.id]).length;
        const percent = Math.round((completed / Math.max(1, episode.levels.length)) * 100);
        const complete = completed >= episode.levels.length;
        const card = document.createElement("article");
        card.className = `episode-card is-${status}`;

        card.innerHTML = `
          <div class="episode-card-head">
            <div class="episode-card-head-row">
              <div>
                <span class="eyebrow">EPISODENRENNEN</span>
                <h3>${escapeHtml(episode.name)}</h3>
              </div>
              <span class="episode-status-pill ${status}">${this.statusLabel(status)}</span>
            </div>
            <p>${escapeHtml(episode.subtitle || "")}</p>
            <div class="episode-meta">${this.formatDate(episode.startAt)} – ${this.formatDate(episode.endAt)}</div>
          </div>
          <div class="episode-progress-wrap">
            <div class="episode-progress-labels">
              <span>${completed} von ${episode.levels.length} geschafft</span>
              <span>${percent} %</span>
            </div>
            <div class="episode-progress-track"><div class="episode-progress-fill" style="width:${percent}%"></div></div>
          </div>
          <div class="episode-track"></div>
          <div class="episode-reward">
            <div class="episode-reward-row">
              <div>
                <strong>${escapeHtml(episode.reward?.title || "Belohnung")}</strong>
                <span>${escapeHtml(complete ? "Strecke abgeschlossen – Belohnungslogik folgt später." : (episode.reward?.description || "Nach Abschluss der gesamten Strecke."))}</span>
              </div>
              <div class="episode-complete-mark">${complete ? "🏆" : "🎁"}</div>
            </div>
          </div>`;

        const track = card.querySelector(".episode-track");
        episode.levels.forEach((level) => {
          const result = results[level.id];
          const unlocked = status === "active" && Number(level.id) <= Number(progress.unlockedLevel || 1);
          const wrapper = document.createElement("div");
          wrapper.className = "episode-level";
          const button = document.createElement("button");
          button.className = "episode-level-button";
          button.type = "button";

          if (result) {
            button.classList.add("completed");
            button.textContent = String(level.id);
          } else if (unlocked) {
            button.textContent = String(level.id);
            if (Number(level.id) === Number(progress.unlockedLevel || 1)) button.classList.add("current");
          } else {
            button.classList.add("locked");
            button.textContent = "🔒";
            button.disabled = true;
          }

          if (unlocked || result) {
            button.addEventListener("click", () => this.openLevel(episode.id, level.id));
          }

          const stars = document.createElement("div");
          stars.className = "episode-level-stars";
          stars.textContent = result ? "★".repeat(result.stars || 0) : "";
          wrapper.append(button, stars);
          track.appendChild(wrapper);
        });
        dom.episodeList.appendChild(card);
      });
    },

    openLevel(episodeId, levelNumber) {
      const episode = getEpisodeById(episodeId);
      if (!episode || getEpisodeStatus(episode) !== "active") {
        showToast("Diese Episode ist aktuell nicht spielbar.");
        return;
      }
      const progress = this.getEpisodeProgress(episodeId);
      if (Number(levelNumber) > Number(progress.unlockedLevel || 1) && !progress.results?.[levelNumber]) {
        showToast("Dieses Episodenlevel ist noch gesperrt.");
        return;
      }

      state.gameMode = "episode";
      state.activeEpisodeId = episodeId;
      state.selectedLevel = Number(levelNumber);
      const config = this.getLevelConfig(levelNumber);
      const colors = config?.ballTypes ?? 3;
      const target = config?.targetScore ?? 1000;
      const result = progress.results?.[levelNumber];
      const stage = this.getThemeStage();

      ThemeManager.applyStageAssets(stage);
      ThemeManager.applyLevelAsset((stage - 1) * GAME_CONFIG.levelsPerStage + 1);
      dom.selectedLevelTitle.textContent = `${episode.name} – Level ${levelNumber}`;
      dom.selectedStageBadge.textContent = "Episode";
      dom.levelBackButton.dataset.back = "episodes";
      dom.levelBackButton.textContent = "← Episode";

      if (config?.mode === "colors") {
        const colorNames = { red: "rote", green: "grüne", yellow: "gelbe", purple: "lila", blue: "blaue", pink: "pinke", black: "schwarze" };
        dom.levelGoalText.textContent = `Sammle ${config.need} ${colorNames[config.only_color] || config.only_color} Bälle`;
      } else {
        dom.levelGoalText.textContent = `Erreiche mindestens ${target.toLocaleString("de-DE")} Punkte`;
      }
      dom.levelColors.textContent = String(colors);
      dom.levelTarget.textContent = target.toLocaleString("de-DE");
      dom.levelBest.textContent = result ? `${result.stars} ⭐` : "–";
      renderPreviewBallsForConfig(config, stage);
      PreLevelLoadout.open(config);
      Navigation.show("level");
    },

    finishLevel(levelNumber, stars, score, shots) {
      const episode = this.getActiveEpisode();
      if (!episode) return null;
      const levelCount = episode.levels.length;
      return this.updateEpisodeProgress(episode.id, (progress) => {
        const old = progress.results[levelNumber];
        if (!old || stars > old.stars || score > old.score) {
          progress.results[levelNumber] = { stars, score, shots, completedAt: new Date().toISOString() };
        }
        if (Number(levelNumber) >= Number(progress.unlockedLevel || 1) && Number(levelNumber) < levelCount) {
          progress.unlockedLevel = Number(levelNumber) + 1;
        }
        if (Number(levelNumber) === levelCount) {
          progress.unlockedLevel = levelCount;
          progress.completedAt = progress.completedAt || new Date().toISOString();
        }
      });
    },

    exitToEpisodes() {
      BubbleGame.stop();
      state.gameMode = "standard";
      state.activeEpisodeId = null;
      dom.levelBackButton.dataset.back = "map";
      dom.levelBackButton.textContent = "← Karte";
      Navigation.show("episodes");
    }
  };

  function getActiveLevelConfig(levelNumber = state.selectedLevel) {
    return state.gameMode === "episode"
      ? EpisodeRace.getLevelConfig(levelNumber)
      : STAR_CONFIG[levelNumber];
  }

  function getActiveThemeStage(levelNumber = state.selectedLevel) {
    return state.gameMode === "episode"
      ? EpisodeRace.getThemeStage()
      : getStageForLevel(levelNumber);
  }

  function renderPreviewBallsForConfig(levelConfig, stageNumber) {
    const container = document.getElementById("previewBubbles");
    if (!container) return;
    container.innerHTML = "";
    const previewTheme = stageNumber === 2 ? "world-cup-balls" : "bk-arena-balls";
    const balls = previewTheme === "world-cup-balls"
      ? ["usa", "germany", "brazil", "spain", "australia"]
      : ["red", "blue", "green", "yellow", "purple", "pink", "black"];
    const amount = Math.min(levelConfig?.ballTypes ?? 3, 5, balls.length);
    balls.slice(0, amount).forEach((ball) => {
      const img = document.createElement("img");
      img.src = `assets/balls/${previewTheme}/${ball}.png`;
      img.alt = ball;
      container.appendChild(img);
    });
  }


  /* =========================================================
     SAMMELALBEN
     - beliebig viele Alben ueber albumConfig.js moeglich
     - aktuell 6 Karten pro Album
     - Karten werden durch abgeschlossene Standardlevel gesammelt
     ========================================================= */
  const CollectorAlbum = {
    activeAlbumId: ALBUM_CONFIG[0]?.id || null,

    getActiveAlbum() {
      return ALBUM_CONFIG.find((album) => album.id === this.activeAlbumId) || ALBUM_CONFIG[0] || null;
    },

    setActiveAlbum(albumId) {
      if (!ALBUM_CONFIG.some((album) => album.id === albumId)) return;
      this.activeAlbumId = albumId;
      this.render();
    },

    ensureAlbumSwitcher() {
      if (!dom.albumCardGrid || ALBUM_CONFIG.length < 2) return;
      const screen = dom.screens?.albums;
      const hero = screen?.querySelector(".album-hero-card");
      if (!screen || !hero) return;

      if (!document.getElementById("albumSwitcherStyles")) {
        const style = document.createElement("style");
        style.id = "albumSwitcherStyles";
        style.textContent = `.album-switcher{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px}.album-switch-button{min-width:0;padding:10px 8px;border:1px solid rgba(255,212,92,.42);border-radius:13px;background:rgba(20,20,24,.92);color:rgba(255,255,255,.76);font:inherit;font-size:12px;font-weight:800;cursor:pointer}.album-switch-button.is-active{border-color:#ffd45c;color:#ffd45c;background:linear-gradient(145deg,#310000,#860000);box-shadow:0 0 14px rgba(255,212,92,.18)}@media(max-width:380px){.album-switch-button{font-size:11px;padding:9px 6px}}`;
        document.head.appendChild(style);
      }

      let switcher = screen.querySelector(".album-switcher");
      if (!switcher) {
        switcher = document.createElement("div");
        switcher.className = "album-switcher";
        hero.parentNode.insertBefore(switcher, hero);
      }
      switcher.innerHTML = ALBUM_CONFIG.map((album, index) => `
        <button type="button" class="album-switch-button ${album.id === this.activeAlbumId ? "is-active" : ""}" data-album-id="${album.id}">
          Album ${index + 1} · ${escapeHtml(album.name)}
        </button>`).join("");
      switcher.querySelectorAll("[data-album-id]").forEach((button) => {
        button.addEventListener("click", () => this.setActiveAlbum(button.dataset.albumId));
      });
    },

    ensureState() {
      if (!state.progress.collectorAlbums || typeof state.progress.collectorAlbums !== "object") {
        state.progress.collectorAlbums = {};
      }

      ALBUM_CONFIG.forEach((album) => {
        if (!state.progress.collectorAlbums[album.id] || typeof state.progress.collectorAlbums[album.id] !== "object") {
          state.progress.collectorAlbums[album.id] = {
            cards: {},
            rewardClaimed: false,
            rewardAlreadyGranted: false,
            rewardFlowVersion: 2,
            completedAt: null
          };
        }

        const albumState = state.progress.collectorAlbums[album.id];
        albumState.cards = albumState.cards && typeof albumState.cards === "object" ? albumState.cards : {};
        albumState.rewardClaimed = Boolean(albumState.rewardClaimed);

        // Migration aus der alten Album-Logik:
        // Dort konnte 6/6 sofort als "Belohnung erhalten" gespeichert werden.
        // Ein solcher Spielstand wird einmalig in den neuen Zwischenzustand
        // "Belohnung abholen" ueberfuehrt. Bereits gutgeschriebene Items
        // werden dabei markiert, damit sie beim manuellen Abholen NICHT
        // ein zweites Mal vergeben werden.
        if (!albumState.rewardFlowVersion) {
          const collectedCount = album.cards.reduce((sum, card) =>
            sum + (albumState.cards[card.id] ? 1 : 0), 0);
          if (collectedCount >= album.cards.length && albumState.rewardClaimed) {
            albumState.rewardClaimed = false;
            albumState.rewardAlreadyGranted = true;
          } else {
            albumState.rewardAlreadyGranted = Boolean(albumState.rewardAlreadyGranted);
          }
          albumState.rewardFlowVersion = 2;
        } else {
          albumState.rewardAlreadyGranted = Boolean(albumState.rewardAlreadyGranted);
        }
      });
    },

    getState(albumId) {
      this.ensureState();
      return state.progress.collectorAlbums[albumId];
    },

    getCollectedCount(album) {
      const albumState = this.getState(album.id);
      return album.cards.filter((card) => Boolean(albumState.cards[card.id])).length;
    },

    isComplete(album) {
      return this.getCollectedCount(album) >= album.cards.length;
    },

    grantAlbumReward(album) {
      const albumState = this.getState(album.id);
      if (albumState.rewardClaimed || !this.isComplete(album)) return false;

      Object.entries(album.reward?.items || {}).forEach(([itemKey, amount]) => {
        addItemAmount(itemKey, amount, false);
      });

      albumState.rewardClaimed = true;
      albumState.completedAt = albumState.completedAt || new Date().toISOString();
      return true;
    },

    collectLevel(level, announce = true) {
      const match = getAlbumCardForLevel(level);
      if (!match) return null;

      const { album, card } = match;
      const albumState = this.getState(album.id);
      if (albumState.cards[card.id]) return null;

      albumState.cards[card.id] = {
        collectedAt: new Date().toISOString(),
        level: Number(level)
      };

      const count = this.getCollectedCount(album);
      const completedNow = count >= album.cards.length;
      const rewardGranted = false;

      this.updateHomeStatus();

      return announce ? {
        album,
        card,
        count,
        completedNow,
        rewardGranted
      } : null;
    },

    syncFromResults() {
      this.ensureState();
      let changed = false;

      ALBUM_CONFIG.forEach((album) => {
        const albumState = this.getState(album.id);

        album.cards.forEach((card) => {
          if (state.progress.results?.[card.unlockLevel] && !albumState.cards[card.id]) {
            albumState.cards[card.id] = {
              collectedAt: state.progress.results[card.unlockLevel]?.completedAt || new Date().toISOString(),
              level: card.unlockLevel
            };
            changed = true;
          }
        });

      });

      if (changed) SaveManager.saveProgress(state.progress);
      this.updateHomeStatus();
    },

    formatReward(album) {
      const labels = {
        bomb: "Bombenball",
        thunder: "Blitzball",
        colorbomb: "Farbbombe",
        hourglass: "Sanduhr",
        rainbow: "Regenbogenball",
        ballswitch: "Ball Switch",
        aim: "Lupe"
      };

      return Object.entries(album.reward?.items || {})
        .map(([key, amount]) => `${amount}× ${labels[key] || key}`)
        .join(" · ");
    },

    rewardItemMeta(itemKey) {
      const map = {
        bomb: { label: "Bombenball", image: "assets/ui/bomb-ball.png" },
        thunder: { label: "Blitzball", image: "assets/ui/thunder-ball.png" },
        colorbomb: { label: "Farbbombe", image: "assets/ui/color-bomb.png" },
        hourglass: { label: "Sanduhr", image: "assets/ui/hourglass.png" },
        rainbow: { label: "Regenbogenball", image: "assets/ui/rainbow-ball.png" },
        ballswitch: { label: "Ball Switch", image: "assets/ui/ballswitch.png" },
        aim: { label: "Lupe", image: "assets/ui/lupe.png" }
      };
      return map[itemKey] || { label: itemKey, image: "" };
    },

    showAlbumRewardVictory(album) {
      if (!dom.albumRewardOverlay || !dom.albumRewardItems) return;
      dom.albumRewardItems.innerHTML = Object.entries(album.reward?.items || {}).map(([key, amount]) => {
        const meta = this.rewardItemMeta(key);
        return `
          <div class="album-reward-item">
            <img src="${meta.image}" alt="${meta.label}">
            <strong>${amount}×</strong>
            <span>${meta.label}</span>
          </div>
        `;
      }).join("");
      dom.albumRewardOverlay.classList.remove("hidden");
      dom.albumRewardOverlay.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => dom.albumRewardOverlay.classList.add("is-visible"));
    },

    hideAlbumRewardVictory() {
      if (!dom.albumRewardOverlay) return;
      dom.albumRewardOverlay.classList.remove("is-visible");
      dom.albumRewardOverlay.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        dom.albumRewardOverlay.classList.add("hidden");
        // Erst NACH der Victory-Animation: Sammelkarten ausblenden und
        // das fertige Album-Gesamtbild + "Belohnung erhalten" anzeigen.
        this.render();
      }, 260);
    },

    claimReward() {
      const album = this.getActiveAlbum();
      if (!album) return false;
      const albumState = this.getState(album.id);
      if (!this.isComplete(album) || albumState.rewardClaimed) return false;

      // Neue Spielstaende erhalten die Items exakt hier beim aktiven Klick.
      // Migrierte Spielstaende hatten die Items durch die alte Automatik
      // bereits bekommen und duerfen deshalb nicht doppelt belohnt werden.
      if (!albumState.rewardAlreadyGranted) {
        Object.entries(album.reward?.items || {}).forEach(([itemKey, amount]) => {
          addItemAmount(itemKey, amount, false);
        });
      }

      albumState.rewardClaimed = true;
      albumState.rewardAlreadyGranted = true;
      albumState.completedAt = albumState.completedAt || new Date().toISOString();
      albumState.rewardFlowVersion = 2;
      SaveManager.saveProgress(state.progress);
      this.updateHomeStatus();

      // Wichtig: Noch NICHT neu rendern. Hinter dem Victory-Overlay bleiben
      // waehrend der Belohnungsanimation die sechs Sammelkarten sichtbar.
      // Erst beim Schliessen der Animation wird auf das Abschlussbild gewechselt.
      this.showAlbumRewardVictory(album);
      return true;
    },

    updateHomeStatus() {
      const album = ALBUM_CONFIG[0];
      if (!album) return;
      const count = this.getCollectedCount(album);
      if (dom.albumHomeStatus) dom.albumHomeStatus.textContent = "Sammle Sticker und Bonis";
    },

    render() {
      const album = this.getActiveAlbum();
      if (!album || !dom.albumCardGrid) return;

      this.ensureAlbumSwitcher();
      const albumIndex = Math.max(0, ALBUM_CONFIG.findIndex((entry) => entry.id === album.id));
      const screen = dom.screens?.albums;
      const toolbarTitle = screen?.querySelector(".screen-toolbar h2");
      const heroKicker = screen?.querySelector(".album-kicker");
      const heroTitle = screen?.querySelector(".album-hero-copy h3");
      const heroText = screen?.querySelector(".album-hero-copy p");
      const rewardTitle = screen?.querySelector(".album-reward-preview h3");
      const rewardText = screen?.querySelector(".album-reward-preview p");
      if (toolbarTitle) toolbarTitle.textContent = album.name;
      if (heroKicker) heroKicker.textContent = `ALBUM ${albumIndex + 1}`;
      if (heroTitle) heroTitle.textContent = album.name;
      if (heroText) heroText.textContent = `Sammle alle ${album.cards.length} ${album.name === "Kronen" ? "Kronenkarten" : "Schwertkarten"}. Jede Karte wird automatisch hinzugefügt, sobald du das zugehörige Level erfolgreich abschließt.`;
      if (rewardTitle) rewardTitle.textContent = `Alle ${album.cards.length} Karten sammeln`;
      if (rewardText) rewardText.textContent = this.formatReward(album);

      const albumState = this.getState(album.id);
      const count = this.getCollectedCount(album);
      const percent = Math.round((count / Math.max(1, album.cards.length)) * 100);

      if (dom.albumScreenCounter) dom.albumScreenCounter.textContent = `${count}/${album.cards.length}`;
      if (dom.albumProgressText) dom.albumProgressText.textContent = `${count} von ${album.cards.length} gesammelt`;
      if (dom.albumProgressFill) dom.albumProgressFill.style.width = `${percent}%`;
      const complete = this.isComplete(album);
      if (dom.albumRewardState) {
        if (albumState.rewardClaimed) {
          dom.albumRewardState.textContent = "Belohnung erhalten ✓";
          dom.albumRewardState.disabled = true;
          dom.albumRewardState.classList.add("claimed");
          dom.albumRewardState.classList.remove("ready");
        } else if (complete) {
          dom.albumRewardState.textContent = "Belohnung abholen";
          dom.albumRewardState.disabled = false;
          dom.albumRewardState.classList.add("ready");
          dom.albumRewardState.classList.remove("claimed");
        } else {
          dom.albumRewardState.textContent = "Noch nicht erhalten";
          dom.albumRewardState.disabled = true;
          dom.albumRewardState.classList.remove("ready", "claimed");
        }
      }

      const showCompletionImage = complete && albumState.rewardClaimed;
      dom.albumCardGrid.classList.toggle("hidden", showCompletionImage);
      dom.albumCompletionShowcase?.classList.toggle("hidden", !showCompletionImage);
      if (showCompletionImage && dom.albumCompletionImage) {
        dom.albumCompletionImage.src = album.completionImage || album.cover;
        dom.albumCompletionImage.alt = `Vollständiges Album ${album.name}`;
      }

      dom.albumCardGrid.innerHTML = album.cards.map((card, index) => {
        const collected = Boolean(albumState.cards[card.id]);
        return `
          <button type="button" class="album-collect-card ${collected ? "is-collected" : "is-locked"}"
                  data-album-card-id="${card.id}"
                  aria-label="${collected ? card.name : `Gesperrte Sammelkarte – Freischaltung Level ${card.unlockLevel}`}">
            <div class="album-card-number">${String(index + 1).padStart(2, "0")}/06</div>
            <div class="album-card-art-wrap">
              <img src="${card.image}" alt="${collected ? card.name : "Gesperrte Sammelkarte"}" class="album-card-art" draggable="false">
              ${collected ? "" : '<div class="album-card-lock" aria-hidden="true">🔒</div>'}
            </div>
            <div class="album-card-meta">
              <strong>${collected ? card.name : "???"}</strong>
              <span>${collected ? `Gesammelt in Level ${card.unlockLevel}` : `Freischaltung: Level ${card.unlockLevel}`}</span>
            </div>
          </button>
        `;
      }).join("");
    },

    hideVictoryReward() {
      dom.albumCardReward?.classList.add("hidden");
      dom.albumUnlockBonus?.classList.add("hidden");
    },

    showVictoryReward(result) {
      this.hideVictoryReward();
      if (!result || !dom.albumCardReward) return;

      dom.albumUnlockImage.src = result.card.image;
      dom.albumUnlockImage.alt = result.card.name;
      dom.albumUnlockName.textContent = result.completedNow ? `Album vollständig: ${result.album.name}!` : result.card.name;
      dom.albumUnlockProgress.textContent = `${result.count}/${result.album.cards.length} Karten gesammelt`;

      if (result.completedNow) {
        dom.albumUnlockBonus.textContent = "Album vollständig – deine Belohnung wartet im Sammelalbum.";
        dom.albumUnlockBonus.classList.remove("hidden");
      }

      dom.albumCardReward.classList.remove("hidden");
    }
  };

  const Navigation = {
  show(screenName) {
    Object.entries(dom.screens).forEach(([name, element]) => {
      element.classList.toggle("hidden", name !== screenName);
    });

    const headerAusblenden =
      screenName === "level" ||
      screenName === "play";

    document
      .querySelector(".app-header")
      ?.classList.toggle("hidden", headerAusblenden);


    if (screenName === "themes") {
      ThemeManager.renderList();
    }

    if (screenName === "ranking") {
      Ranking.render();
    }

    if (screenName === "shop") {
      Shop.render();
    }

    if (screenName === "wheel") {
      LuckyWheel.render();
    }

    if (screenName === "episodes") {
      EpisodeRace.render();
    }

    if (screenName === "albums") {
      CollectorAlbum.render();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
};

  const LuckyWheel = {
    spinning: false,
    stopping: false,
    rotation: 0,
    spinFrameId: 0,
    lastFrameTime: 0,
    stopTimerId: 0,
    autoStopTimerId: 0,
    victoryTimerId: 0,

    getTodayKey() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    ensureState() {
      if (!state.progress.dailyWheel || typeof state.progress.dailyWheel !== "object") {
        state.progress.dailyWheel = { lastSpinDate: "" };
      }
    },

    canSpinToday() {

    /*
    =========================================================
    NORMALBETRIEB – NUR 1 GRATIS-DREH PRO KALENDERTAG

    this.ensureState();

    return (
        state.progress.dailyWheel.lastSpinDate !==
        this.getTodayKey()
    );

    =========================================================
    */

    /*
     * DEMO-MODUS
     *
     * Für Tests darf unbegrenzt gedreht werden.
     */

    return true;

    },

    isHourglassOnWheel() {
      /*
       * Nach dem Gewinn von Level 65 ist die Sanduhr freigeschaltet.
       * Ab dann ersetzt sie auf Feld 9 das ×3-Zufallsfeld.
       */
      return isItemUnlocked("hourglass");
    },

    getSegments() {
      const hourglassAvailable = this.isHourglassOnWheel();

      return WHEEL_CONFIG.segments.map((segment) => {
        if (segment.type !== "hourglass-or-random") {
          return { ...segment };
        }

        if (hourglassAvailable) {
          return {
            id: segment.id,
            type: "item",
            category: "normal",
            itemKey: "hourglass",
            amount: 1
          };
        }

        return {
          id: segment.id,
          type: "random",
          category: "random",
          amount: 3
        };
      });
    },

    getJackpotItemKeys() {
      const keys = [...WHEEL_CONFIG.randomItemKeys];

      if (this.isHourglassOnWheel()) {
        keys.push("hourglass");
      }

      return keys;
    },

    getRandomRewardItemKey() {
      const keys = WHEEL_CONFIG.randomItemKeys.filter((key) => ITEM_UNLOCKS[key]);
      if (!keys.length) return "ballswitch";
      return keys[Math.floor(Math.random() * keys.length)];
    },

    renderSegments() {
      if (!dom.wheelSegments) return;

      const segments = this.getSegments();
      const total = segments.length;

      dom.wheelSegments.innerHTML = segments
        .map((segment, index) => {
          const angle = (360 / total) * index + (180 / total);
          const isJackpot = segment.type === "jackpot";
          const isRandom = segment.type === "random";
          const item = segment.itemKey ? ITEM_UNLOCKS[segment.itemKey] : null;

          let content = "";

          if (isJackpot) {
            content = `
              <strong class="wheel-jackpot-label">JACKPOT</strong>
              <img src="assets/ui/shop-bandenkick.png" alt="Jackpot">
            `;
          } else if (isRandom) {
            content = `
              <strong class="wheel-item-amount">×3</strong>
              <span class="wheel-random-mark" aria-label="Zufallsitem">?</span>
            `;
          } else {
            content = `
              <strong class="wheel-item-amount">×${segment.amount || 1}</strong>
              <img src="${item?.image || ""}" alt="${item?.label || "Item"}">
            `;
          }

          return `
            <div
              class="wheel-segment-label"
              data-wheel-type="${segment.category || segment.type}"
              style="--segment-angle:${angle}deg;">
              <div class="wheel-segment-content">
                ${content}
              </div>
            </div>
          `;
        })
        .join("");
    },

    render() {
      this.ensureState();
      this.renderSegments();

      const available = this.canSpinToday();

      if (this.spinning) {
        dom.wheelStatus.textContent = this.stopping
          ? "Das Rad wird langsamer …"
          : "Drücke STOPP, wenn du das Rad anhalten möchtest.";
        dom.wheelSpinButton.disabled = this.stopping;
        dom.wheelSpinButton.textContent = this.stopping ? "RAD STOPPT …" : "STOPP";
        return;
      }

      dom.wheelStatus.textContent = available
        ? "Dein kostenloser Dreh für heute ist bereit."
        : "Heute bereits gedreht – morgen gibt es den nächsten Gratis-Dreh.";

      dom.wheelSpinButton.disabled = !available;
      dom.wheelSpinButton.textContent = available ? "JETZT DREHEN" : "HEUTE VERBRAUCHT";

      if (available) {
        dom.wheelReward.classList.add("hidden");
      }
    },

    chooseSegmentIndex() {
      const segments = this.getSegments();
      const probabilities = WHEEL_CONFIG.probabilities;
      const categoryRoll = Math.random() * 100;

      let category = "normal";
      const normalLimit = Math.max(0, Number(probabilities.normal) || 0);
      const randomLimit = normalLimit + Math.max(0, Number(probabilities.random) || 0);

      if (categoryRoll < normalLimit) {
        category = "normal";
      } else if (categoryRoll < randomLimit) {
        category = "random";
      } else {
        category = "jackpot";
      }

      const candidateIndexes = segments
        .map((segment, index) => segment.category === category ? index : -1)
        .filter((index) => index >= 0);

      if (!candidateIndexes.length) {
        return Math.floor(Math.random() * segments.length);
      }

      return candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];
    },

    resolveReward(segment) {
      if (segment.type !== "random") {
        return { ...segment };
      }

      return {
        ...segment,
        rewardItemKey: this.getRandomRewardItemKey(),
        amount: 3
      };
    },

    grantReward(segment) {
      if (segment.type === "jackpot") {
        this.getJackpotItemKeys().forEach((itemKey) => {
          addItemAmount(itemKey, 1, false);
        });
        SaveManager.saveProgress(state.progress);
        updateItemBarLocks();
        return;
      }

      const rewardKey = segment.type === "random"
        ? segment.rewardItemKey
        : segment.itemKey;

      if (!rewardKey) return;
      addItemAmount(rewardKey, segment.amount || 1);
    },

    beginWinSequence() {
      window.clearTimeout(this.victoryTimerId);
      this.victoryTimerId = 0;

      // Ab dem Moment, in dem die Gewinnkarte erscheint, ist der komplette
      // Bildschirm gesperrt. Die zweite Victory-Karte folgt nach 3 Sekunden.
      dom.wheelWinLock?.classList.remove("hidden", "wheel-win-lock-show-card");
      document.body.classList.add("wheel-win-sequence-active");

      this.victoryTimerId = window.setTimeout(() => {
        this.victoryTimerId = 0;
        dom.wheelWinLock?.classList.add("wheel-win-lock-show-card");
      }, 3000);
    },

    endWinSequence() {
      window.clearTimeout(this.victoryTimerId);
      this.victoryTimerId = 0;
      dom.wheelWinLock?.classList.add("hidden");
      dom.wheelWinLock?.classList.remove("wheel-win-lock-show-card");
      document.body.classList.remove("wheel-win-sequence-active");
      dom.wheelReward?.classList.add("hidden");
    },

    showReward(segment) {
      this.beginWinSequence();
      dom.wheelReward.classList.remove("hidden");
      dom.wheelReward.classList.remove("wheel-reward-active");
      void dom.wheelReward.offsetWidth;
      dom.wheelReward.classList.add("wheel-reward-active");
      dom.wheelRewardItems.innerHTML = "";

      if (segment.type === "jackpot") {
        const jackpotKeys = this.getJackpotItemKeys();

        dom.wheelRewardImage.src = "assets/ui/shop-bandenkick.png";
        dom.wheelRewardTitle.textContent = "JACKPOT!";
        dom.wheelRewardText.innerHTML = `
          Von jedem verfügbaren Glücksrad-Item 1× gewonnen
          <span class="wheel-inventory-note">
            Gewinn wurde deinem Bestand hinzugefügt.
          </span>
        `;

        dom.wheelRewardItems.innerHTML = jackpotKeys
          .map((key) => {
            const item = ITEM_UNLOCKS[key];
            return `
              <div class="wheel-jackpot-item">
                <img src="${item.image}" alt="${item.label}">
                <span>1×</span>
              </div>
            `;
          })
          .join("");

        return;
      }

      const rewardKey = segment.type === "random"
        ? segment.rewardItemKey
        : segment.itemKey;
      const item = ITEM_UNLOCKS[rewardKey];

      if (!item) return;

      dom.wheelRewardImage.src = item.image;
      dom.wheelRewardTitle.textContent = segment.type === "random"
        ? "ZUFALLSGEWINN!"
        : "GEWONNEN!";
      dom.wheelRewardText.innerHTML = `
        ${segment.amount || 1}× ${item.label}
        <span class="wheel-inventory-note">
          Gewinn wurde deinem Bestand hinzugefügt.
        </span>
      `;
    },

    startFreeSpin() {
      this.spinning = true;
      this.stopping = false;
      this.lastFrameTime = performance.now();
      this.endWinSequence();
      dom.wheelReward.classList.add("hidden");
      dom.wheelDisc.style.transition = "none";

      window.clearTimeout(this.autoStopTimerId);
      this.autoStopTimerId = 0;

      this.render();

      const speed = Math.max(60, Number(WHEEL_CONFIG.freeSpinSpeedDegPerSecond) || 216);

      const tick = (now) => {
        if (!this.spinning || this.stopping) return;

        const deltaSeconds = Math.min(0.05, Math.max(0, (now - this.lastFrameTime) / 1000));
        this.lastFrameTime = now;
        this.rotation += speed * deltaSeconds;
        dom.wheelDisc.style.transform = `rotate(${this.rotation}deg)`;
        this.spinFrameId = requestAnimationFrame(tick);
      };

      this.spinFrameId = requestAnimationFrame(tick);

      /*
       * Sicherheitsende nach spätestens 25 Sekunden. Es wird bewusst dieselbe
       * stopSpin()-Routine benutzt wie beim manuellen STOPP. Dadurch gibt es
       * nur EIN Auslaufverhalten und keinen zweiten Anschub.
       */
      const maxFreeSpinMs = Math.max(1000, Number(WHEEL_CONFIG.maxFreeSpinMs) || 25000);
      this.autoStopTimerId = window.setTimeout(() => {
        this.autoStopTimerId = 0;
        this.stopSpin();
      }, maxFreeSpinMs);
    },

    stopSpin() {
      if (!this.spinning || this.stopping) return;

      this.stopping = true;

      window.clearTimeout(this.autoStopTimerId);
      this.autoStopTimerId = 0;

      if (this.spinFrameId) {
        cancelAnimationFrame(this.spinFrameId);
        this.spinFrameId = 0;
      }

      const segments = this.getSegments();
      const index = this.chooseSegmentIndex();
      const segment = this.resolveReward(segments[index]);
      const total = segments.length;
      const segmentAngle = 360 / total;
      const centerAngle = index * segmentAngle + segmentAngle / 2;
      const currentNormalized = ((this.rotation % 360) + 360) % 360;
      const targetNormalized = (360 - centerAngle) % 360;
      const correction = (targetNormalized - currentNormalized + 360) % 360;

      /*
       * Exakt 5 Sekunden sanftes Auslaufen – manuell und automatisch identisch.
       *
       * Wichtig: Wir starten mit exakt derselben Geschwindigkeit wie beim freien
       * Drehen und bremsen von dort kontinuierlich bis 0 ab. Dafür verwenden wir
       * eine kubische Hermite-Kurve mit Startgeschwindigkeit = freeSpinSpeed und
       * Endgeschwindigkeit = 0. Der Zielweg ist immer 1 volle Umdrehung plus die
       * nötige Korrektur zum Gewinnfeld. So entsteht beim STOPP kein neuer Schub.
       */
      const currentSpeed = Math.max(60, Number(WHEEL_CONFIG.freeSpinSpeedDegPerSecond) || 216);
      const duration = Math.max(1000, Number(WHEEL_CONFIG.stopDurationMs) || 5000);
      const distance = 360 + correction;
      const startRotation = this.rotation;
      const targetRotation = startRotation + distance;
      const startTime = performance.now();
      const durationSeconds = duration / 1000;

      dom.wheelDisc.style.transition = "none";
      this.render();

      const decelerate = (now) => {
        if (!this.spinning || !this.stopping) return;

        const t = Math.min(1, Math.max(0, (now - startTime) / duration));

        // Kubische Hermite-Interpolation:
        // t=0 -> aktuelle Geschwindigkeit, t=1 -> Geschwindigkeit 0.
        const h10 = t * t * t - 2 * t * t + t;
        const h01 = -2 * t * t * t + 3 * t * t;
        const travelled = h10 * currentSpeed * durationSeconds + h01 * distance;

        this.rotation = startRotation + travelled;
        dom.wheelDisc.style.transform = `rotate(${this.rotation}deg)`;

        if (t < 1) {
          this.spinFrameId = requestAnimationFrame(decelerate);
          return;
        }

        this.rotation = targetRotation;
        dom.wheelDisc.style.transform = `rotate(${this.rotation}deg)`;
        this.spinFrameId = 0;

        this.grantReward(segment);

        /*
        =========================================================
        NORMALBETRIEB – TÄGLICHEN DREH ALS VERBRAUCHT SPEICHERN

        this.ensureState();

        state.progress.dailyWheel.lastSpinDate =
            this.getTodayKey();

        SaveManager.saveProgress(
            state.progress
        );

        =========================================================
        */

        /* DEMO-MODUS: Kein Datum speichern. */

        this.spinning = false;
        this.stopping = false;
        dom.wheelDisc.style.transition = "none";

        this.render();
        this.showReward(segment);
      };

      this.spinFrameId = requestAnimationFrame(decelerate);
    },

    spin() {
      if (this.stopping) return;

      if (this.spinning) {
        this.stopSpin();
        return;
      }

      if (!this.canSpinToday()) return;
      this.startFreeSpin();
    }
  };



  function renderPreviewBalls(levelNumber) {

  const container = document.getElementById("previewBubbles");

  if (!container) return;

  container.innerHTML = "";

  const stageNumber = getStageForLevel(levelNumber);

  // Regel:
  // Stage 2 = World Cup
  // alles andere = BK Arena
  const previewTheme =
    stageNumber === 2
      ? "world-cup-balls"
      : "bk-arena-balls";


  const balls =
    previewTheme === "world-cup-balls"
      ? [
          "usa",
          "germany",
          "brazil",
          "spain",
          "australia"
        ]
      : [
          "red",
          "blue",
          "green",
          "yellow",
          "purple"
        ];


  // Anzahl passend zur Levelkonfiguration
  const levelConfig = STAR_CONFIG[levelNumber];

  const amount = Math.min(
    levelConfig?.ballTypes ?? 3, 5,
    balls.length
  );


  balls
    .slice(0, amount)
    .forEach(ball => {

      const img = document.createElement("img");

      img.src =
        `assets/balls/${previewTheme}/${ball}.png`;

      img.alt = ball;

      img.onerror = () => {
        console.warn(
          "Vorschauball fehlt:",
          img.src
        );
      };


      container.appendChild(img);

    });

}

  const LevelPreview = {
    open(levelNumber) {
      state.gameMode = "standard";
      state.activeEpisodeId = null;
      state.selectedLevel = levelNumber;
      dom.levelBackButton.dataset.back = "map";
      dom.levelBackButton.textContent = "← Karte";

      const stage = getStageForLevel(levelNumber);
      const levelConfig = STAR_CONFIG[levelNumber];
      const colors = levelConfig?.ballTypes ?? 3;
      const target = levelConfig?.targetScore ?? 1000;
      const result = state.progress.results[levelNumber];

      ThemeManager.applyStageAssets(stage);
      ThemeManager.applyLevelAsset(levelNumber);

      dom.selectedLevelTitle.textContent = `Level ${levelNumber}`;
      dom.selectedStageBadge.textContent = `Stage ${stage}`;
      
      if (levelConfig.mode === "colors") {

        const colorNames = {
          red: "rote",
          green: "grüne",
          yellow: "gelbe",
          purple: "lila",
          blue: "blaue",
          pink: "pinke",
          black: "schwarze"
        };
        dom.levelGoalText.textContent =
        `Sammle ${levelConfig.need} ${colorNames[levelConfig.only_color]} Bälle`;
      } else if (levelConfig.mode === "speed") {
          dom.levelGoalText.textContent =
          `Erreiche ${target.toLocaleString("de-DE")} Punkte in ${Number(levelConfig.time) || 0} Sekunden`;
      } else if (levelConfig.mode === "sword") {
          dom.levelGoalText.textContent =
          "Befreie das Schwert – triff den goldenen Ball";
      } else {
          dom.levelGoalText.textContent =
          `Erreiche mindestens ${target.toLocaleString("de-DE")} Punkte`;
      }

      dom.levelColors.textContent = String(colors);
      dom.levelTarget.textContent =
          levelConfig.mode === "sword"
              ? "GOLDBALL"
              : target.toLocaleString("de-DE");
      dom.levelBest.textContent = result ? `${result.stars} ⭐` : "–";
    
      renderPreviewBalls(levelNumber);
      PreLevelLoadout.open(levelConfig);
      Navigation.show("level");
    }
  };


window.BK_getMainProgress = () => state.progress;

window.BK_openMainLevel = (levelNumber) => {

  const level = Number(levelNumber);

  if (!Number.isInteger(level) || level < 1) return;

  window.BK_levelOrigin = "worldMap2";

  LevelPreview.open(level);

  const worldMapScreen =
    document.getElementById("worldMap2Screen");

  const levelScreen =
    document.getElementById("levelScreen");

  if (worldMapScreen && levelScreen) {

    // Endloskarte wieder sichtbar machen
    worldMapScreen.classList.remove("hidden");

    // Levelvorschau als Overlay markieren
    levelScreen.classList.add("world2-level-overlay");

  }

  if (dom.levelBackButton) {

    dom.levelBackButton.dataset.back = "worldMap2";

    dom.levelBackButton.textContent =
      "← Levelkarte";

  }

};


  const BubbleGame = {
    equippedItems: new Set(),
    canvas: null,
    ctx: null,
    width: 480,
    height: 700,
    radius: 18,
    rowHeight: 31,
    columnWidth: 36,
    bubbles: [],
    particles: [],
    chainBreaks: [],
    explosions: [],
    thunders: [],
    explosions: [],
    collectedColors: {},

    // SCHWERT-FEATURE
    // Das Schwert ist 5 Ballhöhen hoch und 3 Ballbreiten breit.
    // Der Griff/Goldball sitzt auf Höhe der 2. Kugel von oben.
    swordFeature: null,
    swordReleaseActive: false,
    swordReleaseStartedAt: 0,
    fallingGoldBall: null,

    switchBallActive: false,
    aimItemAktive: false,

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

    // SPEEDGAME
    speedMode: false,
    speedCountdownActive: false,
    speedCountdownStartedAt: 0,
    speedTimerStartedAt: 0,
    speedTimeLimit: 0,
    speedTimeRemaining: 0,
    speedLastCountdownLabel: "",
    speedBonusSeconds: 0,

    activateBombBall() {
        if (
          !isItemUnlocked("bomb") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (this.shooter.isBomb) return false;
        if (!consumeItem("bomb")) return false;

        this.shooter.isBomb = true;
        this.shooter.isThunder = false;
        this.shooter.isRainbow = false;
        this.shooter.isColorBomb = false;
        return true;
    },

    activateThunderBall() {
        if (
          !isItemUnlocked("thunder") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (this.shooter.isThunder) return false;
        if (!consumeItem("thunder")) return false;

        this.shooter.isBomb = false;
        this.shooter.isRainbow = false;
        this.shooter.isColorBomb = false;
        this.shooter.isThunder = true;
        return true;
    },

    activateRainbowBall() {
        if (
          !isItemUnlocked("rainbow") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (this.shooter.isRainbow) return false;
        if (!consumeItem("rainbow")) return false;

        this.shooter.isBomb = false;
        this.shooter.isThunder = false;
        this.shooter.isColorBomb = false;
        this.shooter.isRainbow = true;
        return true;
    },

    activateColorBomb() {
        if (
          !isItemUnlocked("colorbomb") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (this.shooter.isColorBomb) return false;
        if (!consumeItem("colorbomb")) return false;

        this.shooter.isBomb = false;
        this.shooter.isThunder = false;
        this.shooter.isRainbow = false;
        this.shooter.isColorBomb = true;
        return true;
    },

    activateHourglass() {
        // Nur im Speedgame: sofort +10 Sekunden auf die aktuelle Restzeit.
        // Funktioniert auch bereits während des 3-2-1-START-Countdowns.
        if (
          !isItemUnlocked("hourglass") ||
          !this.speedMode ||
          !this.running ||
          this.levelFinished
        ) return false;

        if (!consumeItem("hourglass")) return false;

        const bonus = 10;
        this.speedBonusSeconds += bonus;
        this.speedTimeLimit += bonus;
        this.speedTimeRemaining += bonus;

        if (dom.speedTimerDisplay) {
          dom.speedTimerDisplay.textContent = String(
            Math.max(0, Math.ceil(this.speedTimeRemaining))
          );
        }

        dom.speedTimerHud?.classList.remove("speed-warning");
        dom.speedTimerHud?.classList.remove("speed-time-bonus");
        if (dom.speedTimerHud) {
          void dom.speedTimerHud.offsetWidth;
          dom.speedTimerHud.classList.add("speed-time-bonus");
          setTimeout(() => dom.speedTimerHud?.classList.remove("speed-time-bonus"), 650);
        }

        showToast("Sanduhr: +10 Sekunden");
        updateItemBarLocks();
        return true;
    },

    activateSwitchBall() {
        if (
          !isItemUnlocked("ballswitch") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (!consumeItem("ballswitch")) return false;

        this.swapShooterBall();
        return true;
    },

    activateAimItem() {
        if (
          !isItemUnlocked("aim") ||
          !this.shooter ||
          this.shooter.moving
        ) return false;

        if (this.aimItemAktive) return false;
        if (!consumeItem("aim")) return false;

        this.aimItemAktive = true;
        return true;
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
      updateItemBarLocks();
      this.victoryAnimation = false;
      this.levelFinished = false;
      this.particles = [];
      this.lightningHits = [];
      this.collectedColors = {};
      this.swordFeature = null;
      this.swordReleaseActive = false;
      this.swordReleaseStartedAt = 0;
      this.fallingGoldBall = null;
      const stageNumber = getActiveThemeStage(levelNumber);
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
        { id:"purple" },
        { id:"pink"},
        { id:"black"}
    ];
  }
      this.switchImage = new Image();
      this.switchImage.src = "assets/ui/ballswitch.png";

      this.bombImage = new Image();
      this.bombImage.src = "assets/ui/bomb-ball.png";
      
      this.thunderImage = new Image();
      this.thunderImage.src = "assets/ui/thunder-ball.png";

      this.rainbowImage = new Image();
      this.rainbowImage.src = "assets/ui/rainbow-ball.png";

      this.colorBombImage = new Image();
      this.colorBombImage.src = "assets/ui/color-bomb.png";

      this.aimImage = new Image();
      this.aimImage.src = "assets/ui/lupe.png";

      this.chainLockImage = new Image();
      this.chainLockImage.src = "assets/ui/chain-lock-overlay.png";

      this.swordImage = new Image();
      const swordLevelConfig = getActiveLevelConfig(levelNumber);
      this.swordImage.src =
        swordLevelConfig?.sword?.image ||
        "assets/albums/swords/longsword.png";

      this.goldBallImage = new Image();
      this.goldBallImage.src = "assets/ui/gold-ball.png";

      this.canvas = dom.gameCanvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.score = 0;
      this.shots = 0;
      this.running = true;
      this.levelFinished = false;

   const levelConfig = getActiveLevelConfig(levelNumber);

    const colorCount = Math.min(
        levelConfig?.ballTypes ?? 3,
        this.palette.length
    );

    const shuffledColors = [...this.palette];

    /*
     * Farben zufällig mischen
     */
    for (let i = shuffledColors.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [
            shuffledColors[i],
            shuffledColors[randomIndex]
        ] = [
            shuffledColors[randomIndex],
            shuffledColors[i]
        ];
    }

    /*
     * Diese Farbpärchen dürfen niemals
     * gleichzeitig ausgewählt werden.
     */
    const forbiddenColorPairs = [
        ["blue", "purple"],
        ["red", "pink"]
    ];

    this.activeColors = [];

    /*
     * Bei Farbziel-Leveln muss die benötigte
     * Zielfarbe zwingend vorhanden sein.
     */
    const requiredColorId =
        levelConfig?.mode === "colors"
            ? levelConfig.only_color
            : null;

    if (requiredColorId) {

        const requiredColor = this.palette.find(
            (color) => color.id === requiredColorId
        );

        if (requiredColor) {
            this.activeColors.push(requiredColor);
        }
    }

    /*
     * Die restlichen Farben zufällig ergänzen.
     */
    for (const candidate of shuffledColors) {

        /*
         * Die bereits fest eingefügte Zielfarbe
         * nicht noch einmal hinzufügen.
         */
        const alreadySelected =
            this.activeColors.some(
                (color) => color.id === candidate.id
            );

        if (alreadySelected) {
            continue;
        }

        const hasForbiddenCombination =
            forbiddenColorPairs.some(([first, second]) => {

                const candidateIsFirst =
                    candidate.id === first;

                const candidateIsSecond =
                    candidate.id === second;

                const firstAlreadySelected =
                    this.activeColors.some(
                        (color) => color.id === first
                    );

                const secondAlreadySelected =
                    this.activeColors.some(
                        (color) => color.id === second
                    );

                return (
                    candidateIsFirst && secondAlreadySelected
                ) || (
                    candidateIsSecond && firstAlreadySelected
                );
            });

        if (hasForbiddenCombination) {
            continue;
        }

        this.activeColors.push(candidate);

        if (this.activeColors.length >= colorCount) {
            break;
        }
    }
      
      this.targetScore = levelConfig?.targetScore ?? 1000;

      // SPEEDGAME vorbereiten. Der eigentliche Timer startet erst
      // nach 3, 2, 1 und dem kurzen START-Aufblinken.
      this.speedMode = levelConfig?.mode === "speed";
      this.speedTimeLimit = Math.max(1, Number(levelConfig?.time) || 60);
      this.speedTimeRemaining = this.speedTimeLimit;
      this.speedCountdownActive = this.speedMode;
      this.speedCountdownStartedAt = this.speedMode ? performance.now() : 0;
      this.speedTimerStartedAt = 0;
      this.speedLastCountdownLabel = "";
      this.speedBonusSeconds = 0;

      const gameHud = dom.gameCanvas?.closest("#playScreen")?.querySelector(".game-hud");
      gameHud?.classList.toggle("speedgame-active", this.speedMode);
      dom.speedTimerHud?.classList.toggle("hidden", !this.speedMode);
      dom.speedTimerHud?.classList.remove("speed-warning");

      if (dom.speedTimerDisplay) {
          dom.speedTimerDisplay.textContent = String(this.speedTimeLimit);
      }

      if (dom.speedCountdownOverlay) {
          dom.speedCountdownOverlay.classList.toggle("hidden", !this.speedMode);
          dom.speedCountdownOverlay.classList.remove("start-flash");
      }

      if (dom.speedCountdownText && this.speedMode) {
          dom.speedCountdownText.textContent = "3";
      }

      // Sanduhr nur im aktuell laufenden Speedgame freigeben.
      updateItemBarLocks();

      dom.playLevelTitle.textContent = state.gameMode === "episode"
        ? `${EpisodeRace.getActiveEpisode()?.name || "Episode"} – Level ${levelNumber}`
        : `Level ${levelNumber}`;
      dom.playScore.textContent = "0 Punkte";
      if (levelConfig?.mode === "colors") {
          const current = this.collectedColors?.[levelConfig.only_color] ?? 0;
          dom.targetScoreDisplay.textContent =
          `${current}/${levelConfig.need}`;
      } else if (levelConfig?.mode === "sword") {
          dom.targetScoreDisplay.textContent = "GOLDBALL";
      } else {
          dom.targetScoreDisplay.textContent =
          this.targetScore.toLocaleString("de-DE");
      }
      dom.shotsDisplay.textContent = "0";
      dom.colorsDisplay.textContent = String(colorCount);
      dom.winPopup?.classList.add("hidden");
      dom.loseShotsPopup?.classList.add("hidden");
      dom.loseBoundaryPopup?.classList.add("hidden");

      ThemeManager.applyStageAssets(getActiveThemeStage(levelNumber));

      this.createBoard(levelNumber);
      this.createShooter();

      Navigation.show("play");

      Navigation.show("play");

      /*setTimeout(() => {
          window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth"
          });
      }, 300);*/

      this.bindCanvasEvents();
      this.startLoop();

    },
    createBoard(levelNumber) {
      this.bubbles = [];
      this.topRowOffset = 0;

      // Horizontale Grundposition für ein zentriertes Raster
      this.gridBaseX =
      (this.width - 12 * this.columnWidth) / 2;

    const levelConfig = getActiveLevelConfig(levelNumber);

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
          image: color.image,

          isChained: levelConfig?.chainedBalls?.some(
              (position) =>
                  position.row === row + 1 &&
                  position.col === col + 1
          ) ?? false
          });
        }
      }

      this.setupSwordFeature(levelConfig);
    },

    setupSwordFeature(levelConfig) {
      const swordConfig = levelConfig?.sword;

      if (levelConfig?.mode !== "sword" || !swordConfig) {
        this.swordFeature = null;
        return;
      }

      const row = Math.max(2, Number(swordConfig.row) || 2); // 1-basiert
      const col = Math.max(1, Number(swordConfig.col) || 7); // 1-basiert
      const rowIndex = row - 1;
      const offset = rowIndex % 2 ? this.columnWidth / 2 : 0;

      const lockX = Math.max(
        this.radius,
        Math.min(
          this.width - this.radius,
          this.gridBaseX + (col - 1) * this.columnWidth + offset
        )
      );
      const lockY = this.radius + rowIndex * this.rowHeight;

      const diameter = this.radius * 2;
      const swordWidth = diameter * 3;
      const swordHeight = diameter * 5;

      // Goldball sitzt sichtbar ÜBER dem Schwert.
      // Zwischen Ball und Schwert bleibt nur ein kleiner Abstand.
      const swordTop = lockY + this.radius * 1.18;
      const swordLeft = lockX - swordWidth / 2;

      this.swordFeature = {
        lockX,
        lockY,
        swordLeft,
        swordTop,
        swordWidth,
        swordHeight,
        released: false,
        flashStart: 0,
        flashDuration: 420,
        revealStart: 0,
        revealGrowDuration: 900,
        revealHoldDuration: 700,
        burstStart: 0,
        burstDuration: 520,
        collectibleName: levelConfig?.sword?.name || "Sammelstück",
        burstDone: false,
        hidden: false
      };

      // Im 3x5-Feld um das Schwert Platz schaffen.
      this.bubbles = this.bubbles.filter((bubble) => {
        const insideX = Math.abs(bubble.x - lockX) < swordWidth * 0.46;
        const insideY =
          bubble.y > swordTop - this.radius &&
          bubble.y < swordTop + swordHeight + this.radius;

        return !(insideX && insideY);
      });

      // Goldener Halteball – nur durch direkten Treffer lösbar.
      this.bubbles.push({
        x: lockX,
        y: lockY,
        color: { id: "gold", color: "#f6bf23", image: null },
        image: null,
        isSwordLock: true,
        isChained: false
      });
    },

    hitSwordLock(lockBubble) {
      if (
        !lockBubble?.isSwordLock ||
        !this.swordFeature ||
        this.swordFeature.released ||
        this.swordReleaseActive
      ) {
        return false;
      }

      const now = performance.now();

      this.swordReleaseActive = true;
      this.swordReleaseStartedAt = now;

      // Goldball aus dem Kugelverbund lösen. Er wird ab jetzt separat
      // mit echter Fallbewegung gezeichnet und animiert.
      this.bubbles = this.bubbles.filter((bubble) => bubble !== lockBubble);
      this.fallingGoldBall = {
        x: lockBubble.x,
        y: lockBubble.y,
        vy: 0.8,
        startedAt: now,
        flashDuration: 420
      };

      this.swordFeature.released = true;
      this.swordFeature.flashStart = now;
      this.swordFeature.revealStart = 0;
      this.swordFeature.burstStart = 0;
      this.swordFeature.burstDone = false;
      this.swordFeature.hidden = false;

      // Kurzer Freigabe-Effekt direkt am Goldball.
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18;
        const speed = 1.2 + Math.random() * 2.6;

        this.particles.push({
          x: lockBubble.x,
          y: lockBubble.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 4,
          life: 24 + Math.random() * 16,
          maxLife: 40,
          color: { color: i % 2 ? "#ffd34d" : "#ffffff" }
        });
      }

      this.screenShake = 4;
      Audio.playEffect("hit");

      if (this.shooter) {
        this.shooter.moving = false;
        this.shooter.vx = 0;
        this.shooter.vy = 0;
      }

      return true;
    },

    updateSwordReleaseAnimation(deltaTime = 1) {
      if (!this.swordReleaseActive || !this.swordFeature) return;

      const now = performance.now();
      const elapsed = now - this.swordReleaseStartedAt;
      const sword = this.swordFeature;

      // Der freigespielte Goldball fällt mit Beschleunigung nach unten.
      if (this.fallingGoldBall) {
        this.fallingGoldBall.vy += 0.42 * deltaTime;
        this.fallingGoldBall.y += this.fallingGoldBall.vy * deltaTime;

        if (this.fallingGoldBall.y > this.height + this.radius * 3) {
          this.fallingGoldBall = null;
        }
      }

      // Nach dem Goldball-Blitz startet die Sammelstück-Enthüllung:
      // aufblähen + Name einblenden, kurz halten, danach platzen.
      if (elapsed >= 430 && !sword.revealStart) {
        sword.revealStart = now;
      }

      if (sword.revealStart && !sword.burstStart) {
        const revealElapsed = now - sword.revealStart;
        if (revealElapsed >= sword.revealGrowDuration + sword.revealHoldDuration) {
          sword.burstStart = now;
        }
      }

      if (sword.burstStart && !sword.burstDone) {
        const burstProgress = Math.min(
          1,
          (now - sword.burstStart) / sword.burstDuration
        );

        if (burstProgress >= 1) {
          sword.burstDone = true;
          sword.hidden = true;

          const centerX = sword.swordLeft + sword.swordWidth / 2;
          const centerY = sword.swordTop + sword.swordHeight / 2;

          // Platzen der jeweiligen Sammelkarten-PNG.
          for (let i = 0; i < 34; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.2 + Math.random() * 5.4;

            this.particles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 3 + Math.random() * 7,
              life: 28 + Math.random() * 24,
              maxLife: 52,
              color: {
                color: i % 3 === 0 ? "#ffffff" : "#ffd34d"
              }
            });
          }

          this.explosions.push({
            x: centerX,
            y: centerY,
            radius: 0,
            alpha: 1
          });

          this.screenShake = 8;
          Audio.playEffect("hit");

          // Ab jetzt exakt die vorhandene Standard-Levelgewonnen-Animation.
          this.score = Math.max(this.score, this.targetScore);
          dom.playScore.textContent =
            `${this.score.toLocaleString("de-DE")} Punkte`;

          this.swordReleaseActive = false;
          this.victoryAnimation = true;

          // Sicherheits-Fallback: Die normale Victory-Animation darf fertiglaufen.
          window.setTimeout(() => {
            if (!this.levelFinished) {
              this.finish(true);
            }
          }, 1900);
        }
      }
    },

    drawFallingGoldBall() {
      const ball = this.fallingGoldBall;
      if (!ball) return;

      const size = this.radius * 2.18;
      const elapsed = performance.now() - ball.startedAt;
      const flashProgress = Math.min(1, elapsed / ball.flashDuration);
      const pulse = Math.sin(flashProgress * Math.PI);

      this.ctx.save();
      this.ctx.globalAlpha = 1;
      this.ctx.shadowColor = "#fff3a0";
      this.ctx.shadowBlur =
        flashProgress < 1 ? 14 + pulse * 34 : 8;

      if (this.goldBallImage?.complete && this.goldBallImage.naturalWidth > 0) {
        this.ctx.drawImage(
          this.goldBallImage,
          ball.x - size / 2,
          ball.y - size / 2,
          size,
          size
        );
      } else {
        this.ctx.fillStyle = "#f6bf23";
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (flashProgress < 1) {
        this.ctx.globalCompositeOperation = "lighter";
        this.ctx.globalAlpha = 0.25 + pulse * 0.65;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.radius * (1.05 + pulse * 0.18), 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    },

    drawSwordFeature() {
      const sword = this.swordFeature;
      if (!sword || sword.hidden) return;

      const now = performance.now();
      const flashProgress =
        sword.released && sword.flashStart
          ? Math.min(1, (now - sword.flashStart) / sword.flashDuration)
          : 0;

      let scale = 1;
      let alpha = 1;

      // Sammelstück wächst während der Enthüllung weich auf ca. 136 %.
      if (sword.revealStart && !sword.burstStart) {
        const revealElapsed = now - sword.revealStart;
        const growProgress = Math.min(1, revealElapsed / sword.revealGrowDuration);
        const easedGrow = 1 - Math.pow(1 - growProgress, 3);
        scale = 1 + easedGrow * 0.36;
      }

      if (sword.burstStart) {
        const burstProgress = Math.min(
          1,
          (now - sword.burstStart) / sword.burstDuration
        );
        const eased = 1 - Math.pow(1 - burstProgress, 3);
        scale = 1.36 + eased * 0.28;

        if (burstProgress > 0.68) {
          alpha = Math.max(0, 1 - (burstProgress - 0.68) / 0.32);
        }
      }

      const drawWidth = sword.swordWidth * scale;
      const drawHeight = sword.swordHeight * scale;
      const centerX = sword.swordLeft + sword.swordWidth / 2;
      const centerY = sword.swordTop + sword.swordHeight / 2;
      const drawLeft = centerX - drawWidth / 2;
      const drawTop = centerY - drawHeight / 2;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      if (sword.burstStart) {
        this.ctx.shadowColor = "#ffd34d";
        this.ctx.shadowBlur = 12 + (scale - 1) * 55;
      }

      if (this.swordImage?.complete && this.swordImage.naturalWidth > 0) {
        this.ctx.drawImage(
          this.swordImage,
          drawLeft,
          drawTop,
          drawWidth,
          drawHeight
        );
      }

      this.ctx.restore();

      // Während der Enthüllung erscheint der Name im Victory-Look.
      if (sword.revealStart && !sword.hidden) {
        const revealElapsed = now - sword.revealStart;
        const fadeIn = Math.min(1, revealElapsed / 260);
        let textAlpha = fadeIn;
        if (sword.burstStart) {
          const bp = Math.min(1, (now - sword.burstStart) / sword.burstDuration);
          textAlpha = Math.max(0, 1 - bp);
        }

        const label = `${String(sword.collectibleName || "Sammelstück").toUpperCase()} ERSPIELT!`;
        const textY = Math.min(this.height - 132, centerY + drawHeight / 2 + 38);

        this.ctx.save();
        this.ctx.globalAlpha = textAlpha;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "900 25px Arial";
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "rgba(80,20,0,.92)";
        this.ctx.shadowColor = "#ffd34d";
        this.ctx.shadowBlur = 18;
        this.ctx.strokeText(label, centerX, textY);
        this.ctx.fillStyle = "#ffd34d";
        this.ctx.fillText(label, centerX, textY);

        this.ctx.shadowBlur = 8;
        this.ctx.font = "700 14px Arial";
        this.ctx.lineWidth = 4;
        this.ctx.strokeText("DEM SAMMELALBUM HINZUGEFÜGT", centerX, textY + 29);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText("DEM SAMMELALBUM HINZUGEFÜGT", centerX, textY + 29);
        this.ctx.restore();
      }
    },

    addNewTopRow() {
     
    const levelConfig = getActiveLevelConfig(state.selectedLevel);

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

createChainBreakEffect(x, y) {
    const r = this.radius;

    const fragments = [
        { part: 0, ox: -r / 2, oy: -r / 2, vx: -2.8, vy: -3.0 },
        { part: 1, ox:  r / 2, oy: -r / 2, vx:  2.8, vy: -3.0 },
        { part: 2, ox: -r / 2, oy:  r / 2, vx: -2.8, vy:  2.0 },
        { part: 3, ox:  r / 2, oy:  r / 2, vx:  2.8, vy:  2.0 }
    ];

    fragments.forEach((fragment) => {
        this.chainBreaks.push({
            x: x + fragment.ox,
            y: y + fragment.oy,
            vx: fragment.vx,
            vy: fragment.vy,
            part: fragment.part,
            rotation: 0,
            spin: (Math.random() - 0.5) * 0.35,
            life: 26
        });
    });
},

updateChainBreaks(deltaTime = 1) {
    this.chainBreaks.forEach((piece) => {
        piece.x += piece.vx * deltaTime;
        piece.y += piece.vy * deltaTime;

        // leichte Schwerkraft
        piece.vy += 0.10 * deltaTime;

        // Kettenstücke drehen sich beim Wegfliegen
        piece.rotation += piece.spin * deltaTime;

        // Lebensdauer
        piece.life -= deltaTime;
    });

    // fertige Kettenstücke entfernen
    this.chainBreaks = this.chainBreaks.filter(
        (piece) => piece.life > 0
    );
},

drawChainBreaks() {
    const img = this.chainLockImage;

    if (
        !img?.complete ||
        img.naturalWidth === 0
    ) {
        return;
    }

    const sourceWidth = img.naturalWidth / 2;
    const sourceHeight = img.naturalHeight / 2;

    this.chainBreaks.forEach((piece) => {
        const column = piece.part % 2;
        const row = Math.floor(piece.part / 2);

        this.ctx.save();

        this.ctx.translate(piece.x, piece.y);
        this.ctx.rotate(piece.rotation);

        // Am Ende langsam ausblenden
        this.ctx.globalAlpha = Math.min(
            1,
            piece.life / 10
        );

        this.ctx.drawImage(
            img,

            // Bereich aus der Originalgrafik
            column * sourceWidth,
            row * sourceHeight,
            sourceWidth,
            sourceHeight,

            // Position des einzelnen Stücks
            -this.radius / 2,
            -this.radius / 2,
            this.radius,
            this.radius
        );

        this.ctx.restore();
    });
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
        isRainbow: false,
        isColorBomb: false,
        isAim: false,
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
        this.speedCountdownActive ||
        this.swordReleaseActive ||
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

      /*if (this.aimItemActive) {
        this.aimItemActive = false;
      }*/
    },

    updateSpeedGame(currentTime = performance.now()) {
      if (!this.speedMode || this.levelFinished || !this.running) return;

      // Während der Sieg-Animation bleibt die erreichte Zeit eingefroren.
      if (this.victoryAnimation) return;

      if (this.speedCountdownActive) {
        const elapsed = currentTime - this.speedCountdownStartedAt;
        let label = "";
        let startFlash = false;

        if (elapsed < 1000) label = "3";
        else if (elapsed < 2000) label = "2";
        else if (elapsed < 3000) label = "1";
        else if (elapsed < 3700) {
          label = "START";
          startFlash = true;
        } else {
          this.speedCountdownActive = false;
          this.speedTimerStartedAt = currentTime;
          dom.speedCountdownOverlay?.classList.add("hidden");
          dom.speedCountdownOverlay?.classList.remove("start-flash");
          return;
        }

        if (label !== this.speedLastCountdownLabel) {
          this.speedLastCountdownLabel = label;
          if (dom.speedCountdownText) dom.speedCountdownText.textContent = label;

          // Animation bei jeder neuen Zahl neu triggern.
          if (dom.speedCountdownOverlay) {
            dom.speedCountdownOverlay.classList.toggle("start-flash", startFlash);
            const text = dom.speedCountdownText;
            if (text) {
              text.style.animation = "none";
              void text.offsetWidth;
              text.style.animation = "";
            }
          }
        }
        return;
      }

      if (!this.speedTimerStartedAt) {
        this.speedTimerStartedAt = currentTime;
      }

      const elapsedSeconds = (currentTime - this.speedTimerStartedAt) / 1000;
      this.speedTimeRemaining = Math.max(0, this.speedTimeLimit - elapsedSeconds);
      const shownSeconds = Math.max(0, Math.ceil(this.speedTimeRemaining));

      if (dom.speedTimerDisplay) {
        dom.speedTimerDisplay.textContent = String(shownSeconds);
      }
      dom.speedTimerHud?.classList.toggle("speed-warning", shownSeconds <= 10);

      if (this.speedTimeRemaining <= 0) {
        this.speedTimeRemaining = 0;
        if (dom.speedTimerDisplay) dom.speedTimerDisplay.textContent = "0";
        this.finish(false, "Zeit abgelaufen! Zielpunktzahl nicht erreicht.");
      }
    },

    update(deltaTime = 1) {
      this.updateSpeedGame(performance.now());
      if (this.levelFinished || !this.running) return;
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
    this.updateChainBreaks(deltaTime);
    this.updateSwordReleaseAnimation(deltaTime);

    // Während Goldball-Fall und Sammelkarten-PNG-Platzen wird die normale
    // Spielphysik kurz angehalten. Danach übernimmt die Standard-Victory-Animation.
    if (this.swordReleaseActive) {
        return;
    }

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

    dom.playScore.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte`;


    this.removeFloatingBubbles();

    this.bubbles = this.bubbles.filter(
        (bubble) => !thunder.targets.includes(bubble) || bubble === target
    );

    this.removeFloatingBubbles();

    dom.playScore.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte`;
    this.checkObjectiveWin();

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

      let hitBubble = null;
      let closestDistance = Infinity;

      this.bubbles.forEach((bubble) => {

          const distance = Math.hypot(
              bubble.x - this.shooter.x,
              bubble.y - this.shooter.y
          );

          if (
              distance <= this.radius * 2 - 2 &&
              distance < closestDistance
          ) {
              hitBubble = bubble;
              closestDistance = distance;
          }
      });

      const bubbleHit = hitBubble !== null;

      if (ceilingHit || bubbleHit) {

          this.lastHitBubble = hitBubble;

          // Sammelalbum-Level: Ein direkter Treffer auf den Goldball gewinnt NICHT.
          // Er dient als Hindernis und muss durch Wegspielen seiner Verbindung
          // zur Decke tatsächlich freigespielt werden.
          this.attachShooter();

          // Max Schüsse prüfen nach abgeschlossenem Schuss
          const activeConfig = getActiveLevelConfig(state.selectedLevel);
          const maxShots = Number(activeConfig?.maxShots);

          if (
              activeConfig?.mode !== "speed" &&
              Number.isFinite(maxShots) &&
              maxShots > 0 &&
              !this.levelFinished &&
              this.shots >= maxShots
          ) {
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

      if (this.shooter.isColorBomb) {
        this.explodeColorBomb();
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
          color: this.shooter.color,
          isRainbow: this.shooter.isRainbow === true
      };

      this.bubbles.push(placed);

      const connected = this.findConnectedSameColor(placed);

      const removedBubbles = connected.length >= 3;

 if (removedBubbles) {
    Audio.playEffect("hit");

    // Kettenbälle und normale Bälle trennen
    const chainedBubbles = connected.filter(
        (bubble) => bubble.isChained
    );

    const bubblesToRemove = connected.filter(
        (bubble) => !bubble.isChained
    );

    chainedBubbles.forEach((bubble) => {
    // Kette visuell auseinandersprengen
    this.createChainBreakEffect(
        bubble.x,
        bubble.y
    );

    // Ball danach entsperren
    bubble.isChained = false;
});

    // Nur normale Bälle zerplatzen
    bubblesToRemove.forEach((bubble) => {
        this.createPopEffect(
            bubble.x,
            bubble.y,
            bubble.color
        );
    });

    // Nur normale Bälle entfernen
    const removalSet = new Set(bubblesToRemove);

    this.bubbles = this.bubbles.filter(
        (bubble) => !removalSet.has(bubble)
    );

    // Nur wirklich entfernte Bälle zählen
    bubblesToRemove.forEach((bubble) => {
        const colorId = bubble.color.id;

        if (!this.collectedColors[colorId]) {
            this.collectedColors[colorId] = 0;
        }

        this.collectedColors[colorId]++;
    });

    this.score += bubblesToRemove.length * 100;

    this.removeFloatingBubbles();

    dom.playScore.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte`;

    const levelConfig = getActiveLevelConfig(state.selectedLevel);

    if (levelConfig?.mode === "colors") {
        const current =
            this.collectedColors[levelConfig.only_color] ?? 0;

        dom.targetScoreDisplay.textContent =
            `${current}/${levelConfig.need}`;
    }

    this.checkObjectiveWin();
}

      

      const levelConfig = getActiveLevelConfig(state.selectedLevel);

      // Beim SPEEDGAME hat die erreichte Zielpunktzahl Vorrang vor
      // allen nachfolgenden Verlustprüfungen dieses Schusses.
      if (levelConfig?.mode === "speed" && this.victoryAnimation) {
          return;
      }

      if (!levelConfig || !["colors", "speed", "sword"].includes(levelConfig.mode)) {

          if (this.score >= this.targetScore) {
              this.victoryAnimation = true;
              return;
          }

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

        if (this.aimItemAktive) {
          this.aimItemAktive = false;
    
      }
      
  },

checkObjectiveWin() {

  const levelConfig = getActiveLevelConfig(state.selectedLevel);


  // SCHWERT-LEVEL: Sieg ausschließlich durch Befreiung des Schwertes.
  if (levelConfig?.mode === "sword") {
      return;
  }

  // SPEEDGAME: Zielpunktzahl innerhalb der laufenden Zeit erreicht.
  if (levelConfig?.mode === "speed") {
      if (this.score >= this.targetScore && !this.speedCountdownActive) {
          this.victoryAnimation = true;
      }
      return;
  }

  // Spezialmodus: Farben sammeln
  if (levelConfig?.mode === "colors") {

      const collected = this.collectedColors?.[levelConfig.only_color] || 0;


      if (collected >= levelConfig.need) {

    this.victoryAnimation = true;

    setTimeout(() => {
        this.finish(true);
    }, 1200);

}

      return;
  }


  // Standardmodus Punkte
  if (this.score >= this.targetScore) {
      this.victoryAnimation = true;
  }

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

  const explosionRadius = this.radius * 3.4;

  const removedByBomb = this.bubbles.filter((bubble) => {
    if (bubble.isSwordLock) return false;

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

this.checkObjectiveWin();

  this.bubbles = this.bubbles.filter((bubble) => {
    if (bubble.isSwordLock) return true;

    const distance = Math.hypot(
      bubble.x - this.shooter.x,
      bubble.y - this.shooter.y
    );

    return distance > explosionRadius;
  });

  this.removeFloatingBubbles();

  // Wichtig für SPEEDGAME: Auch Punkte durch anschließend fallende Bälle
  // können die Zielpunktzahl erreichen.
  dom.playScore.textContent =
      `${this.score.toLocaleString("de-DE")} Punkte`;
  this.checkObjectiveWin();
},

explodeColorBomb() {
    // Die Farbbombe übernimmt NICHT die Farbe des Shooter-Balls,
    // sondern exakt die Farbe der tatsächlich getroffenen Kugel.
    const hitBubble = this.lastHitBubble;
    const targetColorId = hitBubble?.color?.id;

    // Wurde nur die Decke getroffen, gibt es keine Ziel-Farbe.
    if (!targetColorId) return;

    Audio.playEffect("hit");

    const removedByColorBomb = this.bubbles.filter(
        (bubble) => bubble?.color?.id === targetColorId
    );

    if (removedByColorBomb.length === 0) return;

    removedByColorBomb.forEach((bubble) => {
        this.createPopEffect(bubble.x, bubble.y, bubble.color);

        if (!this.collectedColors[targetColorId]) {
            this.collectedColors[targetColorId] = 0;
        }
        this.collectedColors[targetColorId]++;
    });

    const removalSet = new Set(removedByColorBomb);
    this.bubbles = this.bubbles.filter(
        (bubble) => !removalSet.has(bubble)
    );

    // Direkt zerstörte Kugeln zählen wie normale Treffer.
    this.score += removedByColorBomb.length * 100;

    // Vorhandene Fall-Logik bleibt erhalten:
    // lose Kugeln fallen, zählen für Farbziele und geben 150 Punkte.
    this.removeFloatingBubbles();

    dom.playScore.textContent =
        `${this.score.toLocaleString("de-DE")} Punkte`;

    const levelConfig = getActiveLevelConfig(state.selectedLevel);
    if (levelConfig?.mode === "colors") {
        const current =
            this.collectedColors[levelConfig.only_color] ?? 0;
        dom.targetScoreDisplay.textContent =
            `${current}/${levelConfig.need}`;
    }

    this.checkObjectiveWin();
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
   
},

findThunderTargets(startX, startY) {

    const targets = [];

    const visited = new Set();


    // nächste Kugel am Einschlagspunkt finden
    let startBubble = null;
    let minDistance = Infinity;


    this.bubbles.forEach(bubble => {

        if (bubble.isSwordLock) return;

        const distance = Math.hypot(
            bubble.x - startX,
            bubble.y - startY
        );


        if (distance < minDistance) {

            minDistance = distance;
            startBubble = bubble;

        }

    });


    if (!startBubble) {
        return targets;
    }



    // rekursive Suche nach oben
    const searchUp = (currentBubble) => {


        if (!currentBubble) {
            return;
        }


        // Schutz gegen Endlosschleifen
        if (visited.has(currentBubble)) {
            return;
        }


        visited.add(currentBubble);


        // aktuelle Kugel speichern
        targets.push(currentBubble);



        // alle Kugeln finden, die darüber andocken
        const upperBubbles = this.bubbles.filter(bubble => {


            if (bubble.isSwordLock || visited.has(bubble)) {
                return false;
            }


            const dx = bubble.x - currentBubble.x;
            const dy = bubble.y - currentBubble.y;


            const distance = Math.hypot(dx, dy);



            // ungefähr Nachbarabstand
            return (
                distance < this.radius * 2.2 &&
                bubble.y < currentBubble.y
            );


        });



        if (upperBubbles.length === 0) {
            return;
        }



        // zufällige Kugel aus oberer Reihe wählen
        const nextBubble =
            upperBubbles[
                Math.floor(
                    Math.random() * upperBubbles.length
                )
            ];



        // rekursiv weiter nach oben
        searchUp(nextBubble);

    };



    searchUp(startBubble);



    return targets;

},









/*findThunderTargets(startX, startY) {

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

},*/

findConnectedSameColor(origin) {

    const result = [];
    const visited = new Set();
    const queue = [origin];
    const neighborDistance = this.radius * 2.35;

    let targetColorId = origin.color.id;
    let matchedColor = origin.color;

    /*
     * Ein Regenbogenball übernimmt die Farbe
     * der tatsächlich getroffenen Kugel.
     */
    if (origin.isRainbow) {

        if (
            this.lastHitBubble &&
            !this.lastHitBubble.isRainbow
        ) {
            targetColorId = this.lastHitBubble.color.id;
            matchedColor = this.lastHitBubble.color;

        } else {

            /*
             * Falls der Regenbogenball die Decke oder einen
             * anderen Regenbogenball trifft, wird die nächste
             * angrenzende normale Farbe verwendet.
             */
            let nearestBubble = null;
            let nearestDistance = Infinity;

            this.bubbles.forEach((bubble) => {

                if (
                    bubble === origin ||
                    bubble.isRainbow
                ) {
                    return;
                }

                const distance = Math.hypot(
                    bubble.x - origin.x,
                    bubble.y - origin.y
                );

                if (
                    distance <= neighborDistance &&
                    distance < nearestDistance
                ) {
                    nearestBubble = bubble;
                    nearestDistance = distance;
                }
            });

            if (!nearestBubble) {
                return [origin];
            }

            targetColorId = nearestBubble.color.id;
            matchedColor = nearestBubble.color;
        }
    }

    /*
     * Normale Bälle müssen dieselbe Farbe besitzen.
     * Regenbogenbälle gelten dabei als jede Farbe.
     */
    while (queue.length) {

        const current = queue.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        const matchesColor =
            current.isRainbow ||
            current.color.id === targetColorId;

        if (!matchesColor) continue;

        result.push(current);

        for (const candidate of this.bubbles) {

            const candidateMatches =
                candidate.isRainbow ||
                candidate.color.id === targetColorId;

            if (
                !visited.has(candidate) &&
                candidateMatches &&
                Math.hypot(
                    candidate.x - current.x,
                    candidate.y - current.y
                ) <= neighborDistance
            ) {
                queue.push(candidate);
            }
        }
    }

    /*
     * Nur wenn mindestens drei Bälle verbunden sind,
     * übernehmen beteiligte Regenbogenbälle intern
     * die getroffene Farbe.
     *
     * Das ist wichtig für Punkte, Farbziele und Partikel.
     */
    if (result.length >= 3) {

        result.forEach((bubble) => {

            if (bubble.isRainbow) {
                bubble.color = matchedColor;
            }
        });
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

      const swordLock = this.bubbles.find(
        (bubble) => bubble.isSwordLock
      );
      const swordLockFreed =
        swordLock && !connectedToTop.has(swordLock);

      const floating = this.bubbles.filter(
        (bubble) =>
          !connectedToTop.has(bubble) &&
          !bubble.isSwordLock
      );

      if (floating.length > 0) {
        const levelConfig = getActiveLevelConfig(state.selectedLevel);

        if (levelConfig?.mode === "colors") {
          floating.forEach((bubble) => {
            const colorId = bubble.color.id;
            if (!this.collectedColors[colorId]) {
              this.collectedColors[colorId] = 0;
            }
            this.collectedColors[colorId]++;
          });
        }

        this.score += floating.length * 150;
        const floatingSet = new Set(floating);
        this.bubbles = this.bubbles.filter(
          (bubble) => !floatingSet.has(bubble)
        );
      }

      // Erst wenn der Goldball keinerlei Verbindung mehr zur Decke besitzt,
      // gilt er als freigespielt und startet den Sammelalbum-Abschlussflow.
      if (swordLockFreed) {
        this.hitSwordLock(swordLock);
      }
    },

drawBubble(bubble) {

    // Goldener Halteball des Schwertes
    if (bubble.isSwordLock) {
        const size = this.radius * 2.18;

        if (this.goldBallImage?.complete && this.goldBallImage.naturalWidth > 0) {
            this.ctx.save();
            this.ctx.shadowColor = "#ffd84d";
            this.ctx.shadowBlur = 12;
            this.ctx.drawImage(
                this.goldBallImage,
                bubble.x - size / 2,
                bubble.y - size / 2,
                size,
                size
            );
            this.ctx.restore();
        } else {
            this.ctx.save();
            this.ctx.fillStyle = "#f6bf23";
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        return;
    }

    // Farbbombe
    if (bubble.isColorBomb && this.colorBombImage?.complete) {
        const size = this.radius * 2;
        this.ctx.drawImage(
            this.colorBombImage,
            bubble.x - this.radius,
            bubble.y - this.radius,
            size,
            size
        );
        return;
    }

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

    // Regenbogenball
    if (bubble.isRainbow && this.rainbowImage?.complete) {

        const size = this.radius * 2;

        this.ctx.drawImage(
            this.rainbowImage,
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

  if (
    (!state.settings.aimGuide && !this.aimItemAktive) ||
    this.shooter?.moving
  ) return;


  const dx = this.aimX - this.shooter.x;
  const dy = Math.min(this.aimY - this.shooter.y, -40);
  const length = Math.hypot(dx, dy) || 1;


  this.ctx.save();

  this.ctx.setLineDash([7, 9]);
  this.ctx.strokeStyle = "rgba(255,255,255,.72)";
  this.ctx.lineWidth = 2;


  this.ctx.beginPath();


  const guideLength = this.aimItemAktive ? 600 : 220;


  let x = this.shooter.x;
  let y = this.shooter.y;


  let vx = dx / length;
  let vy = dy / length;


  this.ctx.moveTo(x, y);


  for (let i = 0; i < guideLength; i += 5) {

    x += vx * 5;
    y += vy * 5;


    // Wand-Abpraller links/rechts
    if (
      x <= this.radius ||
      x >= this.width - this.radius
    ) {

      vx *= -1;

      x = Math.max(
        this.radius,
        Math.min(
          this.width - this.radius,
          x
        )
      );
    }


    this.ctx.lineTo(x, y);


    // Decke erreicht
    if (y <= this.radius) {
      break;
    }
  }


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

      // Schwert liegt hinter dem Goldball und den normalen Kugeln.
      this.drawSwordFeature();

      this.bubbles.forEach((bubble, index) => {
    this.drawBubble(bubble);

    // TEST: Kette nur über den ersten Ball legen
    if (
        bubble.isChained &&
        this.chainLockImage?.complete &&
        this.chainLockImage.naturalWidth > 0
    ) {
        const chainSize = this.radius * 2;

        this.ctx.drawImage(
            this.chainLockImage,
            bubble.x - this.radius,
            bubble.y - this.radius,
            chainSize,
            chainSize
        );
    }
});
      this.drawFallingGoldBall();
      this.drawParticles();
      this.drawChainBreaks();
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
      const activeLevelConfig = getActiveLevelConfig(state.selectedLevel);
      const targetHudText =
          activeLevelConfig?.mode === "sword"
              ? `${this.score.toLocaleString("de-DE")} | GOLDBALL`
              : `${this.score.toLocaleString("de-DE")} | ${this.targetScore.toLocaleString("de-DE")}`;

      this.ctx.fillText(
          targetHudText,
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
      // Victory Animation startet sauber ohne alte Effekte
      this.explosions = [];
      this.particles = [];

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
      this.speedCountdownActive = false;
      cancelAnimationFrame(this.animationFrame);
      dom.speedCountdownOverlay?.classList.add("hidden");
      dom.speedCountdownOverlay?.classList.remove("start-flash");
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
    if (state.gameMode === "episode") {
        EpisodeRace.exitToEpisodes();
    } else if (window.WorldMap2?.open) {
        window.WorldMap2.open();
    } else {
        Navigation.show("home");
    }
};
},


    async finish(won, loseMessage = "Level verloren!") {
      CollectorAlbum.hideVictoryReward();
      this.explosions = [];
      this.particles = [];

      if (this.levelFinished) return;
      this.stop();

      if (!won) {
        this.showLoseShotsPopup(loseMessage);
        return;
      }

      const level = state.selectedLevel;
      const levelConfig = getActiveLevelConfig(level);
      const stars = state.gameMode === "episode"
        ? calculateEpisodeStars(levelConfig, { shots: this.shots, score: this.score })
        : calculateStars(level, { shots: this.shots, score: this.score });

      if (stars === 0) {
        this.showLoseShotsPopup("Zu viele Schüsse verbraucht.");
        return false;
      }

      this.levelFinished = true;

      /* =====================================================
         EPISODENRENNEN – vollständig getrennt vom Standardfortschritt
         ===================================================== */
      if (state.gameMode === "episode") {
        const episode = EpisodeRace.getActiveEpisode();
        const progress = EpisodeRace.finishLevel(level, stars, this.score, this.shots);
        const isLastLevel = Boolean(episode && Number(level) === episode.levels.length);

        dom.itemUnlockReward.classList.add("hidden");
        dom.winResultTitle.textContent = isLastLevel ? "Episode geschafft!" : "Episodenlevel geschafft!";
        dom.winResultText.textContent = isLastLevel
          ? `${this.score.toLocaleString("de-DE")} Punkte. Du hast die komplette Strecke beendet!`
          : `${this.score.toLocaleString("de-DE")} Punkte mit ${this.shots} Schüssen.`;
        startVictoryImpact(stars);

        const nextButton = dom.nextLevelButton;
        nextButton.classList.remove("hidden");
        nextButton.style.display = "block";
        nextButton.textContent = isLastLevel ? "Zur Episode" : "Nächstes Episodenlevel";
        nextButton.onclick = () => {
          dom.winResultOverlay.classList.add("hidden");
          if (isLastLevel) {
            EpisodeRace.exitToEpisodes();
            return;
          }
          setTimeout(() => this.start(Number(level) + 1), 300);
        };

        if (dom.resultMapButton) {
          dom.resultMapButton.textContent = "Zur Episode";
          dom.resultMapButton.onclick = () => {
            dom.winResultOverlay.classList.add("hidden");
            EpisodeRace.exitToEpisodes();
          };
        }

        EpisodeRace.renderHomeStatus();
        return true;
      }

      /* =====================================================
         STANDARDLEVEL – bisheriges Verhalten
         ===================================================== */
      const oldResult = (state.progress.results || {})[level];
      const newAlbumCard = CollectorAlbum.collectLevel(level, !oldResult);
      CollectorAlbum.showVictoryReward(newAlbumCard);
      showUnlockedItemReward(level, Boolean(oldResult));

      if (levelConfig?.mode === "speed") {
        const usedTime = Math.max(0, this.speedTimeLimit - this.speedTimeRemaining);
        dom.winResultText.textContent =
          `${this.score.toLocaleString("de-DE")} Punkte in ${usedTime.toFixed(1).replace(".", ",")} Sekunden.`;
      } else {
        dom.winResultText.textContent =
          `${this.score.toLocaleString("de-DE")} Punkte mit ${this.shots} Schüssen.`;
      }
      startVictoryImpact(stars);

      if (!oldResult || stars > oldResult.stars || this.score > oldResult.score) {
        state.progress.results[level] = {
          stars,
          score: this.score,
          shots: this.shots,
          completedAt: new Date().toISOString()
        };
      }

      if (
        level === state.progress.unlockedLevel &&
        state.progress.unlockedLevel < GAME_CONFIG.totalStages * GAME_CONFIG.levelsPerStage
      ) {
        state.progress.unlockedLevel++;
      }

      state.progress.unlockedLevel = Math.max(
        Number(state.progress.unlockedLevel) || 1,
        level + 1
      );

      SaveManager.saveProgress(state.progress);
      updateItemBarLocks();

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
      dom.nextLevelButton.classList.remove("hidden");
      dom.nextLevelButton.style.display = "block";

      const cameFromWorldMap2 = window.BK_levelOrigin === "worldMap2";

      // ENDLOSKARTE: Nach dem Sieg NICHT direkt das nächste Level starten.
      // Erst zurück auf die Karte und den roten Positionspunkt sichtbar
      // vom gerade geschafften Level zum neu freigeschalteten Level bewegen.
      dom.nextLevelButton.textContent = cameFromWorldMap2 ? "Weiter" : "Nächstes Level";
      dom.nextLevelButton.onclick = async () => {

            state.progress.unlockedLevel = Math.max(state.progress.unlockedLevel, level + 1);
        SaveManager.saveProgress(state.progress);

        if (cameFromWorldMap2) {
          // Ergebnis-Popup absichtlich NOCH NICHT ausblenden.
          // WorldMap2 baut die Karte unsichtbar fertig auf und schaltet erst
          // dann um. Dadurch verschwindet der blaue/leere Zwischenframe.
          BubbleGame.stop();

          // WICHTIG: Die Endloskarte hat eine eigene Levelanzahl.
          // NICHT mehr die alte Standardkarten-Grenze
          // GAME_CONFIG.totalStages * GAME_CONFIG.levelsPerStage verwenden
          // (aktuell 5 * 10 = 50), sonst würde z.B. 60 -> 50 animiert.
          const worldMapMaxLevel = Number(
            window.WorldMap2?.totalLevels || state.progress.unlockedLevel || (level + 1)
          );

          const nextLevel = Math.min(
            level + 1,
            worldMapMaxLevel
          );

          if (window.WorldMap2?.openAfterLevelWin) {
            try {
              await window.WorldMap2.openAfterLevelWin(level, nextLevel);
            } catch (error) {
              console.error("[WorldMap2] Fortschrittsanimation fehlgeschlagen:", error);
              window.WorldMap2?.open?.();
            }
          } else if (window.WorldMap2?.open) {
            window.WorldMap2.open();
          }

          dom.winResultOverlay.classList.add("hidden");
          return;
        }

        dom.winResultOverlay.classList.add("hidden");
        setTimeout(() => this.start(level + 1), 300);
      };

      if (dom.resultMapButton) {
        dom.resultMapButton.textContent = "Zur Karte";
        dom.resultMapButton.onclick = () => {
          dom.winResultOverlay.classList.add("hidden");
          BubbleGame.stop();
          state.progress.selectedStage = getStageForLevel(state.selectedLevel);
          SaveManager.saveProgress(state.progress);

          // Die alte Stage-Karte ist deaktiviert. Standardlevel kehren immer
          // auf die neue Endloskarte zurück.
          if (window.WorldMap2?.open) {
            window.WorldMap2.open();
          } else {
            Navigation.show("home");
          }
        };
      }

      // ALTE LEVELKARTE: Das historische weiße Stage-Popup bleibt erhalten.
      // ENDLOSKARTE: Dort übernimmt ausschließlich die moderne Stage-Animation
      // direkt auf der Karte (WorldMap2).
      if (!cameFromWorldMap2 && level % GAME_CONFIG.levelsPerStage === 0) {
        const finishedStage = getStageForLevel(level);

        setTimeout(() => {
          dom.stageCompleteOverlay.classList.remove("hidden");
          dom.stageCompleteName.textContent = `Stage ${finishedStage} geschafft!`;
          dom.stageCompleteText.textContent = "Du hast diese Themenwelt gemeistert!";
          dom.stageCompleteStars.textContent = "⭐".repeat(stars);
        }, 2000);
      }

      return true;
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

const Shop = {

    render() {

        if (!dom.shopOffers) {
            return;
        }

        dom.shopOffers.innerHTML = SHOP_CONFIG.map((offer) => `

            <article class="shop-offer-card">

                <div class="shop-offer-artwork">
                    <img
                        class="shop-offer-pack-image"
                        src="${offer.cardImage}"
                        alt="${escapeHtml(offer.name)} Paket"
                        draggable="false">
                </div>

                <div class="shop-offer-footer">

                    <strong class="shop-offer-name">
                        ${escapeHtml(offer.name)}
                    </strong>

                    <span class="shop-offer-price">
                        ${escapeHtml(offer.price)}
                    </span>

                </div>

            </article>

        `).join("");

    }

};

  function getStageForLevel(levelNumber) {
    return getStageNumberForLevel(levelNumber);
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

    // Die neue Levelkarte ist jetzt das Hauptspiel.
    if (window.WorldMap2) {
      window.WorldMap2.open();
    }
  });

  dom.newGameButton.addEventListener("click", () => {
    const confirmed = confirm(
      "Soll der aktuelle Fortschritt wirklich gelöscht werden?"
    );

    if (!confirmed) return;

    const episodeProgressBackup = localStorage.getItem(EpisodeRace.storageKey);
    localStorage.clear();
    if (episodeProgressBackup !== null) {
      localStorage.setItem(EpisodeRace.storageKey, episodeProgressBackup);
    }
    state.progress = SaveManager.loadProgress();
    ThemeManager.apply(state.progress.activeTheme);
    updateItemBarLocks();
    showToast("Neuer Spielstand wurde angelegt.");
  });

  // Alte Stage-Levelkarte bleibt im Projekt, ist auf der Startseite aber deaktiviert.
  dom.openMapButton?.addEventListener("click", (event) => {
    event.preventDefault();
  });
 
  dom.openRankingButton.addEventListener("click", () => Navigation.show("ranking"));

  dom.openShopButton.addEventListener("click", () => Navigation.show("shop"));

  dom.openWheelButton.addEventListener("click", () => Navigation.show("wheel"));

  dom.openEpisodesButton.addEventListener("click", () => Navigation.show("episodes"));

  dom.openAlbumsButton?.addEventListener("click", () => Navigation.show("albums"));

  // Sammelkarten: echte Touch-/Click-Auswahl auf Mobilgeräten und Desktop.
  // Delegation bleibt auch nach CollectorAlbum.render() aktiv, da das Grid neu aufgebaut wird.
  dom.albumCardGrid?.addEventListener("click", (event) => {
    const cardElement = event.target.closest(".album-collect-card");
    if (!cardElement || !dom.albumCardGrid.contains(cardElement)) return;

    // Verhindert den auf manchen Mobilbrowsern nach einem Tap erzeugten Ghost-Click/Zoom.
    event.preventDefault();

    dom.albumCardGrid.querySelectorAll(".album-collect-card.is-selected")
      .forEach((element) => {
        if (element !== cardElement) element.classList.remove("is-selected");
      });

    cardElement.classList.toggle("is-selected");
  });


  dom.albumRewardState?.addEventListener("click", (event) => {
    event.preventDefault();
    CollectorAlbum.claimReward();
  });

  dom.albumRewardClose?.addEventListener("click", (event) => {
    event.preventDefault();
    CollectorAlbum.hideAlbumRewardVictory();
  });

  dom.albumRewardOverlay?.addEventListener("click", (event) => {
    if (event.target === dom.albumRewardOverlay) CollectorAlbum.hideAlbumRewardVictory();
  });

  dom.wheelSpinButton.addEventListener("click", () => LuckyWheel.spin());

  dom.wheelVictoryBackButton?.addEventListener("click", () => {
    LuckyWheel.endWinSequence();
    Navigation.show("home");
  });

  // Der 0,99-€-Button ist absichtlich nur vorbereitet und noch ohne Kauffunktion.
  dom.wheelPaidSpinButton?.addEventListener("click", (event) => {
    event.preventDefault();
  });

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

  dom.rainbowItemButton.addEventListener("click",() => {
    BubbleGame.activateRainbowBall();
  });

  dom.aimItemButton.addEventListener("click", () => {
    BubbleGame.activateAimItem();
  });

  dom.colorBombItemButton.addEventListener("click", () => {
    BubbleGame.activateColorBomb();
  });

  dom.hourglassItemButton.addEventListener("click", () => {
    BubbleGame.activateHourglass();
  });

  dom.preLevelLoadoutSlots?.querySelectorAll(".prelevel-loadout-slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      PreLevelLoadout.removeAt(Number(slot.dataset.slot));
    });
  });


  dom.settingsItemButton.addEventListener("click", () => {
      Navigation.show("settings");
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {

        const target = button.dataset.back;

        // Zurück aus Levelvorschau zur Levelkarte
        if (target === "worldMap2") {

            document
                .getElementById("levelScreen")
                ?.classList.remove("world2-level-overlay");

            if (window.WorldMap2) {
                window.WorldMap2.open();
            }

            return;
        }

        // Normale Navigation
        Navigation.show(target);
    });
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

  // Wenn das Level von der Endloskarte kommt:
  // Map und Vorschau vollständig ausblenden.
  if (window.BK_levelOrigin === "worldMap2") {

    const worldMapScreen =
      document.getElementById("worldMap2Screen");

    const levelScreen =
      document.getElementById("levelScreen");

    if (worldMapScreen) {
      worldMapScreen.classList.add("hidden");
    }

    if (levelScreen) {
      levelScreen.classList.add("hidden");
      levelScreen.classList.remove("world2-level-overlay");
    }

    // Keine alte Scrollposition übernehmen
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }

  BubbleGame.equippedItems = new Set(PreLevelLoadout.getSelected());
  BubbleGame.start(state.selectedLevel);

  // Die alte Scrollanimation nur noch bei der alten Levelkarte
  if (window.BK_levelOrigin !== "worldMap2") {

    setTimeout(() => {
      scrollToGame("premium");
    }, 300);

  }

});

  dom.leaveGameButton.addEventListener("click", () => {
    BubbleGame.stop();
    if (state.gameMode === "episode") {
      EpisodeRace.exitToEpisodes();
    } else {
      Navigation.show("level");
    }
  });

  dom.retryLevelButton.addEventListener("click", () => {
    BubbleGame.start(state.selectedLevel);
  });

  dom.resultMapButton.addEventListener("click", () => {
    if (state.gameMode === "episode") {
      EpisodeRace.exitToEpisodes();
      return;
    }
    BubbleGame.stop();
    state.progress.selectedStage = getStageForLevel(state.selectedLevel);
    SaveManager.saveProgress(state.progress);
    if (window.WorldMap2?.open) {
      window.WorldMap2.open();
    } else {
      Navigation.show("home");
    }
  });

  dom.stageCompleteButton.addEventListener("click", () => {

  dom.stageCompleteOverlay.classList.add("hidden");

  state.progress.selectedStage =
      getStageForLevel(state.progress.unlockedLevel);

  SaveManager.saveProgress(state.progress);

  if (window.BK_levelOrigin === "worldMap2") {

  if (window.WorldMap2) {
    window.WorldMap2.open();
  }

} else {

  window.WorldMap2?.open();

}

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

    const episodeProgressBackup = localStorage.getItem(EpisodeRace.storageKey);
    localStorage.clear();
    if (episodeProgressBackup !== null) {
      localStorage.setItem(EpisodeRace.storageKey, episodeProgressBackup);
    }

    location.reload();
});

  function init() {
    ThemeManager.apply(state.progress.activeTheme);
    ThemeManager.applyStageAssets(state.progress.selectedStage);
    ensureItemInventory();
    grantUnlockedItemStarterRewards();
    CollectorAlbum.syncFromResults();
    LuckyWheel.ensureState();
    updateItemBarLocks();
    applySettingsToForm();
    updateUserUi();
    EpisodeRace.renderHomeStatus();
    Navigation.show("home");
  }

  init();

const ITEM_INFO = {

    bomb: {
        title: "Bomb Ball",
        text: "Der Bomb Ball zerstört mehrere Kugeln in einem Bereich und hilft dir bei schwierigen Spielsituationen."
    },


    ballswitch: {
        title: "Ball Switch",
        text: "Tausche deine aktuelle Kugel mit der nächsten Kugel und finde bessere Treffer-Möglichkeiten."
    },


    thunder: {
        title: "Thunder Ball",
        text: "Der Thunder Ball entfernt eine komplette Reihe und schafft dir neue Möglichkeiten."
    },

    rainbow: {
      title: "Regenbogenball",
      text: "Der Regenbogenball gilt für jede Farbe. Trifft er eine Farbgruppe, zählt er als passende Farbe. Mindestens drei verbundene Bälle werden weiterhin benötigt."
    },


    aim: {
        title: "Zielhilfe",
        text: "Die Zielhilfe zeigt dir die Flugbahn deiner Kugel und unterstützt dich bei präzisen Treffern."
    },

    colorbomb: {
        title: "Farbbombe",
        text: "Die Farbbombe zerstört alle Kugeln der aktuell abgeschossenen Farbe. Dadurch freigewordene Kugeln fallen wie gewohnt herunter und werden ebenfalls als Punkte gewertet."
    },

    hourglass: {
        title: "Sanduhr",
        text: "Die Sanduhr ist ein Speedgame-Item. Jeder Einsatz schreibt dir sofort 10 Sekunden auf die aktuelle Restzeit gut. Sie kann während des gesamten Speedgames eingesetzt werden."
    }

};


// ITEM INFO POPUP

const itemInfoPopup = document.getElementById("itemInfoPopup");
const itemInfoCard = itemInfoPopup?.querySelector(".item-info-card");
const itemInfoImage = document.getElementById("itemInfoImage");
const itemInfoTitle = document.getElementById("itemInfoTitle");
const itemInfoText = document.getElementById("itemInfoText");
const closeItemInfoButton = document.getElementById("closeItemInfo");

function openItemInfo(itemKey) {
    const info = ITEM_INFO[itemKey];
    const item = ITEM_UNLOCKS[itemKey];
    if (!info || !itemInfoPopup) return;

    if (itemInfoTitle) itemInfoTitle.textContent = info.title;
    if (itemInfoText) itemInfoText.textContent = info.text;

    if (itemInfoImage) {
        if (item?.image) {
            itemInfoImage.src = item.image;
            itemInfoImage.alt = info.title;
            itemInfoImage.hidden = false;
        } else {
            itemInfoImage.removeAttribute("src");
            itemInfoImage.alt = "";
            itemInfoImage.hidden = true;
        }
    }

    itemInfoPopup.classList.remove("hidden");

    // Animation bei jedem Öffnen erneut abspielen.
    if (itemInfoCard) {
        itemInfoCard.classList.remove("item-info-card-replay");
        void itemInfoCard.offsetWidth;
        itemInfoCard.classList.add("item-info-card-replay");
    }
}

function closeItemInfoPopup() {
    itemInfoPopup?.classList.add("hidden");
}

// Auch fuer separat geladene Module (z. B. WorldMap2) verfuegbar.
window.BK_openItemInfo = openItemInfo;

// Event-Delegation: funktioniert auch für dynamisch erzeugte Info-i
// in Loadout und Endloskarte.
document.addEventListener("click", (event) => {
    const button = event.target.closest(".item-info-button");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    openItemInfo(button.dataset.item);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const button = event.target.closest?.(".item-info-button");
    if (!button) return;
    event.preventDefault();
    openItemInfo(button.dataset.item);
});

closeItemInfoButton?.addEventListener("click", closeItemInfoPopup);

itemInfoPopup?.addEventListener("click", (event) => {
    if (event.target === itemInfoPopup) closeItemInfoPopup();
});

})();
