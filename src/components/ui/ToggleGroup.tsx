import * as React from 'react';

export interface ToggleGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  name?: string; // Group name for radios
  error?: string | boolean;
  hint?: string;
}

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ options, value, onChange, label, disabled, className = '', name, error, hint, ...props }, ref) => {
    // Generate a fallback name to safely group radios and associate aria descriptions
    const baseId = React.useId();
    const groupName = name || baseId;
    
    const labelId = `${baseId}-label`;
    const errorId = `${baseId}-error`;
    const hintId = `${baseId}-hint`;
    
    const isInvalid = !!error;
    const hasErrorString = typeof error === 'string' && error.length > 0;
    
    // Combine IDs for aria-describedby only if they exist
    const ariaDescribedBy = [
      isInvalid && hasErrorString ? errorId : null,
      hint ? hintId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`w-full ${className}`.trim()}>
        {label && (
          <div 
            id={labelId} 
            className="block text-sm font-bold text-slate-900 mb-2.5 tracking-tight"
          >
            {label}
          </div>
        )}
        
        <div 
          ref={ref}
          className="flex flex-wrap gap-2.5"
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={ariaDescribedBy}
          aria-invalid={isInvalid}
          {...props}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            const isDisabled = disabled || option.disabled;
            
            return (
              <label
                key={option.value}
                className={`
                  relative flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg
                  border transition-all cursor-pointer select-none
                  ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
                  }
                  ${
                    isDisabled 
                      ? 'opacity-50 !cursor-not-allowed hover:bg-white hover:text-slate-600 hover:border-slate-200 shadow-none' 
                      : ''
                  }
                  ${
                    isInvalid && !isSelected
                      ? 'border-red-700 text-red-700 bg-red-50/50'
                      : ''
                  }
                  has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-700 has-[:focus-visible]:ring-offset-2
                `.replace(/\s+/g, ' ').trim()}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => {
                    if (!isDisabled) {
                      onChange(option.value);
                    }
                  }}
                  className="sr-only" // Visually hidden but retains focus and semantic HTML characteristics
                />
                {option.label}
              </label>
            );
          })}
        </div>

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

ToggleGroup.displayName = 'ToggleGroup';