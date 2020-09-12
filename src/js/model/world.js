/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";
import {Flag, FF} from "/js/model/flag.js";
import {pg} from "/js/engine/pregen.js";
import gl3d from "/js/game/gl3d.js";
import state from "/js/game/state.js";
import def from "/js/game/def.js";
import input from "/js/engine/input.js";
import audio from "/js/util/audio.js";
import A from "/js/engine/animate.js";
import U from "/js/util/util.js";


// Game world state
export class World extends BaseNode {
    constructor() {
        super();
        this.flags = [];
        this.activeFlags = [];
        this.matchedFlg = [];
        this.matchedSeq = [];
        this.matchedBomb = [];
        this.matchedB4 = [];
        this.fortO = [];
        this.fortI = [];
        this.cash  = [];
        this.score = [];
        this.popup = [];
        this.fortIX = 0;
        this.fortAttackStart = false;
        this.fortAttack = false;
        this.fortAttackTime = new A.Timeline(2000);
        this.popupLen = 0;
        this.scoreDelay = new A.Timeline(200);          // delay between score update.
        this.popupDelay = new A.Timeline(200);          // delay between popup msg update.
        this.deadSpin   = new A.Timeline(2000);
        this.deadFall   = new A.Timeline(2000);
        this.deadBlow = new A.Timeline(2000);
        this._initScore();
        this._initPopup();
        this._makeFortItems();
        this._makeCash();

        this._setPopup("LEVEL " + state.level);
        this._showPopup(true);
    }

    onUpdate(time, delta, parent) {
        this._handleInput();
        if (state.gstate == state.S_PAUSED)
            return;
        
        if (this._checkHitFlags() || this._checkBombedFlags())
            this._pullback();
        this._checkDeadFlags();
        this._fixNextPtr();
        this._updateByGameState(time, delta);
        super.onUpdate(time, delta, parent);        // run onUpdate() on child nodes in the world node.
    }

    onDraw() {
        // this.farLayer.onDraw();
        // this.backLayer.onDraw();
        super.onDraw();       // run onDraw() on child nodes.
        this.flags.forEach( f => f.onDraw() );
        this.fortO.forEach( f => f.onDraw() );
        this.fortI.forEach( f => f.onDraw() );
        this.cash.forEach(  f => f.onDraw() );
        this.popup.forEach( f => f.onDraw() );
        // Camera angle has no effect on score display.
        let oldCameraAngle = gl3d.cameraAngle;
        gl3d.cameraAngle = 0;
        this.score.forEach( f => f.onDraw() );
        gl3d.cameraAngle = oldCameraAngle;
    }

