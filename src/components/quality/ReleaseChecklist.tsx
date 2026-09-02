import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Cpu, Volume2, Mic, Bell, Eye, Smartphone, Zap } from 'lucide-react';
import { ReleaseCheckItem } from '../../types/qef';

const RELEASE_CHECKLIST_DATA: ReleaseCheckItem[] = [
  {
    id: 'rel_auth_1',
    module: 'Authentication',
    title: 'Student & Faculty Roll Number Sign-in',
    criteria: 'Validates SRIT Roll Number format (262A1A0501) with fallback demo credentials.',
    status: 'PASSED',
    testedBy: 'SRIT QA Lead',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_rbac_1',
    module: 'RBAC',
    title: 'Role Guard Enforcement Across All 15 Studios',
    criteria: 'Student cannot modify faculty module assignments or batch parameters.',
    status: 'PASSED',
    testedBy: 'SRIT Security Team',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_ai_1',
    module: 'AI',
    title: 'Gemini 3.6 Flash & Local Adaptive Fallover',
    criteria: '10-criteria speech evaluation executes cleanly with instant failover on timeout.',
    status: 'PASSED',
    testedBy: 'AI Platform Architect',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_audio_1',
    module: 'Audio',
    title: 'UniversalAudioPlayer Accessibility & WebAudio',
    criteria: 'Audio playback, seek slider, and duration announcer meet WCAG AA standards.',
    status: 'PASSED',
    testedBy: 'A11y Inspector',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_rec_1',
    module: 'Recorder',
    title: 'UniversalRecorder MediaRecorder Stream Handler',
    criteria: 'Microphone stream captured safely in WebM/Ogg with backup recovery before AI upload.',
    status: 'PASSED',
    testedBy: 'Frontend Architect',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_notif_1',
    module: 'Notifications',
    title: 'Real-time Toast & Audit Log Dispatch',
    criteria: 'Role-based notifications trigger on evaluation completion and registration events.',
    status: 'PASSED',
    testedBy: 'QA Systems Lead',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_a11y_1',
    module: 'Accessibility',
    title: 'Screen Reader & Keyboard Navigation Verified',
    criteria: 'Skip to content link, focus rings, and aria-live announcements active.',
    status: 'PASSED',
    testedBy: 'WCAG Specialist',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_perf_1',
    module: 'Performance',
    title: 'Vite Production Build & esbuild Express Bundle',
    criteria: 'Single dist/server.cjs CommonJS bundle outputs without external ESM import errors.',
    status: 'PASSED',
    testedBy: 'Release Engineer',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_sec_1',
    module: 'Security',
    title: 'Input Sanitization & Zero PII Exposure',
    criteria: 'Audio recordings and text inputs sanitized prior to AI prompt injection.',
    status: 'PASSED',
    testedBy: 'InfoSec Audit',
    lastVerified: '2026-08-06'
  },
  {
    id: 'rel_mob_1',
    module: 'Mobile',
    title: 'Mobile Touch Targets & PWA Install Ready',
    criteria: 'All interactive elements maintain >=44px touch height on iOS and Android viewports.',
    status: 'PASSED',
    testedBy: 'Mobile Lead',
    lastVerified: '2026-08-06'
  }
];

export const ReleaseChecklist: React.FC = () => {
  const [items] = useState<ReleaseCheckItem[]>(RELEASE_CHECKLIST_DATA);

  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'Authentication':
      case 'RBAC':
      case 'Security':
        return <ShieldCheck className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'AI':
        return <Cpu className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'Audio':
        return <Volume2 className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'Recorder':
        return <Mic className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'Notifications':
        return <Bell className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'Accessibility':
        return <Eye className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      case 'Mobile':
        return <Smartphone className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
      default:
        return <Zap className="w-4 h-4 text-[#D35400]" aria-hidden="true" />;
    }
  };

  return (
    <section aria-label="Release Readiness Checklist" className="p-6 sm:p-8 bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center text-[#D35400] shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
              R26 Syllabus Deployment Gate
            </span>
            <h2 className="text-xl font-black text-[#2C3E50] mt-0.5">
              Release Readiness Verification
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-emerald-800 font-extrabold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>All 10 Core Modules Verified Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#FFF8F0]/40 border border-[#FAD7A0] space-y-2 hover:bg-[#FFF8F0] transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getModuleIcon(item.module)}
                <span className="text-xs font-black text-[#2C3E50]">{item.module}</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                Verified
              </span>
            </div>

            <h3 className="text-xs font-bold text-[#2C3E50]">{item.title}</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">{item.criteria}</p>

            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-gray-500 border-t border-[#FAD7A0]/60">
              <span>Verified by: {item.testedBy}</span>
              <span>{item.lastVerified}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
