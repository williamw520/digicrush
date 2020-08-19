/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {v2, v3} from "/js/engine/vector.js";
import {m4u} from "/js/engine/matrix-util.js";

// matrix module

const sin = Math.sin;
const cos = Math.cos;

const m4 = {};

m4.scale        = (m, x, y, z)  => m4u.multiply4x4(m, m4.scale_mat(x, y, z));
m4.translate    = (m, x, y, z)  => m4u.multiply4x4(m, m4.trans_mat(x, y, z));
m4.rotatex      = (m, radian)   => m4u.multiply4x4(m, m4.rot_x_mat(radian));
m4.rotatey      = (m, radian)   => m4u.multiply4x4(m, m4.rot_y_mat(radian));
m4.rotatez      = (m, radian)   => m4u.multiply4x4(m, m4.rot_z_mat(radian));

// Create a 4x4 projection matrix, for projecting fully to the bounding cube (width, height, depth).
// The returning matrix flips the y-axis; y's 0 is at the top.
m4.project_mat  = (w, h, d)     =>  [ 2/w,      0,      0,      0,
                                      0,   -2/h,      0,      0,
                                      0,      0,    2/d,      0,
                                     -1,      1,      0,      1,  ];

m4.perspective  = (fieldOfViewAngle, aspect, near, far) => {
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewAngle);        // fieldOfViewAngle radian 
    let f1 = f / aspect;
    let f3 = (near + far) / (near - far);
    let f4 = (near * far) / (near - far) * 2;
    return [   f1,      0,      0,      0,
                0,      f,      0,      0,
                0,      0,     f3,     -1,
                0,      0,     f4,      0,  ];
}

m4.lookat_mat = (cameraPosition, target, up) => {
    let z_axis = v3.unit(v3.sub(cameraPosition, target));
    let x_axis = v3.unit(v3.cross(up, z_axis));
    let y_axis = v3.unit(v3.cross(z_axis, x_axis));
    return [    x_axis[0],          x_axis[1],          x_axis[2],          0,
                y_axis[0],          y_axis[1],          y_axis[2],          0,
                z_axis[0],          z_axis[1],          z_axis[2],          0,
                cameraPosition[0],  cameraPosition[1],  cameraPosition[2],  1, ];
}

// Create a 4x4 scaling matrix, for scaling to the size (x,y,z)
m4.scale_mat   = (x, y, z)     => [    x,  0,  0,  0,
                                        0,  y,  0,  0,
                                        0,  0,  z,  0,
                                        0,  0,  0,  1,  ];

// Create a 4x4 translation matrix, for moving to the point (x,y,z)
m4.trans_mat   = (x, y, z)     => [    1,  0,  0,  0,
                                        0,  1,  0,  0,
                                        0,  0,  1,  0,
                                        x,  y,  z,  1,  ];

// Rotate along the x-axis by the radian angle.
m4.rot_x_mat    = (r)           => [        1,          0,          0,          0,
                                            0,     cos(r),     sin(r),          0,
                                            0,    -sin(r),     cos(r),          0,
                                            0,          0,          0,          1,  ];

// Rotate along the y-axis by the radian angle.
m4.rot_y_mat    = (r)           => [   cos(r),          0,    -sin(r),          0,
                                            0,          1,          0,          0,
                                       sin(r),          0,     cos(r),          0,
                                            0,          0,          0,          1,  ];

// Rotate along the z-axis by the radian angle.
m4.rot_z_mat    = (r)           =>  [  cos(r),     sin(r),          0,          0,
                                      -sin(r),     cos(r),          0,          0,
                                            0,          0,          1,          0,
                                            0,          0,          0,          1,  ];

m4.v4_multiply_m4 = (v, m) => {
    let b = [0.0, 0.0, 0.0, 0.0];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            b[i] += v[j] * m[j * 4 + i];
        }
    }
    return b;
}


export { m4 };

