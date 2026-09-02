import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Layers,
  KeyRound,
  Power,
  Plus,
  Building2,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { FacultyAccount, StudentProfile } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { FacultyAllocationDrawer } from './FacultyAllocationDrawer';

interface FacultyCardsTabProps {
  facultyList: FacultyAccount[];
  studentsList: StudentProfile[];
  assignmentsList: FacultyAssignment[];
  onOpenAssignModal?: () => void;
  onResetPassword?: (empId: string, name: string) => void;
  onToggleStatus?: (empId: string) => void;
  onRefreshData?: () => void;
}

export const FacultyCardsTab: React.FC<FacultyCardsTabProps> = ({
  facultyList,
  studentsList,
  assignmentsList,
  onOpenAssignModal,
  onResetPassword,
  onToggleStatus,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Selected faculty for Drawer modal
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyAccount | null>(null);

  // Filter faculty
  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || f.department.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  // Unique departments for filter
  const departments = Array.from(new Set(facultyList.map((f) => f.department))).filter(Boolean);

  const handleOpenDrawer = (faculty: FacultyAccount) => {
    setSelectedFaculty(faculty);
  };

  const handleCloseDrawer = () => {
    setSelectedFaculty(null);
  };

  const handleAllocationUpdated = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Faculty Allocation Engine (FAE)
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">Faculty Incharge Roster & Allocation Scope</h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Click any faculty card to view their profile, manage assigned academic scopes, sections, mapped students, and workload analytics.
          </p>
        </div>

        {onOpenAssignModal && (
          <button
            type="button"
            onClick={onOpenAssignModal}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Scope</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-bold text-[#5D6D7E]">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FACULTY CARDS GRID */}
      {filteredFaculty.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center text-gray-500 font-medium">
          No faculty members found matching your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((faculty) => {
            // Find assignments for this faculty member
            const assignedGroups = assignmentsList.filter(
              (a) => a.facultyId.toUpperCase() === faculty.employeeId.toUpperCase() && a.status === 'ACTIVE'
            );

            // Calculate assigned students count
            const assignedStudents = FacultyAssignmentService.getAssignedStudentsForFaculty(
              faculty.employeeId,
              studentsList
            );

            // Get initials for Photo Placeholder
            const initials = faculty.fullName
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={faculty.employeeId}
                onClick={() => handleOpenDrawer(faculty)}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#D35400] shadow-2xs hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden cursor-pointer group active:scale-[0.99]"
              >
                {/* Hover Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#D35400] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Header Info with Photo Placeholder */}
                <div className="flex items-start gap-3">
                  {/* Photo Placeholder */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C3E50] to-[#D35400] text-[#FAD7A0] flex items-center justify-center font-black text-sm shadow-md border-2 border-white shrink-0 group-hover:scale-105 transition-transform">
                    {initials || 'FC'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-[#2C3E50] truncate group-hover:text-[#D35400] transition-colors">
                        {faculty.fullName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          faculty.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {faculty.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {faculty.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-[#D35400] mt-0.5">
                      ID: {faculty.employeeId}
                    </div>

                    <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">
                      {faculty.designation || 'Assistant Professor'}
                    </p>
                  </div>
                </div>

                {/* Department Info */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#D35400] shrink-0" />
                    <span className="truncate">{faculty.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[11px] truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{faculty.email}</span>
                  </div>
                </div>

                {/* Scope Stats: Assigned Classes & Assigned Students */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#D35400] block">Assigned Sections</span>
                    <span className="font-bold text-[#2C3E50] text-sm">
                      {assignedGroups.length} {assignedGroups.length === 1 ? 'Group' : 'Groups'}
                    </span>
                    {assignedGroups.length > 0 && (
                      <div className="text-[10px] font-semibold text-gray-600 truncate mt-0.5">
                        {assignedGroups.map((g) => g.section).join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-blue-700 block">Assigned Students</span>
                    <span className="font-bold text-[#2C3E50] text-sm">{assignedStudents.length} Students</span>
                    <div className="text-[10px] font-semibold text-blue-600 truncate mt-0.5">Mapped Scope</div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="p-2 bg-gradient-to-r from-gray-50 to-[#FFF8F0] rounded-xl border border-gray-200 text-xs font-bold text-[#2C3E50] flex items-center justify-between group-hover:border-[#D35400]/40 transition">
                  <div className="flex items-center gap-1.5 text-[#D35400]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black uppercase">Faculty Profile & Scope</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D35400] group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Secondary Action Buttons */}
                <div
                  className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()} // Prevent opening drawer when clicking specific quick buttons
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetPassword?.(faculty.employeeId, faculty.fullName);
                    }}
                    className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Reset Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus?.(faculty.employeeId);
                    }}
                    className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>Toggle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FACULTY ALLOCATION DRAWER MODAL */}
      <FacultyAllocationDrawer
        isOpen={!!selectedFaculty}
        faculty={selectedFaculty}
        allStudents={studentsList}
        assignmentsList={assignmentsList}
        onClose={handleCloseDrawer}
        onAllocationUpdated={handleAllocationUpdated}
      />
    </div>
  );
};

