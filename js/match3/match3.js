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
    dom.victoryHome = document.getElementById("match3VictoryHomeButton");
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

  function imageFor(key) {
    return BALLS.find((ball) => ball.key === key)?.image || BALLS[0].image;
  }

  function swapIn(boardToChange, a, b) {
    const temp = boardToChange[a.row][a.col];
    boardToChange[a.row][a.col] = boardToChange[b.row][b.col];
    boardToChange[b.row][b.col] = temp;
  }

  function adjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  function findMatches(boardToCheck) {
    const matched = new Set();

    for (let row = 0; row < ROWS; row++) {
      let start = 0;
      while (start < COLS) {
        const key = boardToCheck[row][start];
        let end = start + 1;
        while (end < COLS && key && boardToCheck[row][end] === key) end++;
        if (key && end - start >= 3) {
          for (let col = start; col < end; col++) matched.add(`${row}:${col}`);
        }
        start = end;
      }
    }

    for (let col = 0; col < COLS; col++) {
      let start = 0;
      while (start < ROWS) {
        const key = boardToCheck[start][col];
        let end = start + 1;
        while (end < ROWS && key && boardToCheck[end][col] === key) end++;
        if (key && end - start >= 3) {
          for (let row = start; row < end; row++) matched.add(`${row}:${col}`);
        }
        start = end;
      }
    }

    return [...matched].map((value) => {
      const [row, col] = value.split(":").map(Number);
      return { row, col };
    });
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

  function renderBoard({ matched = [], dropMap = null, invalid = [] } = {}) {
    if (!dom.board) return 0;
    const matchedSet = new Set(matched.map((p) => `${p.row}:${p.col}`));
    const invalidSet = new Set(invalid.map((p) => `${p.row}:${p.col}`));

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
        tile.setAttribute("aria-label", key ? `${key} Ball, Reihe ${row + 1}, Spalte ${col + 1}` : "Leeres Feld");
        tile.disabled = busy || finished || !key;

        if (selected?.row === row && selected?.col === col) tile.classList.add("is-selected");
        if (matchedSet.has(`${row}:${col}`)) tile.classList.add("is-matched");
        if (invalidSet.has(`${row}:${col}`)) tile.classList.add("is-invalid");

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

    for (let col = 0; col < COLS; col++) {
      const remaining = [];
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col]) remaining.push({ key: board[row][col], fromRow: row });
      }

      let spawnIndex = 0;
      for (let row = ROWS - 1, index = 0; row >= 0; row--, index++) {
        if (index < remaining.length) {
          const item = remaining[index];
          board[row][col] = item.key;
          dropMap.set(`${row}:${col}`, { fromRow: item.fromRow, spawned: false });
        } else {
          board[row][col] = randomBall();
          dropMap.set(`${row}:${col}`, { fromRow: -1 - spawnIndex, spawned: true });
          spawnIndex++;
        }
      }
    }

    return dropMap;
  }

  async function resolveBoard(initialMatches) {
    let matches = initialMatches;
    let cascade = 1;

    while (matches.length) {
      updateHud(cascade);
      setStatus(cascade > 1 ? `Kaskade ×${cascade}!` : `${matches.length} Bälle getroffen.`);
      renderBoard({ matched: matches });
      await wait(330);

      const multiplier = Math.min(cascade, 4);
      score += matches.length * POINTS_PER_BALL * multiplier;

      if (currentLevel.type === "collect") {
        for (const { row, col } of matches) {
          if (board[row]?.[col] === currentLevel.collectKey) collectedBlue++;
        }
      }
      updateHud(cascade);

      for (const { row, col } of matches) board[row][col] = null;
      renderBoard({ matched: matches });
      await wait(130);

      const dropMap = collapseAndRefill();
      const dropDuration = renderBoard({ dropMap });
      await wait(Math.max(300, dropDuration + 25));

      matches = findMatches(board);
      cascade++;
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

  async function attemptSwap(from, to) {
    if (busy || finished || !adjacent(from, to)) return;
    busy = true;
    selected = null;
    renderBoard();
    setStatus("Zug wird geprüft …");

    // Erst die beiden sichtbaren Bälle wirklich in das Nachbarfeld gleiten lassen.
    await animateSwapVisual(from, to, 190);
    swapIn(board, from, to);
    renderBoard();

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

    await resolveBoard(matches);
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
    dom.victoryHome?.addEventListener("click", () => showScreen("home"));
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
