export type FacultyWorkbenchTabKey =
  | 'home'
  | 'classes'
  | 'students'
  | 'progress-monitor'
  | 'module-scoring'
  | 'modules'
  | 'release-modules'
  | 'assessments'
  | 'portfolio'
  | 'ai-insights'
  | 'reports'
  | 'settings'
  | 'assignments';

export interface StudentFilterOptions {
  searchQuery: string;
  branch: string;
  academicYear: string;
  semester: string;
  section: string;
}

export interface ProgressFilterOptions {
  searchQuery: string;
  branch: string;
  academicYear: string;
  semester: string;
  section: string;
  moduleId: string;
}

export interface FacultyAssessmentItem {
  id: string;
  studentRollNo: string;
  studentName: string;
  branch: string;
  section: string;
  moduleTitle: string;
  submissionDate: string;
  score: number;
  status: 'AI Scored' | 'Reviewed' | 'Pending Review';
  aiFeedback: string;
  recordingUrl?: string;
}

export interface FacultyNote {
  id: string;
  studentRollNo: string;
  facultyId: string;
  noteText: string;
  createdAt: string;
}
