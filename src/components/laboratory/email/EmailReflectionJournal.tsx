import React, { useState, useEffect } from 'react';
import { BookMarked, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { indexedDBStorage } from '../../../lib/db';

interface EmailReflectionJournalProps {
  onCompleteActivity: () => void;
}

export const EmailReflectionJournal: React.FC<EmailReflectionJournalProps> = ({ onCompleteActivity }) => {
  const [q1Learned, setQ1Learned] = useState<string>(
    'I learned how to format bracketed subject lines with category tags like [Request] and [Submission], and how to structure formal emails with clear opening purpose statements.'
  );
  const [q2Mistakes, setQ2Mistakes] = useState<string>(
    'In earlier drafts, I tended to use informal greetings ("Hi sir") and omitted my roll number and branch in the signature block.'
  );
  const [q3Improve, setQ3Improve] = useState<string>(
    'I can improve my email writing by using action verbs like "spearheaded" and "implemented", and using modal phrasing like "I would appreciate your approval" when making requests.'
  );
  const [q4Next, setQ4Next] = useState<string>(
    'I will practice writing formal cold email inquiries to IT company recruiters on LinkedIn and drafting technical complaint emails for campus facilities.'
  );

  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const loadReflection = () => {
      try {
        const savedStr = localStorage.getItem('email_reflection_journal');
        if (savedStr) {
          const saved = JSON.parse(savedStr);
          if (saved.q1) setQ1Learned(saved.q1);
          if (saved.q2) setQ2Mistakes(saved.q2);
          if (saved.q3) setQ3Improve(saved.q3);
          if (saved.q4) setQ4Next(saved.q4);
        }
      } catch (e) {
        console.error('Failed to load reflection', e);
      }
    };
    loadReflection();
  }, []);

  const handleSaveReflection = () => {
    try {
      localStorage.setItem('email_reflection_journal', JSON.stringify({
        q1: q1Learned,
        q2: q2Mistakes,
        q3: q3Improve,
        q4: q4Next,
        date: new Date().toISOString()
      }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error('Failed to save reflection', e);
    }
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
            <BookMarked className="w-5 h-5 text-[#D35400]" />
            10. Reflection Journal (Metacognitive Self-Assessment)
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Record your personal insights, areas of growth, and future practice goals for formal business writing.
          </p>
        </div>

        {/* 4 Reflection Prompt Cards */}
        <div className="space-y-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block">
              1. What key email structure or netiquette principles did I learn today?
            </label>
            <textarea
              value={q1Learned}
              onChange={(e) => setQ1Learned(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] leading-relaxed focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block">
              2. What common mistakes or tone errors did I identify in my initial drafts?
            </label>
            <textarea
              value={q2Mistakes}
              onChange={(e) => setQ2Mistakes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] leading-relaxed focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block">
              3. How can I improve my professional diction and modal phrasing?
            </label>
            <textarea
              value={q3Improve}
              onChange={(e) => setQ3Improve(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] leading-relaxed focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block">
              4. What specific email writing task will I practice next for campus placements?
            </label>
            <textarea
              value={q4Next}
              onChange={(e) => setQ4Next(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] leading-relaxed focus:outline-none focus:border-[#D35400]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-3">
          <button
            type="button"
            onClick={handleSaveReflection}
            className="px-5 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Journal Entry to IndexedDB
          </button>

          {isSaved && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Reflection Saved Successfully!
            </span>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Review automatically logged email submission history in Section 11 (Laboratory Notebook).
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Laboratory Notebook <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
