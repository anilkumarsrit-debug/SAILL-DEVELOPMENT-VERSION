import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { ProgressFilterOptions } from '../../types/faculty';
import { R26_MODULES } from '../../data/modulesData';
import {
  BarChart3,
  Filter,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface FacultyProgressMonitorTabProps {
  assignedStudents: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
}

export const FacultyProgressMonitorTab: React.FC<FacultyProgressMonitorTabProps> = ({
  assignedStudents,
  onSelectStudent
}) => {
  const [filterOptions, setFilterOptions] = useState<ProgressFilterOptions>({
    searchQuery: '',
    branch: '',
    academicYear: '',
    semester: '',
    section: '',
    moduleId: ''
  });

  // Filter students based on choices
  const filteredStudents = assignedStudents.filter((s) => {
    const q = filterOptions.searchQuery.trim().toLowerCase();
    const branchFilter = filterOptions.branch.trim().toLowerCase();
    const yearFilter = filterOptions.academicYear.trim().toLowerCase();
    const semFilter = filterOptions.semester.trim().toLowerCase();
    const secFilter = filterOptions.section.trim().toLowerCase();

    const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
    const sBranch = (s.branch || s.department || '').toLowerCase();
    const matchesBranch = !branchFilter || sBranch.includes(branchFilter);
    const sYear = (s.year || s.academicYear || '').toLowerCase();
    const matchesYear = !yearFilter || sYear.includes(yearFilter);
    const sSem = (s.semester || '').toLowerCase();
    const matchesSem = !semFilter || sSem.includes(semFilter);
    const sSec = (s.section || '').toUpperCase();
    const matchesSec = !secFilter || sSec.includes(secFilter.toUpperCase());

    return matchesQuery && matchesBranch && matchesYear && matchesSem && matchesSec;
  });

  const handleResetFilters = () => {
    setFilterOptions({
      searchQuery: '',
      branch: '',
      academicYear: '',
      semester: '',
      section: '',
      moduleId: ''
    });
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-[11px] font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Operational Analytical Monitor</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Academic Progress Monitor</h2>
          <p className="text-xs text-gray-500">
            Real-time module completion and AI assessment scores for assigned student cohort
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-bold text-[#2C3E50]">
          <Filter className="w-4 h-4 text-[#D35400]" />
          <span>Multidimensional Data Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Student Search */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Student..."
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions({ ...filterOptions, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
            />
          </div>

          {/* Branch */}
          <select
            value={filterOptions.branch}
            onChange={(e) => setFilterOptions({ ...filterOptions, branch: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Branches</option>
            <option value="Computer Science">CSE</option>
            <option value="Electronics">ECE</option>
            <option value="Electrical">EEE</option>
            <option value="Mechanical">ME</option>
            <option value="Civil">CE</option>
          </select>

          {/* Academic Year */}
          <select
            value={filterOptions.academicYear}
            onChange={(e) => setFilterOptions({ ...filterOptions, academicYear: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Academic Years</option>
            <option value="2026–2027">2026–2027</option>
            <option value="2025–2026">2025–2026</option>
          </select>

          {/* Semester */}
          <select
            value={filterOptions.semester}
            onChange={(e) => setFilterOptions({ ...filterOptions, semester: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Semesters</option>
            <option value="Semester I">Semester I</option>
            <option value="Semester II">Semester II</option>
          </select>

          {/* Section */}
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

          {/* Module */}
          <select
            value={filterOptions.moduleId}
            onChange={(e) => setFilterOptions({ ...filterOptions, moduleId: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          >
            <option value="">All Modules</option>
            {R26_MODULES.map((m, idx) => (
              <option key={m.id} value={m.id}>
                Mod {idx + 1}: {m.title.slice(0, 18)}...
              </option>
            ))}
          </select>
        </div>

        {(filterOptions.searchQuery ||
          filterOptions.branch ||
          filterOptions.academicYear ||
          filterOptions.semester ||
          filterOptions.section ||
          filterOptions.moduleId) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Progress Table */}
      <div className="bg-white rounded-2xl border border-[#FAD7A0]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#2C3E50] text-[#FAD7A0]">
                <th className="p-3.5 font-bold">Student Name</th>
                <th className="p-3.5 font-bold">Roll Number</th>
                <th className="p-3.5 font-bold">Branch & Sec</th>
                <th className="p-3.5 font-bold">Module Progress</th>
                <th className="p-3.5 font-bold">Completion %</th>
                <th className="p-3.5 font-bold">Average AI Score</th>
                <th className="p-3.5 font-bold">Current Status</th>
                <th className="p-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No matching student records found for the current progress filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const completion = student.overallProgressPercentage || 0;
                  const avgScore = student.overallScore || 0;
                  const status =
                    completion >= 100
                      ? 'Completed'
                      : completion > 0
                      ? 'In Progress'
                      : 'Not Started';

                  return (
                    <tr key={student.rollNo} className="hover:bg-[#FFF8F0]/70 transition">
                      <td className="p-3.5 font-bold text-[#2C3E50]">{student.name}</td>
                      <td className="p-3.5 font-mono text-gray-600 font-semibold">{student.rollNo}</td>
                      <td className="p-3.5 text-gray-600">
                        {student.branch || 'CSE'} - Section {student.section || 'A'}
                      </td>
                      <td className="p-3.5">
                        <div className="w-28 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#D35400] h-full rounded-full"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-extrabold text-[#D35400]">{completion}%</td>
                      <td className="p-3.5 font-bold text-[#2C3E50]">{avgScore} / 100</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                            status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#D35400] hover:text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
