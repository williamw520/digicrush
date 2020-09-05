/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import U from "/js/util/util.js";
import {BaseNode} from "/js/engine/basenode.js";
import {pg} from "/js/engine/pregen.js";
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
        this.pos = [ (prevFlag ? prevFlag.pos[0] + 0.6 : state.BEGIN_X), 0, 0 ];
        this.xrot = 0;
        this.yrot = 0;
        this.wavePeriod = Math.random() * 50;
        this.status = S_ACTIVE;
        this.hitTime = 0;
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

    onUpdate(delta) {
        if (this.status == S_HIT) {
            this.xrot += 12;
            if (performance.now() - this.hitTime > 2000) {
                this.toDead();
            }
        }

        this.pos[0] -= 0.01;
        this.wavePeriod += delta * 0.001;
        super.onUpdate(delta);      // run onUpdate() on child nodes in the world node.
    }

    onDraw(engine) {
        //L.log(this.wavePeriod);
        let modelRotation = pg.xrot(this.xrot);
        flag_render.draw(gl3d.gl, this.ch, this.pos, this.scale, modelRotation, this.bg, gl3d.facingView(), this.wavePeriod);
        super.onDraw(engine);       // run onDraw() on child nodes.
    }

}

