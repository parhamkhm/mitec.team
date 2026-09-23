// mitec — scroll-linked section effects. Each is a track on the shared
// engine: geometry is cached in measure(), and update() maps the scroll
// position to transforms only, skipping frames where nothing changed. The
// engine parks every effect at its end state while its section is off
// screen. Reveal-once motion lives in reveal.js + motion.css, not here.

import { track, view, whenMotion } from './engine.js';
import { seg, lerp } from './easing.js';

// Document top of an element from layout offsets, so transforms (reveals,
// parallax) never skew the cached geometry.
const docTop = (el) => {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
};

// Progress of el from "its top enters the viewport's bottom" (0) to "its
// bottom leaves the viewport's top" (1).
function passing(el, render) {
  let top = 0, h = 0, last = -1;
  return {
    el,
    measure() { top = docTop(el); h = el.offsetHeight; last = -1; },
    update() {
      const t = seg(view.y, top - view.h, top + h);
      if (t !== last) render((last = t));
    }
  };
}

// Work: the screenshot drifts inside its tile, +4% → −4% of its height.
function workParallax() {
  return [...document.querySelectorAll('.work-row__media')].map((tile) => {
    const shot = tile.querySelector('.work-row__shot');
    return passing(tile, (t) => { shot.style.transform = `translateY(${lerp(4, -4, t)}%)`; });
  });
}

export function initEffects() {
  whenMotion(() => {
    const effects = [...workParallax()];
    const offs = effects.map(track);
    return () => {
      offs.forEach((off) => off());
      document.querySelectorAll('.work-row__shot').forEach((el) => el.removeAttribute('style'));
    };
  });
}
