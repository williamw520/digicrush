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

    state.BEGIN_X = 8.0;
    state.LOSING_X = -3.0;
    state.PLAYING_ANGLE = -20;
    state.MAX_FREE_FLAGS = 100;
    state.SPACE_BETWEEN = 0.6;          // distance between neighboring flags

    // Game states
    state.S_WAITING = 0;
    state.S_PLAYING = 1;
    state.S_PAUSED = 2;
    state.S_WON = 3;
    state.S_DEAD = 4;
    state.gstate = state.S_WAITING;    // current game state

    state.level = 1;

    return state;
}());

export default state;

