import { JourneyContentSchema } from '../../types';

export const journey02Content: JourneyContentSchema = {
  journeyId: 'journey-02',
  moduleId: 'listening',
  code: 'SRIT-SAILL-M02',
  title: 'Listening Comprehension Lab',
  shortDesc: 'Develop active listening skills for global accents, technical lectures, acoustic transition cues, and note-taking strategies.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Active Listening', 'Note-Taking', 'Global Accents', 'Lecture Comprehension']
  },
  overview: {
    syllabus: 'Unit 1: Acoustic Pitch Boundaries. Unit 2: Global Accent Diversity (US, UK, Australian, Indian). Unit 3: Technical Lecture Note-Taking Systems (Cornell Method).',
    targetAudience: 'Engineering and computer science undergraduates preparing for international technical symposiums and webinars.',
    prerequisiteSkills: ['Basic English listening comprehension', 'Headphones for audio fidelity']
  },
  outcomes: {
    primaryOutcome: 'Accurately decode fast-paced academic lectures and extract core technical arguments across varied international accents.',
    bloomTaxonomyLevel: 'Understand & Analyze',
    skillTags: ['Lecture Decoding', 'Cornell Note-Taking', 'Accent Familiarity']
  },
  theory: {
    summary: 'Active listening involves cognitive filtering, identifying signpost expressions (e.g. "To summarize", "In contrast"), and recognizing pitch drops at discourse boundaries.',
    keyPrinciples: [
      'Signpost transitions signal shifts in speaker intent.',
      'Acoustic pitch drops mark topic completions.',
      'Shorthand symbol notation accelerates real-time note-taking.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'Global Accent Audio Laboratory',
    interactiveType: 'accent_audio_lab',
    promptRef: 'PROMPT_M02_LISTENING_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-[#list-01]',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: [
    'Transcribe a 1-minute audio passage using the Cornell Note-Taking method and identify 3 key signpost transitions.'
  ],
  reflectionPrompts: [
    'Which accent variation presented the greatest challenge, and what acoustic strategy helped you decode it?'
  ],
  portfolioConfig: {
    submissionTitle: 'Technical Lecture Summary & Synthesis Artifact',
    requirements: [
      'Submit a structured 200-word synthesis of a recorded computer science guest lecture.'
    ],
    rubrics: ['Detail Accuracy (40%)', 'Note-Taking Structure (30%)', 'Synthesis Clarity (30%)']
  },
  resources: [
    { name: 'Cornell Note-Taking Template (PDF)', type: 'pdf', url: '/resources/cornell_notes.pdf' }
  ],
  activities: [
    {
      activityId: 'act-m02-01',
      title: 'Signpost Expression Decoding Drill',
      learningOutcome: 'Identify transition phrases in academic technical lectures.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Listen to the lecture clip.', 'Select signpost terms.', 'Answer comprehension questions.'],
      examples: [{ id: 'ex-m02-01', title: 'Signpost Example', text: 'Turning now to system architecture...' }],
      practiceDrills: [{ drillId: 'dr-02', prompt: 'Listen to Passage 1 and extract the 3 primary architectural challenges.', type: 'quiz' }],
      knowledgeCheckRef: 'mcmf-qb-[#list-01]',
      reflectionPrompts: ['How did signpost cues aid your note-taking speed?'],
      resources: [],
      promptRef: 'PROMPT_M02_LISTENING_01',
      audioReferences: ['aud-sen-01'],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Train students to recognize non-native and native English accent variations in technical webinars.'],
    commonStudentPitfalls: ['Attempting word-for-word verbatim transcription rather than capturing conceptual hierarchies.'],
    suggestedRemediation: ['Practice shorthand symbol replacement for technical terms during live listening.'],
    ciaEvaluationRubric: [{ criteria: 'Comprehension Accuracy', weight: 0.5, maxMarks: 10 }]
  }
};
