import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label: string;
  id: string; // Required for reliable label association
  options: SelectOption[];
  name?: string;
  placeholder?: string;
  error?: string | boolean;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, name, options, placeholder, error, hint, className = '', disabled, ...props }, ref) => {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    
    const isInvalid = !!error;
    const hasErrorString = typeof error === 'string' && error.length > 0;
    
    // Combine IDs for aria-describedby only if they exist
    const ariaDescribedBy = [
      isInvalid && hasErrorString ? errorId : null,
      hint ? hintId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`w-full ${className}`}>
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
        </label>
        
        <select
          ref={ref}
          id={id}
          name={name || id}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedBy}
          className={`
            block w-full rounded-md border h-10 px-3 text-slate-900 shadow-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm appearance-none bg-white
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${
              isInvalid
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900'
                : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500'
            }
          `.replace(/\s+/g, ' ').trim()}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {hint && !hasErrorString && (
          <p id={hintId} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        )}
        
        {hasErrorString && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600 font-medium" role="alert">
            {error as string}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
