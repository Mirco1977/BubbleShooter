export const WHEEL_CONFIG = Object.freeze({
  probabilities: Object.freeze({ normal: 80, random: 15, jackpot: 5 }),
  randomItemKeys: Object.freeze(["ballswitch", "bomb", "rainbow", "aim", "colorbomb", "thunder"]),
  freeSpinSpeedDegPerSecond: 248,
  maxFreeSpinMs: 10000,
  stopDurationMs: 5000,
  segments: Object.freeze([
    { id:"jackpot1", type:"jackpot", category:"jackpot" },
    { id:"switch", type:"item", category:"normal", itemKey:"ballswitch", amount:1 },
    { id:"bomb", type:"item", category:"normal", itemKey:"bomb", amount:1 },
    { id:"frost", type:"item", category:"normal", itemKey:"frost", amount:1 },
    { id:"rainbow", type:"item", category:"normal", itemKey:"rainbow", amount:1 },
    { id:"fireball", type:"item", category:"normal", itemKey:"fireball", amount:1 },
    { id:"aim", type:"item", category:"normal", itemKey:"aim", amount:1 },
    { id:"colorbomb", type:"item", category:"normal", itemKey:"colorbomb", amount:1 },
    { id:"hourglass", type:"hourglass-or-random", category:"random", amount:3 },
    { id:"thunder", type:"item", category:"normal", itemKey:"thunder", amount:1 }
  ])
});
