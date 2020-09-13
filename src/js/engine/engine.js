/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";


// Game engine
export class Engine extends BaseNode {
    constructor() {
        super();
        this.frameId = null;                    // current frame id.
        this.prevTime = 0;                      // previous frame's time
    }

    start() {
        L.log("start");
        super.onStart();
        this.prevTime = performance.now();
        this._animate(this.prevTime);           // start the first animation frame.
    }

    stop() {
        L.log("stop");
        super.onStop();
        if (this.frameId)
            cancelAnimationFrame(this.frameId);
        this.frameId = null;
    }

    get running() { return this.frameId != null }

    _animate(currTime) {
        this.frameId = requestAnimationFrame( time => this._animate(time) ); // schedule the next animation frame; should be 60 fps.
        let dt = currTime - this.prevTime;
        this.prevTime = currTime;
        if (dt > 0) {
            this.onUpdate(currTime, dt, null);
            this.onDraw();
        }
    }

    onUpdate(time, delta, parent) {
        super.onUpdate(time, delta, parent);    // run onUpdate() on child nodes.
    }

    onDraw() {
        super.onDraw();                         // run onDraw() on child nodes.
    }

}

