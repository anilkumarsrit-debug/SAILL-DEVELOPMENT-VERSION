import React from 'react';
import { BarChart2, Award, CheckCircle2, ArrowRight, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface ResumePerformanceAnalyticsProps {
  onCompleteActivity: () => void;
}

export const ResumePerformanceAnalytics: React.FC<ResumePerformanceAnalyticsProps> = ({ onCompleteActivity }) => {
  const scores = [
    { name: 'ATS Compatibility Score', mark: 9.6, maxMark: 10, label: 'Outstanding' },
    { name: 'Grammar & Mechanics', mark: 9.8, maxMark: 10, label: 'Outstanding' },
    { name: 'Keyword Optimization', mark: 9.2, maxMark: 10, label: 'Excellent' },
    { name: 'Layout Formatting & Margins', mark: 9.5, maxMark: 10, label: 'Outstanding' },
    { name: 'Professional Vocabulary & Verbs', mark: 9.4, maxMark: 10, label: 'Excellent' }
  ];

  const overallMark = 9.5;

  const performanceScale = [
    { range: '10', label: 'Outstanding' },
    { range: '9', label: 'Excellent' },
    { range: '8', label: 'Very Good' },
    { range: '7', label: 'Good' },
    { range: '6', label: 'Satisfactory' },
    { range: '5', label: 'Needs Improvement' },
    { range: '<5', label: 'Requires Additional Practice' }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 9
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#D35400]" />
            9. Resume Performance Analytics & Rubric Marks
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Detailed performance breakdown evaluated on the SAILL R26 10-Mark Assessment Rubric.
          </p>
        </div>

        {/* Top Overall Score Card */}
        <div className="p-6 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded-md border border-[#FAD7A0]">
              Overall Evaluation Grade
            </span>
            <h3 className="text-xl font-black text-[#2C3E50] mt-1">
              9.5 / 10 - Outstanding Performance
            </h3>
            <p className="text-xs text-[#5D6D7E] mt-0.5">
              Your resume meets all corporate ATS formatting benchmarks and corporate placement standards.
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border-2 border-[#D35400] text-center shrink-0">
            <span className="text-[10px] font-bold uppercase text-[#D35400] block">Overall Score</span>
            <span className="text-3xl font-black text-[#2C3E50]">{overallMark}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">10 Marks Max</span>
          </div>
        </div>

        {/* 5 Progress Bars */}
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          <h4 className="text-sm font-extrabold text-[#2C3E50]">Core Parameter Marks Breakdown:</h4>

          <div className="space-y-3">
            {scores.map((sc, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#2C3E50]">
                  <span>{sc.name}</span>
                  <span className="font-mono text-[#D35400]">{sc.mark} / {sc.maxMark} Marks ({sc.label})</span>
                </div>
                <div className="w-full h-3 bg-white border border-[#FAD7A0] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-full transition-all duration-500"
                    style={{ width: `${(sc.mark / sc.maxMark) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official SAILL R26 Assessment Scale Table */}
        <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-[#2C3E50] uppercase">
            Official R26 Performance Scale Reference (10 Marks Max):
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {performanceScale.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center text-xs ${
                  item.range === '10' || item.range === '9'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white border-[#FAD7A0] text-[#2C3E50]'
                }`}
              >
                <span className="text-sm font-black block">{item.range}</span>
                <span className="text-[10px] block mt-0.5">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 10: Reflection Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
