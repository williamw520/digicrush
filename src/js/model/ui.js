/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";

// UI node
export class UI extends BaseNode {
    constructor() {
        super();
    }

    onUpdate(delta) {
        super.onUpdate(delta);      // run onUpdate() on child nodes in the world node.
        //L.info("onUpdate");
    }

    onDraw(engine) {
        super.onDraw(engine);       // run onDraw() on child nodes.
        //L.info("onDraw");
    }

}

