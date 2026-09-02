import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Save, Sparkles, PenTool } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface InterviewReflectionJournalProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio?: (title: string, category: string, content: string, score: number) => void;
}

export const InterviewReflectionJournal: React.FC<InterviewReflectionJournalProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  const handleSaveReflection = async () => {
    if (!q1.trim() || !q2.trim() || !q3.trim()) return;
    setIsSaving(true);

    const fullContent = `REFLECTION JOURNAL - MODULE 6: INTERVIEW SKILLS\n\n1. Biggest HR Interview Challenge:\n${q1}\n\n2. STAR Framework Application:\n${q2}\n\n3. Non-Verbal & Vocal Refinements for Placement Drives:\n${q3}\n\nRecorded on: ${new Date().toLocaleDateString('en-IN')}`;

    await dbStorage.savePortfolioItem({
      id: `reflection-int-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      title: 'Interview Skills Reflection Journal Entry',
      category: 'reflection',
      content: fullContent,
      score: 100,
      createdAt: new Date().toISOString()
    });

    if (onSaveToPortfolio) {
      onSaveToPortfolio(
        'Interview Skills Reflection Journal Entry',
        'reflection',
        fullContent,
        10
      );
    }

    setIsSaving(false);
    setSavedLocally(true);
    onCompleteActivity();
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 8
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D35400]" />
              8. Module 6 Reflection Journal
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Document your key takeaways, self-awareness insights, and action plans for upcoming SRIT campus placement drives.
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            Self-Awareness Entry
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#D35400]" />
              1. What was your primary challenge when responding to HR interview questions today?
            </label>
            <textarea
              rows={3}
              value={q1}
              onChange={(e) => {
                setQ1(e.target.value);
                setSavedLocally(false);
              }}
              placeholder="e.g. Concisely summarizing my technical projects in 60 seconds without filler sounds..."
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#D35400]" />
              2. How effectively did you apply the STAR (Situation, Task, Action, Result) framework?
            </label>
            <textarea
              rows={3}
              value={q2}
              onChange={(e) => {
                setQ2(e.target.value);
                setSavedLocally(false);
              }}
              placeholder="e.g. Breaking down my team project conflict into a specific Action phase helped structure my answer logically..."
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#D35400]" />
              3. What specific non-verbal (eye gaze, posture) and voice parameters will you refine?
            </label>
            <textarea
              rows={3}
              value={q3}
              onChange={(e) => {
                setQ3(e.target.value);
                setSavedLocally(false);
              }}
              placeholder="e.g. Maintaining camera-level gaze for 80% of answer delivery and keeping speaking rate steady at 130 WPM..."
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={isSaving || !q1.trim() || !q2.trim() || !q3.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition disabled:opacity-50 ${
                savedLocally
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#D35400] text-white hover:bg-[#B04300]'
              }`}
            >
              {savedLocally ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Journal Saved to Portfolio & IndexedDB
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Reflection Journal Entry'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
