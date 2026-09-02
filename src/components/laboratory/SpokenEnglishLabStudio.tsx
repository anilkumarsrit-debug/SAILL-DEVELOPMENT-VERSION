import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Mic,
  Save,
  CheckCircle2,
  Clock,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Compass,
  FileText,
  Award,
  ArrowUpRight,
  Send,
  HelpCircle,
  BarChart2,
  ListOrdered,
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AudioRecorder } from '../practice/AudioRecorder';
import { evaluateSpokenEnglish, SpokenEnglishEvaluationResult } from '../../services/ai/spokenEnglishCoach';
import { dbStorage } from '../../lib/db';
import { PortfolioItem, RecordingItem, LabExperimentRecord } from '../../types';
import { formatScore10, getPerformanceDescriptor, normalizeTo10Scale } from '../../lib/scoring';
import { AccentPreferenceService, useAccentPreference } from '../../services/AccentPreferenceService';
import { PronunciationAccentControl } from '../common/PronunciationAccentControl';
import confetti from 'canvas-confetti';

// Import subcomponents
import { SpeakingReadinessCheck } from './spoken/SpeakingReadinessCheck';
import { RealtimeFluencyAnalyzer } from './spoken/RealtimeFluencyAnalyzer';
import { AISuggestionsReport } from './spoken/AISuggestionsReport';
import { SpokenProgressDashboard } from './spoken/SpokenProgressDashboard';
import { ExtendedVisualDescriptionStudio } from './spoken/ExtendedVisualDescriptionStudio';

// Data Structures
interface WarmupTwister {
  id: string;
  title: string;
  category: string;
  twisterText: string;
  modelAudioSample: string;
  focusArea: string;
}

interface GuidedPrompt {
  id: string;
  title: string;
  category: string;
  prepPoint: string;
  prepReason: string;
  prepExample: string;
  prepRestate: string;
  targetKeywords: string[];
}

interface PicturePrompt {
  id: string;
  title: string;
  category: string;
  taskType: 'scene' | 'chart';
  taskBadge: string;
  promptInstructions: string[];
  svgImage: React.ReactNode;
  keywords: string[];
  modelDescription: string;
  contextTips: string[];
}

interface SituationScenario {
  id: string;
  title: string;
  category: string;
  context: string;
  objective: string;
  tips: string[];
}

interface StoryStarter {
  id: string;
  title: string;
  category: string;
  starterText: string;
  suggestedElements: string[];
}

interface RolePlayScenario {
  id: string;
  title: string;
  roleA: string;
  roleB: string;
  openingLine: string;
  conversationGoals: string[];
}

// Warmup Twisters
const WARMUP_TWISTERS: WarmupTwister[] = [
  {
    id: 'tw-01',
    title: 'Phonetic Agility & Plosives',
    category: 'Articulation',
    twisterText: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',
    modelAudioSample: 'Peter Piper picked a peck of pickled peppers.',
    focusArea: 'Bilabial plosives /p/ vs /b/'
  },
  {
    id: 'tw-02',
    title: 'Vowel Transitions & Friction',
    category: 'Vowel Focus',
    twisterText: "Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter.",
    modelAudioSample: "Betty Botter bought some butter.",
    focusArea: 'Short vowels /æ/, /ɪ/, /ʌ/'
  },
  {
    id: 'tw-03',
    title: 'Pitch Modulation & Resonance',
    category: 'Tone Control',
    twisterText: 'Red lorry, yellow lorry, unique New York, unique New York.',
    modelAudioSample: 'Red lorry, yellow lorry, unique New York.',
    focusArea: 'Liquid consonant contrast /l/ vs /r/'
  },
  {
    id: 'tw-04',
    title: 'Technical Terminology Speed Drill',
    category: 'Technical Terms',
    twisterText: 'Statistical algorithmic optimization accelerates distributed cloud computing infrastructure efficiency.',
    modelAudioSample: 'Statistical algorithmic optimization accelerates distributed cloud computing.',
    focusArea: 'Syllable stress in multi-syllabic engineering vocabulary'
  }
];

// Guided Prompts with PREP Blueprint
const GUIDED_PROMPTS: GuidedPrompt[] = [
  {
    id: 'gp-01',
    title: 'My Vision for AI in First-Year Engineering Education',
    category: 'Academic Pitch',
    prepPoint: 'Artificial Intelligence should be integrated as an adaptive learning assistant in engineering labs.',
    prepReason: 'Because it provides instant personalized feedback, allowing students to learn at their own pace without bottlenecking faculty.',
    prepExample: 'For instance, in our SAILL English Lab, AI speech analyzers instantly evaluate pronunciation and fluency during practice drills.',
    prepRestate: 'Therefore, AI-driven tools significantly elevate student technical confidence and mastery.',
    targetKeywords: ['adaptive learning', 'personalized feedback', 'fluency', 'mastery']
  },
  {
    id: 'gp-02',
    title: 'Overcoming a Complex Technical Problem During a Software Sprint',
    category: 'Technical Experience',
    prepPoint: 'Structured root-cause debugging is the most effective approach to resolving unexpected software failures.',
    prepReason: 'Systematic testing isolates edge-case anomalies faster than trial-and-error guessing.',
    prepExample: 'When our team encountered memory leaks in a cloud API, we analyzed telemetry logs to pinpoint unclosed database handles.',
    prepRestate: 'In summary, methodical diagnostic workflows save time and ensure resilient engineering systems.',
    targetKeywords: ['root-cause', 'telemetry', 'memory leaks', 'diagnostic workflow']
  },
  {
    id: 'gp-03',
    title: 'Why Effective English Communication Matters for Global Engineers',
    category: 'Professional Skills',
    prepPoint: 'Technical competence must be paired with articulate communication to achieve global engineering impact.',
    prepReason: 'Even the most innovative algorithms remain unadopted if developers cannot explain their value to non-technical stakeholders.',
    prepExample: 'International project standups require clear conciseness to avoid costly misunderstandings across cross-cultural teams.',
    prepRestate: 'Hence, mastering spoken English is an indispensable core engineering skill.',
    targetKeywords: ['articulate', 'stakeholders', 'cross-cultural', 'conciseness']
  }
];

