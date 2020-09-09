/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// animation module
let A = (function() {
    const A = {};

    // Timeline based on time, mapping time to a position in the range of [0, 1].
    A.Timeline = class {
        constructor(timeRangeMS) {
            this._timeRange =  timeRangeMS; // the max limit of time to stop, e.g. 5000ms
            this._start = 0;                // start time
            this._time = 0;                 // current time
        }

        start(timeMS, rangeMS) {
            this._start = this._time = timeMS;
            this._timeRange = rangeMS || this._timeRange;
        }

        step(timeMS) {
            this._time = timeMS;
            return this.done;               // return done status
        }

        get pos()       { return (this._time - this._start) / this._timeRange }     // current position in the range [0, 1]
        get done()      { return this.pos >= 1 }                                    // is it done?
    }

    // Easing functions to map position from [0, 1] to [0, 1]
    A.linear            = t => t;                                                   // no easing, no acceleration
    A.easeInQuad        = t => t*t;                                                 // accelerating from zero velocity
    A.easeOutQuad       = t => t*(2-t);                                             // decelerating to zero velocity
    A.easeInOutQuad     = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;                         // acceleration until halfway, then deceleration
    A.easeInCubic       = t => t*t*t;                                               // accelerating from zero velocity
    A.easeOutCubic      = t => (--t)*t*t+1;                                         // decelerating to zero velocity
    A.easeInOutCubic    = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;            // acceleration until halfway, then deceleration

    return A;
}());

export default A;

