import {
  StudentRegistrationPayload,
  FacultyInchargeRegistrationPayload,
  ValidationResult
} from '../types/registration';

export class ValidationService {
  /**
   * Validates standard Email format
   */
  static validateEmailFormat(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validates Password strength:
   * - Minimum 8 characters
   * - Must contain at least one letter and one digit
   */
  static validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required.' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!hasLetter || !hasDigit) {
      return { isValid: false, message: 'Password must contain both letters and numbers.' };
    }
    return { isValid: true };
  }

  /**
   * Validates matching password and confirm password
   */
  static validateMatchingPasswords(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validates Student Registration payload
   */
  static validateStudent(payload: StudentRegistrationPayload): ValidationResult {
    const errors: string[] = [];

    if (!payload.fullName || !payload.fullName.trim()) {
      errors.push('Full Name is required.');
    }
    if (!payload.rollNo || !payload.rollNo.trim()) {
      errors.push('Roll Number is required.');
    }
    if (!payload.email || !payload.email.trim()) {
      errors.push('Email Address is required.');
    } else if (!this.validateEmailFormat(payload.email)) {
      errors.push('Please enter a valid Email Address format (e.g. student@srit.ac.in).');
    }
    if (!payload.mobile || !payload.mobile.trim()) {
      errors.push('Mobile Number is required.');
    } else if (payload.mobile.replace(/\D/g, '').length < 10) {
      errors.push('Mobile Number must be a valid 10-digit phone number.');
    }
    if (!payload.branch || !payload.branch.trim()) {
      errors.push('Branch / Department is required.');
    }
    if (!payload.year || !payload.year.trim()) {
      errors.push('Academic Year level is required.');
    }
    if (!payload.semester || !payload.semester.trim()) {
      errors.push('Semester is required.');
    }
    if (!payload.section || !payload.section.trim()) {
      errors.push('Section is required.');
    }

    const passCheck = this.validatePasswordStrength(payload.password);
    if (!passCheck.isValid && passCheck.message) {
      errors.push(passCheck.message);
    }

    if (!this.validateMatchingPasswords(payload.password, payload.confirmPassword)) {
      errors.push('Password and Confirm Password do not match.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates Faculty Incharge Registration payload
   */
  static validateFacultyIncharge(payload: FacultyInchargeRegistrationPayload): ValidationResult {
    const errors: string[] = [];

    if (!payload.fullName || !payload.fullName.trim()) {
      errors.push('Full Name is required.');
    }
    if (!payload.employeeId || !payload.employeeId.trim()) {
      errors.push('Employee ID is required.');
    }
    if (!payload.email || !payload.email.trim()) {
      errors.push('Email Address is required.');
    } else if (!this.validateEmailFormat(payload.email)) {
      errors.push('Please enter a valid Email Address format (e.g. faculty@srit.ac.in).');
    }
    if (!payload.mobile || !payload.mobile.trim()) {
      errors.push('Mobile Number is required.');
    } else if (payload.mobile.replace(/\D/g, '').length < 10) {
      errors.push('Mobile Number must be a valid 10-digit phone number.');
    }
    if (!payload.department || !payload.department.trim()) {
      errors.push('Department is required.');
    }
    if (!payload.designation || !payload.designation.trim()) {
      errors.push('Designation is required.');
    }

    const passCheck = this.validatePasswordStrength(payload.password);
    if (!passCheck.isValid && passCheck.message) {
      errors.push(passCheck.message);
    }

    if (!this.validateMatchingPasswords(payload.password, payload.confirmPassword)) {
      errors.push('Password and Confirm Password do not match.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitizes input strings to prevent basic XSS or script injection
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  /**
   * Validates file upload for maximum size, allowed mime types, and safe filename.
   * Includes placeholder structure for future virus/malware scanning integration.
   */
  static validateFileUpload(
    file: { name: string; size: number; type: string },
    options: {
      maxSizeBytes?: number;
      allowedTypes?: string[];
    } = {}
  ): ValidationResult {
    const {
      maxSizeBytes = 10 * 1024 * 1024, // 10 MB default
      allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'application/pdf', 'image/png', 'image/jpeg']
    } = options;

    const errors: string[] = [];

    // 1. File size check
    if (file.size > maxSizeBytes) {
      errors.push(`File exceeds maximum permitted size of ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
    }

    // 2. MIME type / extension check
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type '${file.type || 'unknown'}' is not allowed.`);
    }

    // 3. Safe filename check (prevent directory traversal characters)
    if (/[\/\\]|\.\./.test(file.name)) {
      errors.push('Filename contains invalid security path characters.');
    }

    // 4. Placeholder for future virus/malware scanner
    const isScanClean = this.simulateMalwareScan(file);
    if (!isScanClean) {
      errors.push('File failed security audit scan.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Placeholder for future enterprise anti-malware/virus scanning integration.
   */
  private static simulateMalwareScan(_file: { name: string }): boolean {
    return true; // Pass by default
  }
}

