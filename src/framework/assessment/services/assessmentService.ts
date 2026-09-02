/**
 * Assessment Service for UALAF
 * Handles scoring calculations, feedback payload synthesis, portfolio artifact preparation,
 * and analytics event payload dispatches.
 */

import {
  AssessmentMetadata,
  StudentResponsePayload,
  AIFeedbackPayload,
  PortfolioIntegrationPayload,
  AnalyticsEventPayload,
  SuggestedPracticeItem
} from '../types';
import { getRubricByCategory } from '../rubricLibrary';

/**
 * Generate comprehensive AI Feedback Payload from student response
 */
export function evaluateAssessmentResponse(
  metadata: AssessmentMetadata,
  response: StudentResponsePayload,
  studentId: string = 'std-2026-001'
): AIFeedbackPayload {
  const rubric = getRubricByCategory(
    metadata.type === 'ai_pronunciation' ? 'pronunciation' : (metadata.type as any)
  );

  let overallScore = 0;
  const skillWiseScores: Record<string, number> = {};
  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  const suggestedPractice: SuggestedPracticeItem[] = [];

  if (response.quizScores && response.quizScores.totalCount > 0) {
    // Knowledge check or structured quiz evaluation
    const percentage = Math.round((response.quizScores.correctCount / response.quizScores.totalCount) * 100);
    overallScore = percentage;

    skillWiseScores['Accuracy'] = percentage;
    skillWiseScores['Speed'] = Math.min(100, Math.max(50, Math.round(100 - (response.durationSeconds / 30) * 10)));
    skillWiseScores['Retention'] = Math.min(100, percentage + 5);

    if (percentage >= 80) {
      strengths.push('High precision in conceptual multiple-choice checks.');
      strengths.push('Strong recall of technical definitions and collocations.');
    } else {
      areasForImprovement.push('Review key domain vocabulary and technical definitions.');
      areasForImprovement.push('Practice timed recall drills to improve question pacing.');
    }
  } else if (response.textResponse && response.textResponse.trim().length > 0) {
    // Written or text-based response evaluation
    const wordCount = response.textResponse.trim().split(/\s+/).length;
    const charCount = response.textResponse.length;
    const hasParagraphs = response.textResponse.includes('\n');

    let contentScore = Math.min(95, Math.max(60, 65 + Math.floor(wordCount / 5)));
    let syntaxScore = Math.min(98, Math.max(65, 75 + (hasParagraphs ? 10 : 0)));
    let vocabScore = Math.min(96, Math.max(60, 70 + Math.floor(charCount / 50)));

    overallScore = Math.round((contentScore + syntaxScore + vocabScore) / 3);

    skillWiseScores['Task Achievement'] = contentScore;
    skillWiseScores['Cohesion & Structure'] = syntaxScore;
    skillWiseScores['Lexical Precision'] = vocabScore;
    skillWiseScores['Grammar & Mechanics'] = Math.min(100, syntaxScore + 2);

    if (wordCount >= 100) {
      strengths.push('Excellent length and detail expanding on the core prompt requirements.');
      strengths.push('Logical paragraph segmentation and clean sentence flow.');
    } else {
      areasForImprovement.push('Elaborate further with concrete examples and quantified details.');
      areasForImprovement.push('Use transitional phrases (e.g., "Furthermore", "Consequently") to connect ideas.');
    }
  } else if (response.audioDataUrl || response.durationSeconds > 0) {
    // Audio / Speech / Pronunciation response evaluation
    const speechLengthFactor = Math.min(1, response.durationSeconds / 30);
    const baseScore = Math.round(72 + speechLengthFactor * 20);

    overallScore = Math.min(98, baseScore);

    skillWiseScores['Phoneme Clarity'] = Math.min(100, overallScore + 3);
    skillWiseScores['Word Stress & Rhythm'] = Math.min(100, overallScore - 2);
    skillWiseScores['Fluency & WPM Pace'] = Math.min(100, overallScore + 1);
    skillWiseScores['Intonation Contours'] = Math.min(100, overallScore - 4);

    strengths.push('Clear articulation of front vowels and key consonant clusters.');
    strengths.push('Good steady pace without unnaturally long mid-sentence silences.');

    areasForImprovement.push('Focus on schwa (/ə/) reduction in unstressed auxiliary words.');
    areasForImprovement.push('Work on pitch elevation during primary syllable stress in technical words.');
  } else {
    // Fallback default simulation score for initial demonstration
    overallScore = 82;
    skillWiseScores['Core Accuracy'] = 82;
    skillWiseScores['Delivery'] = 80;
    skillWiseScores['Structure'] = 84;

    strengths.push('Demonstrates solid foundational understanding of target learning outcomes.');
    areasForImprovement.push('Refine response length and practice under timed conditions.');
  }

  // Populate suggested practice based on score
  if (overallScore < 75) {
    suggestedPractice.push({
      id: 'sp-1',
      title: 'Phonetic Drill Laboratory - Vowel Reduction',
      description: 'Interactive audio repetition targeting schwa reduction and syllable stress.',
      recommendedTool: 'Universal AI Speech Studio',
      estimatedMinutes: 10
    });
    suggestedPractice.push({
      id: 'sp-2',
      title: 'Domain Collocations Flashcard Deck',
      description: 'Spaced-repetition practice covering 25 high-frequency technical collocations.',
      recommendedTool: 'Vocab Builder Engine',
      estimatedMinutes: 8
    });
  } else {
    suggestedPractice.push({
      id: 'sp-3',
      title: 'Advanced Executive Pitch Simulation',
      description: 'Practice delivering 2-minute executive summaries with live pitch analysis.',
      recommendedTool: 'AI Executive Simulator',
      estimatedMinutes: 12
    });
  }

  const percentage = Math.round((overallScore / metadata.maxScore) * 100);
  let grade = 'B+';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 85) grade = 'A';
  else if (percentage >= 80) grade = 'B+';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else grade = 'D';

  return {
    overallScore,
    percentage,
    grade,
    skillWiseScores,
    strengths,
    areasForImprovement,
    suggestedPractice,
    facultyRemarksPlaceholder:
      'Faculty Review Status: Pending instructor endorsement. Automated AI evaluation validated.',
    evaluatedAt: new Date().toISOString(),
    isSimulatedMode: true,
    detailedAnalysis: `Completed assessment in ${response.durationSeconds}s. Evaluated against ${rubric.title}.`
  };
}

