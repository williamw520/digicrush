/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of unit tests.
import util from "/js/util/util.js";
import wgl from "/js/engine/webgl-util.js";
import {Vec2} from "/js/engine/vec2.js";
import {BaseNode} from "/js/engine/basenode.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/game/world.js";
import {UI} from "/js/game/ui.js";
import m4 from "/js/engine/m4.js";

import test2d_vert from "/js/glsl/test2d.vert.js";
import test2d_frag from "/js/glsl/test2d.frag.js";
import test3d_vert from "/js/glsl/test3d.vert.js";
import test3d_frag from "/js/glsl/test3d.frag.js";

// L.info("Running tests");

// L.info(new Vec2(3, 4).len);
// L.info(new Vec2(1, 1).unit);
// L.info(new Vec2(1, 1).radian);
// L.info(new Vec2(1, 2).radian);
// L.info(new Vec2(-1, 2).radian);
// L.info(new Vec2(-1, -2).radian);
// L.info(new Vec2(-1, 9).radian);
// L.info(new Vec2(1, 1).scale(2));

// L.info(new Vec2(1, 1).asUnit());
// L.info(new Vec2(1, 1).asUnit().asUnit());


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

let color = [MA.random(), MA.random(), MA.random(), 1];
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

let mesh3d = new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0
]);

let color3d = new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220
    ]);

let mesh3dBuffer  = wgl.uploadToBuffer(gl, mesh3d);
let color3dBuffer = wgl.uploadToBuffer(gl, color3d);

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

var matrix = m4.project(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
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

