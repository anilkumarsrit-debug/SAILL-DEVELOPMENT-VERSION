import { UserRole } from '../types';
import { FacultyAssignmentService } from './FacultyAssignmentService';
import { StudentProfile } from '../types';

export class FacultyPermissionGuard {
  /**
   * Check if logged-in user is authorized to view Faculty Workbench
   */
  static isFacultyOrAdmin(role?: UserRole | string | null): boolean {
    if (!role) return false;
    const norm = role.toString().toUpperCase();
    return norm === 'FACULTY_INCHARGE' || norm === 'ADMINISTRATOR' || norm === 'FACULTY';
  }

  /**
   * Verify if a specific student is within the faculty member's assigned scope
   */
  static isStudentInFacultyScope(
    facultyId: string,
    studentRollNo: string,
    allStudents: StudentProfile[],
    userRole?: UserRole | string | null
  ): boolean {
    if (userRole && userRole.toString().toUpperCase() === 'ADMINISTRATOR') {
      return true; // Admin has full scope
    }

    const assignedStudents = FacultyAssignmentService.getAssignedStudentsForFaculty(
      facultyId,
      allStudents
    );

    const normRoll = studentRollNo.trim().toUpperCase();
    return assignedStudents.some((s) => s.rollNo.trim().toUpperCase() === normRoll);
  }

  /**
   * Enforce that AI Scores cannot be modified by Faculty
   */
  static canModifyAIScore(): boolean {
    return false; // Immutable AI scores
  }

  /**
   * Enforce that Faculty cannot change roles, assignments, or platform configuration
   */
  static canModifySystemConfig(): boolean {
    return false;
  }
}
