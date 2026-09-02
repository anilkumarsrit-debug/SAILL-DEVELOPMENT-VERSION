export type UserRole = 'STUDENT' | 'FACULTY_INCHARGE' | 'ADMINISTRATOR' | 'BOOTSTRAP_ADMIN';

// Helper type accepting legacy lowercase role strings if present in stored records
export type AnyUserRole = UserRole | 'student' | 'faculty_incharge' | 'administrator' | 'faculty' | 'bootstrap_admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  rollNo?: string;
  employeeId?: string;
  username?: string;
  department?: string;
  designation?: string;
  mobile?: string;
  avatarUrl?: string;
  details?: Record<string, unknown>;
}

export interface LoginCredentials {
  emailOrId: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  role: UserRole;
}

/**
 * Normalizes any role input (including legacy 'faculty' or lowercase variants)
 * to one of the official roles:
 * - STUDENT
 * - FACULTY_INCHARGE
 * - ADMINISTRATOR
 */
export function normalizeRole(roleInput?: string | null): UserRole {
  if (!roleInput) return 'STUDENT';
  const upper = roleInput.toUpperCase().trim();
  if (upper === 'ADMINISTRATOR' || upper === 'ADMIN' || upper === 'BOOTSTRAP_ADMIN' || upper === 'BOOTSTRAP') {
    return 'ADMINISTRATOR';
  }
  if (upper === 'FACULTY_INCHARGE' || upper === 'FACULTY' || upper === 'INCHARGE') {
    return 'FACULTY_INCHARGE';
  }
  return 'STUDENT';
}

/**
 * Returns human-readable label for a role
 */
export function getRoleDisplayName(role: UserRole | string): string {
  if (role === 'BOOTSTRAP_ADMIN' || role === 'bootstrap_admin') {
    return 'Administrator';
  }
  const norm = normalizeRole(role);
  switch (norm) {
    case 'STUDENT':
      return 'Student';
    case 'FACULTY_INCHARGE':
      return 'Faculty Incharge';
    case 'ADMINISTRATOR':
      return 'Administrator';
    default:
      return 'Student';
  }
}
