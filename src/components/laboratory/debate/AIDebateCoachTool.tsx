import React, { useState } from 'react';
import { DEBATE_TOPICS, DebateTopic } from '../../../services/ai/debateCoach';
import { Bot, Sparkles, CheckCircle2, Copy, FileText, Lightbulb, RefreshCw, Send } from 'lucide-react';

export const AIDebateCoachTool: React.FC = () => {
  const [customMotion, setCustomMotion] = useState(DEBATE_TOPICS[1].motion);
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(DEBATE_TOPICS[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);

  const handleGenerateCoachInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedOutput({
        motion: customMotion,
        supportingArguments: [
          'Ethical Compliance: Ensures AI systems meet international safety and bioethics standards before deployment.',
          'Accountability Framework: Establishes clear legal responsibility for hardware/software failures in critical fields.'
        ],
        opposingArguments: [
          'Innovation Friction: Excessive regulatory hurdles slow down technological breakthroughs in emergency medicine.',
          'Compliance Overhead: Small startups cannot afford lengthy bioethics committee approval cycles.'
        ],
        evidenceSuggestions: [
          'IEEE Standard 7000-2021 for Ethically Aligned System Design.',
          'WHO 2023 Guidance on Ethics and Governance of Artificial Intelligence for Health.',
          'Lancet 2024 meta-analysis on diagnostic error reduction in AI-assisted radiology.'
        ],
        strategicCounterarguments: [
          'If opponent claims regulation stifles innovation, refute by demonstrating that standardized testing builds public trust, which accelerates market adoption.'
        ],
        closingStatementSuggestion: `In conclusion, mandating ethical oversight for ${customMotion.substring(0, 40)}... does not stall innovation—it elevates software quality and safeguards human well-being.`,
        improvementTips: [
          'Use clear numerical statistics (e.g. "84% reduction in fault rates") during your opening 30 seconds.',
          'Vary your vocal pitch during the rebuttal to emphasize key transitional connectors like "however" and "nevertheless".'
        ]
      });
      setIsGenerating(false);
    }, 1000);
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
              Module 10 • Section 6
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              AI Debate Coach Engine
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Request AI-generated debate briefs for any motion. Generate supporting arguments, opposing arguments, empirical evidence suggestions, strategic counterarguments, and personalized improvement tips.
        </p>
      </div>

      {/* Input / Topic Selector */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#2C3E50]">
            Enter Debate Motion Statement or Select Pre-set Topic:
          </label>

          <div className="flex flex-wrap gap-2 mb-2">
            {DEBATE_TOPICS.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopic(t);
                  setCustomMotion(t.motion);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition ${
                  customMotion === t.motion
                    ? 'bg-[#D35400] text-white border-[#D35400]'
                    : 'bg-white text-[#2C3E50] border-[#FAD7A0]'
                }`}
              >
                {t.category} Motion
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={customMotion}
            onChange={(e) => setCustomMotion(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <button
          onClick={handleGenerateCoachInsights}
          disabled={isGenerating}
          className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating AI Debate Brief & Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Full AI Debate Brief (Arguments, Evidence, Rebuttals)</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Brief Display */}
      {generatedOutput && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5 animate-fadeIn">
          <div className="border-b border-[#FAD7A0] pb-3">
            <span className="text-[10px] font-bold uppercase text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
              AI Generated Strategy Brief
            </span>
            <h3 className="text-base font-bold text-[#2C3E50] font-heading mt-1">{generatedOutput.motion}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supporting Arguments */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Supporting Arguments (Affirmative)
              </span>
              <ul className="text-xs text-emerald-900 list-disc list-inside space-y-1">
                {generatedOutput.supportingArguments.map((arg: string, i: number) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>

            {/* Opposing Arguments */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" />
                Opposing Arguments (Negative)
              </span>
              <ul className="text-xs text-rose-900 list-disc list-inside space-y-1">
                {generatedOutput.opposingArguments.map((arg: string, i: number) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence Suggestions */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#D35400] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#E67E22]" />
              Suggested Empirical Evidence & Standards
            </span>
            <ul className="text-xs text-[#2C3E50] list-disc list-inside space-y-1">
              {generatedOutput.evidenceSuggestions.map((ev: string, i: number) => (
                <li key={i}>{ev}</li>
              ))}
            </ul>
          </div>

          {/* Counterargument & Closing */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs text-[#2C3E50]">
            <span className="font-bold text-[#D35400] block">Strategic Rebuttal Tactic:</span>
            <p>{generatedOutput.strategicCounterarguments[0]}</p>
            <span className="font-bold text-[#D35400] block pt-2">Suggested Closing Statement:</span>
            <p className="italic font-serif bg-white p-2.5 rounded border border-[#FAD7A0]">
              "{generatedOutput.closingStatementSuggestion}"
            </p>
          </div>

          {/* Personalized Improvement Tips */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-600" />
              Personalized Delivery & Persuasiveness Tips
            </span>
            <ul className="text-xs text-blue-900 list-disc list-inside space-y-1">
              {generatedOutput.improvementTips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
