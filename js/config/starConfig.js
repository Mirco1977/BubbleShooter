const STAR_CONFIG = {

1: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,
    mode: "shots",
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

2: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 1000,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

3: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 1500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

4: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2000,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

5: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},
6: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5000,
    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

7: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 6000,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

8: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6000,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},

9: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 5000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},

10: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 6000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},

11: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,
    mode: "shots",
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

12: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 1000,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

13: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2000,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

14: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 3500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

15: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 7,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},

16: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 8,
    targetScore: 4500,
    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

17: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 9,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

18: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 10,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},
19: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},
20: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},
21: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 4000,
    mode: "colors",
    only_color: "red",
    need: 7,
    maxShots: 18,
    chainedBalls: [
        { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 }, { row: 3, col: 7 }, { row: 3, col: 8 }, { row: 3, col: 9 }, { row: 3, col: 10 },
        { row: 4, col: 4 }, { row: 4, col: 5 }, { row: 4, col: 6 }, { row: 4, col: 7 }, { row: 4, col: 8 }, { row: 4, col: 9 },
        
    ],

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},

22: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 1800,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

23: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

24: {
    // SCHWERT-LEVEL – identischer Test wie Level 70.
    // Goldball am Griff (2. Kugel von oben) treffen.
    // Schwertgröße wird automatisch auf 5 Ballhöhen x 3 Ballbreiten skaliert.
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 8,
    targetScore: 8000,
    mode: "sword",
    maxShots: 18,

    sword: {
        row: 2,
        col: 7
    },

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 18
    }
},

25: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "colors",
    only_color: "red",
    need: 7,
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},
26: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4500,
    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

27: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

28: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},

29: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},

30: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},

31: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,
    mode: "shots",
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

32: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 1800,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

33: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

34: {
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

35: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},

36: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4500,
    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

37: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

38: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},
39: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},
40: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},
41: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,
    mode: "shots",
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

42: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 1800,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

43: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

44: {
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

45: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},
46: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4500,
    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

47: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

48: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},

49: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},

50: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},

51: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,

    mode: "colors",
    only_color: "red",
    need: 7,
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

52: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 1800,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

53: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

54: {
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

55: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},

56: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4500,

    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

57: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

58: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},
59: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},
60: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "shots",
    maxShots: 30,

    shots: {
        threeStars: 22,
        twoStars: 25,
        oneStar: 30
    }
},

61: {
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 3,
    targetScore: 500,

    mode: "colors",
    only_color: "red",
    need: 7,
    maxShots: 8,

    shots: {
        threeStars: 2,
        twoStars: 4,
        oneStar: 7
    }
},

62: {
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 1800,
    mode: "shots",
    maxShots: 14,

    shots: {
        threeStars: 6,
        twoStars: 9,
        oneStar: 14
    }
},

63: {
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 2500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 16
    }
},

64: {
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3500,
    mode: "shots",
    maxShots: 16,

    shots: {
        threeStars: 8,
        twoStars: 12,
        oneStar: 13
    }
},

65: {
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,

    shots: {
        threeStars: 10,
        twoStars: 14,
        oneStar: 18
    }
},

66: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4500,

    mode: "shots",
    maxShots: 20,

    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

67: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,

    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 23
    }
},

68: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6500,
    mode: "shots",
    maxShots: 26,

    shots: {
        threeStars: 17,
        twoStars: 20,
        oneStar: 26
    }
},
69: {
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 28,

    shots: {
        threeStars: 20,
        twoStars: 24,
        oneStar: 28
    }
},
70: {
    // SCHWERT-LEVEL – Goldball am Griff (2. Kugel von oben) treffen.
    // Schwertgröße wird automatisch auf 5 Ballhöhen x 3 Ballbreiten skaliert.
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 8,
    targetScore: 8000,
    mode: "sword",
    maxShots: 18,

    sword: {
        row: 2,
        col: 7
    },

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 18
    }
},

71: {
    // SPEEDGAME-BEISPIEL
    // Ziel: targetScore innerhalb von time Sekunden erreichen.
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5000,
    mode: "speed",
    time: 60,

    // Sterne werden ausschließlich über die erreichte Punktzahl vergeben.
    points: {
        threeStars: 6500,
        twoStars: 5750,
        oneStar: 5000
    }
},

72: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 3200,
    mode: "shots",
    maxShots: 18,
    shots: {
        threeStars: 11,
        twoStars: 15,
        oneStar: 18
    }
},

73: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3150,
    mode: "colors",
    only_color: "purple",
    need: 9,
    maxShots: 17,
    shots: {
        threeStars: 11,
        twoStars: 14,
        oneStar: 17
    }
},

