import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  icon
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAD7A0]/70">
      <div className="flex items-start sm:items-center gap-2.5">
        {icon && <div className="p-2 bg-[#FFF8F0] text-[#D35400] rounded-xl border border-[#FAD7A0]">{icon}</div>}
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-[#2C3E50] font-serif">{title}</h2>
          {subtitle && <p className="text-xs text-[#5D6D7E] leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
