import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`w-full py-2.5 px-3.5 bg-[#FFF8F0]/40 border rounded-xl text-xs sm:text-sm text-[#2C3E50] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : ''
          } ${rightIcon ? 'pr-9' : ''} ${
            error
              ? 'border-rose-400 focus:ring-rose-400/50 bg-rose-50/30 text-rose-900'
              : 'border-[#FAD7A0] focus:ring-[#D35400]/40 focus:border-[#D35400] hover:border-[#E67E22]'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
