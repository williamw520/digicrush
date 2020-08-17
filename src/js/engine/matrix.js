/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// matrix module

const sin = Math.sin;
const cos = Math.cos;

const m4 = {};

m4.scale        = (m, x, y, z)  => multiply4x4(m, scale_mat(x, y, z));
m4.translate    = (m, x, y, z)  => multiply4x4(m, trans_mat(x, y, z));
m4.rotatex      = (m, radian)   => multiply4x4(m, rot_x_mat(radian));
m4.rotatey      = (m, radian)   => multiply4x4(m, rot_y_mat(radian));
m4.rotatez      = (m, radian)   => multiply4x4(m, rot_z_mat(radian));

// Create a 4x4 projection matrix, for projecting fully to the bounding cube (width, height, depth).
// The returning matrix flips the y-axis; y's 0 is at the top.
m4.project_mat  = (w, h, d)     =>  [ 2/w,      0,      0,      0,
                                      0,   -2/h,      0,      0,
                                      0,      0,    2/d,      0,
                                     -1,      1,      0,      1,  ];

m4.perspective  = (fieldOfViewRadian, aspect, near, far) => {
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadian);
    let f1 = f / aspect;
    let f3 = (near + far) / (near - far);
    let f4 = (near * far) / (near - far) * 2;
    return [   f1,      0,      0,      0,
                0,      f,      0,      0,
                0,      0,     f3,     -1,
                0,      0,     f4,      0,  ];
}

// Create a 4x4 scaling matrix, for scaling to the size (x,y,z)
let scale_mat   = (x, y, z)     => [    x,  0,  0,  0,
                                        0,  y,  0,  0,
                                        0,  0,  z,  0,
                                        0,  0,  0,  1,  ];

// Create a 4x4 translation matrix, for moving to the point (x,y,z)
let trans_mat   = (x, y, z)     => [    1,  0,  0,  0,
                                        0,  1,  0,  0,
                                        0,  0,  1,  0,
                                        x,  y,  z,  1,  ];

// Rotate along the x-axis by the radian angle.
let rot_x_mat   = (r)           => [        1,          0,          0,          0,
                                            0,     cos(r),     sin(r),          0,
                                            0,    -sin(r),     cos(r),          0,
                                            0,          0,          0,          1,  ];

// Rotate along the y-axis by the radian angle.
let rot_y_mat   = (r)           => [   cos(r),          0,    -sin(r),          0,
                                       0,          1,          0,          0,
                                       sin(r),          0,     cos(r),          0,
                                       0,          0,          0,          1,  ];

// Rotate along the z-axis by the radian angle.
let rot_z_mat   = (r)           =>  [  cos(r),     sin(r),          0,          0,
                                       -sin(r),     cos(r),          0,          0,
                                       0,          0,          1,          0,
                                       0,          0,          0,          1,  ];

// multiply4x4 two 4x4 matrices, returning a 4x4 matrix.
let multiply4x4 = (a, b) => {
    let a00 = a[0 + 0];
    let a01 = a[0 + 1];
    let a02 = a[0 + 2];
    let a03 = a[0 + 3];
    
    let a10 = a[4 + 0];
    let a11 = a[4 + 1];
    let a12 = a[4 + 2];
    let a13 = a[4 + 3];
    
    let a20 = a[8 + 0];
    let a21 = a[8 + 1];
    let a22 = a[8 + 2];
    let a23 = a[8 + 3];
    
    let a30 = a[12 + 0];
    let a31 = a[12 + 1];
    let a32 = a[12 + 2];
    let a33 = a[12 + 3];

    let b00 = b[0 + 0];
    let b01 = b[0 + 1];
    let b02 = b[0 + 2];
    let b03 = b[0 + 3];
    
    let b10 = b[4 + 0];
    let b11 = b[4 + 1];
    let b12 = b[4 + 2];
    let b13 = b[4 + 3];
    
    let b20 = b[8 + 0];
    let b21 = b[8 + 1];
    let b22 = b[8 + 2];
    let b23 = b[8 + 3];
    
    let b30 = b[12 + 0];
    let b31 = b[12 + 1];
    let b32 = b[12 + 2];
    let b33 = b[12 + 3];

    return [    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,  ];
}

export { m4 };

