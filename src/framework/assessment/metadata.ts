/**
 * Assessment Metadata Catalog & Builder for UALAF
 * Provides standardized metadata for all 12 learning journeys and custom assessments.
 */

import { AssessmentMetadata, AssessmentType, AssessmentDifficulty } from './types';

export const ASSESSMENT_METADATA_CATALOG: Record<string, AssessmentMetadata> = {
  'j01-a1': {
    assessmentId: 'j01-a1-eval',
    journeyId: 'journey-01',
    code: 'SAILL-J1-A1',
    title: 'Self-Introduction & Phonetic Vowel Articulation Check',
    type: 'ai_pronunciation',
    difficulty: 'Foundation',
    estimatedTimeMinutes: 10,
    maxScore: 100,
    passingScore: 70,
    maxAttempts: 3,
    promptId: 'prompt-pronunciation-j1',
    rubricId: 'rubric-pronunciation-v1',
    instructions: [
      'Ensure you are in a quiet room with a working microphone.',
      'Listen to the native speaker prompt audio carefully.',
      'Record your clear 60-second professional self-introduction focusing on vowel clarity.',
      'Review your response before submitting for AI assessment.'
    ],
    learningOutcomes: [
      'Master clear pronunciation of English front and back vowels.',
      'Deliver a confident 60-second professional elevator introduction.',
      'Achieve minimum 70% accuracy on phoneme articulation.'
    ],
    prerequisites: ['J1-M1 Phonetics Primer']
  },

  'j02-a1': {
    assessmentId: 'j02-a1-eval',
    journeyId: 'journey-02',
    code: 'SAILL-J2-A1',
    title: 'Word Stress & Primary Accentuation Diagnostic',
    type: 'speaking',
    difficulty: 'Foundation',
    estimatedTimeMinutes: 12,
    maxScore: 100,
    passingScore: 75,
    maxAttempts: 3,
    promptId: 'prompt-word-stress-j2',
    rubricId: 'rubric-word-stress-v1',
    instructions: [
      'Read the multi-syllabic word list aloud.',
      'Exaggerate the primary stressed syllable on key vocabulary.',
      'Record your continuous speech segment when prompted.'
    ],
    learningOutcomes: [
      'Identify primary stress in 3- and 4-syllable academic nouns.',
      'Apply proper pitch elevation to accented vowels.'
    ]
  },

  'j03-a1': {
    assessmentId: 'j03-a1-eval',
    journeyId: 'journey-03',
    code: 'SAILL-J3-A1',
    title: 'Technical Vocabulary & Collocation Accuracy Check',
    type: 'knowledge_check',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 15,
    maxScore: 100,
    passingScore: 75,
    maxAttempts: 2,
    promptId: 'prompt-vocab-j3',
    rubricId: 'rubric-vocabulary-v1',
    instructions: [
      'Select the correct technical collocations for software architecture terms.',
      'Fill in missing vocabulary in real-world scenario sentences.',
      'Complete all 10 questions within the 15-minute timer.'
    ],
    learningOutcomes: [
      'Identify precise software engineering collocations.',
      'Distinguish between formal and informal technical terminology.'
    ]
  },

  'j04-a1': {
    assessmentId: 'j04-a1-eval',
    journeyId: 'journey-04',
    code: 'SAILL-J4-A1',
    title: 'Complex Syntax & Conditional Grammar Assessment',
    type: 'writing',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 20,
    maxScore: 100,
    passingScore: 80,
    maxAttempts: 2,
    promptId: 'prompt-grammar-j4',
    rubricId: 'rubric-grammar-v1',
    instructions: [
      'Draft a 150-word incident summary using hypothetical third-conditionals.',
      'Ensure zero subject-verb agreement or tense transition defects.',
      'Submit your response for AI syntactic parsing.'
    ],
    learningOutcomes: [
      'Demonstrate correct construction of complex conditional sentences.',
      'Maintain tense consistency across technical incident summaries.'
    ]
  },

  'j05-a1': {
    assessmentId: 'j05-a1-eval',
    journeyId: 'journey-05',
    code: 'SAILL-J5-A1',
    title: 'Agile Standup & Audio Listening Comprehension',
    type: 'listening',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 15,
    maxScore: 100,
    passingScore: 75,
    maxAttempts: 3,
    promptId: 'prompt-listening-j5',
    rubricId: 'rubric-listening-v1',
    instructions: [
      'Listen to the 2-minute recording of an engineering team standup meeting.',
      'Answer 5 detail-extraction questions regarding sprint blockers and deliverables.',
      'You may play the audio up to 2 times.'
    ],
    learningOutcomes: [
      'Extract specific blockers and commitments from fast-paced meeting audio.',
      'Identify speaker tone and urgency indicators.'
    ]
  },

  'j06-a1': {
    assessmentId: 'j06-a1-eval',
    journeyId: 'journey-06',
    code: 'SAILL-J6-A1',
    title: 'Architecture Spec & Technical Reading Analysis',
    type: 'reading',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 20,
    maxScore: 100,
    passingScore: 80,
    maxAttempts: 2,
    promptId: 'prompt-reading-j6',
    rubricId: 'rubric-reading-v1',
    instructions: [
      'Read the provided cloud architecture specification text.',
      'Answer critical analysis questions regarding design trade-offs.',
      'Infer word meanings for specialized cloud computing terms.'
    ],
    learningOutcomes: [
      'Rapidly comprehend technical system specifications.',
      'Identify implied design constraints and architectural trade-offs.'
    ]
  },

  'j07-a1': {
    assessmentId: 'j07-a1-eval',
    journeyId: 'journey-07',
    code: 'SAILL-J7-A1',
    title: 'Executive Email & Proposal Writing Evaluation',
    type: 'writing',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 25,
    maxScore: 100,
    passingScore: 80,
    maxAttempts: 2,
    promptId: 'prompt-writing-j7',
    rubricId: 'rubric-writing-v1',
    instructions: [
      'Compose a professional email to a CTO proposing a microservice refactor.',
      'Follow executive email format with Subject, Context, Options, and Call to Action.',
      'Word count target: 150 - 250 words.'
    ],
    learningOutcomes: [
      'Format executive-ready communications with clear action items.',
      'Maintain an assertive yet respectful persuasive tone.'
    ]
  },

  'j08-a1': {
    assessmentId: 'j08-a1-eval',
    journeyId: 'journey-08',
    code: 'SAILL-J8-A1',
    title: 'Technical Discussion & Interactive Speech Simulation',
    type: 'speaking',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 15,
    maxScore: 100,
    passingScore: 80,
    maxAttempts: 3,
    promptId: 'prompt-speaking-j8',
    rubricId: 'rubric-pronunciation-v1',
    instructions: [
      'Respond verbally to the simulated team lead question on system scalability.',
      'Speak clearly for 90 seconds without excessive hesitation.',
      'Focus on connected speech and professional pitch cadence.'
    ],
    learningOutcomes: [
      'Express technical architectural choices with vocal clarity.',
      'Maintain natural connected speech cadence during live discussions.'
    ]
  },

  'j09-a1': {
    assessmentId: 'j09-a1-eval',
    journeyId: 'journey-09',
    code: 'SAILL-J9-A1',
    title: 'Full Mock Technical Interview (STAR Method)',
    type: 'interview',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 30,
    maxScore: 100,
    passingScore: 85,
    maxAttempts: 2,
    promptId: 'prompt-interview-j9',
    rubricId: 'rubric-interview-v1',
    instructions: [
      'Answer the AI Interviewer question regarding a time you handled a production outage.',
      'Structure your response strictly following Situation, Task, Action, and Result.',
      'Ensure clear vocal articulation and concise delivery under 2 minutes per answer.'
    ],
    learningOutcomes: [
      'Deliver compelling behavioral interview responses with quantifiable STAR results.',
      'Minimize filler words and eliminate hedging phrases.'
    ]
  },

  'j10-a1': {
    assessmentId: 'j10-a1-eval',
    journeyId: 'journey-10',
    code: 'SAILL-J10-A1',
    title: 'Cross-Functional Client Negotiation & Diplomacy',
    type: 'speaking',
    difficulty: 'Mastery',
    estimatedTimeMinutes: 20,
    maxScore: 100,
    passingScore: 85,
    maxAttempts: 2,
    promptId: 'prompt-biz-comm-j10',
    rubricId: 'rubric-business-communication-v1',
    instructions: [
      'Deliver a verbal response managing scope-creep pushback from a client stakeholder.',
      'Maintain diplomatic tone while protecting engineering bandwidth.',
      'Record your audio and submit for AI feedback.'
    ],
    learningOutcomes: [
      'Frame boundaries diplomatically without offending stakeholders.',
      'Negotiate realistic timeline trade-offs.'
    ]
  },

  'j11-a1': {
    assessmentId: 'j11-a1-eval',
    journeyId: 'journey-11',
    code: 'SAILL-J11-A1',
    title: 'System Design Presentation & Q&A Mastery',
    type: 'speaking',
    difficulty: 'Mastery',
    estimatedTimeMinutes: 25,
    maxScore: 100,
    passingScore: 85,
    maxAttempts: 2,
    promptId: 'prompt-system-design-j11',
    rubricId: 'rubric-business-communication-v1',
    instructions: [
      'Present a 3-minute architectural overview of a high-throughput messaging pipeline.',
      'Address two potential edge-case failure modes explicitly.',
      'Submit audio recording for comprehensive evaluation.'
    ],
    learningOutcomes: [
      'Structure high-level system design presentations clearly.',
      'Exemplify executive presence and technical authority.'
    ]
  },

  'j12-a1': {
    assessmentId: 'j12-a1-eval',
    journeyId: 'journey-12',
    code: 'SAILL-J12-A1',
    title: 'Capstone Capstone Evaluation & Portfolio Defense',
    type: 'future_custom',
    difficulty: 'Mastery',
    estimatedTimeMinutes: 45,
    maxScore: 100,
    passingScore: 90,
    maxAttempts: 2,
    promptId: 'prompt-capstone-j12',
    rubricId: 'rubric-interview-v1',
    instructions: [
      'Present your final SAILL AI Language Laboratory capstone portfolio.',
      'Complete both written summary and verbal reflection artifacts.',
      'Submit for dual AI evaluation and Faculty review queue.'
    ],
    learningOutcomes: [
      'Synthesize all 12 journeys into an enterprise-ready communication portfolio.',
      'Defend technical communication proficiency across oral and written modalities.'
    ]
  }
};