    _startLevel() {
        L.info("_startLevel");
        this._spawnFlag();
        this._showPopup(false);
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
            input.digitHit( digitIndex => this._processMatching(digitIndex) );
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

    _filterActive() {
        this.activeFlags.length = 0;
        this.flags.forEach( f => {
            if (f.isActive())
                this.activeFlags.push(f)
        });
        return this.activeFlags;
    }

    _matchFlags(activeFlags, digitIndex) {
        let seq = 0;
        this.matchedFlg.length = 0;             // reset working arrays.
        this.matchedSeq.length = 0;
        this.matchedBomb.length = 0;
        activeFlags.forEach( (f, i) => {
            if (f.match(digitIndex)) {
                if (f.type == def.T_BOMB3) {
                    // record the range of flags to be blown up.
                    this.matchedBomb.push(activeFlags.slice(Math.max(0, (i-def.BOMB3_RANGE)), Math.min(activeFlags.length, (i+def.BOMB3_RANGE+1))));
                    audio.shot();
                } else if (f.type == def.T_BOMB4) {
                    this.matchedBomb.push(activeFlags.slice(Math.max(0, (i-def.BOMB4_RANGE)), Math.min(activeFlags.length, (i+def.BOMB4_RANGE+1))));
                    audio.explosion();
                } else if (f.type == def.T_404) {
                    //this.matchedBomb.push(activeFlags);
                    this.fortAttackStart = true;
                    audio.rocket();
                } else {
                    // for regular active flags, track the consecutive matching sequences.
                    seq++;                          // count consecutive matching flags.
                    this.matchedFlg.push(f);        // save matched flag
                    this.matchedSeq.push(seq);      // save the seq count for the index.
                }
            } else {
                seq = 0;                        // reset seq counter once a non-matched flag is encountered.
            }
        })
    }

    _determinePowerType(seq, digitIndex) {
        let powerType = 0;
        if (seq == 3) {
            return def.T_BOMB3;
            // Disable wildcard.  Doesn't feel right when playing with wildcard.
            //return (digitIndex >= 0 && digitIndex < 3) ? def.T_WILDCARD : def.T_BOMB3;
        } else if (seq == 4) {
            return def.T_BOMB4;
        } else if (seq >= 5) {
            return def.T_404;
        }
        return 0;
    }

    _processMatching(digitIndex) {
        this._matchFlags(this._filterActive(), digitIndex);

        for (let i = 0; i < this.matchedBomb.length; i++) {
            let bombedRange = this.matchedBomb[i];
            bombedRange.forEach( f => this._startBombed(f) );
        }

        // Check for power fusion.
        let hasPowerFuse = false;
        for (let i = this.matchedSeq.length - 1; i >= 0; i--) {
            let seq = this.matchedSeq[i];
            let powerType = this._determinePowerType(seq, digitIndex);
            if (powerType) {                                        // has power flag generated.
                let firstIndex  = i - seq + 1;                      // go back by seq count.
                let firstFlag   = this.matchedFlg[firstIndex];
                let j           = firstIndex;

                if (powerType == def.T_404) {
                    this.matchedFlg[j++].toFuse(firstFlag, powerType, 3, true);
                    this.matchedFlg[j++].toFuse(firstFlag, powerType, def.F_ZERO, true);
                    this.matchedFlg[j++].toFuse(firstFlag, powerType, 3, true);
                    audio.fuse3();
                } else if (powerType == def.T_BOMB4) {
                    this.matchedFlg[j++].toFuse(firstFlag, powerType);  // retain the flag as powerType after fusing.
                    audio.fuse2();
                } else if (powerType == def.T_BOMB3) {
                    this.matchedFlg[j++].toFuse(firstFlag, powerType);  // retain the flag as powerType after fusing.
                    audio.fuse1();
                }

                for (; j <= i; j++) {
                    this.matchedFlg[j].toFuse(firstFlag, 0);        // don't retain the flag after fusing.
                }

                i = firstIndex;                                     // skip back to firstIndex to continue the outer loop.
                hasPowerFuse = true;
            }
        }

        // Check for non-seq flag matching.
        let matchCount = this.matchedFlg.reduce( (sum, f) => f.isActive() ? sum+1 : sum, 0 );
        if (matchCount > 1) {
            this.matchedFlg.forEach( f => {
                if (f.isActive())
                    f.toHit();
            });
            audio.sprinkle();
        }

    }

    _updateByGameState(time, delta) {
        switch (state.gstate) {
        case state.S_WAITING:
            this._rotateFortO(time);
            this._updatePopup(time);
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_PLAYING:
            this._checkLosing();
            this._checkSpawn();
            this._rotateFortO(time);
            this._pulseFortI(time);
            this._checkFortAttack(time);
            this._updateScore(time);
            this._updatePopup(time);
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
            this.fortO.forEach( f => f.onUpdate(time, delta, this) );
            this.fortI.forEach( f => f.onUpdate(time, delta, this) );
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_PAUSED:
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_WON:
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_DEAD:
            if (this.deadSpin.step(time)) {
                state.gstate = state.S_DEAD_FALL;
                this.deadFall.start(time);
            }
            gl3d.cameraAngle += 3;
            this._rotateFortO(time);
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_DEAD_FALL:
            if (this.deadFall.step(time)) {
                state.gstate = state.S_DEAD_BLOW;
                this.deadBlow.start(time);
            } else {
                this._collapseFort(time);
            }
            gl3d.cameraAngle += 1;
            this._rotateFortO(time);
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_DEAD_BLOW:
            if (this.deadBlow.step(time)) {
                state.gstate = state.S_DEAD_WAIT;
            } else {
                this._blowupFort(time);
            }
            gl3d.cameraAngle += 1;
            this._rotateFortO(time);
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_DEAD_WAIT:
            gl3d.cameraAngle = 0;
            this._setPopup("GAME OVER");
            this._showPopup(true);
            this._updatePopup(time);
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        }        
    }

    _checkLosing() {
        let first = this._firstFlag();
        if (first) {
            if (first.pos[0] < def.LOSING_X) {
                state.gstate = state.S_DEAD;
                this.deadSpin.start();
            }
        }
    }

    _checkSpawn() {
        let last = this._lastFlag();
        if (last) {
            if (last.pos[0] < def.BEGIN_X) {
                this._spawnFlag();
            }
        } else {
            // Spawn a new flag if all flags have been eliminated.
            this._spawnFlag();
        }
    }

    _spawnFlag() {
        this.flags.push(FF.makeFlag(this._lastFlag()));
    }

    _checkHitFlags() {
        let hasHit = this.flags.reduce( (acc, f) => acc || f.isHit(), false );
        let statusChanged = (this.hadHit && !hasHit);
        this.hadHit = hasHit;
        return statusChanged;
    }

    _checkBombedFlags() {
        let hasBombed = this.flags.reduce( (acc, f) => acc || f.isBombed(), false );
        let statusChanged = (this.hadBombed && !hasBombed);
        this.hadBombed = hasBombed;
        return statusChanged;
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

    _makeFortItems() {
        let rotRightFace = pg.yrot(90);
        let count = 16;
        let radius = 2;
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortO.push(FF.makeFort(def.T_FORT_O, [def.FORT_O_X, y, z], def.FORT_O_SCALE, rotRightFace));
        }

        count = 8;
        radius = 1.1;
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortI.push(FF.makeFort(def.T_FORT_I, [def.FORT_I_X, y, z], def.FORT_I_SCALE, rotRightFace));
        }
    }

