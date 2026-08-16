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
};

export function calculateStars(level, stats){

    const config = STAR_CONFIG[level];

    if(!config){
        return 1;
    }


    switch(config.mode){


        case "shots":

            if(stats.shots <= config.shots.threeStars){
                return 3;
            }


            if(stats.shots <= config.shots.twoStars){
                return 2;
            }


            if(stats.shots > config.maxShots){
            return 0;
            }
                return 1;

    case "shots":

    if(
        config.maxShots &&
        stats.shots > config.maxShots
    ){
        return 0;
    }


    if(stats.shots <= config.shots.threeStars){
        return 3;
    }


    if(stats.shots <= config.shots.twoStars){
        return 2;
    }


    return 1;

        default:
            return 1;

    }

}

export { STAR_CONFIG };