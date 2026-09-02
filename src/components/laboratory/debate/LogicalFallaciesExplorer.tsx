import React, { useState } from 'react';
import { FALLACIES_LIST, FallacyItem } from '../../../services/ai/debateCoach';
import { Brain, CheckCircle2, XCircle, Sparkles, HelpCircle, BookOpen, ChevronRight } from 'lucide-react';

export const LogicalFallaciesExplorer: React.FC = () => {
  const [selectedFallacy, setSelectedFallacy] = useState<FallacyItem>(FALLACIES_LIST[0]);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentQuiz = FALLACIES_LIST[activeQuizIndex].sampleQuestion;

  const handleOptionClick = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setActiveQuizIndex((prev) => (prev + 1) % FALLACIES_LIST.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 5
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Logical Fallacies Explorer
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Learn to spot flawed logic in technical debates. Master 8 classic logical fallacies, test your detection skills in sample arguments, and read AI explanations.
        </p>
      </div>

      {/* Fallacies Knowledge Base Cards Grid */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-sm font-bold text-[#D35400] uppercase tracking-wider font-heading flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#E67E22]" />
          <span>The 8 Core Logical Fallacies in Technical Debate</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FALLACIES_LIST.map((fal) => (
            <button
              key={fal.id}
              onClick={() => setSelectedFallacy(fal)}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFallacy.id === fal.id
                  ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs font-bold'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <span className="text-xs block">{fal.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Fallacy Breakdown Card */}
        <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-3">
          <div className="flex justify-between items-center border-b border-[#FAD7A0] pb-2">
            <h4 className="text-base font-bold text-[#D35400] font-heading">{selectedFallacy.name} Fallacy</h4>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
              Fallacy ID: {selectedFallacy.id}
            </span>
          </div>

          <p className="text-xs text-[#2C3E50]"><strong className="text-[#D35400]">Definition:</strong> {selectedFallacy.definition}</p>
          <p className="text-xs text-[#2C3E50] italic bg-white p-2.5 rounded-lg border border-[#FAD7A0] font-serif">
            <strong className="text-[#E67E22] not-italic">Example Statement:</strong> {selectedFallacy.example}
          </p>
          <p className="text-xs text-[#2C3E50]"><strong className="text-[#D35400]">Why it is fallacious:</strong> {selectedFallacy.whyFallacious}</p>
        </div>
      </div>

      {/* Interactive Fallacy Detection Challenge Workspace */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-5">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-base font-bold text-[#D35400] font-heading">
              Interactive Fallacy Identification Challenge #{activeQuizIndex + 1} of {FALLACIES_LIST.length}
            </h3>
          </div>
          <button
            onClick={handleNextQuiz}
            className="px-3.5 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
          >
            <span>Next Argument</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Argument Statement Box */}
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2">
          <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider block">
            Inspect the Following Debate Argument:
          </span>
          <p className="text-sm font-serif italic text-[#2C3E50] leading-relaxed p-3 bg-[#FFF8F0] rounded-lg border border-[#FAD7A0]">
            "{currentQuiz.argumentText}"
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#2C3E50] block">Select the correct logical fallacy present above:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuiz.correctIndex;

              let btnStyle = 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]';
              if (hasSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#D35400] text-white border-[#D35400] font-bold';
              }

              return (
                <button
                  key={optionText}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                >
                  <span>{optionText}</span>
                  {hasSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {hasSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        {!hasSubmitted && (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
          >
            Submit Fallacy Answer
          </button>
        )}

        {/* Immediate AI Explanation Box */}
        {hasSubmitted && (
          <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D35400]" />
              <span className="text-xs font-bold text-[#D35400]">Immediate AI Explanation:</span>
            </div>
            <p className="text-xs text-[#2C3E50] leading-relaxed">{currentQuiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