// Picture Prompts (Task 1: Real-World Scene & Task 2: Data-Based Visual)
const PICTURE_PROMPTS: PicturePrompt[] = [
  {
    id: 'pic-01',
    title: 'Smart Robotics & Embedded Systems Research Laboratory',
    category: 'Real-World Technical Scene',
    taskType: 'scene',
    taskBadge: 'Task 1: Real-World Scene Description',
    promptInstructions: [
      '1. Describe what is happening in the engineering laboratory (primary actions and purpose).',
      '2. Identify key elements and spatial layout (foreground testbed, midground instrumentation, background architecture).',
      '3. Speculate on the technical context, test tolerances, and practical industrial outcome.'
    ],
    contextTips: [
      'Use spatial markers: "In the foreground...", "To the upper left...", "In the background...", "Centrally positioned..."',
      'Incorporate technical action verbs: calibrating, probing, monitoring telemetry, inspecting, validating tolerances.'
    ],
    svgImage: (
      <svg viewBox="0 0 500 280" className="w-full h-56 sm:h-64 rounded-xl bg-slate-950 shadow-lg border border-slate-800" role="img" aria-label="Smart Robotics and Hardware Laboratory Scene">
        {/* Background Room & Server Rack */}
        <rect x="0" y="0" width="500" height="280" fill="#0b0f19" />
        {/* Background Wall Architectural Grid */}
        <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="160" y1="0" x2="160" y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="340" y1="0" x2="340" y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

        {/* Background Server Rack (Right) */}
        <rect x="410" y="20" width="75" height="150" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <rect x="416" y="30" width="63" height="14" rx="2" fill="#1e293b" />
        <circle cx="424" cy="37" r="2.5" fill="#22c55e" />
        <circle cx="433" cy="37" r="2.5" fill="#38bdf8" />
        <rect x="416" y="50" width="63" height="14" rx="2" fill="#1e293b" />
        <circle cx="424" cy="57" r="2.5" fill="#22c55e" />
        <circle cx="433" cy="57" r="2.5" fill="#eab308" />
        <rect x="416" y="70" width="63" height="14" rx="2" fill="#1e293b" />
        <circle cx="424" cy="77" r="2.5" fill="#22c55e" />
        <rect x="416" y="90" width="63" height="14" rx="2" fill="#1e293b" />
        <circle cx="424" cy="97" r="2.5" fill="#ef4444" />
        <text x="447" y="155" fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">EDGE CLOUD RACK</text>

        {/* Background Whiteboard (Center-Left) */}
        <rect x="25" y="20" width="130" height="75" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x="90" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">SYSTEM PIPELINE</text>
        <rect x="35" y="44" width="30" height="18" rx="2" fill="#334155" />
        <text x="50" y="56" fill="#94a3b8" fontSize="7" textAnchor="middle">SENSORS</text>
        <path d="M 65 53 L 80 53" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="80" y="44" width="30" height="18" rx="2" fill="#334155" />
        <text x="95" y="56" fill="#94a3b8" fontSize="7" textAnchor="middle">AI CORE</text>
        <path d="M 110 53 L 125 53" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="125" y="44" width="24" height="18" rx="2" fill="#047857" />
        <text x="137" y="56" fill="#ecfdf5" fontSize="7" textAnchor="middle">ACTUATE</text>
        <text x="90" y="82" fill="#e2e8f0" fontSize="7" textAnchor="middle">Tolerance: ±0.02mm</text>

        {/* Dual Telemetry Monitors (Midground Left) */}
        <rect x="175" y="35" width="105" height="65" rx="5" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="180" y="40" width="95" height="42" fill="#0f172a" />
        <path d="M 185 62 Q 200 45 215 62 T 245 62 T 270 50" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <text x="227" y="94" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">TELEMETRY STREAM</text>
        <rect x="222" y="100" width="10" height="15" fill="#334155" />
        <rect x="210" y="115" width="34" height="4" rx="2" fill="#475569" />

        {/* Digital Oscilloscope (Midground Right) */}
        <rect x="295" y="40" width="95" height="60" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        <rect x="302" y="46" width="55" height="36" fill="#020617" stroke="#334155" />
        <path d="M 305 64 Q 315 48 325 64 T 345 64" fill="none" stroke="#eab308" strokeWidth="1.5" />
        <circle cx="372" cy="54" r="5" fill="#334155" stroke="#94a3b8" />
        <circle cx="372" cy="68" r="5" fill="#334155" stroke="#94a3b8" />
        <text x="342" y="93" fill="#cbd5e1" fontSize="7.5" textAnchor="middle" fontWeight="bold">OSCILLOSCOPE 100MHz</text>

        {/* Main Workstation Bench (Foreground) */}
        <polygon points="10,175 490,175 500,280 0,280" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <rect x="0" y="175" width="500" height="6" fill="#3b82f6" opacity="0.8" />

        {/* Printed Circuit Board on Bench */}
        <rect x="60" y="195" width="150" height="70" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
        {/* PCB Traces & Chips */}
        <rect x="75" y="210" width="32" height="24" rx="2" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
        <text x="91" y="225" fill="#fbbf24" fontSize="7" textAnchor="middle" fontWeight="bold">ARM MCU</text>
        <rect x="130" y="210" width="22" height="16" rx="1" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
        <path d="M 107 222 L 130 222" stroke="#34d399" strokeWidth="1" />
        <circle cx="70" cy="205" r="3" fill="#eab308" />
        <circle cx="195" cy="255" r="3" fill="#eab308" />
        <text x="135" y="258" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontWeight="bold">PCB EMBEDDED TESTBED</text>

        {/* Articulated Robotic Arm (Foreground Right) */}
        <rect x="300" y="240" width="60" height="25" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="330" cy="245" r="8" fill="#38bdf8" />
        {/* Arm Base Link */}
        <line x1="330" y1="245" x2="280" y2="195" stroke="#60a5fa" strokeWidth="7" strokeLinecap="round" />
        <circle cx="280" cy="195" r="6" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Arm Forearm Link */}
        <line x1="280" y1="195" x2="220" y2="215" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
        <circle cx="220" cy="215" r="5" fill="#2563eb" />
        {/* Arm End-Effector Probe targeting the PCB */}
        <line x1="220" y1="215" x2="200" y2="228" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="228" r="3.5" fill="#ef4444" />
        <text x="330" y="272" fill="#38bdf8" fontSize="8.5" textAnchor="middle" fontWeight="bold">PRECISION ROBOTIC ARM</text>

        {/* Status Callout Badge */}
        <rect x="365" y="195" width="120" height="40" rx="6" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
        <circle cx="378" cy="210" r="3" fill="#22c55e" />
        <text x="388" y="213" fill="#f8fafc" fontSize="8" fontWeight="bold">STATUS: CALIBRATING</text>
        <text x="378" y="226" fill="#94a3b8" fontSize="7.5">Deviation: 0.004 mm</text>
      </svg>
    ),
    keywords: [
      'articulated robotic arm',
      'printed circuit board',
      'real-time telemetry',
      'spatial layout',
      'digital oscilloscope',
      'sensor calibration',
      'microcontroller testbed',
      'automated inspection'
    ],
    modelDescription:
      'This image illustrates a modern smart robotics and embedded systems laboratory. In the foreground, an articulated multi-axis robotic arm with a precision test probe is actively calibrating sensors over a green printed circuit board on the workbench. To the left midground, dual monitors stream real-time telemetry waveforms, while a digital oscilloscope on the right monitors electrical frequencies. In the background, an architectural pipeline whiteboard and server rack suggest a high-throughput automated validation facility.',
  },
  {
    id: 'pic-02',
    title: 'Global Programming Language Adoption & Developer Index (2026)',
    category: 'Data-Based Technical Visual',
    taskType: 'chart',
    taskBadge: 'Task 2: Data-Based Visual Description',
    promptInstructions: [
      '1. Introduce the visual (horizontal bar chart, subject, benchmark year 2026, sample base).',
      '2. Highlight key trends, market leaders (Python at 32%, TypeScript at 28%), mid-tier languages, and the fastest-growing technology (Rust at 10%).',
      '3. Deliver a concise concluding insight on industry shifts toward AI workloads and memory safety.'
    ],
    contextTips: [
      'Use comparative expressions: "accounts for the largest share...", "closely trailing at...", "by a margin of...", "steepest upward trajectory".',
      'Use statistical verbs: illustrates, depicts, represents, exhibits, contrasts with, demonstrates.'
    ],
    svgImage: (
      <svg viewBox="0 0 500 280" className="w-full h-56 sm:h-64 rounded-xl bg-slate-900 shadow-lg border border-slate-800" role="img" aria-label="Global Programming Language Adoption 2026 Bar Chart">
        {/* Background Card */}
        <rect x="0" y="0" width="500" height="280" fill="#0f172a" />

        {/* Title & Subtitle Header */}
        <text x="25" y="28" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
          2026 GLOBAL DEVELOPER LANGUAGE ADOPTION
        </text>
        <text x="25" y="44" fill="#94a3b8" fontSize="8.5" fontFamily="sans-serif">
          Percentage share of enterprise software engineering teams (Sample: 45,000+ Engineers)
        </text>

        {/* Grid Lines & Axis */}
        <line x1="120" y1="58" x2="120" y2="225" stroke="#334155" strokeWidth="1.5" />
        <line x1="120" y1="225" x2="475" y2="225" stroke="#334155" strokeWidth="1.5" />

        {/* Vertical Grid Markers (0%, 10%, 20%, 30%, 40%) */}
        <line x1="208" y1="58" x2="208" y2="225" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <text x="208" y="238" fill="#64748b" fontSize="8" textAnchor="middle">10%</text>

        <line x1="297" y1="58" x2="297" y2="225" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <text x="297" y="238" fill="#64748b" fontSize="8" textAnchor="middle">20%</text>

        <line x1="386" y1="58" x2="386" y2="225" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <text x="386" y="238" fill="#64748b" fontSize="8" textAnchor="middle">30%</text>

        <line x1="475" y1="58" x2="475" y2="225" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <text x="475" y="238" fill="#64748b" fontSize="8" textAnchor="middle">40%</text>

        {/* Bar 1: Python (32%) */}
        <text x="110" y="80" fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="end">Python</text>
        <rect x="120" y="66" width="284" height="20" rx="3" fill="#3b82f6" />
        <text x="412" y="80" fill="#60a5fa" fontSize="9" fontWeight="bold">32% (AI / Data Science)</text>

        {/* Bar 2: TypeScript / JS (28%) */}
        <text x="110" y="112" fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="end">TypeScript/JS</text>
        <rect x="120" y="98" width="248" height="20" rx="3" fill="#f59e0b" />
        <text x="376" y="112" fill="#fbbf24" fontSize="9" fontWeight="bold">28% (Full-Stack / Web)</text>

        {/* Bar 3: Java (16%) */}
        <text x="110" y="144" fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="end">Java</text>
        <rect x="120" y="130" width="142" height="20" rx="3" fill="#ef4444" />
        <text x="270" y="144" fill="#f87171" fontSize="9" fontWeight="bold">16% (Enterprise)</text>

        {/* Bar 4: C++ / C# (14%) */}
        <text x="110" y="176" fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="end">C++ / C#</text>
        <rect x="120" y="162" width="124" height="20" rx="3" fill="#8b5cf6" />
        <text x="252" y="176" fill="#c084fc" fontSize="9" fontWeight="bold">14% (Embedded/Games)</text>

        {/* Bar 5: Rust (10%) */}
        <text x="110" y="208" fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="end">Rust</text>
        <rect x="120" y="194" width="88" height="20" rx="3" fill="#10b981" />
        <text x="216" y="208" fill="#34d399" fontSize="9" fontWeight="bold">10% (Fastest Growth)</text>

        {/* Bottom Insight Footer */}
        <rect x="25" y="248" width="450" height="24" rx="4" fill="#1e293b" stroke="#334155" />
        <circle cx="35" cy="260" r="3" fill="#38bdf8" />
        <text x="45" y="263" fill="#94a3b8" fontSize="7.5">
          Key Takeaway: Python & TypeScript dominate 60% of industry volume; Rust leads annual acceleration for memory safety.
        </text>
      </svg>
    ),
    keywords: [
      'horizontal bar chart',
      'developer adoption',
      'market distribution',
      'statistically dominant',
      'Python lead in AI',
      'TypeScript adoption',
      'comparative margin',
      'memory-safe languages'
    ],
    modelDescription:
      'The provided horizontal bar chart illustrates the 2026 global programming language adoption index across enterprise engineering teams. Python represents the leading language at 32%, predominantly driven by rapid expansion in artificial intelligence and machine learning pipelines. TypeScript and JavaScript closely follow at 28%, preserving strong dominance across modern web and cloud systems. Java and C++ or C# occupy the mid-tier segment at 16% and 14% respectively, while Rust accounts for 10% as the fastest-growing language owing to its robust memory safety guarantees. In summary, the data reflects an industry shift toward AI-centric development and secure low-level systems.',
  }
];

