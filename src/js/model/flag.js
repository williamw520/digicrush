/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import U from "/js/util/util.js";
import {BaseNode} from "/js/engine/basenode.js";
import {pg} from "/js/engine/pregen.js";
import {v3} from "/js/engine/vector.js";
import gl3d from "/js/game/gl3d.js";
import state from "/js/game/state.js";
import flag_render from "/js/game/flag_render.js";


const S_FREE = 0;
const S_ACTIVE = 1;
const S_HIT = 2;
const S_DEAD = 3;


// flag item
export class Flag extends BaseNode {
    constructor(imageIndex) {
        super();
        this.ch = imageIndex || 0;          // char image index, 0-based.
        this.scale = 0.25;                  // model scale 
        this.bg = [0.5, 1.0, 0.0, 1.0];
        this.status = S_FREE;
    }

    activate(prevFlag) {
        this.ch = U.rand(0, gl3d.digitCount);
        this.pos = [ (prevFlag ? prevFlag.pos[0] + state.SPACE_BETWEEN : state.BEGIN_X), 0, 0 ];
        L.info("pos", this.pos);
        this.velocity = [0, 0, 0];          // velocity vector, distance per tick on [x,y,z]
        this.xrot = 0;
        this.yrot = 0;
        this.wavePeriod = Math.random() * 50;
        this.rflag = null;
        this.hitTime = 0;
        this.status = S_ACTIVE;
    }

    setRNeighbor(flagToRight) {
        this.rflag = flagToRight;
    }

    isFree()    { return this.status == S_FREE      }
    isActive()  { return this.status == S_ACTIVE    }
    isHit()     { return this.status == S_HIT       }
    isDead()    { return this.status == S_DEAD      }
    isAlive()   { return this.status == S_ACTIVE || this.status == S_HIT }

    toFree() {
        this.status = S_FREE;
        return this;
    }

    toHit() {
        this.hitTime = performance.now();
        this.status = S_HIT;
    }

    toDead() {
        this.status = S_DEAD;
    }

    onUpdate(delta, parent) {
        if (this.status == S_HIT) {
            this.xrot += 12;
            if (performance.now() - this.hitTime > 300) {
                this.toDead();
            }
        }

        this._adjustVelocity();
        v3.addTo(this.pos, this.velocity);
        this.wavePeriod += delta * 0.001;

        super.onUpdate(delta, parent);
    }

    onDraw() {
        let modelRotation = pg.xrot(this.xrot);
        flag_render.draw(gl3d.gl, this.ch, this.pos, this.scale, modelRotation, this.bg, gl3d.facingView(), this.wavePeriod);
        super.onDraw();         // run onDraw() on child nodes.
    }

    _adjustVelocity() {
        if (this.rflag) {
            let xdelta = this.rflag.pos[0] - this.pos[0];
            if (xdelta < (state.SPACE_BETWEEN - 0.01)) {
                this.velocity[0] = -0.01;
                //this.pos[0] = this.rflag.pos[0] - state.SPACE_BETWEEN + 0.01;
            } else if (xdelta > (state.SPACE_BETWEEN + 0.01)) {
                this.velocity[0] =  0.05;
            }
            else {
                this.velocity[0] = -0.01;
            }
        } else {
            this.velocity[0] = -0.01;
        }
    }

}

