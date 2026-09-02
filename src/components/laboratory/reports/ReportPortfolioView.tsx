import React from 'react';
import { Award, Star, CheckCircle2, FileCheck, Layers, BookOpen, ShieldCheck, Download } from 'lucide-react';

export const ReportPortfolioView: React.FC = () => {
  const showcaseItems = [
    {
      category: 'Best Laboratory Report',
      title: 'Experiment 04: Verification of Kirchhoff\'s Voltage and Current Laws in DC Circuits',
      score: '9.6 / 10',
      badge: 'IEEE Compliant',
      excerpt: '1. AIM: To experimentally verify KVL and KCL in a two-loop DC circuit.\n2. RESULTS: Verified with maximum error margin of 0.66%. satisfied at Node B.',
      facultyReview: 'Exceptional mathematical rigor and clean observational data tables.'
    },
    {
      category: 'Best Project Report',
      title: 'B.Tech Capstone Project: IoT-Based Smart Grid Energy Monitoring System',
      score: '9.5 / 10',
      badge: 'Capstone Final',
      excerpt: 'ABSTRACT: Modern power distribution networks face energy loss challenges. This paper presents an IoT smart grid telemetry system utilizing ESP32 and MQTT.',
      facultyReview: 'Structured according to IEEE 16-chapter capstone standard.'
    },
    {
      category: 'Best Technical Documentation',
      title: 'RESTful Grid Telemetry API v1 Specification & User Guide',
      score: '9.4 / 10',
      badge: 'SOP Certified',
      excerpt: 'Target Audience: Developers. Endpoints cover /api/v1/sensors telemetry and JWT authentication.',
      facultyReview: 'Clear prerequisite listing and developer-friendly OpenAPI layout.'
    },
    {
      category: 'Best AI Review',
      title: 'LM35 Temperature Sensor Calibration (Side-by-Side Enhanced)',
      score: '9.6 / 10',
      badge: 'AI Verified',
      excerpt: 'Revised from non-technical informal notes to objective 3rd-person passive voice with exact calibration tolerances.',
      facultyReview: 'Demonstrates outstanding progress in passive voice technical communication.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 12
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                Technical Communication Showcase Portfolio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold font-mono">
              R26 Certification Status: VERIFIED
            </span>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          The official technical writing portfolio showcase highlighting top-scoring lab reports, capstone project drafts, technical documentation manuals, and faculty endorsements.
        </p>
      </div>

      {/* 4 Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {showcaseItems.map((item) => (
          <div
            key={item.category}
            className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs font-bold font-mono text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                {item.score}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[#D35400] font-heading leading-snug">{item.title}</h3>

            <p className="text-xs text-[#2C3E50] font-mono bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0]/60 whitespace-pre-line">
              {item.excerpt}
            </p>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-0.5">
              <p className="font-bold flex items-center gap-1 text-[10px] uppercase text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Faculty Endorsement
              </p>
              <p className="font-medium italic text-[11px]">{item.facultyReview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
