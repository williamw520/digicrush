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
    let vertexCount = 0;
    let flag_attrs = {};
    let flag_uniforms = {};
    let componentsPerVertexAttr = 3;                    // the attribute vector dimension, with (x, y, z).
    let componentsPerTexcoordAttr = 2;                  // the attribute vector dimension, with (u, v).
    let elementSize = Float32Array.BYTES_PER_ELEMENT;

    // stripeCount - number of vertical stripes for the flag.
    // modelScale  - scale the flag mesh (1 - full, 0.01 - really small, >1 - bigger than full size)
    flag_render.setup = (gl, stripeCount, modelScale) => {
        // L.info("stripeCount", stripeCount);
        // L.info("modelScale", modelScale);
        let [vertices, texcoord]  = generateVertices(stripeCount, modelScale);
        // L.info("vertices", vertices);
        // L.info("texcoord", texcoord);

        vertexBuffer    = wgl.uploadToBuffer(gl, vertices);
        texcoordBuffer  = wgl.uploadToBuffer(gl, texcoord);
        vertexCount     = (stripeCount + 1) * 2;
        flagShader      = wgl.createProgram(gl, flag_vert_src, flag_frag_src);
        flag_attrs      = wgl.getAttrMap(gl, flagShader);
        flag_uniforms   = wgl.getUniformMap(gl, flagShader);

        gl.useProgram(flagShader);
        wgl.assignBufferToAttr(gl, vertexBuffer,    flag_attrs.a_position, componentsPerVertexAttr,     gl.FLOAT, false, elementSize * 3, 0);
        wgl.assignBufferToAttr(gl, texcoordBuffer,  flag_attrs.a_texcoord, componentsPerTexcoordAttr,   gl.FLOAT, false, elementSize * 2, 0);

        // L.info("flag_attrs", flag_attrs);
        // L.info("flag_uniforms", flag_uniforms);

        // Set global uniforms during the setup step.
        gl.uniform1f(flag_uniforms.u_model_scale, modelScale);
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

    flag_render.draw = (gl, waveSpeed, textureUnit, background4f, projectionMatrix, facingViewMatrix, worldMatrix) => {
        // assume gl.clear() has been called.
        // gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(flagShader);
        gl.uniform1f(flag_uniforms.u_wave_speed, waveSpeed);
        gl.uniform1f(flag_uniforms.u_item_index, textureUnit);
        gl.uniform1i(flag_uniforms.u_sampler, 0);
        gl.uniform4fv(flag_uniforms.u_background, background4f || [0, 0, 0, 0]);

        // L.info("projectionMatrix", projectionMatrix);
        // L.info("facingViewMatrix", facingViewMatrix);
        // L.info("worldMatrix", worldMatrix);
        gl.uniformMatrix4fv(flag_uniforms.u_projection, false, projectionMatrix);
        gl.uniformMatrix4fv(flag_uniforms.u_facingView, false, facingViewMatrix);
        gl.uniformMatrix4fv(flag_uniforms.u_world,      false, worldMatrix);
        // gl.uniform4fv(rcube_uniforms.u_diffuse, diffuse);
        // gl.uniform3fv(rcube_uniforms.u_lightDirection, lightDirection);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }

    // Create vertical stripes going from left to right.
    // The modelScale determines the dimension of the model space coordinates, [-modelScale, +modelScale].
    // A modelScale of 1 sets the model space coordinates to be the same as the shader clip space [-1 to 1].
    function generateVertices(stripeCount, modelScale) {
        let vertices    = [];
        let texcoord    = [];
        let modelWidth  = modelScale + modelScale;      // the width of [-modelScale, +modelScale].
        L.info("modelWidth", modelWidth);
        let vstep       = modelWidth / stripeCount;     // one fraction step of N-stripes over the model width.
        let tstep       = 1.0 / stripeCount;            // one fraction step of N-stripes over the texture width of 1.
        for (let i = 0; i <= stripeCount; i++) {
            let vx  = -modelScale + vstep * i;          // vx stepping from -modelScale to +modelScale on x-axis.
            let vy1 = -modelScale;
            let vy2 =  modelScale;
            let tx  = 0 + tstep * i;                    // tx stepping from 0 to 1 on x-axis
            vertices.push(vx, vy1, 0,  vx, vy2, 0);     // vy has a fixed height of (-modelScale, +modelScale) on y-axis
            texcoord.push(tx, 0,       tx, 1);          // ty has fixed height of (0, 1) on y-axis.
        }
        return [ new Float32Array(vertices), new Float32Array(texcoord) ];
    }

    return flag_render;
}());

export default flag_render;

