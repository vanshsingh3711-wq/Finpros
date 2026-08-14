import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 
      "inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
    
    const variants = {
      // The signature FinPros CTA - Strictly Teal
      primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-sm hover:shadow-md focus-visible:ring-teal-700",
      
      // Editorial Secondary - White/Slate/Navy
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm focus-visible:ring-slate-900",
      
      // Quiet actions (like row removal)
      ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-900",
      
      // High-friction destructive actions mapped to your exact error hex
      destructive: "bg-red-700 text-white hover:bg-red-800 shadow-sm hover:shadow-md focus-visible:ring-red-700",
    };
    
    const sizes = {
      // Slightly expanded hit targets for a premium feel
      sm: "h-9 px-4 text-[13px] rounded-lg",
      md: "h-11 px-5 text-sm rounded-lg",
      lg: "h-14 px-8 text-base rounded-xl",
    };
    
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];
    
    // Safely combine classes, allowing explicit `className` props to override defaults if necessary
    const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';