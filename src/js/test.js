/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of unit tests.
import U from "/js/util/util.js";
import wgl from "/js/engine/webgl.js";
import {v2, v3} from "/js/engine/vector.js";
import {BaseNode} from "/js/engine/basenode.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/game/world.js";
import {UI} from "/js/game/ui.js";
import {m4} from "/js/engine/matrix.js";
import {m4u} from "/js/engine/matrix-util.js";

import test2d_vert from "/js/gen/glsl/test2d.vert.js";
import test2d_frag from "/js/gen/glsl/test2d.frag.js";
import test3d_vert from "/js/gen/glsl/test3d.vert.js";
import test3d_frag from "/js/gen/glsl/test3d.frag.js";
import rcube_vert from "/js/gen/glsl/rcube.vert.js";
import rcube_frag from "/js/gen/glsl/rcube.frag.js";

import flag_render from "/js/game/flag_render.js";

import texgen from "/js/game/texgen.js";


let gl = document.getElementById("wgl").getContext("webgl");



// //import test3d from "/js/data/test3d.js";
// //import cube from "/js/data/cube.js";
// //import test3d from "/js/data/cube.js";
// import rcube_data from "/js/gen/model/rcube.js";

// // L.info("Running tests");


// let c = document.getElementById("game");
// let w = new World();
// let u = new UI();
// let e = new Engine(c, w, u);


// // let mesh = new Float32Array([
// //           // left column
// //           0, 0,
// //           30, 0,
// //           0, 150,
// //           0, 150,
// //           30, 0,
// //           30, 150,

// //           // top rung
// //           30, 0,
// //           100, 0,
// //           30, 30,
// //           30, 30,
// //           100, 0,
// //           100, 30,

// //           // middle rung
// //           30, 60,
// //           67, 60,
// //           30, 90,
// //           30, 90,
// //           67, 60,
// //           67, 90,
// // ]);
// // let meshBuffer = wgl.uploadToBuffer(gl, mesh);
// // L.info(meshBuffer);

// // let test2d_shader = wgl.createProgram(gl, test2d_vert, test2d_frag);
// // let test2d_attrs = wgl.getAttrMap(gl, test2d_shader);
// // let test2d_uniforms = wgl.getUniformMap(gl, test2d_shader);
// // L.info(test2d_attrs);
// // L.info(test2d_uniforms);

// // //webglUtils.resizeCanvasToDisplaySize(gl.canvas);
// // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// // gl.clear(gl.COLOR_BUFFER_BIT);


// // gl.useProgram(test2d_shader);
// // wgl.assignBufferToAttr(gl, meshBuffer, test2d_attrs.a_position, 2, gl.FLOAT, false, 0, 0);

// // let color = [M.random(), M.random(), M.random(), 1];
// // let translation = [10, 5];
// // gl.uniform2f(test2d_uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
// // gl.uniform4fv(test2d_uniforms.u_color, color);
// // gl.uniform2fv(test2d_uniforms.u_translation, translation);

// // let offset = 0;
// // let count = 18;  // 6 triangles in the 'F', 3 points per triangle
// // gl.drawArrays(gl.TRIANGLES, offset, count);

// // for (let i = 0; i < 10; i++) {
// //     translation[0] = i * 120;
// //     gl.uniform2fv(test2d_uniforms.u_translation, translation);
// //     gl.drawArrays(gl.TRIANGLES, offset, count);
// // }    


// let test3d_shader = wgl.createProgram(gl, test3d_vert, test3d_frag);
// let test3d_attrs = wgl.getAttrMap(gl, test3d_shader);
// let test3d_uniforms = wgl.getUniformMap(gl, test3d_shader);

// let rcube_shader = wgl.createProgram(gl, rcube_vert, rcube_frag);
// let rcube_attrs = wgl.getAttrMap(gl, rcube_shader);
// let rcube_uniforms = wgl.getUniformMap(gl, rcube_shader);
// L.info("rcube_attrs", rcube_attrs);
// L.info("rcube_uniforms", rcube_uniforms);


