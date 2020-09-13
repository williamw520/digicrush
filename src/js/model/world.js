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
        this.goal  = [];
        this.popup = [];
        this.fortIX = 0;
        this.scoreDelay = new A.Timeline(200);          // delay between score update.
        this.wonStages  = this._setupWonStages();
        this.lostStages = this._setupLostStages();
        this.fortAttackStages = [this._setupFortAttackStages(500, 1700, 1700, false),
                                 this._setupFortAttackStages(500, 400, 1700, true)];
        this.fortAttackType = 0;
        this.fortAttacking = false;
        this.popupLen = 0;
        this._initScore();
        this._initPopup();
        this._makeFortItems();
        this._makeCash();
        this._startGame();
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

        // Camera angle has no effect on the following display.
        let oldCameraAngle = gl3d.cameraAngle;
        gl3d.cameraAngle = 0;
        this.popup.forEach( f => f.onDraw() );
        this.score.forEach( f => f.onDraw() );
        this.goal.forEach(  f => f.onDraw() );
        gl3d.cameraAngle = oldCameraAngle;
    }

    // Restart game for initial play or after game over.
    _startGame() {
        state.gstate = state.S_INIT_WAIT;
        state.level = 1;
        this._setPopup("SPACE TO START", -0.2, 0, -.5);
    }

    _startLevel() {
        if (state.gstate == state.S_PLAYING)
            return;
        state.gstate = state.S_PLAYING;
        this._showPopup(false);
        this._showItems(this.cash, true);
        this._showItems(this.fortO, true);
        this._showItems(this.fortI, true);
        this._resetOffset(this.cash);
        this._resetOffset(this.fortO);
        this._resetOffset(this.fortI);
        this.fortAttacking = false;
        this.fortAttackStages.forEach( fa => fa.doneNow() );
        this.scoreDelay.doneNow();
        this.wonStages.doneNow();
        this.lostStages.doneNow();
        this.scoreDelay.start();
        state.hitGoal   = 10;               // get from level profile
        state.hitCount  = 0;
        gl3d.cameraAngle = def.PLAYING_ANGLE;
        this._spawnFlag();
    }

    _handleInput() {
        if (input.isOn(input.K_SPACE)) {
            switch (state.gstate) {
            case state.S_INIT_WAIT:
            case state.S_WON_WAIT:
            case state.S_LOST_WAIT:
                this._setPopup("LEVEL " + state.level, -0.2, 0, 0);
                state.gstate = state.S_LEVEL_WAIT;
                break;
            case state.S_LEVEL_WAIT:
                this._startLevel();
                break;
            }
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
                    audio.rocket();
                    this._startFortAttack(0);
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
                    this.matchedFlg[j].toFuse(firstFlag, 0);        // don't retain the rest of the matched flags after fusing.
                }

                state.hitCount += (j - firstIndex);                 // the ones fusing counted as hit; the fused ones are new flags which will be counted as another hit.

                i = firstIndex;                                     // skip back to firstIndex to continue the outer loop.
                hasPowerFuse = true;
            }
        }

        // Check for non-seq flag matching.
        let matchCount = this.matchedFlg.reduce( (sum, f) => f.isActive() ? sum+1 : sum, 0 );
        if (matchCount > 1) {
            this.matchedFlg.forEach( f => {
                if (f.isActive()) {
                    f.toHit();
                    state.hitCount++;
                }
            });
            audio.sprinkle();
        }

    }

    _updateByGameState(time, delta) {
        switch (state.gstate) {
        case state.S_INIT_WAIT:
        case state.S_LEVEL_WAIT:
            this._rotateFortO(time);
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_PLAYING:
            this._checkSpawn();
            this._rotateFortO(time);
            this._pulseFortI(time);
            this._checkFortAttack(time);
            this._updateScore(time);
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
            this.fortO.forEach( f => f.onUpdate(time, delta, this) );
            this.fortI.forEach( f => f.onUpdate(time, delta, this) );
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            this._checkWinning();   
            this._checkLosing();
            break;
        case state.S_PAUSED:
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_WON_PENDING:
            if (!this._hasPendingAnimation()) {
                state.gstate = state.S_WON;
                this.wonStages.start();
            }
            this._rotateFortO(time);
            this._checkFortAttack(time);
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
            this.fortO.forEach( f => f.onUpdate(time, delta, this) );
            this.fortI.forEach( f => f.onUpdate(time, delta, this) );
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_WON:
            if (this.wonStages.step(time)) {
                state.gstate = state.S_WON_WAIT;
                // setup for the next state.
                gl3d.cameraAngle = 0;
                this.flags.length = 0;
                this._setPopup("YOU WON!", -0.2, 0, 0);
                state.level++;
            }
            this._rotateFortO(time);
            this._checkFortAttack(time);
            this.flags.forEach( f => f.onUpdate(time, delta, this) );
            this.fortO.forEach( f => f.onUpdate(time, delta, this) );
            this.fortI.forEach( f => f.onUpdate(time, delta, this) );
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_WON_WAIT:
            this._rotateFortO(time);
            this._pulseFortI(time);
            this._updateScore(time);
            this.fortO.forEach( f => f.onUpdate(time, delta, this) );
            this.fortI.forEach( f => f.onUpdate(time, delta, this) );
            this.cash.forEach(  f => f.onUpdate(time, delta, this) );
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        case state.S_LOST:
            if (this.lostStages.step(time)) {
                state.gstate = state.S_LOST_WAIT;
                // setup for the next state.
                gl3d.cameraAngle = 0;
                this._setPopup("GAME OVER", -0.5, 0, 0);
                this._showItems(this.cash, false);
                this._showItems(this.fortO, false);
                this._showItems(this.fortI, false);
                this.flags.length = 0;
            }

            this._rotateFortO(time);
            break;
        case state.S_LOST_WAIT:
            this.popup.forEach( f => f.onUpdate(time, delta, this) );
            break;
        }        
    }

    _setupWonStages() {
        let stage0 = new A.Timeline(400, this, null, (world, tl) => {
            gl3d.cameraAngle -= 1;
        });
        let stage1 = new A.Timeline(3000, this, (world, tl) => {
            // onStart
            world._startFortAttack(1);
        }, (world, tl) => {
            //world._blowupEva(tl.pos);
        });
        return new A.TimeGroup([stage0, stage1]);
    }

    _checkWinning() {
        if (state.gstate == state.S_PLAYING && state.hitCount >= state.hitGoal) {
            state.gstate = state.S_WON_PENDING;
        }
    }

    _hasPendingAnimation() {
        let hasPending = false;
        hasPending |= this.fortAttacking;
        return hasPending;
    }

    _setupLostStages() {
        let stage0 = new A.Timeline(2980, this, null, (world, tl) => {
            gl3d.cameraAngle -= 3;
        });
        let stage1 = new A.Timeline(1500, this, null, (world, tl) => {
            gl3d.cameraAngle -= 1;
            world._collapseFort(tl.pos);
        });
        let stage2 = new A.Timeline(2000, this, null, (world, tl) => {
            world._blowupFort(tl.pos);
        });
        return new A.TimeGroup([stage0, stage1, stage2]);
    }

    _checkLosing() {
        let first = this._firstFlag();
        if (first) {
            if (first.pos[0] < def.LOSING_X) {
                state.gstate = state.S_LOST;
                this.lostStages.start();
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
        let period = time / 300000;
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


    _expandFort(forts, radius, sign, scale) {
        let count = forts.length;
        forts.forEach( (f, i) => {
            let angle = 2 * Math.PI * i / count;
            let y = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            f.offset[1] = sign * y;
            f.offset[2] = sign * z;
            f.scale = scale;
        } )
    }

    _collapseFort(pos) {
        this._expandFort(this.fortO, 2.0 * A.easeInQuad(pos), -1, def.FORT_O_SCALE * (1-pos));
        this._expandFort(this.fortI, 1.1 * A.easeInQuad(pos), -1, def.FORT_I_SCALE * (1-pos));
    }

    _blowupFort(pos) {
        this._expandFort(this.fortO, 7.0 * A.easeOutQuad(pos), 1, def.FORT_O_SCALE * (0.25 + pos));
        this._expandFort(this.fortI, 5.5 * A.easeOutQuad(pos), 1, def.FORT_I_SCALE * (0.25 + pos));
    }

    _setupFortAttackStages(range1, range2, range3, explosionAtStage2) {
        const distance = def.BEGIN_X - def.FORT_I_X;
        
        let stage0 = new A.Timeline(range1, this, (world, tl) => {
            // onStart.  Move forth a bit and lite up.
            world.fortI.forEach( f => f.offset[0] = 0.2 );
            world.fortI.forEach( f => f.type = def.T_FORT_I2 );
            world.fortI.forEach( f => f.bg   = def.makeBg(f.type) );
        });
        
        let stage1 = new A.Timeline(range2, this, null, (world, tl) => {
            // onStep.
            let ax = tl.pos * distance;                             // apply timeline pos to the whole distance across the field.
            world.fortI.forEach( f => f.offset[0] = ax );           // move the offset of all fort items to ax.
            // blow up active flags along the way.
            for (let i = 0; i < world.flags.length; i++) {
                let f = world.flags[i];
                if (f.isActive()) {
                    if (f.pos[0] + 1.5 > ax)
                        break;
                    world._startBombed(f);
                    audio.shot();
                }
            }
        });
        
        let stage2 = new A.Timeline(range3, this, (world, tl) => {
            // onStart
            if (explosionAtStage2)
                audio.explosion2();
        }, (world, tl) => {
            // onStep
            let ax = tl.rpos * distance;                            // move the whole way back
            world.fortI.forEach( f => f.offset[0] = ax );
        });

        return new A.TimeGroup([stage0, stage1, stage2]);
    }

    _startFortAttack(attackType) {
        if (this.fortAttacking)
            return;
        this.fortAttacking = true;
        this.fortAttackType = attackType;
        this.fortAttackStages[this.fortAttackType].start();
    }

    _checkFortAttack(time) {
        if (this.fortAttacking) {
            if (this.fortAttackStages[this.fortAttackType].step(time)) {
                // done
                this.fortAttacking = false;
                // big explosion at the end for type 0
                if (this.fortAttackType == 0)
                    audio.explosion2();
                this.flags.forEach( f => { if (f.isActive()) this._startBombed(f) } );  // blow up any remaining flags.
                // clean up
                this._resetOffset(this.fortI);
                this.fortI.forEach( f => f.type = def.T_FORT_I );
                this.fortI.forEach( f => f.bg   = def.makeBg(f.type) );
            }
        }
    }

    _startBombed(f) {
        f.toBombed();
        state.hitCount++;                               // each bombed flag counted as a hit.
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
                                                                     [def.SCORE_X + i * (def.SCORE_W * 1.4), def.SCORE_Y, def.SCORE_Z],
                                                                     def.SCORE_W) );
        this.score.forEach( f => f.bg = [0, 0, 0, 0] );
        this.score.forEach( f => f.fg = [0.25, 1, 0.25, 1] )

        this.goal  = [...Array(2).keys()].map( (n, i) => FF.makeChar("0",
                                                                     [def.GOAL_X + i * (def.SCORE_W * 1.4), def.SCORE_Y, def.SCORE_Z],
                                                                     def.SCORE_W) );
        this.goal.forEach( f => f.bg = [0, 0, 0, 0] );
        this.goal.forEach( f => f.fg = [0.25, 1, 0.25, 1] )
    }

    _updateScore(time) {
        if (this.scoreDelay.step(time)) {
            this.scoreDelay.start(time);
        } else {
            if (state.scoreDisplay < state.score) {
                state.scoreDisplay += 1;
            }

            this._updateNumber(this.score, state.scoreDisplay);
            // let i = this.score.length - 1;
            // let n = state.scoreDisplay;
            // while (n > 0) {
            //     const digit = n % 10;
            //     this.score[i].ch = def.numIndex(digit);
            //     n = Math.floor(n / 10);
            //     if (i > 0)
            //         i--;
            // }
            // while (i > 0) {
            //     this.score[i--].ch = def.numIndex(0);
            // }
        }

        this._updateNumber(this.goal, Math.max(state.hitGoal - state.hitCount, 0));
        
        // let i = this.goal.length - 1;
        // let n = Math.max(state.hitGoal - state.hitCount, 0);
        // while (n > 0) {
        //     const digit = n % 10;
        //     this.goal[i].ch = def.numIndex(digit);
        //     n = Math.floor(n / 10);
        //     if (i > 0)
        //         i--;
        // }
        // while (i > 0) {
        //     this.goal[i--].ch = def.numIndex(0);
        // }
    }

    _updateNumber(flags, n) {
        flags.forEach( f => f.ch = def.numIndex(0) );
        let i = flags.length - 1;
        while (n > 0) {
            const digit = n % 10;
            flags[i].ch = def.numIndex(digit);
            n = Math.floor(n / 10);
            if (i > 0)
                i--;
        }
    }

    _initPopup() {
        this.popup = [...Array(def.POPUP_N).keys()].map( (n, i) => {
            return FF.makeChar(" ",
                               [def.POPUP_X + i * (def.POPUP_W * 2.2), def.POPUP_Y, def.POPUP_Z],
                               def.POPUP_W, null, true)
        } )
    }

    _setPopup(msg, offsetX, offsetY, offsetZ) {
        const txt = msg.substring(0, this.popup.length);
        this.popupLen = txt.length;
        txt.split("").map( (ch, i) => this.popup[i].ch = def.charIndex[ch] );
        this._setOffset(this.popup, offsetX, offsetY, offsetZ);
        this._showPopup(true);
    }

    _showPopup(isShow) {
        const showLen = isShow ? this.popupLen : 0;
        this.popup.forEach( (f, i) => {
            if (i < showLen) {
                f.bg = [1, 1, 1, 1];
                f.fg = [.5, 0, 0, 1];
            } else {
                f.bg = [0, 0, 0, 0];
                f.fg = [0, 0, 0, 0];
            }
        })
    }

    _showItems(items, isShow) {
        items.forEach( f => {
            if (isShow) {
                f.bg = def.makeBg(f.type);
                f.fg = def.makeFg(f.type);
            } else {
                f.bg = f.fg = [0, 0, 0, 0];
            }
        })
    }

    _setOffset(items, x, y, z) {
        items.forEach( f => (f.offset[0] = x, f.offset[1] = y, f.offset[2] = z) );
    }

    _resetOffset(items) {
        this._setOffset(items, 0, 0, 0);
    }

}

