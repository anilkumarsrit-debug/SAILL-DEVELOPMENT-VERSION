import React from 'react';
import { BookMarked, Printer, CheckCircle2, Award, Clock } from 'lucide-react';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWLabNotebookProps {
  completedActivitiesCount: number;
  totalActivitiesCount: number;
  averageScore10: number;
}

const ACTIVITIES_LIST = [
  '1. Introduction to Professional Writing & 5 Cs',
  '2. Professional Email Writing Lab (10 Tasks)',
  '3. Formal Letter Writing (Administrative Scenarios)',
  '4. Workplace Communication & Business Memos',
  '5. Meeting Minutes Writing (MoM Builder)',
  '6. Technical Report Writing (IEEE Standard)',
  '7. ATS Engineering Resume Builder',
  '8. LinkedIn Profile & Brand Builder',
  '9. Statement of Purpose (SOP) Builder',
  '10. Project Abstract Writing (IEEE Format)',
  '11. AI Writing Coach (9-Dimension Analysis)',
  '12. Reflection Journal',
  '13. Digital Laboratory Notebook Record',
  '14. Portfolio Integration'
];

export const PWLabNotebook: React.FC<PWLabNotebookProps> = ({
  completedActivitiesCount,
  totalActivitiesCount,
  averageScore10
}) => {
  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Completion"
        title="Laboratory Notebook Instructions"
        transcript="Your digital lab record EXP-06 is automatically updated as you complete activities. Review your activity log and print your verified record for faculty evaluation."
      />

      {/* Official Lab Record Form */}
      <div className="srit-card p-6 sm:p-8 bg-white border-2 border-[#D35400] space-y-6 print:p-0 print:border-none">
        {/* Header Branding */}
        <div className="text-center border-b-2 border-[#D35400] pb-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#D35400] tracking-wide uppercase font-heading">
            SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY
          </h2>
          <p className="text-xs font-bold text-[#2C3E50] uppercase">
            Department of Humanities & Basic Sciences | R26 Communicative English Lab
          </p>
          <div className="inline-block bg-[#FFF8F0] border border-[#FAD7A0] px-4 py-1 rounded-full text-xs font-extrabold text-[#D35400] mt-1">
            DIGITAL LABORATORY RECORD — EXPERIMENT NO: EXP-06
          </div>
        </div>

        {/* Record Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0] text-xs">
          <div>
            <span className="text-[#5D6D7E] block text-[10px] font-bold uppercase">Course Code</span>
            <strong className="text-[#2C3E50]">R26-LAB-06</strong>
          </div>
          <div>
            <span className="text-[#5D6D7E] block text-[10px] font-bold uppercase">Student Roll No</span>
            <strong className="text-[#2C3E50]">26SR1A0501</strong>
          </div>
          <div>
            <span className="text-[#5D6D7E] block text-[10px] font-bold uppercase">Lab Date</span>
            <strong className="text-[#2C3E50]">{new Date().toLocaleDateString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-[#5D6D7E] block text-[10px] font-bold uppercase">Average Score</span>
            <strong className="text-[#D35400] font-black">{averageScore10.toFixed(1)} / 10 Marks</strong>
          </div>
        </div>

        {/* Activity Completion Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[#2C3E50] uppercase border-b border-[#FAD7A0] pb-2">
            Module 6 Activity Completion Register ({completedActivitiesCount} / {totalActivitiesCount} Complete)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {ACTIVITIES_LIST.map((act, idx) => {
              const isDone = idx < completedActivitiesCount;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                      : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#5D6D7E]'
                  }`}
                >
                  <span>{act}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#5D6D7E] shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Score & Faculty Stamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#FAD7A0]">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <span className="text-xs font-bold text-[#D35400] uppercase">10-Mark Assessment Summary:</span>
            <p className="text-2xl font-black text-[#2C3E50]">{averageScore10.toFixed(1)} / 10</p>
            <p className="text-[11px] text-[#5D6D7E]">
              Evaluated on Content Structure, Action Verbs, Grammar, Professional Tone, and Conciseness.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-dashed border-[#FAD7A0] rounded-xl flex flex-col justify-between">
            <span className="text-[10px] text-[#5D6D7E] font-bold uppercase">Faculty Signature & Digital Stamp</span>
            <div className="text-right mt-6">
              <span className="text-xs font-bold text-[#2C3E50] block">Dr. M. Standard / Course Instructor</span>
              <span className="text-[10px] text-[#5D6D7E]">Department of Humanities, SRIT</span>
            </div>
          </div>
        </div>

        {/* Print Action */}
        <div className="flex justify-end pt-4 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print EXP-06 Lab Record
          </button>
        </div>
      </div>
    </div>
  );
};
