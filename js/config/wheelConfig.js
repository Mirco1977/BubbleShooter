export const WHEEL_CONFIG = Object.freeze({
  spinDurationMs: 4800,

  segments: Object.freeze([
    { id: "jackpot", type: "jackpot", label: "JACKPOT", weight: 1 },
    { id: "switch2", type: "item", itemKey: "ballswitch", amount: 2, label: "2× Switch", weight: 2 },
    { id: "rainbow1", type: "item", itemKey: "rainbow", amount: 1, label: "1× Rainbow", weight: 2 },
    { id: "aim3", type: "item", itemKey: "aim", amount: 3, label: "3× Zielhilfe", weight: 2 },
    { id: "bomb1", type: "item", itemKey: "bomb", amount: 1, label: "1× Bombe", weight: 2 },
    { id: "thunder1", type: "item", itemKey: "thunder", amount: 1, label: "1× Thunder", weight: 2 },
    { id: "switch1", type: "item", itemKey: "ballswitch", amount: 1, label: "1× Switch", weight: 2 },
    { id: "aim2", type: "item", itemKey: "aim", amount: 2, label: "2× Zielhilfe", weight: 2 }
  ])
});
