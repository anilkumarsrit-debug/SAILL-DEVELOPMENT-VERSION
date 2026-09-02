/**
 * SAILL - SRIT AI Language Laboratory
 * Gemini AI Prompts for AI Learning Coach & Adaptive Practice Engine
 */

import { AICoachRequest } from '../../types/aiCoach';

export const getAICoachSystemInstruction = (): string => {
  return `You are the SAILL (SRIT AI Language Laboratory) Senior AI Speech & Communication Coach and Adaptive Practice Director.
Your role is to analyze student pronunciation assessment data and generate constructive, encouraging, personalized learning guidance.

GUIDELINES:
1. ALWAYS maintain a supportive, constructive, and highly encouraging tone. Never use discouraging language.
2. Evaluate score breakdowns across 9 skill metrics and classify each into:
   - "Excellent": score >= 90% of max criteria weight
   - "Very Good": score >= 75% of max criteria weight
   - "Good": score >= 60% of max criteria weight
   - "Needs Improvement": score < 60% of max criteria weight

3. Generate a personalized AI Coach Message that specifically references their strengths and performance trends (e.g., "Your pronunciation is improving steadily...", "You are placing stress correctly on key syllables...").
4. Formulate Today's Learning Plan targeting their specific weak areas (e.g. if word stress is weak, recommend word stress rules and practice words like "Organization", "Responsibility", "Opportunity").
5. Provide 3 to 5 smart practice recommendations (words or phrases) tailored directly to address their lowest-scoring metrics.
6. Provide a concise motivational message (e.g., "Excellent effort! Small improvements every day lead to confident communication.").
7. Suggest the next logical activity or lesson module.

Return ONLY a valid JSON object matching the requested schema. No markdown wrapping (\`\`\`json), no preamble. Return JSON ONLY.`;
};

export const buildAICoachPrompt = (request: AICoachRequest): string => {
  const { latestResult, history, activityType = 'WORD', targetText = 'Communication' } = request;

  const scoreData = (latestResult.scores || {}) as Record<string, number>;
  const attemptsCount = history?.attempts.length || 1;
  const bestScore = history?.bestScore || latestResult.overallScore;

  return `Analyze the following student assessment data and generate personalized AI Coach Guidance:

TARGET TEXT: "${targetText}"
ACTIVITY TYPE: ${activityType}
OVERALL SCORE: ${latestResult.overallScore}/100 (Grade: ${latestResult.grade})
SESSION ATTEMPTS: ${attemptsCount} (Best Score: ${bestScore})

SCORE BREAKDOWN (Raw Points / Criteria Max):
- Pronunciation Accuracy: ${scoreData.pronunciation || 0}/25
- Word Stress: ${scoreData.wordStress || 0}/20
- Syllable Accuracy: ${scoreData.syllables || 0}/10
- Vowel Accuracy: ${scoreData.vowels || 0}/10
- Consonant Accuracy: ${scoreData.consonants || 0}/10
- Fluency: ${scoreData.fluency || 0}/10
- Clarity: ${scoreData.clarity || 0}/5
- Speaking Pace: ${scoreData.pace || 0}/5
- Confidence: ${scoreData.confidence || 0}/3
- Overall Naturalness: ${scoreData.naturalness || 0}/2

STRENGTHS IDENTIFIED:
${latestResult.strengths?.join('; ') || 'Good overall articulation'}

AREAS FOR IMPROVEMENT:
${latestResult.improvements?.join('; ') || 'Refine syllable stress'}

Generate JSON matching this exact structure:
{
  "learningProfile": {
    "pronunciation": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "wordStress": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "syllableAccuracy": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "vowelAccuracy": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "consonantAccuracy": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "fluency": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "clarity": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "speakingPace": "Excellent" | "Very Good" | "Good" | "Needs Improvement",
    "confidence": "Excellent" | "Very Good" | "Good" | "Needs Improvement"
  },
  "coachMessage": string,
  "strengths": [string],
  "weakAreas": [string],
  "todayLearningPlan": {
    "practiceFocus": string,
    "recommendedRule": string,
    "suggestedPracticeWords": [string],
    "estimatedPracticeTime": string,
    "expectedLearningOutcome": string
  },
  "smartRecommendations": [string],
  "estimatedPracticeTime": string,
  "motivationalMessage": string,
  "suggestedNextActivity": string
}`;
};
