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
    state.S_PLAYING = 1;
    state.S_PAUSED = 2;
    state.S_WON = 3;
    state.S_WON_WAIT = 4;
    state.S_LOST = 5;
    state.S_LOST_WAIT = 6;

    state.gstate = state.S_INIT_WAIT;   // current game state

    state.level = 1;
    state.hitGoal  = 0;
    state.hitCount = 0;

    state.inSeq = 0;                    // remaining counter for spawning flags in sequence
    state.inSeqCh = 0;                  // the digit char to spawn in sequence
    state.inSeqProbability = 0.3;       // probability to spawn in sequence

    state.scoreDisplay = 0;              // current displayed score.
    state.score = 0;                     // the score.

    return state;
}());

export default state;

