export const ALBUM_CONFIG = [
  {
    id: "swords",
    name: "Schwerter",
    subtitle: "Sammle alle 6 Schwertkarten",
    maxCards: 6,
    cover: "assets/albums/swords/album-swords.png",
    cards: [
      { id: "longsword", number: 78,  name: "Longsword",    unlockLevel: 70,  image: "assets/albums/swords/longsword.png" },
      { id: "kilij",     number: 167, name: "Kilij",        unlockLevel: 80,  image: "assets/albums/swords/kilij.png" },
      { id: "gladius",   number: 203, name: "Gladius",      unlockLevel: 90,  image: "assets/albums/swords/gladius.png" },
      { id: "viking",    number: 314, name: "Viking Sword", unlockLevel: 100, image: "assets/albums/swords/viking-sword.png" },
      { id: "arming",    number: 319, name: "Arming Sword", unlockLevel: 110, image: "assets/albums/swords/arming-sword.png" },
      { id: "flamberge", number: 418, name: "Flamberge",    unlockLevel: 120, image: "assets/albums/swords/flamberge.png" }
    ],
    reward: {
      title: "Album-Belohnung",
      text: "Alle 6 Schwerter gesammelt!",
      items: {
        bomb: 10,
        thunder: 10,
        colorbomb: 5,
        hourglass: 5
      }
    }
  }
];

export function getAlbumById(id) {
  return ALBUM_CONFIG.find((album) => album.id === id) || null;
}

export function getAlbumCardForLevel(level) {
  const numericLevel = Number(level);
  for (const album of ALBUM_CONFIG) {
    const card = album.cards.find((entry) => Number(entry.unlockLevel) === numericLevel);
    if (card) return { album, card };
  }
  return null;
}
