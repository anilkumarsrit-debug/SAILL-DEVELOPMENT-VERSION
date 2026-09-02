import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', error, leftIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`w-full py-2.5 px-3.5 bg-[#FFF8F0]/40 border rounded-xl text-xs sm:text-sm text-[#2C3E50] focus:outline-none focus:ring-2 transition-all duration-150 font-medium cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-400/50 bg-rose-50/30'
              : 'border-[#FAD7A0] focus:ring-[#D35400]/40 focus:border-[#D35400] hover:border-[#E67E22]'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
