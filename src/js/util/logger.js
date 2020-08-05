/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// logger module, for lightweight logging with prefix on app name and module name for easier filtering when viewing the log.
let MD = (function() {
    const MD = { NAME: "logger" };

    // Log levels
    const NONE = 0;
    const ERROR = 1;
    const WARN = 2;
    const INFO = 3;

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

        get app()       { return this._app          }
        get mod()       { return this._mod          }
        get level()     { return this._levelFn()    }

        // Log and return the first argument.
        error(...a)     { if (this.level >= ERROR)  console.error(this._fmt(a));    return this._1st(a); };
        warn(...a)      { if (this.level >= WARN)   console.warn(this._fmt(a));     return this._1st(a); };
        info(...a)      { if (this.level >= INFO)   console.info(this._fmt(a));     return this._1st(a); };

        // Simple tag-based benchmark functions.
        timeSet(tag, msg)   {                                                           // start benchmark on the tag, reset timer.
            delete this._tagtime[tag];
            this.timeOn(tag, msg);
        }
        timeOn(tag, msg)    {                                                           // benchmark on the tag, report lapsed time, and update tag timer.
            let now  = Date.now();
            let last = this._tagtime[tag] || now;
            this._tagtime[""] = this._tagtime[tag] = now;                               // update time on the tag and the default empty tag.
            if (this.level >= INFO)
                console.log( this.app + ":" + this.mod + " - " + tag + " " + (now - last) + "ms - " + msg );
        }

        // With prefix on app name and mod name for easier filtering when viewing the log.
        _fmt(a)         { return this.app + ":" + this.mod + " - " + this._fmtarr(a) }
        _fmtarr(a)      { return !a || !a.length ? "" : a.length == 1 ? this._fmtobj(a[0]) : "[" + [].map.call(a, o => this._fmtobj(o) + "\r\n").join(", ") + "]" }
        _fmtobj(obj)    { return this._json(obj instanceof Error ? this._fromerr(obj) : obj) }
        _fromerr(e)     { return {error: e.name, msg: e.message, file: e.fileName || "", line: e.lineNumber || "", stack: e.stack ? e.stack.split("\n") : "" } }
        _json(obj)      { return JSON.stringify(obj, null, 4) };
        _1st(a)         { return a && a.length > 0 ? a[0] : null }
    }

    // module public symbols.
    MD.NONE = NONE;
    MD.ERROR = ERROR;
    MD.WARN = WARN;
    MD.INFO = INFO;
    MD.Logger = Logger;

    return MD;
}());

export default MD;

