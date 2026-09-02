/**
 * SAILL Enterprise AI Platform - AI Context Manager
 *
 * Constructs and normalizes structured context objects for AI prompt generation and evaluation.
 */

import { AIContext, AIRequestType } from './types';
import { ActivityType } from '../../types/aiEvaluation';

export interface CreateContextOptions {
  requestType: AIRequestType;
  moduleId?: string;
  moduleName?: string;
  activityId?: string;
  activityName?: string;
  activityType?: ActivityType | string;
  difficulty?: string;
  targetText?: string;
  studentInput?: string;
  attemptNumber?: number;
  history?: any;
  latestResult?: any;
  userRole?: string;
  metadata?: Record<string, any>;
}

export class AIContextManager {
  /**
   * Constructs a fully normalized AIContext payload
   */
  public static createContext(options: CreateContextOptions): AIContext {
    const {
      requestType,
      moduleId = 'R26-LAB-DEFAULT',
      moduleName = 'SRIT AI Language Laboratory',
      activityId,
      activityName = 'Guided Practice',
      activityType = 'WORD',
      difficulty = 'Intermediate',
      targetText = '',
      studentInput = '',
      attemptNumber = 1,
      history = null,
      latestResult = null,
      userRole = 'STUDENT',
      metadata = {}
    } = options;

    return {
      requestType,
      moduleId,
      moduleName,
      activityId,
      activityName,
      activityType,
      difficulty,
      targetText: targetText.trim(),
      studentInput: studentInput.trim(),
      attemptNumber: Math.max(1, attemptNumber),
      history,
      latestResult,
      userRole,
      metadata: {
        timestamp: new Date().toISOString(),
        institution: 'SRIT',
        syllabus: 'R26',
        ...metadata
      }
    };
  }

  /**
   * Enriches existing context with historical attempt data for trend analysis
   */
  public static enrichWithHistory(context: AIContext, historyData: any[]): AIContext {
    return {
      ...context,
      history: historyData,
      attemptNumber: (historyData?.length || 0) + 1
    };
  }
}
