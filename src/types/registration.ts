import { UserRole } from './auth';

export type RegistrationType = 'STUDENT' | 'FACULTY_INCHARGE';

export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';

export interface StudentRegistrationPayload {
  fullName: string;
  rollNo: string;
  email: string;
  mobile: string;
  programme?: string;
  branch: string;
  academicYear?: string;
  year: string;
  semester: string;
  section: string;
  password: string;
  confirmPassword: string;
}

export interface FacultyInchargeRegistrationPayload {
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  password: string;
  confirmPassword: string;
}

export interface UserRegistrationRecord {
  userID: string;
  fullName: string;
  email: string;
  passwordHash: string;
  registrationType: RegistrationType;
  role: UserRole;
  status: AccountStatus;
  createdDate: string;
  updatedDate: string;
  rejectionReason?: string;
  
  // Future Ready Placeholders
  approvalDate: string | null;
  approvedBy: string | null;
  assignedBranch: string | null;
  assignedSection: string | null;
  assignedYear: string | null;
  assignedSemester: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
