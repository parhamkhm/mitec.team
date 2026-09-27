// mitec — icons from script. Every icon is a Lucide glyph in the inline sprite
// at the top of index.html (<symbol id="i-NAME">), drawn by .icon in
// components.css; nothing is fetched from another host.

const NS = 'http://www.w3.org/2000/svg';

// <svg class="icon icon-NAME [extra]" aria-hidden="true"><use href="#i-NAME"/></svg>
export function icon(name, extra = '') {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', `icon icon-${name}${extra ? ` ${extra}` : ''}`);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

// Swap an icon's glyph in place, keeping any other classes it carries.
export function setIcon(svg, name) {
  for (const c of [...svg.classList]) if (c.startsWith('icon-')) svg.classList.remove(c);
  svg.classList.add(`icon-${name}`);
  svg.querySelector('use').setAttribute('href', `#i-${name}`);
}
