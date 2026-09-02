import { JourneyContentSchema } from '../../types';

export const journey03Content: JourneyContentSchema = {
  journeyId: 'journey-03',
  moduleId: 'spoken-english',
  code: 'SRIT-SAILL-M03',
  title: 'Spoken English & JAM Drills',
  shortDesc: 'Build spontaneous oral fluency, eliminate hesitation markers, master 60-second Just-A-Minute (JAM) speeches, and enhance conversational confidence.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Spoken English', 'JAM Session', 'Fluency', 'Impromptu Speaking']
  },
  overview: {
    syllabus: 'Unit 1: Impromptu Speech Frameworks (PREP Model). Unit 2: Eliminating Vocal Fillers (um, ah, like). Unit 3: 60-Second JAM Drills.',
    targetAudience: 'Engineering students preparing for campus placement interviews and spontaneous oral rounds.',
    prerequisiteSkills: ['Basic conversational vocabulary']
  },
  outcomes: {
    primaryOutcome: 'Deliver a structured 60-second impromptu speech with less than 2 vocal fillers and a speaking rate of 120-140 WPM.',
    bloomTaxonomyLevel: 'Apply & Create',
    skillTags: ['Impromptu Fluency', 'PREP Framework', 'Filler Elimination']
  },
  theory: {
    summary: 'The PREP Model (Point, Reason, Example, Point) provides a robust structure for extemporaneous speaking without hesitation.',
    keyPrinciples: [
      'Point: State your thesis clearly in sentence 1.',
      'Reason: Provide logical justification.',
      'Example: Illustrate with a concrete scenario.',
      'Point: Restate conclusion firmly.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI JAM Simulator & Filler Counter',
    interactiveType: 'jam_simulator',
    promptRef: 'PROMPT_M03_SPOKEN_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-vocab-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: [
    'Record a 60-second JAM speech on "The Impact of AI on Future Jobs". Log your filler count.'
  ],
  reflectionPrompts: [
    'How did pause insertion help reduce vocal fillers during your recording?'
  ],
  portfolioConfig: {
    submissionTitle: 'Impromptu JAM Speech Video/Audio Artifact',
    requirements: ['Submit a clean 60-second JAM speech with AI feedback report showing filler count < 2.'],
    rubrics: ['Fluency & WPM (40%)', 'Structure & PREP (30%)', 'Confidence & Clarity (30%)']
  },
  resources: [{ name: 'PREP Impromptu Model Guide (PDF)', type: 'pdf', url: '/resources/prep_guide.pdf' }],
  activities: [
    {
      activityId: 'act-m03-01',
      title: '60-Second JAM Speech Execution',
      learningOutcome: 'Deliver a structured JAM response under timed pressure.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Select a random topic.', 'Prepare for 10 seconds.', 'Record 60 seconds without long pause or filler.'],
      examples: [{ id: 'ex-m03-01', title: 'PREP Model Sample', text: 'Point: Renewable energy is vital...' }],
      practiceDrills: [{ drillId: 'dr-03', prompt: 'Topic: "Remote Work vs Office Work"', type: 'record' }],
      knowledgeCheckRef: 'mcmf-qb-vocab-01',
      reflectionPrompts: ['Did you maintain a WPM between 120 and 140?'],
      resources: [],
      promptRef: 'PROMPT_M03_SPOKEN_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Train students to replace filler vocalizations with silent pauses.'],
    commonStudentPitfalls: ['Rushing speech to avoid silence, leading to grammatical breakdown.'],
    suggestedRemediation: ['Mandate a 2-second deliberate pause after state points.'],
    ciaEvaluationRubric: [{ criteria: 'Fluency & WPM Rate', weight: 0.5, maxMarks: 10 }]
  }
};
