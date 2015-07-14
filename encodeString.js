var _ = require('lodash');
var args = process.argv.slice(2);

if(args.length < 2) {
    console.log('*** Usage: node getString <string_to_encode> <font_map_js>');
    return;
}

var stringToEncode = args[0];
var fontMapFileName = args[1];
//fontMapFileName = __dirname + fontMapFileName;
//if(fontMapFileName.substring(0, 1) != '/' && fontMapFileName.substring(0, 2) != './' &&
//    fontMapFileName.substring(0, 3) != '../') {
//
//}

var fs = require('fs');
var fontMap = JSON.parse(fs.readFileSync(fontMapFileName, { encoding: 'utf8' }));

var res = '';
for(var i = 0; i < stringToEncode.length; ++i) {
    var c = '0x' + stringToEncode.charCodeAt(i).toString(16);
    var replaceWith = fontMap[c];
    if(replaceWith) {
        c = replaceWith;
    } else {
        c = fontMap['0x' + '_'.charCodeAt(0).toString(16)];
    }

    c = c.replace(/^0/, '&#') + ';';

    res += c;
}

console.log(res);
