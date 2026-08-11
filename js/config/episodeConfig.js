export const EPISODE_CONFIG = Object.freeze([
  Object.freeze({
    id: "summer-sprint-2026",
    name: "Summer Sprint",
    subtitle: "8 Level. Ein Ziel. Eine Belohnung.",
    startAt: "2026-08-01T00:00:00+02:00",
    endAt: "2026-08-31T23:59:59+02:00",

    // Welche vorhandene Themenwelt optisch im Spiel benutzt wird.
    // 1 = Bandenkick Arena, 2 = World Cup usw.
    themeStage: 1,

    // Die Belohnung wird erst später technisch vergeben.
    // Der Platzhalter kann später durch Items, Coins, Badge etc. ersetzt werden.
    reward: Object.freeze({
      type: "placeholder",
      title: "Episoden-Belohnung",
      description: "Belohnung wird später festgelegt."
    }),

    levels: Object.freeze([
      Object.freeze({
        id: 1,
        ballTypes: 3,
        addRowAfterShot: "n",
        rows: 3,
        targetScore: 800,
        mode: "shots",
        maxShots: 10,
        shots: Object.freeze({ threeStars: 4, twoStars: 7, oneStar: 10 })
      }),
      Object.freeze({
        id: 2,
        ballTypes: 3,
        addRowAfterShot: "n",
        rows: 4,
        targetScore: 1400,
        mode: "shots",
        maxShots: 14,
        shots: Object.freeze({ threeStars: 6, twoStars: 10, oneStar: 14 })
      }),
      Object.freeze({
        id: 3,
        ballTypes: 4,
        addRowAfterShot: "n",
        rows: 5,
        targetScore: 2200,
        mode: "shots",
        maxShots: 17,
        shots: Object.freeze({ threeStars: 8, twoStars: 12, oneStar: 17 })
      }),
      Object.freeze({
        id: 4,
        ballTypes: 4,
        addRowAfterShot: "y",
        rows: 5,
        targetScore: 3000,
        mode: "shots",
        maxShots: 19,
        shots: Object.freeze({ threeStars: 10, twoStars: 14, oneStar: 19 })
      }),
      Object.freeze({
        id: 5,
        ballTypes: 4,
        addRowAfterShot: "y",
        rows: 5,
        targetScore: 3600,
        mode: "colors",
        only_color: "red",
        need: 8,
        maxShots: 21,
        shots: Object.freeze({ threeStars: 11, twoStars: 16, oneStar: 21 })
      }),
      Object.freeze({
        id: 6,
        ballTypes: 5,
        addRowAfterShot: "y",
        rows: 6,
        targetScore: 4500,
        mode: "shots",
        maxShots: 24,
        shots: Object.freeze({ threeStars: 14, twoStars: 19, oneStar: 24 })
      }),
      Object.freeze({
        id: 7,
        ballTypes: 5,
        addRowAfterShot: "y",
        rows: 7,
        targetScore: 5400,
        mode: "shots",
        maxShots: 27,
        shots: Object.freeze({ threeStars: 17, twoStars: 22, oneStar: 27 })
      }),
      Object.freeze({
        id: 8,
        ballTypes: 5,
        addRowAfterShot: "y",
        rows: 8,
        targetScore: 6500,
        mode: "shots",
        maxShots: 30,
        shots: Object.freeze({ threeStars: 20, twoStars: 25, oneStar: 30 })
      })
    ])
  })
]);

export function getEpisodeById(id) {
  return EPISODE_CONFIG.find((episode) => episode.id === id) || null;
}

export function getEpisodeStatus(episode, now = new Date()) {
  if (!episode) return "missing";
  const current = now.getTime();
  const start = new Date(episode.startAt).getTime();
  const end = new Date(episode.endAt).getTime();
  if (current < start) return "upcoming";
  if (current > end) return "ended";
  return "active";
}

export function calculateEpisodeStars(levelConfig, stats) {
  if (!levelConfig) return 0;
  const shots = Number(stats?.shots) || 0;
  if (levelConfig.maxShots && shots > levelConfig.maxShots) return 0;
  if (shots <= levelConfig.shots.threeStars) return 3;
  if (shots <= levelConfig.shots.twoStars) return 2;
  return 1;
}
