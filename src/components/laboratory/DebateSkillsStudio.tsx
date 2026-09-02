import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Shield,
  MessageSquareQuote,
  Brain,
  Bot,
  Play,
  BarChart3,
  PenTool,
  FileText,
  FolderCheck,
  Network
} from 'lucide-react';

import { IntroductionSection } from './debate/IntroductionSection';
import { DebateFundamentalsSection } from './debate/DebateFundamentalsSection';
import { StructuredDebateArena } from './debate/StructuredDebateArena';
import { RebuttalStudio } from './debate/RebuttalStudio';
import { LogicalFallaciesExplorer } from './debate/LogicalFallaciesExplorer';
import { AIDebateCoachTool } from './debate/AIDebateCoachTool';
import { AIDebateSimulator } from './debate/AIDebateSimulator';
import { DebateAnalytics } from './debate/DebateAnalytics';
import { DebateReflectionJournal } from './debate/DebateReflectionJournal';
import { DebateLabNotebook } from './debate/DebateLabNotebook';
import { DebatePortfolioView } from './debate/DebatePortfolioView';
import { AIConnectorsPanel } from './debate/AIConnectorsPanel';

interface DebateSkillsStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioDataUrl: string) => void;
}

export const DebateSkillsStudio: React.FC<DebateSkillsStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio,
  onSaveRecording
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'intro'
    | 'fundamentals'
    | 'arena'
    | 'rebuttal'
    | 'fallacies'
    | 'coach'
    | 'simulator'
    | 'analytics'
    | 'reflection'
    | 'notebook'
    | 'portfolio'
    | 'connectors'
  >('intro');

  const dashboardSections = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'fundamentals', label: '2. Fundamentals', icon: Scale },
    { id: 'arena', label: '3. Structured Arena', icon: Shield },
    { id: 'rebuttal', label: '4. Rebuttal Studio', icon: MessageSquareQuote },
    { id: 'fallacies', label: '5. Fallacies Explorer', icon: Brain },
    { id: 'coach', label: '6. AI Debate Coach', icon: Bot },
    { id: 'simulator', label: '7. AI Simulator', icon: Play },
    { id: 'analytics', label: '8. Performance Analytics', icon: BarChart3 },
    { id: 'reflection', label: '9. Reflection Journal', icon: PenTool },
    { id: 'notebook', label: '10. Lab Notebook', icon: FileText },
    { id: 'portfolio', label: '11. Portfolio', icon: FolderCheck },
    { id: 'connectors', label: 'AI Connectors', icon: Network }
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#1a252f] to-[#2C3E50] text-white rounded-2xl border border-[#FAD7A0] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAD7A0] bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
              Module 10 • R26-LAB-10
            </span>
            <h2 className="text-xl font-black font-heading text-white mt-2">
              Debate & Argumentation Skills Laboratory
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              R26 Communicative English Lab Syllabus • SAILL 10-Mark Assessment Framework
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-[#FAD7A0] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              Active Module Dashboard
            </span>
          </div>
        </div>

        {/* 11-Section + Connectors Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar border-t border-white/10 text-xs font-bold">
          {dashboardSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#D35400] text-white font-black shadow-2xs'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Section View */}
      <div className="transition-all duration-300">
        {activeTab === 'intro' && <IntroductionSection />}
        {activeTab === 'fundamentals' && (
          <DebateFundamentalsSection onSaveWork={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'arena' && (
          <StructuredDebateArena
            onSaveWork={onSaveWorkToPortfolio}
            onSaveRecording={onSaveRecording}
          />
        )}
        {activeTab === 'rebuttal' && <RebuttalStudio onSaveWork={onSaveWorkToPortfolio} />}
        {activeTab === 'fallacies' && <LogicalFallaciesExplorer />}
        {activeTab === 'coach' && <AIDebateCoachTool />}
        {activeTab === 'simulator' && (
          <AIDebateSimulator
            onSaveWork={onSaveWorkToPortfolio}
            onSaveRecording={onSaveRecording}
          />
        )}
        {activeTab === 'analytics' && <DebateAnalytics />}
        {activeTab === 'reflection' && <DebateReflectionJournal moduleId={moduleId} />}
        {activeTab === 'notebook' && <DebateLabNotebook moduleId={moduleId} />}
        {activeTab === 'portfolio' && <DebatePortfolioView moduleId={moduleId} />}
        {activeTab === 'connectors' && <AIConnectorsPanel />}
      </div>
    </div>
  );
};
