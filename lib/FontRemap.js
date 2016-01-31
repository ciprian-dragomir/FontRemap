'use strict';

var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util'),
    child_process = require('child_process'),
    _ = require('lodash');

const pythonCmd = 'python3';

var FontRemap = function(font) {
    this.font = font || null;
};

var $method = function(cls, methodName, func) {
    cls.prototype[methodName] = func;
    return this;
};

$method(FontRemap, 'remap', function(config, callback) {
    // Config object structure; Post-populated with values
    // supplied by the caller;
    config = _.extend({
        src: null,
        dest: null,
        map: 'font-map.json',
        ttx: null,
        // THESE MUST BE CHANGED OR SOMEHOW INFERRED FROM THE FONT
        // FILE AS THEY CAN VARY BASED ON THE FONT ITSELF.
        cmapFormats: ['cmap_format_4', 'cmap_format_12']
    }, config);

    if(!config.ttx) {
        throw 'Please specify a valid path for font-tools ttx.py';
    }

    if(!config.src) {
        throw 'Input file is not valid: ' + config.src;
    }

    const lastDotAt = config.src.lastIndexOf('.');
    const srcSegments = {};
    srcSegments.extension = config.src.substring(lastDotAt + 1);
    srcSegments.base = config.src.substring(0, lastDotAt);

    if(!config.dest) {
        config.dest = srcSegments.base + '.modified.' + srcSegments.extension;
    }

    if(!config.map) {
        throw 'Mapping file name is not valid: ' + config.map;
    }

    var ttxFile = config.src.substring(0, config.src.lastIndexOf('.')) + '.ttx';

    var parse = function(callback) {
        var xml2js = require('xml2js');

        fs.readFile(ttxFile, function(err, data) {
            if(err) {
                console.error(err);
                return;
            }
            if(data) {
                var parser = xml2js.Parser();
                parser.parseString(data, callback);
            }
        });
    };

    var onParse = function(err, result) {

        var cmap = result.ttFont.cmap[0];
        var map0 = cmap[config.cmapFormats[0]];
        if(_.isArray(map0)) {
            map0 = map0[0].map;
        } else {
            map0 = map0.map;
        }

        // Extract character codes;
        var characterCodes = [];
        map0.forEach(function(element) {
            characterCodes.push(element.$.code);
        });

        // Randomize character codes;
        var shuffledCharacterCodes = _.shuffle(characterCodes);

        var mapping = {};
        for(var i = 0; i < characterCodes.length; ++i) {
            mapping[characterCodes[i]] = shuffledCharacterCodes[i];
        }

        var substituteCharacterCodes = function(mapObject) {
            var i = 0;
            mapObject.forEach(function(element) {
                element.$.code = shuffledCharacterCodes[i++];
            });
        };

        config.cmapFormats.forEach(function(format) {
            var mapi = cmap[format];

            if(_.isArray(mapi)) {
                mapi.forEach(function(mi) {
                    substituteCharacterCodes(mi.map);
                });
            } else {
                if(!_.isUndefined(mapi.map)) {
                    substituteCharacterCodes(mapi.map);
                }
            }
        });

        var xml = new xml2js.Builder().buildObject(result);

        console.log('Writing font map to ' + config.map + '.');
        fs.writeFile(config.map, JSON.stringify(mapping));
        console.log('Writing modified font to ' + config.dest);
        fs.writeFile(srcSegments.base + '.ttx', xml, (err) => {
            if(err) {
                throw err;
            }
            const fontCreateCmd =  pythonCmd + ' ' + config.ttx + ' -o ' + config.dest + ' ' + srcSegments.base + '.ttx ';
            child_process.exec(fontCreateCmd, (error, stdout, stderr) => {
                if(error) {
                    console.error(stderr);
                } else {
                    console.log(stdout);
                    console.log('Done.');
                }
            });
        });
    };

    const command = pythonCmd + ' ' + config.ttx + ' -f ' + config.src;
    fs.stat(config.src, function(err, stats) {
        if(err) {
            throw err;
        } else {
            if(stats.isFile()) {
                child_process.exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.log(stderr);
                        return;
                    }

                    console.log('Created ttx file: ' + ttxFile);

                    parse(onParse);

                    if (callback) {
                        callback.call(this, error);
                    }
                });
            } else {
                // Not a file
                throw config.src + ' is not a valid font file.';
            }
        }
    });

});

$method(FontRemap, 'encode', function(stringToEncode, fontMap, callback) {
    if(!callback) {
        return;
    }

    fs.stat(fontMap, (err, stats) => {
        if(err) {
            throw err;
        }
        if(stats.isFile()) {
            fontMap = JSON.parse(fs.readFileSync(fontMap, { encoding: 'utf8' }));

            var res = [];
            for(var i = 0; i < stringToEncode.length; ++i) {
                var c = '0x' + stringToEncode.charCodeAt(i).toString(16);
                var replaceWith = fontMap[c];
                if(replaceWith) {
                    c = replaceWith;
                } else {
                    c = fontMap['0x' + '_'.charCodeAt(0).toString(16)];
                }

                c = c.replace(/^0/, '&#') + ';';

                res.push(c);
            }

            callback.call(null, res.join(''));
        } else {
            throw {
                message: fontMap + ' is not a valid font mapping.',
                error: 'invalid_font_file'
            }
        }
    });
});

module.exports = function(font) {
    return new FontRemap(font);
};