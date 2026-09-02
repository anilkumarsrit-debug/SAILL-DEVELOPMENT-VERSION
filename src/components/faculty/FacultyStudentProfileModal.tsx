import React, { useState, useEffect } from 'react';
import { StudentProfile, PortfolioItem, FacultyModuleScore } from '../../types';
import { FacultyStudentService } from '../../services/FacultyStudentService';
import { FacultyEvaluationService } from '../../services/FacultyEvaluationService';
import { FacultyNote } from '../../types/faculty';
import { dbStorage } from '../../lib/db';
import { R26_MODULES as SAILL_MODULES } from '../../data/modulesData';
import {
  X,
  User,
  GraduationCap,
  BookOpen,
  Award,
  Bot,
  FolderGit2,
  History,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Volume2,
  Edit3,
  Save
} from 'lucide-react';

interface FacultyStudentProfileModalProps {
  student: StudentProfile;
  facultyId: string;
  onClose: () => void;
}

export const FacultyStudentProfileModal: React.FC<FacultyStudentProfileModalProps> = ({
  student,
  facultyId,
  onClose
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'modules' | 'evaluations' | 'ai-history' | 'portfolio' | 'attempts' | 'notes'
  >('profile');

  const [notes, setNotes] = useState<FacultyNote[]>(
    FacultyStudentService.getNotesForStudent(student.rollNo)
  );
  const [newNoteText, setNewNoteText] = useState('');
  const [facultyScores, setFacultyScores] = useState<FacultyModuleScore[]>([]);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [inputScore, setInputScore] = useState<number>(8);
  const [inputRemarks, setInputRemarks] = useState<string>('');

  useEffect(() => {
    loadFacultyScores();
  }, [student.rollNo]);

  const loadFacultyScores = async () => {
    const scores = await FacultyEvaluationService.getScoresForStudent(student.rollNo);
    setFacultyScores(scores);
  };

  const handleSaveModalScore = async (moduleId: string, moduleTitle: string) => {
    const batchId = student.batchId || student.batch || 'DEFAULT-BATCH';
    const batchName = student.batchName || student.batch || 'Section A';
    await FacultyEvaluationService.recordScore(
      student.rollNo,
      student.name,
      moduleId,
      moduleTitle,
      batchId,
      batchName,
      facultyId,
      'Faculty Incharge',
      inputScore,
      inputRemarks
    );
    setEditingModuleId(null);
    await loadFacultyScores();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const added = FacultyStudentService.addStudentNote(student.rollNo, facultyId, newNoteText);
    setNotes([added, ...notes]);
    setNewNoteText('');
  };

  // Mock evaluation history for student
  const aiEvaluationHistory = [
    {
      date: '2026-02-14',
      module: 'Module 1: Phonetics & Pronunciation',
      task: 'Vowel Sounds Audio Practice',
      score: 88,
      clarity: '92%',
      pitch: 'Optimally Modulated',
      fluency: 'Good Pace',
      feedback: 'Excellent vowel duration on long phonemes /i:/ and /u:/. Minor hesitation on diphthongs.'
    },
    {
      date: '2026-02-10',
      module: 'Module 2: Word Stress Rules',
      task: 'Suffix Stress Rule 4 Recitation',
      score: 82,
      clarity: '86%',
      pitch: 'Monotone in middle clause',
      fluency: 'Steady',
      feedback: 'Proper primary stress placement on "-tion" suffixes. Improve pitch elevation on key words.'
    }
  ];

  // Mock attempt history
  const attemptHistory = [
    { attemptNo: 3, date: '2026-02-14 11:20 AM', score: 88, status: 'Passed (AI Evaluated)', duration: '2m 14s' },
    { attemptNo: 2, date: '2026-02-14 11:05 AM', score: 76, status: 'Needs Improvement', duration: '2m 08s' },
    { attemptNo: 1, date: '2026-02-12 04:45 PM', score: 68, status: 'Initial Trial', duration: '1m 55s' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-[#FAD7A0] overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2C3E50] to-[#1F2C38] text-white flex items-center justify-between border-b border-[#FAD7A0]/30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#D35400] text-white font-extrabold text-xl flex items-center justify-center border-2 border-[#FAD7A0]">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-[#FAD7A0]">{student.name}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-gray-300 font-mono mt-0.5">
                Roll No: {student.rollNo} • {student.branch || 'CSE'} - {student.section || 'A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="bg-[#FFF8F0] border-b border-[#FAD7A0]/60 px-6 py-2.5 flex flex-wrap items-center gap-2 shrink-0">
          {[
            { id: 'profile', label: 'Learning Profile', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'modules', label: 'Modules & Progress', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'evaluations', label: 'Faculty Scoring (1–10)', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'ai-history', label: 'AI Evaluation History', icon: <Bot className="w-3.5 h-3.5" /> },
            { id: 'portfolio', label: 'Portfolio & Audio', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
            { id: 'attempts', label: 'Attempt Log', icon: <History className="w-3.5 h-3.5" /> },
            { id: 'notes', label: 'Faculty Remarks', icon: <FileText className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#2C3E50] hover:bg-[#FAD7A0]/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2C3E50]">
          {/* SubTab 1: Learning Profile */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#D35400] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Academic Mapping
                  </h3>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><span className="font-semibold text-[#2C3E50]">Branch:</span> {student.branch || 'CSE'}</p>
                    <p><span className="font-semibold text-[#2C3E50]">Section:</span> {student.section || 'A'}</p>
                    <p><span className="font-semibold text-[#2C3E50]">Academic Year:</span> {student.year || '2026–2027'}</p>
                    <p><span className="font-semibold text-[#2C3E50]">Semester:</span> {student.semester || 'Semester I'}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#D35400] flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> SAILL Performance Metrics
                  </h3>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><span className="font-semibold text-[#2C3E50]">Overall Completion:</span> 85%</p>
                    <p><span className="font-semibold text-[#2C3E50]">Average AI Score:</span> 86 / 100</p>
                    <p><span className="font-semibold text-[#2C3E50]">Total Audio Recordings:</span> 12 Submissions</p>
                    <p><span className="font-semibold text-[#2C3E50]">Phonetics Mastery:</span> Advanced Level B2</p>
                  </div>
                </div>
              </div>

              {/* Reflection */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <h4 className="font-bold text-xs text-[#2C3E50]">Student Self Reflection</h4>
                <p className="text-xs text-gray-700 italic">
                  "I felt much more confident during the stress rule exercise. The AI instant audio feedback helped me fix my pitch dropping at sentence endings."
                </p>
              </div>
            </div>
          )}

          {/* SubTab 2: Completed & Current Modules */}
          {activeSubTab === 'modules' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Modules
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-lg border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2C3E50]">Module 1: Phonetics & Pronunciation</p>
                      <p className="text-gray-500 text-[11px]">Completed on Feb 10, 2026</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                      Score: 88%
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2C3E50]">Module 2: Word Stress & Accent</p>
                      <p className="text-gray-500 text-[11px]">Completed on Feb 12, 2026</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                      Score: 82%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <h3 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Current Active Module
                </h3>
                <div className="p-3 bg-white rounded-lg border border-amber-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#2C3E50]">Module 3: Intonation Patterns & Cadence</p>
                    <p className="text-gray-500 text-[11px]">In Progress • Step 2 of 4</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md">
                    75% Progress
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Faculty Evaluations (1-10 Scale) */}
          {activeSubTab === 'evaluations' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                <h3 className="font-bold text-xs text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D35400]" /> Faculty Module Performance Scoring (1–10 Scale)
                </h3>
                <p className="text-xs text-gray-600">
                  Assign or update teacher performance ratings for each laboratory module independently of AI practice scores.
                </p>
              </div>

              <div className="space-y-3">
                {SAILL_MODULES.map((mod) => {
                  const scoreObj = facultyScores.find((s) => s.moduleId === mod.id);
                  const isEditing = editingModuleId === mod.id;

                  return (
                    <div key={mod.id} className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs text-[#2C3E50]">{mod.title}</h4>
                          <p className="text-[11px] text-gray-500">Module ID: {mod.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {scoreObj ? (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] font-extrabold text-xs rounded-lg">
                                Score: {scoreObj.score} / 10
                              </span>
                              <button
                                onClick={() => {
                                  setEditingModuleId(mod.id);
                                  setInputScore(scoreObj.score);
                                  setInputRemarks(scoreObj.remarks || '');
                                }}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingModuleId(mod.id);
                                setInputScore(8);
                                setInputRemarks('Good laboratory engagement and articulation.');
                              }}
                              className="px-3 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Assign Score (1–10)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {scoreObj && !isEditing && scoreObj.remarks && (
                        <p className="text-xs text-gray-600 bg-[#FFF8F0] p-2.5 rounded-lg border border-[#FAD7A0]/50 italic">
                          "{scoreObj.remarks}"
                        </p>
                      )}

                      {/* Inline Scoring Editor */}
                      {isEditing && (
                        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
                          <div>
                            <label className="text-xs font-bold text-[#D35400] block mb-1">
                              Select Score (1–10):
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setInputScore(num)}
                                  className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    inputScore === num
                                      ? 'bg-[#D35400] text-white shadow-xs'
                                      : 'bg-white border border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400]'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#2C3E50] block mb-1">
                              Faculty Remarks:
                            </label>
                            <input
                              type="text"
                              value={inputRemarks}
                              onChange={(e) => setInputRemarks(e.target.value)}
                              placeholder="Enter feedback for student module performance..."
                              className="w-full p-2 bg-white border border-[#FAD7A0] rounded-lg text-xs text-[#2C3E50]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingModuleId(null)}
                              className="px-3 py-1.5 text-xs text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveModalScore(mod.id, mod.title)}
                              className="px-3.5 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Score</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeSubTab === 'ai-history' && (
            <div className="space-y-3">
              {aiEvaluationHistory.map((item, idx) => (
                <div key={idx} className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#2C3E50]">{item.module}</h4>
                      <p className="text-[11px] text-gray-500">{item.task} • {item.date}</p>
                    </div>
                    <div className="px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] font-extrabold text-xs rounded-lg">
                      AI Score: {item.score}/100
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 bg-[#FFF8F0] px-3 rounded-lg text-[11px]">
                    <p><span className="font-bold text-gray-600">Clarity:</span> {item.clarity}</p>
                    <p><span className="font-bold text-gray-600">Pitch:</span> {item.pitch}</p>
                    <p><span className="font-bold text-gray-600">Fluency:</span> {item.fluency}</p>
                  </div>
                  <p className="text-xs text-gray-700 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900">Gemini Feedback: </span>
                    {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* SubTab 4: Portfolio & Audio */}
          {activeSubTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#2C3E50]">Best Audio Artifact</h4>
                    <p className="text-[11px] text-gray-500">Module 1 Recitation • Score: 92/100</p>
                  </div>
                  <button className="px-3 py-1.5 bg-[#D35400] text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Audio</span>
                  </button>
                </div>
                <div className="p-2.5 bg-gray-100 rounded-lg text-xs font-mono text-gray-600">
                  Audio File: rec_26691A0501_mod1_best.webm (Sampled at 48kHz)
                </div>
              </div>
            </div>
          )}

          {/* SubTab 5: Attempt History */}
          {activeSubTab === 'attempts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                    <th className="p-2.5 rounded-l-lg">Attempt #</th>
                    <th className="p-2.5">Date & Time</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">AI Score</th>
                    <th className="p-2.5 rounded-r-lg">Result Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attemptHistory.map((att) => (
                    <tr key={att.attemptNo} className="hover:bg-[#FFF8F0]">
                      <td className="p-2.5 font-bold">#{att.attemptNo}</td>
                      <td className="p-2.5 text-gray-600">{att.date}</td>
                      <td className="p-2.5 text-gray-600">{att.duration}</td>
                      <td className="p-2.5 font-extrabold text-[#D35400]">{att.score}%</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SubTab 6: Faculty Notes (Interactive) */}
          {activeSubTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-[#2C3E50]">Add Private Faculty Note / Remark</label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type confidential faculty observations regarding student speech progress..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#D35400] text-white font-bold text-xs rounded-xl hover:bg-[#E67E22] transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">Saved Faculty Notes ({notes.length})</h4>
                {notes.length === 0 ? (
                  <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg">
                    No faculty notes saved yet for this student.
                  </p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-1">
                      <p className="text-[#2C3E50]">{note.noteText}</p>
                      <p className="text-[10px] text-gray-400">
                        Saved on {new Date(note.createdAt).toLocaleString()} by {note.facultyId}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2C3E50] text-white font-bold text-xs rounded-xl hover:bg-[#34495E] transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
