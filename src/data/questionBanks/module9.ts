import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module9Questions: QuestionBankItem[] = [
  {
    id: 'qb-rc-001',
    moduleId: 'reading-comprehension',
    topic: 'Skimming vs Scanning Definitions',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the fundamental difference between "Skimming" and "Scanning" when reviewing technical research literature?',
    options: [
      'Skimming quickly reads headings and summaries to grasp the overall thesis; scanning searches rapidly for specific data points, formulas, or keywords',
      'Skimming is reading out loud; scanning is reading silently in a dark room',
      'Skimming is reading only the conclusion; scanning is reading every single word backwards',
      'Both terms mean reading at exactly 100 words per minute'
    ],
    correctAnswer: 'Skimming quickly reads headings and summaries to grasp the overall thesis; scanning searches rapidly for specific data points, formulas, or keywords',
    explanation: 'Skimming constructs a macro-level cognitive map of the document, while scanning pinpoints discrete facts, numbers, or terms.',
    keywords: ['Skimming', 'Scanning', 'Active Reading'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-rc-002',
    moduleId: 'reading-comprehension',
    topic: 'SQ3R Reading Framework',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What sequence of active reading steps is prescribed by the SQ3R methodology for technical textbooks?',
    options: [
      'Survey, Question, Read, Recite, Review',
      'Scan, Query, Rephrase, Rewrite, Repeat',
      'Search, Quantify, Record, Restate, Remember',
      'Speed, Quickness, Reasoning, Reflection, Recall'
    ],
    correctAnswer: 'Survey, Question, Read, Recite, Review',
    explanation: 'SQ3R (Survey, Question, Read, Recite, Review) transforms passive reading into active cognitive inquiry and long-term retention.',
    keywords: ['SQ3R', 'Active Study', 'Reading Framework'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-rc-003',
    moduleId: 'reading-comprehension',
    topic: 'Target Reading Speeds for Technical Prose',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the benchmark reading speed range (in Words Per Minute - WPM) for efficient engineering literature processing with high comprehension?',
    options: [
      '250 - 350 WPM',
      '50 - 75 WPM',
      '1,500 - 2,000 WPM',
      '10 - 20 WPM'
    ],
    correctAnswer: '250 - 350 WPM',
    explanation: '250-350 WPM is the optimal speed range for engineers, allowing fast coverage of dense literature without sacrificing conceptual comprehension.',
    keywords: ['WPM', 'Speed Reading', 'Reading Benchmark'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-rc-004',
    moduleId: 'reading-comprehension',
    topic: 'Eliminating Subvocalization',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How does minimizing "subvocalization" (internal silent vocal cord pronunciation) improve an engineer\'s reading efficiency?',
    options: [
      'It allows visual chunking of multi-word phrases directly into cognitive concepts, surpassing the ~150-200 WPM speech motor limit',
      'It makes the reader speak louder during silent exams',
      'It eliminates the need to understand grammar or sentence structure',
      'It automatically translates foreign technical terms into English'
    ],
    correctAnswer: 'It allows visual chunking of multi-word phrases directly into cognitive concepts, surpassing the ~150-200 WPM speech motor limit',
    explanation: 'Subvocalizing caps reading speed at speaking speed (~150 WPM). Training visual fixation chunks expands processing bandwidth.',
    keywords: ['Subvocalization', 'Visual Chunking', 'Reading Efficiency'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-rc-005',
    moduleId: 'reading-comprehension',
    topic: 'Technical Vocabulary Acquisition In-Context',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In the sentence: "The microprocessor architecture utilizes speculative execution to mitigate memory bus latency bottlenecks," what does the word "mitigate" mean in this engineering context?',
    options: [
      'To reduce the severity, impact, or delay caused by the bottleneck',
      'To completely delete the memory bus physically',
      'To double the electrical resistance of the circuit',
      'To permanently halt all processor operations'
    ],
    correctAnswer: 'To reduce the severity, impact, or delay caused by the bottleneck',
    explanation: 'In engineering and systems design, "mitigate" means to alleviate, lessen, or reduce the negative consequences of a bottleneck.',
    keywords: ['Context Clues', 'Technical Vocabulary', 'Precision'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-rc-006',
    moduleId: 'reading-comprehension',
    topic: 'Critical Inference vs Literal Detail',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In critical reading, what distinguishes an "inferential question" from a "literal comprehension question"?',
    options: [
      'Literal questions ask for directly stated facts; inferential questions require deducing logical implications and unstated conclusions from the text',
      'Literal questions test mathematics; inferential questions test spelling',
      'Inferential questions only apply to fictional poetry',
      'Literal questions have multiple answers; inferential questions never have an answer'
    ],
    correctAnswer: 'Literal questions ask for directly stated facts; inferential questions require deducing logical implications and unstated conclusions from the text',
    explanation: 'Literal questions retrieve explicit data points; inferential reasoning synthesizes contextual clues to determine author intent, cause-and-effect, or logical corollaries.',
    keywords: ['Inference', 'Literal vs Inferential', 'Critical Thinking'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rc-007',
    moduleId: 'reading-comprehension',
    topic: 'Evaluating Author Bias & Assumptions',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When reading an engineering whitepaper published by a proprietary hardware vendor, why must a critical reader identify the author\'s commercial assumptions?',
    options: [
      'To assess whether benchmark test conditions were selectively chosen to favor the vendor\'s proprietary architecture over open standards',
      'To find grammatical typos and report them to the publisher',
      'To check what font styling was used in the PDF',
      'Because vendor whitepapers are never allowed to be read by engineers'
    ],
    correctAnswer: 'To assess whether benchmark test conditions were selectively chosen to favor the vendor\'s proprietary architecture over open standards',
    explanation: 'Critical engineering evaluation requires scrutinizing experimental benchmarks for unstated commercial biases, boundary parameters, and reproducibility.',
    keywords: ['Author Bias', 'Critical Evaluation', 'Engineering Rigor'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rc-008',
    moduleId: 'reading-comprehension',
    topic: 'Navigating Scientific Paper Architecture',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When conducting a literature review under strict time constraints, what is the most efficient sequence for reading an IEEE research paper?',
    options: [
      'Abstract -> Introduction -> Conclusions/Results -> Figures/Tables -> Detailed Methodology (if relevant)',
      'Acknowledgments -> References -> Page 1 to Page 10 word-for-word in reverse',
      'Appendix formulas only, skipping the entire text',
      'Reading only the authors\' university affiliations'
    ],
    correctAnswer: 'Abstract -> Introduction -> Conclusions/Results -> Figures/Tables -> Detailed Methodology (if relevant)',
    explanation: 'Triaging via Abstract, Intro, and Conclusions rapidly establishes paper relevance before investing time in deep methodology analysis.',
    keywords: ['Paper Navigation', 'Literature Review', 'Efficiency'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rc-009',
    moduleId: 'reading-comprehension',
    topic: 'Technical Reading Case: In-Memory Computing',
    courseOutcome: 'CO2',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Passage Context: "Traditional von Neumann architectures suffer from the \'memory wall\' bottleneck due to data shuttle overhead between CPU and RAM. Resistive RAM (ReRAM) crossbar arrays enable in-memory computing by executing vector-matrix multiplications directly inside the analog memory matrix." Based on the passage, why do ReRAM crossbar arrays accelerate AI computations?',
    options: [
      'They eliminate energy-intensive data shuttle latency by performing analog matrix multiplications directly within memory cells',
      'They replace all CPU processors with mechanical optical switches',
      'They convert all digital software code into printed physical wiring',
      'They increase memory bus data travel distance between CPU and RAM'
    ],
    correctAnswer: 'They eliminate energy-intensive data shuttle latency by performing analog matrix multiplications directly within memory cells',
    explanation: 'In-memory computing solves the von Neumann bottleneck by processing matrix operations physics-level inside memory cells, avoiding data shuttle bus latency.',
    keywords: ['Passage Analysis', 'In-Memory Computing', 'Technical Reading'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-rc-010',
    moduleId: 'reading-comprehension',
    topic: 'Reading Efficiency Formula & Metrics',
    courseOutcome: 'CO2',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'If a student reads a 750-word technical passage in 2 minutes and 30 seconds (150 seconds), what is their calculated Words Per Minute (WPM) reading speed?',
    options: [
      '300 WPM',
      '150 WPM',
      '450 WPM',
      '200 WPM'
    ],
    correctAnswer: '300 WPM',
    explanation: 'Reading Speed = (Words / Seconds) * 60 = (750 / 150) * 60 = 5 * 60 = 300 WPM.',
    keywords: ['WPM Formula', 'Calculation', 'Reading Metrics'],
    estimatedTimeSeconds: 25
  }
];
