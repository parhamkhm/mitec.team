// mitec — reveal once, on enter. `[data-reveal]` rises in as one piece;
// `[data-reveal-stagger]` rises its children in one after another. This only
// adds .is-revealed — the motion is a CSS animation in motion.css, so nothing
// runs per frame and nothing is left running once everything has shown.

export function initReveal() {
  const els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-revealed');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  for (const el of els) {
    if (el.hasAttribute('data-reveal-stagger')) {
      [...el.children].forEach((child, i) => child.style.setProperty('--i', i));
    }
    io.observe(el);
  }
  // Without html.motion the hidden state no longer applies, so there is
  // nothing to undo beyond stopping the observer.
  return () => io.disconnect();
}
