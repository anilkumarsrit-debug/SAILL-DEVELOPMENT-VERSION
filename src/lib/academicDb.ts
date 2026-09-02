import {
  UserRole,
  AttendanceRecord,
  RubricEvaluation,
  StudentInternalMarks,
  Announcement,
  AppNotification,
  FacultyAISessionSummary,
  PortfolioItem
} from '../types';
import {
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_INTERNAL_MARKS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  SAMPLE_AI_SESSION_SUMMARIES
} from '../data/academicData';

const ROLE_STORAGE_KEY = 'SAILL_ACTIVE_ROLE';
const ATTENDANCE_STORAGE_KEY = 'SAILL_ATTENDANCE_RECORDS';
const RUBRICS_STORAGE_KEY = 'SAILL_RUBRIC_EVALUATIONS';
const INTERNAL_MARKS_STORAGE_KEY = 'SAILL_INTERNAL_MARKS';
const ANNOUNCEMENTS_STORAGE_KEY = 'SAILL_ANNOUNCEMENTS';
const NOTIFICATIONS_STORAGE_KEY = 'SAILL_NOTIFICATIONS';
const AI_SUMMARIES_STORAGE_KEY = 'SAILL_AI_SESSION_SUMMARIES';

class AcademicDBService {
  // Role Persistence
  getActiveRole(): UserRole {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved && ['administrator', 'faculty_incharge', 'faculty', 'student'].includes(saved)) {
        return saved as UserRole;
      }
    } catch {
      // fallback
    }
    return 'student';
  }

  setActiveRole(role: UserRole): void {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
  }

  // Attendance Records
  getAttendanceRecords(): AttendanceRecord[] {
    try {
      const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    const fallback = INITIAL_ATTENDANCE_RECORDS || [];
    this.saveAttendanceRecords(fallback);
    return fallback;
  }

  saveAttendanceRecords(records: AttendanceRecord[]): void {
    try {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records || []));
    } catch {
      // ignore
    }
  }

  addAttendanceBatch(newRecords: AttendanceRecord[]): AttendanceRecord[] {
    const existing = this.getAttendanceRecords();
    const map = new Map<string, AttendanceRecord>();
    (existing || []).forEach((r) => map.set(r.id, r));
    (newRecords || []).forEach((r) => map.set(r.id, r));
    const updated = Array.from(map.values());
    this.saveAttendanceRecords(updated);
    return updated;
  }

  // Rubric Evaluations
  getRubricEvaluations(): RubricEvaluation[] {
    try {
      const raw = localStorage.getItem(RUBRICS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  }

  saveRubricEvaluation(evalItem: RubricEvaluation): RubricEvaluation[] {
    const existing = this.getRubricEvaluations() || [];
    const index = existing.findIndex((e) => e.id === evalItem.id);
    if (index >= 0) {
      existing[index] = evalItem;
    } else {
      existing.unshift(evalItem);
    }
    try {
      localStorage.setItem(RUBRICS_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
    return existing;
  }

  // Student Internal Marks
  getInternalMarks(): StudentInternalMarks[] {
    try {
      const raw = localStorage.getItem(INTERNAL_MARKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    const fallback = INITIAL_INTERNAL_MARKS || [];
    this.saveInternalMarks(fallback);
    return fallback;
  }

  saveInternalMarks(marks: StudentInternalMarks[]): void {
    try {
      localStorage.setItem(INTERNAL_MARKS_STORAGE_KEY, JSON.stringify(marks || []));
    } catch {
      // ignore
    }
  }

  updateSingleStudentMarks(marksItem: StudentInternalMarks): StudentInternalMarks[] {
    const all = this.getInternalMarks() || [];
    const idx = all.findIndex((m) => m.studentId === marksItem.studentId);
    if (idx >= 0) {
      all[idx] = marksItem;
    } else {
      all.push(marksItem);
    }
    this.saveInternalMarks(all);
    return all;
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    try {
      const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    const fallback = INITIAL_ANNOUNCEMENTS || [];
    this.saveAnnouncements(fallback);
    return fallback;
  }

  saveAnnouncements(items: Announcement[]): void {
    try {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(items || []));
    } catch {
      // ignore
    }
  }

  addAnnouncement(item: Announcement): Announcement[] {
    const items = this.getAnnouncements() || [];
    items.unshift(item);
    this.saveAnnouncements(items);
    return items;
  }

  // Notifications
  getNotifications(): AppNotification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    const fallback = INITIAL_NOTIFICATIONS || [];
    this.saveNotifications(fallback);
    return fallback;
  }

  saveNotifications(notifs: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs || []));
    } catch {
      // ignore
    }
  }

  markNotificationAsRead(id: string): AppNotification[] {
    const notifs = (this.getNotifications() || []).map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveNotifications(notifs);
    return notifs;
  }

  addNotification(notif: AppNotification): AppNotification[] {
    const notifs = this.getNotifications() || [];
    notifs.unshift(notif);
    this.saveNotifications(notifs);
    return notifs;
  }

  // AI Session Summaries
  getAISessionSummaries(): FacultyAISessionSummary[] {
    try {
      const raw = localStorage.getItem(AI_SUMMARIES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    const fallback = SAMPLE_AI_SESSION_SUMMARIES || [];
    this.saveAISessionSummaries(fallback);
    return fallback;
  }

  saveAISessionSummaries(summaries: FacultyAISessionSummary[]): void {
    try {
      localStorage.setItem(AI_SUMMARIES_STORAGE_KEY, JSON.stringify(summaries));
    } catch {
      // ignore
    }
  }

  addAISessionSummary(summary: FacultyAISessionSummary): FacultyAISessionSummary[] {
    const list = this.getAISessionSummaries();
    list.unshift(summary);
    this.saveAISessionSummaries(list);
    return list;
  }
}

export const academicDb = new AcademicDBService();
