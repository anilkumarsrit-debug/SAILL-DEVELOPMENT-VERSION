import React from 'react';
import { Users, BookOpen, Award, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

interface GDOverviewSectionProps {
  onProceedToDemo?: () => void;
  onProceedToNext?: () => void;
}

export const GDOverviewSection: React.FC<GDOverviewSectionProps> = ({ onProceedToDemo, onProceedToNext }) => {
  const roles = [
    {
      title: 'Initiator / Opener',
      icon: '🚀',
      desc: 'Sets the theme, defines key terms, and establishes the group discussion scope without dominating time.',
      phrase: '"Good morning peers, the topic for today is... Let us define its core dimensions..."'
    },
    {
      title: 'Contributor / Analyst',
      icon: '💡',
      desc: 'Provides substantive data points, technical examples, logical arguments, and fresh angles.',
      phrase: '"Adding to that perspective, industry telemetry data indicates a 40% efficiency boost..."'
    },
    {
      title: 'Harmonizer / Mediator',
      icon: '🤝',
      desc: 'Resolves conflicts diplomatically, bridges opposing views, and maintains a polite group atmosphere.',
      phrase: '"Both points are valid. While Rohan highlights security, Ananya focuses on user experience..."'
    },
    {
      title: 'Summarizer / Synthesizer',
      icon: '📋',
      desc: 'Consolidates key group arguments into a unified consensus near the end of the allocated time.',
      phrase: '"To summarize our discussion, our team broadly arrived at three key recommendations..."'
    }
  ];

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 1: Introduction to Group Discussion Techniques & Dynamics
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            A Group Discussion (GD) is a collaborative problem-solving assessment evaluated under the SRIT SAILL 10-Mark Framework.
          </p>
        </div>
        <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0] self-start sm:self-auto">
          SRIT R26 Code: R26-ENG-L104
        </span>
      </div>

      {/* Purpose & Campus Placement Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
          <span className="font-extrabold text-[#D35400] uppercase block text-[11px] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#D35400]" />
            <span>Why Corporates Use GDs</span>
          </span>
          <p className="text-[#2C3E50] leading-relaxed text-[11px]">
            Recruiters use GDs during campus drives to filter candidates on <strong className="text-[#D35400]">team communication</strong>, critical thinking, listening skills, and emotional intelligence under time constraints.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
          <span className="font-extrabold text-[#D35400] uppercase block text-[11px] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#D35400]" />
            <span>GD vs. Debate</span>
          </span>
          <p className="text-[#2C3E50] leading-relaxed text-[11px]">
            In a debate, you fight to win an argument. In a GD, <strong className="text-[#D35400]">you collaborate to reach a group consensus</strong>. Aggressiveness leads to rejection, while inclusive diplomacy yields top marks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
          <span className="font-extrabold text-[#D35400] uppercase block text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D35400]" />
            <span>10-Mark Assessment Scale</span>
          </span>
          <p className="text-[#2C3E50] leading-relaxed text-[11px]">
            10 parameters evaluated at 1.0 mark each: Content, Fluency, Confidence, Leadership, Listening, Teamwork, Vocabulary, Grammar, Relevance, Conclusion.
          </p>
        </div>
      </div>

      {/* GD Roles Grid */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Core Strategic Roles in a Group Discussion</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {roles.map((role, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between hover:border-[#FAD7A0] transition shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{role.icon}</span>
                  <span className="font-extrabold text-[#2C3E50] text-xs">{role.title}</span>
                </div>
                <p className="text-[11px] text-[#5D6D7E] leading-normal">{role.desc}</p>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] text-[#D35400] italic">
                {role.phrase}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      {(onProceedToNext || onProceedToDemo) && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onProceedToNext || onProceedToDemo}
            className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Activity 1: GD Phrase & Role Matching</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
