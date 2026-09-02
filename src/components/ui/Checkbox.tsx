import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, error, disabled, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={`w-4 h-4 rounded text-[#D35400] border-[#FAD7A0] focus:ring-[#D35400] transition-all cursor-pointer ${className}`}
          {...props}
        />
        {label && <span className="text-xs sm:text-sm text-[#2C3E50] font-medium">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
