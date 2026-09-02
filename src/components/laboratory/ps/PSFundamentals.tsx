import React, { useState } from 'react';
import { Presentation, Layout, Anchor, MessageSquare, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export const PSFundamentals: React.FC = () => {
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);

  const hooks = [
    {
      type: '1. Surprising Statistic Hook',
      example: '"Over 68% of data breach incidents occur not due to sophisticated hackers, but due to unpatched software dependencies."',
      purpose: 'Creates immediate urgency and grounds complex technical topics in alarming real-world facts.'
    },
    {
      type: '2. Rhetorical Question Hook',
      example: '"What if your mobile app could process cloud AI inference in under 10 milliseconds without draining user battery?"',
      purpose: 'Engages audience curiosity and sets up your solution as the direct answer to an intriguing question.'
    },
    {
      type: '3. Storytelling Narrative Hook',
      example: '"Last semester, during our 24-hour hackathon, our database server crashed at 3 AM with 5,000 active users..."',
      purpose: 'Humanizes technical engineering efforts and builds emotional resonance before diving into code.'
    },
    {
      type: '4. Live Demonstration Hook',
      example: '"Before I explain our smart grid architecture, observe how this sensor automatically adjusts voltage in 2 seconds..."',
      purpose: 'Provides tangible evidence and instantly captures high audience visual attention.'
    }
  ];

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 3: Core Presentation Fundamentals & Slide Mechanics
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Master the 3-part presentation architecture, high-impact opening hooks, and slide design principles.
          </p>
        </div>
      </div>

      {/* 3-Part Architecture Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <Layout className="w-4 h-4" />
          <span>The 3-Part Technical Presentation Structure</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D35400] uppercase text-[11px]">Part 1: The Hook (15-20%)</span>
              <span className="text-[10px] font-mono text-[#5D6D7E]">0:00 - 0:45</span>
            </div>
            <h5 className="font-extrabold text-[#2C3E50]">Problem & Context Setup</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Grab immediate audience attention, define the core technical problem scope, and state your central value proposition.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D35400] uppercase text-[11px]">Part 2: The Body (65-70%)</span>
              <span className="text-[10px] font-mono text-[#5D6D7E]">0:45 - 2:30</span>
            </div>
            <h5 className="font-extrabold text-[#2C3E50]">Architecture & Key Evidence</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Deliver 2-3 logical core points supported by architecture diagrams, benchmark graphs, and signpost transitions ("Furthermore...", "Turning to empirical results...").
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D35400] uppercase text-[11px]">Part 3: Conclusion (10-15%)</span>
              <span className="text-[10px] font-mono text-[#5D6D7E]">2:30 - 3:00</span>
            </div>
            <h5 className="font-extrabold text-[#2C3E50]">Synthesis & Call to Action</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Summarize major findings in one memorable sentence, issue a clear call to action or project next steps, and invite audience Q&A.
            </p>
          </div>
        </div>
      </div>

      {/* Opening Hook Interactive Selector */}
      <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-4">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-[#D35400]" />
          <span>Interactive Opening Hook Techniques</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {hooks.map((h, i) => (
            <button
              key={i}
              onClick={() => setSelectedHookIndex(i)}
              className={`p-2.5 rounded-xl border font-bold text-[11px] transition text-left ${
                selectedHookIndex === i
                  ? 'bg-[#D35400] text-white border-[#D35400]'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {h.type.split(' ')[1]} Hook
            </button>
          ))}
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#D35400] uppercase text-[11px]">
              {hooks[selectedHookIndex].type}
            </span>
            <span className="text-[10px] font-mono text-[#5D6D7E]">Opening Sample</span>
          </div>

          <p className="text-sm font-mono text-[#2C3E50] italic bg-white p-3 rounded-lg border border-[#FAD7A0]">
            {hooks[selectedHookIndex].example}
          </p>

          <p className="text-xs text-[#5D6D7E] leading-snug">
            <strong>Why it works:</strong> {hooks[selectedHookIndex].purpose}
          </p>
        </div>
      </div>

      {/* Slide Design Principles & 6x6 Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <h5 className="font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Slide Design Best Practices (The 6x6 Rule)</span>
          </h5>
          <ul className="space-y-2 text-emerald-950 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span><strong>6x6 Rule:</strong> Maximum 6 bullet points per slide, and maximum 6 words per bullet point.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span><strong>High Contrast:</strong> Dark text on light background or crisp white text on deep navy slides.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span><strong>Visual First:</strong> Replace dense text paragraphs with high-resolution architecture diagrams and data charts.</span>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <h5 className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Common Slide Pitfalls to Avoid</span>
          </h5>
          <ul className="space-y-2 text-amber-950 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700 shrink-0">•</span>
              <span><strong>Reading Slides Word-for-Word:</strong> Slides are visual aids for the audience, not your personal teleprompter.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700 shrink-0">•</span>
              <span><strong>Overused Animations:</strong> Avoid distracting spin/fly-in text transitions that break speaker rhythm.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700 shrink-0">•</span>
              <span><strong>Low Font Legibility:</strong> Ensure minimum 24pt font size for body text so it is readable from the back row.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
