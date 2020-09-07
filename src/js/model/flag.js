/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import U from "/js/util/util.js";
import {pg} from "/js/engine/pregen.js";
import {v3} from "/js/engine/vector.js";
import A from "/js/engine/animate.js";
import gl3d from "/js/game/gl3d.js";
import state from "/js/game/state.js";
import def from "/js/game/def.js";
import flag_render from "/js/game/flag_render.js";


// Flag states
const S_ACTIVE = 1;
const S_HIT = 2;
const S_FLY = 3;
const S_FUSE = 4;
const S_DEAD = 5;


// flag item
export class Flag {
    constructor(prevFlag) {
        this.bg = [0.5, 1.0, 0.0, 1.0];
        this.hitTime = new A.Timeline(300);     // hit state animation timeout lasts 300ms.
        this.flyTime = new A.Timeline(500);     // fly state animation timeout
        this.fuseTime = new A.Timeline(800);    // fuse state animation timeout
        this.ch = U.rand(0, def.digitCount);    // [1,2,3,4,5,6,@]
        this.type = def.charType[this.ch];
        this.pos = [ (prevFlag ? prevFlag.pos[0] + def.SPACE_BETWEEN : def.BEGIN_X), 0, 0 ];
        this.scale = 0.25;                      // model scale 
        this.xrot = 0;                          // model x-axis rotation
        this.yrot = 0;
        this.velocity = [0, 0, 0];              // velocity vector, distance per tick on [x,y,z]
        this.force = [0, 0, 0];                 // acceleration vector, velocity per tick on [vx,vy,vz]
        this.xrotSpeed = 0;                     // rotation speed in degree.
        this.wavePeriod = Math.random() * 50;
        this.rflag = null;
        this.fuseTarget = null;
        this.fstate = S_ACTIVE;
        this._enforceEleventation();
    }

    setNext(flagToRight) {
        this.rflag = flagToRight;
    }

    isActive()      { return this.fstate == S_ACTIVE    }
    isHit()         { return this.fstate == S_HIT       }
    isFly()         { return this.fstate == S_FLY       }
    isFuse()        { return this.fstate == S_FUSE      }
    isDead()        { return this.fstate == S_DEAD      }
    isInLine()      { return this.fstate == S_ACTIVE || this.fstate == S_HIT }

    toHit() {
        this.hitTime.start(performance.now());
        this.xrotSpeed = 8;
        this.fstate = S_HIT;
    }

    toFly() {
        this.flyTime.start(performance.now());
        this.velocity[1] = 0.05;
        this.velocity[2] = -0.05;
        this.xrotSpeed = 24;
        this.fstate = S_FLY;
    }

    toFuse(fuseTarget) {
        this.fuseTime.start(performance.now());
        this.fuseTarget = fuseTarget;
        this.fstate = S_FUSE;
        this._enforceEleventation();
    }

    toDead() {
        this.fstate = S_DEAD;
    }

    morph(powerType) {
        this.type = powerType;
        if (powerType == def.T_WILDCARD)
            this.ch = 7;
        else
            this.ch = U.rand(0, def.digitCount - 1);
        this._enforceEleventation();
    }

    match(digitIndex) {
        return this.isActive() && (this.ch == digitIndex || this.type == def.T_WILDCARD);
    }

    _enforceEleventation() {
        if (this.type != def.T_FLAG)
            this.pos[1] = def.POWER_ELEVATION;
    }

    onUpdate(time, delta, parent) {
        switch (this.fstate) {
        case S_ACTIVE:
            this._updatePhysics(delta);
            break;
        case S_HIT:
            if (!this.hitTime.step(time)) {
                this.xrotSpeed = 8 + M.floor(6 * A.easeInQuad(this.hitTime.pos));
            } else {
                this.toFly();
            }
            this._updatePhysics(delta);
            break;
        case S_FLY:
            if (!this.flyTime.step(time)) {
                this.scale = 0.25 - 0.15 * A.easeInCubic(this.flyTime.pos);
            } else {
                this.toDead();
            }
            this._updatePhysics(delta);
            break;
        case S_FUSE:
            if (!this.fuseTime.step(time)) {
                this.velocity =v3.scale(v3.unit(v3.sub(this.fuseTarget.pos, this.pos)), 0.1);
            } else {
                this.toDead();
            }
            this._updatePhysics(delta);
            break;
        case S_DEAD:
            break;
        }
    }

    onDraw() {
        if (!this.isDead()) {
            let modelRotation = pg.xrot(this.xrot);
            flag_render.draw(gl3d.gl, this.ch, this.pos, this.scale, modelRotation, this.bg, gl3d.facingView(), this.wavePeriod);
        }
    }

    _updatePhysics(delta) {
        this._adjustToNeighbors();
        v3.addTo(this.pos, this.velocity);
        v3.addTo(this.velocity, this.force);
        this.wavePeriod += delta * 0.001;
        this.xrot += this.xrotSpeed;
    }
    
    _adjustToNeighbors() {
        if (this.isInLine()) {
            if (this.rflag) {
                let xdelta = this.rflag.pos[0] - this.pos[0];
                if (xdelta < (def.SPACE_BETWEEN - 0.01)) {
                    this.velocity[0] = -0.01;
                    this.pos[0] = this.rflag.pos[0] - def.SPACE_BETWEEN + 0.01;
                } else if (xdelta > (def.SPACE_BETWEEN + 0.01)) {
                    this.velocity[0] =  0.10;
                }
                else {
                    this.velocity[0] = -0.01;
                }
            } else {
                this.velocity[0] = -0.01;
            }
        }
    }

}


