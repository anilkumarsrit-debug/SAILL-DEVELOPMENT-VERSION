import React from 'react';
import { Button, ButtonProps } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionVariant?: ButtonProps['variant'];
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionVariant = 'primary',
  className = ''
}) => {
  return (
    <div
      className={`bg-white p-10 sm:p-14 rounded-2xl border border-[#FAD7A0]/70 shadow-2xs text-center space-y-4 max-w-md mx-auto ${className}`}
    >
      <div className="p-4 bg-[#FFF8F0] text-[#D35400] rounded-2xl w-16 h-16 mx-auto flex items-center justify-center border border-[#FAD7A0] shadow-xs">
        {icon || <Inbox className="w-8 h-8 stroke-1.5" />}
      </div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-base sm:text-lg text-[#2C3E50] font-serif">{title}</h4>
        <p className="text-xs sm:text-sm text-[#5D6D7E] leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant={actionVariant} size="md" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
