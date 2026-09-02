import React from 'react';
import { BarChart3, Award, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor, getDescriptorColorClass } from '../../../lib/scoring';

export const DebateAnalytics: React.FC = () => {
  const metrics = [
    { label: 'Argument Quality', score: 9.0, max: 10 },
    { label: 'Critical Thinking', score: 8.5, max: 10 },
    { label: 'Evidence Usage', score: 8.0, max: 10 },
    { label: 'Rebuttal Effectiveness', score: 8.5, max: 10 },
    { label: 'Logical Accuracy', score: 9.0, max: 10 },
    { label: 'Language Quality', score: 9.5, max: 10 },
    { label: 'Confidence', score: 8.0, max: 10 },
    { label: 'Overall Debate Score', score: 8.8, max: 10 }
  ];

  const overallScore = 9; // 9 / 10
  const descriptor = getPerformanceDescriptor(overallScore);
  const colorClass = getDescriptorColorClass(overallScore);

  const performanceScaleItems = [
    { score: 10, label: 'Outstanding' },
    { score: 9, label: 'Excellent' },
    { score: 8, label: 'Very Good' },
    { score: 7, label: 'Good' },
    { score: 6, label: 'Satisfactory' },
    { score: 5, label: 'Needs Improvement' },
    { score: '< 5', label: 'Requires Additional Practice' }
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
              Module 10 • Section 8
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Debate Performance Analytics & Assessment Framework
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Comprehensive evaluation metrics powered by the SAILL 10-Mark Assessment Scale. Track argument quality, critical thinking, evidence usage, and rebuttal effectiveness.
        </p>
      </div>

      {/* Overall Score Badge Banner */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase text-[#E67E22] tracking-wider">
            SAILL Cumulative Internal Evaluation
          </span>
          <h3 className="text-2xl font-extrabold text-[#D35400] font-heading">
            Debate Master Rating: {formatScore10(overallScore)}
          </h3>
          <p className="text-xs text-[#5D6D7E]">Performance Scale Grade: <strong className="text-[#D35400]">{descriptor}</strong></p>
        </div>

        <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${colorClass}`}>
          Status: {descriptor} (Eligible for Lab Portfolio Distinction)
        </div>
      </div>

      {/* 8 Analytics Metrics Bars Grid */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-sm font-bold text-[#D35400] uppercase tracking-wider font-heading flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#E67E22]" />
          <span>Detailed Competency Metric Breakdown</span>
        </h3>

        <div className="space-y-3">
          {metrics.map((m) => {
            const percentage = (m.score / m.max) * 100;
            return (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2C3E50]">{m.label}</span>
                  <span className="font-mono text-[#D35400] font-bold">{m.score} / 10</span>
                </div>
                <div className="w-full h-2.5 bg-[#FFF8F0] rounded-full overflow-hidden border border-[#FAD7A0]">
                  <div
                    className="h-full bg-[#D35400] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAILL 10-Mark Assessment Scale Legend */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <h3 className="text-xs font-bold text-[#D35400] uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-[#E67E22]" />
          <span>SAILL Official R26 10-Mark Performance Scale Benchmark</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {performanceScaleItems.map((item) => (
            <div key={item.score.toString()} className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-0.5">
              <span className="text-sm font-bold text-[#D35400] block font-mono">{item.score} Marks</span>
              <span className="text-[10px] text-[#2C3E50] block font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
