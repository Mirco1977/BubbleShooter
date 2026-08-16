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
   * 180°/s = eine halbe Umdrehung pro Sekunde.
   */
  freeSpinSpeedDegPerSecond: 180,

  /*
   * Zielbereich für das sanfte Auslaufen. Die tatsächliche Dauer wird aus
   * aktueller Geschwindigkeit + benötigtem Zielweg berechnet, damit das Rad
   * beim STOPP niemals noch einmal beschleunigt.
   */
  minStopDurationMs: 3200,
  maxStopDurationMs: 6500,

  /*
   * 10 sichtbare Felder.
   * Slot 7 wird bis Level 65 als zweites ×3-Zufallsfeld dargestellt.
   * Ab freigeschaltetem Level 66 wird daraus die Sanduhr.
   */
  segments: Object.freeze([
    Object.freeze({ id: "normal-ballswitch", type: "item", category: "normal", itemKey: "ballswitch", amount: 1 }),
    Object.freeze({ id: "normal-rainbow", type: "item", category: "normal", itemKey: "rainbow", amount: 1 }),
    Object.freeze({ id: "normal-aim", type: "item", category: "normal", itemKey: "aim", amount: 1 }),
    Object.freeze({ id: "normal-bomb", type: "item", category: "normal", itemKey: "bomb", amount: 1 }),
    Object.freeze({ id: "normal-thunder", type: "item", category: "normal", itemKey: "thunder", amount: 1 }),
    Object.freeze({ id: "normal-colorbomb", type: "item", category: "normal", itemKey: "colorbomb", amount: 1 }),
    Object.freeze({ id: "slot-7", type: "hourglass-or-random", amount: 1 }),
    Object.freeze({ id: "jackpot-1", type: "jackpot", category: "jackpot" }),
    Object.freeze({ id: "jackpot-2", type: "jackpot", category: "jackpot" }),
    Object.freeze({ id: "random-3x", type: "random", category: "random", amount: 3 })
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
