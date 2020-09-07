/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";


// util module
let ui = (function() {
    const ui = {};

    // UI node
    ui.UINode = class extends BaseNode {
        constructor(world) {
            super();
            this._world = world;
            this._flag_count = ui.Q("#flagcount");

        }

        onUpdate(time, delta, parent) {
            //this._flag_count.textContent = this._world.flags.length;
            super.onUpdate(time, delta, parent);  // run onUpdate() on child nodes in the world node.
        }

        onDraw() {
            super.onDraw();                 // run onDraw() on child nodes.
        }

    }

    ui.Q    = (selector) => document.querySelector(selector);
    ui.QA   = (selector) => document.querySelectorAll(selector);

    return ui;
}());

export default ui;

