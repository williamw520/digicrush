'use strict';

var path = require('path');
var through = require('through2');
var assign = require('object-assign');
var keys = Object.keys || require('object-keys');
var File = require('vinyl');
var PluginError = require('plugin-error');

var PLUGIN_NAME = 'objparser';

var defaults = {
};

function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];

    // same order as `f` indices
    const objVertexData = [
        objPositions,
        objTexcoords,
        objNormals,
    ];

    // same order as `f` indices
    let webglVertexData = [
        [],   // positions
        [],   // texcoords
        [],   // normals
    ];

    function addVertex(vert) {
        const ptn = vert.split('/');
        ptn.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr);
            const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        });
    }

    const keywords = {
        v(parts) {
            objPositions.push(parts.map(parseFloat));
        },
        vn(parts) {
            objNormals.push(parts.map(parseFloat));
        },
        vt(parts) {
            // should check for missing v and extra w?
            objTexcoords.push(parts.map(parseFloat));
        },
        f(parts) {
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
            }
        },
    };

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === '' || line.startsWith('#')) {
            continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
            continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
            console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
            continue;
        }
        handler(parts, unparsedArgs);
    }

    return {
        position: webglVertexData[0],
        texcoord: webglVertexData[1],
        normal: webglVertexData[2],
    };
}

function wrapModule(str) {
    return 'export default ' + str + ';'
}

module.exports = function(options) {
    var parsedData = {};

    options = assign({}, defaults, options);

    var parse = function(file, encoding, callback) {
        // Check file
        if (file.isNull()) {
            return callback(null, file);
        }

        // Streams not supported
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported.'));
            return;
        }

        let parsedObj = {};
        try {
            parsedObj = parseOBJ(file.contents.toString());
            parsedObj.mesh = parsedObj.position;
            delete parsedObj.position;
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, file.relative + ': ' + err));
            return;
        }

        // Generate in module format
        file.contents = new Buffer(wrapModule(JSON.stringify(parsedObj, null, 4)));
        file.path = file.path.replace(path.extname(file.relative), ".js");
        callback(null, file);
    };

    var flush = function(callback) {
        callback();
    };

    return through.obj(parse, flush);
};
