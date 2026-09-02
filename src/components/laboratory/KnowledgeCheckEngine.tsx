import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  Clock,
  Shuffle,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  ListFilter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModuleData } from '../../types';
import { QuestionBankItem, QuizAttemptRecord } from '../../types/knowledgeCheck';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage } from '../../lib/moduleStorage';
import { dbStorage } from '../../lib/db';
import { generateAdaptiveQuiz } from '../../services/aiQuestionGenerator';

interface KnowledgeCheckEngineProps {
  module: ModuleData;
  onQuizComplete?: (score: number) => void;
}

export const KnowledgeCheckEngine: React.FC<KnowledgeCheckEngineProps> = ({
  module,
  onQuizComplete
}) => {
  const config = getModuleConfig(module.id);
  const kcConfig = config.knowledgeCheck;

  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scorePercent, setScorePercent] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizInstanceId, setQuizInstanceId] = useState<string>('');
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(true);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  useEffect(() => {
    loadOrCreateQuiz();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [module.id]);

  const loadOrCreateQuiz = async () => {
    setIsLoadingQuiz(true);
    // Get previous attempts
    const previousAttempts = await dbStorage.getQuizAttempts('srit-2026-001', module.id);
    
    // Check if there is a saved completed quiz state in localStorage
    const saved = await moduleStorage.getKnowledgeCheck(module.id);
    if (saved && saved.userAnswers && saved.score !== undefined) {
      setScorePercent(saved.score);
      setCorrectCount(saved.correctAnswers || 0);
      setSelectedAnswers(saved.userAnswers || {});
      setIsSubmitted(true);
      
      // Load questions for review
      const quizData = await generateAdaptiveQuiz(module.id, 'srit-2026-001', previousAttempts);
      setQuestions(quizData.questions);
      setQuizInstanceId(quizData.quizInstanceId);
      setAttemptNumber(quizData.attemptNumber);
    } else {
      await createFreshAdaptiveQuiz(previousAttempts);
    }
    setIsLoadingQuiz(false);
  };

  const createFreshAdaptiveQuiz = async (previousAttemptsData?: QuizAttemptRecord[]) => {
    setIsLoadingQuiz(true);
    const attempts = previousAttemptsData || (await dbStorage.getQuizAttempts('srit-2026-001', module.id));
    const quizData = await generateAdaptiveQuiz(module.id, 'srit-2026-001', attempts);
    
    setQuestions(quizData.questions);
    setQuizInstanceId(quizData.quizInstanceId);
    setAttemptNumber(quizData.attemptNumber);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercent(0);
    setCorrectCount(0);
    setTimeTakenSeconds(0);

    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimeTakenSeconds((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);

    setIsLoadingQuiz(false);
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectAnswer = (ans: any) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (timerInterval) clearInterval(timerInterval);

    // 100% Deterministic evaluation - No AI grading
    let correct = 0;
    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined || userAns === null) return;

      if (String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        correct++;
      }
    });

    // Compute CO breakdown, difficulty breakdown, and missed topics
    const coScores: Record<string, { total: number; correct: number }> = {
      CO1: { total: 0, correct: 0 },
      CO2: { total: 0, correct: 0 },
      CO3: { total: 0, correct: 0 },
      CO4: { total: 0, correct: 0 },
      CO5: { total: 0, correct: 0 }
    };

    const difficultyScores: Record<string, { total: number; correct: number }> = {
      Easy: { total: 0, correct: 0 },
      Medium: { total: 0, correct: 0 },
      Hard: { total: 0, correct: 0 }
    };

    const missedTopicsSet = new Set<string>();

    questions.forEach((q) => {
      const coKey = q.courseOutcome || 'CO3';
      const diffKey = q.difficulty || 'Medium';

      if (!coScores[coKey]) coScores[coKey] = { total: 0, correct: 0 };
      if (!difficultyScores[diffKey]) difficultyScores[diffKey] = { total: 0, correct: 0 };

      coScores[coKey].total += 1;
      difficultyScores[diffKey].total += 1;

      const userAns = selectedAnswers[q.id];
      const isQCorrect = userAns !== undefined && userAns !== null &&
        String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

      if (isQCorrect) {
        coScores[coKey].correct += 1;
        difficultyScores[diffKey].correct += 1;
      } else {
        if (q.topic) missedTopicsSet.add(q.topic);
      }
    });

    const percent = Math.round((correct / (questions.length || 10)) * 100);
    const isPass = percent >= (kcConfig.passingScore || 75);

    setCorrectCount(correct);
    setScorePercent(percent);
    setIsSubmitted(true);

    const attemptRecord: QuizAttemptRecord = {
      quizInstanceId,
      moduleId: module.id,
      moduleTitle: config.title,
      studentId: 'srit-2026-001',
      studentName: 'R26 CSE Undergraduate',
      studentRollNo: '264G1A0501',
      attemptNumber,
      attemptedAt: new Date().toISOString(),
      score: percent,
      rawScore: correct,
      totalQuestions: questions.length,
      correctAnswers: correct,
      passed: isPass,
      timeTakenSeconds: timeTakenSeconds || 180,
      userAnswers: selectedAnswers,
      questionIds: questions.map((q) => q.id),
      questionsSnapshot: questions,
      coScores,
      difficultyScores,
      missedTopics: Array.from(missedTopicsSet)
    };

    // Save attempt to IndexedDB and localStorage
    await dbStorage.saveQuizAttempt(attemptRecord);
    await moduleStorage.saveKnowledgeCheck(module.id, {
      moduleId: module.id,
      score: percent,
      totalQuestions: questions.length,
      correctAnswers: correct,
      passed: isPass,
      attemptedAt: new Date().toISOString(),
      userAnswers: selectedAnswers
    });

    if (onQuizComplete) {
      onQuizComplete(percent);
    }

    if (isPass) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    }
  };

  // Check how many questions have been answered
  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[k] !== undefined && selectedAnswers[k] !== ''
  ).length;

  const allAnswered = answeredCount === questions.length && questions.length > 0;

  // Performance level computation
  const getPerformanceLevel = (pct: number) => {
    if (pct >= 90) return { label: 'Distinction (Mastery)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (pct >= 80) return { label: 'Proficient (Strong Fluency)', color: 'text-teal-700 bg-teal-100 border-teal-300' };
    if (pct >= 75) return { label: 'Passed (Academic Benchmark Attained)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    return { label: 'Needs Revision (Below 75% Threshold)', color: 'text-amber-700 bg-amber-100 border-amber-300' };
  };

  // Collect missed concepts
  const incorrectQuestions = questions.filter((q) => {
    const ans = selectedAnswers[q.id];
    if (ans === undefined) return true;
    return String(ans).trim().toLowerCase() !== String(q.correctAnswer).trim().toLowerCase();
  });

  const improvementAreas = Array.from(new Set(incorrectQuestions.map((q) => q.topic)));

  if (isLoadingQuiz) {
    return (
      <div className="srit-card p-12 bg-white border border-[#FAD7A0] text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-[#D35400]">
          Loading {config.title} Knowledge Check Assessment...
        </p>
      </div>
    );
  }

  // Filtered review questions
  const filteredReviewQuestions = questions.filter((q) => {
    const userAns = selectedAnswers[q.id];
    const isCorrect = userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    if (reviewFilter === 'correct') return isCorrect;
    if (reviewFilter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              Knowledge Check Assessment
            </span>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Attempt #{attemptNumber}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#D35400]" />
            <span>{kcConfig.title}</span>
          </h3>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Module: <span className="font-bold text-[#2C3E50]">{config.title}</span> • {questions.length} Standard 4-Option MCQs • Passing Score: {kcConfig.passingScore}%
          </p>
        </div>

        {isSubmitted && (
          <button
            onClick={() => createFreshAdaptiveQuiz()}
            className="px-3.5 py-2 bg-[#FFF8F0] hover:bg-[#FAD7A0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Retake Knowledge Check</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* POST-SUBMISSION RESULTS VIEW                                             */}
      {/* ========================================================================= */}
      {isSubmitted ? (
        <div className="space-y-6">
          {/* Main Results Banner */}
          <div className={`p-6 rounded-2xl border ${
            scorePercent >= kcConfig.passingScore ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50/80 border-amber-300'
          } space-y-5 shadow-xs`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`p-3.5 rounded-2xl ${scorePercent >= kcConfig.passingScore ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-black text-[#2C3E50]">
                      {scorePercent >= kcConfig.passingScore ? 'Assessment Completed & Passed!' : 'Assessment Completed — Review Required'}
                    </h4>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getPerformanceLevel(scorePercent).color}`}>
                      {getPerformanceLevel(scorePercent).label}
                    </span>
                  </div>
                  <p className="text-xs text-[#5D6D7E] mt-1">
                    Final Score: <span className="font-bold text-[#2C3E50]">{correctCount} / {questions.length}</span> ({scorePercent}%) • Completed in {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white/90 px-4 py-2.5 rounded-xl border border-gray-200">
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className={`text-3xl font-black ${scorePercent >= kcConfig.passingScore ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {correctCount}
                  </span>
                  <span className="text-lg font-bold text-gray-400">/{questions.length}</span>
                  <span className={`text-xl font-black ml-1.5 ${scorePercent >= kcConfig.passingScore ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ({scorePercent}%)
                  </span>
                </div>
                <span className={`block text-[10px] font-black uppercase tracking-wider ${
                  scorePercent >= kcConfig.passingScore ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {scorePercent >= kcConfig.passingScore ? 'Activity 6 Marked Completed' : 'Passing Threshold: 75%'}
                </span>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Correct Answers</span>
                <span className="text-base font-black text-emerald-600">{correctCount} / {questions.length}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Incorrect Answers</span>
                <span className="text-base font-black text-rose-600">{questions.length - correctCount} / {questions.length}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Time Elapsed</span>
                <span className="text-base font-black text-purple-600">{Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Attempt Record</span>
                <span className="text-base font-black text-blue-600">Attempt #{attemptNumber}</span>
              </div>
            </div>

            {/* Areas for Improvement */}
            {improvementAreas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Areas for Focused Review</span>
                  </div>
                  <ul className="space-y-0.5 text-xs text-amber-900 list-disc pl-5 font-medium">
                    {improvementAreas.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Recommended Guided Practice Studio</span>
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Review the PREP Impromptu drills and speaking rate exercises in <span className="font-bold">{config.title}</span> Guided Practice Studio to reinforce key techniques.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Question-by-Question Review Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
              <div>
                <h4 className="text-base font-bold text-[#2C3E50] flex items-center gap-2 font-heading">
                  <ListFilter className="w-4 h-4 text-[#D35400]" />
                  <span>Comprehensive Question Review ({questions.length} Questions)</span>
                </h4>
                <p className="text-xs text-[#5D6D7E]">
                  Detailed audit showing your selected answers, official answer keys, and pedagogical explanations.
                </p>
              </div>

              {/* Review Filters */}
              <div className="flex items-center gap-1.5 bg-[#FFF8F0] p-1 rounded-xl border border-[#FAD7A0] text-xs">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    reviewFilter === 'all' ? 'bg-[#D35400] text-white shadow-2xs' : 'text-[#2C3E50] hover:text-[#D35400]'
                  }`}
                >
                  All ({questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-[#2C3E50] hover:text-emerald-700'
                  }`}
                >
                  Correct ({correctCount})
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    reviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-2xs' : 'text-[#2C3E50] hover:text-rose-700'
                  }`}
                >
                  Incorrect ({questions.length - correctCount})
                </button>
              </div>
            </div>

            {/* List of Questions in Review Mode */}
            <div className="space-y-4">
              {filteredReviewQuestions.map((q, qIndex) => {
                const originalIndex = questions.findIndex((item) => item.id === q.id);
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    } space-y-3.5`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                            Q{originalIndex + 1}: {q.topic}
                          </span>
                          <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-bold text-[#D35400] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {q.courseOutcome}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-[#2C3E50] leading-snug mt-1">{q.prompt}</h5>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Correct (+1)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black rounded-lg">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Incorrect (0)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4 Options Display */}
                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isStudentChoice = userAns === opt;
                        const isTheCorrectAnswer = String(opt).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

                        let rowStyle = 'bg-white/80 border-gray-200 text-gray-500 opacity-70';
                        let badgeStyle = 'bg-gray-100 text-gray-500';

                        if (isTheCorrectAnswer) {
                          rowStyle = 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold shadow-xs';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else if (isStudentChoice && !isTheCorrectAnswer) {
                          rowStyle = 'bg-rose-100/90 border-rose-400 text-rose-950 font-semibold';
                          badgeStyle = 'bg-rose-600 text-white';
                        }

                        return (
                          <div
                            key={opt}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${rowStyle}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${badgeStyle}`}>
                                {letter}
                              </span>
                              <span className="leading-relaxed">{opt}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold">
                              {isTheCorrectAnswer && (
                                <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  Correct Answer
                                </span>
                              )}
                              {isStudentChoice && !isTheCorrectAnswer && (
                                <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Your Choice
                                </span>
                              )}
                              {isStudentChoice && isTheCorrectAnswer && (
                                <span className="inline-flex items-center gap-1 text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-400">
                                  ★ Your Choice
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation Box */}
                    <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[#D35400] font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Pedagogical Explanation:</span>
                      </div>
                      <p className="text-[#2C3E50] leading-relaxed pl-5 font-medium">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* ACTIVE TEST-TAKING VIEW (NO ANSWERS REVEALED BEFORE SUBMISSION)          */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Status & Progress Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0] text-xs gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-[#D35400]">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                {currentQ?.difficulty} Level
              </span>
              <span className="text-[10px] font-extrabold text-[#D35400] bg-[#FAD7A0]/40 px-2 py-0.5 rounded">
                {currentQ?.courseOutcome}
              </span>
              <span className="text-[10px] text-gray-600 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                Answered: {answeredCount}/{questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-gray-500 text-[11px] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D35400]" />
                {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
              </span>
              <div className="w-28 sm:w-36 bg-white h-2 rounded-full border border-[#FAD7A0] overflow-hidden">
                <div
                  className="bg-[#D35400] h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Question Container */}
          {currentQ && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#E67E22] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                    Question {currentIdx + 1}: {currentQ.topic}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#2C3E50] leading-snug pt-1">
                  {currentQ.prompt}
                </h4>
              </div>

              {currentQ.passage && (
                <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] italic space-y-1 my-2">
                  <span className="font-bold not-italic text-[#D35400] text-[10px] uppercase block">Passage Context:</span>
                  <p>{currentQ.passage}</p>
                </div>
              )}

              {/* 4-Option MCQ Buttons (Neutral Selected State - NO Green/Red Feedback) */}
              {currentQ.options && (
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#D35400] text-[#2C3E50] font-bold ring-2 ring-[#D35400]/30 shadow-xs'
                            : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400] hover:bg-orange-50/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#D35400] text-white shadow-2xs'
                                : 'bg-orange-100 text-[#D35400]'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        {isSelected && (
                          <span className="text-[11px] font-bold text-[#D35400] shrink-0 ml-2 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Navigation & Submission Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#FAD7A0]">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="w-full sm:w-auto px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] disabled:opacity-40 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Question Quick Jump Pills */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto max-w-full py-1">
              {questions.map((q, idx) => {
                const isAns = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== '';
                const isCur = currentIdx === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition flex items-center justify-center cursor-pointer border ${
                      isCur
                        ? 'bg-[#D35400] text-white border-[#D35400] ring-2 ring-[#D35400]/40 font-black'
                        : isAns
                        ? 'bg-[#FFF8F0] text-[#D35400] border-[#FAD7A0]'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                    }`}
                    title={`Question ${idx + 1} (${isAns ? 'Answered' : 'Unanswered'})`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Next / Submit Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {currentIdx < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Submit Knowledge Check Button */}
              {allAnswered ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Knowledge Check (10/10)</span>
                </button>
              ) : currentIdx === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Knowledge Check ({answeredCount}/{questions.length})</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
