import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, ArrowRight, BookOpen, Key, Brain, MessageSquare, RefreshCw } from 'lucide-react';

interface AiReadingCoachProps {
  onCompleteActivity: () => void;
}

export const AiReadingCoach: React.FC<AiReadingCoachProps> = ({ onCompleteActivity }) => {
  const [inputText, setInputText] = useState<string>(
    `Reinforcement Learning from Human Feedback (RLHF) aligns large language models with human intentions by training a reward model on pairwise comparison preferences. This reward model subsequently guides Proximal Policy Optimization (PPO) algorithms to penalize toxic outputs, reduce hallucination rates, and generate helpful, harmless responses.`
  );

  const [coachAnalysis, setCoachAnalysis] = useState<{
    summary: string;
    keyPoints: string[];
    vocabulary: { word: string; definition: string }[];
    comprehensionPrompt: string;
    criticalThinkingPrompt: string;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleRunCoach = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setCoachAnalysis({
        summary: 'RLHF improves AI model safety and helpfulness by training a reward model on human preferences and optimizing model outputs via Proximal Policy Optimization (PPO).',
        keyPoints: [
          'Pairwise human comparisons train a reward model.',
          'PPO algorithms optimize policy parameters based on reward scores.',
          'Penalizes toxicity and reduces hallucination frequencies.'
        ],
        vocabulary: [
          { word: 'Pairwise Comparison', definition: 'Evaluating two model output options side-by-side to select the superior response.' },
          { word: 'Hallucination Rate', definition: 'The frequency with which a generative model produces plausible-sounding but factually incorrect assertions.' }
        ],
        comprehensionPrompt: 'What specific optimization algorithm is guided by the reward model in RLHF?',
        criticalThinkingPrompt: 'What potential biases might be introduced into the AI model if the human preference evaluators come from a homogeneous demographic background?'
      });
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 9
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#D35400]" />
            9. AI Reading Coach & Automated Comprehension Generator
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Input any engineering passage or paper abstract to instantly generate summaries, key points, technical vocabulary explanations, comprehension questions, and critical thinking prompts.
          </p>
        </div>

        {/* Input Text Area */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <label className="text-xs font-extrabold text-[#D35400] uppercase block">
            Input Reading Passage or Research Abstract:
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
          />

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleRunCoach}
              disabled={isAnalyzing}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate AI Reading Coach Analysis</span>
            </button>
          </div>
        </div>

        {/* Coach Analysis Results */}
        {coachAnalysis && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Summary & Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                <span className="font-extrabold text-[#D35400] uppercase text-[10px] block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Generated Summary
                </span>
                <p className="text-[#2C3E50] leading-relaxed">{coachAnalysis.summary}</p>
              </div>

              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                <span className="font-extrabold text-[#D35400] uppercase text-[10px] block flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Core Technical Key Points
                </span>
                <ul className="space-y-1 text-[#2C3E50]">
                  {coachAnalysis.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#D35400] font-bold">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vocabulary Explanation Table */}
            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-[#D35400] uppercase text-[10px] block flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Contextual Vocabulary Explanations
              </span>
              <div className="space-y-2">
                {coachAnalysis.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FFF8F0] rounded-lg border border-[#FAD7A0]">
                    <strong className="text-[#2C3E50]">{vocab.word}: </strong>
                    <span className="text-[#5D6D7E]">{vocab.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Thinking Prompts */}
            <div className="p-4 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-[#D35400] uppercase text-[10px] block flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> AI Critical Thinking Prompt
              </span>
              <p className="text-[#2C3E50] font-bold">{coachAnalysis.criticalThinkingPrompt}</p>
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
            <span>Proceed to Section 10: Comparative Reading Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
