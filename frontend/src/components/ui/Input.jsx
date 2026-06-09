import React from 'react';
import { Icon } from './Icon';

export function Input({ label, error, hint, icon, className = '', type = 'text', id, ...props }) {
  const inputId = id || props.name || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="field" style={{ marginTop: 0 }}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="inp" style={error ? { boxShadow: 'inset 0 0 0 2px var(--clay)' } : undefined}>
        {icon && <span style={{ color: 'var(--ink-3)', display: 'inline-flex' }}>{icon}</span>}
        <input id={inputId} type={type} className={className} {...props} />
      </div>
      {error && (
        <p style={{ marginTop: 7, fontSize: 13, color: 'var(--clay)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="x" size={15} />
          {error}
        </p>
      )}
      {!error && hint && <p style={{ marginTop: 7, fontSize: 13, color: 'var(--ink-3)' }}>{hint}</p>}
    </div>
  );
}

export default Input;
