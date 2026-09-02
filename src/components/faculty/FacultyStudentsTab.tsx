import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { FacultyStudentService } from '../../services/FacultyStudentService';
import { StudentFilterOptions } from '../../types/faculty';
import {
  Search,
  Filter,
  UserCheck,
  BookOpen,
  Award,
  Users,
  X,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface FacultyStudentsTabProps {
  assignedStudents: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
}

export const FacultyStudentsTab: React.FC<FacultyStudentsTabProps> = ({
  assignedStudents,
  onSelectStudent
}) => {
  const [filterOptions, setFilterOptions] = useState<StudentFilterOptions>({
    searchQuery: '',
    branch: '',
    academicYear: '',
    semester: '',
    section: ''
  });

  const filteredStudents = FacultyStudentService.filterStudents(assignedStudents, filterOptions);

  const handleResetFilters = () => {
    setFilterOptions({
      searchQuery: '',
      branch: '',
      academicYear: '',
      semester: '',
      section: ''
    });
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Scoped Academic Group Roster</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Assigned Students Roster</h2>
          <p className="text-xs text-gray-500">
            Displaying {filteredStudents.length} of {assignedStudents.length} total mapped students
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-bold text-[#2C3E50]">
          <Filter className="w-4 h-4 text-[#D35400]" />
          <span>Roster Search & Scope Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Name or Roll..."
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions({ ...filterOptions, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={filterOptions.branch}
            onChange={(e) => setFilterOptions({ ...filterOptions, branch: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Branches</option>
            <option value="Computer Science">CSE (Computer Science)</option>
            <option value="Electronics">ECE (Electronics)</option>
            <option value="Electrical">EEE (Electrical)</option>
            <option value="Mechanical">ME (Mechanical)</option>
            <option value="Civil">CE (Civil)</option>
          </select>

          {/* Academic Year Filter */}
          <select
            value={filterOptions.academicYear}
            onChange={(e) => setFilterOptions({ ...filterOptions, academicYear: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Academic Years</option>
            <option value="2026–2027">2026–2027</option>
            <option value="2025–2026">2025–2026</option>
          </select>

          {/* Semester Filter */}
          <select
            value={filterOptions.semester}
            onChange={(e) => setFilterOptions({ ...filterOptions, semester: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Semesters</option>
            <option value="Semester I">Semester I</option>
            <option value="Semester II">Semester II</option>
          </select>

          {/* Section Filter */}
          <select
            value={filterOptions.section}
            onChange={(e) => setFilterOptions({ ...filterOptions, section: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {(filterOptions.searchQuery ||
          filterOptions.branch ||
          filterOptions.academicYear ||
          filterOptions.semester ||
          filterOptions.section) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#FAD7A0] text-center space-y-3">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-[#2C3E50]">No Assigned Students Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No students match your selected search or filter criteria in your assigned academic groups.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            const overallProgress = student.overallProgressPercentage || student.overallScore || 0;
            const currentModuleTitle = overallProgress > 0 ? 'Module 1: In Progress' : 'Module 1: Not Started';

            return (
              <div
                key={student.rollNo}
                onClick={() => onSelectStudent(student)}
                className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 hover:border-[#D35400] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* Header: Photo Placeholder & Basic Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-[#FAD7A0] font-extrabold text-lg flex items-center justify-center shrink-0 border border-[#FAD7A0]/50 group-hover:bg-[#D35400] group-hover:text-white transition">
                    {student.name.charAt(0) || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-[#2C3E50] truncate group-hover:text-[#D35400] transition">
                      {student.name}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 font-semibold">{student.rollNo}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100">
                        {student.branch || 'Civil Engineering'}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100">
                        {student.semester || 'Semester II'}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100">
                        Section {student.section || 'A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Current Module */}
                <div className="space-y-2 bg-[#FFF8F0]/70 p-3 rounded-xl border border-[#FAD7A0]/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-gray-600">Overall Progress</span>
                    <span className="font-extrabold text-[#D35400]">{overallProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D35400] to-[#E67E22] rounded-full"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-gray-600">
                    <span className="font-medium truncate max-w-[180px]">{currentModuleTitle}</span>
                    <ChevronRight className="w-4 h-4 text-[#D35400] group-hover:translate-x-1 transition shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
