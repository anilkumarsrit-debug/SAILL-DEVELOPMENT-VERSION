import React, { useState } from 'react';
import { Sliders, Sparkles, CheckCircle2, ArrowRight, MessageSquare, Check, RefreshCw } from 'lucide-react';

interface ToneAnalyzerProps {
  onCompleteActivity: () => void;
}

export const ToneAnalyzer: React.FC<ToneAnalyzerProps> = ({ onCompleteActivity }) => {
  const toneOptions = [
    'Formal',
    'Informative',
    'Persuasive',
    'Optimistic',
    'Critical',
    'Humorous',
    'Objective',
    'Concerned'
  ];

  const passages = [
    {
      id: 1,
      text: 'While autonomous drone delivery offers undeniable speed improvements for last-mile logistics, the total lack of robust regulatory standards for noise pollution and urban airspace safety poses severe threats that municipal planners must address immediately.',
      correctTone: 'Critical',
      clues: 'Key words like "total lack", "severe threats", "must address immediately" express strong urgency and warning.'
    },
    {
      id: 2,
      text: 'The experimental compiler optimized bytecode execution time by 18.4% across 50 benchmark workloads without increasing memory consumption.',
      correctTone: 'Objective',
      clues: 'Uses empirical metrics, precise percentages, and neutral academic language without subjective praise.'
    },
    {
      id: 3,
      text: 'Imagine a world where clean fusion energy powers every home, eliminating carbon emissions entirely and unlocking boundless potential for space exploration.',
      correctTone: 'Optimistic',
      clues: 'Aspirational phrasing ("Imagine a world", "boundless potential", "power every home") creates an inspiring vision.'
    }
  ];

  const [currentPassageIdx, setCurrentPassageIdx] = useState<number>(0);
  const currentPassage = passages[currentPassageIdx];

  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    clues: string;
    explanation: string;
  } | null>(null);

  const handleSelectTone = (tone: string) => {
    setSelectedTone(tone);
    const isCorrect = tone === currentPassage.correctTone;
    setEvaluation({
      isCorrect,
      clues: currentPassage.clues,
      explanation: isCorrect
        ? `Spot on! The tone is indeed "${tone}".`
        : `Selected "${tone}". The dominant primary tone is "${currentPassage.correctTone}".`
    });
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 7
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#D35400]" />
            7. Author Tone & Linguistic Attitude Analyzer
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Identify tone variations (Formal, Objective, Critical, Optimistic, Concerned, Persuasive) and examine linguistic markers and diction choices.
          </p>
        </div>

        {/* Passage Navigation */}
        <div className="flex gap-2">
          {passages.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setCurrentPassageIdx(idx);
                setSelectedTone(null);
                setEvaluation(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPassageIdx === idx
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
              }`}
            >
              Passage {idx + 1}
            </button>
          ))}
        </div>

        {/* Passage Text */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded-md">
            Text Sample {currentPassageIdx + 1}
          </span>
          <p className="font-mono text-xs text-[#2C3E50] leading-relaxed p-4 bg-white rounded-xl border border-[#FAD7A0] shadow-2xs">
            "{currentPassage.text}"
          </p>
        </div>

        {/* Tone Options Grid */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-[#2C3E50] block">
            Select the Primary Tone of this Passage:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {toneOptions.map((tone) => {
              const isSelected = selectedTone === tone;
              return (
                <button
                  key={tone}
                  type="button"
                  onClick={() => handleSelectTone(tone)}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span>{tone}</span>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linguistic Clues AI Breakdown */}
        {evaluation && (
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="font-black text-[#D35400] uppercase text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Tone & Diction Analysis
              </span>
              <span
                className={`px-3 py-1 rounded-xl font-bold text-xs ${
                  evaluation.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {evaluation.isCorrect ? 'Correct Tone Identified' : 'Tone Insight'}
              </span>
            </div>

            <p className="text-[#2C3E50] font-bold">{evaluation.explanation}</p>

            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-bold text-[#D35400] block text-[10px] uppercase">Linguistic Clues in Text:</span>
              <p className="text-[#2C3E50]">{evaluation.clues}</p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 8: Speed Reading Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
