// mitec — home page interactivity.
// Three independent, small behaviours: mobile nav toggle, portfolio tab
// filter, and the FAQ accordion. No dependencies, no build step — this
// loads as a plain ES module straight off the page.

function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) close();
    else open();
  });

  // Close after choosing a link, on Escape, or when the layout grows past
  // the breakpoint where the menu is no longer an overlay.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close();
  });
}

function initWorkFilter() {
  const tabs = document.getElementById('workTabs');
  const grid = document.getElementById('workGrid');
  const emptyNote = document.getElementById('workEmpty');
  if (!tabs || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.work-card'));
  const buttons = Array.from(tabs.querySelectorAll('.tabs__btn'));

  function applyFilter(filter) {
    let visible = 0;
    for (const card of cards) {
      const tags = (card.dataset.tags || '').split('|');
      const show = filter === 'همه' || tags.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    }
    if (emptyNote) emptyNote.hidden = visible !== 0;
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tabs__btn');
    if (!btn) return;
    for (const b of buttons) {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    }
    applyFilter(btn.dataset.filter);
  });
}

function initFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));

  function setOpen(item, isOpen) {
    const btn = item.querySelector('.faq-item__q');
    const panel = item.querySelector('.faq-item__a');
    const chevron = item.querySelector('.faq-item__chevron');
    btn.setAttribute('aria-expanded', String(isOpen));
    panel.hidden = !isOpen;
    if (chevron) chevron.textContent = isOpen ? '−' : '+';
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-item__q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    // Single-open accordion: opening one closes every other item.
    for (const other of items) setOpen(other, other === item && willOpen);
  });
}

initNav();
initWorkFilter();
initFaq();
