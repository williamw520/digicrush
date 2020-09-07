/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";
import {Flag} from "/js/model/flag.js";
import gl3d from "/js/game/gl3d.js";
import state from "/js/game/state.js";
import def from "/js/game/def.js";
import input from "/js/engine/input.js";
import A from "/js/engine/animate.js";
import U from "/js/util/util.js";


// Game world state
export class World extends BaseNode {
    constructor() {
        super();
        this.flags = [];
//        this.flying = [];
    }

    onUpdate(time, delta, parent) {
        this._handleInput();
        this._updateGameState();
        if (this._checkHitFlags())
            this._pullback();
        this._checkDeadFlags();
        this._fixNextPtr();
        if (state.gstate == state.S_PLAYING) {
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
//            this.flying.forEach( f => f.onUpdate(time, delta, this) );
        }
        super.onUpdate(time, delta, parent);        // run onUpdate() on child nodes in the world node.
    }

    onDraw() {
        // this.farLayer.onDraw();
        // this.backLayer.onDraw();
        super.onDraw();       // run onDraw() on child nodes.
        this.flags.forEach(  f => f.onDraw() );
//        this.flying.forEach( f => f.onDraw() );
    }

    _startLevel() {
        L.info("_startLevel");
        this._spawnFlag();
        state.gstate = state.S_PLAYING;
        gl3d.cameraAngle = def.PLAYING_ANGLE;
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

    _firstFlag() {
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i].isInLine())
                return this.flags[i];
        }
        return null;
    }
    
    _lastFlag() {
        for (let i = this.flags.length - 1; i >= 0; i--) {
            if (this.flags[i].isInLine())
                return this.flags[i];
        }
        return null;
    }
    
    _checkMatchingFlags(digitIndex) {
        L.info("_checkMatchingFlags");
        let count = 0;
        let firstMatch;
        let seq = 0;
        let seq3 = false;
        let seq4 = false;
        this.flags.forEach( (f, i) => {
            if (f.ch == digitIndex && f.isActive()) {
                count++;
                seq++;
                if (seq == 1 && !(seq3 || seq4))
                    firstMatch = f;
                if (seq >= 3) seq3 = true;
                if (seq >= 4) seq4 = true;
            } else {
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
            L.info("powerType", powerType, firstMatch);
            firstMatch.morph(powerType);
            this.flags.forEach( f => {
                if (f != firstMatch && f.ch == digitIndex && f.isActive())
                    f.toFuse(firstMatch);
            });
        } else {
            if (count > 1) {
                this.flags.forEach( f => {
                    if (f.ch == digitIndex && f.isActive())
                        f.toHit();
                });
            }
        }
    }
    
    _updateGameState() {
        switch (state.gstate) {
        case state.S_WAITING:
            break;
        case state.S_PLAYING:
            this._checkLosing();
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

    _checkLosing() {
        let first = this._firstFlag();
        if (first) {
            if (first.pos[0] < def.LOSING_X) {
                state.gstate = state.S_DEAD;
            }
        }
    }

    _checkSpawn() {
        let last = this._lastFlag();
        if (last) {
            if (last.pos[0] < def.BEGIN_X) {
                this._spawnFlag();
            }
        }
    }

    _spawnFlag() {
        let last = this._lastFlag();
        let f = new Flag(last);
        this.flags.push(f);
    }

    _checkHitFlags() {
        let hasHit = this.flags.reduce( (acc, f) => acc || f.isHit(), false );
        let hitStatusChanged = (this.hadHit && !hasHit);
        this.hadHit = hasHit;
        return hitStatusChanged;
    }

    _checkDeadFlags() {
        let hasDead = this.flags.reduce( (acc, f) => acc || f.isDead(), false );
        if (hasDead) {
            this.flags = this.flags.filter( f => !f.isDead() );
        }
        return hasDead;
    }

    _pullback() {
        let last = this._lastFlag();
        if (last) {
            last.pos[0] += def.SPACE_BETWEEN;     // pushing back the last one pulls the whole string of flags back.
        }
    }    

    _fixNextPtr() {
        for (let i = 0; i < this.flags.length; i++) {
            let f = this.flags[i];
            f.setNext(null);
            if (f.isInLine()) {
                for (i = i + 1; i < this.flags.length; i++) {
                    if (this.flags[i].isInLine()) {
                        f.setNext(this.flags[i]);
                        i--;
                        break;
                    }
                }
            }
        }
    }

    
}

