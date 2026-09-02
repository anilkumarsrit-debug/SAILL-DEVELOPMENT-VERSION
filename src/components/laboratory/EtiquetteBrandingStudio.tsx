import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Globe,
  Linkedin,
  Award,
  Sparkles,
  TrendingUp,
  HelpCircle,
  BookMarked,
  UserCheck
} from 'lucide-react';

import { EtiquetteConnectorsPanel } from './etiquette/EtiquetteConnectorsPanel';
import { IntroductionSection } from './etiquette/IntroductionSection';
import { WorkplaceEtiquetteStudio } from './etiquette/WorkplaceEtiquetteStudio';
import { DigitalNetiquetteStudio } from './etiquette/DigitalNetiquetteStudio';
import { LinkedInProfileBuilder } from './etiquette/LinkedInProfileBuilder';
import { PersonalBrandingStudio } from './etiquette/PersonalBrandingStudio';
import { AIDigitalPersonaReview } from './etiquette/AIDigitalPersonaReview';
import { PresenceAnalytics } from './etiquette/PresenceAnalytics';
import { EtiquetteReflectionJournal } from './etiquette/EtiquetteReflectionJournal';
import { EtiquetteLabNotebook } from './etiquette/EtiquetteLabNotebook';
import { EtiquettePortfolioView } from './etiquette/EtiquettePortfolioView';

interface EtiquetteBrandingStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
  onSaveRecording?: (blob: Blob, activityId: string) => void;
}

export const EtiquetteBrandingStudio: React.FC<EtiquetteBrandingStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<string>('intro');

  const navigationTabs = [
    { id: 'intro', label: '1. Introduction', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'workplace', label: '2. Workplace Etiquette', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'netiquette', label: '3. Digital Netiquette', icon: <Globe className="w-4 h-4" /> },
    { id: 'linkedin', label: '4. LinkedIn Builder', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'branding', label: '5. Personal Branding', icon: <Award className="w-4 h-4" /> },
    { id: 'ai_review', label: '6. AI Persona Review', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: '7. Presence Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reflection', label: '8. Reflection Journal', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'notebook', label: '9. Lab Notebook', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'portfolio', label: '10. Portfolio', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Module Banner Header */}
      <div className="srit-card p-6 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white shadow-md space-y-2 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded text-white tracking-widest uppercase">
              R26 COMMUNICATIVE ENGLISH LABORATORY • MODULE 12
            </span>
            <h1 className="text-2xl font-black font-heading tracking-tight">{moduleTitle}</h1>
            <p className="text-xs text-amber-100 max-w-2xl">
              Develop professional workplace etiquette, virtual meeting netiquette, 12-section LinkedIn profile branding, elevator pitches, and AI digital persona evaluations.
            </p>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-right">
            <span className="text-[10px] font-mono uppercase text-amber-200 block">Syllabus Code</span>
            <span className="text-sm font-black font-mono">R26-ENG-L112</span>
          </div>
        </div>
      </div>

      {/* AI & Brand Tool Connectors Panel */}
      <EtiquetteConnectorsPanel />

      {/* 10-Section Navigation Tab Bar */}
      <div className="srit-card p-2 bg-white border border-[#FAD7A0] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
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

      {/* Active Section Renderer */}
      <div className="transition-all duration-300">
        {activeTab === 'intro' && <IntroductionSection />}
        {activeTab === 'workplace' && <WorkplaceEtiquetteStudio />}
        {activeTab === 'netiquette' && <DigitalNetiquetteStudio />}
        {activeTab === 'linkedin' && (
          <LinkedInProfileBuilder onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'branding' && (
          <PersonalBrandingStudio onSaveWorkToPortfolio={onSaveWorkToPortfolio} />
        )}
        {activeTab === 'ai_review' && <AIDigitalPersonaReview />}
        {activeTab === 'analytics' && <PresenceAnalytics />}
        {activeTab === 'reflection' && <EtiquetteReflectionJournal />}
        {activeTab === 'notebook' && <EtiquetteLabNotebook />}
        {activeTab === 'portfolio' && <EtiquettePortfolioView />}
      </div>
    </div>
  );
};
