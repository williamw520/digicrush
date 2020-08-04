
const { series, parallel } = require("gulp");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const usemin = require("gulp-usemin");
const htmlmin = require("gulp-htmlmin");
const cleanCss = require("gulp-clean-css");
const fs = require("fs");
const del = require("del");
const guzip = require("gulp-zip");


const DIST = "dist";
const DEST = "dist/digicrush";


function mkdir(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
}

function setupDist(cb) {
    mkdir(DIST);
    mkdir(DEST);
    cb();
}

function combineIntoHtml(cb) {
    return src("src/index.html")                    // The source html needs to have build:XX blocks.
        .pipe(usemin({
            html:       [ htmlmin({ removeComments:     true,
                                    collapseWhitespace: false,
                                  }) ],
            js:         [ uglify() ],               // minify each js file in the build:js blocks.
            inlinejs:   [ uglify() ],               // minify the combined js files in the build:inlinejs block.
            inlinecss:  [ cleanCss(), "concat" ],   // minify the combined css files in the build:css block.
        }))
        .pipe(dest(DEST));
}

const build = series(setupDist, combineIntoHtml, function(cb) {
    cb();
});

function zip(cb) {
    return src(DEST + "/*")
        .pipe(guzip("digicrush.zip"))
        .pipe(dest(DIST));
}


async function clean(cb) {
    await del(DIST + "/**", {force:true});
    await del([DIST]);
}


exports.build = build;
exports.zip = zip;
exports.clean = clean;
exports.default = series(clean, build);

