import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, User, Smile, Eye, MessageSquare, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';

export const GDRulesEtiquette: React.FC = () => {
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const dosAndDonts = {
    dos: [
      'Maintain inclusive eye contact with all participants, not just the evaluator.',
      'Listen actively and take concise brief notes during peer turns.',
      'Use diplomatic transition phrases ("I appreciate that point, and I would add...")',
      'Encourage hesitant or silent members to contribute.',
      'Synthesize key group arguments near the end of the session.'
    ],
    donts: [
      'Do not interrupt peers mid-sentence aggressively.',
      'Do not look directly at the HR evaluator for approval while speaking.',
      'Do not raise your voice or engage in personal attacks.',
      'Do not repeat points already discussed without adding fresh insights.',
      'Do not use slang, informal abbreviations, or aggressive posture.'
    ]
  };

  const bodyLanguageTips = [
    { title: 'Seating Posture', desc: 'Sit upright leaning slightly forward to convey active interest. Avoid slouching or folding arms defensively.' },
    { title: 'Eye Contact Triangle', desc: 'Distribute eye contact across all peers in an arc. This demonstrates group ownership rather than speaking to an audience.' },
    { title: 'Hand Gestures', desc: 'Use open-palm natural gestures at chest height to emphasize points. Avoid pointing fingers directly at peers.' },
    { title: 'Voice Pitch & Pace', desc: 'Speak at 130–150 WPM with steady pitch. Lower your pitch slightly during disagreement to sound authoritative rather than emotional.' }
  ];

  const quizQuestions = [
    {
      q: 'Where should your eye contact be directed while speaking in a GD?',
      options: ['Exclusively at the evaluator', 'Spread across all group members', 'At your notebook'],
      correct: 1
    },
    {
      q: 'If two peers are arguing loudly, what is the best leadership action?',
      options: ['Join the argument to win', 'Politely intervene to restore focus on the core topic', 'Remain silent'],
      correct: 1
    }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 5;
    });
    setQuizScore(score);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 5: Group Discussion Rules, Body Language & Etiquette
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Master professional workplace posture, diplomatic conflict resolution, and non-verbal communication cues.
          </p>
        </div>
      </div>

      {/* Do's and Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Do's */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <h4 className="font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>GD Do's (High Marks)</span>
          </h4>
          <ul className="space-y-1.5 text-emerald-950 text-[11px]">
            {dosAndDonts.dos.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
          <h4 className="font-extrabold text-rose-900 flex items-center gap-1.5 uppercase text-xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>GD Don'ts (Penalties)</span>
          </h4>
          <ul className="space-y-1.5 text-rose-950 text-[11px]">
            {dosAndDonts.donts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Body Language Guidelines */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#D35400]" />
          <span>Non-Verbal Body Language & Spatial Dynamics</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {bodyLanguageTips.map((tip, idx) => (
            <div key={idx} className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="font-extrabold text-[#D35400] text-xs block">{tip.title}</span>
              <p className="text-[11px] text-[#2C3E50] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Etiquette Diagnostic Quiz */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
        <h4 className="font-extrabold text-[#2C3E50] uppercase text-xs flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#D35400]" />
          <span>Quick Etiquette Diagnostic Check</span>
        </h4>

        <div className="space-y-3">
          {quizQuestions.map((q, qIdx) => (
            <div key={qIdx} className="space-y-1.5">
              <span className="font-bold text-[#2C3E50] block">{qIdx + 1}. {q.q}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      selectedAnswers[qIdx] === oIdx
                        ? 'bg-[#D35400] text-white border-[#D35400] font-bold'
                        : 'bg-white border-slate-200 text-[#2C3E50] hover:bg-amber-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleQuizSubmit}
          className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition shadow-2xs"
        >
          Check Diagnostic Results
        </button>

        {quizScore !== null && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Diagnostic Result: {quizScore} / 10 Marks! You have strong GD etiquette awareness.</span>
          </div>
        )}
      </div>
    </div>
  );
};
