/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// global module
let G = (function() {
    const G = {};

    // Call G.setup() right after the page load event before anything else.
    G.setup = () => {
        let W = window;
        window.W = W;
        W.D = document;
        W.M = Math;
        W.L = console;
        W.assert = console.assert;
    }

    G.setup();      // call it once to do best effort setup asap; page load event handler will call it again to finalize the setup.

    return G;
}());

export default G;
