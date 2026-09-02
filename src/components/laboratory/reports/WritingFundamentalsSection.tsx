import React, { useState } from 'react';
import { Target, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export const WritingFundamentalsSection: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState<number>(0);

  const principles = [
    {
      title: '1. Clarity',
      description: 'Express technical ideas directly without convoluted sentence structures or ambiguous pronouns.',
      badExample: 'The system failed due to the fact that there was a lack of power optimization in it.',
      goodExample: 'The system failed due to unoptimized power distribution.',
      tip: 'Eliminate wordy phrases. Replace "due to the fact that" with "because".'
    },
    {
      title: '2. Accuracy',
      description: 'Ensure all mathematical data, units, calculations, and hardware specifications are strictly correct.',
      badExample: 'The motor runs around 1500 speed.',
      goodExample: 'The induction motor operates at 1450 RPM under full-load conditions.',
      tip: 'Always double-check numerical figures, SI units, and component datasheets.'
    },
    {
      title: '3. Precision',
      description: 'Differentiate exact quantitative metrics from general qualitative descriptors.',
      badExample: 'The server response was very fast.',
      goodExample: 'The API endpoint latency averaged 42 ms across 10,000 concurrent requests.',
      tip: 'Replace subjective adjectives ("fast", "heavy", "hot") with quantifiable data.'
    },
    {
      title: '4. Objectivity',
      description: 'Maintain neutral, evidence-backed statements without personal bias or emotional adjectives.',
      badExample: 'I think our amazing algorithm is clearly superior to the terrible legacy system.',
      goodExample: 'Empirical testing indicates the proposed algorithm reduces execution time by 28% compared to the baseline.',
      tip: 'Avoid subjective claims like "amazing" or "terrible". Let data speak.'
    },
    {
      title: '5. Formal Language',
      description: 'Use standard academic English suitable for peer-reviewed journals and technical documentation.',
      badExample: 'Don\'t forget to turn off the power supply before fixing stuff.',
      goodExample: 'Ensure the primary power supply is isolated prior to maintenance.',
      tip: 'Avoid contractions (don\'t, can\'t) and informal terms ("stuff", "guys").'
    },
    {
      title: '6. Technical Vocabulary',
      description: 'Employ correct domain-specific terminology accurately in context.',
      badExample: 'The wire slowed down the current.',
      goodExample: 'The conductor exhibited electrical resistance of 0.45 Ω/m at 20°C.',
      tip: 'Use standard engineering terms like impedance, inductance, protocol, or telemetry.'
    },
    {
      title: '7. Consistency',
      description: 'Maintain uniform terminology, symbol notation, and measurement units across the report.',
      badExample: 'Section 1 uses "sec", Section 2 uses "s", Section 3 uses "seconds".',
      goodExample: 'Consistently use SI abbreviation "s" for seconds and "kW" for kilowatts throughout.',
      tip: 'Define abbreviations upon first usage, e.g. "Pulse Width Modulation (PWM)".'
    },
    {
      title: '8. Formatting',
      description: 'Follow standardized structural layout rules (headings, subheadings, captions, spacing).',
      badExample: 'Unformatted wall of text without headings or paragraph breaks.',
      goodExample: 'Clear 1.0, 1.1 numbered section headings with bold figure captions below diagrams.',
      tip: 'Use 11pt Arial or Times New Roman, 1.15 line spacing, and IEEE numbered headings.'
    },
    {
      title: '9. Professional Conventions',
      description: 'Adhere to institutional guidelines, passive voice in procedures, and standard IEEE references.',
      badExample: 'I searched online and found a blog post.',
      goodExample: 'Literature was reviewed from IEEE Transactions on Power Systems (Smith et al., 2024).',
      tip: 'Cite peer-reviewed sources using formal IEEE bracketed citations [1].'
    }
  ];

  const currentPrinciple = principles[activePrinciple];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 2
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Technical Writing Fundamentals
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Master the 9 foundational principles of technical writing. Explore before-and-after transformations to develop the precision, clarity, and objectivity required in R26 engineering reports.
        </p>
      </div>

      {/* Interactive Principles Grid Navigation */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-xs font-bold text-[#D35400] uppercase tracking-wider font-heading flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
          <span>The 9 Core Technical Writing Principles</span>
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
          {principles.map((p, idx) => (
            <button
              key={p.title}
              onClick={() => setActivePrinciple(idx)}
              className={`p-2.5 rounded-xl border text-center transition font-bold text-xs ${
                activePrinciple === idx
                  ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {p.title.split('.')[1]}
            </button>
          ))}
        </div>

        {/* Selected Principle Breakdown Card */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-[#FAD7A0] pb-2">
            <h4 className="text-base font-bold text-[#D35400] font-heading">{currentPrinciple.title}</h4>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
              Principle {activePrinciple + 1} of 9
            </span>
          </div>

          <p className="text-xs text-[#2C3E50] font-medium leading-relaxed">
            {currentPrinciple.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Avoid (Non-Technical)
              </span>
              <p className="text-xs text-rose-900 font-serif italic">"{currentPrinciple.badExample}"</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Recommended (Engineering Standard)
              </span>
              <p className="text-xs text-emerald-900 font-serif italic">"{currentPrinciple.goodExample}"</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D35400] shrink-0" />
            <span><strong>Engineering Rule:</strong> {currentPrinciple.tip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
