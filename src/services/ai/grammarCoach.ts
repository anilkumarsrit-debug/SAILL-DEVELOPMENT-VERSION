import { AIEvaluationResult } from '../../types';

export interface GrammarCheckInput {
  text: string;
  contextType: 'Email' | 'Report' | 'Essay' | 'Resume' | 'General';
}

export interface GrammarIssue {
  originalText: string;
  suggestedFix: string;
  explanation: string;
  category: 'Spelling' | 'Punctuation' | 'Subject-Verb Agreement' | 'Vocabulary Choice' | 'Tone';
}

export interface GrammarFeedback extends AIEvaluationResult {
  issuesFound: GrammarIssue[];
  readabilityGradeLevel: string;
  formalityScorePercent: number;
}

/**
 * Placeholder service for future Gemini AI Grammar Coach
 */
export async function checkGrammarAndTone(
  input: GrammarCheckInput
): Promise<GrammarFeedback> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const textLength = input.text.length;
  const isFormalityHigh = input.contextType === 'Email' || input.contextType === 'Report';

  return {
    score: textLength > 20 ? 91 : 75,
    overallFeedback: `Grammar and sentence structure are well-aligned with ${input.contextType} standards. Minor vocabulary refinements suggested for maximum impact.`,
    strengths: [
      'Proper capitalization and sentence punctuation',
      'Consistent verb tenses throughout the paragraph',
      'Clear subject-verb coordination'
    ],
    improvements: [
      'Replace informal phrasing with industry-standard technical vocabulary',
      'Avoid passive voice in executive summary sections'
    ],
    issuesFound: [
      {
        originalText: 'thanks for taking time',
        suggestedFix: 'Thank you for taking the time',
        explanation: 'Formal emails require complete grammatical structures.',
        category: 'Tone'
      }
    ],
    readabilityGradeLevel: 'Grade 12 (Engineering Undergraduate Level)',
    formalityScorePercent: isFormalityHigh ? 92 : 84,
    metrics: {
      GrammarErrors: '1 minor suggestion',
      VocabularyRichness: 'High (88%)',
      PassiveVoiceCount: '0'
    },
    isSimulatedMode: true
  };
}
