import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Globe,
  Lock,
  Unlock,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sparkles,
  BookOpen,
  Award,
  BarChart2,
  Brain,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  GraduationCap,
  MessageSquare,
  Briefcase,
  UserCheck,
  Check,
  Zap,
  Bookmark,
  Share2,
  ShieldAlert,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  LISTENING_LEVELS,
  LISTENING_PASSAGES,
  ListeningPassage,
  ListeningLevelId,
  ListeningVocabularyWord,
  SUSTAINABLE_ENGINEERING_PASSAGE
} from '../../data/listeningPassages';
import { evaluateListeningNotes, evaluateListeningSummary, AISummaryEvaluation } from '../../services/ai/listeningCoach';
import { dbStorage } from '../../lib/db';
import { PortfolioItem, LabExperimentRecord, AICoachEvaluation } from '../../types';
import { QuizAttemptRecord } from '../../types/knowledgeCheck';
import confetti from 'canvas-confetti';
import { formatScore10, getPerformanceDescriptor, normalizeTo10Scale } from '../../lib/scoring';

interface ListeningLabStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}

const STORAGE_KEY_COMPLETED_SECTIONS = 'saill_m2_completed_sections';
const STORAGE_KEY_COMPLETED_LEVELS = 'saill_m2_completed_levels';
const STORAGE_KEY_LEVEL_SCORES = 'saill_m2_level_scores';

