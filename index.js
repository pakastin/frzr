
var cp = require('child_process')
var chokidar = require('chokidar')

chokidar.watch('./lib/**/*.js')
  .on('change', buildScript)

buildScript()

function buildScript () {
  exec('browserify lib/index -s frzr | bundle-collapser > dist/frzr-dev.js', function (err, res) {
    if (err) {
      return console.error(err)
    }
    console.log(res)
    exec('uglifyjs dist/frzr-dev.js -cm > dist/frzr.js', function (err, res) {
      if (err) {
        return console.error(err)
      }
      console.log(res)
    })
  })
}

function exec (cmd, cb) {
  cp.exec(cmd, {encoding: 'utf-8'}, function (err, stdout, stderr) {
    if (err) {
      return cb && cb(err)
    }
    cb && cb(stderr, stdout)
  })
}
