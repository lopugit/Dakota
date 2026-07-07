import { useSyncExternalStore } from 'react';
import { Icon } from './Icon';

type Theme = 'light' | 'dark';

const listeners = new Set<() => void>();

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(next: Theme): void {
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('dk-theme', next);
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
}

/** Call once at startup, before first render. */
export function initTheme(): void {
  try {
    const saved = localStorage.getItem('dk-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch {
    /* private mode */
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Icon button that flips light ↔ dark; persists to dk-theme. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light' as Theme);
  return (
    <button
      type="button"
      className="dk-icon-btn"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
