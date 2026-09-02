import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle2, ArrowRight, Lightbulb, Check, RefreshCw } from 'lucide-react';

interface MainIdeaFinderProps {
  onCompleteActivity: () => void;
}

export const MainIdeaFinder: React.FC<MainIdeaFinderProps> = ({ onCompleteActivity }) => {
  const samplePassage = `Edge computing architectures process data near the source of generation rather than relying exclusively on centralized cloud data centers. By reducing network round-trip distance, edge nodes minimize latency for time-critical IoT applications such as autonomous traffic systems, industrial robotics, and remote surgery monitors. Furthermore, local data filtering at the edge conserves network bandwidth and reduces centralized storage costs.`;

  const [topicSentence, setTopicSentence] = useState<string>('Edge computing architectures process data near the source of generation rather than relying exclusively on centralized cloud data centers.');
  const [mainIdea, setMainIdea] = useState<string>('Edge computing improves speed, latency, and bandwidth efficiency by decentralizing data processing closer to IoT devices.');
  const [supportingDetails, setSupportingDetails] = useState<string>('1. Minimizes latency for robotics and autonomous vehicles. 2. Conserves network bandwidth and storage costs.');
  const [keywords, setKeywords] = useState<string>('Edge computing, Latency, Bandwidth, Decentralization, IoT');

  const [aiFeedback, setAiFeedback] = useState<{
    accuracyScore: number;
    explanation: string;
    suggestions: string[];
  } | null>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluateMainIdea = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setAiFeedback({
        accuracyScore: 9.8,
        explanation: 'Perfect identification! Your main idea summary captures both the core operational mechanism (processing near data source) and its primary technical benefits (low latency, reduced bandwidth).',
        suggestions: [
          'The topic sentence was pinpointed accurately in sentence 1.',
          'Keywords correctly capture the essential technical domain.'
        ]
      });
      setIsEvaluating(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 5
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Target className="w-5 h-5 text-[#D35400]" />
            5. Main Idea & Key Sentence Identification Studio
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Isolate the topic sentence, synthesize the overarching main idea, extract key supporting details, and select technical keywords.
          </p>
        </div>

        {/* Technical Passage Card */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded-md">
            Passage for Main Idea Extraction
          </span>
          <p className="font-mono text-xs text-[#2C3E50] leading-relaxed p-4 bg-white rounded-xl border border-[#FAD7A0] shadow-2xs">
            "{samplePassage}"
          </p>
        </div>

        {/* Interactive Breakdown Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Topic Sentence */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] uppercase block text-[11px]">
              1. Topic Sentence Identification:
            </label>
            <textarea
              rows={2}
              value={topicSentence}
              onChange={(e) => setTopicSentence(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
            />
          </div>

          {/* Main Idea Synthesis */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] uppercase block text-[11px]">
              2. Synthesized Main Idea (Your Words):
            </label>
            <textarea
              rows={2}
              value={mainIdea}
              onChange={(e) => setMainIdea(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
            />
          </div>

          {/* Supporting Details */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] uppercase block text-[11px]">
              3. Key Supporting Details:
            </label>
            <textarea
              rows={2}
              value={supportingDetails}
              onChange={(e) => setSupportingDetails(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
            />
          </div>

          {/* Keywords */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] uppercase block text-[11px]">
              4. Domain Keywords (Comma Separated):
            </label>
            <textarea
              rows={2}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
            />
          </div>
        </div>

        {/* AI Action */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleEvaluateMainIdea}
            disabled={isEvaluating}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>AI Evaluate Main Idea Extraction</span>
          </button>
        </div>

        {/* AI Result Card */}
        {aiFeedback && (
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="font-black text-[#D35400] uppercase text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Accuracy Assessment
              </span>
              <span className="bg-white px-3 py-1 rounded-xl border border-[#FAD7A0] font-black text-sm text-[#2C3E50]">
                Accuracy Score: {aiFeedback.accuracyScore} / 10
              </span>
            </div>
            <p className="text-[#2C3E50]">{aiFeedback.explanation}</p>
            <ul className="space-y-1 text-emerald-950 font-bold bg-white p-3 rounded-xl border border-[#FAD7A0]">
              {aiFeedback.suggestions.map((s, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 6: Inference Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
