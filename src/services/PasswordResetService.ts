import { dbStorage, hashPassword } from '../lib/db';
import { PasswordResetTokenRecord, UserRole } from '../types';
import { EmailDeliveryService } from './EmailDeliveryService';
import { AuthService } from './AuthService';

export interface PasswordStrengthResult {
  isValid: boolean;
  score: 'weak' | 'medium' | 'strong';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface PasswordResetRequestResult {
  success: boolean;
  message: string;
  devResetUrl?: string;
  isRateLimited?: boolean;
}

export interface TokenValidationResult {
  valid: boolean;
  error?: string;
  tokenRecord?: PasswordResetTokenRecord;
  email?: string;
  role?: UserRole;
  userName?: string;
}

export class PasswordResetService {
  private static COOLDOWN_SECONDS = 60;
  private static TOKEN_EXPIRY_MINUTES = 15;

  /**
   * Validates password against SAILL security criteria:
   * - Min 8 characters
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 number
   * - At least 1 special character
   */
  static validatePasswordStrength(password: string): PasswordStrengthResult {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const passedCount = Object.values(checks).filter(Boolean).length;
    let score: 'weak' | 'medium' | 'strong' = 'weak';
    if (passedCount === 5) {
      score = 'strong';
    } else if (passedCount >= 3) {
      score = 'medium';
    }

    return {
      isValid: passedCount === 5,
      score,
      checks
    };
  }

  /**
   * Generate cryptographically random 256-bit token
   */
  private static generateSecureToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Search for an eligible user account matching email address across Admin, Faculty, and Student.
   */
  private static async findUserByEmail(email: string): Promise<{
    role: UserRole;
    userId: string;
    email: string;
    name: string;
    status: string;
  } | null> {
    const target = email.trim().toLowerCase();
    if (!target) return null;

    // 1. Search Administrators
    try {
      const admin = await dbStorage.getAdminByUsernameOrEmail(target);
      if (admin && admin.email && admin.email.toLowerCase() === target) {
        return {
          role: 'ADMINISTRATOR',
          userId: admin.username,
          email: admin.email,
          name: admin.fullName,
          status: admin.status || 'ACTIVE'
        };
      }
    } catch {
      // ignore
    }

    // 2. Search Faculty
    try {
      const faculty = await dbStorage.getFacultyByEmpIdOrEmail(target);
      if (faculty && faculty.email && faculty.email.toLowerCase() === target) {
        return {
          role: 'FACULTY_INCHARGE',
          userId: faculty.employeeId,
          email: faculty.email,
          name: faculty.fullName,
          status: faculty.status || 'active'
        };
      }
    } catch {
      // ignore
    }

    // 3. Search Students
    try {
      const creds = await dbStorage.getStudentCredentialsByRollNoOrEmail(target);
      if (creds && creds.email && creds.email.toLowerCase() === target) {
        const profile = await dbStorage.getProfileByRollNo(creds.rollNo);
        const userReg = await dbStorage.getUserRegistration(creds.rollNo);
        const status = profile?.status || userReg?.status || creds.status || 'ACTIVE';
        return {
          role: 'STUDENT',
          userId: creds.rollNo,
          email: creds.email,
          name: profile?.name || `Student ${creds.rollNo}`,
          status
        };
      }
    } catch {
      // ignore
    }

    return null;
  }

  /**
   * Initiates password reset request.
   * Enforces neutral responses to prevent account enumeration.
   */
  static async requestPasswordReset(email: string): Promise<PasswordResetRequestResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const neutralMessage =
      'If an account exists with this email address, password recovery instructions will be provided.';

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return {
        success: true,
        message: neutralMessage
      };
    }

    // Check rate limiting
    const existingTokens = await dbStorage.getAllPasswordResetTokens();
    const userTokens = existingTokens.filter((t) => t.email.toLowerCase() === normalizedEmail);
    const recentToken = userTokens.find((t) => {
      const createdTime = new Date(t.createdAt).getTime();
      return Date.now() - createdTime < this.COOLDOWN_SECONDS * 1000;
    });

    if (recentToken) {
      return {
        success: false,
        isRateLimited: true,
        message: `Please wait ${this.COOLDOWN_SECONDS} seconds before requesting another password reset.`
      };
    }

    // Look up user
    const user = await this.findUserByEmail(normalizedEmail);

    // If user not found OR user is pending/rejected/suspended, return neutral response without token
    if (!user) {
      return {
        success: true,
        message: neutralMessage
      };
    }

    const normStatus = (user.status || '').toUpperCase();
    if (
      normStatus === 'PENDING' ||
      normStatus === 'PENDING_APPROVAL' ||
      normStatus === 'REJECTED' ||
      normStatus === 'SUSPENDED'
    ) {
      // Ineligible status - return neutral message
      return {
        success: true,
        message: neutralMessage
      };
    }

    // Invalidate prior unused tokens for this email
    for (const oldToken of userTokens) {
      if (!oldToken.used) {
        oldToken.used = true;
        await dbStorage.savePasswordResetTokenRecord(oldToken);
      }
    }

    // Generate new raw token and SHA-256 hash
    const rawToken = this.generateSecureToken();
    const tokenHash = await hashPassword(rawToken);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();

