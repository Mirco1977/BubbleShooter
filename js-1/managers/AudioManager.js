export class AudioManager {
    constructor(options = {}) {
        this.getSettings =
            typeof options.getSettings === "function"
                ? options.getSettings
                : () => ({
                    music: true,
                    sound: true
                });

        this.audio = {
            background: new Audio(
                "assets/audio/Background-music.mp3"
            ),

            hit: new Audio(
                "assets/audio/Treffer-music.mp3"
            ),

            levelPassed: new Audio(
                "assets/audio/Level-passed-music.mp3"
            ),

            stagePassed: new Audio(
                "assets/audio/Stage-passed-music.mp3"
            ),

            levelStart: new Audio(
                "assets/audio/Level-start-music.mp3"
            ),

            shoot: new Audio(
                "assets/audio/Shoot.mp3"
            ),
            bomb: new Audio(
                "assets/audio/bomb.mp3"
            ),
            thunder: new Audio(
                "assets/audio/thunder.mp3"
            ),

        };

        this.backgroundStarted = false;

        this.handleFirstInteraction =
            this.handleFirstInteraction.bind(this);

        this.configure();
    }

    configure() {
        this.audio.background.loop = true;
        this.audio.background.volume = 0.18;

        this.audio.hit.preload = "auto";
        this.audio.hit.playbackRate = 1.06;

        this.audio.levelStart.preload = "auto";
        this.audio.shoot.preload = "auto";
        this.audio.stagePassed.preload = "auto";

        this.audio.bomb.volume = 0.5;

        this.audio.hit.load();
        this.audio.levelStart.load();
        this.audio.shoot.load();
        this.audio.stagePassed.load();
        this.audio.thunder.load();
    }

    getCurrentSettings() {
        const settings = this.getSettings() || {};

        return {
            music: settings.music !== false,
            sound: settings.sound !== false
        };
    }

    playEffect(name) {
        const settings = this.getCurrentSettings();

        if (!settings.sound) {
            return;
        }

        const track = this.audio[name];

        if (!track) {
            console.warn(
                `[AudioManager] Unbekannter Sound: ${name}`
            );

            return;
        }

        try {
            track.currentTime = 0;

            const playPromise = track.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(() => {});
            }
        } catch (error) {
            console.warn(
                `[AudioManager] Sound konnte nicht abgespielt werden: ${name}`,
                error
            );
        }
    }

    startBackground() {
        const settings = this.getCurrentSettings();

        if (!settings.music) {
            return;
        }

        const track = this.audio.background;

        try {
            const playPromise = track.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(() => {});
            }

            this.backgroundStarted = true;
        } catch (error) {
            console.warn(
                "[AudioManager] Hintergrundmusik konnte nicht gestartet werden.",
                error
            );
        }
    }

    pauseBackground() {
        this.audio.background.pause();
    }

    stopBackground() {
        this.audio.background.pause();
        this.audio.background.currentTime = 0;
        this.backgroundStarted = false;
    }

    syncSettings() {
        const settings = this.getCurrentSettings();

        if (!settings.music) {
            this.pauseBackground();
            return;
        }

        if (this.backgroundStarted) {
            this.startBackground();
        }
    }

    enableBackgroundOnFirstInteraction() {
        document.addEventListener(
            "click",
            this.handleFirstInteraction
        );

        document.addEventListener(
            "touchstart",
            this.handleFirstInteraction,
            {
                passive: true
            }
        );
    }

    handleFirstInteraction() {
        this.startBackground();
        this.removeInteractionListeners();
    }

    removeInteractionListeners() {
        document.removeEventListener(
            "click",
            this.handleFirstInteraction
        );

        document.removeEventListener(
            "touchstart",
            this.handleFirstInteraction
        );
    }

    destroy() {
        this.removeInteractionListeners();

        Object.values(this.audio).forEach((track) => {
            track.pause();
            track.currentTime = 0;
        });
    }
}