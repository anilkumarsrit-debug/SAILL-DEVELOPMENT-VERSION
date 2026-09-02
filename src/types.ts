export type Page =
  | 'landing'
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'register-choice'
  | 'register-student'
  | 'register-faculty'
  | 'pending-approval'
  | 'dashboard'
  | 'modules'
  | 'module-detail'
  | 'practice'
  | 'portfolio'
  | 'progress'
  | 'profile'
  | 'settings'
  | 'ai-engine'
  | 'faculty-dashboard'
  | 'attendance'
  | 'rubrics'
  | 'internal-marks'
  | 'analytics'
  | 'portfolio-review'
  | 'reports'
  | 'faculty-assistant'
  | 'announcements'
  | 'admin-control'
  | 'system-health'
  | 'qef-framework'
  | 'production-certification';

import { UserRole as AuthUserRole } from './types/auth';

export type UserRole = AuthUserRole | 'administrator' | 'faculty_incharge' | 'student';

export type Permission =
  | 'access_assigned_modules'
  | 'attempt_knowledge_checks'
  | 'maintain_lab_notebook'
  | 'build_portfolio'
  | 'view_own_analytics'
  | 'view_assigned_students'
  | 'evaluate_submissions'
  | 'add_faculty_remarks'
  | 'review_portfolios_notebooks'
  | 'conduct_assessments'
  | 'monitor_department_progress'
  | 'view_department_analytics'
  | 'generate_department_reports'
  | 'manage_faculty_approvals'
  | 'manage_user_accounts'
  | 'assign_faculty_incharge_scopes'
  | 'reset_user_passwords'
  | 'view_audit_logs'
  | 'manage_system_settings';

