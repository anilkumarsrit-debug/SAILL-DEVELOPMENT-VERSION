import React, { useState } from 'react';
import { Scale, CheckCircle2, Clock, ShieldCheck, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface DebateFundamentalsSectionProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const DebateFundamentalsSection: React.FC<DebateFundamentalsSectionProps> = ({ onSaveWork }) => {
  const [claim, setClaim] = useState('All first-year engineering students should receive mandatory training in open-source software contribution.');
  const [evidence, setEvidence] = useState('IEEE workforce reports show that 82% of software engineering hiring managers prioritize candidates with public GitHub commit histories.');
  const [reasoning, setReasoning] = useState('Open-source collaboration demonstrates real-world version control, code review etiquette, and peer problem solving beyond textbook theory.');
  const [counterargument, setCounterargument] = useState('Critics argue that open-source repositories expose novice students to public scrutiny and potential cybersecurity errors.');
  const [rebuttal, setRebuttal] = useState('However, structured faculty mentorship in sandbox repositories ensures safe learning without exposing production vulnerabilities.');
  const [closing, setClosing] = useState('Therefore, adopting mandatory open-source lab modules directly elevates student employability while preserving academic safety.');

  const [isSaved, setIsSaved] = useState(false);

  const fundamentalsList = [
    {
      title: '1. Claim',
      desc: 'The clear, assertive statement of your position on the debate motion.',
      example: 'SRIT should mandate solar power integration across all engineering blocks.',
      color: 'border-l-4 border-l-[#D35400]'
    },
    {
      title: '2. Evidence',
      desc: 'Concrete data, peer-reviewed statistics, case studies, or official standards.',
      example: 'Solar adoption cuts campus electricity costs by 40% based on MNRE data.',
      color: 'border-l-4 border-l-[#E67E22]'
    },
    {
      title: '3. Reasoning',
      desc: 'The logical bridge connecting your evidence to your claim.',
      example: 'Lower utility costs free up capital for advanced engineering laboratory equipment.',
      color: 'border-l-4 border-l-[#F39C12]'
    },
    {
      title: '4. Counterargument',
      desc: 'Anticipating the strongest logical objection from your opponent.',
      example: 'Opponents argue initial installation costs require high capital expenditure.',
      color: 'border-l-4 border-l-slate-600'
    },
    {
      title: '5. Rebuttal',
      desc: 'Deconstructing the opponent counterargument using superior logic or facts.',
      example: 'Government clean energy subsidies offset 60% of upfront capital costs.',
      color: 'border-l-4 border-l-[#27AE60]'
    },
    {
      title: '6. Closing Statement',
      desc: 'A succinct synthesis summarizing key impacts and securing victory.',
      example: 'Therefore, solar integration is both financially prudent and environmentally essential.',
      color: 'border-l-4 border-l-[#2980B9]'
    }
  ];

  const handleSaveCER = () => {
    const content = JSON.stringify({ claim, evidence, reasoning, counterargument, rebuttal, closing }, null, 2);
    if (onSaveWork) {
      onSaveWork(`Debate Fundamentals CER Structure: ${claim.substring(0, 30)}...`, content);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 2
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Debate Fundamentals & CER Blueprint
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Master the six core building blocks of persuasive argumentation: Claim, Evidence, Reasoning, Counterargument, Rebuttal, and Closing Statement.
        </p>
      </div>

      {/* 6 Building Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fundamentalsList.map((item) => (
          <div key={item.title} className={`srit-card p-4 bg-white border border-[#FAD7A0] space-y-2 ${item.color}`}>
            <h3 className="text-sm font-bold text-[#2C3E50] font-heading">{item.title}</h3>
            <p className="text-xs text-[#5D6D7E]">{item.desc}</p>
            <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0]/60 rounded text-[11px] text-[#2C3E50] italic">
              <strong>Example:</strong> "{item.example}"
            </div>
          </div>
        ))}
      </div>

      {/* Debate Etiquette & Time Management Dual Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
          <h3 className="text-sm font-bold text-[#D35400] flex items-center gap-2 font-heading">
            <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
            <span>Debate Etiquette & Respectful Communication</span>
          </h3>
          <ul className="text-xs text-[#2C3E50] space-y-1.5 list-disc list-inside">
            <li>Address arguments, never attack personal characteristics (avoid Ad Hominem).</li>
            <li>Maintain steady eye contact and confident body posture.</li>
            <li>Use polite parliamentary phrases: "My worthy opponent claims...", "We respectfully point out...".</li>
            <li>Listen actively without interrupting during the opponent's speaking allocation.</li>
          </ul>
        </div>

        <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
          <h3 className="text-sm font-bold text-[#D35400] flex items-center gap-2 font-heading">
            <Clock className="w-4 h-4 text-[#E67E22]" />
            <span>Time Management Allocation</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
              <span className="font-bold text-[#2C3E50]">Opening Speech:</span>
              <span className="font-mono text-[#D35400] font-bold">2.0 Minutes</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
              <span className="font-bold text-[#2C3E50]">Rebuttal Speech:</span>
              <span className="font-mono text-[#D35400] font-bold">1.5 Minutes</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
              <span className="font-bold text-[#2C3E50]">Closing Statement:</span>
              <span className="font-mono text-[#D35400] font-bold">1.0 Minute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CER Builder Workspace */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-base font-bold text-[#D35400] font-heading">
              Interactive CER Argument Construction Sandbox
            </h3>
          </div>
          <button
            onClick={handleSaveCER}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaved ? 'Saved to Notebook & Portfolio!' : 'Save Argument Blueprint'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">1. Claim (Your Position):</label>
              <textarea
                rows={2}
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">2. Evidence (Data/Facts):</label>
              <textarea
                rows={2}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">3. Reasoning (Logical Bridge):</label>
              <textarea
                rows={2}
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">4. Counterargument (Opponent View):</label>
              <textarea
                rows={2}
                value={counterargument}
                onChange={(e) => setCounterargument(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">5. Rebuttal (Refutation):</label>
              <textarea
                rows={2}
                value={rebuttal}
                onChange={(e) => setRebuttal(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">6. Closing Impact Statement:</label>
              <textarea
                rows={2}
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
