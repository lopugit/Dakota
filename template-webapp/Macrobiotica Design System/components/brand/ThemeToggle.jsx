import React from 'react';
import { Icon } from './Icon';

function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle({ size = 'md', className = '', ...rest }) {
  const [theme, setTheme] = React.useState(currentTheme);

  React.useEffect(() => { setTheme(currentTheme()); }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('mb-theme', next); } catch (e) { /* private mode */ }
    setTheme(next);
  };

  const cls = [
    'mb-icon-btn',
    size !== 'md' && `mb-icon-btn--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      {...rest}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
