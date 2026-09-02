import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Page } from '../../types';

export interface BreadcrumbItem {
  label: string;
  page?: Page;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (page: Page) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium select-none">
      <button
        onClick={() => onNavigate && onNavigate('landing')}
        className="hover:text-[#D35400] transition flex items-center gap-1 cursor-pointer"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">SAILL</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
          {item.page && onNavigate ? (
            <button
              onClick={() => onNavigate(item.page!)}
              className="hover:text-[#D35400] transition cursor-pointer font-semibold"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#2C3E50] font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
