export const GAME_CONFIG = Object.freeze({
    version: "0.2.0",

    levelsPerStage: 10,
    totalStages: 5,

    assets: {
        appBackground: "",
        heroBackground: "",

        stageBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "assets/backgrounds/volcano-stadium.png",
            5: "assets/backgrounds/pirate-island.png",
            6: "assets/backgrounds/jungle-arena.png",
            7: "assets/backgrounds/dragon-fantasy.png",
            8: "assets/backgrounds/royal-kingdom.png",
            9: "assets/backgrounds/monster-stadium.png"
        },

        mapBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "assets/backgrounds/volcano-stadium.png",
            5: "assets/backgrounds/pirate-island.png",
            6: "assets/backgrounds/jungle-arena.png",
            7: "assets/backgrounds/dragon-fantasy.png",
            8: "assets/backgrounds/royal-kingdom.png",
            9: "assets/backgrounds/monster-stadium.png"
        },

        gameBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "assets/backgrounds/volcano-stadium.png",
            5: "assets/backgrounds/pirate-island.png",
            6: "assets/backgrounds/jungle-arena.png",
            7: "assets/backgrounds/dragon-fantasy.png",
            8: "assets/backgrounds/royal-kingdom.png",
            9: "assets/backgrounds/monster-stadium.png"
        },

        levelBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "assets/backgrounds/volcano-stadium.png",
            5: "assets/backgrounds/pirate-island.png",
            6: "assets/backgrounds/jungle-arena.png",
            7: "assets/backgrounds/dragon-fantasy.png",
            8: "assets/backgrounds/royal-kingdom.png",
            9: "assets/backgrounds/monster-stadium.png"
        },

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
