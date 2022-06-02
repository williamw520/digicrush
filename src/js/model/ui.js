/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// UI module
let ui = (function() {
    const ui = {};

    ui.setup = () => {
        updateDim();
    }

    function updateDim() {
        let wglCanvas = document.getElementById("wgl");
        let descDiv   = document.getElementById("desc");
        let dh = descDiv.offsetHeight;
        let w = window.innerWidth * 96/100;
        let h = window.innerHeight - dh * 2;
        if (w/2 < h) {
            h = w/2;
        } else if (w/2 > h) {
            w = h*2;
        }
        wglCanvas.width  = w;
        wglCanvas.height = h;
    }

    return ui;
}());

export default ui;
