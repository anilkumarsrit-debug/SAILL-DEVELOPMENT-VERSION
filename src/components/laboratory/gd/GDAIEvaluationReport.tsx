import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Bookmark, Share2 } from 'lucide-react';
import { GDEvaluationResult } from '../../../services/ai/groupDiscussionCoach';
import { dbStorage } from '../../../lib/db';

interface GDAIEvaluationReportProps {
  evaluation: GDEvaluationResult;
  topicTitle: string;
  onSaveToNotebook?: () => void;
  onSaveToPortfolio?: () => void;
}

export const GDAIEvaluationReport: React.FC<GDAIEvaluationReportProps> = ({
  evaluation,
  topicTitle,
  onSaveToNotebook,
  onSaveToPortfolio
}) => {
  const [isSavedNotebook, setIsSavedNotebook] = useState<boolean>(false);
  const [isSavedPortfolio, setIsSavedPortfolio] = useState<boolean>(false);

  const criteriaList = [
    { label: 'Content Quality', score: evaluation.criteria.contentQuality, desc: 'Relevance, domain depth, and factual reasoning' },
    { label: 'Fluency & Pace', score: evaluation.criteria.fluency, desc: 'Smooth articulation without hesitation pauses' },
    { label: 'Confidence', score: evaluation.criteria.confidence, desc: 'Vocal projection and firm assertions' },
    { label: 'Leadership', score: evaluation.criteria.leadership, desc: 'Initiating, steering topic, and steering consensus' },
    { label: 'Listening', score: evaluation.criteria.listening, desc: 'Referencing peer arguments and active attention' },
    { label: 'Teamwork & Diplomacy', score: evaluation.criteria.teamwork, desc: 'Inclusive phrasing ("we", "our team") and respect' },
    { label: 'Vocabulary', score: evaluation.criteria.vocabulary, desc: 'Discourse transition markers and technical terms' },
    { label: 'Grammar & Structure', score: evaluation.criteria.grammar, desc: 'Sentence formation and syntactical accuracy' },
    { label: 'Topic Relevance', score: evaluation.criteria.relevance, desc: 'Staying aligned with prompt boundaries' },
    { label: 'Conclusion & Synthesis', score: evaluation.criteria.conclusion, desc: 'Summarizing key group recommendations' }
  ];

  const handleSaveToLabNotebook = async () => {
    try {
      await dbStorage.savePortfolioItem({
        id: 'exp-gd-' + Date.now(),
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion Techniques',
        title: `Digital Lab Record EXP-04: ${topicTitle}`,
        category: 'written',
        content: JSON.stringify({
          experimentId: 'EXP-04',
          topicTitle,
          totalScore: evaluation.totalScore,
          leadershipRating: evaluation.leadershipRating,
          participationRatePercent: evaluation.participationRatePercent,
          criteria: evaluation.criteria,
          feedback: evaluation.overallFeedback
        }),
        score: evaluation.totalScore,
        createdAt: new Date().toISOString()
      });

      setIsSavedNotebook(true);
      if (onSaveToNotebook) onSaveToNotebook();
    } catch (err) {
      console.error('Failed to save to lab notebook', err);
    }
  };

  const handleSaveToSAILLPortfolio = async () => {
    try {
      await dbStorage.savePortfolioItem({
        id: 'port-gd-' + Date.now(),
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion Techniques',
        title: `GD Evaluation Report: ${topicTitle}`,
        category: 'reflection',
        content: evaluation.polishedSummary,
        score: evaluation.totalScore,
        createdAt: new Date().toISOString()
      });

      setIsSavedPortfolio(true);
      if (onSaveToPortfolio) onSaveToPortfolio();
    } catch (err) {
      console.error('Failed to save to portfolio', err);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 7: AI 10-Mark Evaluation Report
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Evaluated under the SRIT SAILL R26 Group Discussion Framework.
          </p>
        </div>

        <span className="text-xs font-black text-[#D35400] bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#FAD7A0] self-start sm:self-auto">
          {evaluation.leadershipRating}
        </span>
      </div>

      {/* Main Score Banner */}
      <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAD7A0]">
            Overall GD Score
          </span>
          <h4 className="text-3xl font-black font-mono text-[#FAD7A0]">
            {evaluation.totalScore} / 10.0 <span className="text-xs text-slate-300 font-sans">Marks</span>
          </h4>
          <p className="text-xs text-slate-200">{evaluation.performanceDescriptor}</p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div>
            <span className="text-[10px] text-slate-300 block uppercase">Turn Share</span>
            <span className="text-lg font-bold font-mono text-white">{evaluation.participationRatePercent}%</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-[10px] text-slate-300 block uppercase">Topic</span>
            <span className="text-xs font-bold text-[#FAD7A0] line-clamp-1 max-w-[180px]">{topicTitle}</span>
          </div>
        </div>
      </div>

      {/* 10 Criteria Breakdown Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Detailed 10-Mark Framework Breakdown (1.0 Mark Max per Criterion)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {criteriaList.map((crit, idx) => (
            <div key={idx} className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#2C3E50] text-[11px]">{crit.label}</span>
                <span className="text-[#D35400] font-mono font-black">{crit.score} / 1.0</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D35400] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(crit.score / 1.0) * 100}%` }}
                />
              </div>

              <p className="text-[9px] text-[#5D6D7E] leading-tight line-clamp-2">{crit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Strengths */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <h5 className="font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Group Discussion Strengths</span>
          </h5>
          <ul className="space-y-1.5 text-emerald-950 text-[11px] list-disc list-inside">
            {evaluation.strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
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

      {/* Save Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FAD7A0] text-xs">
        <span className="text-[#5D6D7E] text-[11px] italic">
          Automatic record generation available for SAILL Digital Portfolio and IndexedDB.
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleSaveToLabNotebook}
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
            onClick={handleSaveToSAILLPortfolio}
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
