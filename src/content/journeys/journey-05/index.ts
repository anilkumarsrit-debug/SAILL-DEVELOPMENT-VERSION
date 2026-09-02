import { JourneyContentSchema } from '../../types';

export const journey05Content: JourneyContentSchema = {
  journeyId: 'journey-05',
  moduleId: 'public-speaking',
  code: 'SRIT-SAILL-M05',
  title: 'Public Speaking & Presentation',
  shortDesc: 'Design high-impact keynotes, master stage presence, audience engagement hooks, slide design rules, and Q&A handling.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Public Speaking', 'Presentation Skills', 'Keynote Hooks', 'Stage Presence']
  },
  overview: {
    syllabus: 'Unit 1: Opening Hooks (Stories, Questions, Statistics). Unit 2: The 10-20-30 Slide Rule. Unit 3: Executive Q&A Defense.',
    targetAudience: 'Engineering students presenting capstone projects or research papers at national conferences.',
    prerequisiteSkills: ['Spoken English clarity', 'Basic slide presentation tool usage']
  },
  outcomes: {
    primaryOutcome: 'Deliver a 3-minute technical keynote with a compelling opening hook and professional slide visual alignment.',
    bloomTaxonomyLevel: 'Create & Evaluate',
    skillTags: ['Keynote Delivery', 'Visual Storytelling', 'Executive Q&A']
  },
  theory: {
    summary: 'Public speaking relies on the Rhetorical Triangle (Ethos, Pathos, Logos) combined with clear vocal variety and strategic pauses.',
    keyPrinciples: [
      'Ethos: Establish credibility through domain mastery.',
      'Logos: Present structured empirical evidence.',
      'Pathos: Connect emotionally using real-world impact narratives.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Presentation Pitch Analyzer',
    interactiveType: 'presentation_analyzer',
    promptRef: 'PROMPT_M05_PUBLIC_SPEAKING_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-[#list-01]',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Write 3 alternative opening hooks for your capstone project presentation.'],
  reflectionPrompts: ['How did varying your pitch and pauses impact audience engagement during your delivery?'],
  portfolioConfig: {
    submissionTitle: '3-Minute Technical Keynote Pitch Video',
    requirements: ['Submit a 3-minute recorded keynote presentation with slide deck visuals.'],
    rubrics: ['Opening Hook (30%)', 'Slide Design & Clarity (35%)', 'Vocal Variety & Stage Presence (35%)']
  },
  resources: [{ name: 'Presentation Design Standard (PDF)', type: 'pdf', url: '/resources/presentation_standard.pdf' }],
  activities: [
    {
      activityId: 'act-m05-01',
      title: '3-Minute Keynote Hook Delivery',
      learningOutcome: 'Engage audience within the first 30 seconds of presentation.',
      estimatedTime: '15 Mins',
      difficulty: 'Advanced',
      instructions: ['Record your opening hook.', 'Ensure pitch variation and clear eye contact.'],
      examples: [{ id: 'ex-m05-01', title: 'Hook Example', text: 'What if we could reduce server power consumption by 40%?' }],
      practiceDrills: [{ drillId: 'dr-05', prompt: 'Deliver hook for "Smart Grid Energy Management"', type: 'record' }],
      knowledgeCheckRef: 'mcmf-qb-[#list-01]',
      reflectionPrompts: ['Did your opening capture immediate attention?'],
      resources: [],
      promptRef: 'PROMPT_M05_PUBLIC_SPEAKING_01',
      audioReferences: ['aud-prs-01'],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Eliminate slide-reading behavior; encourage direct audience engagement.'],
    commonStudentPitfalls: ['Overcrowding slides with dense text blocks instead of visual diagrams.'],
    suggestedRemediation: ['Enforce max 6 words per line on presentation slides.'],
    ciaEvaluationRubric: [{ criteria: 'Visual & Verbal Delivery Impact', weight: 0.5, maxMarks: 10 }]
  }
};
