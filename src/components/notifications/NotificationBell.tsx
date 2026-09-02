import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationPanel } from './NotificationPanel';
import { Page } from '../../types';

interface NotificationBellProps {
  onNavigate: (page: Page) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const bellRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-gray-700 hover:bg-[#FFF8F0] hover:text-[#D35400] transition relative border border-gray-200 flex items-center justify-center cursor-pointer shadow-2xs"
        title="Universal Communication & Notification Center"
      >
        <Bell className="w-4 h-4 text-[#2C3E50]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-[#D35400] text-white text-[9px] font-extrabold rounded-full animate-bounce shadow-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          onClose={() => setIsOpen(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
