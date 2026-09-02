/**
 * SAILL Enterprise AI Platform - AI Logging & Metrics Service
 *
 * Tracks AI request performance, latency, token usage, cost estimates, and error rates.
 * Ensures zero PII or sensitive keys are stored in logs.
 */

import { AILogEntry, AIMetricsSummary, AIRequestType } from './types';
import { logger } from '../../utils/logger';
import { auditLog } from '../AuditLogService';

export class AILoggingService {
  private static instance: AILoggingService;
  private logs: AILogEntry[] = [];
  private maxLogs = 500;

  private constructor() {}

  public static getInstance(): AILoggingService {
    if (!AILoggingService.instance) {
      AILoggingService.instance = new AILoggingService();
    }
    return AILoggingService.instance;
  }

  /**
   * Estimates token count based on string character length (~4 characters per token)
   */
  public estimateTokens(promptText: string = '', responseText: string = '') {
    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);
    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }

  /**
   * Calculates estimated USD cost based on token counts and model pricing
   */
  public calculateCostUSD(model: string, promptTokens: number, completionTokens: number): number {
    const inputRate = 0.000075 / 1000;
    const outputRate = 0.0003 / 1000;
    return Number((promptTokens * inputRate + completionTokens * outputRate).toFixed(6));
  }

  /**
   * Logs an AI execution transaction
   */
  public logExecution(params: {
    requestType: AIRequestType;
    provider: string;
    model: string;
    durationMs: number;
    status: 'SUCCESS' | 'FALLBACK' | 'FAILED';
    promptVersion?: string;
    promptText?: string;
    responseText?: string;
    errorMessage?: string;
    userId?: string;
  }): AILogEntry {
    const {
      requestType,
      provider,
      model,
      durationMs,
      status,
      promptVersion = '1.0.0',
      promptText = '',
      responseText = '',
      errorMessage,
      userId = 'anonymous'
    } = params;

    const tokens = this.estimateTokens(promptText, responseText);
    const cost = this.calculateCostUSD(model, tokens.promptTokens, tokens.completionTokens);

    const logEntry: AILogEntry = {
      id: `ai_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      requestType,
      provider,
      model,
      durationMs,
      status,
      promptVersion,
      estimatedTokens: tokens,
      estimatedCostUSD: cost,
      errorMessage
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Pass to central system logger and audit log
    logger.info('AI', `AI Request [${requestType}] processed via ${provider} in ${durationMs.toFixed(0)}ms (${status})`, {
      provider,
      durationMs,
      status,
      costUSD: cost
    });

    auditLog.record(
      `AI_EXECUTION_${requestType}`,
      'AI_EXECUTION',
      status === 'FAILED' ? 'FAILURE' : 'SUCCESS',
      { id: userId, role: 'STUDENT' },
      {
        provider,
        model,
        durationMs,
        status,
        promptVersion,
        totalTokens: tokens.totalTokens
      }
    );

    return logEntry;
  }

  /**
   * Generates aggregated summary metrics for performance monitoring dashboards
   */
  public getMetricsSummary(): AIMetricsSummary {
    const totalRequests = this.logs.length;
    if (totalRequests === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        fallbackRequests: 0,
        failedRequests: 0,
        averageLatencyMs: 0,
        totalEstimatedTokens: 0,
        totalEstimatedCostUSD: 0,
        providerBreakdown: {}
      };
    }

    let successfulRequests = 0;
    let fallbackRequests = 0;
    let failedRequests = 0;
    let totalLatency = 0;
    let totalEstimatedTokens = 0;
    let totalEstimatedCostUSD = 0;
    const providerBreakdown: Record<string, number> = {};

    this.logs.forEach((entry) => {
      if (entry.status === 'SUCCESS') successfulRequests++;
      else if (entry.status === 'FALLBACK') fallbackRequests++;
      else if (entry.status === 'FAILED') failedRequests++;

      totalLatency += entry.durationMs;
      totalEstimatedTokens += entry.estimatedTokens?.totalTokens || 0;
      totalEstimatedCostUSD += entry.estimatedCostUSD || 0;

      providerBreakdown[entry.provider] = (providerBreakdown[entry.provider] || 0) + 1;
    });

    return {
      totalRequests,
      successfulRequests,
      fallbackRequests,
      failedRequests,
      averageLatencyMs: Math.round(totalLatency / totalRequests),
      totalEstimatedTokens,
      totalEstimatedCostUSD: Number(totalEstimatedCostUSD.toFixed(4)),
      providerBreakdown
    };
  }

  public getRecentLogs(): AILogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const aiLoggingService = AILoggingService.getInstance();
