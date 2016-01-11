
import { prefix } from './prefix';
import { isDefined } from './utils';

var has3d;

export function translate (x, y, z) {
  if (typeof has3d === 'undefined') {
    has3d = check3d();
  }

  if (has3d || z) {
    return 'translate3d(' + (x || 0) + ', ' + (y || 0) + ', ' + (z || 0) + ')';
  } else {
    return 'translate(' + (x || 0) + ', ' + (y || 0) + ')';
  }
}

function check3d () {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return false;
  }

  var transform = prefix('transform');
  var $p = document.createElement('p');

  document.body.appendChild($p);
  $p.style[transform] = 'translate3d(1px,1px,1px)';
  has3d = $p.style[transform];

  if (typeof has3d !== 'undefined' && has3d !== null && has3d.length && has3d !== 'none') {
    has3d = true;
  } else {
    has3d = false;
  }

  document.body.removeChild($p);

  return has3d;
}
