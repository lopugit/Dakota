import React from 'react';

export function Radio({ label, description, className = '', style, ...rest }) {
  return (
    <label className={['mb-choice', className].filter(Boolean).join(' ')} style={style}>
      <input type="radio" className="mb-radio" {...rest} />
      {(label || description) && (
        <span className="mb-choice__text">
          {label && <span className="mb-choice__label">{label}</span>}
          {description && <span className="mb-choice__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}
