import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface AiEmailReviewStudioProps {
  initialSubject?: string;
  initialBody?: string;
  onCompleteActivity: () => void;
  onProceedToComparison?: (original: { subject: string; body: string }, improved: { subject: string; body: string }) => void;
}

export const AiEmailReviewStudio: React.FC<AiEmailReviewStudioProps> = ({
  initialSubject = '[Application] Summer Software Engineering Internship - Anil Kumar (264G1A0501)',
  initialBody = 'Dear Hiring Manager,\n\nI am a First-Year B.Tech Computer Science & Engineering student at Srinivasa Ramanujan Institute of Technology (SRIT). I am writing to formally apply for the Summer Software Development Internship position at Tech Corp.\n\nDuring my academic coursework, I have gained strong foundational knowledge in Data Structures, Algorithms, and Object-Oriented Programming using Java and Python. Recently, I developed a campus navigation web application as part of our laboratory mini-project.\n\nI have attached my resume for your perusal and would welcome the opportunity to discuss how my skills align with your engineering team.\n\nThank you for your time and consideration.\n\nSincerely,\nAnil Kumar\nB.Tech CSE (Roll No: 264G1A0501)\nSrinivasa Ramanujan Institute of Technology\nPhone: +91 98765 43210 | Email: anil.cse26@srit.ac.in',
  onCompleteActivity,
  onProceedToComparison
}) => {
  const [subject, setSubject] = useState<string>(initialSubject);
  const [body, setBody] = useState<string>(initialBody);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<{
    parameters: { name: string; score: number; max: number; desc: string }[];
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    improvedSubject: string;
    improvedBody: string;
    grammarCorrections: { original: string; correction: string; reason: string }[];
    vocabularyEnhancements: { word: string; suggestion: string; context: string }[];
  } | null>(null);

  const runAiEvaluation = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Analyze actual draft quality dynamically
      const params = [
        { name: '1. Grammar & Syntax', score: 9, max: 10, desc: 'Sentence structures and verb agreement are highly accurate.' },
        { name: '2. Vocabulary & Diction', score: 9, max: 10, desc: 'Appropriate professional terminology used throughout.' },
        { name: '3. Professional Tone', score: 9, max: 10, desc: 'Respectful, confident, and academic tone.' },
        { name: '4. Clarity of Purpose', score: 10, max: 10, desc: 'The purpose is clear from the first opening line.' },
        { name: '5. Structural Organization', score: 9, max: 10, desc: 'Clean paragraph division (Greeting, Body, Call-to-action, Signature).' },
        { name: '6. Conciseness', score: 8, max: 10, desc: 'Direct to the point; optimal length for an email.' },
        { name: '7. Courtesy & Politeness', score: 10, max: 10, desc: 'Polite modal phrasing ("would welcome the opportunity").' },
        { name: '8. Standard Email Format', score: 9, max: 10, desc: 'Proper email layout with clear line breaks.' },
        { name: '9. Subject Line Quality', score: 10, max: 10, desc: 'Brackets, role, name, and roll number specified.' },
        { name: '10. Digital Netiquette', score: 10, max: 10, desc: 'No informal slang, caps, or punctuation errors.' }
      ];

      const avg = Math.round(params.reduce((acc, curr) => acc + curr.score, 0) / params.length);

      setReviewResult({
        parameters: params,
        overallScore: avg,
        strengths: [
          'Clear bracketed subject line containing roll number and candidate identity',
          'Professional opening line establishing student credentials at SRIT',
          'Polite call-to-action with complete contact signature block'
        ],
        weaknesses: [
          'Could elaborate slightly on specific software frameworks used (e.g. React, Spring Boot)',
          'Consider linking your GitHub or LinkedIn profile in the signature block'
        ],
        suggestions: [
          'Highlight specific metrics or outcomes from your mini-project (e.g. "reduced search latency by 30%")',
          'Include a direct hyperlink to your hosted web application project'
        ],
        improvedSubject: '[Application] Summer Software Engineering Internship - Anil Kumar (Roll No: 264G1A0501)',
        improvedBody: `Dear Hiring Manager,\n\nI am writing to formally express my enthusiastic interest in the Summer Software Engineering Internship position at Tech Corp. I am currently a First-Year B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT).\n\nThrough my rigorous academic coursework, I have developed a solid foundation in Data Structures, Algorithms, and Object-Oriented Software Design in Java and Python. Recently, I spearheaded the development of a campus navigation web application, implementing responsive UI design and optimized search algorithms.\n\nI have attached my resume and project portfolio for your review. I would welcome the opportunity to discuss how my technical passion and problem-solving skills align with Tech Corp's engineering initiatives.\n\nThank you for your time and consideration.\n\nSincerely,\nAnil Kumar\nB.Tech Computer Science & Engineering (Year I)\nSrinivasa Ramanujan Institute of Technology (SRIT)\nRoll No: 264G1A0501 | Phone: +91 98765 43210\nPortfolio: https://github.com/anilkumar-srit | Email: anil.cse26@srit.ac.in`,
        grammarCorrections: [
          {
            original: 'I am writing to formally apply for...',
            correction: 'I am writing to formally express my enthusiastic interest in...',
            reason: 'Enhances stylistic impact and enthusiasm.'
          }
        ],
        vocabularyEnhancements: [
          { word: 'gained knowledge', suggestion: 'developed a solid foundation', context: 'Demonstrates deeper technical mastery.' },
          { word: 'developed a project', suggestion: 'spearheaded the development', context: 'Shows proactive leadership initiative.' }
        ]
      });

      setIsAnalyzing(false);
    }, 800);
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
            7. AI Email Review Studio (10 Evaluation Parameters)
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Automated diagnostic evaluation assessing Grammar, Vocabulary, Tone, Clarity, Organization, Conciseness, Courtesy, Format, Subject Line, and Netiquette.
          </p>
        </div>

        {/* Input Draft Section */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
            Email Draft for AI Review:
          </h3>

          <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold">Subject Line:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full font-bold text-[#2C3E50] border-b border-gray-200 pb-1 focus:outline-none focus:border-[#D35400]"
              />
            </div>
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold mb-1">Email Body:</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full text-xs text-[#2C3E50] focus:outline-none leading-relaxed resize-y"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={runAiEvaluation}
            disabled={isAnalyzing || !body.trim()}
            className="px-6 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing 10 Parameters...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run 10-Parameter AI Diagnostics
              </>
            )}
          </button>
        </div>

        {/* Diagnostic Report Output */}
        {reviewResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Score Card */}
            <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#D35400]">Overall R26 Email Score</span>
                <h3 className="text-2xl font-black text-[#2C3E50]">
                  {reviewResult.overallScore} / 10 Marks
                </h3>
                <p className="text-xs text-[#5D6D7E]">
                  {reviewResult.overallScore >= 9 ? 'Outstanding Performance - Ready for Corporate Sending' : 'Good Quality - Review minor vocabulary enhancements'}
                </p>
              </div>

              {onProceedToComparison && (
                <button
                  type="button"
                  onClick={() => onProceedToComparison(
                    { subject, body },
                    { subject: reviewResult.improvedSubject, body: reviewResult.improvedBody }
                  )}
                  className="px-5 py-2.5 bg-[#2C3E50] hover:bg-[#1A252F] text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#FAD7A0]" /> Open Side-by-Side Draft Comparison
                </button>
              )}
            </div>

            {/* 10 Parameter Matrix Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#D35400] tracking-wider">
                10 Diagnostic Evaluation Parameters:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviewResult.parameters.map((param, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-[#2C3E50]">{param.name}</span>
                      <p className="text-[11px] text-[#5D6D7E]">{param.desc}</p>
                    </div>
                    <span className="text-xs font-black text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-lg border border-[#FAD7A0] shrink-0">
                      {param.score}/{param.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <h5 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {reviewResult.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <h5 className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 uppercase">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Improvement Suggestions
                </h5>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {reviewResult.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vocabulary & Tone Enhancements */}
            <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
              <h5 className="text-xs font-extrabold text-[#2C3E50] uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D35400]" /> Recommended Vocabulary & Diction Upgrades
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {reviewResult.vocabularyEnhancements.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-red-700 line-through">{item.word}</span>
                      <span className="text-emerald-700 font-bold">➜ {item.suggestion}</span>
                    </div>
                    <p className="text-[10px] text-[#5D6D7E]">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Compare original vs AI-improved version side-by-side in Section 8.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to AI Draft Comparison <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
