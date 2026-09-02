import { JourneyContentSchema } from '../../types';

export const journey12Content: JourneyContentSchema = {
  journeyId: 'journey-12',
  moduleId: 'etiquette-branding',
  code: 'SRIT-SAILL-M12',
  title: 'Professional Etiquette & Personal Branding',
  shortDesc: 'Craft your digital engineering brand, optimize LinkedIn headlines, master workplace netiquette, and project executive presence.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Personal Branding', 'LinkedIn Optimization', 'Workplace Netiquette', 'Executive Presence']
  },
  overview: {
    syllabus: 'Unit 1: LinkedIn Headline & About Section Optimization. Unit 2: Digital Netiquette & Workplace Communication. Unit 3: Building a Public Engineering Portfolio.',
    targetAudience: 'Graduating students preparing for corporate onboarding and professional networking.',
    prerequisiteSkills: ['Basic social media familiarity', 'Updated resume draft']
  },
  outcomes: {
    primaryOutcome: 'Draft a compelling 220-character LinkedIn headline and 200-word personal brand summary targeting engineering roles.',
    bloomTaxonomyLevel: 'Create & Apply',
    skillTags: ['LinkedIn Optimization', 'Executive Presence', 'Digital Branding']
  },
  theory: {
    summary: 'A strong professional brand communicates your technical specialization, core values, and unique engineering value proposition.',
    keyPrinciples: [
      'Headline Formula: [Target Role] | [Key Technical Skills] | [Impact Statement].',
      'About Section: Tell a compelling 3-paragraph career story (Past passion, Present projects, Future goals).',
      'Netiquette: Respect asynchronous communication boundaries and maintain professional tone across platforms.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Personal Brand & LinkedIn Headline Generator',
    interactiveType: 'branding_studio',
    promptRef: 'PROMPT_M12_ETIQUETTE_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-biz-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Write a 220-character LinkedIn headline highlighting your engineering domain.'],
  reflectionPrompts: ['How does your online digital brand align with the roles you aspire to hold?'],
  portfolioConfig: {
    submissionTitle: 'Complete Professional Personal Brand Blueprint',
    requirements: ['Submit 1-page branding plan including optimized LinkedIn profile copy, GitHub bio, and elevator pitch script.'],
    rubrics: ['Headline & Bio Impact (35%)', 'Value Proposition Clarity (35%)', 'Netiquette Awareness (30%)']
  },
  resources: [{ name: 'LinkedIn Optimization Guide for Engineers (PDF)', type: 'pdf', url: '/resources/linkedin_guide.pdf' }],
  activities: [
    {
      activityId: 'act-m12-01',
      title: 'LinkedIn Headline & Value Proposition Drafting',
      learningOutcome: 'Compose high-impact headline targeting recruiter keyword searches.',
      estimatedTime: '15 Mins',
      difficulty: 'Foundation',
      instructions: ['Input your technical domain.', 'Generate headline options.', 'Refine and test recruiter appeal score.'],
      examples: [{ id: 'ex-m12-01', title: 'Headline Model', text: 'Full-Stack Developer | React & Node.js | B.Tech CSE @ SRIT | Built AI Learning Systems' }],
      practiceDrills: [{ drillId: 'dr-12', prompt: 'Draft headline for Data Science specialization.', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-biz-01',
      reflectionPrompts: ['Does your headline include target job title keywords?'],
      resources: [],
      promptRef: 'PROMPT_M12_ETIQUETTE_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Empower graduating engineers to showcase academic projects effectively to industry recruiters.'],
    commonStudentPitfalls: ['Using generic headlines like "Student at SRIT" without highlighting technical skills.'],
    suggestedRemediation: ['Conduct live LinkedIn profile review clinics during final semester placement prep.'],
    ciaEvaluationRubric: [{ criteria: 'Digital Brand Readiness & Recruiter Appeal', weight: 0.5, maxMarks: 10 }]
  }
};
