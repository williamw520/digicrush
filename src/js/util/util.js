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

    U.loadImages = (urls, onDone) => {
        let pendingCount = urls.length;
        let images = urls.map(() => new Image());
        let onload = () => --pendingCount === 0 && onDone(images);
        images.forEach( (img, i) => (img.src = urls[i], img.onload = onload) );
        return images;
    }

    U.isPowerOf2 = (value) => (value & (value - 1)) == 0;

    U.ensurePowerOf2 = (uptoValue, startingPowerValue) => {
	let power2Value = startingPowerValue || 1;
	while (power2Value < uptoValue)
	    power2Value *= 2;
	return power2Value;
    }

    U.first = (array) => array.length > 0 ? array[0] : null;
    U.last  = (array) => array.length > 0 ? array[array.length - 1] : null;

    U.rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return U;
}());

export default U;
