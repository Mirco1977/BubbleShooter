const ROWS = 4;
const COLS = 4;
const TARGET_SCORE = 1500;
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
    dom.playBack = document.getElementById("match3PlayBackButton");
    dom.board = document.getElementById("match3Board");
    dom.score = document.getElementById("match3Score");
    dom.combo = document.getElementById("match3Combo");
    dom.status = document.getElementById("match3Status");
    dom.victory = document.getElementById("match3Victory");
    dom.victoryMap = document.getElementById("match3VictoryMapButton");
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

    // Deterministischer Fallback: match-frei und mit mindestens einem gültigen Zug.
    return [
      ["red", "yellow", "green", "blue"],
      ["yellow", "red", "blue", "green"],
      ["green", "green", "yellow", "red"],
      ["blue", "red", "green", "yellow"]
    ];
  }

  function setStatus(text) {
    if (dom.status) dom.status.textContent = text;
  }

  function updateHud(combo = 1) {
    if (dom.score) dom.score.textContent = score.toLocaleString("de-DE");
    if (dom.combo) dom.combo.textContent = `×${combo}`;
  }

  function renderBoard({ matched = [], falling = false, invalid = [] } = {}) {
    if (!dom.board) return;
    const matchedSet = new Set(matched.map((p) => `${p.row}:${p.col}`));
    const invalidSet = new Set(invalid.map((p) => `${p.row}:${p.col}`));

    dom.board.classList.toggle("is-busy", busy);
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
        if (falling && key) tile.classList.add("is-falling");

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
        renderBoard({ falling: true });
        await wait(300);
        renderBoard();
        return;
      }
    }
    board = createPlayableBoard();
    renderBoard({ falling: true });
    await wait(300);
    renderBoard();
  }

  function collapseAndRefill() {
    for (let col = 0; col < COLS; col++) {
      const remaining = [];
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col]) remaining.push(board[row][col]);
      }
      for (let row = ROWS - 1, index = 0; row >= 0; row--, index++) {
        board[row][col] = index < remaining.length ? remaining[index] : randomBall();
      }
    }
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
      updateHud(cascade);

      for (const { row, col } of matches) board[row][col] = null;
      renderBoard({ matched: matches });
      await wait(130);

      collapseAndRefill();
      renderBoard({ falling: true });
      await wait(360);

      matches = findMatches(board);
      cascade++;
    }

    await shuffleIfNeeded();
    updateHud(1);

    if (score >= TARGET_SCORE) {
      finished = true;
      setStatus("Ziel erreicht!");
      dom.victory?.classList.remove("hidden");
      renderBoard();
      const progress = getProgress();
      if (progress && typeof progress === "object") {
        progress.match3 = progress.match3 || {};
        progress.match3.level1Best = Math.max(Number(progress.match3.level1Best) || 0, score);
        progress.match3.level1Completed = true;
        saveProgress(progress);
      }
    } else {
      setStatus("Tausche zwei benachbarte Bälle.");
    }
  }

  async function attemptSwap(from, to) {
    if (busy || finished || !adjacent(from, to)) return;
    busy = true;
    selected = null;
    setStatus("Zug wird geprüft …");

    swapIn(board, from, to);
    renderBoard({ falling: true });
    await wait(220);

    const matches = findMatches(board);
    if (!matches.length) {
      renderBoard({ invalid: [from, to] });
      setStatus("Kein Match – Zug zurückgesetzt.");
      await wait(280);
      swapIn(board, from, to);
      renderBoard({ falling: true });
      await wait(220);
      busy = false;
      renderBoard();
      setStatus("Tausche zwei benachbarte Bälle.");
      return;
    }

    await resolveBoard(matches);
    busy = false;
    renderBoard();
  }

  function startLevel1() {
    if (!hasAccess()) {
      showScreen("home");
      return;
    }
    board = createPlayableBoard();
    score = 0;
    busy = false;
    finished = false;
    selected = null;
    dom.victory?.classList.add("hidden");
    updateHud(1);
    setStatus("Tausche zwei benachbarte Bälle.");
    renderBoard();
    showScreen("match3Play");
  }

  function bindEvents() {
    dom.homeButton?.addEventListener("click", () => {
      if (!hasAccess()) return;
      showScreen("match3Map");
    });
    dom.mapBack?.addEventListener("click", () => showScreen("home"));
    dom.level1?.addEventListener("click", startLevel1);
    dom.playBack?.addEventListener("click", () => showScreen("match3Map"));
    dom.victoryMap?.addEventListener("click", () => showScreen("match3Map"));
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

  return { init, refreshAccess, startLevel1 };
})();
