import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = true, clickable = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white border border-[#FAD7A0]/70 rounded-2xl shadow-xs p-5 transition-all duration-200 ${
          hoverable ? 'hover:border-[#E67E22] hover:shadow-md' : ''
        } ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`pb-3 mb-3 border-b border-gray-100/80 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`font-extrabold text-[#2C3E50] text-base sm:text-lg font-serif ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs text-[#5D6D7E] leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`pt-3 mt-3 border-t border-gray-100/80 flex items-center justify-between gap-3 text-xs ${className}`} {...props}>
    {children}
  </div>
);
