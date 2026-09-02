/**
 * SAILL Enterprise AI Platform - Response Validator
 *
 * Validates, cleans, and backfills JSON objects returned from AI providers.
 */

import { AIValidationResult } from './types';

export class ResponseValidator {
  /**
   * Clamps numbers to range [min, max]
   */
  private static clamp(value: number, min: number = 0, max: number = 100): number {
    if (typeof value !== 'number' || isNaN(value)) return min;
    return Math.min(max, Math.max(min, Math.round(value)));
  }

  /**
   * Sanitizes string values to prevent script injection
   */
  private static sanitizeString(str: any, fallback: string = ''): string {
    if (typeof str !== 'string') return fallback;
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();
  }

  /**
   * Ensures value is a valid non-empty string array
   */
  private static sanitizeArray(arr: any, fallbackDefaults: string[] = []): string[] {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [...fallbackDefaults];
    }
    return arr.map((item) => this.sanitizeString(item)).filter(Boolean);
  }

  /**
   * Validates Pronunciation Evaluation Response Payload
   */
  public static validatePronunciationResponse(data: any): AIValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Invalid or empty AI response payload'],
        warnings: [],
        sanitizedData: this.getFallbackPronunciationData()
      };
    }

    const scoresObj = data.scores || {};
    const sanitizedScores = {
      pronunciation: this.clamp(scoresObj.pronunciation, 0, 25),
      wordStress: this.clamp(scoresObj.wordStress, 0, 20),
      syllables: this.clamp(scoresObj.syllables, 0, 10),
      vowels: this.clamp(scoresObj.vowels, 0, 10),
      consonants: this.clamp(scoresObj.consonants, 0, 10),
      fluency: this.clamp(scoresObj.fluency, 0, 10),
      clarity: this.clamp(scoresObj.clarity, 0, 5),
      pace: this.clamp(scoresObj.pace, 0, 5),
      confidence: this.clamp(scoresObj.confidence, 0, 3),
      naturalness: this.clamp(scoresObj.naturalness, 0, 2)
    };

    const calculatedSum = Object.values(sanitizedScores).reduce((a, b) => a + b, 0);
    const overallScore = typeof data.overallScore === 'number' ? this.clamp(data.overallScore, 0, 100) : calculatedSum;

    const grade = this.sanitizeString(data.grade, overallScore >= 85 ? 'B+' : 'C');
    const strengths = this.sanitizeArray(data.strengths, [
      'Clear articulation on primary vowels',
      'Good baseline speaking fluency'
    ]);
    const improvements = this.sanitizeArray(data.improvements || data.weakAreas, [
      'Practice syllable stress contrast on multi-syllable words'
    ]);
    const practiceWords = this.sanitizeArray(data.practiceWords, [
      'Presentation', 'Responsibility', 'Opportunity'
    ]);
    const practiceTime = this.sanitizeString(data.practiceTime, '10 minutes');
    const motivation = this.sanitizeString(data.motivation, 'Great effort! Daily practice builds confident communication.');

    const sanitizedData = {
      overallScore,
      grade,
      scores: sanitizedScores,
      strengths,
      improvements,
      practiceWords,
      practiceTime,
      motivation
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData
    };
  }

  /**
   * Validates AI Coach Guidance Payload
   */
  public static validateCoachGuidanceResponse(data: any): AIValidationResult {
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Invalid coach response payload'],
        warnings: [],
        sanitizedData: this.getFallbackCoachData()
      };
    }

    const sanitizedData = {
      learningProfile: data.learningProfile || {
        pronunciation: 'Very Good',
        wordStress: 'Good',
        syllableAccuracy: 'Very Good',
        vowelAccuracy: 'Good',
        consonantAccuracy: 'Good',
        fluency: 'Very Good',
        clarity: 'Good',
        speakingPace: 'Good',
        confidence: 'Good'
      },
      coachMessage: this.sanitizeString(data.coachMessage, 'Focus on consistent daily syllable stress practice to enhance spoken clarity.'),
      strengths: this.sanitizeArray(data.strengths, ['Good articulation', 'Steady pace']),
      weakAreas: this.sanitizeArray(data.weakAreas, ['Refine secondary syllable stress']),
      todayLearningPlan: {
        practiceFocus: this.sanitizeString(data.todayLearningPlan?.practiceFocus, 'Syllable Stress Precision'),
        recommendedRule: this.sanitizeString(data.todayLearningPlan?.recommendedRule, 'Primary stress precedes suffix -tion in academic nouns.'),
        suggestedPracticeWords: this.sanitizeArray(data.todayLearningPlan?.suggestedPracticeWords, ['Presentation', 'Organization', 'Conversation']),
        estimatedPracticeTime: this.sanitizeString(data.todayLearningPlan?.estimatedPracticeTime, '10 minutes'),
        expectedLearningOutcome: this.sanitizeString(data.todayLearningPlan?.expectedLearningOutcome, 'Master natural word stress contrast.')
      },
      smartRecommendations: this.sanitizeArray(data.smartRecommendations, ['Presentation', 'Organization']),
      estimatedPracticeTime: this.sanitizeString(data.estimatedPracticeTime, '10 minutes'),
      motivationalMessage: this.sanitizeString(data.motivationalMessage, 'Small daily steps build lifelong confidence.'),
      suggestedNextActivity: this.sanitizeString(data.suggestedNextActivity, 'Level 3 Guided Practice')
    };

    return {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedData
    };
  }

  /**
   * Validates General AI Evaluation Response
   */
  public static validateGeneralEvaluationResponse(data: any): AIValidationResult {
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Invalid general evaluation response'],
        warnings: [],
        sanitizedData: {
          score: 75,
          overallFeedback: 'Submission evaluated successfully. Continue practicing to refine performance.',
          strengths: ['Clear structure', 'Relevant vocabulary'],
          suggestions: ['Enhance transitional phrases between points'],
          guidedImprovement: {
            title: 'Targeted Practice Exercise',
            exerciseText: 'Review your submission and apply active voice.',
            actionSteps: ['Identify key verbs', 'Convert passive phrasing']
          },
          metrics: { accuracy: 78, clarity: 80, relevance: 82, structure: 75 }
        }
      };
    }

    const sanitizedData = {
      score: this.clamp(data.score, 0, 100),
      overallFeedback: this.sanitizeString(data.overallFeedback, 'Evaluation complete.'),
      strengths: this.sanitizeArray(data.strengths, ['Good technical focus']),
      suggestions: this.sanitizeArray(data.suggestions, ['Refine sentence transitions']),
      guidedImprovement: {
        title: this.sanitizeString(data.guidedImprovement?.title, 'Guided Practice'),
        exerciseText: this.sanitizeString(data.guidedImprovement?.exerciseText, 'Practice key vocabulary in context.'),
        actionSteps: this.sanitizeArray(data.guidedImprovement?.actionSteps, ['Review feedback', 'Practice aloud'])
      },
      metrics: {
        accuracy: this.clamp(data.metrics?.accuracy, 0, 100),
        clarity: this.clamp(data.metrics?.clarity, 0, 100),
        relevance: this.clamp(data.metrics?.relevance, 0, 100),
        structure: this.clamp(data.metrics?.structure, 0, 100)
      },
      correctedText: data.correctedText ? this.sanitizeString(data.correctedText) : undefined
    };

    return {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedData
    };
  }

  private static getFallbackPronunciationData() {
    return {
      overallScore: 89,
      grade: 'B+',
      scores: {
        pronunciation: 22,
        wordStress: 18,
        syllables: 9,
        vowels: 9,
        consonants: 9,
        fluency: 9,
        clarity: 4,
        pace: 4,
        confidence: 3,
        naturalness: 2
      },
      strengths: ['Clear pronunciation on key stressed vowels', 'Steady speaking pace'],
      improvements: ['Increase stress contrast on secondary syllables'],
      practiceWords: ['Presentation', 'Responsibility', 'Opportunity'],
      practiceTime: '10 minutes',
      motivation: 'Great effort! Daily practice leads to confident communication.'
    };
  }

  private static getFallbackCoachData() {
    return {
      learningProfile: {
        pronunciation: 'Very Good',
        wordStress: 'Good',
        syllableAccuracy: 'Very Good',
        vowelAccuracy: 'Good',
        consonantAccuracy: 'Good',
        fluency: 'Very Good',
        clarity: 'Good',
        speakingPace: 'Good',
        confidence: 'Good'
      },
      coachMessage: 'Your performance demonstrates good foundation in spoken clarity.',
      strengths: ['Clear articulation', 'Steady pace'],
      weakAreas: ['Syllable stress placement'],
      todayLearningPlan: {
        practiceFocus: 'Syllable Stress Precision',
        recommendedRule: 'Primary stress precedes suffix -tion in academic nouns.',
        suggestedPracticeWords: ['Presentation', 'Organization', 'Conversation'],
        estimatedPracticeTime: '10 minutes',
        expectedLearningOutcome: 'Master natural word stress contrast.'
      },
      smartRecommendations: ['Presentation', 'Organization'],
      estimatedPracticeTime: '10 minutes',
      motivationalMessage: 'Keep up the daily practice!',
      suggestedNextActivity: 'Level 3 Guided Practice'
    };
  }
}
