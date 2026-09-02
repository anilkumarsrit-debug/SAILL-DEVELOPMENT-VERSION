export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type QuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'true_false'
  | 'match_following'
  | 'fill_blank'
  | 'sequence_ordering'
  | 'scenario_based'
  | 'case_based';

export interface QuestionBankItem {
  id: string;
  moduleId: string;
  topic: string;
  courseOutcome: 'CO1' | 'CO2' | 'CO3' | 'CO4' | 'CO5';
  difficulty: DifficultyLevel;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[] | Record<string, string>; // string, array of strings for multi-select, or left->right object for matching
  explanation: string;
  keywords: string[];
  estimatedTimeSeconds: number;
  
  // Optional media & rich context
  audioText?: string;
  passage?: string;
  scenarioContext?: string;
  matchingPairs?: { left: string; right: string }[];
  sequenceItems?: string[];
}

export interface QuizAttemptRecord {
  quizInstanceId: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  moduleId: string;
  moduleTitle: string;
  questionIds: string[];
  questionsSnapshot: QuestionBankItem[];
  userAnswers: Record<string, any>;
  score: number; // Percentage (0-100)
  rawScore: number; // e.g. 8/10
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  attemptNumber: number;
  attemptedAt: string; // ISO string
  passed: boolean;
  coScores: Record<string, { total: number; correct: number }>;
  difficultyScores: Record<string, { total: number; correct: number }>;
  missedTopics: string[];
}

export interface QuizGenerationConfig {
  moduleId: string;
  studentId: string;
  totalQuestions?: number; // Default 10
  easyCount?: number; // Default 3
  mediumCount?: number; // Default 5
  hardCount?: number; // Default 2
  allowAIExpansion?: boolean;
}
