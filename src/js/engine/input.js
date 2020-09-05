/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// input module
let input = (function() {
    const input = {};

    let pressed     = {};
    let onkeydown   = (event) => pressed[event.keyCode] = performance.now();
    let onkeyup     = (event) => delete pressed[event.keyCode];

    input.startup   = (window) => {
        window.addEventListener("keydown", onkeydown, false);
        window.addEventListener("keyup", onkeyup, false);
    }

    input.shutdown  = () => {
        window.removeEventListener("keydown", onkeydown);
        window.removeEventListener("keyup", onkeyup);
    }

    input.isOn      = (keyCode) => pressed[keyCode];


    const K_DIGITS  = [ 49, 50, 51, 52, 53, 54 ];       // 1, 2, 3, 4, 5, 6
    const K_RIGHT   = [ 85, 73, 79, 74, 75, 76 ];       // u, i, o, j, k, l
    const K_LEFT    = [ 85, 73, 79, 74, 75, 76 ];       // q, w, e, a, s, d
    const keySets   = [ K_DIGITS, K_RIGHT, K_LEFT ];

    input.K_RUN     = 82;                               // r
    input.K_PAUSE   = 80;                               // p

    input.digitHit  = (onPressed) => {
        keySets.forEach( keyset => {
            keyset.forEach( (keyCode, i) => {
                if (input.isOn(keyCode)) {
                    onPressed(i);
                }
            });
        } )
    }

    return input;
}());

export default input;

