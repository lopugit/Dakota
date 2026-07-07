import React from 'react';

export function Input({ label, hint, error, id, className = '', style, ...rest }) {
  const autoId = React.useId();
  const inputId = id || autoId;
  return (
    <div className={['mb-field', className].filter(Boolean).join(' ')} style={style}>
      {label && <label className="mb-field__label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={'mb-input' + (error ? ' mb-input--error' : '')}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error
        ? <span className="mb-field__error">{error}</span>
        : hint
          ? <span className="mb-field__hint">{hint}</span>
          : null}
    </div>
  );
}
