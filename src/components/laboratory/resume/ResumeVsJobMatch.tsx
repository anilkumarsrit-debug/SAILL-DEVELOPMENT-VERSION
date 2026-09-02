import React, { useState } from 'react';
import { Target, CheckCircle2, AlertOctagon, ArrowRight, Award, BarChart2, Check, Tag, Sparkles } from 'lucide-react';

interface ResumeVsJobMatchProps {
  onCompleteActivity: () => void;
}

export const ResumeVsJobMatch: React.FC<ResumeVsJobMatchProps> = ({ onCompleteActivity }) => {
  const [matchData] = useState({
    matchPercentage: 88,
    atsReadinessScore: 92,
    targetRole: 'Infosys / TCS Graduate Trainee (Software Engineer - Entry Level)',
    matchingSkills: [
      'Java (Core & OOPs)',
      'Python',
      'Data Structures & Algorithms',
      'HTML5 / CSS3 / JavaScript',
      'React.js',
      'SQL Databases (MySQL)',
      'Git / GitHub',
      'Academic Record (9.4 CGPA)'
    ],
    missingSkills: [
      'Cloud Deployment (AWS / GCP basics)',
      'RESTful API Integration',
      'Unit Testing (JUnit / PyTest basics)'
    ],
    recommendedKeywords: [
      'RESTful APIs',
      'Agile Software Development',
      'Object-Oriented Programming (OOP)',
      'Microservices',
      'CI/CD Workflows'
    ],
    suggestedImprovements: [
      'Add a dedicated bullet point under Campus Portal project describing REST API integration.',
      'Explicitly list "Object-Oriented Programming (OOP)" alongside Java under Technical Skills.',
      'Ensure file naming follows SRIT corporate standard: Anil_Kumar_264G1A0501_Resume.pdf.'
    ]
  });

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 8
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Target className="w-5 h-5 text-[#D35400]" />
            8. Resume vs. Job Match Dashboard
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Real-time comparative analysis between your active resume profile and corporate job specifications.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#D35400] uppercase block">Job Match Percentage</span>
              <span className="text-2xl font-black text-[#2C3E50]">{matchData.matchPercentage}% Match</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">High Corporate Readiness</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#FAD7A0] border-t-[#D35400] flex items-center justify-center font-black text-xs text-[#D35400]">
              {matchData.matchPercentage}%
            </div>
          </div>

          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#D35400] uppercase block">ATS Readiness Score</span>
              <span className="text-2xl font-black text-[#2C3E50]">{matchData.atsReadinessScore} / 100</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">100% Single-Column Layout</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-300 border-t-emerald-600 flex items-center justify-center font-black text-xs text-emerald-700">
              {matchData.atsReadinessScore}
            </div>
          </div>

          <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Corporate Role</span>
            <p className="text-xs font-extrabold text-[#2C3E50]">{matchData.targetRole}</p>
          </div>
        </div>

        {/* Matching vs Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <span className="text-xs font-extrabold text-emerald-800 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matching Verified Skills ({matchData.matchingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchData.matchingSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-2.5 py-1 bg-white border border-emerald-300 text-emerald-950 rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-3">
            <span className="text-xs font-extrabold text-red-800 uppercase flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              Missing High-Value Skills ({matchData.missingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchData.missingSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-2.5 py-1 bg-white border border-red-300 text-red-950 rounded-lg flex items-center gap-1"
                >
                  <span>+ {sk}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Keywords & Improvements */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div>
            <span className="text-xs font-extrabold text-[#D35400] uppercase block mb-2">
              Recommended ATS Keywords to Inject:
            </span>
            <div className="flex flex-wrap gap-2">
              {matchData.recommendedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs font-bold px-3 py-1 bg-white border border-[#FAD7A0] text-[#2C3E50] rounded-xl flex items-center gap-1 shadow-2xs"
                >
                  <Tag className="w-3 h-3 text-[#D35400]" />
                  <span>{kw}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
            <span className="text-xs font-extrabold text-[#D35400] uppercase block">
              Suggested Profile Improvements:
            </span>
            <ul className="space-y-1.5 text-xs text-[#2C3E50]">
              {matchData.suggestedImprovements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] shrink-0 mt-1.5" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 9: Performance Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
