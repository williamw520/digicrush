/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";

L.info("module starts");


// Game world state
export class World extends BaseNode {
    constructor() {
        super();
        this.w = 800;
        this.h = 640;
        //this.collisions = new Collisions();
    }

    setDim(w, h) {
        this.w = w;
        this.h = h;
    }

    addCollision(n) {
        this.collisions.addChild(n);
    }

    onUpdate(delta) {
        super.onUpdate(delta);      // run onUpdate() on child nodes in the world node.
        //L.info("onUpdate");

        // this.collisions.onUpdate(delta);
    }

    onDraw(engine) {
        //L.info("onDraw");

        // Clear bg
        engine.ctx.fillStyle = "#303030";
        engine.ctx.fillRect(0, 0, this.w, this.h);

        // this.farLayer.onDraw(engine);
        // this.backLayer.onDraw(engine);

        super.onDraw(engine);       // run onDraw() on child nodes.
    }

}