// // let pointCount = rcube.mesh.length;
// // L.info("pointCount: " + pointCount);

// let pointCount = rcube_data.geometries[0].data.position.length
// L.info("pointCount: " + pointCount);

// let rcube = {};
// rcube.position = new Float32Array(rcube_data.geometries[0].data.position);
// rcube.texcoords = new Float32Array(rcube_data.geometries[0].data.texcoord);
// rcube.normal    = new Float32Array(rcube_data.geometries[0].data.normal);
// rcube.color     = new Float32Array(rcube_data.geometries[0].data.color);


//   // Center the F around the origin and Flip it around. We do this because
//   // we're in 3D now with and +Y is up where as before when we started with 2D
//   // we had +Y as down.

//   // We could do by changing all the values above but I'm lazy.
//   // We could also do it with a matrix at draw time but you should
//   // never do stuff at draw time if you can do it at init time.
//   var flip_matrix = m4.rot_x_mat(Math.PI);
//   flip_matrix = m4.translate(flip_matrix, -50, -75, -15);
//   for (var ii = 0; ii < rcube.position.length; ii += 3) {
//     var vector = m4.v4_multiply_m4([rcube.position[ii + 0], rcube.position[ii + 1], rcube.position[ii + 2], 1], flip_matrix);
//     rcube.position[ii + 0] = vector[0];
//     rcube.position[ii + 1] = vector[1];
//     rcube.position[ii + 2] = vector[2];
//   }

// let mesh3dBuffer  = wgl.uploadToBuffer(gl, rcube.position);
// let color3dBuffer = wgl.uploadToBuffer(gl, rcube.color);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

// gl.useProgram(rcube_shader);
// wgl.assignBufferToAttr(gl, mesh3dBuffer,  rcube_attrs.a_position,  3, gl.FLOAT, false, 0, 0);
// wgl.assignBufferToAttr(gl, color3dBuffer, rcube_attrs.a_color,     3, gl.FLOAT, false, 0, 0);


var fieldOfViewRadians = v2.deg_to_rad(90);    // how wide the cone of view is.

var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;    // correct the apsect of the model by projecting with the aspect of the client view dimension
var zNear = 1;                                                  // the near-side boundary of the z-axis
var zFar = 2000;                                                // the far-size boundary of the z-axis
var projection = m4.perspective_mat(fieldOfViewRadians, aspect, zNear, zFar);   // perspective projection to make far things appear far and near things appear near.

let radius = 200;

// Compute the position of the first F
var fPosition = [0, 0, 0];



// // Use matrix math to compute a position on a circle where the camera is.
// var cameraAngleDegree = 0;                                         // angle to turn the camera along the y-axis
// var cameraAngleRadian = v2.deg_to_rad(cameraAngleDegree);
// var cameraPosMatrix = m4.rot_y_mat(cameraAngleRadian);              // turn the camera to the angle along the y-axis
// cameraPosMatrix = m4.translate(cameraPosMatrix, -200, 200, 200);    // move the camera to the position (left-right, up-down, far-near)

// var cameraPosition = [          // Save the camera's position after the computation.
//     cameraPosMatrix[12],        // the new positions are in the last 3 elements of the computated matrix.
//     cameraPosMatrix[13],
//     cameraPosMatrix[14],
// ];

// // Compute the camera's matrix using look at.
// var up = [0, 1, 0];             // constant vector designates "up" so the camera can orient.
// var cameraFacingMatrix = m4.lookat_mat(cameraPosition, fPosition, up);

// // Make a view matrix from the camera matrix
// var facingView = m4u.inverse4x4(cameraFacingMatrix);    // the view matrix is facing the camera (the inverse of it).



// // Compute a view projection matrix
// var viewProjectionMatrix = m4u.multiply(projection, facingView);

// let time = new Date().getTime();
// let timeSec = time / 1000;
// let world = m4.rot_y_mat(timeSec);
// // world = m4.translate(u_world, ...objOffset);
// let diffuse = [1.0, 1.0, 1.0, 1.0];
// let lightDirection = v3.unit([-1, 3, 5]);

