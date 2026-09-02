export interface AIRequestOptions {
  requestId?: string;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  onProgress?: (progress: number) => void;
}

export interface AIQueuedTask<T> {
  id: string;
  execute: (signal: AbortSignal) => Promise<T>;
  options: AIRequestOptions;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  retries: number;
}

export class AIRequestManager {
  private static instance: AIRequestManager;
  private queue: AIQueuedTask<any>[] = [];
  private activeRequests: Map<string, { abortController: AbortController }> = new Map();
  private inFlightPromises: Map<string, Promise<any>> = new Map();
  private maxConcurrent = 3;

  private constructor() {}

  public static getInstance(): AIRequestManager {
    if (!AIRequestManager.instance) {
      AIRequestManager.instance = new AIRequestManager();
    }
    return AIRequestManager.instance;
  }

  public async executeRequest<T>(
    requestKey: string,
    requestFn: (signal: AbortSignal) => Promise<T>,
    options: AIRequestOptions = {}
  ): Promise<T> {
    const { timeoutMs = 30000, maxRetries = 2, retryDelayMs = 1000 } = options;

    // Deduplicate in-flight duplicate requests
    if (this.inFlightPromises.has(requestKey)) {
      return this.inFlightPromises.get(requestKey) as Promise<T>;
    }

    const promise = new Promise<T>((resolve, reject) => {
      const task: AIQueuedTask<T> = {
        id: requestKey,
        execute: requestFn,
        options: { timeoutMs, maxRetries, retryDelayMs, ...options },
        resolve,
        reject,
        retries: 0
      };

      this.queue.push(task);
      this.processQueue();
    }).finally(() => {
      this.inFlightPromises.delete(requestKey);
    });

    this.inFlightPromises.set(requestKey, promise);
    return promise;
  }

  private async processQueue() {
    if (this.activeRequests.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    const abortController = new AbortController();
    this.activeRequests.set(task.id, { abortController });

    const timeoutId = setTimeout(() => {
      abortController.abort(new Error(`AI Request timed out after ${task.options.timeoutMs}ms`));
    }, task.options.timeoutMs);

    try {
      const result = await task.execute(abortController.signal);
      clearTimeout(timeoutId);
      this.activeRequests.delete(task.id);
      task.resolve(result);
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.activeRequests.delete(task.id);

      if (
        task.retries < (task.options.maxRetries || 2) &&
        !abortController.signal.aborted
      ) {
        task.retries += 1;
        const delay = (task.options.retryDelayMs || 1000) * Math.pow(2, task.retries - 1);
        setTimeout(() => {
          this.queue.push(task);
          this.processQueue();
        }, delay);
      } else {
        task.reject(error);
      }
    } finally {
      this.processQueue();
    }
  }

  public cancelRequest(requestKey: string) {
    const active = this.activeRequests.get(requestKey);
    if (active) {
      active.abortController.abort(new Error('AI Request explicitly cancelled by user'));
      this.activeRequests.delete(requestKey);
    }
    this.queue = this.queue.filter((t) => t.id !== requestKey);
    this.inFlightPromises.delete(requestKey);
  }

  public cancelAll() {
    this.activeRequests.forEach((active) => {
      active.abortController.abort(new Error('All AI Requests cancelled'));
    });
    this.activeRequests.clear();
    this.queue = [];
    this.inFlightPromises.clear();
  }
}

export const aiRequestManager = AIRequestManager.getInstance();
