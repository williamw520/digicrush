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
const xrot_mats = [];
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
pg.gen_facing_view_mats = (cameraPos) => {
    facing_mats = gen_view_projection(cameraPos);
}
let facing_mats = [];

// Pre-generate facing view+projection matrices based on a camera revolving around the y-axis.
pg.gen_view_projection_mats = (cameraPos, projection) => {
    view_projection_mats = gen_view_projection(cameraPos, projection);
}
let view_projection_mats = [];

function gen_view_projection(cameraPos, projectionMatrix) {
    let resultMatrices = [];
    let modelPosition = [0, 0, 0];  // assume camera is looking at the origin.
    let up = [0, 1, 0];             // constant vector designates "up" so the camera can orient.

    for (let cameraAngleDegree = 0; cameraAngleDegree <= 360; cameraAngleDegree++) {
        let cameraMatrix = m4.rot_y_mat( v2.deg_to_rad(cameraAngleDegree) );
        cameraMatrix = m4.translate(cameraMatrix, cameraPos[0], cameraPos[1], cameraPos[2]);
        let cameraFinalPosition = [
            cameraMatrix[12],       // x
            cameraMatrix[13],       // y
            cameraMatrix[14],       // z
        ];
        let cameraFacingMatrix = m4.lookat_mat(cameraFinalPosition, modelPosition, up);
        let modelFacingView = m4u.inverse4x4(cameraFacingMatrix);    // the view matrix is facing the camera (the inverse of it).
        let viewProjection = projectionMatrix ? m4u.multiply(projectionMatrix, modelFacingView) : modelFacingView;
        resultMatrices[cameraAngleDegree] = viewProjection;
    }
    return resultMatrices;
}

pg.facing_view      = (degree) => facing_mats[ (v2.unit_deg(degree) + 360) % 360 ];
pg.view_projection  = (degree) => view_projection_mats[ (v2.unit_deg(degree) + 360) % 360 ];

export { pg };

