var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');
var child_process = require('child_process');
var _ = require('lodash');

var args = process.argv.slice(2);

var defaultParams = {
    cmap_formats: ['cmap_format_4', 'cmap_format_12'],
    fontMapFileName: 'font_map.js',
    modifiedFontFileSuffix: '_modified',
    ttx: 'fonttools/lib/fontTools/ttx.py'
};

var fontFileName = args[0];
if(!fontFileName) {
    console.log('Please supply a valid ttf font file.');
}
var outName = args[1];
if(!outName) {
    outName = '';
}

var params = _.extend({}, defaultParams);
//console.log(__dirname);
var buf = child_process.spawnSync('python3',  [__dirname + '/' + params.ttx, '-f', fontFileName], { encoding: 'utf8' });
console.log(buf.stdout);
console.log('Succesfully created ttx file.');
fontFileName = fontFileName.substring(0, fontFileName.lastIndexOf('.')) + '.ttx';

var parser = new xml2js.Parser();

fs.readFile(fontFileName, function(err, data) {
	if(data) {
    parser.parseString(data, function (err, result) {

        var cmap = result.ttFont.cmap[0];

        // get character codes from first map; assume character codes are the same for all map versions
        var map0 = cmap[params.cmap_formats[0]];
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

        for(var f in params.cmap_formats) {
            var mapi = cmap[params.cmap_formats[f]];

            if(_.isArray(mapi)) {
                mapi.forEach(function(mi) {
                    substituteCharacterCodes(mi.map);
                });
            } else {
                if(!_.isUndefined(mapi.map)) {
                    substituteCharacterCodes(mapi.map);
                }
            }
        }

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);

        console.log('Writing font map to ' + outName + params.fontMapFileName + '.');
        fs.writeFile(outName + params.fontMapFileName, JSON.stringify(mapping));
        if(!outName && outName.length === 0) {
            fontFileName = fontFileName.substring(0, fontFileName.lastIndexOf('.')) +
                params.modifiedFontFileSuffix + '.ttx';
        } else {
            fontFileName = outName + '.ttx';
        }

        console.log('Writing font ttx to ' + fontFileName);
        fs.writeFileSync(fontFileName, xml);

        buf = child_process.spawnSync('python3',  [__dirname + '/' + params.ttx, fontFileName], { encoding: 'utf8' });
        console.log(buf.stdout);
        console.log('Done.');
    });
}
});