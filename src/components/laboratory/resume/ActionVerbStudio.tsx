import React, { useState } from 'react';
import { Zap, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Award, BookOpen } from 'lucide-react';

interface ActionVerbPractice {
  id: string;
  category: string;
  weakStatement: string;
  sampleStrongStatement: string;
  targetVerbs: string[];
}

interface ActionVerbStudioProps {
  onCompleteActivity: () => void;
}

export const ActionVerbStudio: React.FC<ActionVerbStudioProps> = ({ onCompleteActivity }) => {
  const [practices] = useState<ActionVerbPractice[]>([
    {
      id: 'av-01',
      category: 'Software Engineering & Web Development',
      weakStatement: 'I was part of a team and did coding for a college student portal in Python.',
      sampleStrongStatement: 'Engineered a scalable student portal using Python & Django, serving 300+ SRIT students and reducing page load latency by 25%.',
      targetVerbs: ['Engineered', 'Architected', 'Deployed', 'Optimized']
    },
    {
      id: 'av-02',
      category: 'Database Management',
      weakStatement: 'I made the SQL queries and helped fix slow database tables in lab project.',
      sampleStrongStatement: 'Optimized relational MySQL database schemas and indexing, improving query execution speed by 40% for lab records.',
      targetVerbs: ['Optimized', 'Structured', 'Refactored', 'Accelerated']
    },
    {
      id: 'av-03',
      category: 'Leadership & Project Management',
      weakStatement: 'I was group leader for C programming mini project in 1st semester.',
      sampleStrongStatement: 'Spearheaded a 4-member engineering team to deliver a C-based automated inventory manager 3 days ahead of deadline.',
      targetVerbs: ['Spearheaded', 'Orchestrated', 'Directing', 'Coordinated']
    }
  ]);

  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0);
  const currentPractice = practices[activePracticeIndex];

  const [studentInput, setStudentInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{
    impactScore: number;
    vocabScore: number;
    clarityScore: number;
    overallScore: number;
    detectedVerbs: string[];
    feedback: string;
    improvedSuggestion: string;
  } | null>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const actionVerbsList = [
    'Designed', 'Developed', 'Implemented', 'Led', 'Analyzed', 'Created',
    'Optimized', 'Managed', 'Built', 'Solved', 'Spearheaded', 'Engineered',
    'Architected', 'Orchestrated', 'Streamlined', 'Quantified', 'Automated'
  ];

  const handleEvaluate = () => {
    if (!studentInput.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      const lower = studentInput.toLowerCase();
      const detected = actionVerbsList.filter((v) => lower.includes(v.toLowerCase()));

      const hasMetrics = /\d+%|\d+\s*(students|users|ms|seconds|days|hrs|records)/i.test(studentInput);
      const impactScore = hasMetrics ? 9.5 : 7.0;
      const vocabScore = detected.length >= 1 ? 9.2 : 6.5;
      const clarityScore = studentInput.length > 30 ? 9.0 : 6.8;
      const overallScore = Number(((impactScore + vocabScore + clarityScore) / 3).toFixed(1));

      setEvaluation({
        impactScore,
        vocabScore,
        clarityScore,
        overallScore,
        detectedVerbs: detected,
        feedback:
          detected.length > 0
            ? `Excellent choice of active engineering verbs (${detected.join(', ')})! ${
                hasMetrics ? 'Great inclusion of quantifiable performance metrics.' : 'Consider adding specific numbers (e.g., percentages, user counts).'
              }`
            : 'Try starting your bullet point with a high-impact engineering verb like Engineered, Developed, or Spearheaded.',
        improvedSuggestion:
          detected.length > 0
            ? studentInput
            : `Engineered and ${studentInput.replace(/i worked on|i did|i was/gi, '').trim()}`
      });
      setIsEvaluating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Section Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 4
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D35400]" />
            4. Action Verb Studio & Statement Rewriter
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Transform passive descriptions ("worked on", "helped with") into strong, high-impact bullet points starting with power verbs and quantifiable results.
          </p>
        </div>

        {/* Action Verbs Word Bank */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
          <span className="text-[10px] font-extrabold text-[#D35400] uppercase block">
            Core Engineering Power Verbs Bank:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {actionVerbsList.map((verb, idx) => (
              <span
                key={idx}
                className="text-[11px] font-bold px-2.5 py-1 bg-white border border-[#FAD7A0] text-[#2C3E50] rounded-lg shadow-2xs hover:border-[#D35400] transition cursor-default"
              >
                {verb}
              </span>
            ))}
          </div>
        </div>

        {/* Scenario Practice Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <span className="text-xs font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
              Practice Case {activePracticeIndex + 1} of {practices.length}: {currentPractice.category}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivePracticeIndex((activePracticeIndex + 1) % practices.length);
                  setStudentInput('');
                  setEvaluation(null);
                }}
                className="text-xs font-bold text-[#D35400] hover:underline"
              >
                Next Case Scenario
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Statement Box */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-red-800 uppercase block text-[10px]">❌ Weak Passive Statement:</span>
              <p className="italic text-red-950 bg-white p-3 rounded-lg border border-red-200 font-mono">
                "{currentPractice.weakStatement}"
              </p>
              <p className="text-[11px] text-red-800">
                Flaws: Passive voice, zero metrics, weak verbs ("did coding", "was part of").
              </p>
            </div>

            {/* Target Verbs Guidance */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-emerald-800 uppercase block text-[10px]">✨ Target Action Verbs to Use:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentPractice.targetVerbs.map((v, idx) => (
                  <span key={idx} className="bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-md text-[11px]">
                    {v}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-emerald-900">
                Benchmark Example: "{currentPractice.sampleStrongStatement}"
              </p>
            </div>
          </div>

          {/* Student Interactive Input Box */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-extrabold text-[#2C3E50] block">
              Rewrite the weak statement above using the Action Verb + Task + Quantified Impact formula:
            </label>

            <textarea
              rows={3}
              placeholder="e.g. Engineered a scalable student portal using Python & Django, serving 300+ students and optimizing page latency by 25%..."
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border-2 border-[#FAD7A0] focus:outline-none focus:border-[#D35400] bg-white font-mono"
            />

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !studentInput.trim()}
              className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2 disabled:opacity-50"
            >
              {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI Evaluate Impact & Vocabulary</span>
            </button>
          </div>

          {/* AI Evaluation Output Box */}
          {evaluation && (
            <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-3">
                <span className="text-xs font-black uppercase text-[#D35400] flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> AI Rubric Score
                </span>
                <div className="bg-white px-3 py-1 rounded-xl border border-[#FAD7A0] font-black text-sm text-[#2C3E50]">
                  Overall Score: {evaluation.overallScore} / 10
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#FAD7A0] text-center">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase block">Action Verb Power</span>
                  <span className="text-base font-black text-[#2C3E50]">{evaluation.vocabScore} / 10</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#FAD7A0] text-center">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase block">Quantified Impact</span>
                  <span className="text-base font-black text-[#2C3E50]">{evaluation.impactScore} / 10</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#FAD7A0] text-center">
                  <span className="text-[10px] font-bold text-[#D35400] uppercase block">Clarity & Diction</span>
                  <span className="text-base font-black text-[#2C3E50]">{evaluation.clarityScore} / 10</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] space-y-2">
                <p className="font-bold text-[#D35400]">Faculty Feedback:</p>
                <p className="leading-relaxed">{evaluation.feedback}</p>
                {evaluation.detectedVerbs.length > 0 && (
                  <p className="text-[11px] text-emerald-800 font-bold">
                    Detected Verbs: {evaluation.detectedVerbs.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 5: Job Description Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
