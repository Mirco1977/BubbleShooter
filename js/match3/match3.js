const MAX_COLS = 9;
const LEVEL_1 = Object.freeze({ id: 1, rows: 4, cols: 4, type: "score", targetScore: 1500 });
const LEVEL_2 = Object.freeze({ id: 2, rows: 6, cols: 6, type: "collect", collectKey: "blue", collectTarget: 20 });
let currentLevel = LEVEL_1;
let ROWS = LEVEL_1.rows;
let COLS = LEVEL_1.cols;
let TARGET_SCORE = LEVEL_1.targetScore;
const POINTS_PER_BALL = 100;
const ACCESS_LEVEL = 195;

const BALLS = [
  { key: "red", image: "assets/balls/bk-arena-balls/red.png" },
  { key: "yellow", image: "assets/balls/bk-arena-balls/yellow.png" },
  { key: "green", image: "assets/balls/bk-arena-balls/green.png" },
  { key: "blue", image: "assets/balls/bk-arena-balls/blue.png" }
];

const PIECE_SEPARATOR = "|";
const COLOR_BOMB = "color-bomb";
const AREA_BOMB = "area-bomb";
const COLOR_BOMB_IMAGE = "assets/ui/color-bomb.png";
const AREA_BOMB_IMAGE = "assets/ui/bomb-ball.png";
const LEGACY_STRIPES = new Set(["stripe-h", "stripe-v", "streif-h", "streif-v"]);

// Reserviert für spätere Blocker wie Frost/Ketten. Geschützte Zellen werden
// beim Nachrücken nicht verschoben.
const protectedCells = new Set();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cloneBoard = (board) => board.map((row) => row.slice());

