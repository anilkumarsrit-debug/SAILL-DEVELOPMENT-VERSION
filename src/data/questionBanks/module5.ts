import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module5Questions: QuestionBankItem[] = [
  {
    id: 'qb-ps-001',
    moduleId: 'public-speaking',
    topic: '6x6 Presentation Rule',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the "6x6 Rule" in slide design dictate for technical presentations?',
    options: [
      'Maximum 6 lines of text per slide and approximately 6 words per line',
      'Maximum 6 slides presented in exactly 6 minutes',
      'Using 6 different font colors and 6 image animations per slide',
      'Presenting to a maximum audience size of 6 people with 6 handouts'
    ],
    correctAnswer: 'Maximum 6 lines of text per slide and approximately 6 words per line',
    explanation: 'The 6x6 rule prevents cognitive split-attention overload by capping slide text to a maximum of 6 lines with roughly 6 words per line.',
    keywords: ['6x6 Rule', 'Slide Design', 'Cognitive Load', 'Visual Hierarchy'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-ps-002',
    moduleId: 'public-speaking',
    topic: 'Presentation Opening Hooks',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which technique is considered the most effective opening hook to capture audience attention in a technical seminar?',
    options: [
      'Starting with a compelling statistic, thought-provoking problem, or short relevant anecdote',
      'Reading the complete slide title and presenter bio word-for-word',
      'Apologizing in advance for being nervous or unprepared',
      'Handing out a 10-page printed report for the audience to read silently'
    ],
    correctAnswer: 'Starting with a compelling statistic, thought-provoking problem, or short relevant anecdote',
    explanation: 'An effective hook instantly engages listeners by highlighting a striking fact, relatable problem statement, or vivid case study.',
    keywords: ['Hook', 'Opening Strategy', 'Audience Engagement'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-ps-003',
    moduleId: 'public-speaking',
    topic: '10-20-30 Rule',
    courseOutcome: 'CO3',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What are the three core guidelines of Guy Kawasaki\'s famous 10-20-30 presentation rule?',
    options: [
      '10 slides total, 20 minutes maximum duration, and 30-point minimum font size',
      '10 words per line, 20 slides, and 30 minutes of audience Q&A',
      '10 diagrams, 20 bullet points, and 30-second speaking intervals',
      '10 minutes preparation, 20 slides presented, and 30 audience questions'
    ],
    correctAnswer: '10 slides total, 20 minutes maximum duration, and 30-point minimum font size',
    explanation: 'Guy Kawasaki\'s 10-20-30 rule recommends 10 slides, 20 minutes of speaking, and a minimum font size of 30 points for optimal legibility.',
    keywords: ['10-20-30 Rule', 'Slide Legibility', 'Presentation Length'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-ps-004',
    moduleId: 'public-speaking',
    topic: 'Vocal Modulation & Variety',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why is vocal modulation (varying pitch, pace, and volume) essential during an engineering presentation?',
    options: [
      'It prevents monotonous delivery, highlights key technical concepts, and maintains audience engagement',
      'It allows the speaker to speak at maximum volume continuously without pausing',
      'It disguises grammatical errors and eliminates the need for visual slides',
      'It ensures the presentation finishes in less than half the allotted time'
    ],
    correctAnswer: 'It prevents monotonous delivery, highlights key technical concepts, and maintains audience engagement',
    explanation: 'Vocal modulation creates dynamic acoustic contrast, preventing audience fatigue and emphasizing crucial takeaways.',
    keywords: ['Vocal Modulation', 'Pitch', 'Pacing', 'Vocal Variety'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-ps-005',
    moduleId: 'public-speaking',
    topic: 'Stage Presence & Anchor Stance',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How should a speaker utilize the "Anchor Stance" and hand gestures when presenting on stage?',
    options: [
      'Stand with feet shoulder-width apart, maintain open palm gestures, and make purposeful transitions',
      'Constantly pace back and forth rapidly across the stage with hands locked inside pockets',
      'Lean continuously on the podium and keep arms tightly crossed across the chest',
      'Turn your back completely toward the audience to read directly from the projection screen'
    ],
    correctAnswer: 'Stand with feet shoulder-width apart, maintain open palm gestures, and make purposeful transitions',
    explanation: 'An anchor stance (feet shoulder-width apart, balanced weight) combined with open gestures projects authority and confidence.',
    keywords: ['Anchor Stance', 'Body Language', 'Stage Presence', 'Gestures'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-ps-006',
    moduleId: 'public-speaking',
    topic: '3-Minute Elevator Pitch Structure',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In a 3-minute technical elevator pitch, how should the speaker allocate their delivery time?',
    options: [
      '30s Hook/Problem, 60s Solution/Architecture, 60s Impact/Metrics, and 30s Call to Action',
      '2.5 minutes listing personal hobbies and 30 seconds mentioning the project title',
      '3 full minutes reading raw code syntax line-by-line without explaining the problem',
      '1 minute apologizing for technical bugs and 2 minutes answering unrelated questions'
    ],
    correctAnswer: '30s Hook/Problem, 60s Solution/Architecture, 60s Impact/Metrics, and 30s Call to Action',
    explanation: 'A balanced 3-minute pitch dedicates roughly 30s to Hook/Problem, 60s to Architecture, 60s to Quantified Impact, and 30s to the Call to Action.',
    keywords: ['Elevator Pitch', 'Time Allocation', 'Problem Solution Impact'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-ps-007',
    moduleId: 'public-speaking',
    topic: 'Handling Difficult Audience Q&A',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the recommended strategy when an audience member asks a challenging technical question you do not know the answer to?',
    options: [
      'Acknowledge the question politely, state current findings honestly, and offer to follow up with data',
      'Pretend to know the answer and invent fictional technical statistics on the spot',
      'Criticize the question as irrelevant and immediately dismiss the audience member',
      'End the presentation abruptly and leave the stage without responding'
    ],
    correctAnswer: 'Acknowledge the question politely, state current findings honestly, and offer to follow up with data',
    explanation: 'Professional credibility is strengthened by honestly stating current scope limitations and offering to follow up with validated data.',
    keywords: ['Q&A Strategy', 'Professional Demeanor', 'Honesty'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-ps-008',
    moduleId: 'public-speaking',
    topic: 'Visual Hierarchy & Cognitive Load',
    courseOutcome: 'CO3',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What visual design approach prevents cognitive overload on technical architecture slides?',
    options: [
      'Using clear visual hierarchy, whitespace, high-contrast labels, and minimal supporting bullet points',
      'Pasting dense unformatted paragraphs of text in 10-point font across the entire slide',
      'Adding flashing multi-color animations and background music to every slide transition',
      'Displaying raw database tables containing hundreds of uncurated rows'
    ],
    correctAnswer: 'Using clear visual hierarchy, whitespace, high-contrast labels, and minimal supporting bullet points',
    explanation: 'Whitespace, high contrast, and clean diagrammatic hierarchy allow audiences to absorb complex technical systems effortlessly.',
    keywords: ['Visual Hierarchy', 'Whitespace', 'Slide Clutter'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-ps-009',
    moduleId: 'public-speaking',
    topic: 'Audience Engagement & PREP Framework',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When delivering an impromptu answer during a presentation Q&A session, how does the PREP framework structure the response?',
    options: [
      'Point (Direct claim), Reason (Underlying logic), Example (Concrete technical evidence), Point (Restated conclusion)',
      'Problem, Review, Evaluation, Postpone',
      'Pause, Repeat, Explain, Politely decline',
      'Plan, Research, Execute, Publish'
    ],
    correctAnswer: 'Point (Direct claim), Reason (Underlying logic), Example (Concrete technical evidence), Point (Restated conclusion)',
    explanation: 'PREP (Point -> Reason -> Example -> Point) provides an instant 4-step mental structure for concise, logically sound answers.',
    keywords: ['PREP Framework', 'Q&A Response', 'Impromptu Speaking'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-ps-010',
    moduleId: 'public-speaking',
    topic: 'Managing Stage Fright & Delivery Mechanics',
    courseOutcome: 'CO3',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Which physiological and cognitive technique best helps engineers channel nervous adrenaline into dynamic stage presence?',
    options: [
      'Practicing deep diaphragmatic breathing, positive visualization, and focusing on audience value',
      'Speaking as fast as possible to finish the presentation in under 60 seconds',
      'Memorizing a rigid word-for-word script and avoiding all eye contact with audience members',
      'Drinking excessive caffeine immediately before stepping onto the stage'
    ],
    correctAnswer: 'Practicing deep diaphragmatic breathing, positive visualization, and focusing on audience value',
    explanation: 'Diaphragmatic breathing stabilizes heart rate, while shifting cognitive focus from self-judgment to audience value transforms anxiety into presence.',
    keywords: ['Stage Fright', 'Diaphragmatic Breathing', 'Presence', 'Confidence'],
    estimatedTimeSeconds: 35
  }
];