    const tokenRecord: PasswordResetTokenRecord = {
      id: `token-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      role: user.role,
      userId: user.userId,
      tokenHash,
      createdAt: now.toISOString(),
      expiresAt,
      used: false
    };

    await dbStorage.savePasswordResetTokenRecord(tokenRecord);

    // Build reset URL
    const baseUrl = window.location.origin + window.location.pathname;
    const resetUrl = `${baseUrl}?page=reset-password&token=${rawToken}`;

    // Dispatch email
    const delivery = await EmailDeliveryService.sendPasswordResetEmail(
      normalizedEmail,
      resetUrl,
      user.name,
      user.role
    );

    // Log audit trail
    await dbStorage.logAuditTrail(
      'PASSWORD_RESET_REQUESTED',
      `Password reset requested for email '${normalizedEmail}' (${user.role}).`,
      user.userId,
      user.name,
      user.role,
      user.userId
    );

    return {
      success: true,
      message: neutralMessage,
      devResetUrl: delivery.devResetUrl
    };
  }

  /**
   * Validates a password reset token
   */
  static async validateResetToken(rawToken: string): Promise<TokenValidationResult> {
    const invalidMessage =
      'This password reset link is invalid or has expired. Please request a new password reset.';

    if (!rawToken || rawToken.trim().length < 10) {
      return { valid: false, error: invalidMessage };
    }

    const inputHash = await hashPassword(rawToken.trim());
    const allTokens = await dbStorage.getAllPasswordResetTokens();

    const tokenRecord = allTokens.find((t) => t.tokenHash === inputHash);

    if (!tokenRecord) {
      return { valid: false, error: invalidMessage };
    }

    if (tokenRecord.used) {
      return {
        valid: false,
        error: 'This password reset link has already been used. Please request a new password reset.'
      };
    }

    const isExpired = new Date().getTime() > new Date(tokenRecord.expiresAt).getTime();
    if (isExpired) {
      return { valid: false, error: invalidMessage };
    }

    // Confirm user is still eligible
    const user = await this.findUserByEmail(tokenRecord.email);
    if (!user) {
      return { valid: false, error: invalidMessage };
    }

    const normStatus = (user.status || '').toUpperCase();
    if (
      normStatus === 'PENDING' ||
      normStatus === 'PENDING_APPROVAL' ||
      normStatus === 'REJECTED' ||
      normStatus === 'SUSPENDED'
    ) {
      return {
        valid: false,
        error: 'Account status is not eligible for password recovery. Please contact the Administrator.'
      };
    }

    return {
      valid: true,
      tokenRecord,
      email: tokenRecord.email,
      role: tokenRecord.role,
      userName: user.name
    };
  }

  /**
   * Resets password using valid token
   */
  static async resetPasswordWithToken(
    rawToken: string,
    newRawPassword: string
  ): Promise<{ success: boolean; message: string; role?: UserRole; name?: string }> {
    const validation = await this.validateResetToken(rawToken);
    if (!validation.valid || !validation.tokenRecord) {
      await dbStorage.logAuditTrail(
        'PASSWORD_RESET_FAILED',
        'Password reset failed: Invalid or expired token attempted.',
        'ANONYMOUS',
        'Anonymous User',
        'STUDENT'
      );
      throw new Error(validation.error || 'Invalid or expired password reset link.');
    }

    const strength = this.validatePasswordStrength(newRawPassword);
    if (!strength.isValid) {
      await dbStorage.logAuditTrail(
        'PASSWORD_RESET_FAILED',
        `Password reset failed for ${validation.email}: Password does not meet security criteria.`,
        validation.tokenRecord.userId,
        validation.userName || 'User',
        validation.role || 'STUDENT'
      );
      throw new Error('Password does not meet required security criteria.');
    }

    const tokenRecord = validation.tokenRecord;

    // Execute password update based on role
    if (tokenRecord.role === 'ADMINISTRATOR' || tokenRecord.role === 'BOOTSTRAP_ADMIN') {
      await dbStorage.updateAdminPassword(tokenRecord.userId, newRawPassword);
    } else if (tokenRecord.role === 'FACULTY_INCHARGE' || tokenRecord.role === 'FACULTY' as any) {
      await dbStorage.updateFacultyPassword(tokenRecord.userId, newRawPassword);
    } else {
      await dbStorage.resetPassword(tokenRecord.userId, tokenRecord.email, newRawPassword);
    }

    // Invalidate token
    tokenRecord.used = true;
    await dbStorage.savePasswordResetTokenRecord(tokenRecord);

    // Invalidate active session if matches
    const currentSession = AuthService.getCurrentUser();
    if (
      currentSession &&
      (currentSession.email?.toLowerCase() === tokenRecord.email.toLowerCase() ||
        currentSession.username === tokenRecord.userId ||
        currentSession.rollNo === tokenRecord.userId ||
        currentSession.employeeId === tokenRecord.userId)
    ) {
      AuthService.logout();
    }

    // Clean up dev simulation email
    EmailDeliveryService.clearLastDevEmail();

    // Log audit trail
    await dbStorage.logAuditTrail(
      'PASSWORD_RESET_COMPLETED',
      `Password successfully reset for account '${tokenRecord.userId}' (${tokenRecord.role}).`,
      tokenRecord.userId,
      validation.userName || tokenRecord.userId,
      tokenRecord.role,
      tokenRecord.userId
    );

    return {
      success: true,
      message: 'Password Reset Successful! You can now log in with your new password.',
      role: tokenRecord.role,
      name: validation.userName
    };
  }
}