export const Match3Feature = (() => {
  let getProgress = () => ({ unlockedLevel: 1 });
  let saveProgress = () => {};
  let showScreen = () => {};
  let initialized = false;

  let board = [];
  let score = 0;
  let collectedBlue = 0;
  let busy = false;
  let finished = false;
  let selected = null;
  let pointerStart = null;
  let suppressClickUntil = 0;

  const dom = {};

  function cacheDom() {
    dom.homeButton = document.getElementById("openMatch3Button");
    dom.mapBack = document.getElementById("match3MapBackButton");
    dom.level1 = document.getElementById("match3Level1Button");
    dom.level2 = document.getElementById("match3Level2Button");
    dom.playBack = document.getElementById("match3PlayBackButton");
    dom.board = document.getElementById("match3Board");
    dom.score = document.getElementById("match3Score");
    dom.target = document.getElementById("match3TargetDisplay");
    dom.goalHud = document.getElementById("match3GoalHud");
    dom.playTitle = document.getElementById("match3PlayTitle");
    dom.combo = document.getElementById("match3Combo");
    dom.status = document.getElementById("match3Status");
    dom.victory = document.getElementById("match3Victory");
    dom.victoryTitle = document.getElementById("match3VictoryTitle");
    dom.victoryText = document.getElementById("match3VictoryText");
  }

  function hasAccess() {
    return Number(getProgress()?.unlockedLevel || 1) >= ACCESS_LEVEL;
  }

  function refreshAccess() {
    if (!dom.homeButton) cacheDom();
    if (!dom.homeButton) return false;
    const unlocked = hasAccess();
    dom.homeButton.hidden = !unlocked;
    dom.homeButton.classList.toggle("hidden", !unlocked);
    dom.homeButton.setAttribute("aria-hidden", unlocked ? "false" : "true");
    dom.homeButton.tabIndex = unlocked ? 0 : -1;
    return unlocked;
  }

  function applyLevelLayout(config) {
    const rows = Math.max(1, Math.floor(Number(config?.rows) || 1));
    const cols = Math.max(1, Math.min(MAX_COLS, Math.floor(Number(config?.cols) || 1)));

    currentLevel = config || LEVEL_1;
    ROWS = rows;
    COLS = cols;
    if (currentLevel.type === "score") {
      TARGET_SCORE = Math.max(1, Math.floor(Number(config?.targetScore) || 1));
    }

    if (dom.board) {
      dom.board.style.setProperty("--match3-cols", String(COLS));
      dom.board.style.setProperty("--match3-rows", String(ROWS));
      dom.board.dataset.cols = String(COLS);
      dom.board.dataset.rows = String(ROWS);
      dom.board.setAttribute("aria-rowcount", String(ROWS));
      dom.board.setAttribute("aria-colcount", String(COLS));
    }
  }

  function randomBall() {
    return BALLS[Math.floor(Math.random() * BALLS.length)].key;
  }

  function pieceInfo(piece) {
    if (!piece) return { color: null, special: null };
    const [rawColor = "", rawSpecial = null] = String(piece).split(PIECE_SEPARATOR);

    // Alte gespeicherte Streifenball-Werte bleiben kompatibel, besitzen aber
    // keinerlei Spezialfunktion mehr und verhalten sich wie normale Farbbälle.
    if (rawSpecial && LEGACY_STRIPES.has(rawSpecial)) {
      return { color: rawColor || null, special: null };
    }
    if (rawSpecial === COLOR_BOMB || rawSpecial === AREA_BOMB) {
      return { color: null, special: rawSpecial };
    }
    return { color: rawColor || null, special: null };
  }

  function baseColor(piece) {
    const info = pieceInfo(piece);
    return info.special ? null : info.color;
  }

  function isColorBomb(piece) {
    return pieceInfo(piece).special === COLOR_BOMB;
  }

  function isAreaBomb(piece) {
    return pieceInfo(piece).special === AREA_BOMB;
  }

  function makeSpecial(special) {
    return `${PIECE_SEPARATOR}${special}`;
  }

  function normalImageFor(color) {
    return BALLS.find((ball) => ball.key === color)?.image || BALLS[0].image;
  }

  function imageFor(piece) {
    const { color, special } = pieceInfo(piece);
    if (special === COLOR_BOMB) return COLOR_BOMB_IMAGE;
    if (special === AREA_BOMB) return AREA_BOMB_IMAGE;
    return normalImageFor(color);
  }

  function isProtectedCell(row, col) {
    return protectedCells.has(`${row}:${col}`);
  }

  function swapIn(boardToChange, a, b) {
    const temp = boardToChange[a.row][a.col];
    boardToChange[a.row][a.col] = boardToChange[b.row][b.col];
    boardToChange[b.row][b.col] = temp;
  }

  function adjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  function findMatchGroups(boardToCheck) {
    const groups = [];

    for (let row = 0; row < ROWS; row++) {
      let start = 0;
      while (start < COLS) {
        const color = baseColor(boardToCheck[row][start]);
        let end = start + 1;
        while (end < COLS && color && baseColor(boardToCheck[row][end]) === color) end++;
        if (color && end - start >= 3) {
          groups.push({
            direction: "horizontal",
            color,
            cells: Array.from({ length: end - start }, (_, i) => ({ row, col: start + i }))
          });
        }
        start = end;
      }
    }

    for (let col = 0; col < COLS; col++) {
      let start = 0;
      while (start < ROWS) {
        const color = baseColor(boardToCheck[start][col]);
        let end = start + 1;
        while (end < ROWS && color && baseColor(boardToCheck[end][col]) === color) end++;
        if (color && end - start >= 3) {
          groups.push({
            direction: "vertical",
            color,
            cells: Array.from({ length: end - start }, (_, i) => ({ row: start + i, col }))
          });
        }
        start = end;
      }
    }

    return groups;
  }

  function findMatches(boardToCheck) {
    const matched = new Map();
    for (const group of findMatchGroups(boardToCheck)) {
      for (const cell of group.cells) matched.set(`${cell.row}:${cell.col}`, cell);
    }
    return [...matched.values()];
  }

  function cellInGroup(group, pos) {
    return Boolean(pos && group.cells.some((cell) => cell.row === pos.row && cell.col === pos.col));
  }

  function cellId(cell) {
    return `${cell.row}:${cell.col}`;
  }

  function movedCreationCell(cells, dropMap = null) {
    if (!dropMap) return null;
    return cells
      .map((cell) => {
        const drop = dropMap.get(cellId(cell));
        if (!drop) return null;
        const moved = Boolean(drop.spawned || drop.fromRow !== cell.row);
        if (!moved) return null;
        const distance = Math.max(0, cell.row - Number(drop.fromRow));
        return { ...cell, distance, spawned: Boolean(drop.spawned) };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.spawned !== b.spawned) return Number(b.spawned) - Number(a.spawned);
        if (a.distance !== b.distance) return b.distance - a.distance;
        return b.row - a.row || b.col - a.col;
      })[0] || null;
  }

  function exactFiveCandidates(groups) {
    return groups
      .filter((group) => group.cells.length === 5)
      .map((group) => ({ type: COLOR_BOMB, color: group.color, cells: group.cells }));
  }

  function tlCandidates(groups) {
    const horizontal = groups.filter((group) => group.direction === "horizontal" && group.cells.length === 3);
    const vertical = groups.filter((group) => group.direction === "vertical" && group.cells.length === 3);
    const candidates = [];

    for (const h of horizontal) {
      for (const v of vertical) {
        if (h.color !== v.color) continue;
        const intersections = h.cells.filter((cell) => cellInGroup(v, cell));
        if (intersections.length !== 1) continue;

        const intersection = intersections[0];
        const hIndex = h.cells.findIndex((cell) => cellId(cell) === cellId(intersection));
        const vIndex = v.cells.findIndex((cell) => cellId(cell) === cellId(intersection));

        // Mitte/Mitte wäre ein Plus und keine T-/L-Form. Alle übrigen
        // Kombinationen aus Endpunkt/Mitte ergeben die erlaubten T- und L-Ausrichtungen.
        if (hIndex === 1 && vIndex === 1) continue;

        const unique = new Map();
        for (const cell of [...h.cells, ...v.cells]) unique.set(cellId(cell), cell);
        if (unique.size !== 5) continue;
        candidates.push({ type: AREA_BOMB, color: h.color, cells: [...unique.values()] });
      }
    }
    return candidates;
  }

  function planSpecialCreations(groups, swapContext = null, dropMap = null) {
    const five = exactFiveCandidates(groups);
    const fiveCells = new Set(five.flatMap((candidate) => candidate.cells.map(cellId)));
    const tl = tlCandidates(groups).filter((candidate) =>
      !candidate.cells.some((cell) => fiveCells.has(cellId(cell)))
    );

    // Spielerzug: Spezialball immer exakt an der Zielposition des verschobenen Balls.
    // Priorität: Gerade 5 vor T/L.
    if (swapContext?.to) {
      const target = swapContext.to;
      const candidate = five.find((item) => item.cells.some((cell) => cellId(cell) === cellId(target)))
        || tl.find((item) => item.cells.some((cell) => cellId(cell) === cellId(target)));
      return candidate ? [{ ...target, type: candidate.type, color: candidate.color }] : [];
    }

    // Cascade: als Entstehungsposition den tatsächlich neu gespawnten bzw.
    // gefallenen Ball verwenden, der die Form vervollständigt hat.
    const creations = [];
    const usedPositions = new Set();
    const claimedCells = new Set();
    for (const candidate of [...five, ...tl]) {
      if (candidate.cells.some((cell) => claimedCells.has(cellId(cell)))) continue;
      const pos = movedCreationCell(candidate.cells, dropMap);
      if (!pos || usedPositions.has(cellId(pos))) continue;
      usedPositions.add(cellId(pos));
      candidate.cells.forEach((cell) => claimedCells.add(cellId(cell)));
      creations.push({ row: pos.row, col: pos.col, type: candidate.type, color: candidate.color, cascadeCreated: true });
    }
    return creations;
  }

  function hasPossibleMove(boardToCheck) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const from = { row, col };
        const candidates = [
          { row, col: col + 1 },
          { row: row + 1, col }
        ].filter((p) => p.row < ROWS && p.col < COLS);

        for (const to of candidates) {
          const fromPiece = boardToCheck[from.row]?.[from.col];
          const toPiece = boardToCheck[to.row]?.[to.col];
          if ((isColorBomb(fromPiece) && baseColor(toPiece)) ||
              (isColorBomb(toPiece) && baseColor(fromPiece)) ||
              isAreaBomb(fromPiece) || isAreaBomb(toPiece)) return true;
          const test = cloneBoard(boardToCheck);
          swapIn(test, from, to);
          if (findMatches(test).length) return true;
        }
      }
    }
    return false;
  }

  function createPlayableBoard() {
    for (let attempt = 0; attempt < 2500; attempt++) {
      const candidate = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => randomBall())
      );
      if (!findMatches(candidate).length && hasPossibleMove(candidate)) return candidate;
    }

    // Fallback für das aktuelle 4×4-Testlevel. Für spätere Layouts wird
    // nochmals solange erzeugt, bis ein gültiges Brett vorhanden ist.
    if (ROWS === 4 && COLS === 4) {
      return [
        ["red", "yellow", "green", "blue"],
        ["yellow", "red", "blue", "green"],
        ["green", "green", "yellow", "red"],
        ["blue", "red", "green", "yellow"]
      ];
    }

    let candidate;
    do {
      candidate = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => randomBall())
      );
    } while (findMatches(candidate).length || !hasPossibleMove(candidate));
    return candidate;
  }

  function setStatus(text) {
    if (dom.status) dom.status.textContent = text;
  }

  function updateHud(combo = 1) {
    if (dom.score) dom.score.textContent = score.toLocaleString("de-DE");
    if (dom.combo) dom.combo.textContent = `×${combo}`;

    if (currentLevel.type === "collect") {
      const remaining = Math.max(0, Number(currentLevel.collectTarget || 0) - collectedBlue);
      if (dom.target) {
        dom.target.className = "match3-collect-target";
        dom.target.innerHTML = `<img src="${imageFor(currentLevel.collectKey)}" alt="Blauer Ball"><span>${remaining}</span>`;
      }
      if (dom.goalHud) dom.goalHud.textContent = `${remaining} blaue Bälle`;
    } else {
      if (dom.target) {
        dom.target.className = "";
        dom.target.textContent = TARGET_SCORE.toLocaleString("de-DE");
      }
      if (dom.goalHud) dom.goalHud.textContent = `Ziel ${TARGET_SCORE.toLocaleString("de-DE")}`;
    }
  }

  function tileAt(pos) {
    return dom.board?.querySelector(`.match3-tile[data-row="${pos.row}"][data-col="${pos.col}"]`) || null;
  }

  function animationFinished(animation) {
    return animation?.finished?.catch(() => {}) || Promise.resolve();
  }

  async function animateSwapVisual(from, to, duration = 190) {
    const fromTile = tileAt(from);
    const toTile = tileAt(to);
    const fromImg = fromTile?.querySelector("img");
    const toImg = toTile?.querySelector("img");
    if (!fromTile || !toTile || !fromImg || !toImg) {
      await wait(duration);
      return;
    }

    const a = fromTile.getBoundingClientRect();
    const b = toTile.getBoundingClientRect();
    const dx = b.left - a.left;
    const dy = b.top - a.top;
    const easing = "cubic-bezier(.22,.72,.24,1)";

    fromTile.classList.add("is-swapping");
    toTile.classList.add("is-swapping");
    fromImg.style.zIndex = "3";
    toImg.style.zIndex = "2";

    const first = fromImg.animate(
      [
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(1.035)` }
      ],
      { duration, easing, fill: "forwards" }
    );
    const second = toImg.animate(
      [
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: `translate3d(${-dx}px, ${-dy}px, 0) scale(.985)` }
      ],
      { duration, easing, fill: "forwards" }
    );

    await Promise.all([animationFinished(first), animationFinished(second)]);
  }

  function startDropAnimations(dropMap) {
    if (!dom.board || !dropMap?.size) return 0;
    const firstTile = tileAt({ row: 0, col: 0 });
    const secondRowTile = tileAt({ row: 1, col: 0 });
    const pitch = firstTile && secondRowTile
      ? secondRowTile.getBoundingClientRect().top - firstTile.getBoundingClientRect().top
      : (firstTile?.getBoundingClientRect().height || 70) + 7;

    let maxDuration = 0;
    dropMap.forEach((movement, id) => {
      const [row, col] = id.split(":").map(Number);
      const tile = tileAt({ row, col });
      const img = tile?.querySelector("img");
      if (!img) return;

      const distanceRows = Math.max(0, row - movement.fromRow);
      if (!distanceRows) return;
      const startY = -distanceRows * pitch;
      const duration = Math.min(520, 235 + distanceRows * 55);
      maxDuration = Math.max(maxDuration, duration);
      tile.classList.add("is-dropping");
      if (movement.spawned) tile.classList.add("is-spawned");

      img.animate(
        [
          { transform: `translate3d(0, ${startY}px, 0) scale(${movement.spawned ? .96 : 1})`, opacity: movement.spawned ? .88 : 1, offset: 0 },
          { transform: "translate3d(0, 5px, 0) scale(1.015)", opacity: 1, offset: .86 },
          { transform: "translate3d(0, -2px, 0) scale(.998)", opacity: 1, offset: .95 },
          { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1, offset: 1 }
        ],
        { duration, easing: "cubic-bezier(.18,.7,.2,1)", fill: "both" }
      );
    });
    return maxDuration;
  }

  function matchPopColor(piece) {
    const color = baseColor(piece);
    return {
      red: "#ff4a3d",
      yellow: "#ffd84a",
      green: "#59d85a",
      blue: "#4aa8ff",
      purple: "#b96cff",
      pink: "#ff75b9",
      black: "#707782"
    }[color] || "#ffffff";
  }

  function spawnMatchPopBurst(tile, piece, count = 16) {
    if (!dom.board || !tile) return { particles: [], ring: null, flash: null };

    const tileBox = tile.getBoundingClientRect();
    const boardBox = dom.board.getBoundingClientRect();
    const centerX = tileBox.left - boardBox.left + tileBox.width / 2;
    const centerY = tileBox.top - boardBox.top + tileBox.height / 2;
    const burstColor = matchPopColor(piece);
    const particles = [];

    // Gröbere farbige Splitter + kleine helle Glitzerpunkte.
    // Das wirkt klarer und "knackiger" als eine gleichmäßige Staubwolke.
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      const isSpark = i % 4 === 0;
      particle.className = `match3-pop-particle ${isSpark ? "is-spark" : "is-shard"}`;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      const angle = (360 / count) * i + ((i * 17) % 23) - 11;
      const distance = isSpark ? 24 + (i % 3) * 5 : 18 + (i % 5) * 4;
      const size = isSpark ? 2.5 + (i % 2) : 4 + (i % 3);

      particle.style.setProperty("--pop-color", burstColor);
      particle.style.setProperty("--pop-size", `${size}px`);
      particle.dataset.angle = String(angle);
      particle.dataset.distance = String(distance);
      dom.board.appendChild(particle);
      particles.push(particle);
    }

    const ring = document.createElement("span");
    ring.className = "match3-pop-ring";
    ring.style.left = `${centerX}px`;
    ring.style.top = `${centerY}px`;
    ring.style.setProperty("--pop-color", burstColor);
    dom.board.appendChild(ring);

    const flash = document.createElement("span");
    flash.className = "match3-pop-flash";
    flash.style.left = `${centerX}px`;
    flash.style.top = `${centerY}px`;
    flash.style.setProperty("--pop-color", burstColor);
    dom.board.appendChild(flash);

    return { particles, ring, flash };
  }

  async function animateNormalMatchPops(removal = [], options = {}) {
    if (!dom.board || !removal?.length) return;

    // Dieselbe Pop-Explosion wird für normale Matches und Spezialball-Explosionen verwendet.
    const ordered = [...removal].sort((a, b) => a.row - b.row || a.col - b.col);
    const stagger = Number.isFinite(options.stagger) ? options.stagger : 46;
    const delayForCell = typeof options.delayForCell === "function" ? options.delayForCell : null;
    const areaBombPos = options.areaBombPos || null;
    const popDuration = 154;

    const animations = ordered.map((cell, index) => (async () => {
      const customDelay = delayForCell ? Number(delayForCell(cell, index) || 0) : 0;
      await wait(Math.max(0, customDelay + index * stagger));

      const tile = tileAt(cell);
      const img = tile?.querySelector("img");
      if (!tile || !img || tile.classList.contains("is-protected")) return;

      tile.classList.add("is-match-popping");
      const piece = board[cell.row]?.[cell.col];
      const isDetonatingAreaBomb = areaBombPos && cell.row === areaBombPos.row && cell.col === areaBombPos.col;
      if (isDetonatingAreaBomb) tile.classList.add("is-area-bomb-detonating");
      const { particles, ring, flash } = spawnMatchPopBurst(tile, piece, isDetonatingAreaBomb ? 30 : 16);

      const particleAnimations = particles.map((particle, particleIndex) => {
        const angle = Number(particle.dataset.angle || 0);
        const distance = Number(particle.dataset.distance || 20);
        const radians = angle * Math.PI / 180;
        const dx = Math.cos(radians) * distance;
        const dy = Math.sin(radians) * distance;
        const rotate = 70 + (particleIndex % 5) * 31;
        const particleFrames = isDetonatingAreaBomb
          ? [
              { transform: "translate(-50%,-50%) scale(.45) rotate(0deg)", opacity: .95, offset: 0 },
              { transform: "translate(-50%,-50%) scale(1.35) rotate(12deg)", opacity: 1, offset: .12 },
              { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.78) rotate(${rotate}deg)`, opacity: .95, offset: .62 },
              { transform: `translate(calc(-50% + ${dx * 1.18}px), calc(-50% + ${dy * 1.18}px)) scale(.12) rotate(${rotate + 45}deg)`, opacity: 0, offset: 1 }
            ]
          : [
              { transform: "translate(-50%,-50%) scale(.15) rotate(0deg)", opacity: 0, offset: 0 },
              { transform: "translate(-50%,-50%) scale(.15) rotate(0deg)", opacity: 0, offset: .30 },
              { transform: "translate(-50%,-50%) scale(1.25) rotate(12deg)", opacity: 1, offset: .42 },
              { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.72) rotate(${rotate}deg)`, opacity: .95, offset: .72 },
              { transform: `translate(calc(-50% + ${dx * 1.18}px), calc(-50% + ${dy * 1.18}px)) scale(.12) rotate(${rotate + 45}deg)`, opacity: 0, offset: 1 }
            ];

        return animationFinished(particle.animate(
          particleFrames,
          { duration: isDetonatingAreaBomb ? 210 : 190, easing: "cubic-bezier(.16,.78,.22,1)", fill: "forwards" }
        )).finally(() => particle.remove());
      });

      const ringAnimation = ring ? animationFinished(ring.animate(
        isDetonatingAreaBomb
          ? [
              { transform: "translate(-50%,-50%) scale(.48)", opacity: .95, offset: 0 },
              { transform: "translate(-50%,-50%) scale(.82)", opacity: 1, offset: .10 },
              { transform: "translate(-50%,-50%) scale(1.48)", opacity: 0, offset: 1 }
            ]
          : [
              { transform: "translate(-50%,-50%) scale(.28)", opacity: 0, offset: 0 },
              { transform: "translate(-50%,-50%) scale(.28)", opacity: 0, offset: .30 },
              { transform: "translate(-50%,-50%) scale(.55)", opacity: .95, offset: .42 },
              { transform: "translate(-50%,-50%) scale(1.42)", opacity: 0, offset: 1 }
            ],
        { duration: isDetonatingAreaBomb ? 190 : 176, easing: "cubic-bezier(.16,.72,.25,1)", fill: "forwards" }
      )).finally(() => ring.remove()) : Promise.resolve();

      const flashAnimation = flash ? animationFinished(flash.animate(
        isDetonatingAreaBomb
          ? [
              { transform: "translate(-50%,-50%) scale(.82)", opacity: 1, offset: 0 },
              { transform: "translate(-50%,-50%) scale(1.18)", opacity: .98, offset: .10 },
              { transform: "translate(-50%,-50%) scale(1.48)", opacity: 0, offset: 1 }
            ]
          : [
              { transform: "translate(-50%,-50%) scale(.25)", opacity: 0, offset: 0 },
              { transform: "translate(-50%,-50%) scale(.25)", opacity: 0, offset: .30 },
              { transform: "translate(-50%,-50%) scale(1.0)", opacity: .95, offset: .40 },
              { transform: "translate(-50%,-50%) scale(1.38)", opacity: 0, offset: .70 },
              { transform: "translate(-50%,-50%) scale(1.45)", opacity: 0, offset: 1 }
            ],
        { duration: isDetonatingAreaBomb ? 155 : 150, easing: "ease-out", fill: "forwards" }
      )).finally(() => flash.remove()) : Promise.resolve();

      const popFrames = isDetonatingAreaBomb
        ? [
            { transform: "scale(2.56)", opacity: 1, filter: "brightness(1.35) saturate(1.1)", offset: 0 },
            { transform: "scale(2.72)", opacity: 1, filter: "brightness(2.05) saturate(1.25)", offset: .10 },
            { transform: "scale(1.95)", opacity: .72, filter: "brightness(2.6) saturate(.9)", offset: .28 },
            { transform: "scale(.68)", opacity: .32, filter: "brightness(2.8) saturate(.66)", offset: .58 },
            { transform: "scale(.12)", opacity: 0, filter: "brightness(2.9) saturate(.5)", offset: 1 }
          ]
        : [
            { transform: "scale(1)", opacity: 1, filter: "brightness(1) saturate(1)", offset: 0 },
            { transform: "scale(1.10)", opacity: 1, filter: "brightness(1.08) saturate(1.06)", offset: .18 },
            { transform: "scale(1.27)", opacity: 1, filter: "brightness(1.22) saturate(1.12)", offset: .34 },
            { transform: "scale(1.43)", opacity: 1, filter: "brightness(1.72) saturate(1.2)", offset: .43 },
            { transform: "scale(.88)", opacity: .62, filter: "brightness(2.15) saturate(.8)", offset: .56 },
            { transform: "scale(.28)", opacity: 0, filter: "brightness(2.35) saturate(.5)", offset: .76 },
            { transform: "scale(.12)", opacity: 0, filter: "brightness(2.35) saturate(.5)", offset: 1 }
          ];

      const pop = animationFinished(img.animate(
        popFrames,
        { duration: isDetonatingAreaBomb ? 205 : popDuration, easing: "cubic-bezier(.16,.74,.2,1)", fill: "forwards" }
      ));

      await Promise.all([pop, ringAnimation, flashAnimation, ...particleAnimations]);
    })());

    await Promise.all(animations);
  }

  function renderBoard({ matched = [], dropMap = null, invalid = [], createdSpecial = [] } = {}) {
    if (!dom.board) return 0;
    const matchedSet = new Set(matched.map((p) => `${p.row}:${p.col}`));
    const invalidSet = new Set(invalid.map((p) => `${p.row}:${p.col}`));
    const createdSet = new Set(createdSpecial.map((p) => `${p.row}:${p.col}`));

    dom.board.classList.toggle("is-busy", busy);
    dom.board.style.setProperty("--match3-cols", String(COLS));
    dom.board.style.setProperty("--match3-rows", String(ROWS));
    dom.board.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const key = board[row]?.[col];
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "match3-tile";
        tile.dataset.row = String(row);
        tile.dataset.col = String(col);
        tile.setAttribute("role", "gridcell");
        const info = pieceInfo(key);
        const label = info.special === COLOR_BOMB
          ? "Farbbombe"
          : info.special === AREA_BOMB
            ? "Bombe"
            : `${info.color || "Unbekannter"} Ball`;
        tile.setAttribute("aria-label", key ? `${label}, Reihe ${row + 1}, Spalte ${col + 1}` : "Leeres Feld");
        tile.disabled = busy || finished || !key;

        if (selected?.row === row && selected?.col === col) tile.classList.add("is-selected");
        if (matchedSet.has(`${row}:${col}`)) tile.classList.add("is-matched");
        if (invalidSet.has(`${row}:${col}`)) tile.classList.add("is-invalid");
        if (createdSet.has(`${row}:${col}`)) tile.classList.add("is-created-special");
        if (isProtectedCell(row, col)) tile.classList.add("is-protected");

        if (key) {
          const img = document.createElement("img");
          img.src = imageFor(key);
          img.alt = "";
          img.draggable = false;
          tile.appendChild(img);
        }

        tile.addEventListener("pointerdown", (event) => {
          if (busy || finished) return;
          pointerStart = { row, col, x: event.clientX, y: event.clientY };
        });

        tile.addEventListener("pointerup", (event) => {
          if (!pointerStart || busy || finished) return;
          const dx = event.clientX - pointerStart.x;
          const dy = event.clientY - pointerStart.y;
          const start = { row: pointerStart.row, col: pointerStart.col };
          pointerStart = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;

          const to = { ...start };
          if (Math.abs(dx) > Math.abs(dy)) to.col += dx > 0 ? 1 : -1;
          else to.row += dy > 0 ? 1 : -1;

          if (to.row < 0 || to.row >= ROWS || to.col < 0 || to.col >= COLS) return;
          suppressClickUntil = Date.now() + 350;
          selected = null;
          attemptSwap(start, to);
        });

        tile.addEventListener("click", () => {
          if (Date.now() < suppressClickUntil || busy || finished) return;
          const current = { row, col };
          if (!selected) {
            selected = current;
            renderBoard();
            return;
          }
          if (selected.row === row && selected.col === col) {
            selected = null;
            renderBoard();
            return;
          }
          if (!adjacent(selected, current)) {
            selected = current;
            renderBoard();
            return;
          }
          const from = selected;
          selected = null;
          attemptSwap(from, current);
        });

        dom.board.appendChild(tile);
      }
    }

    return startDropAnimations(dropMap);
  }

  async function shuffleIfNeeded() {
    if (findMatches(board).length || hasPossibleMove(board)) return;
    setStatus("Keine Züge mehr – Bälle werden neu gemischt …");
    await wait(350);

    const values = board.flat();
    for (let attempt = 0; attempt < 1200; attempt++) {
      const shuffled = values.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const candidate = Array.from({ length: ROWS }, (_, row) =>
        shuffled.slice(row * COLS, row * COLS + COLS)
      );
      if (!findMatches(candidate).length && hasPossibleMove(candidate)) {
        board = candidate;
        renderBoard();
        await wait(220);
        renderBoard();
        return;
      }
    }
    board = createPlayableBoard();
    renderBoard();
    await wait(220);
    renderBoard();
  }

  function collapseAndRefill() {
    const dropMap = new Map();

    function collapseSegment(col, startRow, endRow) {
      if (startRow > endRow) return;
      const remaining = [];
      for (let row = endRow; row >= startRow; row--) {
        if (board[row][col]) remaining.push({ key: board[row][col], fromRow: row });
      }

      let spawnIndex = 0;
      for (let row = endRow, index = 0; row >= startRow; row--, index++) {
        if (index < remaining.length) {
          const item = remaining[index];
          board[row][col] = item.key;
          dropMap.set(`${row}:${col}`, { fromRow: item.fromRow, spawned: false });
        } else {
          board[row][col] = randomBall();
          dropMap.set(`${row}:${col}`, { fromRow: startRow - 1 - spawnIndex, spawned: true });
          spawnIndex++;
        }
      }
    }

    for (let col = 0; col < COLS; col++) {
      let segmentStart = 0;
      for (let row = 0; row <= ROWS; row++) {
        const boundary = row === ROWS || isProtectedCell(row, col);
        if (!boundary) continue;
        collapseSegment(col, segmentStart, row - 1);
        // Geschützte Zelle bleibt exakt an ihrer Position stehen.
        segmentStart = row + 1;
      }
    }

    return dropMap;
  }

  function addScoreAndCollect(removal, cascade = 1) {
    const multiplier = Math.min(cascade, 4);
    score += removal.length * POINTS_PER_BALL * multiplier;
    if (currentLevel.type === "collect") {
      for (const { row, col } of removal) {
        if (baseColor(board[row]?.[col]) === currentLevel.collectKey) collectedBlue++;
      }
    }
  }

  async function removeAndDrop(removal, cascade = 1, createdSpecial = [], popOptions = {}) {
    if (!removal.length) return new Map();
    if (!popOptions.skipInitialRender) renderBoard({ createdSpecial });
    if (createdSpecial.length) await wait(145);
    await animateNormalMatchPops(removal, popOptions);
    addScoreAndCollect(removal, cascade);
    updateHud(cascade);

    for (const { row, col } of removal) {
      if (!isProtectedCell(row, col)) board[row][col] = null;
    }
    renderBoard({ matched: removal });
    await wait(120);

    const dropMap = collapseAndRefill();
    const dropDuration = renderBoard({ dropMap });
    await wait(Math.max(300, dropDuration + 25));
    return dropMap;
  }

  async function resolveBoard(initialMatches, swapContext = null, initialDropMap = null) {
    let matches = initialMatches;
    let cascade = 1;
    let firstCycle = true;
    let lastDropMap = initialDropMap;

    while (matches.length) {
      const groups = findMatchGroups(board);
      const creations = planSpecialCreations(
        groups,
        firstCycle ? swapContext : null,
        lastDropMap
      );
      const creationSet = new Set(creations.map(cellId));

      // Spezialball-Zelle wird vor dem Entfernen ersetzt und ausdrücklich geschützt.
      for (const creation of creations) {
        board[creation.row][creation.col] = makeSpecial(creation.type);
      }

      const removalMap = new Map();
      for (const cell of matches) {
        const id = cellId(cell);
        if (!creationSet.has(id) && !isProtectedCell(cell.row, cell.col)) removalMap.set(id, cell);
      }
      const removal = [...removalMap.values()];

      updateHud(cascade);
      if (creations.some((creation) => creation.type === COLOR_BOMB)) {
        setStatus(creations.some((creation) => creation.cascadeCreated)
          ? "Kaskaden-5er – Farbbombe entstanden!"
          : "5er-Kombi – Farbbombe erstellt!");
      } else if (creations.some((creation) => creation.type === AREA_BOMB)) {
        setStatus(creations.some((creation) => creation.cascadeCreated)
          ? "Kaskaden-T/L – Bombe entstanden!"
          : "T/L-Kombi – Bombe erstellt!");
      } else {
        setStatus(cascade > 1 ? `Kaskade ×${cascade}!` : `${removal.length} Bälle getroffen.`);
      }

      lastDropMap = await removeAndDrop(removal, cascade, creations);
      matches = findMatches(board);
      cascade++;
      firstCycle = false;
    }

    await shuffleIfNeeded();
    updateHud(1);

    const levelCompleted = currentLevel.type === "collect"
      ? collectedBlue >= Number(currentLevel.collectTarget || 0)
      : score >= TARGET_SCORE;

    if (levelCompleted) {
      finished = true;
      setStatus("Ziel erreicht!");
      if (dom.victoryTitle) {
        dom.victoryTitle.textContent = currentLevel.type === "collect"
          ? "20 blaue Bälle gesammelt!"
          : `${TARGET_SCORE.toLocaleString("de-DE")} Punkte erreicht!`;
      }
      if (dom.victoryText) {
        dom.victoryText.textContent = currentLevel.type === "collect"
          ? `Level 2 geschafft. Deine Punkte: ${score.toLocaleString("de-DE")}.`
          : "Die Nachrück- und Kaskadenmechanik wurde erfolgreich durchgespielt.";
      }
      dom.victory?.classList.remove("hidden");
      renderBoard();
      // Match Arena ist weiterhin reiner Testbetrieb: bewusst KEIN Speichern.
    } else {
      setStatus("Tausche zwei benachbarte Bälle.");
    }
  }

  function specialSwapPlan(from, to, fromPiece, toPiece) {
    if (isColorBomb(fromPiece) && baseColor(toPiece)) {
      return { type: COLOR_BOMB, specialPos: to, partnerPos: from, color: baseColor(toPiece) };
    }
    if (isColorBomb(toPiece) && baseColor(fromPiece)) {
      return { type: COLOR_BOMB, specialPos: from, partnerPos: to, color: baseColor(fromPiece) };
    }
    if (isAreaBomb(fromPiece) && toPiece) {
      return { type: AREA_BOMB, specialPos: to, partnerPos: from };
    }
    if (isAreaBomb(toPiece) && fromPiece) {
      return { type: AREA_BOMB, specialPos: from, partnerPos: to };
    }
    return null;
  }

  function specialSwapRemoval(plan) {
    const removalMap = new Map();
    if (!plan) return [];

    if (plan.type === COLOR_BOMB) {
      removalMap.set(cellId(plan.specialPos), { ...plan.specialPos });
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (baseColor(board[row]?.[col]) === plan.color && !isProtectedCell(row, col)) {
            removalMap.set(`${row}:${col}`, { row, col });
          }
        }
      }
    } else if (plan.type === AREA_BOMB) {
      for (let row = plan.specialPos.row - 1; row <= plan.specialPos.row + 1; row++) {
        for (let col = plan.specialPos.col - 1; col <= plan.specialPos.col + 1; col++) {
          if (row < 0 || row >= ROWS || col < 0 || col >= COLS || isProtectedCell(row, col)) continue;
          if (board[row]?.[col]) removalMap.set(`${row}:${col}`, { row, col });
        }
      }
      // Tauschpartner zusätzlich explizit absichern – auch wenn er bereits im 3x3 liegt.
      if (!isProtectedCell(plan.partnerPos.row, plan.partnerPos.col) && board[plan.partnerPos.row]?.[plan.partnerPos.col]) {
        removalMap.set(cellId(plan.partnerPos), { ...plan.partnerPos });
      }
    }
    return [...removalMap.values()];
  }

  async function animateAreaBombCharge(position) {
    const tile = tileAt(position);
    const img = tile?.querySelector("img");
    if (!tile || !img) return;

    tile.classList.add("is-area-bomb-charging");
    const charge = img.animate(
      [
        { transform: "scale(1)", filter: "brightness(1) saturate(1)", offset: 0 },
        { transform: "scale(1.28)", filter: "brightness(1.14) saturate(1.06)", offset: .22 },
        { transform: "scale(1.92)", filter: "brightness(1.22) saturate(1.1)", offset: .58 },
        { transform: "scale(2.68)", filter: "brightness(1.38) saturate(1.16)", offset: .90 },
        { transform: "scale(2.56)", filter: "brightness(1.42) saturate(1.14)", offset: 1 }
      ],
      { duration: 360, easing: "cubic-bezier(.18,.76,.18,1)", fill: "forwards" }
    );
    await animationFinished(charge);
  }

  async function resolveSpecialSwap(plan) {
    const removal = specialSwapRemoval(plan);
    setStatus(plan.type === COLOR_BOMB ? "Farbbombe!" : "Bombe!");

    if (plan.type === AREA_BOMB) {
      await animateAreaBombCharge(plan.specialPos);
    }

    const dropMap = await removeAndDrop(
      removal,
      1,
      [],
      plan.type === AREA_BOMB ? { stagger: 0, areaBombPos: plan.specialPos, skipInitialRender: true } : {}
    );
    const matches = findMatches(board);
    if (matches.length) await resolveBoard(matches, null, dropMap);
    else {
      await shuffleIfNeeded();
      updateHud(1);
      const levelCompleted = currentLevel.type === "collect"
        ? collectedBlue >= Number(currentLevel.collectTarget || 0)
        : score >= TARGET_SCORE;
      if (levelCompleted) {
        finished = true;
        setStatus("Ziel erreicht!");
        if (dom.victoryTitle) {
          dom.victoryTitle.textContent = currentLevel.type === "collect"
            ? "20 blaue Bälle gesammelt!"
            : `${TARGET_SCORE.toLocaleString("de-DE")} Punkte erreicht!`;
        }
        if (dom.victoryText) {
          dom.victoryText.textContent = currentLevel.type === "collect"
            ? `Level 2 geschafft. Deine Punkte: ${score.toLocaleString("de-DE")}.`
            : "Die Nachrück- und Kaskadenmechanik wurde erfolgreich durchgespielt.";
        }
        dom.victory?.classList.remove("hidden");
      } else {
        setStatus("Tausche zwei benachbarte Bälle.");
      }
    }
  }

  async function attemptSwap(from, to) {
    if (busy || finished || !adjacent(from, to)) return;
    busy = true;
    selected = null;
    renderBoard();
    setStatus("Zug wird geprüft …");

    const fromPiece = board[from.row]?.[from.col];
    const toPiece = board[to.row]?.[to.col];

    // Erst die beiden sichtbaren Bälle wirklich in das Nachbarfeld gleiten lassen.
    await animateSwapVisual(from, to, 190);
    swapIn(board, from, to);
    renderBoard();

    const specialPlan = specialSwapPlan(from, to, fromPiece, toPiece);
    if (specialPlan) {
      await resolveSpecialSwap(specialPlan);
      busy = false;
      renderBoard();
      return;
    }

    const matches = findMatches(board);
    if (!matches.length) {
      setStatus("Kein Match – Zug zurückgesetzt.");
      // Ungültiger Zug: die vertauschten Bälle gleiten direkt wieder zurück.
      await wait(45);
      await animateSwapVisual(from, to, 155);
      swapIn(board, from, to);
      renderBoard({ invalid: [from, to] });
      await wait(120);
      busy = false;
      renderBoard();
      setStatus("Tausche zwei benachbarte Bälle.");
      return;
    }

    await resolveBoard(matches, { from, to });
    busy = false;
    renderBoard();
  }

  function startLevel(config) {
    if (!hasAccess()) {
      showScreen("home");
      return;
    }
    applyLevelLayout(config);
    board = createPlayableBoard();
    score = 0;
    collectedBlue = 0;
    busy = false;
    finished = false;
    selected = null;
    dom.victory?.classList.add("hidden");
    if (dom.playTitle) dom.playTitle.textContent = `Level ${currentLevel.id}`;
    if (dom.board) dom.board.setAttribute("aria-label", `Match Arena Spielfeld ${ROWS} mal ${COLS}`);
    updateHud(1);
    setStatus("Tausche zwei benachbarte Bälle.");
    renderBoard();
    showScreen("match3Play");
  }

  function startLevel1() { startLevel(LEVEL_1); }
  function startLevel2() { startLevel(LEVEL_2); }

  function bindEvents() {
    dom.homeButton?.addEventListener("click", () => {
      if (!hasAccess()) return;
      showScreen("match3Map");
    });
    dom.mapBack?.addEventListener("click", () => showScreen("home"));
    dom.level1?.addEventListener("click", startLevel1);
    dom.level2?.addEventListener("click", startLevel2);
    dom.playBack?.addEventListener("click", () => showScreen("match3Map"));
  }

  function init(options = {}) {
    if (initialized) return;
    if (typeof options.getProgress === "function") getProgress = options.getProgress;
    if (typeof options.saveProgress === "function") saveProgress = options.saveProgress;
    if (typeof options.showScreen === "function") showScreen = options.showScreen;
    cacheDom();
    bindEvents();
    refreshAccess();
    initialized = true;
  }

  return { init, refreshAccess, startLevel1, startLevel2 };
})();
