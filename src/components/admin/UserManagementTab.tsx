import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  KeyRound,
  Trash2,
  Power,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Layers,
  UserPlus,
  Sparkles,
  Check,
  GraduationCap
} from 'lucide-react';
import { FacultyAccount, StudentProfile } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { dbStorage } from '../../lib/db';
import { ConfirmationModal } from './ConfirmationModal';
import { FacultyAllocationDrawer } from './FacultyAllocationDrawer';

interface UserManagementTabProps {
  pendingRegistrations: FacultyAccount[];
  allFaculty: FacultyAccount[];
  students: StudentProfile[];
  onRefreshData: () => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  pendingRegistrations,
  allFaculty,
  students,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'faculty' | 'students'>('pending');

  // Selected faculty for Drawer modal
  const [selectedFacultyForDrawer, setSelectedFacultyForDrawer] = useState<FacultyAccount | null>(null);

  // Assignments list for drawer
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);

  useEffect(() => {
    setAssignments(FacultyAssignmentService.getAllAssignments());
  }, [allFaculty]);

  // SEAME Pending Students State
  const [pendingStudents, setPendingStudents] = useState<StudentProfile[]>([]);
  const [pendingSection, setPendingSection] = useState<'students' | 'faculty'>('students');
  const [viewStudentModal, setViewStudentModal] = useState<{ isOpen: boolean; student: StudentProfile | null }>({
    isOpen: false,
    student: null
  });

  // Student Modals
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    student: StudentProfile | null;
    selectedFacultyId: string;
    filterMode: 'RECOMMENDED' | 'ALL';
    searchQuery: string;
  }>({
    isOpen: false,
    student: null,
    selectedFacultyId: '',
    filterMode: 'RECOMMENDED',
    searchQuery: ''
  });

  const handleOpenAssignModal = (student: StudentProfile) => {
    const activeFaculty = allFaculty.filter(
      (f) => (f.status as string)?.toLowerCase() === 'active' || (f.status as string)?.toLowerCase() === 'approved'
    );

    let initialSelectedId = '';
    if (student.assignedFacultyId) {
      const existing = activeFaculty.find(
        (f) => f.employeeId.toUpperCase() === student.assignedFacultyId?.toUpperCase()
      );
      if (existing) initialSelectedId = existing.employeeId;
    }

    setAssignModal({
      isOpen: true,
      student,
      selectedFacultyId: initialSelectedId,
      filterMode: 'RECOMMENDED',
      searchQuery: ''
    });
  };

  const handleSaveStudentFacultyAssignment = async () => {
    if (!assignModal.student || !assignModal.selectedFacultyId) return;

    try {
      const selectedFac = allFaculty.find(
        (f) => f.employeeId.toUpperCase() === assignModal.selectedFacultyId.toUpperCase()
      );

      if (!selectedFac) {
        alert('Selected Faculty Incharge not found.');
        return;
      }

      await dbStorage.assignFacultyToStudent(
        assignModal.student.rollNo,
        selectedFac.employeeId,
        'Administrator'
      );

      const studentBranch = assignModal.student.branch || assignModal.student.department || 'Civil Engineering';
      const studentSec = assignModal.student.section || 'A';
      const studentYear = assignModal.student.academicYear || '2026–27';
      const studentSem = assignModal.student.semester || 'Semester II';

      try {
        await FacultyAssignmentService.createAssignment(
          {
            facultyId: selectedFac.employeeId,
            facultyName: selectedFac.fullName,
            department: selectedFac.department || 'Humanities & Sciences',
            branch: studentBranch,
            academicYear: studentYear,
            semester: studentSem,
            section: studentSec,
            isOverride: true
          },
          'Administrator'
        );
      } catch {
        // duplicate expected
      }

      showToast(`Faculty Incharge '${selectedFac.fullName}' assigned to ${assignModal.student.name} (${assignModal.student.rollNo}).`);
      setAssignModal({
        isOpen: false,
        student: null,
        selectedFacultyId: '',
        filterMode: 'RECOMMENDED',
        searchQuery: ''
      });

      setAssignments(FacultyAssignmentService.getAllAssignments());
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign Faculty Incharge.');
    }
  };
  const [studentRejectModal, setStudentRejectModal] = useState<{ isOpen: boolean; rollNo: string; name: string; reason: string }>({
    isOpen: false,
    rollNo: '',
    name: '',
    reason: ''
  });
  const [correctionModal, setCorrectionModal] = useState<{ isOpen: boolean; rollNo: string; name: string; notes: string }>({
    isOpen: false,
    rollNo: '',
    name: '',
    notes: ''
  });
  const [approvalResultModal, setApprovalResultModal] = useState<{ isOpen: boolean; rollNo: string; name: string; message: string }>({
    isOpen: false,
    rollNo: '',
    name: '',
    message: ''
  });

  const loadPendingStudents = async () => {
    try {
      const p = await dbStorage.getPendingStudentRegistrations();
      setPendingStudents(p);
    } catch {
      setPendingStudents([]);
    }
  };

  useEffect(() => {
    loadPendingStudents();
  }, [students]);

  const handleApproveStudent = async (rollNo: string, name: string) => {
    try {
      const res = await dbStorage.approveStudentRegistration(rollNo, 'Administrator');
      setApprovalResultModal({
        isOpen: true,
        rollNo,
        name,
        message: res.mappingResult
      });
      showToast(`Student ${rollNo} approved.`);
      loadPendingStudents();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve student registration.');
    }
  };

  const handleRejectStudentSubmit = async () => {
    if (!studentRejectModal.reason.trim()) return;
    try {
      await dbStorage.rejectStudentRegistration(studentRejectModal.rollNo, studentRejectModal.reason, 'Administrator');
      showToast(`Student ${studentRejectModal.rollNo} registration rejected.`);
      setStudentRejectModal({ isOpen: false, rollNo: '', name: '', reason: '' });
      loadPendingStudents();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject student registration.');
    }
  };

  const handleRequestCorrectionSubmit = async () => {
    if (!correctionModal.notes.trim()) return;
    try {
      await dbStorage.requestCorrectionStudentRegistration(correctionModal.rollNo, correctionModal.notes, 'Administrator');
      showToast(`Correction request logged for ${correctionModal.rollNo}.`);
      setCorrectionModal({ isOpen: false, rollNo: '', name: '', notes: '' });
      loadPendingStudents();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit correction request.');
    }
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // Reject Modal
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; empId: string; name: string; reason: string }>({
    isOpen: false,
    empId: '',
    name: '',
    reason: ''
  });

  // Reset Password Modal
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    role: 'FACULTY' | 'STUDENT';
    newPass: string;
    showPass: boolean;
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    role: 'FACULTY',
    newPass: '',
    showPass: false
  });

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    role: 'FACULTY' | 'STUDENT';
  }>({
    isOpen: false,
    userId: '',
    userName: '',
    role: 'FACULTY'
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApproveFaculty = async (empId: string) => {
    try {
      await dbStorage.approveFacultyAccount(empId, 'Administrator');
      showToast(`Faculty account ${empId} approved successfully.`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve account.');
    }
  };

  const handleRejectFaculty = async () => {
    if (!rejectModal.reason.trim()) return;
    try {
      await dbStorage.rejectFacultyAccount(rejectModal.empId, rejectModal.reason, 'Administrator');
      showToast(`Faculty account ${rejectModal.empId} rejected.`);
      setRejectModal({ isOpen: false, empId: '', name: '', reason: '' });
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject account.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal.newPass || passwordModal.newPass.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (passwordModal.role === 'FACULTY') {
        await dbStorage.resetFacultyPassword(passwordModal.userId, passwordModal.newPass, 'Administrator');
      } else {
        await dbStorage.resetStudentPassword(passwordModal.userId, passwordModal.newPass, 'Administrator');
      }
      showToast(`Password updated for ${passwordModal.userName}.`);
      setPasswordModal({ isOpen: false, userId: '', userName: '', role: 'FACULTY', newPass: '', showPass: false });
    } catch (err: any) {
      alert(err.message || 'Failed to reset password.');
    }
  };

  const handleToggleFacultyStatus = async (empId: string) => {
    await dbStorage.toggleFacultyStatus(empId, 'Administrator');
    showToast(`Faculty status updated.`);
    onRefreshData();
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.role === 'FACULTY') {
      await dbStorage.deleteFacultyAccount(deleteModal.userId);
    } else {
      await dbStorage.deleteStudentProfile(deleteModal.userId);
    }
    showToast(`User ${deleteModal.userName} deleted.`);
    setDeleteModal({ isOpen: false, userId: '', userName: '', role: 'FACULTY' });
    onRefreshData();
  };

  // Filtered lists
  const filteredPending = pendingRegistrations.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = allFaculty.filter((f) => {
    const matchQuery =
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = branchFilter === 'ALL' || f.department.includes(branchFilter);
    return matchQuery && matchDept;
  });

  const filteredStudents = students.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBranch = branchFilter === 'ALL' || (s.branch || s.department || '').includes(branchFilter);
    return matchQuery && matchBranch;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {toast && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-between">
          <span>{toast}</span>
          <span className="cursor-pointer font-normal" onClick={() => setToast(null)}>
            ✕
          </span>
        </div>
      )}

      {/* Sub Nav Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-white text-[#2C3E50] shadow-xs'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Pending Approvals ({pendingRegistrations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'faculty'
              ? 'bg-white text-[#2C3E50] shadow-xs'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D35400]" />
          <span>Faculty Directory ({allFaculty.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-white text-[#2C3E50] shadow-xs'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Student Directory ({students.length})</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        {activeTab !== 'pending' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-bold text-[#5D6D7E]">Branch / Dept:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
        )}
      </div>

      {/* PENDING APPROVALS TAB */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Sub Switcher for Pending Registrations */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPendingSection('students')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  pendingSection === 'students'
                    ? 'bg-[#2C3E50] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Pending Students ({pendingStudents.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setPendingSection('faculty')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  pendingSection === 'faculty'
                    ? 'bg-[#2C3E50] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Pending Faculty ({pendingRegistrations.length})</span>
              </button>
            </div>
            <span className="text-[11px] font-semibold text-gray-500">
              SEAME Institutional Registration Queue
            </span>
          </div>

          {/* PENDING STUDENTS TABLE */}
          {pendingSection === 'students' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-3 p-4">
              <div className="flex items-center justify-between px-2 pt-2">
                <div>
                  <h3 className="text-sm font-black text-[#2C3E50] uppercase tracking-wider font-heading">
                    STUDENT REGISTRATION REQUESTS
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Pending Students: <span className="font-bold text-[#D35400]">{pendingStudents.length}</span>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="px-3.5 py-3">Roll Number</th>
                      <th className="px-3.5 py-3">Student Name</th>
                      <th className="px-3.5 py-3">Email</th>
                      <th className="px-3.5 py-3">Department</th>
                      <th className="px-3.5 py-3">Branch</th>
                      <th className="px-3.5 py-3">Academic Year</th>
                      <th className="px-3.5 py-3">Semester</th>
                      <th className="px-3.5 py-3">Section</th>
                      <th className="px-3.5 py-3">Registration Date</th>
                      <th className="px-3.5 py-3">Status</th>
                      <th className="px-3.5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {pendingStudents.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-5 py-8 text-center text-gray-400 font-semibold">
                          No pending student registrations awaiting Administrator approval.
                        </td>
                      </tr>
                    ) : (
                      pendingStudents.map((s) => (
                        <tr key={s.rollNo} className="hover:bg-amber-50/40 transition">
                          <td className="px-3.5 py-3 font-bold font-mono text-[#D35400]">{s.rollNo}</td>
                          <td className="px-3.5 py-3 font-bold text-[#2C3E50]">{s.name}</td>
                          <td className="px-3.5 py-3 text-gray-600">{s.email}</td>
                          <td className="px-3.5 py-3 font-semibold text-gray-700">{s.department || s.branch || 'Humanities & Sciences'}</td>
                          <td className="px-3.5 py-3 font-semibold text-gray-700">{s.branch || s.department || 'CSE'}</td>
                          <td className="px-3.5 py-3 text-gray-600">{s.academicYear || '2026–2027'}</td>
                          <td className="px-3.5 py-3 text-gray-600">{s.semester || 'Semester I'}</td>
                          <td className="px-3.5 py-3 font-bold text-indigo-700">Sec {s.section || 'A'}</td>
                          <td className="px-3.5 py-3 text-gray-500">{s.joinedDate || s.createdAt || new Date().toISOString().split('T')[0]}</td>
                          <td className="px-3.5 py-3">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[9px] rounded-md shrink-0">
                              PENDING_APPROVAL
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewStudentModal({ isOpen: true, student: s })}
                                className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(s.rollNo, s.name)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
                                title="Approve Registration"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setStudentRejectModal({ isOpen: true, rollNo: s.rollNo, name: s.name, reason: '' })
                                }
                                className="px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                                title="Reject Registration"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PENDING FACULTY TABLE */}
          {pendingSection === 'faculty' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Employee ID</th>
                      <th className="px-5 py-3.5">Faculty Name</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Email & Mobile</th>
                      <th className="px-5 py-3.5">Registered Date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredPending.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                          No pending faculty registrations awaiting approval.
                        </td>
                      </tr>
                    ) : (
                      filteredPending.map((p) => (
                        <tr key={p.employeeId} className="hover:bg-gray-50/80 transition">
                          <td className="px-5 py-3.5 font-bold font-mono text-[#D35400]">{p.employeeId}</td>
                          <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{p.fullName}</td>
                          <td className="px-5 py-3.5 text-gray-600">{p.department}</td>
                          <td className="px-5 py-3.5">
                            <div className="text-gray-700">{p.email}</div>
                            <div className="text-gray-400 text-[10px]">{p.mobile}</div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">{p.createdAt}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveFaculty(p.employeeId)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setRejectModal({ isOpen: true, empId: p.employeeId, name: p.fullName, reason: '' })
                                }
                                className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FACULTY DIRECTORY TAB */}
      {activeTab === 'faculty' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Employee ID</th>
                  <th className="px-5 py-3.5">Faculty Name</th>
                  <th className="px-5 py-3.5">Department & Designation</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      No faculty records found.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f.employeeId} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold font-mono text-[#D35400]">{f.employeeId}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#2C3E50]">{f.fullName}</div>
                        <div className="text-[10px] text-gray-400">{f.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-700">{f.department}</div>
                        <div className="text-[10px] text-gray-400">{f.designation}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200 text-[10px] font-black uppercase">
                          Faculty Incharge
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            f.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFacultyForDrawer(f)}
                            className="px-2.5 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF3E6] rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            title="Manage Profile & Academic Scope"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Scope</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPasswordModal({
                                isOpen: true,
                                userId: f.employeeId,
                                userName: f.fullName,
                                role: 'FACULTY',
                                newPass: '',
                                showPass: false
                              })
                            }
                            className="p-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFacultyStatus(f.employeeId)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                userId: f.employeeId,
                                userName: f.fullName,
                                role: 'FACULTY'
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT DIRECTORY TAB */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Branch & Section</th>
                  <th className="px-5 py-3.5">Academic Scope</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Faculty Incharge Mapping</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                      No student profiles found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isActive = s.status === 'ACTIVE' || (s.status as string) === 'active';
                    const isPending = s.status === 'PENDING_APPROVAL' || (s.status as string) === 'pending';
                    const isRejected = s.status === 'REJECTED' || (s.status as string) === 'rejected';

                    return (
                      <tr key={s.rollNo} className="hover:bg-gray-50/80 transition">
                        <td className="px-5 py-3.5 font-bold font-mono text-[#D35400]">{s.rollNo}</td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-[#2C3E50]">{s.name}</div>
                          <div className="text-[10px] text-gray-400">{s.email}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-gray-700">{s.branch || s.department}</div>
                          <div className="text-[10px] text-indigo-600 font-bold">Section {s.section}</div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{s.year || s.academicYear || 'I Year'} • {s.semester || 'Sem I'}</td>
                        <td className="px-5 py-3.5">
                          {isPending ? (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[10px] rounded-md">
                              Pending Approval
                            </span>
                          ) : isRejected ? (
                            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-[10px] rounded-md">
                              Rejected
                            </span>
                          ) : isActive ? (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[10px] rounded-md">
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 border border-gray-300 font-extrabold text-[10px] rounded-md">
                              {s.status || 'Suspended'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {!isActive ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200">
                                Not Assigned
                              </span>
                            </div>
                          ) : s.mappingStatus === 'MAPPED' || (s.assignedFacultyName && !s.assignedFacultyName.includes('No Faculty')) ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                MAPPED
                              </span>
                              <div className="text-[11px] font-bold text-[#2C3E50] mt-0.5">{s.assignedFacultyName}</div>
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-md border border-amber-200">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                UNMAPPED
                              </span>
                              <div className="text-[10px] text-gray-500 italic mt-0.5">No Faculty Incharge assigned</div>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={!isActive}
                              onClick={() => handleOpenAssignModal(s)}
                              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 ${
                                !isActive
                                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                                  : s.mappingStatus === 'MAPPED' || (s.assignedFacultyName && !s.assignedFacultyName.includes('No Faculty'))
                                  ? 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0]/60 cursor-pointer'
                                  : 'bg-[#D35400] text-white hover:bg-[#E67E22] shadow-2xs cursor-pointer'
                              }`}
                              title={
                                !isActive
                                  ? 'Approve the student before assigning a Faculty Incharge.'
                                  : s.mappingStatus === 'MAPPED' || (s.assignedFacultyName && !s.assignedFacultyName.includes('No Faculty'))
                                  ? 'Change Faculty Incharge'
                                  : 'Assign Faculty Incharge'
                              }
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>
                                {s.mappingStatus === 'MAPPED' || (s.assignedFacultyName && !s.assignedFacultyName.includes('No Faculty'))
                                  ? 'Change Faculty'
                                  : 'Assign Faculty'}
                              </span>
                            </button>

                          <button
                            type="button"
                            onClick={() =>
                              setPasswordModal({
                                isOpen: true,
                                userId: s.rollNo,
                                userName: s.name,
                                role: 'STUDENT',
                                newPass: '',
                                showPass: false
                              })
                            }
                            className="p-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                userId: s.rollNo,
                                userName: s.name,
                                role: 'STUDENT'
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REJECT REGISTRATION REASON MODAL */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-rose-900">Reject Faculty Registration</h3>
            <p className="text-xs text-[#5D6D7E]">
              Specify the administrative reason for rejecting registration for {rejectModal.name} ({rejectModal.empId}).
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Employee ID verification failed / Invalid department..."
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ isOpen: false, empId: '', name: '', reason: '' })}
                className="px-4 py-2 rounded-xl bg-gray-100 text-[#2C3E50] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectFaculty}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {passwordModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-[#2C3E50]">Reset Password for {passwordModal.userName}</h3>
            <p className="text-xs text-[#5D6D7E]">Enter a new secure password for {passwordModal.userId}.</p>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={passwordModal.showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 chars)"
                  value={passwordModal.newPass}
                  onChange={(e) => setPasswordModal({ ...passwordModal, newPass: e.target.value })}
                  className="w-full px-3 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPasswordModal({ ...passwordModal, showPass: !passwordModal.showPass })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {passwordModal.showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setPasswordModal({ isOpen: false, userId: '', userName: '', role: 'FACULTY', newPass: '', showPass: false })
                  }
                  className="px-4 py-2 rounded-xl bg-gray-100 text-[#2C3E50] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase rounded-xl"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEAME STUDENT APPROVAL RESULT MODAL */}
      {approvalResultModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C3E50]">SEAME Enrollment Approved</h3>
                <p className="text-xs text-gray-500">Student: {approvalResultModal.name} ({approvalResultModal.rollNo})</p>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5 text-emerald-900">
              <div className="font-extrabold uppercase text-[10px] tracking-wider text-emerald-700">
                Academic Mapping Outcome
              </div>
              <p className="font-semibold">{approvalResultModal.message}</p>
            </div>

            <p className="text-[11px] text-gray-500">
              The student account has been activated. They can now log in to SAILL and access their mapped Faculty Workbench workspace.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setApprovalResultModal({ isOpen: false, rollNo: '', name: '', message: '' })}
                className="px-5 py-2.5 bg-[#2C3E50] hover:bg-[#34495E] text-white font-extrabold text-xs uppercase rounded-xl transition cursor-pointer shadow-xs"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEAME STUDENT REJECT MODAL */}
      {studentRejectModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-rose-900">Reject Student Registration</h3>
            <p className="text-xs text-[#5D6D7E]">
              Specify administrative reason for rejecting registration for {studentRejectModal.name} ({studentRejectModal.rollNo}).
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Invalid Roll Number / Section details unverified..."
              value={studentRejectModal.reason}
              onChange={(e) => setStudentRejectModal({ ...studentRejectModal, reason: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentRejectModal({ isOpen: false, rollNo: '', name: '', reason: '' })}
                className="px-4 py-2 rounded-xl bg-gray-100 text-[#2C3E50] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectStudentSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase cursor-pointer"
              >
                Reject Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEAME CORRECTION REQUEST MODAL */}
      {correctionModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-amber-900">Request Data Correction</h3>
            <p className="text-xs text-[#5D6D7E]">
              Specify required corrections for {correctionModal.name} ({correctionModal.rollNo}) before approval.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Please update your Section from B to A according to official department allotment..."
              value={correctionModal.notes}
              onChange={(e) => setCorrectionModal({ ...correctionModal, notes: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCorrectionModal({ isOpen: false, rollNo: '', name: '', notes: '' })}
                className="px-4 py-2 rounded-xl bg-gray-100 text-[#2C3E50] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestCorrectionSubmit}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase cursor-pointer"
              >
                Submit Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL STUDENT -> FACULTY INCHARGE ALLOCATION MODAL */}
      {assignModal.isOpen && assignModal.student && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFF8F0] text-[#D35400] rounded-xl border border-[#FAD7A0]">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2C3E50]">
                    {assignModal.student.assignedFacultyName && !assignModal.student.assignedFacultyName.includes('No Faculty')
                      ? 'Change Faculty Incharge'
                      : 'Assign Faculty Incharge'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Explicitly assign an approved Faculty Incharge to this student
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignModal({ isOpen: false, student: null, selectedFacultyId: '', filterMode: 'RECOMMENDED', searchQuery: '' })}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Target Student Academic Context Summary */}
            <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[#2C3E50]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#D35400]" />
                  <span className="text-sm font-extrabold">{assignModal.student.name}</span>
                  <span className="font-mono text-[#D35400]">({assignModal.student.rollNo})</span>
                </div>
                <span className="px-2.5 py-0.5 bg-white border border-[#FAD7A0] rounded-md text-[10px] font-extrabold text-[#D35400]">
                  {assignModal.student.branch || assignModal.student.department || 'CSE'} • Section {assignModal.student.section || 'A'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#FAD7A0]/60 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Academic Year</span>
                  <span className="font-bold">{assignModal.student.year || assignModal.student.academicYear || 'I Year'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Semester</span>
                  <span className="font-bold">{assignModal.student.semester || 'Semester I'}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Current Faculty Incharge</span>
                  <span className="font-bold text-[#2C3E50]">
                    {assignModal.student.assignedFacultyName && !assignModal.student.assignedFacultyName.includes('No Faculty')
                      ? assignModal.student.assignedFacultyName
                      : 'Not Assigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Faculty Selection Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider flex items-center gap-1">
                  <span>Select Active Faculty Incharge</span>
                  <span className="text-rose-500">*</span>
                </label>

                {/* Filter Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setAssignModal((prev) => ({ ...prev, filterMode: 'RECOMMENDED' }))}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      assignModal.filterMode === 'RECOMMENDED'
                        ? 'bg-white text-[#D35400] shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Recommended Scope Matches
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignModal((prev) => ({ ...prev, filterMode: 'ALL' }))}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      assignModal.filterMode === 'ALL'
                        ? 'bg-white text-[#D35400] shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    All Active Faculty
                  </button>
                </div>
              </div>

              {/* Search Faculty */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search faculty name, employee ID, or department..."
                  value={assignModal.searchQuery}
                  onChange={(e) => setAssignModal((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
                />
              </div>

              {/* Faculty List Options */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-gray-100 p-2 rounded-xl bg-gray-50/50">
                {(() => {
                  const activeFacultyList = allFaculty.filter(
                    (f) => (f.status as string)?.toLowerCase() === 'active' || (f.status as string)?.toLowerCase() === 'approved'
                  );

                  if (activeFacultyList.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No active/approved Faculty Incharges found in the system.
                      </div>
                    );
                  }

                  const studentBranch = (assignModal.student.branch || assignModal.student.department || '').toLowerCase();
                  const studentSec = (assignModal.student.section || 'A').toUpperCase();

                  const filtered = activeFacultyList.filter((f) => {
                    const matchesSearch =
                      f.fullName.toLowerCase().includes(assignModal.searchQuery.toLowerCase()) ||
                      f.employeeId.toLowerCase().includes(assignModal.searchQuery.toLowerCase()) ||
                      f.department.toLowerCase().includes(assignModal.searchQuery.toLowerCase());

                    if (!matchesSearch) return false;

                    if (assignModal.filterMode === 'RECOMMENDED') {
                      const facAssignments = FacultyAssignmentService.getAssignmentsForFaculty(f.employeeId);
                      const deptMatch = f.department.toLowerCase().includes(studentBranch) || studentBranch.includes(f.department.toLowerCase());
                      const scopeMatch = facAssignments.some((a) => {
                        const bMatch = a.branch.toLowerCase().includes(studentBranch) || studentBranch.includes(a.branch.toLowerCase());
                        const sMatch = a.section.toUpperCase().includes(studentSec);
                        return bMatch || sMatch;
                      });
                      return deptMatch || scopeMatch || facAssignments.length === 0;
                    }

                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No faculty members match the filter criteria. Switch to "All Active Faculty" to view all active incharges.
                      </div>
                    );
                  }

                  return filtered.map((f) => {
                    const facAssignments = FacultyAssignmentService.getAssignmentsForFaculty(f.employeeId);
                    const isSelected = assignModal.selectedFacultyId.toUpperCase() === f.employeeId.toUpperCase();

                    const isRecommended =
                      f.department.toLowerCase().includes(studentBranch) ||
                      studentBranch.includes(f.department.toLowerCase()) ||
                      facAssignments.some((a) => a.branch.toLowerCase().includes(studentBranch) && a.section.toUpperCase().includes(studentSec));

                    return (
                      <div
                        key={f.employeeId}
                        onClick={() => setAssignModal((prev) => ({ ...prev, selectedFacultyId: f.employeeId }))}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50/80 border-[#D35400] ring-1 ring-[#D35400]'
                            : 'bg-white border-gray-200 hover:border-[#FAD7A0] hover:bg-gray-50'
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2C3E50]">{f.fullName}</span>
                            <span className="font-mono text-[10px] text-gray-500">({f.employeeId})</span>
                            {isRecommended && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[9px] font-extrabold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                Recommended Scope Match
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-gray-600 flex items-center gap-2">
                            <span className="font-medium">{f.department}</span>
                            <span>•</span>
                            <span className="text-gray-500">
                              {facAssignments.length > 0
                                ? `Assigned Classes: ${facAssignments.map((a) => `${a.branch}-${a.section}`).join(', ')}`
                                : 'General Scope'}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                              isSelected
                                ? 'border-[#D35400] bg-[#D35400] text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAssignModal({ isOpen: false, student: null, selectedFacultyId: '', filterMode: 'RECOMMENDED', searchQuery: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!assignModal.selectedFacultyId}
                onClick={handleSaveStudentFacultyAssignment}
                className="px-5 py-2 bg-[#D35400] text-white font-bold text-xs rounded-xl hover:bg-[#E67E22] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Faculty Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={`Delete User Account for ${deleteModal.userName}?`}
        message="Deleting this user account permanently removes their laboratory credentials and profile records."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, userId: '', userName: '', role: 'FACULTY' })}
      />

      {/* Faculty Allocation Drawer Modal */}
      <FacultyAllocationDrawer
        isOpen={!!selectedFacultyForDrawer}
        faculty={selectedFacultyForDrawer}
        allStudents={students}
        assignmentsList={assignments}
        onClose={() => setSelectedFacultyForDrawer(null)}
        onAllocationUpdated={() => {
          setAssignments(FacultyAssignmentService.getAllAssignments());
          onRefreshData();
        }}
      />

      {/* View Pending Student Modal */}
      {viewStudentModal.isOpen && viewStudentModal.student && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-[#FAD7A0] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-100 text-[#D35400] rounded-2xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2C3E50]">Registration Request Details</h3>
                  <p className="text-xs text-gray-500 font-medium">Pending Student Account Verification</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[10px] rounded-md">
                PENDING_APPROVAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Roll Number</div>
                <div className="font-mono font-bold text-[#D35400] text-sm">{viewStudentModal.student.rollNo}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Student Name</div>
                <div className="font-bold text-[#2C3E50] text-sm">{viewStudentModal.student.name}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1 col-span-2">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Email Address</div>
                <div className="font-medium text-gray-800">{viewStudentModal.student.email}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Department</div>
                <div className="font-bold text-gray-700">{viewStudentModal.student.department || viewStudentModal.student.branch || 'CSE'}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Branch</div>
                <div className="font-bold text-gray-700">{viewStudentModal.student.branch || viewStudentModal.student.department || 'CSE'}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Academic Year</div>
                <div className="font-bold text-gray-700">{viewStudentModal.student.academicYear || '2026–2027'}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Semester</div>
                <div className="font-bold text-gray-700">{viewStudentModal.student.semester || 'Semester I'}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Section</div>
                <div className="font-bold text-indigo-700">Section {viewStudentModal.student.section || 'A'}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="text-[10px] font-extrabold text-gray-500 uppercase">Registration Date</div>
                <div className="font-medium text-gray-700">{viewStudentModal.student.joinedDate || viewStudentModal.student.createdAt}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewStudentModal({ isOpen: false, student: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewStudentModal.student!;
                  setViewStudentModal({ isOpen: false, student: null });
                  setStudentRejectModal({ isOpen: true, rollNo: s.rollNo, name: s.name, reason: '' });
                }}
                className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewStudentModal.student!;
                  setViewStudentModal({ isOpen: false, student: null });
                  handleApproveStudent(s.rollNo, s.name);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
