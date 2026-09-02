import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Server,
  Database,
  Bell,
  Monitor,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { SystemHealthSummary, HealthComponentStatus } from '../../types/qef';
import { healthService } from '../../services/HealthService';

export const SystemHealth: React.FC = () => {
  const [summary, setSummary] = useState<SystemHealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await healthService.checkSystemHealth();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Application':
        return <Monitor className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
      case 'AI':
        return <Cpu className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
      case 'API':
        return <Server className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
      case 'Storage':
        return <Database className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
      case 'Notifications':
        return <Bell className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
      default:
        return <Activity className="w-5 h-5 text-[#D35400]" aria-hidden="true" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Healthy
          </span>
        );
      case 'degraded':
      case 'warning':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            Degraded
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
            Offline
          </span>
        );
    }
  };

  return (
    <section aria-label="SAILL System Health Dashboard" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center text-[#D35400] shrink-0">
              <Activity className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
                Telemetry & System Health
              </span>
              <h2 className="text-xl font-black text-[#2C3E50] mt-0.5">
                Infrastructure Health Indicators
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchHealth}
              disabled={loading}
              aria-label="Refresh system health metrics"
              className="px-4 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/50 border border-[#FAD7A0] text-[#D35400] font-extrabold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] min-h-[42px]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Overall Status Box */}
        {summary && (
          <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#FAD7A0] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] font-bold text-[#5D6D7E] uppercase tracking-wider">
                System Status
              </div>
              <div className="mt-1 font-black text-sm text-[#2C3E50]">
                {summary.overallStatus.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#5D6D7E] uppercase tracking-wider">
                Total Services
              </div>
              <div className="mt-1 font-mono font-black text-base text-[#2C3E50]">
                {summary.totalComponents} Active
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#5D6D7E] uppercase tracking-wider">
                Healthy Services
              </div>
              <div className="mt-1 font-mono font-black text-base text-emerald-700">
                {summary.healthyCount} / {summary.totalComponents}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#5D6D7E] uppercase tracking-wider">
                Last Evaluated
              </div>
              <div className="mt-1 font-mono text-xs text-[#2C3E50] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D35400]" aria-hidden="true" />
                <span>{new Date(summary.lastUpdated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary?.components.map((comp: HealthComponentStatus) => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-3 hover:border-[#D35400] transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center shrink-0">
                  {getCategoryIcon(comp.category)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#D35400] uppercase">
                    {comp.category}
                  </span>
                  <h3 className="text-xs font-black text-[#2C3E50]">{comp.name}</h3>
                </div>
              </div>
              {getStatusBadge(comp.status)}
            </div>

            <p className="text-xs text-[#5D6D7E] leading-relaxed">{comp.details}</p>

            <div className="pt-2 border-t border-[#FAD7A0]/60 flex items-center justify-between text-[11px] font-mono text-[#2C3E50]">
              <span>Latency: {comp.latencyMs}ms</span>
              <span>Uptime: {comp.uptimePercentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