export const ListeningLabStudio: React.FC<ListeningLabStudioProps> = ({
  moduleId = 'listening',
  moduleTitle = 'Listening Comprehension & Note-Taking',
  onSaveWorkToPortfolio
}) => {
  // 1. Navigation & Level State
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [selectedLevelId, setSelectedLevelId] = useState<ListeningLevelId>('level-1');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('pass-level-1');

  // Completion Tracking State
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [completedLevels, setCompletedLevels] = useState<Record<string, boolean>>({});
  const [levelQuizAnswers, setLevelQuizAnswers] = useState<Record<string, Record<number, number>>>({});
  const [levelQuizSubmitted, setLevelQuizSubmitted] = useState<Record<string, boolean>>({});
  const [levelQuizScores, setLevelQuizScores] = useState<Record<string, { correctCount: number; total: number; score10: number }>>({});

  // 2. Global Accent Preference (US / UK)
  const [globalAccent, setGlobalAccent] = useState<'en-US' | 'en-GB'>('en-US');

  // 3. Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [totalDurationSec, setTotalDurationSec] = useState<number>(100);
  const [replayCount, setReplayCount] = useState<number>(0);
  const speechIntervalRef = useRef<any>(null);
  const studioSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = () => {
    setTimeout(() => {
      if (studioSectionRef.current) {
        studioSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // 4. Readiness Check State
  const [readinessCheck, setReadinessCheck] = useState<{
    audioChecked: boolean;
    quietEnvironment: boolean;
    notebookReady: boolean;
  }>({
    audioChecked: false,
    quietEnvironment: false,
    notebookReady: false
  });

  // 5. Structured Note-taking State (7 Fields)
  const [notes, setNotes] = useState<{
    title: string;
    mainIdea: string;
    keyPoints: string[];
    importantFacts: string[];
    numbersAndDates: string[];
    newVocabulary: string[];
    personalReflection: string;
  }>({
    title: '',
    mainIdea: '',
    keyPoints: [''],
    importantFacts: [''],
    numbersAndDates: [''],
    newVocabulary: [''],
    personalReflection: ''
  });
  const [aiNoteEval, setAiNoteEval] = useState<AICoachEvaluation | null>(null);
  const [isEvaluatingNotes, setIsEvaluatingNotes] = useState<boolean>(false);
  const [notesSaveMsg, setNotesSaveMsg] = useState<string | null>(null);

  // 6. Sustainable Engineering Listening Comprehension State
  const [compAudioPlaying, setCompAudioPlaying] = useState<boolean>(false);
  const [compAudioSpeed, setCompAudioSpeed] = useState<number>(1.0);
  const [compAudioAccent, setCompAudioAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [compMcqAnswers, setCompMcqAnswers] = useState<Record<number, number>>({});
  const [compMcqSubmitted, setCompMcqSubmitted] = useState<boolean>(false);
  const [compMcqScore, setCompMcqScore] = useState<{ correctCount: number; percentage: number; score10: number } | null>(null);

  // 7. Sustainable Engineering Vocabulary Practice State
  const [vocabAnswers, setVocabAnswers] = useState<Record<number, number>>({});
  const [vocabSubmitted, setVocabSubmitted] = useState<boolean>(false);
  const [vocabScore, setVocabScore] = useState<{ correctCount: number; percentage: number; score10: number } | null>(null);

  // Navigation warning state
  const [navWarningMsg, setNavWarningMsg] = useState<string | null>(null);

  // Legacy state preservation
  const [isTranscriptUnlocked, setIsTranscriptUnlocked] = useState<Record<string, boolean>>({});
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>(['', '']);
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [shortAnswerText, setShortAnswerText] = useState<string>('');
  const [activityScore, setActivityScore] = useState<number | null>(null);
  const [activityFeedback, setActivityFeedback] = useState<string | null>(null);

  // 7. AI Summary Builder State
  const [summaryText, setSummaryText] = useState<string>('');
  const [aiSummaryEval, setAiSummaryEval] = useState<AISummaryEvaluation | null>(null);
  const [isEvaluatingSummary, setIsEvaluatingSummary] = useState<boolean>(false);

  // 8. Vocabulary Discovery & Saved Words State
  const [savedVocabulary, setSavedVocabulary] = useState<ListeningVocabularyWord[]>([]);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // 9. Reflection State
  const [reflectionText, setReflectionText] = useState<string>('');
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  // 10. Lab Notebook & Portfolio Save State
  const [isPortfolioSaved, setIsPortfolioSaved] = useState<boolean>(false);
  const [isNotebookSaved, setIsNotebookSaved] = useState<boolean>(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedSecs = localStorage.getItem(STORAGE_KEY_COMPLETED_SECTIONS);
      if (savedSecs) setCompletedSections(JSON.parse(savedSecs));

      const savedLvls = localStorage.getItem(STORAGE_KEY_COMPLETED_LEVELS);
      if (savedLvls) setCompletedLevels(JSON.parse(savedLvls));

      const savedScores = localStorage.getItem(STORAGE_KEY_LEVEL_SCORES);
      if (savedScores) setLevelQuizScores(JSON.parse(savedScores));

      const savedCompScore = localStorage.getItem('saill_m2_comp_score');
      if (savedCompScore) {
        setCompMcqScore(JSON.parse(savedCompScore));
        setCompMcqSubmitted(true);
      }
      const savedCompAnswers = localStorage.getItem('saill_m2_comp_answers');
      if (savedCompAnswers) {
        setCompMcqAnswers(JSON.parse(savedCompAnswers));
      }

      const savedVocabScore = localStorage.getItem('saill_m2_vocab_score');
      if (savedVocabScore) {
        setVocabScore(JSON.parse(savedVocabScore));
        setVocabSubmitted(true);
      }
      const savedVocabAnswers = localStorage.getItem('saill_m2_vocab_answers');
      if (savedVocabAnswers) {
        setVocabAnswers(JSON.parse(savedVocabAnswers));
      }
    } catch (err) {
      console.error('Failed to load persistence from localStorage:', err);
    }
  }, []);

  // Section Sequence Definition
  const sectionSequence = [
    { id: 'introduction', label: '1. Introduction', title: 'Introduction to Active Listening' },
    { id: 'readiness', label: '2. Readiness Check', title: 'Readiness & Diagnostic Check' },
    { id: 'levels', label: '3. Listening Levels & Passages', title: 'Listening Levels & Passage Selection' },
    { id: 'player', label: '4. Audio Player', title: 'Interactive Audio Player' },
    { id: 'notes', label: '5. AI Note Workspace', title: 'Structured 7-Part Note-Taking' },
    { id: 'activities', label: '6. Comprehension Activities', title: 'Listening Comprehension Activities' },
    { id: 'vocabulary', label: '7. Vocabulary Discovery', title: 'Vocabulary Discovery & Pronunciation Bank' },
    { id: 'analytics', label: '8. Analytics Dashboard', title: 'Listening Analytics Dashboard' },
    { id: 'reflection', label: '9. Metacognitive Reflection', title: 'Metacognitive Reflection' },
    { id: 'notebook', label: '10. Lab Notebook', title: 'Automatic Laboratory Notebook' },
    { id: 'portfolio', label: '11. Portfolio Update', title: 'Portfolio Persistence (IndexedDB)' }
  ];

  // Get Current Passage
  const currentPassage: ListeningPassage =
    LISTENING_PASSAGES.find((p) => p.id === selectedPassageId) || LISTENING_PASSAGES[0];

  // When level changes, auto switch passage
  useEffect(() => {
    const matchedPassage = LISTENING_PASSAGES.find((p) => p.levelId === selectedLevelId) || LISTENING_PASSAGES[0];
    setSelectedPassageId(matchedPassage.id);
  }, [selectedLevelId]);

  // Initialize or change passage notes and audio duration
  useEffect(() => {
    const pass = LISTENING_PASSAGES.find((p) => p.id === selectedPassageId) || LISTENING_PASSAGES[0];
    const durSec = parseDurationToSeconds(pass.estimatedDuration);
    setTotalDurationSec(durSec);
    setCurrentTimeSec(0);
    setSequenceOrder([...pass.activities.sequence.correctSequence].sort(() => Math.random() - 0.5));

    // Load saved notes for this passage from localStorage if present
    try {
      const savedNoteStr = localStorage.getItem(`saill_m2_notes_${pass.id}`);
      if (savedNoteStr) {
        const parsed = JSON.parse(savedNoteStr);
        setNotes(parsed);
      } else {
        setNotes({
          title: pass.title,
          mainIdea: '',
          keyPoints: [''],
          importantFacts: [''],
          numbersAndDates: [''],
          newVocabulary: [''],
          personalReflection: ''
        });
      }
    } catch (err) {
      setNotes({
        title: pass.title,
        mainIdea: '',
        keyPoints: [''],
        importantFacts: [''],
        numbersAndDates: [''],
        newVocabulary: [''],
        personalReflection: ''
      });
    }
    setAiNoteEval(null);
  }, [selectedPassageId]);

  // Save Notes to localStorage & update completion
  const handleSaveNotes = () => {
    if (!selectedPassageId) return;
    try {
      localStorage.setItem(`saill_m2_notes_${selectedPassageId}`, JSON.stringify(notes));
      setNotesSaveMsg('Notes saved successfully!');
      setTimeout(() => setNotesSaveMsg(null), 3500);

      // Auto mark section 5 as completed if student filled at least main idea or key point
      if (notes.mainIdea.trim() || notes.keyPoints.some((k) => k.trim())) {
        if (!completedSections['notes']) {
          handleToggleMarkSectionCompleted('notes');
        }
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  };

  // Reset/Clear Notes
  const handleClearNotes = () => {
    if (window.confirm('Are you sure you want to clear your current notes for this passage?')) {
      const resetNotes = {
        title: currentPassage ? currentPassage.title : '',
        mainIdea: '',
        keyPoints: [''],
        importantFacts: [''],
        numbersAndDates: [''],
        newVocabulary: [''],
        personalReflection: ''
      };
      setNotes(resetNotes);
      try {
        localStorage.removeItem(`saill_m2_notes_${selectedPassageId}`);
      } catch (err) {}
      setNotesSaveMsg('Notes reset to blank.');
      setTimeout(() => setNotesSaveMsg(null), 3500);
    }
  };

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
      }
    };
  }, []);

  // Section Navigation Handler
  const handleNavigateToSection = (targetId: string) => {
    setActiveSection(targetId);
    scrollToSection();
  };

  // Toggle Section Completion
  const handleToggleMarkSectionCompleted = (sectionId: string) => {
    const updated = { ...completedSections, [sectionId]: !completedSections[sectionId] };
    setCompletedSections(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED_SECTIONS, JSON.stringify(updated));
      const completedCount = Object.values(updated).filter(Boolean).length;
      const percent = Math.min(100, Math.round((completedCount / sectionSequence.length) * 100));
      
      dbStorage.saveModuleProgress({
        moduleId: 'listening',
        status: completedCount === sectionSequence.length ? 'completed' : 'in_progress',
        completedTabs: [],
        reflectionNotes: '',
        savedNotes: JSON.stringify(updated),
        score: percent,
        lastAccessed: new Date().toISOString()
      }).catch(() => {});
    } catch (err) {
      console.error('Error persisting section completion:', err);
    }
  };

  // Mark Level Completed
  const handleMarkLevelCompleted = (levelId: ListeningLevelId) => {
    const updated = { ...completedLevels, [levelId]: true };
    setCompletedLevels(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED_LEVELS, JSON.stringify(updated));
      if (Object.keys(updated).length >= 5) {
        handleToggleMarkSectionCompleted('levels');
      }
    } catch (err) {
      console.error('Error persisting level completion:', err);
    }
  };

  // Audio Duration Converter (e.g. "01:40" -> 100 seconds)
  function parseDurationToSeconds(durStr: string): number {
    const parts = durStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 100;
  }

  // Audio Speech Synthesis Engine
  const handleTogglePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser environment.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = globalAccent === 'en-GB' ? currentPassage.transcriptUK : currentPassage.transcriptUS;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = globalAccent;
      utterance.rate = playbackSpeed;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTimeSec(totalDurationSec);
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setReplayCount((prev) => prev + 1);

      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      const stepMs = 1000 / playbackSpeed;
      speechIntervalRef.current = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) {
            clearInterval(speechIntervalRef.current);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, stepMs);
    }
  };

  const handleReplay10s = () => {
    setCurrentTimeSec((prev) => Math.max(0, prev - 10));
    setReplayCount((prev) => prev + 1);
  };

  // Note Field Adders & Removers
  const handleAddNoteItem = (field: 'keyPoints' | 'importantFacts' | 'numbersAndDates' | 'newVocabulary') => {
    setNotes((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveNoteItem = (field: 'keyPoints' | 'importantFacts' | 'numbersAndDates' | 'newVocabulary', index: number) => {
    setNotes((prev) => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== index) }));
  };

  const handleNoteItemChange = (field: 'keyPoints' | 'importantFacts' | 'numbersAndDates' | 'newVocabulary', index: number, val: string) => {
    setNotes((prev) => {
      const copy = [...prev[field]];
      copy[index] = val;
      return { ...prev, [field]: copy };
    });
  };

  // AI Note Evaluation
  const handleEvaluateNotes = async () => {
    setIsEvaluatingNotes(true);
    try {
      const evalResult = await evaluateListeningNotes(
        {
          title: notes.title || currentPassage.title,
          mainIdea: notes.mainIdea,
          keyPoints: notes.keyPoints,
          importantFacts: notes.importantFacts,
          numbersAndDates: notes.numbersAndDates,
          newVocabulary: notes.newVocabulary,
          personalReflection: notes.personalReflection
        },
        currentPassage.title
      );
      setAiNoteEval(evalResult);
      if (evalResult.score >= 7) {
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('AI Note Evaluation Error:', err);
    } finally {
      setIsEvaluatingNotes(false);
    }
  };

  // Evaluate Level Quiz (5 MCQs)
  const handleAnswerLevelMcq = (levelId: string, qIdx: number, optionIdx: number) => {
    setLevelQuizAnswers((prev) => ({
      ...prev,
      [levelId]: {
        ...(prev[levelId] || {}),
        [qIdx]: optionIdx
      }
    }));
  };

  const handleSubmitLevelQuiz = (levelId: ListeningLevelId) => {
    const passage = LISTENING_PASSAGES.find((p) => p.levelId === levelId) || currentPassage;
    const mcqs = passage.activities.mcqs || [passage.activities.mcq];
    const userAnswers = levelQuizAnswers[levelId] || {};

    if (Object.keys(userAnswers).length < mcqs.length) {
      alert(`Please answer all ${mcqs.length} multiple-choice questions before submitting.`);
      return;
    }

    let correctCount = 0;
    mcqs.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const total = mcqs.length;
    const score10 = Math.round((correctCount / total) * 10);

    setLevelQuizSubmitted((prev) => ({ ...prev, [levelId]: true }));
    setLevelQuizScores((prev) => {
      const newScores = { ...prev, [levelId]: { correctCount, total, score10 } };
      try {
        localStorage.setItem(STORAGE_KEY_LEVEL_SCORES, JSON.stringify(newScores));
      } catch (e) {}
      return newScores;
    });

    // Save quiz attempt
    const attemptRecord: QuizAttemptRecord = {
      quizInstanceId: `quiz-listening-${levelId}-${Date.now()}`,
      studentId: 'STUDENT_LOCAL',
      moduleId: 'listening',
      moduleTitle: `Listening Comprehension - ${passage.levelTitle}`,
      questionIds: mcqs.map((q, idx) => `q-${idx}`),
      questionsSnapshot: [],
      userAnswers,
      score: Math.round((correctCount / total) * 100),
      rawScore: score10,
      totalQuestions: total,
      correctAnswers: correctCount,
      timeTakenSeconds: 120,
      attemptNumber: 1,
      attemptedAt: new Date().toISOString(),
      passed: score10 >= 6,
      coScores: {},
      difficultyScores: {},
      missedTopics: []
    };

    dbStorage.saveQuizAttempt(attemptRecord).catch(() => {});

    if (score10 >= 7) {
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const handleRetryLevelQuiz = (levelId: string) => {
    setLevelQuizSubmitted((prev) => ({ ...prev, [levelId]: false }));
    setLevelQuizAnswers((prev) => ({ ...prev, [levelId]: {} }));
  };

  // Section 6: Sustainable Engineering Audio Player Handlers
  const handleToggleCompAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser environment.');
      return;
    }

    if (compAudioPlaying) {
      window.speechSynthesis.cancel();
      setCompAudioPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = compAudioAccent === 'en-GB'
        ? SUSTAINABLE_ENGINEERING_PASSAGE.transcriptUK
        : SUSTAINABLE_ENGINEERING_PASSAGE.transcriptUS;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = compAudioAccent;
      utterance.rate = compAudioSpeed;

      utterance.onend = () => setCompAudioPlaying(false);
      utterance.onerror = () => setCompAudioPlaying(false);

      window.speechSynthesis.speak(utterance);
      setCompAudioPlaying(true);
    }
  };

  const handleRewindCompAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCompAudioPlaying(false);
    }
  };

  // Section 6: Comprehension Quiz Submission
  const handleSubmitComprehension = () => {
    if (Object.keys(compMcqAnswers).length < 5) {
      alert('Please answer all 5 listening comprehension questions before submitting.');
      return;
    }

    let correct = 0;
    SUSTAINABLE_ENGINEERING_PASSAGE.mcqs.forEach((q, idx) => {
      if (compMcqAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percentage = Math.round((correct / 5) * 100);
    const score10 = Math.round((correct / 5) * 10);
    const scoreObj = { correctCount: correct, percentage, score10 };

    setCompMcqScore(scoreObj);
    setCompMcqSubmitted(true);

    try {
      localStorage.setItem('saill_m2_comp_score', JSON.stringify(scoreObj));
      localStorage.setItem('saill_m2_comp_answers', JSON.stringify(compMcqAnswers));

      dbStorage.saveQuizAttempt({
        quizInstanceId: `comp-m2-${Date.now()}`,
        studentId: localStorage.getItem('saill_active_roll_no') || 'STUDENT',
        studentRollNo: localStorage.getItem('saill_active_roll_no') || 'STUDENT',
        studentName: 'Student User',
        moduleId: 'listening-comprehension',
        moduleTitle: 'Listening Comprehension: Technology and Sustainable Engineering',
        questionIds: SUSTAINABLE_ENGINEERING_PASSAGE.mcqs.map((q) => q.id),
        questionsSnapshot: [],
        userAnswers: compMcqAnswers,
        score: percentage,
        rawScore: score10,
        totalQuestions: 5,
        correctAnswers: correct,
        timeTakenSeconds: 120,
        attemptNumber: 1,
        attemptedAt: new Date().toISOString(),
        passed: percentage >= 60,
        coScores: { CO2: { total: 5, correct } },
        difficultyScores: { Medium: { total: 5, correct } },
        missedTopics: []
      }).catch(() => {});
    } catch (err) {
      console.error('Error saving comprehension score:', err);
    }

    if (correct >= 4) {
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const handleRetryComprehension = () => {
    setCompMcqSubmitted(false);
    setCompMcqAnswers({});
  };

  // Section 7: Vocabulary Practice Submission
  const handleSubmitVocabPractice = () => {
    if (Object.keys(vocabAnswers).length < 5) {
      alert('Please answer all 5 vocabulary practice questions before submitting.');
      return;
    }

    let correct = 0;
    SUSTAINABLE_ENGINEERING_PASSAGE.vocabularyPractice.forEach((q, idx) => {
      if (vocabAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percentage = Math.round((correct / 5) * 100);
    const score10 = Math.round((correct / 5) * 10);
    const scoreObj = { correctCount: correct, percentage, score10 };

    setVocabScore(scoreObj);
    setVocabSubmitted(true);

    try {
      localStorage.setItem('saill_m2_vocab_score', JSON.stringify(scoreObj));
      localStorage.setItem('saill_m2_vocab_answers', JSON.stringify(vocabAnswers));

      dbStorage.saveQuizAttempt({
        quizInstanceId: `vocab-m2-${Date.now()}`,
        studentId: localStorage.getItem('saill_active_roll_no') || 'STUDENT',
        studentRollNo: localStorage.getItem('saill_active_roll_no') || 'STUDENT',
        studentName: 'Student User',
        moduleId: 'listening-vocabulary',
        moduleTitle: 'Vocabulary Discovery: Technology and Sustainable Engineering',
        questionIds: SUSTAINABLE_ENGINEERING_PASSAGE.vocabularyPractice.map((q) => q.id),
        questionsSnapshot: [],
        userAnswers: vocabAnswers,
        score: percentage,
        rawScore: score10,
        totalQuestions: 5,
        correctAnswers: correct,
        timeTakenSeconds: 120,
        attemptNumber: 1,
        attemptedAt: new Date().toISOString(),
        passed: percentage >= 60,
        coScores: { CO2: { total: 5, correct } },
        difficultyScores: { Medium: { total: 5, correct } },
        missedTopics: []
      }).catch(() => {});
    } catch (err) {
      console.error('Error saving vocabulary score:', err);
    }

    if (correct >= 4) {
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const handleRetryVocabPractice = () => {
    setVocabSubmitted(false);
    setVocabAnswers({});
  };

  // Evaluate All Activities (Section 6)
  const handleEvaluateActivities = () => {
    let earnedPoints = 0;
    let totalPoints = 6;
    const feedbackList: string[] = [];

    // 1. MCQ
    if (mcqAnswer === currentPassage.activities.mcq.correctIndex) {
      earnedPoints += 1;
      feedbackList.push('✓ MCQ: Correct choice!');
    } else {
      feedbackList.push(`✗ MCQ: Incorrect. ${currentPassage.activities.mcq.explanation}`);
    }

    // 2. True/False
    if (trueFalseAnswer === currentPassage.activities.trueFalse.isTrue) {
      earnedPoints += 1;
      feedbackList.push('✓ True/False: Correct!');
    } else {
      feedbackList.push(`✗ True/False: Incorrect. ${currentPassage.activities.trueFalse.explanation}`);
    }

    // 3. Fill in Blanks
    const b1 = (fillBlankAnswers[0] || '').trim().toLowerCase();
    const b2 = (fillBlankAnswers[1] || '').trim().toLowerCase();
    const ans1 = currentPassage.activities.fillInBlanks.answers[0].toLowerCase();
    const ans2 = currentPassage.activities.fillInBlanks.answers[1].toLowerCase();

    if (b1.includes(ans1) && b2.includes(ans2)) {
      earnedPoints += 1;
      feedbackList.push('✓ Fill-in-Blanks: Both terms matched!');
    } else {
      feedbackList.push(`✗ Fill-in-Blanks: Expected "${currentPassage.activities.fillInBlanks.answers.join(', ')}".`);
    }

    // 4. Sequence
    const isSeqCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(currentPassage.activities.sequence.correctSequence);
    if (isSeqCorrect) {
      earnedPoints += 1;
      feedbackList.push('✓ Event Sequence: Perfect chronological order!');
    } else {
      feedbackList.push('✗ Event Sequence: Order needs refinement.');
    }

    // 5. Matching
    let matchCorrectCount = 0;
    currentPassage.activities.matching.pairs.forEach((p) => {
      if (matchAnswers[p.id] === p.definition) matchCorrectCount++;
    });
    if (matchCorrectCount === currentPassage.activities.matching.pairs.length) {
      earnedPoints += 1;
      feedbackList.push('✓ Matching: All terms matched correctly!');
    } else {
      feedbackList.push(`✗ Matching: ${matchCorrectCount}/${currentPassage.activities.matching.pairs.length} pairs matched.`);
    }

    // 6. Short Answer
    if (shortAnswerText.trim().length > 10) {
      earnedPoints += 1;
      feedbackList.push('✓ Short Answer: Thorough explanation provided.');
    } else {
      feedbackList.push('✗ Short Answer: Response is too brief.');
    }

    const calculatedScore10 = Math.round((earnedPoints / totalPoints) * 10);
    setActivityScore(calculatedScore10);
    setActivityFeedback(feedbackList.join(' '));

    // Unlock Transcript
    setIsTranscriptUnlocked((prev) => ({ ...prev, [selectedPassageId]: true }));
    if (calculatedScore10 >= 7) confetti({ particleCount: 50, spread: 60 });
  };

  // Move Sequence Item
  const handleMoveSequenceItem = (idx: number, dir: 'up' | 'down') => {
    const copy = [...sequenceOrder];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < copy.length) {
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      setSequenceOrder(copy);
    }
  };

  // AI Summary Builder
  const handleEvaluateSummary = async () => {
    if (!summaryText || summaryText.trim().length < 15) {
      alert('Please enter a summary of at least 3-5 sentences before evaluating.');
      return;
    }
    setIsEvaluatingSummary(true);
    try {
      const summaryEval = await evaluateListeningSummary(currentPassage.title, summaryText);
      setAiSummaryEval(summaryEval);
      if (summaryEval.score >= 7) confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error('AI Summary Evaluation Error:', err);
    } finally {
      setIsEvaluatingSummary(false);
    }
  };

  // Save Word to Bank
  const handleSaveWordToBank = (wordItem: ListeningVocabularyWord) => {
    if (!savedVocabulary.some((w) => w.id === wordItem.id)) {
      setSavedVocabulary((prev) => [...prev, wordItem]);
      setSavedSuccessMsg(`"${wordItem.word}" saved to your Vocabulary Bank!`);
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  // Play Single Word TTS Audio
  const playSingleWordAudio = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = globalAccent;
    window.speechSynthesis.speak(utterance);
  };

  // Save Lab Notebook Entry
  const handleSaveNotebookEntry = async () => {
    try {
      await dbStorage.saveLabNote({
        id: `note-m2-${Date.now()}`,
        moduleId,
        moduleTitle,
        aim: `Listening Comprehension & Active Note-Taking on "${currentPassage.title}"`,
        procedure: `Listened to ${currentPassage.estimatedDuration} spoken engineering audio (${globalAccent === 'en-GB' ? 'British Accent' : 'American Accent'}), compiled 7-part notes, completed comprehension activities, and generated AI summary.`,
        observations: `Note Score: ${aiNoteEval ? aiNoteEval.score : 8}/10. Comprehension Score: ${activityScore !== null ? activityScore : 8}/10. Summary Score: ${aiSummaryEval ? aiSummaryEval.score : 8}/10. Saved ${savedVocabulary.length} vocabulary terms.`,
        date: new Date().toLocaleDateString()
      });
      setIsNotebookSaved(true);
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => setIsNotebookSaved(false), 4000);
    } catch (err) {
      console.error('Error saving lab notebook entry:', err);
    }
  };

  // Save Portfolio Item
  const handleSaveToPortfolio = async () => {
    try {
      const portfolioContent = `
SAILL Module 2 Listening Comprehension Artifact
------------------------------------------------
Passage Title: ${currentPassage.title}
Level: ${currentPassage.levelTitle} (${currentPassage.topic})
Accent: ${globalAccent === 'en-GB' ? 'British English' : 'American English'}

Notes Summary:
- Main Idea: ${notes.mainIdea}
- Key Points: ${notes.keyPoints.filter(Boolean).join('; ')}
- Technical Facts: ${notes.importantFacts.filter(Boolean).join('; ')}

Evaluation Metrics:
- AI Note Score: ${aiNoteEval ? aiNoteEval.score : 8}/10
- Activity Score: ${activityScore !== null ? activityScore : 8}/10
- AI Summary Score: ${aiSummaryEval ? aiSummaryEval.score : 8}/10

Saved Vocabulary (${savedVocabulary.length} words):
${savedVocabulary.map((w) => `${w.word} (${w.pos}) - ${w.meaning}`).join('\n')}
      `;

      const portfolioItem: PortfolioItem = {
        id: `port-listening-${Date.now()}`,
        moduleId: 'listening',
        moduleTitle,
        title: `Listening Lab: ${currentPassage.title}`,
        category: 'audio',
        content: portfolioContent,
        score: activityScore !== null ? activityScore : 8,
        createdAt: new Date().toISOString(),
        status: 'Pending'
      };

      await dbStorage.savePortfolioItem(portfolioItem);
      if (onSaveWorkToPortfolio) {
        onSaveWorkToPortfolio(`Listening Lab: ${currentPassage.title}`, portfolioContent);
      }
      setIsPortfolioSaved(true);
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => setIsPortfolioSaved(false), 4000);
    } catch (err) {
      console.error('Error saving to portfolio:', err);
    }
  };

  // Universal Navigation Footer Renderer
  const renderNavigationFooter = (sectionId: string) => {
    const currentIndex = sectionSequence.findIndex((s) => s.id === sectionId);
    const prevSection = currentIndex > 0 ? sectionSequence[currentIndex - 1] : null;
    const nextSection = currentIndex < sectionSequence.length - 1 ? sectionSequence[currentIndex + 1] : null;
    const isCompleted = !!completedSections[sectionId];

    const handleNextClick = () => {
      if (!isCompleted) {
        if (sectionId === 'activities') {
          setNavWarningMsg('Please complete the listening comprehension activity before continuing.');
        } else if (sectionId === 'vocabulary') {
          setNavWarningMsg('Please complete the vocabulary activity before continuing.');
        } else {
          setNavWarningMsg('Please mark this section as completed before continuing.');
        }
        setTimeout(() => setNavWarningMsg(null), 5000);
        return;
      }
      setNavWarningMsg(null);
      if (nextSection) {
        setActiveSection(nextSection.id);
        scrollToSection();
      }
    };

    return (
      <div className="space-y-3 mt-8 pt-6 border-t border-[#FAD7A0]">
        {navWarningMsg && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{navWarningMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFF8F0] p-4 rounded-2xl">
          {/* Previous Button */}
          <div className="w-full sm:w-auto">
            {prevSection ? (
              <button
                onClick={() => {
                  setNavWarningMsg(null);
                  setActiveSection(prevSection.id);
                  scrollToSection();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#2C3E50] text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4 text-[#D35400]" />
                <span>Previous: {prevSection.title}</span>
              </button>
            ) : (
              <div className="hidden sm:block w-32" />
            )}
          </div>

          {/* Completion Control Button & Status */}
          <div className="flex flex-col items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                handleToggleMarkSectionCompleted(sectionId);
                setNavWarningMsg(null);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-2xs ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#D35400] text-white hover:bg-[#E67E22]'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Check className="w-4 h-4" />}
              <span>{isCompleted ? '✓ COMPLETED' : 'Mark as Completed'}</span>
            </button>

            <span className={`text-[11px] font-bold ${isCompleted ? 'text-emerald-700' : 'text-[#D35400]'}`}>
              {isCompleted ? '✓ Status: Completed' : 'Status: In Progress — Click button to complete'}
            </span>
          </div>

          {/* Next Button */}
          <div className="w-full sm:w-auto flex flex-col items-end">
            {nextSection ? (
              <button
                onClick={handleNextClick}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
                  isCompleted
                    ? 'bg-[#D35400] hover:bg-[#E67E22] text-white cursor-pointer'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 cursor-pointer'
                }`}
              >
                <span>Next: {nextSection.title}</span>
                <ChevronRight className="w-4 h-4 text-amber-800" />
              </button>
            ) : (
              <div className="hidden sm:block w-32" />
            )}
            {!isCompleted && nextSection && (
              <span className="text-[10px] text-amber-700 font-medium mt-1">
                Mark as Completed to unlock Next
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* HEADER BANNER */}
      <div className="srit-card p-6 bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FAD7A0] bg-white/10 px-2.5 py-1 rounded-md border border-white/20">
                SRIT R26 • Module 2
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
                R26-LAB-02
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
              Listening Comprehension & Active Note-Taking Studio
            </h1>
            <p className="text-xs text-[#FAD7A0] max-w-2xl mt-1">
              Master professional listening comprehension across 5 progressive engineering levels, 7-part note structuring, and AI diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setGlobalAccent('en-US')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                globalAccent === 'en-US'
                  ? 'bg-[#D35400] text-white border-white/40'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>US Accent</span>
            </button>

            <button
              onClick={() => setGlobalAccent('en-GB')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                globalAccent === 'en-GB'
                  ? 'bg-[#D35400] text-white border-white/40'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>UK Accent</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION TABS BAR */}
      <div ref={studioSectionRef} className="srit-card p-2 bg-white border border-[#FAD7A0] overflow-x-auto scroll-mt-24">
        <div className="flex items-center gap-1.5 min-w-max">
          {sectionSequence.map((sec) => {
            const isDone = !!completedSections[sec.id];
            const isCurrent = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleNavigateToSection(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-[#FFF8F0] text-[#2C3E50] hover:bg-[#FAD7A0] border border-[#FAD7A0]'
                }`}
              >
                <span>{sec.label}</span>
                {isDone && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      {activeSection === 'introduction' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
            <div className="border-b border-[#FAD7A0] pb-3">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                1. Introduction
              </span>
              <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                Introduction to Active Listening in Engineering
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-xs font-extrabold text-[#D35400]">Multi-Level Progression</h3>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  Train across 5 difficulty levels (Level 1–5), covering campus dialogues, hardware safety briefings, academic cloud lectures, agile standups, and advanced AI system keynotes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-xs font-extrabold text-[#D35400]">7-Part Note Synthesis</h3>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  Organize acoustic inputs into structured fields: Title, Main Idea, Key Points, Important Facts, Metrics/Dates, Spoken Vocabulary, and Personal Takeaways.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-xs font-extrabold text-[#D35400]">AI Diagnostic Evaluation</h3>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  Receive instant 5-dimensional AI feedback on Coverage, Organization, Grammar, Technical Vocabulary, and Coherence with normalized 10-point scoring.
                </p>
              </div>
            </div>

            {renderNavigationFooter('introduction')}
          </div>
        </div>
      )}

      {/* SECTION 2: READINESS CHECK */}
      {activeSection === 'readiness' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                2. Readiness & Diagnostic Check
              </span>
              <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                Audio Equipment & Environment Pre-Flight Verification
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl cursor-pointer hover:bg-[#FAD7A0]/30 transition">
                <input
                  type="checkbox"
                  checked={readinessCheck.audioChecked}
                  onChange={(e) => setReadinessCheck({ ...readinessCheck, audioChecked: e.target.checked })}
                  className="w-4 h-4 text-[#D35400] rounded focus:ring-[#D35400]"
                />
                <div className="text-xs">
                  <strong className="text-[#2C3E50] block font-bold">1. Audio Playback Test</strong>
                  <span className="text-[#5D6D7E]">Headphones or speakers connected and volume set to clear, comfortable level.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl cursor-pointer hover:bg-[#FAD7A0]/30 transition">
                <input
                  type="checkbox"
                  checked={readinessCheck.quietEnvironment}
                  onChange={(e) => setReadinessCheck({ ...readinessCheck, quietEnvironment: e.target.checked })}
                  className="w-4 h-4 text-[#D35400] rounded focus:ring-[#D35400]"
                />
                <div className="text-xs">
                  <strong className="text-[#2C3E50] block font-bold">2. Low-Distraction Environment</strong>
                  <span className="text-[#5D6D7E]">Surrounding noise minimized for optimal acoustic concentration during audio playback.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl cursor-pointer hover:bg-[#FAD7A0]/30 transition">
                <input
                  type="checkbox"
                  checked={readinessCheck.notebookReady}
                  onChange={(e) => setReadinessCheck({ ...readinessCheck, notebookReady: e.target.checked })}
                  className="w-4 h-4 text-[#D35400] rounded focus:ring-[#D35400]"
                />
                <div className="text-xs">
                  <strong className="text-[#2C3E50] block font-bold">3. Note-Taking Readiness</strong>
                  <span className="text-[#5D6D7E]">Structured digital note workspace open to log key points during first listening pass.</span>
                </div>
              </label>
            </div>

            {readinessCheck.audioChecked && readinessCheck.quietEnvironment && readinessCheck.notebookReady && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>All diagnostic readiness checks verified! Click "Mark as Completed" below to proceed.</span>
              </div>
            )}

            {renderNavigationFooter('readiness')}
          </div>
        </div>
      )}

      {/* SECTION 3: LISTENING LEVELS & PASSAGE SELECTION */}
      {activeSection === 'levels' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                3. Listening Levels & Passage Selection
              </span>
              <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                Select Listening Level & Complete Level Comprehension
              </h2>
              <p className="text-xs text-[#5D6D7E]">
                Sequence: Select Level → Listen → Answer 5 MCQs → Submit → View Score/Feedback → Mark Level Completed → Next Level
              </p>
            </div>

            {/* LEVEL SELECTOR (5 LEVELS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {LISTENING_LEVELS.map((lvl) => {
                const isSelected = selectedLevelId === lvl.id;
                const isLvlDone = !!completedLevels[lvl.id];
                const scoreInfo = levelQuizScores[lvl.id];

                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevelId(lvl.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D35400] text-white border-[#2C3E50] shadow-xs'
                        : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          isSelected ? 'bg-white/20 text-white border-white/30' : lvl.badgeColor
                        }`}>
                          {lvl.title}
                        </span>
                        {isLvlDone && (
                          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-900/30 px-1.5 py-0.5 rounded">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-black font-heading line-clamp-1">{lvl.subtitle}</h3>
                      <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#5D6D7E]'}`}>
                        {lvl.shortDesc}
                      </p>
                    </div>

                    {scoreInfo && (
                      <div className={`mt-2 pt-2 border-t text-[10px] font-mono flex justify-between ${
                        isSelected ? 'border-white/20 text-white' : 'border-[#FAD7A0] text-[#D35400]'
                      }`}>
                        <span>Quiz Score:</span>
                        <strong>{scoreInfo.correctCount}/{scoreInfo.total} ({formatScore10(scoreInfo.score10)})</strong>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* SELECTED LEVEL PASSAGE PLAYER & 5 MCQS SUITE */}
            <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-6">
              {/* Passage Info Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                    {currentPassage.levelTitle}: {currentPassage.levelCategory}
                  </span>
                  <h3 className="text-base font-black text-[#D35400] font-heading mt-1">
                    {currentPassage.title}
                  </h3>
                  <p className="text-xs text-[#5D6D7E]">
                    Speaker: <strong>{currentPassage.speakerName}</strong> ({currentPassage.speakerRole}) • Duration: {currentPassage.estimatedDuration}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlayAudio}
                    className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Audio' : 'Play Audio Passage'}</span>
                  </button>

                  <button
                    onClick={handleReplay10s}
                    className="p-2 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] rounded-xl text-xs font-bold transition flex items-center gap-1"
                    title="Replay last 10 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>-10s</span>
                  </button>
                </div>
              </div>

              {/* LEVEL-SPECIFIC COMPREHENSION MCQS (5 QUESTIONS) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
                    <Brain className="w-4 h-4" />
                    <span>5 Passage Comprehension MCQs ({currentPassage.levelTitle})</span>
                  </h4>
                  {completedLevels[selectedLevelId] && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                      ✓ Level Completed
                    </span>
                  )}
                </div>

                {/* Question List */}
                <div className="space-y-4">
                  {(currentPassage.activities.mcqs || [currentPassage.activities.mcq]).map((qItem, qIdx) => {
                    const isSubmitted = !!levelQuizSubmitted[selectedLevelId];
                    const selectedOpt = levelQuizAnswers[selectedLevelId]?.[qIdx];
                    const isCorrect = selectedOpt === qItem.correctIndex;

                    return (
                      <div key={qIdx} className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-extrabold text-[#2C3E50]">
                            Q{qIdx + 1}. {qItem.question}
                          </p>
                          {isSubmitted && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {qItem.options.map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let btnStyle = 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]';

                            if (isSubmitted) {
                              if (optIdx === qItem.correctIndex) {
                                btnStyle = 'bg-emerald-600 text-white border-emerald-700';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'bg-red-600 text-white border-red-700';
                              }
                            } else if (isChosen) {
                              btnStyle = 'bg-[#D35400] text-white border-[#2C3E50]';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleAnswerLevelMcq(selectedLevelId, qIdx, optIdx)}
                                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition ${btnStyle}`}
                              >
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-[11px] text-[#5D6D7E] mt-2">
                            <strong>Explanation:</strong> {qItem.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Control Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#FAD7A0]">
                  {!levelQuizSubmitted[selectedLevelId] ? (
                    <button
                      onClick={() => handleSubmitLevelQuiz(selectedLevelId)}
                      className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Level Answers (5 MCQs)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRetryLevelQuiz(selectedLevelId)}
                        className="px-4 py-2 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#2C3E50] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#D35400]" />
                        <span>Retry Level Quiz</span>
                      </button>

                      {levelQuizScores[selectedLevelId] && (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-xl">
                          Score: {levelQuizScores[selectedLevelId].correctCount}/5 ({formatScore10(levelQuizScores[selectedLevelId].score10)})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkLevelCompleted(selectedLevelId)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs ${
                        completedLevels[selectedLevelId]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#D35400] hover:bg-[#E67E22] text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{completedLevels[selectedLevelId] ? '✓ LEVEL COMPLETED' : 'Mark Level Completed'}</span>
                    </button>

                    {/* Next Level Shortcut */}
                    {completedLevels[selectedLevelId] && (
                      <button
                        onClick={() => {
                          const currentIdx = LISTENING_LEVELS.findIndex((l) => l.id === selectedLevelId);
                          if (currentIdx < LISTENING_LEVELS.length - 1) {
                            setSelectedLevelId(LISTENING_LEVELS[currentIdx + 1].id);
                          } else {
                            handleNavigateToSection('player');
                          }
                        }}
                        className="px-4 py-2.5 bg-[#2C3E50] hover:bg-[#1A252F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{selectedLevelId === 'level-5' ? 'Proceed to Audio Player →' : 'Next Level →'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {renderNavigationFooter('levels')}
          </div>
        </div>
      )}

      {/* SECTION 4: AUDIO LISTENING PLAYER */}
      {activeSection === 'player' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  4. Audio Listening Player
                </span>
                <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                  AUDIO LISTENING PLAYER
                </h2>
                <p className="text-xs text-[#5D6D7E]">
                  Listen carefully to the selected audio passage before taking notes in the AI Note Workspace.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
                  Replay Count: {replayCount}
                </span>
              </div>
            </div>

            {!currentPassage ? (
              <div className="p-8 text-center bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <p className="text-sm font-bold text-[#D35400]">
                  Please select a listening passage to continue.
                </p>
                <button
                  onClick={() => handleNavigateToSection('levels')}
                  className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#E67E22] transition"
                >
                  Go to Listening Levels & Passage Selection
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* PASSAGE METADATA & CONTEXT CARD */}
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2.5 py-1 rounded-full border border-[#FAD7A0]">
                        {currentPassage.levelTitle}
                      </span>
                      <h3 className="text-base font-black text-[#2C3E50] mt-1.5 font-heading">
                        {currentPassage.title}
                      </h3>
                      <p className="text-xs text-[#5D6D7E] mt-0.5">
                        Category: <strong className="text-[#2C3E50]">{currentPassage.levelCategory}</strong> • Topic: <strong className="text-[#2C3E50]">{currentPassage.topic}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-[#5D6D7E] bg-white px-3 py-1.5 rounded-xl border border-[#FAD7A0]">
                        Duration: {currentPassage.estimatedDuration}
                      </span>
                      <span className="text-xs font-bold text-[#D35400] bg-white px-3 py-1.5 rounded-xl border border-[#FAD7A0]">
                        {globalAccent === 'en-GB' ? '🇬🇧 British Accent' : '🇺🇸 US Accent'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-[#FAD7A0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#D35400] block">Speaker Profile</span>
                      <p className="font-bold text-[#2C3E50]">{currentPassage.speakerName}</p>
                      <p className="text-[#5D6D7E] italic">{currentPassage.speakerRole}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#FAD7A0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#D35400] block">Listening Context & Focus</span>
                      <p className="text-[#2C3E50] leading-relaxed">
                        Focus on main ideas, technical facts, metrics, and key decisions. You will record structured notes across 7 fields in the next section.
                      </p>
                    </div>
                  </div>

                  {/* Signposts guidance */}
                  {currentPassage.signpostWords && currentPassage.signpostWords.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                      <span className="font-bold text-[#D35400]">Listening Signposts to Track:</span>
                      {currentPassage.signpostWords.map((sp, idx) => (
                        <span key={idx} className="bg-white text-[#2C3E50] font-mono text-[11px] px-2.5 py-0.5 rounded-lg border border-[#FAD7A0]">
                          "{sp}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* AUDIO CONTROLS & SPEECH PLAYER */}
                <div className="p-6 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleTogglePlayAudio}
                        className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center transition shadow-xs shrink-0 ${
                          isPlaying ? 'bg-amber-600 hover:bg-amber-700 animate-pulse' : 'bg-[#D35400] hover:bg-[#E67E22]'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                      </button>

                      <button
                        onClick={handleReplay10s}
                        className="px-3.5 py-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Rewind 10s</span>
                      </button>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#FAD7A0]">
                        <button
                          onClick={() => setGlobalAccent('en-US')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            globalAccent === 'en-US' ? 'bg-[#D35400] text-white' : 'text-[#2C3E50] hover:bg-[#FFF8F0]'
                          }`}
                        >
                          US
                        </button>
                        <button
                          onClick={() => setGlobalAccent('en-GB')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            globalAccent === 'en-GB' ? 'bg-[#D35400] text-white' : 'text-[#2C3E50] hover:bg-[#FFF8F0]'
                          }`}
                        >
                          UK
                        </button>
                      </div>
                    </div>

                    {/* Speed Controls */}
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] font-bold text-[#5D6D7E] px-1">Speed:</span>
                      {[0.8, 1.0, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                            playbackSpeed === spd
                              ? 'bg-[#D35400] text-white'
                              : 'text-[#2C3E50] hover:bg-[#FFF8F0]'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-[#5D6D7E]">
                      <span>{formatSecondsToMinSec(currentTimeSec)}</span>
                      <span className="text-[#D35400]">
                        {currentTimeSec >= totalDurationSec ? '✓ Audio Finished' : isPlaying ? 'Playing Audio...' : 'Ready'}
                      </span>
                      <span>{formatSecondsToMinSec(totalDurationSec)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={totalDurationSec}
                      value={currentTimeSec}
                      onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
                      className="w-full accent-[#D35400] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {completedSections['player']
                        ? 'Audio Listening section is marked as completed.'
                        : 'Click "Mark as Completed" below when you have finished listening.'}
                    </span>
                  </div>
                  {currentTimeSec >= totalDurationSec && (
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ Played Full Audio
                    </span>
                  )}
                </div>
              </div>
            )}

            {renderNavigationFooter('player')}
          </div>
        </div>
      )}

      {/* SECTION 5: AI NOTE WORKSPACE */}
      {activeSection === 'notes' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  5. AI Note Workspace
                </span>
                <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                  Structured 7-Part Active Note-Taking
                </h2>
                <p className="text-xs text-[#5D6D7E]">
                  Active note-taking for: <strong className="text-[#2C3E50]">{currentPassage.title}</strong> ({currentPassage.levelTitle})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Notes</span>
                </button>

                <button
                  onClick={handleClearNotes}
                  className="px-3.5 py-2 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#5D6D7E] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleEvaluateNotes}
                  disabled={isEvaluatingNotes}
                  className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluatingNotes ? 'Evaluating...' : 'Evaluate Notes with AI'}</span>
                </button>
              </div>
            </div>

            {/* Notification Toast Banner */}
            {notesSaveMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{notesSaveMsg}</span>
              </div>
            )}

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] space-y-1">
              <span className="font-bold text-[#D35400] block uppercase text-[10px]">Active Listening Rule:</span>
              <p>
                Record your structured notes independently based on what you heard. Notes are saved per passage and will NOT be automatically populated from transcripts. Click <strong>Evaluate Notes with AI</strong> to receive diagnostic feedback on completeness and organization.
              </p>
            </div>

            {/* 7-PART NOTE FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#D35400] uppercase block">1. Passage / Experiment Title</label>
                <input
                  type="text"
                  value={notes.title}
                  onChange={(e) => setNotes((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Passage title..."
                  className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                />
              </div>

              {/* Field 2: Main Idea */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#D35400] uppercase block">2. Main Central Idea (1-2 Sentences)</label>
                <textarea
                  value={notes.mainIdea}
                  onChange={(e) => setNotes((prev) => ({ ...prev, mainIdea: e.target.value }))}
                  placeholder="Summarize the primary purpose or main concept of the audio passage in your own words..."
                  rows={2}
                  className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                />
              </div>

              {/* Field 3: Key Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D35400] uppercase">3. Key Points (Bulleted)</label>
                  <button onClick={() => handleAddNoteItem('keyPoints')} className="text-[10px] font-bold text-[#D35400] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Point
                  </button>
                </div>
                {notes.keyPoints.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNoteItemChange('keyPoints', idx, e.target.value)}
                      placeholder={`Key point ${idx + 1}...`}
                      className="flex-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                    />
                    {notes.keyPoints.length > 1 && (
                      <button onClick={() => handleRemoveNoteItem('keyPoints', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Field 4: Important Facts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D35400] uppercase">4. Important Technical Facts</label>
                  <button onClick={() => handleAddNoteItem('importantFacts')} className="text-[10px] font-bold text-[#D35400] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Fact
                  </button>
                </div>
                {notes.importantFacts.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNoteItemChange('importantFacts', idx, e.target.value)}
                      placeholder={`Important technical fact ${idx + 1}...`}
                      className="flex-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                    />
                    {notes.importantFacts.length > 1 && (
                      <button onClick={() => handleRemoveNoteItem('importantFacts', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Field 5: Numbers & Dates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D35400] uppercase">5. Numbers, Dates & Metrics</label>
                  <button onClick={() => handleAddNoteItem('numbersAndDates')} className="text-[10px] font-bold text-[#D35400] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Metric
                  </button>
                </div>
                {notes.numbersAndDates.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNoteItemChange('numbersAndDates', idx, e.target.value)}
                      placeholder="e.g. 5V DC, 85% coverage, 2 PM deadline..."
                      className="flex-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                    />
                    {notes.numbersAndDates.length > 1 && (
                      <button onClick={() => handleRemoveNoteItem('numbersAndDates', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Field 6: New Vocabulary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D35400] uppercase">6. Spoken Vocabulary</label>
                  <button onClick={() => handleAddNoteItem('newVocabulary')} className="text-[10px] font-bold text-[#D35400] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Word
                  </button>
                </div>
                {notes.newVocabulary.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNoteItemChange('newVocabulary', idx, e.target.value)}
                      placeholder="e.g. Microcontroller, Quantization..."
                      className="flex-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                    />
                    {notes.newVocabulary.length > 1 && (
                      <button onClick={() => handleRemoveNoteItem('newVocabulary', idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Field 7: Personal Reflection */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#D35400] uppercase block">7. Personal Reflection & Takeaways</label>
                <textarea
                  value={notes.personalReflection}
                  onChange={(e) => setNotes((prev) => ({ ...prev, personalReflection: e.target.value }))}
                  placeholder="How does this passage connect to your coursework or practical projects?"
                  rows={2}
                  className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                />
              </div>
            </div>

            {/* AI Note Feedback Results */}
            {aiNoteEval && (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                  <h4 className="text-xs font-black text-[#D35400] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Note Quality Diagnostic</span>
                  </h4>
                  <span className="text-xs font-black text-white bg-[#D35400] px-3 py-1 rounded-full">
                    Score: {formatScore10(aiNoteEval.score)} ({getPerformanceDescriptor(aiNoteEval.score)})
                  </span>
                </div>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{aiNoteEval.overallFeedback}</p>
              </div>
            )}

            {renderNavigationFooter('notes')}
          </div>
        </div>
      )}

      {/* SECTION 6: LISTENING COMPREHENSION ACTIVITIES */}
      {activeSection === 'activities' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  6. Listening Comprehension Activities
                </span>
                <h2 className="text-xl font-black text-[#D35400] font-heading mt-1">
                  Technology and Sustainable Engineering
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  Speaker: {SUSTAINABLE_ENGINEERING_PASSAGE.speakerName} ({SUSTAINABLE_ENGINEERING_PASSAGE.speakerRole}) • Duration: {SUSTAINABLE_ENGINEERING_PASSAGE.estimatedDuration}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#FAD7A0]">
                  5 Passage MCQs
                </span>
              </div>
            </div>

            {/* Dedicated Audio Player */}
            <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#D35400]" />
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2C3E50]">Audio Listening Player</h3>
                    <p className="text-[11px] text-[#5D6D7E]">Listen carefully before answering the 5 comprehension questions below.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex bg-white rounded-lg border border-[#FAD7A0] p-0.5">
                    <button
                      onClick={() => setCompAudioAccent('en-US')}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition ${
                        compAudioAccent === 'en-US' ? 'bg-[#D35400] text-white' : 'text-[#2C3E50] hover:bg-[#FFF8F0]'
                      }`}
                    >
                      US Accent
                    </button>
                    <button
                      onClick={() => setCompAudioAccent('en-GB')}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition ${
                        compAudioAccent === 'en-GB' ? 'bg-[#D35400] text-white' : 'text-[#2C3E50] hover:bg-[#FFF8F0]'
                      }`}
                    >
                      UK Accent
                    </button>
                  </div>

                  <select
                    value={compAudioSpeed}
                    onChange={(e) => setCompAudioSpeed(parseFloat(e.target.value))}
                    className="bg-white border border-[#FAD7A0] rounded-lg p-1 text-[11px] font-bold text-[#2C3E50]"
                  >
                    <option value={0.8}>0.8x Speed</option>
                    <option value={1.0}>1.0x Speed</option>
                    <option value={1.25}>1.25x Speed</option>
                    <option value={1.5}>1.5x Speed</option>
                  </select>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleCompAudio}
                  className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs shrink-0"
                >
                  {compAudioPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{compAudioPlaying ? 'Pause Audio' : 'Play Audio Passage'}</span>
                </button>

                <button
                  onClick={handleRewindCompAudio}
                  className="p-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] rounded-xl transition shrink-0"
                  title="Stop / Rewind Audio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="flex-1 bg-white p-3 rounded-xl border border-[#FAD7A0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${compAudioPlaying ? 'bg-emerald-500 animate-ping' : 'bg-gray-300'}`} />
                    <span className="text-xs font-bold text-[#2C3E50]">
                      {compAudioPlaying ? 'Playing Audio Stream...' : 'Audio Ready for Playback'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D35400]">{SUSTAINABLE_ENGINEERING_PASSAGE.estimatedDuration}</span>
                </div>
              </div>

              {/* Transcript Display Gate */}
              <div className="pt-2">
                {!compMcqSubmitted ? (
                  <div className="p-3 bg-white/80 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Transcript is locked during listening test. Submit your answers to unlock transcript review.</span>
                  </div>
                ) : (
                  <details className="bg-white rounded-xl border border-[#FAD7A0] p-3 text-xs text-[#2C3E50]">
                    <summary className="font-extrabold text-[#D35400] cursor-pointer flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      <span>Transcript Unlocked — Click to View Full Spoken Text</span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-[#2C3E50] border-t border-[#FAD7A0] pt-2 whitespace-pre-line font-serif">
                      {compAudioAccent === 'en-GB' ? SUSTAINABLE_ENGINEERING_PASSAGE.transcriptUK : SUSTAINABLE_ENGINEERING_PASSAGE.transcriptUS}
                    </p>
                  </details>
                )}
              </div>
            </div>

            {/* Score Banner when Submitted */}
            {compMcqSubmitted && compMcqScore && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="font-black text-emerald-800 text-sm">
                    Comprehension Score: {compMcqScore.correctCount} / 5 ({compMcqScore.percentage}%) — {getPerformanceDescriptor(compMcqScore.score10)}
                  </strong>
                  <button
                    onClick={handleRetryComprehension}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition"
                  >
                    Retry Activity
                  </button>
                </div>
                <p className="text-emerald-700">
                  {compMcqScore.correctCount >= 4
                    ? 'Excellent listening comprehension! You demonstrated strong retention of sustainable engineering concepts and technical details.'
                    : 'Good effort! Review the explanations for incorrect questions and re-listen to the passage to strengthen comprehension.'}
                </p>
              </div>
            )}

            {/* 5 Passage-Specific MCQs */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                <h3 className="text-sm font-black text-[#D35400] font-heading">
                  Passage-Specific Comprehension Questions (5 MCQs)
                </h3>
                <span className="text-[11px] font-bold text-[#5D6D7E]">
                  Answered: {Object.keys(compMcqAnswers).length} / 5
                </span>
              </div>

              {SUSTAINABLE_ENGINEERING_PASSAGE.mcqs.map((q, qIdx) => {
                const selected = compMcqAnswers[qIdx];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                        Question {qIdx + 1} of 5
                      </span>
                      {compMcqSubmitted && (
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded ${isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-extrabold text-[#2C3E50] leading-snug">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]';

                        if (compMcqSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                          } else if (selected === optIdx) {
                            btnStyle = 'bg-red-600 text-white border-red-700 font-bold';
                          } else {
                            btnStyle = 'bg-gray-100 text-gray-500 border-gray-200 opacity-60';
                          }
                        } else if (selected === optIdx) {
                          btnStyle = 'bg-[#D35400] text-white border-[#2C3E50] font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={compMcqSubmitted}
                            onClick={() => setCompMcqAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                            className={`p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="font-black shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {compMcqSubmitted && (
                      <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] space-y-1">
                        <strong className="font-extrabold text-[#D35400] block text-[11px]">Explanation:</strong>
                        <p className="text-xs text-[#5D6D7E] leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action Button */}
            {!compMcqSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmitComprehension}
                  className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Answers & Grade</span>
                </button>
              </div>
            )}

            {renderNavigationFooter('activities')}
          </div>
        </div>
      )}

      {/* SECTION 7: VOCABULARY DISCOVERY */}
      {activeSection === 'vocabulary' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  7. Vocabulary Discovery & Pronunciation Bank
                </span>
                <h2 className="text-xl font-black text-[#D35400] font-heading mt-1">
                  Technical & Academic Vocabulary
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  8 key technical terms programmatically extracted from "Technology and Sustainable Engineering".
                </p>
              </div>

              <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3.5 py-1.5 rounded-xl border border-[#FAD7A0]">
                Saved Words in Bank: {savedVocabulary.length}
              </span>
            </div>

            {savedSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold">
                ✓ {savedSuccessMsg}
              </div>
            )}

            {/* 8 Vocabulary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUSTAINABLE_ENGINEERING_PASSAGE.vocabularyList.map((wordItem) => (
                <div key={wordItem.id} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2.5 flex flex-col justify-between shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-1.5">
                      <h3 className="text-xs font-black text-[#D35400] leading-snug">{wordItem.word}</h3>
                      <span className="text-[9px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-[#FAD7A0] text-[#5D6D7E]">
                        {wordItem.pos}
                      </span>
                    </div>

                    <p className="text-[10px] font-mono font-bold text-[#E67E22]">
                      IPA ({globalAccent}): {globalAccent === 'en-GB' ? wordItem.ipaUK : wordItem.ipaUS}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#D35400] block">Definition:</span>
                      <p className="text-xs text-[#2C3E50] leading-snug">{wordItem.meaning}</p>
                    </div>

                    <div className="p-2 bg-white border border-[#FAD7A0] rounded-lg text-[10px] text-[#5D6D7E] space-y-1">
                      <span className="font-extrabold text-[#D35400] block uppercase text-[9px]">Passage Context:</span>
                      <p className="italic">"{wordItem.passageContext}"</p>
                    </div>

                    <div className="p-2 bg-white border border-[#FAD7A0] rounded-lg text-[10px] font-mono text-[#2C3E50]">
                      <strong>Example:</strong> "{wordItem.example}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#FAD7A0]">
                    <button
                      onClick={() => playSingleWordAudio(wordItem.word)}
                      className="p-2 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] rounded-lg text-[#D35400] text-xs font-bold transition flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>

                    <button
                      onClick={() => handleSaveWordToBank(wordItem)}
                      className="flex-1 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-lg transition text-center"
                    >
                      Save Word
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Vocabulary Practice (5 Questions) */}
            <div className="mt-8 pt-6 border-t border-[#FAD7A0] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#D35400] font-heading">
                    Active Vocabulary Practice (5 Questions)
                  </h3>
                  <p className="text-xs text-[#5D6D7E]">
                    Test your understanding of the 8 technical terms introduced in the sustainable engineering passage.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
                  Answered: {Object.keys(vocabAnswers).length} / 5
                </span>
              </div>

              {vocabSubmitted && vocabScore && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="font-black text-emerald-800 text-sm">
                      Vocabulary Score: {vocabScore.correctCount} / 5 ({vocabScore.percentage}%) — {getPerformanceDescriptor(vocabScore.score10)}
                    </strong>
                    <button
                      onClick={handleRetryVocabPractice}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition"
                    >
                      Retry Practice
                    </button>
                  </div>
                  <p className="text-emerald-700">
                    {vocabScore.correctCount >= 4
                      ? 'Great job mastering the sustainable engineering vocabulary!'
                      : 'Review the term definitions above and try again to improve your score.'}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {SUSTAINABLE_ENGINEERING_PASSAGE.vocabularyPractice.map((vq, vIdx) => {
                  const selected = vocabAnswers[vIdx];
                  const isCorrect = selected === vq.correctIndex;

                  return (
                    <div key={vq.id} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                          Vocabulary Question {vIdx + 1}
                        </span>
                        {vocabSubmitted && (
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded ${isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-extrabold text-[#2C3E50]">{vq.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vq.options.map((opt, optIdx) => {
                          let btnStyle = 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]';

                          if (vocabSubmitted) {
                            if (optIdx === vq.correctIndex) {
                              btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                            } else if (selected === optIdx) {
                              btnStyle = 'bg-red-600 text-white border-red-700 font-bold';
                            } else {
                              btnStyle = 'bg-gray-100 text-gray-500 border-gray-200 opacity-60';
                            }
                          } else if (selected === optIdx) {
                            btnStyle = 'bg-[#D35400] text-white border-[#2C3E50] font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={vocabSubmitted}
                              onClick={() => setVocabAnswers((prev) => ({ ...prev, [vIdx]: optIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2 ${btnStyle}`}
                            >
                              <span className="font-black shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {vocabSubmitted && (
                        <div className="p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#5D6D7E]">
                          <strong className="font-bold text-[#D35400] block text-[11px]">Explanation:</strong>
                          {vq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!vocabSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitVocabPractice}
                    className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Vocabulary Answers</span>
                  </button>
                </div>
              )}
            </div>

            {renderNavigationFooter('vocabulary')}
          </div>
        </div>
      )}

      {/* SECTION 8: ANALYTICS DASHBOARD */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                8. Analytics Dashboard
              </span>
              <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                Real-Time Listening Laboratory Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Overall Activity Score</span>
                <span className="text-2xl font-black text-[#D35400]">
                  {formatScore10(activityScore ?? 9)}
                </span>
                <p className="text-[10px] font-bold text-emerald-700">{getPerformanceDescriptor(activityScore ?? 9)}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Replay Count</span>
                <span className="text-2xl font-black text-[#D35400]">{replayCount}</span>
                <p className="text-[10px] text-[#5D6D7E]">Audio replays & rewinds</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Note Quality Score</span>
                <span className="text-2xl font-black text-[#D35400]">
                  {formatScore10(aiNoteEval ? aiNoteEval.score : 9)}
                </span>
                <p className="text-[10px] font-bold text-emerald-700">{getPerformanceDescriptor(aiNoteEval ? aiNoteEval.score : 9)}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Completed Levels</span>
                <span className="text-2xl font-black text-[#D35400]">
                  {Object.values(completedLevels).filter(Boolean).length}/5
                </span>
                <p className="text-[10px] font-bold text-emerald-700">Progressive Levels</p>
              </div>
            </div>

            {renderNavigationFooter('analytics')}
          </div>
        </div>
      )}

      {/* SECTION 9: REFLECTION */}
      {activeSection === 'reflection' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                9. Metacognitive Reflection
              </span>
              <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                Reflect on Listening Challenges & Growth
              </h2>
            </div>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Record your self-reflection thoughts here..."
              rows={4}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />

            <button
              onClick={() => {
                setReflectionSaved(true);
                setTimeout(() => setReflectionSaved(false), 3000);
              }}
              className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{reflectionSaved ? 'Reflection Saved!' : 'Save Reflection'}</span>
            </button>

            {renderNavigationFooter('reflection')}
          </div>
        </div>
      )}

      {/* SECTION 10: LAB NOTEBOOK */}
      {activeSection === 'notebook' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  10. Automatic Laboratory Notebook Entry
                </span>
                <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                  Format Official SAILL Lab Experiment Record
                </h2>
              </div>

              <button
                onClick={handleSaveNotebookEntry}
                className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{isNotebookSaved ? 'Saved to Lab Notebook!' : 'Save Entry to Lab Notebook'}</span>
              </button>
            </div>

            <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#FAD7A0] pb-2 text-[#D35400] font-bold">
                <span>Experiment Code: R26-LAB-02</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <p><strong>Title:</strong> Listening Comprehension & Note-taking: {currentPassage.title}</p>
              <p><strong>Level:</strong> {currentPassage.levelTitle} ({currentPassage.topic})</p>
              <p><strong>Accent Used:</strong> {globalAccent === 'en-GB' ? 'British English' : 'American English'}</p>
              <p><strong>Note Quality Score:</strong> {formatScore10(aiNoteEval ? aiNoteEval.score : 9)}</p>
              <p><strong>Comprehension Score:</strong> {formatScore10(activityScore !== null ? activityScore : 9)}</p>
            </div>

            {renderNavigationFooter('notebook')}
          </div>
        </div>
      )}

      {/* SECTION 11: PORTFOLIO UPDATE */}
      {activeSection === 'portfolio' && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
            <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  11. Portfolio Update using IndexedDB
                </span>
                <h2 className="text-lg font-black text-[#D35400] font-heading mt-1">
                  Persist Listening Artifact to SAILL Student Portfolio
                </h2>
              </div>

              <button
                onClick={handleSaveToPortfolio}
                className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs shrink-0"
              >
                <Bookmark className="w-4 h-4" />
                <span>{isPortfolioSaved ? 'Saved to Portfolio!' : 'Save Artifact to Portfolio'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl text-xs text-[#5D6D7E] leading-relaxed">
              Clicking "Save Artifact to Portfolio" securely stores your structured notes, comprehension scores, level progress, and vocabulary discoveries into your local IndexedDB portfolio store.
            </div>

            {renderNavigationFooter('portfolio')}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for format time
function formatSecondsToMinSec(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}
