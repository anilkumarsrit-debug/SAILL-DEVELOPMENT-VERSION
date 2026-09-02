import React, { useState, useEffect } from 'react';
import { StudentProfile, FacultyModuleScore, AcademicBatch, StudentActivitySubmission } from '../../types';
import { dbStorage } from '../../lib/db';
import { FacultyEvaluationService } from '../../services/FacultyEvaluationService';
import { StudentActivityService } from '../../services/StudentActivityService';
import { EvaluationPdfService } from '../../services/EvaluationPdfService';
import { R26_MODULES as SAILL_MODULES } from '../../data/modulesData';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit3,
  Download,
  ShieldCheck,
  Bot,
  GraduationCap,
  Save,
  X,
  Sparkles,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Volume2,
  Play,
  Pause,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Table,
  ListFilter,
  FileText
} from 'lucide-react';

interface FacultyModuleEvaluationTabProps {
  assignedStudents: StudentProfile[];
  facultyId: string;
  facultyName: string;
  facultyDepartment?: string;
  onSelectStudent?: (student: StudentProfile) => void;
}

interface StudentEvaluationRow {
  student: StudentProfile;
  moduleId: string;
  moduleTitle: string;
  completionPercent: number;
  isCompleted: boolean;
  aiPracticeScore: number;
  knowledgeCheckScore: number;
  facultyScoreRecord: FacultyModuleScore | null;
}

