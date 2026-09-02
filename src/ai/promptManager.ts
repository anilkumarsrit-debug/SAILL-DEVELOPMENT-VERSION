/**
 * SAILL - SRIT AI Language Laboratory
 * Centralized AI Prompt Manager & Version Registry
 *
 * @version 2.6.0
 * @description Central registry for system prompts, AI provider configurations,
 * prompt versions, and validation rule definitions.
 */

import { AIPromptDefinition } from '../types';

export const PROMPT_REGISTRY: Record<string, AIPromptDefinition> = {
  SPEECH_EVALUATION_DEFAULT: {
    id: 'SPEECH_EVALUATION_DEFAULT',
    version: '2.6.0',
    moduleCategory: 'phonetics',
    systemPrompt: `You are an expert Phonetics and English Language Professor at Srinivasa Ramanujan Institute of Technology (SRIT). Evaluate the student speech transcript according to R26 English Laboratory standards. Return output as strictly valid JSON.`,
    expectedJsonSchema: {
      score: 'number (0-100)',
      letterGrade: 'string ("A+" | "A" | "B" | "C" | "Needs Work")',
      feedback: {
        keyStrengths: 'string[]',
        areasForImprovement: 'string[]'
      }
    },
    validationRules: [
      (res: any) => typeof res?.score === 'number' && res.score >= 0 && res.score <= 100,
      (res: any) => Boolean(res?.letterGrade),
      (res: any) => Array.isArray(res?.feedback?.keyStrengths)
    ]
  },

  INTERVIEW_MOCK_EVALUATION: {
    id: 'INTERVIEW_MOCK_EVALUATION',
    version: '1.2.0',
    moduleCategory: 'interview',
    systemPrompt: `You are a Senior Corporate Technical Recruiter conducting a mock interview for engineering undergraduates. Evaluate candidate responses for STAR structure and clarity.`,
    expectedJsonSchema: {
      score: 'number (0-100)',
      confidence: 'string',
      technicalClarity: 'string',
      feedback: 'string[]'
    },
    validationRules: [
      (res: any) => typeof res?.score === 'number',
      (res: any) => Boolean(res?.technicalClarity)
    ]
  }
};

export class PromptManager {
  public static getPrompt(promptKey: string): AIPromptDefinition {
    return PROMPT_REGISTRY[promptKey] || PROMPT_REGISTRY.SPEECH_EVALUATION_DEFAULT;
  }

  public static validateResponse(promptKey: string, response: any): boolean {
    const prompt = this.getPrompt(promptKey);
    return prompt.validationRules.every((rule) => {
      try {
        return rule(response);
      } catch {
        return false;
      }
    });
  }
}
