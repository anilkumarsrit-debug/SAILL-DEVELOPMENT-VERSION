/**
 * SAILL Enterprise AI Platform - AI Orchestrator
 *
 * Primary entry point for all AI capabilities in SAILL.
 * Orchestrates request queueing, provider routing, context building, prompt management,
 * response validation, error recovery, and transaction logging.
 */

import { aiRequestManager } from './AIRequestManager';
import { providerRegistry } from './providers/ProviderRegistry';
import { promptManager } from './PromptManager';
import { AIContextManager, CreateContextOptions } from './AIContextManager';
import { ResponseValidator } from './ResponseValidator';
import { aiLoggingService } from './AILoggingService';
import { defaultAIConfig } from './aiConfig';
import { EvaluatePronunciationResponse } from '../../types/aiEvaluation';
import { AICoachGuidance } from '../../types/aiCoach';

export class AIOrchestrator {
  private static instance: AIOrchestrator;

  private constructor() {}

  public static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  /**
   * Evaluates spoken audio for pronunciation studio
   */
  public async evaluatePronunciation(
    options: CreateContextOptions,
    audioBlob: Blob
  ): Promise<EvaluatePronunciationResponse> {
    const startTime = performance.now();
    const context = AIContextManager.createContext({ ...options, requestType: 'PRONUNCIATION' });
    const promptDef = promptManager.getPromptByCategory('PRONUNCIATION');
    const requestKey = `pron_eval_${context.targetText}_${audioBlob.size}_${Date.now()}`;

    return aiRequestManager.executeRequest<EvaluatePronunciationResponse>(
      requestKey,
      async () => {
        const primaryProvider = providerRegistry.getPrimaryProvider();
        let result: EvaluatePronunciationResponse;
        let usedProvider = primaryProvider.id;
        let isFallback = false;

        try {
          result = await primaryProvider.evaluatePronunciation(context, audioBlob);
        } catch (primaryErr) {
          console.warn(`Primary AI provider (${primaryProvider.name}) failed, executing automatic failover:`, primaryErr);
          const fallbackProvider = providerRegistry.getFallbackProvider();
          usedProvider = fallbackProvider.id;
          isFallback = true;
          result = await fallbackProvider.evaluatePronunciation(context, audioBlob);
        }

        const durationMs = performance.now() - startTime;
        aiLoggingService.logExecution({
          requestType: 'PRONUNCIATION',
          provider: usedProvider,
          model: defaultAIConfig.modelConfig.modelName,
          durationMs,
          status: isFallback ? 'FALLBACK' : 'SUCCESS',
          promptVersion: promptDef.meta.version,
          promptText: context.targetText,
          responseText: JSON.stringify(result)
        });

        return result;
      },
      {
        timeoutMs: defaultAIConfig.modelConfig.timeoutMs,
        maxRetries: defaultAIConfig.modelConfig.maxRetries,
        retryDelayMs: defaultAIConfig.modelConfig.retryDelayMs
      }
    );
  }

  /**
   * Generates adaptive guidance for the AI Coach
   */
  public async generateCoachGuidance(options: CreateContextOptions): Promise<AICoachGuidance> {
    const startTime = performance.now();
    const context = AIContextManager.createContext({ ...options, requestType: 'COACHING' });
    const promptDef = promptManager.getPromptByCategory('COACHING');
    const requestKey = `coach_guidance_${context.targetText}_${Date.now()}`;

    return aiRequestManager.executeRequest<AICoachGuidance>(
      requestKey,
      async () => {
        const primaryProvider = providerRegistry.getPrimaryProvider();
        let result: AICoachGuidance;
        let usedProvider = primaryProvider.id;
        let isFallback = false;

        try {
          result = await primaryProvider.generateCoachGuidance(context);
        } catch (primaryErr) {
          console.warn(`Primary AI Coach provider (${primaryProvider.name}) failed, executing automatic failover:`, primaryErr);
          const fallbackProvider = providerRegistry.getFallbackProvider();
          usedProvider = fallbackProvider.id;
          isFallback = true;
          result = await fallbackProvider.generateCoachGuidance(context);
        }

        const durationMs = performance.now() - startTime;
        aiLoggingService.logExecution({
          requestType: 'COACHING',
          provider: usedProvider,
          model: defaultAIConfig.modelConfig.modelName,
          durationMs,
          status: isFallback ? 'FALLBACK' : 'SUCCESS',
          promptVersion: promptDef.meta.version,
          promptText: context.targetText,
          responseText: JSON.stringify(result)
        });

        return result;
      },
      {
        timeoutMs: defaultAIConfig.modelConfig.timeoutMs,
        maxRetries: defaultAIConfig.modelConfig.maxRetries
      }
    );
  }

  /**
   * Evaluates text submissions across general studio modules (JAM, Writing, Interview, etc.)
   */
  public async evaluateGeneral(
    coachId: string,
    studentInput: string,
    options: Partial<CreateContextOptions> = {}
  ): Promise<any> {
    const startTime = performance.now();
    const requestType = (coachId.toUpperCase() as any) || 'GENERAL';
    const context = AIContextManager.createContext({
      ...options,
      requestType,
      studentInput
    });
    const promptDef = promptManager.getPromptByCategory(requestType);
    const requestKey = `general_eval_${coachId}_${studentInput.length}_${Date.now()}`;

    return aiRequestManager.executeRequest<any>(
      requestKey,
      async () => {
        const primaryProvider = providerRegistry.getPrimaryProvider();
        let result: any;
        let usedProvider = primaryProvider.id;
        let isFallback = false;

        try {
          result = await primaryProvider.evaluateGeneral(coachId, studentInput, context);
        } catch (primaryErr) {
          console.warn(`Primary AI provider (${primaryProvider.name}) failed for coach ${coachId}, executing automatic failover:`, primaryErr);
          const fallbackProvider = providerRegistry.getFallbackProvider();
          usedProvider = fallbackProvider.id;
          isFallback = true;
          result = await fallbackProvider.evaluateGeneral(coachId, studentInput, context);
        }

        const durationMs = performance.now() - startTime;
        aiLoggingService.logExecution({
          requestType,
          provider: usedProvider,
          model: defaultAIConfig.modelConfig.modelName,
          durationMs,
          status: isFallback ? 'FALLBACK' : 'SUCCESS',
          promptVersion: promptDef.meta.version,
          promptText: studentInput,
          responseText: JSON.stringify(result)
        });

        return result;
      },
      {
        timeoutMs: defaultAIConfig.modelConfig.timeoutMs,
        maxRetries: defaultAIConfig.modelConfig.maxRetries
      }
    );
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
