// Keeps --cta-h in step with the CTA card's height so the sticky card
// (css/connected.css) can pin with its centre at the middle of the screen.
(() => {
  const card = document.querySelector('.cta-card');
  if (!card) return;
  const update = () => card.style.setProperty('--cta-h', card.offsetHeight + 'px');
  update();
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(card);
  else addEventListener('resize', update);
})();
