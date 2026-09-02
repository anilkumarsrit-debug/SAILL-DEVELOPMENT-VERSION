import React, { useState } from 'react';
import { Type, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubjectLineBuilderProps {
  onCompleteActivity: () => void;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  context: string;
  prompt: string;
  placeholder: string;
  sampleGood: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'internship',
    title: 'Internship Application',
    category: 'Career Placement',
    context: 'Applying for a Summer Software Engineering Internship at Infosys.',
    prompt: 'Write a professional, high-impact subject line for your internship application.',
    placeholder: '[Application] Summer Software Engineering Internship 2026 - Anil Kumar (264G1A0501)',
    sampleGood: '[Application] Summer Software Engineering Internship 2026 - Anil Kumar (Roll No 264G1A0501)'
  },
  {
    id: 'leave',
    title: 'Leave Request',
    category: 'Academic Administration',
    context: 'Requesting 2 days On-Duty leave from your HOD for attending a regional AI conference.',
    prompt: 'Write an actionable subject line specifying your name, roll number, and dates.',
    placeholder: '[Leave Request] On-Duty Leave for AI Conference (July 28-29) - 264G1A0501',
    sampleGood: '[Leave Request] On-Duty Permission for AI Conference (July 28-29) - Anil Kumar'
  },
  {
    id: 'project',
    title: 'Project Submission',
    category: 'Academic Coursework',
    context: 'Submitting your final Phase-1 Web Development Lab project documentation.',
    prompt: 'Draft a subject line containing the course name, project title, and group number.',
    placeholder: '[Submission] Web Dev Lab Phase-1 Documentation - Group 04 (CSE-A)',
    sampleGood: '[Submission] Web Dev Lab Phase-1 Source Code & Report - Group 04 (CSE-A)'
  },
  {
    id: 'meeting',
    title: 'Meeting Request',
    category: 'Faculty Communication',
    context: 'Requesting a 15-minute appointment with your Mini-Project Mentor to resolve a database design query.',
    prompt: 'Draft a polite subject line stating your topic and requested timeframe.',
    placeholder: '[Meeting Request] Mini-Project Database Schema Guidance - Group 04',
    sampleGood: '[Meeting Request] Guidance on Mini-Project Database Schema - Anil Kumar (CSE-A)'
  },
  {
    id: 'complaint',
    title: 'Technical Complaint',
    category: 'Campus Facilities',
    context: 'Reporting a faulty projector or Wi-Fi router issue in Language Lab 02.',
    prompt: 'Draft a concise subject line specifying the facility, location, and issue.',
    placeholder: '[Maintenance] Wi-Fi Connectivity & Projector Issue - Language Lab 02',
    sampleGood: '[Maintenance Request] Wi-Fi Connectivity & Overhead Projector - Language Lab 02'
  },
  {
    id: 'clarification',
    title: 'Clarification Request',
    category: 'Academic Inquiry',
    context: 'Seeking clarification regarding Mid-1 exam syllabus topics from your Communicative English Professor.',
    prompt: 'Draft a clear subject line indicating the subject and specific exam topic query.',
    placeholder: '[Clarification] Communicative English Mid-1 Exam Syllabus - Roll No 264G1A0501',
    sampleGood: '[Query] Communicative English Lab Mid-1 Assessment Scope - Anil Kumar'
  }
];

interface FeedbackResult {
  score: number; // 0 - 10
  clarity: number; // 0 - 10
  specificity: number; // 0 - 10
  professionalism: number; // 0 - 10
  suggestions: string[];
  improvedSubject: string;
}

