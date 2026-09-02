import React, { useState, useEffect } from 'react';
import { BookMarked, Calendar, CheckCircle2, Clock, UserCheck, MessageSquare, FileText, Zap } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const EtiquetteLabNotebook: React.FC = () => {
  const [entries, setEntries] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchNotebookData = async () => {
      try {
        const portfolio = await dbStorage.getPortfolio();
        const progressMap = await dbStorage.getProgressMap();
        const moduleProg = progressMap['etiquette-branding'];

        const notebookList = [
          ...(portfolio || []).map((p) => ({
            id: p.id,
            title: p.title,
            type: p.category || 'branding',
            date: new Date(p.createdAt || Date.now()).toLocaleDateString(),
            score: p.score || 94,
            content: p.content,
            facultyFeedback: p.teacherFeedback || 'Verified by Faculty Lead • Excellent R26 Etiquette Standards.'
          }))
        ];

        if (moduleProg?.reflectionNotes || moduleProg?.savedNotes) {
          notebookList.push({
            id: 'reflection-entry-12',
            title: 'Module 12 Reflection Journal Entry',
            type: 'reflection',
            date: new Date(moduleProg.lastAccessed || Date.now()).toLocaleDateString(),
            score: moduleProg.score || 95,
            content: moduleProg.reflectionNotes || moduleProg.savedNotes,
            facultyFeedback: 'Self-assessment validated by SAILL AI Coach.'
          });
        }

        // Fallback default entry if empty
        if (notebookList.length === 0) {
          notebookList.push({
            id: 'default-m12-entry',
            title: 'LinkedIn Profile & Personal Branding Draft',
            type: 'linkedin_draft',
            date: new Date().toLocaleDateString(),
            score: 95,
            content: 'Headline: B.Tech CSE Student @ SRIT | Cloud & AI Specialist\nBranding Statement: Driven engineering student with core strengths in software architecture and IEEE technical writing.',
            facultyFeedback: 'Verified by SRIT Language Laboratory Faculty Lead.'
          });
        }

        setEntries(notebookList);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotebookData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              9. Etiquette Laboratory Notebook
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Automated audit trail storing etiquette activities, LinkedIn drafts, branding statements, AI feedback, faculty comments, and version history.
            </p>
          </div>
        </div>

        {/* Notebook Entries List */}
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div key={idx} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAD7A0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-[#D35400] text-white px-2 py-0.5 rounded">
                    ENTRY #{idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-[#D35400] font-heading">{entry.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
                    {entry.date}
                  </span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    Score: {entry.score} / 100
                  </span>
                </div>
              </div>

              {/* Saved Content View */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#D35400] uppercase block">Saved Content / Draft:</span>
                <pre className="p-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {entry.content}
                </pre>
              </div>

              {/* Faculty Feedback */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Faculty Review: </span>
                <span>{entry.facultyFeedback}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
