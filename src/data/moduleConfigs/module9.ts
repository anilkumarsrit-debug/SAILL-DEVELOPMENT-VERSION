import { ModuleConfig } from '../../types/moduleConfig';

export const module9Config: ModuleConfig = {
  moduleId: 'reading-comprehension',
  code: 'R26-LAB-09',
  title: 'Reading Comprehension & Speed Reading',
  syllabusTopic: 'Skimming, Scanning, Critical Reading, Technical Vocabulary In-Context & Speed Reading Drills (WPM)',
  description: 'Master skimming for core thesis, scanning for technical data, critical reading evaluation, inference extraction, and speed reading drills (250+ WPM).',

  notebookConfig: {
    experimentNumber: 'EXP-09',
    aim: 'To apply skimming and scanning strategies on complex engineering literature, achieving a reading speed of 250+ WPM with 80%+ comprehension.',
    apparatus: ['SAILL Speed Reader RSVP Engine', 'Comprehension Metric Timer', 'Scanning Keyword Tracker'],
    theory: 'Efficient technical reading balances speed (Skimming for structure, Scanning for specific parameters) with deep critical comprehension (inference, author intent, and technical validity).',
    procedure: [
      'Perform a 30-second skim of the research paper abstract and subheadings to capture macro thesis.',
      'Scan passage to extract target numerical parameters (e.g. clock frequency, efficiency, cost).',
      'Execute a timed speed reading drill on a 500-word technical passage (track WPM).',
      'Answer critical comprehension questions testing inferential logic and vocabulary in-context.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - SPEED READING & COMPREHENSION (EXP-09):

TECHNICAL PASSAGE: "Quantum Dot Solar Cells: Efficiency Limits & Silicon Heterojunction Integration"

1. SKIMMING & SCANNING LOG:
   - Skim Summary (30s): The paper discusses integrating quantum dot layers with traditional silicon solar cells to capture ultraviolet wavelengths and surpass the Shockley-Queisser efficiency limit.
   - Target Scan Parameters:
     * Standard Silicon Efficiency Limit: 29.4%
     * Quantum Dot Enhanced Efficiency Achieved: 33.8%
     * Material Processing Temperature: 180°C

2. SPEED READING METRICS:
   - Total Word Count: 520 words
   - Reading Duration: 1 minute 48 seconds (108 seconds)
   - Calculated Reading Speed: 288 WPM
   - Comprehension Score: 90% (9/10 questions correct)

3. INFERENCE ANALYSIS:
   - Author Intent: Advocating for hybrid manufacturing adoption in commercial solar fabs due to low processing thermal budgets (180°C).`,
    defaultReflection: 'Skimming subheadings first gave me a mental map of the paper so I did not re-read sentences. My reading speed reached 288 WPM without dropping comprehension.',
    rubricCriteria: [
      { name: 'Reading Speed (WPM)', maxScore: 20, description: 'Achieves target WPM benchmark (250+ WPM for technical prose).' },
      { name: 'Comprehension Accuracy', maxScore: 20, description: 'Scores 80%+ on factual and inferential comprehension questions.' },
      { name: 'Scanning Efficiency', maxScore: 20, description: 'Rapidly locates specific numerical figures and technical parameters.' },
      { name: 'Vocabulary In-Context', maxScore: 20, description: 'Correctly infers technical word meanings from surrounding context.' },
      { name: 'Critical Inference Depth', maxScore: 20, description: 'Evaluates author bias, assumptions, and logical validity accurately.' }
    ],
    targetOutputs: ['Speed Reading WPM Log', 'Comprehension Scorecard', 'Skimming & Scanning Summary'],
    facultySampleRemarks: 'Impressive reading speed of 288 WPM combined with 90% comprehension accuracy. Scanning efficiency verified. Approved.'
  },

  knowledgeCheck: {
    title: 'Reading Comprehension & Speed Reading Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'rc-q1',
        type: 'mcq',
        prompt: 'What is the fundamental difference between "Skimming" and "Scanning" when reviewing technical research literature?',
        options: [
          'Skimming quickly reads headings and summaries to grasp the overall thesis; scanning searches rapidly for specific data points, formulas, or keywords',
          'Skimming is reading out loud; scanning is reading silently in a dark room',
          'Skimming is reading only the conclusion; scanning is reading every single word backwards',
          'Both terms mean reading at exactly 100 words per minute'
        ],
        correctAnswer: 'Skimming quickly reads headings and summaries to grasp the overall thesis; scanning searches rapidly for specific data points, formulas, or keywords',
        explanation: 'Skimming constructs a macro-level cognitive map of the document, while scanning pinpoints discrete facts, numbers, or terms.'
      },
      {
        id: 'rc-q2',
        type: 'mcq',
        prompt: 'What sequence of active reading steps is prescribed by the SQ3R methodology for technical textbooks?',
        options: [
          'Survey, Question, Read, Recite, Review',
          'Scan, Query, Rephrase, Rewrite, Repeat',
          'Search, Quantify, Record, Restate, Remember',
          'Speed, Quickness, Reasoning, Reflection, Recall'
        ],
        correctAnswer: 'Survey, Question, Read, Recite, Review',
        explanation: 'SQ3R (Survey, Question, Read, Recite, Review) transforms passive reading into active cognitive inquiry and long-term retention.'
      },
      {
        id: 'rc-q3',
        type: 'mcq',
        prompt: 'What is the benchmark reading speed range (in Words Per Minute - WPM) for efficient engineering literature processing with high comprehension?',
        options: [
          '250 - 350 WPM',
          '50 - 75 WPM',
          '1,500 - 2,000 WPM',
          '10 - 20 WPM'
        ],
        correctAnswer: '250 - 350 WPM',
        explanation: '250-350 WPM is the optimal speed range for engineers, allowing fast coverage of dense literature without sacrificing conceptual comprehension.'
      },
      {
        id: 'rc-q4',
        type: 'mcq',
        prompt: 'How does minimizing "subvocalization" (internal silent vocal cord pronunciation) improve an engineer\'s reading efficiency?',
        options: [
          'It allows visual chunking of multi-word phrases directly into cognitive concepts, surpassing the ~150-200 WPM speech motor limit',
          'It makes the reader speak louder during silent exams',
          'It eliminates the need to understand grammar or sentence structure',
          'It automatically translates foreign technical terms into English'
        ],
        correctAnswer: 'It allows visual chunking of multi-word phrases directly into cognitive concepts, surpassing the ~150-200 WPM speech motor limit',
        explanation: 'Subvocalizing caps reading speed at speaking speed (~150 WPM). Training visual fixation chunks expands processing bandwidth.'
      },
      {
        id: 'rc-q5',
        type: 'mcq',
        prompt: 'In the sentence: "The microprocessor architecture utilizes speculative execution to mitigate memory bus latency bottlenecks," what does the word "mitigate" mean in this engineering context?',
        options: [
          'To reduce the severity, impact, or delay caused by the bottleneck',
          'To completely delete the memory bus physically',
          'To double the electrical resistance of the circuit',
          'To permanently halt all processor operations'
        ],
        correctAnswer: 'To reduce the severity, impact, or delay caused by the bottleneck',
        explanation: 'In engineering and systems design, "mitigate" means to alleviate, lessen, or reduce the negative consequences of a bottleneck.'
      },
      {
        id: 'rc-q6',
        type: 'mcq',
        prompt: 'In critical reading, what distinguishes an "inferential question" from a "literal comprehension question"?',
        options: [
          'Literal questions ask for directly stated facts; inferential questions require deducing logical implications and unstated conclusions from the text',
          'Literal questions test mathematics; inferential questions test spelling',
          'Inferential questions only apply to fictional poetry',
          'Literal questions have multiple answers; inferential questions never have an answer'
        ],
        correctAnswer: 'Literal questions ask for directly stated facts; inferential questions require deducing logical implications and unstated conclusions from the text',
        explanation: 'Literal questions retrieve explicit data points; inferential reasoning synthesizes contextual clues to determine author intent, cause-and-effect, or logical corollaries.'
      },
      {
        id: 'rc-q7',
        type: 'mcq',
        prompt: 'When reading an engineering whitepaper published by a proprietary hardware vendor, why must a critical reader identify the author\'s commercial assumptions?',
        options: [
          'To assess whether benchmark test conditions were selectively chosen to favor the vendor\'s proprietary architecture over open standards',
          'To find grammatical typos and report them to the publisher',
          'To check what font styling was used in the PDF',
          'Because vendor whitepapers are never allowed to be read by engineers'
        ],
        correctAnswer: 'To assess whether benchmark test conditions were selectively chosen to favor the vendor\'s proprietary architecture over open standards',
        explanation: 'Critical engineering evaluation requires scrutinizing experimental benchmarks for unstated commercial biases, boundary parameters, and reproducibility.'
      },
      {
        id: 'rc-q8',
        type: 'mcq',
        prompt: 'When conducting a literature review under strict time constraints, what is the most efficient sequence for reading an IEEE research paper?',
        options: [
          'Abstract -> Introduction -> Conclusions/Results -> Figures/Tables -> Detailed Methodology (if relevant)',
          'Acknowledgments -> References -> Page 1 to Page 10 word-for-word in reverse',
          'Appendix formulas only, skipping the entire text',
          'Reading only the authors\' university affiliations'
        ],
        correctAnswer: 'Abstract -> Introduction -> Conclusions/Results -> Figures/Tables -> Detailed Methodology (if relevant)',
        explanation: 'Triaging via Abstract, Intro, and Conclusions rapidly establishes paper relevance before investing time in deep methodology analysis.'
      },
      {
        id: 'rc-q9',
        type: 'mcq',
        prompt: 'Passage Context: "Traditional von Neumann architectures suffer from the \'memory wall\' bottleneck due to data shuttle overhead between CPU and RAM. Resistive RAM (ReRAM) crossbar arrays enable in-memory computing by executing vector-matrix multiplications directly inside the analog memory matrix." Based on the passage, why do ReRAM crossbar arrays accelerate AI computations?',
        options: [
          'They eliminate energy-intensive data shuttle latency by performing analog matrix multiplications directly within memory cells',
          'They replace all CPU processors with mechanical optical switches',
          'They convert all digital software code into printed physical wiring',
          'They increase memory bus data travel distance between CPU and RAM'
        ],
        correctAnswer: 'They eliminate energy-intensive data shuttle latency by performing analog matrix multiplications directly within memory cells',
        explanation: 'In-memory computing solves the von Neumann bottleneck by processing matrix operations physics-level inside memory cells, avoiding data shuttle bus latency.'
      },
      {
        id: 'rc-q10',
        type: 'mcq',
        prompt: 'If a student reads a 750-word technical passage in 2 minutes and 30 seconds (150 seconds), what is their calculated Words Per Minute (WPM) reading speed?',
        options: [
          '300 WPM',
          '150 WPM',
          '450 WPM',
          '200 WPM'
        ],
        correctAnswer: '300 WPM',
        explanation: 'Reading Speed = (Words / Seconds) * 60 = (750 / 150) * 60 = 5 * 60 = 300 WPM.'
      }
    ]
  },

  resources: [
    {
      id: 'res-rc1',
      title: 'Speed Reading & Active Comprehension Strategies',
      type: 'reference',
      description: 'Techniques to eliminate regression and subvocalization while reading dense technical research.',
      content: `SPEED READING & COMPREHENSION TECHNIQUES

1. Eliminate Regression (Re-reading):
   - Use a finger or visual pointer along lines to keep eye movement progressing forward.

2. Expand Peripheral Vision Chunking:
   - Fixate on word blocks (3-4 words at a glance) rather than individual letters.

3. The SQ3R Method for Technical Papers:
   - Survey: Skim abstract, headings, charts.
   - Question: Turn headings into questions.
   - Read: Read actively to answer questions.
   - Recite: Summarize key points in own words.
   - Review: Test recall.`
    }
  ],

  recordWork: {
    title: 'Reading Comprehension Submissions',
    instructions: 'Complete speed reading drills and submit comprehension logs for technical research papers.',
    allowedFormats: ['pdf', 'docx'],
    submissionGuidelines: [
      'Include WPM calculation and comprehension test score.',
      'Provide 3-bullet executive summary of scanned research paper.'
    ]
  },

  reflectionConfig: {
    title: 'Module 9 Reflection & Reading Growth',
    instructions: 'Reflect on your reading speed improvements and comprehension retention.',
    questions: [
      'What was your initial baseline reading speed versus your final speed drill result?',
      'How effectively did you minimize subvocalization during the RSVP reading drill?',
      'Which technique (skimming or scanning) saved you the most time on technical papers?',
      'How will you apply speed reading when reviewing research literature and code documentation?'
    ],
    rubricFocus: ['Speed-comprehension balance', 'Habit growth']
  },

  portfolioConfig: {
    title: 'Reading Comprehension Portfolio',
    artifactCategories: ['Timed Reading Speed Log', 'Research Paper Executive Summary', 'Comprehension Test Sheet'],
    rubricCriteria: ['Comprehension (40%)', 'Speed & Efficiency (30%)', 'Analysis Depth (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Complete Speed Reading RSVP Drill (250+ WPM)',
      'Score 80%+ on Passage Comprehension Quiz',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-09'
    ],
    skillsMastered: ['Skimming & Scanning', 'Speed Reading (250+ WPM)', 'Critical Inference', 'Vocabulary In-Context'],
    recommendations: [
      'Practice peripheral vision chunking on technical blog posts daily.',
      'Use skimming to preview technical chapters before deep study sessions.'
    ],
    passingThreshold: 75
  }
};
