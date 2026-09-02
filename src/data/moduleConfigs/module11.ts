import { ModuleConfig } from '../../types/moduleConfig';

export const module11Config: ModuleConfig = {
  moduleId: 'report-writing',
  code: 'R26-LAB-11',
  title: 'Technical Report Writing & Documentation',
  syllabusTopic: 'Report Architecture, Executive Summary, Methodology, IEEE Citation Style, Data Visuals & Feasibility Analysis',
  description: 'Master formal engineering report structure, drafting executive summaries, methodology sections, data visuals captioning, IEEE reference citation, and feasibility analysis.',

  notebookConfig: {
    experimentNumber: 'EXP-11',
    aim: 'To draft a formal engineering technical report featuring executive summaries, methodology, data visual captions, and IEEE reference citations.',
    apparatus: ['SAILL Technical Report Formatter', 'IEEE Citation Generator', 'Report Structure Checker'],
    theory: 'Formal technical reports follow IEEE structural standards: Title Page, Abstract/Executive Summary, Table of Contents, Introduction, Methodology, Results & Discussion, Conclusion, Recommendations, and References (IEEE format).',
    procedure: [
      'Select a technical feasibility topic (e.g. "Feasibility Study on Solar-Powered Campus Charging Hubs").',
      'Draft a standalone 150-word Executive Summary detailing Purpose, Findings, and Actionable Recommendations.',
      'Construct a step-by-step Methodology section detailing system architecture and testing protocols.',
      'Insert data visual captions (e.g. "Figure 1: System Load vs Battery Storage Curve") and cite 3 IEEE references.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - TECHNICAL REPORT WRITING (EXP-11):

REPORT TITLE: Feasibility Analysis of Solar-Powered IoT Charging Stations at SRIT Campus

1. EXECUTIVE SUMMARY (STANDALONE SYNTHESIS):
   This technical feasibility report evaluates installing a 10kW off-grid solar charging hub at SRIT. Based on 30-day solar irradiance telemetry and student usage patterns, the proposed setup generates 42 kWh daily against a peak campus demand of 34 kWh. Capital expenditure is estimated at ₹2.4 Lakhs with a projected break-even period of 3.2 years. We recommend immediate phase-1 deployment at the Central Library complex.

2. METHODOLOGY & DATA VISUAL CAPTIONING:
   - Methodology: Irradiance data was logged using pyranometer sensors connected to ESP32 microcontrollers over a 30-day monitoring window. Battery state-of-charge was simulated using MATLAB Simulink.
   - Figure Caption: "Figure 1: Daily Irradiance Output (kWh) vs Battery State-of-Charge (%) over 30-Day Monitoring Window."

3. IEEE REFERENCES FORMATTING:
   [1] A. Kumar and S. Rao, "Solar microgrid feasibility for academic institutions," IEEE Trans. Sustain. Energy, vol. 14, no. 2, pp. 1102–1110, Apr. 2024.
   [2] R. Sharma, "IoT telemetry for renewable energy monitoring," IEEE Internet Things J., vol. 11, no. 4, pp. 5200–5208, Feb. 2025.`,
    defaultReflection: 'Structuring the report with IEEE citation standards made my research look publication-ready. The standalone executive summary captured the entire business case in under 150 words.',
    rubricCriteria: [
      { name: 'Executive Summary Quality', maxScore: 20, description: 'Standalone summary stating Purpose, Findings, Metrics, and Recommendations.' },
      { name: 'Report Architecture & Sections', maxScore: 20, description: 'Complete IEEE section hierarchy (Intro, Methodology, Results, Conclusion).' },
      { name: 'Data Visuals & Figure Captions', maxScore: 20, description: 'Clear, informative Figure/Table titles and data interpretation.' },
      { name: 'IEEE Citation & Reference Style', maxScore: 20, description: 'Accurate IEEE inline citations ([1], [2]) and bibliography formatting.' },
      { name: 'Feasibility & Analysis Depth', maxScore: 20, description: 'Rigor of engineering trade-off analysis and recommendations.' }
    ],
    targetOutputs: ['Technical Report Document', 'Executive Summary Draft', 'IEEE References List'],
    facultySampleRemarks: 'Excellent technical report structure. Executive summary is concise and IEEE reference formatting is flawless. Approved.'
  },

  knowledgeCheck: {
    title: 'Technical Report Writing Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'rep-q1',
        type: 'mcq',
        prompt: 'What is the primary function of an Executive Summary in a technical engineering report?',
        options: [
          'Listing author acknowledgments',
          'Providing a standalone summary of purpose, key findings, costs, and recommendations for decision-makers',
          'Displaying raw software source code',
          'Providing a dictionary of terms'
        ],
        correctAnswer: 'Providing a standalone summary of purpose, key findings, costs, and recommendations for decision-makers',
        explanation: 'Executive summaries allow busy decision-makers to grasp key recommendations without reading the entire report.'
      },
      {
        id: 'rep-q2',
        type: 'mcq',
        prompt: 'In IEEE reference citation style, how are in-text references denoted within the report narrative?',
        options: [
          'Author surname and year in parentheses (Kumar, 2024)',
          'Sequential numbers inside square brackets [1], [2]',
          'Asterisks and footnotes (*)',
          'Underlined hyperlinked titles'
        ],
        correctAnswer: 'Sequential numbers inside square brackets [1], [2]',
        explanation: 'IEEE style uses bracketed numbers [1], [2] corresponding to a numbered bibliography at the end.'
      },
      {
        id: 'rep-q3',
        type: 'true_false',
        prompt: 'True or False: Every figure and table in a technical report must have an informative caption and be explicitly referenced in the text.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Unlabeled or unreferenced figures create confusion and violate technical documentation standards.'
      },
      {
        id: 'rep-q4',
        type: 'fill_blank',
        prompt: 'The standard reference citation format widely used across electrical, computer, and engineering journals is ______ style.',
        correctAnswer: 'IEEE',
        explanation: 'IEEE (Institute of Electrical and Electronics Engineers) style is the engineering standard.'
      }
    ]
  },

  resources: [
    {
      id: 'res-rep1',
      title: 'IEEE Technical Report Structure & Citation Template',
      type: 'template',
      description: 'Standardized IEEE template for technical feasibility reports and engineering documentation.',
      content: `IEEE TECHNICAL REPORT ARCHITECTURE TEMPLATE

1. TITLE PAGE:
   - Title, Authors, Affiliation (SRIT Anantapur), Date

2. ABSTRACT / EXECUTIVE SUMMARY (150-200 Words):
   - Background, Purpose, Key Findings, Actionable Recommendation

3. INTRODUCTION:
   - Problem Statement, Objectives, Scope & Limitations

4. METHODOLOGY & SYSTEM ARCHITECTURE:
   - Experimental Setup, Hardware/Software Stack, Data Collection

5. RESULTS & DISCUSSION:
   - Figure 1: [Caption], Table 1: [Caption], Technical Trade-offs

6. CONCLUSION & RECOMMENDATIONS:
   - Summary of Findings, Proposed Next Steps

7. REFERENCES (IEEE FORMAT):
   [1] A. Author and B. Author, "Title of paper," Journal Abbrev., vol. x, no. x, pp. xxx–xxx, Mon. Year.`
    }
  ],

  recordWork: {
    title: 'Technical Report Submissions',
    instructions: 'Upload technical report drafts, executive summaries, and IEEE reference lists for AI documentation review.',
    allowedFormats: ['pdf', 'docx'],
    submissionGuidelines: [
      'Must include standalone Executive Summary.',
      'Cite at least 3 references in IEEE format.'
    ]
  },

  reflectionConfig: {
    title: 'Module 11 Reflection & Report Writing Growth',
    instructions: 'Reflect on your technical report drafting, IEEE formatting, and data presentation.',
    questions: [
      'How standalone and informative is your report Executive Summary?',
      'Did you cite all external references correctly in IEEE format ([1], [2])?',
      'How clearly did your figure captions explain the data trend?',
      'What report writing standards will you apply to your final-year engineering capstone project?'
    ],
    rubricFocus: ['IEEE compliance', 'Technical documentation maturity']
  },

  portfolioConfig: {
    title: 'Technical Report Artifacts Portfolio',
    artifactCategories: ['Engineering Feasibility Report', 'Standalone Executive Summary', 'IEEE Reference Bibliography'],
    rubricCriteria: ['Report Architecture (35%)', 'IEEE Citation (35%)', 'Technical Depth (30%)']
  },

  statusConfig: {
    targetScore: 92,
    requiredTasks: [
      'Construct Formal Technical Report',
      'Draft IEEE Formatted Reference Section',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-11'
    ],
    skillsMastered: ['Technical Report Architecture', 'IEEE Citation Style', 'Executive Summaries', 'Feasibility Analysis'],
    recommendations: [
      'Always write the Executive Summary last after completing all technical sections.',
      'Verify every figure has a corresponding caption (e.g. Figure 1: ...).'
    ],
    passingThreshold: 75
  }
};
