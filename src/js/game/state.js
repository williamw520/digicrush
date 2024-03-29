/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {Flag} from "/js/model/flag.js";

// game state module
let state = (function() {
    const state = {};

    // Game states
    state.S_INIT_WAIT = 0;
    state.S_LEVEL_WAIT = 1;
    state.S_PLAYING = 2;
    state.S_PAUSED = 3;
    state.S_WON_PENDING = 4;
    state.S_WON = 5;
    state.S_WON_WAIT = 6;
    state.S_LOST = 7;
    state.S_LOST_WAIT = 8;

    state.gstate = state.S_INIT_WAIT;   // current game state

    state.level = 1;
    state.nextLevel = 1;
    state.hitGoal  = 0;
    state.hitCount = 0;
    state.speed = -0.01;                // normal speed for flags.
    state.speedBump = 0;                // additional speed for initial flags.

    state.inSeq = 0;                    // remaining counter for spawning flags in sequence
    state.inSeqCh = 0;                  // the digit char to spawn in sequence
    state.inSeqProbability = 0.2;       // probability to spawn in sequence

    state.scoreDisplay = 0;             // current displayed score.
    state.score = 0;                    // the score.

    state.calcSpeed = () => {
        state.speed = -(0.01 + Math.log(state.level) / 200);
    }

    state.updateSpeedBump = (flagCount) => {
        // Speed up when less than 8 flags exist.  Don't let the player wait for the initial flags.
        state.speedBump = -Math.floor( (8 - Math.min(flagCount, 8)) ) / 200;
    }

    state.calcGoal = () => {
        state.hitGoal = Math.floor(Math.min( (50 + Math.log(state.level)*15 ), 99 ));
    }

    return state;
}());

export default state;

