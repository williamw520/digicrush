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

    // 40 chars + 24 = 64 chars.  64 x 256 = 16384, the height of the texture canvas.
    // Pad 24 chars to force to 64 chars, so the texture height can be 16384, which should be power of 2.
    def.chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ@$* -!.......;.........;....".split("");
    def.charIndex = def.chars.reduce( (map, ch, i) => (map[ch] = i, map), {} );

    def.digitBegin = 0;
    def.digitLimit = 5;
    def.digit0Limit = 9;
    def.alphaBegin = 10;

    // Flag index to char
    def.F_ZERO = 9;
    def.F_ROCK = 36;
    def.F_CASH = 37;
    def.F_WILDCARD = 38;
    def.F_BLANK = 39;

    // Convert the text string to texture indices.  Only works on upper case letters and digits.
    def.numIndex    = n => n == 0 ? def.F_ZERO : n - 1;
    def.alphaIndex  = l => def.alphaBegin + (l.charCodeAt(0) - 65);
    def.textIndices = text => text.split("").map( ch => def.charIndex[ch] );
    // L.info(def.textIndices("ABCWXYZ@$* ").map( i => def.chars[i] ));
    // L.info(def.textIndices("123890").map( i => def.chars[i] ));

    def.T_FLAG = 0;
    def.T_ROCK = 1;
    def.T_WILDCARD = 2;
    def.T_BOMB3 = 3;
    def.T_BOMB4 = 4;
    def.T_FORT_O = 5;
    def.T_FORT_I = 6;
    def.T_FORT_I2 = 7;
    def.T_WCHAR = 8;                    // wavy character
    def.T_CHAR  = 9;                    // non-wavy character
    def.T_404 = 10;

    def.SCALE = 0.25;                   // model scale 
    
    def.BEGIN_X = 6.5;
    def.LOSING_X = -3.0;
    def.PLAYING_ANGLE = -15;
    def.SPACE_BETWEEN = 0.6;            // distance between neighboring flags
    def.WAVE_STRENGTH = 0.4;
    def.LIGHT_DIRECTION = v3.unit([-2.5, 0.5, 3.0]);    // Note: the light direction needs to be updated in opposite of the camera angle.
                                                        // Now when the camera swings around, the light source goes with it and only the dark side of the model is showing.
    def.POWER_ELEVATION = 0.50;
    def.BOMB3_RANGE = 2;
    def.BOMB4_RANGE = 4;
    def.FORT_O_X = -2.05;
    def.FORT_I_X = -2.0;
    def.FORT_O_SCALE = 0.125;
    def.FORT_I_SCALE = 0.1;
    def.CASH_X = -3.5;
    def.CASH_SCALE = 0.5;
    def.SCORE_X = 4.0;
    def.SCORE_Y = 3.4;
    def.SCORE_Z = -2.5;
    def.SCORE_W = 0.3;                  // score char scale
    def.GOAL_X = 2.5;
    def.LEVEL_X = 1;
    def.LABEL_X = 0.5;
    def.POPUP_X = 0;
    def.POPUP_Y = 0;
    def.POPUP_Z = 2.6;
    def.POPUP_W = 0.075;                // popup char scale
    def.POPUP_N = 14;                   // char count

    def.makeFg = (flagType) => {
        switch(flagType) {
        case def.T_FLAG:        return [0.0, 0.0, 1.0, 1.0];
        case def.T_ROCK:        return [1.0, 1.0, 0.5, 1.0];
        case def.T_BOMB3:       return [1.0, 1.0, 1.0, 1.0];
        case def.T_BOMB4:       return [1.0, 1.0, 1.0, 1.0];
        case def.T_404:         return [1.0, 1.0, 1.0, 1.0];
        case def.T_WCHAR:       return [0, 1, 0, 1];
        case def.T_CHAR:        return [1, 1, 1, 1];
        default:                return [0, 0, 0, 1];
        }
    }

    def.makeBg = (flagType) => {
        switch(flagType) {
        case def.T_FLAG:        return [0.5, 1.0, 0.0, 1.0];
        case def.T_ROCK:        return [0.3961, 0.3255, 0.3255, 1.0];    // #655353
        case def.T_WILDCARD:    return [0.5, 1.0, 0.0, 1.0];
        case def.T_BOMB3:       return [0.8, 0.8, 0.8, 1.0];
        case def.T_BOMB4:       return [0.9, 0.9, 0.9, 1.0];
        case def.T_404:         return [0.9, 0.9, 0.9, 1.0];
        case def.T_FORT_O:      return [0.8157, 0.8196, 0.8235, 1.0];    // #D0D1D2
        case def.T_FORT_I:      return [0.1765, 0.9765, 0.9765, 1.0];
        case def.T_FORT_I2:     return [1.0, 1.0, 1.0, 1.0];
        case def.T_WCHAR:       return [0.9765, 0.6588, 0.2471, 1.0];    // #F9A83F
        case def.T_CHAR:        return [0, 0, 0, 1];
        default:                return [0.5, 1.0, 0.0, 1.0];
        }
    }

    return def;
}());

export default def;



