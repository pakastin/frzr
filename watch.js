
var cp = require('child_process');

exec('npm', ['run', 'build']);
exec('chokidar', ['src/**/*.js', '-c', 'npm run build']);
exec('chokidar', ['dist/frzr.js', '-c', 'npm run uglify']);

function exec (cmd, args) {
  var child = cp.spawn(cmd, args || [])
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  var next = new Array(arguments.length - 2);
  for (var i = 0; i < next.length; i++) {
    next[i] = arguments[i + 2];
  }
  next.length && exec.apply(this, next);
}
