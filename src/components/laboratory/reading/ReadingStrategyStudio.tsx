import React, { useState } from 'react';
import { Brain, CheckCircle2, ArrowRight, HelpCircle, Eye, Search, AlertCircle, Sparkles, Check, RefreshCw } from 'lucide-react';

interface ReadingStrategyStudioProps {
  onCompleteActivity: () => void;
}

export const ReadingStrategyStudio: React.FC<ReadingStrategyStudioProps> = ({ onCompleteActivity }) => {
  const [activeStrategy, setActiveStrategy] = useState<number>(0);

  const strategies = [
    {
      title: '1. Skimming (Rapid Overview)',
      description: 'Glance quickly over headings, first sentences, and bullet points to grasp the central concept without reading word-for-word.',
      passage: 'Artificial Intelligence (AI) integration in autonomous electric vehicles has revolutionized traffic management. By analyzing multi-sensor lidar streams in real-time, onboard neural networks calculate optimal braking trajectories, reducing collision risks by up to 35% in dense urban zones.',
      question: 'What is the primary focus of this paragraph?',
      options: [
        'The cost of electric car batteries',
        'AI neural networks improving autonomous vehicle safety',
        'Lidar hardware manufacturing techniques',
        'Urban traffic law enforcement'
      ],
      correctIndex: 1,
      explanation: 'Skimming the first sentence and key phrase "reducing collision risks" quickly reveals the passage focuses on AI improving vehicle safety.'
    },
    {
      title: '2. Scanning (Target Data Search)',
      description: 'Look specifically for keywords, numbers, dates, or technical metrics without reading the surrounding narrative text.',
      passage: 'The SRIT Campus High-Performance Cluster consists of 64 compute nodes operating at 3.2 GHz, backed by 512 GB DDR5 RAM and an NVMe storage array capable of 7,000 MB/s sequential read throughput.',
      question: 'What is the sequential read speed of the NVMe storage array?',
      options: ['3.2 GHz', '512 GB', '7,000 MB/s', '64 compute nodes'],
      correctIndex: 2,
      explanation: 'Scanning specifically for "read throughput" or "MB/s" isolates "7,000 MB/s" in under 2 seconds.'
    },
    {
      title: '3. Context Clues (Unfamiliar Technical Vocabulary)',
      description: 'Deduce the meaning of unfamiliar jargon by examining surrounding words, contrasts, or explicit definitions in sentence structure.',
      passage: 'The legacy database schema was highly monolithic, whereas the new microservices architecture is decoupled, allowing independent scaling of individual services.',
      question: 'Based on context clues, what does "monolithic" mean in this sentence?',
      options: ['Tightly coupled as a single unified structure', 'Distributed across cloud regions', 'Fast and highly scalable', 'Written in JavaScript'],
      correctIndex: 0,
      explanation: 'The contrast word "whereas" juxtaposes "monolithic" with "decoupled microservices", signaling that monolithic means tightly integrated as a single structure.'
    },
    {
      title: '4. Fact vs. Opinion Distinction',
      description: 'Separate verifiable empirical data (facts) from subjective judgments, marketing claims, or author preferences (opinions).',
      passage: 'Python is undoubtedly the most elegant and enjoyable programming language ever created, and its garbage collector manages memory allocation automatically.',
      question: 'Which statement from the passage represents a subjective OPINION?',
      options: [
        'Its garbage collector manages memory automatically',
        'Python is a programming language',
        'Python is undoubtedly the most elegant and enjoyable programming language ever created',
        'Both statements are facts'
      ],
      correctIndex: 2,
      explanation: '"Most elegant and enjoyable" is a subjective opinion value judgment, whereas automatic garbage collection is a verifiable technical feature.'
    }
  ];

  const current = strategies[activeStrategy];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setIsEvaluated(true);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 2
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#D35400]" />
            2. Reading Strategy Studio
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Master the 8 core strategies: Skimming, Scanning, Predicting, Questioning, Context Clues, Inferencing, Supporting Details, and Fact vs. Opinion.
          </p>
        </div>

        {/* Strategy Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          {strategies.map((strat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveStrategy(idx);
                setSelectedOption(null);
                setIsEvaluated(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeStrategy === idx
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <span>{strat.title.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Practice Content */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="border-b border-[#FAD7A0] pb-2">
            <h3 className="text-sm font-extrabold text-[#2C3E50]">{current.title}</h3>
            <p className="text-xs text-[#5D6D7E] mt-0.5">{current.description}</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] leading-relaxed">
            <span className="text-[10px] font-bold uppercase text-[#D35400] block mb-1">Practice Passage:</span>
            "{current.passage}"
          </div>

          <div className="space-y-3">
            <span className="text-xs font-extrabold text-[#2C3E50] block">{current.question}</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === current.correctIndex;

                let btnStyle = 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FFF8F0]';
                if (isEvaluated) {
                  if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-300 text-red-900';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isEvaluated && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Strategy Explanation Output */}
            {isEvaluated && (
              <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] space-y-1 animate-in fade-in duration-200">
                <span className="font-extrabold text-[#D35400] block text-[10px] uppercase">AI Strategy Analysis:</span>
                <p className="leading-relaxed">{current.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold">
            Module Step {activeStrategy + 1} of {strategies.length}
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 3: Article Reading Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
