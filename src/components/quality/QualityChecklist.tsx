import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  Eye,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { QualityCheckItem, QualityCheckStatus, QualitySeverity } from '../../types/qef';

const INITIAL_QUALITY_ITEMS: QualityCheckItem[] = [
  // Accessibility
  {
    id: 'qef_a11y_1',
    category: 'Accessibility',
    title: 'WCAG 2.2 AA Keyboard Navigation',
    description: 'All buttons, forms, audio controls, and studio tabs respond to Tab, Enter, Space, and Esc with visible focus rings.',
    severity: 'CRITICAL',
    status: 'PASSED',
    notes: 'Verified focus rings and Skip to Content link'
  },
  {
    id: 'qef_a11y_2',
    category: 'Accessibility',
    title: 'Screen Reader ARIA Live Announcements',
    description: 'Dynamic announcements triggered for audio playback status, recording start/stop, and error banners.',
    severity: 'CRITICAL',
    status: 'PASSED',
    notes: 'announceToScreenReader live region configured'
  },
  {
    id: 'qef_a11y_3',
    category: 'Accessibility',
    title: 'Contrast Ratio >= 4.5:1',
    description: 'All text elements meet WCAG AA color contrast standards against warm cream and white backgrounds.',
    severity: 'HIGH',
    status: 'PASSED'
  },

  // AI Resilience
  {
    id: 'qef_ai_1',
    category: 'AI',
    title: 'Automatic Gemini to Local Rule Failover',
    description: 'If Gemini 3.6 API is unreachable or times out, local adaptive engine evaluates audio without data loss.',
    severity: 'CRITICAL',
    status: 'PASSED',
    notes: 'ProviderRegistry failover verified'
  },
  {
    id: 'qef_ai_2',
    category: 'AI',
    title: 'Sanitized AI Output Validation',
    description: 'All returned JSON payloads from AI services are validated, clamped, and sanitized prior to UI rendering.',
    severity: 'HIGH',
    status: 'PASSED'
  },

  // UI & Design
  {
    id: 'qef_ui_1',
    category: 'UI',
    title: 'SRIT/SAILL Palette Integrity',
    description: 'Consistent branding using Deep Navy (#2C3E50), Terracotta Rust (#D35400), Warm Cream (#FFF8F0), and Soft Gold (#FAD7A0).',
    severity: 'MEDIUM',
    status: 'PASSED'
  },
  {
    id: 'qef_ui_2',
    category: 'UI',
    title: 'Responsive Mobile Layouts (320px+)',
    description: 'All studios, audio players, recorders, and dashboards render cleanly without horizontal scroll clipping.',
    severity: 'HIGH',
    status: 'PASSED'
  },

  // Security & RBAC
  {
    id: 'qef_sec_1',
    category: 'Security',
    title: 'RBAC Permission Guard Enforcement',
    description: 'Student, Faculty, and HOD roles strictly enforced for batch controls and laboratory record editing.',
    severity: 'CRITICAL',
    status: 'PASSED'
  },
  {
    id: 'qef_sec_2',
    category: 'Security',
    title: 'Zero Secrets Exposed Client-Side',
    description: 'Gemini API keys handled strictly via Express proxy endpoints in server.ts.',
    severity: 'CRITICAL',
    status: 'PASSED'
  },

  // Performance
  {
    id: 'qef_perf_1',
    category: 'Performance',
    title: '3000ms App Cold-Start & Fast HMR',
    description: 'Vite build and esbuild server target optimized for rapid execution and low bundle overhead.',
    severity: 'HIGH',
    status: 'PASSED'
  }
];

export const QualityChecklist: React.FC = () => {
  const [items, setItems] = useState<QualityCheckItem[]>(INITIAL_QUALITY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Accessibility', 'AI', 'UI', 'Security', 'Performance', 'Functionality'];

  const filteredItems = items.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const passedCount = items.filter((i) => i.status === 'PASSED').length;
  const passPercentage = Math.round((passedCount / items.length) * 100);

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: QualityCheckStatus =
            item.status === 'PASSED' ? 'FAILED' : item.status === 'FAILED' ? 'WARNING' : 'PASSED';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <section aria-label="Quality Engineering Framework Checklist" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center text-[#D35400] shrink-0">
              <FileCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
                SRIT Quality Engineering Framework (QEF)
              </span>
              <h2 className="text-xl font-black text-[#2C3E50] mt-0.5">
                Quality Assurance & Audit Matrix
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#FFF8F0] p-3 rounded-2xl border border-[#FAD7A0] shrink-0">
            <div>
              <div className="text-[10px] font-bold text-[#5D6D7E] uppercase tracking-wider">
                QEF Score
              </div>
              <div className="text-2xl font-black text-[#2C3E50] font-mono">{passPercentage}%</div>
            </div>
            <div className="w-24 h-3 bg-[#FAD7A0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D35400] rounded-full transition-all duration-500"
                style={{ width: `${passPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D35400] shrink-0 ml-1 mr-1" aria-hidden="true" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] ${
                selectedCategory === cat
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isPassed = item.status === 'PASSED';
          const isFailed = item.status === 'FAILED';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-3 hover:border-[#D35400] transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400]">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                        item.severity === 'CRITICAL'
                          ? 'bg-rose-50 border border-rose-200 text-rose-700'
                          : 'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#2C3E50]">{item.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  aria-label={`Toggle status for ${item.title}`}
                  className={`p-2 rounded-xl transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] ${
                    isPassed
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                      : isFailed
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>

              <p className="text-xs text-[#5D6D7E] leading-relaxed">{item.description}</p>

              {item.notes && (
                <div className="p-2.5 rounded-xl bg-[#FFF8F0]/80 border border-[#FAD7A0] text-[11px] font-mono text-[#2C3E50] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D35400] shrink-0" aria-hidden="true" />
                  <span>{item.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
