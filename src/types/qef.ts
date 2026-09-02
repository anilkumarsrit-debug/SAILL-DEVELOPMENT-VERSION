/**
 * SAILL - SRIT AI Language Laboratory
 * Quality Engineering Framework (QEF) & System Health Types
 */

export type HealthStatusLevel = 'healthy' | 'degraded' | 'warning' | 'offline';

export interface HealthComponentStatus {
  id: string;
  name: string;
  category: 'Application' | 'AI' | 'API' | 'Storage' | 'Notifications';
  status: HealthStatusLevel;
  latencyMs?: number;
  uptimePercentage: number;
  lastChecked: string;
  details: string;
}

export interface SystemHealthSummary {
  overallStatus: HealthStatusLevel;
  totalComponents: number;
  healthyCount: number;
  degradedCount: number;
  offlineCount: number;
  lastUpdated: string;
  components: HealthComponentStatus[];
}

export type QualitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type QualityCheckStatus = 'PASSED' | 'FAILED' | 'WARNING' | 'PENDING';

export interface QualityCheckItem {
  id: string;
  category: 'UI' | 'Functionality' | 'AI' | 'Security' | 'Accessibility' | 'Performance';
  title: string;
  description: string;
  severity: QualitySeverity;
  status: QualityCheckStatus;
  notes?: string;
}

export interface ReleaseCheckItem {
  id: string;
  module:
    | 'Authentication'
    | 'RBAC'
    | 'AI'
    | 'Audio'
    | 'Recorder'
    | 'Notifications'
    | 'Accessibility'
    | 'Performance'
    | 'Security'
    | 'Mobile';
  title: string;
  criteria: string;
  status: QualityCheckStatus;
  testedBy?: string;
  lastVerified?: string;
}
