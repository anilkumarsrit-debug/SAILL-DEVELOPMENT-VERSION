import React, { useState } from 'react';
import { Award, CheckCircle2, FileText, Mail, Target, Sparkles, Download, Share2, Briefcase, Calendar } from 'lucide-react';

interface ResumePortfolioShowcaseProps {
  onCompleteActivity: () => void;
}

export const ResumePortfolioShowcase: React.FC<ResumePortfolioShowcaseProps> = ({ onCompleteActivity }) => {
  const [activeTab, setActiveTab] = useState<'best_resume' | 'best_cover' | 'ats_reports' | 'timeline'>('best_resume');

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 12
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            12. Student Resume & Career Portfolio Showcase
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Showcase of your benchmark ATS-formatted engineering resume, tailored cover letters, audit reports, and faculty endorsements.
          </p>
        </div>

        {/* Portfolio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('best_resume')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'best_resume'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Benchmark Resume (v2.0)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('best_cover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'best_cover'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Internship Cover Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ats_reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ats_reports'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>ATS Audit & Match Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Progress Timeline</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'best_resume' && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
                  Corporate Placement Ready
                </span>
                <h3 className="text-base font-extrabold text-[#2C3E50] mt-1">
                  SRIT B.Tech CSE Benchmark Resume (2026)
                </h3>
              </div>

              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#FAD7A0] text-center">
                <span className="text-[9px] font-bold uppercase text-[#D35400] block">ATS Score</span>
                <span className="text-base font-black text-[#2C3E50]">9.6 / 10</span>
              </div>
            </div>

            <pre className="bg-white p-5 rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] whitespace-pre-wrap leading-relaxed shadow-2xs">
{`ANIL KUMAR | SRIT B.Tech CSE (264G1A0501)
Email: anilkumar.264g1a0501@srit.ac.in | Phone: +91 98765 43210 | Location: Anantapur, AP

CAREER OBJECTIVE:
First-Year B.Tech Computer Science student seeking Software Engineering Internship position at Tech Corp. Aiming to apply Data Structures, Java, and React.js to build scalable web applications.

EDUCATION:
• B.Tech in CSE - Srinivasa Ramanujan Institute of Technology (2026 - 2030) | CGPA: 9.4
• Intermediate (MPC) - Sri Chaitanya Junior College | Score: 96.2%

TECHNICAL SKILLS:
• Languages: Java, Python, C, JavaScript, HTML5, CSS3
• Frameworks & Tools: React.js, Express.js, Tailwind CSS, MySQL, Git, Linux CLI

KEY PROJECTS:
• SRIT Campus Facilities Portal (React.js, Express, MySQL)
  - Engineered full-stack web application for 300+ campus students.
  - Reduced query load latency by 30% using indexed SQL views.

CERTIFICATIONS:
• NPTEL Programming in Java (Elite Grade)
• First Prize - Annual SRIT Campus Hackathon 2026`}
            </pre>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-[10px] block text-emerald-800">Faculty Endorsement:</span>
                <span className="italic">
                  "Exemplary ATS-friendly formatting, crisp action verbs, and clear quantifiable project metrics. Approved for direct campus recruitment drives."
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'best_cover' && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-extrabold text-[#2C3E50]">Tech Corp Internship Cover Letter</h3>
            <p className="bg-white p-5 rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] whitespace-pre-wrap leading-relaxed">
{`Dear Hiring Manager / Recruitment Team,

I am writing to formally express my enthusiastic interest in the Summer Software Engineering Internship position at Tech Corp. I am currently a First-Year B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT).

Through my rigorous academic coursework, I have developed a solid foundation in Data Structures, Algorithms, and Object-Oriented Software Design in Java and Python. Recently, I engineered a campus facility management application using React.js and SQL, which reduced student query processing latency by 30%.

Thank you for your time and consideration. I am eager to contribute value to Tech Corp’s engineering team.

Sincerely,
Anil Kumar (264G1A0501)
SRIT Anantapur`}
            </p>
          </div>
        )}

        {activeTab === 'ats_reports' && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-extrabold text-[#2C3E50]">Verified ATS Audit Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                <span className="text-[10px] font-bold text-[#D35400] uppercase block">ATS Format Grade</span>
                <span className="text-lg font-black text-[#2C3E50]">9.6 / 10</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                <span className="text-[10px] font-bold text-[#D35400] uppercase block">Corporate Job Match</span>
                <span className="text-lg font-black text-[#2C3E50]">88% Match</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                <span className="text-[10px] font-bold text-[#D35400] uppercase block">Action Verb Power</span>
                <span className="text-lg font-black text-[#2C3E50]">9.5 / 10</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 text-xs animate-in fade-in duration-200">
            <h3 className="text-base font-extrabold text-[#2C3E50]">Resume Development Timeline</h3>
            <div className="space-y-2 border-l-2 border-[#D35400] pl-4">
              <div className="relative">
                <span className="font-bold text-[#D35400] block">July 26, 2026 - Final ATS Benchmark Verified</span>
                <p className="text-[#2C3E50]">Completed all 12 sections of Module 8 and earned 9.5/10 overall evaluation score.</p>
              </div>
              <div className="relative pt-2">
                <span className="font-bold text-[#2C3E50] block">July 22, 2026 - Action Verb & Job Match Refinement</span>
                <p className="text-[#2C3E50]">Analyzed Job Description keywords and rephrased weak project statements.</p>
              </div>
              <div className="relative pt-2">
                <span className="font-bold text-[#2C3E50] block">July 20, 2026 - Initial Resume Draft Created</span>
                <p className="text-[#2C3E50]">Built initial profile draft using Interactive Resume Builder.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Congratulations on completing Module 8 (Resume & Cover Letter Writing)!
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Finish & Save Resume Module Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