export const SubjectLineBuilder: React.FC<SubjectLineBuilderProps> = ({ onCompleteActivity }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('internship');
  const [userInput, setUserInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<FeedbackResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const evaluateSubjectLine = () => {
    if (!userInput.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const text = userInput.trim();
      const length = text.length;

      let clarityScore = 8;
      let specScore = 8;
      let profScore = 8;
      const suggestions: string[] = [];

      // Category bracket check
      const hasBrackets = /^\[.+\]/.test(text);
      if (hasBrackets) {
        profScore += 1;
      } else {
        suggestions.push('Consider starting with a bracketed category like [Request], [Submission], or [Application].');
        profScore -= 1;
      }

      // Roll number or identifier check
      const hasRollNo = /\d{2}[A-Z0-9]{8}|\d{5,10}|Roll|Group/i.test(text);
      if (hasRollNo) {
        specScore += 1;
      } else {
        suggestions.push('Include your Roll Number or Group ID for instant identification.');
        specScore -= 2;
      }

      // Length check
      if (length < 15) {
        clarityScore -= 3;
        suggestions.push('Subject line is too brief. Add more context so the recipient understands at a glance.');
      } else if (length > 80) {
        clarityScore -= 2;
        suggestions.push('Subject line is quite long. Aim for under 60 characters to avoid truncation on mobile.');
      } else {
        clarityScore += 1;
      }

      // Vague words check
      if (/help|urgent|please|needed|info|stuff|hi|hello/i.test(text) && !hasBrackets) {
        profScore -= 2;
        suggestions.push('Avoid informal or overly generic words like "urgent" or "stuff".');
      }

      clarityScore = Math.min(10, Math.max(4, clarityScore));
      specScore = Math.min(10, Math.max(4, specScore));
      profScore = Math.min(10, Math.max(4, profScore));

      const overall = Math.round((clarityScore + specScore + profScore) / 3);

      if (suggestions.length === 0) {
        suggestions.push('Excellent subject line! Highly specific, clear, and professionally formatted.');
      }

      setEvaluation({
        score: overall,
        clarity: clarityScore,
        specificity: specScore,
        professionalism: profScore,
        suggestions,
        improvedSubject: activeScenario.sampleGood
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
              Section 3
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Type className="w-5 h-5 text-[#D35400]" />
            3. Subject Line Builder & AI Evaluator
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            80% of formal emails are opened based on the subject line alone. Practice constructing concise, actionable subject lines.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
            Select Writing Scenario:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioId(sc.id);
                    setUserInput('');
                    setEvaluation(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className="text-[9px] uppercase font-black opacity-80">{sc.category}</span>
                  <span className="text-xs font-bold mt-1 leading-snug">{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scenario Details & Practice Input */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#D35400]">Scenario Context:</span>
            <p className="text-xs text-[#2C3E50] font-medium">{activeScenario.context}</p>
            <p className="text-xs text-[#5D6D7E] italic">{activeScenario.prompt}</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C3E50] block">
              Your Subject Line Draft:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={activeScenario.placeholder}
                className="flex-1 bg-white border border-[#FAD7A0] rounded-xl px-4 py-2.5 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#D35400]"
              />
              <button
                type="button"
                onClick={evaluateSubjectLine}
                disabled={!userInput.trim() || isAnalyzing}
                className="px-6 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Evaluate Subject Line
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Evaluation Report */}
        {evaluation && (
          <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-extrabold text-[#2C3E50]">AI Subject Line Evaluation</h4>
              </div>

              <div className="flex items-center gap-2 bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
                <span className="text-[10px] font-bold uppercase text-[#D35400]">Overall Score:</span>
                <span className="text-base font-black text-[#2C3E50]">{evaluation.score} / 10</span>
              </div>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Clarity</span>
                <span className="text-lg font-black text-[#2C3E50]">{evaluation.clarity} / 10</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Specificity</span>
                <span className="text-lg font-black text-[#2C3E50]">{evaluation.specificity} / 10</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Professionalism</span>
                <span className="text-lg font-black text-[#2C3E50]">{evaluation.professionalism} / 10</span>
              </div>
            </div>

            {/* Suggestions & Benchmark */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D35400]">AI Suggestions & Feedback:</span>
                <ul className="space-y-1 text-xs text-[#5D6D7E]">
                  {evaluation.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#E67E22] shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D35400] block">Benchmark Professional Subject Line:</span>
                <p className="text-xs font-mono text-[#2C3E50] font-bold">{evaluation.improvedSubject}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Master subject lines before moving to full email drafting in the Writing Lab.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Professional Email Writing Lab <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
