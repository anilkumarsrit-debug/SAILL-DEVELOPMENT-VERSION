import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full py-2.5 px-3.5 bg-[#FFF8F0]/40 border rounded-xl text-xs sm:text-sm text-[#2C3E50] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-400 focus:ring-rose-400/50 bg-rose-50/30'
            : 'border-[#FAD7A0] focus:ring-[#D35400]/40 focus:border-[#D35400] hover:border-[#E67E22]'
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
