import React, { useState, useEffect } from 'react';
import { StudentProfile, StudentActivitySubmission, ActivitySubmissionStatus } from '../../types';
import { StudentActivityService } from '../../services/StudentActivityService';
import { FacultyEvaluationService } from '../../services/FacultyEvaluationService';
import { AuthService } from '../../services/AuthService';
import { R26_MODULES as SAILL_MODULES } from '../../data/modulesData';
import {
  FileCheck,
  Eye,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Search,
  Filter,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Award,
  BookOpen,
  UserCheck,
  X,
  AlertCircle
} from 'lucide-react';

interface FacultyAssessmentsTabProps {
  assignedStudents: StudentProfile[];
  onSelectStudent?: (student: StudentProfile) => void;
  onNavigateToScoring?: () => void;
}

export const FacultyAssessmentsTab: React.FC<FacultyAssessmentsTabProps> = ({
  assignedStudents,
  onSelectStudent,
  onNavigateToScoring
}) => {
  const currentUser = AuthService.getCurrentUser();
  const currentEmpId = currentUser?.employeeId || currentUser?.username || 'EMP-ENG-101';
  const facultyName = currentUser?.name || 'Dr. V. Lakshmi';

  const [submissions, setSubmissions] = useState<StudentActivitySubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('ALL');

  // Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<StudentActivitySubmission | null>(null);
  const [facultyRemarksInput, setFacultyRemarksInput] = useState<string>('');
  const [resubmissionReasonInput, setResubmissionReasonInput] = useState<string>('');
  const [showResubmissionPrompt, setShowResubmissionPrompt] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Audio Playback in Modal
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [assignedStudents, currentEmpId]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const isAdministrator = currentUser?.role?.toUpperCase() === 'ADMINISTRATOR';
      const fetched = await StudentActivityService.getSubmissionsForFaculty(
        currentEmpId,
        assignedStudents,
        undefined,
        isAdministrator
      );
      setSubmissions(fetched);
    } catch (err) {
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmission = (sub: StudentActivitySubmission) => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    }
    setSelectedSubmission(sub);
    setFacultyRemarksInput(sub.facultyRemarks || '');
    setResubmissionReasonInput(sub.resubmissionReason || '');
    setShowResubmissionPrompt(false);
    setActionSuccessMsg(null);
  };

  const handleCloseModal = () => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    }
    setSelectedSubmission(null);
  };

  const handleToggleAudio = (audioUrl: string) => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      audio.play();
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!selectedSubmission) return;
    setIsProcessingAction(true);
    try {
      const updated = await StudentActivityService.markActivityReviewed(
        selectedSubmission.id,
        currentEmpId,
        facultyName,
        facultyRemarksInput
      );

      if (updated) {
        setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setSelectedSubmission(updated);
        setActionSuccessMsg('Activity marked as Reviewed! Status is now permanently locked.');
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error reviewing activity:', err);
      alert('Failed to mark as reviewed. Please try again.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleAllowResubmission = async () => {
    if (!selectedSubmission) return;
    setIsProcessingAction(true);
    try {
      const reason = resubmissionReasonInput.trim() || 'Please revise your response based on faculty instructions.';
      const updated = await StudentActivityService.allowResubmission(
        selectedSubmission.id,
        currentEmpId,
        facultyName,
        reason
      );

      if (updated) {
        setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setSelectedSubmission(updated);
        setShowResubmissionPrompt(false);
        setActionSuccessMsg('Resubmission permission granted to student.');
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error allowing resubmission:', err);
      alert('Failed to update submission status.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      sub.studentName.toLowerCase().includes(q) ||
      sub.studentRollNo.toLowerCase().includes(q) ||
      sub.activityTitle.toLowerCase().includes(q) ||
      sub.moduleTitle.toLowerCase().includes(q);

    const matchesModule = selectedModule === 'ALL' || sub.moduleId === selectedModule;
    const matchesStatus = selectedStatus === 'ALL' || sub.status === selectedStatus;
    const matchesType = selectedActivityType === 'ALL' || sub.activityType === selectedActivityType;

    return matchesQuery && matchesModule && matchesStatus && matchesType;
  });

  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'submitted').length;
  const reviewedCount = submissions.filter((s) => s.status === 'reviewed').length;
  const resubmissionCount = submissions.filter((s) => s.status === 'resubmission_allowed').length;

  const handleExportCSV = () => {
    const headers = [
      'Submission ID',
      'Student Roll No',
      'Student Name',
      'Branch',
      'Section',
      'Module ID',
      'Module Title',
      'Activity Title',
      'Activity Type',
      'Submitted At',
      'Status',
      'AI Score (%)',
      'AI Feedback',
      'Faculty Reviewed',
      'Faculty Remarks',
      'Reviewer Name'
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.id}"`,
      `"${s.studentRollNo}"`,
      `"${s.studentName}"`,
      `"${s.studentBranch || 'CSE'}"`,
      `"${s.studentSection || 'A'}"`,
      `"${s.moduleId}"`,
      `"${s.moduleTitle}"`,
      `"${s.activityTitle}"`,
      `"${s.activityType}"`,
      `"${new Date(s.submittedAt).toLocaleString()}"`,
      `"${s.status}"`,
      s.aiScore !== undefined ? s.aiScore : 'N/A',
      `"${(s.aiFeedback || '').replace(/"/g, '""')}"`,
      s.facultyReviewed ? 'Yes' : 'No',
      `"${(s.facultyRemarks || '').replace(/"/g, '""')}"`,
      `"${s.facultyReviewerName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Activity_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#D35400] rounded-full text-[11px] font-bold mb-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Student Activity Evaluation Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-[#2C3E50]">
            Activity Submissions & Faculty Review
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Review and evaluate submitted student activities (audio recordings, spoken drills, written drafts, emails, resumes, and quizzes) exclusively for your <strong className="text-[#D35400]">Admin-assigned class & section</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] border border-[#FAD7A0] rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Submissions CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2C3E50]">{totalCount}</span>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-[11px] text-gray-500">From assigned students</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Pending Faculty Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[11px] text-gray-500">Locked, awaiting faculty review</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Reviewed & Verified
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-700">{reviewedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-500">With faculty remarks</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Resubmission Allowed
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-600">{resubmissionCount}</span>
            <RotateCcw className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[11px] text-gray-500">Unlocked for student edits</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, roll no, or activity..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] placeholder-gray-400 focus:outline-hidden focus:border-[#D35400]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Modules (1–10)</option>
            {SAILL_MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          {/* Activity Type Filter */}
          <select
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Activity Types</option>
            <option value="audio_recording">Audio Recordings</option>
            <option value="speaking_practice">Speaking Drills</option>
            <option value="written_response">Written Responses</option>
            <option value="scenario_response">Scenario Responses</option>
            <option value="practice_task">Practice Tasks</option>
            <option value="digital_notebook">Digital Notebooks</option>
            <option value="reflection_journal">Reflection Journals</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Submitted (Pending Review)</option>
            <option value="reviewed">Reviewed (Locked)</option>
            <option value="resubmission_allowed">Resubmission Allowed</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Loading student activity submissions...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-[#2C3E50]">No activity submissions found.</p>
            <p className="text-xs text-gray-500">
              When students complete and submit activities from their lab modules, their records will appear here for evaluation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                  <th className="p-3.5 font-bold">Student</th>
                  <th className="p-3.5 font-bold">Module & Activity</th>
                  <th className="p-3.5 font-bold text-center">Activity Type</th>
                  <th className="p-3.5 font-bold text-center">Submitted On</th>
                  <th className="p-3.5 font-bold text-center">AI Benchmark</th>
                  <th className="p-3.5 font-bold text-center">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((sub) => {
                  const isReviewed = sub.status === 'reviewed';
                  const isResubmission = sub.status === 'resubmission_allowed';

                  return (
                    <tr key={sub.id} className="hover:bg-[#FFF8F0]/70 transition">
                      {/* Student Info */}
                      <td className="p-3.5">
                        <p className="font-bold text-[#2C3E50]">{sub.studentName}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                          <span>{sub.studentRollNo}</span>
                          <span>•</span>
                          <span>{sub.studentBranch || 'CSE'} - {sub.studentSection || 'A'}</span>
                        </div>
                      </td>

                      {/* Module & Activity Title */}
                      <td className="p-3.5">
                        <p className="font-bold text-[#2C3E50]">{sub.activityTitle}</p>
                        <p className="text-[11px] text-gray-500">{sub.moduleTitle}</p>
                      </td>

                      {/* Activity Type */}
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full border border-gray-200">
                          {sub.activityType.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Submitted On */}
                      <td className="p-3.5 text-center text-gray-600">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>

                      {/* AI Score */}
                      <td className="p-3.5 text-center">
                        {sub.aiScore !== undefined ? (
                          <span className="font-extrabold text-[#D35400] font-mono">
                            {sub.aiScore}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5 text-center">
                        {isReviewed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Reviewed
                          </span>
                        ) : isResubmission ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-full border border-blue-200">
                            <RotateCcw className="w-3 h-3 text-blue-600" />
                            Resubmission Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-600" />
                            Submitted (Locked)
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenSubmission(sub)}
                          className="px-3 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open & Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Evaluation & Audio Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#FAD7A0] overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1F2C38] text-white flex items-center justify-between border-b border-[#FAD7A0]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white font-bold flex items-center justify-center border border-[#FAD7A0]/50 shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-[#FAD7A0] text-base">
                    Faculty Activity Review & Feedback
                  </h3>
                  <p className="text-xs text-gray-300">
                    {selectedSubmission.moduleTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-[#2C3E50]">
              {/* Student Metadata Card */}
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#2C3E50]">{selectedSubmission.studentName}</h4>
                  <p className="text-xs text-gray-600 font-mono">
                    Roll No: {selectedSubmission.studentRollNo} • {selectedSubmission.studentBranch || 'CSE'} - {selectedSubmission.studentSection || 'A'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 block">Submitted At:</span>
                  <span className="text-xs font-bold text-gray-700">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Activity Info Banner */}
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#D35400] uppercase tracking-wider block">
                  Activity Details
                </span>
                <p className="text-sm font-bold text-[#2C3E50]">{selectedSubmission.activityTitle}</p>
                <p className="text-xs text-gray-500">Category: {selectedSubmission.activityCategory || 'Core Practice'}</p>
              </div>

              {/* Audio Player if Audio Recording exists */}
              {selectedSubmission.audioDataUrl && (
                <div className="p-4 bg-gradient-to-r from-[#FFF8F0] to-white border border-[#FAD7A0] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#D35400] flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4" />
                      <span>Student Voice Recording Playback</span>
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Duration: {selectedSubmission.audioDurationSeconds || '~'}s
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(selectedSubmission.audioDataUrl || '')}
                      className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Listen to Recording</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs text-gray-500">
                      {isPlayingAudio ? 'Playing recording...' : 'Click to listen to student articulation'}
                    </span>
                  </div>
                </div>
              )}

              {/* Written Response Content */}
              {selectedSubmission.textContent && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 block">
                    Student Written Response / Artifact:
                  </span>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed font-sans">
                    {selectedSubmission.textContent}
                  </div>
                </div>
              )}

              {/* AI Objective Benchmark Evaluation (Preserved Separately) */}
              {selectedSubmission.aiScore !== undefined && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D35400]" />
                      <span>AI Automated Evaluation (Objective Benchmark)</span>
                    </span>
                    <span className="text-sm font-black text-[#D35400]">
                      {selectedSubmission.aiScore}%
                    </span>
                  </div>
                  {selectedSubmission.aiFeedback && (
                    <p className="text-xs text-gray-600 italic bg-white p-2.5 rounded-lg border border-gray-200">
                      "{selectedSubmission.aiFeedback}"
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 italic">
                    AI evaluation is preserved separately as an objective benchmark.
                  </p>
                </div>
              )}

              {/* Faculty Remarks Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E50] block flex items-center justify-between">
                  <span>Faculty Feedback & Remarks</span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    Visible to student in their portfolio
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={facultyRemarksInput}
                  onChange={(e) => setFacultyRemarksInput(e.target.value)}
                  placeholder="Enter specific feedback on student performance, phonetics articulation, grammar, or cadence..."
                  className="w-full p-3 bg-[#FFF8F0]/40 border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:outline-hidden focus:border-[#D35400]"
                />
              </div>

              {/* Resubmission Reason Input (if shown) */}
              {showResubmissionPrompt && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-fadeIn">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                    <span>Allow Student Resubmission</span>
                  </span>
                  <p className="text-[11px] text-blue-800">
                    Provide instructions on what the student needs to improve or re-record:
                  </p>
                  <input
                    type="text"
                    value={resubmissionReasonInput}
                    onChange={(e) => setResubmissionReasonInput(e.target.value)}
                    placeholder="e.g. Please re-record with clearer articulation on /p/ and /b/ plosives..."
                    className="w-full p-2.5 bg-white border border-blue-300 rounded-lg text-xs text-[#2C3E50] focus:outline-hidden focus:border-blue-500"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowResubmissionPrompt(false)}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAllowResubmission}
                      disabled={isProcessingAction}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-2xs"
                    >
                      Confirm & Unlock Resubmission
                    </button>
                  </div>
                </div>
              )}

              {/* Toast Message */}
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div>
                {!showResubmissionPrompt && (
                  <button
                    type="button"
                    onClick={() => setShowResubmissionPrompt(true)}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Allow Resubmission</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleMarkAsReviewed}
                  disabled={isProcessingAction}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessingAction ? 'Saving...' : 'Mark as Reviewed'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
