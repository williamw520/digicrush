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
const S_FLYING = 3;
const S_FUSING = 4;
const S_BOMBED = 5;
const S_DEAD = 7;

let workingPos = [0, 0, 0];                     // working vector

// flag item
export class Flag {
    constructor(prevFlag) {
        this.setupTimelines();
        this.bg = [0.5, 1.0, 0.0, 1.0];
        this.ch = U.rand(0, def.withRockLimit); // [1,2,3,4,5,6,@]
        this.type = def.charType[this.ch];
        if (U.rand(0, 8) == 0) {
            this.type = def.T_BOMB3;
            this.ch = U.rand(0, def.digitLimit);
            L.info("rand bomb ch=" + this.ch);
        }
        this.pos = [ (prevFlag ? prevFlag.pos[0] + def.SPACE_BETWEEN : def.BEGIN_X), 0, 0 ];
        this.offset = [0, 0, 0];
        this.scale = 0.25;                      // model scale 
        this.xrot = 0;                          // model x-axis rotation
        this.yrot = 0;
        this.velocity = [0, 0, 0];              // velocity vector, distance per tick on [x,y,z]
        this.force = [0, 0, 0];                 // acceleration vector, velocity per tick on [vx,vy,vz]
        this.xrotSpeed = 0;                     // rotation speed in degree.
        this.wavePeriod = Math.random() * 50;
        this.rflag = null;
        this.fuseTarget = null;
        this.fusePowerType = 0;
        this.fstate = S_ACTIVE;
        this._enforceEleventation();
    }

    setupTimelines() {
        this.hitTime = new A.Timeline(250);     // hit state animation timeout lasts 300ms.
        this.flyTime = new A.Timeline(500);     // fly state animation timeout
        this.bombTime = new A.Timeline(500);    // bomb state animation timeout
        this.fuseTime = new A.Timeline(200);    // fuse state animation timeout
    }

    clone() {
        let c = Object.assign(Object.create( Object.getPrototypeOf(this)), this);
        c.setupTimelines();
        c.bg = [...this.bg];
        c.pos = [...this.pos];
        c.offset = [...this.offset];
        c.velocity = [...this.velocity];
        c.force = [...this.force];
        return c;
    }

    setNext(flagToRight) {
        this.rflag = flagToRight;
    }

    isActive()      { return this.fstate == S_ACTIVE    }
    isHit()         { return this.fstate == S_HIT       }
    isFlying()      { return this.fstate == S_FLYING    }
    isFusing()      { return this.fstate == S_FUSING    }
    isBombed()      { return this.fstate == S_BOMBED    }
    isDead()        { return this.fstate == S_DEAD      }
    isInLine()      { return this.fstate == S_ACTIVE || this.fstate == S_HIT || this.fstate == S_FUSING || this.fstate == S_BOMBED }

    toHit() {
        this.hitTime.start(performance.now());
        this.xrotSpeed = 8;
        this.fstate = S_HIT;
    }

    toFlying() {
        this.flyTime.start(performance.now());
        this.velocity[1] = 0.05;
        this.velocity[2] = -0.05;
        this.xrotSpeed = 24;
        this.fstate = S_FLYING;
    }

    toFlyingRnd() {
        this.flyTime.start(performance.now(), 1000);
        this.velocity[0] = 0.2 * (U.rand(-50, 50)/100);
        this.velocity[1] = 0.2 * (U.rand(-50, 50)/100);
        this.velocity[2] = 0.2 * (U.rand(-50, 50)/100);
        this.xrotSpeed = U.rand(0, 6);
        this.scale = 0.125;
        this.bg[0] = U.rand(0, 255) / 255;
        this.bg[1] = U.rand(0, 255) / 255;
        this.bg[2] = U.rand(0, 255) / 255;
        this.ch = def.F_BLANK;
        this.fstate = S_FLYING;
    }

    toBombed() {
        this.bombTime.start(performance.now());
        this.fstate = S_BOMBED;
    }

    toFuse(fuseTarget, powerType) {
        this.fuseTime.start(performance.now());
        this.fuseTarget = fuseTarget;
        this.fusePowerType = powerType;
        this.fstate = S_FUSING;
        this._enforceEleventation();
    }

    toDead() {
        this.fstate = S_DEAD;
    }

    morph(powerType) {
        this.fstate = S_ACTIVE
        this.type = powerType;
        if (powerType == def.T_WILDCARD) {
            L.error("morph to wildcard");
            this.ch = def.F_WILDCARD;
        } else {
            this.ch = U.rand(0, def.digitLimit);
        }
    }

    match(digitIndex) {
        return this.isActive() && (this.ch == digitIndex || this.type == def.T_WILDCARD);
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
                this.toFlying();
            }
            this._updatePhysics(delta);
            break;
        case S_FLYING:
            if (!this.flyTime.step(time)) {
                this.scale -= 0.015 * A.easeInCubic(this.flyTime.pos);
            } else {
                this.toDead();
            }
            this._updatePhysics(delta);
            break;
        case S_FUSING:
            if (!this.fuseTime.step(time)) {
                v3.setTo(this.offset, this.fuseTarget.pos);
                v3.subFrom(this.offset, this.pos);
                v3.scaleTo(this.offset, this.fuseTime.pos);
            } else {
                if (this.fuseTarget == this) {
                    this.morph(this.fusePowerType);
                } else {
                    this.toDead();
                }
            }
            this._updatePhysics(delta);
            break;
        case S_BOMBED:
            if (this.bombTime.step(time)) {
                this.toDead();
            }
            this._updatePhysics(delta);
            break;
        case S_DEAD:
            break;
        }
    }

    onDraw() {
        if (!this.isDead() && !this.isBombed()) {
            let modelRotation = pg.xrot(this.xrot);
            v3.setTo(workingPos, this.pos);
            v3.addTo(workingPos, this.offset);
            flag_render.draw(gl3d.gl, this.ch, workingPos, this.scale, modelRotation, this.bg, gl3d.facingView(), this.wavePeriod);
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

    _enforceEleventation() {
        if (this.type == def.T_BOMB3 ||
            this.type == def.T_BOMB4 || 
            this.isFusing()) {
            this.pos[1] = 0.10;
        }
    }
}

