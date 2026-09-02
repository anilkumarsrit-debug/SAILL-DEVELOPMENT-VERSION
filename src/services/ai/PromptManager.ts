/**
 * SAILL Enterprise AI Platform - Prompt Manager
 *
 * Centralized repository for all AI prompts across SAILL learning studios.
 * Organizes system instructions, templates, and prompt metadata with versioning support.
 */

import { AIPromptMeta, AIRequestType, AIContext } from './types';

export interface PromptDefinition {
  meta: AIPromptMeta;
  getSystemInstruction: () => string;
  buildPrompt: (context: AIContext) => string;
}

export class PromptManager {
  private static instance: PromptManager;
  private registry: Map<string, PromptDefinition> = new Map();

  private constructor() {
    this.registerDefaultPrompts();
  }

  public static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager();
    }
    return PromptManager.instance;
  }

  public registerPrompt(def: PromptDefinition) {
    this.registry.set(def.meta.id, def);
  }

  public getPrompt(id: string): PromptDefinition | undefined {
    return this.registry.get(id);
  }

  public getPromptByCategory(category: AIRequestType): PromptDefinition {
    const found = Array.from(this.registry.values()).find((p) => p.meta.category === category);
    if (found) return found;

    // Default to general/grammar prompt if specific category prompt not registered
    return this.registry.get('GENERAL_V1') || this.getDefaultPrompt();
  }

  private getDefaultPrompt(): PromptDefinition {
    return {
      meta: {
        id: 'GENERAL_V1',
        version: '1.0.0',
        category: 'GENERAL',
        description: 'General communication evaluation prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () =>
        'You are the SAILL Communication Coach for First-Year Engineering Students. Provide diagnostic evaluation in JSON.',
      buildPrompt: (ctx) => `Evaluate submission: "${ctx.studentInput || ctx.targetText || ''}"`
    };
  }

  private registerDefaultPrompts() {
    // 1. Pronunciation Prompt
    this.registerPrompt({
      meta: {
        id: 'PRONUNCIATION_V1',
        version: '1.2.0',
        category: 'PRONUNCIATION',
        description: 'Phonetic, stress, MTI and clarity speech evaluation prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL Senior AI Speech & Pronunciation Assessment Engine for SRIT (R26 Syllabus).
CRITICAL GUIDELINES:
1. Evaluate based on INTELLIGIBILITY, CLARITY, CORRECT STRESS, and EFFECTIVE COMMUNICATION.
2. DO NOT penalize for clear Indian English accent variations.
3. Assess against 10 criteria weights (total 100):
   - Pronunciation Accuracy (25), Word Stress (20), Syllable Accuracy (10), Vowel Accuracy (10), Consonant Accuracy (10), Fluency (10), Clarity (5), Speaking Pace (5), Confidence (3), Overall Naturalness (2).
4. Return ONLY valid JSON matching exact schema.`,
      buildPrompt: (ctx) => `Evaluate audio against target text:
TARGET TEXT: "${ctx.targetText || ''}"
ACTIVITY TYPE: ${ctx.activityType || 'WORD'}
MODULE: ${ctx.moduleName || 'Accent & Word Stress Studio'}
DIFFICULTY: ${ctx.difficulty || 'Intermediate'}

Return JSON:
{
  "overallScore": number,
  "grade": string,
  "scores": { "pronunciation": number, "wordStress": number, "syllables": number, "vowels": number, "consonants": number, "fluency": number, "clarity": number, "pace": number, "confidence": number, "naturalness": number },
  "strengths": [string],
  "improvements": [string],
  "practiceWords": [string],
  "practiceTime": string,
  "motivation": string
}`
    });

    // 2. AI Coach Guidance Prompt
    this.registerPrompt({
      meta: {
        id: 'AI_COACH_V1',
        version: '1.1.0',
        category: 'COACHING',
        description: 'Adaptive learning path and daily action plan coach prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL AI Adaptive Learning Coach for First-Year Engineering students.
Analyze overall student attempt metrics and generate an adaptive 10-minute daily practice plan, motivational guidance, and rule recommendations. Return ONLY valid JSON.`,
      buildPrompt: (ctx) => `Latest Evaluation: ${JSON.stringify(ctx.latestResult || {})}
Target Text: "${ctx.targetText || ''}"
Activity Type: ${ctx.activityType || 'WORD'}

Return JSON with learningProfile, coachMessage, strengths, weakAreas, todayLearningPlan, smartRecommendations, estimatedPracticeTime, motivationalMessage, suggestedNextActivity.`
    });

    // 3. Interview Coach Prompt
    this.registerPrompt({
      meta: {
        id: 'INTERVIEW_V1',
        version: '1.0.0',
        category: 'INTERVIEW',
        description: 'STAR framework technical and campus placement interview coach prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL AI Interview Coach for First-Year Engineering students at SRIT.
Evaluate response using the STAR method (Situation, Task, Action, Result) for campus placements.
Return JSON with score (0-100), overallFeedback, strengths, suggestions, guidedImprovement, metrics, and follow-up interview question.`,
      buildPrompt: (ctx) => `Student Interview Response: "${ctx.studentInput || ''}"
Context: ${JSON.stringify(ctx.metadata || {})}`
    });

    // 4. Group Discussion Prompt
    this.registerPrompt({
      meta: {
        id: 'GD_V1',
        version: '1.0.0',
        category: 'GROUP_DISCUSSION',
        description: 'Group discussion leadership, turn-taking, and reasoning evaluation prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL AI Group Discussion Coach for engineering students.
Evaluate turn-taking, active listening, evidence backing, consensus building, and non-confrontational phrasing. Return JSON.`,
      buildPrompt: (ctx) => `Student GD Contribution: "${ctx.studentInput || ''}"`
    });

    // 5. Technical Writing Prompt
    this.registerPrompt({
      meta: {
        id: 'WRITING_V1',
        version: '1.0.0',
        category: 'WRITING',
        description: 'Formal engineering email, technical memo, and report coach prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL AI Writing Coach for engineering students.
Evaluate formal engineering emails, technical memos, and reports for corporate tone, clarity, and paragraph cohesion. Return JSON with correctedText.`,
      buildPrompt: (ctx) => `Student Writing Text: "${ctx.studentInput || ''}"`
    });

    // 6. Resume & ATS Prompt
    this.registerPrompt({
      meta: {
        id: 'RESUME_V1',
        version: '1.0.0',
        category: 'RESUME',
        description: 'ATS resume bullet point formula evaluation prompt',
        updatedAt: '2026-08-06'
      },
      getSystemInstruction: () => `You are the SAILL AI Resume Coach.
Evaluate technical resume bullet points against ATS standards using Action Verb + Technical Context + Quantified Impact formula. Return JSON with enhanced bullet point.`,
      buildPrompt: (ctx) => `Student Resume Bullet: "${ctx.studentInput || ''}"`
    });

    // 7. General Coach Prompt
    this.registerPrompt(this.getDefaultPrompt());
  }
}

export const promptManager = PromptManager.getInstance();
