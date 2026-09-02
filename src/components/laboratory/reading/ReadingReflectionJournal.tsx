import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Check, ArrowRight, Sparkles, Clock, Calendar } from 'lucide-react';

interface ReadingReflectionJournalProps {
  onCompleteActivity: () => void;
}

export const ReadingReflectionJournal: React.FC<ReadingReflectionJournalProps> = ({ onCompleteActivity }) => {
  const [q1, setQ1] = useState<string>(
    'Skimming the first and last sentences of technical paragraphs gave me an instant mental roadmap before diving into dense equations.'
  );
  const [q2, setQ2] = useState<string>(
    'The quantum computing passage with decoherence terminology required re-reading to isolate unstated assumptions.'
  );
  const [q3, setQ3] = useState<string>(
    'Practice scanning speed for numerical parameters in datasheet tables to push reading throughput beyond 300 WPM.'
  );

  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('srit_reading_reflection_journal');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.q1) setQ1(parsed.q1);
        if (parsed.q2) setQ2(parsed.q2);
        if (parsed.q3) setQ3(parsed.q3);
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveJournal = () => {
    const timestamp = new Date().toLocaleString();
    try {
      localStorage.setItem('srit_reading_reflection_journal', JSON.stringify({
        q1,
        q2,
        q3,
        savedAt: timestamp
      }));
      setSavedAt(timestamp);
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
              Section 12
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            12. Reading Metacognitive Reflection Journal
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Reflect on your reading strategies, technical bottlenecks, and cognitive growth to cultivate lifelong reading efficiency.
          </p>
        </div>

        {/* 3 Core Prompts */}
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] block text-[11px] uppercase">
              1. What reading strategy helped me most in today's lab?
            </label>
            <textarea
              rows={3}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400] leading-relaxed"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] block text-[11px] uppercase">
              2. Which passage or concept was most challenging, and why?
            </label>
            <textarea
              rows={3}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400] leading-relaxed"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#D35400] block text-[11px] uppercase">
              3. What specific technique will I practice to improve next time?
            </label>
            <textarea
              rows={3}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#FAD7A0] bg-white font-mono focus:outline-none focus:border-[#D35400] leading-relaxed"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl">
          <div className="text-xs text-[#5D6D7E]">
            {savedAt ? (
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <Check className="w-4 h-4" /> Reflection saved automatically: {savedAt}
              </span>
            ) : (
              <span>Your reflection entries are stored locally in IndexedDB / localStorage.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveJournal}
            className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Reflection Entry</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 13: Laboratory Notebook</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
