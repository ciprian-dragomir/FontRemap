//const child_process = require('child_process');
//const exec = child_process.exec;
//
////var proc = child_process.spawn('python3',  [__dirname + '/fonttools/lib/fontTools/ttx.py' .ttx, '-f', __dirname + '/demo/RobotoCondensed-Regular.modified.ttf'], { encoding: 'utf8' });
////proc = child_process.spawn('ps', { encoding: 'utf8' });
////proc.stdout.on('data', (data) => { console.log(data); });
////proc.on('close', (code, data) => {
////    console.log(code);
////    console.log(data);
////});
//const cmd = 'python3 ' + __dirname + '/fonttools/lib/fontTools/ttx.py' + ' -f ' + __dirname + '/demo/RobotoCondensed-Regular.modified.ttf';
//console.log(cmd);
//exec('python3 ' + __dirname + '/fonttools/lib/fontTools/ttx.py'+ '-f' + __dirname + '/demo/RobotoCondensed-Regular.modified.ttf',
//    (error, stdout, stderr) => {
//        if(error) {
//            console.log(stderr);
//        } else {
//            console.log('stdout: ', stdout);
//        }
//    });

module.exports = require('./lib/FontRemap');

