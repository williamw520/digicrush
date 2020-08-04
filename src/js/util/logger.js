/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// logger module, for lightweight logging with prefix on app name and module name for easier filtering when viewing the log.
let M = (function() {
    "use strict";

    const M = { NAME: "logger" };

    // Log levels
    const NONE = 0;
    const ERROR = 1;
    const WARN = 2;
    const INFO = 3;
    const LOG = 4;              // this is the finest logging level, like debug.

    const DEFAULT_APP = "digicrush";
    const DEFAULT_LEVEL = INFO;

    class Logger {
        constructor(mod, app, level) {
            this._mod = mod;
            this._app = app || DEFAULT_APP;
            level = level || DEFAULT_LEVEL;
            this._levelFn = (typeof level === "function") ? level : () => level;
            this._tagtime = {};                 // benchmark tagged times
            this._tagtime[""] = Date.now();     // set up the default empty benchmark tag.
        }

        get app()       { return this._app              }
        get mod()       { return this._mod              }
        get level()     { return this._levelFn()        }
        get _logNone()  { return this.level == NONE     }
        get _logError() { return this.level >= ERROR    }
        get _logWarn()  { return this.level >= WARN     }
        get _logInfo()  { return this.level >= INFO     }
        get _logLog()   { return this.level >= LOG      }

        // Log and return the first argument.
        error(...a)     { if (this._logError) console.error(this._fmt(a));  return this._1st(a);    };
        warn(...a)      { if (this._logWarn)  console.warn(this._fmt(a));   return this._1st(a);    };
        info(...a)      { if (this._logInfo)  console.info(this._fmt(a));   return this._1st(a);    };
        log(...a)       { if (this._logLog)   console.log(this._fmt(a));    return this._1st(a);    };
        out(...a)       { console.log(this._fmt(a));                        return this._1st(a);    };

        dump()          { return this._fmtarr(Array.prototype.slice.call(arguments)) }  // dump the arguments to string/json

        // Simple tag-based benchmark functions.
        bench(msg)      { this.timeOn("", msg) }                                        // benchmark on the default empty tag
        timeSet(tag, msg)   {                                                           // start benchmark on the tag, reset timer.
            delete this._tagtime[tag];
            this.timeOn(tag, msg);
        }
        timeOn(tag, msg)    {                                                           // benchmark on the tag, report lapsed time, and update tag timer.
            let now  = Date.now();
            let last = this._tagtime[tag] || now;
            this._tagtime[""] = this._tagtime[tag] = now;                               // update time on the tag and the default empty tag.
            if (this._logInfo)
                console.log( this._prefix() + " - " + tag + " " + (now - last) + "ms - " + msg );
        }

        // With prefix on app name and mod name for easier filtering when viewing the log.
        _prefix()       { return this.app + ":" + this.mod };
        _fmt(a)         { return this._prefix() + " - " + this._fmtarr(a) }
        _fmtarr(a)      { return !a || !a.length ? "" : a.length == 1 ? this._fmtobj(a[0]) : "[" + [].map.call(a, o => this._fmtobj(o) + "\r\n").join(", ") + "]" }
        _fmtobj(obj)    { return this._json(obj instanceof Error ? this._fromerr(obj) : obj) }
        _fromerr(e)     { return {error: e.name, msg: e.message, file: e.fileName || "", line: e.lineNumber || "", stack: e.stack ? e.stack.split("\n") : "" } }
        _json(obj)      { return JSON.stringify(obj, null, 4) };
        _1st(a)         { return a && a.length > 0 ? a[0] : null }
        _2nd(a)         { return a && a.length > 1 ? a[1] : null }

    }

    // module public symbols.
    M.NONE = NONE;
    M.ERROR = ERROR;
    M.WARN = WARN;
    M.INFO = INFO;
    M.LOG = LOG;
    M.Logger = Logger;

    return M;

}());

export default M;
