/**
 * Assessment Engine Orchestrator for UALAF
 * Executes the 9-step universal assessment workflow state machine across all 12 learning journeys.
 */

import React, { useState, useEffect } from 'react';
import { AssessmentSessionState, WorkflowStepId, AssessmentMetadata } from './types';
import { getAssessmentMetadata } from './metadata';
import {
  evaluateAssessmentResponse,
  buildPortfolioPayload,
  buildAnalyticsPayload
} from './services/assessmentService';
import { UniversalAssessmentLayout } from './components/UniversalAssessmentLayout';

interface AssessmentEngineProps {
  assessmentIdOrKey?: string;
  customMetadata?: AssessmentMetadata;
  onAssessmentCompleted?: (results: {
    score: number;
    passed: boolean;
    portfolioId: string;
    eventId: string;
  }) => void;
  onExit?: () => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  assessmentIdOrKey = 'j01-a1',
  customMetadata,
  onAssessmentCompleted,
  onExit
}) => {
  const metadata = customMetadata || getAssessmentMetadata(assessmentIdOrKey);

  // Core Session State Machine
  const [sessionState, setSessionState] = useState<AssessmentSessionState>({
    metadata,
    currentStep: 'instructions',
    stepNumber: 1,
    attemptsUsed: 1,
    attemptsRemaining: metadata.maxAttempts,
    timerSecondsElapsed: 0,
    isTimerRunning: false,
    studentResponse: {
      durationSeconds: 0,
      submittedAt: ''
    },
    reflectionText: ''
  });

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (sessionState.isTimerRunning) {
      interval = setInterval(() => {
        setSessionState((prev) => ({
          ...prev,
          timerSecondsElapsed: prev.timerSecondsElapsed + 1
        }));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionState.isTimerRunning]);

  // Handler: Start Attempt
  const handleStartAttempt = () => {
    setSessionState((prev) => ({
      ...prev,
      currentStep: 'attempt',
      stepNumber: 2,
      isTimerRunning: true
    }));
  };

  // Handler: Text Input Update
  const handleTextChange = (text: string) => {
    setSessionState((prev) => ({
      ...prev,
      studentResponse: {
        ...prev.studentResponse,
        textResponse: text
      }
    }));
  };

  // Handler: Audio Recorded
  const handleAudioRecorded = (audioUrl: string) => {
    setSessionState((prev) => ({
      ...prev,
      studentResponse: {
        ...prev.studentResponse,
        audioDataUrl: audioUrl
      }
    }));
  };

  // Handler: Quiz Option Selected
  const handleQuizOptionSelect = (questionId: string, optionId: string) => {
    setSessionState((prev) => {
      const answers = { ...(prev.studentResponse.selectedAnswers || {}), [questionId]: optionId };
      const correctCount = optionId === 'opt-a' ? 1 : 0;
      return {
        ...prev,
        studentResponse: {
          ...prev.studentResponse,
          selectedAnswers: answers,
          quizScores: { correctCount, totalCount: 1 }
        }
      };
    });
  };

  // Handler: Reset / Retry Attempt
  const handleRetryAttempt = () => {
    setSessionState((prev) => {
      const nextUsed = prev.attemptsUsed + 1;
      const nextRemaining = Math.max(0, metadata.maxAttempts - nextUsed + 1);
      return {
        ...prev,
        currentStep: 'attempt',
        stepNumber: 2,
        attemptsUsed: nextUsed,
        attemptsRemaining: nextRemaining,
        studentResponse: {
          durationSeconds: 0,
          submittedAt: ''
        },
        aiFeedback: undefined
      };
    });
  };

  // Handler: Submit Attempt (Triggers Evaluation & AI Feedback Synthesis)
  const handleSubmitAttempt = () => {
    const finalDuration = sessionState.timerSecondsElapsed;
    const finalResponse = {
      ...sessionState.studentResponse,
      durationSeconds: finalDuration,
      submittedAt: new Date().toISOString()
    };

    // Calculate AI Feedback
    const feedback = evaluateAssessmentResponse(metadata, finalResponse);

    setSessionState((prev) => ({
      ...prev,
      currentStep: 'feedback',
      stepNumber: 5,
      isTimerRunning: false,
      studentResponse: finalResponse,
      aiFeedback: feedback
    }));
  };

  // Handler: Proceed to Learner Reflection
  const handleProceedToReflection = () => {
    setSessionState((prev) => ({
      ...prev,
      currentStep: 'reflection',
      stepNumber: 6
    }));
  };

  // Handler: Complete Reflection (Triggers Portfolio & Analytics Sync)
  const handleCompleteReflection = (reflectionText: string) => {
    if (!sessionState.aiFeedback) return;

    const portfolioPayload = buildPortfolioPayload(
      metadata,
      sessionState.studentResponse,
      sessionState.aiFeedback,
      reflectionText
    );

    const analyticsPayload = buildAnalyticsPayload(
      metadata,
      sessionState.studentResponse,
      sessionState.aiFeedback,
      sessionState.attemptsUsed
    );

    setSessionState((prev) => ({
      ...prev,
      currentStep: 'next_recommendation',
      stepNumber: 9,
      reflectionText,
      portfolioPayload,
      analyticsPayload
    }));

    if (onAssessmentCompleted) {
      onAssessmentCompleted({
        score: sessionState.aiFeedback.overallScore,
        passed: sessionState.aiFeedback.overallScore >= metadata.passingScore,
        portfolioId: portfolioPayload.artifactId,
        eventId: analyticsPayload.eventId
      });
    }
  };

  // Handler: Finish Assessment & Return
  const handleFinishAssessment = () => {
    if (onExit) {
      onExit();
    }
  };

  return (
    <UniversalAssessmentLayout
      state={sessionState}
      onStartAttempt={handleStartAttempt}
      onTextChange={handleTextChange}
      onAudioRecorded={handleAudioRecorded}
      onQuizOptionSelect={handleQuizOptionSelect}
      onSubmitAttempt={handleSubmitAttempt}
      onRetryAttempt={handleRetryAttempt}
      onProceedToReflection={handleProceedToReflection}
      onCompleteReflection={handleCompleteReflection}
      onFinishAssessment={handleFinishAssessment}
    />
  );
};
