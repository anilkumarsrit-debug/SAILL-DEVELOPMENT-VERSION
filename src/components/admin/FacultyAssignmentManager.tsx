import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Trash2,
  Power,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Building2,
  GitBranch,
  Calendar,
  BookOpen,
  Hash
} from 'lucide-react';
import { FacultyAssignment, FacultyAssignmentPayload } from '../../types/academic';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { AcademicStructureService } from '../../services/AcademicStructureService';
import { FacultyAccount } from '../../types';
import { dbStorage } from '../../lib/db';
import { ConfirmationModal } from './ConfirmationModal';

export const FacultyAssignmentManager: React.FC = () => {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyAccount[]>([]);

  // Structure Data for Select Dropdowns
  const [departments, setDepartments] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFaculty, setFilterFaculty] = useState<string>('ALL');
  const [filterBranch, setFilterBranch] = useState<string>('ALL');

  // Modal / Form
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  // Assignment Form State
  const [formState, setFormState] = useState<FacultyAssignmentPayload>({
    facultyId: '',
    facultyName: '',
    department: 'Humanities & Sciences (English)',
    branch: 'Computer Science & Engineering (CSE)',
    academicYear: '2026–2027',
    semester: 'Semester I',
    section: 'CSE-A'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await FacultyAssignmentService.initFromDB();
    setAssignments(list);

    // Load Faculty Accounts
    const facs = await dbStorage.getAllFaculty();
    setFacultyList(facs);

    // Load Academic Structure Dropdowns
    const depts = AcademicStructureService.getDepartments().map((d) => d.name);
    const brs = AcademicStructureService.getBranches().map((b) => b.departmentName || b.name);
    const yrs = AcademicStructureService.getAcademicYears().map((y) => y.yearName);
    const sems = AcademicStructureService.getSemesters().map((s) => s.semesterName);
    const secs = AcademicStructureService.getSections().map((s) => s.sectionName);

    setDepartments(depts.length ? depts : ['Humanities & Sciences (English)', 'Computer Science & Engineering (CSE)']);
    setBranches(brs.length ? brs : ['Computer Science & Engineering (CSE)', 'Electronics & Communication Engineering (ECE)']);
    setYears(yrs.length ? yrs : ['2026–2027', '2025–2026']);
    setSemesters(sems.length ? sems : ['Semester I', 'Semester II']);
    setSections(secs.length ? secs : ['CSE-A', 'CSE-B', 'ECE-A', 'EEE-A']);

    // Set initial selected faculty if available
    if (facs.length > 0) {
      setFormState((prev) => ({
        ...prev,
        facultyId: facs[0].employeeId,
        facultyName: facs[0].fullName,
        department: facs[0].department || depts[0] || 'Humanities & Sciences (English)'
      }));
    }
  };

  const handleOpenModal = () => {
    setFormError('');
    setFormSuccess('');
    setIsAssignModalOpen(true);
  };

  const handleFacultySelectChange = (empId: string) => {
    const selected = facultyList.find((f) => f.employeeId === empId);
    if (selected) {
      setFormState({
        ...formState,
        facultyId: selected.employeeId,
        facultyName: selected.fullName,
        department: selected.department || departments[0] || 'Humanities & Sciences (English)'
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formState.facultyId || !formState.facultyName) {
      setFormError('Please select a valid Faculty Incharge.');
      return;
    }

    try {
      await FacultyAssignmentService.createAssignment(formState, 'Administrator');
      setFormSuccess(
        `Successfully assigned ${formState.facultyName} to ${formState.branch} - ${formState.section} (${formState.academicYear}, ${formState.semester}).`
      );
      loadData();
      setTimeout(() => {
        setIsAssignModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save faculty assignment.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    await FacultyAssignmentService.toggleAssignmentStatus(id);
    await loadData();
  };

  const handleConfirmDelete = async () => {
    await FacultyAssignmentService.deleteAssignment(deleteModal.id);
    await loadData();
    setDeleteModal({ isOpen: false, id: '', title: '' });
  };

  // Filter logic
  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facultyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaculty = filterFaculty === 'ALL' || item.facultyId === filterFaculty;
    const matchesBranch = filterBranch === 'ALL' || item.branch === filterBranch;

    return matchesSearch && matchesFaculty && matchesBranch;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Faculty Oversight System
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">Faculty Incharge Scope Assignments</h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Assign academic groups (Branch, Year, Semester, Section) to Faculty Incharges. Students map automatically based on these groups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Faculty Assignment</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by faculty, roll, section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter by Faculty */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-bold text-[#5D6D7E]">Faculty:</span>
            <select
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Faculty Members</option>
              {facultyList.map((f) => (
                <option key={f.employeeId} value={f.employeeId}>
                  {f.fullName} ({f.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Branch */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5D6D7E]">Branch:</span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Faculty Incharge</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Assigned Academic Group</th>
                <th className="px-5 py-3.5">Session & Semester</th>
                <th className="px-5 py-3.5">Assigned Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    No faculty assignments found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#2C3E50]">{item.facultyName}</div>
                      <span className="text-[10px] font-mono font-extrabold text-[#D35400] px-1.5 py-0.5 rounded bg-[#FFF8F0] border border-[#FAD7A0]">
                        {item.facultyId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{item.department}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#2C3E50]">{item.branch}</div>
                      <div className="text-[11px] font-extrabold text-indigo-700 mt-0.5">
                        Section: <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{item.section}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-700">{item.academicYear}</div>
                      <div className="text-[11px] text-gray-500 font-semibold">{item.semester}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{item.assignedDate}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {item.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            item.status === 'ACTIVE'
                              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={item.status === 'ACTIVE' ? 'Deactivate Assignment' : 'Activate Assignment'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              id: item.id,
                              title: `Remove assignment for ${item.facultyName} (${item.branch} - ${item.section})?`
                            })
                          }
                          className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                          title="Remove Assignment"
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

      {/* NEW ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#FFF8F0] text-[#D35400] rounded-xl border border-[#FAD7A0]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2C3E50]">Assign Academic Group Scope</h3>
                  <p className="text-xs text-[#5D6D7E]">Connect a Faculty Incharge to an academic group.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Select Faculty Incharge */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                  Select Faculty Incharge *
                </label>
                {facultyList.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    No active faculty accounts found. Please register faculty accounts first.
                  </div>
                ) : (
                  <select
                    value={formState.facultyId}
                    onChange={(e) => handleFacultySelectChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  >
                    {facultyList.map((f) => (
                      <option key={f.employeeId} value={f.employeeId}>
                        {f.fullName} ({f.employeeId}) - {f.department}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                  Governing Department (Academic Owner)
                </label>
                <select
                  value={formState.department}
                  onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                    Program *
                  </label>
                  <select
                    value={formState.branch}
                    onChange={(e) => setFormState({ ...formState, branch: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                    Section *
                  </label>
                  <select
                    value={formState.section}
                    onChange={(e) => setFormState({ ...formState, section: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  >
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Academic Year & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                    Academic Year Session *
                  </label>
                  <select
                    value={formState.academicYear}
                    onChange={(e) => setFormState({ ...formState, academicYear: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                    Semester *
                  </label>
                  <select
                    value={formState.semester}
                    onChange={(e) => setFormState({ ...formState, semester: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  >
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duplicate Warning Notice */}
              <p className="text-[11px] text-[#5D6D7E] bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="font-bold text-[#D35400]">Automatic Mapping:</span> Students belonging to{' '}
                <span className="font-bold text-[#2C3E50]">{formState.branch} - Section {formState.section}</span> will be dynamically viewable by {formState.facultyName || 'the assigned faculty'} in their Faculty Dashboard.
              </p>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2C3E50] font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={facultyList.length === 0}
                  className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message="Removing this faculty assignment will disconnect this academic group from the faculty member's dashboard scope. Students will remain enrolled."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
};
