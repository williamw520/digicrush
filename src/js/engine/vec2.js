/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// vec2 module.

const M  = Math;

// 2-dimension vector.
export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static ofRad(r) { return new Vec2(M.cos(r), M.sin(r)) }                         // create the unit vector from the radian angle; inverse of radian().

    // Immutable operations
    get len()       { return M.sqrt(this.x * this.x + this.y * this.y) }            // return the magnitude of the vector.
    get radian()    { return M.atan2(this.y, this.x)    }                           // the radian angle counter-clockwise from x-axis, from -pi to pi.
    get unit()      { return this.clone().asUnit()      }                           // return the unit vector.
    clone()         { return new Vec2(this.x, this.y)   }
    adding(b)       { return this.clone().add(b)        }                           // return a new vec by adding two vectors.
    subing(b)       { return this.clone().sub(b)        }
    scaling(s)      { return this.clone().scale(s)      }

    // Mutable operations
    add(b)          { this.x += b.x; this.y += b.y; return this }                   // add a vector into the current vector.
    sub(b)          { this.x -= b.x; this.y -= b.y; return this }
    scale(s)        { this.x *= s;   this.y *= s;   return this }
    asUnit()        { let l = this.len; this.x /= l; this.y /= l; return this }     // make the current vector as unit vector.

}

