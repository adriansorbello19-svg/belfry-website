// Accordions.
// data-accordion="single": exactly one item open (feature list); also swaps the
//   paired media image when an item carries data-img.
// data-accordion="multi": items toggle independently (FAQs).
document.querySelectorAll('[data-accordion]').forEach((root) => {
  const single = root.dataset.accordion === 'single';
  const buttons = [...root.querySelectorAll('button[aria-controls]')];
  const media = single ? root.parentElement.querySelector('.features__media img') : null;

  function set(btn, open) {
    btn.setAttribute('aria-expanded', open);
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
    const item = btn.closest('.feature, .faq__item');
    if (item) item.classList.toggle('is-open', open);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      if (single) {
        if (open) return; // one item always stays open
        buttons.forEach((b) => set(b, b === btn));
        const src = btn.closest('[data-img]')?.dataset.img;
        if (media && src && !media.src.endsWith(src)) media.src = src;
      } else {
        set(btn, !open);
      }
    });
  });
});
