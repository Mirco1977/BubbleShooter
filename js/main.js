import { Game } from "./core/Game.js";

function bootstrap() {
    try {
        const game = new Game();

        window.addEventListener("beforeunload", () => {
            game.log("Spielseite wird verlassen");
        });
    } catch (error) {
        console.error(
            "[Bubble Engine] Fehler beim Starten der Engine:",
            error
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
    bootstrap();
}