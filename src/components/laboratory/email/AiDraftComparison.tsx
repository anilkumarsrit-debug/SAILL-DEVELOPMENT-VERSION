import React, { useState } from 'react';
import { Layers, Check, X, ArrowRight, ArrowLeftRight } from 'lucide-react';

interface DraftPair {
  subject: string;
  body: string;
}

interface AiDraftComparisonProps {
  originalDraft?: DraftPair;
  aiImprovedDraft?: DraftPair;
  onCompleteActivity: () => void;
}

export const AiDraftComparison: React.FC<AiDraftComparisonProps> = ({
  originalDraft = {
    subject: '[Application] Summer Software Engineering Internship - Anil Kumar (264G1A0501)',
    body: 'Dear Hiring Manager,\n\nI am a First-Year B.Tech Computer Science & Engineering student at Srinivasa Ramanujan Institute of Technology (SRIT). I am writing to formally apply for the Summer Software Development Internship position at Tech Corp.\n\nDuring my academic coursework, I have gained strong foundational knowledge in Data Structures, Algorithms, and Object-Oriented Programming using Java and Python. Recently, I developed a campus navigation web application as part of our laboratory mini-project.\n\nI have attached my resume for your perusal and would welcome the opportunity to discuss how my skills align with your engineering team.\n\nThank you for your time and consideration.\n\nSincerely,\nAnil Kumar\nB.Tech CSE (Roll No: 264G1A0501)\nSrinivasa Ramanujan Institute of Technology\nPhone: +91 98765 43210 | Email: anil.cse26@srit.ac.in'
  },
  aiImprovedDraft = {
    subject: '[Application] Summer Software Engineering Internship - Anil Kumar (Roll No: 264G1A0501)',
    body: `Dear Hiring Manager,\n\nI am writing to formally express my enthusiastic interest in the Summer Software Engineering Internship position at Tech Corp. I am currently a First-Year B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT).\n\nThrough my rigorous academic coursework, I have developed a solid foundation in Data Structures, Algorithms, and Object-Oriented Software Design in Java and Python. Recently, I spearheaded the development of a campus navigation web application, implementing responsive UI design and optimized search algorithms.\n\nI have attached my resume and project portfolio for your review. I would welcome the opportunity to discuss how my technical passion and problem-solving skills align with Tech Corp's engineering initiatives.\n\nThank you for your time and consideration.\n\nSincerely,\nAnil Kumar\nB.Tech Computer Science & Engineering (Year I)\nSrinivasa Ramanujan Institute of Technology (SRIT)\nRoll No: 264G1A0501 | Phone: +91 98765 43210\nPortfolio: https://github.com/anilkumar-srit | Email: anil.cse26@srit.ac.in`
  },
  onCompleteActivity
}) => {
  const [acceptedChanges, setAcceptedChanges] = useState<Record<string, boolean>>({
    opening: true,
    vocab: true,
    project: true,
    portfolio: true,
    signature: true
  });

  const toggleChange = (key: string) => {
    setAcceptedChanges((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const improvements = [
    {
      key: 'opening',
      category: 'Tone Improvement',
      original: 'I am writing to formally apply for...',
      improved: 'I am writing to formally express my enthusiastic interest in...',
      desc: 'Adds proactive enthusiasm and confidence to opening.'
    },
    {
      key: 'vocab',
      category: 'Vocabulary Enhancement',
      original: 'I have gained strong foundational knowledge in...',
      improved: 'Through my rigorous academic coursework, I have developed a solid foundation in...',
      desc: 'Elevates vocabulary with academic rigor.'
    },
    {
      key: 'project',
      category: 'Action Verbs',
      original: 'I developed a campus navigation web app...',
      improved: 'I spearheaded the development of a campus navigation web application, implementing responsive UI...',
      desc: 'Replaces generic "developed" with high-impact "spearheaded".'
    },
    {
      key: 'portfolio',
      category: 'Call-to-Action',
      original: 'I have attached my resume for your perusal...',
      improved: 'I have attached my resume and project portfolio for your review...',
      desc: 'Mentions project portfolio link for proof of work.'
    },
    {
      key: 'signature',
      category: 'Signature Formatting',
      original: 'Phone: +91 98765 43210 | Email: ...',
      improved: 'Portfolio: https://github.com/anilkumar-srit | Email: ...',
      desc: 'Includes professional GitHub URL in signature.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 8
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D35400]" />
            8. AI Draft Comparison Studio (Side-by-Side View)
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Compare student draft against the AI-polished version. Review highlighted grammar, vocabulary, tone, and formatting changes.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Student Draft */}
          <div className="p-5 bg-gray-50 border border-gray-300 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" /> Original Student Draft
              </span>
              <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-mono">Draft v1</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 font-mono text-xs text-gray-800">
              <div>
                <span className="text-[10px] text-gray-400 font-sans block">Subject:</span>
                <span className="font-bold">{originalDraft.subject}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 whitespace-pre-wrap leading-relaxed text-gray-700">
                {originalDraft.body}
              </div>
            </div>
          </div>

          {/* AI Improved Draft */}
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#D35400] rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="text-xs font-extrabold text-[#D35400] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D35400]" /> AI Improved Version (R26 Benchmark)
              </span>
              <span className="text-[10px] bg-[#D35400] text-white px-2 py-0.5 rounded-md font-bold">AI Enhanced</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-3 font-mono text-xs text-[#2C3E50]">
              <div>
                <span className="text-[10px] text-[#D35400] font-sans block font-bold">Subject:</span>
                <span className="font-extrabold text-[#2C3E50]">{aiImprovedDraft.subject}</span>
              </div>
              <div className="border-t border-[#FAD7A0] pt-2 whitespace-pre-wrap leading-relaxed">
                {aiImprovedDraft.body}
              </div>
            </div>
          </div>
        </div>

        {/* Granular Suggestion Accept/Reject Controls */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase text-[#D35400] tracking-wider flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#E67E22]" /> Review Individual AI Enhancements:
          </h3>

          <div className="space-y-2">
            {improvements.map((imp) => {
              const isAccepted = acceptedChanges[imp.key];
              return (
                <div
                  key={imp.key}
                  className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAccepted
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-[#D35400] block">{imp.category}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-mono">
                      <span className="line-through text-red-600">{imp.original}</span>
                      <span className="text-emerald-800 font-bold">➜ {imp.improved}</span>
                    </div>
                    <p className="text-[11px] text-[#5D6D7E]">{imp.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleChange(imp.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                      isAccepted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isAccepted ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Accepted
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" /> Reject
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Track performance analytics across all writing tasks in Section 9.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Email Performance Analytics <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
