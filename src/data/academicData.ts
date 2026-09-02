import {
  StudentProfile,
  RubricConfig,
  AttendanceRecord,
  RubricEvaluation,
  StudentInternalMarks,
  Announcement,
  AppNotification,
  FacultyAISessionSummary,
  COPOMapping
} from '../types';

export const MOCK_STUDENTS: StudentProfile[] = [];

export const RUBRIC_CONFIGS: RubricConfig[] = [
  {
    id: 'pronunciation',
    title: 'IPA Phonetics & Pronunciation Rubric',
    description: 'Evaluates phoneme accuracy, minimal pair distinction, syllable stress, and mother tongue influence (MTI).',
    criteria: [
      { id: 'c1', name: 'Phoneme & Symbol Accuracy', maxMarks: 20, description: 'Correct articulation of IPA vowels and consonants.' },
      { id: 'c2', name: 'Minimal Pair Differentiation', maxMarks: 20, description: 'Clear distinction between tricky phonemes (e.g. /v/ vs /w/, /s/ vs /z/).' },
      { id: 'c3', name: 'Syllable Stress & Rhythm', maxMarks: 20, description: 'Accurate stress placement on technical terms.' },
      { id: 'c4', name: 'Intonation & Pitch Control', maxMarks: 20, description: 'Natural rising/falling tone modulation.' },
      { id: 'c5', name: 'MTI Reduction & Intelligibility', maxMarks: 20, description: 'Clear speech without regional accent interference.' }
    ]
  },
  {
    id: 'listening',
    title: 'Active Listening & Comprehension Rubric',
    description: 'Measures key point extraction, lecture synthesis, and Cornell note accuracy.',
    criteria: [
      { id: 'c1', name: 'Core Concept Identification', maxMarks: 20, description: 'Accurately grasps main technical thesis from audio.' },
      { id: 'c2', name: 'Detail & Terminology Recall', maxMarks: 20, description: 'Captures precise engineering specifications and jargon.' },
      { id: 'c3', name: 'Cornell Cue Column Precision', maxMarks: 20, description: 'Formulates effective recall questions and keywords.' },
      { id: 'c4', name: 'Summary Synthesis', maxMarks: 20, description: 'Concise, coherent 3-4 sentence summary of lecture notes.' },
      { id: 'c5', name: 'Speed & Note-taking Efficiency', maxMarks: 20, description: 'Organized layout with bullet symbols and abbreviations.' }
    ]
  },
  {
    id: 'speaking',
    title: '60-Second JAM Speech Rubric',
    description: 'Assesses spontaneous oral delivery, pause control, and elimination of filler words.',
    criteria: [
      { id: 'c1', name: 'Fluency & Pace Control', maxMarks: 20, description: 'Smooth flow without unnatural pauses or hesitations.' },
      { id: 'c2', name: 'Grammatical Accuracy', maxMarks: 20, description: 'Correct tense usage, agreement, and sentence structure.' },
      { id: 'c3', name: 'Vocabulary & Jargon', maxMarks: 20, description: 'Rich, domain-appropriate vocabulary choices.' },
      { id: 'c4', name: 'Minimal Hesitation/Repetition', maxMarks: 20, description: 'Avoidance of filler sounds (um, ah) and phrase repetition.' },
      { id: 'c5', name: 'Vocal Projection & Energy', maxMarks: 20, description: 'Confident tone, vocal pitch clarity, and engagement.' }
    ]
  },
  {
    id: 'group-discussion',
    title: 'Group Discussion (GD) Rubric',
    description: 'Evaluates leadership, initiation, turn-taking, consensus building, and active listening in GDs.',
    criteria: [
      { id: 'c1', name: 'Initiation & Content Quality', maxMarks: 20, description: 'Presents insightful opening viewpoints backed by facts.' },
      { id: 'c2', name: 'Interpersonal & Turn-taking', maxMarks: 20, description: 'Respectfully invites quiet peers and handles interruptions.' },
      { id: 'c3', name: 'Consensus & Moderation', maxMarks: 20, description: 'Helps steer discussion constructively toward common conclusions.' },
      { id: 'c4', name: 'Body Language & Posture', maxMarks: 20, description: 'Maintains open posture, eye contact, and professional gestures.' },
      { id: 'c5', name: 'Summary & Synthesis', maxMarks: 20, description: 'Synthesizes group points neutrally and comprehensively.' }
    ]
  },
  {
    id: 'presentation',
    title: 'Technical Presentation Rubric',
    description: 'Assesses slide structure, verbal delivery, non-verbal posture, and Q&A handling.',
    criteria: [
      { id: 'c1', name: 'Slide Architecture & Design', maxMarks: 20, description: 'Clean visual hierarchy, minimal text clutter, high contrast.' },
      { id: 'c2', name: 'Hook & Structural Flow', maxMarks: 20, description: 'Engaging introduction, logical agenda, and strong conclusion.' },
      { id: 'c3', name: 'Technical Depth & Clarity', maxMarks: 20, description: 'Explains complex technical algorithms clearly.' },
      { id: 'c4', name: 'Eye Contact & Stage Presence', maxMarks: 20, description: 'Connects directly with audience across the room.' },
      { id: 'c5', name: 'Q&A Responsiveness', maxMarks: 20, description: 'Answers technical queries with poise and precision.' }
    ]
  },
  {
    id: 'interview',
    title: 'STAR Behavioral Interview Rubric',
    description: 'Measures Situation, Task, Action, and Result framing in technical interviews.',
    criteria: [
      { id: 'c1', name: 'Situation Contextualization', maxMarks: 20, description: 'Sets up background clearly without unnecessary fluff.' },
      { id: 'c2', name: 'Task & Challenge Definition', maxMarks: 20, description: 'Defines engineering problem and constraints sharply.' },
      { id: 'c3', name: 'Action & Ownership', maxMarks: 20, description: 'Highlights individual technical contribution using "I" statements.' },
      { id: 'c4', name: 'Quantified Results (Metrics)', maxMarks: 20, description: 'Provides specific metrics (% efficiency gain, latency drop).' },
      { id: 'c5', name: 'Professional Poise & Body Language', maxMarks: 20, description: 'Displays calm, articulate, and confident demeanor.' }
    ]
  },
  {
    id: 'email-writing',
    title: 'Corporate Email Writing Rubric',
    description: 'Evaluates formal tone, subject lines, action items, and brevity in professional emails.',
    criteria: [
      { id: 'c1', name: 'Subject Line Precision', maxMarks: 20, description: 'Clear, action-oriented, and specific subject headers.' },
      { id: 'c2', name: 'Salutation & Professional Register', maxMarks: 20, description: 'Appropriate workplace greetings and closing sign-offs.' },
      { id: 'c3', name: 'Body Conciseness & Bullet Structure', maxMarks: 20, description: 'Direct message layout with bullet points for readability.' },
      { id: 'c4', name: 'Grammatical & Punctuation Rigor', maxMarks: 20, description: 'Zero typos, proper capitalization, and correct mechanics.' },
      { id: 'c5', name: 'Clear Call-to-Action (CTA)', maxMarks: 20, description: 'Explicit next steps, deadlines, and responsibilities.' }
    ]
  },
  {
    id: 'resume-writing',
    title: 'ATS Engineering Resume Rubric',
    description: 'Assesses Google XYZ formula, action verbs, single-page layout, and ATS readability.',
    criteria: [
      { id: 'c1', name: 'XYZ Action Verb Formula', maxMarks: 20, description: 'Bullet points framed as "Accomplished [X] by doing [Y] measured by [Z]".' },
      { id: 'c2', name: 'ATS Parseability & Formatting', maxMarks: 20, description: 'Clean single-column structure without graphics or text boxes.' },
      { id: 'c3', name: 'Technical Skills Categorization', maxMarks: 20, description: 'Organized into Languages, Frameworks, Tools, and Core Concepts.' },
      { id: 'c4', name: 'Project Impact & Metric Focus', maxMarks: 20, description: 'Quantified accomplishments across engineering projects.' },
      { id: 'c5', name: 'Grammar & Professional Aesthetics', maxMarks: 20, description: 'Flawless typography, alignment, and zero spelling errors.' }
    ]
  },
  {
    id: 'reading',
    title: 'Technical Speed Reading & Comprehension Rubric',
    description: 'Measures reading speed (WPM), technical recall, and vocabulary recognition.',
    criteria: [
      { id: 'c1', name: 'Reading Pace (WPM Rate)', maxMarks: 20, description: 'Achieves target words-per-minute threshold (200-350 WPM).' },
      { id: 'c2', name: 'Fact & Formula Recall', maxMarks: 20, description: 'Accurately remembers key facts without re-reading.' },
      { id: 'c3', name: 'Contextual Inference', maxMarks: 20, description: 'Deduces meanings of unfamiliar technical terms.' },
      { id: 'c4', name: 'Main Idea & Argument Tracking', maxMarks: 20, description: 'Identifies author position and evidence progression.' },
      { id: 'c5', name: 'Comprehension Retention Rate', maxMarks: 20, description: 'Scores >80% on post-reading quiz verification.' }
    ]
  },
  {
    id: 'debate',
    title: 'CRE Debate Motion Rubric',
    description: 'Assesses Claim, Reason, Evidence, Rebuttal, and logical fallacy detection.',
    criteria: [
      { id: 'c1', name: 'Claim Clarity', maxMarks: 20, description: 'Formulates explicit, unambiguous stance on the motion.' },
      { id: 'c2', name: 'Logical Reasoning Quality', maxMarks: 20, description: 'Presents sound deductions without logical fallacies.' },
      { id: 'c3', name: 'Empirical Evidence & Citation', maxMarks: 20, description: 'Backs arguments with industry statistics and benchmarks.' },
      { id: 'c4', name: 'Strategic Rebuttal', maxMarks: 20, description: 'Deconstructs opponent premises directly and respectfully.' },
      { id: 'c5', name: 'Persuasive Delivery & Stature', maxMarks: 20, description: 'Compelling vocal emphasis and authoritative presence.' }
    ]
  },
  {
    id: 'report-writing',
    title: 'Technical Report & Executive Summary Rubric',
    description: 'Evaluates lab report structure, IEEE referencing, executive summary, and data charts.',
    criteria: [
      { id: 'c1', name: 'Executive Summary Synthesis', maxMarks: 20, description: 'Stand-alone summary detailing problem, methodology, and results.' },
      { id: 'c2', name: 'Section Hierarchy & Headings', maxMarks: 20, description: 'Standard structure: Intro, Related Work, Methodology, Results, Conclusion.' },
      { id: 'c3', name: 'Data Visualization & Captions', maxMarks: 20, description: 'Properly labeled tables, figures, and technical diagrams.' },
      { id: 'c4', name: 'IEEE Citation & References', maxMarks: 20, description: 'Correct numeric citations matching reference list.' },
      { id: 'c5', name: 'Objective Technical Register', maxMarks: 20, description: 'Passive/third-person academic voice without informal colloquialisms.' }
    ]
  },
  {
    id: 'professional-branding',
    title: 'LinkedIn & Digital Personal Branding Rubric',
    description: 'Assesses headline formula, bio story, GitHub alignment, and digital presence score.',
    criteria: [
      { id: 'c1', name: 'Headline Formula Optimization', maxMarks: 20, description: 'Role + Core Tech Stack + Value Proposition + Target Domain.' },
      { id: 'c2', name: 'About Bio Storytelling', maxMarks: 20, description: 'Engaging 3-paragraph career narrative with technical passion.' },
      { id: 'c3', name: 'Featured Work & GitHub Links', maxMarks: 20, description: 'Direct links to deployed apps, code repositories, and certifications.' },
      { id: 'c4', name: 'Keyword SEO for Recruiters', maxMarks: 20, description: 'Includes industry-standard tech stack keywords naturally.' },
      { id: 'c5', name: 'Professional Headshot & Visual Banner', maxMarks: 20, description: 'Clean visual framing suited for engineering recruiters.' }
    ]
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [];

export const INITIAL_INTERNAL_MARKS: StudentInternalMarks[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const SAMPLE_AI_SESSION_SUMMARIES: FacultyAISessionSummary[] = [];

export const CO_PO_MAPPING_DATA: COPOMapping[] = [
  {
    coCode: 'CO1',
    coDescription: 'Understand and apply rules of standard English pronunciation, IPA phonetics, and stress patterns in technical contexts.',
    poMappings: { PO1: 1, PO6: 2, PO9: 3, PO10: 3, PO12: 2 },
    psoMappings: { PSO1: 2, PSO2: 3 }
  },
  {
    coCode: 'CO2',
    coDescription: 'Demonstrate active listening skills, Cornell note-taking, and information synthesis during technical lectures.',
    poMappings: { PO1: 1, PO8: 2, PO9: 3, PO10: 3, PO12: 3 },
    psoMappings: { PSO1: 2, PSO2: 3 }
  },
  {
    coCode: 'CO3',
    coDescription: 'Deliver coherent, fluently articulated spontaneous oral speeches (JAM) and technical presentations without hesitation.',
    poMappings: { PO6: 2, PO8: 2, PO9: 3, PO10: 3, PO12: 3 },
    psoMappings: { PSO1: 3, PSO2: 3 }
  },
  {
    coCode: 'CO4',
    coDescription: 'Draft formal corporate emails, technical lab reports, executive summaries, and ATS-optimized engineering resumes.',
    poMappings: { PO1: 1, PO8: 3, PO9: 2, PO10: 3, PO11: 2, PO12: 3 },
    psoMappings: { PSO1: 3, PSO2: 3 }
  },
  {
    coCode: 'CO5',
    coDescription: 'Participate constructively in group discussions, STAR behavioral interviews, CRE debates, and digital personal branding.',
    poMappings: { PO6: 3, PO8: 3, PO9: 3, PO10: 3, PO11: 3, PO12: 3 },
    psoMappings: { PSO1: 3, PSO2: 3 }
  }
];
