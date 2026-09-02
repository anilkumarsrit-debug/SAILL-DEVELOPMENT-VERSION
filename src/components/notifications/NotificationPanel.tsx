import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { AppNotification, NotificationCategory, NotificationPriority } from '../../types/notification';
import { Page } from '../../types';
import {
  Bell,
  CheckCheck,
  Archive,
  X,
  ShieldAlert,
  GraduationCap,
  Bot,
  Award,
  Megaphone,
  Clock,
  UserPlus,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, onNavigate }) => {
  const {
    groupedNotifications,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    activeRole
  } = useNotifications();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'System':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#2C3E50]" />;
      case 'Academic':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
      case 'AI Coach':
        return <Bot className="w-3.5 h-3.5 text-purple-600" />;
      case 'Assessment':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case 'Announcement':
        return <Megaphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Reminder':
        return <Clock className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Registration':
        return <UserPlus className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#D35400]" />;
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-extrabold rounded-md flex items-center gap-1 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-md border border-amber-200">
            MED
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-medium rounded-md border border-blue-200">
            INFO
          </span>
        );
    }
  };

  const filterList = (list: AppNotification[]) => {
    return list.filter((item) => {
      if (filterUnreadOnly && item.isRead) return false;
      if (activeCategoryFilter !== 'ALL' && item.category !== activeCategoryFilter) return false;
      return true;
    });
  };

  const filteredToday = filterList(groupedNotifications.today);
  const filteredYesterday = filterList(groupedNotifications.yesterday);
  const filteredEarlier = filterList(groupedNotifications.earlier);

  const totalFilteredCount = filteredToday.length + filteredYesterday.length + filteredEarlier.length;

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    if (item.linkPage) {
      onNavigate(item.linkPage);
      onClose();
    }
  };

  const categoryTabs = [
    'ALL',
    'System',
    'Academic',
    'AI Coach',
    'Assessment',
    'Announcement',
    'Reminder',
    'Registration'
  ];

  return (
    <div className="absolute right-0 mt-2 w-96 sm:w-[420px] max-w-[95vw] bg-white border border-[#FAD7A0] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] text-[#2C3E50] animate-in fade-in zoom-in-95 duration-150 select-none">
      {/* Panel Header */}
      <div className="p-4 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-[#FAD7A0]/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#D35400] text-white rounded-xl shadow-xs">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#2C3E50] font-serif">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-extrabold rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500">
              Role: <span className="font-bold text-[#D35400] uppercase">{activeRole}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar shrink-0 text-[11px]">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 custom-scrollbar">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-[#2C3E50] text-[#FAD7A0]'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
          className={`px-2 py-1 rounded-lg font-bold shrink-0 transition flex items-center gap-1 cursor-pointer border ${
            filterUnreadOnly
              ? 'bg-[#D35400] text-white border-[#D35400]'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>Unread</span>
        </button>
      </div>

      {/* Notification List Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {totalFilteredCount === 0 ? (
          <div className="p-8 text-center space-y-2 text-gray-400">
            <Bell className="w-8 h-8 mx-auto stroke-1" />
            <p className="text-xs font-bold text-gray-500">No notifications found</p>
            <p className="text-[11px]">You're all caught up for {activeCategoryFilter} filter!</p>
          </div>
        ) : (
          <>
            {/* Group: Today */}
            {filteredToday.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400] font-mono">
                    Today
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{filteredToday.length}</span>
                </div>
                <div className="space-y-2">
                  {filteredToday.map((item) => (
                    <NotificationItemCard
                      key={item.id}
                      item={item}
                      getCategoryIcon={getCategoryIcon}
                      getPriorityBadge={getPriorityBadge}
                      onClick={() => handleNotificationClick(item)}
                      onMarkRead={() => markAsRead(item.id)}
                      onArchive={() => archiveNotification(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Group: Yesterday */}
            {filteredYesterday.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2C3E50] font-mono">
                    Yesterday
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{filteredYesterday.length}</span>
                </div>
                <div className="space-y-2">
                  {filteredYesterday.map((item) => (
                    <NotificationItemCard
                      key={item.id}
                      item={item}
                      getCategoryIcon={getCategoryIcon}
                      getPriorityBadge={getPriorityBadge}
                      onClick={() => handleNotificationClick(item)}
                      onMarkRead={() => markAsRead(item.id)}
                      onArchive={() => archiveNotification(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Group: Earlier */}
            {filteredEarlier.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 font-mono">
                    Earlier
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{filteredEarlier.length}</span>
                </div>
                <div className="space-y-2">
                  {filteredEarlier.map((item) => (
                    <NotificationItemCard
                      key={item.id}
                      item={item}
                      getCategoryIcon={getCategoryIcon}
                      getPriorityBadge={getPriorityBadge}
                      onClick={() => handleNotificationClick(item)}
                      onMarkRead={() => markAsRead(item.id)}
                      onArchive={() => archiveNotification(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer link to full Communication Board */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs shrink-0">
        <button
          onClick={() => {
            onNavigate('announcements');
            onClose();
          }}
          className="text-[#D35400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Open Announcement & Communication Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] text-gray-400 font-medium">SAILL Framework</span>
      </div>
    </div>
  );
};

interface NotificationItemCardProps {
  item: AppNotification;
  getCategoryIcon: (category: NotificationCategory) => React.ReactNode;
  getPriorityBadge: (priority: NotificationPriority) => React.ReactNode;
  onClick: () => void;
  onMarkRead: () => void;
  onArchive: () => void;
}

const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  getCategoryIcon,
  getPriorityBadge,
  onClick,
  onMarkRead,
  onArchive
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
        !item.isRead
          ? 'bg-[#FFF8F0]/80 border-[#FAD7A0] shadow-2xs hover:border-[#D35400]'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Unread indicator dot */}
          {!item.isRead && (
            <span className="w-2 h-2 rounded-full bg-[#D35400] shrink-0" title="Unread" />
          )}

          {/* Category Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-md">
            {getCategoryIcon(item.category)}
            <span>{item.category}</span>
          </span>

          {getPriorityBadge(item.priority)}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 font-mono shrink-0">{item.timestamp}</span>
      </div>

      <h4 className="font-bold text-xs text-[#2C3E50] group-hover:text-[#D35400] transition-colors">
        {item.title}
      </h4>

      <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">{item.message}</p>

      {/* Hover Action Bar */}
      <div className="mt-2 pt-1 border-t border-gray-100/60 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5">
          <span>Click to view details</span>
          <ChevronRight className="w-3 h-3" />
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {!item.isRead && (
            <button
              onClick={onMarkRead}
              className="p-1 hover:bg-amber-100 text-amber-800 rounded text-[10px] font-bold flex items-center gap-1 transition"
              title="Mark as read"
            >
              <Check className="w-3 h-3" />
              <span>Read</span>
            </button>
          )}

          <button
            onClick={onArchive}
            className="p-1 hover:bg-gray-200 text-gray-600 rounded text-[10px] font-bold flex items-center gap-1 transition"
            title="Archive (placeholder)"
          >
            <Archive className="w-3 h-3" />
            <span className="hidden sm:inline">Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
