import React from 'react';
import { BarChart3, Award, TrendingUp, CheckCircle, ShieldCheck, Target } from 'lucide-react';

export const TechnicalCommunicationAnalytics: React.FC = () => {
  const scores = [
    { name: 'Grammar & Mechanics', score: 9.4, max: 10, color: 'bg-emerald-500' },
    { name: 'Report Structure (IEEE)', score: 9.2, max: 10, color: 'bg-[#D35400]' },
    { name: 'Technical Vocabulary', score: 9.0, max: 10, color: 'bg-[#E67E22]' },
    { name: 'Coherence & Flow', score: 8.8, max: 10, color: 'bg-amber-500' },
    { name: 'Logical Organization', score: 9.5, max: 10, color: 'bg-teal-500' },
    { name: 'Formatting & Captions', score: 9.1, max: 10, color: 'bg-indigo-500' },
    { name: 'Precision & Quantifiers', score: 9.3, max: 10, color: 'bg-blue-500' },
    { name: 'Overall Technical Writing Score', score: 9.2, max: 10, color: 'bg-[#D35400]' }
  ];

  const benchmarks = [
    { mark: '10', label: 'Outstanding', desc: 'Publication-ready engineering rigor & zero error' },
    { mark: '9', label: 'Excellent', desc: 'High technical precision & IEEE formatting compliance' },
    { mark: '8', label: 'Very Good', desc: 'Clear structure with minor vocabulary optimization opportunities' },
    { mark: '7', label: 'Good', desc: 'Satisfies core lab requirements with minor formatting errors' },
    { mark: '6', label: 'Satisfactory', desc: 'Baseline report structure; requires quantitative expansion' },
    { mark: '5', label: 'Needs Improvement', desc: 'Vague non-technical phrasing or missing major sections' },
    { mark: '< 5', label: 'Requires Additional Practice', desc: 'Does not meet minimum R26 laboratory report standards' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 9
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Technical Communication Analytics (SAILL 10-Mark Framework)
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Comprehensive performance evaluation based on the SAILL 10-Mark Assessment Rubric. Monitor your technical writing accuracy, structural coherence, and IEEE formatting mastery.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Progress Bars (7 cols) */}
        <div className="lg:col-span-7 srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E67E22]" />
              <span>SAILL 10-Mark Rubric Visual Breakdown</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Aggregate: 9.2 / 10 (Excellent)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {scores.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
                  <span>{item.name}</span>
                  <span className="font-mono text-[#D35400]">{item.score} / {item.max}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Scale Benchmarks (5 cols) */}
        <div className="lg:col-span-5 srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-2 border-b border-[#FAD7A0] pb-2">
            <Award className="w-4 h-4 text-[#E67E22]" />
            <span>SAILL Performance Scale Benchmarks</span>
          </h3>

          <div className="space-y-2">
            {benchmarks.map((bm) => (
              <div
                key={bm.mark}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-3 transition ${
                  bm.mark === '9'
                    ? 'bg-[#FFF8F0] border-[#D35400] font-bold shadow-2xs'
                    : 'bg-gray-50/50 border-gray-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {bm.mark}
                </div>
                <div className="truncate">
                  <p className="font-bold text-[#D35400] truncate">{bm.label}</p>
                  <p className="text-[10px] text-gray-600 truncate">{bm.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
