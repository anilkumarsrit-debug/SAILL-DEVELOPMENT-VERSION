import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EtiquetteBrandingCoach, PersonaEvaluationResult } from '../../../services/ai/etiquetteBrandingCoach';

export const AIDigitalPersonaReview: React.FC = () => {
  const [headline, setHeadline] = useState(
    'B.Tech CSE Student @ SRIT | Python & AI Specialist | Building IoT Solutions'
  );
  const [about, setAbout] = useState(
    'Driven B.Tech Computer Science student at SRIT specializing in software architecture, cloud platforms, and IEEE technical report writing. Active team player with analytical problem-solving skills.'
  );
  const [brandingStatement, setBrandingStatement] = useState(
    'Passionate B.Tech Computer Science student at SRIT specializing in AI & Cloud Architecture. Driven by Innovation and Integrity.'
  );
  const [elevatorPitch, setElevatorPitch] = useState(
    'Hello! I am an engineering student at SRIT focused on cloud systems and software engineering...'
  );

  const [evaluation, setEvaluation] = useState<PersonaEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const result = EtiquetteBrandingCoach.evaluateDigitalPersona({
        linkedInHeadline: headline,
        linkedInAbout: about,
        brandingStatement,
        elevatorPitch,
        workplaceScenarioScore: 9,
        netiquetteScore: 9.5
      });
      setEvaluation(result);
      setIsEvaluating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#D35400] font-heading">
                6. AI Digital Persona Review (R26 Engine)
              </h2>
              <p className="text-xs text-[#2C3E50]">
                Evaluates 8 professional dimensions, profile completeness, digital tone, and career readiness.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B94600] transition flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isEvaluating ? 'Evaluating Digital Persona...' : 'Run AI Persona Audit'}</span>
          </button>
        </div>

        {/* Inputs Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#D35400] block mb-1">LinkedIn Headline:</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded text-xs font-medium text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#D35400] block mb-1">Branding Statement:</label>
            <input
              type="text"
              value={brandingStatement}
              onChange={(e) => setBrandingStatement(e.target.value)}
              className="w-full p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded text-xs font-medium text-[#2C3E50]"
            />
          </div>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="space-y-6 pt-2 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="p-5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded tracking-widest">
                  SAILL R26 Overall Professional Rating
                </span>
                <h3 className="text-2xl font-black font-heading">{evaluation.performanceLevel}</h3>
                <p className="text-xs text-amber-100 max-w-xl">{evaluation.executiveFeedback}</p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-center min-w-[100px]">
                <span className="text-[10px] font-mono uppercase text-amber-200 block">Overall Score</span>
                <span className="text-3xl font-black font-mono">{evaluation.score}</span>
                <span className="text-[10px] font-mono text-amber-100 block">/ 10 Marks</span>
              </div>
            </div>

            {/* 6 Dimension Radar Breakdown Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#D35400] uppercase tracking-wider font-heading">
                8 Core Evaluation Dimensions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Communication Style</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.communicationStyle} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Strong</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Digital Presence</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.digitalPresence} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Strong</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Profile Completeness</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.profileCompleteness} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Optimal</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Grammar & Tone</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.grammarAndTone} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">95%+</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Personal Branding</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.personalBranding} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">High</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-600 block">Career Readiness</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#D35400]">
                      {evaluation.dimensions.careerReadiness} / 10
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Top Tier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Digital Strengths</span>
                </div>
                <ul className="list-disc pl-4 text-xs text-emerald-900 space-y-1">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Areas for Improvement</span>
                </div>
                <ul className="list-disc pl-4 text-xs text-amber-900 space-y-1">
                  {evaluation.areasForImprovement.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improved Branding Statement & LinkedIn Recommendations */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D35400] uppercase block font-heading">
                  AI Improved Personal Branding Statement:
                </span>
                <p className="p-3 bg-white border border-[#FAD7A0] rounded-lg text-xs font-medium text-[#2C3E50]">
                  {evaluation.improvedBrandingStatement}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D35400] uppercase block font-heading">
                  LinkedIn Optimization Recommendations:
                </span>
                <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                  {evaluation.linkedInRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
