import React, { useState, useEffect } from 'react';
import { dbStorage } from '../../../lib/db';
import { ModuleProgress } from '../../../types';
import { PenTool, CheckCircle2, Save, BookOpen, Clock } from 'lucide-react';

interface DebateReflectionJournalProps {
  moduleId: string;
}

export const DebateReflectionJournal: React.FC<DebateReflectionJournalProps> = ({ moduleId }) => {
  const [q1, setQ1] = useState('My strongest argument was establishing that strict liability for autonomous AI systems forces corporations to implement triple-redundant safety testing prior to deployment.');
  const [q2, setQ2] = useState('My rebuttal was highly effective in dismantling the opponent’s argument regarding compliance costs by showing that clean energy and safety subsidies offset upfront expenses.');
  const [q3, setQ3] = useState('I identified the Strawman fallacy in the opponent statement, where they exaggerated our policy proposal into an extreme claim of total innovation bans.');
  const [q4, setQ4] = useState('In my next debate, I should incorporate additional quantitative benchmarks from IEEE and WHO standards during the first 30 seconds of my opening speech.');

  const [isSaved, setIsSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    loadExistingReflection();
  }, [moduleId]);

  const loadExistingReflection = async () => {
    const progressMap = await dbStorage.getProgressMap();
    const prog = progressMap[moduleId];
    if (prog?.reflectionNotes) {
      try {
        const parsed = JSON.parse(prog.reflectionNotes);
        if (parsed.q1) setQ1(parsed.q1);
        if (parsed.q2) setQ2(parsed.q2);
        if (parsed.q3) setQ3(parsed.q3);
        if (parsed.q4) setQ4(parsed.q4);
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      } catch {
        // use default
      }
    }
  };

  const handleSaveReflection = async () => {
    const timestamp = new Date().toLocaleString();
    const data = JSON.stringify({ q1, q2, q3, q4, savedAt: timestamp });

    const progressMap = await dbStorage.getProgressMap();
    const existingProg: ModuleProgress = progressMap[moduleId] || {
      moduleId,
      status: 'in_progress',
      completedTabs: [],
      reflectionNotes: '',
      savedNotes: '',
      score: 90,
      lastAccessed: new Date().toISOString()
    };

    await dbStorage.saveModuleProgress({
      ...existingProg,
      reflectionNotes: data,
      lastAccessed: new Date().toISOString()
    });

    setIsSaved(true);
    setSavedAt(timestamp);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 9
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Debate Reflection Journal
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Reflect on your debate performance. Answering metacognitive reflection prompts deepens critical thinking skills and auto-saves to your permanent IndexedDB records.
        </p>
      </div>

      {/* Reflection Prompts Workspace */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <span className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
            Structured Metacognitive Questions:
          </span>
          {savedAt && (
            <span className="text-[11px] text-[#5D6D7E] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
              Last saved: {savedAt}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              1. What argument was strongest in your debate speech?
            </label>
            <textarea
              rows={2}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              2. How effective was your rebuttal in deconstructing the opponent stance?
            </label>
            <textarea
              rows={2}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              3. Which logical fallacies did you identify in the sample arguments or opponent speech?
            </label>
            <textarea
              rows={2}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">
              4. What specific delivery, evidence, or logical areas should you improve next time?
            </label>
            <textarea
              rows={2}
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSaveReflection}
          className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Reflections Saved to IndexedDB!' : 'Auto-Save Reflection Journal Entries'}</span>
        </button>
      </div>
    </div>
  );
};
