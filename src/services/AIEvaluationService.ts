/**
 * SAILL - SRIT AI Language Laboratory
 * Universal AI Evaluation Service
 *
 * Delegate interface routing through the SAILL Enterprise AI Platform Orchestrator.
 */

import {
  EvaluatePronunciationRequest,
  EvaluatePronunciationResponse
} from '../types/aiEvaluation';
import { aiOrchestrator } from './ai/AIOrchestrator';

export class AIEvaluationService {
  /**
   * Universal evaluation method for all SAILL speech modules.
   * Routes through the central AI Platform Orchestrator.
   */
  public static async evaluatePronunciation(
    request: EvaluatePronunciationRequest
  ): Promise<EvaluatePronunciationResponse> {
    const {
      targetWord,
      studentAudio,
      activityType = 'WORD',
      moduleName = 'Accent & Word Stress Studio',
      activityName = 'Level 3 Practice',
      difficulty = 'Intermediate'
    } = request;

    if (!studentAudio || studentAudio.size === 0) {
      throw new Error('Missing or empty audio recording file.');
    }

    if (!targetWord || !targetWord.trim()) {
      throw new Error('Missing target text for pronunciation evaluation.');
    }

    try {
      return await aiOrchestrator.evaluatePronunciation(
        {
          requestType: 'PRONUNCIATION',
          targetText: targetWord,
          activityType,
          moduleName,
          activityName,
          difficulty
        },
        studentAudio
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Gemini AI evaluation timed out. Please check your network and retry.');
      }
      throw new Error(err.message || 'Evaluation unavailable. Please record again.');
    }
  }

  /**
   * Generic evaluation entry point across all SAILL learning studios.
   */
  public static async evaluate(
    type: 'pronunciation' | 'speaking' | 'interview' | 'presentation' | 'gd' | 'listening',
    payload: any
  ): Promise<any> {
    if (type === 'pronunciation') {
      return this.evaluatePronunciation(payload);
    }

    return aiOrchestrator.evaluateGeneral(type, payload?.studentInput || payload?.text || '', payload);
  }
}
