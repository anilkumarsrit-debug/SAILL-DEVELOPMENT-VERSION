import {
  StudentRegistrationPayload,
  FacultyInchargeRegistrationPayload,
  UserRegistrationRecord
} from '../types/registration';
import { ValidationService } from './ValidationService';
import { dbStorage, hashPassword } from '../lib/db';
import { StudentProfile } from '../types';

export class RegistrationService {
  /**
   * Universal Student Registration Processor
   * Enforces validation, duplicate checks, password hashing, and PENDING_APPROVAL status.
   */
  static async registerStudent(payload: StudentRegistrationPayload): Promise<UserRegistrationRecord> {
    // 1. Client-Side Field Validation
    const validation = ValidationService.validateStudent(payload);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const rollNo = payload.rollNo.trim().toUpperCase();
    const email = payload.email.trim().toLowerCase();

    // 2. Duplicate Checks
    const isDuplicateRoll = await dbStorage.checkDuplicateRollNo(rollNo);
    if (isDuplicateRoll) {
      throw new Error(`Roll Number '${rollNo}' is already registered. Please login with your credentials.`);
    }

    const isDuplicateEmail = await dbStorage.checkDuplicateEmail(email);
    if (isDuplicateEmail) {
      throw new Error(`Email address '${email}' is already registered in the system.`);
    }

    // 3. Find matching academic batch
    const matchedBatch = await dbStorage.findBatchForStudent(
      payload.programme || 'B.Tech',
      payload.branch,
      payload.year,
      payload.semester,
      payload.section,
      payload.academicYear || ''
    );

    const passHash = await hashPassword(payload.password);
    const nowIso = new Date().toISOString();

    // 4. Construct Database Model
    const registrationRecord: UserRegistrationRecord = {
      userID: rollNo,
      fullName: payload.fullName.trim(),
      email: email,
      passwordHash: passHash,
      registrationType: 'STUDENT',
      role: 'STUDENT',
      status: 'PENDING_APPROVAL',
      createdDate: nowIso,
      updatedDate: nowIso,
      approvalDate: null,
      approvedBy: null,
      assignedBranch: payload.branch,
      assignedSection: payload.section,
      assignedYear: payload.year,
      assignedSemester: payload.semester
    };

    // Construct Student Profile Record
    const studentProfile: StudentProfile = {
      id: `srit-${rollNo}`,
      name: payload.fullName.trim(),
      rollNo: rollNo,
      branch: payload.branch,
      section: payload.section,
      batch: matchedBatch ? matchedBatch.batchName : `B.Tech ${payload.branch} ${payload.section}`,
      batchId: matchedBatch ? matchedBatch.id : `BATCH-${rollNo}`,
      batchName: matchedBatch ? matchedBatch.batchName : `B.Tech ${payload.branch} ${payload.section}`,
      programme: 'B.Tech',
      department: payload.branch,
      academicYear: matchedBatch ? matchedBatch.academicYear : (payload.academicYear || '2026–27'),
      semester: payload.semester,
      year: payload.year,
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      xp: 0,
      level: 1,
      streakDays: 0,
      targetGoal: 'Master Technical Communication & Placement Readiness',
      joinedDate: nowIso.split('T')[0],
      bio: `Registered B.Tech Student (${payload.branch}).`,
      status: 'PENDING_APPROVAL'
    };

    // 5. Persist to DB with PENDING_APPROVAL status
    await dbStorage.saveUserRegistration(registrationRecord, studentProfile);

    // 6. Audit Trail
    await dbStorage.logAuditTrail(
      'STUDENT_REGISTER',
      `Student registered (${rollNo}) with PENDING_APPROVAL status.`,
      rollNo,
      payload.fullName,
      'STUDENT'
    );

    return registrationRecord;
  }

  /**
   * Universal Faculty Incharge Registration Processor
   * Enforces validation, duplicate checks, password hashing, and PENDING_APPROVAL status.
   */
  static async registerFacultyIncharge(
    payload: FacultyInchargeRegistrationPayload
  ): Promise<UserRegistrationRecord> {
    // 1. Client-Side Field Validation
    const validation = ValidationService.validateFacultyIncharge(payload);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const employeeId = payload.employeeId.trim().toUpperCase();
    const email = payload.email.trim().toLowerCase();

    // 2. Duplicate Checks
    const isDuplicateEmp = await dbStorage.checkDuplicateEmployeeId(employeeId);
    if (isDuplicateEmp) {
      throw new Error(`Employee ID '${employeeId}' is already registered in the system.`);
    }

    const isDuplicateEmail = await dbStorage.checkDuplicateEmail(email);
    if (isDuplicateEmail) {
      throw new Error(`Email address '${email}' is already registered in the system.`);
    }

    const passHash = await hashPassword(payload.password);
    const nowIso = new Date().toISOString();

    // 3. Construct Database Model
    const registrationRecord: UserRegistrationRecord = {
      userID: employeeId,
      fullName: payload.fullName.trim(),
      email: email,
      passwordHash: passHash,
      registrationType: 'FACULTY_INCHARGE',
      role: 'FACULTY_INCHARGE',
      status: 'PENDING_APPROVAL',
      createdDate: nowIso,
      updatedDate: nowIso,
      approvalDate: null,
      approvedBy: null,
      assignedBranch: payload.department,
      assignedSection: null,
      assignedYear: null,
      assignedSemester: null
    };

    // 4. Persist to DB with PENDING_APPROVAL status
    await dbStorage.saveUserRegistration(registrationRecord);

    // 5. Audit Trail
    await dbStorage.logAuditTrail(
      'FACULTY_REGISTER',
      `Faculty Incharge registered (${employeeId}) with PENDING_APPROVAL status.`,
      employeeId,
      payload.fullName,
      'FACULTY_INCHARGE'
    );

    return registrationRecord;
  }
}
