/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import wgl from "/js/engine/webgl.js";
import flag_vert_src from "/js/gen/glsl/flag.vert.js";
import flag_frag_src from "/js/gen/glsl/flag.frag.js";


// flag_render module
let flag_render = (function() {
    const flag_render = {};

    let flagShader;
    let vertexBuffer;
    let texcoordBuffer;
    let normalBuffer;
    let vertexCount = 0;
    let flag_attrs = {};
    let flag_uniforms = {};
    let componentsPerVertexAttr = 3;                    // the attribute vector dimension, with (x, y, z).
    let componentsPerTexcoordAttr = 2;                  // the attribute vector dimension, with (u, v).
    let componentsPerNormalAttr = 3;                    // the attribute vector dimension, with (x, y, z).

    flag_render.setupShader = (gl) => {
        flagShader      = wgl.createProgram(gl, flag_vert_src, flag_frag_src);
        flag_attrs      = wgl.getAttrMap(gl, flagShader);
        flag_uniforms   = wgl.getUniformMap(gl, flagShader);
    }

    flag_render.useShader = (gl) => {
        gl.useProgram(flagShader);
    }
    
    // stripeCount - number of vertical stripes for the flag.
    // unitWidth   - the unit width of the model mesh (1 - full, 0.01 - really small, >1 - bigger than full size), for scaling.
    flag_render.setupModel = (gl, stripeCount, unitWidth) => {
        let [vertices,
             texcoord,
             normals]   = generateModel(stripeCount, unitWidth);
        // L.info("vertices", vertices);
        // L.info("texcoord", texcoord);
        // L.info("normals", normals);
        vertexCount     = vertices.length / 3;          // number of vertices is number of vec3 position / 3.
        vertexBuffer    = wgl.uploadToBuffer(gl, vertices);
        texcoordBuffer  = wgl.uploadToBuffer(gl, texcoord);
        normalBuffer    = wgl.uploadToBuffer(gl, normals);
        wgl.assignBufferToAttr(gl, vertexBuffer,    flag_attrs.a_position, componentsPerVertexAttr,     gl.FLOAT, false, 0, 0);
        wgl.assignBufferToAttr(gl, texcoordBuffer,  flag_attrs.a_texcoord, componentsPerTexcoordAttr,   gl.FLOAT, false, 0, 0);
        wgl.assignBufferToAttr(gl, normalBuffer,    flag_attrs.a_normal,   componentsPerNormalAttr,     gl.FLOAT, false, 0, 0);
    }

    // Set up global uniforms.
    // waveStrength - calmest = .99, roughest = 0.01
    flag_render.setupUniforms = (gl, waveStrength, lightDirection, projectionMatrix) => {
        // Set global uniforms during the setup step.
        // L.info("flag_uniforms", flag_uniforms);
        // L.info("lightDirection", lightDirection);
        gl.uniform1f(flag_uniforms.u_wave_strength, waveStrength);
        gl.uniform3fv(flag_uniforms.u_light_direction, lightDirection);
        gl.uniformMatrix4fv(flag_uniforms.u_projection, false, projectionMatrix);
    }

    // E.g. for textureUnitId = gl.TEXTURE0, Call gl.uniform1i(u_sampler, 0) before drawing.
    // E.g. for textureUnitId = gl.TEXTURE1, Call gl.uniform1i(u_sampler, 1) before drawing.
    flag_render.setupTexture = (gl, textureUnitId, image, textureItemsCount) => {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

        let texture = gl.createTexture();
        gl.activeTexture(textureUnitId);        // gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, ...
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        // Set up the number of image items in the texture for the uniform, before the rendering loop.
        // The itemCount doesn't change.
        gl.uniform1f(flag_uniforms.u_item_count, textureItemsCount);
    }

    // imageIndex       - (0, image count)
    // modelPos         - [x, y, z],  [-1 to 1, -1 to 1, -1 to 1]
    // modelScale       - (1, 0.001)
    // modelRotation    - matrix4
    // background4f     - vec4, [R, G, B, A]
    // wavePeriod       - wave progression (0, int), to be to multiply by 2PI in sin(); caller should keep incrementing it with time to produce wave movement.
    flag_render.draw = (gl, imageIndex, modelType, modelPos, modelScale, modelRotation, background4f, facingViewMatrix, wavePeriod) => {
        gl.uniform1i(flag_uniforms.u_sampler, 0);
        gl.uniform1f(flag_uniforms.u_item_index, imageIndex);

        gl.uniform1i(flag_uniforms.u_model_type, modelType);
        gl.uniform1i(flag_uniforms.u_model_type_f, modelType);
        gl.uniform3fv(flag_uniforms.u_model_pos, modelPos);
        gl.uniform1f(flag_uniforms.u_model_scale, modelScale);
        gl.uniformMatrix4fv(flag_uniforms.u_model_rot, false, modelRotation);

        gl.uniform4fv(flag_uniforms.u_background, background4f || [0, 0, 0, 0]);
        gl.uniform1f(flag_uniforms.u_wave_period, wavePeriod);

        // L.info("projectionMatrix", projectionMatrix);
        // L.info("facingViewMatrix", facingViewMatrix);
        // L.info("worldMatrix", worldMatrix);

        gl.uniformMatrix4fv(flag_uniforms.u_facing_view, false, facingViewMatrix);
        
        // gl.uniform4fv(rcube_uniforms.u_diffuse, diffuse);
        // gl.uniform3fv(rcube_uniforms.u_lightDirection, lightDirection);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }

    // Create vertical stripes going from left to right.
    // The unitWidth determines the dimension of the model space coordinates, [-unitWidth, +unitWidth].
    // A unitWidth of 1 sets the model space coordinates to be the same as the shader clip space [-1 to 1].
    function generateModel(stripeCount, unitWidth) {
        let vertices    = [];
        let texcoord    = [];
        let normals     = [];
        let modelWidth  = unitWidth + unitWidth;        // the width of [-unitWidth, +unitWidth].
        let vstep       = modelWidth / stripeCount;     // one fraction step of N-stripes over the model width.
        let tstep       = 1.0 / stripeCount;            // one fraction step of N-stripes over the texture width of 1.
        let vy          = unitWidth;                    // vy has a fixed height of (-unitWidth, +unitWidth) on y-axis
        // Counter-clockwise vertices for front face.
        for (let i = 0; i <= stripeCount; i++) {
            let vx  = -unitWidth + vstep * i;           // vx stepping from -unitWidth to +unitWidth on x-axis.
            let tx  = 0 + tstep * i;                    // tx stepping from 0 to 1 on x-axis
            vertices.push(vx, vy, 0,  vx, -vy, 0);      // vertices go counter-clockwise for front face.
            texcoord.push(tx, 1,      tx, 0);           // ty has fixed height of (0, 1) on y-axis.
            normals.push( 0,  0, -1,  0,  0,  -1);      // normals are a simple 1 on z-axis on flat surface.
        }
        // Clockwise vertices for back face.
        for (let i = stripeCount; i >= 0; i--) {
            let vx  = -unitWidth + vstep * i;           // vx stepping from -unitWidth to +unitWidth on x-axis.
            let tx  = 0 + tstep * i;                    // tx stepping from 0 to 1 on x-axis
            vertices.push(vx, vy, 0,  vx, -vy, 0);      // vertices go clockwise for back face
            texcoord.push(tx, 1,      tx, 0);           // ty has fixed height of (0, 1) on y-axis.
            normals.push( 0,  0,  1,  0,  0,   1);      // normals are a simple 1 on z-axis on flat surface.
        }

        return [ new Float32Array(vertices), new Float32Array(texcoord), new Float32Array(normals) ];
    }

    return flag_render;
}());

export default flag_render;

