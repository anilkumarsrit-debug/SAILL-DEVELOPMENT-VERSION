/**
 * Unified Assessment & Learning Analytics Framework (UALAF)
 * Types & Core Interfaces
 */

export type AssessmentType =
  | 'ai_pronunciation'
  | 'knowledge_check'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'interview'
  | 'future_custom';

export type AssessmentDifficulty = 'Foundation' | 'Intermediate' | 'Advanced' | 'Mastery';

export type WorkflowStepId =
  | 'instructions'
  | 'attempt'
  | 'submission'
  | 'evaluation'
  | 'feedback'
  | 'reflection'
  | 'portfolio_update'
  | 'analytics_update'
  | 'next_recommendation';

export interface WorkflowStepState {
  stepId: WorkflowStepId;
  stepNumber: number;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface AssessmentMetadata {
  assessmentId: string;
  journeyId: string;
  code: string;
  title: string;
  type: AssessmentType;
  difficulty: AssessmentDifficulty;
  estimatedTimeMinutes: number;
  maxScore: number;
  passingScore: number;
  maxAttempts: number;
  promptId: string;
  rubricId: string;
  instructions: string[];
  learningOutcomes: string[];
  prerequisites?: string[];
}

export type RubricCategory =
  | 'pronunciation'
  | 'word_stress'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'interview'
  | 'business_communication';

export interface PerformanceDescriptor {
  foundation: string;
  intermediate: string;
  advanced: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  weight: number; // e.g. 0.25 (sums to 1.0)
  maxMarks: number; // e.g. 25 (sums to max score)
  description: string;
  descriptors: PerformanceDescriptor;
}

export interface RubricDefinition {
  rubricId: string;
  category: RubricCategory;
  title: string;
  description: string;
  totalMaxScore: number;
  criteria: RubricCriterion[];
}

export interface SuggestedPracticeItem {
  id: string;
  title: string;
  description: string;
  recommendedTool: string;
  estimatedMinutes: number;
}

export interface AIFeedbackPayload {
  overallScore: number;
  percentage: number;
  grade: string;
  skillWiseScores: Record<string, number>;
  strengths: string[];
  areasForImprovement: string[];
  suggestedPractice: SuggestedPracticeItem[];
  facultyRemarksPlaceholder: string;
  evaluatedAt: string;
  isSimulatedMode: boolean;
  detailedAnalysis?: string;
}

export interface StudentResponsePayload {
  textResponse?: string;
  audioDataUrl?: string;
  selectedAnswers?: Record<string, string | number>;
  quizScores?: { correctCount: number; totalCount: number };
  durationSeconds: number;
  submittedAt: string;
}

export interface PortfolioIntegrationPayload {
  artifactId: string;
  assessmentId: string;
  journeyId: string;
  title: string;
  category: 'audio' | 'text' | 'resume' | 'report' | 'reflection' | 'written';
  content: string;
  score: number;
  submittedAt: string;
  reflectionText: string;
  aiFeedbackSummary: string;
  targetAudience: Array<'student_portfolio' | 'faculty_dashboard' | 'admin_analytics' | 'ai_coach'>;
  status: 'Prepared' | 'Synced' | 'Pending Review';
}

export interface AnalyticsEventPayload {
  eventId: string;
  studentId: string;
  assessmentId: string;
  journeyId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  timeSpentSeconds: number;
  attemptNumber: number;
  attemptsRemaining: number;
  timestamp: string;
  skillBreakdown: Record<string, number>;
  targetSystems: Array<
    | 'progress'
    | 'achievements'
    | 'ai_coach'
    | 'faculty_workbench'
    | 'admin_command_center'
  >;
  nextRecommendedAssessmentId?: string;
}

export interface AssessmentSessionState {
  metadata: AssessmentMetadata;
  currentStep: WorkflowStepId;
  stepNumber: number; // 1 to 9
  attemptsUsed: number;
  attemptsRemaining: number;
  timerSecondsElapsed: number;
  isTimerRunning: boolean;
  studentResponse: StudentResponsePayload;
  aiFeedback?: AIFeedbackPayload;
  reflectionText: string;
  portfolioPayload?: PortfolioIntegrationPayload;
  analyticsPayload?: AnalyticsEventPayload;
  nextRecommendationId?: string;
}
