import React, { useState } from 'react';
import { Eye, Sparkles, CheckCircle2, AlertCircle, Send, HelpCircle, FileText, Award, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalysisScenario {
  id: string;
  title: string;
  context: string;
  transcriptExcerpt: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    unsuitableReason?: string;
    betterAlternative?: string;
  }[];
  modelAnalysis: string;
}

const ANALYSIS_SCENARIOS: AnalysisScenario[] = [
  {
    id: 'scen-01',
    title: 'Evaluating Interruption & Diplomatic Re-entry Technique',
    context: 'During an intense campus placement GD on "Renewable Energy Transition vs. Traditional Grids", Participant A speaks continuously for 90 seconds without yielding the floor.',
    transcriptExcerpt: 'Participant A: "...and therefore solar cell efficiency must reach 35% before we phase out coal..."\nParticipant B: "YOU ARE WRONG! Coal is far cheaper and India cannot afford this right now!"',
    question: 'What is the primary diplomatic flaw in Participant B\'s response?',
    options: [
      {
        id: 'opt-1',
        text: 'Participant B used aggressive, confrontational language ("YOU ARE WRONG!") without acknowledging Participant A\'s argument first.',
        isCorrect: true,
        explanation: 'Correct! Saying "You are wrong!" creates destructive confrontation. A polished diplomatic entry would be: "That is a valid economic perspective on coal; however, considering long-term grid sustainability..."'
      },
      {
        id: 'opt-2',
        text: 'Participant B should have spoken even louder to dominate the room and drown out Participant A.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Shouting or attempting to dominate the discussion reflects poor emotional regulation and leads to negative scoring/rejection by placement evaluators.',
        betterAlternative: 'Wait for a natural pause or intervene politely using: "May I add a crucial economic perspective to what Participant A mentioned..."'
      },
      {
        id: 'opt-3',
        text: 'Participant B should have remained completely silent for the remainder of the discussion.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Complete silence penalizes your contribution, communication, and leadership marks.',
        betterAlternative: 'Participate actively with composed, data-backed reasoning rather than withdrawing from the discussion.'
      },
      {
        id: 'opt-4',
        text: 'Participant B was entirely correct because aggressiveness shows strong leadership confidence.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Aggressiveness is not leadership; corporate recruiters strictly penalize hostile behavior in team settings.',
        betterAlternative: 'Demonstrate leadership through assertive yet respectful collaboration and structured reasoning.'
      }
    ],
    modelAnalysis: 'In corporate placement GDs, aggressive rebuttals ("You are wrong!") signal poor emotional regulation. The recommended intervention is: "I appreciate Participant A\'s focus on efficiency, but from a cost perspective, coal remains an interim necessity."'
  },
  {
    id: 'scen-02',
    title: 'Identifying Leadership & Team Inclusion Strategies',
    context: 'In a 6-person GD on "Cloud Migration in Enterprise Banking", Participant C notices that Participant F has not spoken for 5 minutes.',
    transcriptExcerpt: 'Participant C: "We have discussed the technical advantages of cloud migration. I notice Participant F has extensive background in cyber-security. F, what are your thoughts on data sovereignty risks?"',
    question: 'How will placement evaluators rate Participant C\'s action?',
    options: [
      {
        id: 'opt-1',
        text: 'High Leadership & Teamwork mark (1.0/1.0) for recognizing peer expertise and encouraging group inclusion.',
        isCorrect: true,
        explanation: 'Correct! Inviting quiet members and recognizing specialized expertise displays emotional intelligence, group ownership, and collaborative leadership.'
      },
      {
        id: 'opt-2',
        text: 'Penalized for wasting speaking time on someone else instead of scoring personal points.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Group Discussions are assessments of teamwork and facilitation, not individual monologues.',
        betterAlternative: 'Fostering team synergy and bringing out quiet voices demonstrates senior engineer / tech lead potential.'
      },
      {
        id: 'opt-3',
        text: 'Neutral rating because evaluators only care about how much technical jargon Participant C spoke.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Technical jargon without collaborative facilitation does not earn top placement band marks.',
        betterAlternative: 'Balance technical domain arguments with active team moderation.'
      },
      {
        id: 'opt-4',
        text: 'Evaluated negatively for interrupting the general flow of the group.',
        isCorrect: false,
        explanation: 'Incorrect.',
        unsuitableReason: 'Participant C did not disrupt the flow; they bridged the existing discussion to an unexplored security dimension.',
        betterAlternative: 'Continue using contextual bridging phrases to invite diverse insights.'
      }
    ],
    modelAnalysis: 'Inviting silent members demonstrates maturity, empathy, and group ownership—traits highly prized for software engineering project leads.'
  }
];