// console.log("diffuse", diffuse);
// console.log("lightDirection", lightDirection);

// // var numFs = 4;
// // for (var ii = 0; ii < numFs; ++ii) {
// //     var angle = ii * Math.PI * 2 / numFs;
// //     var x = Math.cos(angle) * (radius);
// //     var z = Math.sin(angle) * (radius);
// //     console.log("(x z)", x, z);
    
// //     // starting with the view projection matrix
// //     // compute a matrix for the F
// //     //matrix = m4.translate(viewProjectionMatrix, x, 0, z);
// //     //console.log("matrix", matrix);
    
// //     //world = m4.translate(m4.rot_y_mat(angle), x, 0, z);
// //     //world = m4.translate(m4.rot_y_mat(angle), x, 0, z);
// //     world = m4.trans_mat(x, 0, z-50);

// //     gl.uniformMatrix4fv(rcube_uniforms.u_projection, false, projection);
// //     gl.uniformMatrix4fv(rcube_uniforms.u_facingView, false, facingView);
// //     gl.uniformMatrix4fv(rcube_uniforms.u_world, false, world);
// //     gl.uniform4fv(rcube_uniforms.u_diffuse, diffuse);
// //     gl.uniform3fv(rcube_uniforms.u_lightDirection, lightDirection);

// //     // Draw the geometry.
// //     gl.drawArrays(gl.TRIANGLES, 0, pointCount / 3);
// // }



// // translation = [45,  50, 0];
// // var rotation = [v2.deg_to_rad(40), v2.deg_to_rad(25), v2.deg_to_rad(325)];
// // var scale = [1, 1, 1];
// // var fudgeFactor = 1;

// // var matrix = m4.project_mat(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
// // matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
// // matrix = m4.rotatex(matrix, rotation[0]);
// // matrix = m4.rotatey(matrix, rotation[1]);
// // matrix = m4.rotatez(matrix, rotation[2]);
// // matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

// // // Set the matrix.
// // gl.uniformMatrix4fv(test3d_uniforms.u_matrix, false, matrix);

// // // // Set the fudgeFactor
// // // gl.uniform1f(fudgeLocation, fudgeFactor);

// // gl.drawArrays(gl.TRIANGLES, 0, 16*6);


texgen.setup("tex");
//texgen.drawGrid();
["1", "2", "3", "4", "5", "6", "@", "$"].forEach((tx, i) => texgen.drawAt(tx, (i+1)));


