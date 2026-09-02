import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers, Award, BarChart2 } from 'lucide-react';
import { evaluateTechnicalReport, TechnicalReportEvaluation } from '../../../services/ai/reportWritingCoach';

export const AITechnicalWritingCoach: React.FC = () => {
  const [reportType, setReportType] = useState<any>('Laboratory Report');
  const [reportTitle, setReportTitle] = useState<string>('Evaluation of Power Factor Correction in Industrial Loads');
  const [draftContent, setDraftContent] = useState<string>(
    'The goal of this experiment was to measure how power factor capacitor banks affect current draw in heavy motor loads. We connected a 5kW 3-phase induction motor to a variable capacitor unit. When the capacitor was switched off, the measured power factor was 0.68 lagging and current was 14.2A. After switching on 15 μF compensation capacitors, power factor improved to 0.95 lagging and total line current dropped to 10.1A. This shows that power factor correction saves significant apparent power.'
  );

  const [evaluation, setEvaluation] = useState<TechnicalReportEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const result = await evaluateTechnicalReport({
      reportType,
      title: reportTitle,
      content: draftContent
    });
    setEvaluation(result);
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 7
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              AI Technical Writing Coach (10-Criteria Evaluator)
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Submit any engineering draft or section for instant evaluation across 10 critical technical writing parameters: Grammar, Coherence, Vocabulary, Tone, Structure, Organization, Consistency, Formatting, Precision, and Completeness.
        </p>
      </div>

      {/* Input & Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Draft Input (5 cols) */}
        <div className="lg:col-span-5 srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-sm font-bold text-[#D35400] font-heading border-b border-[#FAD7A0] pb-2">
            Submit Technical Text for AI Audit
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Document Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-semibold"
              >
                <option value="Laboratory Report">Laboratory Report</option>
                <option value="Project Report">Project Report / Abstract</option>
                <option value="Technical Documentation">Technical Documentation</option>
                <option value="Data Presentation">Data Presentation & Caption</option>
                <option value="General Technical Report">General Engineering Report</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Report / Section Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Draft Content</label>
              <textarea
                rows={10}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Paste your technical report draft or section here..."
                className="w-full p-3 text-xs rounded-xl border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono leading-relaxed"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || draftContent.trim().length < 10}
              className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isEvaluating ? 'Evaluating 10 Technical Parameters...' : 'Run 10-Mark AI Evaluation'}
            </button>
          </div>
        </div>

        {/* Right Column: 10-Parameter Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {evaluation ? (
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5 animate-fadeIn">
              {/* Top Score Banner */}
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#E67E22] font-bold">
                    SAILL AI Evaluation Result
                  </span>
                  <h3 className="text-base font-bold text-[#D35400] font-heading">{evaluation.descriptor}</h3>
                  <p className="text-xs text-[#2C3E50] font-medium">{evaluation.performanceScale}</p>
                </div>

                <div className="text-center p-3 bg-white rounded-xl border border-[#FAD7A0] shrink-0">
                  <p className="text-[10px] font-mono text-gray-500 uppercase">Total Score</p>
                  <p className="text-2xl font-black text-[#D35400]">{evaluation.totalScore} <span className="text-xs text-gray-400 font-normal">/ 10</span></p>
                </div>
              </div>

              {/* 10 Criteria Breakdown Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#E67E22]" />
                  <span>10-Criteria Rubric Breakdown (1.0 Mark Each)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono">
                  {Object.entries(evaluation.rubric).map(([key, val]) => (
                    <div key={key} className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg">
                      <span className="text-gray-500 capitalize block truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-[#D35400] text-xs">{val} / 1.0</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Strengths
                  </span>
                  <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                    {evaluation.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Areas for Growth
                  </span>
                  <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                    {evaluation.weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Improved Draft */}
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#D35400] uppercase font-heading flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E67E22]" />
                  <span>AI Refined Engineering Draft</span>
                </span>
                <p className="text-xs font-mono text-[#2C3E50] whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-[#FAD7A0]">
                  {evaluation.improvedVersion}
                </p>
              </div>
            </div>
          ) : (
            <div className="srit-card p-12 bg-white border border-[#FAD7A0] text-center space-y-3">
              <Bot className="w-12 h-12 text-[#E67E22] mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-[#D35400] font-heading">AI Technical Writing Coach Ready</h3>
              <p className="text-xs text-[#2C3E50] max-w-sm mx-auto">
                Paste your technical text on the left and click "Run 10-Mark AI Evaluation" to receive comprehensive feedback across all 10 criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
