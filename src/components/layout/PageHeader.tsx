import React from 'react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { Page } from '../../types';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onNavigate?: (page: Page) => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  breadcrumbs,
  onNavigate,
  actions
}) => {
  return (
    <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none mb-6">
      <div className="space-y-1.5">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />}
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#D35400] text-white rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase font-mono shadow-xs">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold font-serif text-[#FAD7A0]">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
