import React, { useState } from 'react';
import { Newspaper, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Check, HelpCircle, RefreshCw } from 'lucide-react';

interface EditorialReadingLabProps {
  onCompleteActivity: () => void;
}

export const EditorialReadingLab: React.FC<EditorialReadingLabProps> = ({ onCompleteActivity }) => {
  const editorial = {
    title: 'Editorial: The Imperative of Open-Source AI in Engineering Innovation',
    source: 'Tech Policy Review & Engineering Digest',
    body: `Proprietary AI walled gardens threaten to concentrate technological control in the hands of a few mega-corporations. While proprietary vendors argue that closed weights protect against malicious misuse, history demonstrates that open-source software fosters peer auditability, democratic innovation, and rapid vulnerability patching. 

    If engineering institutions and universities surrender their AI infrastructure to proprietary API endpoints, students and researchers become dependent consumers rather than sovereign creators. We must mandate open-source foundation models in public research laboratories to ensure transparent, reproducible science.`,
    elements: [
      { key: 'viewpoint', label: "Author's Viewpoint", prompt: 'What is the author’s primary stance on open-source AI?' },
      { key: 'purpose', label: "Author's Purpose", prompt: 'Why did the author write this editorial?' },
      { key: 'bias', label: 'Potential Bias / Inclination', prompt: 'What bias or advocacy is evident in the language?' },
      { key: 'evidence', label: 'Supporting Evidence Used', prompt: 'How does the author support their claim?' }
    ]
  };

  const [studentResponses, setStudentResponses] = useState<Record<string, string>>({
    viewpoint: 'The author advocates strongly for open-source AI models in research and academia rather than closed proprietary APIs.',
    purpose: 'To persuade engineering institutions and universities to adopt open foundation models to preserve academic independence.',
    bias: 'Pro-open-source bias, framing corporate proprietary software as a threat to democratic scientific progress.',
    evidence: 'Cites historical precedent where open-source software led to better peer auditability and faster vulnerability patching.'
  });

  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    keyTakeaway: string;
  } | null>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluateEditorial = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvaluation({
        score: 9.6,
        feedback:
          'Outstanding critical editorial breakdown! You accurately identified the author’s persuasive intent, open-source advocacy bias, and historical evidence structure.',
        keyTakeaway:
          'When reading editorials, always distinguish between rhetorical persuasion ("walled gardens", "surrender") and empirical evidence.'
      });
      setIsEvaluating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 4
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#D35400]" />
            4. Editorial Reading Lab & Argument Analysis
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Analyze opinion editorials to evaluate the author's viewpoint, underlying purpose, rhetoric, bias, supporting evidence, and logical conclusions.
          </p>
        </div>

        {/* Editorial Text */}
        <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-sm font-extrabold text-[#2C3E50]">{editorial.title}</h3>
            <span className="text-[10px] font-bold text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
              {editorial.source}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] leading-relaxed whitespace-pre-line shadow-2xs">
            {editorial.body}
          </div>
        </div>

        {/* 6 Analysis Fields */}
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-[#2C3E50]">Editorial Critical Breakdown Worksheet:</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorial.elements.map((elem) => (
              <div key={elem.key} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                <label className="text-xs font-extrabold text-[#D35400] uppercase block">
                  {elem.label}
                </label>
                <p className="text-[11px] text-[#5D6D7E]">{elem.prompt}</p>
                <textarea
                  rows={2}
                  value={studentResponses[elem.key] || ''}
                  onChange={(e) =>
                    setStudentResponses({ ...studentResponses, [elem.key]: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleEvaluateEditorial}
              disabled={isEvaluating}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI Evaluate Editorial Argument Analysis</span>
            </button>
          </div>

          {evaluation && (
            <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 animate-in fade-in duration-200 text-xs">
              <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                <span className="font-black text-[#D35400] uppercase text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Editorial Analysis Rubric Evaluation
                </span>
                <span className="bg-white px-3 py-1 rounded-xl border border-[#FAD7A0] font-black text-sm text-[#2C3E50]">
                  Score: {evaluation.score} / 10
                </span>
              </div>
              <p className="text-[#2C3E50]">{evaluation.feedback}</p>
              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] text-emerald-950 font-bold">
                Key Takeaway: {evaluation.keyTakeaway}
              </div>
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
            <span>Proceed to Section 5: Main Idea Finder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
