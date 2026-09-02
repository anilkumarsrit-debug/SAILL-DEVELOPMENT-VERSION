import React, { useState } from 'react';
import { MOCK_STUDENTS, CO_PO_MAPPING_DATA } from '../data/academicData';
import { KnowledgeCheckAnalytics } from '../components/laboratory/KnowledgeCheckAnalytics';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  BarChart2,
  CheckCircle,
  FileSpreadsheet,
  Target,
  Users,
  ChevronDown,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const AcademicAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'kc' | 'copo'>('analytics');

  // Sorted students for leaderboard
  const sortedStudents = [...MOCK_STUDENTS].sort((a, b) => b.xp - a.xp);
  const topPerformers = sortedStudents.slice(0, 5);
  const weakLearners = MOCK_STUDENTS.filter((s) => s.xp < 600);

  const SKILL_PERFORMANCE = [
    { skill: 'Phonetics & IPA Pronunciation', avgPercent: 88, status: 'Strong' },
    { skill: 'Active Listening & Note-taking', avgPercent: 82, status: 'Good' },
    { skill: '60-Second JAM Speaking', avgPercent: 76, status: 'Needs Drill' },
    { skill: 'Corporate Email & Report Writing', avgPercent: 84, status: 'Good' },
    { skill: 'ATS Engineering Resume & STAR Interview', avgPercent: 91, status: 'Exemplary' }
  ];

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Academic Analytics & CO-PO Attainment Studio
            </h1>
            <p className="text-xs text-gray-600">
              In-depth performance metrics, top/weak learner detection, and NBA/NAAC Course & Program Outcome mapping.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center bg-[#FFF8F0] p-1 border border-[#FAD7A0] rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'analytics'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            Student Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('kc')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'kc'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            Knowledge Check Analytics
          </button>
          <button
            onClick={() => setActiveTab('copo')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'copo'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            CO-PO Attainment Mapping
          </button>
        </div>
      </div>

      {activeTab === 'kc' ? (
        <KnowledgeCheckAnalytics />
      ) : activeTab === 'analytics' ? (
        <div className="space-y-8">
          {/* Top Performers & Weak Learners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers Leaderboard */}
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base font-bold font-serif text-[#2C3E50]">
                    Top Performers Leaderboard
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Top 5 Students
                </span>
              </div>

              <div className="space-y-3">
                {topPerformers.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-gradient-to-r from-amber-50/50 to-white border border-amber-200/80 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        #{idx + 1}
                      </div>
                      <img
                        src={s.avatarUrl}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#FAD7A0]"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-[#2C3E50]">{s.name}</h3>
                        <p className="text-[11px] text-gray-500">
                          Roll: {s.rollNo} • {s.branch}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-[#D35400] block">
                        {s.xp} XP
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Level {s.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Weak Learners for Remedial Focus */}
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold font-serif text-[#2C3E50]">
                    Weak Learners & Remedial Intervention
                  </h2>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  Action Required
                </span>
              </div>

              <div className="space-y-3">
                {weakLearners.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-red-50/60 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatarUrl}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-red-300"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-[#2C3E50]">{s.name}</h3>
                        <p className="text-[11px] text-gray-500">
                          Roll: {s.rollNo} • {s.branch}
                        </p>
                        <p className="text-[10px] text-red-700 font-bold mt-0.5">
                          Target: {s.targetGoal}
                        </p>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition self-start sm:self-auto flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Remedial Plan</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill-wise Performance Bar Metrics */}
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#D35400]" />
                <h2 className="text-base font-bold font-serif text-[#2C3E50]">
                  Skill-wise Competency Averages
                </h2>
              </div>
              <span className="text-xs text-gray-500">Overall Class Performance</span>
            </div>

            <div className="space-y-4">
              {SKILL_PERFORMANCE.map((item) => (
                <div key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2C3E50]">{item.skill}</span>
                    <span className="font-extrabold text-[#D35400]">
                      {item.avgPercent}% ({item.status})
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.avgPercent >= 85
                          ? 'bg-emerald-600'
                          : item.avgPercent >= 75
                          ? 'bg-[#D35400]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.avgPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CO-PO Attainment Matrix */
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider block">
                  National Board of Accreditation (NBA) & NAAC Compliance
                </span>
                <h2 className="text-base font-bold font-serif text-[#2C3E50]">
                  Course Outcome (CO) to Program Outcome (PO) Mapping Matrix
                </h2>
                <p className="text-xs text-gray-500">
                  Articulation Level Scale: 1 = Slight/Low, 2 = Moderate/Medium, 3 = Substantial/High.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#2C3E50] text-white font-bold uppercase text-[11px]">
                    <th className="p-3 text-left border border-gray-400 min-w-[180px]">
                      Course Outcome (CO)
                    </th>
                    {['PO1', 'PO6', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2'].map(
                      (po) => (
                        <th key={po} className="p-2 border border-gray-400">
                          {po}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-semibold">
                  {CO_PO_MAPPING_DATA.map((co) => (
                    <tr key={co.coCode} className="hover:bg-gray-50">
                      <td className="p-3 text-left font-bold text-[#2C3E50] border border-gray-300 bg-gray-50">
                        <div className="text-[#D35400] text-xs">{co.coCode}</div>
                        <div className="text-[11px] text-gray-600 font-normal mt-0.5">
                          {co.coDescription}
                        </div>
                      </td>

                      {['PO1', 'PO6', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'].map((po) => {
                        const val = co.poMappings[po] || '-';
                        return (
                          <td
                            key={po}
                            className={`p-2 border border-gray-300 text-sm font-extrabold ${
                              val === 3
                                ? 'bg-emerald-100 text-emerald-900'
                                : val === 2
                                ? 'bg-blue-100 text-blue-900'
                                : val === 1
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-300'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}

                      {['PSO1', 'PSO2'].map((pso) => {
                        const val = co.psoMappings[pso] || '-';
                        return (
                          <td
                            key={pso}
                            className="p-2 border border-gray-300 text-sm font-extrabold bg-purple-50 text-purple-900"
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
