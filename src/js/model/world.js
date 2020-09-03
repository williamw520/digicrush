/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";
import {Flag} from "/js/model/flag.js";

L.info("module starts");


// Game world state
export class World extends BaseNode {
    constructor() {
        super();
        this.w = 800;
        this.h = 640;

//        ["1", "2", "3", "4", "5", "6", "@", "$"].forEach( (ch, i) => {
        ["1"].forEach( (ch, i) => {
            let f = super.addChild(new Flag(i));
            f.pos[0] = i * 0.25;
        });
    }

    setDim(w, h) {
        this.w = w;
        this.h = h;
    }

    onUpdate(delta) {
        super.onUpdate(delta);      // run onUpdate() on child nodes in the world node.
    }

    onDraw(engine) {
        // Clear bg
        // engine.ctx.fillStyle = "#303030";
        // engine.ctx.fillRect(0, 0, this.w, this.h);

        // this.farLayer.onDraw(engine);
        // this.backLayer.onDraw(engine);
        super.onDraw(engine);       // run onDraw() on child nodes.
    }

}

