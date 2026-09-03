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

const MATCH3_BALL_ASSET_DIR = "assets/match3/balls";
const STRIPE_H = "stripe-h";
const STRIPE_V = "stripe-v";
const COLOR_BOMB = "color-bomb";
const COLOR_BOMB_IMAGE = "assets/ui/color-bomb.png";
const PIECE_SEPARATOR = "|";

// Reserviert für spätere Blocker wie Frost/Ketten. Geschützte Zellen werden
// von einem Streifenschuss weder entfernt noch beim Nachrücken verschoben.
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
    const [color, special = null] = String(piece).split(PIECE_SEPARATOR);
    return { color, special };
  }

  function baseColor(piece) {
    const info = pieceInfo(piece);
    return info.special === COLOR_BOMB ? null : info.color;
  }

  function isColorBomb(piece) {
    return pieceInfo(piece).special === COLOR_BOMB;
  }

  function makeColorBomb() {
    return `special${PIECE_SEPARATOR}${COLOR_BOMB}`;
  }

  function isHorizontalStripe(piece) {
    return pieceInfo(piece).special === STRIPE_H;
  }

  function isVerticalStripe(piece) {
    return pieceInfo(piece).special === STRIPE_V;
  }

  function isStripe(piece) {
    const special = pieceInfo(piece).special;
    return special === STRIPE_H || special === STRIPE_V;
  }

  function makeHorizontalStripe(color) {
    return `${color}${PIECE_SEPARATOR}${STRIPE_H}`;
  }

  function makeVerticalStripe(color) {
    return `${color}${PIECE_SEPARATOR}${STRIPE_V}`;
  }

  function normalImageFor(color) {
    return BALLS.find((ball) => ball.key === color)?.image || BALLS[0].image;
  }

  function imageFor(piece) {
    const { color, special } = pieceInfo(piece);
    if (special === COLOR_BOMB) return COLOR_BOMB_IMAGE;
    if (special === STRIPE_H && color) return `${MATCH3_BALL_ASSET_DIR}/${color}-streif-h.png`;
    if (special === STRIPE_V && color) return `${MATCH3_BALL_ASSET_DIR}/${color}-streif-v.png`;
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

  function planColorBombCreations(groups, swapContext = null) {
    // Eine EXAKTE 5er-Reihe hat Vorrang vor allen 4er-Spezialbällen.
    // Beim Spielerzug entsteht die Farbbombe genau an der Zielzelle des Balls,
    // der die horizontale oder vertikale Fünferreihe vervollständigt hat.
    if (!swapContext?.to) return [];

    const creations = [];
    const used = new Set();

    for (const group of groups) {
      if (group.cells.length !== 5) continue;
      if (!cellInGroup(group, swapContext.to)) continue;

      const pos = swapContext.to;
      const id = `${pos.row}:${pos.col}`;
      if (used.has(id)) continue;
      used.add(id);
      creations.push({ ...pos, special: COLOR_BOMB, fiveMatch: true });
    }

    return creations;
  }

  function planCascadeColorBombCreations(groups, dropMap = null) {
    // Zufällige 5er-Kombi durch Gravity/Fallen:
    // Die Farbbombe wird an der Zelle des zuletzt hineinbewegten Balls erzeugt.
    if (!dropMap) return [];

    const creations = [];
    const used = new Set();

    for (const group of groups) {
      if (group.cells.length !== 5) continue;

      const movedCandidates = group.cells
        .map((cell) => {
          const drop = dropMap.get(`${cell.row}:${cell.col}`);
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
          return b.row - a.row;
        });

      const pos = movedCandidates[0];
      if (!pos) continue;

      const id = `${pos.row}:${pos.col}`;
      if (used.has(id)) continue;
      used.add(id);
      creations.push({
        row: pos.row,
        col: pos.col,
        special: COLOR_BOMB,
        fiveMatch: true,
        cascadeCreated: true
      });
    }

    return creations;
  }

  function planHorizontalStripeCreations(groups, swapContext = null) {
    // STEP 1:
    // Ein horizontaler Streifenball darf aktuell ausschließlich durch den
    // aktiven Spielerzug entstehen. Kaskaden/Fallkombinationen erzeugen
    // bewusst noch keinen neuen Spezialball.
    if (!swapContext?.from || !swapContext?.to) return [];

    // Die Streifenrichtung richtet sich nach dem Zug:
    // horizontal eingeschoben => horizontaler Streifenball.
    const isHorizontalMove =
      swapContext.from.row === swapContext.to.row &&
      swapContext.from.col !== swapContext.to.col;
    if (!isHorizontalMove) return [];

    const creations = [];
    const used = new Set();

    for (const group of groups) {
      // Wirklich nur eine exakte Viererkombination.
      if (group.cells.length !== 4) continue;

      // Entscheidend ist der tatsächlich verschobene Ball an seiner Zielzelle.
      // Eine andere Viererkombi auf dem Brett darf durch diesen Zug keinen
      // Streifenball erzeugen.
      if (!cellInGroup(group, swapContext.to)) continue;

      // Wird ein vorhandener Streifenball in eine neue gleichfarbige Kombi
      // eingebunden, soll er schießen und nicht durch einen neuen ersetzt werden.
      if (group.cells.some(({ row, col }) => isStripe(board[row]?.[col]))) continue;

      const pos = swapContext.to;
      const id = `${pos.row}:${pos.col}`;
      if (used.has(id)) continue;
      used.add(id);
      creations.push({ ...pos, color: group.color });
    }

    return creations;
  }

  function planVerticalStripeCreations(groups, swapContext = null) {
    // Direkter Spielerzug: vertikal eingeschoben => vertikaler Streifenball.
    // Die Regel spiegelt die bestehende horizontale Logik, ohne sie zu verändern.
    if (!swapContext?.from || !swapContext?.to) return [];

    const isVerticalMove =
      swapContext.from.col === swapContext.to.col &&
      swapContext.from.row !== swapContext.to.row;
    if (!isVerticalMove) return [];

    const creations = [];
    const used = new Set();

    for (const group of groups) {
      // Vertikale Bewegung + daraus entstehende horizontale Viererreihe:
      // Genau dieser Abschlussball wird zum vertikalen Streifenball.
      if (group.direction !== "horizontal" || group.cells.length !== 4) continue;

      // Der tatsächlich verschobene Ball muss die Reihe an seiner Zielposition
      // vervollständigt haben.
      if (!cellInGroup(group, swapContext.to)) continue;

      // Vorhandene Streifenbälle feuern stattdessen und werden nicht ersetzt.
      if (group.cells.some(({ row, col }) => isStripe(board[row]?.[col]))) continue;

      const pos = swapContext.to;
      const id = `${pos.row}:${pos.col}`;
      if (used.has(id)) continue;
      used.add(id);
      creations.push({ ...pos, color: group.color, orientation: "vertical" });
    }

    return creations;
  }

  function planCascadeVerticalStripeCreations(groups, dropMap = null) {
    // STEP 2:
    // Nach Gravity darf eine durch vertikales Fallen neu entstandene EXAKTE
    // horizontale Viererreihe einen vertikalen Streifenball erzeugen.
    // Als Ursprungszelle nehmen wir den tatsächlich gefallenen Ball,
    // der diese horizontale Viererreihe vervollständigt hat.
    if (!dropMap) return [];

    const creations = [];
    const used = new Set();

    for (const group of groups) {
      if (group.direction !== "horizontal" || group.cells.length !== 4) continue;
      if (group.cells.some(({ row, col }) => isStripe(board[row]?.[col]))) continue;

      const movedCandidates = group.cells
        .map((cell) => {
          const drop = dropMap.get(`${cell.row}:${cell.col}`);
          if (!drop) return null;
          const moved = Boolean(drop.spawned || drop.fromRow !== cell.row);
          if (!moved) return null;
          const distance = Math.max(0, cell.row - Number(drop.fromRow));
          return { ...cell, distance, spawned: Boolean(drop.spawned) };
        })
        .filter(Boolean)
        .sort((a, b) => {
          // Neu gespawnte / am weitesten gefallene Bälle zuerst,
          // bei Gleichstand die weiter unten liegende Zelle.
          if (a.spawned !== b.spawned) return Number(b.spawned) - Number(a.spawned);
          if (a.distance !== b.distance) return b.distance - a.distance;
          return b.row - a.row;
        });

      const pos = movedCandidates[0];
      if (!pos) continue;

      const id = `${pos.row}:${pos.col}`;
      if (used.has(id)) continue;
      used.add(id);
      creations.push({ row: pos.row, col: pos.col, color: group.color, cascadeCreated: true });
    }

    return creations;
  }

  function expandStripeShots(removalMap) {
    const triggers = [];
    const queued = new Set();

    // Jeder Streifenball, der durch ein normales Match oder durch einen anderen
    // Streifenschuss getroffen wird, wird Teil derselben Kettenreaktion.
    for (const cell of [...removalMap.values()]) {
      if (isStripe(board[cell.row]?.[cell.col])) queued.add(`${cell.row}:${cell.col}`);
    }

    while (queued.size) {
      const id = queued.values().next().value;
      queued.delete(id);
      const [row, col] = id.split(":").map(Number);
      if (triggers.some((trigger) => trigger.row === row && trigger.col === col)) continue;

      const piece = board[row]?.[col];
      if (!isStripe(piece)) continue;

      const orientation = isVerticalStripe(piece) ? "vertical" : "horizontal";
      triggers.push({ row, col, piece, orientation });

      if (orientation === "horizontal") {
        for (let c = 0; c < COLS; c++) {
          if (isProtectedCell(row, c)) continue;
          const targetId = `${row}:${c}`;
          removalMap.set(targetId, { row, col: c });
          if (isStripe(board[row]?.[c]) && c !== col) queued.add(targetId);
        }
      } else {
        for (let r = 0; r < ROWS; r++) {
          if (isProtectedCell(r, col)) continue;
          const targetId = `${r}:${col}`;
          removalMap.set(targetId, { row: r, col });
          if (isStripe(board[r]?.[col]) && r !== row) queued.add(targetId);
        }
      }
    }

    return triggers;
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

          // Eine Farbbombe darf jederzeit mit einem direkt benachbarten
          // farbigen Ball kombiniert werden.
          if (
            (isColorBomb(fromPiece) && baseColor(toPiece)) ||
            (isColorBomb(toPiece) && baseColor(fromPiece))
          ) return true;

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

    // Dieselbe Pop-Explosion wird für ALLE zerstörten Bälle verwendet:
    // normale Matches, Streifenball selbst und vom Streifenschuss getroffene Bälle.
    const ordered = [...removal].sort((a, b) => a.row - b.row || a.col - b.col);
    const stagger = Number.isFinite(options.stagger) ? options.stagger : 46;
    const delayForCell = typeof options.delayForCell === "function" ? options.delayForCell : null;
    const popDuration = 154;

    const animations = ordered.map((cell, index) => (async () => {
      const customDelay = delayForCell ? Number(delayForCell(cell, index) || 0) : 0;
      await wait(Math.max(0, customDelay + index * stagger));

      const tile = tileAt(cell);
      const img = tile?.querySelector("img");
      if (!tile || !img || tile.classList.contains("is-protected")) return;

      tile.classList.add("is-match-popping");
      const piece = board[cell.row]?.[cell.col];
      const { particles, ring, flash } = spawnMatchPopBurst(tile, piece, 16);

      const particleAnimations = particles.map((particle, particleIndex) => {
        const angle = Number(particle.dataset.angle || 0);
        const distance = Number(particle.dataset.distance || 20);
        const radians = angle * Math.PI / 180;
        const dx = Math.cos(radians) * distance;
        const dy = Math.sin(radians) * distance;
        const rotate = 70 + (particleIndex % 5) * 31;

        return animationFinished(particle.animate(
          [
            { transform: "translate(-50%,-50%) scale(.15) rotate(0deg)", opacity: 0, offset: 0 },
            { transform: "translate(-50%,-50%) scale(.15) rotate(0deg)", opacity: 0, offset: .30 },
            { transform: "translate(-50%,-50%) scale(1.25) rotate(12deg)", opacity: 1, offset: .42 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.72) rotate(${rotate}deg)`, opacity: .95, offset: .72 },
            { transform: `translate(calc(-50% + ${dx * 1.18}px), calc(-50% + ${dy * 1.18}px)) scale(.12) rotate(${rotate + 45}deg)`, opacity: 0, offset: 1 }
          ],
          { duration: 190, easing: "cubic-bezier(.16,.78,.22,1)", fill: "forwards" }
        )).finally(() => particle.remove());
      });

      const ringAnimation = ring ? animationFinished(ring.animate(
        [
          { transform: "translate(-50%,-50%) scale(.28)", opacity: 0, offset: 0 },
          { transform: "translate(-50%,-50%) scale(.28)", opacity: 0, offset: .30 },
          { transform: "translate(-50%,-50%) scale(.55)", opacity: .95, offset: .42 },
          { transform: "translate(-50%,-50%) scale(1.42)", opacity: 0, offset: 1 }
        ],
        { duration: 176, easing: "cubic-bezier(.16,.72,.25,1)", fill: "forwards" }
      )).finally(() => ring.remove()) : Promise.resolve();

      const flashAnimation = flash ? animationFinished(flash.animate(
        [
          { transform: "translate(-50%,-50%) scale(.25)", opacity: 0, offset: 0 },
          { transform: "translate(-50%,-50%) scale(.25)", opacity: 0, offset: .30 },
          { transform: "translate(-50%,-50%) scale(1.0)", opacity: .95, offset: .40 },
          { transform: "translate(-50%,-50%) scale(1.38)", opacity: 0, offset: .70 },
          { transform: "translate(-50%,-50%) scale(1.45)", opacity: 0, offset: 1 }
        ],
        { duration: 150, easing: "ease-out", fill: "forwards" }
      )).finally(() => flash.remove()) : Promise.resolve();

      const pop = animationFinished(img.animate(
        [
          { transform: "scale(1)", opacity: 1, filter: "brightness(1) saturate(1)", offset: 0 },
          { transform: "scale(1.10)", opacity: 1, filter: "brightness(1.08) saturate(1.06)", offset: .18 },
          { transform: "scale(1.27)", opacity: 1, filter: "brightness(1.22) saturate(1.12)", offset: .34 },
          { transform: "scale(1.43)", opacity: 1, filter: "brightness(1.72) saturate(1.2)", offset: .43 },
          { transform: "scale(.88)", opacity: .62, filter: "brightness(2.15) saturate(.8)", offset: .56 },
          { transform: "scale(.28)", opacity: 0, filter: "brightness(2.35) saturate(.5)", offset: .76 },
          { transform: "scale(.12)", opacity: 0, filter: "brightness(2.35) saturate(.5)", offset: 1 }
        ],
        { duration: popDuration, easing: "cubic-bezier(.16,.74,.2,1)", fill: "forwards" }
      ));

      await Promise.all([pop, ringAnimation, flashAnimation, ...particleAnimations]);
    })());

    await Promise.all(animations);
  }

  async function animateStripeShots(triggers, removal = []) {
    if (!dom.board || !triggers?.length) return;

    for (const trigger of triggers) {
      const tile = tileAt(trigger);
      if (!tile) continue;
      const sourceImg = tile.querySelector("img");
      if (!sourceImg) continue;

      const isVertical = trigger.orientation === "vertical" || isVerticalStripe(trigger.piece);
      const tileBox = tile.getBoundingClientRect();
      const boardBox = dom.board.getBoundingClientRect();
      const centerX = tileBox.left - boardBox.left + tileBox.width / 2;
      const centerY = tileBox.top - boardBox.top + tileBox.height / 2;
      const size = Math.max(28, tileBox.width - 5);

      const negativeDistance = isVertical ? -(centerY + size) : -(centerX + size);
      const positiveDistance = isVertical
        ? dom.board.clientHeight - centerY + size
        : dom.board.clientWidth - centerX + size;

      // 1) Horizontal und vertikal laden sich identisch auf.
      tile.classList.add("is-stripe-charging");
      await animationFinished(sourceImg.animate(
        [
          { transform: "scale(1)", filter: "brightness(1)" },
          { transform: "scale(1.17)", filter: "brightness(1.18)", offset: .55 },
          { transform: "scale(1.29)", filter: "brightness(1.55)" }
        ],
        { duration: 185, easing: "cubic-bezier(.18,.75,.22,1)", fill: "forwards" }
      ));

      // 2) Der auslösende Streifenball nutzt exakt dieselbe Pop-Explosion
      // wie jeder andere zerstörte Match-3-Ball.
      const sourcePop = animateNormalMatchPops([trigger], { stagger: 0 });
      await wait(42);

      const beam = document.createElement("span");
      beam.className = `match3-stripe-beam is-impact ${isVertical ? "is-vertical" : "is-horizontal"}`;
      if (isVertical) beam.style.left = `${centerX}px`;
      else beam.style.top = `${centerY}px`;
      dom.board.appendChild(beam);

      const beamAnim = animationFinished(beam.animate(
        isVertical
          ? [
              { opacity: 0, transform: "translateX(-50%) scaleY(.02)" },
              { opacity: 1, transform: "translateX(-50%) scaleY(.34)", offset: .16 },
              { opacity: .95, transform: "translateX(-50%) scaleY(1)", offset: .58 },
              { opacity: 0, transform: "translateX(-50%) scaleY(1)" }
            ]
          : [
              { opacity: 0, transform: "translateY(-50%) scaleX(.02)" },
              { opacity: 1, transform: "translateY(-50%) scaleX(.34)", offset: .16 },
              { opacity: .95, transform: "translateY(-50%) scaleX(1)", offset: .58 },
              { opacity: 0, transform: "translateY(-50%) scaleX(1)" }
            ],
        { duration: 360, easing: "cubic-bezier(.08,.76,.16,1)", fill: "forwards" }
      )).finally(() => beam.remove());

      const flights = [];
      const flightDuration = 315;
      const directions = isVertical ? ["up", "down"] : ["left", "right"];

      for (const direction of directions) {
        const clone = document.createElement("img");
        clone.className = `match3-stripe-shot-ball is-${direction}`;
        clone.src = imageFor(trigger.piece);
        clone.alt = "";
        clone.draggable = false;
        clone.style.width = `${size}px`;
        clone.style.height = `${size}px`;
        clone.style.left = `${centerX - size / 2}px`;
        clone.style.top = `${centerY - size / 2}px`;
        clone.addEventListener("error", () => {
          clone.src = normalImageFor(baseColor(trigger.piece));
        }, { once: true });
        dom.board.appendChild(clone);

        const negative = direction === "left" || direction === "up";
        const distance = negative ? negativeDistance : positiveDistance;
        const tx = isVertical ? 0 : distance;
        const ty = isVertical ? distance : 0;

        const flight = clone.animate(
          [
            { transform: "translate3d(0,0,0) scale(1.12)", opacity: 1, filter: "brightness(1.7)" },
            { transform: `translate3d(${tx}px,${ty}px,0) scale(.88)`, opacity: .94, filter: "brightness(1.18)" }
          ],
          { duration: flightDuration, easing: "cubic-bezier(.08,.72,.12,1)", fill: "forwards" }
        );
        flights.push(animationFinished(flight).finally(() => clone.remove()));
      }

      // 3) Getroffene Bälle platzen entlang der Flugrichtung beim Kontakt.
      const lineCells = removal
        .filter((cell) => isVertical ? cell.col === trigger.col : cell.row === trigger.row)
        .filter((cell) => !(cell.row === trigger.row && cell.col === trigger.col))
        .map((cell) => ({ cell, tile: tileAt(cell) }))
        .filter(({ tile: hitTile }) => hitTile && !hitTile.classList.contains("is-protected"));

      const impactAnimations = lineCells.map(({ cell, tile: hitTile }) => {
        const hitBox = hitTile.getBoundingClientRect();
        const hitCenter = isVertical
          ? hitBox.top - boardBox.top + hitBox.height / 2
          : hitBox.left - boardBox.left + hitBox.width / 2;
        const sourceCenter = isVertical ? centerY : centerX;
        const totalDistance = hitCenter < sourceCenter ? Math.abs(negativeDistance) : Math.abs(positiveDistance);
        const travelled = Math.abs(hitCenter - sourceCenter);
        const delay = Math.max(20, Math.min(flightDuration - 55, (travelled / Math.max(1, totalDistance)) * flightDuration));

        return animateNormalMatchPops([cell], {
          stagger: 0,
          delayForCell: () => delay
        });
      });

      await Promise.all([sourcePop, beamAnim, ...flights, ...impactAnimations]);
      tile.classList.remove("is-stripe-charging");
    }
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
        const specialLabel = info.special === STRIPE_H
          ? " horizontaler Streifenball"
          : info.special === STRIPE_V
            ? " vertikaler Streifenball"
            : info.special === COLOR_BOMB
              ? "Farbbombe"
              : " Ball";
        tile.setAttribute(
          "aria-label",
          key
            ? info.special === COLOR_BOMB
              ? `Farbbombe, Reihe ${row + 1}, Spalte ${col + 1}`
              : `${info.color}${specialLabel}, Reihe ${row + 1}, Spalte ${col + 1}`
            : "Leeres Feld"
        );
        tile.disabled = busy || finished || !key;

        if (selected?.row === row && selected?.col === col) tile.classList.add("is-selected");
        if (matchedSet.has(`${row}:${col}`)) tile.classList.add("is-matched");
        if (invalidSet.has(`${row}:${col}`)) tile.classList.add("is-invalid");
        if (createdSet.has(`${row}:${col}`)) tile.classList.add("is-created-special");
        if (info.special === STRIPE_H) tile.classList.add("is-stripe-h");
        if (info.special === STRIPE_V) tile.classList.add("is-stripe-v");
        if (info.special === COLOR_BOMB) tile.classList.add("is-color-bomb");
        if (isProtectedCell(row, col)) tile.classList.add("is-protected");

        if (key) {
          const img = document.createElement("img");
          img.src = imageFor(key);
          img.alt = "";
          img.draggable = false;
          if (info.special === STRIPE_H || info.special === STRIPE_V) {
            img.addEventListener("error", () => {
              tile.classList.add("uses-special-fallback");
              img.src = normalImageFor(info.color);
            }, { once: true });
          } else if (info.special === COLOR_BOMB) {
            img.addEventListener("error", () => {
              tile.classList.add("uses-special-fallback");
            }, { once: true });
          }
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

  async function resolveBoard(initialMatches, swapContext = null, initialDropMap = null) {
    let matches = initialMatches;
    let cascade = 1;
    let firstCycle = true;
    let lastDropMap = initialDropMap;

    while (matches.length) {
      const groups = findMatchGroups(board);

      // Spielerzug: bestehende Regel bleibt unverändert.
      // Kaskade: neu ist ausschließlich eine zufällig entstandene EXAKTE
      // vertikale Viererreihe nach einem Fallvorgang.
      // 5er-Kombinationen werden IMMER zuerst ausgewertet. Eine Fünferreihe
      // darf deshalb nie versehentlich als 4er-Streifenball verarbeitet werden.
      const colorBombCreations = firstCycle && swapContext
        ? planColorBombCreations(groups, swapContext)
        : planCascadeColorBombCreations(groups, lastDropMap);

      const colorBombSet = new Set(colorBombCreations.map((p) => `${p.row}:${p.col}`));

      const stripeCreations = firstCycle && swapContext
        ? [
            ...planHorizontalStripeCreations(groups, swapContext).map((creation) => ({
              ...creation,
              orientation: "horizontal"
            })),
            ...planVerticalStripeCreations(groups, swapContext)
          ]
        : planCascadeVerticalStripeCreations(groups, lastDropMap);

      // Falls dieselbe Abschlusszelle Teil einer 5er-Erzeugung ist, gewinnt
      // immer die Farbbombe gegenüber einem Streifenball.
      const creations = [
        ...colorBombCreations,
        ...stripeCreations.filter((creation) => !colorBombSet.has(`${creation.row}:${creation.col}`))
      ];
      const creationSet = new Set(creations.map((p) => `${p.row}:${p.col}`));

      // Der neu erzeugte Spezialball bleibt auf dem Feld; alle anderen Match-Zellen
      // werden entfernt.
      for (const creation of creations) {
        if (creation.special === COLOR_BOMB || creation.fiveMatch) {
          board[creation.row][creation.col] = makeColorBomb();
          continue;
        }

        const vertical = creation.orientation === "vertical" || creation.cascadeCreated;
        board[creation.row][creation.col] = vertical
          ? makeVerticalStripe(creation.color)
          : makeHorizontalStripe(creation.color);
      }

      const removalMap = new Map();
      for (const cell of matches) {
        const id = `${cell.row}:${cell.col}`;
        if (!creationSet.has(id) && !isProtectedCell(cell.row, cell.col)) removalMap.set(id, cell);
      }

      // Ein bereits vorhandener Streifenball, der Teil einer gleichfarbigen Kombi wird,
      // aktiviert sofort den kompletten horizontalen Reihenschuss.
      const stripeTriggers = expandStripeShots(removalMap);
      const removal = [...removalMap.values()];

      updateHud(cascade);
      if (stripeTriggers.length) setStatus("Streifenschuss!");
      else if (colorBombCreations.length) {
        const byCascade = colorBombCreations.some((creation) => creation.cascadeCreated);
        setStatus(byCascade ? "Kaskaden-5er – Farbbombe entstanden!" : "5er-Kombi – Farbbombe erstellt!");
      }
      else if (creations.length) {
        const byCascade = creations.some((creation) => creation.cascadeCreated);
        setStatus(byCascade ? "Kaskaden-4er – Streifenball entstanden!" : "4er-Kombi – Streifenball erstellt!");
      }
      else setStatus(cascade > 1 ? `Kaskade ×${cascade}!` : `${removal.length} Bälle getroffen.`);

      renderBoard({ createdSpecial: creations });
      if (creations.length) await wait(145);
      if (stripeTriggers.length) await animateStripeShots(stripeTriggers, removal);

      if (stripeTriggers.length) {
        renderBoard({ matched: removal, createdSpecial: creations });
        await wait(220);
      } else {
        renderBoard({ createdSpecial: creations });
        await animateNormalMatchPops(removal);
      }

      const multiplier = Math.min(cascade, 4);
      score += removal.length * POINTS_PER_BALL * multiplier;

      if (currentLevel.type === "collect") {
        for (const { row, col } of removal) {
          if (baseColor(board[row]?.[col]) === currentLevel.collectKey) collectedBlue++;
        }
      }
      updateHud(cascade);

      for (const { row, col } of removal) {
        if (!isProtectedCell(row, col)) board[row][col] = null;
      }
      renderBoard({ matched: removal });
      await wait(120);

      const dropMap = collapseAndRefill();
      lastDropMap = dropMap;
      const dropDuration = renderBoard({ dropMap });
      await wait(Math.max(300, dropDuration + 25));

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

  async function resolveColorBombSwap(bombPos, targetColor) {
    if (!targetColor) return;

    const removalMap = new Map();

    // Die Farbbombe selbst verschwindet bei der Aktivierung.
    if (!isProtectedCell(bombPos.row, bombPos.col)) {
      removalMap.set(`${bombPos.row}:${bombPos.col}`, { row: bombPos.row, col: bombPos.col });
    }

    // Alle Bälle der gewählten Nachbarfarbe auf dem gesamten Spielfeld markieren.
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (isProtectedCell(row, col)) continue;
        if (baseColor(board[row]?.[col]) !== targetColor) continue;
        removalMap.set(`${row}:${col}`, { row, col });
      }
    }

    // Wird dabei ein Streifenball derselben Farbe getroffen, darf die bestehende
    // Kettenreaktionslogik normal weiterlaufen.
    const stripeTriggers = expandStripeShots(removalMap);
    const removal = [...removalMap.values()];

    updateHud(1);
    setStatus(`Farbbombe – alle ${targetColor}-Bälle platzen!`);

    if (stripeTriggers.length) {
      await animateStripeShots(stripeTriggers, removal);
      renderBoard({ matched: removal });
      await wait(220);
    } else {
      await animateNormalMatchPops(removal);
    }

    score += removal.length * POINTS_PER_BALL;

    if (currentLevel.type === "collect") {
      for (const { row, col } of removal) {
        if (baseColor(board[row]?.[col]) === currentLevel.collectKey) collectedBlue++;
      }
    }
    updateHud(1);

    for (const { row, col } of removal) {
      if (!isProtectedCell(row, col)) board[row][col] = null;
    }

    renderBoard({ matched: removal });
    await wait(120);

    const dropMap = collapseAndRefill();
    const dropDuration = renderBoard({ dropMap });
    await wait(Math.max(300, dropDuration + 25));

    // Anschließende Matches werden wieder von der normalen Kaskadenlogik
    // inklusive 4er- und 5er-Spezialbildung verarbeitet.
    const nextMatches = findMatches(board);
    await resolveBoard(nextMatches, null, dropMap);
  }

  async function attemptSwap(from, to) {
    if (busy || finished || !adjacent(from, to)) return;
    busy = true;
    selected = null;
    renderBoard();
    setStatus("Zug wird geprüft …");

    const fromPieceBeforeSwap = board[from.row]?.[from.col];
    const toPieceBeforeSwap = board[to.row]?.[to.col];
    const colorBombSwap =
      (isColorBomb(fromPieceBeforeSwap) && baseColor(toPieceBeforeSwap)) ||
      (isColorBomb(toPieceBeforeSwap) && baseColor(fromPieceBeforeSwap));

    // Erst die beiden sichtbaren Bälle wirklich in das Nachbarfeld gleiten lassen.
    await animateSwapVisual(from, to, 190);
    swapIn(board, from, to);
    renderBoard();

    // Farbbombe + beliebiger direkt angrenzender farbiger Ball:
    // Die Farbe des Nachbarballs bestimmt, welche Farbe global entfernt wird.
    if (colorBombSwap) {
      const bombStartedAtFrom = isColorBomb(fromPieceBeforeSwap);
      const bombPos = bombStartedAtFrom ? to : from;
      const targetPiece = bombStartedAtFrom ? toPieceBeforeSwap : fromPieceBeforeSwap;
      const targetColor = baseColor(targetPiece);

      await resolveColorBombSwap(bombPos, targetColor);
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
