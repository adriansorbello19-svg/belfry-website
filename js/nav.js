// Mobile nav menu (≤760px): toggle, close on Escape, outside click,
// link click, or when the screen widens past the mobile breakpoint.
(() => {
  const nav = document.querySelector('.nav');
  const toggle = nav && nav.querySelector('.nav__toggle');
  if (!toggle) return;
  const mobile = matchMedia('(max-width: 760px)');

  function setOpen(open, focusToggle) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open && focusToggle) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });
  mobile.addEventListener('change', (e) => { if (!e.matches) setOpen(false); });
})();
