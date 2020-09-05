/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// game state module
let state = (function() {
    const state = {};

    state.BEGIN_X = 6.0;
    state.LOSING_X = -4.0;
    state.MAX_FREE_FLAGS = 20;

    state.S_WAITING = 0;
    state.S_PLAYING = 1;
    state.S_PAUSED = 2;
    state.S_WON = 3;
    state.S_DEAD = 4;

    state.level = 1;
    state.status = state.S_WAITING;

    return state;
}());

export default state;

