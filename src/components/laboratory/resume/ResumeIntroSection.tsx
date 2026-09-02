import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, FileText, Target, Eye, AlertCircle, Award } from 'lucide-react';

interface ResumeIntroSectionProps {
  onCompleteActivity: () => void;
}

export const ResumeIntroSection: React.FC<ResumeIntroSectionProps> = ({ onCompleteActivity }) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'cv_vs_resume' | 'ats_intro' | 'examples'>('concepts');

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Section Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 1
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            1. Introduction to Resume Writing
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Understand the fundamental purpose of a professional resume, recruiter expectations, ATS mechanics, and the key distinctions between a Resume and a CV.
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'concepts'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Core Purpose & Expectations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cv_vs_resume')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cv_vs_resume'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Resume vs. CV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ats_intro')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ats_intro'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ATS & Recruiter Reality</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'examples'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Good vs. Poor Resume Examples</span>
          </button>
        </div>

        {/* Tab 1: Core Concepts */}
        {activeTab === 'concepts' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-white px-2.5 py-0.5 rounded-md border border-[#FAD7A0]">
                  Definition
                </span>
                <h3 className="text-base font-extrabold text-[#2C3E50]">What is a Resume?</h3>
                <p className="text-xs text-[#2C3E50] leading-relaxed">
                  A <strong>resume</strong> (derived from the French word <em>résumé</em> meaning "summary") is a concise 1-page document summarizing an individual's education, engineering skills, project achievements, technical competencies, and professional qualifications relevant to a specific position.
                </p>
              </div>

              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-white px-2.5 py-0.5 rounded-md border border-[#FAD7A0]">
                  Primary Goal
                </span>
                <h3 className="text-base font-extrabold text-[#2C3E50]">Purpose of a Professional Resume</h3>
                <p className="text-xs text-[#2C3E50] leading-relaxed">
                  Contrary to popular belief, a resume's primary purpose is <strong>not to get you the job</strong>, but to <strong>secure an interview call</strong>. It serves as your personal marketing document, highlighting how your skills solve the recruiter's specific requirements.
                </p>
              </div>
            </div>

            <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
              <h4 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D35400]" />
                What Recruiters Expect in First 6 Seconds:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase">1. Immediate Clarity</span>
                  <p className="text-[11px] text-[#2C3E50]">Clear contact header, SRIT roll number, B.Tech branch, and target role.</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase">2. Relevant Skills</span>
                  <p className="text-[11px] text-[#2C3E50]">Languages, frameworks, tools, and technical competencies aligned with job specs.</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase">3. Quantified Impact</span>
                  <p className="text-[11px] text-[#2C3E50]">Action verbs and metrics (percentages, performance gains, lines of code).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Resume vs CV */}
        {activeTab === 'cv_vs_resume' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-[#5D6D7E]">
              Students often confuse <strong>Resume</strong> and <strong>Curriculum Vitae (CV)</strong>. Here is the formal engineering distinction:
            </p>

            <div className="overflow-x-auto border border-[#FAD7A0] rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF8F0] border-b border-[#FAD7A0] text-[#2C3E50]">
                    <th className="p-3 font-extrabold">Feature</th>
                    <th className="p-3 font-extrabold text-[#D35400]">Resume (Industry / Placements)</th>
                    <th className="p-3 font-extrabold text-blue-800">CV - Curriculum Vitae (Academic / Research)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAD7A0] text-[#2C3E50]">
                  <tr>
                    <td className="p-3 font-bold bg-gray-50">Length</td>
                    <td className="p-3 font-bold text-[#D35400]">Strictly 1 Page (for undergraduates / freshers)</td>
                    <td className="p-3">2 to 5+ Pages (unlimited)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-gray-50">Focus</td>
                    <td className="p-3 font-bold text-[#D35400]">Tailored skills & project accomplishments for a specific job</td>
                    <td className="p-3">Comprehensive academic record, publications, & grants</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-gray-50">Layout Style</td>
                    <td className="p-3 font-bold text-[#D35400]">ATS-scannable bullet points with action verbs</td>
                    <td className="p-3">Detailed chronological lists of achievements</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-gray-50">Usage</td>
                    <td className="p-3 font-bold text-[#D35400]">Corporate campus placements, internships, software jobs</td>
                    <td className="p-3">M.Tech/Ph.D. admissions, research fellowships, teaching roles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: ATS Intro */}
        {activeTab === 'ats_intro' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <span>What is an ATS (Applicant Tracking System)?</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Over <strong>98% of Fortune 500 companies</strong> and major Indian tech recruiters (Infosys, TCS, Wipro, Cognizant, Amazon, Microsoft) use <strong>Applicant Tracking Systems (ATS)</strong> software to automatically filter, parse, and rank job applications before any human recruiter reads them.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2">
                <h4 className="text-xs font-extrabold text-[#D35400] uppercase">How ATS Parses Your Resume:</h4>
                <ol className="list-decimal list-inside text-xs text-[#2C3E50] space-y-1">
                  <li>Extracts plain text from your PDF or DOCX file.</li>
                  <li>Categorizes text into standard sections (Education, Skills, Experience).</li>
                  <li>Searches for exact target keywords mentioned in the Job Description.</li>
                  <li>Calculates an ATS Match Score (0% to 100%).</li>
                </ol>
              </div>

              <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2">
                <h4 className="text-xs font-extrabold text-[#D35400] uppercase">Why Resumes Get Rejected by ATS:</h4>
                <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                  <li>Complex tables, multi-column graphics, or images.</li>
                  <li>Non-standard section headers (e.g., "My Journey" instead of "Education").</li>
                  <li>Missing key technical skills (e.g. Python, Java, SQL, Git).</li>
                  <li>Low-contrast fonts or non-standard file formats (.pages, .png).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Good vs Poor Examples */}
        {activeTab === 'examples' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Poor Resume Sample */}
              <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-red-200 pb-2">
                  <span className="text-xs font-black text-red-700 uppercase flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-600" /> Poor Resume (Rejected by ATS)
                  </span>
                  <span className="text-[10px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-md">
                    ATS Score: 32%
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px] text-red-950 bg-white p-3 rounded-xl border border-red-200 leading-relaxed">
                  <p className="font-bold">Name: Anil (Email: cool_guy99@gmail.com)</p>
                  <p className="italic text-gray-500">Objective: I want a job in a big IT company to earn money and gain knowledge.</p>
                  <p className="font-bold border-t border-gray-200 pt-1">Projects:</p>
                  <p>• Worked on Python project in college.</p>
                  <p>• Did coding for web page using HTML.</p>
                  <p className="font-bold border-t border-gray-200 pt-1">Skills:</p>
                  <p>Computer, C, Microsoft Word, Hardworking, Good listener.</p>
                </div>

                <ul className="text-[11px] text-red-800 space-y-1 list-disc list-inside">
                  <li>Unprofessional email ID (cool_guy99@gmail.com).</li>
                  <li>Vague career objective with zero value proposition.</li>
                  <li>Weak passive verbs ("Worked on", "Did coding").</li>
                  <li>Zero quantifiable metrics or specific technical frameworks.</li>
                </ul>
              </div>

              {/* Good Resume Sample */}
              <div className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> High-Impact Resume (Benchmark)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                    ATS Score: 96%
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px] text-emerald-950 bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed">
                  <p className="font-bold">ANIL KUMAR | SRIT (264G1A0501) | github.com/anilkumar-cs</p>
                  <p className="italic text-gray-600">Career Objective: First-Year B.Tech CSE student seeking Software Engineering Internship at Tech Corp...</p>
                  <p className="font-bold border-t border-gray-200 pt-1">Key Engineering Projects:</p>
                  <p>• <strong>Engineered</strong> campus portal using React & Express, reducing query processing time by 35%.</p>
                  <p>• <strong>Developed</strong> Python DSA visualizer tool utilized by 120+ first-year peer students.</p>
                  <p className="font-bold border-t border-gray-200 pt-1">Technical Competencies:</p>
                  <p>Java, Python, C++, React.js, Node.js, SQL, Git, Linux CLI.</p>
                </div>

                <ul className="text-[11px] text-emerald-900 space-y-1 list-disc list-inside">
                  <li>Includes SRIT Roll No, GitHub portfolio, and professional email.</li>
                  <li>Action verb + task + impact formula with percentages.</li>
                  <li>Standard ATS section headings and technical skills list.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 2: ATS Fundamentals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
