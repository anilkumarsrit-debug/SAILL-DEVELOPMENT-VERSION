import React, { useState } from 'react';
import { Page, UserRole } from '../types';
import { AnnouncementCenter } from '../components/notifications/AnnouncementCenter';
import { AICoachPanel } from '../components/notifications/AICoachPanel';
import { ReminderCenter } from '../components/notifications/ReminderCenter';
import { useNotifications } from '../context/NotificationContext';
import {
  Megaphone,
  Bot,
  Clock,
  Bell,
  CheckCheck,
  Filter,
  ShieldCheck,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface AnnouncementsPageProps {
  onNavigatePage: (page: Page) => void;
  activeRole?: UserRole;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  onNavigatePage,
  activeRole = 'STUDENT'
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'ai-coach' | 'reminders' | 'all-notifications'>('announcements');
  const { notifications, groupedNotifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="space-y-6 text-[#2C3E50] pb-12 select-none">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D35400] text-white rounded-full text-[11px] font-bold mb-2 shadow-xs">
            <Megaphone className="w-3.5 h-3.5" />
            <span>SAILL Universal Communication Framework</span>
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-[#FAD7A0]">
            Institutional Notices & Communication Hub
          </h1>
          <p className="text-xs text-gray-300">
            Role-tailored bulletins, AI coach recommendations, academic reminders & system notifications
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 overflow-x-auto custom-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-gray-200 hover:bg-white/10'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-coach')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai-coach'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-200 hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-200 hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Reminders</span>
          </button>

          <button
            onClick={() => setActiveTab('all-notifications')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'all-notifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-200 hover:bg-white/10'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notif Log</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'announcements' && <AnnouncementCenter />}

      {activeTab === 'ai-coach' && <AICoachPanel onNavigate={onNavigatePage} />}

      {activeTab === 'reminders' && <ReminderCenter onNavigate={onNavigatePage} />}

      {activeTab === 'all-notifications' && (
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D35400]" />
              <h3 className="font-extrabold text-base text-[#2C3E50] font-serif">
                Full Notification History ({notifications.length})
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-mono font-extrabold uppercase text-[#D35400]">
                  Today
                </span>
                <div className="space-y-2">
                  {groupedNotifications.today.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.linkPage) onNavigatePage(n.linkPage);
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                        !n.isRead ? 'bg-[#FFF8F0] border-[#FAD7A0]' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2C3E50]">{n.title}</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded-md">
                            {n.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-mono font-extrabold uppercase text-[#2C3E50]">
                  Yesterday
                </span>
                <div className="space-y-2">
                  {groupedNotifications.yesterday.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.linkPage) onNavigatePage(n.linkPage);
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                        !n.isRead ? 'bg-[#FFF8F0] border-[#FAD7A0]' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2C3E50]">{n.title}</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded-md">
                            {n.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earlier */}
            {groupedNotifications.earlier.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-mono font-extrabold uppercase text-gray-500">
                  Earlier
                </span>
                <div className="space-y-2">
                  {groupedNotifications.earlier.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.linkPage) onNavigatePage(n.linkPage);
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                        !n.isRead ? 'bg-[#FFF8F0] border-[#FAD7A0]' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2C3E50]">{n.title}</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded-md">
                            {n.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
