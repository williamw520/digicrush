/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import state from "/js/game/state.js";
import {Flag} from "/js/model/flag.js";

// game resource module
let res = (function() {
    const res = {};

    const freeFlags = [...Array(state.MAX_FREE_FLAGS).keys()].map( () => new Flag() );
    res.allocFlag = ()    => freeFlags.pop();
    res.freeFlag  = (f)   => freeFlags.push(f);

    return res;
}());

export default res;

