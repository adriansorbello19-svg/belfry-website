// Accordions.
// data-accordion="single": exactly one item always open (feature list).
// data-accordion="one":    at most one item open; opening one closes the rest,
//                          and the open one can be closed (FAQs).
// data-accordion="multi":  items toggle independently.
document.querySelectorAll('[data-accordion]').forEach((root) => {
  const single = root.dataset.accordion === 'single';
  const buttons = [...root.querySelectorAll('button[aria-controls]')];

  function set(btn, open) {
    btn.setAttribute('aria-expanded', open);
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
    const item = btn.closest('.feature, .faq__item');
    if (item) item.classList.toggle('is-open', open);
  }

  // Single-open list: reserve the height of the tallest open state so the
  // section (and the image beside it) never shifts when switching items.
  function reserve() {
    if (!single) return;
    root.style.minHeight = '';
    const current = buttons.find((b) => b.getAttribute('aria-expanded') === 'true');
    let max = 0;
    buttons.forEach((b) => { buttons.forEach((o) => set(o, o === b)); max = Math.max(max, root.offsetHeight); });
    buttons.forEach((o) => set(o, o === current));
    root.style.minHeight = max + 'px';
  }
  // Mobile (≤760px): the single-open list becomes a carousel with every item
  // open; the accordion behaviour returns above that width.
  const mobile = matchMedia('(max-width: 760px)');
  let current = buttons.find((b) => b.getAttribute('aria-expanded') === 'true') || buttons[0];
  function layout() {
    if (!single) return;
    if (mobile.matches) {
      root.style.minHeight = '';
      buttons.forEach((b) => set(b, true));
    } else {
      buttons.forEach((b) => set(b, b === current));
      reserve();
    }
  }
  if (single) {
    layout();
    addEventListener('resize', () => { if (!mobile.matches) reserve(); });
    mobile.addEventListener('change', layout);
    if (document.fonts) document.fonts.ready.then(layout);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      if (single) {
        if (open || mobile.matches) return; // one item always stays open; all open on mobile
        current = btn;
        buttons.forEach((b) => set(b, b === btn));
      } else if (root.dataset.accordion === 'one') {
        buttons.forEach((b) => set(b, b === btn ? !open : false));
      } else {
        set(btn, !open);
      }
    });
  });
});
