import { AppNotification, GroupedNotifications, NotificationCategory, NotificationPriority } from '../types/notification';
import { UserRole } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'saill_notifications_v1';

const getInitialSeedNotifications = (): AppNotification[] => {
  return [];
};

export class NotificationService {
  private static getStoredNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    const initial = getInitialSeedNotifications();
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private static saveStoredNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }

  static getNotificationsForRole(role: UserRole): AppNotification[] {
    const all = this.getStoredNotifications();
    const roleUpper = (role || 'STUDENT').toString().toUpperCase();

    return all.filter((n) => {
      if (n.isArchived) return false;
      if (n.targetRole === 'ALL') return true;
      if (roleUpper === 'ADMINISTRATOR' && n.targetRole === 'ADMINISTRATOR') return true;
      if ((roleUpper === 'FACULTY_INCHARGE' || roleUpper === 'FACULTY') && n.targetRole === 'FACULTY_INCHARGE') return true;
      if (roleUpper === 'STUDENT' && n.targetRole === 'STUDENT') return true;
      return false;
    });
  }

  static getUnreadCount(role: UserRole): number {
    const roleNotifications = this.getNotificationsForRole(role);
    return roleNotifications.filter((n) => !n.isRead).length;
  }

  static markAsRead(id: string): AppNotification[] {
    const all = this.getStoredNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveStoredNotifications(updated);
    return updated;
  }

  static markAllAsRead(role: UserRole): AppNotification[] {
    const roleUpper = (role || 'STUDENT').toString().toUpperCase();
    const all = this.getStoredNotifications();

    const updated = all.map((n) => {
      const match =
        n.targetRole === 'ALL' ||
        (roleUpper === 'ADMINISTRATOR' && n.targetRole === 'ADMINISTRATOR') ||
        ((roleUpper === 'FACULTY_INCHARGE' || roleUpper === 'FACULTY') && n.targetRole === 'FACULTY_INCHARGE') ||
        (roleUpper === 'STUDENT' && n.targetRole === 'STUDENT');

      if (match) {
        return { ...n, isRead: true };
      }
      return n;
    });

    this.saveStoredNotifications(updated);
    return updated;
  }

  static archiveNotification(id: string): AppNotification[] {
    const all = this.getStoredNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, isArchived: true } : n));
    this.saveStoredNotifications(updated);
    return updated;
  }

  static createNotification(partial: Omit<AppNotification, 'id' | 'isRead' | 'isArchived' | 'createdDate'>): AppNotification {
    const all = this.getStoredNotifications();
    const newNotif: AppNotification = {
      ...partial,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      isRead: false,
      isArchived: false,
      createdDate: new Date().toISOString()
    };

    const updated = [newNotif, ...all];
    this.saveStoredNotifications(updated);
    return newNotif;
  }

  /**
   * Helper to group notifications into Today, Yesterday, Earlier
   */
  static groupNotificationsByDate(notifications: AppNotification[]): GroupedNotifications {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    notifications.forEach((n) => {
      const itemTime = new Date(n.createdDate).getTime();

      if (itemTime >= todayStart) {
        today.push(n);
      } else if (itemTime >= yesterdayStart) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  }
}
