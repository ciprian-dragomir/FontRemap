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
        ttx: 'ttx',
        // THESE MUST BE CHANGED OR SOMEHOW INFERRED FROM THE FONT
        // FILE AS THEY CAN VARY BASED ON THE FONT ITSELF.
        cmapFormats: ['cmap_format_4', 'cmap_format_12']
    }, config);

    if(!config.src) {
        throw 'Input file is not valid: ' + config.src;
    }

    if(!config.dest) {
        throw 'Output file name is not valid: ' + config.src;
    }

    if(!config.map) {
        throw 'Mapping file name is not valid: ' + config.map;
    }



    if(callback) {
        callback.call(this);
    }
});

$method(FontRemap, 'encode', function() {

});

module.exports = function(font) {
    // font must be valid file

};