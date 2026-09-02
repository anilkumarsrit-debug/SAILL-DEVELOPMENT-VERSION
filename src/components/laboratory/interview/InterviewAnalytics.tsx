import React from 'react';
import { Award, BarChart2, CheckCircle2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface InterviewAnalyticsProps {
  averageScore10?: number;
}

export const InterviewAnalytics: React.FC<InterviewAnalyticsProps> = ({ averageScore10 = 9.2 }) => {
  const metrics = [
    { label: 'Content & Relevance', score: 9.4, color: 'bg-[#D35400]', percent: 94 },
    { label: 'Grammatical Accuracy', score: 9.5, color: 'bg-emerald-600', percent: 95 },
    { label: 'Professional Tone', score: 9.2, color: 'bg-indigo-600', percent: 92 },
    { label: 'Speech Fluency & WPM', score: 8.9, color: 'bg-amber-600', percent: 89 },
    { label: 'Confidence & Assertiveness', score: 9.3, color: 'bg-purple-600', percent: 93 },
    { label: 'STAR Structure Alignment', score: 9.5, color: 'bg-blue-600', percent: 95 }
  ];

  const recentSessions = [
    { date: 'Today', type: 'AI Mock Interview (Software Engineer Trainee)', score: 9.3, status: 'Completed' },
    { date: 'Yesterday', type: 'STAR Workshop Scenario #1', score: 9.5, status: 'Completed' },
    { date: '3 days ago', type: 'HR Round Simulation Question Bank', score: 9.0, status: 'Completed' },
    { date: '5 days ago', type: 'Voice Parameter Diagnostic', score: 9.1, status: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 7
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#D35400]" />
              7. Interview Performance Analytics & SAILL Scorecard
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Aggregated 6-parameter performance analytics evaluating content relevance, STAR organization, grammar, tone, fluency, and confidence.
            </p>
          </div>

          <div className="bg-[#2C3E50] text-white px-4 py-2.5 rounded-2xl border-2 border-[#D35400] flex items-center gap-3">
            <Award className="w-8 h-8 text-[#FAD7A0]" />
            <div>
              <span className="text-[10px] text-gray-300 font-bold uppercase block">Overall SAILL Score</span>
              <span className="text-xl font-black text-[#FAD7A0]">{averageScore10.toFixed(1)} / 10 Marks</span>
            </div>
          </div>
        </div>

        {/* 6-Axis Metric Progress Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#D35400]" /> 6-Parameter Performance Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#2C3E50]">
                  <span>{m.label}</span>
                  <span className="text-[#D35400]">{m.score} / 10 Marks</span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-500`}
                    style={{ width: `${m.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Sessions History Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D35400]" /> Recent Practice Session Logs
          </h3>

          <div className="border border-[#FAD7A0] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-[#2C3E50]">
              <thead className="bg-[#2C3E50] text-[#FAD7A0] font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Activity Session</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAD7A0] bg-white">
                {recentSessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#FFF8F0]">
                    <td className="p-3 font-medium text-[#5D6D7E]">{s.date}</td>
                    <td className="p-3 font-bold">{s.type}</td>
                    <td className="p-3 font-black text-[#D35400]">{s.score} / 10</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