    _rotateFortO(time) {
        let period = time / 360000;
        let count = 16;
        let radius = 2;
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * (i / count - period);
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortO[i].pos[1] = y;
            this.fortO[i].pos[2] = z;
        }
    }

    _pulseFortI(time) {
        let period = time / 3600;
        this.fortI.forEach( f => f.offset[0] = Math.sin(2 * Math.PI * period) / 16 );
    }

    _collapseFort(time) {
        let count = 16;
        let radius = 2 * A.easeInQuad(this.deadFall.pos);
//        let radius = 2 * this.deadFall.pos;
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortO[i].offset[1] = -y;
            this.fortO[i].offset[2] = -z;
        }

        count = 8;
        radius = 1.1 * A.easeInQuad(this.deadFall.pos);
//      radius = 1.1 * this.deadFall.pos;
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortI[i].offset[1] = -y;
            this.fortI[i].offset[2] = -z;
        }
    }

    _blowupFort(time) {
        let count = 16;
        let radius = 10 * A.easeInQuad(this.deadBlow.pos);
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortO[i].offset[1] = y;
            this.fortO[i].offset[2] = z;
        }

        count = 8;
        radius = 10 * A.easeInCubic(this.deadBlow.pos);
        for (let i = 0; i < count; i++) {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            this.fortI[i].offset[1] = y;
            this.fortI[i].offset[2] = z;
        }
    }

    _checkFortAttack(time) {
        if (this.fortAttackStart) {
            // Set fort in attack mode.
            this.fortAttackTime.start(performance.now(), 2000);
            this.fortAttack = true;
            this.fortAttackStart = false;
            this.fortI.forEach( f => {
                f.type = def.T_FORT_I2;
                f.bg = def.makeBg(def.T_FORT_I2);
            } );
        }

        if (this.fortAttack) {
            if (this.fortAttackTime.step(time)) {
                audio.explosion();                                                  // big explosion at the end.                
                this.fortAttack = false;
                this.fortI.forEach( f => {
                    f.offset[0] = 0;
                    f.type = def.T_FORT_I;
                    f.bg = def.makeBg(def.T_FORT_I);
                } );

                // Blow up the rest of the flags.
                this.flags.forEach( f => {
                    if (f.isActive())
                        this._startBombed(f);
                })
            } else {
                let ax = this.fortAttackTime.pos * (def.BEGIN_X - def.FORT_I_X);    // apply timeline pos to the whole distance across the field.
                this.fortI.forEach( f => f.offset[0] = ax );                        // move the offset of all fort items to ax.

                for (let i = 0; i < this.flags.length; i++) {
                    let f = this.flags[i];
                    if (f.isActive()) {
                        if (f.pos[0] + 1.5 > ax)
                            break;
                        this._startBombed(f);
                        audio.shot();
                    }
                }
            }
        }
    }

    _startBombed(f) {
        f.toBombed();
        let copies = U.rand(3, 5);
        while (copies-- > 0)
            this.flags.push(f.clone().toFlyingRnd());
    }

    _makeCash() {
        let rotRightFace = pg.yrot(90);
        this.cash.push(FF.makeChar("$", [def.CASH_X, 0, 0], def.CASH_SCALE, rotRightFace, true));
    }

    _initScore() {
        this.score = [...Array(7).keys()].map( (n, i) => FF.makeChar("0",
                                                                     [def.SCORE_X + i * (def.SCORE_W * 1.7), def.SCORE_Y, def.SCORE_Z],
                                                                     def.SCORE_W) );
        this.score.forEach( f => f.bg = [0, 0, 0, 0] );
        this.score.forEach( f => f.fg = [0.25, 1, 0.25, 1] )
    }

    _updateScore(time) {
        if (this.scoreDelay.step(time)) {
            this.scoreDelay.start(performance.now());
        } else {
            if (state.scoreDisplay < state.score) {
                state.scoreDisplay += 1;
            }
            let i = this.score.length - 1;
            let n = state.scoreDisplay;
            while (n > 0) {
                const digit = n % 10;
                this.score[i].ch = def.numIndex(digit);
                n = M.floor(n / 10);
                if (i > 0)
                    i--;
            }
        }
    }

    _initPopup() {
        this.popup = [...Array(10).keys()].map( (n, i) => FF.makeChar(" ",
                                                                      [def.POPUP_X + i * (def.POPUP_W * 2.2), def.POPUP_Y, def.POPUP_Z],
                                                                      def.POPUP_W, null, true) );
        this.popup.forEach( f => f.bg = [0, 0, 0, 0] );     // initially transparent
        this.popup.forEach( f => f.fg = [0, 0, 0, 0] );     // initially transparent
    }

    _setPopup(msg) {
        const txt = msg.substring(0, this.popup.length);
        this.popupLen = txt.length;
        txt.split("").map( (ch, i) => this.popup[i].ch = def.charIndex[ch] );
    }

    _showPopup(isShow) {
        const showLen = isShow ? this.popupLen : 0;
        for (let i = 0; i < this.popup.length; i++) {
            if (i < showLen) {
                this.popup[i].bg = [1, 1, 1, 1];
                this.popup[i].fg = [.5, 0, 0, 1];
            } else {
                this.popup[i].bg = [0, 0, 0, 0];
                this.popup[i].fg = [0, 0, 0, 0];
            }
        }
    }

    _updatePopup(time) {
        if (this.popupDelay.step(time)) {
            this.popupDelay.start(performance.now());
        } else {
        }
    }
        
}

