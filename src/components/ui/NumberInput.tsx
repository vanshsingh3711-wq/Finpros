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
      <div className={`w-full ${className}`.trim()}>
        <label 
          htmlFor={id} 
          className="block text-sm font-bold text-slate-900 mb-2.5 tracking-tight"
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
            block w-full rounded-lg border h-11 px-4 text-slate-900 shadow-sm transition-all font-medium
            focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 sm:text-sm bg-white
            placeholder:text-slate-400 placeholder:font-normal
            disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed disabled:shadow-none
            ${
              isInvalid
                ? 'border-red-700 focus:border-red-700 focus:ring-red-700 text-red-900 bg-red-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />
        
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

NumberInput.displayName = 'NumberInput';