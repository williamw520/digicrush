/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of unit tests.
import util from "/js/util/util.js";
import wgl from "/js/engine/webgl.js";
import {v2, v3} from "/js/engine/vector.js";
import {BaseNode} from "/js/engine/basenode.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/game/world.js";
import {UI} from "/js/game/ui.js";
import {m4} from "/js/engine/matrix.js";

import test2d_vert from "/js/glsl/test2d.vert.js";
import test2d_frag from "/js/glsl/test2d.frag.js";
import test3d_vert from "/js/glsl/test3d.vert.js";
import test3d_frag from "/js/glsl/test3d.frag.js";
import test3d from "/js/data/test3d.js";

// L.info("Running tests");


let c = document.getElementById("game");
let w = new World();
let u = new UI();
let e = new Engine(c, w, u);


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

let color = [M.random(), M.random(), M.random(), 1];
let translation = [10, 5];
gl.uniform2f(test2d_uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
gl.uniform4fv(test2d_uniforms.u_color, color);
gl.uniform2fv(test2d_uniforms.u_translation, translation);

let offset = 0;
let count = 18;  // 6 triangles in the 'F', 3 points per triangle
gl.drawArrays(gl.TRIANGLES, offset, count);

for (let i = 0; i < 10; i++) {
    translation[0] = i * 120;
    gl.uniform2fv(test2d_uniforms.u_translation, translation);
    gl.drawArrays(gl.TRIANGLES, offset, count);
}    


let test3d_shader = wgl.createProgram(gl, test3d_vert, test3d_frag);
let test3d_attrs = wgl.getAttrMap(gl, test3d_shader);
let test3d_uniforms = wgl.getUniformMap(gl, test3d_shader);
L.info(test3d_attrs);
L.info(test3d_uniforms);

let mesh3dBuffer  = wgl.uploadToBuffer(gl, test3d.mesh);
let color3dBuffer = wgl.uploadToBuffer(gl, test3d.color);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

gl.useProgram(test3d_shader);
wgl.assignBufferToAttr(gl, mesh3dBuffer,  test3d_attrs.a_position, 3, gl.FLOAT, false, 0, 0);
wgl.assignBufferToAttr(gl, color3dBuffer, test3d_attrs.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

translation = [45,  50, 0];
var rotation = [degToRad(40), degToRad(25), degToRad(325)];
var scale = [1, 1, 1];
var fudgeFactor = 1;

var matrix = m4.project_mat(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
matrix = m4.rotatex(matrix, rotation[0]);
matrix = m4.rotatey(matrix, rotation[1]);
matrix = m4.rotatez(matrix, rotation[2]);
matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

// Set the matrix.
gl.uniformMatrix4fv(test3d_uniforms.u_matrix, false, matrix);

// // Set the fudgeFactor
// gl.uniform1f(fudgeLocation, fudgeFactor);

gl.drawArrays(gl.TRIANGLES, 0, 16*6);


e.start();

setTimeout(() => e.stop(), 1000);