export const FacultyModuleEvaluationTab: React.FC<FacultyModuleEvaluationTabProps> = ({
  assignedStudents,
  facultyId,
  facultyName,
  facultyDepartment = 'Humanities & Sciences (English)',
  onSelectStudent
}) => {
  const [evaluationRows, setEvaluationRows] = useState<StudentEvaluationRow[]>([]);
  const [rawFacultyScores, setRawFacultyScores] = useState<FacultyModuleScore[]>([]);
  const [viewMode, setViewMode] = useState<'matrix' | 'queue'>('matrix');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EVALUATED' | 'PENDING' | 'COMPLETED_ONLY'>('ALL');

  // Modal scoring state
  const [activeScoringRow, setActiveScoringRow] = useState<StudentEvaluationRow | null>(null);
  const [activeSubmissions, setActiveSubmissions] = useState<StudentActivitySubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [currentAudioElement, setCurrentAudioElement] = useState<HTMLAudioElement | null>(null);
  const [inputScore, setInputScore] = useState<number>(8);
  const [inputRemarks, setInputRemarks] = useState<string>('');
  const [savingScore, setSavingScore] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadEvaluationData();
  }, [assignedStudents]);

  const loadEvaluationData = async () => {
    setLoading(true);
    try {
      const allFacultyScores = await dbStorage.getAllFacultyModuleScores();
      setRawFacultyScores(allFacultyScores);
      const scoreMap = new Map<string, FacultyModuleScore>();
      allFacultyScores.forEach((s) => {
        scoreMap.set(`${s.studentRollNo.toUpperCase()}__${s.moduleId}`, s);
      });

      const rows: StudentEvaluationRow[] = [];

      for (const student of assignedStudents) {
        for (const mod of SAILL_MODULES) {
          // Fetch module progress
          const progress = await dbStorage.getModuleProgress(mod.id);
          const isCompleted = progress?.status === 'completed';
          const completionPercent = isCompleted ? 100 : progress?.completedTabs ? Math.min(95, progress.completedTabs.length * 20) : 0;
          
          const facultyScoreRecord = scoreMap.get(`${student.rollNo.toUpperCase()}__${mod.id}`) || null;

          rows.push({
            student,
            moduleId: mod.id,
            moduleTitle: mod.title,
            completionPercent,
            isCompleted,
            aiPracticeScore: progress?.score || 88,
            knowledgeCheckScore: progress?.knowledgeCheckScore || 85,
            facultyScoreRecord
          });
        }
      }

      setEvaluationRows(rows);
    } catch (err) {
      console.error('Error loading evaluation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const batches = Array.from(new Set(assignedStudents.map((s) => s.batch || s.section || 'Section A'))).filter(Boolean);

  const filteredRows = evaluationRows.filter((row) => {
    const matchesSearch =
      row.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const studentBatch = row.student.batch || row.student.section || 'Section A';
    const matchesBatch = selectedBatch === 'ALL' || studentBatch === selectedBatch;
    const matchesModule = selectedModule === 'ALL' || row.moduleId === selectedModule;

    let matchesStatus = true;
    if (statusFilter === 'EVALUATED') {
      matchesStatus = !!row.facultyScoreRecord;
    } else if (statusFilter === 'PENDING') {
      matchesStatus = !row.facultyScoreRecord && row.isCompleted;
    } else if (statusFilter === 'COMPLETED_ONLY') {
      matchesStatus = row.isCompleted;
    }

    return matchesSearch && matchesBatch && matchesModule && matchesStatus;
  });

  // Calculate statistics
  const totalEvaluationsPossible = evaluationRows.length;
  const completedModulesCount = evaluationRows.filter((r) => r.isCompleted).length;
  const evaluatedCount = evaluationRows.filter((r) => r.facultyScoreRecord !== null).length;
  const evaluatedRows = evaluationRows.filter((r) => r.facultyScoreRecord !== null);
  const averageFacultyScore =
    evaluatedRows.length > 0
      ? (evaluatedRows.reduce((acc, r) => acc + (r.facultyScoreRecord?.score || 0), 0) / evaluatedRows.length).toFixed(1)
      : '—';
  const pendingEvaluationCount = evaluationRows.filter((r) => r.isCompleted && !r.facultyScoreRecord).length;

  const handleOpenScoringModal = async (row: StudentEvaluationRow) => {
    if (currentAudioElement) {
      currentAudioElement.pause();
      setPlayingAudioUrl(null);
    }
    setActiveScoringRow(row);
    setInputScore(row.facultyScoreRecord ? row.facultyScoreRecord.score : 8);
    setInputRemarks(row.facultyScoreRecord?.remarks || 'Demonstrated good articulation and fluency in lab exercises.');
    setSaveSuccessMessage(null);

    setLoadingSubmissions(true);
    try {
      const subs = await StudentActivityService.getSubmissionsForStudent(row.student.rollNo, row.moduleId);
      setActiveSubmissions(subs);
    } catch {
      setActiveSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleToggleModalAudio = (url: string) => {
    if (playingAudioUrl === url && currentAudioElement) {
      currentAudioElement.pause();
      setPlayingAudioUrl(null);
    } else {
      if (currentAudioElement) {
        currentAudioElement.pause();
      }
      const audio = new Audio(url);
      setCurrentAudioElement(audio);
      audio.play();
      setPlayingAudioUrl(url);
      audio.onended = () => setPlayingAudioUrl(null);
      audio.onerror = () => setPlayingAudioUrl(null);
    }
  };

  const handleSaveScore = async () => {
    if (!activeScoringRow) return;
    setSavingScore(true);
    try {
      const studentBatch = activeScoringRow.student.batchId || activeScoringRow.student.batch || 'DEFAULT-BATCH';
      const studentBatchName = activeScoringRow.student.batchName || activeScoringRow.student.batch || 'Section A';

      const saved = await FacultyEvaluationService.recordScore(
        activeScoringRow.student.rollNo,
        activeScoringRow.student.name,
        activeScoringRow.moduleId,
        activeScoringRow.moduleTitle,
        studentBatch,
        studentBatchName,
        facultyId,
        facultyName,
        inputScore,
        inputRemarks,
        facultyDepartment
      );

      // Update local state
      setEvaluationRows((prev) =>
        prev.map((r) => {
          if (r.student.rollNo === activeScoringRow.student.rollNo && r.moduleId === activeScoringRow.moduleId) {
            return {
              ...r,
              facultyScoreRecord: saved
            };
          }
          return r;
        })
      );

      setSaveSuccessMessage(`Score ${saved.score}/10 successfully saved for ${activeScoringRow.student.name}!`);
      setTimeout(() => {
        setActiveScoringRow(null);
        setSaveSuccessMessage(null);
      }, 1200);
    } catch (err) {
      console.error('Error saving faculty score:', err);
      alert('Failed to save score. Please try again.');
    } finally {
      setSavingScore(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Student Roll No',
      'Student Name',
      'Branch',
      'Section',
      'Module ID',
      'Module Title',
      'Module Status',
      'Completion %',
      'AI Practice Score',
      'Knowledge Check Score',
      'Faculty Performance Score (1-10)',
      'Faculty Descriptor',
      'Faculty Remarks',
      'Evaluated By',
      'Evaluation Date'
    ];

    const rows = filteredRows.map((r) => {
      const desc = r.facultyScoreRecord ? FacultyEvaluationService.getScoreDescriptor(r.facultyScoreRecord.score).label : 'Pending';
      return [
        `"${r.student.rollNo}"`,
        `"${r.student.name}"`,
        `"${r.student.branch || 'CSE'}"`,
        `"${r.student.section || 'A'}"`,
        `"${r.moduleId}"`,
        `"${r.moduleTitle}"`,
        `"${r.isCompleted ? 'Completed' : 'In Progress'}"`,
        r.completionPercent,
        r.aiPracticeScore,
        r.knowledgeCheckScore,
        r.facultyScoreRecord ? r.facultyScoreRecord.score : 'N/A',
        `"${desc}"`,
        `"${(r.facultyScoreRecord?.remarks || '').replace(/"/g, '""')}"`,
        `"${r.facultyScoreRecord?.facultyName || 'N/A'}"`,
        `"${r.facultyScoreRecord?.evaluatedAt ? new Date(r.facultyScoreRecord.evaluatedAt).toLocaleDateString() : 'N/A'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Module_Evaluations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSectionPdf = () => {
    const filteredStudents = assignedStudents.filter((st) => {
      const studentBatch = st.batch || st.section || 'Section A';
      const matchesBatch = selectedBatch === 'ALL' || studentBatch === selectedBatch;
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBatch && matchesSearch;
    });

    const targetStudents = filteredStudents.length > 0 ? filteredStudents : assignedStudents;
    const branch = targetStudents[0]?.branch || targetStudents[0]?.department || 'CSE';
    const semester = targetStudents[0]?.semester || 'Semester I';
    const section = selectedBatch === 'ALL' ? (targetStudents[0]?.section || 'Section A') : selectedBatch;

    EvaluationPdfService.generateClassEvaluationPdf(targetStudents, rawFacultyScores, {
      branch,
      semester,
      section,
      facultyIncharge: facultyName
    });
  };

  const handleDownloadStudentPdf = (student: StudentProfile) => {
    const studentScores = rawFacultyScores.filter(
      (s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase()
    );
    EvaluationPdfService.generateStudentEvaluationPdf(student, studentScores, facultyName);
  };

  // Prepare filtered students for Matrix view
  const tenModules = SAILL_MODULES.slice(0, 10);
  const matrixStudents = assignedStudents.filter((st) => {
    const studentBatch = st.batch || st.section || 'Section A';
    const matchesBatch = selectedBatch === 'ALL' || studentBatch === selectedBatch;
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#D35400] rounded-full text-[11px] font-bold mb-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Faculty Performance Scoring System</span>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-[#2C3E50]">
            Day-to-Day Module Performance Evaluations
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Evaluate and record faculty performance scores on a <strong className="text-[#D35400]">1–10 integer scale</strong> for student completed modules. Scores are stored distinctly from AI evaluations and activity scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadSectionPdf}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Class Record (PDF)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] border border-[#FAD7A0] rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Completed Modules
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2C3E50]">{completedModulesCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-500">Eligible for faculty scoring</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Evaluated by Faculty
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#D35400]">{evaluatedCount}</span>
            <Award className="w-5 h-5 text-[#D35400]" />
          </div>
          <p className="text-[11px] text-gray-500">Scored on 1–10 scale</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Average Faculty Score
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-teal-700">{averageFacultyScore} <span className="text-xs font-normal text-gray-400">/ 10</span></span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-[11px] text-gray-500">Across all evaluated modules</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Pending Faculty Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">{pendingEvaluationCount}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[11px] text-gray-500">Completed modules awaiting score</p>
        </div>
      </div>

      {/* VIEW SWITCHER TABS */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1 border-b border-[#FAD7A0]/40">
        <div className="flex items-center gap-2 bg-[#FFF8F0] p-1 rounded-xl border border-[#FAD7A0]">
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-[#2C3E50] hover:bg-white/60'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Class Evaluation Matrix (Modules 1–10)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('queue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'queue'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'text-[#2C3E50] hover:bg-white/60'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Activity Scoring Queue</span>
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {viewMode === 'matrix' ? `${matrixStudents.length} Students` : `${filteredRows.length} Module Rows`}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll no..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] placeholder-gray-400 focus:outline-hidden focus:border-[#D35400]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Module Filter - Only active in Queue View */}
          {viewMode === 'queue' && (
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Modules</option>
              {SAILL_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          )}

          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Batches/Sections</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Status Filter - Only in Queue View */}
          {viewMode === 'queue' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED_ONLY">Completed Modules Only</option>
              <option value="PENDING">Pending Evaluation</option>
              <option value="EVALUATED">Evaluated (1–10)</option>
            </select>
          )}
        </div>
      </div>

      {/* MATRIX VIEW (CLASS CONSOLIDATED SHEET) */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              Loading student evaluation records...
            </div>
          ) : matrixStudents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Award className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-bold text-sm text-[#2C3E50]">No assigned students match your filter.</p>
              <p className="text-xs text-gray-500">Try adjusting your search query or batch filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                    <th className="p-3 font-bold text-center w-10">#</th>
                    <th className="p-3 font-bold">Student Name</th>
                    <th className="p-3 font-bold font-mono">Roll No</th>
                    <th className="p-3 font-bold text-center">Branch</th>
                    <th className="p-3 font-bold text-center">Sem</th>
                    <th className="p-3 font-bold text-center">Sec</th>
                    {tenModules.map((m, idx) => (
                      <th
                        key={m.id}
                        className="p-2 font-bold text-center text-[11px] border-l border-white/10"
                        title={m.title}
                      >
                        M{idx + 1}
                      </th>
                    ))}
                    <th className="p-3 font-black text-center text-[#FAD7A0] border-l border-white/20">
                      Total /100
                    </th>
                    <th className="p-3 font-black text-center text-emerald-300 border-l border-white/10">
                      Avg /10
                    </th>
                    <th className="p-3 font-bold text-center border-l border-white/10">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {matrixStudents.map((student, sIdx) => {
                    const studentScores = rawFacultyScores.filter(
                      (s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase()
                    );
                    const sMap = new Map<string, FacultyModuleScore>();
                    studentScores.forEach((s) => sMap.set(s.moduleId, s));

                    let totalScore = 0;
                    let evaluatedCount = 0;

                    const mScores = tenModules.map((mod) => {
                      const sc = sMap.get(mod.id);
                      if (sc && typeof sc.score === 'number') {
                        totalScore += sc.score;
                        evaluatedCount++;
                        return sc.score;
                      }
                      return null;
                    });

                    const averageScore = Number((totalScore / 10).toFixed(1));

                    return (
                      <tr key={student.rollNo} className="hover:bg-[#FFF8F0]/70 transition">
                        <td className="p-3 text-center text-gray-400 font-mono text-[11px]">
                          {sIdx + 1}
                        </td>
                        <td className="p-3 font-bold text-[#2C3E50]">
                          {student.name}
                        </td>
                        <td className="p-3 font-mono text-gray-600 font-semibold">
                          {student.rollNo}
                        </td>
                        <td className="p-3 text-center font-semibold text-gray-700">
                          {student.branch || student.department || 'CSE'}
                        </td>
                        <td className="p-3 text-center text-gray-600">
                          {student.semester || 'I'}
                        </td>
                        <td className="p-3 text-center font-bold text-[#D35400]">
                          {student.section || 'A'}
                        </td>

                        {mScores.map((score, idx) => {
                          const mod = tenModules[idx];
                          return (
                            <td
                              key={mod.id}
                              onClick={() => {
                                const row = evaluationRows.find(
                                  (r) => r.student.rollNo === student.rollNo && r.moduleId === mod.id
                                );
                                if (row) handleOpenScoringModal(row);
                              }}
                              className="p-2 text-center border-l border-gray-100 cursor-pointer hover:bg-amber-100/50 transition"
                              title={`Click to evaluate ${mod.title}`}
                            >
                              {score !== null ? (
                                <span className="font-extrabold text-[#D35400] font-mono">
                                  {score}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-[11px]">—</span>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-3 text-center font-mono font-black text-[#D35400] bg-orange-50/50 border-l border-orange-200">
                          {totalScore}
                        </td>
                        <td className="p-3 text-center font-mono font-black text-emerald-700 bg-emerald-50/50 border-l border-emerald-200">
                          {averageScore}
                        </td>
                        <td className="p-3 text-center border-l border-gray-100">
                          <button
                            onClick={() => handleDownloadStudentPdf(student)}
                            className="px-2.5 py-1 bg-[#FFF8F0] hover:bg-[#FAD7A0] text-[#D35400] border border-[#FAD7A0] rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Download Student Day-to-Day Evaluation PDF"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
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
      )}

      {/* QUEUE VIEW (DETAILED EVALUATION ROWS) */}
      {viewMode === 'queue' && (
      <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Loading student module evaluation records...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Award className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-[#2C3E50]">No evaluation records match your filter.</p>
            <p className="text-xs text-gray-500">Try adjusting your search query or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                  <th className="p-3.5 font-bold">Student</th>
                  <th className="p-3.5 font-bold">Module</th>
                  <th className="p-3.5 font-bold text-center">Module Status</th>
                  <th className="p-3.5 font-bold text-center">AI Practice Score</th>
                  <th className="p-3.5 font-bold text-center">Knowledge Check</th>
                  <th className="p-3.5 font-bold text-center">Faculty Score (1–10)</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRows.map((row, idx) => {
                  const scoreRecord = row.facultyScoreRecord;
                  const descriptor = scoreRecord ? FacultyEvaluationService.getScoreDescriptor(scoreRecord.score) : null;

                  return (
                    <tr key={`${row.student.rollNo}_${row.moduleId}`} className="hover:bg-[#FFF8F0]/70 transition">
                      {/* Student Info */}
                      <td className="p-3.5">
                        <p className="font-bold text-[#2C3E50]">{row.student.name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                          <span>{row.student.rollNo}</span>
                          <span>•</span>
                          <span>{row.student.branch || 'CSE'} - {row.student.section || 'A'}</span>
                        </div>
                      </td>

                      {/* Module Title */}
                      <td className="p-3.5">
                        <p className="font-semibold text-[#2C3E50]">{row.moduleTitle}</p>
                        <p className="text-[11px] text-gray-500">ID: {row.moduleId}</p>
                      </td>

                      {/* Completion Status */}
                      <td className="p-3.5 text-center">
                        {row.isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed (100%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            In Progress ({row.completionPercent}%)
                          </span>
                        )}
                      </td>

                      {/* AI Practice Score */}
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-gray-700 font-mono">
                          {row.aiPracticeScore}%
                        </span>
                      </td>

                      {/* Knowledge Check Score */}
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-gray-700 font-mono">
                          {row.knowledgeCheckScore}%
                        </span>
                      </td>

                      {/* Faculty Module Performance Score (1-10) */}
                      <td className="p-3.5 text-center">
                        {scoreRecord ? (
                          <div className="inline-flex flex-col items-center">
                            <div className={`px-3 py-1 rounded-full border font-extrabold text-xs flex items-center gap-1.5 ${descriptor?.badgeBg}`}>
                              <Award className="w-3.5 h-3.5 text-[#D35400]" />
                              <span className="text-[#2C3E50]">{scoreRecord.score} / 10</span>
                              <span className={`text-[10px] font-bold ${descriptor?.color}`}>
                                ({descriptor?.label})
                              </span>
                            </div>
                            {scoreRecord.remarks && (
                              <p className="text-[10px] text-gray-500 italic max-w-xs truncate mt-0.5" title={scoreRecord.remarks}>
                                "{scoreRecord.remarks}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
                            Pending Evaluation
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenScoringModal(row)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer ${
                            scoreRecord
                              ? 'bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] border border-[#FAD7A0]'
                              : 'bg-[#D35400] hover:bg-[#E67E22] text-white shadow-2xs'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{scoreRecord ? 'Edit Score' : 'Evaluate'}</span>
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
      )}

      {/* Scoring Modal Dialog */}
      {activeScoringRow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#FAD7A0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1F2C38] text-white flex items-center justify-between border-b border-[#FAD7A0]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white font-bold flex items-center justify-center border border-[#FAD7A0]/50 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-[#FAD7A0] text-base">
                    Faculty Module Performance Scoring
                  </h3>
                  <p className="text-xs text-gray-300">
                    {activeScoringRow.moduleTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveScoringRow(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-[#2C3E50]">
              {/* Student Header Summary */}
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#2C3E50]">{activeScoringRow.student.name}</h4>
                  <p className="text-xs text-gray-600 font-mono">
                    Roll No: {activeScoringRow.student.rollNo} • {activeScoringRow.student.branch || 'CSE'} - {activeScoringRow.student.section || 'A'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                    activeScoringRow.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeScoringRow.isCompleted ? 'Module Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Reference Scores (AI & Knowledge Check) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Bot className="w-3 h-3 text-teal-600" /> AI Practice Score
                  </span>
                  <p className="font-extrabold text-sm text-gray-800 font-mono">
                    {activeScoringRow.aiPracticeScore}%
                  </p>
                  <p className="text-[10px] text-gray-400">Automated benchmark (AI score kept separate)</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> Knowledge Check
                  </span>
                  <p className="font-extrabold text-sm text-gray-800 font-mono">
                    {activeScoringRow.knowledgeCheckScore}%
                  </p>
                  <p className="text-[10px] text-gray-400">Quiz assessment score</p>
                </div>
              </div>

              {/* Submitted Student Activity Evidence */}
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#D35400]" />
                    Student Submitted Activities ({activeSubmissions.length})
                  </span>
                  {loadingSubmissions && <span className="text-[10px] text-gray-500 animate-pulse">Loading records...</span>}
                </div>

                {activeSubmissions.length === 0 && !loadingSubmissions ? (
                  <p className="text-xs text-gray-500 italic bg-white p-3 rounded-lg border border-dashed border-[#FAD7A0]">
                    No explicit activity submission records logged yet. Student can submit from the module practice studio.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {activeSubmissions.map((sub) => (
                      <div key={sub.id} className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2C3E50]">{sub.activityTitle}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                            sub.status === 'reviewed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'resubmission_allowed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sub.status.toUpperCase()}
                          </span>
                        </div>

                        {sub.textContent && (
                          <div className="p-2 bg-gray-50 rounded text-[11px] text-gray-700 max-h-16 overflow-y-auto border border-gray-100">
                            {sub.textContent}
                          </div>
                        )}

                        {sub.audioDataUrl && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleToggleModalAudio(sub.audioDataUrl!)}
                              className="px-2.5 py-1 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {playingAudioUrl === sub.audioDataUrl ? (
                                <>
                                  <Pause className="w-3 h-3" /> Pause Recording
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3" /> Play Audio Recording
                                </>
                              )}
                            </button>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {sub.audioDurationSeconds || 30}s
                            </span>
                          </div>
                        )}

                        {sub.aiFeedback && (
                          <div className="text-[10px] text-teal-800 bg-teal-50 p-1.5 rounded border border-teal-200">
                            <strong>AI Analysis:</strong> {sub.aiFeedback} (Score: {sub.aiScore}%)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 1 - 10 Score Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#D35400] uppercase tracking-wider">
                    Select Faculty Performance Score (1–10)
                  </label>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 bg-[#D35400] text-white rounded-md">
                    {inputScore} / 10
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    const isSelected = inputScore === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInputScore(val)}
                        className={`h-11 rounded-xl text-xs font-extrabold transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#D35400] text-white ring-2 ring-[#D35400] ring-offset-2 shadow-md scale-105'
                            : 'bg-white border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FFF8F0] hover:border-[#D35400]'
                        }`}
                      >
                        <span className="text-sm">{val}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Score Descriptor helper text */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  FacultyEvaluationService.getScoreDescriptor(inputScore).badgeBg
                }`}>
                  <span className={FacultyEvaluationService.getScoreDescriptor(inputScore).color}>
                    Rating: {FacultyEvaluationService.getScoreDescriptor(inputScore).label}
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">
                    {inputScore >= 9
                      ? 'Exemplary execution and oral precision'
                      : inputScore >= 7
                      ? 'Solid performance meeting high standards'
                      : inputScore >= 5
                      ? 'Satisfactory lab performance'
                      : 'Remediation and practice suggested'}
                  </span>
                </div>
              </div>

              {/* Faculty Remarks Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E50] block">
                  Faculty Observations & Feedback
                </label>
                <textarea
                  rows={3}
                  value={inputRemarks}
                  onChange={(e) => setInputRemarks(e.target.value)}
                  placeholder="Enter specific feedback on phonetics articulation, cadence, stress, or overall lab effort..."
                  className="w-full p-3 bg-[#FFF8F0]/40 border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:outline-hidden focus:border-[#D35400]"
                />
              </div>

              {/* Evaluator Metadata */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>Evaluator: <strong>{facultyName}</strong> ({facultyId})</span>
                </div>
                <span className="text-gray-400 font-mono">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {saveSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveScoringRow(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveScore}
                disabled={savingScore}
                className="px-5 py-2.5 rounded-xl bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingScore ? 'Saving...' : 'Save Performance Score'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
