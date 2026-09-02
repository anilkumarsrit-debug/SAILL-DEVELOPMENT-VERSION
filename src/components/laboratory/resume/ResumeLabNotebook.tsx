import React, { useState } from 'react';
import { Database, FileText, Mail, Search, Sparkles, CheckCircle2, ArrowRight, History, Calendar, Download } from 'lucide-react';

interface ResumeLabNotebookProps {
  onCompleteActivity: () => void;
}

export const ResumeLabNotebook: React.FC<ResumeLabNotebookProps> = ({ onCompleteActivity }) => {
  const [activeTab, setActiveTab] = useState<'resumes' | 'cover_letters' | 'jd_scans' | 'history'>('resumes');

  const storedResumes = [
    {
      id: 'res-v2',
      title: 'SRIT B.Tech CSE ATS Benchmark Resume (v2.0)',
      date: 'July 26, 2026',
      atsScore: 9.6,
      version: 'v2.0 Final',
      contentPreview: 'Anil Kumar (264G1A0501) | Engineered campus facility portal using React & MySQL. Reduced query load latency by 30%...'
    },
    {
      id: 'res-v1',
      title: 'Initial Draft Student Resume (v1.0)',
      date: 'July 20, 2026',
      atsScore: 7.2,
      version: 'v1.0 Draft',
      contentPreview: 'Anil Kumar | First year student at SRIT. Worked on Python project in college lab...'
    }
  ];

  const storedCoverLetters = [
    {
      id: 'cl-01',
      title: 'Tech Corp Summer Engineering Internship Cover Letter',
      date: 'July 26, 2026',
      recipient: 'Hiring Manager, Tech Corp India',
      preview: 'Dear Hiring Manager,\n\nI am writing to formally express my strong interest in the Summer Software Engineering Internship position at Tech Corp...'
    }
  ];

  const storedJdScans = [
    {
      id: 'jd-01',
      title: 'Infosys / TCS Graduate Trainee (Software Engineer)',
      date: 'July 25, 2026',
      matchScore: '88% Match',
      missingKeywords: ['RESTful APIs', 'Agile Workflows', 'CI/CD Pipelines']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 11
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Database className="w-5 h-5 text-[#D35400]" />
            11. Digital Laboratory Notebook Archives
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Automated, tamper-proof audit record storing resume drafts, cover letters, job description scans, AI recommendations, faculty feedback, and submission dates.
          </p>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('resumes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'resumes'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume Drafts ({storedResumes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cover_letters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cover_letters'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Cover Letters ({storedCoverLetters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jd_scans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'jd_scans'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Job Description Scans ({storedJdScans.length})</span>
          </button>
        </div>

        {/* Tab 1: Resumes */}
        {activeTab === 'resumes' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {storedResumes.map((res) => (
              <div key={res.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                      {res.version}
                    </span>
                    <h4 className="font-extrabold text-[#2C3E50]">{res.title}</h4>
                  </div>
                  <span className="text-[10px] text-[#5D6D7E] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {res.date}
                  </span>
                </div>

                <p className="font-mono text-[11px] text-[#2C3E50] bg-white p-3 rounded-lg border border-[#FAD7A0]">
                  {res.contentPreview}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    ATS Grade: {res.atsScore} / 10
                  </span>
                  <button type="button" className="text-xs text-[#D35400] font-bold hover:underline">
                    View Full Archival File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cover Letters */}
        {activeTab === 'cover_letters' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {storedCoverLetters.map((cl) => (
              <div key={cl.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#2C3E50]">{cl.title}</h4>
                  <span className="text-[10px] text-[#5D6D7E] font-mono">{cl.date}</span>
                </div>
                <p className="font-mono text-[11px] text-[#2C3E50] bg-white p-3 rounded-lg border border-[#FAD7A0] whitespace-pre-wrap">
                  {cl.preview}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: JD Scans */}
        {activeTab === 'jd_scans' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {storedJdScans.map((jd) => (
              <div key={jd.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#2C3E50]">{jd.title}</h4>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                    {jd.matchScore}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#FAD7A0] space-y-1">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase block">Missing Keywords Identified:</span>
                  <div className="flex flex-wrap gap-1">
                    {jd.missingKeywords.map((m, i) => (
                      <span key={i} className="bg-red-50 text-red-900 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 12: Portfolio Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
