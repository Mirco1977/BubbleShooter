export const GAME_CONFIG = Object.freeze({
    version: "0.2.0",

    levelsPerStage: 10,
    totalStages: 5,

    assets: {
        appBackground: "",
        heroBackground: "",

        stageBackgrounds: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: ""
        },

        mapBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "",
            5: ""
        },

        gameBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "",
            5: ""
        },

        levelBackgrounds: {
            1: "assets/backgrounds/Bandenkick-Arena.png",
            2: "assets/backgrounds/World-Cup.png",
            3: "assets/backgrounds/Tropical Paradise.png",
            4: "",
            5: ""
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
