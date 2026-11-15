// Demo tile tabs — switches panel + pager state. Arrow keys move between tabs.
document.querySelectorAll('[data-tabs]').forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

  function select(i, focus) {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      panels[j].classList.toggle('is-active', on);
      panels[j].hidden = false; // keep in layout so heights stay equal
      panels[j].setAttribute('aria-hidden', !on);
      panels[j].querySelectorAll('.pager span').forEach((d, k) => d.classList.toggle('is-active', k === i));
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

  select(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
});
