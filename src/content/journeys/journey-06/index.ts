import { JourneyContentSchema } from '../../types';

export const journey06Content: JourneyContentSchema = {
  journeyId: 'journey-06',
  moduleId: 'professional-writing',
  code: 'SRIT-SAILL-M06',
  title: 'Professional Technical Writing',
  shortDesc: 'Craft precise technical documentation, eliminate wordiness, master active vs passive voice choices, and format engineering specs.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Technical Writing', 'Clarity Index', 'Documentation', 'Conciseness']
  },
  overview: {
    syllabus: 'Unit 1: The Gunning Fog Clarity Index. Unit 2: Voice & Tone in Technical Manuals. Unit 3: API & Architectural Documentation.',
    targetAudience: 'Engineering undergraduates preparing for technical writing roles, software documentation, and research articles.',
    prerequisiteSkills: ['Grammar fundamentals', 'Basic technical vocabulary']
  },
  outcomes: {
    primaryOutcome: 'Rewrite wordy technical drafts to achieve a Gunning Fog Index < 12 and 100% passive-voice appropriateness.',
    bloomTaxonomyLevel: 'Apply & Create',
    skillTags: ['Technical Clarity', 'Gunning Fog Reduction', 'Documentation Design']
  },
  theory: {
    summary: 'Technical writing prioritizes precision, conciseness, and unambiguous instruction over literary embellishment.',
    keyPrinciples: [
      'Eliminate filler phrases (e.g., replace "due to the fact that" with "because").',
      'Use active voice for operational instructions, passive for objective procedure reports.',
      'Use numbered lists for sequential steps and bulleted lists for non-sequential items.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Clarity & Readability Analyzer',
    interactiveType: 'writing_analyzer',
    promptRef: 'PROMPT_M06_PROFESSIONAL_WRITING_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-gram-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Edit a 150-word wordy technical passage and calculate word reduction percentage.'],
  reflectionPrompts: ['Which unnecessary phrases were easiest to eliminate from your technical draft?'],
  portfolioConfig: {
    submissionTitle: 'Engineering System Documentation Spec',
    requirements: ['Submit a 2-page technical specification document formatted according to IEEE standards.'],
    rubrics: ['Clarity & Conciseness (40%)', 'Technical Precision (30%)', 'Format Hygiene (30%)']
  },
  resources: [{ name: 'IEEE Technical Style Guide (PDF)', type: 'pdf', url: '/resources/ieee_style.pdf' }],
  activities: [
    {
      activityId: 'act-m06-01',
      title: 'Wordiness Elimination Drill',
      learningOutcome: 'Reduce word count by at least 30% without losing core technical meaning.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Read the verbose technical passage.', 'Rewrite concisely in the text editor.', 'Check AI clarity score.'],
      examples: [{ id: 'ex-m06-01', title: 'Editing Example', text: 'Original: "At this point in time..." -> Edited: "Now..."' }],
      practiceDrills: [{ drillId: 'dr-06', prompt: 'Rewrite passage on cloud server setup.', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-gram-01',
      reflectionPrompts: ['How did reducing wordiness improve reader comprehension?'],
      resources: [],
      promptRef: 'PROMPT_M06_PROFESSIONAL_WRITING_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Train students to write concise, ambiguity-free technical manuals.'],
    commonStudentPitfalls: ['Using overly complex vocabulary to sound formal, degrading readability.'],
    suggestedRemediation: ['Incorporate readability index targets (e.g. Flesch-Kincaid Grade 10) on assignments.'],
    ciaEvaluationRubric: [{ criteria: 'Clarity & Technical Accuracy', weight: 0.5, maxMarks: 10 }]
  }
};
