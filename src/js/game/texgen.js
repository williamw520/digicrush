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
    let fontSize = 256;                  // size in pixel
    let lineWidth  = 256;
    let lineHeight = 256;

    texgen.setup = (canvasId, lineW, lineH) => {
        canvas = document.getElementById(canvasId);
        canvas.width  = U.ensurePowerOf2(canvas.width);
        canvas.height = U.ensurePowerOf2(canvas.height);
        L.info(canvas.height);
        lineWidth = lineW || 256;
        lineHeight = lineH || 256;

        ctx = canvas.getContext("2d");

        ctx.fillStyle = "#333333"; 	// text colour
        ctx.textAlign = "center";	// center alignment of text
        ctx.textBaseline = "middle";	// text baseline at middle
        ctx.font = fontSize + "px monospace";
    }

    texgen.drawGrid = () => {
        for (let y = lineHeight; y < canvas.height; y += lineHeight) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(lineWidth, y);
            ctx.stroke();
        }
    }

    texgen.drawAt = (text, lineNumber) => {
        let originY = lineHeight * (lineNumber - 1);
        let centerY = originY + fontSize / 1.8;
        let centerX = lineWidth / 2;
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

