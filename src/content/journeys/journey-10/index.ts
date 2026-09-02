import { JourneyContentSchema } from '../../types';

export const journey10Content: JourneyContentSchema = {
  journeyId: 'journey-10',
  moduleId: 'debate-skills',
  code: 'SRIT-SAILL-M10',
  title: 'Debate & Persuasive Argumentation',
  shortDesc: 'Master Oxford-style parliamentary debate rules, construct logical premises, detect fallacies, and execute sharp rebuttals.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Debate', 'Oxford Style', 'Fallacy Detection', 'Persuasive Argumentation']
  },
  overview: {
    syllabus: 'Unit 1: Toulmin Model of Argumentation. Unit 2: Identifying Logical Fallacies (Ad Hominem, Strawman, Slippery Slope). Unit 3: Rebuttal & Cross-Examination.',
    targetAudience: 'Engineering students participating in university literary events and competitive debate forums.',
    prerequisiteSkills: ['Fluent spoken English', 'Basic logical reasoning']
  },
  outcomes: {
    primaryOutcome: 'Construct sound arguments supported by Claim, Data, and Warrant while refuting opponent fallacies.',
    bloomTaxonomyLevel: 'Evaluate & Create',
    skillTags: ['Toulmin Model', 'Fallacy Refutation', 'Persuasive Speech']
  },
  theory: {
    summary: 'Persuasive debate combines structured logical reasoning (Claim-Data-Warrant) with strategic rebuttal and confident delivery.',
    keyPrinciples: [
      'Claim: The central proposition being asserted.',
      'Data: Empirical evidence or facts supporting the claim.',
      'Warrant: Logical reasoning connecting the data to the claim.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Debate Arena & Fallacy Detector',
    interactiveType: 'debate_arena',
    promptRef: 'PROMPT_M10_DEBATE_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-biz-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Identify 2 logical fallacies in a sample political speech transcript.'],
  reflectionPrompts: ['How did structuring arguments via Claim-Data-Warrant strengthen your rebuttal performance?'],
  portfolioConfig: {
    submissionTitle: 'Debate Motion Argumentative Brief',
    requirements: ['Submit a 2-page debate brief defending the proposition on a technological ethics motion.'],
    rubrics: ['Logical Soundness (40%)', 'Evidence Backing (30%)', 'Rebuttal Force (30%)']
  },
  resources: [{ name: 'Debate Rules & Fallacy Field Guide (PDF)', type: 'pdf', url: '/resources/debate_guide.pdf' }],
  activities: [
    {
      activityId: 'act-m10-01',
      title: 'Toulmin Model Argument Construction',
      learningOutcome: 'Formulate argument with explicit claim, data, and warrant components.',
      estimatedTime: '15 Mins',
      difficulty: 'Advanced',
      instructions: ['Read the motion.', 'Construct 3-part argument.', 'Submit for AI debate judge evaluation.'],
      examples: [{ id: 'ex-m10-01', title: 'Toulmin Example', text: 'Claim: Nuclear power is essential. Data: 0% carbon emissions during operation. Warrant: Clean energy is needed for zero-carbon targets.' }],
      practiceDrills: [{ drillId: 'dr-10', prompt: 'Motion: "This House Would Regulate Generative AI Development"', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-biz-01',
      reflectionPrompts: ['Were your warrants explicitly connected to your empirical data?'],
      resources: [],
      promptRef: 'PROMPT_M10_DEBATE_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Develop critical analytical thinking and evidence-based oral argumentation.'],
    commonStudentPitfalls: ['Relying on emotional rhetoric rather than empirical data and logical warrants.'],
    suggestedRemediation: ['Incorporate live cross-examination drills with timer limits.'],
    ciaEvaluationRubric: [{ criteria: 'Argument Soundness & Fallacy Detection', weight: 0.5, maxMarks: 10 }]
  }
};
