/**
 * SAILL Enterprise AI Platform - Central Configuration
 */

export interface AIModelConfig {
  modelName: string;
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  timeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
}

export interface AIProviderConfig {
  primaryProvider: string; // 'gemini' | 'openai' | 'anthropic' | 'local'
  fallbackProvider: string;
  enableFallback: boolean;
  maxConcurrentRequests: number;
}

export interface AICostRates {
  inputTokenCostPer1k: number; // USD per 1K input tokens
  outputTokenCostPer1k: number; // USD per 1K output tokens
}

export interface AIPlatformConfig {
  version: string;
  environment: string;
  modelConfig: AIModelConfig;
  providerConfig: AIProviderConfig;
  costRates: Record<string, AICostRates>;
}

export const defaultAIConfig: AIPlatformConfig = {
  version: '1.0.0-enterprise',
  environment: process.env.NODE_ENV || 'development',
  modelConfig: {
    modelName: 'gemini-3.6-flash',
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 2048,
    timeoutMs: 30000,
    maxRetries: 2,
    retryDelayMs: 1000
  },
  providerConfig: {
    primaryProvider: 'gemini',
    fallbackProvider: 'rule-based-local',
    enableFallback: true,
    maxConcurrentRequests: 5
  },
  costRates: {
    'gemini-3.6-flash': {
      inputTokenCostPer1k: 0.000075,
      outputTokenCostPer1k: 0.0003
    },
    'gemini-2.5-flash': {
      inputTokenCostPer1k: 0.000075,
      outputTokenCostPer1k: 0.0003
    }
  }
};
