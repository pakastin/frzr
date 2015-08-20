
var chokidar = require('chokidar')
var cp = require('child_process')

buildJS()

chokidar.watch('./scripts/**/*.js')
  .on('change', buildJS)

function buildJS () {
  exec('npm run build-js')
}

function exec (cmd) {
  cp.exec(cmd, function (err, stdout, stderr) {
    if (err) {
      console.error(err)
      return
    }
    if (stderr) {
      console.error(stderr)
      return
    }
    console.log(stdout)
  })
}
