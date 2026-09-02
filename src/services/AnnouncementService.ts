import { Announcement, NotificationPriority } from '../types/notification';
import { UserRole } from '../types';
import { NotificationService } from './NotificationService';

const ANNOUNCEMENTS_STORAGE_KEY = 'saill_announcements_v1';

const getInitialSeedAnnouncements = (): Announcement[] => {
  return [
    {
      id: 'ann-1',
      title: 'R26 SAILL Language Laboratory Orientation Session',
      description: 'All 1st-year B.Tech students are requested to complete Module 1 Phonetics & Vowel drills before Feb 20, 2026. Faculty in-charges will review recording portfolios in the upcoming lab cycle.',
      createdDate: '2026-02-14 10:00 AM',
      authorRole: 'ADMINISTRATOR',
      authorName: 'Dr. M. Venkata Subbaiah (HOD & Admin)',
      priority: 'high',
      targetAudience: 'ALL'
    },
    {
      id: 'ann-2',
      title: 'Gemini AI Speech Analysis Engine Upgrade v2.4',
      description: 'The SAILL audio processing engine now includes real-time spectrogram visualization and enhanced accent pitch detection for English multi-syllabic stress patterns.',
      createdDate: '2026-02-12 02:30 PM',
      authorRole: 'ADMINISTRATOR',
      authorName: 'SRIT IT & AI Lab Systems',
      priority: 'medium',
      targetAudience: 'ALL'
    },
    {
      id: 'ann-3',
      title: 'Phonetics & Intonation Portfolio Practice Submissions',
      description: 'Faculty in-charges have published updated accent modulation benchmarks in the Practice Centre. Students can submit audio trials up to 3 times per assignment.',
      createdDate: '2026-02-10 11:15 AM',
      authorRole: 'FACULTY_INCHARGE',
      authorName: 'Dr. V. Lakshmi (Faculty Incharge)',
      priority: 'medium',
      targetAudience: 'STUDENT'
    },
    {
      id: 'ann-4',
      title: 'CIA-1 English Language Lab Assessment Timetable',
      description: 'Continuous Internal Assessment (CIA-1) practical examinations will be conducted in the Autonomous AI Language Lab from Feb 24 to Feb 28, 2026.',
      createdDate: '2026-02-08 09:00 AM',
      authorRole: 'ADMINISTRATOR',
      authorName: 'Academic Controller of Exams',
      priority: 'high',
      targetAudience: 'ALL'
    }
  ];
};

export class AnnouncementService {
  private static getStored(): Announcement[] {
    try {
      const data = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const initial = getInitialSeedAnnouncements();
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private static save(announcements: Announcement[]): void {
    try {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
    } catch {
      // ignore
    }
  }

  static getAnnouncementsForRole(role: UserRole): Announcement[] {
    const all = this.getStored();
    const roleUpper = (role || 'STUDENT').toString().toUpperCase();

    return all.filter((a) => {
      if (a.targetAudience === 'ALL') return true;
      if (roleUpper === 'ADMINISTRATOR') return true;
      if ((roleUpper === 'FACULTY_INCHARGE' || roleUpper === 'FACULTY') && a.targetAudience === 'FACULTY') return true;
      if (roleUpper === 'STUDENT' && a.targetAudience === 'STUDENT') return true;
      return false;
    });
  }

  static createAnnouncement(
    data: Omit<Announcement, 'id' | 'createdDate'>,
    authorRole: 'ADMINISTRATOR' | 'FACULTY_INCHARGE' = 'ADMINISTRATOR',
    authorName: string = 'SAILL Administrator'
  ): Announcement {
    const all = this.getStored();
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newAnnouncement: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdDate: nowStr,
      authorRole,
      authorName
    };

    const updated = [newAnnouncement, ...all];
    this.save(updated);

    // Automatically trigger notification for all relevant users
    NotificationService.createNotification({
      title: `Announcement: ${newAnnouncement.title}`,
      message: newAnnouncement.description.slice(0, 100) + '...',
      timestamp: 'Just now',
      category: 'Announcement',
      priority: newAnnouncement.priority,
      targetRole: newAnnouncement.targetAudience === 'STUDENT' ? 'STUDENT' : newAnnouncement.targetAudience === 'FACULTY' ? 'FACULTY_INCHARGE' : 'ALL',
      linkPage: 'announcements'
    });

    return newAnnouncement;
  }

  static deleteAnnouncement(id: string): Announcement[] {
    const all = this.getStored();
    const updated = all.filter((a) => a.id !== id);
    this.save(updated);
    return updated;
  }
}
