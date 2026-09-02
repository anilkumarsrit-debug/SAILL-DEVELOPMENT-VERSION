import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Users,
  UserCheck,
  Edit3,
  Archive,
  Trash2,
  ArrowRightLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  RefreshCw,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  X,
  ChevronRight,
  Download,
  Eye,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import {
  AcademicBatch,
  BatchStatus,
  FacultyAccount,
  StudentProfile,
  StudentBatchTransferRecord,
  BatchAnalyticsSummary
} from '../types';
import { dbStorage } from '../lib/db';
import { AcademicStructureService } from '../services/AcademicStructureService';

const PROGRAMMES = ['B.Tech', 'M.Tech', 'MBA', 'MCA'];

interface BatchManagementTabProps {
  onShowToast: (type: 'success' | 'error', text: string) => void;
  activeAdminUser?: string;
}

export const BatchManagementTab: React.FC<BatchManagementTabProps> = ({
  onShowToast,
  activeAdminUser = 'ADMIN01'
}) => {
  const [batches, setBatches] = useState<AcademicBatch[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyAccount[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [transferHistory, setTransferHistory] = useState<StudentBatchTransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [selectedAcadYear, setSelectedAcadYear] = useState<string>('ALL');

  // Selected Batch for Roster / Detail View
  const [activeDetailBatch, setActiveDetailBatch] = useState<AcademicBatch | null>(null);
  const [batchAnalytics, setBatchAnalytics] = useState<BatchAnalyticsSummary | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newBatchData, setNewBatchData] = useState({
    academicYear: '2026–2027',
    programme: 'B.Tech',
    department: 'Computer Science & Engineering (CSE)',
    year: 'I Year B.Tech (R26 Regulations)',
    semester: 'Semester I',
    section: 'CSE-A',
    batchName: '',
    batchCode: '',
    assignedFacultyInchargeId: ''
  });

  const [editBatchModal, setEditBatchModal] = useState<{
    isOpen: boolean;
    batch: AcademicBatch | null;
  }>({ isOpen: false, batch: null });

  const [assignFacultyModal, setAssignFacultyModal] = useState<{
    isOpen: boolean;
    batch: AcademicBatch | null;
    facultyId: string;
  }>({ isOpen: false, batch: null, facultyId: '' });

  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    studentRoll: string;
    studentName: string;
    fromBatchId: string;
    fromBatchName: string;
    toBatchId: string;
    reason: string;
  }>({
    isOpen: false,
    studentRoll: '',
    studentName: '',
    fromBatchId: '',
    fromBatchName: '',
    toBatchId: '',
    reason: ''
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Load All Batch Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const bList = await dbStorage.getAllBatches();
      const fList = await dbStorage.getAllFacultyAccounts();
      const sList = await dbStorage.getAllProfiles();
      const tHistory = await dbStorage.getStudentTransferHistory();

      setBatches(bList);
      setFacultyList(fList.filter((f) => f.status === 'active'));
      setStudents(sList);
      setTransferHistory(tHistory);

      if (activeDetailBatch) {
        const updated = bList.find((b) => b.id === activeDetailBatch.id);
        if (updated) {
          setActiveDetailBatch(updated);
          const analytics = await dbStorage.getBatchAnalytics(updated.id);
          setBatchAnalytics(analytics);
        }
      }
    } catch {
      onShowToast('error', 'Failed to load Academic Batch management data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const structYears = AcademicStructureService.getAcademicYears().filter((y) => y.status === 'ACTIVE');
  const structBranches = AcademicStructureService.getBranches().filter((b) => b.status === 'ACTIVE');
  const structDepts = AcademicStructureService.getDepartments().filter((d) => d.status === 'ACTIVE');
  const structSemesters = AcademicStructureService.getSemesters().filter((s) => s.status === 'ACTIVE');
  const structSections = AcademicStructureService.getSections().filter((s) => s.status === 'ACTIVE');

  const acadYearOptions = structYears.length > 0 ? structYears.map((y) => y.yearName) : ['2026–2027'];
  const deptBranchOptions = [
    ...structBranches.map((b) => b.name),
    ...structDepts.filter((d) => !structBranches.some((b) => b.name === d.name)).map((d) => d.name)
  ];
  const finalDeptOptions = deptBranchOptions.length > 0 ? deptBranchOptions : ['CIV – Civil Engineering'];
  const semesterOptions = structSemesters.length > 0 ? structSemesters.map((s) => s.semesterName) : ['Semester I', 'Semester II'];

  const matchingSections = structSections.filter((s) => {
    if (!newBatchData.department) return true;
    const cleanDept = newBatchData.department.toLowerCase();
    const cleanBranch = (s.branch || (s as any).department || '').toLowerCase();
    return !cleanBranch || cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
  });
  const sectionOptions = matchingSections.length > 0 ? matchingSections.map((s) => s.sectionName) : (structSections.length > 0 ? structSections.map((s) => s.sectionName) : ['A']);

  const handleOpenCreateModal = () => {
    const defaultYear = acadYearOptions[0] || '2026–2027';
    const defaultDept = finalDeptOptions[0] || 'CIV – Civil Engineering';
    const defaultSem = semesterOptions[0] || 'Semester II';
    const initialSecs = structSections.filter((s) => {
      const cleanDept = defaultDept.toLowerCase();
      const cleanBranch = (s.branch || (s as any).department || '').toLowerCase();
      return !cleanBranch || cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
    });
    const defaultSec = initialSecs[0]?.sectionName || structSections[0]?.sectionName || 'A';

    setNewBatchData({
      academicYear: defaultYear,
      programme: 'B.Tech',
      department: defaultDept,
      year: 'I Year B.Tech (R26 Regulations)',
      semester: defaultSem,
      section: defaultSec,
      batchName: '',
      batchCode: '',
      assignedFacultyInchargeId: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleDeptChange = (newDept: string) => {
    const newMatchingSecs = structSections.filter((s) => {
      const cleanDept = newDept.toLowerCase();
      const cleanBranch = (s.branch || (s as any).department || '').toLowerCase();
      return !cleanBranch || cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
    });
    const newSec = newMatchingSecs[0]?.sectionName || structSections[0]?.sectionName || 'A';

    setNewBatchData({
      ...newBatchData,
      department: newDept,
      section: newSec
    });
  };

  // Open Batch Detail & Analytics View
  const handleViewBatchDetails = async (batch: AcademicBatch) => {
    setActiveDetailBatch(batch);
    try {
      const analytics = await dbStorage.getBatchAnalytics(batch.id);
      setBatchAnalytics(analytics);
    } catch {
      setBatchAnalytics(null);
    }
  };

  // Create Batch Submit
  const handleCreateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (structYears.length === 0 || finalDeptOptions.length === 0 || structSections.length === 0) {
        throw new Error('Academic Structure must be configured (Years, Branches, Sections) before creating an Academic Batch.');
      }

      // Check section selection
      const matchingSecs = structSections.filter((s) => {
        const cleanDept = newBatchData.department.toLowerCase();
        const cleanBranch = (s.branch || (s as any).department || '').toLowerCase();
        return !cleanBranch || cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
      });

      if (matchingSecs.length > 0 && !matchingSecs.some((s) => s.sectionName === newBatchData.section)) {
        throw new Error(`The section '${newBatchData.section}' does not belong to the selected branch '${newBatchData.department}'. Please select a valid section.`);
      }

      const assignedFac = facultyList.find((f) => f.employeeId === newBatchData.assignedFacultyInchargeId);

      await dbStorage.createBatch(
        {
          academicYear: newBatchData.academicYear,
          programme: newBatchData.programme,
          saillDepartment: 'Humanities & Sciences',
          branch: newBatchData.department,
          department: newBatchData.department,
          year: newBatchData.year,
          semester: newBatchData.semester,
          section: newBatchData.section,
          batchName: newBatchData.batchName || `${newBatchData.programme} ${newBatchData.department} → ${newBatchData.semester} → Section ${newBatchData.section}`,
          batchCode: newBatchData.batchCode || `${newBatchData.department.replace(/[^a-zA-Z]/g, '').substring(0, 4)}-${newBatchData.section}-${newBatchData.academicYear.substring(0, 4)}`,
          status: 'active',
          assignedFacultyInchargeId: assignedFac ? assignedFac.employeeId : '',
          assignedFacultyInchargeName: assignedFac ? assignedFac.fullName : ''
        },
        activeAdminUser
      );

      onShowToast('success', 'Academic Batch successfully created!');
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Failed to create batch.');
    }
  };

  // Edit Batch Submit
  const handleEditBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBatchModal.batch) return;

    try {
      await dbStorage.updateBatch(
        editBatchModal.batch.id,
        {
          batchName: editBatchModal.batch.batchName,
          batchCode: editBatchModal.batch.batchCode,
          department: editBatchModal.batch.department,
          academicYear: editBatchModal.batch.academicYear,
          programme: editBatchModal.batch.programme,
          year: editBatchModal.batch.year,
          semester: editBatchModal.batch.semester,
          section: editBatchModal.batch.section,
          status: editBatchModal.batch.status
        },
        activeAdminUser
      );

      onShowToast('success', `Updated batch '${editBatchModal.batch.batchName}'.`);
      setEditBatchModal({ isOpen: false, batch: null });
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Failed to update batch.');
    }
  };

  // Assign Faculty Submit
  const handleAssignFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignFacultyModal.batch) return;

    try {
      const fac = facultyList.find((f) => f.employeeId === assignFacultyModal.facultyId);
      const facName = fac ? fac.fullName : '';

      await dbStorage.assignFacultyToBatch(
        assignFacultyModal.batch.id,
        assignFacultyModal.facultyId,
        facName,
        activeAdminUser
      );

      onShowToast('success', `Assigned Faculty Incharge to '${assignFacultyModal.batch.batchName}'.`);
      setAssignFacultyModal({ isOpen: false, batch: null, facultyId: '' });
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Faculty assignment failed.');
    }
  };

  // Student Batch Transfer Submit
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModal.studentRoll || !transferModal.toBatchId) {
      onShowToast('error', 'Please select both student and target batch.');
      return;
    }

    try {
      await dbStorage.transferStudentBatch(
        transferModal.studentRoll,
        transferModal.toBatchId,
        transferModal.reason,
        activeAdminUser
      );

      onShowToast('success', `Transferred student '${transferModal.studentRoll}' successfully.`);
      setTransferModal({
        isOpen: false,
        studentRoll: '',
        studentName: '',
        fromBatchId: '',
        fromBatchName: '',
        toBatchId: '',
        reason: ''
      });
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Batch transfer failed.');
    }
  };

  // Toggle Archive Status
  const handleToggleArchive = async (batch: AcademicBatch) => {
    try {
      const newStatus: BatchStatus = batch.status === 'active' ? 'archived' : 'active';
      await dbStorage.updateBatch(batch.id, { status: newStatus }, activeAdminUser);
      onShowToast('success', `Batch '${batch.batchName}' set to ${newStatus}.`);
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Action failed.');
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (batch: AcademicBatch) => {
    if (!window.confirm(`Are you sure you want to delete empty batch '${batch.batchName}'?`)) return;

    try {
      await dbStorage.deleteBatch(batch.id, activeAdminUser);
      onShowToast('success', `Deleted batch '${batch.batchName}'.`);
      if (activeDetailBatch?.id === batch.id) {
        setActiveDetailBatch(null);
      }
      await loadData();
    } catch (err: unknown) {
      onShowToast('error', err instanceof Error ? err.message : 'Cannot delete batch.');
    }
  };

  // Filtered Batches
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.assignedFacultyInchargeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || b.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchesAcadYear = selectedAcadYear === 'ALL' || b.academicYear === selectedAcadYear;

    return matchesSearch && matchesDept && matchesStatus && matchesAcadYear;
  });

  // Students in active detail batch
  const batchStudents = activeDetailBatch
    ? students.filter((s) => s.batchId === activeDetailBatch.id || s.batch === activeDetailBatch.batchName)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#FFF8F0] p-5 border-2 border-[#FAD7A0] rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D35400] text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Institutional Academic Architecture</span>
          </div>
          <h2 className="text-xl font-black text-[#2C3E50] font-heading">
            Class Management Engine
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Configure academic classes, assign Faculty Incharges, transfer students between classes, and audit progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#2C3E50] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D35400]" />
            <span>Class Reports</span>
          </button>

          <button
            onClick={() =>
              setTransferModal({
                isOpen: true,
                studentRoll: '',
                studentName: '',
                fromBatchId: '',
                fromBatchName: '',
                toBatchId: '',
                reason: ''
              })
            }
            className="px-3.5 py-2.5 bg-[#2C3E50] hover:bg-[#34495E] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <span>Transfer Student</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer border border-[#FAD7A0]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Class</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="srit-card p-5 bg-white border border-[#FAD7A0] flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-100 text-purple-900 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Total Batches</p>
            <p className="text-2xl font-black text-[#2C3E50]">{batches.length} Cohorts</p>
            <p className="text-[11px] text-purple-700 font-semibold">
              {batches.filter((b) => b.status === 'active').length} Active • {batches.filter((b) => b.status === 'archived').length} Archived
            </p>
          </div>
        </div>

        <div className="srit-card p-5 bg-white border border-[#FAD7A0] flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-black text-emerald-800">
              {batches.reduce((sum, b) => sum + (b.studentCount || 0), 0)} Students
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">Automatic Batch Enrollment</p>
          </div>
        </div>

        <div className="srit-card p-5 bg-white border border-[#FAD7A0] flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Assigned Incharges</p>
            <p className="text-2xl font-black text-indigo-900">
              {batches.filter((b) => b.assignedFacultyInchargeId).length} / {batches.length}
            </p>
            <p className="text-[11px] text-indigo-700 font-semibold">Faculty Oversight Scoped</p>
          </div>
        </div>

        <div className="srit-card p-5 bg-white border border-[#FAD7A0] flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-100 text-[#D35400] rounded-2xl">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Section Transfers</p>
            <p className="text-2xl font-black text-[#D35400]">{transferHistory.length} Recorded</p>
            <p className="text-[11px] text-amber-700 font-semibold">Audited History Logs</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batches by name, code, department, or faculty incharge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {finalDeptOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Academic Year Filter */}
            <select
              value={selectedAcadYear}
              onChange={(e) => setSelectedAcadYear(e.target.value)}
              className="px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Academic Years</option>
              {acadYearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active Batches</option>
              <option value="archived">Archived Batches</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.map((batch) => {
          const isSelected = activeDetailBatch?.id === batch.id;
          return (
            <div
              key={batch.id}
              className={`srit-card p-5 bg-white border transition duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'border-[#D35400] ring-2 ring-[#D35400]/20 shadow-md'
                  : 'border-[#FAD7A0] hover:border-[#D35400]/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-2 py-0.5 rounded-md">
                    {batch.batchCode}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      batch.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#2C3E50] font-heading leading-snug mb-1">
                  {batch.programme || 'B.Tech'} {batch.branch || batch.department}
                </h3>
                <div className="text-xs font-bold text-[#D35400] mb-2">
                  {batch.semester} • Section {batch.section} • Academic Year {batch.academicYear}
                </div>

                <div className="space-y-1.5 text-xs text-[#5D6D7E] mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate font-semibold">SAILL Department: {batch.saillDepartment || 'Humanities & Sciences'}</span>
                  </div>
                </div>

                {/* Faculty Incharge Box */}
                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl mb-4">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                    Assigned Faculty Incharge
                  </span>
                  {batch.assignedFacultyInchargeName ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2C3E50]">
                        {batch.assignedFacultyInchargeName}
                      </span>
                      <button
                        onClick={() =>
                          setAssignFacultyModal({
                            isOpen: true,
                            batch,
                            facultyId: batch.assignedFacultyInchargeId
                          })
                        }
                        className="text-[11px] text-[#D35400] font-extrabold hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-700 font-semibold italic">Unassigned</span>
                      <button
                        onClick={() =>
                          setAssignFacultyModal({
                            isOpen: true,
                            batch,
                            facultyId: ''
                          })
                        }
                        className="text-[11px] text-[#D35400] font-extrabold hover:underline cursor-pointer"
                      >
                        + Assign
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Footer Stats & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C3E50]">
                    <Users className="w-4 h-4 text-[#D35400]" />
                    <span>{batch.studentCount} Students</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewBatchDetails(batch)}
                      title="View Roster & Analytics"
                      className="p-1.5 text-[#2C3E50] hover:text-[#D35400] hover:bg-[#FFF8F0] rounded-lg transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditBatchModal({ isOpen: true, batch })}
                      title="Edit Batch Details"
                      className="p-1.5 text-[#2C3E50] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleArchive(batch)}
                      title={batch.status === 'active' ? 'Archive Batch' : 'Activate Batch'}
                      className="p-1.5 text-[#2C3E50] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    {batch.studentCount === 0 && (
                      <button
                        onClick={() => handleDeleteBatch(batch)}
                        title="Delete Batch"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBatches.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-[#FAD7A0] rounded-2xl p-8">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#2C3E50]">No Academic Batches Found</h3>
            <p className="text-xs text-[#5D6D7E] mt-1 max-w-md mx-auto">
              No batches match the search criteria. Try adjusting your filters or click 'Create New Batch' to configure a cohort.
            </p>
          </div>
        )}
      </div>

      {/* Selected Batch Details & Student Roster Inspector */}
      {activeDetailBatch && (
        <div className="srit-card p-6 bg-white border-2 border-[#D35400] space-y-6 relative overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase text-white bg-[#D35400] px-2.5 py-0.5 rounded-sm">
                  Active Inspector
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">{activeDetailBatch.batchCode}</span>
              </div>
              <h3 className="text-2xl font-black text-[#2C3E50] font-heading">
                {activeDetailBatch.batchName}
              </h3>
              <p className="text-xs text-[#5D6D7E] mt-1">
                {activeDetailBatch.department} • {activeDetailBatch.year} • Section {activeDetailBatch.section} • {activeDetailBatch.academicYear}
              </p>
            </div>

            <button
              onClick={() => setActiveDetailBatch(null)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg self-start md:self-auto cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Batch Analytics Snapshot */}
          {batchAnalytics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF8F0] p-4 border border-[#FAD7A0] rounded-xl">
              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Avg Module Completion</span>
                <span className="text-xl font-black text-[#D35400]">{batchAnalytics.averageModuleCompletion}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Avg Knowledge Score</span>
                <span className="text-xl font-black text-emerald-700">{batchAnalytics.averageKnowledgeCheckScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase block">Portfolio Rate</span>
                <span className="text-xl font-black text-indigo-800">{batchAnalytics.portfolioCompletionRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase block">AI Readiness Index</span>
                <span className="text-xl font-black text-purple-900">{batchAnalytics.aiReadinessScore} / 100</span>
              </div>
            </div>
          )}

          {/* Student Roster Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D35400]" />
                <span>Enrolled Students ({batchStudents.length})</span>
              </h4>
              <span className="text-xs text-[#5D6D7E]">Primary Key: Roll Number</span>
            </div>

            <div className="overflow-x-auto border border-[#FAD7A0] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8F0] text-[#2C3E50] font-extrabold border-b border-[#FAD7A0] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">XP Score</th>
                    <th className="py-3 px-4 text-right">Batch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#2C3E50] font-medium">
                  {batchStudents.map((s) => (
                    <tr key={s.rollNo} className="hover:bg-[#FFF8F0]/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#D35400]">{s.rollNo}</td>
                      <td className="py-3 px-4 font-bold">{s.name}</td>
                      <td className="py-3 px-4 text-gray-500">{s.email}</td>
                      <td className="py-3 px-4 text-gray-500">{s.joinedDate || '2026-07-01'}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{s.xp || 0} XP</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setTransferModal({
                              isOpen: true,
                              studentRoll: s.rollNo,
                              studentName: s.name,
                              fromBatchId: activeDetailBatch.id,
                              fromBatchName: activeDetailBatch.batchName,
                              toBatchId: '',
                              reason: ''
                            })
                          }
                          className="px-2.5 py-1 bg-[#2C3E50] hover:bg-[#34495E] text-white rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                          <span>Transfer</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {batchStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                        No students currently registered under this batch. Automatic batch mapping will assign new registrants here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="srit-card max-w-xl w-full bg-white border-2 border-[#FAD7A0] p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D35400]" />
                <span>Create New Academic Batch</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={newBatchData.academicYear}
                    onChange={(e) => setNewBatchData({ ...newBatchData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  >
                    {acadYearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Programme *
                  </label>
                  <select
                    value={newBatchData.programme}
                    onChange={(e) => setNewBatchData({ ...newBatchData, programme: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  >
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Department / Branch *
                </label>
                <select
                  value={newBatchData.department}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                >
                  {finalDeptOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Regulation / Year
                  </label>
                  <input
                    type="text"
                    value={newBatchData.year}
                    onChange={(e) => setNewBatchData({ ...newBatchData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                    placeholder="e.g. I Year B.Tech"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Semester *
                  </label>
                  <select
                    value={newBatchData.semester}
                    onChange={(e) => setNewBatchData({ ...newBatchData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  >
                    {semesterOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Section *
                  </label>
                  <select
                    value={newBatchData.section}
                    onChange={(e) => setNewBatchData({ ...newBatchData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  >
                    {sectionOptions.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Batch Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech CSE Section A 2026-27"
                    value={newBatchData.batchName}
                    onChange={(e) => setNewBatchData({ ...newBatchData, batchName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Batch Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE-I-A-2627"
                    value={newBatchData.batchCode}
                    onChange={(e) => setNewBatchData({ ...newBatchData, batchCode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-mono font-bold text-[#2C3E50] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Assign Faculty Incharge
                </label>
                <select
                  value={newBatchData.assignedFacultyInchargeId}
                  onChange={(e) => setNewBatchData({ ...newBatchData, assignedFacultyInchargeId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                >
                  <option value="">-- Unassigned (Select Faculty Later) --</option>
                  {facultyList.map((f) => (
                    <option key={f.employeeId} value={f.employeeId}>
                      {f.fullName} ({f.employeeId}) • {f.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition cursor-pointer shadow-md"
                >
                  Save & Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BATCH MODAL */}
      {editBatchModal.isOpen && editBatchModal.batch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="srit-card max-w-lg w-full bg-white border-2 border-[#FAD7A0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Edit Batch Information</span>
              </h3>
              <button
                onClick={() => setEditBatchModal({ isOpen: false, batch: null })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditBatchSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  required
                  value={editBatchModal.batch.batchName}
                  onChange={(e) =>
                    setEditBatchModal({
                      ...editBatchModal,
                      batch: { ...editBatchModal.batch!, batchName: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Batch Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editBatchModal.batch.batchCode}
                    onChange={(e) =>
                      setEditBatchModal({
                        ...editBatchModal,
                        batch: { ...editBatchModal.batch!, batchCode: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-mono font-bold text-[#2C3E50] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editBatchModal.batch.status}
                    onChange={(e) =>
                      setEditBatchModal({
                        ...editBatchModal,
                        batch: { ...editBatchModal.batch!, status: e.target.value as BatchStatus }
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditBatchModal({ isOpen: false, batch: null })}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN FACULTY MODAL */}
      {assignFacultyModal.isOpen && assignFacultyModal.batch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="srit-card max-w-md w-full bg-white border-2 border-[#FAD7A0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D35400]" />
                <span>Assign Faculty Incharge</span>
              </h3>
              <button
                onClick={() => setAssignFacultyModal({ isOpen: false, batch: null, facultyId: '' })}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5D6D7E]">
              Assigning a Faculty Incharge grants scoped management rights over batch student rosters, lab attendance, and performance analytics.
            </p>

            <form onSubmit={handleAssignFacultySubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Select Faculty Incharge
                </label>
                <select
                  value={assignFacultyModal.facultyId}
                  onChange={(e) => setAssignFacultyModal({ ...assignFacultyModal, facultyId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                >
                  <option value="">-- Remove Assigned Incharge --</option>
                  {facultyList.map((f) => (
                    <option key={f.employeeId} value={f.employeeId}>
                      {f.fullName} ({f.employeeId}) • {f.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAssignFacultyModal({ isOpen: false, batch: null, facultyId: '' })}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition cursor-pointer shadow-md"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT BATCH TRANSFER MODAL */}
      {transferModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="srit-card max-w-lg w-full bg-white border-2 border-[#FAD7A0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                <span>Transfer Student Batch Allocation</span>
              </h3>
              <button
                onClick={() =>
                  setTransferModal({
                    isOpen: false,
                    studentRoll: '',
                    studentName: '',
                    fromBatchId: '',
                    fromBatchName: '',
                    toBatchId: '',
                    reason: ''
                  })
                }
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Student Roll Number *
                </label>
                <select
                  value={transferModal.studentRoll}
                  onChange={(e) => {
                    const sel = students.find((s) => s.rollNo === e.target.value);
                    setTransferModal({
                      ...transferModal,
                      studentRoll: e.target.value,
                      studentName: sel ? sel.name : '',
                      fromBatchId: sel?.batchId || '',
                      fromBatchName: sel?.batchName || sel?.batch || 'Unassigned'
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-mono font-bold text-[#2C3E50]"
                >
                  <option value="">-- Select Enrolled Student --</option>
                  {students.map((s) => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.rollNo} - {s.name} ({s.section})
                    </option>
                  ))}
                </select>
              </div>

              {transferModal.studentRoll && (
                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-1">
                  <div className="text-gray-500 font-bold uppercase text-[10px]">Current Batch Assignment</div>
                  <div className="font-extrabold text-[#2C3E50]">{transferModal.fromBatchName}</div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Target Academic Batch *
                </label>
                <select
                  value={transferModal.toBatchId}
                  onChange={(e) => setTransferModal({ ...transferModal, toBatchId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50]"
                >
                  <option value="">-- Select Target Batch --</option>
                  {batches
                    .filter((b) => b.status === 'active' && b.id !== transferModal.fromBatchId)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchName} ({b.batchCode}) • {b.studentCount} students
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Reason for Transfer *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Official section re-allocation approved by Head of Department."
                  value={transferModal.reason}
                  onChange={(e) => setTransferModal({ ...transferModal, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setTransferModal({
                      isOpen: false,
                      studentRoll: '',
                      studentName: '',
                      fromBatchId: '',
                      fromBatchName: '',
                      toBatchId: '',
                      reason: ''
                    })
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C3E50] text-white rounded-xl text-xs font-bold hover:bg-[#34495E] transition cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Execute Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BATCH REPORT SUMMARY MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="srit-card max-w-2xl w-full bg-white border-2 border-[#FAD7A0] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D35400]" />
                <span>Institutional Batch Enrollment & Progress Report</span>
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-3 text-[#2C3E50]">
              <div className="flex justify-between items-center font-extrabold border-b border-[#FAD7A0] pb-2">
                <span>SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</span>
                <span className="font-mono text-[10px] text-[#D35400]">SAILL LAB REPORT</span>
              </div>

              <p className="text-[11px] text-gray-600">
                Summary of all configured academic cohorts, assigned faculty in-charges, and active student enrollment counts.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {batches.map((b) => (
                  <div key={b.id} className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-[#2C3E50]">{b.batchName}</div>
                      <div className="text-[10px] text-gray-500">
                        Code: {b.batchCode} • Incharge: {b.assignedFacultyInchargeName || 'Unassigned'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-[#D35400] text-sm">{b.studentCount} Students</div>
                      <div className="text-[10px] uppercase font-bold text-emerald-700">{b.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
