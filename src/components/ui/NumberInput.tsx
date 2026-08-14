import * as React from 'react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string; // Required for reliable label association
  name?: string;
  error?: string | boolean;
  hint?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, id, name, error, hint, className = '', disabled, ...props }, ref) => {
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
        
        <input
          ref={ref}
          type="number"
          id={id}
          name={name || id}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedBy}
          className={`
            block w-full rounded-md border h-10 px-3 text-slate-900 shadow-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${
              isInvalid
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
                : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder-slate-400'
            }
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />
        
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

NumberInput.displayName = 'NumberInput';
