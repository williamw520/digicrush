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
    let vertexCount = 0;
    let flag_attrs = {};
    let flag_uniforms = {};
    let componentsPerVertexAttr = 2;                    // the attribute vector dimension.
    let elementSize = Float32Array.BYTES_PER_ELEMENT;

    flag_render.setup = (gl, stripeCount) => {
        let vertices    = generateVertices(stripeCount);
        vertexBuffer    = wgl.uploadToBuffer(gl, vertices);
        vertexCount     = (stripeCount + 1) * 2;
        flagShader      = wgl.createProgram(gl, flag_vert_src, flag_frag_src);
        flag_attrs      = wgl.getAttrMap(gl, flagShader);
        flag_uniforms   = wgl.getUniformMap(gl, flagShader);
        gl.useProgram(flagShader);
        wgl.assignBufferToAttr(gl, vertexBuffer, flag_attrs.a_position, componentsPerVertexAttr, gl.FLOAT, false, elementSize * 2, 0);
        L.info("flag_attrs", flag_attrs);
        L.info("flag_uniforms", flag_uniforms);
    }

    // E.g. for textureUnitId = gl.TEXTURE0, Call gl.uniform1i(u_sampler, 0) before drawing.
    // E.g. for textureUnitId = gl.TEXTURE1, Call gl.uniform1i(u_sampler, 1) before drawing.
    flag_render.setupTexture = (gl, textureUnitId, image) => {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

        let texture = gl.createTexture()
        gl.activeTexture(textureUnitId);        // gl.TEXTURE0
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    }

    flag_render.draw = (gl, distance, textureUnit) => {
        // assume gl.clear() has been called.
        // gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(flagShader);
        gl.uniform1f(flag_uniforms.u_distance, distance);
        gl.uniform1i(flag_uniforms.u_sampler, textureUnit);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }

    // Create vertical stripes going from left to right.
    function generateVertices(stripeCount) {
        let array  = []
        let step   = 2 / stripeCount;           // one fraction step of N-stripes over the length of 2.
        for (let i = 0; i <= stripeCount; i++) {
            let x  = -1 + step * i;             // from -1 to 1 on x-axis
            array.push(x, -1,  x, 1);           // add 2 vertices; y-axis with fixed height of 2.
        }
        return new Float32Array(array);
    }

    
    return flag_render;
}());

export default flag_render;

