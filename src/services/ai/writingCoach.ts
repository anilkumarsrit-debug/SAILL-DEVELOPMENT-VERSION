import { AIEvaluationResult } from '../../types';

export type WritingDocumentType =
  | 'Professional Email'
  | 'Formal Letter'
  | 'Workplace Communication'
  | 'Meeting Minutes'
  | 'Technical Report'
  | 'Engineering Resume'
  | 'LinkedIn Profile'
  | 'Statement of Purpose'
  | 'Project Abstract'
  | 'General Writing';

export interface WritingCoachInput {
  documentType: WritingDocumentType;
  content: string;
  titleOrSubject?: string;
  recipientOrRole?: string;
  scenarioTask?: string;
  extraData?: Record<string, any>;
}

export interface Writing10MarkRubric {
  contentStructure: number;     // max 2.0
  vocabularyActionVerbs: number; // max 2.0
  grammarMechanics: number;      // max 2.0
  toneProfessionalism: number;   // max 2.0
  clarityConciseness: number;    // max 2.0
}

export interface WritingFeedback extends AIEvaluationResult {
  score10: number; // 0.0 - 10.0
  performanceLevel: '10 - Outstanding' | '9 - Excellent' | '8 - Very Good' | '7 - Good' | '6 - Satisfactory' | '5 - Needs Improvement' | 'Below 5 - Practice Required';
  rubric: Writing10MarkRubric;
  structureRating: number; // 0 - 100
  atsCompatibilityPercent?: number;
  keywordScorePercent?: number;
  suggestedActionVerbs: string[];
  improvedVersion?: string;
  sectionFeedback?: Record<string, string>;
}

/**
 * Evaluate document using SAILL 10-Mark Framework
 */
export async function evaluateDocument(
  input: WritingCoachInput
): Promise<WritingFeedback> {
  // Simulate intelligent analysis delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const words = input.content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Basic heuristic analysis
  const hasActionVerbs = /(developed|engineered|implemented|designed|built|optimized|spearheaded|formulated|executed|analyzed|configured|automated|created|managed|led)/i.test(input.content);
  const hasSalutation = /(dear|respected|sincerely|regards|thank you|best regards)/i.test(input.content);
  const isTooShort = wordCount < 20;

  // Rubric calculation (out of 2.0 each)
  let contentStructure = isTooShort ? 1.0 : 1.8;
  let vocabularyActionVerbs = hasActionVerbs ? 1.9 : 1.4;
  let grammarMechanics = 1.8;
  let toneProfessionalism = hasSalutation || input.documentType === 'Technical Report' ? 1.9 : 1.5;
  let clarityConciseness = wordCount > 1000 ? 1.4 : 1.8;

  if (input.titleOrSubject && input.titleOrSubject.length > 5) {
    contentStructure = Math.min(2.0, contentStructure + 0.2);
  }

  const total10 = parseFloat((contentStructure + vocabularyActionVerbs + grammarMechanics + toneProfessionalism + clarityConciseness).toFixed(1));

  let performanceLevel: WritingFeedback['performanceLevel'] = '8 - Very Good';
  if (total10 >= 9.5) performanceLevel = '10 - Outstanding';
  else if (total10 >= 8.8) performanceLevel = '9 - Excellent';
  else if (total10 >= 7.8) performanceLevel = '8 - Very Good';
  else if (total10 >= 6.8) performanceLevel = '7 - Good';
  else if (total10 >= 5.8) performanceLevel = '6 - Satisfactory';
  else if (total10 >= 4.8) performanceLevel = '5 - Needs Improvement';
  else performanceLevel = 'Below 5 - Practice Required';

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasActionVerbs) {
    strengths.push('Effective use of strong engineering action verbs and technical vocabulary.');
  } else {
    improvements.push('Incorporate strong active verbs (e.g. Engineered, Designed, Optimized, Formulated).');
  }

  if (wordCount >= 30) {
    strengths.push(`Good depth of content (${wordCount} words) maintaining professional relevance.`);
  } else {
    improvements.push('Expand your draft with more contextual details and technical impact metrics.');
  }

  if (input.titleOrSubject) {
    strengths.push('Clear, actionable subject line/title provided.');
  } else if (input.documentType === 'Professional Email' || input.documentType === 'Formal Letter') {
    improvements.push('Ensure subject line explicitly indicates the core purpose or request.');
  }

  strengths.push('Maintained formal workplace tone and structured paragraph flow.');
  improvements.push('Proofread for crisp sentence transitions and eliminate passive phrasing.');

  const suggestedVerbs = ['Engineered', 'Optimized', 'Spearheaded', 'Implemented', 'Diagnosed', 'Automated', 'Formulated', 'Streamlined'];

  // Generate improved version preview
  let improvedVersion = input.content;
  if (input.documentType === 'Professional Email') {
    improvedVersion = `Subject: ${input.titleOrSubject || '[Request] Official Correspondence'}\n\nDear ${input.recipientOrRole || 'HOD / Professor'},\n\nI am writing to formally present this matter regarding ${input.scenarioTask || 'academic affairs'}.\n\n${input.content}\n\nThank you for your time and consideration. I look forward to your guidance.\n\nSincerely,\nFirst-Year Student\nSRIT Engineering College`;
  } else if (input.documentType === 'Engineering Resume') {
    improvedVersion = `${input.content}\n\n[AI Recommendation: Quantify achievement metrics by adding percentage improvements, user counts, or lab efficiency results.]`;
  }

  return {
    score: Math.round(total10 * 10), // 100-point scale equivalent
    score10: total10,
    performanceLevel,
    rubric: {
      contentStructure: parseFloat(contentStructure.toFixed(1)),
      vocabularyActionVerbs: parseFloat(vocabularyActionVerbs.toFixed(1)),
      grammarMechanics: parseFloat(grammarMechanics.toFixed(1)),
      toneProfessionalism: parseFloat(toneProfessionalism.toFixed(1)),
      clarityConciseness: parseFloat(clarityConciseness.toFixed(1))
    },
    overallFeedback: `Your ${input.documentType} demonstrates ${performanceLevel.toLowerCase()} quality. The content is well-aligned with corporate and academic engineering communication standards.`,
    strengths,
    improvements,
    structureRating: Math.round(contentStructure * 50),
    atsCompatibilityPercent: input.documentType === 'Engineering Resume' ? 92 : undefined,
    keywordScorePercent: 88,
    suggestedActionVerbs: suggestedVerbs,
    improvedVersion,
    metrics: {
      'Word Count': `${wordCount} words`,
      'Readability Grade': 'College / Technical',
      'Tone Metric': 'Formal & Professional',
      'SAILL Score': `${total10} / 10`
    },
    isSimulatedMode: true
  };
}
