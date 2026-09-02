/**
 * SAILL Enterprise AI Platform - Gemini AI Provider
 *
 * Primary AI Provider implementation powered by Google Gemini (gemini-3.6-flash).
 * Routes requests securely via backend proxy endpoints with structured response validation.
 */

import { AIProvider } from './AIProvider';
import { AIContext } from '../types';
import { EvaluatePronunciationResponse } from '../../../types/aiEvaluation';
import { AICoachGuidance } from '../../../types/aiCoach';
import { ResponseValidator } from '../ResponseValidator';

export class GeminiProvider implements AIProvider {
  public readonly id = 'gemini';
  public readonly name = 'Google Gemini 3.6 Flash';

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      return res.ok;
    } catch {
      return false;
    }
  }

  public async evaluatePronunciation(
    context: AIContext,
    audioBlob?: Blob
  ): Promise<EvaluatePronunciationResponse> {
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Missing or empty audio recording file.');
    }

    const formData = new FormData();
    formData.append('targetWord', context.targetText || 'Communication');
    formData.append('studentAudio', audioBlob, `recording_${Date.now()}.webm`);
    formData.append('activityType', context.activityType || 'WORD');
    formData.append('moduleName', context.moduleName || 'Accent & Word Stress Studio');
    formData.append('activityName', context.activityName || 'Guided Practice');
    formData.append('difficulty', context.difficulty || 'Intermediate');
    formData.append('language', 'English');

    const response = await fetch('/api/ai/evaluate-pronunciation', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Gemini evaluation failed with status ${response.status}`);
    }

    const data = await response.json();
    const evaluationRaw = data.evaluation || data;
    const validated = ResponseValidator.validatePronunciationResponse(evaluationRaw);

    return {
      ...validated.sanitizedData,
      targetWord: context.targetText || 'Communication',
      activityType: context.activityType as any,
      timestamp: new Date().toISOString()
    };
  }

  public async generateCoachGuidance(context: AIContext): Promise<AICoachGuidance> {
    const response = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latestResult: context.latestResult,
        history: context.history,
        activityType: context.activityType,
        targetText: context.targetText
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini coach guidance failed with status ${response.status}`);
    }

    const data = await response.json();
    const guidanceRaw = data.guidance || data;
    const validated = ResponseValidator.validateCoachGuidanceResponse(guidanceRaw);

    return {
      ...validated.sanitizedData,
      timestamp: new Date().toISOString()
    };
  }

  public async evaluateGeneral(
    coachId: string,
    studentInput: string,
    context: AIContext
  ): Promise<any> {
    const response = await fetch('/api/ai/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coachId,
        studentInput,
        contextData: context
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini general evaluation failed with status ${response.status}`);
    }

    const data = await response.json();
    const validated = ResponseValidator.validateGeneralEvaluationResponse(data);
    return validated.sanitizedData;
  }
}
