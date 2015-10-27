
export default window.requestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }
