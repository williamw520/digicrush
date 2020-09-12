/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import zzfx from "/js/util/zzfx.js";

// audio module
let audio = (function() {
    const audio = {};

    audio.sprinkle      = () => zzfx(...[,,539,0,.04,.29,1,1.92,,,567,.02,.02,,,,.04]);
    audio.like          = () => zzfx(...[,,20,.04,,.6,,1.31,,,-990,.06,.17,,,.04,.07]);
    audio.explosion     = () => zzfx(...[,,333,.01,0,.9,4,1.9,,,,,,.5,,.6]);
    audio.shot          = () => zzfx(...[,,418,0,.02,.2,4,1.15,-8.5,,,,,.7,,.1]);
    audio.rocket        = () => zzfx(...[,,941,.8,,.8,4,.74,-222,,,,,.8,,1]);

    return audio;
}());

export default audio;
