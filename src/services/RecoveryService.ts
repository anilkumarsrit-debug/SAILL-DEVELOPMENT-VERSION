/**
 * SAILL - SRIT AI Language Laboratory
 * Recovery & Resilience Service
 *
 * Provides automated error handling, exponential backoff retries, audio recording preservation,
 * and user-friendly error recovery guidance for API and AI interactions.
 */

export interface RecoveryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface StoredRecordingBackup {
  id: string;
  timestamp: string;
  targetWord: string;
  blob: Blob;
  audioUrl: string;
  activityType: string;
}

export class RecoveryService {
  private static instance: RecoveryService;
  private recordingBackups: Map<string, StoredRecordingBackup> = new Map();

  private constructor() {}

  public static getInstance(): RecoveryService {
    if (!RecoveryService.instance) {
      RecoveryService.instance = new RecoveryService();
    }
    return RecoveryService.instance;
  }

  /**
   * Executes an async task with automatic retry and backoff
   */
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RecoveryOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? 2;
    const initialDelay = options.initialDelayMs ?? 1000;
    const backoffFactor = options.backoffFactor ?? 2;

    let attempt = 0;
    let delay = initialDelay;

    while (attempt <= maxRetries) {
      try {
        return await operation();
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) {
          throw err;
        }

        if (options.onRetry) {
          options.onRetry(attempt, err);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= backoffFactor;
      }
    }

    throw new Error('Operation failed after retries.');
  }

  /**
   * Safely backs up a student audio recording before AI submission
   * so it is never lost if network or AI service drops.
   */
  public saveRecordingBackup(params: {
    targetWord: string;
    blob: Blob;
    audioUrl: string;
    activityType?: string;
  }): string {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const backup: StoredRecordingBackup = {
      id: backupId,
      timestamp: new Date().toISOString(),
      targetWord: params.targetWord,
      blob: params.blob,
      audioUrl: params.audioUrl,
      activityType: params.activityType || 'WORD'
    };

    this.recordingBackups.set(backupId, backup);
    return backupId;
  }

  /**
   * Retrieves a backed-up recording by ID
   */
  public getRecordingBackup(backupId: string): StoredRecordingBackup | undefined {
    return this.recordingBackups.get(backupId);
  }

  /**
   * Translates technical errors into clear, actionable, user-friendly messages
   */
  public formatUserFriendlyErrorMessage(error: any): {
    title: string;
    message: string;
    actionHint: string;
  } {
    const rawMsg = error?.message?.toLowerCase() || '';

    if (rawMsg.includes('offline') || rawMsg.includes('fetch') || rawMsg.includes('network')) {
      return {
        title: 'Connection Disrupted',
        message: 'Your internet connection was briefly interrupted. Your audio recording has been saved safely.',
        actionHint: 'Check your connection and click "Retry Analysis" without re-recording.'
      };
    }

    if (rawMsg.includes('timeout') || rawMsg.includes('timed out')) {
      return {
        title: 'AI Evaluation Timed Out',
        message: 'The AI service took longer than expected to analyze your recording.',
        actionHint: 'Your audio is preserved. Click "Retry Analysis" or switch to Local Adaptive Mode.'
      };
    }

    if (rawMsg.includes('microphone') || rawMsg.includes('permission')) {
      return {
        title: 'Microphone Permission Required',
        message: 'SAILL requires access to your microphone to record audio for AI evaluation.',
        actionHint: 'Please click the lock icon in your browser address bar and allow microphone permissions.'
      };
    }

    return {
      title: 'Service Temporarily Unavailable',
      message: error?.message || 'An unexpected issue occurred while processing your request.',
      actionHint: 'Your work is saved. Try retrying or navigate to the Dashboard.'
    };
  }
}

export const recoveryService = RecoveryService.getInstance();
