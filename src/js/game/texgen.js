/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import U from "/js/util/util.js";
import def from "/js/game/def.js";


// texgen module
let texgen = (function() {
    const texgen = {};

    let canvas;
    let ctx;
    let fontSize    = def.fontSize;
    let lineWidth   = def.charDim;
    let lineHeight  = def.charDim;

    texgen.setup = (canvasId, lineW, lineH) => {
        canvas = document.getElementById(canvasId);
        lineWidth  = lineW || def.charDim;
        lineHeight = lineH || def.charDim;
        let textCanvasWidth  = lineWidth;
        let textCanvasHeight = lineHeight * def.chars.length;   // the height of the texture canvas.  128 x 64 = 8192
        canvas.width  = U.ensurePowerOf2(textCanvasWidth);
        canvas.height = U.ensurePowerOf2(textCanvasHeight);

        ctx = canvas.getContext("2d");

        ctx.fillStyle = "#808080"; 	// text color; doesn't matter, the frag shader will use any non-black pixels from black background.
        ctx.textAlign = "center";	// center alignment of text
        ctx.textBaseline = "middle";	// text baseline at middle
        ctx.font = fontSize + "px monospace";
    }

    texgen.drawGrid = () => {
        ctx.strokeStyle = "#ff0000";
        for (let y = lineHeight; y < canvas.height; y += lineHeight) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(lineWidth, y);
            ctx.stroke();
        }
    }

    texgen.drawAt = (text, lineNumber) => {
        let originY = lineHeight * (lineNumber - 1);
        let centerY = originY + fontSize / 1.4 + 2;             // adjust this against the font size.
        let centerX = (lineWidth / 2) * 0.98;
        // L.info("lineWidth", lineWidth);
        // L.info("ctx.measureText(text).width", ctx.measureText(text).width);
        // L.info("centerX", centerX);
        // L.info("centerY", centerY);
        ctx.fillText(text, centerX, centerY);
    }

    texgen.textureCanvas    = () => canvas;
    texgen.lineWidth        = () => lineWidth;
    texgen.lineHeight       = () => lineHeight;

    return texgen;
}());

export default texgen;

