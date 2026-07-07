import React from 'react';

export function Select({ label, hint, error, id, className = '', style, children, ...rest }) {
  const autoId = React.useId();
  const selectId = id || autoId;
  return (
    <div className={['mb-field', className].filter(Boolean).join(' ')} style={style}>
      {label && <label className="mb-field__label" htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        className={'mb-select' + (error ? ' mb-input--error' : '')}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {children}
      </select>
      {error
        ? <span className="mb-field__error">{error}</span>
        : hint
          ? <span className="mb-field__hint">{hint}</span>
          : null}
    </div>
  );
}
