import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, FileText, Building2, GraduationCap, Award } from 'lucide-react';

export const IntroductionSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 1
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Introduction to Technical Communication
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Technical communication is the backbone of engineering excellence. Learn how to convey complex technical data, experimental procedures, and system designs clearly, objectively, and accurately for academic and industrial stakeholders.
        </p>
      </div>

      {/* 3 Core Spheres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Academic Reports */}
        <div className="srit-card p-5 bg-[#FFF8F0] border border-[#FAD7A0] space-y-2.5">
          <div className="flex items-center gap-2 text-[#D35400]">
            <GraduationCap className="w-5 h-5" />
            <h3 className="text-sm font-bold font-heading">Academic Lab Reports</h3>
          </div>
          <p className="text-xs text-[#2C3E50] leading-relaxed">
            Document scientific hypotheses, experimental procedures, empirical observations, and mathematical calculations according to university and IEEE standards.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
            Format: Lab Manuals & Research Papers
          </span>
        </div>

        {/* Industrial Documentation */}
        <div className="srit-card p-5 bg-[#FFF8F0] border border-[#FAD7A0] space-y-2.5">
          <div className="flex items-center gap-2 text-[#D35400]">
            <Building2 className="w-5 h-5" />
            <h3 className="text-sm font-bold font-heading">Industrial Documentation</h3>
          </div>
          <p className="text-xs text-[#2C3E50] leading-relaxed">
            Provide system manuals, API documentation, standard operating procedures (SOPs), and maintenance guidelines for engineering teams and clients.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
            Format: User Guides & System Architecture
          </span>
        </div>

        {/* Professional Communication */}
        <div className="srit-card p-5 bg-[#FFF8F0] border border-[#FAD7A0] space-y-2.5">
          <div className="flex items-center gap-2 text-[#D35400]">
            <FileText className="w-5 h-5" />
            <h3 className="text-sm font-bold font-heading">Project Reports & Feasibility</h3>
          </div>
          <p className="text-xs text-[#2C3E50] leading-relaxed">
            Synthesize engineering projects, feasibility studies, executive summaries, and testing results for decision-makers and investors.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
            Format: Capstone & Industry Reports
          </span>
        </div>
      </div>

      {/* Comparative Breakdown: Effective vs Ineffective Technical Writing */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-sm font-bold text-[#D35400] font-heading uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-[#E67E22]" />
          <span>Side-by-Side Comparison: Effective vs Ineffective Technical Reports</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ineffective Example */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs border-b border-rose-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Ineffective Technical Writing (Vague & Informal)</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-rose-900 font-mono space-y-1">
              <p className="italic">"We hooked up the circuit board and it got pretty hot after a while. The output waveform looked weird so we tweaked some knobs until it seemed fine."</p>
            </div>
            <ul className="text-[11px] text-rose-800 space-y-1 list-disc list-inside">
              <li><strong>Informal Language:</strong> Uses "pretty hot", "weird", "tweaked knobs".</li>
              <li><strong>Lack of Metrics:</strong> No temperature (°C), voltage, or frequency values provided.</li>
              <li><strong>Subjective Bias:</strong> "seemed fine" is not an engineering measurement.</li>
              <li><strong>First-Person Pronouns:</strong> Uses "We" instead of passive objective voice.</li>
            </ul>
          </div>

          {/* Effective Example */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs border-b border-emerald-200 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Effective Technical Writing (Precise & Objective)</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs text-emerald-900 font-mono space-y-1">
              <p className="italic">"The printed circuit board (PCB) was energized under a 12V DC load. Thermal imaging indicated a temperature rise to 68°C on the voltage regulator after 15 minutes. The harmonic distortion was attenuated by adjusting potentiometer R4 to 2.2 kΩ."</p>
            </div>
            <ul className="text-[11px] text-emerald-800 space-y-1 list-disc list-inside">
              <li><strong>Exact Quantifiers:</strong> Specifies 12V DC, 68°C, 15 minutes, 2.2 kΩ.</li>
              <li><strong>Objective Third-Person:</strong> Uses passive voice suitable for lab reports.</li>
              <li><strong>Domain Vocabulary:</strong> Uses "PCB", "energized", "attenuated", "potentiometer".</li>
              <li><strong>Reproducible Procedure:</strong> Another engineer can replicate the test accurately.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
