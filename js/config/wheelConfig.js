export const WHEEL_CONFIG = Object.freeze({
  /*
   * Die eigentliche Gewinnchance wird NICHT über die Anzahl der sichtbaren
   * Felder bestimmt. Zuerst wird eine Gewinnkategorie gezogen, anschließend
   * eines der dazugehörigen Felder. So bleiben die Chancen exakt erhalten.
   */
  probabilities: Object.freeze({
    normal: 80,
    random: 15,
    jackpot: 5
  }),

  /*
   * Das Rad darf höchstens 25 Sekunden frei drehen. Danach wird automatisch
   * exakt dieselbe sanfte Auslaufphase gestartet wie beim STOPP-Button.
   */
  maxFreeSpinMs: 25000,

  /*
   * Deutlich ruhigere Geschwindigkeit während der freien Drehphase.
   * 216°/s = 20 % schneller als zuvor (180°/s).
   */
  freeSpinSpeedDegPerSecond: 216,

  /*
   * STOPP und Auto-Stopp laufen immer exakt 5 Sekunden aus.
   * Die Auslaufkurve übernimmt die aktuelle Drehgeschwindigkeit und
   * reduziert sie ohne erneuten Anschub bis auf 0.
   */
  stopDurationMs: 5000,

  /*
   * Feste Reihenfolge der 10 sichtbaren Felder ab Level 1:
   * 1 Jackpot, 2 Switch, 3 Bombe, 4 Zufall, 5 Regenbogen,
   * 6 Jackpot, 7 Lupe, 8 Farbbombe, 9 Zufall/Sanduhr, 10 Blitz.
   * Ab Level 65 ersetzt die Sanduhr auf Feld 9 das Zufallsfeld.
   */
  segments: Object.freeze([
    Object.freeze({ id: "jackpot-1", type: "jackpot", category: "jackpot" }),
    Object.freeze({ id: "normal-ballswitch", type: "item", category: "normal", itemKey: "ballswitch", amount: 1 }),
    Object.freeze({ id: "normal-bomb", type: "item", category: "normal", itemKey: "bomb", amount: 1 }),
    Object.freeze({ id: "random-3x-1", type: "random", category: "random", amount: 3 }),
    Object.freeze({ id: "normal-rainbow", type: "item", category: "normal", itemKey: "rainbow", amount: 1 }),
    Object.freeze({ id: "jackpot-2", type: "jackpot", category: "jackpot" }),
    Object.freeze({ id: "normal-aim", type: "item", category: "normal", itemKey: "aim", amount: 1 }),
    Object.freeze({ id: "normal-colorbomb", type: "item", category: "normal", itemKey: "colorbomb", amount: 1 }),
    Object.freeze({ id: "slot-9", type: "hourglass-or-random", amount: 1 }),
    Object.freeze({ id: "normal-thunder", type: "item", category: "normal", itemKey: "thunder", amount: 1 })
  ]),

  /* Zufallsfeld: Jackpot und Sanduhr sind ausdrücklich ausgeschlossen. */
  randomItemKeys: Object.freeze([
    "ballswitch",
    "rainbow",
    "aim",
    "bomb",
    "thunder",
    "colorbomb"
  ])
});
