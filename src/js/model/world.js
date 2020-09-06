/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";
import {Flag} from "/js/model/flag.js";
import res from "/js/model/res.js";
import gl3d from "/js/game/gl3d.js";
import state from "/js/game/state.js";
import input from "/js/engine/input.js";
import U from "/js/util/util.js";


// Game world state
export class World extends BaseNode {
    constructor() {
        super();

        this.freeFlags = [...Array(state.MAX_FREE_FLAGS).keys()].map( () => new Flag() );
        this.flags = [];
    }

    onUpdate(delta, parent) {
        this._handleInput();
        this._updateStatus();
        if (this._gcFlags())
            this._pullback();
        this.flags.forEach( (f, i) => f.setRNeighbor(this.flags[i+1]) );    // last one gets null
        if (state.status == state.S_PLAYING) {
            this.flags.forEach( f => f.onUpdate(delta, this) );
        }
        super.onUpdate(delta, parent);  // run onUpdate() on child nodes in the world node.
    }

    onDraw() {
        // this.farLayer.onDraw();
        // this.backLayer.onDraw();
        super.onDraw();       // run onDraw() on child nodes.
        this.flags.forEach( f => f.onDraw() );
    }

    _startLevel() {
        L.info("_startLevel");
        this._spawnFlag();
        state.status = state.S_PLAYING;
        gl3d.cameraAngle = state.PLAYING_ANGLE;
    }

    _handleInput() {
        if (input.isOn(input.K_RUN)) {
            if (state.status == state.S_WAITING)
                this._startLevel();
        }

        if (input.isOn(input.K_PAUSE)) {
            if (state.status == state.S_PLAYING)
                state.status = state.S_PAUSED;
            else if (state.status == state.S_PAUSED)
                state.status = state.S_PLAYING;
        }

        if (state.status == state.S_PLAYING) {
            input.digitHit( digitIndex => this._checkFlagHit(digitIndex) );
        }
    }

    _checkFlagHit(digitIndex) {
        let count = this.flags.reduce( (sum, f) => (f.ch == digitIndex) ? sum + 1 : sum, 0 );
        if (count > 1) {
            this.flags.forEach( f => {
                if (f.ch == digitIndex)
                    f.toHit();
            });
        }
    }
    
    _updateStatus() {
        switch (state.status) {
        case state.S_WAITING:
            break;
        case state.S_PLAYING:
            this._checkDead();
            this._checkSpawn();
            break;
        case state.S_PAUSED:
            break;
        case state.S_WON:
            break;
        case state.S_DEAD:
            gl3d.cameraAngle += 4;
            break;
        }        
    }

    _checkDead() {
        let first = U.first(this.flags);
        if (first) {
            if (first.pos[0] < state.LOSING_X) {
                state.status = state.S_DEAD;
            }
        }
    }

    _checkSpawn() {
        let last = U.last(this.flags);
        if (last) {
            if (last.pos[0] < state.BEGIN_X) {
                this._spawnFlag();
            }
        }
    }

    _spawnFlag() {
        let f = res.allocFlag();
        f.activate(U.last(this.flags));
        this.flags.push(f);
    }

    _gcFlags() {
        let hasDead = this.flags.reduce( (dead, f) => dead || f.isDead(), false );
        if (hasDead) {
            this.flags.forEach( f => f.isDead() ? res.freeFlag(f.toFree()) : 0 );
            this.flags = this.flags.filter( f => !f.isFree() );
        }
        return hasDead;
    }

    _pullback() {
        let last = U.last(this.flags);
        if (last) {
            last.pos[0] += state.SPACE_BETWEEN / 2;     // pushing back the last one pulls the whole string of flags back.
        }
    }    

}

