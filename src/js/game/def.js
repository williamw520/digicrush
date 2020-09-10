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

    def.chars = ["1", "2", "3", "4", "5", "6", "@", "$"];
    def.digitLimit = 5;

    // flag index to char, 0-5=digits, 6=rock, 7=cash, 8=blank, 9=wildcard
    def.F_ROCK = 6;
    def.F_CASH = 7;
    def.F_BLANK = 8;
    def.F_WILDCARD = 9;

    def.T_FLAG = 0;
    def.T_ROCK = 1;
    def.T_WILDCARD = 2;
    def.T_BOMB3 = 3;
    def.T_BOMB4 = 4;
    def.T_FORT_O = 5;
    def.T_FORT_I = 6;
    def.T_CASH = 7;

    def.SCALE = 0.25;                   // model scale 
    
    def.BEGIN_X = 6.5;
    def.LOSING_X = -3.5;
    def.PLAYING_ANGLE = -15;
    def.SPACE_BETWEEN = 0.6;            // distance between neighboring flags
    def.WAVE_STRENGTH = 0.4;
    def.LIGHT_DIRECTION = v3.unit([-2.5, 0.5, 3.0]);
    def.POWER_ELEVATION = 0.50;
    def.BOMB3_RANGE = 2;
    def.BOMB4_RANGE = 4;
    def.FORT_O_X = -2.0;
    def.FORT_I_X = -2.0;
    def.FORT_O_SCALE = 0.125;
    def.FORT_I_SCALE = 0.1;
    def.CASH_X = -3.5;
    def.CASH_SCALE = 0.5;

    def.FLAG_BG     = [0.5, 1.0, 0.0, 1.0];
    def.ROCK_BG     = [0.3961, 0.3255, 0.3255, 1.0];    // #655353
    def.BOMB3_BG    = [0.8, 0.8, 0.8, 1.0];
    def.BOMB4_BG    = [0.9, 0.9, 0.9, 1.0];
    def.FORT_O_BG   = [0.8157, 0.8196, 0.8235, 1.0];    // #D0D1D2
    def.FORT_I_BG   = [0.1765, 0.9765, 0.9765, 1.0];
    def.CASH_BG     = [0.9765, 0.6588, 0.2471, 1.0];    // #F9A83F

    def.makeBg = (flagType) => {
        switch(flagType) {
        case def.T_FLAG:        return [...def.FLAG_BG];
        case def.T_ROCK:        return [...def.ROCK_BG];
        case def.T_WILDCARD:    return [...def.FLAG_BG];
        case def.T_BOMB3:       return [...def.BOMB3_BG];
        case def.T_BOMB4:       return [...def.BOMB4_BG];
        case def.T_FORT_O:      return [...def.FORT_O_BG];
        case def.T_FORT_I:      return [...def.FORT_I_BG];
        case def.T_CASH:        return [...def.CASH_BG];
        default:                return [...def.FLAG_BG];
        }
    }

    return def;
}());

export default def;



