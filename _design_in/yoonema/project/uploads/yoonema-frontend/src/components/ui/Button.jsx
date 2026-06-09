import React from 'react';

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
    'transition-[background-color,box-shadow,transform,color] duration-200 ease-out-quart ' +
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none';

  const variants = {
    primary:
      'bg-orange-500 text-white shadow-brand-sm hover:bg-orange-600 hover:shadow-brand',
    secondary:
      'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300',
    success:
      'bg-success-500 text-white shadow-soft hover:bg-success-600',
    danger:
      'bg-danger-500 text-white shadow-soft hover:bg-danger-600',
    outline:
      'border border-orange-500/60 text-orange-600 bg-transparent hover:bg-orange-50',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-sm',
    md: 'h-11 px-5 text-[15px]',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
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
      <span className={loading ? 'opacity-90' : ''}>{children}</span>
    </button>
  );
}

export default Button;
