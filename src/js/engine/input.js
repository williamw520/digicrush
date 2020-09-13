/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// input module
let input = (function() {
    const input = {};

    let captures    = {};
    let pressed     = {};
    let onkeydown   = (event) => {
        if (captures[event.keyCode]) {
            pressed[event.keyCode] = performance.now();
            return stopEvent(event);
        }
    }
    let onkeyup     = (event) => (delete pressed[event.keyCode], stopEvent(event));

    input.startup   = (window) => {
        window.addEventListener("keydown", onkeydown, false);
        window.addEventListener("keyup", onkeyup, false);
    }

    input.shutdown  = () => {
        window.removeEventListener("keydown", onkeydown);
        window.removeEventListener("keyup", onkeyup);
    }

    input.isOn      = (keyCode) => {
        let flag = pressed[keyCode];
        if (flag)
            delete pressed[keyCode];                    // one key per check.
        return flag;
    }


    const K_DIGITS  = [ 49, 50, 51, 52, 53, 54 ];       // 1, 2, 3, 4, 5, 6
    const K_RIGHT   = [ 85, 73, 79, 74, 75, 76 ];       // u, i, o, j, k, l
    const K_LEFT    = [ 85, 73, 79, 74, 75, 76 ];       // q, w, e, a, s, d
    const keySets   = [ K_DIGITS, K_RIGHT, K_LEFT ];

    input.K_SPACE   = 32;                               // SPACE
    input.K_PAUSE   = 80;                               // p

    [].concat(K_DIGITS, K_RIGHT, K_LEFT, [input.K_PAUSE, input.K_SPACE])
        .forEach( c => captures[c] = true );

    input.digitHit  = (onPressed) => {
        keySets.forEach( keyset => {
            keyset.forEach( (keyCode, i) => {
                if (input.isOn(keyCode)) {
                    onPressed(i);
                }
            });
        } )
    }

    function stopEvent(evt) {
        if (evt) {
            if (evt.stopPropagation)
                evt.stopPropagation();
            if (evt.cancelBubble != null)
                evt.cancelBubble = true;

            if (evt.preventDefault)
                evt.preventDefault();
            evt.returnValue = false;
        }
        return false;
    }

    return input;
}());

export default input;

