import { AIEvaluationResult } from '../../types';

export interface InterviewCoachInput {
  questionTitle: string;
  category: 'HR' | 'Technical' | 'Behavioral' | 'Project';
  studentResponse: string;
  targetRole?: string; // e.g. "Software Development Engineer at Tech Campus"
}

export interface InterviewFeedback extends AIEvaluationResult {
  starMethodAnalysis: {
    situationPresent: boolean;
    taskPresent: boolean;
    actionPresent: boolean;
    resultPresent: boolean;
  };
  keywordsUsed: string[];
  missingEngineeringKeywords: string[];
}

/**
 * Placeholder service for future Gemini AI Interview Coach
 */
export async function evaluateInterviewResponse(
  input: InterviewCoachInput
): Promise<InterviewFeedback> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const wordCount = input.studentResponse.trim().split(/\s+/).length;
  const hasSTAR = wordCount > 40;

  return {
    score: hasSTAR ? 88 : 72,
    overallFeedback: `Your response to "${input.questionTitle}" demonstrates structured thinking. To elevate it for campus placement panels, emphasize measurable engineering outcomes (e.g., % efficiency gain, lines of code refactored, latency reduction).`,
    strengths: [
      'Logical flow and clear introduction',
      'Addressed the main question prompt directly',
      'Used professional engineering tone'
    ],
    improvements: [
      'Quantify the results achieved in the STAR framework',
      'Include technical terminology relevant to your engineering domain'
    ],
    starMethodAnalysis: {
      situationPresent: wordCount > 15,
      taskPresent: wordCount > 25,
      actionPresent: wordCount > 35,
      resultPresent: wordCount > 50
    },
    keywordsUsed: ['problem-solving', 'optimization', 'teamwork', 'testing', 'debugging'],
    missingEngineeringKeywords: ['throughput', 'scalability', 'root cause analysis', 'trade-offs'],
    metrics: {
      ResponseLength: `${wordCount} words`,
      STARCompliance: hasSTAR ? 'High (85%)' : 'Moderate (60%)',
      ConfidenceTone: 'Professional'
    },
    isSimulatedMode: true
  };
}
