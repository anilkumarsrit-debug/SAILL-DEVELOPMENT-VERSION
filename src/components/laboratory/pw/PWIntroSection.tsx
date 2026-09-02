import React, { useState } from 'react';
import { BookOpen, CheckCircle2, HelpCircle, ArrowRight, Sparkles, RefreshCw, Award } from 'lucide-react';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWIntroSectionProps {
  onCompleteActivity: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of the following email subject lines best demonstrates the 'Clarity' and 'Conciseness' principles?",
    options: [
      "Help please urgently read this when free",
      "Requesting On-Duty Permission for Hackathon - Roll No 26SR1A0501",
      "Regarding my leave application and also my lab experiment record update",
      "Important message for Dr. Sharma"
    ],
    correctIndex: 1,
    explanation: "Option B specifies the exact action, purpose, event, and roll number clearly and concisely."
  },
  {
    id: 2,
    question: "In technical report writing, what does the 'Conciseness' principle require?",
    options: [
      "Using complex jargon to make the report look highly academic",
      "Eliminating redundant words, filler phrases, and passive clutter",
      "Writing short 1-word bullet points only",
      "Omitting figures and tables to save space"
    ],
    correctIndex: 1,
    explanation: "Conciseness means expressing complete technical meaning with minimal, precise wording."
  },
  {
    id: 3,
    question: "Which greeting is most appropriate for a formal email to an SRIT Department Head?",
    options: [
      "Hey Boss,",
      "Hi bro,",
      "Dear Dr. Standard / Respected HOD,",
      "To whom it may concern (without greeting)"
    ],
    correctIndex: 2,
    explanation: "Formal academic correspondence requires respectful salutations with titles."
  },
  {
    id: 4,
    question: "Why is an ATS (Applicant Tracking System) compatibility crucial for modern engineering resumes?",
    options: [
      "ATS checks whether your resume is colorful",
      "ATS automatically parses text into database fields; non-standard layouts get rejected before human review",
      "ATS converts text into audio speeches",
      "ATS only accepts handwritten PDFs"
    ],
    correctIndex: 1,
    explanation: "Over 90% of corporate recruiters use ATS software to filter resumes using structured text keywords."
  },
  {
    id: 5,
    question: "What is the primary objective of a Meeting Minutes (MoM) document?",
    options: [
      "To record every word spoken verbatim in a meeting",
      "To document decisions made, key discussions, and actionable tasks with assigned owners and deadlines",
      "To critique team members' speaking styles",
      "To replace the final engineering report"
    ],
    correctIndex: 1,
    explanation: "MoM ensures accountability by logging decisions and specific action items."
  }
];

export const PWIntroSection: React.FC<PWIntroSectionProps> = ({ onCompleteActivity }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (qId: number, oIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) score += 2;
    });
    return score; // Out of 10
  };

  const score = calculateScore();

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (score >= 6) {
      onCompleteActivity();
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Audio */}
      <PWAudioPlaceholder
        category="Welcome"
        title="Welcome to Module 6: Professional Writing & Workplace Communication"
        transcript="Welcome to Module 6! In this module, you will master formal workplace writing including professional emails, administrative letters, meeting minutes, technical reports, ATS resumes, LinkedIn profiles, and Statements of Purpose."
      />

      {/* 5 Cs Cards Grid */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
        <h2 className="text-xl font-extrabold text-[#D35400] mb-2 font-heading flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> The 5 Cs Framework of Professional Writing
        </h2>
        <p className="text-xs sm:text-sm text-[#5D6D7E] mb-6">
          Every professional document in modern engineering must adhere to these 5 foundational pillars.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl hover:shadow-xs transition">
            <span className="w-8 h-8 rounded-lg bg-[#D35400] text-white font-bold flex items-center justify-center mb-2 text-sm">1</span>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-1">Clarity</h3>
            <p className="text-xs text-[#5D6D7E]">State your main objective immediately. Avoid ambiguous phrasing.</p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl hover:shadow-xs transition">
            <span className="w-8 h-8 rounded-lg bg-[#E67E22] text-white font-bold flex items-center justify-center mb-2 text-sm">2</span>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-1">Conciseness</h3>
            <p className="text-xs text-[#5D6D7E]">Eliminate wordiness and unnecessary filler phrases.</p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl hover:shadow-xs transition">
            <span className="w-8 h-8 rounded-lg bg-[#D35400] text-white font-bold flex items-center justify-center mb-2 text-sm">3</span>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-1">Courtesy</h3>
            <p className="text-xs text-[#5D6D7E]">Maintain a polite, respectful, professional tone throughout.</p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl hover:shadow-xs transition">
            <span className="w-8 h-8 rounded-lg bg-[#E67E22] text-white font-bold flex items-center justify-center mb-2 text-sm">4</span>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-1">Correctness</h3>
            <p className="text-xs text-[#5D6D7E]">Verify facts, technical data, grammar, and formal mechanics.</p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl hover:shadow-xs transition">
            <span className="w-8 h-8 rounded-lg bg-[#D35400] text-white font-bold flex items-center justify-center mb-2 text-sm">5</span>
            <h3 className="font-bold text-[#2C3E50] text-sm mb-1">Completeness</h3>
            <p className="text-xs text-[#5D6D7E]">Provide all relevant details so the recipient can take action.</p>
          </div>
        </div>
      </div>

      {/* Diagnostic Readiness Quiz */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#D35400]" />
              Activity 1: Diagnostic Assessment (10 Marks)
            </h3>
            <p className="text-xs text-[#5D6D7E]">Test your understanding of professional writing concepts before entering the lab builders.</p>
          </div>
          {quizSubmitted && (
            <div className={`px-4 py-2 rounded-xl border text-sm font-black flex items-center gap-2 ${
              score >= 6 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              <Award className="w-4 h-4" /> Score: {score} / 10 Marks
            </div>
          )}
        </div>

        <div className="space-y-6 mt-4">
          {QUIZ_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <p className="text-xs sm:text-sm font-bold text-[#2C3E50] mb-3">
                Q{idx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[q.id] === oIdx;
                  const isCorrect = q.correctIndex === oIdx;

                  let btnStyle = 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400]';
                  if (quizSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#D35400] text-white font-bold border-[#D35400]';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`text-left text-xs p-3 rounded-lg border transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <p className="text-[11px] text-[#5D6D7E] mt-2 italic bg-white p-2 rounded border border-[#FAD7A0]">
                  💡 <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Submit Diagnostic & Evaluate
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full justify-between">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 border border-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Diagnostic
              </button>

              <button
                type="button"
                onClick={onCompleteActivity}
                className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
              >
                Proceed to Email Lab <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
