export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'API' | 'PERFORMANCE' | 'AUDIO' | 'AI' | 'UI' | 'SYSTEM' | 'SECURITY';
  message: string;
  details?: any;
}

class LoggerService {
  private static instance: LoggerService;
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public log(level: LogEntry['level'], category: LogEntry['category'], message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (process.env.NODE_ENV !== 'production') {
      const formatted = `[${entry.category}] ${entry.message}`;
      if (level === 'error') console.error(formatted, details || '');
      else if (level === 'warn') console.warn(formatted, details || '');
      else if (level === 'debug') console.debug(formatted, details || '');
      else console.log(formatted, details || '');
    }
  }

  public info(category: LogEntry['category'], message: string, details?: any) {
    this.log('info', category, message, details);
  }

  public warn(category: LogEntry['category'], message: string, details?: any) {
    this.log('warn', category, message, details);
  }

  public error(category: LogEntry['category'], message: string, details?: any) {
    this.log('error', category, message, details);
  }

  public security(message: string, details?: any) {
    this.log('warn', 'SECURITY', message, details);
  }

  public ai(message: string, details?: any) {
    this.log('info', 'AI', message, details);
  }

  public performance(message: string, durationMs: number) {
    this.log('info', 'PERFORMANCE', `${message} completed in ${durationMs.toFixed(2)}ms`, { durationMs });
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = LoggerService.getInstance();
