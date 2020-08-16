/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// Serves as sample template for module file.

// util module
let U = (function() {
    const U = {};

    // Bit operations on 32-bit array at bit position (0th to 31st)
    U.bitSet    = (bits, position)      => bits |  (1 << position);
    U.bitClear  = (bits, position)      => bits & ~(1 << position);
    U.bitFlip   = (bits, position)      => bits ^  (1 << position);
    U.bitPut    = (bits, position,bool) => bool ? U.bitSet(bits, position) : U.bitClear(bits, position);
    U.bitOn     = (bits, position)      => !(!(bits & (1 << position)));
    U.bitOff    = (bits, position)      =>   !(bits & (1 << position));

    L.info("module loaded");
    return U;
}());

export default U;
