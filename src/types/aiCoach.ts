/**
 * SAILL - SRIT AI Language Laboratory
 * AI Learning Coach & Adaptive Practice Engine Types
 */

import { AIEvaluationResult, WordAttemptHistory, ActivityType } from './aiEvaluation';

export type ProfileClassification = 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement';

export interface LearningProfile {
  pronunciation: ProfileClassification;
  wordStress: ProfileClassification;
  syllableAccuracy: ProfileClassification;
  vowelAccuracy: ProfileClassification;
  consonantAccuracy: ProfileClassification;
  fluency: ProfileClassification;
  clarity: ProfileClassification;
  speakingPace: ProfileClassification;
  confidence: ProfileClassification;
}

export interface TodayLearningPlan {
  practiceFocus: string;
  recommendedRule: string;
  suggestedPracticeWords: string[];
  estimatedPracticeTime: string;
  expectedLearningOutcome: string;
}

export interface AchievementBadge {
  id: string;
  title: string; // e.g., 'Pronunciation Beginner', 'Pronunciation Explorer', 'Pronunciation Expert', 'Accent Master', 'Communication Champion'
  description: string;
  iconName: string;
  unlocked: boolean;
  level: string;
}

export interface AICoachGuidance {
  learningProfile: LearningProfile;
  coachMessage: string;
  strengths: string[];
  weakAreas: string[];
  todayLearningPlan: TodayLearningPlan;
  smartRecommendations: string[];
  estimatedPracticeTime: string;
  motivationalMessage: string;
  suggestedNextActivity: string;
  badges: AchievementBadge[];
  timestamp?: string;
}

export interface AICoachRequest {
  latestResult: AIEvaluationResult;
  history?: WordAttemptHistory;
  activityType?: ActivityType;
  targetText?: string;
  sessionAttemptCount?: number;
}