/**
 * Get assessment metadata by key or generate custom fallback
 */
export function getAssessmentMetadata(
  keyOrId: string,
  fallbackTitle?: string,
  type?: AssessmentType,
  difficulty?: AssessmentDifficulty
): AssessmentMetadata {
  if (ASSESSMENT_METADATA_CATALOG[keyOrId]) {
    return ASSESSMENT_METADATA_CATALOG[keyOrId];
  }

  // Look for matching assessmentId inside catalog
  const found = Object.values(ASSESSMENT_METADATA_CATALOG).find(
    (item) => item.assessmentId === keyOrId || item.journeyId === keyOrId
  );
  if (found) return found;

  // Generate dynamic metadata for future or custom assessments
  const cleanId = keyOrId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  const assType = type || 'speaking';
  const diff = difficulty || 'Intermediate';

  return {
    assessmentId: `eval-${cleanId}`,
    journeyId: cleanId.startsWith('j') ? cleanId.split('-')[0] : 'custom-journey',
    code: `SAILL-${cleanId.toUpperCase()}`,
    title: fallbackTitle || 'Interactive Skills Assessment',
    type: assType,
    difficulty: diff,
    estimatedTimeMinutes: 15,
    maxScore: 100,
    passingScore: 75,
    maxAttempts: 3,
    promptId: `prompt-${cleanId}`,
    rubricId: `rubric-${assType.replace('_', '-')}-v1`,
    instructions: [
      'Read the prompt instructions carefully before beginning your attempt.',
      'Ensure your equipment (microphone/keyboard) is properly configured.',
      'Complete your response before the timer expires.',
      'Review your response before final submission.'
    ],
    learningOutcomes: [
      'Demonstrate practical proficiency in target communication skills.',
      'Receive instant actionable AI evaluation and personalized feedback.'
    ]
  };
}
