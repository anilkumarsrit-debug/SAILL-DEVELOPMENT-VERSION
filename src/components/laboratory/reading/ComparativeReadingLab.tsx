import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ArrowRight, GitCompare, RefreshCw } from 'lucide-react';

interface ComparativeReadingLabProps {
  onCompleteActivity: () => void;
}

export const ComparativeReadingLab: React.FC<ComparativeReadingLabProps> = ({ onCompleteActivity }) => {
  const passageA = {
    title: 'Perspective A: Centralized Cloud Infrastructure',
    text: 'Centralized hyperscale cloud architecture provides supreme economies of scale, unified security governance, and automated multi-tenant resource management. By consolidating compute loads in mega data centers, enterprises achieve 99.999% SLA uptime and seamless compliance audits.'
  };

  const passageB = {
    title: 'Perspective B: Decentralized Edge & Peer Computing',
    text: 'Over-reliance on centralized cloud monopolies creates single points of failure, data sovereignty risks, and intolerable network latency for real-time edge robotics. Decentralized peer-to-peer compute protocols distribute data sovereignty and eliminate bandwidth choke points.'
  };

  const [comparisonInputs, setComparisonInputs] = useState<Record<string, string>>({
    purpose: 'Passage A aims to justify centralized cloud reliability, while Passage B argues for decentralized edge autonomy.',
    tone: 'Passage A is authoritative and corporate-focused; Passage B is critical of cloud monopolies and advocates for decentralization.',
    arguments: 'Cloud economies of scale vs. Edge latency reduction and data sovereignty.',
    evidence: 'Uptime SLAs (99.999%) vs. Network bandwidth latency bottlenecks.'
  });

  const [aiResult, setAiResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluateComparison = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setAiResult({
        score: 9.8,
        feedback:
          'Excellent comparative analysis! You pinpointed the tension between central governance (Passage A) and operational latency/sovereignty (Passage B) with high precision.'
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
              Section 10
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#D35400]" />
            10. Comparative Technical Reading & Synthesis Lab
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Compare two technical passages side-by-side to evaluate contrasting perspectives, argumentation styles, evidence strength, and underlying assumptions.
          </p>
        </div>

        {/* Side-by-side Passages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-2">
            <span className="font-extrabold text-[#D35400] block text-[11px] uppercase">{passageA.title}</span>
            <p className="font-mono text-[#2C3E50] leading-relaxed p-3 bg-white rounded-xl border border-[#FAD7A0]">{passageA.text}</p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-2">
            <span className="font-extrabold text-[#D35400] block text-[11px] uppercase">{passageB.title}</span>
            <p className="font-mono text-[#2C3E50] leading-relaxed p-3 bg-white rounded-xl border border-[#FAD7A0]">{passageB.text}</p>
          </div>
        </div>

        {/* Synthesis Comparison Matrix */}
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-[#2C3E50]">Comparative Synthesis Matrix:</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <label className="font-extrabold text-[#D35400] uppercase block">1. Contrast in Purpose & Intent:</label>
              <textarea
                rows={2}
                value={comparisonInputs.purpose}
                onChange={(e) => setComparisonInputs({ ...comparisonInputs, purpose: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
              />
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <label className="font-extrabold text-[#D35400] uppercase block">2. Tone & Style Contrast:</label>
              <textarea
                rows={2}
                value={comparisonInputs.tone}
                onChange={(e) => setComparisonInputs({ ...comparisonInputs, tone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
              />
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <label className="font-extrabold text-[#D35400] uppercase block">3. Core Technical Arguments:</label>
              <textarea
                rows={2}
                value={comparisonInputs.arguments}
                onChange={(e) => setComparisonInputs({ ...comparisonInputs, arguments: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
              />
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <label className="font-extrabold text-[#D35400] uppercase block">4. Evidence Quality Comparison:</label>
              <textarea
                rows={2}
                value={comparisonInputs.evidence}
                onChange={(e) => setComparisonInputs({ ...comparisonInputs, evidence: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleEvaluateComparison}
              disabled={isEvaluating}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI Evaluate Comparative Synthesis</span>
            </button>
          </div>

          {aiResult && (
            <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-2 animate-in fade-in duration-200 text-xs">
              <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                <span className="font-black text-[#D35400] uppercase text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Synthesis Feedback
                </span>
                <span className="bg-white px-3 py-1 rounded-xl border border-[#FAD7A0] font-black text-sm text-[#2C3E50]">
                  Score: {aiResult.score} / 10
                </span>
              </div>
              <p className="text-[#2C3E50]">{aiResult.feedback}</p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 11: Performance Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
