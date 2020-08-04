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
let M = (function() {
    "use strict";

    const M = { NAME: "app" };
    const log = new logger.Logger(M.NAME);

    log.info("module loaded");
    return M;

}());

export default M;
