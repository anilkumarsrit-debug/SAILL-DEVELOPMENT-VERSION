import React, { useState, useEffect } from 'react';
import { BookOpen, Save, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const ReportReflectionJournal: React.FC = () => {
  const [q1, setQ1] = useState<string>(
    'I learned how to structure an executive summary and transform informal observational notes into objective passive-voice engineering statements.'
  );
  const [q2, setQ2] = useState<string>(
    'Writing the Literature Review with IEEE bracketed citations was challenging, but formatting the references correctly improved paper credibility.'
  );
  const [q3, setQ3] = useState<string>(
    'I will ensure that all figure captions are placed beneath charts with explicit unit labels on both X and Y axes.'
  );

  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleSaveReflection = async () => {
    try {
      setSaveStatus('Saving reflection journal entries to IndexedDB...');
      const fullReflection = `REFLECTION JOURNAL - MODULE 11:\n\n1. What did I learn today?\n${q1}\n\n2. Which report section was difficult?\n${q2}\n\n3. How will I improve technical precision?\n${q3}`;

      // Save progress to IndexedDB
      await dbStorage.saveModuleProgress({
        moduleId: 'report-writing',
        status: 'completed',
        completedTabs: ['reflection', 'practice'],
        reflectionNotes: fullReflection,
        savedNotes: fullReflection,
        score: 92,
        lastAccessed: new Date().toISOString()
      });

      setSaveStatus('Reflection entries successfully saved to IndexedDB!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Error saving reflection.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 10
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                Metacognitive Reflection Journal
              </h2>
            </div>
          </div>

          <button
            onClick={handleSaveReflection}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Reflection Entry
          </button>
        </div>

        {saveStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* 3 Prompts Form */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] font-heading uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E67E22]" />
            <span>1. What core technical communication insights did you master today?</span>
          </label>
          <textarea
            rows={3}
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] font-heading uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E67E22]" />
            <span>2. Which report section or formatting rule was most challenging, and how did you resolve it?</span>
          </label>
          <textarea
            rows={3}
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] font-heading uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E67E22]" />
            <span>3. How will you apply IEEE formatting and technical precision in future laboratory reports?</span>
          </label>
          <textarea
            rows={3}
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
