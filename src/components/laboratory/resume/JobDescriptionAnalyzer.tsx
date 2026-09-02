import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, AlertOctagon, ArrowRight, Tag, RefreshCw, Layers, FileText, Check, AlertCircle } from 'lucide-react';

interface JobDescriptionAnalyzerProps {
  onCompleteActivity: () => void;
}

export const JobDescriptionAnalyzer: React.FC<JobDescriptionAnalyzerProps> = ({ onCompleteActivity }) => {
  const [jobDescription, setJobDescription] = useState<string>(
    `We are seeking a motivated Software Engineering Intern (B.Tech CSE/IT) to join our core Web Development team.

Key Responsibilities & Skills Required:
- Build responsive user interfaces using React.js, JavaScript (ES6+), and Tailwind CSS.
- Develop backend RESTful APIs using Node.js, Express.js, and SQL databases (MySQL/PostgreSQL).
- Write clean Data Structures and Object-Oriented code in Java or Python.
- Knowledge of Version Control using Git/GitHub, Agile development, and REST APIs.
- Strong problem-solving, communication skills, and ability to optimize database queries.`
  );

  const [studentResumeText, setStudentResumeText] = useState<string>(
    `Anil Kumar - B.Tech CSE Student (SRIT 264G1A0501)
Skills: Java, Python, C, HTML, CSS, JavaScript, React.js, Data Structures, Git, MySQL.
Projects: Built Campus Portal in React.js and SQL. Created Python Data Structure Visualizer.`
  );

  const [analysisResult, setAnalysisResult] = useState<{
    matchPercentage: number;
    requiredKeywords: { term: string; category: 'Languages' | 'Frameworks' | 'Tools' | 'Concepts'; presentInResume: boolean }[];
    missingKeywords: string[];
    matchingKeywords: string[];
    atsSuggestions: string[];
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const jdLower = jobDescription.toLowerCase();
      const resumeLower = studentResumeText.toLowerCase();

      const keyTermsList = [
        { term: 'React.js', category: 'Frameworks' as const },
        { term: 'JavaScript', category: 'Languages' as const },
        { term: 'Tailwind CSS', category: 'Frameworks' as const },
        { term: 'Node.js', category: 'Frameworks' as const },
        { term: 'Express.js', category: 'Frameworks' as const },
        { term: 'MySQL', category: 'Tools' as const },
        { term: 'PostgreSQL', category: 'Tools' as const },
        { term: 'Java', category: 'Languages' as const },
        { term: 'Python', category: 'Languages' as const },
        { term: 'Data Structures', category: 'Concepts' as const },
        { term: 'REST APIs', category: 'Concepts' as const },
        { term: 'Git', category: 'Tools' as const },
        { term: 'GitHub', category: 'Tools' as const },
        { term: 'Agile', category: 'Concepts' as const }
      ];

      const evaluatedTerms = keyTermsList.map((item) => {
        const inJD = jdLower.includes(item.term.toLowerCase());
        const inResume = resumeLower.includes(item.term.toLowerCase());
        return {
          term: item.term,
          category: item.category,
          presentInResume: inResume,
          inJD
        };
      }).filter((item) => item.inJD);

      const matching = evaluatedTerms.filter((item) => item.presentInResume).map((item) => item.term);
      const missing = evaluatedTerms.filter((item) => !item.presentInResume).map((item) => item.term);

      const matchPct = evaluatedTerms.length > 0
        ? Math.round((matching.length / evaluatedTerms.length) * 100)
        : 75;

      setAnalysisResult({
        matchPercentage: matchPct,
        requiredKeywords: evaluatedTerms,
        missingKeywords: missing,
        matchingKeywords: matching,
        atsSuggestions: [
          `Add missing technical terms (${missing.slice(0, 3).join(', ')}) directly to your Technical Skills section.`,
          'Incorporate the exact phrase "REST APIs" inside your Campus Portal project bullet point.',
          'Ensure your section headings strictly match standard names (EDUCATION, TECHNICAL SKILLS, PROJECTS).',
          'Export as a single-column searchable PDF file named Anil_Kumar_SRIT_264G1A0501_Resume.pdf.'
        ]
      });

      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 5
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Search className="w-5 h-5 text-[#D35400]" />
            5. Job Description Analyzer & ATS Keyword Scanner
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Paste target corporate job descriptions to extract high-frequency skills, compare against your resume draft, and discover missing ATS keywords.
          </p>
        </div>

        {/* Input Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              Target Job Description / Internship Requirements
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-[#FFF8F0] focus:outline-none focus:border-[#D35400] font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              Your Current Resume Content / Skillset
            </label>
            <textarea
              rows={8}
              value={studentResumeText}
              onChange={(e) => setStudentResumeText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-[#FFF8F0] focus:outline-none focus:border-[#D35400] font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze Job Description & Match Keywords</span>
          </button>
        </div>

        {/* Analysis Output Results */}
        {analysisResult && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
                  Scan Complete
                </span>
                <h3 className="text-base font-extrabold text-[#2C3E50] mt-1">
                  ATS Skill Match & Keyword Analysis
                </h3>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#FAD7A0] text-center">
                <span className="text-[9px] font-bold text-[#D35400] uppercase block">ATS Match Score</span>
                <span className="text-lg font-black text-[#2C3E50]">
                  {analysisResult.matchPercentage}% Match
                </span>
              </div>
            </div>

            {/* Keyword Pills Grid */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#2C3E50] block">Required Job Keywords Comparison:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {analysisResult.requiredKeywords.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-1.5 ${
                      item.presentInResume
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-300 text-red-950'
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-[9px] block text-gray-500 uppercase font-sans">{item.category}</span>
                      <span>{item.term}</span>
                    </div>
                    {item.presentInResume ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Keywords Action Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <span className="text-xs font-extrabold text-red-800 uppercase block">
                  ⚠️ Missing Required Keywords ({analysisResult.missingKeywords.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-white text-red-900 border border-red-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase block">
                  ✅ Matching Verified Keywords ({analysisResult.matchingKeywords.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.matchingKeywords.map((kw, i) => (
                    <span key={i} className="bg-white text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ATS Compatibility Recommendations */}
            <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
              <span className="text-xs font-extrabold text-[#D35400] uppercase block">
                ATS Compatibility Suggestions:
              </span>
              <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                {analysisResult.atsSuggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] shrink-0 mt-1.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
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
            <span>Proceed to Section 6: Cover Letter Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
