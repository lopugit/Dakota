import React from 'react';

export function Tabs({ items = [], value, onChange, className = '', style }) {
  return (
    <div className={['mb-tabs', className].filter(Boolean).join(' ')} style={style} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          className={'mb-tab' + (value === item.id ? ' mb-tab--active' : '')}
          onClick={() => onChange && onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
