import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module3Questions: QuestionBankItem[] = [
  {
    id: 'qb-spk-001',
    moduleId: 'spoken-english',
    topic: 'PREP Framework Application',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a spontaneous oral response on "Automated Code Testing", how does the PREP framework structure the 60-second delivery?',
    options: [
      'Point: State main thesis -> Reason: Explain technical rationale -> Example: Give a concrete test case -> Point: Reiterate conclusion',
      'Problem: State a bug -> Research: Read documentation -> Execute: Write a patch -> Proof: Run unit tests',
      'Prepare: Write notes -> Review: Inspect with peer -> Explain: Summarize code -> Present: Share slides',
      'Point: Complain about bugs -> Rebuttal: Reject peer feedback -> Emotion: Express urgency -> Proposal: Delay deployment'
    ],
    correctAnswer: 'Point: State main thesis -> Reason: Explain technical rationale -> Example: Give a concrete test case -> Point: Reiterate conclusion',
    explanation: 'PREP stands for Point (state core thesis directly), Reason (logical justification), Example (concrete real-world evidence), and Point (reiterate concluding takeaway).',
    keywords: ['PREP Framework', 'Oral Structure', 'Spoken English', 'Impromptu Speaking'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-spk-002',
    moduleId: 'spoken-english',
    topic: 'Speech Delivery Pacing & WPM',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'During an engineering project presentation, what is the internationally recognized benchmark speech delivery rate for crisp oral fluency and listener intelligibility?',
    options: [
      '120 to 150 Words Per Minute (WPM)',
      '60 to 80 Words Per Minute (WPM)',
      '190 to 220 Words Per Minute (WPM)',
      '260+ Words Per Minute (WPM)'
    ],
    correctAnswer: '120 to 150 Words Per Minute (WPM)',
    explanation: 'A speech delivery rate of 120 to 150 WPM provides the optimal balance between natural conversational rhythm, crisp consonant articulation, and audience comprehension.',
    keywords: ['WPM', 'Speech Pacing', 'Fluency Rate', 'Intelligibility'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-spk-003',
    moduleId: 'spoken-english',
    topic: 'Pronunciation Intelligibility & Consonant Clusters',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'To ensure international listener intelligibility when pronouncing engineering terms with complex consonant clusters like "scripts", "prompts", and "protocols", what articulation technique is essential?',
    options: [
      'Articulate each consonant cleanly without inserting epenthetic vowel sounds (e.g., avoid saying "is-scripts")',
      'Omit the initial consonant sound so words can be spoken with less breath effort',
      'Insert an extra vowel sound /ə/ between every individual letter in the word',
      'Replace all English sibilants /s/ and /z/ with regional sounds'
    ],
    correctAnswer: 'Articulate each consonant cleanly without inserting epenthetic vowel sounds (e.g., avoid saying "is-scripts")',
    explanation: 'High intelligibility requires crisp, precise articulation of consonant clusters without epenthetic vowel insertion (e.g., pronouncing /skrɪpts/ cleanly without /ɪskrɪpts/).',
    keywords: ['Pronunciation', 'Consonant Clusters', 'Intelligibility', 'Phonetic Clarity'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-spk-004',
    moduleId: 'spoken-english',
    topic: 'Filler Word Elimination & Pause Management',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When experiencing a momentary hesitation while explaining a system architecture to an interviewer, which vocal technique best demonstrates poise and composure?',
    options: [
      'Inserting deliberate 1 to 2-second silent pauses while formulating thoughts',
      'Filling silence with continuous verbal markers like "um", "uh", and "like"',
      'Repeating "you know basically" to keep the audio stream continuously active',
      'Rushing through sentences without breathing to avoid pauses'
    ],
    correctAnswer: 'Inserting deliberate 1 to 2-second silent pauses while formulating thoughts',
    explanation: 'Deliberate silent pauses project composure, intellectual control, and confidence. They allow the speaker to organize ideas cleanly without vocal clutter.',
    keywords: ['Vocal Fillers', 'Silent Pauses', 'Hesitation Control', 'Speech Delivery'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-spk-005',
    moduleId: 'spoken-english',
    topic: 'Sentence Rhythm & Thought Chunking',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How does "thought chunking" improve listener intelligibility when delivering complex technical explanations?',
    options: [
      'By grouping words into meaningful 5 to 7-word grammatical clusters separated by brief micro-pauses',
      'By speaking single detached words with 3-second gaps between each word',
      'By delivering 50 words continuously in one breath without pitch variation',
      'By placing random pauses in the middle of compound nouns'
    ],
    correctAnswer: 'By grouping words into meaningful 5 to 7-word grammatical clusters separated by brief micro-pauses',
    explanation: 'Thought chunking divides speech into logical semantic units (5–7 words), matching natural breath cycles with grammatical boundaries for effortless listener comprehension.',
    keywords: ['Thought Chunking', 'Sentence Rhythm', 'Speech Cadence', 'Oral Delivery'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-spk-006',
    moduleId: 'spoken-english',
    topic: 'Professional Spoken Dialogue & Conflict Management',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In a software design review meeting, a colleague proposes an infrastructure design that exceeds budget limits. Which spoken phrasing represents diplomatic, professional communication?',
    options: [
      '"I appreciate your architectural vision; however, let us review the cloud hosting cost impact against our project budget constraints."',
      '"Your proposal is completely unacceptable and demonstrates you did not inspect the project budget."',
      '"I refuse to discuss this database unless you completely agree with my plan."',
      '"Do whatever you want; when the project runs out of funding it is not my problem."'
    ],
    correctAnswer: '"I appreciate your architectural vision; however, let us review the cloud hosting cost impact against our project budget constraints."',
    explanation: 'Professional communication validates the colleague\'s intent respectfully, employs diplomatic transitional framing ("however, let us review..."), and focuses on objective project metrics.',
    keywords: ['Professional Dialogue', 'Role-Play', 'Conflict Management', 'Workplace Communication'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-spk-007',
    moduleId: 'spoken-english',
    topic: 'Spoken Vocabulary & Professional Precision',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which statement demonstrates high professional spoken vocabulary register when explaining an algorithmic optimization in a viva evaluation?',
    options: [
      '"We refactored the search routine with a hash table, reducing lookup time complexity from linear O(n) to constant O(1)."',
      '"We made the coding stuff run way faster by messing around with the algorithm."',
      '"The code is super nice and totally quick because we fixed up some backend things."',
      '"We basically deleted some lines and it started working really good."'
    ],
    correctAnswer: '"We refactored the search routine with a hash table, reducing lookup time complexity from linear O(n) to constant O(1)."',
    explanation: 'Professional spoken register utilizes precise domain terminology ("refactored", "time complexity", "constant O(1)") and quantifiable outcomes rather than ambiguous conversational fillers.',
    keywords: ['Spoken Vocabulary', 'Professional Register', 'Technical Articulation', 'Precision'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-spk-008',
    moduleId: 'spoken-english',
    topic: 'Intonation & Inquiring Clarifications',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When asking a technical lead for clarification on ambiguous API constraints during a client meeting, which intonation pattern and phrasing is most effective?',
    options: [
      'A polite rising intonation with: "Could you please clarify whether our API gateway should enforce OAuth 2.0 or JWT tokens?"',
      'A sharp falling monotone with: "Your specification document is unclear."',
      'An aggressive loud pitch with: "Why didn\'t anyone specify the security protocol?"',
      'A sub-audible whisper with: "I will just guess whatever security method seems easiest."'
    ],
    correctAnswer: 'A polite rising intonation with: "Could you please clarify whether our API gateway should enforce OAuth 2.0 or JWT tokens?"',
    explanation: 'Professional inquiry combines respectful modal syntax ("Could you please clarify...") with a gentle rising intonation contour, signaling constructive engagement and collaborative clarity.',
    keywords: ['Intonation', 'Workplace Communication', 'Clarification Strategies', 'Voice Modulation'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-spk-009',
    moduleId: 'spoken-english',
    topic: 'Visual Description & Data Presentation',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When verbally presenting an engineering benchmark graph during a technical demonstration, what is the standard 3-step sequence of visual description?',
    options: [
      '1. Overview of chart type and axes -> 2. Key trends and significant metric anomalies -> 3. Analytical interpretation and technical takeaway',
      '1. Raw coordinates of all data points -> 2. Personal opinion on graph colors -> 3. Overview of chart title',
      '1. Apologizing for graph complexity -> 2. Reading axis labels backwards -> 3. Abruptly concluding the talk',
      '1. Stating final conclusion -> 2. Ignoring all data trends -> 3. Explaining software tool installation steps'
    ],
    correctAnswer: '1. Overview of chart type and axes -> 2. Key trends and significant metric anomalies -> 3. Analytical interpretation and technical takeaway',
    explanation: 'Structured visual description follows a macro-to-micro progression: define visual context and axes, highlight dominant trends or anomalies, and synthesize technical conclusions.',
    keywords: ['Visual Description', 'Chart Analysis', 'Technical Presentation', 'Spoken English'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-spk-010',
    moduleId: 'spoken-english',
    topic: 'Just-A-Minute (JAM) Timing & Speech Economy',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'In a competitive 60-second Just-A-Minute (JAM) challenge, how should a speaker strategically distribute speaking time for maximum evaluative impact?',
    options: [
      '10s for opening Hook/Point -> 40s for Reason and concrete Examples -> 10s for strong concluding synthesis',
      '50s on introductory greetings -> 10s rushing through a single example without conclusion',
      '0s on introduction -> 60s speaking continuously until cut off mid-sentence by the buzzer',
      '30s of total silence while mentally outlining -> 30s of rushed high-speed speech'
    ],
    correctAnswer: '10s for opening Hook/Point -> 40s for Reason and concrete Examples -> 10s for strong concluding synthesis',
    explanation: 'The optimal 10-40-10 second structure ensures immediate listener engagement, comprehensive evidence-backed reasoning, and a polished memorable closing within the strict 60s limit.',
    keywords: ['JAM Timing', 'Speech Economy', 'Time Allocation', 'Oral Competition'],
    estimatedTimeSeconds: 35
  }
];
