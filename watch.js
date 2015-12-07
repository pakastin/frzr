
const cp = require('child_process');
const chokidar = require('chokidar');

exec('npm run build')();

chokidar.watch('src/**/*.js')
    .on('change', exec('npm run build'));

function exec (cmd) {
  return () => {
    cp.exec(cmd, (err, stdout, stderr) => {
      err && console.error(err);
      stdout && console.log(stdout);
      stderr && console.error(stderr);
    });
  };
}
