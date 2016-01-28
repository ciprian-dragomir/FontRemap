'use strict';

var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');
var child_process = require('child_process');
var _ = require('lodash');

var FontRemap = function(font) {
    this.font = font || null;
};

var $method = function(cls, methodName, func) {
    cls.prototype[methodName] = func;
    return this;
};

$method(FontRemap, 'remap', function(config, callback) {
    // Config object structure;
    config = _.extend({
        src: null,
        dest: null,
        map: 'font-map.js',
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

    if(!config.dest) {
        config.dest = config.src.replace('.ttx', 'modified') + '';
    }

    if(!config.map) {
        throw 'Mapping file name is not valid: ' + config.map;
    }

    var parse = function(callback) {
        var xml2js = require('xml2js');

        fs.readFile(config.src + '.ttx', function(err, data) {
            if(err) {
                console.error(err);
                return;
            }
            if(data) {
                parser.parseString(data, function (err, result) {
                    console.log(result);
                });
            }
        });


    };

    const command = 'python3 ' + config.ttx + ' -f ' + config.src + ' -o ' +
            config.src + '.ttx';

    fs.stat(config.src, function(err, stats) {
        if(err) {
            throw err;
        } else {
            child_process.exec(command, (error, stdout, stderr) => {
                if(error) {
                    console.log(stderr);
                    return;
                }

                console.log('Created ttx file: ' + config.dest);

                parse();

                if(callback) {
                    callback.call(this, error);
                }
            });
        }
    });

});

$method(FontRemap, 'encode', function() {

});

module.exports = function(font) {
    return new FontRemap(font);
};