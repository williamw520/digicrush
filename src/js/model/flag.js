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
const S_ANIMATE = 2;
const S_NOMOVE = 3;
const S_HIT = 4;
const S_FLYING = 5;
const S_FUSING = 6;
const S_BOMBED = 7;
const S_LOST = 8;

let workingPos = [0, 0, 0];                     // working vector

// flag item
export class Flag {
    constructor(type, pos) {
        this.type = type;
        this.pos = pos;
        this.offset = [0, 0, 0];
        this.ch = def.F_BLANK;
        this.scale = def.SCALE;
        this.xrot = 0;                          // model x-axis rotation
        this.yrot = 0;
        this.rotMatrix = null;
        this.velocity = [0, 0, 0];              // velocity vector, distance per tick on [x,y,z]
        this.force = [0, 0, 0];                 // acceleration vector, velocity per tick on [vx,vy,vz]
        this.xrotSpeed = 0;                     // rotation speed in degree.
        this.wavePeriod = Math.random() * 50;
        this.rflag = null;
        this.fuseTarget = null;
        this.toPowerType = 0;
        this.elevated = false;
        this.bg = def.makeBg(this.type);        // default bg
        this.fg = def.makeFg(this.type);
        this.timeline = new A.Timeline(500);
        this.animateDir = 1;
        this.fstate = S_ACTIVE;
    }

    clone() {
        let c = Object.assign(Object.create( Object.getPrototypeOf(this)), this);
        c.pos = [...this.pos];
        c.offset = [...this.offset];
        c.velocity = [...this.velocity];
        c.force = [...this.force];
        c.bg = [...this.bg];
        c.fg = [...this.fg];
        c.timeline = new A.Timeline(500);
        return c;
    }

    setNext(flagToRight) {
        this.rflag = flagToRight;
    }

    isActive()      { return this.fstate == S_ACTIVE    }
    isHit()         { return this.fstate == S_HIT       }
    isBombed()      { return this.fstate == S_BOMBED    }
    isDead()        { return this.fstate == S_LOST      }

    isInLine()      { return this.fstate == S_ACTIVE || this.fstate == S_HIT || this.fstate == S_FUSING || this.fstate == S_BOMBED }

    toHit() {
        this.timeline.start(performance.now(), 250);
        this.xrotSpeed = 8;
        this.fstate = S_HIT;
    }

    toFlying() {
        this.timeline.start(performance.now(), 700);
        this.velocity[1] = 0.05;
        this.velocity[2] = -0.05;
        this.xrotSpeed = 24;
        this.fstate = S_FLYING;
    }

    toFlyingRnd() {
        this.timeline.start(performance.now(), 1000);
        this.velocity[0] = 0.2 * (U.rand(-50, 50)/100);
        this.velocity[1] = 0.2 * (U.rand(-50, 50)/100);
        this.velocity[2] = 0.2 * (U.rand(-50, 50)/100);
        this.xrotSpeed = U.rand(0, 6);
        this.scale = def.SCALE / 2;
        this.bg[0] = U.rand(0, 255) / 255;
        this.bg[1] = U.rand(0, 255) / 255;
        this.bg[2] = U.rand(0, 255) / 255;
        this.ch = def.F_BLANK;
        this.fstate = S_FLYING;
        return this;
    }

    toBombed() {
        this.timeline.start(performance.now(), 300);
        this.fstate = S_BOMBED;
    }

    toFuse(fuseTarget, postFusePowerType, toCh, elevated) {
        this.timeline.start(performance.now(), 200);
        this.fuseTarget = fuseTarget;
        this.toPowerType = postFusePowerType;
        if (toCh != null)
            this.ch = toCh;
        this.elevated = elevated;
        this.fstate = S_FUSING;
    }

    toDead() {
        this.fstate = S_LOST;
        state.score++;
    }

    morphBomb(bombType) {
        this.fstate = S_ACTIVE
        this.type = bombType;
        if (this.ch > def.digit0Limit)
            this.ch = U.rand(0, def.digitLimit);
        this.offset[0] = 0;
        this.offset[1] = this.elevated ? 0.1 : 0;
        this.offset[2] = 0;
        this.bg = def.makeBg(this.type);
        this.fg = def.makeFg(this.type);
    }

    match(digitIndex) {
        return this.isActive() && (this.ch == digitIndex || this.type == def.T_WILDCARD);
    }

