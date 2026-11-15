/* =========================================================
   Layout Inspector — preview-only dev overlay
   Shows margins, padding, flex/grid gaps, and labels every
   text and media component. Injected by scripts/build-preview.py;
   never include it in production pages.
   ========================================================= */
(() => {
  if (window.__layoutInspector) return;
  window.__layoutInspector = true;

  const STORE = 'layout-inspector:v1';
  const state = { on: false, spacing: true, text: true, media: true };
  try { Object.assign(state, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} };

  const C = {
    margin:  'rgba(246,160,60,.38)',
    padding: 'rgba(110,190,90,.40)',
    gap:     'rgba(201,52,122,.28)',
    text:    '#1E6BFF',
    media:   '#E0267D',
  };

  const style = document.createElement('style');
  style.textContent = `
  #li-layer{position:absolute;top:0;left:0;overflow:hidden;pointer-events:none;z-index:2147483000;}
  #li-layer .r{position:absolute;box-sizing:border-box;display:flex;align-items:center;justify-content:center;
    font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#111;}
  #li-layer .m{background:${C.margin};}
  #li-layer .p{background:${C.padding};}
  #li-layer .g{background:repeating-linear-gradient(45deg,${C.gap} 0 4px,rgba(201,52,122,.12) 4px 8px);}
  #li-layer .r span{background:rgba(255,255,255,.9);padding:1px 3px;border-radius:3px;white-space:nowrap;}
  #li-layer .o{position:absolute;box-sizing:border-box;border:1px dashed;}
  #li-layer .t{border-color:${C.text};}
  #li-layer .i{border:2px solid ${C.media};}
  #li-layer .lbl{position:absolute;font:600 10px/14px ui-monospace,SFMono-Regular,Menlo,monospace;color:#fff;
    padding:0 5px;border-radius:3px;white-space:nowrap;max-width:420px;overflow:hidden;text-overflow:ellipsis;}
  #li-layer .lbl.t{background:${C.text};}
  #li-layer .lbl.i{background:${C.media};border:0;}
  #li-panel{position:fixed;z-index:2147483001;right:calc(16px + env(safe-area-inset-right,0px));
    bottom:calc(16px + env(safe-area-inset-bottom,0px));font:500 12px/1.3 system-ui,-apple-system,sans-serif;
    color:#111;background:#fff;border:1px solid #d6d6d6;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.18);
    padding:8px;display:flex;flex-direction:column;gap:6px;min-width:150px;}
  #li-panel button{all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:6px 8px;border-radius:8px;font-weight:600;background:#f1f1f1;}
  #li-panel button:focus-visible{outline:2px solid ${C.text};outline-offset:2px;}
  #li-panel .sw{width:30px;height:18px;border-radius:9px;background:#bbb;position:relative;transition:background .15s;flex:none;}
  #li-panel .sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .15s;}
  #li-panel[data-on="true"] .sw{background:#1a7f37;}
  #li-panel[data-on="true"] .sw::after{left:14px;}
  #li-panel .opts{display:none;flex-direction:column;gap:4px;padding:2px 4px;}
  #li-panel[data-on="true"] .opts{display:flex;}
  #li-panel label{display:flex;align-items:center;gap:6px;cursor:pointer;}
  #li-panel .key{width:10px;height:10px;border-radius:2px;flex:none;}
  @media (prefers-reduced-motion:reduce){#li-panel .sw,#li-panel .sw::after{transition:none;}}
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.id = 'li-layer';
  layer.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('div');
  panel.id = 'li-panel';
  panel.innerHTML = `
    <button type="button" id="li-toggle" aria-pressed="false"><span>Inspect layout</span><span class="sw"></span></button>
    <div class="opts">
      <label><input type="checkbox" id="li-spacing"> Spacing
        <span class="key" style="background:${C.margin}"></span><span class="key" style="background:${C.padding}"></span><span class="key" style="background:${C.gap}"></span></label>
      <label><input type="checkbox" id="li-text"> Text labels <span class="key" style="background:${C.text}"></span></label>
      <label><input type="checkbox" id="li-media"> Media labels <span class="key" style="background:${C.media}"></span></label>
      <div style="color:#666;font-size:11px">margin · padding · gap</div>
    </div>`;

  const px = (v) => parseFloat(v) || 0;
  const r1 = (n) => Math.round(n * 10) / 10;
  const isOurs = (el) => el.closest && el.closest('#li-layer,#li-panel');

  function box(cls, x, y, w, h, label) {
    if (w < 0.5 || h < 0.5) return;
    const d = document.createElement('div');
    d.className = 'r ' + cls;
    d.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    if (label && w >= 18 && h >= 11) d.innerHTML = `<span>${label}</span>`;
    layer.appendChild(d);
  }
  function outline(cls, x, y, w, h) {
    const d = document.createElement('div');
    d.className = 'o ' + cls;
    d.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    layer.appendChild(d);
  }
  function tag(cls, x, y, text) {
    const d = document.createElement('div');
    d.className = 'lbl ' + cls;
    d.textContent = text;
    d.style.left = Math.max(0, x) + 'px';
    d.style.top = Math.max(0, y - 14) + 'px';
    layer.appendChild(d);
  }

  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const isMedia = (el, cs) =>
    /^(IMG|SVG|VIDEO|PICTURE|CANVAS|IFRAME)$/i.test(el.tagName) ||
    (cs.backgroundImage.includes('url(') && !el.matches('html,body'));
  const fileName = (el, cs) => {
    const src = el.currentSrc || el.getAttribute('src') ||
      (cs.backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1] || '';
    return src.split('/').pop().split('?')[0];
  };

  function drawSpacing(el, cs, x, y, r) {
    const m = [px(cs.marginTop), px(cs.marginRight), px(cs.marginBottom), px(cs.marginLeft)];
    if (m.some((v) => v > 0)) {
      box('m', x, y - m[0], r.width, m[0], 'm ' + r1(m[0]));
      box('m', x + r.width, y, m[1], r.height, 'm ' + r1(m[1]));
      box('m', x, y + r.height, r.width, m[2], 'm ' + r1(m[2]));
      box('m', x - m[3], y, m[3], r.height, 'm ' + r1(m[3]));
    }
    const b = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
    const p = [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)];
    if (p.some((v) => v > 0)) {
      const ix = x + b[3], iy = y + b[0], iw = r.width - b[1] - b[3], ih = r.height - b[0] - b[2];
      box('p', ix, iy, iw, p[0], 'p ' + r1(p[0]));
      box('p', ix, iy + ih - p[2], iw, p[2], 'p ' + r1(p[2]));
      box('p', ix, iy + p[0], p[3], ih - p[0] - p[2], 'p ' + r1(p[3]));
      box('p', ix + iw - p[1], iy + p[0], p[1], ih - p[0] - p[2], 'p ' + r1(p[1]));
    }
    // Flex / grid gaps between consecutive visible in-flow children
    const flex = /flex/.test(cs.display), grid = /grid/.test(cs.display);
    if (!flex && !grid) return;
    if (px(cs.columnGap) <= 0 && px(cs.rowGap) <= 0) return;
    const kids = [...el.children].filter((k) => {
      if (isOurs(k)) return false;
      const ks = getComputedStyle(k);
      return ks.display !== 'none' && ks.position !== 'absolute' && ks.position !== 'fixed' && ks.visibility !== 'hidden';
    }).map((k) => k.getBoundingClientRect()).filter((k) => k.width || k.height);
    for (let i = 0; i < kids.length; i++) {
      for (let j = 0; j < kids.length; j++) {
        if (i === j) continue;
        const a = kids[i], c = kids[j];
        // horizontal neighbour: c starts right after a on overlapping rows
        const vOverlap = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        const hGap = c.left - a.right;
        if (vOverlap > 0 && hGap > 0.5 && hGap <= px(cs.columnGap) + 1 &&
            !kids.some((k) => k !== a && k !== c && k.left >= a.right - 0.5 && k.right <= c.left + 0.5 && Math.min(k.bottom, a.bottom) > Math.max(k.top, a.top))) {
          box('g', a.right + scrollX, Math.max(a.top, c.top) + scrollY, hGap, vOverlap, 'gap ' + r1(hGap));
        }
        const hOverlap = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const vGap = c.top - a.bottom;
        if (hOverlap > 0 && vGap > 0.5 && vGap <= px(cs.rowGap) + 1 &&
            !kids.some((k) => k !== a && k !== c && k.top >= a.bottom - 0.5 && k.bottom <= c.top + 0.5 && Math.min(k.right, a.right) > Math.max(k.left, a.left))) {
          box('g', Math.max(a.left, c.left) + scrollX, a.bottom + scrollY, hOverlap, vGap, 'gap ' + r1(vGap));
        }
      }
    }
  }

  const sig = (el, cs) => {
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '');
    const lh = cs.lineHeight === 'normal' ? 'normal' : r1(px(cs.lineHeight));
    return `${el.tagName.toLowerCase()} · ${fam} ${cs.fontWeight} · ${r1(px(cs.fontSize))}/${lh}`;
  };
  // Previous sibling of the same tag, or the matching element in the parent's previous sibling
  // (covers <li><a>…</a></li> nav patterns).
  const prevLike = (el) => {
    let prev = el.previousElementSibling;
    if (!prev && el.parentElement && el.parentElement.children.length === 1) {
      const pp = el.parentElement.previousElementSibling;
      prev = pp && pp.children.length === 1 ? pp.firstElementChild : null;
    }
    return prev && prev.tagName === el.tagName ? prev : null;
  };

  let raf = 0;
  function draw() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      layer.replaceChildren();
      panel.dataset.on = state.on;
      panel.querySelector('#li-toggle').setAttribute('aria-pressed', state.on);
      if (!state.on) { layer.remove(); return; }
      const de = document.documentElement;
      layer.style.width = de.clientWidth + 'px';
      layer.style.height = Math.max(de.scrollHeight, document.body.scrollHeight) + 'px';
      if (!layer.isConnected) document.body.appendChild(layer);

      const root = document.body;
      const labels = [];
      const groups = new Map();
      for (const el of root.querySelectorAll('*')) {
        if (isOurs(el) || /^(SCRIPT|STYLE|LINK|META|TITLE|BR)$/.test(el.tagName)) continue;
        if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || px(cs.opacity) === 0 && cs.opacity !== '') continue;
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        const x = r.left + scrollX, y = r.top + scrollY;

        if (state.spacing) drawSpacing(el, cs, x, y, r);

        if (state.media && isMedia(el, cs)) {
          outline('i', x, y, r.width, r.height);
          const nat = el.naturalWidth ? ` (src ${el.naturalWidth}×${el.naturalHeight})` : '';
          const name = fileName(el, cs);
          labels.push(['i', x, y, `${el.tagName.toLowerCase()} · ${r1(r.width)}×${r1(r.height)}${nat}${name ? ' · ' + name : ''}`]);
        } else if (state.text && ownText(el)) {
          outline('t', x, y, r.width, r.height);
          const s = sig(el, cs);
          // Repeated siblings (list items, nav links, tabs) share one label: "li ×5 · …"
          const prev = prevLike(el);
          const first = prev && groups.has(prev) && groups.get(prev).sig === s ? groups.get(prev).first : null;
          if (first) { groups.set(el, groups.get(prev)); groups.get(prev).n++; continue; }
          const g = { sig: s, first: el, n: 1, label: ['t', x, y, s] };
          groups.set(el, g); labels.push(g);
          continue;
        }
      }
      labels.forEach((l) => {
        if (Array.isArray(l)) return tag(...l);
        const [c, lx, ly, txt] = l.label;
        tag(c, lx, ly, l.n > 1 ? txt.replace(/^(\S+)/, `$1 ×${l.n}`) : txt);
      }); // labels last so they sit above spacing boxes
    });
  }

  function mount() {
    document.body.appendChild(panel);
    const t = panel.querySelector('#li-toggle');
    const opts = { spacing: '#li-spacing', text: '#li-text', media: '#li-media' };
    Object.entries(opts).forEach(([k, sel]) => {
      const cb = panel.querySelector(sel);
      cb.checked = state[k];
      cb.addEventListener('change', () => { state[k] = cb.checked; save(); draw(); });
    });
    t.addEventListener('click', () => { state.on = !state.on; save(); draw(); });
    addEventListener('resize', draw);
    addEventListener('load', draw);
    document.addEventListener('click', (e) => { if (!isOurs(e.target)) setTimeout(draw, 320); }, true);
    document.addEventListener('keyup', (e) => { if (!isOurs(e.target)) setTimeout(draw, 320); }, true);
    document.addEventListener('transitionend', (e) => { if (!isOurs(e.target)) draw(); }, true);
    if (document.fonts) document.fonts.ready.then(draw);
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(document.body);
    draw();
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mount) : mount();
})();
