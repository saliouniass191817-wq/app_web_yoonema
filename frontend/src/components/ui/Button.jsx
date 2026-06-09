import React from 'react';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  success: 'btn-primary', // tinted forest via style below
};

const SIZE_CLASS = { sm: 'btn-sm', md: '', lg: 'btn-lg', xl: 'btn-lg' };

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  style,
  ...props
}) {
  const successStyle =
    variant === 'success'
      ? { background: 'var(--forest)', color: '#fff', boxShadow: '0 10px 22px -8px rgba(31,93,68,.5)' }
      : undefined;

  const cls = ['btn', VARIANT_CLASS[variant] || 'btn-primary', SIZE_CLASS[size] || '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={cls}
      style={{ ...successStyle, ...style }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
