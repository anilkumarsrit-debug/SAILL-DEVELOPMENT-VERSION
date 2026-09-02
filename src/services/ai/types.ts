/**
 * SAILL Enterprise AI Platform - Type Definitions
 */

import { ActivityType, EvaluatePronunciationResponse } from '../../types/aiEvaluation';
import { AICoachGuidance } from '../../types/aiCoach';

export type AIRequestType =
  | 'PRONUNCIATION'
  | 'COACHING'
  | 'SPEAKING'
  | 'LISTENING'
  | 'READING'
  | 'WRITING'
  | 'GRAMMAR'
  | 'INTERVIEW'
  | 'GROUP_DISCUSSION'
  | 'BUSINESS_COMMUNICATION'
  | 'RESUME'
  | 'DEBATE'
  | 'GENERAL';

export interface AIPromptMeta {
  id: string;
  version: string;
  category: AIRequestType;
  description: string;
  updatedAt: string;
}

export interface AIContext {
  requestType: AIRequestType;
  moduleId?: string;
  moduleName?: string;
  activityId?: string;
  activityName?: string;
  activityType?: ActivityType | string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  targetText?: string;
  studentInput?: string;
  attemptNumber?: number;
  history?: any;
  latestResult?: any;
  userRole?: string;
  metadata?: Record<string, any>;
}

export interface AIValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData: any;
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  requestType: AIRequestType;
  provider: string;
  model: string;
  durationMs: number;
  status: 'SUCCESS' | 'FALLBACK' | 'FAILED';
  promptVersion?: string;
  estimatedTokens?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostUSD?: number;
  errorMessage?: string;
}

export interface AIMetricsSummary {
  totalRequests: number;
  successfulRequests: number;
  fallbackRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  totalEstimatedTokens: number;
  totalEstimatedCostUSD: number;
  providerBreakdown: Record<string, number>;
}
