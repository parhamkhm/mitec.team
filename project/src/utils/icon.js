// mitec — icons from script. Every icon is a Lucide glyph (or a brand mark) as
// <symbol id="i-NAME">: the ones a first view can show in the inline sprite at
// the top of index.html, the rest in public/icons.svg. Drawn by .icon in
// components.css; nothing is fetched from another host.

const NS = 'http://www.w3.org/2000/svg';
const FILE = new URL('../../public/icons.svg', import.meta.url).href;
const ref = (name) => (document.getElementById(`i-${name}`) ? `#i-${name}` : `${FILE}#i-${name}`);

// <svg class="icon icon-NAME [extra]" aria-hidden="true"><use href="#i-NAME"/></svg>, or the
// file's URL in href for an icon that isn't inline.
export function icon(name, extra = '') {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', `icon icon-${name}${extra ? ` ${extra}` : ''}`);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', ref(name));
  svg.append(use);
  return svg;
}

// Swap an icon's glyph in place, keeping any other classes it carries.
export function setIcon(svg, name) {
  for (const c of [...svg.classList]) if (c.startsWith('icon-')) svg.classList.remove(c);
  svg.classList.add(`icon-${name}`);
  svg.querySelector('use').setAttribute('href', ref(name));
}
