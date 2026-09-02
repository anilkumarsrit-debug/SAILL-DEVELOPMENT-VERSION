/**
 * SAILL - SRIT AI Language Laboratory
 * AI Evaluation Types & State Interfaces
 */

export type ActivityType = 'WORD' | 'PHRASE' | 'SENTENCE' | 'PARAGRAPH';

export type AIProcessingStatus = 'idle' | 'processing' | 'success' | 'failure' | 'retry';

export interface ScoreBreakdown {
  pronunciation: number; // max 25
  wordStress: number; // max 20
  syllables: number; // max 10
  vowels: number; // max 10
  consonants: number; // max 10
  fluency: number; // max 10
  clarity: number; // max 5
  pace: number; // max 5
  confidence: number; // max 3
  naturalness: number; // max 2
}

export interface AIEvaluationResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Improvement';
  scores: ScoreBreakdown;
  strengths: string[];
  improvements: string[];
  practiceWords: string[];
  practiceTime: string;
  motivation: string;
  targetWord?: string;
  activityType?: ActivityType;
  timestamp?: string;
}

export interface EvaluatePronunciationRequest {
  targetWord: string;
  studentAudio: Blob | File;
  activityType?: ActivityType;
  moduleName?: string;
  activityName?: string;
  difficulty?: string;
  language?: string;
}

export interface EvaluatePronunciationResponse {
  status: 'success' | 'error';
  message: string;
  targetWord: string;
  processing: 'completed' | 'failed' | 'pending';
  evaluation?: AIEvaluationResult;
  timestamp?: string;
  error?: string;
}

export interface AttemptRecord {
  attemptNumber: number; // 1, 2, or 3
  timestamp: string;
  result: AIEvaluationResult;
  audioUrl?: string;
}

export interface WordAttemptHistory {
  targetWord: string;
  attempts: AttemptRecord[];
  bestScore: number;
  latestScore: number;
  improvement: number; // latest score - first attempt score
}

export interface AIEvaluationState {
  status: AIProcessingStatus;
  response: EvaluatePronunciationResponse | null;
  errorMessage: string | null;
  estimatedWaitTimeSeconds: number;
}
