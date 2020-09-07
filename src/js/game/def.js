/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// def module
let def = (function() {
    const def = {};

    def.chars = ["1", "2", "3", "4", "5", "6", "@", "*"];
    def.digitCount = 7;
    def.F_ROCK = 6;
    def.F_WILDCARD = 7;

    def.BEGIN_X = 8.0;
    def.LOSING_X = -3.0;
    def.PLAYING_ANGLE = -20;
    def.MAX_FREE_FLAGS = 100;
    def.SPACE_BETWEEN = 0.6;          // distance between neighboring flags
    def.POWER_ELEVATION = 0.15;

    return def;
}());

export default def;



