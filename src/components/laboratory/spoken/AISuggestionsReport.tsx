import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Sparkles, FileText, ArrowUpRight } from 'lucide-react';
import { SpokenEnglishEvaluationResult } from '../../../services/ai/spokenEnglishCoach';
import { formatScore10, getPerformanceDescriptor } from '../../../lib/scoring';

interface AISuggestionsReportProps {
  evaluation: SpokenEnglishEvaluationResult;
  onSaveToPortfolio?: () => void;
  onSaveToNotebook?: () => void;
}

export const AISuggestionsReport: React.FC<AISuggestionsReportProps> = ({
  evaluation,
  onSaveToPortfolio,
  onSaveToNotebook
}) => {
  const { criteria, totalScore, overallFeedback, strengths, improvements, correctedTranscript, followUpQuestion } = evaluation;

  const criteriaItems = [
    { label: 'Fluency & Pacing', score: criteria.fluencyScore, max: 2, desc: 'Smooth flow, 130-150 WPM, minimal fillers' },
    { label: 'Pronunciation & Intonation', score: criteria.pronunciationScore, max: 2, desc: 'Clarity of phonemes & pitch variation' },
    { label: 'Grammar & Syntax', score: criteria.grammarScore, max: 2, desc: 'Correct agreement, tense & word order' },
    { label: 'Technical Vocabulary', score: criteria.vocabularyScore, max: 2, desc: 'Domain-specific terms & transition words' },
    { label: 'Organization & Confidence', score: criteria.confidenceScore, max: 2, desc: 'PREP structure, vocal projection' }
  ];

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FAD7A0] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 11: AI Spoken English Feedback & 10-Mark Assessment
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Evaluated under SRIT R26 Communicative English Laboratory 5-Criterion Rubric Framework.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-[#5D6D7E] uppercase font-bold block">Total Laboratory Mark</span>
            <span className="text-2xl font-black text-[#D35400] font-mono">
              {formatScore10(totalScore)}
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
            {getPerformanceDescriptor(totalScore)}
          </span>
        </div>
      </div>

      {/* Overall Feedback Banner */}
      <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] leading-relaxed">
        <p className="font-semibold">{overallFeedback}</p>
      </div>

      {/* 5-Criterion Assessment Breakdown Grid (2 Marks Each = 10 Marks Total) */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#D35400]" />
          <span>5-Criterion Rubric Score Breakdown (Max 2.0 Marks Each)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {criteriaItems.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#2C3E50]">
                <span>{item.label}</span>
                <span className="font-mono text-[#D35400]">{item.score} / {item.max}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D35400] rounded-full"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-[#5D6D7E] line-clamp-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and AI Improvement Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Strengths */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <h4 className="font-extrabold text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Delivery Strengths</span>
          </h4>
          <ul className="space-y-1.5 text-emerald-800 text-[11px] list-disc list-inside">
            {strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Actionable Suggestions */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>AI Suggestions for Fluency Improvement</span>
          </h4>
          <ul className="space-y-1.5 text-amber-800 text-[11px] list-disc list-inside">
            {improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Corrected & Polished Transcript */}
      <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
          <span className="font-bold text-[#D35400] uppercase text-[11px] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#D35400]" />
            <span>Polished / Corrected Vocal Transcript</span>
          </span>
          <span className="text-[10px] text-[#5D6D7E]">Fillers Removed & Syntax Enhanced</span>
        </div>
        <p className="text-[#2C3E50] leading-relaxed italic bg-white p-3 rounded-lg border border-[#FAD7A0]/60">
          "{correctedTranscript}"
        </p>
      </div>

      {/* AI Partner Follow-up Question if applicable */}
      {followUpQuestion && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs text-purple-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <strong className="font-extrabold">AI Conversation Partner Follow-Up Question:</strong>
          </div>
          <p className="text-purple-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-purple-200">
            "{followUpQuestion}"
          </p>
        </div>
      )}

      {/* Save Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#FAD7A0]">
        {onSaveToNotebook && (
          <button
            onClick={onSaveToNotebook}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-4 h-4" />
            <span>Update Digital Laboratory Notebook</span>
          </button>
        )}
        {onSaveToPortfolio && (
          <button
            onClick={onSaveToPortfolio}
            className="px-4 py-2 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#E67E22] transition flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Save Artifact to SAILL Portfolio</span>
          </button>
        )}
      </div>
    </div>
  );
};
