import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-sm sm:text-base rounded-xl gap-2.5'
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#D35400] text-white hover:bg-[#E67E22] active:bg-[#B94600] shadow-xs hover:shadow-md focus:ring-[#D35400]',
      secondary:
        'bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] hover:bg-[#FAD7A0] hover:text-[#2C3E50] focus:ring-[#E67E22]',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs focus:ring-emerald-500',
      warning:
        'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-xs focus:ring-amber-500',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs focus:ring-rose-500',
      outline:
        'bg-white text-[#2C3E50] border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-[#2C3E50]',
      ghost:
        'bg-transparent text-[#2C3E50] hover:bg-[#FFF8F0] hover:text-[#D35400] focus:ring-[#D35400]'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
