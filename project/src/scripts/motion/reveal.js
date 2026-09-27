// mitec — reveal once, on enter. `[data-reveal]` rises in as one piece;
// `[data-reveal-stagger]` rises its children in one after another. This only
// adds .is-revealed — the motion is a CSS animation in motion.css, so nothing
// runs per frame and nothing is left running once everything has shown.
//
// Once the entrance has played, or keyboard focus has reached the element,
// it is .is-settled: its animation is removed for good. Otherwise the focus
// rule in motion.css (which drops the animation while focus is inside, so
// focused content shows at once) would restart the entrance every time focus
// left again.

export function initReveal() {
  const els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-revealed');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  const settle = (el) => el.classList.add('is-settled');
  for (const el of els) {
    const stagger = el.hasAttribute('data-reveal-stagger');
    if (stagger) {
      [...el.children].forEach((child, i) => child.style.setProperty('--i', i));
    }
    io.observe(el);
    let done = 0;
    el.addEventListener('animationend', (e) => {
      if (stagger ? e.target.parentElement === el && ++done >= el.children.length : e.target === el) settle(el);
    });
    el.addEventListener('focusin', () => settle(el), { once: true });
  }
  // Without html.motion the hidden state no longer applies, so there is
  // nothing to undo beyond stopping the observer.
  return () => io.disconnect();
}
