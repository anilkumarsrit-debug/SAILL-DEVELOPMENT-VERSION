/**
 * SAILL Enterprise AI Platform - AI Provider Interface
 */

import { AIContext } from '../types';
import { EvaluatePronunciationResponse } from '../../../types/aiEvaluation';
import { AICoachGuidance } from '../../../types/aiCoach';

export interface AIProvider {
  /**
   * Unique provider identifier (e.g., 'gemini', 'openai', 'anthropic', 'local-fallback')
   */
  readonly id: string;

  /**
   * Display name of the provider
   */
  readonly name: string;

  /**
   * Checks if provider is available and ready
   */
  isAvailable(): Promise<boolean>;

  /**
   * Evaluates spoken pronunciation recording
   */
  evaluatePronunciation(context: AIContext, audioBlob?: Blob): Promise<EvaluatePronunciationResponse>;

  /**
   * Generates adaptive AI Coach guidance and daily learning plans
   */
  generateCoachGuidance(context: AIContext): Promise<AICoachGuidance>;

  /**
   * Evaluates general text submissions across all learning studios (JAM, Writing, Interview, etc.)
   */
  evaluateGeneral(coachId: string, studentInput: string, context: AIContext): Promise<any>;
}
