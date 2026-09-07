export class StorageManager {

    constructor() {

        this.progressKey = "bandenkick_progress";
        this.settingsKey = "bandenkick_settings";

    }


    loadProgress(defaults = {}) {
    try {
        const saved = JSON.parse(
            localStorage.getItem(this.progressKey) || "{}"
        );

        return {
            ...defaults,
            ...saved,
            results: {
                ...(defaults.results || {}),
                ...(saved.results || {})
            }
        };

    } catch(error) {
        console.warn(
            "[StorageManager] Progress konnte nicht geladen werden",
            error
        );

        return defaults;
    }
    }



    saveProgress(progress) {

        try {

            localStorage.setItem(
                this.progressKey,
                JSON.stringify(progress)
            );

        } catch(error) {

            console.warn(
                "[StorageManager] Progress konnte nicht gespeichert werden",
                error
            );

        }

    }



    loadSettings(defaults = {
        music: true,
        sound: true,
        aimGuide: true,
        gameSpeed: "normal"
    }) {

        try {

            return {
                ...defaults,

                ...(
                    JSON.parse(
                        localStorage.getItem(this.settingsKey)
                    ) || {}
                )

            };


        } catch(error) {

            console.warn(
                "[StorageManager] Settings konnten nicht geladen werden",
                error
            );

            return defaults;

        }

    }



    saveSettings(settings) {

        try {

            localStorage.setItem(
                this.settingsKey,
                JSON.stringify(settings)
            );


        } catch(error) {

            console.warn(
                "[StorageManager] Settings konnten nicht gespeichert werden",
                error
            );

        }

    }



    resetProgress() {

        localStorage.removeItem(
            this.progressKey
        );

    }


    resetSettings() {

        localStorage.removeItem(
            this.settingsKey
        );

    }
// =========================
// USER
// =========================

loadUser(defaults = null) {

    try {

        return (
            JSON.parse(
                localStorage.getItem("bandenkick_user")
            ) || defaults
        );

    } catch(error) {

        console.warn(
            "[StorageManager] User konnte nicht geladen werden",
            error
        );

        return defaults;

    }

}


saveUser(user) {

    try {

        localStorage.setItem(
            "bandenkick_user",
            JSON.stringify(user)
        );

    } catch(error) {

        console.warn(
            "[StorageManager] User konnte nicht gespeichert werden",
            error
        );

    }

}
}