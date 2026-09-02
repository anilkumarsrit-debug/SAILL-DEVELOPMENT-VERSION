import { ModuleConfig } from '../../types/moduleConfig';

export const module2Config: ModuleConfig = {
  moduleId: 'listening',
  code: 'R26-LAB-02',
  title: 'Listening Comprehension & Note-Taking',
  syllabusTopic: 'Active Listening Strategies, Global English Accents, Cornell Note-Taking System',
  description: 'Develop active listening techniques, comprehend diverse international accents, recognize verbal signposts, and master the Cornell note-taking framework.',

  notebookConfig: {
    experimentNumber: 'EXP-02',
    aim: 'To apply active listening techniques and synthesize technical lecture content using the Cornell Note-Taking framework.',
    apparatus: ['SAILL Audio Passage Streamer', 'Cornell Note Template Sheet', 'Signpost Tracker Matrix'],
    theory: 'Engineers spend over 60% of meeting time listening. Active listening requires filtering noise, identifying core thesis statements, tracking transitional signposts, and synthesizing key takeaways.',
    procedure: [
      'Listen to the technical audio lecture passage on Cloud Computing & Distributed Architecture.',
      'Log cues, keywords, and main questions in the left Cue column.',
      'Record detailed lecture notes, formulas, and diagrams in the main Notes section.',
      'Formulate a 3-sentence executive summary in the bottom Summary box.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - CORNELL NOTE-TAKING (EXP-02):

LECTURE TITLE: Distributed Cloud Computing & Microservices Architecture

[CUE COLUMN]
- Cloud Architecture Definition
- Monolith vs Microservices
- Scalability & Latency
- Key Signposts Used

[NOTES SECTION]
1. Cloud Architecture Overview:
   - On-demand computing resources over internet.
   - Eliminates capital expenditure for physical server racks.

2. Architecture Shift:
   - Traditional Monolithic Architecture -> Single codebase, tightly coupled, single point of failure.
   - Microservices Architecture -> Independent decoupled services communicating via API endpoints.

3. Key Trade-offs:
   - Monolith: Easier initial development, but harder horizontal scaling.
   - Microservices: High fault isolation, but introduces network latency overhead.

[SUMMARY SECTION]
Microservices architecture breaks large monolithic software into decoupled API-driven services. While it drastically enhances system resilience and horizontal scaling, developers must mitigate network latency and distributed debugging complexity.`,
    defaultReflection: 'The Cornell system helped me separate key triggers from secondary descriptions. Tracking signposts like "On the other hand" allowed me to predict incoming technical trade-offs.',
    rubricCriteria: [
      { name: 'Cue Column Organization', maxScore: 20, description: 'Clear, relevant keywords, triggers, and questions in the cue column.' },
      { name: 'Notes Density & Accuracy', maxScore: 20, description: 'Comprehensive record of core technical concepts and evidence.' },
      { name: 'Executive Summary Synthesis', maxScore: 20, description: 'Concise summary capturing the core takeaway accurately.' },
      { name: 'Signpost Identification', maxScore: 20, description: 'Accurate recognition of transitional phrases and emphasis cues.' },
      { name: 'Accent Comprehension', maxScore: 20, description: 'High comprehension accuracy across global English accents.' }
    ],
    targetOutputs: ['Completed Cornell Note Sheet', 'Lecture Outline Schema', 'Signpost Log Table'],
    facultySampleRemarks: 'Excellent structured synthesis. Cue column contains precise engineering keywords and summary captures key architectural trade-offs accurately. Approved.'
  },

  knowledgeCheck: {
    title: 'Listening Comprehension & Note-Taking Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'l-q1',
        type: 'mcq',
        prompt: 'In the Cornell Note-Taking System, what content belongs in the left column (Cue Column)?',
        options: ['Verbatim transcript lines', 'Main keywords, cues, and review questions', 'Instructor signature', 'Final 3-sentence summary'],
        correctAnswer: 'Main keywords, cues, and review questions',
        explanation: 'The Cue Column is used for keywords, cues, main questions, and memory triggers.'
      },
      {
        id: 'l-q2',
        type: 'true_false',
        prompt: 'True or False: Signpost words like "Furthermore" and "In addition" signal contrast in technical presentations.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'False. "Furthermore" signals addition of supporting points. Contrast is signaled by "However" or "On the contrary".'
      },
      {
        id: 'l-q3',
        type: 'mcq',
        prompt: 'Which signpost phrase indicates an incoming example or clarification during a lecture?',
        options: ['"To summarize..."', '"For instance..."', '"In contrast..."', '"Consequently..."'],
        correctAnswer: '"For instance..."',
        explanation: '"For instance" and "To illustrate" signal concrete examples.'
      },
      {
        id: 'l-q4',
        type: 'fill_blank',
        prompt: 'The bottom section of a Cornell Note sheet is strictly reserved for the executive ______.',
        correctAnswer: 'summary',
        explanation: 'The bottom box is reserved for a concise executive summary written in student own words.'
      }
    ]
  },

  resources: [
    {
      id: 'res-l1',
      title: 'Cornell Note-Taking System Layout & Template',
      type: 'template',
      description: 'Standardized printable template for technical lectures and corporate meeting notes.',
      content: `CORNELL NOTE-TAKING TEMPLATE FOR TECHNICAL LECTURES

+-------------------------------------------------------------------+
| DATE:                   SUBJECT:                   TOPIC:          |
+--------------------------+----------------------------------------+
| CUES & KEYWORDS          | LECTURE NOTES & DIAGRAMS               |
|                          |                                        |
| - Key Question 1         | 1. Main Concept A                      |
| - Technical Term A       |    - Sub-point 1                       |
| - Formula / Ratio        |    - Sub-point 2                       |
|                          |                                        |
|                          | 2. Main Concept B                      |
|                          |    - Key Trade-off                     |
+--------------------------+----------------------------------------+
| SUMMARY (3-4 Sentences):                                          |
|                                                                   |
+-------------------------------------------------------------------+`,
      downloadFileName: 'R26_Cornell_Notes_Template.txt'
    },
    {
      id: 'res-l2',
      title: 'Verbal Signposts Glossary for Technical Presentations',
      type: 'reference',
      description: 'Categorized list of signpost words used by international speakers in lectures and webinars.',
      content: `VERBAL SIGNPOSTS IN TECHNICAL LECTURES

1. Introducing Topics:
   - "Today, we will focus on..."
   - "Our main objective is to examine..."

2. Adding Information:
   - "Furthermore..."
   - "In addition to..."
   - "Moreover..."

3. Contrasting & Counter-arguments:
   - "On the other hand..."
   - "Conversely..."
   - "Despite these advantages..."

4. Illustrating & Giving Examples:
   - "For instance..."
   - "To demonstrate this concept..."

5. Summarizing & Concluding:
   - "In conclusion..."
   - "To wrap up..."
   - "The key takeaway is..."`
    }
  ],

  recordWork: {
    title: 'Listening Lab Audio Submissions',
    instructions: 'Upload audio summaries or verbal transcriptions based on assigned technical listening passages.',
    allowedFormats: ['audio', 'pdf'],
    sampleAudioPrompts: [
      'Summarize the core trade-off between monolithic and microservice architectures in 60 seconds.',
      'Explain the role of signpost words in identifying lecture transitions.'
    ],
    submissionGuidelines: [
      'Ensure audio summaries are crisp and concise.',
      'Highlight 3 main cues and state the final summary clearly.'
    ]
  },

  reflectionConfig: {
    title: 'Module 2 Reflection & Listening Growth',
    instructions: 'Reflect on your active listening skills and Cornell note-taking habits.',
    questions: [
      'How did using the Cornell method change how you organize lecture information?',
      'Which international English accents do you find most challenging during listening practice?',
      'How effectively did you catch verbal signposts during the technical passage?',
      'What steps will you take to improve active listening during team standups?'
    ],
    rubricFocus: ['Synthesis depth', 'Self-evaluation accuracy']
  },

  portfolioConfig: {
    title: 'Listening & Note-Taking Portfolio',
    artifactCategories: ['Cornell Lecture Notes', 'Audio Summary Recording', 'Signpost Tracker Sheet'],
    rubricCriteria: ['Completeness (40%)', 'Synthesis Quality (30%)', 'Clarity & Structure (30%)']
  },

  statusConfig: {
    targetScore: 88,
    requiredTasks: [
      'Listen to Technical Lecture Passage',
      'Complete Cornell Notes Template',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-02'
    ],
    skillsMastered: ['Active Listening', 'Cornell Note-Taking', 'Verbal Signpost Tracking', 'Accent Adaptation'],
    recommendations: [
      'Practice listening to tech podcasts at 1.25x speed and creating 3-bullet summaries.',
      'Review signpost cues before attending live engineering guest lectures.'
    ],
    passingThreshold: 75
  }
};
