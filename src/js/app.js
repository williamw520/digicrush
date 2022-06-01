/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// The main entry point of the JS app.  Rollup starts from here to include all other module imports.
import gl3d from "/js/game/gl3d.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/model/world.js";
import ui from "/js/model/ui.js";


// app module
(function() {

    window.addEventListener("load", function(event){

        ui.setup();
        gl3d.setup();               // set up the webgl and pre-generation stuff before anything else.
        let e = new Engine();       // create a Engine instance to run the game.
        let w = new World();        // create a World instance for the game data, actions, and commands.
        e.addChild(w);              // attach the World instance to the engine for it to drive.
        gl3d.start();               // start webgl.
        e.start();                  // start the game.

        // remember to comment out the watchdog timer.
//      setTimeout(() => e.stop(), 120000);
    })

}());

