import { AuthUser, LoginCredentials, UserRole, normalizeRole } from '../types/auth';
import { dbStorage } from '../lib/db';
import { Page } from '../types';
import { getRedirectPageForRole, hasPageAccess } from '../utils/permissionMiddleware';

const AUTH_SESSION_KEY = 'saill_auth_session';

export class AuthService {
  /**
   * Authenticate user strictly based on user-selected role.
   * Does NOT perform automatic role guessing or switching.
   */
  static async loginWithRole(credentials: LoginCredentials, selectedRole: UserRole): Promise<AuthUser> {
    const emailOrId = credentials.emailOrId.trim();
    const password = credentials.password;

    if (!emailOrId) {
      throw new Error('Please enter your Email Address or User Identifier.');
    }
    if (!password) {
      throw new Error('Please enter your Password.');
    }

    if (selectedRole === 'ADMINISTRATOR' || selectedRole === 'BOOTSTRAP_ADMIN') {
      const admin = await dbStorage.loginAdmin(emailOrId, password);
      const isBootstrap =
        admin.username.toUpperCase() === 'BOOTSTRAP_ADMIN' ||
        admin.isPlatformOwner === true ||
        admin.role === ('BOOTSTRAP_ADMIN' as unknown as 'administrator');

      const authUser: AuthUser = {
        id: admin.username,
        email: admin.email || 'admin@srit.ac.in',
        name: admin.fullName || 'Bootstrap Administrator',
        role: isBootstrap ? 'BOOTSTRAP_ADMIN' : 'ADMINISTRATOR',
        username: admin.username,
        department: 'System Administration'
      };

      this.saveSession(authUser);
      return authUser;
    }

    if (selectedRole === 'FACULTY_INCHARGE') {
      const faculty = await dbStorage.loginFaculty(emailOrId, password);
      const authUser: AuthUser = {
        id: faculty.employeeId,
        email: faculty.email,
        name: faculty.fullName,
        role: 'FACULTY_INCHARGE',
        employeeId: faculty.employeeId,
        department: faculty.department,
        designation: faculty.designation,
        mobile: faculty.mobile
      };

      this.saveSession(authUser);
      return authUser;
    }

    if (selectedRole === 'STUDENT') {
      const student = await dbStorage.loginStudent(emailOrId, password);
      const authUser: AuthUser = {
        id: student.rollNo || student.id,
        email: student.email,
        name: student.name,
        role: 'STUDENT',
        rollNo: student.rollNo,
        department: student.department || student.branch,
        avatarUrl: student.avatarUrl
      };

      this.saveSession(authUser);
      return authUser;
    }

    throw new Error('Invalid user role specified.');
  }

  /**
   * Fallback login method with explicit credentials
   */
  static async login(credentials: LoginCredentials, explicitRole?: UserRole): Promise<AuthUser> {
    if (explicitRole) {
      return this.loginWithRole(credentials, explicitRole);
    }
    return this.loginWithRole(credentials, 'STUDENT');
  }

  /**
   * Save session state to localStorage
   */
  static saveSession(user: AuthUser): void {
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
      // Sync legacy active role key for components reading raw localStorage
      localStorage.setItem('saill_active_role', user.role);
    } catch (e) {
      console.warn('Failed to save auth session to storage:', e);
    }
  }

  /**
   * Get current authenticated user session
   */
  static getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed && parsed.role) {
        if (parsed.role !== 'BOOTSTRAP_ADMIN') {
          parsed.role = normalizeRole(parsed.role);
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Clear session on logout
   */
  static async logout(): Promise<void> {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
      localStorage.removeItem('saill_active_role');
      localStorage.removeItem('saill_active_roll_no');
      localStorage.removeItem('saill_active_faculty_id');
      localStorage.removeItem('saill_active_admin');
      await dbStorage.logoutStudent();
    } catch (e) {
      console.warn('Error during logout cleanup:', e);
    }
  }

  /**
   * Determine redirection target based on role
   */
  static getRedirectPage(role: UserRole): Page {
    return getRedirectPageForRole(role);
  }

  /**
   * Verify permissions for a target page
   */
  static hasAccess(user: AuthUser | null, page: Page): boolean {
    if (page === 'landing') return true;
    if (!user) return false;
    return hasPageAccess(user.role, page);
  }
}
