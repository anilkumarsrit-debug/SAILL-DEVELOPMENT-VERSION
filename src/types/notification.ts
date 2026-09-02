import { Page, UserRole } from '../types';

export type NotificationCategory =
  | 'System'
  | 'Academic'
  | 'AI Coach'
  | 'Assessment'
  | 'Announcement'
  | 'Reminder'
  | 'Registration';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // e.g. "10 mins ago" or "2026-08-05 09:30 AM"
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  targetRole: 'ALL' | 'ADMINISTRATOR' | 'FACULTY_INCHARGE' | 'STUDENT';
  targetUserId?: string;
  linkPage?: Page;
  actionUrl?: string;
  createdDate: string; // ISO string e.g. "2026-08-05T09:30:00.000Z"
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  authorRole: 'ADMINISTRATOR' | 'FACULTY_INCHARGE';
  authorName: string;
  priority: NotificationPriority;
  targetAudience: 'ALL' | 'STUDENT' | 'FACULTY';
  category?: NotificationCategory;
}

export interface AICoachingMessage {
  id: string;
  title: string;
  message: string;
  actionText?: string;
  actionPage?: Page;
  category: 'phonetics' | 'fluency' | 'stress' | 'general';
  createdDate: string;
  isCompleted?: boolean;
  priority?: NotificationPriority;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: NotificationPriority;
  isCompleted: boolean;
  category: NotificationCategory;
  linkPage?: Page;
}

export type GroupedNotifications = {
  today: AppNotification[];
  yesterday: AppNotification[];
  earlier: AppNotification[];
};
