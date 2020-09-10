/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


import {v3} from "/js/engine/vector.js";

// def module
let def = (function() {
    const def = {};

    def.chars = ["1", "2", "3", "4", "5", "6", "@", "*"];
    def.digitLimit = 5;
    def.withRockLimit = 6;
    def.charLimit = 7;

    // flag index to char, 0-5=digits, 6=rock, 7=wildcard, 8=blank
    def.F_ROCK = 6;
    def.F_WILDCARD = 7;
    def.F_BLANK = 8;

    def.T_FLAG = 0;
    def.T_ROCK = 1;
    def.T_WILDCARD = 2;
    def.T_BOMB3 = 3;
    def.T_BOMB4 = 4;
    def.T_WALL = 5;

    def.charType = [def.T_FLAG, def.T_FLAG, def.T_FLAG, def.T_FLAG, def.T_FLAG, def.T_FLAG,
                    def.T_ROCK,
                    def.T_WILDCARD];

    def.SCALE = 0.25;                   // model scale 
    
    def.BEGIN_X = 6.5;
    def.LOSING_X = -5.0;
    def.PLAYING_ANGLE = -15;
    def.MAX_FREE_FLAGS = 100;
    def.SPACE_BETWEEN = 0.6;            // distance between neighboring flags
    def.WAVE_STRENGTH = 0.4;
    def.LIGHT_DIRECTION = v3.unit([0, 0.5, 3.0]);
    def.POWER_ELEVATION = 0.50;
    def.BOMB3_RANGE = 2;
    def.BOMB4_RANGE = 4;

    def.FLAG_BG     = [0.5, 1.0, 0.0, 1.0];
    def.ROCK_BG     = [0.3961, 0.3255, 0.3255, 1.0];     // #655353
    def.BOMB3_BG    = [0.8, 0.8, 0.8, 1.0];
    def.BOMB4_BG    = [0.9, 0.9, 0.9, 1.0];
    def.WALL_BG     = [0.7098, 0.2510, 0.1843, 1.0];     // #B5402F

    return def;
}());

export default def;



