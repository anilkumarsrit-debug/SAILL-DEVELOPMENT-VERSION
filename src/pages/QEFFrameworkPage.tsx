import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Award } from 'lucide-react';
import { QualityChecklist } from '../components/quality/QualityChecklist';
import { ReleaseChecklist } from '../components/quality/ReleaseChecklist';
import { ProductionCertificationPage } from './ProductionCertificationPage';

export const QEFFrameworkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qef' | 'release' | 'production'>('production');

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50] text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D35400] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                SRIT QA Engineering Framework
              </span>
              <span className="text-[10px] text-[#FAD7A0] font-mono font-bold">SAILL R26 Release Candidate 1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quality Assurance & Production Certification
            </h1>
            <p className="text-xs text-[#FAD7A0]/90 max-w-2xl">
              Verification matrix for UI, AI resilience, accessibility, security, and enterprise deployment readiness.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-2 bg-[#1A252F] p-1.5 rounded-2xl border border-white/10 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('production')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'production'
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#FAD7A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>V1.0 RC1 Certification</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qef')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'qef'
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#FAD7A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCheck className="w-4 h-4" aria-hidden="true" />
              <span>QEF Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('release')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'release'
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#FAD7A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Release Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'production' ? (
        <ProductionCertificationPage />
      ) : activeTab === 'qef' ? (
        <QualityChecklist />
      ) : (
        <ReleaseChecklist />
      )}
    </div>
  );
};
