
const { series, parallel, src, dest, watch } = require("gulp");
const gls = require("gulp-live-server");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const usemin = require("gulp-usemin");
const htmlmin = require("gulp-htmlmin");
const cleanCss = require("gulp-clean-css");
const rollup = require("gulp-better-rollup");
const rootImport = require("rollup-plugin-root-import");
const fs = require("fs");
const del = require("del");
const guzip = require("gulp-zip");


// Temp directories for build and distribution.
const BUILD     = "build";
const BUILD_JS  = "build/js";
const DIST      = "dist";
const DIST_APP  = "dist/digicrush";


// Start a Live Server on the "src" directory.
// This runs directly on the original source tree before any packaging and minifying.
function liveserver(cb) {
    // serve from the "src" directory, at port 8080
    let server = gls.static("src", 8080);
    server.start();

    // use gulp.watch to trigger server actions(notify, start or stop)
    watch(["src/**/*.html", "src/**/*.js"], function(file) {
        server.notify.apply(server, [file]);
    });

    cb();
}


function setupTmpDirs(cb) {
    function mkdir(dir) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    }

    mkdir(BUILD);
    mkdir(DIST);
    mkdir(DIST_APP);
    cb();
}

// This rollup task resolves module imports and combines all the JS files into one file, app.js.
// It's not doing minify.  uglifyToHtml() will do the uglify part on the combined JS.
function rollupJsToBuild(cb) {
    return src("src/js/app.js")                     // The entry point file starting the module imports.
        .pipe(rollup({
            // There is no 'input' option as rollup is integrateed into the gulp pipeline.
            plugins: [
                rootImport({
                    // First look in 'src/js/*', then in 'src/*'.
                    root:       "src",
                    useInput:   "prepend",
                    // If can't find the file verbatim, try adding these extensions
                    extensions: ".js",
                })
            ]
        }, {
            format: "iife",                         // Use Immediately-Invoked Function Expression format for running in browser.
        }))
        .pipe(dest(BUILD_JS));                      // The resolved and combined file is saved in the staging BUILD_JS directory.
}

// Copy the html files to BUILD so they can reference the staging app.js in BUILD_JS.
function htmlToBuild(cb) {
    return src("src/**/*.html").pipe(dest(BUILD));
}

function uglifyToHtml(cb) {
    return src(BUILD + "/index.html")               // The source html needs to have build:XX blocks.
        .pipe(usemin({
            html:       [ htmlmin({ removeComments:     true,
                                    collapseWhitespace: false,
                                  }) ],
            js:         [ uglify() ],               // minify each js file in the build:js blocks.
            inlinejs:   [ uglify() ],               // minify the combined js files in the build:inlinejs block.
            inlinecss:  [ cleanCss(), "concat" ],   // minify the combined css files in the build:css block.
        }))
        .pipe(dest(DIST_APP));
}

function zip(cb) {
    return src(DIST_APP + "/*")
        .pipe(guzip("digicrush.zip"))
        .pipe(dest(DIST));
}

// The whole build pipeline.
const build = series(setupTmpDirs, rollupJsToBuild, htmlToBuild, uglifyToHtml, zip)

async function clean(cb) {
    await del([DIST + "/**", BUILD + "/**"], {force:true});
    await del([DIST, BUILD]);
}

exports.liveserver = liveserver;
exports.build = build;
exports.clean = clean;
exports.default = series(clean, build);

