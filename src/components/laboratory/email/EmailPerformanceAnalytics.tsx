import React from 'react';
import { BarChart2, Award, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailPerformanceAnalyticsProps {
  onCompleteActivity: () => void;
}

export const EmailPerformanceAnalytics: React.FC<EmailPerformanceAnalyticsProps> = ({ onCompleteActivity }) => {
  const metrics = [
    { label: 'Grammar & Syntax', score: 9.2, max: 10, grade: 'Excellent', color: 'bg-[#D35400]' },
    { label: 'Vocabulary & Diction', score: 8.8, max: 10, grade: 'Very Good', color: 'bg-[#E67E22]' },
    { label: 'Professional Tone', score: 9.5, max: 10, grade: 'Outstanding', color: 'bg-[#D35400]' },
    { label: 'Formatting & Layout', score: 9.0, max: 10, grade: 'Excellent', color: 'bg-[#2C3E50]' },
    { label: 'Organization & Flow', score: 8.9, max: 10, grade: 'Very Good', color: 'bg-[#E67E22]' },
    { label: 'Digital Netiquette', score: 9.8, max: 10, grade: 'Outstanding', color: 'bg-[#D35400]' },
    { label: 'Subject Line Quality', score: 9.4, max: 10, grade: 'Outstanding', color: 'bg-[#2C3E50]' }
  ];

  const overallScore = 9.2;

  const performanceScale = [
    { mark: '10 Marks', label: 'Outstanding', range: '9.6 - 10.0' },
    { mark: '9 Marks', label: 'Excellent', range: '8.6 - 9.5' },
    { mark: '8 Marks', label: 'Very Good', range: '7.6 - 8.5' },
    { mark: '7 Marks', label: 'Good', range: '6.6 - 7.5' },
    { mark: '6 Marks', label: 'Satisfactory', range: '5.6 - 6.5' },
    { mark: '5 Marks', label: 'Needs Improvement', range: '4.6 - 5.5' },
    { mark: '< 5 Marks', label: 'Requires Additional Practice', range: '0.0 - 4.5' }
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
            9. Email Performance Analytics & Rubric Scoring
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Quantitative assessment breakdown based on the SAILL 10-Mark Rubric Scale.
          </p>
        </div>

        {/* Overall Score Badge Banner */}
        <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-extrabold uppercase text-[#D35400] tracking-wider">
              Cumulative Module 7 Grade
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-4xl font-black text-[#2C3E50]">{overallScore}</span>
              <span className="text-sm font-bold text-[#5D6D7E]">/ 10 Marks</span>
              <span className="bg-[#D35400] text-white text-xs font-black px-3 py-1 rounded-full uppercase ml-2">
                EXCELLENT
              </span>
            </div>
            <p className="text-xs text-[#5D6D7E]">
              Demonstrates high corporate email readiness across academic, workplace, and complaint scenarios.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] flex items-center gap-3 shrink-0">
            <Award className="w-8 h-8 text-[#D35400]" />
            <div>
              <span className="text-xs font-extrabold text-[#2C3E50] block">SAILL Badge Unlocked</span>
              <span className="text-[11px] text-[#5D6D7E]">Corporate Communicator</span>
            </div>
          </div>
        </div>

        {/* Analytics Visual Bars */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#E67E22]" /> Metric Score Breakdown:
          </h3>

          <div className="space-y-3">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2C3E50]">{m.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] font-bold text-[#D35400] uppercase bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#FAD7A0]">
                      {m.grade}
                    </span>
                    <span className="font-black text-[#2C3E50]">{m.score} / {m.max}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${m.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(m.score / m.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAILL 10-Mark Rubric Scale */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D35400]" /> Official SAILL Assessment Scale (Max 10 Marks):
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {performanceScale.map((sc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  sc.label === 'Excellent'
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                    : 'bg-white border-[#FAD7A0] text-[#2C3E50]'
                }`}
              >
                <span className="text-xs font-black block">{sc.mark}</span>
                <span className="text-[10px] font-extrabold block">{sc.label}</span>
                <span className="text-[9px] opacity-80 block font-mono">{sc.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Log your personal learning insights in Section 10 (Reflection Journal).
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Reflection Journal <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
