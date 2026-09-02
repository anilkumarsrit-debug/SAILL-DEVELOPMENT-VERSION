import { QuestionBankEntry, QuestionBankCategory } from '../types';

export const MASTER_QUESTION_BANK: QuestionBankEntry[] = [
  // PRONUNCIATION CATEGORY
  {
    id: 'mcmf-qb-pron-01',
    category: 'pronunciation',
    journeyId: 'journey-01',
    questionText: 'How many distinct phonemes exist in standard Received Pronunciation (RP) English?',
    options: ['26 phonemes', '32 phonemes', '44 phonemes', '52 phonemes'],
    correctAnswer: 2,
    explanation: 'Standard English comprises 44 phonemes: 20 vowels and 24 consonants.',
    difficulty: 'Foundation',
    promptRef: 'PROMPT_M01_PRONUNCIATION_01'
  },
  {
    id: 'mcmf-qb-pron-02',
    category: 'pronunciation',
    journeyId: 'journey-01',
    questionText: 'In the engineering term "AUTOMATION", which syllable receives the primary stress?',
    options: ['1st syllable (AU-to-ma-tion)', '2nd syllable (au-TO-ma-tion)', '3rd syllable (au-to-MA-tion)', '4th syllable (au-to-ma-TION)'],
    correctAnswer: 2,
    explanation: 'Words ending in "-tion" place primary stress on the penultimate syllable preceding the suffix.',
    difficulty: 'Intermediate',
    promptRef: 'PROMPT_M01_PRONUNCIATION_01'
  },

  // VOCABULARY CATEGORY
  {
    id: 'mcmf-qb-vocab-01',
    category: 'vocabulary',
    journeyId: 'journey-03',
    questionText: 'Select the most precise academic synonym for "ubiquitous" in computing contexts:',
    options: ['Omnipresent', 'Rare', 'Inconsistent', 'Localized'],
    correctAnswer: 0,
    explanation: 'Ubiquitous computing refers to technology embedded everywhere in the environment.',
    difficulty: 'Intermediate'
  },
  {
    id: 'mcmf-qb-vocab-02',
    category: 'vocabulary',
    journeyId: 'journey-06',
    questionText: 'Which word best describes a document that is concise, clear, and free from unnecessary jargon?',
    options: ['Verbose', 'Succinct', 'Ambiguous', 'Redundant'],
    correctAnswer: 1,
    explanation: 'Succinct means briefly and clearly expressed.',
    difficulty: 'Foundation'
  },

  // GRAMMAR CATEGORY
  {
    id: 'mcmf-qb-gram-01',
    category: 'grammar',
    journeyId: 'journey-06',
    questionText: 'Identify the grammatically correct subject-verb agreement sentence:',
    options: [
      'The list of experimental results are on the server.',
      'The list of experimental results is on the server.',
      'The list of experimental results were on the server.',
      'The list of experimental results have been on the server.'
    ],
    correctAnswer: 1,
    explanation: 'The subject "list" is singular, so it requires the singular verb "is".',
    difficulty: 'Foundation'
  },
  {
    id: 'mcmf-qb-gram-02',
    category: 'grammar',
    journeyId: 'journey-07',
    questionText: 'Which sentence correctly uses the passive voice for technical report reporting?',
    options: [
      'We tested the circuit board yesterday.',
      'The circuit board was tested under extreme thermal conditions.',
      'Testing the circuit board was what we did.',
      'The team tested the circuit board.'
    ],
    correctAnswer: 1,
    explanation: 'Technical reports favor object-focused passive structures emphasizing experimental methodology.',
    difficulty: 'Intermediate'
  },

  // LISTENING CATEGORY
  {
    id: 'mcmf-qb-[#list-01]',
    category: 'listening',
    journeyId: 'journey-02',
    questionText: 'During a lecture on cloud infrastructure, what acoustic cue signifies a key transition point?',
    options: ['Pitch drop and silence', 'Increased speed', 'Muffled tone', 'Monotone repetition'],
    correctAnswer: 0,
    explanation: 'Speakers use a decisive pitch drop followed by a pause to signal topic transitions.',
    difficulty: 'Intermediate',
    promptRef: 'PROMPT_M02_LISTENING_01'
  },

  // READING CATEGORY
  {
    id: 'mcmf-qb-read-01',
    category: 'reading',
    journeyId: 'journey-09',
    questionText: 'What is the primary function of an executive summary in technical whitepapers?',
    options: [
      'To list all bibliographic citations',
      'To provide a high-level synthesis of problem, methodology, and conclusions',
      'To include complete source code listings',
      'To explain historical context before 1900'
    ],
    correctAnswer: 1,
    explanation: 'An executive summary allows busy decision-makers to digest core conclusions quickly.',
    difficulty: 'Foundation',
    promptRef: 'PROMPT_M09_READING_01'
  },

  // WRITING CATEGORY
  {
    id: 'mcmf-qb-writ-01',
    category: 'writing',
    journeyId: 'journey-11',
    questionText: 'In an IEEE lab report, where should the research methodology be placed?',
    options: ['Abstract', 'Introduction', 'Methods and Materials', 'Conclusion'],
    correctAnswer: 2,
    explanation: 'Experimental procedures and design configurations belong in Methods and Materials.',
    difficulty: 'Foundation',
    promptRef: 'PROMPT_M11_REPORT_01'
  },

  // INTERVIEW CATEGORY
  {
    id: 'mcmf-qb-[#int-01]',
    category: 'interview',
    journeyId: 'journey-08',
    questionText: 'In the STAR interview methodology, what does the "R" stand for?',
    options: ['Rationale', 'Result', 'Reaction', 'Review'],
    correctAnswer: 1,
    explanation: 'STAR stands for Situation, Task, Action, and Result.',
    difficulty: 'Foundation'
  },

  // BUSINESS COMMUNICATION CATEGORY
  {
    id: 'mcmf-qb-biz-01',
    category: 'business_communication',
    journeyId: 'journey-04',
    questionText: 'In a professional Group Discussion (GD), how should you politely intervene when someone interrupts?',
    options: [
      'Raise your voice louder than theirs',
      'Acknowledge their point briefly, then complete your thought firmly',
      'Stop speaking and leave the table',
      'Inform the moderator immediately'
    ],
    correctAnswer: 1,
    explanation: 'Polite assertion acknowledges contributions while maintaining turn ownership.',
    difficulty: 'Advanced',
    promptRef: 'PROMPT_M04_GD_01'
  }
];

export function getQuestionsByCategory(category: QuestionBankCategory): QuestionBankEntry[] {
  return MASTER_QUESTION_BANK.filter((q) => q.category === category);
}

export function getQuestionsByJourney(journeyId: string): QuestionBankEntry[] {
  return MASTER_QUESTION_BANK.filter((q) => q.journeyId === journeyId);
}
