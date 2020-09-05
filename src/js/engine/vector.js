/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// vector module

const M = Math;

const v2 = {};
v2.len      = (a)       => M.sqrt(a[0] * a[0] + a[1] * a[1]);               // the magnitude of the vector.
v2.unit     = (a)       => { let l=v2.len(a); return l > 0.000001 ? [  a[0]/l, a[1]/l ] : [0, 0] }  // the unit vector; avoid divide by 0.
v2.normal   = (a)       => { let l=v2.len(a); return l > 0.000001 ? [ -a[1]/l, a[0]/l ] : [0, 0] }  // the normal vector; perpendicular unit vector.
v2.rad      = (a)       => M.atan2(a[1], a[0]);                             // the radian angle counter-clockwise from x-axis, from -pi to pi.
v2.from_rad = (r)       => [ M.cos(r),     M.sin(r)    ];                   // the unit vector converted from the radian angle; inverse of rad().
v2.add      = (a, b)    => [ a[0] + b[0],  a[1] + b[1] ];                   // add two vectors
v2.sub      = (a, b)    => [ a[0] - b[0],  a[1] - b[1] ];                   // subtract two vectors
v2.scale    = (a, s)    => [ a[0] * s,     a[1] * s    ];                   // scale the vector by a scaling factor.
v2.dot      = (a, b)    => a[0]*b[0] + a[1]*b[1];                           // dot product of two vectors; magnitude of two vectors.

v2.rad_to_deg   = (r)   => r * 180 / M.PI;
v2.deg_to_rad   = (d)   => d * M.PI / 180;
v2.unit_deg     = (d)   => d % 360;                                         // normalize degree to within -360 to 360

const v3 = {};
v3.len      = (a)       => M.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); // the magnitude of the vector.
v3.unit     = (a)       => { let l=v3.len(a); return l > 0.000001 ? [  a[0]/l, a[1]/l, a[2]/l ] : [0, 0, 0] }   // the unit vector; avoid divide by 0.
v3.normal   = (a)       => { let l=v3.len(a); return l > 0.000001 ? [ -a[1]/l, a[0]/l, a[2]/l ] : [0, 0, 0] }   // the normal vector; perpendicular unit vector.
v3.add      = (a, b)    => [ a[0] + b[0],  a[1] + b[1],  a[2] + b[2] ];     // add two vectors
v3.addTo    = (a, b)    => (a[0] += b[0],  a[1] += b[1], a[2] += b[2], a);  // add vector b to a, in place.
v3.sub      = (a, b)    => [ a[0] - b[0],  a[1] - b[1],  a[2] - b[2] ];     // subtract two vectors
v3.scale    = (a, s)    => [ a[0] * s,     a[1] * s,     a[2] * s    ];     // scale the vector by a scaling factor.
v3.dot      = (a, b)    => a[0]*b[0] + a[1]*b[1] + a[2]*b[2] ;              // dot product of two vectors, their vector magnitude.
v3.cross    = (a, b)    => [ a[1]*b[2] - a[2]*b[1],                         // cross product of the two vectors, their perpendicular normal vector.
                             a[2]*b[0] - a[0]*b[2],
                             a[0]*b[1] - a[1]*b[0] ];

export { v2, v3 };

