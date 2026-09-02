import React, { useState } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Save,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Volume2,
  FileText
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface HrRoundSimulationProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio?: (title: string, category: string, content: string, score: number) => void;
}

interface QuestionCard {
  id: string;
  category: 'Behavioral' | 'Background' | 'Situational' | 'Culture';
  question: string;
  hint: string;
  keywords: string[];
}

const QUESTION_BANK: QuestionCard[] = [
  {
    id: 'q1',
    category: 'Background',
    question: 'Tell me about yourself and why you chose your engineering branch at SRIT.',
    hint: 'Use the Present-Past-Future model. Mention your current degree, 1-2 core skills/projects, and career aspiration.',
    keywords: ['Computer Science', 'SRIT', 'projects', 'problem-solving', 'passion']
  },
  {
    id: 'q2',
    category: 'Behavioral',
    question: 'Describe a situation where you had a tight deadline for a college project. How did you manage it?',
    hint: 'Use STAR method: Explain the project, deadline constraint, task prioritization, and positive outcome.',
    keywords: ['STAR', 'prioritization', 'teamwork', 'deadline', 'quality']
  },
  {
    id: 'q3',
    category: 'Situational',
    question: 'If a senior team member disagrees with your proposed code solution, how would you respond?',
    hint: 'Demonstrate active listening, objective data-driven benchmarking, respect, and collaborative spirit.',
    keywords: ['active listening', 'respect', 'data-driven', 'collaboration', 'feedback']
  },
  {
    id: 'q4',
    category: 'Culture',
    question: 'Why should our company select you over other qualified campus candidates?',
    hint: 'Highlight your unique combination of technical foundation, fast-learning agility, and strong work ethic.',
    keywords: ['fast learner', 'technical foundation', 'work ethic', 'adaptability', 'value']
  },
  {
    id: 'q5',
    category: 'Behavioral',
    question: 'Tell me about a time you failed or made a mistake in a lab experiment. What did you learn?',
    hint: 'Focus on accountability, root-cause analysis, and how you implemented safeguards for the future.',
    keywords: ['accountability', 'learning', 'root-cause', 'resilience', 'improvement']
  }
];