export interface FacultyAccount {
  employeeId: string; // Primary Key & Username
  fullName: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  role: 'faculty' | 'faculty_incharge';
  status: 'pending' | 'active' | 'rejected';
  rejectionReason?: string;
  passwordHash: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface FacultyInchargeScope {
  employeeId: string; // Primary Key
  departments: string[];
  years: string[];
  sections: string[];
  academicYear: string;
  semester: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AdministratorAccount {
  username: string; // Primary Key
  fullName: string;
  email: string;
  role: 'administrator' | 'BOOTSTRAP_ADMIN';
  status?: string;
  approved?: boolean;
  isPlatformOwner?: boolean;
  passwordHash: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  username?: string;
  performedBy?: string;
  userRole: UserRole;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'STUDENT_REGISTER'
    | 'STUDENT_APPROVED'
    | 'FACULTY_MAPPING'
    | 'FACULTY_REGISTER'
    | 'APPROVE_FACULTY'
    | 'REJECT_FACULTY'
    | 'ASSIGN_INCHARGE_SCOPE'
    | 'FACULTY_ALLOCATION_UPDATE'
    | 'RESET_PASSWORD'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_RESET_COMPLETED'
    | 'PASSWORD_RESET_FAILED'
    | 'TOGGLE_USER_STATUS'
    | 'MODULE_ACCESS'
    | 'SUBMISSION_EVALUATED'
    | 'ADMIN_SETTINGS_UPDATE'
    | 'SYSTEM_INITIALIZATION'
    | 'BATCH_CREATED'
    | 'BATCH_UPDATED'
    | 'BATCH_ARCHIVED'
    | 'BATCH_DELETED'
    | 'FACULTY_BATCH_ASSIGNED'
    | 'STUDENT_BATCH_TRANSFERRED'
    | 'REJECT_STUDENT'
    | 'ADMIN_MODULE_RELEASE'
    | 'ADMIN_MODULE_REVOCATION'
    | 'MODULE_RELEASE'
    | 'FACULTY_ASSIGNMENT_CREATED'
    | 'FACULTY_ASSIGNMENT_DELETED'
    | 'ACTIVITY_SUBMITTED'
    | 'ACTIVITY_REVIEWED'
    | 'RESUBMISSION_ALLOWED'
    | 'MODULE_EVALUATED';
  details: string;
  targetUser?: string;
}

export interface PasswordResetTokenRecord {
  id: string;
  email: string;
  role: UserRole;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

// --- BATCH MANAGEMENT TYPES ---
export type BatchStatus = 'active' | 'inactive' | 'archived';

export interface AcademicBatch {
  id: string; // Auto-generated ID, e.g. BATCH-2026-CSE-1A
  academicYear: string; // e.g. 2026–27
  programme: string; // e.g. B.Tech
  saillDepartment?: string; // e.g. Humanities & Sciences
  branch?: string; // e.g. Civil Engineering
  department: string; // e.g. Civil Engineering
  year: string; // e.g. B.Tech (Civil Engineering)
  semester: string; // e.g. Semester II
  section: string; // e.g. A
  batchName: string; // e.g. B.Tech Civil Engineering → Semester II → Section A
  batchCode: string; // e.g. CIV-B.Tech-SemesterII-A
  status: BatchStatus;
  assignedFacultyInchargeId?: string;
  assignedFacultyInchargeName?: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentBatchTransferRecord {
  id: string;
  rollNo: string;
  studentName: string;
  fromBatchId: string;
  fromBatchName: string;
  toBatchId: string;
  toBatchName: string;
  transferDate: string;
  transferredBy: string;
  reason: string;
}

export interface BatchAnalyticsSummary {
  batchId: string;
  batchName: string;
  batchCode: string;
  totalStudents: number;
  averageModuleCompletion: number; // percentage
  averageKnowledgeCheckScore: number; // percentage
  averageAssessmentScore: number; // percentage
  portfolioCompletionRate: number; // percentage
  notebookCompletionRate: number; // percentage
  aiReadinessScore: number; // 0 - 100
  topPerformingStudents: { rollNo: string; name: string; score: number }[];
  studentsRequiringAttention: { rollNo: string; name: string; issue: string }[];
  moduleWiseCompletion: { moduleId: string; moduleTitle: string; completionPercent: number }[];
}

export type BatchReportType =
  | 'student_progress'
  | 'knowledge_check'
  | 'assessment'
  | 'portfolio_completion'
  | 'notebook_completion'
  | 'ai_analytics'
  | 'module_completion';

export type AICoachId =
  | 'pronunciation'
  | 'listening'
  | 'speaking'
  | 'grammar'
  | 'writing'
  | 'reading'
  | 'resume'
  | 'interview'
  | 'presentation'
  | 'debate'
  | 'vocabulary'
  | 'reflection';

export interface AICoachGuidedImprovement {
  title: string;
  exerciseText: string;
  actionSteps: string[];
}

export interface AICoachEvaluation {
  id: string;
  coachId: AICoachId;
  coachName: string;
  timestamp: string;
  studentInput: string;
  score: number;
  overallFeedback: string;
  strengths: string[];
  suggestions: string[];
  guidedImprovement: AICoachGuidedImprovement;
  metrics: Record<string, number | string>;
  correctedText?: string;
  isSimulatedMode: boolean;
  moduleId?: string;
}

export interface PromptTemplateItem {
  id: string;
  title: string;
  experimentNumber: string; // e.g. EXP-01
  category: string;
  coachId: AICoachId;
  description: string;
  systemPrompt: string;
  userTemplate: string;
  sampleInput: string;
  variables: string[];
}

export interface FacultyClassSummary {
  batch: string;
  totalStudents: number;
  activeThisWeek: number;
  averageScoresByCoach: Record<AICoachId, number>;
  commonLearningPatterns: {
    skill: string;
    patternTitle: string;
    frequencyPercent: number;
    description: string;
    remediationStrategy: string;
  }[];
  atRiskStudentsCount: number;
  topPerformingSkill: string;
  remediationPlanSummary: string;
}

export type ModuleTab =
  | 'overview'
  | 'objectives'
  | 'learn'
  | 'demo'
  | 'practice'
  | 'experiment'
  | 'quiz'
  | 'resources'
  | 'record'
  | 'reflection'
  | 'portfolio'
  | 'status';

export type PracticeToolId =
  | 'pronunciation'
  | 'listening-quiz'
  | 'jam-speaking'
  | 'gd-simulator'
  | 'elevator-pitch'
  | 'star-interview'
  | 'email-drafter'
  | 'resume-builder'
  | 'cornell-notes'
  | 'debate-builder'
  | 'report-formatter'
  | 'speed-reading'
  | 'personal-branding';

export type ModuleCategory =
  | 'Core Foundation'
  | 'Speaking & Delivery'
  | 'Professional Writing'
  | 'Career Readiness';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  section: string;
  batch: string;
  batchId?: string;
  batchName?: string;
  academicBatchId?: string;
  academicBatchName?: string;
  programme?: string;
  program?: string;
  department?: string;
  academicYear?: string;
  semester?: string;
  facultyIncharge?: string;
  email: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streakDays: number;
  targetGoal: string;
  joinedDate: string;
  createdAt?: string;
  year?: string;
  mobile?: string;
  college?: string;
  bio?: string;
  overallScore?: number;
  averageScore?: number;
  overallProgressPercentage?: number;
  portfolioItems?: PortfolioItem[];
  status?: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'CORRECTION_REQUIRED';
  approvalDate?: string;
  approvedBy?: string;
  mappingStatus?: 'MAPPED' | 'UNMAPPED';
  assignedFacultyId?: string;
  assignedFacultyName?: string;
  assignedFacultyDepartment?: string;
  assignedCoordinator?: string;
}

export type ModuleStatus = 'not_started' | 'in_progress' | 'completed';
export type ActivityStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_RETRY';

export type ActivityType =
  | 'audio_recording'
  | 'speaking_practice'
  | 'written_response'
  | 'mcq_quiz'
  | 'scenario_response'
  | 'practice_task'
  | 'digital_notebook'
  | 'reflection_journal';

export type ActivitySubmissionStatus =
  | 'submitted'
  | 'reviewed'
  | 'resubmission_allowed';

export interface StudentActivitySubmission {
  id: string; // Format: `sub_${studentRollNo}_${moduleId}_${activityId}`
  studentRollNo: string;
  studentName: string;
  studentBranch?: string;
  studentSemester?: string;
  studentSection?: string;
  batchId?: string;
  batchName?: string;
  moduleId: string;
  moduleCode?: string;
  moduleTitle: string;
  activityId: string;
  activityTitle: string;
  activityType: ActivityType;
  activityCategory?: string;
  
  // Submission Content Payload
  textContent?: string;
  audioDataUrl?: string;
  audioDurationSeconds?: number;
  mcqAnswers?: {
    questionId: string;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
  }[];
  scenarioDetails?: {
    scenarioPrompt: string;
    studentStrategy: string;
    role?: string;
  };
  structuredData?: any;

  // AI-Generated Evaluation (Preserved Distinctly)
  aiScore?: number; // 0 - 100%
  aiFeedback?: string;
  aiMetrics?: Record<string, number | string>;

  // Submission Lifecycle & Immutability Lock
  submittedAt: string;
  status: ActivitySubmissionStatus;

  // Faculty Activity Evaluation & Review
  facultyReviewed?: boolean;
  facultyReviewedAt?: string;
  facultyRemarks?: string;
  facultyReviewerId?: string;
  facultyReviewerName?: string;
  resubmissionReason?: string;
}

export interface FacultyModuleScore {
  id: string; // Format: `${studentRollNo}__${moduleId}`
  studentRollNo: string;
  studentName: string;
  moduleId: string;
  moduleTitle: string;
  batchId: string;
  batchName: string;
  facultyId: string;
  facultyName: string;
  facultyDepartment?: string;
  score: number; // Integer 1 - 10
  remarks?: string;
  evaluatedAt: string;
  updatedAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: ModuleStatus;
  completedTabs: ModuleTab[];
  reflectionNotes: string;
  savedNotes: string;
  score: number;
  lastAccessed: string;
  // Module 1 detailed progress fields
  activityStates?: Record<string, ActivityStatus>;
  transcriptionScore?: number;
  wordStressScore?: number;
  knowledgeCheckScore?: number;
  finalAssessmentScore?: number;
  wordStressFinalScore?: number;
  reflectionCompleted?: boolean;
  activityAttempts?: Record<string, any[]>;
}

export interface RecordingItem {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  audioDataUrl: string; // Base64 data url for IndexedDB persistence
  durationSeconds: number;
  createdAt: string;
  transcript?: string;
  score?: number;
}

export interface PortfolioItem {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  category: 'audio' | 'text' | 'resume' | 'report' | 'reflection' | 'written';
  content: string; // JSON or raw text string
  score: number;
  createdAt: string;
  teacherFeedback?: string;
  facultyFeedback?: string;
  graded?: boolean;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Needs Revision';
  reviewedAt?: string;
  reviewedBy?: string;
  studentRollNo?: string;
  studentName?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  labExperimentCode: string; // e.g. R26-LAB-01
  labExperimentTitle: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  branch: string;
  section: string;
  status: AttendanceStatus;
  remarks: string;
  markedBy: string;
  createdAt: string;
}

export type RubricSkillCategory =
  | 'pronunciation'
  | 'listening'
  | 'speaking'
  | 'group-discussion'
  | 'presentation'
  | 'interview'
  | 'email-writing'
  | 'resume-writing'
  | 'reading'
  | 'debate'
  | 'report-writing'
  | 'professional-branding';

export interface RubricCriterion {
  id: string;
  name: string;
  maxMarks: number;
  description: string;
}

export interface RubricConfig {
  id: RubricSkillCategory;
  title: string;
  description: string;
  criteria: RubricCriterion[];
}

export interface RubricEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  branch: string;
  rubricCategory: RubricSkillCategory;
  labExperimentCode: string;
  criterionScores: Record<string, number>;
  totalMarks: number; // out of 100 or sum of criteria
  maxMarks: number;
  percentage: number;
  grade: string;
  facultyComments: string;
  assessedBy: string;
  assessedAt: string;
}

export interface StudentInternalMarks {
  studentId: string;
  studentName: string;
  rollNo: string;
  branch: string;
  section: string;
  attendanceMarks: number; // out of 10
  recordWorkMarks: number; // out of 20
  activitiesMarks: number; // out of 15
  quizMarks: number; // out of 15
  portfolioMarks: number; // out of 10
  facultyMarks: number; // out of 15
  aiPerformanceMarks: number; // out of 15
  totalInternalMarks: number; // out of 100
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  lastCalculatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Assessment' | 'Lab Experiment' | 'Remedial' | 'Placement';
  author: string;
  authorRole: string;
  targetAudience: string; // e.g. "All R26 Students"
  date: string;
  isPinned: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  isRead: boolean;
  linkPage?: Page;
}

export interface FacultyAISessionSummary {
  id: string;
  date: string;
  batch: string;
  experimentCode: string;
  summaryText: string;
  weakAreas: string[];
  recommendedRemedialActivities: string[];
  topPerformers: string[];
  attendanceRatePercent: number;
  avgPerformanceScore: number;
}

export interface COPOMapping {
  coCode: string; // CO1, CO2, etc.
  coDescription: string;
  poMappings: Record<string, number>; // PO1..PO12 -> level (1=Low, 2=Medium, 3=High)
  psoMappings: Record<string, number>; // PSO1..PSO2 -> level
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearnSection {
  title: string;
  content: string;
  bulletPoints?: string[];
  example?: string;
  audioSampleText?: string;
  keyTakeaway?: string;
}

// Knowledge Check Quiz Question Types
export type QuizQuestionType =
  | 'mcq'
  | 'fill_blank'
  | 'matching'
  | 'drag_drop'
  | 'typing_practice'
  | 'true_false';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[]; // for MCQ and True/False
  correctAnswer: string | string[] | Record<string, string>; // answer string or array or key-value map
  explanation: string;
  targetWpm?: number; // for typing practice
  passageToType?: string; // for typing practice
  matchingLeft?: string[]; // for matching questions
  matchingRight?: string[]; // for matching questions
  dragItems?: string[]; // for drag & drop or ordering questions
}

// Learning Resource Item
export interface ResourceItem {
  id: string;
  title: string;
  type: 'reference' | 'example' | 'template' | 'download';
  description: string;
  content: string; // Markdown / Text / Fillable Template
  fileFormat?: string; // e.g., 'PDF', 'DOCX', 'TXT', 'JSON'
  downloadFileName?: string;
}

// Digital Laboratory Notebook Experiment Record
export interface LabExperimentRecord {
  experimentNumber: string; // e.g. "EXP-01"
  date: string;
  title: string;
  objective: string;
  studentWorkText: string;
  audioDataUrl?: string;
  reflectionText: string;
  facultyRemarks: string;
  rubricScores: {
    pronunciationAndFluency: number; // 0-20
    grammarAndVocabulary: number; // 0-20
    structureAndCoherence: number; // 0-20
    taskCompletion: number; // 0-20
    technicalAccuracy: number; // 0-20
  };
  totalScore: number; // out of 100
  status: 'Completed' | 'Pending Verification' | 'Needs Revision';
  facultyVerified: boolean;
}

export interface ModuleData {
  id: string;
  code: string; // e.g. R26-LAB-01
  title: string;
  category: ModuleCategory;
  shortDesc: string;
  estimatedMinutes: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  aiTools: string[];
  iconName: string;
  overview: {
    syllabusR26Code: string;
    description: string;
    keyFocusAreas: string[];
    industryRelevance: string;
    prerequisites: string[];
  };
  objectives: string[];
  learnContent: {
    introduction: string;
    sections: LearnSection[];
  };
  practiceConfig: {
    toolId: PracticeToolId;
    toolTitle: string;
    instructions: string;
    prompts: string[];
  };
  reflectionPrompts: string[];
  quizQuestions?: QuizQuestion[];
  resources?: ResourceItem[];
}

export interface AIEvaluationResult {
  score: number; // 0 to 100
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  metrics: Record<string, number | string>;
  isSimulatedMode: boolean;
}

export interface AIPromptDefinition {
  id: string;
  version: string;
  moduleCategory: 'phonetics' | 'jam' | 'interview' | 'presentation' | 'resume';
  systemPrompt: string;
  expectedJsonSchema: Record<string, any>;
  validationRules: Array<(response: any) => boolean>;
}


