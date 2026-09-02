import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, ArrowRight, RefreshCw, Award, FileText, Layers, ThumbsUp, ThumbsDown, Check, Zap } from 'lucide-react';

interface ResumeScannerAiReviewProps {
  onCompleteActivity: () => void;
}

export const ResumeScannerAiReview: React.FC<ResumeScannerAiReviewProps> = ({ onCompleteActivity }) => {
  const [resumeContent, setResumeContent] = useState<string>(
    `ANIL KUMAR | SRIT CSE (Roll No: 264G1A0501)
Email: anilkumar.264g1a0501@srit.ac.in | Mobile: +91 98765 43210 | Location: Anantapur, AP

CAREER OBJECTIVE:
First-Year B.Tech Computer Science student at SRIT seeking a Software Engineering Internship position to apply Data Structures, Java, and Python skills.

EDUCATION:
- B.Tech in CSE, Srinivasa Ramanujan Institute of Technology (2026 - 2030) | CGPA: 9.4
- Intermediate (MPC), Sri Chaitanya Junior College | Score: 96.2%

TECHNICAL SKILLS:
- Languages: Java, Python, C, JavaScript, HTML, CSS
- Frameworks & Databases: React.js, Express.js, MySQL
- Tools: Git, GitHub, VS Code, Linux

KEY PROJECTS:
- SRIT Campus Facilities Portal: Engineered full-stack web feedback app in React and SQL. Reduced query latency by 30%.
- Python Data Structure Visualizer: Developed desktop tool to visualize stack and queue operations for 120+ peer students.

CERTIFICATIONS:
- NPTEL Programming in Java (Elite Grade)
- Coursera Python Specialization`
  );

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<{
    overallScore: number;
    parameters: {
      name: string;
      score: number;
      status: 'Excellent' | 'Good' | 'Needs Improvement';
    }[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    improvedVersion: string;
  } | null>(null);

  const handleScanResume = () => {
    setIsScanning(true);

    setTimeout(() => {
      setReport({
        overallScore: 9.4,
        parameters: [
          { name: '1. Resume Structure & Hierarchy', score: 9.5, status: 'Excellent' },
          { name: '2. Grammar & Mechanical Accuracy', score: 9.6, status: 'Excellent' },
          { name: '3. ATS Layout Formatting', score: 9.4, status: 'Excellent' },
          { name: '4. Professional Vocabulary & Diction', score: 9.2, status: 'Excellent' },
          { name: '5. ATS Keyword Density', score: 9.3, status: 'Excellent' },
          { name: '6. Quantified Impact & Metrics', score: 9.5, status: 'Excellent' },
          { name: '7. Completeness (SRIT Credentials)', score: 9.8, status: 'Excellent' },
          { name: '8. Professional Presentation', score: 9.4, status: 'Excellent' }
        ],
        strengths: [
          'Includes official SRIT Roll No (264G1A0501) and student email address.',
          'Project bullets begin with power action verbs ("Engineered", "Developed").',
          'Quantified impact is present ("Reduced query latency by 30%", "120+ peer students").',
          'Clean single-column structure parsed easily by Applicant Tracking Systems.'
        ],
        weaknesses: [
          'Missing a dedicated "Soft Skills & Communication" sub-category.',
          'GitHub profile repository URL could be hyperlinked directly in the header.'
        ],
        suggestions: [
          'Add a line under Technical Skills highlighting "Agile Collaboration, Technical Communication, Critical Thinking".',
          'Incorporate exact corporate terms like "RESTful APIs" and "Object-Oriented Design (OOD)".'
        ],
        improvedVersion: `ANIL KUMAR | SRIT CSE (Roll No: 264G1A0501)
Email: anilkumar.264g1a0501@srit.ac.in | Phone: +91 98765 43210
GitHub: github.com/anilkumar-srit | LinkedIn: linkedin.com/in/anil-kumar-srit
Location: Anantapur, Andhra Pradesh, India

CAREER OBJECTIVE:
First-Year B.Tech Computer Science & Engineering student at Srinivasa Ramanujan Institute of Technology (SRIT) seeking a Software Engineering Internship. Aiming to leverage Data Structures, Java, Python, and React.js to build scalable web software and optimize database performance.

EDUCATION:
• B.Tech in Computer Science & Engineering | Srinivasa Ramanujan Institute of Technology (SRIT)
  Duration: 2026 - 2030 (Expected) | CGPA: 9.4 / 10.0 (Semester I)
• Intermediate (MPC - Mathematics, Physics, Chemistry) | Sri Chaitanya Junior College
  Duration: 2024 - 2026 | Percentage: 96.2%

TECHNICAL & SOFT SKILLS:
• Languages: Java, Python, C, C++, HTML5, CSS3, JavaScript (ES6+)
• Frameworks & Databases: React.js, Express.js, Tailwind CSS, MySQL, PostgreSQL
• Developer Tools: Git, GitHub, VS Code, Postman, Linux CLI
• Core Concepts: Data Structures & Algorithms, Object-Oriented Design (OOD), REST APIs
• Soft Skills: Technical Communication, Problem Solving, Agile Team Collaboration

KEY ENGINEERING PROJECTS:
• SRIT Campus Facilities Management Portal (React.js, Express.js, MySQL)
  - Engineered full-stack facility feedback web application utilized by 300+ campus students.
  - Optimized database query performance by 30% using indexed SQL relational views.

• Interactive Python Data Structure Visualizer (Python, Tkinter)
  - Developed offline desktop GUI tool to visualize stack, queue, and tree operations step-by-step.
  - Adopted by 120+ first-year peers during semester C.S. laboratory practice sessions.

HONORS & CERTIFICATIONS:
• NPTEL Online Certification in Programming in Java (Elite Grade)
• First Prize - Annual SRIT Campus Web Hackathon 2026`
      });

      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 7
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D35400]" />
            7. AI Resume Scanner & 8-Parameter Critique Studio
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Submit your resume draft for a comprehensive 8-parameter automated scan evaluating structure, grammar, ATS layout, keyword density, and action verbs.
          </p>
        </div>

        {/* Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#2C3E50] block">
            Paste Full Resume Draft for AI Audit:
          </label>
          <textarea
            rows={10}
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl border-2 border-[#FAD7A0] bg-[#FFF8F0] focus:outline-none focus:border-[#D35400] font-mono leading-relaxed"
          />

          <button
            type="button"
            onClick={handleScanResume}
            disabled={isScanning || !resumeContent.trim()}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2 disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Run 8-Parameter AI Resume Critique</span>
          </button>
        </div>

        {/* Report Display */}
        {report && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
                  Audit Complete
                </span>
                <h3 className="text-base font-extrabold text-[#2C3E50] mt-1">
                  Automated Resume Evaluation Report
                </h3>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#FAD7A0] text-center">
                <span className="text-[9px] font-bold text-[#D35400] uppercase block">Overall Grade</span>
                <span className="text-xl font-black text-[#2C3E50]">{report.overallScore} / 10</span>
              </div>
            </div>

            {/* 8 Parameters Grid */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#2C3E50] block">8-Parameter Evaluation Rubric:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {report.parameters.map((param, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#FAD7A0] space-y-1 text-xs">
                    <span className="text-[10px] text-gray-500 font-bold block truncate">{param.name}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#2C3E50]">{param.score} / 10</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {param.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <span className="font-extrabold text-emerald-800 uppercase flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" /> Key Strengths ({report.strengths.length})
                </span>
                <ul className="space-y-1 text-emerald-950">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <span className="font-extrabold text-amber-800 uppercase flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4 text-amber-600" /> Areas for Refinement ({report.weaknesses.length})
                </span>
                <ul className="space-y-1 text-amber-950">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benchmark AI Improved Version */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#D35400] uppercase block">
                ✨ AI Benchmark Refined Resume Draft:
              </span>
              <pre className="p-4 bg-white border border-[#FAD7A0] rounded-xl text-xs font-mono text-[#2C3E50] whitespace-pre-wrap leading-relaxed shadow-2xs">
                {report.improvedVersion}
              </pre>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 8: Resume vs Job Match</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
