import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, BookOpen, Bookmark, Share2, Sparkles, Volume2, Users, Layout, Shield } from 'lucide-react';
import { Presentation10MarkEvaluation } from '../../../services/ai/presentationCoach';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface PSAIEvaluationReportProps {
  evaluation: Presentation10MarkEvaluation;
  topicTitle: string;
  onSaveToNotebook?: () => void;
  onSaveToPortfolio?: () => void;
}

export const PSAIEvaluationReport: React.FC<PSAIEvaluationReportProps> = ({
  evaluation,
  topicTitle,
  onSaveToNotebook,
  onSaveToPortfolio
}) => {
  const [isSavedNotebook, setIsSavedNotebook] = useState<boolean>(false);
  const [isSavedPortfolio, setIsSavedPortfolio] = useState<boolean>(false);

  const criteriaList = [
    { label: '1. Organization', score: evaluation.criteria.organization, desc: 'Hook, 3-part structure, slide hierarchy, signposts, conclusion' },
    { label: '2. Content', score: evaluation.criteria.content, desc: 'Domain depth, problem-solution alignment, empirical metrics' },
    { label: '3. Delivery', score: evaluation.criteria.delivery, desc: 'Pace (130-150 WPM), vocal modulation, minimal filler words' },
    { label: '4. Language', score: evaluation.criteria.language, desc: 'Technical vocabulary, syntactical precision, signpost markers' },
    { label: '5. Confidence & Engagement', score: evaluation.criteria.confidenceEngagement, desc: 'Stage presence, posture stance, eye contact, PREP Q&A poise' }
  ];

  const handleSaveToNotebook = async () => {
    try {
      await dbStorage.savePortfolioItem({
        id: 'exp-ps-' + Date.now(),
        moduleId: 'public-speaking',
        moduleTitle: 'Public Speaking & Presentations',
        title: `Digital Lab Record EXP-05: ${topicTitle}`,
        category: 'written',
        content: JSON.stringify({
          experimentId: 'EXP-05',
          topicTitle,
          totalScore: evaluation.totalScore,
          performanceDescriptor: evaluation.performanceDescriptor,
          paceWPM: evaluation.paceWPM,
          fillerWordCount: evaluation.fillerWordCount,
          criteria: evaluation.criteria,
          feedback: evaluation.overallFeedback
        }),
        score: evaluation.totalScore,
        createdAt: new Date().toISOString()
      });

      setIsSavedNotebook(true);
      confetti({ particleCount: 30, spread: 50 });
      if (onSaveToNotebook) onSaveToNotebook();
    } catch (err) {
      console.error('Failed to save to notebook', err);
    }
  };

  const handleSaveToPortfolio = async () => {
    try {
      await dbStorage.savePortfolioItem({
        id: 'port-ps-' + Date.now(),
        moduleId: 'public-speaking',
        moduleTitle: 'Public Speaking & Presentations',
        title: `Public Speaking Report: ${topicTitle}`,
        category: 'reflection',
        content: evaluation.polishedOutlineSummary,
        score: evaluation.totalScore,
        createdAt: new Date().toISOString()
      });

      setIsSavedPortfolio(true);
      confetti({ particleCount: 30, spread: 50 });
      if (onSaveToPortfolio) onSaveToPortfolio();
    } catch (err) {
      console.error('Failed to save to portfolio', err);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 10: AI 10-Mark Evaluation Report
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Evaluated under the SRIT SAILL Public Speaking Assessment Framework.
          </p>
        </div>

        <span className="text-xs font-black text-[#D35400] bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#FAD7A0] self-start sm:self-auto">
          {evaluation.performanceDescriptor}
        </span>
      </div>

      {/* Main Score Banner */}
      <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAD7A0]">
            Overall Public Speaking Score
          </span>
          <h4 className="text-3xl font-black font-mono text-[#FAD7A0]">
            {evaluation.totalScore} / 10.0 <span className="text-xs text-slate-300 font-sans">Marks</span>
          </h4>
          <p className="text-xs text-slate-200">{evaluation.performanceDescriptor}</p>
        </div>

        <div className="flex items-center gap-4 text-xs bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono">
          <div>
            <span className="text-[10px] text-slate-300 block uppercase">Pace WPM</span>
            <span className="text-base font-bold text-white">{evaluation.paceWPM} WPM</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-[10px] text-slate-300 block uppercase">Fillers</span>
            <span className="text-base font-bold text-emerald-400">{evaluation.fillerWordCount}</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-[10px] text-slate-300 block uppercase">Engagement</span>
            <span className="text-base font-bold text-[#FAD7A0]">{evaluation.engagementPercent}%</span>
          </div>
        </div>
      </div>

      {/* 5 Criteria Breakdown Grid (2.0 Marks Each = 10.0 Total) */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Core 5 SAILL Criteria Breakdown (2.0 Marks Max per Criterion)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {criteriaList.map((crit, idx) => (
            <div key={idx} className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#2C3E50] text-[11px]">{crit.label}</span>
                <span className="text-[#D35400] font-mono font-black">{crit.score} / 2.0</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D35400] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(crit.score / 2.0) * 100}%` }}
                />
              </div>

              <p className="text-[9px] text-[#5D6D7E] leading-tight line-clamp-2">{crit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <h5 className="font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Presentation Delivery Strengths</span>
          </h5>
          <ul className="space-y-1.5 text-emerald-950 text-[11px] list-disc list-inside">
            {evaluation.strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <h5 className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Targeted Strategic Improvements</span>
          </h5>
          <ul className="space-y-1.5 text-amber-950 text-[11px] list-disc list-inside">
            {evaluation.improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FAD7A0] text-xs">
        <span className="text-[#5D6D7E] text-[11px] italic">
          Automatic record generation available for SAILL Digital Portfolio and IndexedDB.
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleSaveToNotebook}
            className={`px-4 py-2.5 rounded-xl font-bold transition shadow-2xs flex items-center gap-1.5 ${
              isSavedNotebook
                ? 'bg-emerald-600 text-white'
                : 'bg-[#D35400] text-white hover:bg-[#E67E22]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSavedNotebook ? 'Saved to Lab Notebook ✓' : 'Save to Lab Notebook'}</span>
          </button>

          <button
            onClick={handleSaveToPortfolio}
            className={`px-4 py-2.5 rounded-xl font-bold transition shadow-2xs flex items-center gap-1.5 ${
              isSavedPortfolio
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2C3E50] text-white hover:bg-[#34495E]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{isSavedPortfolio ? 'Saved to Portfolio ✓' : 'Save to Portfolio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
