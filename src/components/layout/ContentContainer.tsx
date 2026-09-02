import React from 'react';

export interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
  ...props
}) => {
  const maxWidthMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`w-full ${maxWidthMap[maxWidth]} mx-auto px-4 sm:px-6 py-6 space-y-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
