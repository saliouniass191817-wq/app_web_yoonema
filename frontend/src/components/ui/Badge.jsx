import React from 'react';

// Maps app variants onto Teranga status badge classes.
const VARIANT_CLASS = {
  success: 'badge-done',
  warning: 'badge-pending',
  info: 'badge-active',
  error: 'badge-cancel',
  danger: 'badge-cancel',
  pending: 'badge-pending',
  active: 'badge-active',
  done: 'badge-done',
  cancel: 'badge-cancel',
};

const NEUTRAL_STYLE = {
  default: { background: 'var(--cream-2)', color: 'var(--ink-2)', borderColor: 'var(--hairline)' },
  orange: { background: 'var(--terra-tint)', color: 'var(--terra-deep)', borderColor: 'var(--terra-soft)' },
};

export function Badge({ children, variant = 'default', dot = false, className = '' }) {
  const teranga = VARIANT_CLASS[variant];
  const style = teranga ? undefined : NEUTRAL_STYLE[variant] || NEUTRAL_STYLE.default;
  const dotColor =
    variant === 'orange' ? 'var(--terra)' : variant === 'default' ? 'var(--ink-3)' : undefined;

  return (
    <span className={`badge ${teranga || ''} ${className}`.trim()} style={style}>
      {dot && <span className="dot" style={dotColor ? { background: dotColor } : undefined} />}
      {children}
    </span>
  );
}

export default Badge;
