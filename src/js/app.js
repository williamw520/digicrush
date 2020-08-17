/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of the JS app.  Rollup starts from here to include all other module imports.
import U from "/js/util/util.js";
import wgl from "/js/engine/webgl.js";
import {v2, v3} from "/js/engine/vector.js";
import {m4} from "/js/engine/matrix.js";
import {BaseNode} from "/js/engine/basenode.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/game/world.js";
import {UI} from "/js/game/ui.js";

import test2d_vert from "/js/glsl/test2d.vert.js";
import test2d_frag from "/js/glsl/test2d.frag.js";


// app module
let MD = (function() {
    const MD    = {};
    const log   = new L.Logger("app");

let abc = m4.scale(null, 1,1,1);

let gl = document.getElementById("wgl").getContext("webgl");
let mesh = new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
]);
let meshBuffer = wgl.uploadToBuffer(gl, mesh);
L.info(meshBuffer);

let test2d_shader = wgl.createProgram(gl, test2d_vert, test2d_frag);
let test2d_attrs = wgl.getAttrMap(gl, test2d_shader);
let test2d_uniforms = wgl.getUniformMap(gl, test2d_shader);

L.info(test2d_attrs);
L.info(test2d_uniforms);

//webglUtils.resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(test2d_shader);
wgl.assignBufferToAttr(gl, meshBuffer, test2d_attrs.a_position, 2, gl.FLOAT, false, 0, 0);

let color = [MA.random(), MA.random(), MA.random(), 1];
let translation = [10, 5];
gl.uniform2f(test2d_uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
gl.uniform4fv(test2d_uniforms.u_color, color);
gl.uniform2fv(test2d_uniforms.u_translation, translation);

let offset = 0;
let count = 18;  // 6 triangles in the 'F', 3 points per triangle
gl.drawArrays(gl.TRIANGLES, offset, count);

    
    L.info("module loaded");
    return MD;

}());

export default MD;
