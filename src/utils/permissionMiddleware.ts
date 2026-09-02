import { Page } from '../types';
import { UserRole, normalizeRole } from '../types/auth';

/**
 * Page Access Matrix defining permissible pages per role
 */
export const ROLE_PAGE_PERMISSIONS: Record<UserRole, Page[]> = {
  STUDENT: [
    'landing',
    'dashboard',
    'modules',
    'module-detail',
    'practice',
    'portfolio',
    'progress',
    'profile',
    'settings',
    'ai-engine',
    'announcements',
    'system-health',
    'qef-framework'
  ],
  FACULTY_INCHARGE: [
    'landing',
    'faculty-dashboard',
    'attendance',
    'rubrics',
    'internal-marks',
    'analytics',
    'portfolio-review',
    'reports',
    'faculty-assistant',
    'announcements',
    'profile',
    'settings',
    'modules',
    'module-detail',
    'practice',
    'ai-engine',
    'system-health',
    'qef-framework'
  ],
  ADMINISTRATOR: [
    'landing',
    'admin-control',
    'faculty-dashboard',
    'dashboard',
    'attendance',
    'rubrics',
    'internal-marks',
    'analytics',
    'portfolio-review',
    'reports',
    'faculty-assistant',
    'announcements',
    'modules',
    'module-detail',
    'practice',
    'portfolio',
    'progress',
    'profile',
    'settings',
    'ai-engine',
    'system-health',
    'qef-framework'
  ],
  BOOTSTRAP_ADMIN: [
    'landing',
    'admin-control',
    'faculty-dashboard',
    'dashboard',
    'attendance',
    'rubrics',
    'internal-marks',
    'analytics',
    'portfolio-review',
    'reports',
    'faculty-assistant',
    'announcements',
    'modules',
    'module-detail',
    'practice',
    'portfolio',
    'progress',
    'profile',
    'settings',
    'ai-engine',
    'system-health',
    'qef-framework'
  ]
};

/**
 * Checks if a given role is authorized to view a specific page
 */
export function hasPageAccess(role: string | null | undefined, targetPage: Page): boolean {
  if (
    targetPage === 'landing' ||
    targetPage === 'login' ||
    targetPage === 'forgot-password' ||
    targetPage === 'reset-password' ||
    targetPage === 'register-choice' ||
    targetPage === 'register-student' ||
    targetPage === 'register-faculty' ||
    targetPage === 'pending-approval'
  ) {
    return true;
  }
  if (!role) return false;

  const normalized = normalizeRole(role);
  const allowedPages = ROLE_PAGE_PERMISSIONS[normalized];
  return allowedPages ? allowedPages.includes(targetPage) : false;
}

/**
 * Returns the default home/dashboard page for a given role
 */
export function getRedirectPageForRole(role: string | null | undefined): Page {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case 'STUDENT':
      return 'dashboard';
    case 'FACULTY_INCHARGE':
      return 'faculty-dashboard';
    case 'ADMINISTRATOR':
      return 'admin-control';
    default:
      return 'dashboard';
  }
}
