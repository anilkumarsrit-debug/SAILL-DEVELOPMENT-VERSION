import { ModuleConfig } from '../../types/moduleConfig';

export const module3Config: ModuleConfig = {
  moduleId: 'spoken-english',
  code: 'R26-LAB-03',
  title: 'Spoken English, Fluency & Oral Drills',
  syllabusTopic: 'Just-A-Minute (JAM) Speaking, Oral Drills, Overcoming Hesitation & Filler Reduction',
  description: 'Master spontaneous oral delivery, eliminate speech hesitation, reduce filler words (um, ah, like), and excel in 60-second JAM speaking challenges.',

  notebookConfig: {
    experimentNumber: 'EXP-03',
    aim: 'To deliver fluent 60-second oral speeches without hesitation, repetition, or filler words on technical and general engineering topics.',
    apparatus: ['SAILL JAM Audio Timer', 'Filler Word Frequency Detector', 'Speech Rate Analyzer (WPM)'],
    theory: 'Spontaneous fluency requires speech pacing (120-150 WPM), minimal filled pauses (< 2 fillers per minute), coherent structural flow (PREP: Point, Reason, Example, Point), and clear vocal posture.',
    procedure: [
      'Select a spontaneous JAM topic (e.g., "Impact of AI on Engineering Jobs").',
      'Use the PREP structure during 10-second mental preparation.',
      'Deliver a 60-second oral response into the audio recorder.',
      'Analyze speech analytics for Words Per Minute (WPM), filler frequency, and hesitations.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - JAM SPEAKING & ORAL FLUENCY (EXP-03):

TOPIC: "Role of Open Source Software in Modern Engineering"

DELIVERY TRANSCRIPT:
[POINT] Open-source software is the bedrock of modern engineering innovation because it enables rapid collaborative prototyping.
[REASON] Rather than reinventing fundamental tools, engineering teams build upon audited global repositories like Linux and React, drastically shortening development lifecycles.
[EXAMPLE] For instance, over 90% of cloud servers globally run on Linux distributions developed collaboratively by millions of engineers worldwide.
[POINT] Therefore, open-source software democratizes technology and accelerates world-class engineering solutions.

ANALYTICS SUMMARY:
- Speech Duration: 58 seconds
- Word Count: 128 words
- Speech Pacing: 132 WPM (Optimal Range: 120-150 WPM)
- Filler Count ("um", "uh", "you know"): 1 instance
- Hesitation Pauses (>2s): 0 instances`,
    defaultReflection: 'The PREP framework gave me an immediate structure so I did not freeze. I reduced my filler words from 5 to 1 by embracing short silent pauses instead of saying "um".',
    rubricCriteria: [
      { name: 'Fluency & Speech Pacing (WPM)', maxScore: 20, description: 'Maintains optimal speech rate (120-150 WPM) without long pauses.' },
      { name: 'Filler Word Reduction', maxScore: 20, description: 'Minimal use of vocal fillers (um, ah, like, basically).' },
      { name: 'Structural Coherence (PREP)', maxScore: 20, description: 'Clear Point, Reason, Example, Point organization.' },
      { name: 'Grammatical Accuracy', maxScore: 20, description: 'Correct tense usage, subject-verb agreement, and phrasing.' },
      { name: 'Vocal Energy & Confidence', maxScore: 20, description: 'Engaging pitch modulation, clear articulation, and steady vocal posture.' }
    ],
    targetOutputs: ['60-Second JAM Audio Recording', 'WPM & Filler Analytics Report', 'PREP Speech Transcript'],
    facultySampleRemarks: 'Great delivery. WPM stayed right at 132 and filler word count was minimal. Excellent usage of the PREP framework. Approved.'
  },

  knowledgeCheck: {
    title: 'Spoken English & Fluency Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 's-q1',
        type: 'mcq',
        prompt: 'In a spontaneous oral presentation on "Automated Code Testing", how does the PREP framework structure the 60-second response?',
        options: [
          'Point: State main thesis -> Reason: Explain technical rationale -> Example: Give a concrete test case -> Point: Reiterate conclusion',
          'Problem: State a bug -> Research: Read documentation -> Execute: Write a patch -> Proof: Run unit tests',
          'Prepare: Write notes -> Review: Inspect with peer -> Explain: Summarize code -> Present: Share slides',
          'Point: Complain about bugs -> Rebuttal: Reject peer feedback -> Emotion: Express urgency -> Proposal: Delay deployment'
        ],
        correctAnswer: 'Point: State main thesis -> Reason: Explain technical rationale -> Example: Give a concrete test case -> Point: Reiterate conclusion',
        explanation: 'PREP stands for Point (state core thesis directly), Reason (logical justification), Example (concrete real-world evidence), and Point (reiterate concluding takeaway).'
      },
      {
        id: 's-q2',
        type: 'mcq',
        prompt: 'During an engineering project presentation, an oral speaker speaks at 210 words per minute (WPM), causing dropped syllables. What is the recommended speech rate for clear spoken fluency?',
        options: [
          '120 to 150 Words Per Minute (WPM)',
          '60 to 80 Words Per Minute (WPM)',
          '190 to 220 Words Per Minute (WPM)',
          '260+ Words Per Minute (WPM)'
        ],
        correctAnswer: '120 to 150 Words Per Minute (WPM)',
        explanation: 'A speech delivery rate of 120 to 150 WPM provides the optimal balance between natural conversational rhythm, crisp consonant articulation, and audience comprehension.'
      },
      {
        id: 's-q3',
        type: 'mcq',
        prompt: 'When experiencing a momentary hesitation while explaining a system architecture to an interviewer, which habit best demonstrates vocal control?',
        options: [
          'Inserting deliberate 1 to 2-second silent pauses while formulating thoughts',
          'Filling silence with continuous verbal markers like "um", "uh", and "like"',
          'Repeating "you know basically" to keep the audio stream active',
          'Rushing through sentences without breathing to avoid pauses'
        ],
        correctAnswer: 'Inserting deliberate 1 to 2-second silent pauses while formulating thoughts',
        explanation: 'Deliberate silent pauses project composure, intellectual control, and confidence. They allow the speaker to organize ideas cleanly without vocal clutter.'
      },
      {
        id: 's-q4',
        type: 'mcq',
        prompt: 'In spoken English, word stress shifts between noun and verb forms. When using "project" as a verb in "We project a 30% latency reduction", where is the primary stress placed?',
        options: [
          'On the second syllable: pro-JECT (/prəˈdʒɛkt/)',
          'On the first syllable: PRO-ject (/ˈprɒdʒ.ɛkt/)',
          'Equally stressed on both syllables with monotonic volume',
          'On neither syllable with a glottal stop'
        ],
        correctAnswer: 'On the second syllable: pro-JECT (/prəˈdʒɛkt/)',
        explanation: 'Two-syllable noun-verb pairs shift stress: the noun is stressed on the first syllable (PRO-ject), whereas the verb is stressed on the second syllable (pro-JECT).'
      }
    ]
  },

  resources: [
    {
      id: 'res-s1',
      title: 'PREP Framework Speaking Guide & Cheat Sheet',
      type: 'reference',
      description: 'Quick reference guide on structuring impromptu speech using Point, Reason, Example, Point.',
      content: `THE PREP FRAMEWORK FOR JAM & IMPROMPTU SPEAKING

P - POINT (State your main stance directly)
   - "I strongly believe that renewable energy storage is the biggest engineering challenge of our decade."

R - REASON (Provide logical backing)
   - "This is because while solar and wind power generation are clean, their output is inherently intermittent."

E - EXAMPLE (Support with real-world instance/data)
   - "For example, grid outages occur when peak solar generation hours do not align with evening energy consumption spikes."

P - POINT (Restate thesis with conviction)
   - "Therefore, advancing battery storage technology is critical to achieving a sustainable energy grid."`
    },
    {
      id: 'res-s2',
      title: 'Filler Word Elimination & Pause Management Techniques',
      type: 'worksheet',
      description: 'Practical exercises to eliminate "um", "ah", "like", "basically", and "you know".',
      content: `FILLER ELIMINATION WORKSHOP

1. Identify Your Default Filler:
   - Record yourself reading a technical passage. Count occurrences of: um, ah, like, basically, actually, you know.

2. The Silent Pause Technique:
   - Whenever you feel the urge to say "um", lock your lips together and count 1 second silently.
   - Silent pauses sound authoritative and deliberate.

3. Chunking Sentences:
   - Speak in short 5-7 word breath groups rather than continuous run-on sentences.`
    }
  ],

  recordWork: {
    title: 'JAM Speaking Audio Submissions',
    instructions: 'Record 60-second oral speeches for assigned JAM topics and submit for AI WPM & filler word analysis.',
    allowedFormats: ['audio'],
    sampleAudioPrompts: [
      'JAM Topic 1: Automation vs Job Creation in Engineering.',
      'JAM Topic 2: Why Cybersecurity is Every Engineer Responsibility.',
      'JAM Topic 3: The Importance of Communication Skills in Tech Interviews.'
    ],
    submissionGuidelines: [
      'Speak for at least 50 seconds and under 65 seconds.',
      'Keep filler word frequency under 2 instances.'
    ]
  },

  reflectionConfig: {
    title: 'Module 3 Reflection & Oral Fluency Growth',
    instructions: 'Reflect on your spontaneous speaking performance and filler word reduction.',
    questions: [
      'What was your filler word count during your initial JAM attempt versus your final attempt?',
      'How did applying the PREP structure prevent mind-blanking during impromptu speaking?',
      'How do you feel about your speech pacing (WPM) and vocal enthusiasm?',
      'What speaking habits will you practice for future campus placement drives?'
    ],
    rubricFocus: ['Fluency self-awareness', 'Action plan for spontaneous speaking']
  },

  portfolioConfig: {
    title: 'Spoken English & Oral Fluency Portfolio',
    artifactCategories: ['60-Second JAM Audio Recording', 'Speech Pacing Analytics', 'PREP Speech Transcript'],
    rubricCriteria: ['Fluency & Rate (40%)', 'Structure (30%)', 'Clarity & Delivery (30%)']
  },

  statusConfig: {
    targetScore: 92,
    requiredTasks: [
      'Complete 60-Second JAM Speaking Recording',
      'Review Speech Pacing (WPM) & Filler Report',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-03'
    ],
    skillsMastered: ['JAM Speaking', 'PREP Framework', 'Filler Reduction', 'Spontaneous Delivery'],
    recommendations: [
      'Practice 1-minute random topic speeches daily in front of a mirror or voice recorder.',
      'Replace filler sounds with deliberate 1-second silent pauses.'
    ],
    passingThreshold: 75
  }
};
