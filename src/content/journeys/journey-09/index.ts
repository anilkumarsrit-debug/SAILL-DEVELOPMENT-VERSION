import { JourneyContentSchema } from '../../types';

export const journey09Content: JourneyContentSchema = {
  journeyId: 'journey-09',
  moduleId: 'reading-comprehension',
  code: 'SRIT-SAILL-M09',
  title: 'Reading Comprehension & Critical Analysis',
  shortDesc: 'Analyze complex research literature, master speed reading techniques (skimming & scanning), and synthesize technical papers.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Reading Comprehension', 'Critical Analysis', 'Speed Reading', 'IEEE Paper Decoding']
  },
  overview: {
    syllabus: 'Unit 1: Skimming & Scanning Strategies. Unit 2: Identifying Central Claims & Logical Fallacies. Unit 3: Literature Review Synthesis.',
    targetAudience: 'Undergraduates preparing for GATE/GRE verbal sections and research paper writing.',
    prerequisiteSkills: ['Intermediate English reading ability']
  },
  outcomes: {
    primaryOutcome: 'Extract main thesis, methodology, and empirical findings from IEEE paper abstracts within 3 minutes.',
    bloomTaxonomyLevel: 'Analyze & Evaluate',
    skillTags: ['Skimming & Scanning', 'Thesis Identification', 'Literature Synthesis']
  },
  theory: {
    summary: 'Critical reading involves actively interrogating text structure, evaluating evidence validity, and distinguishing fact from inference.',
    keyPrinciples: [
      'Skimming: Read title, abstract, section headings, and conclusions for macro-understanding.',
      'Scanning: Search for specific numerical data, keywords, or citations.',
      'Active Annotation: Highlight key claims and logical premises.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Speed Reading & Comprehension Lab',
    interactiveType: 'reading_analyzer',
    promptRef: 'PROMPT_M09_READING_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-read-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Read the provided 500-word AI ethics passage and write a 50-word synthesis.'],
  reflectionPrompts: ['How did skimming headings before reading full text improve your comprehension speed?'],
  portfolioConfig: {
    submissionTitle: 'Annotated Research Paper Literature Review',
    requirements: ['Submit a 1-page structured review of a peer-reviewed technical journal paper.'],
    rubrics: ['Synthesis Accuracy (40%)', 'Methodology Decoding (30%)', 'Critical Analysis (30%)']
  },
  resources: [{ name: 'Critical Reading Guide (PDF)', type: 'pdf', url: '/resources/critical_reading.pdf' }],
  activities: [
    {
      activityId: 'act-m09-01',
      title: 'Timed IEEE Abstract Synthesis Drill',
      learningOutcome: 'Identify problem, methodology, and key results under timed conditions.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Read IEEE abstract.', 'Answer 4 analytical comprehension questions.'],
      examples: [{ id: 'ex-m09-01', title: 'Abstract Sample', text: 'Abstract: "This paper proposes a novel quantum encryption..."' }],
      practiceDrills: [{ drillId: 'dr-09', prompt: 'Synthesize abstract on Autonomous Systems.', type: 'quiz' }],
      knowledgeCheckRef: 'mcmf-qb-read-01',
      reflectionPrompts: ['Did you locate key findings within the target 3-minute limit?'],
      resources: [],
      promptRef: 'PROMPT_M09_READING_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Prepare students for competitive exams (GATE/GRE) and literature survey modules.'],
    commonStudentPitfalls: ['Reading technical papers linearly like narrative prose instead of strategically.'],
    suggestedRemediation: ['Train students to read the Abstract and Conclusion first before diving into methodology.'],
    ciaEvaluationRubric: [{ criteria: 'Comprehension & Synthesis Rigor', weight: 0.5, maxMarks: 10 }]
  }
};
