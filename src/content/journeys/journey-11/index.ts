import { JourneyContentSchema } from '../../types';

export const journey11Content: JourneyContentSchema = {
  journeyId: 'journey-11',
  moduleId: 'report-writing',
  code: 'SRIT-SAILL-M11',
  title: 'Technical Report & Proposal Writing',
  shortDesc: 'Structure executive project proposals, IEEE lab reports, feasibility studies, data visualizations, and citations.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Report Writing', 'IEEE Format', 'Executive Summaries', 'Project Proposals']
  },
  overview: {
    syllabus: 'Unit 1: Report Structure (Abstract, Intro, Methods, Results, Discussion). Unit 2: Feasibility Proposal Writing. Unit 3: APA/IEEE Citation Styles.',
    targetAudience: 'Engineering undergraduates preparing final year capstone project reports and grant proposals.',
    prerequisiteSkills: ['Technical writing basics', 'Word processing proficiency']
  },
  outcomes: {
    primaryOutcome: 'Compose a complete 3-page IEEE-format technical lab report with properly formatted equations, figures, and references.',
    bloomTaxonomyLevel: 'Create & Evaluate',
    skillTags: ['IEEE Report Format', 'Executive Summary', 'Academic Citation']
  },
  theory: {
    summary: 'Executive reports provide structured empirical findings for decision-makers using standardized academic formats (IMRAD).',
    keyPrinciples: [
      'IMRAD Structure: Introduction, Methods, Results, And Discussion.',
      'All figures and tables must be explicitly cross-referenced in the text (e.g., "See Figure 2").',
      'Citations must follow consistent IEEE or APA numerical brackets.'
    ]
  },
  interactiveDemoConfig: {
    demoTitle: 'AI Executive Report Builder & IEEE Formatter',
    interactiveType: 'report_builder',
    promptRef: 'PROMPT_M11_REPORT_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-writ-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: ['Draft a 150-word Executive Summary for a smart city IoT implementation project.'],
  reflectionPrompts: ['How does proper figure cross-referencing enhance report credibility?'],
  portfolioConfig: {
    submissionTitle: 'Capstone Engineering Technical Report',
    requirements: ['Submit a 3-page IEEE-formatted technical report complete with abstract, figures, and references.'],
    rubrics: ['IMRAD Structure (35%)', 'Data Representation (35%)', 'Citation Hygiene (30%)']
  },
  resources: [{ name: 'IEEE Report Formatting Standard (PDF)', type: 'pdf', url: '/resources/ieee_report_format.pdf' }],
  activities: [
    {
      activityId: 'act-m11-01',
      title: 'Executive Summary & Abstract Composition',
      learningOutcome: 'Synthesize complex technical research into a 200-word executive summary.',
      estimatedTime: '15 Mins',
      difficulty: 'Intermediate',
      instructions: ['Review experimental dataset.', 'Write executive summary.', 'Check AI IEEE compliance report.'],
      examples: [{ id: 'ex-m11-01', title: 'Abstract Model', text: 'Abstract: "This report presents a 24% efficiency increase in solar thermal storage..."' }],
      practiceDrills: [{ drillId: 'dr-11', prompt: 'Write Abstract for IoT Sensor Array Project.', type: 'written' }],
      knowledgeCheckRef: 'mcmf-qb-writ-01',
      reflectionPrompts: ['Did your abstract capture problem, method, and results concisely?'],
      resources: [],
      promptRef: 'PROMPT_M11_REPORT_01',
      audioReferences: [],
      imageReferences: []
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: ['Prepare B.Tech final year students for NAAC/NBA accredited capstone project report submissions.'],
    commonStudentPitfalls: ['Mixing results and discussion sections without maintaining objective tone.'],
    suggestedRemediation: ['Mandate IEEE template usage in all 3rd and 4th-year laboratory courses.'],
    ciaEvaluationRubric: [{ criteria: 'IEEE Report Rigor & Structural Integrity', weight: 0.5, maxMarks: 10 }]
  }
};
