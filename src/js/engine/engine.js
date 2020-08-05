/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// Game engine
export class Engine {
    constructor(paneId, world, ui) {
        this.aframe = null;
        this.prevTime = Date.getMilliseconds();
        this.world = world;
        this.ui = ui;
        this.ctx = document.getElementById(paneId).getContext("2d");
    }

    start() {
        this._onAnimate();      // start the first animation frame.
    }

    stop() {
        if (this.aframe)
            window.cancelAnimationFrame(this.aframe);
        this.aframe = null;
    }

    get running() { return this.aframe != null }

    _onAnimate() {
        this.aframe = window.requestAnimationFrame( () => this._onAnimate() );  // schedule the next animation frame; should be 60 fps.
        let currTime = Date.getMilliseconds();
        let delta = currTime - this.prevTime;
        this.prevTime = currTime;

        // If animateFrame callback comes in too fast, delta is 0.  Skip.
        if (delta > 0) {
            this.world.onUpdate(delta);         // update game world state
            this.world.onDraw(this.ctx);        // render the game world
            this.ui.onDraw(this.ctx);           // render the surrounding UI
        }
    }

}