export const GDAIVideoAnalysis: React.FC = () => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userWrittenAnalysis, setUserWrittenAnalysis] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<{
    isSubmitted: boolean;
    isCorrect: boolean;
    message: string;
    details: string;
    unsuitableReason?: string;
    betterAlternative?: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const currentScenario = ANALYSIS_SCENARIOS[activeScenarioIdx];

  const handleEvaluateAnalysis = () => {
    if (!selectedOptionId) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const chosen = currentScenario.options.find((o) => o.id === selectedOptionId);
      if (chosen?.isCorrect) {
        setEvaluationResult({
          isSubmitted: true,
          isCorrect: true,
          message: 'Excellent Case Analysis — Correct Identification!',
          details: chosen.explanation
        });
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 } });
      } else {
        setEvaluationResult({
          isSubmitted: true,
          isCorrect: false,
          message: 'Incorrect Selection — Pedagogical Review:',
          details: chosen?.explanation || 'Incorrect option selected.',
          unsuitableReason: chosen?.unsuitableReason || 'This approach fails to meet corporate GD evaluation criteria.',
          betterAlternative: chosen?.betterAlternative || 'Choose collaborative, diplomatic intervention techniques.'
        });
      }
    }, 600);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 4: GD-Case Study Analysis
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Critique sample campus GD scenarios, spot communication flaws, and evaluate strategic intervention decisions.
          </p>
        </div>

        <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0] self-start sm:self-auto">
          Scenario {activeScenarioIdx + 1} of {ANALYSIS_SCENARIOS.length}
        </span>
      </div>

      {/* Scenario Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {ANALYSIS_SCENARIOS.map((scen, idx) => (
          <button
            key={scen.id}
            onClick={() => {
              setActiveScenarioIdx(idx);
              setSelectedOptionId(null);
              setEvaluationResult(null);
            }}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              activeScenarioIdx === idx
                ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]/40 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-[10px] text-[#D35400] uppercase font-mono block">Case Scenario {idx + 1}</span>
            <span className="text-xs text-[#2C3E50] font-extrabold block mt-0.5">{scen.title}</span>
          </button>
        ))}
      </div>

      {/* Active Case Box */}
      <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4 text-xs">
        <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">{currentScenario.title}</h4>
        <p className="text-[#5D6D7E] leading-relaxed">{currentScenario.context}</p>

        {/* Transcript Box */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed border border-slate-800">
          <span className="text-[10px] text-[#FAD7A0] uppercase font-bold block mb-1">Transcript Excerpt:</span>
          <pre className="font-sans whitespace-pre-wrap">{currentScenario.transcriptExcerpt}</pre>
        </div>

        {/* Question */}
        <div className="space-y-2 pt-2">
          <label className="font-bold text-[#2C3E50] block text-xs">
            Evaluation Prompt: {currentScenario.question}
          </label>
          <div className="space-y-2">
            {currentScenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedOptionId(opt.id);
                    setEvaluationResult(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition text-xs flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] font-bold shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    isSelected ? 'bg-white text-[#D35400]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {opt.id.replace('opt-', '')}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Analysis Input */}
        <div className="space-y-1.5 pt-2">
          <label className="font-bold text-[#2C3E50] block text-xs">
            Optional: Note your strategic takeaway or alternative diplomatic wording:
          </label>
          <textarea
            rows={2}
            value={userWrittenAnalysis}
            onChange={(e) => setUserWrittenAnalysis(e.target.value)}
            placeholder="E.g., In this situation, the participant should have used an acknowledging buffer phrase before presenting a counter-argument..."
            className="w-full p-3 border border-[#FAD7A0] bg-white rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none text-xs"
          />
        </div>

        <button
          onClick={handleEvaluateAnalysis}
          disabled={isAnalyzing || !selectedOptionId}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
            selectedOptionId && !isAnalyzing
              ? 'bg-[#D35400] text-white hover:bg-[#E67E22]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Analyzing Response...' : 'Submit Case Analysis'}</span>
        </button>

        {/* Feedback Display Banner */}
        {evaluationResult && (
          <div
            className={`p-4 rounded-xl border space-y-2.5 text-xs ${
              evaluationResult.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold">
              {evaluationResult.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className={evaluationResult.isCorrect ? 'text-emerald-900' : 'text-rose-900'}>
                {evaluationResult.message}
              </span>
            </div>

            {evaluationResult.isCorrect ? (
              <p className="text-emerald-800 leading-relaxed font-medium">
                {evaluationResult.details}
              </p>
            ) : (
              <div className="space-y-2 text-[11px]">
                <div className="p-3 bg-white/80 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-800 block mb-0.5">Why this option is unsuitable:</span>
                  <span className="text-rose-900 leading-relaxed">{evaluationResult.unsuitableReason}</span>
                </div>
                <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-0.5">What would be better:</span>
                  <span className="text-emerald-900 leading-relaxed">{evaluationResult.betterAlternative}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-[#2C3E50] mt-2">
              <strong className="text-[#D35400]">Evaluator Rubric Benchmark:</strong> {currentScenario.modelAnalysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
