import React from 'react';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className = ''
}) => {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-xs font-bold text-[#2C3E50] tracking-wide">
          {label}
          {required && (
            <span className="text-rose-600 font-extrabold ml-1" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only">(required field)</span>}
        </label>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-bold text-rose-600 animate-in fade-in-50">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-[11px] text-[#5D6D7E]">
          {helperText}
        </p>
      )}
    </div>
  );
};

