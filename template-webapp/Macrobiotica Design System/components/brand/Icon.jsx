import React from 'react';

const LUCIDE_SRC = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js';
let lucidePromise = null;

function loadLucide() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!lucidePromise) {
    lucidePromise = new Promise((resolve, reject) => {
      let s = document.querySelector(`script[data-mb-lucide]`);
      if (!s) {
        s = document.createElement('script');
        s.src = LUCIDE_SRC;
        s.setAttribute('data-mb-lucide', '');
        document.head.appendChild(s);
      }
      s.addEventListener('load', () => resolve(window.lucide));
      s.addEventListener('error', reject);
    });
  }
  return lucidePromise;
}

function toPascal(name) {
  return String(name).split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function Icon({ name, size = 18, strokeWidth = 1.75, color = 'currentColor', style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let alive = true;
    loadLucide().then((lucide) => {
      if (!alive || !ref.current || !lucide) return;
      const registry = lucide.icons || lucide;
      const node = registry[toPascal(name)];
      if (!node) { console.warn('[Macrobiotica] Unknown icon:', name); return; }
      const svg = lucide.createElement(node);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      ref.current.replaceChildren(svg);
    }).catch(() => {});
    return () => { alive = false; };
  }, [name, size, strokeWidth]);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      style={{ display: 'inline-flex', width: size, height: size, color, flex: 'none', ...style }}
      {...rest}
    />
  );
}
