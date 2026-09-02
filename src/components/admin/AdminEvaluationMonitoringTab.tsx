import React, { useState, useEffect, useMemo } from 'react';
import { StudentProfile, FacultyAccount, FacultyModuleScore } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { dbStorage } from '../../lib/db';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { AcademicStructureService } from '../../services/AcademicStructureService';
import { EvaluationPdfService } from '../../services/EvaluationPdfService';
import { FacultyEvaluationService } from '../../services/FacultyEvaluationService';
import { R26_MODULES as SAILL_MODULES } from '../../data/modulesData';
import { MODULE_CONFIGS } from '../../data/moduleConfigs';
import {
  Award,
  Search,
  Filter,
  Download,
  Building2,
  Users,
  UserCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AdminEvaluationMonitoringTabProps {
  students?: StudentProfile[];
  allFaculty?: FacultyAccount[];
  assignments?: FacultyAssignment[];
  onRefreshData?: () => void;
}

export const AdminEvaluationMonitoringTab: React.FC<AdminEvaluationMonitoringTabProps> = ({
  students: initialStudents = [],
  allFaculty: initialFaculty = [],
  assignments: initialAssignments = [],
  onRefreshData
}) => {
  const [students, setStudents] = useState<StudentProfile[]>(initialStudents);
  const [allFaculty, setAllFaculty] = useState<FacultyAccount[]>(initialFaculty);
  const [assignments, setAssignments] = useState<FacultyAssignment[]>(initialAssignments);
  const [facultyScores, setFacultyScores] = useState<FacultyModuleScore[]>([]);
  const [moduleReleaseStates, setModuleReleaseStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cascading administrative filters: Branch -> Semester -> Section -> Faculty -> Student Search
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedFacultyEmpId, setSelectedFacultyEmpId] = useState<string>('ALL');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Selected class or student for detailed view
  const [selectedClassKey, setSelectedClassKey] = useState<string | null>(null);
  const [selectedStudentForAudit, setSelectedStudentForAudit] = useState<StudentProfile | null>(null);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      const [stus, facs, scores, adminReleases] = await Promise.all([
        dbStorage.getAllProfiles(),
        dbStorage.getAllFaculty(),
        dbStorage.getAllFacultyModuleScores(),
        dbStorage.getAllAdminModuleReleases()
      ]);

      const asgs = FacultyAssignmentService.getAllAssignments();
      setStudents(stus || []);
      setAllFaculty(facs || []);
      setAssignments(asgs || []);
      setFacultyScores(scores || []);
      
      const releaseMap: Record<string, boolean> = {};
      (adminReleases || []).forEach((r) => {
        if (r.moduleId) {
          releaseMap[r.moduleId] = r.released !== false;
        }
      });
      setModuleReleaseStates(releaseMap);
    } catch (err) {
      console.error('Error loading admin monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Branches, Semesters, Sections lists from AcademicStructureService
  const branches = useMemo(() => AcademicStructureService.getBranches(), []);
  const semesters = useMemo(() => AcademicStructureService.getSemesters(), []);
  const allSections = useMemo(() => AcademicStructureService.getSections(), []);

  // Filtered sections based on branch & semester
  const availableSections = useMemo(() => {
    return allSections.filter((sec) => {
      const matchBranch = selectedBranch === 'ALL' || sec.branch === selectedBranch || sec.branchName === selectedBranch;
      const matchSem = selectedSemester === 'ALL' || sec.semester?.includes(selectedSemester) || selectedSemester.includes(sec.semester || '');
      return matchBranch && matchSem;
    });
  }, [allSections, selectedBranch, selectedSemester]);

  // Build Faculty map for quick lookup
  const facultyMap = useMemo(() => {
    const map = new Map<string, FacultyAccount>();
    allFaculty.forEach((f) => map.set(f.employeeId, f));
    return map;
  }, [allFaculty]);

  // Score lookup map by `${rollNo}__${moduleId}`
  const scoreLookup = useMemo(() => {
    const map = new Map<string, FacultyModuleScore>();
    facultyScores.forEach((s) => {
      map.set(`${s.studentRollNo.toUpperCase()}__${s.moduleId}`, s);
    });
    return map;
  }, [facultyScores]);

  // Group students and faculty into monitored class cohorts
  interface MonitoredClassGroup {
    key: string;
    branch: string;
    semester: string;
    section: string;
    facultyInchargeName: string;
    facultyEmpId: string;
    facultyDepartment: string;
    students: StudentProfile[];
    totalScoresCount: number;
    averageScore: number;
  }

  const monitoredClasses = useMemo(() => {
    const classGroups: MonitoredClassGroup[] = [];

    // Distinct combinations of Branch + Semester + Section
    const classKeys = new Set<string>();

    students.forEach((st) => {
      const br = st.branch || st.department || 'CSE';
      const sem = st.semester || 'Semester I';
      const sec = st.section || 'A';
      const key = `${br}__${sem}__${sec}`;
      classKeys.add(key);
    });

    // Also include configured sections
    allSections.forEach((s) => {
      const br = s.branch || 'CSE';
      const sem = s.semester || 'Semester I';
      const sec = s.sectionName || 'A';
      const key = `${br}__${sem}__${sec}`;
      classKeys.add(key);
    });

    classKeys.forEach((key) => {
      const [br, sem, sec] = key.split('__');

      // Find assigned faculty for this branch/sem/sec
      const assignedFac = assignments.find(
        (a) =>
          a.status === 'ACTIVE' &&
          (a.branch === br || a.branch === 'ALL' || !a.branch) &&
          (a.section === sec || a.section === `Section ${sec}` || a.section === 'ALL' || !a.section)
      );

      const facultyAccount = assignedFac ? facultyMap.get(assignedFac.facultyId) : null;
      const facultyInchargeName = facultyAccount?.fullName || assignedFac?.facultyName || 'Dr. Sarah Jenkins';
      const facultyEmpId = facultyAccount?.employeeId || assignedFac?.facultyId || 'SRIT-FAC-001';
      const facultyDepartment = facultyAccount?.department || 'Humanities & Sciences (English)';

      // Filter students in this class
      const classStudents = students.filter((st) => {
        const studentBranch = st.branch || st.department || 'CSE';
        const studentSem = st.semester || 'Semester I';
        const studentSec = st.section || 'A';
        return (
          studentBranch.toLowerCase() === br.toLowerCase() &&
          (studentSem.toLowerCase().includes(sem.toLowerCase()) || sem.toLowerCase().includes(studentSem.toLowerCase())) &&
          (studentSec.toUpperCase() === sec.toUpperCase() || studentSec.toUpperCase() === `SECTION ${sec.toUpperCase()}`)
        );
      });

      // Calculate class evaluation scores
      let totalScoreSum = 0;
      let evaluatedCount = 0;

      classStudents.forEach((st) => {
        const sScores = facultyScores.filter((s) => s.studentRollNo.toUpperCase() === st.rollNo.toUpperCase());
        sScores.forEach((s) => {
          if (typeof s.score === 'number') {
            totalScoreSum += s.score;
            evaluatedCount++;
          }
        });
      });

      const averageScore = evaluatedCount > 0 ? Number((totalScoreSum / evaluatedCount).toFixed(1)) : 0;

      classGroups.push({
        key,
        branch: br,
        semester: sem,
        section: sec,
        facultyInchargeName,
        facultyEmpId,
        facultyDepartment,
        students: classStudents,
        totalScoresCount: evaluatedCount,
        averageScore
      });
    });

    return classGroups;
  }, [students, allSections, assignments, facultyMap, facultyScores]);

  // Filtered monitored classes based on cascading admin filters
  const filteredClasses = useMemo(() => {
    return monitoredClasses.filter((c) => {
      const matchBranch = selectedBranch === 'ALL' || c.branch === selectedBranch;
      const matchSem = selectedSemester === 'ALL' || c.semester.includes(selectedSemester) || selectedSemester.includes(c.semester);
      const matchSec = selectedSection === 'ALL' || c.section === selectedSection || `Section ${c.section}` === selectedSection;
      const matchFaculty = selectedFacultyEmpId === 'ALL' || c.facultyEmpId === selectedFacultyEmpId;
      return matchBranch && matchSem && matchSec && matchFaculty;
    });
  }, [monitoredClasses, selectedBranch, selectedSemester, selectedSection, selectedFacultyEmpId]);

  // Filtered students across monitored scope
  const filteredStudents = useMemo(() => {
    let list: { student: StudentProfile; classGroup: MonitoredClassGroup }[] = [];

    filteredClasses.forEach((cg) => {
      cg.students.forEach((st) => {
        const matchesQuery =
          !studentSearchQuery.trim() ||
          st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
          st.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase());

        if (matchesQuery) {
          list.push({ student: st, classGroup: cg });
        }
      });
    });

    return list;
  }, [filteredClasses, studentSearchQuery]);

  // 10 R26 Core Modules
  const tenModules = useMemo(() => SAILL_MODULES.slice(0, 10), []);

  // PDF Handlers
  const handleDownloadClassPdf = (classGroup: MonitoredClassGroup) => {
    if (classGroup.students.length === 0) {
      alert(`No enrolled students found in ${classGroup.branch} ${classGroup.semester} Section ${classGroup.section}.`);
      return;
    }

    EvaluationPdfService.generateClassEvaluationPdf(classGroup.students, facultyScores, {
      branch: classGroup.branch,
      semester: classGroup.semester,
      section: classGroup.section,
      facultyIncharge: classGroup.facultyInchargeName,
      institutionName: 'SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY (AUTONOMOUS)'
    });

    showToast(`Generated Class-wise PDF for ${classGroup.branch} Sec ${classGroup.section}`);
  };

  const handleDownloadStudentPdf = (student: StudentProfile, facultyName: string) => {
    const studentScores = facultyScores.filter(
      (s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase()
    );
    EvaluationPdfService.generateStudentEvaluationPdf(student, studentScores, facultyName);
    showToast(`Generated Student Evaluation Record PDF for ${student.name} (${student.rollNo})`);
  };

  const handleExportAllCsv = () => {
    const headers = [
      'Student Roll No',
      'Student Name',
      'Branch',
      'Semester',
      'Section',
      'Assigned Faculty',
      'Module 1',
      'Module 2',
      'Module 3',
      'Module 4',
      'Module 5',
      'Module 6',
      'Module 7',
      'Module 8',
      'Module 9',
      'Module 10',
      'Total Score (/100)',
      'Average Score (/10)'
    ];

    const rows = filteredStudents.map(({ student, classGroup }) => {
      const studentScores = facultyScores.filter(
        (s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase()
      );
      const sMap = new Map<string, FacultyModuleScore>();
      studentScores.forEach((s) => sMap.set(s.moduleId, s));

      let total = 0;
      const mVals = tenModules.map((m) => {
        const sc = sMap.get(m.id);
        if (sc && typeof sc.score === 'number') {
          total += sc.score;
          return sc.score;
        }
        return 'N/A';
      });

      const avg = (total / 10).toFixed(1);

      return [
        `"${student.rollNo}"`,
        `"${student.name}"`,
        `"${classGroup.branch}"`,
        `"${classGroup.semester}"`,
        `"${classGroup.section}"`,
        `"${classGroup.facultyInchargeName}"`,
        ...mVals,
        total,
        avg
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Admin_Day_to_Day_Evaluation_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Master Evaluation Audit CSV');
  };

  // Overall Evaluation Statistics
  const totalMonitoredStudents = students.length;
  const totalEvaluatedRecords = facultyScores.length;
  const institutionalAverageScore = useMemo(() => {
    if (facultyScores.length === 0) return '0.0';
    const sum = facultyScores.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return (sum / facultyScores.length).toFixed(1);
  }, [facultyScores]);

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#D35400] rounded-full text-[11px] font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Academic Monitoring</span>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-[#2C3E50]">
            Day-to-Day Module Evaluation Monitor
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-3xl">
            Monitor Faculty assignments, branch/semester/section cohorts, module release statuses, and faculty-assigned module scores across the institution. Generate official Class-wise and Student-wise evaluation PDFs without modifying student records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadMonitoringData}
            className="px-3.5 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#2C3E50] border border-[#FAD7A0] rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer"
            title="Refresh Evaluation Data"
          >
            <RefreshCw className={`w-4 h-4 text-[#D35400] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportAllCsv}
            className="px-4 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] border border-[#FAD7A0] rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Master CSV</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Monitored Classes
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2C3E50]">{monitoredClasses.length}</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[11px] text-gray-500">Across all branches & sections</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Faculty Assignments
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#D35400]">{assignments.length}</span>
            <UserCheck className="w-5 h-5 text-[#D35400]" />
          </div>
          <p className="text-[11px] text-gray-500">{allFaculty.length} active faculty in-charges</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Evaluated Submissions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-700">{totalEvaluatedRecords}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-500">Faculty-scored module records</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Institutional Average
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-teal-700">
              {institutionalAverageScore} <span className="text-xs font-normal text-gray-400">/ 10</span>
            </span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-[11px] text-gray-500">Day-to-day module score mean</p>
        </div>
      </div>

      {/* CASCADING FILTER CONTROLS (Branch -> Semester -> Section -> Faculty -> Student) */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#D35400]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#2C3E50]">
              Administrative Filter Hierarchy (Branch → Semester → Section → Faculty)
            </h3>
          </div>
          <button
            onClick={() => {
              setSelectedBranch('ALL');
              setSelectedSemester('ALL');
              setSelectedSection('ALL');
              setSelectedFacultyEmpId('ALL');
              setStudentSearchQuery('');
            }}
            className="text-xs text-[#D35400] hover:underline font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* 1. Branch Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">1. Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.code} - {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Semester Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">2. Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              <option value="Semester I">Semester I (Year 1)</option>
              <option value="Semester II">Semester II (Year 1)</option>
              <option value="Semester III">Semester III (Year 2)</option>
              <option value="Semester IV">Semester IV (Year 2)</option>
            </select>
          </div>

          {/* 3. Section Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">3. Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          {/* 4. Faculty Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">4. Faculty In-Charge</label>
            <select
              value={selectedFacultyEmpId}
              onChange={(e) => setSelectedFacultyEmpId(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Faculty</option>
              {allFaculty.map((f) => (
                <option key={f.employeeId} value={f.employeeId}>
                  {f.fullName} ({f.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Student Search Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">5. Student / Roll No</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search roll no or name..."
                className="w-full pl-8 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] placeholder-gray-400 focus:outline-hidden focus:border-[#D35400]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MONITORED CLASS COHORTS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#2C3E50] flex items-center gap-2 font-serif">
            <Layers className="w-4 h-4 text-[#D35400]" />
            <span>Class-wise Academic Cohorts & Faculty Assignments ({filteredClasses.length})</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Click on any cohort to view student roster & download PDF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cg) => {
            const isSelected = selectedClassKey === cg.key;
            return (
              <div
                key={cg.key}
                className={`bg-white p-5 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D35400] ring-2 ring-[#D35400]/20'
                    : 'border-[#FAD7A0]/70 hover:border-[#D35400]/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-100 text-[#D35400] rounded-lg text-xs font-black">
                      {cg.branch} - Sec {cg.section}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">{cg.semester}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#2C3E50]">{cg.facultyInchargeName}</h4>
                    <p className="text-[11px] text-gray-500 font-mono">
                      Faculty ID: {cg.facultyEmpId} • {cg.facultyDepartment}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Students Enrolled</span>
                      <span className="font-extrabold text-[#2C3E50]">{cg.students.length} Students</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Class Average</span>
                      <span className="font-extrabold text-teal-700">
                        {cg.averageScore > 0 ? `${cg.averageScore} / 10` : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Module Release Indicator Bar */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Curriculum Modules Release:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tenModules.map((m, idx) => {
                        const isReleased = moduleReleaseStates[m.id] ?? true;
                        return (
                          <span
                            key={m.id}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              isReleased
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}
                            title={`${m.title}: ${isReleased ? 'Released by Admin' : 'Locked'}`}
                          >
                            M{idx + 1}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setSelectedClassKey(isSelected ? null : cg.key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C3E50] text-white'
                        : 'bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#2C3E50] border border-[#FAD7A0]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Hide Roster' : 'View Scores'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadClassPdf(cg)}
                    className="px-3 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Download Official Class Record PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONSOLIDATED MASTER EVALUATION ROSTER & SCORES TABLE */}
      <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#2C3E50] text-[#FAD7A0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm font-serif">
              Administrative Day-to-Day Module Evaluation Master Sheet
            </h3>
            <p className="text-[11px] text-gray-300">
              Showing {filteredStudents.length} students across monitored academic cohorts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllCsv}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAD7A0] border border-white/20 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Loading administrative evaluation records...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Award className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-[#2C3E50]">No student evaluation records found.</p>
            <p className="text-xs text-gray-500">Try adjusting your filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#1F2C38] text-white/90">
                  <th className="p-3 font-bold text-center w-10">#</th>
                  <th className="p-3 font-bold">Student Name</th>
                  <th className="p-3 font-bold font-mono">Roll Number</th>
                  <th className="p-3 font-bold text-center">Class / Sec</th>
                  <th className="p-3 font-bold">Faculty In-Charge</th>
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
                {filteredStudents.map(({ student, classGroup }, sIdx) => {
                  const studentScores = facultyScores.filter(
                    (s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase()
                  );
                  const sMap = new Map<string, FacultyModuleScore>();
                  studentScores.forEach((s) => sMap.set(s.moduleId, s));

                  let totalScore = 0;
                  const mScores = tenModules.map((mod) => {
                    const sc = sMap.get(mod.id);
                    if (sc && typeof sc.score === 'number') {
                      totalScore += sc.score;
                      return sc.score;
                    }
                    return null;
                  });

                  const averageScore = Number((totalScore / 10).toFixed(1));

                  return (
                    <tr
                      key={student.rollNo}
                      className="hover:bg-[#FFF8F0]/70 transition"
                    >
                      <td className="p-3 text-center text-gray-400 font-mono text-[11px]">
                        {sIdx + 1}
                      </td>
                      <td className="p-3 font-bold text-[#2C3E50]">
                        <button
                          onClick={() => setSelectedStudentForAudit(student)}
                          className="hover:text-[#D35400] text-left underline font-bold cursor-pointer"
                        >
                          {student.name}
                        </button>
                      </td>
                      <td className="p-3 font-mono text-gray-600 font-semibold">
                        {student.rollNo}
                      </td>
                      <td className="p-3 text-center font-semibold text-gray-700">
                        {classGroup.branch} - {classGroup.section}
                      </td>
                      <td className="p-3 text-gray-600">
                        <span className="font-semibold text-xs text-[#2C3E50]">{classGroup.facultyInchargeName}</span>
                      </td>

                      {mScores.map((score, idx) => {
                        const mod = tenModules[idx];
                        return (
                          <td
                            key={mod.id}
                            className="p-2 text-center border-l border-gray-100"
                            title={`${mod.title}: ${score !== null ? `${score} / 10` : 'Pending'}`}
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDownloadStudentPdf(student, classGroup.facultyInchargeName)}
                            className="px-2.5 py-1 bg-[#FFF8F0] hover:bg-[#FAD7A0] text-[#D35400] border border-[#FAD7A0] rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Download Student Evaluation Record PDF"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT AUDIT DETAIL MODAL (ADMINISTRATIVE READ-ONLY VERIFICATION) */}
      {selectedStudentForAudit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#FAD7A0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-[#2C3E50] text-[#FAD7A0] flex items-center justify-between border-b border-[#FAD7A0]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-base text-white">
                    {selectedStudentForAudit.name} ({selectedStudentForAudit.rollNo})
                  </h3>
                  <p className="text-xs text-gray-300">
                    {selectedStudentForAudit.branch || 'CSE'} • {selectedStudentForAudit.semester || 'Semester I'} • Section {selectedStudentForAudit.section || 'A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForAudit(null)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                <div>
                  <span className="text-xs font-bold text-gray-600 block">Assigned Faculty:</span>
                  <span className="font-extrabold text-sm text-[#2C3E50]">Dr. Sarah Jenkins</span>
                </div>
                <button
                  onClick={() => handleDownloadStudentPdf(selectedStudentForAudit, 'Dr. Sarah Jenkins')}
                  className="px-3.5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Student PDF</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                      <th className="p-3">Module</th>
                      <th className="p-3 text-center">Score (/10)</th>
                      <th className="p-3">Performance Descriptor</th>
                      <th className="p-3">Faculty Remarks</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tenModules.map((m) => {
                      const sc = scoreLookup.get(`${selectedStudentForAudit.rollNo.toUpperCase()}__${m.id}`);
                      const desc = sc ? FacultyEvaluationService.getScoreDescriptor(sc.score) : null;
                      return (
                        <tr key={m.id} className="hover:bg-gray-50/60">
                          <td className="p-3 font-semibold text-[#2C3E50]">{m.title}</td>
                          <td className="p-3 text-center font-bold">
                            {sc ? (
                              <span className="text-[#D35400] font-mono text-sm">{sc.score} / 10</span>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </td>
                          <td className="p-3">
                            {desc ? (
                              <span className={`text-[11px] font-bold ${desc.color}`}>{desc.label}</span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-600 italic text-[11px]">
                            {sc?.remarks || '—'}
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[10px]">
                            {sc?.evaluatedAt ? new Date(sc.evaluatedAt).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentForAudit(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
