import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}) => {
  const alertConfigs: Record<
    AlertType,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
    },
    info: {
      bg: 'bg-[#FFF8F0]',
      border: 'border-[#FAD7A0]',
      text: 'text-[#2C3E50]',
      icon: <Info className="w-5 h-5 text-[#D35400] shrink-0" />
    }
  };

  const config = alertConfigs[type];

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} ${config.border} ${config.text} shadow-2xs flex items-start justify-between gap-3 animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      <div className="flex items-start gap-3 flex-1">
        {config.icon}
        <div className="space-y-0.5 text-xs sm:text-sm">
          {title && <h5 className="font-extrabold font-serif">{title}</h5>}
          <p className="leading-relaxed">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
