import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', label, disabled, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className={`w-4 h-4 text-[#D35400] border-[#FAD7A0] focus:ring-[#D35400] transition-all cursor-pointer ${className}`}
          {...props}
        />
        {label && <span className="text-xs sm:text-sm text-[#2C3E50] font-medium">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