74: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3700,
    mode: "shots",
    maxShots: 19,
    chainedBalls: [
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 4, col: 9 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

75: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 5000,
    mode: "speed",
    time: 58,
    chainedBalls: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
        { row: 2, col: 8 },
    ],
    points: {
        threeStars: 6000,
        twoStars: 5400,
        oneStar: 5000
    }
},

76: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3150,
    mode: "colors",
    only_color: "red",
    need: 9,
    maxShots: 19,
    chainedBalls: [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

77: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3600,
    mode: "shots",
    maxShots: 18,
    shots: {
        threeStars: 11,
        twoStars: 15,
        oneStar: 18
    }
},

78: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4900,
    mode: "speed",
    time: 64,
    chainedBalls: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
        { row: 2, col: 8 },
    ],
    points: {
        threeStars: 5900,
        twoStars: 5300,
        oneStar: 4900
    }
},

79: {
    // Stage 8 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4100,
    mode: "shots",
    maxShots: 20,
    chainedBalls: [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

80: {
    // SCHWERT-LEVEL – Goldball am Griff (2. Kugel von oben) treffen.
    // Schwertgröße wird automatisch auf 5 Ballhöhen x 3 Ballbreiten skaliert.
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 8,
    targetScore: 8000,
    mode: "sword",
    maxShots: 18,

    sword: {
        row: 2,
        col: 7
    },

    shots: {
        threeStars: 6,
        twoStars: 11,
        oneStar: 18
    }
},

81: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3200,
    mode: "shots",
    maxShots: 17,
    shots: {
        threeStars: 11,
        twoStars: 14,
        oneStar: 17
    }
},

82: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 3600,
    mode: "shots",
    maxShots: 19,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

83: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3500,
    mode: "colors",
    only_color: "green",
    need: 10,
    maxShots: 18,
    shots: {
        threeStars: 11,
        twoStars: 15,
        oneStar: 18
    }
},

84: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4000,
    mode: "shots",
    maxShots: 20,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

85: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4800,
    mode: "speed",
    time: 58,
    points: {
        threeStars: 5800,
        twoStars: 5200,
        oneStar: 4800
    }
},

86: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3500,
    mode: "colors",
    only_color: "purple",
    need: 10,
    maxShots: 20,
    chainedBalls: [
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 4, col: 9 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

87: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4000,
    mode: "shots",
    maxShots: 19,
    chainedBalls: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
        { row: 2, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

88: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4600,
    mode: "speed",
    time: 65,
    points: {
        threeStars: 5600,
        twoStars: 5000,
        oneStar: 4600
    }
},

89: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4400,
    mode: "shots",
    maxShots: 21,
    chainedBalls: [
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 4, col: 9 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

90: {
    // Stage 9 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5200,
    mode: "speed",
    time: 59,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    points: {
        threeStars: 6200,
        twoStars: 5600,
        oneStar: 5200
    }
},

91: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3600,
    mode: "shots",
    maxShots: 17,
    shots: {
        threeStars: 11,
        twoStars: 14,
        oneStar: 17
    }
},

92: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 3900,
    mode: "shots",
    maxShots: 19,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

93: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 3,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3150,
    mode: "colors",
    only_color: "pink",
    need: 9,
    maxShots: 18,
    shots: {
        threeStars: 11,
        twoStars: 15,
        oneStar: 18
    }
},

94: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4400,
    mode: "shots",
    maxShots: 20,
    chainedBalls: [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

95: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 5600,
    mode: "speed",
    time: 59,
    points: {
        threeStars: 6600,
        twoStars: 6000,
        oneStar: 5600
    }
},

96: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3150,
    mode: "colors",
    only_color: "green",
    need: 9,
    maxShots: 21,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

97: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4300,
    mode: "shots",
    maxShots: 20,
    chainedBalls: [
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

98: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 5400,
    mode: "speed",
    time: 65,
    points: {
        threeStars: 6400,
        twoStars: 5800,
        oneStar: 5400
    }
},

