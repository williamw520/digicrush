
const { series, parallel, src, dest, watch } = require("gulp");
const gls = require("gulp-live-server");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const usemin = require("gulp-usemin");
const htmlmin = require("gulp-htmlmin");
const cleanCss = require("gulp-clean-css");
const glsl = require("gulp-glsl");
const rollup = require("gulp-better-rollup");
const rootImport = require("rollup-plugin-root-import");
const fs = require("fs");
const del = require("del");
const guzip = require("gulp-zip");
const objparser = require("./tool/objparser.js");


// Temp directories for build and distribution.
const BUILD     = "build";
const DIST      = "dist";


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

// Start a Live Server on the "build" directory.
function buildserver(cb) {
    let server = gls.static(BUILD, 8080);
    server.start();
    cb();
}

// Start a Live Server on the "dist" directory.
function distserver(cb) {
    let server = gls.static("dist/digicrush", 8080);
    server.start();
    cb();
}


function setupTmpDirs(cb) {
    function mkdir(dir) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    }

    mkdir(BUILD);
    mkdir(DIST);
    mkdir(DIST + "/digicrush");
    cb();
}

// Generate model data from .obj files.
function objgen(cb) {
    return src("data/**/*.obj")
        .pipe(objparser({}))
        .pipe(dest("src/js/gen/model"));
}

// Rerun when the shader files in src/shader have been changed, to re-generate the shader.*.js files in src/js/glsl.
// Other JS files are importing from src/js/glsl.
function glslify(cb) {
    return src("src/shader/**/*.glsl")
        .pipe(glsl({
            format: 'module',                       // convert .glsl files to JS module files,
            es6:    true                            // to ES6 module.
        }))
        .pipe(dest("src/js/gen/glsl"));             // the generated JS ES6 module files saved here.
}

const gen = parallel(objgen, glslify);

function gen_watcher(cb) {
    watch(["data/**/*.obj", "src/shader/**/*.glsl"], gen);
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
        .pipe(dest(BUILD + "/js"));                 // The resolved and combined file is saved in the staging $BUILD/js directory.
}

// Copy the html and other files to BUILD so they can reference the staging app.js in $BUILD/js.
function filesToBuild(cb) {
//  return src(["src/**/*.html", "src/**/*.png"]).pipe(dest(BUILD));
    return src(["src/**/index.html", "src/**/globals.js"]).pipe(dest(BUILD));
}

// Copy files to DIST so they can be referenced in $DIST/digicrush
function filesToDist(cb) {
//    return src(["src/**/globals.js"]).pipe(dest(DIST + "/digicrush"));
    return cb;
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
        .pipe(dest(DIST + "/digicrush"));
}



function zip(cb) {
    return src(DIST + "/digicrush/**/*")
        .pipe(guzip("digicrush.zip"))
        .pipe(dest(DIST));
}

// The whole build pipeline.
const build = series(setupTmpDirs, gen, rollupJsToBuild, filesToBuild, uglifyToHtml, /*filesToDist,*/ zip)

async function clean(cb) {
    await del([DIST + "/**", BUILD + "/**"], {force:true});
    await del([DIST, BUILD]);
    await del(["src/js/gen/**"], {force:true});
    await del(["src/js/gen"]);
}


exports.liveserver = liveserver;
exports.buildserver = buildserver;
exports.distserver = distserver;
exports.objgen = objgen;
exports.glslify = glslify;
exports.gen = gen;
exports.genw = gen_watcher;
exports.build = build;
exports.clean = clean;
exports.default = series(clean, build);