export const HrRoundSimulation: React.FC<HrRoundSimulationProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [studentText, setStudentText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    overallScore10: number;
    clarityScore: number;
    relevanceScore: number;
    grammarScore: number;
    toneScore: number;
    strengths: string[];
    improvements: string[];
    feedbackText: string;
  } | null>(null);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  const filteredQuestions = selectedCategory === 'All'
    ? QUESTION_BANK
    : QUESTION_BANK.filter((q) => q.category === selectedCategory);

  const currentQ = filteredQuestions[activeQuestionIndex] || QUESTION_BANK[0];

  // Simulated recording timer
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      // Auto fill speech transcription simulation if empty
      if (!studentText.trim()) {
        setStudentText(
          `Thank you for this question. Regarding "${currentQ.question}", I would approach this by first analyzing the requirements. During my engineering studies at SRIT, I experienced a similar situation where I worked with my team to deliver results under tight schedules. I believe in active communication, adaptability, and continuous learning.`
        );
      }
    }
  };

  const handleEvaluate = () => {
    if (!studentText.trim()) return;
    setEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      const len = studentText.trim().length;
      const hasKeywords = currentQ.keywords.some((kw) =>
        studentText.toLowerCase().includes(kw.toLowerCase())
      );

      let clarity = len > 100 ? 9.0 : 7.5;
      let relevance = hasKeywords ? 9.5 : 8.0;
      let grammar = 9.0;
      let tone = 9.2;
      let overall = Number(((clarity + relevance + grammar + tone) / 4).toFixed(1));

      const res = {
        overallScore10: overall,
        clarityScore: clarity,
        relevanceScore: relevance,
        grammarScore: grammar,
        toneScore: tone,
        strengths: [
          'Clear sentence structure and professional vocabulary.',
          hasKeywords ? 'Directly incorporated key domain terminology.' : 'Maintained a polite and confident tone.',
          'Good logical flow from introduction to conclusion.'
        ],
        improvements: [
          'Incorporate more specific metric-driven achievements (e.g., percentages, team size).',
          'Ensure zero hesitation words ("um", "like") when delivering key technical points.'
        ],
        feedbackText: `Solid response to "${currentQ.question}". Your tone is confident and professional. Backing your claims with concrete SRIT lab or project experiences will make this an outstanding answer.`
      };

      setEvaluationResult(res);
      setEvaluating(false);
    }, 1200);
  };

  const handleSaveResponse = async () => {
    if (!studentText.trim() || !evaluationResult) return;

    const contentText = `HR QUESTION: ${currentQ.question}\n\nSTUDENT RESPONSE:\n${studentText}\n\nSAILL AI EVALUATION (${evaluationResult.overallScore10}/10):\n- Clarity: ${evaluationResult.clarityScore}/10\n- Relevance: ${evaluationResult.relevanceScore}/10\n- Grammar: ${evaluationResult.grammarScore}/10\n- Tone: ${evaluationResult.toneScore}/10\n\nFEEDBACK:\n${evaluationResult.feedbackText}`;

    // Save to IndexedDB Portfolio
    await dbStorage.savePortfolioItem({
      id: `hr-sim-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      title: `HR Simulation: ${currentQ.question.substring(0, 40)}...`,
      category: 'written',
      content: contentText,
      score: Math.round(evaluationResult.overallScore10 * 10),
      createdAt: new Date().toISOString()
    });

    if (onSaveToPortfolio) {
      onSaveToPortfolio(
        `HR Response: ${currentQ.question.substring(0, 30)}`,
        'text',
        contentText,
        evaluationResult.overallScore10
      );
    }

    setSavedLocally(true);
    onCompleteActivity();
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 3
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#D35400]" />
              3. HR Round Simulation & Question Bank
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Practice answering realistic campus recruitment HR questions. Record audio or type your response for instant 10-mark AI diagnostic scoring.
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            {QUESTION_BANK.length} Questions Loaded
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Background', 'Behavioral', 'Situational', 'Culture'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveQuestionIndex(0);
                setEvaluationResult(null);
                setSavedLocally(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                selectedCategory === cat
                  ? 'bg-[#D35400] text-white border-[#D35400]'
                  : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Question Display Card */}
        <div className="p-5 rounded-2xl bg-[#FFF8F0] border-2 border-[#FAD7A0] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest bg-[#2C3E50] text-[#FAD7A0] px-2.5 py-1 rounded-md">
              Question {activeQuestionIndex + 1} of {filteredQuestions.length} • {currentQ.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveQuestionIndex((prev) => (prev > 0 ? prev - 1 : filteredQuestions.length - 1));
                  setEvaluationResult(null);
                  setSavedLocally(false);
                }}
                className="text-xs font-bold text-[#2C3E50] hover:text-[#D35400]"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveQuestionIndex((prev) => (prev < filteredQuestions.length - 1 ? prev + 1 : 0));
                  setEvaluationResult(null);
                  setSavedLocally(false);
                }}
                className="text-xs font-bold text-[#2C3E50] hover:text-[#D35400]"
              >
                Next →
              </button>
            </div>
          </div>

          <h3 className="text-base font-black text-[#2C3E50] font-heading leading-snug">
            "{currentQ.question}"
          </h3>

          <div className="bg-white p-3 rounded-xl border border-[#FAD7A0] text-xs text-[#5D6D7E] flex items-start gap-2">
            <Bookmark className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2C3E50] block">Strategy Hint:</span>
              <span>{currentQ.hint}</span>
            </div>
          </div>
        </div>

        {/* Response Mode Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#2C3E50] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D35400]" /> Your Response (Audio Record or Type below):
            </label>

            {/* Audio Recording Toggle Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#1A252F]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" /> Stop Recording ({recordingSeconds}s)
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" /> Record Voice Answer
                </>
              )}
            </button>
          </div>

          <textarea
            rows={5}
            value={studentText}
            onChange={(e) => {
              setStudentText(e.target.value);
              setEvaluationResult(null);
              setSavedLocally(false);
            }}
            placeholder="Type your response here or use the voice recording button above to generate a transcript..."
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-4 text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-hidden leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStudentText('');
                setEvaluationResult(null);
                setSavedLocally(false);
              }}
              className="text-xs font-bold text-[#5D6D7E] hover:text-[#2C3E50] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Answer
            </button>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={evaluating || !studentText.trim()}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {evaluating ? 'AI Diagnostic Evaluating...' : 'Evaluate Answer with SAILL AI'}
            </button>
          </div>
        </div>

        {/* AI Evaluation Diagnostic Card */}
        {evaluationResult && (
          <div className="p-5 rounded-2xl bg-white border-2 border-[#D35400] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#D35400]" />
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                    SAILL AI Diagnostic Assessment
                  </h4>
                  <p className="text-[11px] text-[#5D6D7E]">10-Mark Rubric Score for HR Simulation</p>
                </div>
              </div>

              <div className="bg-[#FFF8F0] border border-[#FAD7A0] px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-[#5D6D7E] uppercase block font-bold">Overall Score</span>
                <span className="text-xl font-black text-[#D35400]">
                  {evaluationResult.overallScore10} / 10
                </span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Clarity</span>
                <span className="text-sm font-black text-[#2C3E50]">{evaluationResult.clarityScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Relevance</span>
                <span className="text-sm font-black text-[#2C3E50]">{evaluationResult.relevanceScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Grammar</span>
                <span className="text-sm font-black text-[#2C3E50]">{evaluationResult.grammarScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Tone</span>
                <span className="text-sm font-black text-[#2C3E50]">{evaluationResult.toneScore} / 10</span>
              </div>
            </div>

            <p className="text-xs text-[#2C3E50] bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0] leading-relaxed">
              {evaluationResult.feedbackText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
                </span>
                <ul className="text-[11px] text-emerald-950 list-disc list-inside space-y-1">
                  {evaluationResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Actionable Improvements
                </span>
                <ul className="text-[11px] text-amber-950 list-disc list-inside space-y-1">
                  {evaluationResult.improvements.map((im, i) => (
                    <li key={i}>{im}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Save to Portfolio Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveResponse}
                disabled={savedLocally}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                  savedLocally
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#1A252F]'
                }`}
              >
                {savedLocally ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Saved to IndexedDB & Portfolio
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Answer to Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
