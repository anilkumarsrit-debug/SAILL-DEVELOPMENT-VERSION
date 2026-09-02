import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module6Questions: QuestionBankItem[] = [
  {
    id: 'qb-int-001',
    moduleId: 'professional-writing',
    topic: 'STAR Method Framework',
    courseOutcome: 'CO5',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What do the letters in the behavioral interview framework STAR stand for?',
    options: [
      'Situation, Task, Action, Result',
      'Strategy, Technology, Assessment, Review',
      'Skills, Training, Aptitude, Readiness',
      'Solution, Timeline, Architecture, Report'
    ],
    correctAnswer: 'Situation, Task, Action, Result',
    explanation: 'STAR structures behavioral stories: Situation (context) -> Task (challenge) -> Action (your specific contribution) -> Result (quantified outcome).',
    keywords: ['STAR', 'Behavioral Interview', 'Career Readiness'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-int-002',
    moduleId: 'professional-writing',
    topic: 'STAR Time Allocation',
    courseOutcome: 'CO5',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a well-structured STAR behavioral interview response, which component should occupy the largest share (~50-60%) of your speaking time?',
    options: [
      'Action (The specific engineering steps, problem-solving logic, and technical tools YOU personally utilized)',
      'Situation (A 5-minute detailed narrative about the college campus or company history)',
      'Task (Repeating the problem statement over and over without sharing solutions)',
      'General small talk about weather and personal hobbies'
    ],
    correctAnswer: 'Action (The specific engineering steps, problem-solving logic, and technical tools YOU personally utilized)',
    explanation: 'Interviewers evaluate your personal engineering agency, technical choices, and initiative detailed in the Action section.',
    keywords: ['STAR Breakdown', 'Action Allocation', 'Interview Strategy'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-int-003',
    moduleId: 'professional-writing',
    topic: '60-Second Elevator Pitch',
    courseOutcome: 'CO5',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the optimal 3-part formula for answering "Tell me about yourself" in a campus recruitment interview?',
    options: [
      'Present (Current branch & core technical strengths) -> Past (Key project achievement) -> Future (Alignment with the target role)',
      'Listing every academic mark from elementary school to present day',
      'Reading your entire printed resume aloud without pause',
      'Explaining why you dislike academic exams'
    ],
    correctAnswer: 'Present (Current branch & core technical strengths) -> Past (Key project achievement) -> Future (Alignment with the target role)',
    explanation: 'The Present-Past-Future blueprint provides a crisp, professional narrative that connects technical skills to corporate goals.',
    keywords: ['Elevator Pitch', 'Tell Me About Yourself', 'Present Past Future'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-int-004',
    moduleId: 'professional-writing',
    topic: 'Handling Behavioral Conflict Questions',
    courseOutcome: 'CO5',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'When asked "Describe a time you had a conflict with a team member during a project," what should your answer demonstrate?',
    options: [
      'Professional communication, empathetic listening, data-driven compromise, and successful project delivery',
      'Blaming the team member entirely and explaining why they should have been removed',
      'Denying that any conflicts ever happen in any engineering team',
      'Complaining about college lab faculties and equipment'
    ],
    correctAnswer: 'Professional communication, empathetic listening, data-driven compromise, and successful project delivery',
    explanation: 'Interviewers look for emotional intelligence, constructive collaboration, and the ability to de-escalate friction objectively.',
    keywords: ['Conflict Resolution', 'Emotional Intelligence', 'Teamwork'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-int-005',
    moduleId: 'professional-writing',
    topic: 'Non-Verbal Communication & Body Language',
    courseOutcome: 'CO5',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which non-verbal communication behavior projects confidence, active engagement, and composure during an interview?',
    options: [
      'Maintaining natural eye contact (60-70% of the time), upright open posture, and attentive nodding',
      'Slouching backwards with arms crossed and avoiding looking at the panel',
      'Staring unblinkingly at the interviewer for 100% of the duration without speaking',
      'Repeatedly checking a smartwatch or mobile phone during interviewer questions'
    ],
    correctAnswer: 'Maintaining natural eye contact (60-70% of the time), upright open posture, and attentive nodding',
    explanation: '60-70% natural eye contact paired with open posture conveys confidence, authenticity, and respectful engagement.',
    keywords: ['Non-Verbal Cues', 'Body Language', 'Eye Contact'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-int-006',
    moduleId: 'professional-writing',
    topic: 'Vocal Pacing & Eliminating Filler Words',
    courseOutcome: 'CO5',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the recommended speech rate and strategy for eliminating filler words ("um", "like", "you know") during interviews?',
    options: [
      'Speaking at a measured pace of 130-150 words per minute and replacing fillers with purposeful 1-2 second silent pauses',
      'Speaking at over 250 words per minute without pausing for breath',
      'Speaking as quietly as possible so filler words cannot be heard',
      'Repeating filler words continuously to fill every microsecond of silence'
    ],
    correctAnswer: 'Speaking at a measured pace of 130-150 words per minute and replacing fillers with purposeful 1-2 second silent pauses',
    explanation: 'A steady pace of 130-150 WPM combined with brief silent pauses gives your brain time to formulate articulate thoughts without fillers.',
    keywords: ['Speech Rate', 'Filler Words', 'Pacing', 'Vocal Control'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-int-007',
    moduleId: 'professional-writing',
    topic: 'Technical vs HR Round Distinctions',
    courseOutcome: 'CO5',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the fundamental difference in focus between a Technical Interview and an HR Interview round?',
    options: [
      'Technical rounds assess core problem-solving and coding/engineering competence; HR rounds evaluate cultural fit, behavioral maturity, and communication clarity',
      'Technical rounds evaluate grammar; HR rounds evaluate compiler design',
      'Technical rounds are strictly conversational; HR rounds require live assembly coding',
      'Both rounds ask identical questions with identical evaluation criteria'
    ],
    correctAnswer: 'Technical rounds assess core problem-solving and coding/engineering competence; HR rounds evaluate cultural fit, behavioral maturity, and communication clarity',
    explanation: 'Technical rounds validate coding and systems knowledge, while HR interviews evaluate behavioral adaptability, ethics, and long-term team fit.',
    keywords: ['Technical vs HR', 'Recruitment Rounds', 'Placement Strategy'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-int-008',
    moduleId: 'professional-writing',
    topic: 'Thoughtful Questions for the Interviewer',
    courseOutcome: 'CO5',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'At the end of an interview when asked "Do you have any questions for us?", which response demonstrates the highest career maturity?',
    options: [
      'Asking an informed question about the engineering team\'s current technical roadmap, tooling, or mentorship culture',
      'Asking "How soon can I take a one-month vacation?"',
      'Saying "No, I don\'t have any questions, I just want the job offer"',
      'Asking the interviewer for their personal salary details'
    ],
    correctAnswer: 'Asking an informed question about the engineering team\'s current technical roadmap, tooling, or mentorship culture',
    explanation: 'Inquiring about tech stacks, engineering challenges, or onboarding mentorship demonstrates proactive interest and career seriousness.',
    keywords: ['Closing Questions', 'Candidate Curiosity', 'Professionalism'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-int-009',
    moduleId: 'professional-writing',
    topic: 'Answering Technical Weakness Questions',
    courseOutcome: 'CO5',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When asked "What is your biggest weakness?", what is the most effective approach for an engineering student?',
    options: [
      'Mentioning a genuine technical area you are actively improving, along with concrete steps (courses/projects) you are taking to bridge the gap',
      'Stating "I have no weaknesses whatsoever; I am perfect"',
      'Using a cliché non-answer like "I am too much of a perfectionist and work too hard"',
      'Revealing severe disqualifying traits like refusing to work in teams'
    ],
    correctAnswer: 'Mentioning a genuine technical area you are actively improving, along with concrete steps (courses/projects) you are taking to bridge the gap',
    explanation: 'Authentic self-awareness paired with an active improvement strategy shows growth mindset and humility without self-sabotage.',
    keywords: ['Weakness Question', 'Growth Mindset', 'Self Awareness'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-int-010',
    moduleId: 'professional-writing',
    topic: 'Handling High-Stress or Ambiguous Questions',
    courseOutcome: 'CO5',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'If an interviewer asks a difficult problem-solving question where you do not immediately know the complete solution, how should you proceed?',
    options: [
      'Clarify assumptions out loud, break the problem into smaller logical sub-components, and articulate your thought process systematically',
      'Remain completely silent for 5 minutes hoping the interviewer forgets the question',
      'Guess a random number and claim it is the mathematically proven answer',
      'Complain that the question was not in the university syllabus'
    ],
    correctAnswer: 'Clarify assumptions out loud, break the problem into smaller logical sub-components, and articulate your thought process systematically',
    explanation: 'Interviewers often care more about how you think, clarify ambiguities, and decompose complex challenges than getting an instant memorized answer.',
    keywords: ['Problem Solving', 'Articulating Logic', 'Ambiguity'],
    estimatedTimeSeconds: 35
  }
];
