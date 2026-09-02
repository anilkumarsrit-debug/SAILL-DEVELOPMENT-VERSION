export interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  userRole?: string;
  action: string;
  category: 'AUTH' | 'RBAC' | 'SECURITY' | 'DATA_ACCESS' | 'AI_EXECUTION' | 'FILE_UPLOAD';
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details?: Record<string, any>;
}

export class AuditLogService {
  private static instance: AuditLogService;
  private logs: AuditEvent[] = [];
  private maxLogs = 500;

  private constructor() {}

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  public record(
    action: string,
    category: AuditEvent['category'],
    status: AuditEvent['status'],
    userInfo?: { id?: string; role?: string },
    details?: Record<string, any>
  ) {
    // Sanitize details to exclude sensitive keys
    const sanitizedDetails = details ? { ...details } : {};
    delete sanitizedDetails.password;
    delete sanitizedDetails.secret;
    delete sanitizedDetails.token;

    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      userId: userInfo?.id || 'anonymous',
      userRole: userInfo?.role || 'UNKNOWN',
      action,
      category,
      status,
      details: sanitizedDetails
    };

    this.logs.unshift(event);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  public getAuditTrail(): AuditEvent[] {
    return [...this.logs];
  }

  public clearAuditTrail() {
    this.logs = [];
  }
}

export const auditLog = AuditLogService.getInstance();