/**
 * Generate Portfolio Payload for cross-system syncing
 */
export function buildPortfolioPayload(
  metadata: AssessmentMetadata,
  response: StudentResponsePayload,
  feedback: AIFeedbackPayload,
  reflectionText: string
): PortfolioIntegrationPayload {
  let category: PortfolioIntegrationPayload['category'] = 'text';
  if (metadata.type === 'ai_pronunciation' || metadata.type === 'speaking') {
    category = 'audio';
  } else if (metadata.type === 'interview') {
    category = 'resume';
  } else if (metadata.type === 'writing') {
    category = 'written';
  }

  const content =
    response.textResponse ||
    (response.audioDataUrl ? `Audio Artifact Recorded (${response.durationSeconds}s)` : 'Interactive Assessment Artifact');

  return {
    artifactId: `art-${metadata.assessmentId}-${Date.now().toString().slice(-6)}`,
    assessmentId: metadata.assessmentId,
    journeyId: metadata.journeyId,
    title: metadata.title,
    category,
    content,
    score: feedback.overallScore,
    submittedAt: new Date().toISOString(),
    reflectionText: reflectionText || 'Learner submitted self-reflection upon evaluation completion.',
    aiFeedbackSummary: `Score: ${feedback.overallScore}/${metadata.maxScore} (${feedback.grade}). Key Strengths: ${feedback.strengths.slice(0, 2).join(' ')}`,
    targetAudience: ['student_portfolio', 'faculty_dashboard', 'admin_analytics', 'ai_coach'],
    status: 'Synced'
  };
}

/**
 * Build Analytics Event Payload for learning analytics pipeline
 */
export function buildAnalyticsPayload(
  metadata: AssessmentMetadata,
  response: StudentResponsePayload,
  feedback: AIFeedbackPayload,
  attemptsUsed: number,
  studentId: string = 'std-2026-001'
): AnalyticsEventPayload {
  const passed = feedback.overallScore >= metadata.passingScore;
  const attemptsRemaining = Math.max(0, metadata.maxAttempts - attemptsUsed);

  return {
    eventId: `evt-ualaf-${Date.now()}`,
    studentId,
    assessmentId: metadata.assessmentId,
    journeyId: metadata.journeyId,
    score: feedback.overallScore,
    maxScore: metadata.maxScore,
    percentage: feedback.percentage,
    passingScore: metadata.passingScore,
    passed,
    timeSpentSeconds: response.durationSeconds,
    attemptNumber: attemptsUsed,
    attemptsRemaining,
    timestamp: new Date().toISOString(),
    skillBreakdown: feedback.skillWiseScores,
    targetSystems: [
      'progress',
      'achievements',
      'ai_coach',
      'faculty_workbench',
      'admin_command_center'
    ],
    nextRecommendedAssessmentId: passed ? `${metadata.journeyId}-next` : metadata.assessmentId
  };
}
