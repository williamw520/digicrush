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

    audio.sprinkle      = () => zzfx(1,.05,539,0,.04,.29,1,1.92,0,0,567,.02,.02,0,0,0,.04,1,0,0);
    audio.fuse1         = () => zzfx(1,.05,13,.1,.22,.62,1,.47,.5,0,24,0,.02,0,0,.1,.11,.62,.04,0);
    audio.fuse2         = () => zzfx(1,.05,245,.24,.22,.71,0,1.31,0,0,-29,.03,.03,0,0,0,0,.66,.09,0);
    audio.fuse3         = () => zzfx(1,.05,727,.28,.12,.61,1,.57,-3.6,-4.8,-291,.07,.13,0,0,0,.17,.97,.05,0);
    audio.explosion     = () => zzfx(1,.05,333,.01,0,.9,4,1.9,0,0,0,0,0,.5,0,.6,0,1,0,0);
    audio.explosion2    = () => zzfx(1,.05,501,0,.01,1.91,4,2.41,.1,.8,0,0,0,.6,0,.4,0,.77,.09,0);
    audio.shot          = () => zzfx(1,.05,418,0,.02,.2,4,1.15,-8.5,0,0,0,0,.7,0,.1,0,1,0,0);
    audio.rocket        = () => zzfx(1,.05,941,.8,0,.8,4,.74,-222,0,0,0,0,.8,0,1,0,1,0,0);
    audio.down          = () => zzfx(1,.05,925,.04,.3,.6,1,.3,0,6.27,-184,.09,.17,0,0,0,0,1,0,0);
    audio.monster       = () => zzfx(1,.05,662,.82,.11,.33,1,0,0,-0.2,0,0,0,1.2,0,.26,.01,1,0,0);
    
    return audio;
}());

export default audio;
