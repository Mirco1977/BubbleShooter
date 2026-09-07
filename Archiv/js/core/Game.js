import { GAME_CONFIG } from "../config/gameConfig.js";
import { GameState } from "./GameState.js";

export class Game {
    constructor() {
        this.config = GAME_CONFIG;
        this.state = new GameState();
        this.initialized = false;

        this.initialize();
    }

    initialize() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.log("Game Engine gestartet");
        this.log("Spiel: Bubble Challenge");
        this.log(`Version: ${this.config.version ?? "unbekannt"}`);

        this.exposeDebugTools();
    }

    start() {
        this.state.start();
        this.log("Neues Spiel gestartet");
    }

    pause() {
        this.state.pause();
        this.log("Spiel pausiert");
    }

    resume() {
        this.state.resume();
        this.log("Spiel fortgesetzt");
    }

    reset() {
        this.state.reset();
        this.log("Spielstatus zurückgesetzt");
    }

    exposeDebugTools() {
        window.BubbleGame = this;

        this.log(
            "Debug-Zugriff verfügbar über window.BubbleGame"
        );
    }

    log(message) {
        console.log(`[Bubble Engine] ${message}`);
    }
}