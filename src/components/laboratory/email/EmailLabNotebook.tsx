import React, { useState } from 'react';
import { Database, FileCode, CheckCircle2, Calendar, ArrowRight, Download } from 'lucide-react';

interface LabNoteEntry {
  id: string;
  title: string;
  type: string;
  date: string;
  subject: string;
  snippet: string;
  score: number;
  facultyComment: string;
}

interface EmailLabNotebookProps {
  onCompleteActivity: () => void;
}

export const EmailLabNotebook: React.FC<EmailLabNotebookProps> = ({ onCompleteActivity }) => {
  const [entries] = useState<LabNoteEntry[]>([
    {
      id: 'note-01',
      title: 'Summer Software Engineering Internship Application',
      type: 'Career Placement Draft',
      date: 'July 26, 2026 - 10:15 AM',
      subject: '[Application] Summer Software Engineering Internship - Anil Kumar (264G1A0501)',
      snippet: 'Dear Hiring Manager, I am a First-Year B.Tech Computer Science student at SRIT writing to apply for the Summer Software Development Internship position at Tech Corp...',
      score: 9.2,
      facultyComment: 'Excellent professional structure! The bracketed subject line complies perfectly with R26 guidelines.'
    },
    {
      id: 'note-02',
      title: 'On-Duty Leave Permission Request',
      type: 'Academic Administration',
      date: 'July 25, 2026 - 02:30 PM',
      subject: '[Leave Request] On-Duty Permission for State Hackathon - 264G1A0501',
      snippet: 'Dear Dr. R. V. Sharma, I am writing to request On-Duty (OD) leave for two days to participate in the Smart India Hackathon...',
      score: 9.0,
      facultyComment: 'Well-structured leave request. Appropriate modal phrasing used.'
    },
    {
      id: 'note-03',
      title: 'Language Lab Headset Fault Complaint',
      type: 'Facilities Complaint',
      date: 'July 24, 2026 - 04:10 PM',
      subject: '[Technical Issue] Monitor & Mouse Replacement - Language Lab PC 14',
      snippet: 'Dear Lab In-Charge, I would like to bring to your notice a technical issue with Computer System No. 14 in the Language Laboratory...',
      score: 8.8,
      facultyComment: 'Firm yet polite complaint tone maintained throughout.'
    }
  ]);

  const [selectedEntry, setSelectedEntry] = useState<LabNoteEntry>(entries[0]);

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 11
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Database className="w-5 h-5 text-[#D35400]" />
            11. Laboratory Notebook (IndexedDB Audit Log)
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Automatically logged archive of email drafts, AI feedback scores, faculty comments, and submission timestamps.
          </p>
        </div>

        {/* Notebook Main View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Entries Sidebar */}
          <div className="lg:col-span-5 space-y-2 max-h-[450px] overflow-y-auto pr-1">
            <span className="text-[10px] font-bold uppercase text-[#D35400] block mb-1">
              Logged Laboratory Submissions:
            </span>
            {entries.map((entry) => {
              const isSelected = selectedEntry.id === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                      : 'bg-white border-[#FAD7A0] hover:border-[#E67E22]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-[#D35400]">{entry.type}</span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#E67E22]" /> {entry.date.split('-')[0]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#2C3E50] line-clamp-1">{entry.title}</h4>
                  <p className="text-[11px] text-[#5D6D7E] line-clamp-2 mt-1">{entry.snippet}</p>
                </button>
              );
            })}
          </div>

          {/* Active Entry Detail Card */}
          <div className="lg:col-span-7 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#D35400]">{selectedEntry.type}</span>
                <h3 className="text-sm font-extrabold text-[#2C3E50]">{selectedEntry.title}</h3>
                <span className="text-[10px] text-[#5D6D7E] font-mono">{selectedEntry.date}</span>
              </div>

              <div className="bg-white px-3 py-1.5 rounded-xl border border-[#FAD7A0] text-center shrink-0">
                <span className="text-[9px] font-bold uppercase text-[#D35400] block">Score</span>
                <span className="text-sm font-black text-[#2C3E50]">{selectedEntry.score} / 10</span>
              </div>
            </div>

            {/* Email Log Details */}
            <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2 font-mono text-xs text-[#2C3E50]">
              <div>
                <span className="text-[10px] text-gray-400 font-sans block font-bold">Logged Subject:</span>
                <span className="font-bold">{selectedEntry.subject}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 whitespace-pre-wrap leading-relaxed text-[#2C3E50]">
                {selectedEntry.snippet}
              </div>
            </div>

            {/* Faculty Comment Box */}
            <div className="p-3.5 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#D35400] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Faculty Reviewer Comment:
              </span>
              <p className="text-xs text-[#2C3E50] italic">{selectedEntry.facultyComment}</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            View best email submissions showcased in Section 12 (Portfolio).
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Student Portfolio Showcase <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
