import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Bookmark, Share2, Sparkles, PenTool } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface GDReflectionNotebookProps {
  onSavedAll?: () => void;
}

export const GDReflectionNotebook: React.FC<GDReflectionNotebookProps> = ({ onSavedAll }) => {
  const [reflection1, setReflection1] = useState<string>(
    'During the AI GD simulator, I focused on opening with a balanced definition rather than taking an extreme binary stance early. Using phrases like "Let us define the core scope" helped establish structure.'
  );
  const [reflection2, setReflection2] = useState<string>(
    'I successfully used diplomatic rebuttal ("I appreciate that point, however...") to address AI Peer Rohan\'s argument on cost without sounding aggressive.'
  );
  const [reflection3, setReflection3] = useState<string>(
    'For future campus placement drives, I plan to actively invite quiet peers to gain higher leadership and teamwork marks.'
  );

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveReflectionAndNotebook = async () => {
    setIsSaving(true);
    try {
      await dbStorage.savePortfolioItem({
        id: 'exp-gd-reflection-' + Date.now(),
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion Techniques',
        title: 'Module 4 GD Reflection Journal & Lab Record',
        category: 'reflection',
        content: `Reflection 1: ${reflection1}\n\nReflection 2: ${reflection2}\n\nReflection 3: ${reflection3}`,
        score: 9.5,
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
              Section 9 & 10: Guided Student Reflection & Laboratory Notebook Auto-Sync
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Reflect on your GD strategies and automatically update your SRIT SAILL Digital Laboratory Notebook and Portfolio.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Prompt 1 */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">
            1. How effectively did you initiate or frame the discussion topic scope?
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
            2. How well did you handle diplomatic rebuttals or opposing views from peers?
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
            3. What specific action will you take in your next campus recruitment drive simulation?
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
