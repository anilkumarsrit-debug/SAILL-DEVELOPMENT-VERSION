import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  FileSpreadsheet,
  Award,
  Users,
  Calendar,
  BarChart,
  BookOpen
} from 'lucide-react';
import { academicDb } from '../lib/academicDb';
import { MOCK_STUDENTS, CO_PO_MAPPING_DATA } from '../data/academicData';

export const AcademicReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('attendance');
  const [generatedReportText, setGeneratedReportText] = useState<string>('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const REPORTS = [
    { id: 'attendance', title: 'Laboratory Attendance Report', desc: 'Detailed student session history & percentage compliance.' },
    { id: 'cia', title: 'Continuous Internal Assessment (CIA) Report', desc: 'Breakdown of internal marks out of 100 with grades.' },
    { id: 'experiment', title: 'Experiment Completion Matrix Report', desc: 'Status of R26-LAB-01 through LAB-10 experiment records.' },
    { id: 'performance', title: 'Student Performance & Skill Gaps Report', desc: 'Competency distributions and identified weak areas.' },
    { id: 'copo', title: 'CO-PO Attainment & Mapping Report', desc: 'Course outcomes to program outcomes NBA/NAAC articulation.' },
    { id: 'portfolio', title: 'Portfolio Work Summary Report', desc: 'Approved, returned, and pending portfolio submissions.' },
    { id: 'faculty', title: 'Faculty Workload & Class Summary Report', desc: 'Comprehensive summary of teaching & evaluation metrics.' }
  ];

  const handleGenerateReport = (reportId: string) => {
    setSelectedReportType(reportId);
    let content = '';

    const timestamp = new Date().toLocaleString();
    content += `======================================================================\n`;
    content += `SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY (SRIT - AUTONOMOUS)\n`;
    content += `DEPARTMENT OF ENGLISH & HUMANITIES • SAILL LANGUAGE LABORATORY\n`;
    content += `ACADEMIC REPORT: ${reportId.toUpperCase()}\n`;
    content += `Generated On: ${timestamp}\n`;
    content += `Academic Regulation: R26 Syllabus (First Year Engineering)\n`;
    content += `======================================================================\n\n`;

    if (reportId === 'attendance') {
      const records = academicDb.getAttendanceRecords();
      content += `TOTAL ATTENDANCE RECORDS LOGGED: ${records.length}\n\n`;
      content += `Roll No       | Student Name         | Experiment   | Date       | Status\n`;
      content += `----------------------------------------------------------------------\n`;
      records.forEach((r) => {
        content += `${r.rollNo.padEnd(13)} | ${r.studentName.padEnd(20)} | ${r.labExperimentCode.padEnd(12)} | ${r.date} | ${r.status}\n`;
      });
    } else if (reportId === 'cia') {
      const marks = academicDb.getInternalMarks();
      content += `CONTINUOUS INTERNAL ASSESSMENT (CIA) MARKSHEET (MAX: 100)\n\n`;
      content += `Roll No       | Student Name         | Att(10) | Rec(20) | Act(15) | Quiz(15) | Total | Grade\n`;
      content += `----------------------------------------------------------------------------------------\n`;
      marks.forEach((m) => {
        content += `${m.rollNo.padEnd(13)} | ${m.studentName.padEnd(20)} | ${m.attendanceMarks.toString().padEnd(7)} | ${m.recordWorkMarks.toString().padEnd(7)} | ${m.activitiesMarks.toString().padEnd(7)} | ${m.quizMarks.toString().padEnd(8)} | ${m.totalInternalMarks.toString().padEnd(5)} | ${m.grade}\n`;
      });
    } else if (reportId === 'copo') {
      content += `CO-PO ATTAINMENT ARTICULATION MATRIX (NBA/NAAC COMPLIANCE)\n\n`;
      CO_PO_MAPPING_DATA.forEach((co) => {
        content += `${co.coCode}: ${co.coDescription}\n`;
        content += `Mappings: ${JSON.stringify(co.poMappings)}\n\n`;
      });
    } else {
      content += `SUMMARY DATA FOR ${reportId.toUpperCase()}\n`;
      MOCK_STUDENTS.forEach((s) => {
        content += `${s.rollNo} - ${s.name} (${s.branch}) - Status: Active\n`;
      });
    }

    setGeneratedReportText(content);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([generatedReportText || 'SRIT Academic Report Data'], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SRIT_Report_${selectedReportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Report CSV file downloaded to your device!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([generatedReportText || 'SRIT Academic Report Data'], {
      type: 'text/plain;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SRIT_Report_${selectedReportType}_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Formatted Report TXT downloaded to your device!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Academic Reports & Export Center
            </h1>
            <p className="text-xs text-gray-600">
              Generate official attendance, CIA marks, experiment completion, CO-PO attainment, and faculty summary reports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-[#27AE60] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center gap-2 font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Grid: Report Selector & Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Select Report Type (1 col) */}
        <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Select Academic Report
          </h3>

          <div className="space-y-2">
            {REPORTS.map((r) => {
              const isSelected = selectedReportType === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleGenerateReport(r.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-[#FFF8F0] border-[#D35400] shadow-xs'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#D35400]' : 'text-[#2C3E50]'
                    }`}
                  >
                    {r.title}
                  </span>
                  <span className="text-[11px] text-gray-500">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Generated Report Previewer (2 cols) */}
        <div className="lg:col-span-2">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider block">
                  Report Preview
                </span>
                <h2 className="text-base font-bold font-serif text-[#2C3E50]">
                  {REPORTS.find((r) => r.id === selectedReportType)?.title || 'Academic Report'}
                </h2>
              </div>

              <button
                onClick={handleDownloadText}
                className="px-3 py-1.5 bg-[#D35400] text-white text-xs font-bold rounded-lg hover:bg-[#E67E22] transition flex items-center gap-1 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
            </div>

            <div className="p-4 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto min-h-[350px] leading-relaxed whitespace-pre">
              {generatedReportText ||
                `Click any report from the left panel to compile and render live academic data...`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