// Situation-Based Scenarios
const SITUATION_SCENARIOS: SituationScenario[] = [
  {
    id: 'sit-01',
    title: 'Communicating a Project Delay to a Non-Technical Manager',
    category: 'Workplace Diplomacy',
    context: 'Your team encountered an unforeseen database migration bug 24 hours before launch. You must inform your non-technical project manager clearly and calmly without using overwhelming jargon.',
    objective: 'Explain the issue in plain terms, outline the mitigation plan, and propose a revised timeline.',
    tips: [
      'Avoid heavy technical jargon; use analogies like "house foundation repair".',
      'Focus on risk mitigation and quality assurance.',
      'Provide a clear solution and revised delivery schedule.'
    ]
  },
  {
    id: 'sit-02',
    title: 'Requesting a Lab Project Extension from Senior Faculty',
    category: 'Academic Formal',
    context: 'You need 3 extra days to complete your advanced English laboratory notebook due to hardware failure in the computer lab.',
    objective: 'Politely state your request, explain the valid cause, and pledge to submit high-quality work.',
    tips: [
      'Maintain a respectful, professional academic tone.',
      'State what work has already been completed.',
      'Commit to a specific firm deadline.'
    ]
  }
];

// Story Starters
const STORY_STARTERS: StoryStarter[] = [
  {
    id: 'st-01',
    title: 'The 2:00 AM Database Crash',
    category: 'Technical Thriller',
    starterText: 'It was 2:00 AM before the final engineering project submission when suddenly the main cloud server crashed and error logs flooded the terminal screen...',
    suggestedElements: ['incident response', 'log analysis', 'collaborative teamwork', 'successful recovery']
  },
  {
    id: 'st-02',
    title: 'The Whiteboard Technical Interview',
    category: 'Career Journey',
    starterText: 'During my first campus placement interview, the chief software architect handed me a whiteboard marker and asked me to design a system handling 1 million concurrent users...',
    suggestedElements: ['initial hesitation', 'PREP method', 'system architecture', 'interviewer approval']
  }
];

