import { ModuleConfig } from '../../types/moduleConfig';

export const module5Config: ModuleConfig = {
  moduleId: 'public-speaking',
  code: 'R26-LAB-05',
  title: 'Public Speaking & Technical Presentations',
  syllabusTopic: 'Presentation Architecture, Hook Strategies, Slide Design, Vocal Variety, Non-Verbal Gestures & Q&A Handling',
  description: 'Master audience engagement, presentation structuring, hook openings, slide visual balance, posture, vocal modulation, and handling tough Q&A sessions.',

  notebookConfig: {
    experimentNumber: 'EXP-05',
    aim: 'To design and deliver a 3-minute structured technical presentation with audience hooks, clear visual narrative, and confident Q&A responses.',
    apparatus: ['SAILL Presentation Timer', 'Vocal Pitch & Volume Spectrogram', 'Slide Balance Evaluator'],
    theory: 'Technical public speaking requires an engaging hook (story, stat, or question), clear problem-solution narrative, minimal text per slide (6x6 rule), and assertive non-verbal delivery.',
    procedure: [
      'Select a technical seminar topic (e.g., "Edge Computing in IoT Devices").',
      'Craft a 30-second opening hook (Rhetorical question or striking statistic).',
      'Structure the body into 3 key technical pillars using signpost slide transitions.',
      'Deliver presentation with varied pitch, open hand gestures, and direct eye contact.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - TECHNICAL PRESENTATION (EXP-05):

TOPIC: "Edge AI Architecture: Transforming Real-Time IoT Processing"

1. PRESENTATION STRUCTURE & HOOK:
   - Opening Hook: "Did you know that by 2030, over 50 billion IoT sensors will generate data faster than cloud pipelines can process?"
   - Core Problem: Cloud latency (200ms+) causes fatal delays in autonomous vehicle braking and medical telemetry.
   - Solution (Edge AI): On-device neural network inference reducing latency to < 5ms.

2. VISUAL SLIDE OUTLINE (6x6 RULE COMPLIANCE):
   - Slide 1: Title & Speaker Info
   - Slide 2: The Cloud Latency Bottleneck (3 bullet points, 1 architecture diagram)
   - Slide 3: Edge AI Microcontrollers (TPU vs NPU hardware specs)
   - Slide 4: Real-World Case Study (Autonomous Drone Navigation)
   - Slide 5: Conclusion & Q&A

3. Q&A SIMULATION RESPONSE:
   - Question: "How do edge devices handle memory heat dissipation?"
   - Answer: "Great question. Edge AI model quantization reduces 32-bit floats to 8-bit integers, lowering power consumption and thermal output by 70%."`,
    defaultReflection: 'Delivering the opening hook gave me immediate audience engagement. Practicing vocal projection prevented me from speaking too fast during complex hardware slides.',
    rubricCriteria: [
      { name: 'Hook & Opening Impact', maxScore: 20, description: 'Grabs attention immediately with a relevant stat, story, or question.' },
      { name: 'Content Structure & Logic', maxScore: 20, description: 'Clear problem-solution flow with seamless slide transitions.' },
      { name: 'Visual Slide Aesthetics', maxScore: 20, description: 'Clean layouts following the 6x6 rule with minimal clutter.' },
      { name: 'Vocal Variety & Body Language', maxScore: 20, description: 'Assertive projection, pitch modulation, eye contact, and gestures.' },
      { name: 'Q&A Handling Quality', maxScore: 20, description: 'Confident, precise, and polite responses to audience inquiries.' }
    ],
    targetOutputs: ['Presentation Transcript & Slide Outline', '3-Minute Delivery Audio Recording', 'Q&A Log Sheet'],
    facultySampleRemarks: 'Outstanding technical presentation. Hook was memorable and slide outline followed the 6x6 rule impeccably. Approved.'
  },

  knowledgeCheck: {
    title: 'Public Speaking & Technical Presentations Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'ps-q1',
        type: 'mcq',
        prompt: 'What does the "6x6 Rule" in presentation slide design dictate?',
        options: [
          'Maximum 6 lines of text per slide and approximately 6 words per line',
          'Maximum 6 slides presented in exactly 6 minutes',
          'Using 6 different font colors and 6 image animations per slide',
          'Presenting to a maximum audience size of 6 people with 6 handouts'
        ],
        correctAnswer: 'Maximum 6 lines of text per slide and approximately 6 words per line',
        explanation: 'The 6x6 rule limits cognitive overload by capping slide text to 6 lines with ~6 words per line.'
      },
      {
        id: 'ps-q2',
        type: 'mcq',
        prompt: 'Which strategy is most effective for an opening presentation hook?',
        options: [
          'Starting with a compelling statistic, thought-provoking problem, or short relevant anecdote',
          'Reading title slide text word-for-word',
          'Apologizing in advance for being nervous or unprepared',
          'Asking the audience to read a long paragraph silently'
        ],
        correctAnswer: 'Starting with a compelling statistic, thought-provoking problem, or short relevant anecdote',
        explanation: 'Statistics, problems, or anecdotes capture immediate audience interest.'
      },
      {
        id: 'ps-q3',
        type: 'mcq',
        prompt: 'What are the three core guidelines of Guy Kawasaki\'s famous 10-20-30 presentation rule?',
        options: [
          '10 slides total, 20 minutes maximum duration, and 30-point minimum font size',
          '10 words per line, 20 slides, and 30 minutes of audience Q&A',
          '10 diagrams, 20 bullet points, and 30-second speaking intervals',
          '10 minutes preparation, 20 slides presented, and 30 audience questions'
        ],
        correctAnswer: '10 slides total, 20 minutes maximum duration, and 30-point minimum font size',
        explanation: 'Guy Kawasaki\'s 10-20-30 rule recommends 10 slides, 20 minutes of speaking, and a minimum font size of 30 points.'
      },
      {
        id: 'ps-q4',
        type: 'mcq',
        prompt: 'Modulating pitch, volume, and pace during a speech is known as vocal ______.',
        options: [
          'Vocal Variety and Modulation',
          'Vocal Stagnation',
          'Acoustic Distortion',
          'Monotone Delivery'
        ],
        correctAnswer: 'Vocal Variety and Modulation',
        explanation: 'Vocal variety prevents monotonous delivery and maintains audience attention.'
      },
      {
        id: 'ps-q5',
        type: 'mcq',
        prompt: 'How should a speaker utilize the "Anchor Stance" and hand gestures when presenting on stage?',
        options: [
          'Stand with feet shoulder-width apart, maintain open palm gestures, and make purposeful transitions',
          'Constantly pace back and forth rapidly across the stage with hands locked inside pockets',
          'Lean continuously on the podium and keep arms tightly crossed across the chest',
          'Turn your back completely toward the audience to read directly from the projection screen'
        ],
        correctAnswer: 'Stand with feet shoulder-width apart, maintain open palm gestures, and make purposeful transitions',
        explanation: 'An anchor stance combined with open gestures projects authority and confidence.'
      },
      {
        id: 'ps-q6',
        type: 'mcq',
        prompt: 'In a 3-minute technical elevator pitch, how should the speaker allocate their delivery time?',
        options: [
          '30s Hook/Problem, 60s Solution/Architecture, 60s Impact/Metrics, and 30s Call to Action',
          '2.5 minutes listing personal hobbies and 30 seconds mentioning the project title',
          '3 full minutes reading raw code syntax line-by-line without explaining the problem',
          '1 minute apologizing for technical bugs and 2 minutes answering unrelated questions'
        ],
        correctAnswer: '30s Hook/Problem, 60s Solution/Architecture, 60s Impact/Metrics, and 30s Call to Action',
        explanation: 'A balanced 3-minute pitch dedicates 30s to Hook/Problem, 60s to Solution, 60s to Impact, and 30s to the Call to Action.'
      },
      {
        id: 'ps-q7',
        type: 'mcq',
        prompt: 'What is the recommended strategy when an audience member asks a challenging technical question you do not know the answer to?',
        options: [
          'Acknowledge the question politely, state current findings honestly, and offer to follow up with data',
          'Pretend to know the answer and invent fictional technical statistics on the spot',
          'Criticize the question as irrelevant and immediately dismiss the audience member',
          'End the presentation abruptly and leave the stage without responding'
        ],
        correctAnswer: 'Acknowledge the question politely, state current findings honestly, and offer to follow up with data',
        explanation: 'Professional credibility is strengthened by honestly acknowledging limits and offering to follow up.'
      },
      {
        id: 'ps-q8',
        type: 'mcq',
        prompt: 'What visual design approach prevents cognitive overload on technical architecture slides?',
        options: [
          'Using clear visual hierarchy, whitespace, high-contrast labels, and minimal supporting bullet points',
          'Pasting dense unformatted paragraphs of text in 10-point font across the entire slide',
          'Adding flashing multi-color animations and background music to every slide transition',
          'Displaying raw database tables containing hundreds of uncurated rows'
        ],
        correctAnswer: 'Using clear visual hierarchy, whitespace, high-contrast labels, and minimal supporting bullet points',
        explanation: 'Whitespace and clean diagrammatic hierarchy allow audiences to absorb complex technical systems effortlessly.'
      },
      {
        id: 'ps-q9',
        type: 'mcq',
        prompt: 'When delivering an impromptu answer during a presentation Q&A session, how does the PREP framework structure the response?',
        options: [
          'Point (Direct claim), Reason (Underlying logic), Example (Concrete technical evidence), Point (Restated conclusion)',
          'Problem, Review, Evaluation, Postpone',
          'Pause, Repeat, Explain, Politely decline',
          'Plan, Research, Execute, Publish'
        ],
        correctAnswer: 'Point (Direct claim), Reason (Underlying logic), Example (Concrete technical evidence), Point (Restated conclusion)',
        explanation: 'PREP (Point -> Reason -> Example -> Point) provides an instant 4-step mental structure for concise answers.'
      },
      {
        id: 'ps-q10',
        type: 'mcq',
        prompt: 'Which physiological and cognitive technique best helps engineers channel nervous adrenaline into dynamic stage presence?',
        options: [
          'Practicing deep diaphragmatic breathing, positive visualization, and focusing on audience value',
          'Speaking as fast as possible to finish the presentation in under 60 seconds',
          'Memorizing a rigid word-for-word script and avoiding all eye contact with audience members',
          'Drinking excessive caffeine immediately before stepping onto the stage'
        ],
        correctAnswer: 'Practicing deep diaphragmatic breathing, positive visualization, and focusing on audience value',
        explanation: 'Diaphragmatic breathing stabilizes heart rate, while shifting cognitive focus to audience value transforms anxiety into presence.'
      }
    ]
  },

  resources: [
    {
      id: 'res-ps1',
      title: 'Technical Presentation Architecture & Slide Design Guide',
      type: 'reference',
      description: 'Step-by-step guide to structuring 3-10 minute technical seminar presentations.',
      content: `TECHNICAL PRESENTATION STRUCTURE GUIDE

1. The 10-20-30 Rule (Guy Kawasaki Standard):
   - 10 Slides total for a full presentation.
   - 20 Minutes maximum duration.
   - 30 Point minimum font size for readability.

2. Presentation Flow:
   - Minute 0-0.5: Hook & Title Introduction.
   - Minute 0.5-1.5: Problem Context & Current Limitations.
   - Minute 1.5-2.5: Proposed Technical Solution & System Architecture.
   - Minute 2.5-3.0: Key Results, Conclusion, & Q&A Invitation.`
    }
  ],

  recordWork: {
    title: 'Public Speaking Audio & Presentation Submissions',
    instructions: 'Upload audio or slide outlines of technical seminar presentations for AI slide and vocal evaluation.',
    allowedFormats: ['audio', 'pdf'],
    sampleAudioPrompts: [
      'Record a 3-minute technical seminar presentation on "Zero Trust Security in Cloud Engineering".',
      'Record a 60-second opening hook for a seminar on "Quantum Computing Algorithms".'
    ],
    submissionGuidelines: [
      'Project voice clearly and maintain confident pacing.',
      'Ensure clear separation between main slide points.'
    ]
  },

  reflectionConfig: {
    title: 'Module 5 Reflection & Public Speaking Growth',
    instructions: 'Reflect on your public speaking confidence, slide design, and audience engagement.',
    questions: [
      'How effective was your opening hook in grabbing listener attention?',
      'Did you rely on reading slide text or did you maintain eye contact?',
      'How comfortable did you feel handling spontaneous Q&A questions?',
      'What area of vocal variety (pitch, volume, rate) will you target next?'
    ],
    rubricFocus: ['Self-assessment accuracy', 'Vocal projection growth']
  },

  portfolioConfig: {
    title: 'Public Speaking & Presentations Portfolio',
    artifactCategories: ['3-Minute Presentation Audio', 'Slide Outline & Transcript', 'Q&A Response Record'],
    rubricCriteria: ['Engagement (35%)', 'Structure (35%)', 'Vocal & Non-Verbal (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Record 3-Minute Technical Presentation',
      'Submit Presentation Slide Outline',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-05'
    ],
    skillsMastered: ['Presentation Hooks', '6x6 Slide Design', 'Vocal Variety', 'Q&A Handling'],
    recommendations: [
      'Practice opening hooks in front of a camera to check body language.',
      'Use 30pt font minimum on all slide bullet points.'
    ],
    passingThreshold: 75
  }
};
