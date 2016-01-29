
const _ = require('lodash');
var yargs = require('yargs');
var argv = yargs
    .usage('Usage:\n\n    node $0 -r | [-e] <params>')
    .option('r', {
        alias: 'remap',
        description: 'Remap the glyphs of a font-file to random characters supported by the respective font.',
        example: 'node font-remap remap Robotto.ttf [RobottoRemaped.ttf]',
        type: 'boolean'
    })
    .option('s', {
        alias: 'encode',
        description: 'Encode a string using a previously generated font-mapping. The string will be legible only ' +
        'if re-mapped font is applied on the text.',
        requiresArg: 'map'
    })
    .option('m', {
        alias: 'map',
        description: 'Specify the font mapping to be used for this string encoding operation.'
    })
    .help('help')
    .argv;

const FontRemap = require('./lib/FontRemap');
if(argv['r']) {
    if(argv._.length < 1) {
        console.log('Please specify a valid font file to re-map.');
        return 1;
    }
    var dest = null;
    if(argv._.length >= 2) {
        dest = argv._[1];
    }

    FontRemap(argv._[0]).remap({
        src: argv._[0],
        dest: dest,
        map: argv._[0] + '.font-map.json',
        ttx: __dirname + '/fonttools/lib/fontTools/ttx.py'
    });
} else {
    const str = argv['s'] || argv._[0],
        fontMap = argv['m'];
    if(_.isString(str)) {
        if(!_.isString(argv['m'])) {
            console.log('Please specify the font-mapping to use as a cypher for this string using option -m (--map).');
            return 1;
        }
        FontRemap().encode(str, fontMap, (encodedString) => {
            console.log(encodedString);
        });
    } else {
        yargs.showHelp();
    }
}