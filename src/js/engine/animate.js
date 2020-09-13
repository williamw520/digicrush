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
        constructor(timeRangeMS, ctx, onStartFn, onStepFn) {
            this._start = 0;                                    // start time
            this._time = 0;                                     // current time
            this._rangeMS = timeRangeMS                         // the max limit of time to run
            this._isDone = true;                                // created in the done state.
            this._ctx = ctx;
            this._onStart = onStartFn;                          // onStart callback is called as onStartFn(ctx, thisTimeline)
            this._onStep  = onStepFn;                           // onStep callback is called by step() as onStepFn(ctx, thisTimeline)
            // There's no onDone callback because the animation might not complete.
        }

        start(startTimeMS, timeRangeMS) {
            this._start = this._time = startTimeMS || performance.now();
            this._rangeMS = timeRangeMS || this._rangeMS;
            this._isDone = false;
            if (this._onStart)
                this._onStart(this._ctx, this);
        }

        step(timeMS) {
            if (this.done)
                return this.done;
            this._time = timeMS;
            if (this._onStep)
                this._onStep(this._ctx, this);
            return this.done;                                   // return the current done status on the step() call.
        }

        doneNow() {
            this._isDone = true;                                // force to completion; animation might have completed before the allocated time range expires.
        }

        get done()      { return this.pos >= 1 }
        get pos()       { return this._elapse / this._rangeMS }                         // current position in the range [0, 1]
        get rpos()      { return (this._rangeMS - this._elapse) / this._rangeMS }       // current reverse position in the range [1, 0]
        get _elapse()   { return this._isDone ? this._rangeMS :
                                 Math.min(this._time - this._start, this._rangeMS) }    // elapse time, upto the time range.
        get ctx()       { return this._ctx     }                                        // caller can modify the returned map.
    }

    // This allows a sequence of Timelines to run one after another.
    // Each Timeline runs through its time range, and then the next one runs.
    // Each Timeline is one stage.  Caller queries the current stage of the group and acts accordingly.
    // This allows multi-stage animation.
    A.TimeGroup = class {
        constructor(timelines) {
            this._timelines = timelines || [];
            this._stage = 0;
        }

        add(timeline) {
            this._timelines.push(timeline);
            return this;
        }

        start(timeMS) {
            this._stage = 0;
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
                this.timeline.doneNow();                                    // complete the current timeline.
            }
        }

        doneNow() {
            this._timelines.forEach( t => t.doneNow() );                    // complete all timelines.
        }

        get timeline()  { return this._timelines[this._stage]           }   // get the current stage's timeline.
        get ctx()       { return this.timeline.ctx                      }
        get pos()       { return this.timeline.pos                      }
        get rpos()      { return this.timeline.rpos                     }
        get stage()     { return this._stage                            }
        get done()      { return this._stage >= this._timelines.length  }

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