99: {
    // Stage 10 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4800,
    mode: "shots",
    maxShots: 22,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

100: {
    // TESTVORLAGE – neuer Modus: vollständige Reihen entfernen
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 4,

    mode: "removeRows",
    targetRows: 6,

    // Optional: Schusslimit und Sternwertung können wie gewohnt genutzt werden.
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

101: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4000,
    mode: "shots",
    maxShots: 18,
    shots: {
        threeStars: 11,
        twoStars: 15,
        oneStar: 18
    }
},

102: {
    // TESTVORLAGE – neuer Modus: vollständige Reihen entfernen
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 4,

    mode: "removeRows",
    targetRows: 2,

    // Optional: Schusslimit und Sternwertung können wie gewohnt genutzt werden.
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

103: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 3850,
    mode: "colors",
    only_color: "yellow",
    need: 11,
    maxShots: 19,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

104: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4800,
    mode: "shots",
    maxShots: 21,
    chainedBalls: [
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 4, col: 9 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

105: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 4,
    targetScore: 5400,
    mode: "speed",
    time: 60,
    chainedBalls: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
    ],
    points: {
        threeStars: 6500,
        twoStars: 5800,
        oneStar: 5400
    }
},

106: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 3850,
    mode: "colors",
    only_color: "pink",
    need: 11,
    maxShots: 21,
    chainedBalls: [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

107: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 4700,
    mode: "shots",
    maxShots: 20,
    chainedBalls: [
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
        { row: 3, col: 9 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
        { row: 2, col: 8 },
    ],
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

108: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 4,
    targetScore: 5200,
    mode: "speed",
    time: 66,
    chainedBalls: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
    ],
    points: {
        threeStars: 6300,
        twoStars: 5600,
        oneStar: 5200
    }
},

109: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5200,
    mode: "shots",
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

110: {
    // Stage 11 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5800,
    mode: "speed",
    time: 60,
    points: {
        threeStars: 6900,
        twoStars: 6200,
        oneStar: 5800
    }
},

111: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4400,
    mode: "shots",
    maxShots: 19,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

112: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 4700,
    mode: "shots",
    maxShots: 21,
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

113: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4200,
    mode: "colors",
    only_color: "black",
    need: 12,
    maxShots: 20,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

114: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5200,
    mode: "shots",
    maxShots: 22,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

115: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 6200,
    mode: "speed",
    time: 60,
    points: {
        threeStars: 7300,
        twoStars: 6600,
        oneStar: 6200
    }
},

116: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 4200,
    mode: "colors",
    only_color: "yellow",
    need: 12,
    maxShots: 22,
    chainedBalls: [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

117: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5100,
    mode: "shots",
    maxShots: 21,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

118: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 6000,
    mode: "speed",
    time: 67,
    points: {
        threeStars: 7100,
        twoStars: 6400,
        oneStar: 6000
    }
},

119: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 5600,
    mode: "shots",
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

120: {
    // Stage 12 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5700,
    mode: "shots",
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

121: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4700,
    mode: "shots",
    maxShots: 19,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 19
    }
},

122: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5100,
    mode: "shots",
    maxShots: 21,
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

123: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 3850,
    mode: "colors",
    only_color: "blue",
    need: 11,
    maxShots: 20,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

124: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5500,
    mode: "shots",
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

125: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5900,
    mode: "speed",
    time: 61,
    points: {
        threeStars: 7000,
        twoStars: 6300,
        oneStar: 5900
    }
},

126: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 3850,
    mode: "colors",
    only_color: "black",
    need: 11,
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

127: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 22,
    chainedBalls: [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

128: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5800,
    mode: "speed",
    time: 67,
    points: {
        threeStars: 6900,
        twoStars: 6200,
        oneStar: 5800
    }
},

129: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5900,
    mode: "shots",
    maxShots: 24,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

130: {
    // Stage 13 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6300,
    mode: "speed",
    time: 61,
    points: {
        threeStars: 7400,
        twoStars: 6700,
        oneStar: 6300
    }
},

131: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5100,
    mode: "shots",
    maxShots: 20,
    shots: {
        threeStars: 12,
        twoStars: 16,
        oneStar: 20
    }
},

132: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5400,
    mode: "shots",
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

133: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4550,
    mode: "colors",
    only_color: "red",
    need: 13,
    maxShots: 21,
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

134: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 5900,
    mode: "shots",
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

135: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 6700,
    mode: "speed",
    time: 62,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    points: {
        threeStars: 7900,
        twoStars: 7200,
        oneStar: 6700
    }
},

136: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 4550,
    mode: "colors",
    only_color: "blue",
    need: 13,
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

