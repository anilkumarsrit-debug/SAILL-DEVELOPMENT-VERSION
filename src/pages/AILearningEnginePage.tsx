import React, { useState } from 'react';
import { AICoachId, StudentProfile, PortfolioItem } from '../types';
import { StudentAIDashboard } from '../components/ai/StudentAIDashboard';
import { FacultyAIDashboard } from '../components/ai/FacultyAIDashboard';
import { PromptLibraryStudio } from '../components/ai/PromptLibraryStudio';
import { AICoachStudioModal } from '../components/ai/AICoachStudioModal';
import { AI_COACHES_CATALOG } from '../services/aiCoachesService';
import { 
  Sparkles, 
  BarChart3, 
  FileCode, 
  GraduationCap, 
  Mic, 
  Volume2, 
  MessageSquareQuote, 
  PenTool, 
  BookOpen, 
  FileText, 
  Award, 
  Target, 
  CheckCircle2, 
  FolderCheck, 
  ArrowRight 
} from 'lucide-react';

interface AILearningEnginePageProps {
  profile: StudentProfile;
  onNavigatePage: (page: any) => void;
  onPortfolioSaved?: (item: PortfolioItem) => void;
}

const COACH_ICONS: Record<string, React.FC<{ className?: string }>> = {
  pronunciation: Mic,
  listening: Volume2,
  speaking: MessageSquareQuote,
  grammar: CheckCircle2,
  writing: PenTool,
  reading: BookOpen,
  resume: FileText,
  interview: Sparkles,
  presentation: Award,
  debate: Target,
  vocabulary: GraduationCap,
  reflection: FolderCheck
};

export const AILearningEnginePage: React.FC<AILearningEnginePageProps> = ({
  profile,
  onNavigatePage,
  onPortfolioSaved
}) => {
  const [activeTab, setActiveTab] = useState<'coaches' | 'analytics' | 'prompts' | 'faculty'>('coaches');
  const [selectedCoachIdForModal, setSelectedCoachIdForModal] = useState<AICoachId | null>(null);
  const [prefilledInputForModal, setPrefilledInputForModal] = useState<string>('');

  const handleOpenCoachModal = (coachId: AICoachId, prefillInput: string = '') => {
    setSelectedCoachIdForModal(coachId);
    setPrefilledInputForModal(prefillInput);
  };

  const coachList = Object.keys(AI_COACHES_CATALOG) as AICoachId[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2C3E50]">
      
      {/* Page Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0] relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#D35400] px-3 py-1 rounded shadow-2xs">
              Phase 3 • SAILL AI Learning Engine
            </span>
            <span className="text-xs font-bold text-[#E67E22] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              12 Specialized AI Coaches
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#D35400] font-heading">
            SRIT AI Language Laboratory (SAILL) Learning Engine
          </h1>

          <p className="text-xs sm:text-sm text-[#5D6D7E] max-w-3xl leading-relaxed">
            Centralized AI-powered English Language Laboratory supporting First-Year Engineering students (R26 Regulations). All AI interactions happen natively inside SAILL with zero external sites.
          </p>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('coaches')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'coaches'
              ? 'bg-[#D35400] text-white shadow-xs'
              : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>12 Interactive AI Coaches</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#D35400] text-white shadow-xs'
              : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Student AI Skill Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prompts'
              ? 'bg-[#D35400] text-white shadow-xs'
              : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>R26 Prompt Library</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'faculty'
              ? 'bg-[#D35400] text-white shadow-xs'
              : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Faculty AI Analytics</span>
        </button>
      </div>

      {/* TAB CONTENT 1: 12 INTERACTIVE AI COACHES CATALOG */}
      {activeTab === 'coaches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#D35400] font-heading">
              Select an AI Coach to Begin Diagnostic Practice
            </h2>
            <span className="text-xs text-[#5D6D7E] font-bold">12 Active AI Service Interfaces</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coachList.map((cId) => {
              const meta = AI_COACHES_CATALOG[cId];
              const Icon = COACH_ICONS[cId] || Sparkles;

              return (
                <div
                  key={cId}
                  className="p-5 rounded-2xl bg-white border border-[#FAD7A0] hover:border-[#D35400] hover:shadow-lg transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold bg-[#FFF8F0] text-[#E67E22] px-2 py-0.5 rounded border border-[#FAD7A0]">
                        {meta.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#2C3E50] group-hover:text-[#D35400] transition">
                        {meta.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#E67E22]">{meta.title}</p>
                    </div>

                    <p className="text-xs text-[#5D6D7E] leading-relaxed">{meta.description}</p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#D35400] uppercase">Target Metrics:</span>
                      <div className="flex flex-wrap gap-1">
                        {meta.metricsList.map((m) => (
                          <span key={m} className="text-[9px] bg-[#FFF8F0] text-[#2C3E50] px-1.5 py-0.5 rounded border border-[#FAD7A0]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCoachModal(cId)}
                    className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Practice with {meta.name.replace('AI ', '')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: STUDENT SKILL MATRIX */}
      {activeTab === 'analytics' && (
        <StudentAIDashboard
          profile={profile}
          onOpenCoachStudio={(cId) => handleOpenCoachModal(cId)}
        />
      )}

      {/* TAB CONTENT 3: PROMPT LIBRARY */}
      {activeTab === 'prompts' && (
        <PromptLibraryStudio
          onSelectPromptForCoach={(cId, sampleText) => handleOpenCoachModal(cId, sampleText)}
        />
      )}

      {/* TAB CONTENT 4: FACULTY AI ANALYTICS */}
      {activeTab === 'faculty' && (
        <FacultyAIDashboard />
      )}

      {/* INTERACTIVE COACH STUDIO MODAL */}
      {selectedCoachIdForModal && (
        <AICoachStudioModal
          initialCoachId={selectedCoachIdForModal}
          initialInput={prefilledInputForModal}
          onClose={() => {
            setSelectedCoachIdForModal(null);
            setPrefilledInputForModal('');
          }}
          onPortfolioSaved={onPortfolioSaved}
        />
      )}

    </div>
  );
};
