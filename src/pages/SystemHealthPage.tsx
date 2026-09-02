import React from 'react';
import { Activity } from 'lucide-react';
import { SystemHealth } from '../components/quality/SystemHealth';

export const SystemHealthPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50] text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D35400] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
            Platform Operations
          </span>
          <span className="text-[10px] text-[#FAD7A0] font-mono font-bold">SAILL Real-time Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
          <Activity className="w-7 h-7 text-[#D35400]" aria-hidden="true" />
          <span>System Health & Telemetry</span>
        </h1>
        <p className="text-xs text-[#FAD7A0]/90 max-w-2xl">
          Live monitoring indicators for Application Shell, Gemini AI Orchestrator, Express API Server, LocalStorage, and Notification Dispatcher.
        </p>
      </div>

      <SystemHealth />
    </div>
  );
};
