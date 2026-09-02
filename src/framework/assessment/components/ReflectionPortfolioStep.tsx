/**
 * Reflection & Portfolio Integration Step for UALAF
 * Handles Self-Reflection Prompting, Portfolio Artifact Payload Generation & Analytics Event Dispatch
 */

import React, { useState } from 'react';
import {
  PenTool,
  Send,
  BookMarked,
  BarChart2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import {
  AssessmentMetadata,
  PortfolioIntegrationPayload,
  AnalyticsEventPayload,
  AIFeedbackPayload
} from '../types';

interface ReflectionPortfolioStepProps {
  metadata: AssessmentMetadata;
  feedback: AIFeedbackPayload;
  portfolioPayload?: PortfolioIntegrationPayload;
  analyticsPayload?: AnalyticsEventPayload;
  onCompleteReflection: (reflectionText: string) => void;
  onFinishAssessment: () => void;
}

export const ReflectionPortfolioStep: React.FC<ReflectionPortfolioStepProps> = ({
  metadata,
  feedback,
  portfolioPayload,
  analyticsPayload,
  onCompleteReflection,
  onFinishAssessment
}) => {
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    onCompleteReflection(reflectionText);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-8" id="ualaf-reflection-step">
      {!isSubmitted ? (
        /* Step 6: Learner Self-Reflection Input Form */
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <PenTool className="w-3.5 h-3.5 mr-1" />
              Step 6 of 9 • Learner Metacognition
            </div>
            <h2 className="text-xl font-bold text-slate-900">Post-Assessment Metacognitive Self-Reflection</h2>
            <p className="text-sm text-slate-600 mt-1">
              Reflecting on your assessment performance cements learning outcomes and creates a permanent record in your SAILL Learning Portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmitReflection} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reflection-textarea" className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                Reflective Questions:
              </label>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-200">
                <li>What communication strategy or phonetic technique worked well during this attempt?</li>
                <li>How will you apply the AI feedback insights in your next real-world project or presentation?</li>
              </ul>
              <textarea
                id="reflection-textarea"
                rows={4}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write your brief self-reflection here (minimum 15 words recommended)..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!reflectionText.trim()}
                className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit Reflection & Sync Portfolio
                <Send className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Steps 7, 8 & 9: Sync Confirmation & Next Steps */
        <div className="space-y-8 animate-fade-in">
          <div className="text-center space-y-2 border-b border-slate-200 pb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Assessment Workflow Complete</h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your response, AI evaluation score ({feedback.overallScore}%), and self-reflection have been securely logged.
            </p>
          </div>

          {/* Integration Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 7: Portfolio Integration */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center">
                  <BookMarked className="w-4 h-4 text-indigo-600 mr-1.5" />
                  Step 7: Student Portfolio Sync
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Artifact <span className="font-mono font-semibold text-indigo-950">{portfolioPayload?.artifactId || 'art-synced'}</span> generated for Student Portfolio & Faculty Review queue.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {portfolioPayload?.targetAudience.map((aud) => (
                  <span key={aud} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800">
                    {aud.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 8: Learning Analytics Update */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center">
                  <BarChart2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Step 8: Analytics Event Dispatch
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  DISPATCHED
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Event <span className="font-mono font-semibold text-emerald-950">{analyticsPayload?.eventId || 'evt-dispatched'}</span> dispatched across 5 core systems.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analyticsPayload?.targetSystems.map((sys) => (
                  <span key={sys} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800">
                    {sys.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 9: Next Recommendation */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Step 9: AI Adaptive Next Recommendation
              </div>
              <span className="text-xs text-slate-300">Journey Progression Engine</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                {feedback.overallScore >= metadata.passingScore
                  ? 'Ready for Advanced Journey Activity'
                  : 'Recommended Skill Reinforcement Activity'}
              </h3>
              <p className="text-xs text-slate-300">
                Based on your overall score ({feedback.overallScore}%), the AI learning system recommends progressing to the next journey activity module.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onFinishAssessment}
                className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Return to Journey Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
