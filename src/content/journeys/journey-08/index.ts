import { JourneyContentSchema } from '../../types';

export const journey08Content: JourneyContentSchema = {
  journeyId: 'journey-08',
  moduleId: 'resume-writing',
  code: 'SRIT-SAILL-M08',
  title: 'Resume & Cover Letter Studio',
  shortDesc: 'Build ATS-compliant engineering resumes, formulate action-verb metric statements, and draft tailored cover letters.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Resume Building', 'ATS Optimization', 'Action Verbs', 'Quantifiable Metrics']
  },
  overview: {
    syllabus: 'Unit 1: ATS Parser Mechanics & Formatting Rules. Unit 2: Google XYZ Bullet Point Formula. Unit 3: Customized Cover Letters.',
    targetAudience: 'Pre-final and final year B.Tech/MCA students preparing for corporate placement drives.',
    prerequisiteSkills: ['Basic word processing', 'List of academic projects and internships']
  },
  outcomes: {
    primaryOutcome: 'Formulate quantifiable resume bullet points using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).',
    bloomTaxonomyLevel: 'Apply & Create',
    skillTags: ['ATS Optimization', 'XYZ Bullet Formula', 'Career Documentation']
  },
  theory: {
    summary: 'Applicant Tracking Systems (ATS) scan resumes for keywords, clear headings, and metric-backed project bullet points.',
    keyPrinciples: [
      'XYZ Formula: "Engineered [X] resulting in [Y]% latency reduction by implementing [Z]".',
      'Use standard headings (Education, Technical Skills, Projects, Experience).',
      'Avoid tables, columns, and embedded graphic images that confuse ATS parsers.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI ATS Resume Parser & Bullet Optimizer',
    interactiveType: 'resume_builder',
    promptRef: 'PROMPT_M08_RESUME_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-[#int-01]',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Transform 3 plain project bullet points into metric-backed XYZ formula statements.'],
  reflectionPrompts: ['How did adding specific metrics increase the impact of your project descriptions?'],
  portfolioConfig: {
    submissionTitle: 'ATS-Optimized Engineering Resume & Cover Letter',
    requirements: ['Submit 1-page ATS-formatted PDF resume + 1 tailored cover letter for a target job description.'],
    rubrics: ['ATS Keyword Density (35%)', 'XYZ Metric Formula Usage (35%)', 'Formatting Hygiene (30%)']
  },
  resources: [{ name: 'SRIT Approved Resume Template (Docx)', type: 'doc', url: '/resources/srit_resume_template.docx' }],
  activities: [
    {
      activityId: 'act-m08-01',
      title: 'XYZ Metric Bullet Point Optimization',
      learningOutcome: 'Rewrite resume bullet points incorporating quantifiable metrics.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Input raw project description.', 'Apply XYZ formula.', 'Review ATS parser feedback.'],
      examples: [{ id: 'ex-m08-01', title: 'XYZ Formula', text: 'Developed React dashboard reducing load time by 35% using lazy loading.' }],
      practiceDrills: [{ drillId: 'dr-08', prompt: 'Optimize bullet point for Capstone Project.', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-[#int-01]',
      reflectionPrompts: ['Does your resume clearly showcase quantifiable engineering results?'],
      resources: [],
      promptRef: 'PROMPT_M08_RESUME_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Ensure 100% placement-eligible students possess ATS-compliant resume formats.'],
    commonStudentPitfalls: ['Listing passive job duties instead of active, metric-driven achievements.'],
    suggestedRemediation: ['Provide industry-specific keyword banks for Software, Core Electronics, and Civil branches.'],
    ciaEvaluationRubric: [{ criteria: 'ATS Compliance & Metric Rigor', weight: 0.5, maxMarks: 10 }]
  }
};
