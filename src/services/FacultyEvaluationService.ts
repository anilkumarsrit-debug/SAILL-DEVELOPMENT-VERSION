import { FacultyModuleScore, StudentProfile } from '../types';
import { dbStorage } from '../lib/db';

export interface EvaluationItemSummary {
  studentRollNo: string;
  studentName: string;
  batchId: string;
  batchName: string;
  moduleId: string;
  moduleTitle: string;
  moduleCompletionPercent: number;
  isCompleted: boolean;
  aiPracticeScore: number;
  knowledgeCheckScore: number;
  facultyScore: number | null; // 1-10 scale
  facultyRemarks: string;
  evaluatedAt: string | null;
  facultyName: string | null;
  facultyId: string | null;
}

export class FacultyEvaluationService {
  /**
   * Save or update a Faculty Module Performance Score (1-10 scale).
   */
  static async recordScore(
    studentRollNo: string,
    studentName: string,
    moduleId: string,
    moduleTitle: string,
    batchId: string,
    batchName: string,
    facultyId: string,
    facultyName: string,
    score: number,
    remarks?: string,
    facultyDepartment?: string
  ): Promise<FacultyModuleScore> {
    const sanitizedScore = Math.min(10, Math.max(1, Math.round(score)));
    const nowIso = new Date().toISOString();

    const existing = await dbStorage.getFacultyModuleScore(studentRollNo, moduleId);

    const record: FacultyModuleScore = {
      id: `${studentRollNo.trim().toUpperCase()}__${moduleId.trim()}`,
      studentRollNo: studentRollNo.trim().toUpperCase(),
      studentName: studentName.trim(),
      moduleId: moduleId.trim(),
      moduleTitle: moduleTitle.trim(),
      batchId: batchId.trim(),
      batchName: batchName.trim(),
      facultyId: facultyId.trim(),
      facultyName: facultyName.trim(),
      facultyDepartment: facultyDepartment || 'Humanities & Sciences (English)',
      score: sanitizedScore,
      remarks: remarks?.trim() || '',
      evaluatedAt: existing?.evaluatedAt || nowIso,
      updatedAt: nowIso
    };

    const saved = await dbStorage.saveFacultyModuleScore(record);

    // Audit log
    await dbStorage.addAuditLog(
      facultyId,
      facultyName,
      'faculty_incharge',
      'SUBMISSION_EVALUATED',
      `Assigned Faculty Module Performance Score of ${sanitizedScore}/10 to ${studentName} (${studentRollNo}) for ${moduleTitle}.`
    );

    return saved;
  }

  /**
   * Get single score for a student and module.
   */
  static async getScore(studentRollNo: string, moduleId: string): Promise<FacultyModuleScore | null> {
    return await dbStorage.getFacultyModuleScore(studentRollNo, moduleId);
  }

  /**
   * Get all faculty module scores.
   */
  static async getAllScores(): Promise<FacultyModuleScore[]> {
    return await dbStorage.getAllFacultyModuleScores();
  }

  /**
   * Get scores for a specific batch.
   */
  static async getScoresByBatch(batchId: string): Promise<FacultyModuleScore[]> {
    return await dbStorage.getFacultyModuleScoresByBatch(batchId);
  }

  /**
   * Get scores for a specific student across all modules.
   */
  static async getScoresForStudent(studentRollNo: string): Promise<FacultyModuleScore[]> {
    return await dbStorage.getFacultyModuleScoresForStudent(studentRollNo);
  }

  /**
   * Get scores evaluated by a specific faculty member.
   */
  static async getScoresByFaculty(facultyId: string): Promise<FacultyModuleScore[]> {
    return await dbStorage.getFacultyModuleScoresByFaculty(facultyId);
  }

  /**
   * Score performance descriptors for 1-10 display
   */
  static getScoreDescriptor(score: number): { label: string; color: string; badgeBg: string } {
    if (score >= 9) return { label: 'Outstanding', color: 'text-emerald-700', badgeBg: 'bg-emerald-100 border-emerald-300' };
    if (score >= 8) return { label: 'Very Good', color: 'text-teal-700', badgeBg: 'bg-teal-100 border-teal-300' };
    if (score >= 7) return { label: 'Good', color: 'text-blue-700', badgeBg: 'bg-blue-100 border-blue-300' };
    if (score >= 6) return { label: 'Competent', color: 'text-amber-700', badgeBg: 'bg-amber-100 border-amber-300' };
    if (score >= 5) return { label: 'Satisfactory', color: 'text-orange-700', badgeBg: 'bg-orange-100 border-orange-300' };
    return { label: 'Needs Remediation', color: 'text-rose-700', badgeBg: 'bg-rose-100 border-rose-300' };
  }
}
