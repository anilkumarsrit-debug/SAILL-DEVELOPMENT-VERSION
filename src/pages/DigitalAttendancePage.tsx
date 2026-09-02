import React, { useState, useEffect } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { academicDb } from '../lib/academicDb';
import { MOCK_STUDENTS } from '../data/academicData';
import { R26_MODULES } from '../data/modulesData';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Award,
  Check
} from 'lucide-react';

export const DigitalAttendancePage: React.FC = () => {
  const [selectedExperimentCode, setSelectedExperimentCode] = useState<string>('R26-LAB-01');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const [studentStates, setStudentStates] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  const [savedSuccessMessage, setSavedSuccessMessage] = useState<boolean>(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load attendance history
    const records = academicDb.getAttendanceRecords();
    setAttendanceHistory(records);

    // Initialize state for mock students
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    MOCK_STUDENTS.forEach((s) => {
      // Check if existing record for today and experiment
      const match = records.find(
        (r) =>
          r.studentId === s.id &&
          r.labExperimentCode === selectedExperimentCode &&
          r.date === attendanceDate
      );

      initialMap[s.id] = {
        status: match ? match.status : 'Present',
        remarks: match ? match.remarks : ''
      };
    });
    setStudentStates(initialMap);
  }, [selectedExperimentCode, attendanceDate]);

  const currentModuleObj =
    R26_MODULES.find((m) => m.code === selectedExperimentCode) || R26_MODULES[0];

  const filteredStudents = MOCK_STUDENTS.filter((s) => {
    const matchesBranch = selectedBranch === 'All' || s.branch.includes(selectedBranch);
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesQuery;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStates((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudentStates((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    filteredStudents.forEach((s) => {
      updated[s.id] = {
        status: 'Present',
        remarks: studentStates[s.id]?.remarks || ''
      };
    });
    setStudentStates((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    const recordsToSave: AttendanceRecord[] = filteredStudents.map((s) => {
      const state = studentStates[s.id] || { status: 'Present', remarks: '' };
      return {
        id: `att-${selectedExperimentCode}-${s.id}-${attendanceDate}`,
        date: attendanceDate,
        labExperimentCode: selectedExperimentCode,
        labExperimentTitle: currentModuleObj.title,
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        branch: s.branch,
        section: s.section,
        status: state.status,
        remarks: state.remarks,
        markedBy: 'Dr. V. Lakshmi (Faculty)',
        createdAt: new Date().toISOString()
      };
    });

    const updatedList = academicDb.addAttendanceBatch(recordsToSave);
    setAttendanceHistory(updatedList);

    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 4000);
  };

  // Metrics
  const presentCount = filteredStudents.filter(
    (s) => studentStates[s.id]?.status === 'Present'
  ).length;
  const absentCount = filteredStudents.filter(
    (s) => studentStates[s.id]?.status === 'Absent'
  ).length;
  const lateCount = filteredStudents.filter(
    (s) => studentStates[s.id]?.status === 'Late'
  ).length;
  const attendancePercentage =
    filteredStudents.length > 0
      ? Math.round(((presentCount + lateCount * 0.5) / filteredStudents.length) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Digital Attendance Register
            </h1>
            <p className="text-xs text-gray-600">
              Record laboratory attendance for R26 Communicative English Experiments with automated history tracking.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Attendance Register</span>
        </button>
      </div>

      {/* Control Filters */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Lab Experiment
          </label>
          <select
            value={selectedExperimentCode}
            onChange={(e) => setSelectedExperimentCode(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-semibold"
          >
            {R26_MODULES.map((m) => (
              <option key={m.id} value={m.code}>
                {m.code} - {m.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-semibold"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-semibold"
          >
            <option value="All">All Branches</option>
            <option value="Computer Science">Computer Science & Engg (CSE)</option>
            <option value="Electronics">Electronics & Comm (ECE)</option>
            <option value="Electrical">Electrical & Electronics (EEE)</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Search Student
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Name or Roll No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs font-bold text-emerald-800 uppercase block">Present</span>
          <span className="text-2xl font-extrabold text-emerald-700">{presentCount}</span>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <span className="text-xs font-bold text-red-800 uppercase block">Absent</span>
          <span className="text-2xl font-extrabold text-red-700">{absentCount}</span>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <span className="text-xs font-bold text-amber-800 uppercase block">Late</span>
          <span className="text-2xl font-extrabold text-amber-700">{lateCount}</span>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <span className="text-xs font-bold text-blue-800 uppercase block">Attendance Rate</span>
          <span className="text-2xl font-extrabold text-blue-700">{attendancePercentage}%</span>
        </div>
      </div>

      {savedSuccessMessage && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Attendance register saved to IndexedDB database successfully!</span>
          </div>
        </div>
      )}

      {/* Student Marking Table */}
      <div className="srit-card bg-white border border-[#FAD7A0] overflow-hidden">
        <div className="p-4 bg-[#FFF8F0] border-b border-[#FAD7A0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2C3E50] font-serif">
            Roster ({filteredStudents.length} Students) — {currentModuleObj.code}: {currentModuleObj.title}
          </h3>
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition self-start sm:self-auto flex items-center gap-1 shadow-2xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200">
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Attendance Status</th>
                <th className="p-3.5">Remarks / Remarks Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredStudents.map((student) => {
                const current = studentStates[student.id] || {
                  status: 'Present',
                  remarks: ''
                };
                return (
                  <tr key={student.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5 font-bold text-[#D35400] whitespace-nowrap">
                      {student.rollNo}
                    </td>
                    <td className="p-3.5 font-semibold text-[#2C3E50]">
                      <div className="flex items-center gap-2">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-600">{student.branch}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            current.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            current.status === 'Absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            current.status === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Late</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <input
                        type="text"
                        value={current.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Optional remarks..."
                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:border-[#D35400] outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Attendance Records */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-base font-bold text-[#2C3E50] font-serif">
              Stored Attendance History
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            {attendanceHistory.length} Total Logs Saved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 font-bold text-gray-500 uppercase border-b border-gray-200">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Experiment</th>
                <th className="p-2.5">Roll No</th>
                <th className="p-2.5">Student</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Remarks</th>
                <th className="p-2.5">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceHistory.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/80">
                  <td className="p-2.5 font-semibold text-gray-700">{record.date}</td>
                  <td className="p-2.5 font-bold text-[#D35400]">{record.labExperimentCode}</td>
                  <td className="p-2.5 text-gray-600">{record.rollNo}</td>
                  <td className="p-2.5 font-semibold text-[#2C3E50]">{record.studentName}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        record.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.status === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-gray-500 max-w-xs truncate">
                    {record.remarks || '—'}
                  </td>
                  <td className="p-2.5 text-gray-500">{record.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
