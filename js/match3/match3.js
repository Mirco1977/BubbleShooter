const MAX_COLS = 9;
const LEVEL_1 = Object.freeze({ id: 1, rows: 4, cols: 4, type: "score", targetScore: 1500 });
const LEVEL_2 = Object.freeze({ id: 2, rows: 6, cols: 6, type: "collect", collectKey: "blue", collectTarget: 20 });
const LEVEL_3 = Object.freeze({
  id: 3,
  rows: 7,
  cols: 7,
  type: "deliver-crests",
  crestTarget: 3,
  stoneColumns: [1, 3, 5]
});
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
const STONE = "stone";
const GOAL_CREST_PREFIX = "goal-crest@";
const STONE_IMAGE = "assets/ui/stone.png";
const GOAL_CREST_IMAGE = "assets/ui/stuttgarter-kickers.png";
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
  let deliveredCrests = 0;
  const releasedCrestColumns = new Set();
  const deliveredCrestColumns = new Set();
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
    dom.level3 = document.getElementById("match3Level3Button");
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

  function isStone(piece) {
    return piece === STONE;
  }

  function isGoalCrest(piece) {
    return typeof piece === "string" && piece.startsWith(GOAL_CREST_PREFIX);
  }

  function crestOriginColumn(piece) {
    return isGoalCrest(piece) ? Number(piece.slice(GOAL_CREST_PREFIX.length)) : -1;
  }

  function makeGoalCrest(col) {
    return `${GOAL_CREST_PREFIX}${col}`;
  }

  function isMovablePiece(piece) {
    return Boolean(piece) && !isStone(piece);
  }

  function pieceInfo(piece) {
    if (!piece) return { color: null, special: null };
    if (isStone(piece)) return { color: null, special: STONE };
    if (isGoalCrest(piece)) return { color: null, special: "goal-crest" };
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
    if (special === STONE) return STONE_IMAGE;
    if (special === "goal-crest") return GOAL_CREST_IMAGE;
    return normalImageFor(color);
  }

  function isProtectedCell(row, col) {
    return protectedCells.has(`${row}:${col}`) || isStone(board[row]?.[col]);
  }

  // Wappen dürfen fallen, aber niemals durch Matches/Bomben entfernt werden.
  function isRemovalProtectedCell(row, col) {
    return isProtectedCell(row, col) || isGoalCrest(board[row]?.[col]);
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
          if (!isMovablePiece(fromPiece) || !isMovablePiece(toPiece)) continue;
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

  function applyLevel3StartLayout(candidate) {
    if (currentLevel.type !== "deliver-crests") return candidate;
    for (const col of currentLevel.stoneColumns || []) {
      if (candidate[0]?.[col] !== undefined) candidate[0][col] = STONE;
    }
    return candidate;
  }

  function createPlayableBoard() {
    for (let attempt = 0; attempt < 2500; attempt++) {
      const candidate = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => randomBall())
      );
      if (!findMatches(candidate).length && hasPossibleMove(candidate)) return applyLevel3StartLayout(candidate);
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
    return applyLevel3StartLayout(candidate);
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
    } else if (currentLevel.type === "deliver-crests") {
      const target = Number(currentLevel.crestTarget || 3);
      if (dom.target) {
        dom.target.className = "match3-crest-target";
        dom.target.innerHTML = `<img src="${GOAL_CREST_IMAGE}" alt="Wappen"><span>${deliveredCrests}/${target}</span>`;
      }
      if (dom.goalHud) dom.goalHud.textContent = `Wappen ${deliveredCrests}/${target}`;
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
      const distance = count > 30
        ? (isSpark ? 46 + (i % 4) * 8 : 34 + (i % 6) * 7)
        : (isSpark ? 24 + (i % 3) * 5 : 18 + (i % 5) * 4);
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

  function spawnAreaBombImageShards(tile, img) {
    if (!dom.board || !tile || !img) return [];
    const tileBox = tile.getBoundingClientRect();
    const boardBox = dom.board.getBoundingClientRect();
    const left = tileBox.left - boardBox.left;
    const top = tileBox.top - boardBox.top;
    const size = Math.max(tileBox.width, tileBox.height);
    const src = img.currentSrc || img.src;
    const clips = [
      "polygon(0 0,50% 0,42% 42%,0 48%)", "polygon(50% 0,100% 0,100% 42%,58% 42%)",
      "polygon(0 48%,42% 42%,46% 72%,0 100%)", "polygon(58% 42%,100% 42%,100% 78%,62% 70%)",
      "polygon(0 100%,46% 72%,50% 100%)", "polygon(50% 100%,62% 70%,100% 78%,100% 100%)",
      "polygon(42% 42%,58% 42%,62% 70%,46% 72%)", "polygon(18% 18%,42% 8%,42% 42%,8% 42%)",
      "polygon(58% 8%,84% 18%,92% 42%,58% 42%)", "polygon(10% 54%,42% 48%,42% 76%,20% 88%)",
      "polygon(58% 48%,92% 52%,82% 88%,58% 76%)", "polygon(38% 18%,62% 18%,58% 48%,42% 48%)"
    ];
    return clips.map((clip, i) => {
      const shard = document.createElement("img");
      shard.src = src;
      shard.alt = "";
      Object.assign(shard.style, {
        position: "absolute", left: `${left}px`, top: `${top}px`, width: `${tileBox.width}px`, height: `${tileBox.height}px`,
        objectFit: "contain", pointerEvents: "none", zIndex: "40", transformOrigin: "50% 50%", clipPath: clip
      });
      dom.board.appendChild(shard);
      const angle = ((360 / clips.length) * i - 12) * Math.PI / 180;
      const distance = size * (0.72 + (i % 4) * 0.16);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const rot = (i % 2 ? 1 : -1) * (65 + (i % 5) * 24);
      const anim = shard.animate([
        { transform: "translate(0,0) scale(2.56) rotate(0deg)", opacity: 1, filter: "brightness(1.7)", offset: 0 },
        { transform: `translate(${dx*.25}px,${dy*.25}px) scale(2.05) rotate(${rot*.25}deg)`, opacity: 1, filter: "brightness(2.15)", offset: .18 },
        { transform: `translate(${dx}px,${dy}px) scale(.72) rotate(${rot}deg)`, opacity: .72, filter: "brightness(1.35)", offset: .68 },
        { transform: `translate(${dx*1.28}px,${dy*1.28}px) scale(.18) rotate(${rot*1.35}deg)`, opacity: 0, filter: "brightness(1.1)", offset: 1 }
      ], { duration: 280, easing: "cubic-bezier(.12,.72,.18,1)", fill: "forwards" });
      return animationFinished(anim).finally(() => shard.remove());
    });
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
      const { particles, ring, flash } = spawnMatchPopBurst(tile, piece, isDetonatingAreaBomb ? 38 : 16);
      const bombShardAnimations = []; // Bomben-PNG zersplittert bereits direkt in animateAreaBombCharge().

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
            { transform: "scale(2.56)", opacity: 0, filter: "brightness(1.4)", offset: 0 },
            { transform: "scale(2.56)", opacity: 0, filter: "brightness(1.4)", offset: 1 }
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

      await Promise.all([pop, ringAnimation, flashAnimation, ...particleAnimations, ...bombShardAnimations]);
    })());

    await Promise.all(animations);
  }

  function renderLevel3Decor() {
    if (!dom.board || currentLevel.type !== "deliver-crests") return;
    for (const col of currentLevel.stoneColumns || []) {
      const holder = document.createElement("div");
      holder.className = "match3-crest-holder";
      holder.style.setProperty("--slot-col", String(col));
      const stoneStillThere = isStone(board[0]?.[col]);
      const released = releasedCrestColumns.has(col);
      const delivered = deliveredCrestColumns.has(col);
      holder.classList.toggle("is-locked", stoneStillThere);
      holder.classList.toggle("is-released", released && !delivered);
      holder.classList.toggle("is-delivered", delivered);
      if (stoneStillThere) {
        const img = document.createElement("img");
        img.src = GOAL_CREST_IMAGE;
        img.alt = "";
        holder.appendChild(img);
        const lock = document.createElement("span");
        lock.className = "match3-crest-holder-lock";
        lock.textContent = "▼";
        holder.appendChild(lock);
      } else if (delivered) {
        holder.innerHTML = '<span class="match3-holder-check">✓</span>';
      }
      dom.board.appendChild(holder);
    }

    const finish = document.createElement("div");
    finish.className = "match3-finish-line";
    finish.setAttribute("aria-hidden", "true");

    // Ziellinie in den drei Wappen-Spalten exakt um eine Zellbreite öffnen.
    // stoneColumns sind 0-basiert: [1,3,5] = sichtbare Spalten 2,4,6.
    const openCols = [...(currentLevel.stoneColumns || [])].sort((a, b) => a - b);
    let segmentStart = 0;
    for (const openCol of openCols) {
      if (openCol > segmentStart) {
        const segment = document.createElement("span");
        segment.className = "match3-finish-segment";
        segment.style.left = `calc(${segmentStart} * (var(--match3-cell) + var(--match3-gap)))`;
        segment.style.width = `calc(${openCol - segmentStart} * var(--match3-cell) + ${openCol - segmentStart} * var(--match3-gap))`;
        finish.appendChild(segment);
      }
      segmentStart = openCol + 1;
    }
    if (segmentStart < COLS) {
      const segment = document.createElement("span");
      segment.className = "match3-finish-segment";
      segment.style.left = `calc(${segmentStart} * (var(--match3-cell) + var(--match3-gap)))`;
      segment.style.width = `calc(${COLS - segmentStart} * var(--match3-cell) + ${Math.max(0, COLS - segmentStart - 1)} * var(--match3-gap))`;
      finish.appendChild(segment);
    }
    dom.board.appendChild(finish);

    for (const col of currentLevel.stoneColumns || []) {
      const catcher = document.createElement("div");
      catcher.className = "match3-crest-catcher";
      catcher.style.setProperty("--slot-col", String(col));
      catcher.classList.toggle("is-filled", deliveredCrestColumns.has(col));
      if (deliveredCrestColumns.has(col)) {
        const img = document.createElement("img");
        img.src = GOAL_CREST_IMAGE;
        img.alt = "";
        catcher.appendChild(img);
      }
      dom.board.appendChild(catcher);
    }

    const counter = document.createElement("div");
    counter.className = "match3-delivery-counter";
    counter.textContent = `${deliveredCrests}/${Number(currentLevel.crestTarget || 3)} Wappen im Ziel`;
    dom.board.appendChild(counter);
  }

  function renderBoard({ matched = [], dropMap = null, invalid = [], createdSpecial = [] } = {}) {
    if (!dom.board) return 0;
    const matchedSet = new Set(matched.map((p) => `${p.row}:${p.col}`));
    const invalidSet = new Set(invalid.map((p) => `${p.row}:${p.col}`));
    const createdSet = new Set(createdSpecial.map((p) => `${p.row}:${p.col}`));

    dom.board.classList.toggle("is-busy", busy);
    dom.board.classList.toggle("is-level-3", currentLevel.type === "deliver-crests");
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
            : info.special === STONE
              ? "Stein"
              : info.special === "goal-crest"
                ? "Stuttgarter Kickers Wappen"
                : `${info.color || "Unbekannter"} Ball`;
        tile.setAttribute("aria-label", key ? `${label}, Reihe ${row + 1}, Spalte ${col + 1}` : "Leeres Feld");
        tile.disabled = busy || finished || !key || isStone(key);

        if (selected?.row === row && selected?.col === col) tile.classList.add("is-selected");
        if (matchedSet.has(`${row}:${col}`)) tile.classList.add("is-matched");
        if (invalidSet.has(`${row}:${col}`)) tile.classList.add("is-invalid");
        if (createdSet.has(`${row}:${col}`)) tile.classList.add("is-created-special");
        if (isProtectedCell(row, col)) tile.classList.add("is-protected");
        if (isStone(key)) tile.classList.add("is-stone");
        if (isGoalCrest(key)) tile.classList.add("is-goal-crest");

        if (key) {
          const img = document.createElement("img");
          img.src = imageFor(key);
          img.alt = "";
          img.draggable = false;
          tile.appendChild(img);
        }

        tile.addEventListener("pointerdown", (event) => {
          if (busy || finished || !isMovablePiece(board[row]?.[col])) return;
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
          if (Date.now() < suppressClickUntil || busy || finished || !isMovablePiece(board[row]?.[col])) return;
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

    renderLevel3Decor();
    return startDropAnimations(dropMap);
  }

  async function shuffleIfNeeded() {
    if (findMatches(board).length || hasPossibleMove(board)) return;
    setStatus("Keine Züge mehr – Bälle werden neu gemischt …");
    await wait(350);

    const movablePositions = [];
    const values = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!isMovablePiece(board[row]?.[col])) continue;
        movablePositions.push({ row, col });
        values.push(board[row][col]);
      }
    }
    for (let attempt = 0; attempt < 1200; attempt++) {
      const shuffled = values.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const candidate = cloneBoard(board);
      movablePositions.forEach((pos, index) => {
        candidate[pos.row][pos.col] = shuffled[index];
      });
      if (!findMatches(candidate).length && hasPossibleMove(candidate)) {
        board = candidate;
        renderBoard();
        await wait(220);
        renderBoard();
        return;
      }
    }
    if (currentLevel.type === "deliver-crests") {
      for (const pos of movablePositions) board[pos.row][pos.col] = randomBall();
    } else {
      board = createPlayableBoard();
    }
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

  function breakableStonesFromRemoval(removal) {
    if (currentLevel.type !== "deliver-crests" || !removal?.length) return [];
    const removed = new Set(removal.map(cellId));
    const stones = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!isStone(board[row]?.[col])) continue;
        const neighbors = [
          { row, col: col - 1 },
          { row, col: col + 1 },
          { row: row + 1, col }
        ].filter((p) => p.row >= 0 && p.row < ROWS && p.col >= 0 && p.col < COLS);
        if (neighbors.some((p) => removed.has(cellId(p)))) stones.push({ row, col });
      }
    }
    return stones;
  }

  async function animateStoneBreaks(stones) {
    if (!stones.length || !dom.board) return;
    const animations = stones.map(async (pos) => {
      const tile = tileAt(pos);
      const img = tile?.querySelector("img");
      if (!tile || !img) return;

      tile.classList.add("is-stone-breaking");
      const box = tile.getBoundingClientRect();
      const boardBox = dom.board.getBoundingClientRect();
      const left = box.left - boardBox.left;
      const top = box.top - boardBox.top;
      const src = img.currentSrc || img.src;

      const pieces = [
        { clip: "polygon(0 0,58% 0,48% 54%,0 72%)", dx: -34, dy: -18, rot: -32 },
        { clip: "polygon(58% 0,100% 0,100% 72%,48% 54%)", dx: 35, dy: -13, rot: 38 },
        { clip: "polygon(0 72%,48% 54%,100% 72%,100% 100%,0 100%)", dx: 4, dy: 38, rot: 22 }
      ];

      const fragmentAnimations = pieces.map((part, i) => {
        const fragment = document.createElement("img");
        fragment.src = src;
        fragment.alt = "";
        fragment.className = "match3-stone-fragment";
        Object.assign(fragment.style, {
          left: `${left}px`, top: `${top}px`,
          width: `${box.width}px`, height: `${box.height}px`,
          clipPath: part.clip, WebkitClipPath: part.clip
        });
        dom.board.appendChild(fragment);
        return animationFinished(fragment.animate([
          { transform: "translate3d(0,0,0) scale(1) rotate(0deg)", opacity: 1, filter: "brightness(1)", offset: 0 },
          { transform: `translate3d(${part.dx*.18}px,${part.dy*.12}px,0) scale(1.04) rotate(${part.rot*.15}deg)`, opacity: 1, filter: "brightness(1.45)", offset: .18 },
          { transform: `translate3d(${part.dx}px,${part.dy}px,0) scale(.92) rotate(${part.rot}deg)`, opacity: .96, filter: "brightness(1.08)", offset: .68 },
          { transform: `translate3d(${part.dx*1.38}px,${part.dy*1.5+12}px,0) scale(.68) rotate(${part.rot*1.65}deg)`, opacity: 0, offset: 1 }
        ], { duration: 552+i*40.25, easing: "cubic-bezier(.16,.72,.2,1)", fill: "forwards" }))
          .finally(() => fragment.remove());
      });

      const crack = animationFinished(img.animate([
        { transform: "scale(1)", filter: "brightness(1)", opacity: 1, offset: 0 },
        { transform: "scale(1.07) rotate(-1deg)", filter: "brightness(1.35)", opacity: 1, offset: .18 },
        { transform: "scale(1.12) rotate(1deg)", filter: "brightness(1.8)", opacity: .72, offset: .28 },
        { transform: "scale(1.12)", filter: "brightness(2)", opacity: 0, offset: .34 },
        { transform: "scale(1.12)", opacity: 0, offset: 1 }
      ], { duration: 575, easing: "ease-out", fill: "forwards" }));

      await Promise.all([crack, ...fragmentAnimations]);
    });
    await Promise.all(animations);
  }

  function releaseCrestsForBrokenStones(stones) {
    for (const stone of stones) {
      board[stone.row][stone.col] = makeGoalCrest(stone.col);
      releasedCrestColumns.add(stone.col);
    }
  }

  async function collectBottomCrests() {
    if (currentLevel.type !== "deliver-crests" || !dom.board) return false;
    const bottom = ROWS - 1;
    const arrivals = [];
    for (let col = 0; col < COLS; col++) {
      if (isGoalCrest(board[bottom]?.[col])) arrivals.push({ row: bottom, col, piece: board[bottom][col] });
    }
    if (!arrivals.length) return false;

    await Promise.all(arrivals.map(async (pos) => {
      const tile = tileAt(pos);
      const img = tile?.querySelector("img");
      if (!img) return;
      tile.classList.add("is-crest-delivering");
      const anim = img.animate([
        { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
        { transform: "translate3d(0,12px,0) scale(1.06)", opacity: 1, offset: .35 },
        { transform: "translate3d(0,52px,0) scale(.72)", opacity: .95, offset: .82 },
        { transform: "translate3d(0,58px,0) scale(.58)", opacity: 0 }
      ], { duration: 430, easing: "cubic-bezier(.2,.72,.2,1)", fill: "forwards" });
      await animationFinished(anim);
    }));

    for (const pos of arrivals) {
      const originCol = crestOriginColumn(pos.piece);
      board[pos.row][pos.col] = null;
      if (originCol >= 0 && !deliveredCrestColumns.has(originCol)) {
        deliveredCrestColumns.add(originCol);
        deliveredCrests++;
      }
    }
    updateHud(1);
    renderBoard();
    await wait(110);
    return true;
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
    const stonesToBreak = breakableStonesFromRemoval(removal);
    await animateNormalMatchPops(removal, popOptions);
    if (stonesToBreak.length) await animateStoneBreaks(stonesToBreak);
    addScoreAndCollect(removal, cascade);
    updateHud(cascade);

    for (const { row, col } of removal) {
      if (!isRemovalProtectedCell(row, col)) board[row][col] = null;
    }
    if (stonesToBreak.length) {
      releaseCrestsForBrokenStones(stonesToBreak);
      setStatus(stonesToBreak.length > 1 ? `${stonesToBreak.length} Steine gesprengt – Wappen frei!` : "Stein gesprengt – Wappen frei!");
    }
    renderBoard({ matched: removal });
    await wait(120);

    let dropMap = collapseAndRefill();
    let dropDuration = renderBoard({ dropMap });
    await wait(Math.max(300, dropDuration + 25));

    if (await collectBottomCrests()) {
      dropMap = collapseAndRefill();
      dropDuration = renderBoard({ dropMap });
      await wait(Math.max(300, dropDuration + 25));
    }
    return dropMap;
  }

  function levelCompletedNow() {
    if (currentLevel.type === "collect") return collectedBlue >= Number(currentLevel.collectTarget || 0);
    if (currentLevel.type === "deliver-crests") return deliveredCrests >= Number(currentLevel.crestTarget || 3);
    return score >= TARGET_SCORE;
  }

  function showLevelVictory() {
    finished = true;
    setStatus("Ziel erreicht!");
    if (dom.victoryTitle) {
      dom.victoryTitle.textContent = currentLevel.type === "collect"
        ? "20 blaue Bälle gesammelt!"
        : currentLevel.type === "deliver-crests"
          ? "Alle 3 Wappen im Ziel!"
          : `${TARGET_SCORE.toLocaleString("de-DE")} Punkte erreicht!`;
    }
    if (dom.victoryText) {
      dom.victoryText.textContent = currentLevel.type === "collect"
        ? `Level 2 geschafft. Deine Punkte: ${score.toLocaleString("de-DE")}.`
        : currentLevel.type === "deliver-crests"
          ? `Level 3 geschafft. Alle drei Stuttgarter-Kickers-Wappen wurden sicher über die Ziellinie gebracht.`
          : "Die Nachrück- und Kaskadenmechanik wurde erfolgreich durchgespielt.";
    }
    dom.victory?.classList.remove("hidden");
    renderBoard();
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
        if (!creationSet.has(id) && !isRemovalProtectedCell(cell.row, cell.col)) removalMap.set(id, cell);
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

    if (levelCompletedNow()) {
      showLevelVictory();
      // Match Arena ist weiterhin reiner Testbetrieb: bewusst KEIN Speichern.
    } else {
      setStatus(currentLevel.type === "deliver-crests"
        ? "Sprenge die Steine und bringe alle 3 Wappen übers Ziel."
        : "Tausche zwei benachbarte Bälle.");
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
          if (baseColor(board[row]?.[col]) === plan.color && !isRemovalProtectedCell(row, col)) {
            removalMap.set(`${row}:${col}`, { row, col });
          }
        }
      }
    } else if (plan.type === AREA_BOMB) {
      for (let row = plan.specialPos.row - 1; row <= plan.specialPos.row + 1; row++) {
        for (let col = plan.specialPos.col - 1; col <= plan.specialPos.col + 1; col++) {
          if (row < 0 || row >= ROWS || col < 0 || col >= COLS || isRemovalProtectedCell(row, col)) continue;
          if (board[row]?.[col]) removalMap.set(`${row}:${col}`, { row, col });
        }
      }
      // Tauschpartner zusätzlich explizit absichern – auch wenn er bereits im 3x3 liegt.
      if (!isRemovalProtectedCell(plan.partnerPos.row, plan.partnerPos.col) && board[plan.partnerPos.row]?.[plan.partnerPos.col]) {
        removalMap.set(cellId(plan.partnerPos), { ...plan.partnerPos });
      }
    }
    return [...removalMap.values()];
  }

  async function animateAreaBombCharge(position) {
    const tile = tileAt(position);
    const img = tile?.querySelector("img");
    if (!tile || !img || !dom.board) return;

    tile.classList.add("is-area-bomb-charging");

    const tileBox = tile.getBoundingClientRect();
    const boardBox = dom.board.getBoundingClientRect();
    const left = tileBox.left - boardBox.left;
    const top = tileBox.top - boardBox.top;
    const centerX = left + tileBox.width / 2;
    const centerY = top + tileBox.height / 2;
    const src = img.currentSrc || img.src;

    // Eine durchgehende Animation: Aufblähen -> instabil werden -> Aufreißen -> Knall.
    // Wichtig: Splitter starten bereits, während die Originalbombe noch sichtbar ist.
    const charge = img.animate([
      { transform: "scale(1) rotate(0deg)", opacity: 1, filter: "brightness(1) saturate(1)", offset: 0 },
      { transform: "scale(1.22) rotate(-.35deg)", opacity: 1, filter: "brightness(1.08) saturate(1.04)", offset: .22 },
      { transform: "scale(1.68) rotate(.65deg)", opacity: 1, filter: "brightness(1.16) saturate(1.08)", offset: .48 },
      { transform: "scale(2.12) rotate(-1.25deg)", opacity: 1, filter: "brightness(1.3) saturate(1.13)", offset: .67 },
      { transform: "scale(2.42) rotate(1.5deg)", opacity: 1, filter: "brightness(1.62) saturate(1.16)", offset: .78 },
      { transform: "scale(2.55) rotate(-1deg)", opacity: .92, filter: "brightness(2.05) saturate(1.1)", offset: .84 },
      { transform: "scale(2.62) rotate(.4deg)", opacity: .28, filter: "brightness(2.7) saturate(.75)", offset: .92 },
      { transform: "scale(2.68) rotate(0deg)", opacity: 0, filter: "brightness(3) saturate(.5)", offset: 1 }
    ], { duration: 610, easing: "cubic-bezier(.18,.7,.18,1)", fill: "forwards" });

    // Kleine Vorfunken beginnen schon in der instabilen Aufblähphase.
    const preSparks = Array.from({ length: 8 }, (_, i) => {
      const spark = document.createElement("span");
      spark.className = "match3-pop-particle is-spark";
      spark.style.left = `${centerX}px`;
      spark.style.top = `${centerY}px`;
      spark.style.setProperty("--pop-color", "#ffb13b");
      spark.style.setProperty("--pop-size", `${2 + (i % 2)}px`);
      dom.board.appendChild(spark);
      const a = ((i * 47) - 18) * Math.PI / 180;
      const d = tileBox.width * (.42 + (i % 3) * .12);
      return animationFinished(spark.animate([
        { transform: "translate(-50%,-50%) scale(.2)", opacity: 0, offset: 0 },
        { transform: "translate(-50%,-50%) scale(.2)", opacity: 0, offset: .42 },
        { transform: "translate(-50%,-50%) scale(1.15)", opacity: 1, offset: .55 },
        { transform: `translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(.35)`, opacity: 0, offset: 1 }
      ], { duration: 500 + (i%3)*35, easing: "cubic-bezier(.15,.72,.2,1)", fill: "forwards" })).finally(() => spark.remove());
    });

    // Nicht bis zum Ende des Aufblähens warten: ab hier beginnt die Bombe bereits zu zerreißen.
    await wait(455);

    const shardClips = [
      "polygon(0 0,34% 0,42% 34%,12% 45%)", "polygon(34% 0,68% 0,58% 36%,42% 34%)",
      "polygon(68% 0,100% 0,100% 42%,58% 36%)", "polygon(0 0,12% 45%,40% 48%,0 72%)",
      "polygon(12% 45%,42% 34%,58% 36%,40% 48%)", "polygon(58% 36%,100% 42%,100% 70%,62% 54%)",
      "polygon(0 72%,40% 48%,43% 74%,18% 100%,0 100%)", "polygon(40% 48%,62% 54%,58% 78%,43% 74%)",
      "polygon(62% 54%,100% 70%,100% 100%,72% 100%,58% 78%)", "polygon(18% 100%,43% 74%,58% 78%,72% 100%)"
    ];

    const shardAnimations = shardClips.map((clip, i) => {
      const shard = document.createElement("img");
      shard.src = src; shard.alt = "";
      Object.assign(shard.style, {
        position: "absolute", left: `${left}px`, top: `${top}px`, width: `${tileBox.width}px`, height: `${tileBox.height}px`,
        objectFit: "contain", pointerEvents: "none", zIndex: "80", transformOrigin: "50% 50%", clipPath: clip,
        willChange: "transform,opacity,filter"
      });
      dom.board.appendChild(shard);
      const angle = ((360 / shardClips.length) * i + (i % 2 ? 11 : -8)) * Math.PI / 180;
      const distance = Math.max(tileBox.width, tileBox.height) * (.92 + (i % 4) * .17);
      const dx = Math.cos(angle) * distance, dy = Math.sin(angle) * distance;
      const rot = (i % 2 ? 1 : -1) * (105 + (i % 5) * 34);
      const burst = shard.animate([
        { transform: "translate3d(0,0,0) scale(2.48) rotate(0deg)", opacity: .12, filter: "brightness(2.2)", offset: 0 },
        { transform: `translate3d(${dx*.06}px,${dy*.06}px,0) scale(2.54) rotate(${rot*.06}deg)`, opacity: 1, filter: "brightness(2.7)", offset: .10 },
        { transform: `translate3d(${dx*.28}px,${dy*.28}px,0) scale(2.08) rotate(${rot*.28}deg)`, opacity: 1, filter: "brightness(2.0)", offset: .28 },
        { transform: `translate3d(${dx*.76}px,${dy*.76}px,0) scale(1.05) rotate(${rot*.76}deg)`, opacity: .9, filter: "brightness(1.35)", offset: .68 },
        { transform: `translate3d(${dx*1.12}px,${dy*1.12}px,0) scale(.22) rotate(${rot*1.25}deg)`, opacity: 0, filter: "brightness(1)", offset: 1 }
      ], { duration: 390 + (i%3)*25, easing: "cubic-bezier(.1,.7,.14,1)", fill: "forwards" });
      return animationFinished(burst).finally(() => shard.remove());
    });

    // Flash und Druckring liegen exakt über dem Moment, in dem die Bombe aufreißt.
    const flash = document.createElement("span");
    flash.className = "match3-pop-flash";
    flash.style.left = `${centerX}px`; flash.style.top = `${centerY}px`;
    flash.style.setProperty("--pop-color", "#ff9f32");
    dom.board.appendChild(flash);
    const flashAnim = animationFinished(flash.animate([
      { transform: "translate(-50%,-50%) scale(.35)", opacity: 0 },
      { transform: "translate(-50%,-50%) scale(1.05)", opacity: 1, offset: .16 },
      { transform: "translate(-50%,-50%) scale(1.65)", opacity: 0 }
    ], { duration: 245, easing: "ease-out", fill: "forwards" })).finally(() => flash.remove());

    const ring = document.createElement("span");
    ring.className = "match3-pop-ring";
    ring.style.left = `${centerX}px`; ring.style.top = `${centerY}px`;
    ring.style.setProperty("--pop-color", "#ffb13b");
    dom.board.appendChild(ring);
    const ringAnim = animationFinished(ring.animate([
      { transform: "translate(-50%,-50%) scale(.35)", opacity: .2 },
      { transform: "translate(-50%,-50%) scale(.72)", opacity: 1, offset: .15 },
      { transform: "translate(-50%,-50%) scale(1.8)", opacity: 0 }
    ], { duration: 330, easing: "cubic-bezier(.12,.72,.18,1)", fill: "forwards" })).finally(() => ring.remove());

    await Promise.all([animationFinished(charge), flashAnim, ringAnim, ...shardAnimations, ...preSparks]);
    charge.cancel();
    img.style.opacity = "0";
    img.style.transform = "scale(2.68)";
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
      if (levelCompletedNow()) {
        showLevelVictory();
      } else {
        setStatus(currentLevel.type === "deliver-crests"
          ? "Sprenge die Steine und bringe alle 3 Wappen übers Ziel."
          : "Tausche zwei benachbarte Bälle.");
      }
    }
  }

  async function attemptSwap(from, to) {
    if (busy || finished || !adjacent(from, to)) return;
    if (!isMovablePiece(board[from.row]?.[from.col]) || !isMovablePiece(board[to.row]?.[to.col])) {
      setStatus("Steine können nicht direkt getauscht werden.");
      return;
    }
    busy = true;
    selected = null;
    renderBoard();
    setStatus("Zug wird geprüft …");

    const fromPiece = board[from.row]?.[from.col];
    const toPiece = board[to.row]?.[to.col];
    const crestSwap = isGoalCrest(fromPiece) || isGoalCrest(toPiece);

    // Sichtbarer Tausch beider Nachbarfelder.
    await animateSwapVisual(from, to, 190);
    swapIn(board, from, to);
    renderBoard();

    // Wappen dürfen in alle vier Richtungen getauscht werden, bleiben aber
    // ein normales Zugziel: Der Partnerball muss an seiner neuen Position
    // selbst Teil eines gültigen Matches sein. Sonst wird der Tausch zurückgesetzt.
    if (crestSwap) {
      const partnerPos = isGoalCrest(fromPiece) ? from : to;
      const crestMatches = findMatches(board);
      const partnerCreatesMatch = crestMatches.some((cell) =>
        cell.row === partnerPos.row && cell.col === partnerPos.col
      );

      if (!partnerCreatesMatch) {
        setStatus("Kein Match durch den Partnerball – Zug zurückgesetzt.");
        await wait(45);
        await animateSwapVisual(from, to, 155);
        swapIn(board, from, to);
        renderBoard({ invalid: [from, to] });
        await wait(120);
        busy = false;
        renderBoard();
        setStatus("Tausche das Wappen nur, wenn der Partnerball ein Match bildet.");
        return;
      }

      await resolveBoard(crestMatches, { from, to });
      busy = false;
      renderBoard();
      return;
    }

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
    deliveredCrests = 0;
    releasedCrestColumns.clear();
    deliveredCrestColumns.clear();
    busy = false;
    finished = false;
    selected = null;
    dom.victory?.classList.add("hidden");
    if (dom.playTitle) dom.playTitle.textContent = `Level ${currentLevel.id}`;
    if (dom.board) dom.board.setAttribute("aria-label", `Match Arena Spielfeld ${ROWS} mal ${COLS}`);
    updateHud(1);
    setStatus(currentLevel.type === "deliver-crests" ? "Sprenge die 3 Steine und bringe alle Wappen übers Ziel." : "Tausche zwei benachbarte Bälle.");
    renderBoard();
    showScreen("match3Play");
  }

  function startLevel1() { startLevel(LEVEL_1); }
  function startLevel2() { startLevel(LEVEL_2); }
  function startLevel3() { startLevel(LEVEL_3); }

  function bindEvents() {
    dom.homeButton?.addEventListener("click", () => {
      if (!hasAccess()) return;
      showScreen("match3Map");
    });
    dom.mapBack?.addEventListener("click", () => showScreen("home"));
    dom.level1?.addEventListener("click", startLevel1);
    dom.level2?.addEventListener("click", startLevel2);
    dom.level3?.addEventListener("click", startLevel3);
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

  return { init, refreshAccess, startLevel1, startLevel2, startLevel3 };
})();
