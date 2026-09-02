/**
 * SAILL - SRIT AI Language Laboratory
 * Reusable ContentTabs / ContentNavigator Component
 *
 * @version 1.0.0
 * @description Accessible, responsive horizontal navigation strip with animated content tab panels.
 * Supports keyboard navigation, ARIA attributes, horizontal scrolling on mobile, and smooth motion transitions.
 */

import React, { useRef, useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  content: React.ReactNode;
}

export interface ContentTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  tabs,
  defaultTabId,
  activeTabId: externalActiveTabId,
  onTabChange,
  className = '',
  ariaLabel = 'Content Navigation Tabs'
}) => {
  const [internalActiveTabId, setInternalActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );

  const navStripRef = useRef<HTMLDivElement>(null);

  const currentTabId = externalActiveTabId !== undefined ? externalActiveTabId : internalActiveTabId;

  const handleSelectTab = (tabId: string) => {
    if (externalActiveTabId === undefined) {
      setInternalActiveTabId(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab) {
      handleSelectTab(nextTab.id);
      const nextButton = navStripRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab.id}"]`);
      nextButton?.focus();
    }
  };

  const activeTab = tabs.find((tab) => tab.id === currentTabId) || tabs[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Horizontal Navigation Strip Container */}
      <div className="relative">
        {/* Decorative subtle border & glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D35400]/10 via-[#FAD7A0]/20 to-[#2C3E50]/10 rounded-2xl blur-xs -z-10" />

        <div
          ref={navStripRef}
          role="tablist"
          aria-label={ariaLabel}
          className="flex items-center gap-2 overflow-x-auto scroll-smooth p-2 bg-white/90 backdrop-blur-md border-2 border-[#FAD7A0] rounded-2xl shadow-md no-scrollbar"
        >
          {tabs.map((tab, idx) => {
            const isSelected = tab.id === currentTabId;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                data-tab-id={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`tab-panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400] focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white shadow-md scale-[1.02]'
                    : 'bg-[#FFF8F0]/80 text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FFF8F0] hover:border-[#D35400] hover:text-[#D35400]'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-white' : 'text-[#D35400]'
                    }`}
                  />
                )}
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#D35400]/10 text-[#D35400] border border-[#FAD7A0]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tab Content Container with Smooth Animation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              id={`tab-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-btn-${activeTab.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-3xl border-2 border-[#FAD7A0] p-6 sm:p-8 shadow-xl text-[#2C3E50]"
            >
              {activeTab.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentTabs;
