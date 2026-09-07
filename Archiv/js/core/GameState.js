export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.isGameOver = false;

        this.currentStage = 1;
        this.currentLevel = 1;

        this.score = 0;
        this.shots = 0;
        this.stars = 0;
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.isGameOver = false;
    }

    pause() {
        if (!this.isRunning) {
            return;
        }

        this.isPaused = true;
    }

    resume() {
        if (!this.isRunning) {
            return;
        }

        this.isPaused = false;
    }

    finish() {
        this.isRunning = false;
        this.isPaused = false;
        this.isGameOver = true;
    }

    addScore(points) {
        const safePoints = Number(points);

        if (!Number.isFinite(safePoints)) {
            return;
        }

        this.score += safePoints;
    }

    registerShot() {
        this.shots += 1;
    }

    setLevel(stage, level) {
        const safeStage = Number(stage);
        const safeLevel = Number(level);

        if (Number.isInteger(safeStage) && safeStage > 0) {
            this.currentStage = safeStage;
        }

        if (Number.isInteger(safeLevel) && safeLevel > 0) {
            this.currentLevel = safeLevel;
        }
    }

    getSnapshot() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            isGameOver: this.isGameOver,
            currentStage: this.currentStage,
            currentLevel: this.currentLevel,
            score: this.score,
            shots: this.shots,
            stars: this.stars
        };
    }
}