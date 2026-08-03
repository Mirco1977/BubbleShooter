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

3: {
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

4: {
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

5: {
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
6: {
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

7: {
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

8: {
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

9: {
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

10: {
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

13: {
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

14: {
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

15: {
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

16: {
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

17: {
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

18: {
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
19: {
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