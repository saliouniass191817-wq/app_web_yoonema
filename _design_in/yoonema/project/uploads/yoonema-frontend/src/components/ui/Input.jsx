import React from 'react';

export function Input({
  label,
  error,
  hint,
  icon,
  className = '',
  type = 'text',
  id,
  ...props
}) {
  const inputId = id || props.name || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className={
            `h-11 w-full rounded-xl border bg-white text-[15px] text-gray-900 placeholder:text-gray-400 ` +
            `transition-[border-color,box-shadow] duration-200 ` +
            `focus:outline-none focus:ring-4 disabled:bg-gray-100 disabled:cursor-not-allowed ` +
            `${icon ? 'pl-11 pr-4' : 'px-4'} ` +
            `${error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/15'
              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/15'} ` +
            className
          }
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

export default Input;
