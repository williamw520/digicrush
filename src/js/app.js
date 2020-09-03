/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// The main entry point of the JS app.  Rollup starts from here to include all other module imports.
import {v2, v3} from "/js/engine/vector.js";
import {m4, m4u} from "/js/engine/matrix.js";
import {pg} from "/js/engine/pregen.js";
import texgen from "/js/game/texgen.js";
import gl3d from "/js/game/gl3d.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/model/world.js";
import {UI} from "/js/model/ui.js";


// app module
(function() {

    let w = new World();
    let u = new UI();
    let e = new Engine(w, u);

    gl3d.setup();

    e.start();
    gl3d.start();
    setTimeout(() => e.stop(), 10000);

    L.info("module loaded");
}());