137: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5800,
    mode: "shots",
    maxShots: 22,
    chainedBalls: [
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 4, col: 9 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

138: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 6500,
    mode: "speed",
    time: 68,
    chainedBalls: [
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    points: {
        threeStars: 7700,
        twoStars: 7000,
        oneStar: 6500
    }
},

139: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 4,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6300,
    mode: "shots",
    maxShots: 25,
    chainedBalls: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

140: {
    // Stage 14 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6400,
    mode: "shots",
    maxShots: 25,
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

141: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 5500,
    mode: "shots",
    maxShots: 21,
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

142: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 5800,
    mode: "shots",
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

143: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 5,
    targetScore: 4900,
    mode: "colors",
    only_color: "purple",
    need: 14,
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

144: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6300,
    mode: "shots",
    maxShots: 24,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
    ],
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

145: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 5,
    targetScore: 6500,
    mode: "speed",
    time: 62,
    points: {
        threeStars: 7700,
        twoStars: 7000,
        oneStar: 6500
    }
},

146: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 5250,
    mode: "colors",
    only_color: "red",
    need: 15,
    maxShots: 24,
    chainedBalls: [
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

147: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6200,
    mode: "shots",
    maxShots: 23,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

148: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6300,
    mode: "speed",
    time: 69,
    points: {
        threeStars: 7500,
        twoStars: 6800,
        oneStar: 6300
    }
},

149: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 6700,
    mode: "shots",
    maxShots: 25,
    chainedBalls: [
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

150: {
    // Stage 15 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 6900,
    mode: "speed",
    time: 63,
    chainedBalls: [
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    points: {
        threeStars: 8100,
        twoStars: 7400,
        oneStar: 6900
    }
},

151: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 5800,
    mode: "shots",
    maxShots: 21,
    shots: {
        threeStars: 13,
        twoStars: 17,
        oneStar: 21
    }
},

152: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6200,
    mode: "shots",
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

153: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 4550,
    mode: "colors",
    only_color: "green",
    need: 13,
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

154: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 6700,
    mode: "shots",
    maxShots: 25,
    chainedBalls: [
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

155: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7300,
    mode: "speed",
    time: 63,
    points: {
        threeStars: 8500,
        twoStars: 7800,
        oneStar: 7300
    }
},

156: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 4550,
    mode: "colors",
    only_color: "purple",
    need: 13,
    maxShots: 25,
    chainedBalls: [
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

157: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6600,
    mode: "shots",
    maxShots: 24,
    chainedBalls: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 5, col: 10 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

158: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 7100,
    mode: "speed",
    time: 69,
    points: {
        threeStars: 8300,
        twoStars: 7600,
        oneStar: 7100
    }
},

159: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7000,
    mode: "shots",
    maxShots: 26,
    chainedBalls: [
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 21,
        oneStar: 26
    }
},

160: {
    // Stage 16 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7200,
    mode: "shots",
    maxShots: 26,
    shots: {
        threeStars: 16,
        twoStars: 21,
        oneStar: 26
    }
},

161: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6200,
    mode: "shots",
    maxShots: 22,
    shots: {
        threeStars: 14,
        twoStars: 18,
        oneStar: 22
    }
},

162: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6600,
    mode: "shots",
    maxShots: 24,
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

163: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 5250,
    mode: "colors",
    only_color: "pink",
    need: 15,
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

164: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7000,
    mode: "shots",
    maxShots: 25,
    chainedBalls: [
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

165: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7100,
    mode: "speed",
    time: 64,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    points: {
        threeStars: 8400,
        twoStars: 7600,
        oneStar: 7100
    }
},

166: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 5250,
    mode: "colors",
    only_color: "green",
    need: 15,
    maxShots: 25,
    chainedBalls: [
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

167: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6900,
    mode: "shots",
    maxShots: 24,
    chainedBalls: [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 5, col: 10 },
        { row: 5, col: 11 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

168: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6900,
    mode: "speed",
    time: 70,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    points: {
        threeStars: 8200,
        twoStars: 7400,
        oneStar: 6900
    }
},

169: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7400,
    mode: "shots",
    maxShots: 27,
    chainedBalls: [
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 17,
        twoStars: 22,
        oneStar: 27
    }
},

170: {
    // Stage 17 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 7,
    targetScore: 7400,
    mode: "speed",
    time: 64,
    points: {
        threeStars: 8700,
        twoStars: 7900,
        oneStar: 7400
    }
},

171: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 6600,
    mode: "shots",
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

172: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 6900,
    mode: "shots",
    maxShots: 25,
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

173: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 5600,
    mode: "colors",
    only_color: "yellow",
    need: 16,
    maxShots: 24,
    shots: {
        threeStars: 15,
        twoStars: 20,
        oneStar: 24
    }
},

174: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7400,
    mode: "shots",
    maxShots: 26,
    chainedBalls: [
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 21,
        oneStar: 26
    }
},

