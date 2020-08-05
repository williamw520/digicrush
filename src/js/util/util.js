/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// Serves as sample template for module file.

import logger from "/js/util/logger.js";

// util module
let MD = (function() {
    const MD = { NAME: "util" };
    const L  = new logger.Logger(MD.NAME);

    // Bit operations on 32-bit array at bit position (0th to 31st)
    MD.bitSet       = (bits, position)      => bits |  (1 << position);
    MD.bitClear     = (bits, position)      => bits & ~(1 << position);
    MD.bitFlip      = (bits, position)      => bits ^  (1 << position);
    MD.bitPut       = (bits, position,bool) => bool ? MD.bitSet(bits, position) : MD.bitClear(bits, position);
    MD.bitOn        = (bits, position)      => !(!(bits & (1 << position)));
    MD.bitOff       = (bits, position)      =>   !(bits & (1 << position));

    L.info("module loaded");
    return MD;
}());

export default MD;
