import { Reminder, NotificationPriority, NotificationCategory } from '../types/notification';
import { UserRole, Page } from '../types';

const REMINDERS_STORAGE_KEY = 'saill_reminders_v1';

const getInitialSeedReminders = (): Reminder[] => {
  return [
    {
      id: 'rem-1',
      title: 'Complete Module 1 Phonetics Drill',
      description: 'Record 5 sample audio sentences for Vowel Articulation & Pitch Peaks.',
      dueDate: 'Feb 20, 2026',
      priority: 'high',
      isCompleted: false,
      category: 'Academic',
      linkPage: 'modules'
    },
    {
      id: 'rem-2',
      title: 'Submit Pronunciation Practice Recording',
      description: 'Upload your 2-minute audio trial for Syllable Stress Rule 5 in Practice Centre.',
      dueDate: 'Feb 22, 2026',
      priority: 'medium',
      isCompleted: false,
      category: 'Reminder',
      linkPage: 'practice'
    },
    {
      id: 'rem-3',
      title: 'Review Gemini AI Speech Evaluation',
      description: 'Check automated feedback graphs on clause pause durations and vocal pitch modulation.',
      dueDate: 'Feb 24, 2026',
      priority: 'low',
      isCompleted: true,
      category: 'AI Coach',
      linkPage: 'portfolio'
    },
    {
      id: 'rem-4',
      title: 'Faculty Assessment Review',
      description: 'Inspect assigned section audio submissions and record qualitative portfolio observations.',
      dueDate: 'Feb 25, 2026',
      priority: 'high',
      isCompleted: false,
      category: 'Assessment',
      linkPage: 'faculty-dashboard'
    }
  ];
};

export class ReminderService {
  private static getStored(): Reminder[] {
    try {
      const data = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const initial = getInitialSeedReminders();
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private static save(reminders: Reminder[]): void {
    try {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }

  static getRemindersForRole(role: UserRole): Reminder[] {
    return this.getStored();
  }

  static toggleReminderComplete(id: string): Reminder[] {
    const all = this.getStored();
    const updated = all.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
    this.save(updated);
    return updated;
  }

  static createReminder(
    title: string,
    description: string,
    dueDate: string,
    priority: NotificationPriority = 'medium',
    category: NotificationCategory = 'Reminder',
    linkPage?: Page
  ): Reminder {
    const all = this.getStored();
    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      title,
      description,
      dueDate: dueDate || 'Upcoming',
      priority,
      isCompleted: false,
      category,
      linkPage
    };
    const updated = [newRem, ...all];
    this.save(updated);
    return newRem;
  }

  static deleteReminder(id: string): Reminder[] {
    const all = this.getStored();
    const updated = all.filter((r) => r.id !== id);
    this.save(updated);
    return updated;
  }
}
