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
      <div className={`w-full ${className}`.trim()}>
        <label 
          htmlFor={id} 
          className="block text-sm font-bold text-slate-900 mb-2.5 tracking-tight"
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
            block w-full rounded-lg border h-11 px-4 text-slate-900 shadow-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 sm:text-sm appearance-none bg-white font-medium
            disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed
            ${
              isInvalid
                ? 'border-red-700 focus:border-red-700 focus:ring-red-700 text-red-900 bg-red-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }
          `.replace(/\s+/g, ' ').trim()}
          style={{
            // Updated to use the specific slate-500 hex color (%2364748B) for the chevron
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.2em 1.2em',
            paddingRight: '3rem'
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
          <p id={hintId} className="mt-2 text-[13px] text-slate-500 leading-relaxed">
            {hint}
          </p>
        )}
        
        {hasErrorString && (
          <p id={errorId} className="mt-2 text-[13px] text-red-700 font-medium" role="alert">
            {error as string}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';