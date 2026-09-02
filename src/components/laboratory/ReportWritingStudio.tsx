import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  FileCode,
  BookMarked,
  FileText,
  BarChart3,
  Bot,
  Columns,
  TrendingUp,
  HelpCircle,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

import { IntroductionSection } from './reports/IntroductionSection';
import { WritingFundamentalsSection } from './reports/WritingFundamentalsSection';
import { LaboratoryReportStudio } from './reports/LaboratoryReportStudio';
import { ProjectReportBuilder } from './reports/ProjectReportBuilder';
import { TechnicalDocumentationStudio } from './reports/TechnicalDocumentationStudio';
import { DataPresentationLab } from './reports/DataPresentationLab';
import { AITechnicalWritingCoach } from './reports/AITechnicalWritingCoach';
import { AIReportReviewStudio } from './reports/AIReportReviewStudio';
import { TechnicalCommunicationAnalytics } from './reports/TechnicalCommunicationAnalytics';
import { ReportReflectionJournal } from './reports/ReportReflectionJournal';
import { ReportLabNotebook } from './reports/ReportLabNotebook';
import { ReportPortfolioView } from './reports/ReportPortfolioView';
import { AIConnectorsPanel } from './reports/AIConnectorsPanel';

interface ReportWritingStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
  onSaveRecording?: (blob: Blob, activityId: string) => void;
}

export const ReportWritingStudio: React.FC<ReportWritingStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<string>('intro');

  const navigationTabs = [
    { id: 'intro', label: '1. Introduction', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'fundamentals', label: '2. Fundamentals', icon: <Target className="w-4 h-4" /> },
    { id: 'lab_report', label: '3. Lab Report Studio', icon: <FileCode className="w-4 h-4" /> },
    { id: 'project_report', label: '4. Project Builder', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'tech_docs', label: '5. Tech Docs Studio', icon: <FileText className="w-4 h-4" /> },
    { id: 'data_presentation', label: '6. Data Lab', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai_coach', label: '7. AI Coach', icon: <Bot className="w-4 h-4" /> },
    { id: 'ai_review', label: '8. AI Review Studio', icon: <Columns className="w-4 h-4" /> },
    { id: 'analytics', label: '9. Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reflection', label: '10. Reflection', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'notebook', label: '11. Lab Notebook', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'portfolio', label: '12. Portfolio', icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Module Banner Header */}
      <div className="srit-card p-6 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white shadow-md space-y-2 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded text-white tracking-widest uppercase">
              R26 COMMUNICATIVE ENGLISH LABORATORY • MODULE 11
            </span>
            <h1 className="text-2xl font-black font-heading tracking-tight">{moduleTitle}</h1>
            <p className="text-xs text-amber-100 max-w-2xl">
              Format technical reports, lab manuals, executive summaries, figure captions, data presentations, and project documentation adhering to IEEE engineering standards.
            </p>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-right">
            <span className="text-[10px] font-mono uppercase text-amber-200 block">Syllabus Code</span>
            <span className="text-sm font-black font-mono">R26-LAB-11</span>
          </div>
        </div>
      </div>

      {/* AI Connectors Integration Panel */}
      <AIConnectorsPanel />

      {/* 12-Section Navigation Tab Bar */}
      <div className="srit-card p-2 bg-white border border-[#FAD7A0] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeTab === tab.id
                  ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Content Renderer */}
      <div className="transition-all duration-300">
        {activeTab === 'intro' && <IntroductionSection />}
        {activeTab === 'fundamentals' && <WritingFundamentalsSection />}
        {activeTab === 'lab_report' && (
          <LaboratoryReportStudio onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'project_report' && (
          <ProjectReportBuilder onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'tech_docs' && (
          <TechnicalDocumentationStudio onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'data_presentation' && <DataPresentationLab />}
        {activeTab === 'ai_coach' && <AITechnicalWritingCoach />}
        {activeTab === 'ai_review' && (
          <AIReportReviewStudio onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'analytics' && <TechnicalCommunicationAnalytics />}
        {activeTab === 'reflection' && <ReportReflectionJournal />}
        {activeTab === 'notebook' && <ReportLabNotebook />}
        {activeTab === 'portfolio' && <ReportPortfolioView />}
      </div>
    </div>
  );
};
