import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  FolderGit2,
  Award,
  TrendingUp,
  History,
  Bot,
  FileText,
  Volume2,
  Send,
  Sparkles
} from 'lucide-react';

interface FacultyStudentPortfolioTabProps {
  assignedStudents: StudentProfile[];
}

export const FacultyStudentPortfolioTab: React.FC<FacultyStudentPortfolioTabProps> = ({
  assignedStudents
}) => {
  const [selectedRollNo, setSelectedRollNo] = useState<string>(
    assignedStudents[0]?.rollNo || '26691A0501'
  );

  const currentStudent =
    assignedStudents.find((s) => s.rollNo === selectedRollNo) || assignedStudents[0];

  const [facultyRemark, setFacultyRemark] = useState('');
  const [savedRemarks, setSavedRemarks] = useState<string[]>([
    'Demonstrated excellent vocal modulation during the accent drill.',
    'Focus on softening pitch peaks on final syllables.'
  ]);

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyRemark.trim()) return;
    setSavedRemarks([facultyRemark.trim(), ...savedRemarks]);
    setFacultyRemark('');
  };

  const bestScore = 94;
  const latestScore = 88;

  const attemptHistory = [
    { attemptNo: 3, date: '2026-02-14 11:20 AM', score: 88, status: 'Passed', duration: '2m 14s' },
    { attemptNo: 2, date: '2026-02-14 11:05 AM', score: 76, status: 'Needs Improvement', duration: '2m 08s' },
    { attemptNo: 1, date: '2026-02-12 04:45 PM', score: 68, status: 'Initial Trial', duration: '1m 55s' }
  ];

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header & Student Selector */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-[11px] font-bold mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Audio Portfolio & Artifacts Review</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Student Audio Portfolio</h2>
          <p className="text-xs text-gray-500">Inspect speech recordings, best scores, and AI feedback</p>
        </div>

        {/* Student Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-600">Select Student:</label>
          <select
            value={selectedRollNo}
            onChange={(e) => setSelectedRollNo(e.target.value)}
            className="px-3 py-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] outline-none cursor-pointer"
          >
            {assignedStudents.map((st) => (
              <option key={st.rollNo} value={st.rollNo}>
                {st.name} ({st.rollNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentStudent && (
        <div className="space-y-6">
          {/* Best Score & Latest Score Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-amber-100 text-amber-800 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Best AI Portfolio Score</p>
                <p className="text-2xl font-extrabold text-[#D35400]">{bestScore} / 100</p>
                <p className="text-[11px] text-amber-700 font-semibold">Phonetics & Stress Recitation</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-blue-100 text-blue-800 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Latest Submission Score</p>
                <p className="text-2xl font-extrabold text-[#2C3E50]">{latestScore} / 100</p>
                <p className="text-[11px] text-blue-700 font-semibold">Submitted Feb 14, 2026</p>
              </div>
            </div>
          </div>

          {/* Audio Artifact & AI Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Audio Player & AI Feedback */}
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-[#2C3E50] flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#D35400]" />
                  <span>Audio Recording Sample</span>
                </h3>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  48kHz WebM Audio
                </span>
              </div>

              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#2C3E50]">Module 1 Recitation Task</p>
                  <p className="text-[11px] text-gray-500">Duration: 2m 14s • Stereo</p>
                </div>
                <button className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                  <Volume2 className="w-4 h-4" />
                  <span>Play Sample</span>
                </button>
              </div>

              {/* AI Feedback */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-blue-700" />
                  <span>Gemini AI Speech Evaluation</span>
                </h4>
                <p className="text-xs text-blue-950 leading-relaxed">
                  "Articulation of long vowels is accurate. Primary stress on multi-syllabic words matches native standards. Pitch drop at clause endings requires subtle adjustment."
                </p>
              </div>

              {/* Reflection */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <h4 className="font-bold text-xs text-amber-900">Student Self Reflection</h4>
                <p className="text-xs text-amber-950 italic">
                  "I recorded this attempt 3 times to get my pitch rhythm right. The AI graph helped me see where I paused too long."
                </p>
              </div>
            </div>

            {/* Right: Faculty Remarks Placeholder */}
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#2C3E50] flex items-center gap-2 pb-3 border-b">
                <FileText className="w-4 h-4 text-[#D35400]" />
                <span>Faculty Portfolio Remarks</span>
              </h3>

              <form onSubmit={handleAddRemark} className="space-y-2">
                <label className="block text-xs font-bold text-[#2C3E50]">Add Portfolio Observation</label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={facultyRemark}
                    onChange={(e) => setFacultyRemark(e.target.value)}
                    placeholder="Enter qualitative faculty feedback on student portfolio audio..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#D35400] text-white font-bold text-xs rounded-xl hover:bg-[#E67E22] transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">Posted Remarks ({savedRemarks.length})</h4>
                {savedRemarks.map((rem, idx) => (
                  <div key={idx} className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50]">
                    {rem}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attempt History Table */}
          <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#2C3E50] flex items-center gap-2">
              <History className="w-4 h-4 text-[#D35400]" />
              <span>Complete Audio Attempt History</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                    <th className="p-2.5 font-bold">Attempt #</th>
                    <th className="p-2.5 font-bold">Date & Time</th>
                    <th className="p-2.5 font-bold">Recording Duration</th>
                    <th className="p-2.5 font-bold">AI Score</th>
                    <th className="p-2.5 font-bold">Result Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attemptHistory.map((att) => (
                    <tr key={att.attemptNo} className="hover:bg-[#FFF8F0]">
                      <td className="p-2.5 font-bold">Attempt #{att.attemptNo}</td>
                      <td className="p-2.5 text-gray-600">{att.date}</td>
                      <td className="p-2.5 text-gray-600">{att.duration}</td>
                      <td className="p-2.5 font-extrabold text-[#D35400]">{att.score} / 100</td>
                      <td className="p-2.5">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
