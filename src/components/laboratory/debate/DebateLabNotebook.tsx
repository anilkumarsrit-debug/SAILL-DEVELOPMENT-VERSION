import React, { useState, useEffect } from 'react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem, RecordingItem } from '../../../types';
import { BookOpen, FileText, Calendar, Award, CheckCircle2, UserCheck, History, Download } from 'lucide-react';

interface DebateLabNotebookProps {
  moduleId: string;
}

export const DebateLabNotebook: React.FC<DebateLabNotebookProps> = ({ moduleId }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [reflectionText, setReflectionText] = useState<string>('No reflections logged yet.');

  useEffect(() => {
    loadNotebookData();
  }, [moduleId]);

  const loadNotebookData = async () => {
    const allPortfolio = await dbStorage.getPortfolio();
    const allRecordings = await dbStorage.getRecordings();
    const progressMap = await dbStorage.getProgressMap();
    const prog = progressMap[moduleId];

    setPortfolioItems(allPortfolio.filter((i) => i.moduleId === moduleId));
    setRecordings(allRecordings.filter((r) => r.moduleId === moduleId));

    if (prog?.reflectionNotes) {
      try {
        const parsed = JSON.parse(prog.reflectionNotes);
        setReflectionText(
          `Strongest Argument: ${parsed.q1}\nRebuttal Effectiveness: ${parsed.q2}\nIdentified Fallacies: ${parsed.q3}\nNext Steps: ${parsed.q4}`
        );
      } catch {
        setReflectionText(prog.reflectionNotes);
      }
    }
  };

  const sampleVersionHistory = [
    { version: 'v1.0.2', date: '2026-07-26', activity: 'Completed AI Debate Simulator (Score: 9/10 - Excellent)' },
    { version: 'v1.0.1', date: '2026-07-26', activity: 'Submitted Rebuttal Practice Studio Case #1' },
    { version: 'v1.0.0', date: '2026-07-26', activity: 'Constructed CER Debate Motion Blueprint' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 10
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Digital Laboratory Notebook
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Centralized storage of all debate topics, opening statements, rebuttals, closing statements, AI feedback, faculty comments, reflections, and version history.
        </p>
      </div>

      {/* Notebook Artifacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Written Statements & AI Feedback */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E67E22]" />
            <span>Stored Debate Statements & AI Feedback ({portfolioItems.length})</span>
          </h3>

          {portfolioItems.length === 0 ? (
            <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-center text-xs text-[#5D6D7E]">
              No written debate statements recorded yet. Complete activities in the Arena or Simulator to auto-save entries.
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {portfolioItems.map((item) => (
                <div key={item.id} className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-bold text-[#D35400]">
                    <span>{item.title}</span>
                    <span className="text-[10px] font-mono text-[#E67E22]">{item.createdAt.split('T')[0]}</span>
                  </div>
                  <pre className="text-[11px] text-[#2C3E50] font-sans whitespace-pre-wrap bg-white p-2 rounded border border-[#FAD7A0]/60 max-h-28 overflow-y-auto">
                    {item.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Faculty Comments & Reflection Summary */}
        <div className="space-y-4">
          {/* Faculty Comment Block */}
          <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-2">
            <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#E67E22]" />
              <span>Faculty Assessment & Verification</span>
            </h3>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#D35400]">
                <span>Evaluator: Dr. M. Sharma (Faculty In-Charge)</span>
                <span>Verified: Yes</span>
              </div>
              <p className="italic font-serif">
                "Student exhibits commendable Claim-Evidence-Reasoning structure and logical fallacy identification. Approved for R26 Communicative English Lab internal mark credit."
              </p>
            </div>
          </div>

          {/* Reflections Summary Block */}
          <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-2">
            <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E67E22]" />
              <span>Journal Reflection Log</span>
            </h3>
            <pre className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] font-sans whitespace-pre-wrap max-h-32 overflow-y-auto">
              {reflectionText}
            </pre>
          </div>

          {/* Version History Log */}
          <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-2">
            <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
              <History className="w-4 h-4 text-[#E67E22]" />
              <span>Version History & Synchronization Log</span>
            </h3>
            <div className="space-y-1 text-xs">
              {sampleVersionHistory.map((vh) => (
                <div key={vh.version} className="flex justify-between items-center p-2 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <span className="font-mono text-[#D35400] font-bold">{vh.version}</span>
                  <span className="text-[#2C3E50]">{vh.activity}</span>
                  <span className="text-[10px] font-mono text-[#5D6D7E]">{vh.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
