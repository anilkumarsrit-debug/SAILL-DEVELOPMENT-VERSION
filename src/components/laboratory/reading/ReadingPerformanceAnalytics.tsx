import React from 'react';
import { BarChart2, Award, TrendingUp, CheckCircle2, ArrowRight, Gauge, Brain, Target, ShieldCheck } from 'lucide-react';

interface ReadingPerformanceAnalyticsProps {
  onCompleteActivity: () => void;
}

export const ReadingPerformanceAnalytics: React.FC<ReadingPerformanceAnalyticsProps> = ({ onCompleteActivity }) => {
  const overallScore = 9.2;

  const performanceScale = [
    { score: '10', grade: 'Outstanding', min: 9.5, max: 10.0, color: 'bg-emerald-500 text-white' },
    { score: '9', grade: 'Excellent', min: 8.5, max: 9.4, color: 'bg-emerald-600 text-white' },
    { score: '8', grade: 'Very Good', min: 7.5, max: 8.4, color: 'bg-teal-600 text-white' },
    { score: '7', grade: 'Good', min: 6.5, max: 7.4, color: 'bg-blue-600 text-white' },
    { score: '6', grade: 'Satisfactory', min: 5.5, max: 6.4, color: 'bg-amber-500 text-white' },
    { score: '5', grade: 'Needs Improvement', min: 4.5, max: 5.4, color: 'bg-orange-500 text-white' },
    { score: '<5', grade: 'Requires Additional Practice', min: 0.0, max: 4.4, color: 'bg-red-500 text-white' }
  ];

  const parameters = [
    { label: 'Reading Accuracy & Skimming', score: 9.5, desc: 'High precision in isolating central themes rapidly.' },
    { label: 'Comprehension Retention', score: 9.0, desc: 'Strong recall of technical parameters & numbers.' },
    { label: 'Inference Skills & Deduction', score: 9.6, desc: 'Exceptional unstated logical deduction capability.' },
    { label: 'Tone & Bias Identification', score: 8.8, desc: 'Accurate isolation of author rhetoric & stance.' },
    { label: 'Reading Speed (280 WPM)', score: 9.2, desc: 'Exceeds standard first-year engineering baseline.' },
    { label: 'Critical Thinking & Synthesis', score: 9.1, desc: 'Synthesizes contrasting claims effectively.' }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 11
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#D35400]" />
            11. Reading Performance Analytics & SAILL 10-Mark Rubric
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Comprehensive assessment of reading speed, accuracy, inferential depth, tone recognition, and critical reasoning against R26 SAILL standards.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-[#D35400]">Overall R26 Reading Score</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#2C3E50]">{overallScore}</span>
              <span className="text-xs font-bold text-[#5D6D7E]"> / 10 Marks</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md w-fit">
              Grade: Excellent (R26 Tier)
            </span>
          </div>

          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-[#D35400]">Average Reading Speed</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#2C3E50]">280</span>
              <span className="text-xs font-bold text-[#5D6D7E]"> WPM</span>
            </div>
            <span className="text-xs font-bold text-[#5D6D7E]">92% Comprehension Accuracy</span>
          </div>

          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-[#D35400]">Laboratories Completed</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#2C3E50]">10 / 10</span>
              <span className="text-xs font-bold text-[#5D6D7E]"> Sections Completed</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">100% Syllabus Coverage</span>
          </div>
        </div>

        {/* Performance Scale Reference Bar */}
        <div className="p-4 bg-white border border-[#FAD7A0] rounded-2xl space-y-2">
          <span className="text-xs font-extrabold text-[#2C3E50] uppercase block">
            SAILL 10-Mark Assessment Scale Reference:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-[10px] text-center font-bold">
            {performanceScale.map((ps, i) => (
              <div key={i} className={`p-2 rounded-xl ${ps.color} space-y-0.5`}>
                <span className="block font-black text-xs">{ps.score} Marks</span>
                <span className="block opacity-90 text-[9px]">{ps.grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Parameter Progress Breakdown */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-[#2C3E50]">Sub-Skill Competency Breakdown:</h3>

          <div className="space-y-3">
            {parameters.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#FAD7A0] space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#2C3E50]">{p.label}</span>
                  <span className="text-[#D35400] font-black">{p.score} / 10</span>
                </div>
                <div className="w-full h-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#D35400] to-[#E67E22]"
                    style={{ width: `${(p.score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#5D6D7E]">{p.desc}</p>
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
            <span>Proceed to Section 12: Reflection Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
