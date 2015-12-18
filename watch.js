
const cp = require('child_process');
const chokidar = require('chokidar');

exec('npm run build')();

chokidar.watch('src/**/*.js')
    .on('change', exec('npm run build'));

function exec (cmd) {
  return () => {
    console.log(cmd);
    cp.exec(cmd, (err, stdout, stderr) => {
      if (err) console.error(err);
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });
  };
}
