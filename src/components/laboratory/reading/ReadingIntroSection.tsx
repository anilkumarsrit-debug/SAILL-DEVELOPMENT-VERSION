import React from 'react';
import { BookOpen, CheckCircle2, ArrowRight, ShieldCheck, Zap, Briefcase, GraduationCap, Brain } from 'lucide-react';

interface ReadingIntroSectionProps {
  onCompleteActivity: () => void;
}

export const ReadingIntroSection: React.FC<ReadingIntroSectionProps> = ({ onCompleteActivity }) => {
  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 1
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            1. Introduction to Reading Comprehension & Critical Thinking
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Master the core principles of academic and technical reading, critical inquiry, logical inference, and high-efficiency text analysis required for engineering excellence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: Purpose of Reading Comprehension */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#D35400] font-extrabold text-sm">
              <Brain className="w-4 h-4 shrink-0" />
              <span>Purpose of Reading Comprehension</span>
            </div>
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              Reading comprehension is not merely decoding words—it is the cognitive process of decoding syntax, extracting central ideas, evaluating evidence, making logical inferences, and integrating new knowledge into existing technical frameworks.
            </p>
          </div>

          {/* Pillar 2: Academic Reading vs Workplace Reading */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#D35400] font-extrabold text-sm">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Academic vs. Corporate Reading</span>
            </div>
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              <strong>Academic Reading:</strong> Analyzes theoretical concepts, methodology, and peer-reviewed research papers.<br />
              <strong>Workplace Reading:</strong> Scans technical documentation, API specifications, RFC standards, and executive summaries to solve operational bottlenecks rapidly.
            </p>
          </div>

          {/* Pillar 3: Critical Thinking in Reading */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#D35400] font-extrabold text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Critical Thinking in Reading</span>
            </div>
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              Critical readers question assumptions, differentiate empirical facts from author bias, verify logical consistency between premises and conclusions, and identify potential flaws or missing evidence in arguments.
            </p>
          </div>

          {/* Pillar 4: Reading Efficiently */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#D35400] font-extrabold text-sm">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Reading Efficiently (Speed & Precision)</span>
            </div>
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              Engineering professionals process high volumes of information daily. Reading efficiently involves dynamic shifting between <em>Skimming</em> (overview at 350+ WPM), <em>Scanning</em> (data targeting), and <em>Deep Analysis</em> (critical comprehension).
            </p>
          </div>
        </div>

        {/* Guided Strategy Case Study Example */}
        <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <span className="text-xs font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#FAD7A0]">
              Demonstration Example: Effective Strategy Application
            </span>
            <span className="text-[10px] text-[#5D6D7E] font-bold">R26 Benchmark Passage</span>
          </div>

          <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] leading-relaxed">
            "Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform calculations exponentially faster than classical supercomputers for specific cryptographic and optimization algorithms. However, decoherence remains the primary engineering hurdle before fault-tolerant quantum hardware can be deployed commercially."
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-bold text-[#D35400] block text-[10px] uppercase">1. Main Idea</span>
              <p className="text-[#2C3E50]">Quantum computing offers exponential speedup, but decoherence hinders commercial deployment.</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-bold text-[#D35400] block text-[10px] uppercase">2. Logical Inference</span>
              <p className="text-[#2C3E50]">Commercial readiness depends on solving hardware stability and noise suppression (decoherence).</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-bold text-[#D35400] block text-[10px] uppercase">3. Author Tone</span>
              <p className="text-[#2C3E50]">Objective and balanced—highlights both potential breakthroughs and technical challenges.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold">
            Understand the core strategies? Proceed to Section 2: Reading Strategy Studio.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 2: Reading Strategy Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
