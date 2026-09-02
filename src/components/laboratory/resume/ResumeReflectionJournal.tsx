import React, { useState, useEffect } from 'react';
import { BookMarked, Save, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ResumeReflectionJournalProps {
  onCompleteActivity: () => void;
}

export const ResumeReflectionJournal: React.FC<ResumeReflectionJournalProps> = ({ onCompleteActivity }) => {
  const [q1, setQ1] = useState<string>('I replaced passive phrases ("worked on") with strong engineering action verbs ("Engineered", "Optimized") and added percentage metrics to project bullet points.');
  const [q2, setQ2] = useState<string>('Formulating quantified impact metrics for course projects without existing user data was the most challenging step.');
  const [q3, setQ3] = useState<string>('I will add my upcoming summer internship experience, complete the NPTEL Java certification, and hyperlink my active GitHub project repositories.');

  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedStr = localStorage.getItem('srit_resume_reflection_journal');
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (parsed.q1) setQ1(parsed.q1);
        if (parsed.q2) setQ2(parsed.q2);
        if (parsed.q3) setQ3(parsed.q3);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveReflection = () => {
    try {
      localStorage.setItem('srit_resume_reflection_journal', JSON.stringify({ q1, q2, q3, date: new Date().toISOString() }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
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
            10. Student Reflection Journal
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Reflect on your resume drafting journey, action verb improvements, ATS optimization, and personal career development goals.
          </p>
        </div>

        {/* Reflection Questions Form */}
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              1. What did I improve in my resume today?
            </label>
            <textarea
              rows={3}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              2. Which section was the most difficult to draft and why?
            </label>
            <textarea
              rows={3}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              3. How will I improve my resume further before campus placement drives?
            </label>
            <textarea
              rows={3}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#5D6D7E] italic">
              Reflections are automatically synced to your digital SRIT Laboratory Notebook.
            </span>

            <button
              type="button"
              onClick={handleSaveReflection}
              className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Reflection Saved!' : 'Save Journal Entry'}</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 11: Laboratory Notebook</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