    onUpdate(time, delta, parent) {
        switch (this.type) {
        case def.T_BOMB3:
            break;
        case def.T_BOMB4:
        case def.T_404:
            // Cycle the color of the bomb's ring.
            this.bg[0] = (Math.cos(time / 100) + 1) / 2;
            this.bg[1] = (Math.sin(time / 100) + 1) / 2;
            this.bg[2] = (Math.sin(time / 100) + 1) / 2;
            break;
        }
        
        switch (this.fstate) {
        case S_ACTIVE:
            this._updatePhysics(delta);
            break;
        case S_ANIMATE:                             // this is item's internal animation; animation at item group level should be done in World.
            this._updatePhysics(delta);
            break;
        case S_NOMOVE:
            // no _updatePhysics and no timeline
            break;
        case S_HIT:
            if (!this.timeline.step(time)) {
                this.xrotSpeed = 8 + Math.floor(6 * A.easeInQuad(this.timeline.pos));
            } else {
                this.toFlying();
            }
            this._updatePhysics(delta);
            break;
        case S_FLYING:
            if (!this.timeline.step(time)) {
                this.scale -= 0.015 * A.easeInCubic(this.timeline.pos);
            } else {
                this.toDead();
                break;
            }
            this._updatePhysics(delta);
            break;
        case S_FUSING:
            if (!this.timeline.step(time)) {
                v3.setTo(this.offset, this.fuseTarget.pos);
                v3.subFrom(this.offset, this.pos);
                v3.scaleTo(this.offset, this.timeline.pos);
            } else {
                if (this.toPowerType > 0) {
                    this.morphBomb(this.toPowerType);
                } else {
                    this.toDead();
                    break;
                }
            }
            this._updatePhysics(delta);
            break;
        case S_BOMBED:
            if (this.timeline.step(time)) {
                this.toDead();
                break;
            }
            this._updatePhysics(delta);
            break;
        case S_LOST:
            break;
        }
    }

    onDraw() {
        if (!this.isDead() && !this.isBombed()) {
            let modelRotation = this.rotMatrix ? this.rotMatrix : pg.xrot(this.xrot);
            v3.setTo(workingPos, this.pos);
            v3.addTo(workingPos, this.offset);
            flag_render.draw(gl3d.gl, this.ch, this.type, workingPos, this.scale, modelRotation, this.fg, this.bg, gl3d.facingView(), this.wavePeriod);
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


export let FF = (function() {
    const FF = {};

    FF.makeFlag = (prevFlag) => {
        let pos = [ def.BEGIN_X, 0, 0 ];       // always starts at BEGIN_X
        if (prevFlag) {
            if (pos[0] - prevFlag.pos[0] < def.SPACE_BETWEEN)
                pos[0] = prevFlag.pos[0] + def.SPACE_BETWEEN;  // if previous one is too close, adjust starting pos to the right a bit.
        }

        let f;
        if (state.inSeq > 0) {
            let f = new Flag(def.T_FLAG, pos);
            f.ch = state.inSeqCh;
            state.inSeq--;
            return f;
        }

        if (Math.random() < state.inSeqProbability) {
            // For next spawn
            state.inSeq = U.rand(2, 5);
            state.inSeqCh = U.rand(0, def.digitLimit);
        }

        let dice = Math.random();
        if (dice < 0.80) {
            f = new Flag(def.T_FLAG, pos);
            f.ch = U.rand(0, def.digitLimit);
        } else if (dice >= .80 && dice < .93) {
            f = new Flag(def.T_ROCK, pos);
            f.ch = def.F_ROCK;
        } else if (dice >= .93 && dice < .98) {
            f = new Flag(def.T_BOMB3, pos);
            f.ch = U.rand(0, def.digitLimit);
            f.morphBomb(def.T_BOMB3);
        } else {
            f = new Flag(def.T_BOMB4, pos);
            f.ch = U.rand(0, def.digitLimit);
            f.morphBomb(def.T_BOMB4);
        }

        return f;
    }

    FF.makeFort = (type, pos, scale, rotMatrix) => {
        let f = new Flag(type, pos);
        f.fstate = S_ANIMATE;
        f.scale = scale;
        f.rotMatrix = rotMatrix;
        f.ch = def.F_BLANK;
        return f;
    }

    FF.makeChar = (chr, pos, scale, rotMatrix, wavy) => {
        let f = new Flag(wavy ? def.T_WCHAR : def.T_CHAR, pos);
        f.ch = def.charIndex[chr];
        f.fstate = S_ANIMATE;
        f.scale = scale;
        f.rotMatrix = rotMatrix;
        return f;
    }

    return FF;
}());
