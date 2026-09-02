import React, { useState, useEffect } from 'react';
import { HelpCircle, Save, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const EtiquetteReflectionJournal: React.FC = () => {
  const [q1, setQ1] = useState<string>(
    'Today I learned the importance of active listening in meetings, proper camera framing during virtual calls, and the power of a crisp 2-sentence personal branding statement.'
  );
  const [q2, setQ2] = useState<string>(
    'I can improve my digital presence by customizing my LinkedIn URL, adding a professional headshot with business casual attire, and proofreading emails for formal netiquette before sending.'
  );
  const [q3, setQ3] = useState<string>(
    'My elevator pitch needs more practice so I can deliver my B.Tech engineering trajectory smoothly within 45 seconds without relying on notes.'
  );
  const [q4, setQ4] = useState<string>(
    'My next professional goal is to request two recommendations on LinkedIn from my SRIT project leads and publish my B.Tech capstone project abstract on my profile.'
  );

  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    const loadSavedReflection = async () => {
      const progressMap = await dbStorage.getProgressMap();
      const modProg = progressMap['etiquette-branding'];
      if (modProg?.reflectionNotes) {
        try {
          const parsed = JSON.parse(modProg.reflectionNotes);
          if (parsed.q1) setQ1(parsed.q1);
          if (parsed.q2) setQ2(parsed.q2);
          if (parsed.q3) setQ3(parsed.q3);
          if (parsed.q4) setQ4(parsed.q4);
        } catch (e) {
          // string reflection fallback
        }
      }
    };
    loadSavedReflection();
  }, []);

  const handleSaveReflection = async () => {
    setSaveStatus('Saving Reflection Journal to IndexedDB...');

    const reflectionObj = { q1, q2, q3, q4 };
    const fullText = `ETIQUETTE & BRANDING REFLECTION JOURNAL
1. Professional Habit Learned:
${q1}

2. Digital Presence Improvement:
${q2}

3. Personal Brand Aspect to Refine:
${q3}

4. Next Professional Goal:
${q4}`;

    await dbStorage.saveModuleProgress({
      moduleId: 'etiquette-branding',
      status: 'completed',
      completedTabs: ['reflection', 'practice'],
      reflectionNotes: JSON.stringify(reflectionObj),
      savedNotes: fullText,
      score: 95,
      lastAccessed: new Date().toISOString()
    });

    setSaveStatus('Reflection entries successfully saved to IndexedDB!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#D35400] font-heading">
                8. Etiquette & Personal Branding Reflection Journal
              </h2>
              <p className="text-xs text-[#2C3E50]">
                Metacognitive self-assessment prompts mandated by the R26 Communicative English Laboratory syllabus.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveReflection}
            className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B94600] transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Reflection Entries
          </button>
        </div>

        {saveStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">
              1. What professional habit did I learn today?
            </label>
            <textarea
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">
              2. How can I improve my digital presence?
            </label>
            <textarea
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">
              3. What aspect of my personal brand needs improvement?
            </label>
            <textarea
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">
              4. What professional goal will I work on next?
            </label>
            <textarea
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
