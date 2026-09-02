import React, { useState } from 'react';
import { Mail, BookOpen, Layout, Type, PenTool, AlertOctagon, Sparkles, Layers, BarChart2, BookMarked, Database, Award, CheckCircle2 } from 'lucide-react';

import { EmailIntroSection } from './email/EmailIntroSection';
import { EmailStructureNetiquette } from './email/EmailStructureNetiquette';
import { SubjectLineBuilder } from './email/SubjectLineBuilder';
import { ProfessionalEmailLab } from './email/ProfessionalEmailLab';
import { ComplaintEmailPractice } from './email/ComplaintEmailPractice';
import { RequestEmailPractice } from './email/RequestEmailPractice';
import { AiEmailReviewStudio } from './email/AiEmailReviewStudio';
import { AiDraftComparison } from './email/AiDraftComparison';
import { EmailPerformanceAnalytics } from './email/EmailPerformanceAnalytics';
import { EmailReflectionJournal } from './email/EmailReflectionJournal';
import { EmailLabNotebook } from './email/EmailLabNotebook';
import { EmailPortfolioShowcase } from './email/EmailPortfolioShowcase';
import { ExternalWritingToolsConnector } from './email/ExternalWritingToolsConnector';

interface ProfessionalEmailStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWorkToPortfolio?: (item: any) => void;
}

export const ProfessionalEmailStudio: React.FC<ProfessionalEmailStudioProps> = ({
  moduleId = 'professional-email',
  moduleTitle = 'Professional Email & Business Writing',
  onSaveWorkToPortfolio
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [currentDraft, setCurrentDraft] = useState<{ subject: string; body: string }>({
    subject: '[Application] Summer Software Engineering Internship - Anil Kumar (264G1A0501)',
    body: 'Dear Hiring Manager,\n\nI am a First-Year B.Tech Computer Science student at SRIT writing to apply for the Summer Software Engineering Internship position at Tech Corp...'
  });
  const [improvedDraft, setImprovedDraft] = useState<{ subject: string; body: string } | null>(null);

  const sections = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'structure', label: '2. Structure & Netiquette', icon: Layout },
    { id: 'subject', label: '3. Subject Line Builder', icon: Type },
    { id: 'lab', label: '4. Email Writing Lab', icon: PenTool },
    { id: 'complaint', label: '5. Complaint Practice', icon: AlertOctagon },
    { id: 'request', label: '6. Request Practice', icon: Mail },
    { id: 'review', label: '7. AI Review Studio', icon: Sparkles },
    { id: 'comparison', label: '8. AI Draft Comparison', icon: Layers },
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
                Module 7 • R26 Syllabus
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">SRIT AI Language Laboratory</span>
            </div>
            <h1 className="text-2xl font-black text-[#2C3E50] font-heading flex items-center gap-2">
              <Mail className="w-7 h-7 text-[#D35400]" />
              {moduleTitle}
            </h1>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Complete formal email drafting, netiquette rules, complaint/request practice, and 10-parameter AI evaluations.
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

      {/* External AI Tools Connector Settings Bar */}
      <ExternalWritingToolsConnector />

      {/* Render Active Section Component */}
      <div className="animate-in fade-in duration-200">
        {activeSection === 'intro' && (
          <EmailIntroSection onCompleteActivity={() => handleNextSection('intro')} />
        )}

        {activeSection === 'structure' && (
          <EmailStructureNetiquette onCompleteActivity={() => handleNextSection('structure')} />
        )}

        {activeSection === 'subject' && (
          <SubjectLineBuilder onCompleteActivity={() => handleNextSection('subject')} />
        )}

        {activeSection === 'lab' && (
          <ProfessionalEmailLab
            onCompleteActivity={() => handleNextSection('lab')}
            onProceedToReview={(subj, bdy) => {
              setCurrentDraft({ subject: subj, body: bdy });
              markCompleted('lab');
              setActiveSection('review');
            }}
          />
        )}

        {activeSection === 'complaint' && (
          <ComplaintEmailPractice onCompleteActivity={() => handleNextSection('complaint')} />
        )}

        {activeSection === 'request' && (
          <RequestEmailPractice onCompleteActivity={() => handleNextSection('request')} />
        )}

        {activeSection === 'review' && (
          <AiEmailReviewStudio
            initialSubject={currentDraft.subject}
            initialBody={currentDraft.body}
            onCompleteActivity={() => handleNextSection('review')}
            onProceedToComparison={(orig, imp) => {
              setCurrentDraft(orig);
              setImprovedDraft(imp);
              markCompleted('review');
              setActiveSection('comparison');
            }}
          />
        )}

        {activeSection === 'comparison' && (
          <AiDraftComparison
            originalDraft={currentDraft}
            aiImprovedDraft={improvedDraft || undefined}
            onCompleteActivity={() => handleNextSection('comparison')}
          />
        )}

        {activeSection === 'analytics' && (
          <EmailPerformanceAnalytics onCompleteActivity={() => handleNextSection('analytics')} />
        )}

        {activeSection === 'reflection' && (
          <EmailReflectionJournal onCompleteActivity={() => handleNextSection('reflection')} />
        )}

        {activeSection === 'notebook' && (
          <EmailLabNotebook onCompleteActivity={() => handleNextSection('notebook')} />
        )}

        {activeSection === 'portfolio' && (
          <EmailPortfolioShowcase
            onCompleteActivity={() => {
              markCompleted('portfolio');
              if (onSaveWorkToPortfolio) {
                onSaveWorkToPortfolio({
                  title: 'Module 7: Professional Email & Business Writing Portfolio',
                  module: 'Module 7',
                  date: new Date().toLocaleDateString(),
                  score: '9.8/10'
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