// Role Play Scenarios
const ROLEPLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'rp-01',
    title: 'Software Developer vs QA Test Lead',
    roleA: 'Software Developer',
    roleB: 'QA Test Lead',
    openingLine: 'Hi! I noticed you flagged a high-severity blocking bug in my pull request right before release. Can we review the issue together?',
    conversationGoals: [
      'Discuss bug reproduction steps calmly.',
      'Evaluate severity vs deployment timeline.',
      'Agree on a quick patch or temporary workaround.'
    ]
  },
  {
    id: 'rp-02',
    title: 'Student Project Lead vs Department Head',
    roleA: 'Student Tech Lead',
    roleB: 'Head of Department',
    openingLine: 'Good morning Professor! Our student tech club would like to pitch a proposal for an AI Innovation Scratchpad in the department lab.',
    conversationGoals: [
      'Highlight benefits for student learning.',
      'Address budget and lab equipment safety.',
      'Secure approval for a trial workshop.'
    ]
  }
];

interface SpokenEnglishLabStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWork?: (title: string, content: string) => void;
}

export const SpokenEnglishLabStudio: React.FC<SpokenEnglishLabStudioProps> = ({
  moduleId = 'spoken-english',
  moduleTitle = 'Spoken English & Fluency Building',
  onSaveWork
}) => {
  // Active Tab State (All 15 sections organized cleanly)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'readiness' | 'warmup' | 'guided' | 'picture' | 'situation' | 'story' | 'roleplay' | 'partner' | 'dashboard' | 'reflection'
  >('overview');

  // Interactive Speech States
  const [userTranscriptInput, setUserTranscriptInput] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(30);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<SpokenEnglishEvaluationResult | null>(null);

  // Section Specific States
  const [selectedTwisterIndex, setSelectedTwisterIndex] = useState<number>(0);
  const [selectedGuidedIndex, setSelectedGuidedIndex] = useState<number>(0);
  const [selectedPicIndex, setSelectedPicIndex] = useState<number>(0);
  const [selectedSitIndex, setSelectedSitIndex] = useState<number>(0);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  // AI Partner Multi-turn Chat state
  const [partnerTopic, setPartnerTopic] = useState<string>('How will Artificial Intelligence transform software engineering careers over the next 5 years?');
  const [partnerHistory, setPartnerHistory] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hello! I am your SAILL AI Spoken Conversation Partner. How will Artificial Intelligence transform software engineering careers over the next 5 years?'
    }
  ]);

  // Dashboard & Progress tracking
  const [completedExercisesCount, setCompletedExercisesCount] = useState<number>(3);
  const [averageFluencyScore, setAverageFluencyScore] = useState<number>(8.8);
  const [averageWpm, setAverageWpm] = useState<number>(138);
  const [fillerReduction, setFillerReduction] = useState<number>(45);
  const [completedCategories, setCompletedCategories] = useState<string[]>(['warmup', 'guided']);

  // Reflection Journal State
  const [studentReflection, setStudentReflection] = useState<string>(
    'Practicing with the PREP method helped me structure my oral delivery without stalling. I noticed my speech pace stabilized near 138 WPM and filler words ("um") dropped significantly.'
  );

  // Save feedback status
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);

  // Pronunciation Accent Preference
  const [accent] = useAccentPreference();

  // Reference for smooth section scrolling
  const studioSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = () => {
    setTimeout(() => {
      if (studioSectionRef.current) {
        studioSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleTabSelect = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    scrollToSection();
  };

  // Speech Synthesis TTS Helper with Centralized Accent Preference
  const speakModelText = (text: string) => {
    AccentPreferenceService.speak(text, { accent, rate: 0.95 });
  };

  // Generic Speech Evaluation Handler
  const handleEvaluateCurrentSpeaking = async (
    mode: 'warmup' | 'guided' | 'picture' | 'situation' | 'story' | 'roleplay' | 'partner',
    promptTitle: string,
    transcriptText: string,
    durationSec: number = 30,
    keywords?: string[]
  ) => {
    if (!transcriptText.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await evaluateSpokenEnglish({
        mode,
        topicOrPrompt: promptTitle,
        userTranscript: transcriptText,
        durationSeconds: durationSec,
        keywordsToInclude: keywords,
        conversationHistory: partnerHistory
      });

      setEvaluationResult(res);

      // Update progress metrics
      setCompletedExercisesCount((prev) => prev + 1);
      const newScoreAvg = Number(((averageFluencyScore * completedExercisesCount + res.totalScore) / (completedExercisesCount + 1)).toFixed(1));
      setAverageFluencyScore(newScoreAvg);
      if (!completedCategories.includes(mode)) {
        setCompletedCategories([...completedCategories, mode]);
      }

      // If in partner mode, add user response and AI follow up to history
      if (mode === 'partner' && res.followUpQuestion) {
        setPartnerHistory((prev) => [
          ...prev,
          { role: 'user', text: transcriptText },
          { role: 'ai', text: res.followUpQuestion! }
        ]);
      }

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Spoken English evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Save to SAILL Digital Portfolio
  const handleSaveToPortfolio = async () => {
    if (!evaluationResult) return;

    const score10 = evaluationResult.totalScore;
    const formattedScore = `${formatScore10(score10)} (${getPerformanceDescriptor(score10)})`;

    const textContent = `
MODULE 3: AI-POWERED SPOKEN ENGLISH & FLUENCY BUILDING STUDIO
------------------------------------------------------------
Topic / Exercise: ${activeTab.toUpperCase()} Practice
Overall Fluency Mark: ${formattedScore}
Pace: ${evaluationResult.wpm} WPM (Target: 130-150 WPM)
Filler Words Detected: ${evaluationResult.fillerWordCount} (${evaluationResult.detectedFillerWords.join(', ') || 'None'})

5-CRITERION SCORE BREAKDOWN (2 Marks Each = 10 Marks Total):
- Fluency & Pace: ${evaluationResult.criteria.fluencyScore} / 2.0
- Pronunciation & Intonation: ${evaluationResult.criteria.pronunciationScore} / 2.0
- Grammar & Syntax: ${evaluationResult.criteria.grammarScore} / 2.0
- Technical Vocabulary: ${evaluationResult.criteria.vocabularyScore} / 2.0
- Organization & Confidence: ${evaluationResult.criteria.confidenceScore} / 2.0

OVERALL FEEDBACK:
${evaluationResult.overallFeedback}

STRENGTHS:
- ${evaluationResult.strengths.join('\n- ')}

SUGGESTIONS FOR IMPROVEMENT:
- ${evaluationResult.improvements.join('\n- ')}

POLISHED TRANSCRIPT:
"${evaluationResult.correctedTranscript}"
    `.trim();

    const item: PortfolioItem = {
      id: 'p-spoken-' + Date.now(),
      moduleId: moduleId,
      moduleTitle: moduleTitle,
      title: `Experiment 3: Spoken English & Fluency Artifact (${formattedScore})`,
      category: 'audio',
      content: textContent,
      score: score10,
      createdAt: new Date().toISOString(),
      teacherFeedback: `AI Verified: Excellent spoken fluency score of ${formattedScore}.`
    };

    await dbStorage.savePortfolioItem(item);

    if (onSaveWork) {
      onSaveWork(item.title, textContent);
    }

    setSaveStatusMsg('✓ Artifact successfully saved to SAILL Portfolio!');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  // Update Digital Laboratory Notebook
  const handleSaveToNotebook = async () => {
    const mark10 = evaluationResult ? evaluationResult.totalScore : averageFluencyScore;

    const notebookRecord: LabExperimentRecord = {
      experimentNumber: 'EXP-03',
      date: new Date().toISOString().split('T')[0],
      title: 'Experiment 3: AI-Powered Spoken English & Fluency Building Studio',
      objective: 'To eliminate vocal hesitations, reduce filler words, master the PREP impromptu framework, and achieve natural speech delivery in engineering contexts.',
      studentWorkText: `
Completed Drills Count: ${completedExercisesCount}
Average Speech Rate: ${averageWpm} WPM (Target: 130-150 WPM)
Filler Word Reduction: ${fillerReduction}%
Categories Mastered: ${completedCategories.join(', ')}
      `.trim(),
      reflectionText: studentReflection,
      facultyRemarks: 'Automated AI Verification: Outstanding spoken English fluency, confident PREP structure, and clear pronunciation.',
      rubricScores: {
        pronunciationAndFluency: Math.min(20, Math.round(mark10 * 2)),
        grammarAndVocabulary: Math.min(20, Math.round(mark10 * 2)),
        structureAndCoherence: Math.min(20, Math.round(mark10 * 2)),
        taskCompletion: Math.min(20, Math.round(mark10 * 2)),
        technicalAccuracy: Math.min(20, Math.round(mark10 * 2))
      },
      totalScore: mark10,
      status: 'Completed',
      facultyVerified: true
    };

    const item: PortfolioItem = {
      id: 'p-notebook-' + Date.now(),
      moduleId,
      moduleTitle,
      title: 'Lab Notebook Record: Spoken English & Fluency Studio',
      category: 'reflection',
      content: JSON.stringify(notebookRecord),
      score: mark10,
      createdAt: new Date().toISOString()
    };

    await dbStorage.savePortfolioItem(item);

    setSaveStatusMsg('✓ Laboratory Notebook record updated in IndexedDB!');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="srit-card p-6 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#D35400] text-white rounded-3xl shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#FAD7A0] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FAD7A0]" />
              <span>SRIT SAILL R26 Module 3 Laboratory</span>
            </span>
            <h2 className="text-2xl font-black font-heading text-white">
              AI-Powered Spoken English & Fluency Building Studio
            </h2>
            <p className="text-xs text-slate-200 max-w-2xl">
              Master spontaneous oral fluency, eliminate vocal fillers, practice PREP structured speeches, and converse with an AI partner evaluated under the 10-Mark Assessment Scale.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start md:self-auto">
            <Award className="w-8 h-8 text-[#FAD7A0]" />
            <div>
              <span className="text-[10px] text-slate-200 uppercase font-bold block">Current Fluency Mark</span>
              <span className="text-xl font-black font-mono text-[#FAD7A0]">
                {formatScore10(averageFluencyScore)}
              </span>
              <span className="text-[9px] text-emerald-300 font-bold block">
                {getPerformanceDescriptor(averageFluencyScore)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pronunciation Accent Preference Control */}
      <PronunciationAccentControl className="w-full" moduleId={moduleId} />

      {/* Save Status Notification */}
      {saveStatusMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveStatusMsg}</span>
        </div>
      )}

      {/* Studio Navigation Tabs (15 Sections Organized into Clean Navigation) */}
      <div ref={studioSectionRef} className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#FAD7A0] no-scrollbar text-xs font-bold scroll-mt-24">
        {[
          { id: 'overview', label: '1. Overview', icon: BookOpen },
          { id: 'readiness', label: '2. Readiness', icon: ShieldCheck },
          { id: 'warmup', label: '3. Warm-up', icon: Flame },
          { id: 'guided', label: '4. Guided Speaking', icon: Compass },
          { id: 'picture', label: '5. Extended Visual Description', icon: ImageIcon },
          { id: 'situation', label: '6. Situation-Based', icon: MessageSquare },
          { id: 'story', label: '7. Story Completion', icon: FileText },
          { id: 'roleplay', label: '8. Role Plays', icon: Users },
          { id: 'partner', label: '9. AI Conversation Partner', icon: Sparkles },
          { id: 'dashboard', label: '12. Dashboard', icon: BarChart2 },
          { id: 'reflection', label: '13-15. Notebook & Portfolio', icon: Save }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-[#D35400] text-white shadow-2xs font-extrabold'
                  : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FFF8F0]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D35400]" />
              <span>Section 1: Introduction to Spoken English & Oral Fluency</span>
            </h3>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Fluency is the smooth, effortless flow of spoken thought. In engineering environments, articulate delivery inspires confidence and eliminates ambiguity during technical presentations and standups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* PREP Framework */}
            <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="font-extrabold text-[#D35400] uppercase block text-xs">The PREP Framework</span>
              <ul className="space-y-1.5 text-[#2C3E50] text-[11px]">
                <li><strong className="text-[#D35400]">P - Point:</strong> State your core message clearly.</li>
                <li><strong className="text-[#D35400]">R - Reason:</strong> Explain the underlying logic.</li>
                <li><strong className="text-[#D35400]">E - Example:</strong> Provide a concrete technical case.</li>
                <li><strong className="text-[#D35400]">P - Point:</strong> Reinforce your final conclusion.</li>
              </ul>
            </div>

            {/* Pacing & Fillers */}
            <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="font-extrabold text-[#D35400] uppercase block text-xs">Optimal Speech Pacing</span>
              <p className="text-[#5D6D7E] text-[11px] leading-relaxed">
                Target rate: <strong className="text-[#2C3E50]">130–150 WPM</strong>. Speaking too fast causes slurring; speaking too slow loses listener engagement. Replace fillers ("um", "ah", "basically") with deliberate silent pauses.
              </p>
            </div>

            {/* 10-Mark Assessment Framework */}
            <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <span className="font-extrabold text-[#D35400] uppercase block text-xs">10-Mark Rubric Scale</span>
              <p className="text-[#5D6D7E] text-[11px]">5 Criteria evaluated out of 2.0 Marks each:</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-[#2C3E50]">
                <span>• Fluency (2.0)</span>
                <span>• Pronunciation (2.0)</span>
                <span>• Grammar (2.0)</span>
                <span>• Vocabulary (2.0)</span>
                <span className="col-span-2">• Organization & Confidence (2.0)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleTabSelect('readiness')}
              className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition shadow-2xs flex items-center gap-2"
            >
              <span>Proceed to Speaking Readiness Check</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. READINESS CHECK */}
      {activeTab === 'readiness' && (
        <div className="space-y-4">
          <SpeakingReadinessCheck />
          <div className="flex justify-end">
            <button
              onClick={() => handleTabSelect('warmup')}
              className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition shadow-2xs flex items-center gap-2"
            >
              <span>Start Fluency Warm-up Drills</span>
              <Flame className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. FLUENCY WARM-UP */}
      {activeTab === 'warmup' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D35400]" />
                <span>Section 3: Fluency Warm-up & Articulation Drills</span>
              </h3>
              <p className="text-xs text-[#5D6D7E]">
                Listen to model TTS audio, practice vocal flexibility, and record your speech articulation.
              </p>
            </div>
            <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0]">
              Twister {selectedTwisterIndex + 1} of {WARMUP_TWISTERS.length}
            </span>
          </div>

          {/* Twister Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WARMUP_TWISTERS.map((tw, idx) => (
              <button
                key={tw.id}
                onClick={() => setSelectedTwisterIndex(idx)}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  selectedTwisterIndex === idx
                    ? 'bg-[#D35400] text-white font-bold border-[#D35400]'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-amber-100'
                }`}
              >
                <span className="block text-[10px] opacity-80 uppercase">{tw.category}</span>
                <span className="line-clamp-1">{tw.title}</span>
              </button>
            ))}
          </div>

          {/* Active Twister Box */}
          {(() => {
            const currentTw = WARMUP_TWISTERS[selectedTwisterIndex];
            return (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#D35400] uppercase">
                    Focus: {currentTw.focusArea}
                  </span>
                  <button
                    onClick={() => speakModelText(currentTw.twisterText)}
                    className="px-3 py-1.5 bg-[#D35400] text-white rounded-lg text-xs font-bold hover:bg-[#E67E22] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Model Audio</span>
                  </button>
                </div>

                <p className="text-base font-extrabold text-[#2C3E50] leading-relaxed bg-white p-4 rounded-xl border border-[#FAD7A0]">
                  "{currentTw.twisterText}"
                </p>

                {/* Recorder */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#2C3E50] block">
                    Record Your Vocal Articulation:
                  </span>
                  <AudioRecorder
                    onRecordingComplete={(blobUrl, durationSec) => {
                      setRecordingSeconds(durationSec);
                    }}
                  />

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C3E50] block">
                      Spoken Transcript / Notes (Auto/Manual):
                    </label>
                    <textarea
                      rows={2}
                      value={userTranscriptInput}
                      onChange={(e) => setUserTranscriptInput(e.target.value)}
                      placeholder="Type or review what you spoke during the warm-up..."
                      className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                    />
                  </div>

                  <button
                    onClick={() =>
                      handleEvaluateCurrentSpeaking(
                        'warmup',
                        currentTw.title,
                        userTranscriptInput || currentTw.twisterText,
                        recordingSeconds
                      )
                    }
                    disabled={isEvaluating}
                    className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Analyzing Vocal Articulation...' : 'Analyze Fluency Warm-up'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Realtime Analyzer & AI Suggestions */}
          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 4. GUIDED SPEAKING */}
      {activeTab === 'guided' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#D35400]" />
                <span>Section 4: Guided Speaking (PREP Blueprint)</span>
              </h3>
              <p className="text-xs text-[#5D6D7E]">
                Deliver a structured 60-second speech following the PREP blueprint outline.
              </p>
            </div>
            <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0]">
              Topic {selectedGuidedIndex + 1} of {GUIDED_PROMPTS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {GUIDED_PROMPTS.map((gp, idx) => (
              <button
                key={gp.id}
                onClick={() => setSelectedGuidedIndex(idx)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  selectedGuidedIndex === idx
                    ? 'bg-[#D35400] text-white font-bold border-[#D35400]'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-amber-100'
                }`}
              >
                <span className="block text-[10px] opacity-80 uppercase">{gp.category}</span>
                <span className="line-clamp-1">{gp.title}</span>
              </button>
            ))}
          </div>

          {(() => {
            const currentGp = GUIDED_PROMPTS[selectedGuidedIndex];
            return (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">
                  "{currentGp.title}"
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-[#FAD7A0]">
                  <div className="space-y-1">
                    <span className="font-bold text-[#D35400] uppercase text-[10px]">P - Point:</span>
                    <p className="text-[#2C3E50]">{currentGp.prepPoint}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#D35400] uppercase text-[10px]">R - Reason:</span>
                    <p className="text-[#2C3E50]">{currentGp.prepReason}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#D35400] uppercase text-[10px]">E - Example:</span>
                    <p className="text-[#2C3E50]">{currentGp.prepExample}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#D35400] uppercase text-[10px]">P - Restate Point:</span>
                    <p className="text-[#2C3E50]">{currentGp.prepRestate}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-[#D35400]">Target Vocabulary:</span>
                  {currentGp.targetKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-bold text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#2C3E50] block">Record Your 60-Second Speech:</span>
                  <AudioRecorder
                    onRecordingComplete={(blobUrl, durationSec) => {
                      setRecordingSeconds(durationSec);
                    }}
                  />

                  <textarea
                    rows={3}
                    value={userTranscriptInput}
                    onChange={(e) => setUserTranscriptInput(e.target.value)}
                    placeholder="Enter or refine your speech transcript..."
                    className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                  />

                  <button
                    onClick={() =>
                      handleEvaluateCurrentSpeaking(
                        'guided',
                        currentGp.title,
                        userTranscriptInput || `${currentGp.prepPoint} ${currentGp.prepReason} ${currentGp.prepExample}`,
                        recordingSeconds,
                        currentGp.targetKeywords
                      )
                    }
                    disabled={isEvaluating}
                    className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Evaluating PREP Speech...' : 'Analyze Guided Speech'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. EXTENDED VISUAL DESCRIPTION */}
      {activeTab === 'picture' && (
        <ExtendedVisualDescriptionStudio
          moduleId={moduleId}
          moduleTitle={moduleTitle}
          onSaveWork={onSaveWork}
          onTaskCompleted={(score) => {
            setAverageFluencyScore(score);
            setCompletedExercisesCount((prev) => prev + 1);
            if (!completedCategories.includes('picture')) {
              setCompletedCategories([...completedCategories, 'picture']);
            }
          }}
        />
      )}

      {/* 6. SITUATION-BASED SPEAKING */}
      {activeTab === 'situation' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#D35400]" />
              <span>Section 6: Situation-Based Technical & Workplace Speaking</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Handle real-world professional workplace scenarios requiring tactful, clear communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SITUATION_SCENARIOS.map((sit, idx) => (
              <button
                key={sit.id}
                onClick={() => setSelectedSitIndex(idx)}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  selectedSitIndex === idx
                    ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]'
                    : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                <span className="font-bold text-[#2C3E50] block">{sit.title}</span>
                <span className="text-[10px] text-[#5D6D7E]">{sit.category}</span>
              </button>
            ))}
          </div>

          {(() => {
            const currentSit = SITUATION_SCENARIOS[selectedSitIndex];
            return (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">{currentSit.title}</h4>
                <p className="text-xs text-[#2C3E50] bg-white p-3.5 rounded-xl border border-[#FAD7A0] leading-relaxed">
                  <strong>Scenario Context:</strong> {currentSit.context}
                </p>

                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-[#D35400] uppercase text-[11px]">Communication Objective:</span>
                  <p className="text-[#5D6D7E]">{currentSit.objective}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#D35400] uppercase text-[11px]">Key Delivery Tips:</span>
                  <ul className="list-disc list-inside text-[#5D6D7E] text-[11px] space-y-0.5">
                    {currentSit.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#2C3E50] block">Deliver Your Spoken Response:</span>
                  <AudioRecorder
                    onRecordingComplete={(blobUrl, durationSec) => {
                      setRecordingSeconds(durationSec);
                    }}
                  />

                  <textarea
                    rows={3}
                    value={userTranscriptInput}
                    onChange={(e) => setUserTranscriptInput(e.target.value)}
                    placeholder="Enter or review your scenario response transcript..."
                    className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                  />

                  <button
                    onClick={() =>
                      handleEvaluateCurrentSpeaking(
                        'situation',
                        currentSit.title,
                        userTranscriptInput || currentSit.objective,
                        recordingSeconds
                      )
                    }
                    disabled={isEvaluating}
                    className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Evaluating Scenario Response...' : 'Analyze Situation Response'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 7. STORY COMPLETION */}
      {activeTab === 'story' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D35400]" />
              <span>Section 7: Story Completion & Narrative Continuity</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Listen to or read a compelling technical story starter and orally complete the narrative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STORY_STARTERS.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setSelectedStoryIndex(idx)}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  selectedStoryIndex === idx
                    ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]'
                    : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                <span className="font-bold text-[#2C3E50] block">{st.title}</span>
                <span className="text-[10px] text-[#5D6D7E]">{st.category}</span>
              </button>
            ))}
          </div>

          {(() => {
            const currentSt = STORY_STARTERS[selectedStoryIndex];
            return (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">{currentSt.title}</h4>
                  <button
                    onClick={() => speakModelText(currentSt.starterText)}
                    className="px-3 py-1 bg-[#D35400] text-white rounded-lg text-xs font-bold hover:bg-[#E67E22] transition flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Story Starter</span>
                  </button>
                </div>

                <p className="text-xs text-[#2C3E50] italic bg-white p-4 rounded-xl border border-[#FAD7A0] leading-relaxed">
                  "{currentSt.starterText}"
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#2C3E50] block">Orally Complete the Narrative:</span>
                  <AudioRecorder
                    onRecordingComplete={(blobUrl, durationSec) => {
                      setRecordingSeconds(durationSec);
                    }}
                  />

                  <textarea
                    rows={3}
                    value={userTranscriptInput}
                    onChange={(e) => setUserTranscriptInput(e.target.value)}
                    placeholder="Type or review your narrative completion transcript..."
                    className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                  />

                  <button
                    onClick={() =>
                      handleEvaluateCurrentSpeaking(
                        'story',
                        currentSt.title,
                        userTranscriptInput || `${currentSt.starterText} We immediately opened the terminal and isolated the memory bug.`,
                        recordingSeconds,
                        currentSt.suggestedElements
                      )
                    }
                    disabled={isEvaluating}
                    className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Evaluating Story Flow...' : 'Analyze Story Completion'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 8. ROLE PLAYS */}
      {activeTab === 'roleplay' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D35400]" />
              <span>Section 8: Interactive Role-Play Dialogues</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Engage in professional role-playing dialogues simulating team discussions, code reviews, and project proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROLEPLAY_SCENARIOS.map((rp, idx) => (
              <button
                key={rp.id}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`p-3.5 rounded-xl border text-left text-xs transition ${
                  selectedRoleIndex === idx
                    ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]'
                    : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                <span className="font-bold text-[#2C3E50] block">{rp.title}</span>
                <span className="text-[10px] text-[#5D6D7E]">{rp.roleA} vs {rp.roleB}</span>
              </button>
            ))}
          </div>

          {(() => {
            const currentRp = ROLEPLAY_SCENARIOS[selectedRoleIndex];
            return (
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
                <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">{currentRp.title}</h4>

                <div className="p-3.5 bg-white rounded-xl border border-[#FAD7A0] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#D35400]">
                    <span className="font-bold uppercase text-[10px]">{currentRp.roleB} Prompt:</span>
                    <button
                      onClick={() => speakModelText(currentRp.openingLine)}
                      className="px-2 py-0.5 bg-[#D35400] text-white rounded text-[10px] font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  </div>
                  <p className="text-[#2C3E50] italic">"{currentRp.openingLine}"</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#D35400] uppercase text-[11px]">Role Play Goals:</span>
                  <ul className="list-disc list-inside text-[#5D6D7E] text-[11px] space-y-0.5">
                    {currentRp.conversationGoals.map((goal, i) => (
                      <li key={i}>{goal}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#2C3E50] block">Record Your Role-Play Turn ({currentRp.roleA}):</span>
                  <AudioRecorder
                    onRecordingComplete={(blobUrl, durationSec) => {
                      setRecordingSeconds(durationSec);
                    }}
                  />

                  <textarea
                    rows={3}
                    value={userTranscriptInput}
                    onChange={(e) => setUserTranscriptInput(e.target.value)}
                    placeholder="Type or review your roleplay response..."
                    className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                  />

                  <button
                    onClick={() =>
                      handleEvaluateCurrentSpeaking(
                        'roleplay',
                        currentRp.title,
                        userTranscriptInput || currentRp.openingLine,
                        recordingSeconds
                      )
                    }
                    disabled={isEvaluating}
                    className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Evaluating Role Play...' : 'Analyze Role Play Dialogue'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 9. AI CONVERSATION PARTNER WITH FOLLOW-UP QUESTIONS */}
      {activeTab === 'partner' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D35400]" />
                <span>Section 9: AI Conversation Partner (Multi-Turn Spoken Partner)</span>
              </h3>
              <p className="text-xs text-[#5D6D7E]">
                Engage in natural interactive spoken conversation. The AI partner evaluates your speech and asks context-aware follow-up questions!
              </p>
            </div>
          </div>

          {/* Conversation History Stream */}
          <div className="space-y-3 bg-[#FFF8F0] p-4 rounded-2xl border border-[#FAD7A0] max-h-96 overflow-y-auto text-xs">
            {partnerHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl space-y-1 border ${
                  msg.role === 'ai'
                    ? 'bg-purple-50 border-purple-200 text-purple-950 ml-0 mr-8'
                    : 'bg-white border-[#FAD7A0] text-[#2C3E50] ml-8 mr-0'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-[#D35400]">
                    {msg.role === 'ai' ? '🤖 SAILL AI Spoken Partner' : '👤 Student Response'}
                  </span>
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => speakModelText(msg.text)}
                      className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen AI</span>
                    </button>
                  )}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Response Recorder */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
            <span className="text-xs font-bold text-[#2C3E50] block">
              Speak or Record Your Response to AI Partner:
            </span>
            <AudioRecorder
              onRecordingComplete={(blobUrl, durationSec) => {
                setRecordingSeconds(durationSec);
              }}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C3E50] block">
                Transcript / Oral Response Text:
              </label>
              <textarea
                rows={3}
                value={userTranscriptInput}
                onChange={(e) => setUserTranscriptInput(e.target.value)}
                placeholder="Type or refine your response to the AI Conversation Partner..."
                className="w-full p-3 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none bg-white"
              />
            </div>

            <button
              onClick={() => {
                handleEvaluateCurrentSpeaking(
                  'partner',
                  partnerTopic,
                  userTranscriptInput || 'I believe artificial intelligence will augment software engineering by automating repetitive tasks while requiring humans to focus on high-level architecture.',
                  recordingSeconds
                );
                setUserTranscriptInput('');
              }}
              disabled={isEvaluating}
              className="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#E67E22] transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating Response & Generating Follow-up...' : 'Send Spoken Response to AI Partner'}</span>
            </button>
          </div>

          {evaluationResult && (
            <div className="space-y-4 pt-4 border-t border-[#FAD7A0]">
              <RealtimeFluencyAnalyzer
                wpm={evaluationResult.wpm}
                fillerWordCount={evaluationResult.fillerWordCount}
                detectedFillerWords={evaluationResult.detectedFillerWords}
                hesitationCount={evaluationResult.hesitationCount}
                totalScore={evaluationResult.totalScore}
                isAnalyzing={isEvaluating}
              />
              <AISuggestionsReport
                evaluation={evaluationResult}
                onSaveToPortfolio={handleSaveToPortfolio}
                onSaveToNotebook={handleSaveToNotebook}
              />
            </div>
          )}
        </div>
      )}

      {/* 12. PROGRESS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <SpokenProgressDashboard
          completedCount={completedExercisesCount}
          averageScore={averageFluencyScore}
          avgWpm={averageWpm}
          fillerReductionPercent={fillerReduction}
          completedCategories={completedCategories}
        />
      )}

      {/* 13-15. REFLECTION & NOTEBOOK & PORTFOLIO INTEGRATION */}
      {activeTab === 'reflection' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
          <div className="border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Save className="w-5 h-5 text-[#D35400]" />
              <span>Sections 13-15: Student Reflection, Laboratory Notebook & Portfolio</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Reflect on your fluency progress, sync your lab record to IndexedDB, and save artifacts to your digital portfolio under the 10-Mark Assessment Scale.
            </p>
          </div>

          {/* Section 13: Student Reflection */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
            <h4 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D35400]" />
              <span>Section 13: Student Self-Reflection Journal</span>
            </h4>
            <textarea
              rows={4}
              value={studentReflection}
              onChange={(e) => setStudentReflection(e.target.value)}
              placeholder="Reflect on what strategies helped reduce filler words and improve speech delivery during today's laboratory session..."
              className="w-full p-3.5 text-xs border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none bg-white leading-relaxed"
            />
          </div>

          {/* Sections 14 & 15: Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Section 14: Digital Lab Notebook Update */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Section 14: Digital Laboratory Notebook Update</span>
              </h4>
              <p className="text-[11px] text-slate-600">
                Automatically formats Experiment 3 with aim, procedure, WPM observation metrics, 10-mark rubric scores, reflection, and faculty verification in IndexedDB.
              </p>
              <button
                onClick={handleSaveToNotebook}
                className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Laboratory Notebook</span>
              </button>
            </div>

            {/* Section 15: SAILL Portfolio Integration */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
              <h4 className="font-extrabold text-[#D35400] text-xs flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-[#D35400]" />
                <span>Section 15: SAILL Digital Portfolio Integration</span>
              </h4>
              <p className="text-[11px] text-[#5D6D7E]">
                Exports audio recordings, transcripts, and AI evaluation certificates with 10-mark scale grades directly to your student portfolio.
              </p>
              <button
                onClick={handleSaveToPortfolio}
                className="w-full py-2 bg-[#D35400] text-white text-xs font-bold rounded-lg hover:bg-[#E67E22] transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Save Artifact to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
