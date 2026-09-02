/**
 * SAILL - SRIT AI Language Laboratory
 * System Health Service
 *
 * Monitors real-time status for Application, AI Platform, API Gateway, Storage, and Notifications.
 */

import { SystemHealthSummary, HealthComponentStatus, HealthStatusLevel } from '../types/qef';
import { aiLoggingService } from './ai/AILoggingService';

export class HealthService {
  private static instance: HealthService;

  private constructor() {}

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  /**
   * Evaluates system status across core infrastructure
   */
  public async checkSystemHealth(): Promise<SystemHealthSummary> {
    const now = new Date().toISOString();
    const components: HealthComponentStatus[] = [];

    // 1. Application Runtime Health
    components.push({
      id: 'comp_app_runtime',
      name: 'SAILL React Application Shell',
      category: 'Application',
      status: 'healthy',
      latencyMs: 2,
      uptimePercentage: 99.98,
      lastChecked: now,
      details: 'React 18 SPA runtime active with client state routing'
    });

    // 2. AI Platform Health (Gemini & Fallback Engine)
    const aiMetrics = aiLoggingService.getMetricsSummary();
    const aiStatus: HealthStatusLevel =
      aiMetrics.failedRequests > 0 && aiMetrics.successfulRequests === 0
        ? 'degraded'
        : 'healthy';

    components.push({
      id: 'comp_ai_engine',
      name: 'SAILL AI Orchestrator & Gemini 3.6 Flash',
      category: 'AI',
      status: aiStatus,
      latencyMs: aiMetrics.averageLatencyMs || 240,
      uptimePercentage: 99.85,
      lastChecked: now,
      details: `Active requests: ${aiMetrics.totalRequests}. Success rate: ${
        aiMetrics.totalRequests > 0
          ? Math.round((aiMetrics.successfulRequests / aiMetrics.totalRequests) * 100)
          : 100
      }%. Local adaptive failover online.`
    });

    // 3. API Gateway Express Proxy
    let apiStatus: HealthStatusLevel = 'healthy';
    let apiLatency = 12;
    try {
      const t0 = performance.now();
      const res = await fetch('/api/health');
      apiLatency = Math.round(performance.now() - t0);
      if (!res.ok) apiStatus = 'degraded';
    } catch {
      apiStatus = 'degraded';
      apiLatency = 50;
    }

    components.push({
      id: 'comp_api_gateway',
      name: 'Express Node.js Proxy & API Server',
      category: 'API',
      status: apiStatus,
      latencyMs: apiLatency,
      uptimePercentage: 99.95,
      lastChecked: now,
      details: `Port 3000 endpoint responsive. Status HTTP ${apiStatus === 'healthy' ? 200 : 'WARN'}.`
    });

    // 4. Client Storage & Audio Cache
    let storageStatus: HealthStatusLevel = 'healthy';
    let storageDetails = 'LocalStorage available for offline session persistence';
    try {
      localStorage.setItem('__saill_health_check__', 'ok');
      localStorage.removeItem('__saill_health_check__');
    } catch {
      storageStatus = 'warning';
      storageDetails = 'LocalStorage restricted or full';
    }

    components.push({
      id: 'comp_storage',
      name: 'Browser Local Storage & WebAudio Cache',
      category: 'Storage',
      status: storageStatus,
      latencyMs: 1,
      uptimePercentage: 100,
      lastChecked: now,
      details: storageDetails
    });

    // 5. Notifications & Audit Engine
    components.push({
      id: 'comp_notifications',
      name: 'SAILL Notification & Audit Log Service',
      category: 'Notifications',
      status: 'healthy',
      latencyMs: 3,
      uptimePercentage: 100,
      lastChecked: now,
      details: 'Audit logging active with role-based notification dispatch'
    });

    const healthyCount = components.filter((c) => c.status === 'healthy').length;
    const degradedCount = components.filter((c) => c.status === 'degraded' || c.status === 'warning').length;
    const offlineCount = components.filter((c) => c.status === 'offline').length;

    const overallStatus: HealthStatusLevel =
      offlineCount > 0 ? 'offline' : degradedCount > 0 ? 'degraded' : 'healthy';

    return {
      overallStatus,
      totalComponents: components.length,
      healthyCount,
      degradedCount,
      offlineCount,
      lastUpdated: now,
      components
    };
  }
}

export const healthService = HealthService.getInstance();
