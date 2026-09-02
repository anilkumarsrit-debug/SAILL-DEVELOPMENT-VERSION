import { PromptMapping } from '../types';

export const PROMPT_MAPPINGS: Record<string, PromptMapping> = {
  'PROMPT_M01_PRONUNCIATION_01': {
    promptId: 'PROMPT_M01_PRONUNCIATION_01',
    activityId: 'act-m01-01',
    journeyId: 'journey-01',
    systemPromptIdentifier: 'SYSTEM_PRONUNCIATION_ANALYZER_V1',
    userPromptTemplate: 'Evaluate student phoneme accuracy for text: {{targetText}} in accent: {{accent}}. Audio transcript: {{transcript}}',
    description: 'Generates phoneme accuracy, stress alignment, and IPA divergence report.'
  },
  'PROMPT_M02_LISTENING_01': {
    promptId: 'PROMPT_M02_LISTENING_01',
    activityId: 'act-m02-01',
    journeyId: 'journey-02',
    systemPromptIdentifier: 'SYSTEM_LISTENING_COMPREHENSION_V1',
    userPromptTemplate: 'Analyze listening comprehension response for passage ID: {{passageId}}. Student answer: {{studentAnswer}}',
    description: 'Evaluates detail retention, main idea extraction, and inference accuracy.'
  },
  'PROMPT_M03_SPOKEN_01': {
    promptId: 'PROMPT_M03_SPOKEN_01',
    activityId: 'act-m03-01',
    journeyId: 'journey-03',
    systemPromptIdentifier: 'SYSTEM_JAM_SPOKEN_EVALUATOR_V1',
    userPromptTemplate: 'Assess Just-A-Minute (JAM) speech on topic: {{topic}}. Transcript: {{transcript}}',
    description: 'Measures fluency WPM, filler word count, grammatical coherence, and confidence.'
  },
  'PROMPT_M04_GD_01': {
    promptId: 'PROMPT_M04_GD_01',
    activityId: 'act-m04-01',
    journeyId: 'journey-04',
    systemPromptIdentifier: 'SYSTEM_GD_FACILITATOR_V1',
    userPromptTemplate: 'Evaluate Group Discussion intervention for topic: {{gdTopic}}. Role: {{role}}. Transcript: {{transcript}}',
    description: 'Evaluates leadership, active listening, turn-taking etiquette, and persuasive argument construction.'
  },
  'PROMPT_M05_PUBLIC_SPEAKING_01': {
    promptId: 'PROMPT_M05_PUBLIC_SPEAKING_01',
    activityId: 'act-m05-01',
    journeyId: 'journey-05',
    systemPromptIdentifier: 'SYSTEM_PUBLIC_SPEAKING_COACH_V1',
    userPromptTemplate: 'Analyze key note speech pitch and structure for speech: {{speechTitle}}. Transcript: {{transcript}}',
    description: 'Assesses rhetorical hooks, body language, vocal variety, and audience impact.'
  },
  'PROMPT_M06_PROFESSIONAL_WRITING_01': {
    promptId: 'PROMPT_M06_PROFESSIONAL_WRITING_01',
    activityId: 'act-m06-01',
    journeyId: 'journey-06',
    systemPromptIdentifier: 'SYSTEM_WRITING_DIAGNOSTIC_V1',
    userPromptTemplate: 'Evaluate technical writing sample for context: {{context}}. Draft: {{studentDraft}}',
    description: 'Analyzes clarity index, passive voice density, tone appropriateness, and conciseness.'
  },
  'PROMPT_M07_EMAIL_01': {
    promptId: 'PROMPT_M07_EMAIL_01',
    activityId: 'act-m07-01',
    journeyId: 'journey-07',
    systemPromptIdentifier: 'SYSTEM_EMAIL_ETIQUETTE_V1',
    userPromptTemplate: 'Evaluate corporate email draft for scenario: {{scenario}}. Subject: {{subject}}, Body: {{body}}',
    description: 'Checks subject line strength, salutation etiquette, CTA clarity, and professional tone.'
  },
  'PROMPT_M08_RESUME_01': {
    promptId: 'PROMPT_M08_RESUME_01',
    activityId: 'act-m08-01',
    journeyId: 'journey-08',
    systemPromptIdentifier: 'SYSTEM_RESUME_ATS_EVALUATOR_V1',
    userPromptTemplate: 'Analyze engineering resume bullet points for role: {{targetRole}}. Content: {{bulletPoints}}',
    description: 'Calculates ATS match score, action verb strength, quantifiable metric density, and format hygiene.'
  },
  'PROMPT_M09_READING_01': {
    promptId: 'PROMPT_M09_READING_01',
    activityId: 'act-m09-01',
    journeyId: 'journey-09',
    systemPromptIdentifier: 'SYSTEM_READING_ANALYTICS_V1',
    userPromptTemplate: 'Evaluate reading comprehension summary for passage: {{passageTitle}}. Summary: {{studentSummary}}',
    description: 'Assesses vocabulary mastery, central thesis identification, and critical synthesis.'
  },
  'PROMPT_M10_DEBATE_01': {
    promptId: 'PROMPT_M10_DEBATE_01',
    activityId: 'act-m10-01',
    journeyId: 'journey-10',
    systemPromptIdentifier: 'SYSTEM_DEBATE_JUDGE_V1',
    userPromptTemplate: 'Judge Oxford debate argument for motion: {{motion}}. Side: {{side}}. Argument: {{argumentText}}',
    description: 'Evaluates premise soundness, evidence backing, fallacy detection, and rebuttal force.'
  },
  'PROMPT_M11_REPORT_01': {
    promptId: 'PROMPT_M11_REPORT_01',
    activityId: 'act-m11-01',
    journeyId: 'journey-11',
    systemPromptIdentifier: 'SYSTEM_REPORT_WRITING_EVALUATOR_V1',
    userPromptTemplate: 'Analyze executive lab report draft for domain: {{domain}}. Report Text: {{reportText}}',
    description: 'Checks executive summary structure, methodology rigor, findings layout, and APA formatting.'
  },
  'PROMPT_M12_ETIQUETTE_01': {
    promptId: 'PROMPT_M12_ETIQUETTE_01',
    activityId: 'act-m12-01',
    journeyId: 'journey-12',
    systemPromptIdentifier: 'SYSTEM_BRANDING_COACH_V1',
    userPromptTemplate: 'Evaluate personal branding statement for engineering student: {{studentProfile}}. Statement: {{statement}}',
    description: 'Evaluates unique value proposition, LinkedIn headline impact, and professional presence.'
  }
};

export function getPromptMapping(promptId: string): PromptMapping | undefined {
  return PROMPT_MAPPINGS[promptId];
}
