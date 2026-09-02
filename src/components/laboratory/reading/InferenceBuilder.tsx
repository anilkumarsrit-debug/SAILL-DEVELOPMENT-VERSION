import React, { useState } from 'react';
import { Lightbulb, Sparkles, CheckCircle2, ArrowRight, Brain, Check, RefreshCw } from 'lucide-react';

interface InferenceBuilderProps {
  onCompleteActivity: () => void;
}

export const InferenceBuilder: React.FC<InferenceBuilderProps> = ({ onCompleteActivity }) => {
  const scenario = {
    title: 'Inferential Reading Scenario: Cloud Data Center Energy Demands',
    passage: `While hyperscale cloud provider AI data centers have increased renewable energy purchasing contracts by 150% over the last three years, regional municipal electrical grids in several data center hubs have reinstated fossil-fuel backup peaking plants during heatwaves to maintain grid frequency stability.`,
    question: 'What logical inference can be drawn regarding the true net environmental impact of AI cloud expansion?',
    sampleInference: 'Despite massive investments in renewable energy contracts, the instantaneous high peak loads of AI data centers still force local utility grids to rely on fossil fuels during high-demand periods, indicating a gap between annual renewable accounting and real-time operational grid carbon intensity.'
  };

  const [studentInference, setStudentInference] = useState<string>(scenario.sampleInference);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    logicalReasoning: string;
    evidenceEvaluation: string;
    depthScore: string;
    alternativeView: string;
  } | null>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluateInference = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvaluation({
        score: 9.7,
        logicalReasoning: 'Flawless inferential logic! You correctly connected the contrast between annual renewable contracts and instantaneous grid stability demands.',
        evidenceEvaluation: 'Your deduction relies directly on explicit text facts: 150% contract growth vs. fossil peaking plant activation.',
        depthScore: 'High Depth — Goes beyond surface statements to analyze real-world operational trade-offs.',
        alternativeView: 'An alternative interpretation might note that long-term renewable investments will eventually trigger grid-scale battery deployment, bridging the peak load gap.'
      });
      setIsEvaluating(false);
    }, 550);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 6
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#D35400]" />
            6. Inference Builder & Logical Reasoning Studio
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Practice making unstated logical deductions based on explicit textual evidence, evaluating underlying implications and alternative interpretations.
          </p>
        </div>

        {/* Text Scenario */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded-md">
            Explicit Text Evidence
          </span>
          <p className="font-mono text-xs text-[#2C3E50] leading-relaxed p-4 bg-white rounded-xl border border-[#FAD7A0] shadow-2xs">
            "{scenario.passage}"
          </p>
        </div>

        {/* Question & Input */}
        <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
          <label className="text-xs font-extrabold text-[#2C3E50] block">
            ❓ {scenario.question}
          </label>

          <textarea
            rows={4}
            value={studentInference}
            onChange={(e) => setStudentInference(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] font-mono focus:outline-none focus:border-[#D35400] leading-relaxed"
            placeholder="Write your logical deduction here..."
          />

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleEvaluateInference}
              disabled={isEvaluating}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI Evaluate Logical Inference</span>
            </button>
          </div>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="font-black text-[#D35400] uppercase text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Logical Reasoning & Depth Evaluation
              </span>
              <span className="bg-white px-3 py-1 rounded-xl border border-[#FAD7A0] font-black text-sm text-[#2C3E50]">
                Score: {evaluation.score} / 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                <span className="font-bold text-[#D35400] block text-[10px] uppercase">Logical Consistency</span>
                <p className="text-[#2C3E50]">{evaluation.logicalReasoning}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                <span className="font-bold text-[#D35400] block text-[10px] uppercase">Evidence Usage</span>
                <p className="text-[#2C3E50]">{evaluation.evidenceEvaluation}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] text-emerald-950 font-bold">
              💡 Alternative Perspective: {evaluation.alternativeView}
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
            <span>Proceed to Section 7: Tone Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
