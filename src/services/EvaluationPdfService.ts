import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FacultyModuleScore, StudentProfile } from '../types';
import { R26_MODULES } from '../data/modulesData';
import { FacultyEvaluationService } from './FacultyEvaluationService';

export interface StudentEvaluationSummary {
  student: StudentProfile;
  moduleScores: {
    moduleIndex: number;
    moduleId: string;
    moduleCode: string;
    moduleTitle: string;
    facultyScore: number | null; // 1-10 scale
    descriptor: string;
    remarks: string;
    evaluatedAt: string | null;
    facultyName: string | null;
  }[];
  totalScore: number; // Sum of evaluated scores (out of 100 max for 10 modules)
  averageScore: number; // Total / 10
  evaluatedCount: number;
}

export class EvaluationPdfService {
  /**
   * Generates a formal, printable PDF for a single student's Day-to-Day Module Evaluation Record.
   */
  static generateStudentEvaluationPdf(
    student: StudentProfile,
    scores: FacultyModuleScore[],
    facultyInchargeName?: string
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const tenModules = R26_MODULES.slice(0, 10);
    const scoreMap = new Map<string, FacultyModuleScore>();
    scores.forEach((s) => scoreMap.set(s.moduleId, s));

    let totalScore = 0;
    let evaluatedCount = 0;

    const moduleRows = tenModules.map((mod, index) => {
      const s = scoreMap.get(mod.id);
      const facultyScore = s?.score ?? null;
      if (facultyScore !== null) {
        totalScore += facultyScore;
        evaluatedCount++;
      }
      const descriptor = facultyScore !== null ? FacultyEvaluationService.getScoreDescriptor(facultyScore).label : 'Pending';
      const remarks = s?.remarks || (facultyScore !== null ? 'Satisfactory lab execution' : 'Pending Evaluation');
      const evalDate = s?.evaluatedAt ? new Date(s.evaluatedAt).toLocaleDateString('en-IN') : '—';
      const evalFaculty = s?.facultyName || facultyInchargeName || student.assignedFacultyName || 'Faculty Incharge';

      return {
        moduleNum: `Module ${index + 1}`,
        code: mod.code,
        title: mod.title,
        score: facultyScore !== null ? `${facultyScore} / 10` : '—',
        descriptor,
        remarks,
        evalDate,
        evalFaculty
      };
    });

    const averageScore = Number((totalScore / 10).toFixed(2));
    const facultyName = facultyInchargeName || student.assignedFacultyName || scores[0]?.facultyName || 'Dr. V. Lakshmi';

    // 1. Header Banner & Institution Title
    doc.setFillColor(44, 62, 80); // #2C3E50 Navy Blue
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(250, 215, 160); // Gold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY', 105, 10, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('(Autonomous Institution | Accredited by NAAC with "A" Grade & NBA | Affiliated to JNTUA)', 105, 15, { align: 'center' });

    doc.setTextColor(230, 126, 34); // Saffron / Orange
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DEPARTMENT OF HUMANITIES & SCIENCES — COMMUNICATIVE ENGLISH LAB', 105, 21, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('DAY-TO-DAY CONTINUOUS MODULE EVALUATION RECORD (R26)', 105, 27, { align: 'center' });

    // 2. Student & Class Metadata Box
    doc.setFillColor(255, 248, 240); // Warm cream
    doc.setDrawColor(250, 215, 160); // Gold border
    doc.rect(14, 36, 182, 30, 'FD');

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    // Left Column
    doc.text(`Student Name:`, 18, 43);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.name}`, 48, 43);

    doc.setFont('helvetica', 'bold');
    doc.text(`Roll Number:`, 18, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.rollNo}`, 48, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`Branch / Dept:`, 18, 57);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.branch || student.department || 'CSE'}`, 48, 57);

    // Middle Column
    doc.setFont('helvetica', 'bold');
    doc.text(`Semester:`, 105, 43);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.semester || 'Semester I'}`, 128, 43);

    doc.setFont('helvetica', 'bold');
    doc.text(`Section:`, 105, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.section || 'Section A'}`, 128, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`Batch / Year:`, 105, 57);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.academicYear || '2026–2027'}`, 128, 57);

    // Right Column
    doc.setFont('helvetica', 'bold');
    doc.text(`Faculty Incharge:`, 150, 43);
    doc.setFont('helvetica', 'normal');
    doc.text(`${facultyName}`, 150, 49);

    doc.setFont('helvetica', 'bold');
    doc.text(`Date Generated:`, 150, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date().toLocaleDateString('en-IN')}`, 150, 62);

    // 3. Module Evaluation Table (Modules 1 - 10)
    const tableBody = moduleRows.map((r) => [
      r.moduleNum,
      r.code,
      r.title,
      r.score,
      r.descriptor,
      r.remarks,
      r.evalDate
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Module', 'Code', 'Laboratory Module Title', 'Faculty Score', 'Performance', 'Faculty Remarks', 'Date']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center'
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [44, 62, 80],
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 50 },
        3: { cellWidth: 22, halign: 'center', fontStyle: 'bold', textColor: [211, 84, 0] },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 32 },
        6: { cellWidth: 18, halign: 'center' }
      }
    });

    // 4. Performance Summary Scorecard Box
    const finalY = (doc as any).lastAutoTable?.finalY || 200;

    doc.setFillColor(255, 248, 240);
    doc.setDrawColor(211, 84, 0); // Saffron
    doc.rect(14, finalY + 5, 182, 26, 'FD');

    doc.setTextColor(211, 84, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ACADEMIC EVALUATION SUMMARY (FACULTY DAY-TO-DAY SCORES ONLY)', 18, finalY + 11);

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(9);
    doc.text(`Total Continuous Assessment Score:`, 18, finalY + 18);
    doc.setFontSize(11);
    doc.setTextColor(211, 84, 0);
    doc.text(`${totalScore} / 100`, 85, finalY + 18);

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(9);
    doc.text(`Day-to-Day Average Module Score:`, 18, finalY + 26);
    doc.setFontSize(11);
    doc.setTextColor(39, 174, 96);
    doc.text(`${averageScore} / 10`, 85, finalY + 26);

    doc.setTextColor(93, 109, 126);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`* Formula: Average Score = Total Faculty Scores (${totalScore}) ÷ 10 Modules = ${averageScore} / 10`, 115, finalY + 18);
    doc.text(`* Status: ${evaluatedCount} of 10 Modules Formally Evaluated & Verified`, 115, finalY + 25);

    // 5. Signatures & Institutional Verification
    const sigY = finalY + 45;
    doc.setDrawColor(180, 180, 180);
    doc.line(18, sigY, 65, sigY);
    doc.line(80, sigY, 130, sigY);
    doc.line(145, sigY, 195, sigY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(44, 62, 80);
    doc.text('Student Signature', 41, sigY + 5, { align: 'center' });
    doc.text('Faculty Incharge Signature', 105, sigY + 5, { align: 'center' });
    doc.text('Head of Department (English)', 170, sigY + 5, { align: 'center' });

    // Save and trigger browser download
    const fileName = `SAILL_Evaluation_${student.rollNo}_${student.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
  }

  /**
   * Generates a Class-Wise / Section-Wise Day-to-Day Evaluation Master Sheet (PDF).
   */
  static generateClassEvaluationPdf(
    students: StudentProfile[],
    allScores: FacultyModuleScore[],
    classDetails: {
      branch: string;
      semester: string;
      section: string;
      facultyIncharge: string;
      academicYear?: string;
      institutionName?: string;
    }
  ): void {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const tenModules = R26_MODULES.slice(0, 10);
    const scoreMap = new Map<string, FacultyModuleScore>();
    allScores.forEach((s) => {
      scoreMap.set(`${s.studentRollNo.trim().toUpperCase()}__${s.moduleId.trim()}`, s);
    });

    // 1. Header Banner
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 297, 28, 'F');

    doc.setTextColor(250, 215, 160);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY (AUTONOMOUS)', 148.5, 8, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('DEPARTMENT OF HUMANITIES & SCIENCES — COMMUNICATIVE ENGLISH LAB (R26)', 148.5, 13, { align: 'center' });

    doc.setTextColor(230, 126, 34);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('CLASS-WISE DAY-TO-DAY MODULE EVALUATION CONSOLIDATED REPORT', 148.5, 18, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      `Branch: ${classDetails.branch}  |  Semester: ${classDetails.semester}  |  Section: ${classDetails.section}  |  Faculty Incharge: ${classDetails.facultyIncharge}  |  Date: ${new Date().toLocaleDateString('en-IN')}`,
      148.5,
      24,
      { align: 'center' }
    );

    // 2. Build rows for each student
    let grandTotalSum = 0;
    let studentCountWithScores = 0;

    const tableRows = students.map((st, idx) => {
      let stTotal = 0;
      let evaluatedMods = 0;
      const modScores: string[] = [];

      tenModules.forEach((m) => {
        const sc = scoreMap.get(`${st.rollNo.trim().toUpperCase()}__${m.id.trim()}`);
        if (sc && typeof sc.score === 'number') {
          modScores.push(sc.score.toString());
          stTotal += sc.score;
          evaluatedMods++;
        } else {
          modScores.push('—');
        }
      });

      const avg = Number((stTotal / 10).toFixed(1));
      if (evaluatedMods > 0) {
        grandTotalSum += stTotal;
        studentCountWithScores++;
      }

      return [
        (idx + 1).toString(),
        st.rollNo,
        st.name,
        st.branch || classDetails.branch,
        st.section || classDetails.section,
        ...modScores,
        `${stTotal}/100`,
        `${avg}/10`,
        evaluatedMods === 10 ? 'Complete' : evaluatedMods > 0 ? `${evaluatedMods}/10 Mod` : 'Pending'
      ];
    });

    const classAvgScore = studentCountWithScores > 0 ? (grandTotalSum / (studentCountWithScores * 10)).toFixed(2) : '0.00';

    // 3. Render Master AutoTable
    autoTable(doc, {
      startY: 32,
      head: [
        [
          'S.No',
          'Roll No',
          'Student Name',
          'Branch',
          'Sec',
          'M1',
          'M2',
          'M3',
          'M4',
          'M5',
          'M6',
          'M7',
          'M8',
          'M9',
          'M10',
          'Total /100',
          'Avg /10',
          'Status'
        ]
      ],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'center'
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        textColor: [44, 62, 80],
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 26, fontStyle: 'bold' },
        2: { cellWidth: 42, halign: 'left', fontStyle: 'bold' },
        3: { cellWidth: 14 },
        4: { cellWidth: 10 },
        5: { cellWidth: 10 },
        6: { cellWidth: 10 },
        7: { cellWidth: 10 },
        8: { cellWidth: 10 },
        9: { cellWidth: 10 },
        10: { cellWidth: 10 },
        11: { cellWidth: 10 },
        12: { cellWidth: 10 },
        13: { cellWidth: 10 },
        14: { cellWidth: 10 },
        15: { cellWidth: 20, fontStyle: 'bold', textColor: [211, 84, 0] },
        16: { cellWidth: 18, fontStyle: 'bold', textColor: [39, 174, 96] },
        17: { cellWidth: 20 }
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 160;

    // 4. Statistics Footer Box
    if (finalY + 30 <= 195) {
      doc.setFillColor(255, 248, 240);
      doc.setDrawColor(250, 215, 160);
      doc.rect(14, finalY + 4, 269, 14, 'FD');

      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`Class Strength: ${students.length} Students`, 18, finalY + 12);
      doc.text(`Evaluated Students: ${studentCountWithScores}`, 80, finalY + 12);
      doc.text(`Class Average Score: ${classAvgScore} / 10`, 150, finalY + 12);
      doc.text(`Official Academic Grading: R26 Day-to-Day Module Evaluation`, 210, finalY + 12);

      // Signatures
      const sigY = finalY + 28;
      doc.line(20, sigY, 70, sigY);
      doc.line(125, sigY, 175, sigY);
      doc.line(230, sigY, 280, sigY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Faculty Incharge Signature', 45, sigY + 4, { align: 'center' });
      doc.text('HOD (English & Humanities)', 150, sigY + 4, { align: 'center' });
      doc.text('Principal / Dean Academic', 255, sigY + 4, { align: 'center' });
    }

    const cleanSec = classDetails.section.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanBranch = classDetails.branch.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`SAILL_Class_Evaluation_${cleanBranch}_${cleanSec}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
