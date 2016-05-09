
var cp = require('child_process');

exec('npm', ['run', 'build']);
exec('npm', ['run', 'build-website']);

exec('chokidar', ['src/**/*.js', '-c', 'npm run build']);
exec('chokidar', ['dist/frzr.js', '-c', 'npm run uglify']);
exec('chokidar', ['test/test.js', '-c', 'npm run justtest']);

exec('chokidar', ['website/css/**.styl', '-c', 'npm run build-website-css']);
exec('chokidar', ['website/js/**.js', '-c', 'npm run build-website-js']);
exec('chokidar', ['dist/js/main-dev.js', '-c', 'npm run uglify-website-js']);

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
