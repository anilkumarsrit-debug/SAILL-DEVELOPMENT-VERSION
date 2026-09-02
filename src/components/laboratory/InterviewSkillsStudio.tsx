import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Compass,
  Eye,
  Sparkles,
  BarChart2,
  PenTool,
  BookMarked,
  FolderOpen
} from 'lucide-react';
import { InterviewIntroSection } from './interview/InterviewIntroSection';
import { InterviewChecklistSection } from './interview/InterviewChecklistSection';
import { HrRoundSimulation } from './interview/HrRoundSimulation';
import { StarMethodWorkshop } from './interview/StarMethodWorkshop';
import { BodyLanguageGuide } from './interview/BodyLanguageGuide';
import { AiMockInterview } from './interview/AiMockInterview';
import { InterviewAnalytics } from './interview/InterviewAnalytics';
import { InterviewReflectionJournal } from './interview/InterviewReflectionJournal';
import { InterviewLabNotebook } from './interview/InterviewLabNotebook';
import { InterviewPortfolioShowcase } from './interview/InterviewPortfolioShowcase';

export const InterviewSkillsStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'intro'
    | 'checklist'
    | 'hr-simulation'
    | 'star-method'
    | 'body-language'
    | 'mock-interview'
    | 'analytics'
    | 'reflection'
    | 'notebook'
    | 'portfolio'
  >('intro');

  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set(['intro']));

  const markSectionCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const navItems = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'checklist', label: '2. Readiness Checklist', icon: CheckCircle2 },
    { id: 'hr-simulation', label: '3. HR Round Simulation', icon: MessageSquare },
    { id: 'star-method', label: '4. STAR Workshop', icon: Compass },
    { id: 'body-language', label: '5. Body Language & Eyes', icon: Eye },
    { id: 'mock-interview', label: '6. AI Mock Studio', icon: Sparkles },
    { id: 'analytics', label: '7. Performance Analytics', icon: BarChart2 },
    { id: 'reflection', label: '8. Reflection Journal', icon: PenTool },
    { id: 'notebook', label: '9. Lab Notebook', icon: BookMarked },
    { id: 'portfolio', label: '10. Student Portfolio', icon: FolderOpen }
  ];

  return (
    <div className="space-y-6">
      {/* Module 6 Hero Banner */}
      <div className="srit-card p-6 bg-linear-to-r from-[#2C3E50] via-[#34495E] to-[#1A252F] text-white border-2 border-[#D35400] relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D35400]/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2.5 py-1 rounded-md">
                R26 ELT Syllabus • Module 6
              </span>
              <span className="text-xs text-[#FAD7A0] font-bold">SRIT AI Language Laboratory</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black font-heading text-white flex items-center gap-2.5">
              Interview Skills & AI Mock Interviews
            </h1>

            <p className="text-xs text-gray-200 max-w-2xl leading-relaxed">
              Comprehensive campus placement laboratory suite covering HR interview questions, STAR response structuring, body language & eye contact, speech parameter diagnostics, and AI mock interview simulations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0 text-center space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#FAD7A0] block">Module Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D35400] rounded-full transition-all duration-300"
                  style={{ width: `${(completedSections.size / navItems.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-white">
                {Math.round((completedSections.size / navItems.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Section Navigation Bar */}
      <div className="srit-card p-2 bg-[#FFF8F0] border border-[#FAD7A0] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDone = completedSections.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content Renderer */}
      <div className="space-y-6">
        {activeTab === 'intro' && (
          <InterviewIntroSection
            onCompleteActivity={() => {
              markSectionCompleted('intro');
              setActiveTab('checklist');
            }}
          />
        )}

        {activeTab === 'checklist' && (
          <InterviewChecklistSection
            onCompleteActivity={() => {
              markSectionCompleted('checklist');
              setActiveTab('hr-simulation');
            }}
          />
        )}

        {activeTab === 'hr-simulation' && (
          <HrRoundSimulation
            onCompleteActivity={() => {
              markSectionCompleted('hr-simulation');
              setActiveTab('star-method');
            }}
          />
        )}

        {activeTab === 'star-method' && (
          <StarMethodWorkshop
            onCompleteActivity={() => {
              markSectionCompleted('star-method');
              setActiveTab('body-language');
            }}
          />
        )}

        {activeTab === 'body-language' && (
          <BodyLanguageGuide
            onCompleteActivity={() => {
              markSectionCompleted('body-language');
              setActiveTab('mock-interview');
            }}
          />
        )}

        {activeTab === 'mock-interview' && (
          <AiMockInterview
            onCompleteActivity={() => {
              markSectionCompleted('mock-interview');
              markSectionCompleted('analytics');
              setActiveTab('analytics');
            }}
          />
        )}

        {activeTab === 'analytics' && <InterviewAnalytics />}

        {activeTab === 'reflection' && (
          <InterviewReflectionJournal
            onCompleteActivity={() => {
              markSectionCompleted('reflection');
            }}
          />
        )}

        {activeTab === 'notebook' && <InterviewLabNotebook />}

        {activeTab === 'portfolio' && <InterviewPortfolioShowcase />}
      </div>
    </div>
  );
};
