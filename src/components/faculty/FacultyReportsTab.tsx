import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { dbStorage } from '../../lib/db';
import { EvaluationPdfService } from '../../services/EvaluationPdfService';
import { FileSpreadsheet, Download, CheckCircle2, FileText, Layers, Users, BookOpen, Search } from 'lucide-react';

interface FacultyReportsTabProps {
  assignedStudents?: StudentProfile[];
  facultyName?: string;
  department?: string;
}

export const FacultyReportsTab: React.FC<FacultyReportsTabProps> = ({
  assignedStudents = [],
  facultyName = 'Dr. Sarah Jenkins',
  department = 'Humanities & Sciences (English)'
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [selectedStudentRoll, setSelectedStudentRoll] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);

  const handleDownloadSectionReport = async () => {
    setGenerating(true);
    try {
      const allScores = await dbStorage.getAllFacultyModuleScores();
      const branch = assignedStudents[0]?.branch || assignedStudents[0]?.department || 'CSE';
      const semester = assignedStudents[0]?.semester || 'Semester I';
      const section = assignedStudents[0]?.section || 'Section A';

      EvaluationPdfService.generateClassEvaluationPdf(assignedStudents, allScores, {
        branch,
        semester,
        section,
        facultyIncharge: facultyName
      });

      setDownloadToast(`Section ${section} Day-to-Day Evaluation PDF generated successfully!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err) {
      console.error('Error generating section report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadStudentReport = async () => {
    const student = assignedStudents.find((s) => s.rollNo === selectedStudentRoll) || assignedStudents[0];
    if (!student) {
      alert('No student selected');
      return;
    }
    setGenerating(true);
    try {
      const allScores = await dbStorage.getAllFacultyModuleScores();
      const studentScores = allScores.filter((s) => s.studentRollNo.toUpperCase() === student.rollNo.toUpperCase());

      EvaluationPdfService.generateStudentEvaluationPdf(student, studentScores, facultyName);

      setDownloadToast(`Student Evaluation Record for ${student.name} (${student.rollNo}) generated successfully!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err) {
      console.error('Error generating student report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadModuleCsv = async () => {
    try {
      const allScores = await dbStorage.getAllFacultyModuleScores();
      const headers = ['Student Roll No', 'Student Name', 'Module ID', 'Score /10', 'Remarks', 'Faculty Name', 'Evaluated At'];
      const rows = allScores.map((s) => [
        `"${s.studentRollNo}"`,
        `"${s.studentName}"`,
        `"${s.moduleId}"`,
        s.score,
        `"${(s.remarks || '').replace(/"/g, '""')}"`,
        `"${s.facultyName}"`,
        `"${new Date(s.evaluatedAt).toLocaleDateString()}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Module_Evaluation_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadToast(`Module Performance CSV exported successfully!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err) {
      console.error('Error exporting module CSV:', err);
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Academic Reporting Suite</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Institutional Reports Generator</h2>
          <p className="text-xs text-gray-500">
            Export structured Day-to-Day Module Evaluation records and performance reports for assigned sections and student cohorts
          </p>
        </div>
      </div>

      {downloadToast && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* 3 Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Section Report */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 hover:border-[#D35400] transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2C3E50]">Section Master Sheet (PDF)</h3>
            <p className="text-xs text-gray-600">
              Official institutional Day-to-Day Module Evaluation record sheet containing Roll No, Name, Branch, Semester, Section, all 10 Module Faculty Scores (1–10), Total (/100), and Average (/10).
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleDownloadSectionReport}
              disabled={generating}
              className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{generating ? 'Generating PDF...' : 'Download Section Master PDF'}</span>
            </button>
          </div>
        </div>

        {/* Report 2: Student Report */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 hover:border-[#D35400] transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2C3E50]">Individual Student Record (PDF)</h3>
            <p className="text-xs text-gray-600">
              Single-student Day-to-Day Module Performance Card with complete 10-module breakdown, faculty remarks, score descriptors, signature blocks, and verification seal.
            </p>

            {assignedStudents.length > 0 && (
              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Select Student:</label>
                <select
                  value={selectedStudentRoll}
                  onChange={(e) => setSelectedStudentRoll(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FFF8F0]/60 border border-[#FAD7A0] rounded-lg text-xs text-[#2C3E50] focus:outline-hidden"
                >
                  <option value="">Select a student...</option>
                  {assignedStudents.map((s) => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleDownloadStudentReport}
              disabled={generating}
              className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{generating ? 'Generating PDF...' : 'Download Student Record PDF'}</span>
            </button>
          </div>
        </div>

        {/* Report 3: Module Report */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 hover:border-[#D35400] transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2C3E50]">Module Performance Audit (CSV)</h3>
            <p className="text-xs text-gray-600">
              Raw evaluation data matrix with timestamps, evaluator remarks, individual student score histories, and lab performance audit trails for accreditation reporting.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleDownloadModuleCsv}
              className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
