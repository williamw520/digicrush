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

    onUpdate(delta, parent) {
        super.onUpdate(delta, parent);  // run onUpdate() on child nodes in the world node.
        //L.info("onUpdate");
    }

    onDraw() {
        super.onDraw();                 // run onDraw() on child nodes.
    }

}

