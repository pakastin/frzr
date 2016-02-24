
var cp = require('child_process');

exec('npm', 'run', 'build');

exec('chokidar', 'src/**/*.js', '-c', 'npm run build');

function exec (cmd) {
  var args = new Array(arguments.length - 1);

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i + 1];
  }

  var childProcess = cp.spawn(cmd, args);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}
