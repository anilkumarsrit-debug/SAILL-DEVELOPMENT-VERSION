import { JourneyContentSchema } from '../../types';

export const journey04Content: JourneyContentSchema = {
  journeyId: 'journey-04',
  moduleId: 'group-discussion',
  code: 'SRIT-SAILL-M04',
  title: 'Group Discussion Mastery',
  shortDesc: 'Master professional GD dynamics, polite intervention strategies, consensus building, argument synthesis, and body language etiquette.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Group Discussion', 'Consensus Building', 'Polite Intervention', 'Leadership Etiquette']
  },
  overview: {
    syllabus: 'Unit 1: GD Roles (Initiator, Moderator, Summarizer). Unit 2: Intervention Techniques. Unit 3: AI GD Multi-Agent Simulation.',
    targetAudience: 'Placement-seeking students appearing for IT and core corporate campus recruitment group discussions.',
    prerequisiteSkills: ['Spoken English fluency', 'Basic awareness of current technology trends']
  },
  outcomes: {
    primaryOutcome: 'Execute 3 distinct GD interventions (initiation, counter-argument, synthesis) while observing professional turn-taking etiquette.',
    bloomTaxonomyLevel: 'Apply & Evaluate',
    skillTags: ['Intervention Strategy', 'Consensus Facilitation', 'Argumentation']
  },
  theory: {
    summary: 'Group discussions evaluate collaboration over confrontation. Candidates are scored on reasoning quality, polite interventions, and group summarization.',
    keyPrinciples: [
      'Acknowledge prior speakers before presenting a counter-view.',
      'Use data-backed evidence rather than emotional assertions.',
      'Help re-steer off-topic discussions back to the core prompt.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Multi-Persona GD Simulator',
    interactiveType: 'gd_simulator',
    promptRef: 'PROMPT_M04_GD_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-biz-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: [
    'Log your interventions during the AI GD simulation. Note whether you initiated, moderated, or summarized.'
  ],
  reflectionPrompts: [
    'How did you handle aggressive counter-arguments during the discussion simulation?'
  ],
  portfolioConfig: {
    submissionTitle: 'GD Intervention & Synthesis Transcript',
    requirements: ['Submit a recording/transcript of your multi-persona GD session with AI leadership rubric evaluation.'],
    rubrics: ['Polite Assertion (40%)', 'Argument Depth (30%)', 'Group Facilitation (30%)']
  },
  resources: [{ name: 'GD Etiquette & Phrasebook (PDF)', type: 'pdf', url: '/resources/gd_phrasebook.pdf' }],
  activities: [
    {
      activityId: 'act-m04-01',
      title: 'Polite Intervention Practice Drill',
      learningOutcome: 'Politely intervene when multiple speakers speak simultaneously.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Participate in the AI GD simulation.', 'Intervene using phrase "May I add a perspective here...".'],
      examples: [{ id: 'ex-m04-01', title: 'Intervention Phrase', text: 'I agree with Rahul, but considering scalability...' }],
      practiceDrills: [{ drillId: 'dr-04', prompt: 'Topic: "Is AI a Threat to Human Software Developers?"', type: 'interactive' }],
      knowledgeCheckRef: 'mcmf-qb-biz-01',
      reflectionPrompts: ['Were you able to pivot the group focus toward consensus?'],
      resources: [],
      promptRef: 'PROMPT_M04_GD_01',
      audioReferences: ['aud-cnv-01'],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Discourage hostile interjections; enforce collaborative peer dialogue.'],
    commonStudentPitfalls: ['Dominating discussion time without inviting quieter participants to speak.'],
    suggestedRemediation: ['Assign summarizer roles to dominant students to build active listening.'],
    ciaEvaluationRubric: [{ criteria: 'Collaborative Leadership', weight: 0.5, maxMarks: 10 }]
  }
};
