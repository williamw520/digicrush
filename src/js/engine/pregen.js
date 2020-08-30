/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {v2, v3} from "/js/engine/vector.js";
import {m4} from "/js/engine/matrix.js";
import {m4u} from "/js/engine/matrix-util.js";

// pre-generated data module

const sin = Math.sin;
const cos = Math.cos;

const pg = {};


// Pre-generate the x,y-rotation matrices for every degree.
const yrot_mats = [];
const yrot_mats = [];

pg.gen_rot_mats = () => {
    for (let degree = 0; degree <= 360; degree++) {
        xrot_mats.push(m4.rot_x_mat(v2.deg_to_rad(degree)));
        yrot_mats.push(m4.rot_y_mat(v2.deg_to_rad(degree)));
    }
}

pg.xrot = (degree) => xrot_mats[ (v2.unit_deg(degree) + 360) % 360 ];
pg.yrot = (degree) => yrot_mats[ (v2.unit_deg(degree) + 360) % 360 ];


// Pre-generate facing view matrices based on a camera revolving around the y-axis.
pg.gen_facing_view_mats = (cameraPosX, cameraPosY, cameraPosZ) => {
    let modelPosition = [0, 0, 0];  // assume camera is looking at the origin.
    let up = [0, 1, 0];             // constant vector designates "up" so the camera can orient.

    for (let cameraAngleDegree = 0; cameraAngleDegree <= 360; cameraAngleDegree++) {
        let cameraPosMatrix = m4.rot_y_mat( v2.deg_to_rad(cameraAngleDegree) );
        cameraPosMatrix = m4.translate(cameraPosMatrix, cameraPosX, cameraPosY, cameraPosZ);
        let cameraPosition = [
            cameraPosMatrix[12],
            cameraPosMatrix[13],
            cameraPosMatrix[14],
        ];
        let cameraFacingMatrix = m4.lookat_mat(cameraPosition, modelPosition, up);
        let facingView = m4u.inverse4x4(cameraFacingMatrix);    // the view matrix is facing the camera (the inverse of it).
        facing_mats[cameraAngleDegree] = facingView;
    }
}
const facing_mats = [];

pg.facing_view = (degree) => facing_mats[ (v2.unit_deg(degree) + 360) % 360 ];


export { pg };

