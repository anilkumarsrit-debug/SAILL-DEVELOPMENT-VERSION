import { ModuleConfig } from '../../types/moduleConfig';

export const module6Config: ModuleConfig = {
  moduleId: 'professional-writing',
  code: 'R26-LAB-06',
  title: 'Professional Technical Writing & Vocabulary',
  syllabusTopic: 'Technical Jargon vs Plain English, Passive to Active Voice, Conciseness, Precision & Academic Style',
  description: 'Master technical clarity, active voice transformation, eliminating wordiness, domain vocabulary precision, and drafting technical specifications.',

  notebookConfig: {
    experimentNumber: 'EXP-06',
    aim: 'To transform wordy passive technical prose into concise, precise, active-voice engineering documentation.',
    apparatus: ['SAILL Technical Readability Engine', 'Passive-Voice Highlighter', 'Wordiness Eliminator'],
    theory: 'Clear engineering writing prioritizes active voice (Subject + Verb + Object), precise technical vocabulary, bulleted lists, and eliminates redundant wordiness (e.g. "at this point in time" -> "now").',
    procedure: [
      'Analyze raw wordy technical passages containing passive voice and jargon overload.',
      'Convert passive constructions into active voice statement format.',
      'Eliminate wordy phrases and replace vague words with domain-precise engineering terms.',
      'Format output into structured technical documentation using bullet points and headers.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - PROFESSIONAL TECHNICAL WRITING (EXP-06):

1. PASSIVE TO ACTIVE VOICE TRANSFORMATIONS:
   - Original (Passive): "The database migration script was executed by the devops team on Friday."
   - Revised (Active): "The DevOps team executed the database migration script on Friday."

   - Original (Passive): "Errors were logged by the system when memory overflow occurred."
   - Revised (Active): "The system logged errors when memory overflow occurred."

2. WORDINESS ELIMINATION & CONCISENESS:
   - Wordy: "Due to the fact that the server experienced an unexpected power failure..."
   - Concise: "Because the server lost power unexpectedly..."

   - Wordy: "In spite of the fact that testing was conducted on a daily basis..."
   - Concise: "Although tested daily..."

3. TECHNICAL SPECIFICATION SUMMARY:
   "The backend API handles up to 10,000 requests per second with a sub-50ms response latency, ensuring 99.99% system availability during peak traffic spikes."`,
    defaultReflection: 'Converting passive voice to active voice made my technical descriptions much sharper and reduced sentence length by nearly 25%.',
    rubricCriteria: [
      { name: 'Active Voice Usage', maxScore: 20, description: 'Consistently uses direct active voice constructions.' },
      { name: 'Conciseness & Word Count', maxScore: 20, description: 'Eliminates fluff words and redundant phrases.' },
      { name: 'Technical Precision', maxScore: 20, description: 'Uses domain-accurate terminology and exact metrics.' },
      { name: 'Clarity & Readability Score', maxScore: 20, description: 'Achieves high readability score (Flesch-Kincaid Grade 9-11).' },
      { name: 'Document Structuring', maxScore: 20, description: 'Effective headings, bullet points, and visual spacing.' }
    ],
    targetOutputs: ['Edited Technical Specification', 'Passive-Active Transformation Table', 'Readability Score Sheet'],
    facultySampleRemarks: 'Excellent technical conciseness. Wordiness eliminated and active voice applied accurately across specifications. Approved.'
  },

  knowledgeCheck: {
    title: 'Interview Skills & Career Readiness Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'int-q1',
        type: 'mcq',
        prompt: 'What do the letters in the behavioral interview framework STAR stand for?',
        options: [
          'Situation, Task, Action, Result',
          'Strategy, Technology, Assessment, Review',
          'Skills, Training, Aptitude, Readiness',
          'Solution, Timeline, Architecture, Report'
        ],
        correctAnswer: 'Situation, Task, Action, Result',
        explanation: 'STAR structures behavioral stories: Situation (context) -> Task (challenge) -> Action (your contribution) -> Result (outcome).'
      },
      {
        id: 'int-q2',
        type: 'mcq',
        prompt: 'In a well-structured STAR behavioral interview response, which component should occupy the largest share (~50-60%) of your speaking time?',
        options: [
          'Action (The specific engineering steps, problem-solving logic, and technical tools YOU personally utilized)',
          'Situation (A 5-minute detailed narrative about the college campus or company history)',
          'Task (Repeating the problem statement over and over without sharing solutions)',
          'General small talk about weather and personal hobbies'
        ],
        correctAnswer: 'Action (The specific engineering steps, problem-solving logic, and technical tools YOU personally utilized)',
        explanation: 'Interviewers evaluate your personal engineering agency, technical choices, and initiative detailed in the Action section.'
      },
      {
        id: 'int-q3',
        type: 'mcq',
        prompt: 'What is the optimal 3-part formula for answering "Tell me about yourself" in a campus recruitment interview?',
        options: [
          'Present (Current branch & core technical strengths) -> Past (Key project achievement) -> Future (Alignment with the target role)',
          'Listing every academic mark from elementary school to present day',
          'Reading your entire printed resume aloud without pause',
          'Explaining why you dislike academic exams'
        ],
        correctAnswer: 'Present (Current branch & core technical strengths) -> Past (Key project achievement) -> Future (Alignment with the target role)',
        explanation: 'The Present-Past-Future blueprint provides a crisp, professional narrative connecting technical skills to corporate goals.'
      },
      {
        id: 'int-q4',
        type: 'mcq',
        prompt: 'When asked "Describe a time you had a conflict with a team member during a project," what should your answer demonstrate?',
        options: [
          'Professional communication, empathetic listening, data-driven compromise, and successful project delivery',
          'Blaming the team member entirely and explaining why they should have been removed',
          'Denying that any conflicts ever happen in any engineering team',
          'Complaining about college lab faculties and equipment'
        ],
        correctAnswer: 'Professional communication, empathetic listening, data-driven compromise, and successful project delivery',
        explanation: 'Interviewers look for emotional intelligence, constructive collaboration, and the ability to de-escalate friction objectively.'
      },
      {
        id: 'int-q5',
        type: 'mcq',
        prompt: 'Which non-verbal communication behavior projects confidence, active engagement, and composure during an interview?',
        options: [
          'Maintaining natural eye contact (60-70% of the time), upright open posture, and attentive nodding',
          'Slouching backwards with arms crossed and avoiding looking at the panel',
          'Staring unblinkingly at the interviewer for 100% of the duration without speaking',
          'Repeatedly checking a smartwatch or mobile phone during interviewer questions'
        ],
        correctAnswer: 'Maintaining natural eye contact (60-70% of the time), upright open posture, and attentive nodding',
        explanation: '60-70% natural eye contact paired with open posture conveys confidence, authenticity, and respectful engagement.'
      },
      {
        id: 'int-q6',
        type: 'mcq',
        prompt: 'What is the recommended speech rate and strategy for eliminating filler words ("um", "like", "you know") during interviews?',
        options: [
          'Speaking at a measured pace of 130-150 words per minute and replacing fillers with purposeful 1-2 second silent pauses',
          'Speaking at over 250 words per minute without pausing for breath',
          'Speaking as quietly as possible so filler words cannot be heard',
          'Repeating filler words continuously to fill every microsecond of silence'
        ],
        correctAnswer: 'Speaking at a measured pace of 130-150 words per minute and replacing fillers with purposeful 1-2 second silent pauses',
        explanation: 'A steady pace of 130-150 WPM combined with brief silent pauses gives your brain time to formulate articulate thoughts.'
      },
      {
        id: 'int-q7',
        type: 'mcq',
        prompt: 'What is the fundamental difference in focus between a Technical Interview and an HR Interview round?',
        options: [
          'Technical rounds assess core problem-solving and coding competence; HR rounds evaluate cultural fit, behavioral maturity, and communication clarity',
          'Technical rounds evaluate grammar; HR rounds evaluate compiler design',
          'Technical rounds are strictly conversational; HR rounds require live assembly coding',
          'Both rounds ask identical questions with identical evaluation criteria'
        ],
        correctAnswer: 'Technical rounds assess core problem-solving and coding competence; HR rounds evaluate cultural fit, behavioral maturity, and communication clarity',
        explanation: 'Technical rounds validate coding and systems knowledge, while HR interviews evaluate behavioral adaptability, ethics, and team fit.'
      },
      {
        id: 'int-q8',
        type: 'mcq',
        prompt: 'At the end of an interview when asked "Do you have any questions for us?", which response demonstrates the highest career maturity?',
        options: [
          'Asking an informed question about the engineering team\'s current technical roadmap, tooling, or mentorship culture',
          'Asking "How soon can I take a one-month vacation?"',
          'Saying "No, I don\'t have any questions, I just want the job offer"',
          'Asking the interviewer for their personal salary details'
        ],
        correctAnswer: 'Asking an informed question about the engineering team\'s current technical roadmap, tooling, or mentorship culture',
        explanation: 'Inquiring about tech stacks, engineering challenges, or mentorship demonstrates proactive interest.'
      },
      {
        id: 'int-q9',
        type: 'mcq',
        prompt: 'When asked "What is your biggest weakness?", what is the most effective approach for an engineering student?',
        options: [
          'Mentioning a genuine technical area you are actively improving, along with concrete steps (courses/projects) you are taking to bridge the gap',
          'Stating "I have no weaknesses whatsoever; I am perfect"',
          'Using a cliché non-answer like "I am too much of a perfectionist and work too hard"',
          'Revealing severe disqualifying traits like refusing to work in teams'
        ],
        correctAnswer: 'Mentioning a genuine technical area you are actively improving, along with concrete steps (courses/projects) you are taking to bridge the gap',
        explanation: 'Authentic self-awareness paired with an active improvement strategy shows growth mindset and humility without self-sabotage.'
      },
      {
        id: 'int-q10',
        type: 'mcq',
        prompt: 'If an interviewer asks a difficult problem-solving question where you do not immediately know the complete solution, how should you proceed?',
        options: [
          'Clarify assumptions out loud, break the problem into smaller logical sub-components, and articulate your thought process systematically',
          'Remain completely silent for 5 minutes hoping the interviewer forgets the question',
          'Guess a random number and claim it is the mathematically proven answer',
          'Complain that the question was not in the university syllabus'
        ],
        correctAnswer: 'Clarify assumptions out loud, break the problem into smaller logical sub-components, and articulate your thought process systematically',
        explanation: 'Interviewers often care more about how you think, clarify ambiguities, and decompose complex challenges than memorized answers.'
      }
    ]
  },

  resources: [
    {
      id: 'res-pw1',
      title: 'Active Voice & Conciseness Editing Guide for Engineers',
      type: 'reference',
      description: 'Quick reference sheet for replacing wordy academic phrases with crisp technical prose.',
      content: `CONCISE TECHNICAL WRITING GUIDE

Wordy Phrase -> Concise Replacement:
- "at this point in time" -> "now"
- "due to the fact that" -> "because"
- "has the capability of" -> "can"
- "in the event that" -> "if"
- "is equipped with" -> "has"
- "make a decision" -> "decide"
- "perform an analysis of" -> "analyze"
- "until such time as" -> "until"`
    }
  ],

  recordWork: {
    title: 'Technical Writing Submissions',
    instructions: 'Upload edited technical specifications, SOPs, or active-voice transformation worksheets.',
    allowedFormats: ['docx', 'pdf'],
    submissionGuidelines: [
      'Ensure all passive voice constructions are converted to active voice.',
      'Limit paragraph lengths to 3-4 sentences maximum.'
    ]
  },

  reflectionConfig: {
    title: 'Module 6 Reflection & Technical Writing Growth',
    instructions: 'Reflect on your technical editing and conciseness improvements.',
    questions: [
      'How easily were you able to spot passive voice sentences in raw technical drafts?',
      'By what percentage were you able to reduce total word count without losing meaning?',
      'How does concise writing improve communication with senior engineering managers?',
      'What editing habits will you adopt when writing lab reports and code documentation?'
    ],
    rubricFocus: ['Clarity growth', 'Self-editing precision']
  },

  portfolioConfig: {
    title: 'Professional Technical Writing Portfolio',
    artifactCategories: ['Revised Technical Specification', 'Passive-Active Transformation Sheet', 'Concise SOP Document'],
    rubricCriteria: ['Active Voice (35%)', 'Conciseness (35%)', 'Structure & Style (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Complete Technical Editing Worksheet',
      'Submit Revised Specification Document',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-06'
    ],
    skillsMastered: ['Active Voice', 'Technical Conciseness', 'Readability Optimization', 'Documentation Design'],
    recommendations: [
      'Run technical drafts through readability checkers to maintain Grade 9-11 clarity.',
      'Eliminate filler phrases like "it is important to note that" from code comments.'
    ],
    passingThreshold: 75
  }
};
