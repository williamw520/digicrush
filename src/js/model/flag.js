/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import {BaseNode} from "/js/engine/basenode.js";
import {pg} from "/js/engine/pregen.js";
import gl3d from "/js/game/gl3d.js";
import flag_render from "/js/game/flag_render.js";


// flag item
export class Flag extends BaseNode {
    constructor(imageIndex, pos) {
        super();
        this.ch = imageIndex;               // char image index, 0-based.
        this.pos = pos || [0, 0, 0];
        this.xrot = 0;
        this.yrot = 0;
        this.scale = 0.50;                  // model scale 
        this.wavePeriod = 5;
        this.bg = [0.5, 1.0, 0.0, 1.0];
    }

    onUpdate(delta) {
        this.xrot += 0;
        this.wavePeriod += delta * 0.001;
        super.onUpdate(delta);      // run onUpdate() on child nodes in the world node.
    }

    onDraw(engine) {
        L.log(this.wavePeriod);
        let modelRotation = pg.xrot(this.xrot);
        flag_render.draw(gl3d.gl, this.ch, this.pos, this.scale, modelRotation, this.bg, gl3d.facingView(), this.wavePeriod);
        super.onDraw(engine);       // run onDraw() on child nodes.
    }

}

