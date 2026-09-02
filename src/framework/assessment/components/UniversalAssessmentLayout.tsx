/**
 * Universal Assessment Layout Component for UALAF
 * Reusable wrapper rendering current step content, questions, inputs, and accessible control bar.
 */

import React from 'react';
import {
  HelpCircle,
  Play,
  RotateCcw,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AssessmentHeader } from './AssessmentHeader';
import { AIFeedbackCard } from './AIFeedbackCard';
import { ReflectionPortfolioStep } from './ReflectionPortfolioStep';
import { AssessmentSessionState } from '../types';
import { UniversalRecorder } from '../../../components/laboratory/UniversalRecorder';

interface UniversalAssessmentLayoutProps {
  state: AssessmentSessionState;
  onStartAttempt: () => void;
  onTextChange: (text: string) => void;
  onAudioRecorded: (audioDataUrl: string) => void;
  onQuizOptionSelect: (questionId: string, optionId: string) => void;
  onSubmitAttempt: () => void;
  onRetryAttempt: () => void;
  onProceedToReflection: () => void;
  onCompleteReflection: (reflectionText: string) => void;
  onFinishAssessment: () => void;
}

export const UniversalAssessmentLayout: React.FC<UniversalAssessmentLayoutProps> = ({
  state,
  onStartAttempt,
  onTextChange,
  onAudioRecorded,
  onQuizOptionSelect,
  onSubmitAttempt,
  onRetryAttempt,
  onProceedToReflection,
  onCompleteReflection,
  onFinishAssessment
}) => {
  const { metadata, stepNumber, attemptsRemaining, studentResponse, aiFeedback } = state;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="ualaf-universal-assessment-layout">
      {/* 1. Assessment Header Bar */}
      <AssessmentHeader
        metadata={metadata}
        currentStep={state.currentStep}
        stepNumber={stepNumber}
        attemptsUsed={state.attemptsUsed}
        attemptsRemaining={attemptsRemaining}
        timerSecondsElapsed={state.timerSecondsElapsed}
      />

      {/* 2. Main Content Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8" id="ualaf-main-content">
        {/* STEP 1: INSTRUCTIONS VIEW */}
        {stepNumber === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
                <BookOpen className="w-3.5 h-3.5 mr-1" />
                Assessment Instructions & Prerequisites
              </div>
              <h2 className="text-xl font-bold text-slate-900">{metadata.title}</h2>
              <p className="text-sm text-slate-600 mt-1">
                Estimated duration: <span className="font-semibold text-slate-800">{metadata.estimatedTimeMinutes} minutes</span> • Passing threshold: <span className="font-semibold text-slate-800">{metadata.passingScore}%</span>
              </p>
            </div>

            {/* Instructions List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Candidate Guidelines:</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {metadata.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Target Skills & Outcomes:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {metadata.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2 text-xs font-medium text-indigo-950">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={onStartAttempt}
                className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Start Assessment Attempt"
              >
                Begin Assessment Attempt
                <Play className="w-4 h-4 ml-2 fill-current" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 & 3: ATTEMPT & RESPONSE INPUT AREA */}
        {(stepNumber === 2 || stepNumber === 3) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start gap-4">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  <PenTool className="w-3.5 h-3.5 mr-1" />
                  Active Assessment Task • Attempt {state.attemptsUsed}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{metadata.title}</h2>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Prompt ID: {metadata.promptId}
              </span>
            </div>

            {/* Task Prompt Area depending on Assessment Type */}
            {metadata.type === 'ai_pronunciation' || metadata.type === 'speaking' || metadata.type === 'interview' ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Target Speaking Prompt</div>
                  <p className="text-base font-medium leading-relaxed">
                    &quot;Please deliver your response clearly into the microphone. Focus on distinct phoneme articulation, natural sentence stress, and steady speech cadence.&quot;
                  </p>
                </div>

                {/* Universal Audio Recorder Component */}
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center">
                    <Mic className="w-4 h-4 text-emerald-600 mr-2" />
                    Audio Recording Controls
                  </h3>
                  <UniversalRecorder
                    onRecordingComplete={(blob) => {
                      const audioUrl = URL.createObjectURL(blob);
                      onAudioRecorded(audioUrl);
                    }}
                  />
                  {studentResponse.audioDataUrl && (
                    <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Audio recording captured successfully! Ready for AI submission.
                    </div>
                  )}
                </div>
              </div>
            ) : metadata.type === 'writing' ? (
              <div className="space-y-4">
                <label htmlFor="ualaf-writing-input" className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Written Response Area:
                </label>
                <textarea
                  id="ualaf-writing-input"
                  rows={8}
                  value={studentResponse.textResponse || ''}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="Type your structured written response here..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    Word Count: <strong className="text-slate-800">{(studentResponse.textResponse || '').trim().split(/\s+/).filter(Boolean).length}</strong> words
                  </span>
                  <span>Minimum target: 100 words</span>
                </div>
              </div>
            ) : (
              /* Knowledge Check / Reading / Listening MCQs */
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Question 1 of 1: Conceptual Domain Assessment</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Which communication strategy best ensures clarity when explaining microservice latency bottlenecks to executive non-technical stakeholders?
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      { id: 'opt-a', text: 'A. Frame the impact around user drop-off metrics, financial ROI, and strategic mitigations.' },
                      { id: 'opt-b', text: 'B. Present full raw TCP dump logs and memory heap dump statistics without summaries.' },
                      { id: 'opt-c', text: 'C. Avoid mentioning latency entirely to prevent stakeholder concern.' },
                      { id: 'opt-d', text: 'D. Use complex internal compiler slang exclusively.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onQuizOptionSelect('q1', opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                          studentResponse.selectedAnswers?.q1 === opt.id
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold shadow-xs ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 text-slate-400" />
                Review your response before final submission.
              </div>

              <div className="flex items-center gap-3">
                {attemptsRemaining > 0 && (
                  <button
                    type="button"
                    onClick={onRetryAttempt}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Reset Attempt
                  </button>
                )}

                <button
                  type="button"
                  onClick={onSubmitAttempt}
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Submit for AI Evaluation
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 & 5: EVALUATION & AI FEEDBACK DISPLAY */}
        {(stepNumber === 4 || stepNumber === 5) && aiFeedback && (
          <AIFeedbackCard
            feedback={aiFeedback}
            metadata={metadata}
            onContinueToReflection={onProceedToReflection}
          />
        )}

        {/* STEP 6, 7, 8, 9: REFLECTION, PORTFOLIO & ANALYTICS */}
        {stepNumber >= 6 && (
          <ReflectionPortfolioStep
            metadata={metadata}
            feedback={aiFeedback!}
            portfolioPayload={state.portfolioPayload}
            analyticsPayload={state.analyticsPayload}
            onCompleteReflection={onCompleteReflection}
            onFinishAssessment={onFinishAssessment}
          />
        )}
      </main>
    </div>
  );
};
