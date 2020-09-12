/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/


// animation module
let A = (function() {
    const A = {};

    // Timeline based on time position, mapping time to a position in the range of [0, 1].
    A.Timeline = class {
        constructor(timeRangeMS) {
            this.start(0, timeRangeMS);
        }

        start(startTimeMS, timeRangeMS) {
            startTimeMS = startTimeMS || performance.now();               
            this._start = this._time = startTimeMS;             // start time and current time
            this._timeRange = timeRangeMS || this._timeRange;   // the max limit of time to stop
            this._forceDone = false;                            // force to completion; animation might have completed before the allocated time range expires.
            this._props = {};                                   // caller can store property values here to track the state of the animation.
        }

        step(timeMS) {
            this._time = timeMS;
            return this.done;               // return done status
        }

        doneNow() {
            this._forceDone = true;
        }

        get done()      { return this.pos >= 1 }                                        // is it done?
        get props()     { return this._props   }                                        // caution: caller can modify this.
        get pos()       { return this._elapse / this._timeRange }                       // current position in the range [0, 1]
        get rpos()      { return (this._timeRange - this._elapse) / this._timeRange }   // current reverse position in the range [1, 0]
        get _elapse()   { return this._forceDone ? this._timeRange :
                                 Math.min(this._time - this._start, this._timeRange) }  // elapse time, upto the time range.
    }

    // This allows a sequence of Timelines to run one after another.
    // Each Timeline runs through its time range, and then the next one runs.
    // Each Timeline is one stage.  Caller queries the current stage of the group and acts accordingly.
    // This allows multi-stage animation.
    A.TimeGroup = class {
        constructor(timeRanges) {
            this._timelines = (timeRanges || []).map( range => new A.Timeline(range) );
            this._stage = 0;
        }

        add(timeRangeMS) {
            this._timelines.push(new A.Timeline(timeRangeMS));
            return this;
        }

        start(timeMS) {
            this._stage = 0;
            assert(this._timelines.length > this._stage);
            this.timeline.start(timeMS);
        }

        step(timeMS) {
            if (!this.done) {
                if (this.timeline.step(timeMS)) {
                    this._stage++;
                    if (!this.done)
                        this.timeline.start(timeMS);
                }
            }
            return this.done;
        }

        stageDoneNow() {
            if (!this.done) {
                this.timeline.doneNow();
            }
        }

        get timeline()  { return this._timelines[this._stage]   }           // get the current stage's timeline.
        get props()     { return this.timeline.props            }
        get pos()       { return this.timeline.pos              }
        get rpos()      { return this.timeline.rpos             }
        get stage()     { return this._stage                    }
        get done()      { return this._stage >= this._timelines.length }

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

