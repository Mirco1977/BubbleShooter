import { STAGES, LEVELS_PER_STAGE, TOTAL_STAGES } from "./stageConfig.js";

const stageBackgrounds = Object.freeze(
  Object.fromEntries(STAGES.map((stage, index) => [index + 1, stage.background]))
);

export const GAME_CONFIG = Object.freeze({
    version: "0.3.0",

    levelsPerStage: LEVELS_PER_STAGE,
    totalStages: TOTAL_STAGES,

    assets: {
        appBackground: "",
        heroBackground: "",

        // Kompatibilitäts-Aliase: alle vier beziehen ihre Daten zentral aus stageConfig.js.
        stageBackgrounds,
        mapBackgrounds: stageBackgrounds,
        gameBackgrounds: stageBackgrounds,
        levelBackgrounds: stageBackgrounds,

        bubbleImages: {
            red: "",
            blue: "",
            green: "",
            yellow: "",
            purple: ""
        }
    },

    backendMode: "mock",

    api: {
        baseUrl: "https://bandenkick.de/api/game",
        endpoints: {
            me: "/me",
            ranking: "/ranking",
            score: "/scores",
            progress: "/progress"
        }
    }
});
