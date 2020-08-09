/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// Game engine
export class Engine {
    constructor(canvasId, world, ui) {
        this.aframe = null;
        this.prevTime = 0;
        this.world = world;
        this.ui = ui;
        this.ctx = document.getElementById(canvasId).getContext("2d");
    }

    start() {
        this.prevTime = performance.now();
        this._animate(this.prevTime);           // start the first animation frame.
    }

    stop() {
        if (this.aframe)
            cancelAnimationFrame(this.aframe);
        this.aframe = null;
    }

    get running() { return this.aframe != null }

    _animate(time) {
        this.aframe = requestAnimationFrame( time => this._animate(time) ); // schedule the next animation frame; should be 60 fps.
        let dt = time - this.prevTime;
        this.prevTime = time;
        if (dt > 0) {
            this.world.onUpdate(dt);            // update game world state
            this.world.onDraw(this.ctx);        // render the game world
            this.ui.onDraw(this.ctx);           // render the surrounding UI
        }
    }

}

