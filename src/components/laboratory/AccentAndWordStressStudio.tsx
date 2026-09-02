import React, { useState } from 'react';
import {
  Globe,
  BookOpen,
  Target,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Award,
  Zap,
  Volume2,
  Headphones,
  Search,
  Mic,
  Bot,
  Trophy,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { UniversalAudioPlayer } from './UniversalAudioPlayer';
import { UniversalRecorder } from './UniversalRecorder';
import { AIEvaluationStatusCard } from './AIEvaluationStatusCard';
import { AIEvaluationReport } from './AIEvaluationReport';
import { AICoachDashboard } from './AICoachDashboard';
import { AIEvaluationService } from '../../services/AIEvaluationService';
import { AICoachService } from '../../services/AICoachService';
import { AICoachGuidance } from '../../types/aiCoach';
import {
  AIProcessingStatus,
  EvaluatePronunciationResponse,
  ActivityType,
  WordAttemptHistory,
  AttemptRecord
} from '../../types/aiEvaluation';
import {
  useAccentPreference,
  AccentPreferenceService
} from '../../services/AccentPreferenceService';

interface AccentAndWordStressStudioProps {
  onBackToTheory?: () => void;
  onNextActivity?: () => void;
  onCompleteActivity?: () => void;
}

export const AccentAndWordStressStudio: React.FC<AccentAndWordStressStudioProps> = ({
  onNextActivity,
  onCompleteActivity
}) => {
  const [accent] = useAccentPreference();
  const accentLabel = accent === 'en-GB' ? 'British (RP)' : 'American (GA)';
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRecordingWord, setActiveRecordingWord] = useState<string | null>(null);
  const [savedRecordings, setSavedRecordings] = useState<Record<string, { blob: Blob; url: string }>>({});
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Attempt History Tracking per target text (Up to 3 Attempts per word)
  const [wordHistories, setWordHistories] = useState<Record<string, WordAttemptHistory>>({});

  // Level 4 AI Assessment Studio state
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('WORD');
  const [customTargetText, setCustomTargetText] = useState<string>('Communication');
  const [level4AudioBlob, setLevel4AudioBlob] = useState<{ blob: Blob; url: string } | null>(null);

  // AI Learning Coach Guidance state
  const [aiCoachGuidance, setAiCoachGuidance] = useState<AICoachGuidance | null>(null);
  const [isGeneratingCoach, setIsGeneratingCoach] = useState<boolean>(false);

  // AI Evaluation Engine State
  const [aiEvaluationState, setAiEvaluationState] = useState<{
    status: AIProcessingStatus;
    targetWord: string;
    response: EvaluatePronunciationResponse | null;
    errorMessage: string | null;
  }>({
    status: 'idle',
    targetWord: '',
    response: null,
    errorMessage: null
  });

  // Level 2: Interactive Syllable Identification Drill State
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [selectedSyllableIdx, setSelectedSyllableIdx] = useState<number | null>(null);
  const [drillAnswered, setDrillAnswered] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);

  // Level 5: Word Stress Mastery Challenge State
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, number>>({});
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  const handleSpeak = (text: string) => {
    setSpeakingWord(text);
    AccentPreferenceService.speak(text, {
      accent,
      rate: 0.85,
      pitch: 1.0,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null)
    });
  };

  const handleEvaluateAudioWithAI = async (
    word: string,
    audioBlob: Blob,
    activityType: ActivityType = 'WORD'
  ) => {
    setAiEvaluationState({
      status: 'processing',
      targetWord: word,
      response: null,
      errorMessage: null
    });

    try {
      const result = await AIEvaluationService.evaluatePronunciation({
        targetWord: word,
        studentAudio: audioBlob,
        activityType,
        moduleName: 'Module 1 • Accent & Word Stress Studio',
        activityName: `Level ${activeLevel} Practice (${accentLabel})`,
        difficulty: 'Intermediate'
      });

      setAiEvaluationState({
        status: 'success',
        targetWord: word,
        response: result,
        errorMessage: null
      });

      // Update attempt history (Up to 3 attempts) and trigger AI Coach Guidance
      if (result.evaluation) {
        const evalData = result.evaluation;
        let updatedHistory: WordAttemptHistory | undefined;

        setWordHistories((prev) => {
          const existing = prev[word] || {
            targetWord: word,
            attempts: [],
            bestScore: 0,
            latestScore: 0,
            improvement: 0
          };

          const attemptNum = Math.min(3, existing.attempts.length + 1);
          const newAttempt: AttemptRecord = {
            attemptNumber: attemptNum,
            timestamp: new Date().toISOString(),
            result: evalData,
            audioUrl: savedRecordings[word]?.url || level4AudioBlob?.url
          };

          const updatedAttempts = [...existing.attempts, newAttempt].slice(-3);
          const scores = updatedAttempts.map((a) => a.result.overallScore);
          const bestScore = Math.max(...scores);
          const latestScore = evalData.overallScore;
          const firstScore = updatedAttempts[0]?.result.overallScore || latestScore;
          const improvement = latestScore - firstScore;

          updatedHistory = {
            targetWord: word,
            attempts: updatedAttempts,
            bestScore,
            latestScore,
            improvement
          };

          return {
            ...prev,
            [word]: updatedHistory
          };
        });

        // Generate Personalised AI Learning Guidance
        setIsGeneratingCoach(true);
        AICoachService.generateGuidance({
          latestResult: evalData,
          history: updatedHistory,
          activityType,
          targetText: word
        })
          .then((guidance) => {
            setAiCoachGuidance(guidance);
            setIsGeneratingCoach(false);
          })
          .catch((err) => {
            console.warn('Failed to generate AI Coach guidance:', err);
            setIsGeneratingCoach(false);
          });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setAiEvaluationState({
        status: 'failure',
        targetWord: word,
        response: null,
        errorMessage: errorObj.message || 'Evaluation unavailable. Please record again.'
      });
    }
  };

  // Levels metadata
  const levels = [
    {
      id: 1,
      number: 'Level 1',
      title: 'Learn',
      icon: BookOpen,
      emoji: '📘',
      description: 'Understand the concepts of Accent and Word Stress.',
      status: 'Theory & Rules',
      badge: 'Completed',
      unlocked: true
    },
    {
      id: 2,
      number: 'Level 2',
      title: 'Listen',
      icon: Volume2,
      emoji: '🔊',
      description: 'Listen carefully to pronunciation examples in selected accent.',
      status: 'Interactive Practice',
      badge: 'Active Practice',
      unlocked: true
    },
    {
      id: 3,
      number: 'Level 3',
      title: 'Practice',
      icon: Mic,
      emoji: '🎤',
      description: 'Practise pronunciation using guided speaking activities.',
      status: 'Guided Speaking',
      badge: 'Active Practice',
      unlocked: true
    },
    {
      id: 4,
      number: 'Level 4',
      title: 'AI Assessment & Coach',
      icon: Bot,
      emoji: '🤖',
      description: 'AI Evaluation Engine & Personalised Learning Guidance.',
      status: 'AI Engine Active',
      badge: 'AI Coach & Plan',
      unlocked: true
    },
    {
      id: 5,
      number: 'Level 5',
      title: 'Mastery Challenge',
      icon: Trophy,
      emoji: '🏆',
      description: 'Interactive Word Stress Identification & Placement Quiz.',
      status: 'Final Drill',
      badge: challengeSubmitted ? 'Mastered' : 'Interactive Drill',
      unlocked: true
    }
  ];

  // Common Word Stress Rules data array
  const wordStressRules = [
    {
      ruleNumber: 1,
      title: 'Two-Syllable Nouns',
      explanation: 'Two-syllable nouns usually receive stress on the first syllable.',
      examples: [
        { word: 'table', prefix: '', stressed: 'TA', suffix: 'ble', audio: '/audio/table.mp3' },
        { word: 'doctor', prefix: '', stressed: 'DOC', suffix: 'tor', audio: '/audio/doctor.mp3' },
        { word: 'window', prefix: '', stressed: 'WIN', suffix: 'dow', audio: '/audio/window.mp3' }
      ]
    },
    {
      ruleNumber: 2,
      title: 'Two-Syllable Verbs',
      explanation: 'Two-syllable verbs usually receive stress on the second syllable.',
      examples: [
        { word: 'begin', prefix: 'be', stressed: 'GIN', suffix: '', audio: '/audio/begin.mp3' },
        { word: 'decide', prefix: 'de', stressed: 'CIDE', suffix: '', audio: '/audio/decide.mp3' },
        { word: 'relax', prefix: 're', stressed: 'LAX', suffix: '', audio: '/audio/relax.mp3' }
      ]
    },
    {
      ruleNumber: 3,
      title: 'Words Ending in -tion',
      explanation: 'Words ending in -tion usually receive stress on the syllable immediately before -tion.',
      examples: [
        { word: 'education', prefix: 'edu', stressed: 'CA', suffix: 'tion', audio: '/audio/education.mp3' },
        { word: 'communication', prefix: 'communi', stressed: 'CA', suffix: 'tion', audio: '/audio/communication.mp3' },
        { word: 'presentation', prefix: 'presen', stressed: 'TA', suffix: 'tion', audio: '/audio/presentation.mp3' }
      ]
    },
    {
      ruleNumber: 4,
      title: 'Words Ending in -ic',
      explanation: 'Words ending in -ic usually receive stress on the syllable before -ic.',
      examples: [
        { word: 'geographic', prefix: 'geo', stressed: 'GRAPH', suffix: 'ic', audio: '/audio/geographic.mp3' },
        { word: 'dramatic', prefix: 'dra', stressed: 'MAT', suffix: 'ic', audio: '/audio/dramatic.mp3' },
        { word: 'economic', prefix: 'eco', stressed: 'NOM', suffix: 'ic', audio: '/audio/economic.mp3' }
      ]
    },
    {
      ruleNumber: 5,
      title: 'Words Ending in -ity',
      explanation: 'Words ending in -ity usually receive stress two syllables before -ity.',
      examples: [
        { word: 'responsibility', prefix: 'responsi', stressed: 'BIL', suffix: 'ity', audio: '/audio/responsibility.mp3' },
        { word: 'possibility', prefix: 'possi', stressed: 'BIL', suffix: 'ity', audio: '/audio/possibility.mp3' },
        { word: 'university', prefix: 'uni', stressed: 'VER', suffix: 'sity', audio: '/audio/university.mp3' }
      ]
    },
    {
      ruleNumber: 6,
      title: 'Words Ending in -graphy',
      explanation: 'Words ending in -graphy usually receive stress on the syllable before -graphy.',
      examples: [
        { word: 'photography', prefix: 'pho', stressed: 'TOG', suffix: 'raphy', audio: '/audio/photography.mp3' },
        { word: 'geography', prefix: 'geo', stressed: 'GRAPH', suffix: 'y', audio: '/audio/geography.mp3' },
        { word: 'biography', prefix: 'bi', stressed: 'OG', suffix: 'raphy', audio: '/audio/biography.mp3' }
      ]
    },
    {
      ruleNumber: 7,
      title: 'Compound Nouns',
      explanation: 'Compound nouns usually receive stress on the first word.',
      examples: [
        { word: 'blackboard', prefix: '', stressed: 'BLACK', suffix: 'board', audio: '/audio/blackboard.mp3' },
        { word: 'greenhouse', prefix: '', stressed: 'GREEN', suffix: 'house', audio: '/audio/greenhouse.mp3' },
        { word: 'airport', prefix: '', stressed: 'AIR', suffix: 'port', audio: '/audio/airport.mp3' }
      ]
    },
    {
      ruleNumber: 8,
      title: 'Compound Adjectives',
      explanation: 'Compound adjectives usually receive stress on the second element.',
      examples: [
        { word: 'bad-tempered', prefix: 'bad-', stressed: 'TEM', suffix: 'pered', audio: '/audio/bad-tempered.mp3' },
        { word: 'old-fashioned', prefix: 'old-', stressed: 'FASH', suffix: 'ioned', audio: '/audio/old-fashioned.mp3' },
        { word: 'well-known', prefix: 'well-', stressed: 'KNOWN', suffix: '', audio: '/audio/well-known.mp3' }
      ]
    }
  ];

  // Flattened list of all practice words
  const allPracticeWords = wordStressRules.flatMap((rule) =>
    rule.examples.map((ex) => ({
      ...ex,
      category: rule.title,
      ruleNumber: rule.ruleNumber
    }))
  );

  const filteredPracticeWords = allPracticeWords.filter(
    (item) =>
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stressed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Level 2 Interactive Listening Drills
  const listeningDrills = [
    {
      word: 'Communication',
      syllables: ['com', 'mu', 'ni', 'CA', 'tion'],
      correctIndex: 3,
      rule: 'Rule 3: Syllable right before suffix -tion receives the primary stress.',
      meaning: 'Sharing or exchanging information, ideas, and feelings.'
    },
    {
      word: 'Photography',
      syllables: ['pho', 'TOG', 'ra', 'phy'],
      correctIndex: 1,
      rule: 'Rule 6: Words ending in -graphy take stress on the syllable before -graphy (TOG).',
      meaning: 'The art or practice of taking and processing photographs.'
    },
    {
      word: 'University',
      syllables: ['u', 'ni', 'VER', 'si', 'ty'],
      correctIndex: 2,
      rule: 'Rule 5: Words ending in -ity receive stress on the antepenultimate syllable (VER).',
      meaning: 'A high-level educational institution.'
    },
    {
      word: 'Economic',
      syllables: ['e', 'co', 'NOM', 'ic'],
      correctIndex: 2,
      rule: 'Rule 4: Words ending in -ic receive stress on the syllable immediately preceding -ic (NOM).',
      meaning: 'Relating to the economy or trade.'
    },
    {
      word: 'Airport',
      syllables: ['AIR', 'port'],
      correctIndex: 0,
      rule: 'Rule 7: Compound nouns take primary stress on the first element (AIR).',
      meaning: 'A complex of runways and buildings for takeoff and landing of aircraft.'
    }
  ];

  // Level 5 Challenge Quiz Questions
  const challengeQuestions = [
    {
      id: 1,
      word: 'Technology',
      syllables: ['tech', 'NOL', 'o', 'gy'],
      correctIndex: 1,
      rule: 'Words ending in -logy take stress on the antepenultimate syllable (NOL).'
    },
    {
      id: 2,
      word: 'Presentation',
      syllables: ['pre', 'sen', 'TA', 'tion'],
      correctIndex: 2,
      rule: 'Words ending in -tion place primary stress immediately before -tion (TA).'
    },
    {
      id: 3,
      word: 'Photographer',
      syllables: ['pho', 'TOG', 'ra', 'pher'],
      correctIndex: 1,
      rule: 'Stress shifts to the second syllable (TOG) when adding the agent suffix -er.'
    },
    {
      id: 4,
      word: 'Responsibility',
      syllables: ['re', 'spon', 'si', 'BIL', 'i', 'ty'],
      correctIndex: 3,
      rule: 'Words ending in -ity place stress two syllables before -ity (BIL).'
    },
    {
      id: 5,
      word: 'Greenhouse',
      syllables: ['GREEN', 'house'],
      correctIndex: 0,
      rule: 'Compound nouns receive primary stress on the first component (GREEN).'
    },
    {
      id: 6,
      word: 'Decide',
      syllables: ['de', 'CIDE'],
      correctIndex: 1,
      rule: 'Two-syllable verbs receive primary stress on the second syllable (CIDE).'
    },
    {
      id: 7,
      word: 'Geographic',
      syllables: ['ge', 'o', 'GRAPH', 'ic'],
      correctIndex: 2,
      rule: 'Words ending in -ic place primary stress immediately before -ic (GRAPH).'
    },
    {
      id: 8,
      word: 'Bad-tempered',
      syllables: ['bad', 'TEM', 'pered'],
      correctIndex: 1,
      rule: 'Compound adjectives take stress on the second component (TEM).'
    }
  ];

  const practicalTips = [
    'Listen carefully to native and proficient speakers in your preferred accent.',
    'Repeat words aloud several times, clapping on the stressed syllable.',
    'Break multi-syllable words into chunks (syllabification).',
    'Identify the stressed syllable before speaking in formal meetings.',
    'Use interactive audio tools to verify syllable vowel length and pitch.',
    'Practise every day for 10–15 minutes.'
  ];

  const currentDrill = listeningDrills[drillIndex];
  const calculatedChallengeScore = Object.entries(challengeAnswers).reduce((acc, [qIdx, ans]) => {
    const q = challengeQuestions[parseInt(qIdx, 10)];
    return ans === q?.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-8 animate-fadeIn" id="accent-word-stress-studio">
      {/* PAGE HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white shadow-md relative overflow-hidden border border-[#FAD7A0]/30">
        <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#D35400]/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FAD7A0] text-[11px] font-extrabold uppercase tracking-wider border border-white/15">
              <Globe className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>Structured Learning Journey • Module 1</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D35400] text-white text-[11px] font-bold border border-[#FAD7A0]/30 shadow-2xs">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Accent: {accentLabel}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Accent & Word Stress Studio
          </h2>

          <p className="text-xs sm:text-sm text-[#FAD7A0] font-semibold max-w-2xl leading-relaxed">
            Master English pronunciation through syllable stress placement, acoustic drills, and interactive AI evaluation.
          </p>
        </div>
      </div>

      {/* HORIZONTAL PROGRESS TRACKER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D35400]" />
            <span className="text-xs font-black uppercase text-[#2C3E50] tracking-wider font-heading">
              5-Level Learning Progression
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#D35400] font-mono bg-[#FFF8F0] px-2.5 py-0.5 rounded-md border border-[#FAD7A0]">
            Level {activeLevel} of 5 Active
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="relative flex items-center justify-between gap-1 overflow-x-auto pb-1 pt-2">
          {levels.map((lvl) => {
            const isActive = activeLevel === lvl.id;
            const isCompleted = activeLevel > lvl.id || (lvl.id === 5 && challengeSubmitted);

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setActiveLevel(lvl.id)}
                className={`relative z-10 flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer min-w-[110px] shrink-0 ${
                  isActive
                    ? 'bg-[#2C3E50] text-white shadow-md scale-105 border border-[#2C3E50]'
                    : isCompleted
                    ? 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]/30'
                    : 'bg-white text-[#5D6D7E] border border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? 'bg-[#D35400] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#D35400]/15 text-[#D35400]'
                      : 'bg-[#FFF8F0] text-[#5D6D7E]'
                  }`}
                >
                  {lvl.id}
                </div>

                <div className="text-center">
                  <div className="text-[11px] font-extrabold font-heading tracking-tight flex items-center justify-center gap-1">
                    <span>{lvl.emoji}</span>
                    <span>{lvl.title}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEVEL 1: LEARN (THEORY & RULES) */}
      {activeLevel === 1 && (
        <div className="space-y-8 animate-fadeIn">
          {/* SECTION 1: CORE CONCEPTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <BookOpen className="w-5 h-5 text-[#D35400]" />
              <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                1. Core Concepts: Accent & Word Stress
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: What is Accent */}
              <div className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-md transition space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#D35400]">
                  <div className="p-2 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#D35400]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black font-heading text-[#2C3E50]">
                    What is an Accent?
                  </h4>
                </div>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  An accent is the unique pronunciation pattern of a language, shaped by region, culture, and native language influence (e.g. American, British, Indian).
                </p>
              </div>

              {/* Card 2: What is Word Stress */}
              <div className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-md transition space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#D35400]">
                  <div className="p-2 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#E67E22]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black font-heading text-[#2C3E50]">
                    What is Word Stress?
                  </h4>
                </div>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  Word stress is the emphasis placed on a specific syllable in a word. The stressed syllable is spoken <strong className="text-[#D35400]">longer, louder, and with higher pitch</strong>.
                </p>
              </div>

              {/* Card 3: Why Word Stress Matters */}
              <div className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-md transition space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#D35400]">
                  <div className="p-2 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#D35400]">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black font-heading text-[#2C3E50]">
                    Why Word Stress Matters
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-[#5D6D7E]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] shrink-0" />
                    <span>Improves speech intelligibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] shrink-0" />
                    <span>Enhances listening comprehension in meetings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] shrink-0" />
                    <span>Distinguishes noun vs. verb pairs (e.g. REcord vs reCORD)</span>
                  </li>
                </ul>
              </div>

              {/* Card 4: Accent in Professional Communication */}
              <div className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-md transition space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#D35400]">
                  <div className="p-2 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#E67E22]">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black font-heading text-[#2C3E50]">
                    Accent in Professional Settings
                  </h4>
                </div>
                <p className="text-xs text-[#5D6D7E] leading-relaxed">
                  Clear pronunciation and correct stress are far more important than mimicking a native accent. Global recruiters prioritize intelligibility and confidence.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: WORD STRESS RULES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D35400]" />
                <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                  2. Common Word Stress Rules
                </h3>
              </div>
              <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-lg border border-[#FAD7A0]">
                8 Core Rules with Audio
              </span>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wordStressRules.map((rule) => (
                <div
                  key={rule.ruleNumber}
                  className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-[#D35400] text-white text-[10px] font-black font-mono rounded-lg uppercase tracking-wider">
                        Rule {rule.ruleNumber}
                      </span>
                      <span className="text-xs font-extrabold text-[#E67E22] font-heading">
                        {rule.title}
                      </span>
                    </div>

                    <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">
                      {rule.explanation}
                    </p>
                  </div>

                  {/* Examples with Stressed Syllable Highlighted & Accent Speak Button */}
                  <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#D35400] uppercase tracking-wider block font-heading">
                        Examples:
                      </span>
                      <span className="text-[10px] font-mono text-[#5D6D7E]">
                        🔊 Click to listen in {accentLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {rule.examples.map((ex, exIdx) => {
                        const isCurrentlySpeaking = speakingWord === ex.word;
                        return (
                          <div
                            key={exIdx}
                            className="p-2 bg-white border border-[#FAD7A0] rounded-xl flex flex-col items-center justify-between gap-1.5 text-center shadow-2xs hover:border-[#D35400] transition"
                          >
                            <div className="font-mono text-xs">
                              {ex.prefix && <span className="text-[#5D6D7E]">{ex.prefix}</span>}
                              <span className="text-[#D35400] font-black text-sm uppercase px-1 py-0.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                                {ex.stressed}
                              </span>
                              {ex.suffix && <span className="text-[#5D6D7E]">{ex.suffix}</span>}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSpeak(ex.word)}
                              className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                                isCurrentlySpeaking
                                  ? 'bg-[#D35400] text-white animate-pulse'
                                  : 'bg-[#FFF8F0] text-[#D35400] hover:bg-[#D35400] hover:text-white border border-[#FAD7A0]'
                              }`}
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>{isCurrentlySpeaking ? 'Playing...' : 'Listen'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: PRACTICAL TIPS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <Zap className="w-5 h-5 text-[#D35400]" />
              <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                3. Practical Tips for Word Stress Mastery
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {practicalTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-start gap-2.5 text-xs text-[#2C3E50] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM STEPPER CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#D35400]">
                <Bookmark className="w-4 h-4 fill-[#D35400]" />
                <span className="text-xs font-black uppercase tracking-wider font-heading">
                  Theory Complete
                </span>
              </div>
              <p className="text-xs text-[#5D6D7E] font-medium">
                Ready to practice your listening and stress perception with audio examples?
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveLevel(2)}
              className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#E67E22] transition flex items-center gap-2 shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Proceed to Level 2: Listen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 2: LISTEN (INTERACTIVE LISTENING & SYLLABLE IDENTIFICATION) */}
      {activeLevel === 2 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#D35400]" />
              <div>
                <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                  Level 2: Interactive Listening & Stress Perception Lab
                </h3>
                <p className="text-xs text-[#5D6D7E]">
                  Listen to pronunciations in {accentLabel}. Identify primary syllable stress and compare pitch patterns.
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE SYLLABLE STRESS DRILL CARD */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#D35400] text-white text-[10px] font-black uppercase tracking-wider rounded-lg font-mono">
                  Interactive Stress Drill
                </span>
                <span className="text-xs font-bold text-[#2C3E50]">
                  Item {drillIndex + 1} of {listeningDrills.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-lg border border-[#FAD7A0]">
                  Drill Score: {drillScore} / {listeningDrills.length}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-2xl font-black text-[#2C3E50] font-heading">
                  {currentDrill.word}
                </h4>
                <p className="text-xs text-[#5D6D7E] italic">
                  &ldquo;{currentDrill.meaning}&rdquo;
                </p>
              </div>

              {/* Pronunciation Audio Controller */}
              <div className="flex items-center justify-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(currentDrill.word)}
                  className="px-4 py-2 bg-[#D35400] text-white font-bold text-xs rounded-xl hover:bg-[#E67E22] transition flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Aloud ({accentLabel})</span>
                </button>
              </div>

              {/* Syllable Tap Buttons */}
              <div className="space-y-2 text-center">
                <p className="text-xs font-bold text-[#2C3E50]">
                  Tap the syllable that carries the PRIMARY STRESS:
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {currentDrill.syllables.map((syl, sIdx) => {
                    const isSelected = selectedSyllableIdx === sIdx;
                    const isCorrect = sIdx === currentDrill.correctIndex;
                    let btnClass = 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400]';

                    if (drillAnswered) {
                      if (isCorrect) {
                        btnClass = 'bg-[#27AE60] text-white border-[#27AE60] shadow-xs font-black';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-[#E74C3C] text-white border-[#E74C3C]';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-[#2C3E50] text-white border-[#2C3E50]';
                    }

                    return (
                      <button
                        key={sIdx}
                        type="button"
                        disabled={drillAnswered}
                        onClick={() => {
                          setSelectedSyllableIdx(sIdx);
                          setDrillAnswered(true);
                          if (sIdx === currentDrill.correctIndex) {
                            setDrillScore((prev) => prev + 1);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-xl border-2 font-mono text-sm font-extrabold uppercase transition cursor-pointer ${btnClass}`}
                      >
                        <span>{syl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drill Feedback */}
              {drillAnswered && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                    selectedSyllableIdx === currentDrill.correctIndex
                      ? 'bg-[#E8F8F5] border-[#27AE60] text-[#145A32]'
                      : 'bg-[#FDEDEC] border-[#E74C3C] text-[#78281F]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs">
                    {selectedSyllableIdx === currentDrill.correctIndex ? (
                      <>
                        <Check className="w-4 h-4 text-[#27AE60]" />
                        <span>Correct! Primary stress is on &ldquo;{currentDrill.syllables[currentDrill.correctIndex]}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-[#E74C3C]" />
                        <span>Incorrect. The primary stress is on &ldquo;{currentDrill.syllables[currentDrill.correctIndex]}&rdquo;</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs opacity-90">{currentDrill.rule}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (drillIndex < listeningDrills.length - 1) {
                          setDrillIndex((prev) => prev + 1);
                          setSelectedSyllableIdx(null);
                          setDrillAnswered(false);
                        } else {
                          // Drill complete, jump to Level 3
                          setActiveLevel(3);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#2C3E50] text-white text-xs font-bold rounded-lg hover:bg-[#34495E] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{drillIndex < listeningDrills.length - 1 ? 'Next Word' : 'Proceed to Level 3'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEARCHABLE AUDIO PRONUNCIATION LIBRARY */}
          <div className="p-6 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                  Searchable Pronunciation Audio Library
                </h4>
                <p className="text-xs text-[#5D6D7E]">
                  Filter words across all 8 rules. Listen in {accentLabel} with syllable breakdown.
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-[#5D6D7E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search words or rules..."
                  className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
                />
              </div>
            </div>

            {/* Grid of Practice Words */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredPracticeWords.map((item, idx) => {
                const isSpeaking = speakingWord === item.word;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 flex flex-col justify-between hover:border-[#D35400] transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-black text-[#D35400] uppercase font-mono bg-white px-1.5 py-0.5 rounded border border-[#FAD7A0]">
                          Rule {item.ruleNumber}
                        </span>
                        <span className="text-[9px] font-semibold text-[#5D6D7E] truncate">
                          {item.category}
                        </span>
                      </div>

                      <div className="font-mono text-sm font-bold text-[#2C3E50] text-center my-2">
                        {item.prefix && <span className="text-[#5D6D7E]">{item.prefix}</span>}
                        <span className="text-[#D35400] font-black text-base uppercase px-1.5 py-0.5 bg-white rounded border border-[#FAD7A0] shadow-2xs">
                          {item.stressed}
                        </span>
                        {item.suffix && <span className="text-[#5D6D7E]">{item.suffix}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(item.word)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSpeaking
                          ? 'bg-[#D35400] text-white animate-pulse'
                          : 'bg-white text-[#D35400] hover:bg-[#D35400] hover:text-white border border-[#FAD7A0]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Speaking...' : `Listen (${accentLabel})`}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3: PRACTICE (GUIDED SPEAKING & VOICE RECORDING) */}
      {activeLevel === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#D35400]">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                  Level 3: Guided Speaking & Syllable Recording
                </h3>
                <p className="text-xs text-[#5D6D7E]">
                  Listen in {accentLabel}, record your own speech, and send directly to the AI Evaluation Engine.
                </p>
              </div>
            </div>
          </div>

          {/* AI EVALUATION STATUS CARD */}
          {aiEvaluationState.status !== 'idle' && (
            <AIEvaluationStatusCard
              status={aiEvaluationState.status}
              response={aiEvaluationState.response}
              errorMessage={aiEvaluationState.errorMessage}
              targetWord={aiEvaluationState.targetWord}
              onRetry={() => {
                const saved = savedRecordings[aiEvaluationState.targetWord];
                if (saved?.blob) {
                  handleEvaluateAudioWithAI(aiEvaluationState.targetWord, saved.blob);
                }
              }}
            />
          )}

          {/* FEATURED PRACTICE WORD: DEVELOPMENT */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400] shadow-sm space-y-5 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0]/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#D35400] text-white text-[10px] font-black uppercase tracking-wider rounded-md font-mono">
                    Featured Target Word
                  </span>
                  <span className="text-xs font-bold text-[#E67E22]">
                    Four-Syllable Noun • Stress on 2nd Syllable
                  </span>
                </div>

                <h4 className="text-2xl font-black text-[#2C3E50] font-heading tracking-tight">
                  Development
                </h4>

                <div className="flex items-center gap-1 font-mono text-base font-extrabold text-[#2C3E50] pt-0.5">
                  <span className="text-[#5D6D7E]">de - </span>
                  <span className="text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border-2 border-[#D35400] font-black text-lg">
                    VEL
                  </span>
                  <span className="text-[#5D6D7E]"> - op - ment</span>
                </div>
              </div>

              {/* Action Buttons for Featured Word */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSpeak('Development')}
                  className="px-3.5 py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-xl text-xs font-bold hover:bg-[#D35400] hover:text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen ({accentLabel})</span>
                </button>

                <button
                  type="button"
                  disabled={aiEvaluationState.status === 'processing'}
                  onClick={() =>
                    setActiveRecordingWord(
                      activeRecordingWord === 'Development' ? null : 'Development'
                    )
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    activeRecordingWord === 'Development'
                      ? 'bg-[#2C3E50] text-white'
                      : 'bg-[#D35400] text-white hover:bg-[#E67E22]'
                  } disabled:opacity-50`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {activeRecordingWord === 'Development' ? 'Close' : '🎤 Record'}
                  </span>
                </button>
              </div>
            </div>

            {/* UniversalRecorder for Development */}
            {(activeRecordingWord === 'Development' || !savedRecordings['Development']) && (
              <div className="pt-2">
                <UniversalRecorder
                  title="Practice Recording: Development"
                  description="Pronounce 'de-VEL-op-ment' clearly with primary stress on VEL."
                  maximumDuration={30}
                  showPlayback={true}
                  showDelete={true}
                  showReRecord={true}
                  isProcessingAI={aiEvaluationState.status === 'processing'}
                  onSubmitForAI={(blob) => handleEvaluateAudioWithAI('Development', blob)}
                  onRecordingComplete={(blob, url) => {
                    setSavedRecordings((prev) => ({
                      ...prev,
                      Development: { blob, url }
                    }));
                  }}
                  onDeleteRecording={() => {
                    setSavedRecordings((prev) => {
                      const updated = { ...prev };
                      delete updated['Development'];
                      return updated;
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* ADDITIONAL GUIDED PRACTICE WORDS LIST */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <h4 className="text-sm font-black text-[#2C3E50] font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D35400]" />
                <span>Additional Pronunciation Practice Words</span>
              </h4>
              <span className="text-xs font-mono font-bold text-[#D35400]">
                {Object.keys(savedRecordings).length} Saved Recordings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPracticeWords.slice(0, 8).map((item, idx) => {
                const isRecordingActive = activeRecordingWord === item.word;
                const hasSavedRecording = !!savedRecordings[item.word];

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:shadow-xs transition space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-black text-[#D35400] uppercase font-mono bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                            Rule {item.ruleNumber}
                          </span>
                          <span className="text-[10px] font-bold text-[#5D6D7E]">
                            {item.category}
                          </span>
                        </div>

                        <h5 className="text-base font-black text-[#2C3E50] font-heading">
                          {item.word}
                        </h5>

                        <div className="font-mono text-xs font-bold text-[#2C3E50] mt-1">
                          {item.prefix && <span className="text-[#5D6D7E]">{item.prefix}</span>}
                          <span className="text-[#D35400] font-black text-sm uppercase px-1 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                            {item.stressed}
                          </span>
                          {item.suffix && <span className="text-[#5D6D7E]">{item.suffix}</span>}
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.word)}
                          className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-lg hover:bg-[#D35400] hover:text-white transition cursor-pointer"
                          title={`Listen in ${accentLabel}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveRecordingWord(isRecordingActive ? null : item.word)
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                            isRecordingActive
                              ? 'bg-[#2C3E50] text-white'
                              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#D35400] hover:text-white'
                          }`}
                        >
                          <Mic className="w-3 h-3" />
                          <span>{isRecordingActive ? 'Close' : 'Record'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Universal Recorder for this word */}
                    {(isRecordingActive || hasSavedRecording) && (
                      <UniversalRecorder
                        title={`Record: ${item.word}`}
                        description={`Pronounce '${item.word}' with stress on ${item.stressed}`}
                        maximumDuration={30}
                        variant="compact"
                        isProcessingAI={aiEvaluationState.status === 'processing'}
                        onSubmitForAI={(blob) => handleEvaluateAudioWithAI(item.word, blob)}
                        onRecordingComplete={(blob, url) => {
                          setSavedRecordings((prev) => ({
                            ...prev,
                            [item.word]: { blob, url }
                          }));
                        }}
                        onDeleteRecording={() => {
                          setSavedRecordings((prev) => {
                            const updated = { ...prev };
                            delete updated[item.word];
                            return updated;
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 4: AI ASSESSMENT STUDIO (WORD, PHRASE, SENTENCE, PARAGRAPH) */}
      {activeLevel === 4 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#D35400]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                  Level 4: AI Pronunciation Assessment Engine
                </h3>
                <p className="text-xs text-[#5D6D7E]">
                  Universal evaluation engine for Words, Phrases, and Sentences evaluating accent ({accentLabel}), stress, and fluency.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVITY TYPE SELECTOR TABS */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#FAD7A0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2C3E50] font-heading uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D35400]" />
                <span>Select Assessment Scope</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                Activity: {selectedActivityType}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'WORD' as ActivityType, label: 'Single Word', desc: 'Syllable & Stress Focus' },
                { type: 'PHRASE' as ActivityType, label: 'Short Phrase', desc: 'Connected Speech' },
                { type: 'SENTENCE' as ActivityType, label: 'Sentence', desc: 'Intonation & Rhythm' },
                { type: 'PARAGRAPH' as ActivityType, label: 'Paragraph', desc: 'Fluency & Cadence' }
              ].map((act) => {
                const isSelected = selectedActivityType === act.type;
                return (
                  <button
                    key={act.type}
                    type="button"
                    onClick={() => {
                      setSelectedActivityType(act.type);
                      if (act.type === 'WORD') setCustomTargetText('Communication');
                      if (act.type === 'PHRASE') setCustomTargetText('Economic development and growth');
                      if (act.type === 'SENTENCE')
                        setCustomTargetText('Effective communication improves career opportunities significantly.');
                      if (act.type === 'PARAGRAPH')
                        setCustomTargetText(
                          'Clear pronunciation and word stress are essential tools for campus placements, enabling students to convey complex technical concepts with confidence and intelligibility.'
                        );
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C3E50] text-white border-[#2C3E50] shadow-sm'
                        : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:border-[#D35400]'
                    }`}
                  >
                    <div className="text-xs font-black font-heading">{act.label}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-[#FAD7A0]' : 'text-[#5D6D7E]'}`}>
                      {act.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARGET TEXT & RECORDER CARD */}
          <div className="p-6 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#D35400] uppercase font-mono">
                Target {selectedActivityType} Practice
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(customTargetText)}
                className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg hover:bg-[#D35400] hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Sample ({accentLabel})</span>
              </button>
            </div>

            <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <p className="text-sm sm:text-base font-extrabold text-[#2C3E50] leading-relaxed">
                &ldquo;{customTargetText}&rdquo;
              </p>
            </div>

            <UniversalRecorder
              title={`Assess: ${selectedActivityType}`}
              description={`Read aloud: "${customTargetText.slice(0, 60)}${customTargetText.length > 60 ? '...' : ''}"`}
              maximumDuration={60}
              showPlayback={true}
              showDelete={true}
              showReRecord={true}
              isProcessingAI={aiEvaluationState.status === 'processing'}
              onSubmitForAI={(blob) => {
                handleEvaluateAudioWithAI(customTargetText, blob, selectedActivityType);
              }}
              onRecordingComplete={(blob, url) => {
                setLevel4AudioBlob({ blob, url });
              }}
              onDeleteRecording={() => {
                setLevel4AudioBlob(null);
              }}
            />
          </div>

          {/* AI PROCESSING & STATUS INDICATOR */}
          {aiEvaluationState.status !== 'idle' && (
            <AIEvaluationStatusCard
              status={aiEvaluationState.status}
              response={aiEvaluationState.response}
              errorMessage={aiEvaluationState.errorMessage}
              targetWord={aiEvaluationState.targetWord}
              onRetry={() => {
                if (level4AudioBlob?.blob) {
                  handleEvaluateAudioWithAI(customTargetText, level4AudioBlob.blob, selectedActivityType);
                }
              }}
            />
          )}

          {/* AI EVALUATION REPORT DISPLAY */}
          {(aiEvaluationState.status === 'success' || wordHistories[customTargetText]) && (
            <div className="space-y-6">
              <AIEvaluationReport
                targetWord={customTargetText}
                history={wordHistories[customTargetText]}
                currentResult={aiEvaluationState.response?.evaluation || null}
                onSelectPracticeWord={(word) => {
                  setSelectedActivityType('WORD');
                  setCustomTargetText(word);
                }}
                onRetryRecording={() => {}}
              />

              {/* IS GENERATING COACH LOADING CARD */}
              {isGeneratingCoach && (
                <div className="p-6 rounded-2xl bg-[#FFF8F0] border-2 border-[#D35400] text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-[#D35400] font-black font-heading text-sm">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>AI Learning Coach Analyzing Performance...</span>
                  </div>
                  <p className="text-xs text-[#5D6D7E] font-medium">
                    Synthesizing 9 speech metrics and generating today's adaptive learning plan...
                  </p>
                </div>
              )}

              {/* AI LEARNING COACH DASHBOARD */}
              {aiCoachGuidance && !isGeneratingCoach && (
                <AICoachDashboard
                  guidance={aiCoachGuidance}
                  targetText={customTargetText}
                  onSelectPracticeWord={(word) => {
                    setSelectedActivityType('WORD');
                    setCustomTargetText(word);
                  }}
                  onSelectNextActivity={() => {
                    setActiveLevel(5);
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* LEVEL 5: MASTERY CHALLENGE & PLACEMENT CERTIFICATION */}
      {activeLevel === 5 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-[#D35400]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                  Level 5: Word Stress Mastery & Placement Challenge
                </h3>
                <p className="text-xs text-[#5D6D7E]">
                  Complete this 8-question placement drill to certify your accent and word stress mastery.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#FAD7A0]">
              Score: {calculatedChallengeScore} / {challengeQuestions.length}
            </span>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-4">
            {challengeQuestions.map((q, qIdx) => {
              const selectedAns = challengeAnswers[qIdx];
              const isAnswered = selectedAns !== undefined;
              const isCorrect = selectedAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs hover:border-[#D35400]/60 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FFF8F0] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#D35400] text-white text-[10px] font-black uppercase rounded font-mono">
                        Q{qIdx + 1}
                      </span>
                      <h4 className="text-base font-black text-[#2C3E50] font-heading">
                        {q.word}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(q.word)}
                      className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-lg text-xs font-bold hover:bg-[#D35400] hover:text-white transition flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear ({accentLabel})</span>
                    </button>
                  </div>

                  {/* Syllable Options */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-[#5D6D7E] font-medium">
                      Select the syllable that receives PRIMARY STRESS:
                    </span>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {q.syllables.map((syl, sIdx) => {
                        const isThisSelected = selectedAns === sIdx;
                        let btnStyle = 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]/40';

                        if (challengeSubmitted) {
                          if (sIdx === q.correctIndex) {
                            btnStyle = 'bg-[#27AE60] text-white border-[#27AE60] font-black';
                          } else if (isThisSelected && !isCorrect) {
                            btnStyle = 'bg-[#E74C3C] text-white border-[#E74C3C]';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'bg-[#2C3E50] text-white border-[#2C3E50]';
                        }

                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              if (!challengeSubmitted) {
                                setChallengeAnswers((prev) => ({
                                  ...prev,
                                  [qIdx]: sIdx
                                }));
                              }
                            }}
                            className={`px-3.5 py-1.5 rounded-xl border-2 font-mono text-xs font-bold uppercase transition cursor-pointer ${btnStyle}`}
                          >
                            <span>{syl}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rule explanation on submit */}
                  {challengeSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 border ${
                        isCorrect
                          ? 'bg-[#E8F8F5] border-[#27AE60] text-[#145A32]'
                          : 'bg-[#FDEDEC] border-[#E74C3C] text-[#78281F]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <Check className="w-3.5 h-3.5 text-[#27AE60]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#E74C3C]" />
                        )}
                        <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                      </div>
                      <p>{q.rule}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SUBMIT & COMPLETION BANNER */}
          {!challengeSubmitted ? (
            <div className="p-6 rounded-2xl bg-white border-2 border-[#D35400] shadow-md text-center space-y-3">
              <h4 className="text-base font-black text-[#2C3E50] font-heading">
                Ready to Complete Placement Challenge?
              </h4>
              <p className="text-xs text-[#5D6D7E]">
                {Object.keys(challengeAnswers).length} of {challengeQuestions.length} questions answered.
              </p>

              <button
                type="button"
                disabled={Object.keys(challengeAnswers).length === 0}
                onClick={() => {
                  setChallengeSubmitted(true);
                  if (onCompleteActivity) {
                    onCompleteActivity();
                  }
                }}
                className="px-6 py-2.5 bg-[#D35400] text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#E67E22] transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Submit & Verify Answers
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#27AE60] shadow-md space-y-4 animate-fadeIn text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F8F5] border border-[#27AE60] flex items-center justify-center text-[#27AE60] mx-auto">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 bg-[#27AE60] text-white text-[10px] font-black uppercase tracking-wider rounded-full font-mono">
                  Mastery Achieved
                </span>
                <h3 className="text-xl font-black text-[#2C3E50] font-heading">
                  Word Stress Certification Complete!
                </h3>
                <p className="text-xs text-[#5D6D7E] max-w-md mx-auto">
                  You scored <strong className="text-[#27AE60]">{calculatedChallengeScore} / {challengeQuestions.length}</strong> in the Level 5 Mastery Challenge with {accentLabel} accent.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setChallengeAnswers({});
                    setChallengeSubmitted(false);
                  }}
                  className="px-4 py-2 bg-white border border-[#FAD7A0] text-[#2C3E50] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>

                {onNextActivity && (
                  <button
                    type="button"
                    onClick={onNextActivity}
                    className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-black rounded-xl hover:bg-[#E67E22] transition flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Next Activity</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
