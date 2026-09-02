import React, { useState } from 'react';
import { FileText, BookOpen, ShieldCheck, Zap, Search, Mail, Sparkles, Target, BarChart2, BookMarked, Database, Award, CheckCircle2 } from 'lucide-react';

import { ResumeIntroSection } from './resume/ResumeIntroSection';
import { AtsFundamentalsSection } from './resume/AtsFundamentalsSection';
import { InteractiveResumeBuilder } from './resume/InteractiveResumeBuilder';
import { ActionVerbStudio } from './resume/ActionVerbStudio';
import { JobDescriptionAnalyzer } from './resume/JobDescriptionAnalyzer';
import { CoverLetterBuilder } from './resume/CoverLetterBuilder';
import { ResumeScannerAiReview } from './resume/ResumeScannerAiReview';
import { ResumeVsJobMatch } from './resume/ResumeVsJobMatch';
import { ResumePerformanceAnalytics } from './resume/ResumePerformanceAnalytics';
import { ResumeReflectionJournal } from './resume/ResumeReflectionJournal';
import { ResumeLabNotebook } from './resume/ResumeLabNotebook';
import { ResumePortfolioShowcase } from './resume/ResumePortfolioShowcase';
import { ExternalResumeToolsConnector } from './resume/ExternalResumeToolsConnector';

interface ResumeWritingStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWorkToPortfolio?: (item: any) => void;
}

export const ResumeWritingStudio: React.FC<ResumeWritingStudioProps> = ({
  moduleId = 'resume-writing',
  moduleTitle = 'Resume & Cover Letter Writing',
  onSaveWorkToPortfolio
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const sections = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'ats_fundamentals', label: '2. ATS Fundamentals', icon: ShieldCheck },
    { id: 'builder', label: '3. Resume Builder', icon: FileText },
    { id: 'action_verbs', label: '4. Action Verb Studio', icon: Zap },
    { id: 'jd_analyzer', label: '5. JD Analyzer', icon: Search },
    { id: 'cover_letter', label: '6. Cover Letter Builder', icon: Mail },
    { id: 'ai_review', label: '7. AI Resume Review', icon: Sparkles },
    { id: 'job_match', label: '8. Resume vs Job Match', icon: Target },
    { id: 'analytics', label: '9. Performance Analytics', icon: BarChart2 },
    { id: 'reflection', label: '10. Reflection Journal', icon: BookMarked },
    { id: 'notebook', label: '11. Lab Notebook', icon: Database },
    { id: 'portfolio', label: '12. Portfolio Showcase', icon: Award }
  ];

  const markCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set(prev).add(sectionId));
  };

  const handleNextSection = (currentId: string) => {
    markCompleted(currentId);
    const currentIndex = sections.findIndex((s) => s.id === currentId);
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Module Title Header Banner */}
      <div className="srit-card p-6 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#D35400] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                Module 8 • R26 Syllabus
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">SRIT AI Language Laboratory</span>
            </div>
            <h1 className="text-2xl font-black text-[#2C3E50] font-heading flex items-center gap-2">
              <FileText className="w-7 h-7 text-[#D35400]" />
              {moduleTitle}
            </h1>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Master ATS-friendly resume formatting, power action verbs, job description keyword matching, cover letters, and 8-parameter AI reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#FAD7A0] shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-[#D35400] block">Module Progress</span>
              <span className="text-sm font-black text-[#2C3E50]">
                {completedSections.size} / {sections.length} Sections
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#FAD7A0] border-t-[#D35400] flex items-center justify-center font-black text-xs text-[#D35400]">
              {Math.round((completedSections.size / sections.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* 12-Section Navigation Bar */}
      <div className="srit-card p-2 bg-white border border-[#FAD7A0] rounded-2xl overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const isCompleted = completedSections.has(sec.id);

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* External Resume Connectors Bar */}
      <ExternalResumeToolsConnector />

      {/* Render Active Section Component */}
      <div className="animate-in fade-in duration-200">
        {activeSection === 'intro' && (
          <ResumeIntroSection onCompleteActivity={() => handleNextSection('intro')} />
        )}

        {activeSection === 'ats_fundamentals' && (
          <AtsFundamentalsSection onCompleteActivity={() => handleNextSection('ats_fundamentals')} />
        )}

        {activeSection === 'builder' && (
          <InteractiveResumeBuilder onCompleteActivity={() => handleNextSection('builder')} />
        )}

        {activeSection === 'action_verbs' && (
          <ActionVerbStudio onCompleteActivity={() => handleNextSection('action_verbs')} />
        )}

        {activeSection === 'jd_analyzer' && (
          <JobDescriptionAnalyzer onCompleteActivity={() => handleNextSection('jd_analyzer')} />
        )}

        {activeSection === 'cover_letter' && (
          <CoverLetterBuilder onCompleteActivity={() => handleNextSection('cover_letter')} />
        )}

        {activeSection === 'ai_review' && (
          <ResumeScannerAiReview onCompleteActivity={() => handleNextSection('ai_review')} />
        )}

        {activeSection === 'job_match' && (
          <ResumeVsJobMatch onCompleteActivity={() => handleNextSection('job_match')} />
        )}

        {activeSection === 'analytics' && (
          <ResumePerformanceAnalytics onCompleteActivity={() => handleNextSection('analytics')} />
        )}

        {activeSection === 'reflection' && (
          <ResumeReflectionJournal onCompleteActivity={() => handleNextSection('reflection')} />
        )}

        {activeSection === 'notebook' && (
          <ResumeLabNotebook onCompleteActivity={() => handleNextSection('notebook')} />
        )}

        {activeSection === 'portfolio' && (
          <ResumePortfolioShowcase
            onCompleteActivity={() => {
              markCompleted('portfolio');
              if (onSaveWorkToPortfolio) {
                onSaveWorkToPortfolio({
                  title: 'Module 8: Resume & Cover Letter Writing Portfolio',
                  module: 'Module 8',
                  date: new Date().toLocaleDateString(),
                  score: '9.5/10'
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
