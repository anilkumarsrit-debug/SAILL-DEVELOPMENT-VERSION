import React, { useState } from 'react';
import { Users, Video, Eye, ShieldCheck, MessageSquare, Play, Award, BarChart3, PenTool, CheckCircle2, Bookmark, Share2, Sparkles, CheckSquare } from 'lucide-react';
import { GDOverviewSection } from './gd/GDOverviewSection';
import { GDPhraseRoleMatching } from './gd/GDPhraseRoleMatching';
import { GDBrainstormingBuilder } from './gd/GDBrainstormingBuilder';
import { GDAIVideoAnalysis } from './gd/GDAIVideoAnalysis';
import { GDRulesEtiquette } from './gd/GDRulesEtiquette';
import { GDLanguageToolkit } from './gd/GDLanguageToolkit';
import { GDAISimulator } from './gd/GDAISimulator';
import { GDAIEvaluationReport } from './gd/GDAIEvaluationReport';
import { GDPerformanceDashboard } from './gd/GDPerformanceDashboard';
import { GDReflectionNotebook } from './gd/GDReflectionNotebook';
import { GDEvaluationResult } from '../../services/ai/groupDiscussionCoach';
import { PronunciationAccentControl } from '../common/PronunciationAccentControl';

interface GroupDiscussionStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (data: any) => void;
}

export const GroupDiscussionStudio: React.FC<GroupDiscussionStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'phrase-matching'
    | 'brainstorming'
    | 'analysis'
    | 'rules'
    | 'toolkit'
    | 'simulator'
    | 'evaluation'
    | 'dashboard'
    | 'reflection'
  >('overview');

  const [latestEvaluation, setLatestEvaluation] = useState<GDEvaluationResult | null>(null);

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: Users },
    { id: 'phrase-matching', label: '2. Phrase & Role Matching', icon: CheckSquare },
    { id: 'brainstorming', label: '3. GD Brainstorming', icon: PenTool },
    { id: 'analysis', label: '4. GD-Case Study Analysis', icon: Eye },
    { id: 'rules', label: '5. Rules & Etiquette', icon: ShieldCheck },
    { id: 'toolkit', label: '6. Strategic Language Toolkit', icon: MessageSquare },
    { id: 'simulator', label: '7. AI GD Simulator', icon: Play },
    { id: 'evaluation', label: '8. AI Evaluation', icon: Award },
    { id: 'dashboard', label: '9. Dashboard', icon: BarChart3 },
    { id: 'reflection', label: '10. Reflection & Sync', icon: Bookmark }
  ];

  const handleEvaluationFinished = (res: GDEvaluationResult) => {
    setLatestEvaluation(res);
    setActiveTab('evaluation');
  };

  return (
    <div className="space-y-6">
      {/* Studio Navigation Banner */}
      <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#1a252f] to-[#2C3E50] text-white rounded-2xl border border-[#FAD7A0] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAD7A0] bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
              Module 4 • R26-LAB-04
            </span>
            <h2 className="text-xl font-black font-heading text-white mt-2">
              AI-Powered Group Discussion Laboratory
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              SRIT SAILL 10-Mark Assessment Framework • Student + AI Peers (Rohan, Ananya) + Moderator (Dr. Sharma)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <PronunciationAccentControl compact={true} />
            <span className="text-xs font-bold text-[#FAD7A0] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              Status: Active Studio Session
            </span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar border-t border-white/10 text-xs font-bold">
          {tabs.map((t) => {
            const IconComponent = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#D35400] text-white font-black shadow-2xs'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'overview' && (
          <GDOverviewSection onProceedToNext={() => setActiveTab('phrase-matching')} />
        )}

        {activeTab === 'phrase-matching' && (
          <GDPhraseRoleMatching
            onProceedToBrainstorming={() => setActiveTab('brainstorming')}
            onActivityCompleted={() => {
              if (onSaveWorkToPortfolio) {
                onSaveWorkToPortfolio({
                  type: 'GD Phrase & Role Matching',
                  score: 10
                });
              }
            }}
          />
        )}

        {activeTab === 'brainstorming' && (
          <GDBrainstormingBuilder
            onProceedToNext={() => setActiveTab('analysis')}
            onActivityCompleted={() => {
              if (onSaveWorkToPortfolio) {
                onSaveWorkToPortfolio({
                  type: 'GD Brainstorming & Point Builder',
                  score: 10
                });
              }
            }}
          />
        )}

        {activeTab === 'analysis' && <GDAIVideoAnalysis />}

        {activeTab === 'rules' && <GDRulesEtiquette />}

        {activeTab === 'toolkit' && <GDLanguageToolkit />}

        {activeTab === 'simulator' && (
          <GDAISimulator onEvaluationComplete={handleEvaluationFinished} />
        )}

        {activeTab === 'evaluation' && (
          latestEvaluation ? (
            <GDAIEvaluationReport
              evaluation={latestEvaluation}
              topicTitle="Will AI Replace Software Engineers by 2030?"
              onSaveToPortfolio={() => {
                if (onSaveWorkToPortfolio) {
                  onSaveWorkToPortfolio({
                    type: 'GD Evaluation Report',
                    score: latestEvaluation.totalScore
                  });
                }
              }}
            />
          ) : (
            <div className="p-8 text-center bg-white border border-[#FAD7A0] rounded-2xl space-y-3 text-xs">
              <Award className="w-10 h-10 text-[#D35400] mx-auto opacity-70" />
              <h3 className="text-base font-extrabold text-[#2C3E50]">No Active Evaluation Yet</h3>
              <p className="text-[#5D6D7E]">
                Complete an interactive session in the <strong className="text-[#D35400]">7. AI Simulator</strong> tab to generate your 10-Mark Evaluation Report.
              </p>
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl font-bold hover:bg-[#E67E22] transition shadow-2xs cursor-pointer"
              >
                Launch AI GD Simulator
              </button>
            </div>
          )
        )}

        {activeTab === 'dashboard' && (
          <GDPerformanceDashboard latestEvaluation={latestEvaluation} />
        )}

        {activeTab === 'reflection' && (
          <GDReflectionNotebook
            onSavedAll={() => {
              if (onSaveWorkToPortfolio) {
                onSaveWorkToPortfolio({
                  type: 'GD Reflection & Lab Notebook Record',
                  score: latestEvaluation?.totalScore || 9.0
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
