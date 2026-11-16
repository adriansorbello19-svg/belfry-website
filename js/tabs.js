// Demo tiles.
// Desktop/tablet: tabs switch the panel; arrow keys move between tabs.
// Mobile (≤760px): tabs are hidden and every panel shows as a swipeable
// carousel card, so all panels are exposed to assistive tech as slides.
document.querySelectorAll('[data-tabs]').forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  const mobile = matchMedia('(max-width: 760px)');
  let current = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));

  // Each card's pager marks its own position (1–4).
  panels.forEach((p, j) => p.querySelectorAll('.pager span').forEach((d, k) => d.classList.toggle('is-active', k === j)));

  function select(i, focus) {
    current = i;
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      panels[j].classList.toggle('is-active', on);
      panels[j].hidden = false; // keep in layout so heights stay equal
      if (mobile.matches) {
        panels[j].setAttribute('role', 'group');
        panels[j].setAttribute('aria-roledescription', 'slide');
        panels[j].setAttribute('aria-label', `${j + 1} of ${panels.length}: ${tabs[j].textContent.trim()}`);
        panels[j].removeAttribute('aria-hidden');
      } else {
        panels[j].setAttribute('role', 'tabpanel');
        panels[j].removeAttribute('aria-roledescription');
        panels[j].removeAttribute('aria-label');
        panels[j].setAttribute('aria-hidden', !on);
      }
    });
    if (focus) tabs[i].focus();
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const n = tabs.length;
      if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); select((i - 1 + n) % n, true); }
      if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      if (e.key === 'End')  { e.preventDefault(); select(n - 1, true); }
    });
  });

  mobile.addEventListener('change', () => select(current));
  select(current);
});
