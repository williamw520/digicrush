/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

L.info("module starts");


// Game engine
export class Engine {
    constructor(world, ui) {
        this.frameId = null;                    // current frame id.
        this.prevTime = 0;                      // previous frame's time
        this.world = world;                     // world node
        this.ui = ui;                           // UI node
    }

    start() {
        L.info("start");
        this.prevTime = performance.now();
        this._animate(this.prevTime);           // start the first animation frame.
    }

    stop() {
        L.info("stop");
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
            this.world.onUpdate(dt);            // update game world state
            this.ui.onUpdate(dt);
            this.world.onDraw(this);            // render the game world
            this.ui.onDraw(this);               // render the surrounding UI
        }
    }

}

