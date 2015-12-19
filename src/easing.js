
/**
 * Basic easings
 * @type {Object}
 */
export const ease = { linear, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut, quartIn, quartOut, quartInOut, quintIn, quintOut, quintInOut, bounceIn, bounceOut, bounceInOut };

function linear (t) {
  return t;
}

function quadIn (t) {
  return Math.pow(t, 2);
}

function quadOut (t) {
  return 1 - quadIn(1 - t);
}

function quadInOut (t) {
  if (t < 0.5) {
    return quadIn(t * 2) / 2;
  }
  return 1 - quadIn((1 - t) * 2) / 2;
}

function cubicIn (t) {
  return Math.pow(t, 3);
}

function cubicOut (t) {
  return 1 - cubicIn(1 - t);
}

function cubicInOut (t) {
  if (t < 0.5) {
    return cubicIn(t * 2) / 2;
  }
  return 1 - cubicIn((1 - t) * 2) / 2;
}

function quartIn (t) {
  return Math.pow(t, 4);
}

function quartOut (t) {
  return 1 - quartIn(1 - t);
}

function quartInOut (t) {
  if (t < 0.5) {
    return quartIn(t * 2) / 2;
  }
  return 1 - quartIn((1 - t) * 2) / 2;
}

function quintIn (t) {
  return Math.pow(t, 5);
}

function quintOut (t) {
  return 1 - quintOut(1 - t);
}

function quintInOut (t) {
  if (t < 0.5) {
    return quintIn(t * 2) / 2;
  }
  return 1 - quintIn((1 - t) * 2) / 2;
}

function bounceOut (t) {
  const s = 7.5625;
  const p = 2.75;

  if (t < 1 / p) {
    return s * t * t;
  }
  if (t < 2 / p) {
    t -= 1.5 / p;
    return s * t * t + 0.75;
  }
  if (t < 2.5 / p) {
    t -= 2.25 / p;
    return s * t * t + 0.9375;
  }
  t -= 2.625 / p;
  return s * t * t + 0.984375;
}

function bounceIn (t) {
  return 1 - bounceOut(1 - t);
}

function bounceInOut (t) {
  if (t < 0.5) {
    return bounceIn(t * 2) / 2;
  }
  return 1 - bounceIn((1 - t) * 2) / 2;
}
