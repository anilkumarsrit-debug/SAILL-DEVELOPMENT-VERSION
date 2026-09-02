import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module2Questions: QuestionBankItem[] = [
  {
    id: 'qb-list-001',
    moduleId: 'listening',
    topic: 'Cornell Note-Taking Architecture',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In the standard Cornell Note-Taking System layout, what content is recorded in the left-hand column (approx. 2.5 inches wide)?',
    options: [
      'Cues, main keywords, test questions, and study prompts',
      'Word-for-word verbatim transcriptions of the speaker',
      'Personal sketches, doodles, and unrelated reminder notes',
      'Bibliography and APA references formatted in full'
    ],
    correctAnswer: 'Cues, main keywords, test questions, and study prompts',
    explanation: 'The Cornell layout divides the page into a 30% left Cue Column for keywords/questions, a 70% right Note Area for main lecture notes, and a bottom Summary section.',
    keywords: ['Cornell Notes', 'Cue Column', 'Note Architecture'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-list-002',
    moduleId: 'listening',
    topic: 'The 5R Cornell Note-Taking Methodology',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the correct sequential order of the 5R stages in the Cornell Note-Taking methodology?',
    options: [
      'Record -> Reduce -> Recite -> Reflect -> Review',
      'Read -> Rewrite -> Retain -> Repeat -> Report',
      'Research -> Rephrase -> Record -> Replay -> Recall',
      'Recall -> Reorganize -> Revise -> Rehearse -> Rank'
    ],
    correctAnswer: 'Record -> Reduce -> Recite -> Reflect -> Review',
    explanation: 'The 5R process systematically progresses from in-class capturing (Record) to keyword extraction (Reduce), oral recall (Recite), synthesis (Reflect), and spaced repetition (Review).',
    keywords: ['Cornell 5R', 'Active Study', 'Note Stages'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-list-003',
    moduleId: 'listening',
    topic: 'Technical Shorthand & Note Abbreviations',
    courseOutcome: 'CO2',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which standard shorthand abbreviation is universally used in engineering note-taking to represent "with respect to"?',
    options: [
      'w.r.t.',
      'i.e.',
      'e.g.',
      'w/o'
    ],
    correctAnswer: 'w.r.t.',
    explanation: '"w.r.t." is standard technical shorthand for "with respect to", whereas "w/o" means without, "i.e." means that is, and "e.g." means for example.',
    keywords: ['Shorthand', 'Abbreviations', 'Fast Note-Taking'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-list-004',
    moduleId: 'listening',
    topic: 'Verbal Signposting in Technical Lectures',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When a lecturer uses the verbal signpost "On the contrary..." or "Notwithstanding...", what logical relationship is being signaled to the listener?',
    options: [
      'A contrast, counter-argument, or exception to the previous technical point',
      'An alphabetical list of upcoming laboratory equipment',
      'The immediate conclusion of the entire lecture session',
      'A request for the audience to stop taking notes'
    ],
    correctAnswer: 'A contrast, counter-argument, or exception to the previous technical point',
    explanation: 'Signpost markers like "on the contrary" and "notwithstanding" signal contrastive logical pivots, alerting note-takers to record differing viewpoints or limitations.',
    keywords: ['Signposting', 'Discourse Markers', 'Active Listening'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-list-005',
    moduleId: 'listening',
    topic: 'Internal Psychological vs External Environmental Barriers',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which of the following represents an INTERNAL psychological barrier to effective active listening during a technical symposium?',
    options: [
      'Prejudgment or cognitive confirmation bias toward the speaker\'s thesis',
      'A faulty public address loudspeaker producing acoustic distortion',
      'Air conditioning machinery noise in the seminar hall',
      'A flickering projector screen distracting visual attention'
    ],
    correctAnswer: 'Prejudgment or cognitive confirmation bias toward the speaker\'s thesis',
    explanation: 'Internal barriers are cognitive or emotional states (prejudgment, fatigue, anxiety), whereas loudspeaker distortion and room noise are external environmental barriers.',
    keywords: ['Listening Barriers', 'Psychological', 'Cognitive Bias'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-list-006',
    moduleId: 'listening',
    topic: 'Critical vs Informational Listening Modes',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How does "Critical (Evaluative) Listening" differ from "Comprehensive (Informational) Listening" in engineering meetings?',
    options: [
      'Critical listening actively analyzes the speaker\'s logic, evidence validity, and underlying assumptions, whereas informational listening focuses on comprehending and retaining facts',
      'Critical listening is listening while complaining aloud; informational listening is reading silently',
      'Critical listening is only used when listening to music; informational listening is used in sports',
      'Critical listening forbids writing down any notes during the presentation'
    ],
    correctAnswer: 'Critical listening actively analyzes the speaker\'s logic, evidence validity, and underlying assumptions, whereas informational listening focuses on comprehending and retaining facts',
    explanation: 'Informational listening seeks accurate data reception; critical listening evaluates the veracity, logical consistency, and empirical backing of the speaker\'s claims.',
    keywords: ['Critical Listening', 'Listening Types', 'Evaluation'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-list-007',
    moduleId: 'listening',
    topic: 'Technical Listening Comprehension: Quantum Computing Context',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Audio Transcript Context: "While classical binary microprocessors operate deterministically on discrete bits (0 or 1), quantum processing units harness quantum superposition and entanglement. However, maintaining quantum coherence requires cryogenic isolation near absolute zero (15 millikelvin)." Based on the lecture, why is cryogenic cooling essential for quantum processors?',
    options: [
      'To prevent thermal noise from destroying quantum coherence and causing qubit state collapse',
      'To make the copper interconnect wires expand in physical size',
      'To generate steam electricity for powering the quantum laboratory',
      'To freeze the silicon wafers so software code can be printed mechanically'
    ],
    correctAnswer: 'To prevent thermal noise from destroying quantum coherence and causing qubit state collapse',
    explanation: 'Cryogenic temperatures near absolute zero eliminate ambient thermal vibration, preserving delicate superposition and entanglement coherence in qubits.',
    keywords: ['Comprehension', 'Audio Context', 'Quantum Computing'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-list-008',
    moduleId: 'listening',
    topic: 'Paraphrasing vs Verbatim Transcription',
    courseOutcome: 'CO2',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why do research studies in cognitive science recommend that engineering students PARAPHRASE concepts rather than transcribing verbatim speech during lectures?',
    options: [
      'Paraphrasing forces active cognitive processing, conceptual synthesis, and deeper memory encoding',
      'Verbatim transcription is illegal under academic copyright policies',
      'Paraphrasing allows students to omit all technical terms completely',
      'Keyboard typing speed is always slower than human speech'
    ],
    correctAnswer: 'Paraphrasing forces active cognitive processing, conceptual synthesis, and deeper memory encoding',
    explanation: 'Verbatim transcription involves shallow motor recording. Synthesizing concepts into concise personal phrases requires active mental processing and enhances long-term retention.',
    keywords: ['Paraphrasing', 'Cognitive Processing', 'Note Efficiency'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-list-009',
    moduleId: 'listening',
    topic: 'Detecting Logical Inferences in Oral Design Reviews',
    courseOutcome: 'CO2',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Speaker Statement: "While relational databases provide ACID guarantees, our IoT telemetry stream ingests 450,000 JSON payloads per second. Therefore, maintaining relational schema normalization would degrade throughput severely." What is the speaker\'s implicit engineering recommendation?',
    options: [
      'Adopt a scalable NoSQL or distributed time-series data store optimized for high-throughput ingestion',
      'Halt all IoT data collection and disconnect the sensors from the network',
      'Enforce strict relational third-normal-form (3NF) tables on all incoming JSON payloads',
      'Convert all IoT JSON packets into analog audio signals'
    ],
    correctAnswer: 'Adopt a scalable NoSQL or distributed time-series data store optimized for high-throughput ingestion',
    explanation: 'The speaker contrasts relational constraints against 450k/sec write volume, implying the necessity of adopting high-throughput NoSQL or time-series database architectures.',
    keywords: ['Inferential Listening', 'System Design', 'Technical Inference'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-list-010',
    moduleId: 'listening',
    topic: 'Laboratory Audio Protocol & Measurement Safety',
    courseOutcome: 'CO2',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Lab Safety Audio Directive: "Prior to measuring signals exceeding 50 Volts peak-to-peak on the digital oscilloscope, ensure the grounding clip is bonded to earth ground, and verify that the 10X probe attenuation switch is engaged. Using 1X attenuation above 50V will permanently destroy the oscilloscope front-end preamp." What critical precaution is required when testing high-voltage circuits?',
    options: [
      'Always engage 10X probe attenuation and bond the ground clip to earth ground before probing signals > 50V',
      'Switch probe attenuation to 1X and disconnect the ground wire from the instrument',
      'Set oscilloscope horizontal timebase to maximum and turn off input channel coupling',
      'Increase the voltage input to 500V to calibrate probe sensitivity automatically'
    ],
    correctAnswer: 'Always engage 10X probe attenuation and bond the ground clip to earth ground before probing signals > 50V',
    explanation: 'The protocol explicitly requires engaging 10X probe attenuation (dividing input voltage by 10) and grounding to protect sensitive oscilloscope preamps from overvoltage damage.',
    keywords: ['Safety Protocol', 'High Voltage', 'Audio Comprehension'],
    estimatedTimeSeconds: 35
  }
];
