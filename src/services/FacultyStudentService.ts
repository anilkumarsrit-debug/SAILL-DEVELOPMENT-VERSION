import { StudentProfile, PortfolioItem } from '../types';
import { FacultyAssignmentService } from './FacultyAssignmentService';
import { StudentFilterOptions, FacultyNote } from '../types/faculty';

const NOTES_KEY = 'saill_faculty_student_notes';

export class FacultyStudentService {
  /**
   * Get all students assigned to the given faculty ID (or all if administrator)
   */
  static getAssignedStudents(
    facultyId: string,
    allStudents: StudentProfile[],
    isAdministrator = false
  ): StudentProfile[] {
    if (isAdministrator) {
      return allStudents;
    }
    return FacultyAssignmentService.getAssignedStudentsForFaculty(facultyId, allStudents);
  }

  /**
   * Filter students by search term and dropdown criteria
   */
  static filterStudents(
    students: StudentProfile[],
    options: StudentFilterOptions
  ): StudentProfile[] {
    const q = options.searchQuery.trim().toLowerCase();
    const branchFilter = options.branch.trim().toLowerCase();
    const yearFilter = options.academicYear.trim().toLowerCase();
    const semFilter = options.semester.trim().toLowerCase();
    const secFilter = options.section.trim().toLowerCase();

    return students.filter((s) => {
      // Text match (Name or Roll Number)
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q));

      // Branch match
      const sBranch = (s.branch || s.department || '').toLowerCase();
      const matchesBranch = !branchFilter || sBranch.includes(branchFilter);

      // Academic Year match
      const sYear = (s.year || s.academicYear || '').toLowerCase();
      const matchesYear = !yearFilter || sYear.includes(yearFilter);

      // Semester match
      const sSem = (s.semester || '').toLowerCase();
      const matchesSem = !semFilter || sSem.includes(semFilter);

      // Section match
      const sSec = (s.section || '').toUpperCase();
      const matchesSec = !secFilter || sSec.includes(secFilter.toUpperCase());

      return matchesQuery && matchesBranch && matchesYear && matchesSem && matchesSec;
    });
  }

  /**
   * Get Faculty Notes for a given student
   */
  static getNotesForStudent(studentRollNo: string): FacultyNote[] {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      if (!stored) return [];
      const notes: FacultyNote[] = JSON.parse(stored);
      return notes.filter((n) => n.studentRollNo.toUpperCase() === studentRollNo.toUpperCase());
    } catch {
      return [];
    }
  }

  /**
   * Add a new faculty note for a student
   */
  static addStudentNote(studentRollNo: string, facultyId: string, text: string): FacultyNote {
    const newNote: FacultyNote = {
      id: `NOTE-${Date.now()}`,
      studentRollNo: studentRollNo.toUpperCase(),
      facultyId,
      noteText: text.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem(NOTES_KEY);
      const notes: FacultyNote[] = stored ? JSON.parse(stored) : [];
      notes.unshift(newNote);
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      // Storage error fallback
    }

    return newNote;
  }
}
