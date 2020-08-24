/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// Serves as sample template for module file.

L.info("module starts");

// util module
let U = (function() {
    const U = {};

    U.loadImages = (urls, onDone) => {
        let pendingCount = urls.length;
        let images = urls.map(() => new Image());
        let onload = () => --pendingCount === 0 && onDone(images);
        images.forEach( (img, i) => (img.src = urls[i], img.onload = onload) );
        return images;
    }

    // Bit operations on 32-bit array at bit position (0th to 31st)
    U.bitSet    = (bits, position)      => bits |  (1 << position);
    U.bitClear  = (bits, position)      => bits & ~(1 << position);
    U.bitFlip   = (bits, position)      => bits ^  (1 << position);
    U.bitPut    = (bits, position,bool) => bool ? U.bitSet(bits, position) : U.bitClear(bits, position);
    U.bitOn     = (bits, position)      => !(!(bits & (1 << position)));
    U.bitOff    = (bits, position)      =>   !(bits & (1 << position));

    return U;
}());

export default U;
