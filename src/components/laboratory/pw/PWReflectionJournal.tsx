import React, { useState, useEffect } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWReflectionJournalProps {
  studentId: string;
  onCompleteActivity: () => void;
}

export const PWReflectionJournal: React.FC<PWReflectionJournalProps> = ({
  studentId,
  onCompleteActivity
}) => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSavedLog() {
      try {
        const progressMap = await dbStorage.getProgressMap();
        const existing = progressMap['professional-writing'];
        if (existing && existing.reflectionNotes) {
          try {
            const parsed = JSON.parse(existing.reflectionNotes);
            setQ1(parsed.q1 || '');
            setQ2(parsed.q2 || '');
            setQ3(parsed.q3 || '');
            setIsSaved(true);
          } catch {
            setQ1(existing.reflectionNotes);
          }
        }
      } catch (err) {
        console.error('Failed to load reflection log:', err);
      }
    }
    loadSavedLog();
  }, [studentId]);

  const handleSaveReflection = async () => {
    if (!q1.trim() || !q2.trim() || !q3.trim()) return;
    setIsSaving(true);
    try {
      const combinedNotes = JSON.stringify({ q1, q2, q3 });

      // Save reflection notes in ModuleProgress
      const progressMap = await dbStorage.getProgressMap();
      const current = progressMap['professional-writing'] || {
        moduleId: 'professional-writing',
        status: 'in_progress',
        completedTabs: ['overview', 'demo', 'practice', 'reflection'],
        selfMark: 'A',
        reflectionNotes: '',
        savedNotes: '',
        score: 9.0,
        lastAccessed: new Date().toISOString()
      };

      await dbStorage.saveModuleProgress({
        ...current,
        reflectionNotes: combinedNotes,
        lastAccessed: new Date().toISOString()
      });

      // Also save to Portfolio as Reflection item
      await dbStorage.savePortfolioItem({
        id: `reflection-${Date.now()}`,
        moduleId: 'professional-writing',
        moduleTitle: 'Module 6: Professional Writing & Workplace Communication',
        title: 'Module 6 Reflection Journal Entry',
        category: 'reflection',
        content: `1. Writing Improvements:\n${q1}\n\n2. ATS Keywords Application:\n${q2}\n\n3. Document Refinement:\n${q3}`,
        score: 9,
        createdAt: new Date().toISOString()
      });

      setIsSaved(true);
      onCompleteActivity();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Encouragement"
        title="Reflection Journal Instructions"
        transcript="Reflect on your technical writing journey. Documenting your key learnings and self-awareness helps build permanent workplace communication confidence."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <BookOpen className="w-5 h-5 text-[#D35400]" /> Activity 12: Professional Writing Reflection Journal
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              1. What key writing improvements did you notice after using the AI Writing Coach?
            </label>
            <textarea
              rows={3}
              value={q1}
              onChange={(e) => {
                setQ1(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Reflect on conciseness, active verbs, and tone adjustments..."
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              2. How do you plan to apply ATS keywords and action-verb formulas in your upcoming engineering career?
            </label>
            <textarea
              rows={3}
              value={q2}
              onChange={(e) => {
                setQ2(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Reflect on resume building, LinkedIn searchability, and project metrics..."
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              3. Which formal workplace document format (Emails, Memos, Reports, SOPs) required the most refinement?
            </label>
            <textarea
              rows={3}
              value={q3}
              onChange={(e) => {
                setQ3(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Reflect on meeting minutes, IEEE technical reports, or formal letters..."
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            {isSaved ? '✓ Saved securely in SAILL IndexedDB' : 'Save your journal to update your Laboratory Notebook'}
          </span>

          <button
            type="button"
            onClick={handleSaveReflection}
            disabled={isSaving || !q1.trim() || !q2.trim() || !q3.trim()}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Journal...' : isSaved ? 'Journal Saved' : 'Save Reflection Journal'}
          </button>
        </div>
      </div>
    </div>
  );
};
