import React from 'react';

export function Switch({ label, description, className = '', style, ...rest }) {
  const control = <input type="checkbox" role="switch" className="mb-switch" {...rest} />;
  if (!label && !description) return control;
  return (
    <label
      className={['mb-choice', 'mb-choice--switch', className].filter(Boolean).join(' ')}
      style={style}
    >
      <span className="mb-choice__text">
        {label && <span className="mb-choice__label">{label}</span>}
        {description && <span className="mb-choice__desc">{description}</span>}
      </span>
      {control}
    </label>
  );
}
