import React, { useState, useEffect } from 'react';
import {
  Building2,
  GitBranch,
  Calendar,
  BookOpen,
  Layers,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Power,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Wand2,
  Check
} from 'lucide-react';
import {
  Department,
  Branch,
  AcademicYearEntity,
  SemesterEntity,
  SectionEntity,
  ProgrammeEntity,
  AcademicStructureType
} from '../../types/academic';
import { AcademicStructureService } from '../../services/AcademicStructureService';
import { dbStorage } from '../../lib/db';
import { ConfirmationModal } from './ConfirmationModal';

export const AcademicStructureManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AcademicStructureType>('department');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Entity Lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programmes, setProgrammes] = useState<ProgrammeEntity[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearEntity[]>([]);
  const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
  const [sections, setSections] = useState<SectionEntity[]>([]);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formError, setFormError] = useState<string>('');

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: AcademicStructureType;
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'department',
    id: '',
    title: ''
  });

  // Entity Form States
  const [deptForm, setDeptForm] = useState({ code: '', name: '', headOfDepartment: '' });
  const [progForm, setProgForm] = useState({ code: '', name: '' });
  const [branchForm, setBranchForm] = useState({ code: '', name: '', departmentName: '' });
  const [yearForm, setYearForm] = useState({ yearName: '', isCurrent: false });
  const [semForm, setSemForm] = useState({ semesterName: 'Semester I', academicYear: '' });
  const [secForm, setSecForm] = useState({ sectionName: '', branch: '' });

  // Guided Class Setup Wizard State (7 Steps)
  const [wizardState, setWizardState] = useState({
    saillDept: 'Humanities & Sciences',
    programme: 'B.Tech',
    branch: 'Civil Engineering',
    academicYear: '2026–27',
    semester: 'II',
    section: 'A'
  });
  const [wizardSuccessMessage, setWizardSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await AcademicStructureService.syncWithIndexedDB();
    setDepartments(AcademicStructureService.getDepartments());
    setProgrammes(AcademicStructureService.getProgrammes());
    setBranches(AcademicStructureService.getBranches());
    setAcademicYears(AcademicStructureService.getAcademicYears());
    setSemesters(AcademicStructureService.getSemesters());
    setSections(AcademicStructureService.getSections());
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setDeptForm({ code: '', name: '', headOfDepartment: '' });
    setProgForm({ code: '', name: '' });
    setBranchForm({ code: '', name: '', departmentName: departments[0]?.name || 'Humanities & Sciences' });
    setYearForm({ yearName: '', isCurrent: false });
    setSemForm({ semesterName: 'Semester I', academicYear: academicYears[0]?.yearName || '2026–27' });
    setSecForm({ sectionName: '', branch: branches[0]?.name || 'Civil Engineering' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setFormError('');
    if (activeSubTab === 'department') {
      setDeptForm({ code: item.code, name: item.name, headOfDepartment: item.headOfDepartment || '' });
    } else if (activeSubTab === 'programme') {
      setProgForm({ code: item.code, name: item.name });
    } else if (activeSubTab === 'branch') {
      setBranchForm({ code: item.code, name: item.name, departmentName: item.departmentName });
    } else if (activeSubTab === 'academicYear') {
      setYearForm({ yearName: item.yearName, isCurrent: item.isCurrent });
    } else if (activeSubTab === 'semester') {
      setSemForm({ semesterName: item.semesterName, academicYear: item.academicYear });
    } else if (activeSubTab === 'section') {
      setSecForm({ sectionName: item.sectionName, branch: item.branch });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (activeSubTab === 'department') {
        await AcademicStructureService.saveDepartment({
          id: editingItem?.id,
          code: deptForm.code,
          name: deptForm.name,
          headOfDepartment: deptForm.headOfDepartment,
          status: editingItem?.status || 'ACTIVE'
        });
      } else if (activeSubTab === 'programme') {
        await AcademicStructureService.saveProgramme({
          id: editingItem?.id,
          code: progForm.code,
          name: progForm.name,
          status: editingItem?.status || 'ACTIVE'
        });
      } else if (activeSubTab === 'branch') {
        await AcademicStructureService.saveBranch({
          id: editingItem?.id,
          code: branchForm.code,
          name: branchForm.name,
          departmentName: branchForm.departmentName,
          status: editingItem?.status || 'ACTIVE'
        });
      } else if (activeSubTab === 'academicYear') {
        await AcademicStructureService.saveAcademicYear({
          id: editingItem?.id,
          yearName: yearForm.yearName,
          isCurrent: yearForm.isCurrent,
          status: editingItem?.status || 'ACTIVE'
        });
      } else if (activeSubTab === 'semester') {
        await AcademicStructureService.saveSemester({
          id: editingItem?.id,
          semesterName: semForm.semesterName,
          academicYear: semForm.academicYear,
          status: editingItem?.status || 'ACTIVE'
        });
      } else if (activeSubTab === 'section') {
        await AcademicStructureService.saveSection({
          id: editingItem?.id,
          sectionName: secForm.sectionName,
          branch: secForm.branch,
          status: editingItem?.status || 'ACTIVE'
        });
      }

      await loadData();
      setIsModalOpen(false);
      setWizardSuccessMessage('Saved successfully.');
      setTimeout(() => setWizardSuccessMessage(''), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Could not save this academic structure. Please try again.');
    }
  };

  const handleToggleStatus = async (type: AcademicStructureType, id: string) => {
    try {
      if (type === 'department') await AcademicStructureService.toggleDepartmentStatus(id);
      else if (type === 'programme') await AcademicStructureService.toggleProgrammeStatus(id);
      else if (type === 'branch') await AcademicStructureService.toggleBranchStatus(id);
      else if (type === 'academicYear') await AcademicStructureService.toggleAcademicYearStatus(id);
      else if (type === 'semester') await AcademicStructureService.toggleSemesterStatus(id);
      else if (type === 'section') await AcademicStructureService.toggleSectionStatus(id);
      await loadData();
    } catch (err) {
      alert('Could not update status. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    try {
      if (type === 'department') await AcademicStructureService.deleteDepartment(id);
      else if (type === 'programme') await AcademicStructureService.deleteProgramme(id);
      else if (type === 'branch') await AcademicStructureService.deleteBranch(id);
      else if (type === 'academicYear') await AcademicStructureService.deleteAcademicYear(id);
      else if (type === 'semester') await AcademicStructureService.deleteSemester(id);
      else if (type === 'section') await AcademicStructureService.deleteSection(id);

      await loadData();
      setDeleteConfirm({ isOpen: false, type: 'department', id: '', title: '' });
    } catch (err) {
      alert('Could not delete record. Please try again.');
    }
  };

  // Helper filter function
  const filterList = (list: any[], searchFields: string[]) => {
    return list.filter((item) => {
      const matchesSearch = searchFields.some((field) =>
        (item[field] || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredDepts = filterList(departments, ['code', 'name', 'headOfDepartment']);
  const filteredProgs = filterList(programmes, ['code', 'name']);
  const filteredBranches = filterList(branches, ['code', 'name', 'departmentName']);
  const filteredYears = filterList(academicYears, ['yearName']);
  const filteredSemesters = filterList(semesters, ['semesterName', 'academicYear']);
  const filteredSections = filterList(sections, ['sectionName', 'branch']);

  // Handle Guided Class Creation Step 7 Submit
  const handleCreateGuidedClass = async () => {
    try {
      const semLabel = wizardState.semester.startsWith('Semester') ? wizardState.semester : `Semester ${wizardState.semester}`;
      const batchName = `${wizardState.programme} ${wizardState.branch} → ${semLabel} → Section ${wizardState.section}`;
      const branchCode = wizardState.branch.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
      const batchCode = `${branchCode}-${wizardState.programme}-${semLabel.replace(/[^a-zA-Z0-9]/g, '')}-${wizardState.section}`;

      // 1. Ensure parent academic hierarchy structure exists in IndexedDB first
      await AcademicStructureService.ensureParentStructureExists({
        saillDept: wizardState.saillDept,
        programme: wizardState.programme,
        branch: wizardState.branch,
        academicYear: wizardState.academicYear,
        semester: semLabel,
        section: wizardState.section
      });

      // 2. Save AcademicBatch in IndexedDB
      await dbStorage.createBatch(
        {
          academicYear: wizardState.academicYear,
          programme: wizardState.programme,
          saillDepartment: wizardState.saillDept,
          branch: wizardState.branch,
          department: wizardState.branch,
          year: `${wizardState.programme} (${wizardState.branch})`,
          semester: semLabel,
          section: wizardState.section,
          batchName: batchName,
          batchCode: batchCode,
          status: 'active',
          assignedFacultyInchargeId: '',
          assignedFacultyInchargeName: ''
        },
        'ADMIN'
      );

      await loadData();

      setWizardSuccessMessage('Class created successfully.');
      setTimeout(() => setWizardSuccessMessage(''), 5000);
    } catch (err: any) {
      setWizardSuccessMessage('');
      alert('Class creation could not be completed. No incomplete class has been activated.');
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Top Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Academic Governance & Institutional Hierarchy
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">Academic Structure Configuration</h2>
        </div>

        {activeSubTab !== 'classWizard' && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>
              Add{' '}
              {activeSubTab === 'department'
                ? 'SAILL Department'
                : activeSubTab === 'programme'
                ? 'Programme'
                : activeSubTab === 'branch'
                ? 'Branch'
                : activeSubTab === 'academicYear'
                ? 'Academic Year'
                : activeSubTab === 'semester'
                ? 'Semester'
                : 'Section'}
            </span>
          </button>
        )}
      </div>

      {/* SAILL Academic Owner Banner */}
      <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] p-5 rounded-2xl border border-[#FAD7A0]/30 shadow-md text-white space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D35400] text-white rounded-xl shadow-xs">
              <Building2 className="w-5 h-5 text-[#FAD7A0]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-[#FAD7A0] uppercase tracking-wider block">
                SAILL Operating Department
              </span>
              <h3 className="text-base font-black text-white font-serif">
                Humanities & Sciences
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <Sparkles className="w-4 h-4 text-[#FAD7A0]" />
            <span>Subject: <strong>English / Communicative English</strong></span>
          </div>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed pt-1">
          <strong>Humanities & Sciences</strong> is the SAILL academic owner operating language instruction. Students belong to different student engineering branches (e.g., Civil Engineering, Computer Science & Engineering, Electronics & Communication Engineering). Student engineering branches are NOT duplicate SAILL departments.
        </p>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('department')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'department'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#D35400]" />
          <span>SAILL Department ({departments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('programme')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'programme'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#D35400]" />
          <span>Programmes ({programmes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('branch')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'branch'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <GitBranch className="w-4 h-4 text-[#D35400]" />
          <span>Branches ({branches.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('academicYear')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'academicYear'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#D35400]" />
          <span>Academic Years ({academicYears.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('semester')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'semester'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Semesters ({semesters.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('section')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'section'
              ? 'bg-white text-[#2C3E50] shadow-xs font-black'
              : 'text-[#5D6D7E] hover:text-[#2C3E50]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#D35400]" />
          <span>Sections ({sections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('classWizard')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'classWizard'
              ? 'bg-[#D35400] text-white shadow-xs font-black'
              : 'bg-amber-100/60 text-[#D35400] hover:bg-amber-100'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Guided Class Setup (7 Steps)</span>
        </button>
      </div>

      {/* Search & Filter Bar (Only shown for list sub-tabs) */}
      {activeSubTab !== 'classWizard' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-bold text-[#5D6D7E]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      )}

      {/* TABLE VIEW: SAILL DEPARTMENTS */}
      {activeSubTab === 'department' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">SAILL Department Name</th>
                  <th className="px-5 py-3.5">Head of Department</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredDepts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      No departments configured.
                    </td>
                  </tr>
                ) : (
                  filteredDepts.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#D35400]">{d.code}</td>
                      <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{d.name}</td>
                      <td className="px-5 py-3.5 text-gray-600">{d.headOfDepartment || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            d.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {d.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{d.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('department', d.id)}
                            className="p-1.5 rounded-lg border transition cursor-pointer bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(d)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'department',
                                id: d.id,
                                title: `Delete Department '${d.name}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* TABLE VIEW: PROGRAMMES */}
      {activeSubTab === 'programme' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Programme Code</th>
                  <th className="px-5 py-3.5">Programme Name</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No programmes configured yet. Click 'Add Programme' to define academic programmes.
                    </td>
                  </tr>
                ) : (
                  filteredProgs.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#D35400]">{p.code}</td>
                      <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{p.name}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {p.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{p.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('programme', p.id)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'programme',
                                id: p.id,
                                title: `Delete Programme '${p.name}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* TABLE VIEW: BRANCHES */}
      {activeSubTab === 'branch' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Branch Code</th>
                  <th className="px-5 py-3.5">Branch Name</th>
                  <th className="px-5 py-3.5">SAILL Department</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      No branches configured.
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#D35400]">{b.code}</td>
                      <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{b.name}</td>
                      <td className="px-5 py-3.5 text-gray-600">{b.departmentName}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            b.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {b.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{b.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('branch', b.id)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(b)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'branch',
                                id: b.id,
                                title: `Delete Branch '${b.name}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* TABLE VIEW: ACADEMIC YEARS */}
      {activeSubTab === 'academicYear' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Academic Year</th>
                  <th className="px-5 py-3.5">Current Session</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredYears.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No academic years configured.
                    </td>
                  </tr>
                ) : (
                  filteredYears.map((y) => (
                    <tr key={y.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{y.yearName}</td>
                      <td className="px-5 py-3.5">
                        {y.isCurrent ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                            Current Year
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Regular</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            y.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {y.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {y.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{y.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('academicYear', y.id)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(y)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'academicYear',
                                id: y.id,
                                title: `Delete Academic Year '${y.yearName}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* TABLE VIEW: SEMESTERS */}
      {activeSubTab === 'semester' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Semester Name</th>
                  <th className="px-5 py-3.5">Academic Year</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredSemesters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No semesters configured.
                    </td>
                  </tr>
                ) : (
                  filteredSemesters.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#2C3E50]">{s.semesterName}</td>
                      <td className="px-5 py-3.5 text-gray-600 font-semibold">{s.academicYear}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            s.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {s.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{s.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('semester', s.id)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(s)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'semester',
                                id: s.id,
                                title: `Delete Semester '${s.semesterName}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* TABLE VIEW: SECTIONS */}
      {activeSubTab === 'section' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C3E50] text-white uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Section Name</th>
                  <th className="px-5 py-3.5">Associated Branch</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredSections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No sections configured.
                    </td>
                  </tr>
                ) : (
                  filteredSections.map((sec) => (
                    <tr key={sec.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-[#D35400]">{sec.sectionName}</td>
                      <td className="px-5 py-3.5 text-gray-600 font-semibold">{sec.branch}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            sec.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {sec.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {sec.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{sec.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus('section', sec.id)}
                            className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(sec)}
                            className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'section',
                                id: sec.id,
                                title: `Delete Section '${sec.sectionName}'?`
                              })
                            }
                            className="p-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete"
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

      {/* GUIDED CLASS SETUP WIZARD (7 STEPS) */}
      {activeSubTab === 'classWizard' && (
        <div className="bg-white rounded-2xl border-2 border-[#D35400] p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase text-[#D35400] tracking-wider block">
                Guided Administrator Setup
              </span>
              <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#D35400]" />
                <span>Class Creation Guided Setup (7 Steps)</span>
              </h3>
            </div>
            <span className="text-xs font-extrabold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              SAILL Academic Hierarchy
            </span>
          </div>

          {wizardSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>{wizardSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* STEP 1 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 1
                </span>
                <span className="text-[10px] font-bold text-gray-400">SAILL Department</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                First select the department that operates SAILL.
              </label>
              <select
                value={wizardState.saillDept}
                onChange={(e) => setWizardState({ ...wizardState, saillDept: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                {departments.length > 0 ? (
                  departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))
                ) : (
                  <option value="Humanities & Sciences">Humanities & Sciences</option>
                )}
              </select>
            </div>

            {/* STEP 2 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 2
                </span>
                <span className="text-[10px] font-bold text-gray-400">Programme</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                Select the academic programme.
              </label>
              <select
                value={wizardState.programme}
                onChange={(e) => setWizardState({ ...wizardState, programme: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                {programmes.length > 0 ? (
                  programmes.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.code})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                  </>
                )}
              </select>
            </div>

            {/* STEP 3 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 3
                </span>
                <span className="text-[10px] font-bold text-gray-400">Branch</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                Select the student branch.
              </label>
              <select
                value={wizardState.branch}
                onChange={(e) => setWizardState({ ...wizardState, branch: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.code})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                    <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </>
                )}
              </select>
            </div>

            {/* STEP 4 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 4
                </span>
                <span className="text-[10px] font-bold text-gray-400">Academic Year</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                Select the academic year.
              </label>
              <select
                value={wizardState.academicYear}
                onChange={(e) => setWizardState({ ...wizardState, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                {academicYears.length > 0 ? (
                  academicYears.map((y) => (
                    <option key={y.id} value={y.yearName}>
                      {y.yearName} {y.isCurrent ? '(Current)' : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="2026–27">2026–27</option>
                    <option value="2026–2027">2026–2027</option>
                  </>
                )}
              </select>
            </div>

            {/* STEP 5 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 5
                </span>
                <span className="text-[10px] font-bold text-gray-400">Semester</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                Select the semester.
              </label>
              <select
                value={wizardState.semester}
                onChange={(e) => setWizardState({ ...wizardState, semester: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                <option value="II">Semester II</option>
                <option value="I">Semester I</option>
                <option value="III">Semester III</option>
                <option value="IV">Semester IV</option>
                <option value="V">Semester V</option>
                <option value="VI">Semester VI</option>
                <option value="VII">Semester VII</option>
                <option value="VIII">Semester VIII</option>
              </select>
            </div>

            {/* STEP 6 */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2 py-0.5 rounded-md">
                  STEP 6
                </span>
                <span className="text-[10px] font-bold text-gray-400">Section</span>
              </div>
              <label className="block text-xs font-black text-[#2C3E50]">
                Create the class by selecting the section.
              </label>
              <select
                value={wizardState.section}
                onChange={(e) => setWizardState({ ...wizardState, section: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
              >
                {sections.length > 0 ? (
                  sections.map((s) => (
                    <option key={s.id} value={s.sectionName}>
                      Section {s.sectionName}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* STEP 7: CLASS RESULT DISPLAY */}
          <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] p-6 rounded-2xl text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#FAD7A0] uppercase tracking-wider">
                STEP 7 — Resulting Academic Class
              </span>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 font-bold">
                SAILL Operating Department: {wizardState.saillDept}
              </span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-1">
              <div className="text-xl font-black text-[#FAD7A0] font-heading">
                {wizardState.programme} {wizardState.branch}
              </div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>→ Semester {wizardState.semester}</span>
                <span>→ Section {wizardState.section}</span>
                <span className="text-gray-300 text-xs">({wizardState.academicYear})</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-300">
                This scope will be uniquely identifiable for faculty assignments, student registration mapping, and module releases.
              </p>
              <button
                type="button"
                onClick={handleCreateGuidedClass}
                className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Create Class</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL FOR ENTITIES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-4">
              {editingItem ? 'Edit Record' : 'Add Record'} (
              {activeSubTab === 'department'
                ? 'SAILL Department'
                : activeSubTab === 'programme'
                ? 'Programme'
                : activeSubTab === 'branch'
                ? 'Branch'
                : activeSubTab === 'academicYear'
                ? 'Academic Year'
                : activeSubTab === 'semester'
                ? 'Semester'
                : 'Section'}
              )
            </h3>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* SAILL DEPARTMENT FORM */}
              {activeSubTab === 'department' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. H&S"
                      value={deptForm.code}
                      onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Humanities & Sciences"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Head of Department (HoD)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Academic Head"
                      value={deptForm.headOfDepartment}
                      onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* PROGRAMME FORM */}
              {activeSubTab === 'programme' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Programme Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTECH"
                      value={progForm.code}
                      onChange={(e) => setProgForm({ ...progForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Programme Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech"
                      value={progForm.name}
                      onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* BRANCH FORM */}
              {activeSubTab === 'branch' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Branch Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CIV"
                      value={branchForm.code}
                      onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Civil Engineering"
                      value={branchForm.name}
                      onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      SAILL Operating Department *
                    </label>
                    <select
                      value={branchForm.departmentName}
                      onChange={(e) => setBranchForm({ ...branchForm, departmentName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    >
                      {departments.length > 0 ? (
                        departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))
                      ) : (
                        <option value="Humanities & Sciences">Humanities & Sciences</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* ACADEMIC YEAR FORM */}
              {activeSubTab === 'academicYear' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Academic Year Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026–27"
                      value={yearForm.yearName}
                      onChange={(e) => setYearForm({ ...yearForm, yearName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isCurrent"
                      checked={yearForm.isCurrent}
                      onChange={(e) => setYearForm({ ...yearForm, isCurrent: e.target.checked })}
                      className="rounded text-[#D35400] focus:ring-[#D35400]"
                    />
                    <label htmlFor="isCurrent" className="text-xs font-bold text-[#2C3E50]">
                      Set as Current Academic Session
                    </label>
                  </div>
                </>
              )}

              {/* SEMESTER FORM */}
              {activeSubTab === 'semester' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Semester Name *
                    </label>
                    <select
                      value={semForm.semesterName}
                      onChange={(e) => setSemForm({ ...semForm, semesterName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    >
                      <option value="Semester I">Semester I</option>
                      <option value="Semester II">Semester II</option>
                      <option value="Semester III">Semester III</option>
                      <option value="Semester IV">Semester IV</option>
                      <option value="Semester V">Semester V</option>
                      <option value="Semester VI">Semester VI</option>
                      <option value="Semester VII">Semester VII</option>
                      <option value="Semester VIII">Semester VIII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Academic Year Session
                    </label>
                    <select
                      value={semForm.academicYear}
                      onChange={(e) => setSemForm({ ...semForm, academicYear: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    >
                      {academicYears.length > 0 ? (
                        academicYears.map((y) => (
                          <option key={y.id} value={y.yearName}>
                            {y.yearName} {y.isCurrent ? '(Current)' : ''}
                          </option>
                        ))
                      ) : (
                        <option value="2026–27">2026–27</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* SECTION FORM */}
              {activeSubTab === 'section' && (
                <>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Section Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A"
                      value={secForm.sectionName}
                      onChange={(e) => setSecForm({ ...secForm, sectionName: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                      Associated Branch *
                    </label>
                    <select
                      value={secForm.branch}
                      onChange={(e) => setSecForm({ ...secForm, branch: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                    >
                      {branches.length > 0 ? (
                        branches.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.code})
                          </option>
                        ))
                      ) : (
                        <option value="Civil Engineering">Civil Engineering</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2C3E50] font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message="Deleting an academic structure record will remove it from configuration lists. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: 'department', id: '', title: '' })}
      />
    </div>
  );
};