175: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7800,
    mode: "speed",
    time: 64,
    points: {
        threeStars: 9100,
        twoStars: 8300,
        oneStar: 7800
    }
},

176: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 5950,
    mode: "colors",
    only_color: "pink",
    need: 17,
    maxShots: 26,
    chainedBalls: [
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 21,
        oneStar: 26
    }
},

177: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 7300,
    mode: "shots",
    maxShots: 25,
    chainedBalls: [
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
        { row: 3, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

178: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 7700,
    mode: "speed",
    time: 71,
    points: {
        threeStars: 9000,
        twoStars: 8200,
        oneStar: 7700
    }
},

179: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7800,
    mode: "shots",
    maxShots: 27,
    chainedBalls: [
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 17,
        twoStars: 22,
        oneStar: 27
    }
},

180: {
    // Stage 18 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7900,
    mode: "shots",
    maxShots: 27,
    shots: {
        threeStars: 17,
        twoStars: 22,
        oneStar: 27
    }
},

181: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 6,
    targetScore: 7000,
    mode: "shots",
    maxShots: 23,
    shots: {
        threeStars: 14,
        twoStars: 19,
        oneStar: 23
    }
},

182: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 6,
    targetScore: 7300,
    mode: "shots",
    maxShots: 25,
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

183: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 7,
    targetScore: 5250,
    mode: "colors",
    only_color: "black",
    need: 15,
    maxShots: 25,
    shots: {
        threeStars: 16,
        twoStars: 20,
        oneStar: 25
    }
},

184: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 7800,
    mode: "shots",
    maxShots: 27,
    chainedBalls: [
        { row: 7, col: 4 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
        { row: 7, col: 7 },
        { row: 7, col: 8 },
        { row: 7, col: 9 },
        { row: 7, col: 10 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    shots: {
        threeStars: 17,
        twoStars: 22,
        oneStar: 27
    }
},

185: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7600,
    mode: "speed",
    time: 65,
    points: {
        threeStars: 8900,
        twoStars: 8100,
        oneStar: 7600
    }
},

186: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 5250,
    mode: "colors",
    only_color: "yellow",
    need: 15,
    maxShots: 27,
    chainedBalls: [
        { row: 7, col: 3 },
        { row: 7, col: 4 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
        { row: 7, col: 7 },
        { row: 7, col: 8 },
        { row: 7, col: 9 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    shots: {
        threeStars: 17,
        twoStars: 22,
        oneStar: 27
    }
},

187: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 7,
    targetScore: 7700,
    mode: "shots",
    maxShots: 26,
    chainedBalls: [
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
        { row: 4, col: 8 },
    ],
    shots: {
        threeStars: 16,
        twoStars: 21,
        oneStar: 26
    }
},

188: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "n",
    rows: 7,
    targetScore: 7400,
    mode: "speed",
    time: 71,
    points: {
        threeStars: 8700,
        twoStars: 7900,
        oneStar: 7400
    }
},

189: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8200,
    mode: "shots",
    maxShots: 28,
    chainedBalls: [
        { row: 7, col: 3 },
        { row: 7, col: 4 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
        { row: 7, col: 7 },
        { row: 7, col: 8 },
        { row: 7, col: 9 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 5, col: 8 },
    ],
    shots: {
        threeStars: 17,
        twoStars: 23,
        oneStar: 28
    }
},

190: {
    // Stage 19 – automatisch abgestimmtes Level
    ballTypes: 5,
    addRowAfterShot: "y",
    rows: 8,
    targetScore: 8000,
    mode: "speed",
    time: 66,
    points: {
        threeStars: 9400,
        twoStars: 8600,
        oneStar: 8000
    }
},
};

export function calculateStars(level, stats){

    const config = STAR_CONFIG[level];

    if (!config) {
        return 1;
    }

    switch (config.mode) {

        case "speed": {
            const score = Number(stats.score) || 0;
            const oneStar = Number(config.points?.oneStar ?? config.targetScore ?? 0);
            const twoStars = Number(config.points?.twoStars ?? oneStar);
            const threeStars = Number(config.points?.threeStars ?? twoStars);

            if (score >= threeStars) return 3;
            if (score >= twoStars) return 2;
            if (score >= oneStar) return 1;
            return 0;
        }

        case "shots":
        default: {
            if (config.maxShots && stats.shots > config.maxShots) {
                return 0;
            }

            if (stats.shots <= config.shots?.threeStars) {
                return 3;
            }

            if (stats.shots <= config.shots?.twoStars) {
                return 2;
            }

            return 1;
        }
    }
}

export { STAR_CONFIG };