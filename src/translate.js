
import { prefix } from './prefix';
import { isDefined } from './utils';

let has3d;

/**
 * Create translate(x, y) (desktop), translate3d(x, y, 0) (mobile) or translate3d(x, y, z)
 * @param  {Number} [x=0]   Z-coordinate
 * @param  {Number} [y=0]   Z-coordinate
 * @param  {Number} [z=0]   Z-coordinate
 * @return {String}         CSS string
 */
export function translate (x = 0, y = 0, z = 0) {
  if (typeof has3d === 'undefined') {
    has3d = check3d();
  }

  if (has3d || z) {
    return 'translate3d(' + x + ', ' + y + ', ' + z + ')';
  } else {
    return 'translate(' + x + ', ' + y + ')';
  }
}

function check3d () {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return false;
  }

  const transform = prefix('transform');
  const $p = document.createElement('p');

  document.body.appendChild($p);
  $p.style[transform] = 'translate3d(1px,1px,1px)';
  has3d = $p.style[transform];

  if (isDefined(has3d) && has3d.length && has3d !== 'none') {
    has3d = true;
  } else {
    has3d = false;
  }

  document.body.removeChild($p);

  return has3d;
}
