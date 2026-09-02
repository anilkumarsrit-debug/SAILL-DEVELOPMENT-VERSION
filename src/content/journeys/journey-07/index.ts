import { JourneyContentSchema } from '../../types';

export const journey07Content: JourneyContentSchema = {
  journeyId: 'journey-07',
  moduleId: 'professional-email',
  code: 'SRIT-SAILL-M07',
  title: 'Professional Email Etiquette',
  shortDesc: 'Structure corporate emails, draft actionable subject lines, master professional salutations, and handle project escalations.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Email Etiquette', 'Corporate Communication', 'Actionable Subject Lines', 'Professional Tone']
  },
  overview: {
    syllabus: 'Unit 1: The 4-Part Email Structure. Unit 2: High-Impact Subject Lines. Unit 3: Escalation & Follow-up Strategies.',
    targetAudience: 'Students communicating with faculty, project supervisors, and corporate recruiters.',
    prerequisiteSkills: ['Basic English writing skills']
  },
  outcomes: {
    primaryOutcome: 'Draft professional emails with specific subject lines, polite salutations, clear calls-to-action (CTA), and professional sign-offs.',
    bloomTaxonomyLevel: 'Apply & Create',
    skillTags: ['Email Composition', 'Corporate Tone', 'CTA Clarity']
  },
  theory: {
    summary: 'Professional emails must be scannable, courteous, and focused on a single actionable primary objective.',
    keyPrinciples: [
      'Subject line must state context and action (e.g., "[Action Required] Internship Approval Request - Reg. No. 24001").',
      'Salutations should reflect organizational hierarchy.',
      'Place the core call-to-action (CTA) in a distinct bullet or paragraph.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Corporate Email Simulator',
    interactiveType: 'email_simulator',
    promptRef: 'PROMPT_M07_EMAIL_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-gram-02',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Draft a follow-up email requesting a project review from your faculty advisor.'],
  reflectionPrompts: ['What makes an email subject line immediately actionable for a busy manager?'],
  portfolioConfig: {
    submissionTitle: 'Corporate Email Communication Portfolio',
    requirements: ['Submit 3 professional email samples: Leave Request, Project Escalation, and Recruiter Follow-up.'],
    rubrics: ['Subject Line Impact (30%)', 'Tone & Salutation (35%)', 'CTA Clarity (35%)']
  },
  resources: [{ name: 'Email Etiquette Phrasebook (PDF)', type: 'pdf', url: '/resources/email_phrasebook.pdf' }],
  activities: [
    {
      activityId: 'act-m07-01',
      title: 'Actionable Subject Line & CTA Composition',
      learningOutcome: 'Construct an unambiguous subject line and clear call-to-action.',
      estimatedTime: '15 Mins',
      difficulty: 'Foundation',
      instructions: ['Read the scenario prompt.', 'Compose subject and body.', 'Analyze AI etiquette score.'],
      examples: [{ id: 'ex-m07-01', title: 'Subject Line', text: 'URGENT -> [Approval Request] Hardware Lab Component Access' }],
      practiceDrills: [{ drillId: 'dr-07', prompt: 'Write an email requesting internship NOC from HOD.', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-gram-02',
      reflectionPrompts: ['Did your email contain a single, unambiguous call to action?'],
      resources: [],
      promptRef: 'PROMPT_M07_EMAIL_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Eliminate casual SMS/chat contractions in student-faculty correspondence.'],
    commonStudentPitfalls: ['Omitting subject lines or using generic subjects like "Query" or "Help".'],
    suggestedRemediation: ['Mandate formal email templates for all student lab waiver submissions.'],
    ciaEvaluationRubric: [{ criteria: 'Professional Email Appropriateness', weight: 0.5, maxMarks: 10 }]
  }
};
