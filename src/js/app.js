/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of the JS app.  Rollup starts from here to include all other module imports.
import logger from "/js/util/logger.js";
import util from "/js/util/util.js";


// app module
let MD = (function() {
    const MD = { NAME: "app" };
    const L  = new logger.Logger(MD.NAME);

    L.info("module loaded");
    return MD;

}());

export default MD;
