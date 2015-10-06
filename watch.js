
var cp = require('child_process')
var chokidar = require('chokidar')

chokidar.watch('./lib/**/*.js')
  .on('change', execCurry('npm run build-js'))

function execCurry (cmd) {
  return function () {
    cp.exec(cmd, function (err, stdout, stderr) {
      err && console.error(err)
      stdout && console.log(stdout)
      stderr && console.error(stderr)
    })
  }
}
