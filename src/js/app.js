/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of the JS app.  Rollup starts from here to include all other module imports.
import logger from "/js/util/logger.js";
import util from "/js/util/util.js";

import {Vec2}  from "/js/pgengine/vec2.js";


// app module
let MD = (function() {
    const MD = { NAME: "app" };
    const L  = new logger.Logger(MD.NAME);

    L.info(new Vec2(3, 4).len);
    L.info(new Vec2(1, 1).unit);
    L.info(new Vec2(1, 1).radian);
    L.info(new Vec2(1, 2).radian);
    L.info(new Vec2(-1, 2).radian);
    L.info(new Vec2(-1, -2).radian);
    L.info(new Vec2(-1, 9).radian);
    L.info(new Vec2(1, 1).scale(2));

    L.info(new Vec2(1, 1).asUnit());
    L.info(new Vec2(1, 1).asUnit().asUnit());
    
    L.info("module loaded");
    return MD;

}());

export default MD;
