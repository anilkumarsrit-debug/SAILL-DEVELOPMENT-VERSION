import React from 'react';
import { Mic, Award, Target, Sparkles, BookOpen, Shield, Layers, Upload, Users, Presentation, CheckCircle2 } from 'lucide-react';

interface PSIntroductionProps {
  onProceedToLibrary: () => void;
  onProceedToStudio: () => void;
}

export const PSIntroduction: React.FC<PSIntroductionProps> = ({
  onProceedToLibrary,
  onProceedToStudio
}) => {
  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white rounded-2xl border border-[#FAD7A0] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAD7A0] bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                SRIT SAILL R26 • Module 5
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D35400] text-white px-2.5 py-1 rounded-md">
                10-Mark Framework
              </span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white">
              AI-Powered Public Speaking & Presentation Skills
            </h2>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              Master technical presentation delivery, vocal modulation, audience engagement, and confident Q&A handling for campus placement drives, academic seminars, and corporate client proposals.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={onProceedToStudio}
              className="px-4 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Speech Studio</span>
            </button>
            <button
              onClick={onProceedToLibrary}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/10"
            >
              <BookOpen className="w-4 h-4" />
              <span>Watch Video Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview & Key Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold">
            <Target className="w-4 h-4" />
            <h3 className="font-heading text-sm">Stage Fear vs. Stage Presence</h3>
          </div>
          <p className="text-[#5D6D7E] leading-relaxed">
            Glossophobia affects over 75% of engineering students. Learn proven breathing anchors, eye-contact triangle scanning, and structured outline prompters to transform anxiety into dynamic stage energy.
          </p>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold">
            <Presentation className="w-4 h-4" />
            <h3 className="font-heading text-sm">Purposes of Presentation</h3>
          </div>
          <p className="text-[#5D6D7E] leading-relaxed">
            Understand how to tailor speeches for specific outcomes: <strong>Inform</strong> (technical paper defense), <strong>Persuade</strong> (corporate architecture proposal), <strong>Inspire</strong> (motivational talk), or <strong>Demonstrate</strong> (product pitch).
          </p>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold">
            <Award className="w-4 h-4" />
            <h3 className="font-heading text-sm">10-Mark SAILL Assessment</h3>
          </div>
          <p className="text-[#5D6D7E] leading-relaxed">
            Evaluated rigorously across 5 core categories (2.0 Marks each): <strong>Organization</strong>, <strong>Content</strong>, <strong>Delivery</strong>, <strong>Language</strong>, and <strong>Confidence & Audience Engagement</strong>.
          </p>
        </div>
      </div>

      {/* 5 Core SAILL Evaluation Criteria Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
          <h3 className="text-sm font-extrabold text-[#2C3E50] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D35400]" />
            <span>SAILL 10-Mark Assessment Criteria Breakdown (2.0 Marks Each)</span>
          </h3>
          <span className="text-xs font-mono font-bold text-[#D35400]">Total: 10.0 Marks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { title: '1. Organization', mark: '2.0 Marks', desc: 'Opening hook, logical transitions, slide hierarchy, and strong conclusion.' },
            { title: '2. Content', mark: '2.0 Marks', desc: 'Domain depth, factual reasoning, problem-solution alignment, and data precision.' },
            { title: '3. Delivery', mark: '2.0 Marks', desc: 'Pace (130-150 WPM), vocal modulation, volume projection, and minimal filler words.' },
            { title: '4. Language', mark: '2.0 Marks', desc: 'Technical vocabulary, syntactical accuracy, signpost markers, and clarity.' },
            { title: '5. Confidence', mark: '2.0 Marks', desc: 'Stage presence, eye contact, body posture, and calm handling of audience Q&A.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#2C3E50] text-[11px]">{item.title}</span>
                <span className="text-[#D35400] font-mono font-black">{item.mark}</span>
              </div>
              <p className="text-[10px] text-[#5D6D7E] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Extensible Future Readiness Badges */}
      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <Layers className="w-4 h-4 text-[#D35400]" />
          <span>Extensible Laboratory Architecture (Future Capability Readiness)</span>
        </div>
        <p className="text-amber-950 text-[11px] leading-relaxed">
          Designed for seamless upcoming integration of PPT slide upload & AI slide evaluation, live faculty assessment portals, peer-to-peer review channels, startup pitch practice, research paper defenses, and conference simulations.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'PPT Upload & AI Slide Review',
            'Live Faculty Portal',
            'Peer Review Network',
            'Startup Pitch Mode',
            'Conference Defense'
          ].map((badge, idx) => (
            <span key={idx} className="bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#D35400]" />
              <span>{badge}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
