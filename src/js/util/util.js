/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

import logger from "/js/util/logger.js";


// util module
let M = (function() {
    "use strict";

    const M = { NAME: "util" };
    const log = new logger.Logger(M.NAME);

    // Bit operations on 32-bit array at bit position (0th to 31st)
    M.bitOn     = (bits, position)      => bits |  (1 << position);
    M.bitOff    = (bits, position)      => bits & ~(1 << position);
    M.bitToggle = (bits, position)      => bits ^  (1 << position);
    M.bitSet    = (bits, position,bool) => bool ? M.bitOn(bits, position) : M.bitOff(bits, position);
    M.bitTest   = (bits, position)      => !!(bits & (1 << position));

    log.info("module loaded");
    return M;

}());

export default M;


// Unit Tests
let _RUNTEST_UTIL = true;
if (_RUNTEST_UTIL) {
    let util = M;
    console.log(util.bitOn(0, 0));
    console.log(util.bitOn(0, 1));
    console.log(util.bitOn(0, 2));
    console.log(util.bitOn(0, 3));
    console.log(util.bitTest(util.bitOn(0, 3), 3));
    console.log(util.bitTest(util.bitOn(0, 3), 1));
    
}

