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
import ui from "/js/model/ui.js";
import {SoundGenerator} from "/js/util/sound.js";


// app module
(function() {

    window.addEventListener("load", function(event){

        gl3d.setup();

        let w = new World();
        let u = new ui.UINode(w);
        let e = new Engine(w, u);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audio = new AudioContext();
        let sg = new SoundGenerator(audio);
        sg.play("sine", 440.0, 0.8).stop(0.25);
        sg.play("square", 440, 0.5).frequency(880, 0.1).stop(0.2);

        e.start();
        gl3d.start();
        setTimeout(() => e.stop(), 120000);
    })

}());

