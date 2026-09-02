export * from './pronunciationCoach';
export * from './interviewCoach';
export * from './grammarCoach';
export * from './writingCoach';
export * from './presentationCoach';
export * from './listeningCoach';
export * from './spokenEnglishCoach';
export * from './debateCoach';
export * from './etiquetteBrandingCoach';

// Enterprise AI Platform Exports
export * from './aiConfig';
export * from './types';
export * from './PromptManager';
export * from './AIContextManager';
export * from './ResponseValidator';
export * from './AILoggingService';
export * from './AIRequestManager';
export * from './AIOrchestrator';
export * from './providers/AIProvider';
export * from './providers/GeminiProvider';
export * from './providers/FallbackProvider';
export * from './providers/ProviderRegistry';

export interface AICoachConfig {
  hasApiKey: boolean;
  modelName: string;
  statusMessage: string;
}

export function getAICoachStatus(): AICoachConfig {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
  const apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined) || metaEnv?.VITE_GEMINI_API_KEY;
  const hasKey = !!(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10);

  return {
    hasApiKey: hasKey,
    modelName: 'gemini-3.6-flash',
    statusMessage: hasKey
      ? '⚡ Gemini 3.6 Flash Enterprise AI Platform Active'
      : '💡 SAILL AI Platform Active (Local Adaptive Failover Ready)'
  };
}
