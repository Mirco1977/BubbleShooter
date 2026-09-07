export const ALBUM_CONFIG = [
  {
    id: "swords",
    name: "Schwerter",
    subtitle: "Sammle alle 6 Schwertkarten",
    maxCards: 6,
    cover: "assets/albums/swords/album-swords.png",
    completionImage: "assets/albums/swords/album-complete.png",
    cards: [
      { id: "longsword", number: 78,  name: "Longsword",    unlockLevel: 30,  image: "assets/albums/swords/longsword.png" },
      { id: "kilij",     number: 167, name: "Kilij",        unlockLevel: 40,  image: "assets/albums/swords/kilij.png" },
      { id: "gladius",   number: 203, name: "Gladius",      unlockLevel: 50,  image: "assets/albums/swords/gladius.png" },
      { id: "viking",    number: 314, name: "Viking Sword", unlockLevel: 60, image: "assets/albums/swords/viking-sword.png" },
      { id: "arming",    number: 319, name: "Arming Sword", unlockLevel: 70, image: "assets/albums/swords/arming-sword.png" },
      { id: "flamberge", number: 418, name: "Flamberge",    unlockLevel: 80, image: "assets/albums/swords/flamberge.png" }
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
  },
  {
    id: "crowns",
    name: "Kronen",
    subtitle: "Sammle alle 6 Kronenkarten",
    maxCards: 6,
    cover: "assets/albums/crowns/album-complete.png",
    completionImage: "assets/albums/crowns/album-complete.png",
    cards: [
      { id: "pharao-tutanchamun", number: 1, name: "Krone des Pharao Tutanchamun", unlockLevel: 90, image: "assets/albums/crowns/pharao-tutanchamun.png" },
      { id: "st-edwards-crown", number: 2, name: "St. Edward’s Crown", unlockLevel: 100, image: "assets/albums/crowns/st-edwards-crown.png" },
      { id: "moghul-kaiser", number: 3, name: "Krone der Moghul-Kaiser", unlockLevel: 110, image: "assets/albums/crowns/moghul-kaiser.png" },
      { id: "azteken-kopfschmuck", number: 4, name: "Azteken-Kopfschmuck", unlockLevel: 120, image: "assets/albums/crowns/azteken-kopfschmuck.png" },
      { id: "krone-von-tonga", number: 5, name: "Krone von Tonga", unlockLevel: 130, image: "assets/albums/crowns/krone-von-tonga.png" },
      { id: "zulu-koenig", number: 6, name: "Krone des Zulu-Königs", unlockLevel: 140, image: "assets/albums/crowns/zulu-koenig.png" }
    ],
    reward: {
      title: "Album-Belohnung",
      text: "Alle 6 Kronen gesammelt!",
      items: { bomb: 10, thunder: 10, colorbomb: 5, hourglass: 5 }
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
