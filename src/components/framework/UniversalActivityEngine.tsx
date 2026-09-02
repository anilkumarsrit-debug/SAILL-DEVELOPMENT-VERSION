import React, { useState } from 'react';
import {
  Target,
  BookOpen,
  GraduationCap,
  Sparkles,
  PenTool,
  Mic,
  Volume2,
  CheckCircle2,
  Award,
  Clock,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  MessageSquareQuote,
  HelpCircle,
  Bot,
  HeartHandshake,
  TrendingUp,
  UserCheck,
  FileText,
  ShieldCheck,
  Layers,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { ModuleData } from '../../types';
import { UniversalRecorder } from '../laboratory/UniversalRecorder';
import { ActivitySubmissionBox } from '../common/ActivitySubmissionBox';

export type StageId =
  | 'objective'
  | 'preparation'
  | 'learn'
  | 'guided'
  | 'independent'
  | 'evaluation'
  | 'reflection'
  | 'achievement';

export interface ActivityConfig {
  id: string;
  title: string;
  journeyNumber: number;
  activityNumber: number;
  totalActivities: number;
  learningOutcome: string;
  estimatedTime: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  skillsCovered: string[];
  preparation: {
    warmUp: string;
    priorKnowledge: string[];
    keyVocabulary: { word: string; phonetic: string; definition: string }[];
    listeningFocus?: string;
  };
  learnContent: {
    textCards: string[];
    examples: { title: string; text: string; audioUrl?: string }[];
    tableData?: { headers: string[]; rows: string[][] };
    proNote: string;
  };
  guidedPractice: {
    prompt: string;
    targetAudioText: string;
    hintText: string;
  };
  independentPractice: {
    prompt: string;
    instructions: string;
  };
  reflectionPrompts: string[];
}

interface UniversalActivityEngineProps {
  module?: ModuleData;
  customConfig?: ActivityConfig;
  initialStage?: StageId;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onSaveProgress?: () => void;
}

export const UniversalActivityEngine: React.FC<UniversalActivityEngineProps> = ({
  module,
  customConfig,
  initialStage = 'objective',
  onNavigateNext,
  onNavigatePrev,
  onSaveProgress
}) => {
  // Build fallback configuration from module or default if customConfig is not provided
  const config: ActivityConfig = customConfig || {
    id: module?.id || 'm1-a1',
    title: module?.title ? `${module.title} Core Practice` : 'Universal Speech & Phonetics Drill',
    journeyNumber: 1,
    activityNumber: 1,
    totalActivities: 12,
    learningOutcome: module?.shortDesc || 'Master core articulation, phonetic accuracy, and professional speech delivery.',
    estimatedTime: `${module?.estimatedMinutes || 15} Mins`,
    difficulty: 'Intermediate',
    skillsCovered: ['Phonetic Clarity', 'Stress & Intonation', 'Pacing & Cadence', 'Professional Fluency'],
    preparation: {
      warmUp: 'Perform a 30-second vocal warm-up. Relax jaw muscles and take deep diaphragmatic breaths before speech recording.',
      priorKnowledge: [
        'Awareness of English vowel and consonant sound positions',
        'Basic understanding of syllable stress in multisyllabic words',
        'Ability to record and listen to voice playbacks'
      ],
      keyVocabulary: [
        { word: 'Articulation', phonetic: '/ɑːˌtɪk.jəˈleɪ.ʃən/', definition: 'Clear and distinct utterance of speech sounds in words.' },
        { word: 'Intonation', phonetic: '/ˌɪn.təˈneɪ.ʃən/', definition: 'The rise and fall of pitch in spoken language phrases.' },
        { word: 'Cadence', phonetic: '/ˈkeɪ.dəns/', definition: 'Rhythmic flow or cadence in oral presentation delivery.' }
      ],
      listeningFocus: 'Listen closely to the pitch variation at punctuation boundaries and natural breath pauses.'
    },
    learnContent: {
      textCards: [
        'Effective spoken communication relies on exact phoneme articulation and natural rhythm.',
        'Avoid MTI (Mother Tongue Influence) by maintaining consistent vowel lengths and explosive stop consonants.',
        'Structured pauses give listeners time to absorb key technical concepts in professional contexts.'
      ],
      examples: [
        {
          title: 'Neutral Articulation Model',
          text: '"Good morning. I am presenting our research findings on artificial intelligence system architecture."'
        },
        {
          title: 'Emphatic Stress Model',
          text: '"The primary component ensures high reliability and zero downtime during high-traffic operations."'
        }
      ],
      tableData: {
        headers: ['Feature', 'Conversational Tone', 'Professional Lab Tone'],
        rows: [
          ['Pacing', '140-160 WPM (Variable)', '120-130 WPM (Measured)'],
          ['Pitch Drop', 'Informal drop at end', 'Decisive pitch drop at full stop'],
          ['Clarity', 'Relaxed liaison', 'Precise consonant enunciations']
        ]
      },
      proNote: 'SRIT Lab Educator Tip: Record yourself twice. The second recording typically shows a 15% increase in vocal clarity.'
    },
    guidedPractice: {
      prompt: 'Listen to the target phrase, review the AI hint, and record your voice in guided mode.',
      targetAudioText: 'Artificial intelligence transforms modern engineering solutions with real-time accuracy.',
      hintText: 'Stress the third syllable in "ar-ti-FI-cial" and the second syllable in "in-TEL-li-gence".'
    },
    independentPractice: {
      prompt: 'Independent Speech Recording & Submission',
      instructions: 'Deliver a concise 45-second monologue summarizing your learning objectives without reading verbatim.'
    },
    reflectionPrompts: [
      'What specific sound or technique did you improve during this activity?',
      'Which speech aspect was most challenging (e.g. stress, pace, vocabulary)?',
      'How will you apply this communicative strategy in upcoming presentations?'
    ]
  };

  const [currentStage, setCurrentStage] = useState<StageId>(initialStage);
  const [activeGuidedStep, setActiveGuidedStep] = useState<'listen' | 'example' | 'hint' | 'record' | 'compare' | 'retry'>('listen');
  const [showGuidedHint, setShowGuidedHint] = useState(false);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [guidedRecordedUrl, setGuidedRecordedUrl] = useState<string | null>(null);
  const [independentRecordedUrl, setIndependentRecordedUrl] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);

  // Reflection responses state
  const [reflectionResponses, setReflectionResponses] = useState<Record<number, string>>({
    0: '',
    1: '',
    2: ''
  });

  const stages: { id: StageId; title: string; number: number; icon: React.FC<{ className?: string }> }[] = [
    { id: 'objective', title: '1. Objective', number: 1, icon: Target },
    { id: 'preparation', title: '2. Preparation', number: 2, icon: BookOpen },
    { id: 'learn', title: '3. Learn', number: 3, icon: GraduationCap },
    { id: 'guided', title: '4. Guided Practice', number: 4, icon: Sparkles },
    { id: 'independent', title: '5. Independent Practice', number: 5, icon: PenTool },
    { id: 'evaluation', title: '6. AI Evaluation', number: 6, icon: Bot },
    { id: 'reflection', title: '7. Reflection', number: 7, icon: MessageSquareQuote },
    { id: 'achievement', title: '8. Achievement', number: 8, icon: Award }
  ];

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveProgress) onSaveProgress();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAudioModelPlay = () => {
    setIsPlayingModelAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(config.guidedPractice.targetAudioText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingModelAudio(false);
      utterance.onerror = () => setIsPlayingModelAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingModelAudio(false), 2500);
    }
  };

  const currentStageIndex = stages.findIndex((s) => s.id === currentStage);

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStage(stages[currentStageIndex + 1].id);
    } else if (onNavigateNext) {
      onNavigateNext();
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStage(stages[currentStageIndex - 1].id);
    } else if (onNavigatePrev) {
      onNavigatePrev();
    }
  };

  return (
    <div className="srit-card p-4 sm:p-6 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-6 shadow-sm">
      {/* UNIVERSAL TOP ENGINE HEADER & NAVIGATION */}
      <div className="bg-[#FFF8F0] border border-[#FAD7A0] p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D35400] text-white rounded-lg font-black text-xs">
              ALAE Engine
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#D35400]">
                  Activity {config.activityNumber} of {config.totalActivities}
                </span>
                <span className="text-[10px] font-extrabold text-[#5D6D7E] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded">
                  {config.difficulty}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#2C3E50] font-heading">
                {config.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#2C3E50] text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-[#D35400]" />
              <span>{isSaved ? 'Progress Saved ✓' : 'Save Progress'}</span>
            </button>

            <button
              onClick={() => {
                setGuidedRecordedUrl(null);
                setIndependentRecordedUrl(null);
                setIsEvaluated(false);
              }}
              className="px-3.5 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Activity</span>
            </button>
          </div>
        </div>

        {/* 8-STAGE STEPPER NAVIGATION BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 pt-1">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isActive = currentStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setCurrentStage(stg.id)}
                className={`p-2 rounded-lg text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stg.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* EMBEDDED REUSABLE AI COACH BAR */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-4 rounded-xl border border-[#FAD7A0]/30 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#FAD7A0]">
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI Coach Real-time Activity Guidance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-300/30">
              Confidence Indicator: 94% High Reliability
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1">
            <span className="text-amber-300 font-bold text-[10px] uppercase flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Today's Tip
            </span>
            <p className="text-gray-200 text-[11px]">Enunciate word endings clearly to ensure high AI speech accuracy.</p>
          </div>

          <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1">
            <span className="text-indigo-300 font-bold text-[10px] uppercase flex items-center gap-1">
              <Target className="w-3 h-3" /> Suggested Practice
            </span>
            <p className="text-gray-200 text-[11px]">Perform Stage 4 Guided Practice drill before independent recording.</p>
          </div>

          <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1">
            <span className="text-emerald-300 font-bold text-[10px] uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Est. Practice Time
            </span>
            <p className="text-gray-200 text-[11px]">{config.estimatedTime} (~5 mins active recording)</p>
          </div>

          <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1">
            <span className="text-pink-300 font-bold text-[10px] uppercase flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" /> Motivational Message
            </span>
            <p className="text-gray-200 text-[11px]">"Precision in practice creates confidence in performance!"</p>
          </div>
        </div>
      </div>

      {/* STAGE CONTENT RENDERING */}

      {/* STAGE 1: LEARNING OBJECTIVE */}
      {currentStage === 'objective' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#D35400] text-white rounded-lg">
                  <Target className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#2C3E50]">Stage 1: Learning Objective</h3>
                  <p className="text-xs text-[#5D6D7E]">Target outcomes and skill competencies for this activity</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#D35400] text-white text-xs font-black rounded-lg">
                Estimated Time: {config.estimatedTime}
              </span>
            </div>

            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2">
              <h4 className="text-xs font-black uppercase text-[#D35400]">Primary Learning Outcome</h4>
              <p className="text-xs sm:text-sm text-[#2C3E50] font-medium leading-relaxed">
                {config.learningOutcome}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#E67E22]">Difficulty Rating</span>
                <p className="text-xs font-extrabold text-[#2C3E50]">{config.difficulty} Level</p>
              </div>

              <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5">
                <span className="text-[10px] font-black uppercase text-indigo-600">Curriculum Alignment</span>
                <p className="text-xs font-extrabold text-[#2C3E50]">SRIT R26 Academic Standards</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#5D6D7E]">Target Skills Covered</h4>
              <div className="flex flex-wrap gap-2">
                {config.skillsCovered.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg shadow-2xs"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PREPARATION */}
      {currentStage === 'preparation' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <span className="p-2 bg-[#D35400] text-white rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">Stage 2: Preparation & Warm-up</h3>
                <p className="text-xs text-[#5D6D7E]">Pre-activity orientation, prior knowledge & vocabulary focus</p>
              </div>
            </div>

            {/* Warm-up Section */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
              <h4 className="text-xs font-black uppercase text-[#D35400] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#E67E22]" />
                <span>Vocal & Cognitive Warm-Up</span>
              </h4>
              <p className="text-xs text-[#2C3E50] font-medium leading-relaxed">
                {config.preparation.warmUp}
              </p>
            </div>

            {/* Prior Knowledge Section */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <h4 className="text-xs font-black uppercase text-[#2C3E50]">Prior Knowledge Prerequisites</h4>
              <ul className="space-y-1.5">
                {config.preparation.priorKnowledge.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#5D6D7E] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Vocabulary Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#D35400]">Key Vocabulary Focus</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {config.preparation.keyVocabulary.map((vocab, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-[#2C3E50]">{vocab.word}</h5>
                      <span className="text-[10px] text-[#E67E22] font-mono">{vocab.phonetic}</span>
                    </div>
                    <p className="text-[11px] text-[#5D6D7E]">{vocab.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Listening Focus (when applicable) */}
            {config.preparation.listeningFocus && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                <h4 className="text-xs font-black text-indigo-900 uppercase flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-indigo-600" />
                  <span>Listening Focus Focus Area</span>
                </h4>
                <p className="text-xs text-indigo-950 font-medium">{config.preparation.listeningFocus}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: LEARN */}
      {currentStage === 'learn' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <span className="p-2 bg-[#D35400] text-white rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">Stage 3: Learn Content</h3>
                <p className="text-xs text-[#5D6D7E]">Structured pedagogical concepts, audio examples & comparisons</p>
              </div>
            </div>

            {/* Text Concept Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {config.learnContent.textCards.map((cardText, idx) => (
                <div key={idx} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#D35400] block">Concept Card #{idx + 1}</span>
                  <p className="text-xs text-[#2C3E50] font-medium leading-relaxed">{cardText}</p>
                </div>
              ))}
            </div>

            {/* Worked Examples */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#D35400]">Worked Examples & Models</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config.learnContent.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#2C3E50]">{ex.title}</h5>
                      <button
                        onClick={handleAudioModelPlay}
                        className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-bold rounded flex items-center gap-1 hover:bg-[#FAD7A0] cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen Model</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#5D6D7E] italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      {ex.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Representation */}
            {config.learnContent.tableData && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#D35400]">Analytical Comparison Matrix</h4>
                <div className="overflow-x-auto border border-[#FAD7A0] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF8F0] text-[#D35400] font-black uppercase text-[10px]">
                      <tr>
                        {config.learnContent.tableData.headers.map((h, i) => (
                          <th key={i} className="p-3 border-b border-[#FAD7A0]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FAD7A0]">
                      {config.learnContent.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-amber-50/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-[#2C3E50] font-medium">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Educator Pro Note */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>SRIT Educator Pro Note</span>
              </h4>
              <p className="text-xs text-amber-950 font-medium">{config.learnContent.proNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: GUIDED PRACTICE */}
      {currentStage === 'guided' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <span className="p-2 bg-[#D35400] text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">Stage 4: Guided Practice</h3>
                <p className="text-xs text-[#5D6D7E]">Step-by-step guided workflow with AI model comparison and hints</p>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[
                { id: 'listen', label: '1. Listen Model' },
                { id: 'example', label: '2. Observe Example' },
                { id: 'hint', label: '3. View Hint' },
                { id: 'record', label: '4. Voice Record' },
                { id: 'compare', label: '5. Compare Audio' }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveGuidedStep(step.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition shrink-0 cursor-pointer ${
                    activeGuidedStep === step.id
                      ? 'bg-[#D35400] text-white shadow-2xs'
                      : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Target Audio Prompt */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
              <h4 className="text-xs font-black uppercase text-[#D35400]">Guided Target Drill</h4>
              <p className="text-sm font-bold text-[#2C3E50] bg-white p-3 rounded-lg border border-[#FAD7A0]">
                "{config.guidedPractice.targetAudioText}"
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAudioModelPlay}
                  className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingModelAudio ? 'Playing Target Model...' : 'Play Native Audio Model'}</span>
                </button>

                <button
                  onClick={() => setShowGuidedHint(!showGuidedHint)}
                  className="px-4 py-2 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#D35400] font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{showGuidedHint ? 'Hide Phonetic Hint' : 'Show AI Hint'}</span>
                </button>
              </div>

              {showGuidedHint && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium rounded-lg animate-fadeIn">
                  💡 <strong>AI Phonetic Hint:</strong> {config.guidedPractice.hintText}
                </div>
              )}
            </div>

            {/* Guided Universal Voice Recorder */}
            <UniversalRecorder
              onRecordingComplete={(audioBlob, duration) => {
                const url = URL.createObjectURL(audioBlob);
                setGuidedRecordedUrl(url);
                setActiveGuidedStep('compare');
              }}
            />

            {guidedRecordedUrl && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-green-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Guided Recording Saved & Analyzed</span>
                  </span>
                  <span className="text-[10px] bg-green-200 text-green-900 px-2 py-0.5 rounded">91% Match Score</span>
                </div>
                <audio src={guidedRecordedUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 5: INDEPENDENT PRACTICE */}
      {currentStage === 'independent' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <span className="p-2 bg-[#D35400] text-white rounded-lg">
                <PenTool className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">Stage 5: Independent Practice</h3>
                <p className="text-xs text-[#5D6D7E]">Autonomous speech execution, voice submission & evaluation trigger</p>
              </div>
            </div>

            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
              <h4 className="text-xs font-black uppercase text-[#D35400]">{config.independentPractice.prompt}</h4>
              <p className="text-xs text-[#2C3E50] font-medium leading-relaxed">
                {config.independentPractice.instructions}
              </p>
            </div>

            <UniversalRecorder
              onRecordingComplete={(audioBlob) => {
                const url = URL.createObjectURL(audioBlob);
                setIndependentRecordedUrl(url);
                setIsEvaluated(true);
              }}
            />

            {independentRecordedUrl && (
              <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#2C3E50]">
                  <span>Independent Voice Recording Submission</span>
                  <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                    Ready for AI Evaluation
                  </span>
                </div>
                <audio src={independentRecordedUrl} controls className="w-full h-8" />
                <button
                  onClick={() => setCurrentStage('evaluation')}
                  className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Proceed to Stage 6: AI Evaluation Panel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 6: AI EVALUATION */}
      {currentStage === 'evaluation' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-5 shadow-xs">
            <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
                  <Bot className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
                    Stage 6: AI Speech Evaluation Panel
                  </h3>
                  <p className="text-[11px] text-[#5D6D7E]">Detailed AI Speech Diagnostic Report</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#D35400]">89%</span>
                <span className="text-[10px] font-extrabold text-[#5D6D7E] uppercase block">Overall AI Score</span>
              </div>
            </div>

            {/* Skill-wise Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Pronunciation</span>
                <span className="text-xl font-extrabold text-[#D35400]">88%</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Word Stress</span>
                <span className="text-xl font-extrabold text-[#E67E22]">92%</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Fluency</span>
                <span className="text-xl font-extrabold text-[#27AE60]">86%</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-[#5D6D7E] block">Clarity</span>
                <span className="text-xl font-extrabold text-indigo-600">90%</span>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                <h4 className="text-xs font-black text-green-900 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Key Strengths Identified:</span>
                </h4>
                <ul className="space-y-1 text-xs text-green-950 font-medium pl-1">
                  <li className="flex items-start gap-1.5">• High phonetic accuracy on stop consonants.</li>
                  <li className="flex items-start gap-1.5">• Steady speaking cadence without long hesitation pauses.</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Areas for Improvement:</span>
                </h4>
                <ul className="space-y-1 text-xs text-amber-950 font-medium pl-1">
                  <li className="flex items-start gap-1.5">• Maintain pitch modulation at sentence full-stops.</li>
                  <li className="flex items-start gap-1.5">• Slightly lengthen stressed vowel duration in multi-syllable terms.</li>
                </ul>
              </div>
            </div>

            {/* Faculty Submission and Status Record Box */}
            <ActivitySubmissionBox
              moduleId={config.id || 'm1-a1'}
              moduleTitle={config.title}
              activityId={`uae-${config.id || 'm1-a1'}`}
              activityTitle={config.title}
              activityType="speaking_practice"
              activityCategory="Universal Activity Engine"
              textContent={config.guidedPractice.prompt}
              audioDataUrl={independentRecordedUrl || guidedRecordedUrl}
              audioDurationSeconds={25}
              aiScore={89}
              aiFeedback="Stop consonants, pitch cadence, and speech fluency evaluated."
            />
          </div>
        </div>
      )}

      {/* STAGE 7: REFLECTION */}
      {currentStage === 'reflection' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
              <span className="p-2 bg-[#D35400] text-white rounded-lg">
                <MessageSquareQuote className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">Stage 7: Guided Reflection</h3>
                <p className="text-xs text-[#5D6D7E]">Self-evaluation, learning insights & forward goal setting</p>
              </div>
            </div>

            <div className="space-y-4">
              {config.reflectionPrompts.map((prompt, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
                  <label className="text-xs font-bold text-[#D35400] block">
                    Prompt {idx + 1}: {prompt}
                  </label>
                  <textarea
                    rows={2}
                    value={reflectionResponses[idx] || ''}
                    onChange={(e) =>
                      setReflectionResponses({
                        ...reflectionResponses,
                        [idx]: e.target.value
                      })
                    }
                    placeholder="Type your reflection answer here..."
                    className="w-full p-3 rounded-lg border border-[#FAD7A0] bg-white text-xs focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Guided Reflection Answers</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 8: ACHIEVEMENT */}
      {currentStage === 'achievement' && (
        <div className="p-8 bg-gradient-to-br from-white via-[#FFF8F0] to-orange-50 border-2 border-[#D35400] text-center space-y-6 rounded-2xl shadow-md animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D35400] to-[#E67E22] text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg border-2 border-white">
            <Award className="w-10 h-10 text-amber-200" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 text-xs font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Activity Completed
            </span>
            <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
              Congratulations! {config.title} Mastered
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6D7E] leading-relaxed">
              You have completed all eight stages of the Universal AI Learning Activity Engine for this module.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-white border border-[#FAD7A0] rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-orange-100 text-[#D35400] rounded-xl font-black">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2C3E50]">Completion Badge</h4>
                <p className="text-[10px] text-[#5D6D7E]">{config.title} • 100 XP Earned</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-green-700 bg-green-100 px-2.5 py-1 rounded">
              Unlocked ✓
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentStage('objective')}
              className="px-6 py-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#2C3E50] font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#D35400]" />
              <span>Review Stages</span>
            </button>

            {onNavigateNext && (
              <button
                onClick={onNavigateNext}
                className="px-8 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continue to Next Activity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM STAGE NAVIGATION BAR */}
      <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={handlePrevStage}
          disabled={currentStageIndex === 0 && !onNavigatePrev}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            currentStageIndex === 0 && !onNavigatePrev
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Stage</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-[#2C3E50]">
          <span className="px-3 py-1 bg-white border border-[#FAD7A0] text-[#D35400] rounded-lg">
            Stage {currentStageIndex + 1} of 8: {stages[currentStageIndex].title}
          </span>
        </div>

        <button
          onClick={handleNextStage}
          className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>{currentStageIndex === stages.length - 1 ? 'Finish Activity' : 'Next Stage'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
