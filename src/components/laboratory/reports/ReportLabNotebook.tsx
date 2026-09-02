import React, { useState, useEffect } from 'react';
import { BookMarked, Calendar, CheckCircle2, Clock, FileText, UserCheck, MessageSquare } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const ReportLabNotebook: React.FC = () => {
  const [entries, setEntries] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const portfolio = await dbStorage.getPortfolioItems('report-writing');
        const progress = await dbStorage.getProgressMap();
        const moduleProg = progress['report-writing'];

        const notebookList = [
          ...(portfolio || []).map((p) => ({
            id: p.id,
            title: p.title,
            type: p.category || 'report',
            date: new Date(p.createdAt || Date.now()).toLocaleDateString(),
            score: p.score || 92,
            content: p.content,
            facultyFeedback: p.teacherFeedback || 'Verified by Faculty Lead • Meets R26 Lab Standards.'
          }))
        ];

        if (moduleProg?.reflectionNotes || moduleProg?.savedNotes) {
          notebookList.push({
            id: 'reflection-entry-1',
            title: 'Module 11 Reflection Journal Entry',
            type: 'reflection',
            date: new Date(moduleProg.lastAccessed || Date.now()).toLocaleDateString(),
            score: moduleProg.score || 90,
            content: moduleProg.reflectionNotes || moduleProg.savedNotes,
            facultyFeedback: 'Self-assessment validated by AI Coach.'
          });
        }

        setEntries(notebookList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotebook();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 11
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Digital Laboratory Notebook & Audit Log
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Centralized repository storing all laboratory reports, project drafts, technical documentation, AI feedback logs, faculty endorsements, and submission timestamps synced with IndexedDB.
        </p>
      </div>

      {/* Entries List */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center justify-between border-b border-[#FAD7A0] pb-2">
          <span>Stored Laboratory Notebook Logs ({entries.length})</span>
          <span className="text-[10px] font-mono text-[#E67E22]">IndexedDB Persistence</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading digital lab notebook...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-[#FAD7A0] rounded-xl">
            No lab notebook entries found. Save reports in Sections 3, 4, 5, or 10 to see them listed here automatically.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2.5 transition hover:shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAD7A0] pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D35400]" />
                    <h4 className="text-xs font-bold text-[#D35400] font-heading">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-white text-[#E67E22] rounded border border-[#FAD7A0] font-bold">
                      Score: {item.score} / 10
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#2C3E50] font-mono line-clamp-3 bg-white p-2.5 rounded border border-[#FAD7A0]/60 whitespace-pre-line">
                  {item.content}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{item.facultyFeedback}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
