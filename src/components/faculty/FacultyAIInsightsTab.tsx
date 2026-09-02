import React from 'react';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Award,
  TrendingUp,
  BrainCircuit,
  Zap,
  BookOpen
} from 'lucide-react';

export const FacultyAIInsightsTab: React.FC = () => {
  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white p-6 rounded-2xl border border-[#FAD7A0]/30 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#D35400] text-white rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold font-serif text-[#FAD7A0]">SAILL AI Pedagogical Insights</h2>
            <p className="text-xs text-gray-200">
              Automated Gemini Pro Prosody Analysis & Cohort Learning Recommendations
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Common Struggle Rule */}
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Frequent Phonetic Friction Point</span>
          </div>
          <p className="text-sm font-semibold text-[#2C3E50]">
            Students frequently struggle with <strong className="text-rose-700">Word Stress Rule 5</strong> (Secondary stress shifts on multi-syllabic academic verbs ending in "-ate" and "-ize").
          </p>
          <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-900 border border-rose-100">
            <strong>Cohort Impact:</strong> 42% of audio submissions in Section CSE-A triggered Gemini pitch correction alerts on this rule.
          </div>
        </div>

        {/* Card 2: Recommended Revision Topic */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Recommended Revision Topic</span>
          </div>
          <p className="text-sm font-semibold text-[#2C3E50]">
            Suggested Focus: <strong className="text-[#D35400]">Accent Practice & Diphthong Neutralization</strong>
          </p>
          <p className="text-xs text-gray-600">
            AI voice models detect regional vowel elongation on /eɪ/ and /oʊ/ sounds during spontaneous speech drills. A 10-minute targeted warm-up exercise is recommended.
          </p>
        </div>

        {/* Card 3: Most Difficult Module */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-[#D35400] font-bold text-sm">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            <span>Most Difficult Module</span>
          </div>
          <p className="text-sm font-semibold text-[#2C3E50]">
            Highest Challenge Index: <strong className="text-[#2C3E50]">Module 1 (Phonetics & Vowel Articulation)</strong>
          </p>
          <p className="text-xs text-gray-600">
            Average time spent per student step is 34 minutes higher than benchmark. Re-attempt rates peaked at 2.8 attempts per task.
          </p>
        </div>

        {/* Card 4: Most Improved Students Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Most Improved Students</span>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-50 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C3E50]">A. Sharma (26691A0501)</span>
              <span className="font-extrabold text-emerald-700">+18% AI Score Gain</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C3E50]">K. Varma (26691A0512)</span>
              <span className="font-extrabold text-emerald-700">+15% Fluency Gain</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C3E50]">R. Patel (26691A0524)</span>
              <span className="font-extrabold text-emerald-700">+14% Clarity Gain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
