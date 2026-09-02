import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppNotification,
  Announcement,
  Reminder,
  AICoachingMessage,
  GroupedNotifications,
  NotificationPriority,
  NotificationCategory
} from '../types/notification';
import { UserRole, Page } from '../types';
import { NotificationService } from '../services/NotificationService';
import { AnnouncementService } from '../services/AnnouncementService';
import { ReminderService } from '../services/ReminderService';

interface NotificationContextType {
  notifications: AppNotification[];
  groupedNotifications: GroupedNotifications;
  unreadCount: number;
  announcements: Announcement[];
  reminders: Reminder[];
  aiCoachMessages: AICoachingMessage[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead' | 'isArchived' | 'createdDate'>) => void;
  addAnnouncement: (data: Omit<Announcement, 'id' | 'createdDate'>) => void;
  addReminder: (title: string, description: string, dueDate: string, priority?: NotificationPriority, category?: NotificationCategory, linkPage?: Page) => void;
  toggleReminder: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  deleteReminder: (id: string) => void;
  activeRole: UserRole;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const SEED_AI_COACH_MESSAGES: AICoachingMessage[] = [
  {
    id: 'ai-c-1',
    title: 'Daily Phonetics Focus',
    message: 'Great progress on Module 1! Practice 5 more words today to refine your short vs. long vowel distinctions.',
    actionText: 'Guided Practice Studio',
    actionPage: 'practice',
    category: 'phonetics',
    createdDate: '10 mins ago',
    priority: 'high'
  },
  {
    id: 'ai-c-2',
    title: 'Word Stress Recommendation',
    message: 'Focus on Word Stress Rule 5 (Suffixes like -tion, -ic, -ity). Pitch peaks should land on the pre-suffix syllable.',
    actionText: 'View Stress Rules',
    actionPage: 'modules',
    category: 'stress',
    createdDate: '1 hour ago',
    priority: 'medium'
  },
  {
    id: 'ai-c-3',
    title: 'Intonation & Cadence Mastery',
    message: 'Module 2: Accent & Pitch Rhythm is ready for you. Your pitch variation improved by +12% in the last trial!',
    actionText: 'Start Module 2',
    actionPage: 'modules',
    category: 'fluency',
    createdDate: 'Yesterday',
    priority: 'medium'
  }
];

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  activeRole: UserRole;
}> = ({ children, activeRole }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [aiCoachMessages, setAiCoachMessages] = useState<AICoachingMessage[]>(SEED_AI_COACH_MESSAGES);

  // Load state when activeRole changes
  useEffect(() => {
    refreshData();
  }, [activeRole]);

  const refreshData = () => {
    const notifs = NotificationService.getNotificationsForRole(activeRole);
    setNotifications(notifs);

    const anns = AnnouncementService.getAnnouncementsForRole(activeRole);
    setAnnouncements(anns);

    const rems = ReminderService.getRemindersForRole(activeRole);
    setReminders(rems);
  };

  const markAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    refreshData();
  };

  const markAllAsRead = () => {
    NotificationService.markAllAsRead(activeRole);
    refreshData();
  };

  const archiveNotification = (id: string) => {
    NotificationService.archiveNotification(id);
    refreshData();
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'isRead' | 'isArchived' | 'createdDate'>) => {
    NotificationService.createNotification(notifData);
    refreshData();
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'createdDate'>) => {
    const roleUpper = (activeRole || 'ADMINISTRATOR').toString().toUpperCase();
    const authorRole = roleUpper === 'ADMINISTRATOR' ? 'ADMINISTRATOR' : 'FACULTY_INCHARGE';
    const authorName = roleUpper === 'ADMINISTRATOR' ? 'Dr. M. Venkata Subbaiah (Admin)' : 'Dr. V. Lakshmi (Faculty)';

    AnnouncementService.createAnnouncement(data, authorRole, authorName);
    refreshData();
  };

  const addReminder = (
    title: string,
    description: string,
    dueDate: string,
    priority: NotificationPriority = 'medium',
    category: NotificationCategory = 'Reminder',
    linkPage?: Page
  ) => {
    ReminderService.createReminder(title, description, dueDate, priority, category, linkPage);
    refreshData();
  };

  const toggleReminder = (id: string) => {
    ReminderService.toggleReminderComplete(id);
    refreshData();
  };

  const deleteAnnouncement = (id: string) => {
    AnnouncementService.deleteAnnouncement(id);
    refreshData();
  };

  const deleteReminder = (id: string) => {
    ReminderService.deleteReminder(id);
    refreshData();
  };

  const groupedNotifications = NotificationService.groupNotificationsByDate(notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        groupedNotifications,
        unreadCount,
        announcements,
        reminders,
        aiCoachMessages,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        addNotification,
        addAnnouncement,
        addReminder,
        toggleReminder,
        deleteAnnouncement,
        deleteReminder,
        activeRole
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
