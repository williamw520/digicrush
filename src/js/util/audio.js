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
    audio.fuse1         = () => zzfx(...[,,13,.1,.22,.62,1,.47,.5,,24,,.02,,,.1,.11,.62,.04]);
    audio.fuse2         = () => zzfx(...[,,245,.24,.22,.71,,1.31,,,-29,.03,.03,,,,,.66,.09]);
    audio.fuse3         = () => zzfx(...[,,727,.28,.12,.61,1,.57,-3.6,-4.8,-291,.07,.13,,,,.17,.97,.05]);
    audio.explosion     = () => zzfx(...[,,333,.01,0,.9,4,1.9,,,,,,.5,,.6]);
    audio.explosion2    = () => zzfx(...[,,501,,.01,1.91,4,2.41,.1,.8,,,,.6,,.4,,.77,.09]);
    audio.shot          = () => zzfx(...[,,418,0,.02,.2,4,1.15,-8.5,,,,,.7,,.1]);
    audio.rocket        = () => zzfx(...[,,941,.8,,.8,4,.74,-222,,,,,.8,,1]);
    audio.down          = () => zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]);
    audio.monster       = () => zzfx(...[,,662,.82,.11,.33,1,0,,-0.2,,,,1.2,,.26,.01]);

    return audio;
}());

export default audio;
