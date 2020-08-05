/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";


// Game world state
export class World extends BaseNode {
    constructor() {
        this.w = 800;
        this.h = 640;
        super();
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

        // this.collisions.onUpdate(delta);
    }

    onDraw(ctx) {

        // Clear bg
        ctx.fillStyle = "#22222";
        ctx.fillRect(0, 0, w, h);

        // this.farLayer.onDraw(ctx);
        // this.backLayer.onDraw(ctx);

        super.onDraw(ctx);          // run onDraw() on child nodes.
    }

}

