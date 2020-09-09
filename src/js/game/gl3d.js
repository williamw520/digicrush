/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


import {v2, v3} from "/js/engine/vector.js";
import {m4, m4u} from "/js/engine/matrix.js";
import {pg} from "/js/engine/pregen.js";
import texgen from "/js/game/texgen.js";
import def from "/js/game/def.js";
import flag_render from "/js/game/flag_render.js";


// gl3d life cycle module
let gl3d = (function() {
    const gl3d = {};

    let gl = document.getElementById("wgl").getContext("webgl");

    gl3d.setup = () => {
        let unitWidth = 1;

        flag_render.setupShader(gl);
        flag_render.useShader(gl);
        flag_render.setupModel(gl, texgen.lineWidth() / 4, unitWidth); // generate the model data.

        // generate the texture images; set up the texture in webgl.
        texgen.setup("tex");
        def.chars.forEach((tx, i) => texgen.drawAt(tx, (i+1)));
        flag_render.setupTexture(gl, gl.TEXTURE0, texgen.textureCanvas(), def.chars.length);

        // compuate the projection matix.
        const fieldOfViewRadians = v2.deg_to_rad(60);                   // how wide the cone of view is.
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;  // correct the apsect of the model by projecting with the aspect of the client view dimension
        const zNear = 1;                                                // the near-side boundary of the z-axis
        const zFar = 20;                                                // the far-size boundary of the z-axis
        let projection = m4.perspective_mat(fieldOfViewRadians, aspect, zNear, zFar);
        flag_render.setupUniforms(gl, def.WAVE_STRENGTH, def.LIGHT_DIRECTION, projection);

        var cameraPos = [0, 0, 4];                          // position the camera at x=0, y=0, z=3-off from the surface outside the [-1, 1] visible bound.
        pg.gen_rot_mats();
        pg.gen_facing_view_mats(cameraPos);                 // position the camera at x=0, y=0, z=2-off from the surface.
        pg.gen_view_projection_mats(cameraPos, projection);
    }

    gl3d.cameraAngle = 0;                                               // angle to turn the camera along the y-axis

    gl3d.facingView  = () => pg.facing_view(gl3d.cameraAngle);

    gl3d.gl = gl;

    gl3d.start = () => {
        // Set the color for the clear() operation to transparent.
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        //gl.clearColor(1.0, 0.0, 0.0, 1.0);                            // red background
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    return gl3d;
}());

export default gl3d;

