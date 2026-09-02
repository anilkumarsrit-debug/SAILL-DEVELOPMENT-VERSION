import React, { useState } from 'react';
import { PenTool, Sparkles, BookOpen, Bookmark, Share2 } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface PSReflectionJournalProps {
  onSavedAll?: () => void;
}

export const PSReflectionJournal: React.FC<PSReflectionJournalProps> = ({ onSavedAll }) => {
  const [reflection1, setReflection1] = useState<string>(
    'In this simulation, opening with a surprising statistic regarding energy loss immediately anchored audience attention before I introduced the Redis caching layer.'
  );
  const [reflection2, setReflection2] = useState<string>(
    'I maintained an optimal pace of 142 WPM by taking 1-second silent pauses between major points instead of using filler pause words like "um" or "you know".'
  );
  const [reflection3, setReflection3] = useState<string>(
    'Using the PREP framework during the Q&A session helped me state a direct technical point before diving into project benchmarks, keeping my answers concise.'
  );

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveReflectionAndNotebook = async () => {
    setIsSaving(true);
    try {
      await dbStorage.savePortfolioItem({
        id: 'exp-ps-reflection-' + Date.now(),
        moduleId: 'public-speaking',
        moduleTitle: 'Public Speaking & Presentations',
        title: 'Module 5 Public Speaking Reflection Journal & Lab Record',
        category: 'reflection',
        content: `Reflection 1: ${reflection1}\n\nReflection 2: ${reflection2}\n\nReflection 3: ${reflection3}`,
        score: 9.6,
        createdAt: new Date().toISOString()
      });

      setIsSaving(false);
      setIsSaved(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      if (onSavedAll) onSavedAll();
    } catch (err) {
      console.error('Failed saving reflection', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 12, 13 & 14: Guided Student Reflection & Laboratory Notebook Auto-Sync
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Reflect on your public speaking delivery and automatically update your SRIT SAILL Digital Laboratory Notebook and Portfolio.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Prompt 1 */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">
            1. How effectively did you structure your opening hook and 3 core architecture points?
          </label>
          <textarea
            rows={2}
            value={reflection1}
            onChange={(e) => setReflection1(e.target.value)}
            className="w-full p-3 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400]"
          />
        </div>

        {/* Prompt 2 */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">
            2. What vocal modulation or pause strategies helped you control speech rate and reduce fillers?
          </label>
          <textarea
            rows={2}
            value={reflection2}
            onChange={(e) => setReflection2(e.target.value)}
            className="w-full p-3 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400]"
          />
        </div>

        {/* Prompt 3 */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">
            3. How confident were you during the AI Audience Q&A session using the PREP response framework?
          </label>
          <textarea
            rows={2}
            value={reflection3}
            onChange={(e) => setReflection3(e.target.value)}
            className="w-full p-3 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400]"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSaveReflectionAndNotebook}
          disabled={isSaving}
          className={`w-full py-3 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-2xs ${
            isSaved ? 'bg-emerald-600' : 'bg-[#D35400] hover:bg-[#E67E22]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isSaving
              ? 'Syncing Lab Notebook & Portfolio...'
              : isSaved
              ? 'Lab Notebook & Portfolio Updated Successfully ✓'
              : 'Save Reflection & Sync Laboratory Notebook / Portfolio'}
          </span>
        </button>
      </div>
    </div>
  );
};
