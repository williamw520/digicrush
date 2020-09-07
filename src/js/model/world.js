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
import A from "/js/engine/animate.js";
import U from "/js/util/util.js";


// Game world state
export class World extends BaseNode {
    constructor() {
        super();
        this.flags = [];
    }

    onUpdate(time, delta, parent) {
        this._handleInput();
        this._updateGameState();
        if (this._gcFlags())
            this._pullback();
        this.flags.forEach( (f, i) => f.setRNeighbor(this.flags[i+1]) );    // last one gets null
        if (state.gstate == state.S_PLAYING) {
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
        }
        super.onUpdate(time, delta, parent);        // run onUpdate() on child nodes in the world node.
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
        state.gstate = state.S_PLAYING;
        gl3d.cameraAngle = state.PLAYING_ANGLE;
    }

    _handleInput() {
        if (input.isOn(input.K_RUN)) {
            if (state.gstate == state.S_WAITING)
                this._startLevel();
        }

        if (input.isOn(input.K_PAUSE)) {
            if (state.gstate == state.S_PLAYING)
                state.gstate = state.S_PAUSED;
            else if (state.gstate == state.S_PAUSED)
                state.gstate = state.S_PLAYING;
        }

        if (state.gstate == state.S_PLAYING) {
            input.digitHit( digitIndex => this._checkMatchingFlags(digitIndex) );
        }
    }

    _checkMatchingFlags(digitIndex) {
        let count = 0;
        let firstMatch = -1;
        let lastMatch = -1;
        let seq = 0;
        let seq3 = false;
        let seq4 = false;
        let seq5 = false;
        this.flags.forEach( (f, i) => {
            if (f.ch == digitIndex) {
                if (firstMatch == -1)
                    firstMatch = i;
                if (lastMatch == (i-1)) {
                    seq++;
                    if (seq >= 3) seq3 = true;
                    if (seq >= 4) seq4 = true;
                    if (seq >= 5) seq5 = true;
                } else {
                    seq = 1;
                }
                lastMatch = i;
                count++;
            } else {
                lastMatch = -1;
                seq = 0;
            }
        })

        let powerType = 0;
        if (seq4) {
            powerType = Flag.T_BOMB4;
        } else if (seq3) {
            if (digitIndex >= 0 && digitIndex < 3) {
                powerType = Flag.T_WILDCARD;
            } else {
                powerType = Flag.T_BOMB3;
            }
        }

        if (powerType) {
            this.flags[firstMatch].morph(powerType);
        }

        if (count > 1) {
            this.flags.forEach( f => {
                if (f.ch == digitIndex)
                    f.toHit();
            });
        }
    }
    
    _updateGameState() {
        switch (state.gstate) {
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
                state.gstate = state.S_DEAD;
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
        f.activate(U.last(this.flags), null);
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

