import React, { useState, useEffect } from 'react';
import { StudentInternalMarks } from '../types';
import { academicDb } from '../lib/academicDb';
import { formatScore10, getPerformanceDescriptor } from '../lib/scoring';
import {
  BarChart2,
  Save,
  CheckCircle,
  Download,
  Printer,
  RefreshCw,
  Calculator,
  Award,
  Search
} from 'lucide-react';

export const InternalMarkCalculatorPage: React.FC = () => {
  const [internalMarksList, setInternalMarksList] = useState<StudentInternalMarks[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const list = academicDb.getInternalMarks();
    setInternalMarksList(list);
  }, []);

  const calculateGrade = (total: number): StudentInternalMarks['grade'] => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    return 'F';
  };

  const handleFieldValueChange = (
    studentId: string,
    field: keyof Omit<
      StudentInternalMarks,
      'studentId' | 'studentName' | 'rollNo' | 'branch' | 'section' | 'totalInternalMarks' | 'grade' | 'lastCalculatedAt'
    >,
    value: number
  ) => {
    setInternalMarksList((prev) =>
      prev.map((item) => {
        if (item.studentId === studentId) {
          const updated = {
            ...item,
            [field]: Math.max(0, value)
          };

          const total =
            updated.attendanceMarks +
            updated.recordWorkMarks +
            updated.activitiesMarks +
            updated.quizMarks +
            updated.portfolioMarks +
            updated.facultyMarks +
            updated.aiPerformanceMarks;

          updated.totalInternalMarks = total;
          updated.grade = calculateGrade(total);
          updated.lastCalculatedAt = new Date().toISOString();

          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveMarks = () => {
    academicDb.saveInternalMarks(internalMarksList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredList = internalMarksList.filter(
    (m) =>
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overall Class Averages
  const classAvgTotal =
    internalMarksList.length > 0
      ? Math.round(
          internalMarksList.reduce((acc, curr) => acc + curr.totalInternalMarks, 0) /
            internalMarksList.length
        )
      : 0;

  const oGradeCount = internalMarksList.filter((m) => m.grade === 'O').length;
  const aPlusGradeCount = internalMarksList.filter((m) => m.grade === 'A+').length;

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Continuous Internal Assessment (CIA) Mark Engine
            </h1>
            <p className="text-xs text-gray-600">
              Automatic mark calculation out of 10 marks evaluation scale across 7 assessment components under R26 Academic Regulations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet</span>
          </button>
          <button
            onClick={handleSaveMarks}
            className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save All Internal Marks</span>
          </button>
        </div>
      </div>

      {/* Breakdown Weights Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">1. Attendance</span>
          <span className="text-base font-extrabold text-[#D35400]">10 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">2. Record Work</span>
          <span className="text-base font-extrabold text-[#D35400]">20 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">3. Lab Activities</span>
          <span className="text-base font-extrabold text-[#D35400]">15 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">4. Quizzes</span>
          <span className="text-base font-extrabold text-[#D35400]">15 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">5. Portfolio</span>
          <span className="text-base font-extrabold text-[#D35400]">10 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">6. Faculty Evaluation</span>
          <span className="text-base font-extrabold text-[#D35400]">15 Marks</span>
        </div>
        <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">7. AI Performance</span>
          <span className="text-base font-extrabold text-[#D35400]">15 Marks</span>
        </div>
      </div>

      {/* Class Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="srit-card p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-800 uppercase block">Class Avg Internal Score</span>
            <span className="text-2xl font-extrabold text-purple-900">{formatScore10(classAvgTotal)}</span>
            <span className="text-[10px] font-bold text-purple-700 block">{getPerformanceDescriptor(classAvgTotal)}</span>
          </div>
          <Award className="w-8 h-8 text-purple-600" />
        </div>

        <div className="srit-card p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase block">O Grade (Outstanding)</span>
            <span className="text-2xl font-extrabold text-emerald-900">{oGradeCount} Students</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="srit-card p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-800 uppercase block">A+ Grade (Excellent)</span>
            <span className="text-2xl font-extrabold text-blue-900">{aPlusGradeCount} Students</span>
          </div>
          <BarChart2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Continuous Internal Assessment (CIA) marks database saved successfully!</span>
          </div>
        </div>
      )}

      {/* Interactive Marksheet Table */}
      <div className="srit-card bg-white border border-[#FAD7A0] overflow-hidden">
        <div className="p-4 bg-[#FFF8F0] border-b border-[#FAD7A0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#2C3E50] font-serif">
            Student Internal Marksheet Table (R26 Regulations)
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 font-bold text-gray-500 uppercase border-b border-gray-200">
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 text-center">Att (10)</th>
                <th className="p-3 text-center">Rec (20)</th>
                <th className="p-3 text-center">Act (15)</th>
                <th className="p-3 text-center">Quiz (15)</th>
                <th className="p-3 text-center">Port (10)</th>
                <th className="p-3 text-center">Fac (15)</th>
                <th className="p-3 text-center">AI (15)</th>
                <th className="p-3 text-center bg-[#FFF8F0]">Total (10)</th>
                <th className="p-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((m) => (
                <tr key={m.studentId} className="hover:bg-gray-50/80 transition">
                  <td className="p-3 font-bold text-[#D35400] whitespace-nowrap">{m.rollNo}</td>
                  <td className="p-3 font-bold text-[#2C3E50]">{m.studentName}</td>

                  {/* Editable Cells */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={10}
                      value={m.attendanceMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'attendanceMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={20}
                      value={m.recordWorkMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'recordWorkMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={15}
                      value={m.activitiesMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'activitiesMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={15}
                      value={m.quizMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'quizMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={10}
                      value={m.portfolioMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'portfolioMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={15}
                      value={m.facultyMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'facultyMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      max={15}
                      value={m.aiPerformanceMarks}
                      onChange={(e) =>
                        handleFieldValueChange(
                          m.studentId,
                          'aiPerformanceMarks',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center font-semibold p-1 border border-gray-200 rounded focus:border-[#D35400] outline-none"
                    />
                  </td>

                  <td className="p-3 text-center bg-[#FFF8F0]">
                    <span className="font-extrabold text-sm text-[#2C3E50] block">
                      {formatScore10(m.totalInternalMarks)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 block whitespace-nowrap">
                      {getPerformanceDescriptor(m.totalInternalMarks)}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold ${
                        m.grade === 'O' || m.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.grade === 'A' || m.grade === 'B+'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
