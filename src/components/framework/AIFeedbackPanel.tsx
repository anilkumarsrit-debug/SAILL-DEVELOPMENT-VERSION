import React from 'react';
import { Sparkles, TrendingUp, Award, UserCheck, MessageCircle, Lightbulb } from 'lucide-react';

interface AIFeedbackPanelProps {
  overallScore?: number;
  pronunciationScore?: number;
  wordStressScore?: number;
  fluencyScore?: number;
  vocabularyScore?: number;
  suggestions?: string[];
  facultyRemarks?: string;
  moduleTitle?: string;
}

export const AIFeedbackPanel: React.FC<AIFeedbackPanelProps> = ({
  overallScore = 88,
  pronunciationScore = 86,
  wordStressScore = 90,
  fluencyScore = 85,
  vocabularyScore = 92,
  suggestions = [
    'Maintain consistent vowel duration on stressed syllables.',
    'Slightly lower pitch cadence at phrase endings for natural intonation.',
    'Practice minimal pairs for /p/ vs /b/ to eliminate subtle regional MTI.'
  ],
  facultyRemarks = 'Awaiting formal faculty review. Preliminary AI evaluation score approved.',
  moduleTitle = 'Speech Practice'
}) => {
  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5 shadow-xs">
      <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
              AI Speech Feedback & Analytics Panel
            </h3>
            <p className="text-[11px] text-[#5D6D7E]">Performance evaluation for {moduleTitle}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-[#D35400]">{overallScore}%</span>
          <span className="text-[10px] font-extrabold text-[#5D6D7E] uppercase block">Overall Score</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
          <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Pronunciation</span>
          <span className="text-xl font-extrabold text-[#D35400]">{pronunciationScore}%</span>
        </div>

        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
          <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Word Stress</span>
          <span className="text-xl font-extrabold text-[#E67E22]">{wordStressScore}%</span>
        </div>

        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
          <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Fluency</span>
          <span className="text-xl font-extrabold text-[#27AE60]">{fluencyScore}%</span>
        </div>

        {vocabularyScore !== undefined && (
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Vocabulary</span>
            <span className="text-xl font-extrabold text-indigo-600">{vocabularyScore}%</span>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
        <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Actionable AI Recommendations:</span>
        </h4>
        <ul className="space-y-1 text-xs text-amber-950 font-medium pl-1">
          {suggestions.map((sug, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-600 font-bold">•</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Faculty Remarks Placeholder */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C3E50]">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Faculty Verification & Remarks (Pending Approval)</span>
        </div>
        <p className="text-xs text-[#5D6D7E] italic">{facultyRemarks}</p>
      </div>
    </div>
  );
};
