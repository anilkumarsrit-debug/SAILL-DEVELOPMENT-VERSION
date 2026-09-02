/**
 * SAILL - SRIT AI Language Laboratory
 * AI Learning Coach & Adaptive Practice Service
 *
 * Routes through the central SAILL Enterprise AI Platform Orchestrator.
 */

import {
  AICoachRequest,
  AICoachGuidance,
  AchievementBadge
} from '../types/aiCoach';
import { aiOrchestrator } from './ai/AIOrchestrator';

export class AICoachService {
  /**
   * Generates achievement badges based on student attempt history and scores.
   */
  public static calculateBadges(request: AICoachRequest): AchievementBadge[] {
    const { latestResult, history } = request;
    const score = latestResult?.overallScore || 0;
    const wordStress = latestResult?.scores?.wordStress || 0;
    const fluency = latestResult?.scores?.fluency || 0;
    const attemptCount = history?.attempts?.length || 1;

    return [
      {
        id: 'badge-beginner',
        title: 'Pronunciation Beginner',
        description: 'Completed first speech evaluation in SAILL Laboratory',
        iconName: 'Award',
        unlocked: attemptCount >= 1 || score >= 50,
        level: 'Bronze'
      },
      {
        id: 'badge-explorer',
        title: 'Pronunciation Explorer',
        description: 'Completed multiple practice attempts or scored above 75%',
        iconName: 'Compass',
        unlocked: attemptCount >= 2 || score >= 75,
        level: 'Silver'
      },
      {
        id: 'badge-expert',
        title: 'Pronunciation Expert',
        description: 'Achieved an overall pronunciation score of 85+ out of 100',
        iconName: 'Star',
        unlocked: score >= 85,
        level: 'Gold'
      },
      {
        id: 'badge-accent-master',
        title: 'Accent Master',
        description: 'Mastered syllable stress & accent rules (17+ in Word Stress)',
        iconName: 'Zap',
        unlocked: wordStress >= 17,
        level: 'Platinum'
      },
      {
        id: 'badge-champion',
        title: 'Communication Champion',
        description: 'Outstanding spoken communication (90+ overall or 9+ fluency)',
        iconName: 'Trophy',
        unlocked: score >= 90 || fluency >= 9,
        level: 'Diamond'
      }
    ];
  }

  /**
   * Generates AI Coach Guidance for a student session.
   */
  public static async generateGuidance(request: AICoachRequest): Promise<AICoachGuidance> {
    const badges = this.calculateBadges(request);

    try {
      const guidance = await aiOrchestrator.generateCoachGuidance({
        requestType: 'COACHING',
        latestResult: request.latestResult,
        history: request.history,
        activityType: request.activityType,
        targetText: request.targetText
      });

      return {
        ...guidance,
        badges
      };
    } catch (err) {
      console.warn('AI Orchestrator coach guidance fallback triggered:', err);
      // Orchestrator already handles failover to rule-based FallbackProvider
      throw err;
    }
  }
}
