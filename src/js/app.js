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


// app module
(function() {

    window.addEventListener("load", function(event){

        gl3d.setup();

        let e = new Engine();
        let w = new World();
        e.addChild(w);

        e.start();
        gl3d.start();
//      setTimeout(() => e.stop(), 120000);
    })

}());