//let images = U.loadImages(["/img/d1.png", "/img/d2.png", "/img/d3.png"], function(images){
let images = U.loadImages(["/img/d1.png"], function(images){

    L.info("projection", projection);
    
    let lightDirection = v3.unit([3, 3.0, -3.0]);
    L.info("lightDirection", lightDirection);
        
    let worldDim = { width: gl.canvas.clientWidth,  height: gl.canvas.clientHeight };
    L.info("worldDim", worldDim);

//  let world = m4.trans_mat(64, 128, 0);
    let world = m4.trans_mat(0.0, 0.0, 0);

    let worldMat = m4.identity_mat();
    let flagPos     = [ [-1.5, -0.2, 0], [1.5, 0.5, 0] ];
    let flagXRot    = [ 0, 0 ];
    let flagYRot    = [ 0, 0 ];
    let flagZRot    = [ 0, 0 ];
    let flagScale   = [ 0.5, 0.5 ];

    let worldToModelRatio = 4;
    //let modelScale = worldDim.width / (worldToModelRatio * 2);
    let modelScale = 1
    flag_render.setup(gl, images[0].width/16, modelScale);
    flag_render.setupUniforms(gl, modelScale, lightDirection);
    flag_render.setupTexture(gl, gl.TEXTURE0, texgen.textureCanvas(), 8);

    // images.forEach( (image, i) => {
    //     flag_render.setupTexture(gl, gl.TEXTURE0 + i, image);
    // });

    var speed = 1

    var stop = false
    var timeLast = Date.now()
    var startTime = timeLast;
    var timeNow
    var delta
    var fps = 70
    var interval = 1000 / fps

    var waveSpeed = 0;
    var textureUnit = 0;
    var background4f = [0.5, 1.0, 0.0, 1.0];


// Use matrix math to compute a position on a circle where the camera is.
var cameraAngleDegree = 0;                                          // angle to turn the camera along the y-axis
var cameraAngleRadian = v2.deg_to_rad(cameraAngleDegree);
var cameraPosMatrix = m4.rot_y_mat(cameraAngleRadian);              // turn the camera to the angle along the y-axis
// camera position, x moves to -200, y moves to 200, z moves to 200.
cameraPosMatrix = m4.translate(cameraPosMatrix, -200, 200, 200);    // move the camera to the position (left-right, up-down, far-near)

var cameraPosition = [          // Save the camera's position after the computation.
    cameraPosMatrix[12],        // the new positions are in the last 3 elements of the computated matrix.
    cameraPosMatrix[13],
    cameraPosMatrix[14],
];

// Compute the camera's matrix using look at.
var up = [0, 1, 0];             // constant vector designates "up" so the camera can orient.
var cameraFacingMatrix = m4.lookat_mat(cameraPosition, fPosition, up);

// Make a view matrix from the camera matrix
var facingView = m4u.inverse4x4(cameraFacingMatrix);    // the view matrix is facing the camera (the inverse of it).
    

    // Set the color for the clear() operation to transparent.
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        flag_render.draw(gl, waveSpeed, textureUnit, background4f, projection, facingView, world);

        flagPos.forEach( (pos, i) => {
            let w = m4.trans_set(worldMat, pos);
            w = m4.scale_set1(w, flagScale[i]);
            w = m4.rot_x_set(w, flagXRot[i]);
            // w = m4.rot_y_set(w, flagYRot[i]);
            //w = m4.rot_z_set(w, flagZRot[i]);
            //L.info(w);
            flag_render.draw(gl, waveSpeed, textureUnit, background4f, projection, facingView, w);
        });
        
    }

    function tick() {
        if (stop) return false
        timeNow = Date.now()
        delta = timeNow - timeLast
        if (delta > interval) {
            timeLast = timeNow
            waveSpeed += delta * 0.001 * speed;
            draw()
            if (timeNow - startTime > 2000) {
                startTime = timeNow;
                textureUnit = (textureUnit + 1) % 8;
            }

            //world = m4.translate(world, 0.01, 0, 0);
            //world = m4.translate(world, 0, 0.01, 0);
            //world = m4.translate(world, 0, 0, 0.01);
            //world = m4.scale(world, 0.95, 0.95, 1);

            flagXRot[0] += 0.05;
            flagXRot[1] -= 0.05;
            flagYRot[0] += 0.02;
            flagYRot[1] -= 0.02;
            flagZRot[0] += 0.05;
            flagZRot[1] -= 0.05;
            
            //cameraAngleDegree += 1;
            cameraAngleRadian = v2.deg_to_rad(cameraAngleDegree);
            cameraPosMatrix = m4.rot_y_mat(cameraAngleRadian);
            cameraPosMatrix = m4.translate(cameraPosMatrix, 0, 0, 200);
            //cameraPosMatrix = m4.translate(cameraPosMatrix, -200, 200, 200);
            cameraPosition = [
                cameraPosMatrix[12],
                cameraPosMatrix[13],
                cameraPosMatrix[14],
            ];
            cameraFacingMatrix = m4.lookat_mat(cameraPosition, fPosition, up);
            facingView = m4u.inverse4x4(cameraFacingMatrix);    // the view matrix is facing the camera (the inverse of it).

        }
        requestAnimationFrame(tick)
    }

    draw()
    tick()

    setTimeout(() => {
        stop = true;
    }, 1000*20);
    
})

// e.start();

// setTimeout(() => e.stop(), 1000);

