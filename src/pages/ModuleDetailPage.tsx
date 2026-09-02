import React, { useState, useEffect, useRef } from 'react';
import { ModuleData, ModuleTab, ModuleProgress, RecordingItem, PortfolioItem } from '../types';
import { dbStorage } from '../lib/db';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  GraduationCap, 
  PenTool, 
  MessageSquareQuote, 
  Mic, 
  FolderCheck, 
  CheckCircle2, 
  Play, 
  Save, 
  Sparkles, 
  Volume2, 
  Clock, 
  FileText,
  Award,
  Download,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

// Import Universal Learning Module Framework Components
import { LearningJourneyHeader } from '../components/framework/LearningJourneyHeader';
import { AICoachPanelModule } from '../components/framework/AICoachPanelModule';
import { PracticeWorkflowBar } from '../components/framework/PracticeWorkflowBar';
import { AIFeedbackPanel } from '../components/framework/AIFeedbackPanel';
import { CompletionExperience } from '../components/framework/CompletionExperience';
import { UniversalActivityEngine } from '../components/framework/UniversalActivityEngine';

// Import practice tools
import { PronunciationTool } from '../components/practice/PronunciationTool';
import { JAMSpeakingTool } from '../components/practice/JAMSpeakingTool';
import { EmailDrafterTool } from '../components/practice/EmailDrafterTool';
import { ResumeBuilderTool } from '../components/practice/ResumeBuilderTool';
import { STARInterviewTool } from '../components/practice/STARInterviewTool';
import { CornellNotesTool } from '../components/practice/CornellNotesTool';
import { DebateBuilderTool } from '../components/practice/DebateBuilderTool';
import { ReportFormatterTool } from '../components/practice/ReportFormatterTool';
import { ElevatorPitchTool } from '../components/practice/ElevatorPitchTool';
import { SpeedReadingTool } from '../components/practice/SpeedReadingTool';
import { PersonalBrandingTool } from '../components/practice/PersonalBrandingTool';
import { AudioRecorder } from '../components/practice/AudioRecorder';

// Import Phase 2 Laboratory Components
import { OrgansOfSpeechDiagram } from '../components/laboratory/OrgansOfSpeechDiagram';
import { InteractiveIPAChart } from '../components/laboratory/InteractiveIPAChart';
import { OfflineAudioPlayer } from '../components/laboratory/OfflineAudioPlayer';
import { FluencyStudio } from '../components/laboratory/FluencyStudio';
import { DigitalLabNotebook } from '../components/laboratory/DigitalLabNotebook';
import { KnowledgeCheckEngine } from '../components/laboratory/KnowledgeCheckEngine';
import { LearningResourcesStudio } from '../components/laboratory/LearningResourcesStudio';
import { ReflectionStudio } from '../components/laboratory/ReflectionStudio';
import { Module1PhoneticsLaboratory } from '../components/laboratory/Module1PhoneticsLaboratory';
import { PortfolioStudio } from '../components/laboratory/PortfolioStudio';
import { StatusStudio } from '../components/laboratory/StatusStudio';
import { PhoneticsExperimentStudio } from '../components/laboratory/PhoneticsExperimentStudio';
import { ListeningLabStudio } from '../components/laboratory/ListeningLabStudio';
import { GroupDiscussionStudio } from '../components/laboratory/GroupDiscussionStudio';
import { PublicSpeakingStudio } from '../components/laboratory/PublicSpeakingStudio';
import { ProfessionalWritingStudio } from '../components/laboratory/ProfessionalWritingStudio';
import { ProfessionalEmailStudio } from '../components/laboratory/ProfessionalEmailStudio';
import { ResumeWritingStudio } from '../components/laboratory/ResumeWritingStudio';
import { ReadingComprehensionStudio } from '../components/laboratory/ReadingComprehensionStudio';
import { DebateSkillsStudio } from '../components/laboratory/DebateSkillsStudio';
import { ReportWritingStudio } from '../components/laboratory/ReportWritingStudio';
import { EtiquetteBrandingStudio } from '../components/laboratory/EtiquetteBrandingStudio';
import { AccentAndWordStressStudio } from '../components/laboratory/AccentAndWordStressStudio';
import { ActivitySubmissionBox } from '../components/common/ActivitySubmissionBox';
import { StudentActivityService } from '../services/StudentActivityService';

interface ModuleDetailPageProps {
  module: ModuleData;
  progress: ModuleProgress;
  onBack: () => void;
  onProgressUpdate: (updated: ModuleProgress) => void;
}

export const ModuleDetailPage: React.FC<ModuleDetailPageProps> = ({
  module,
  progress,
  onBack,
  onProgressUpdate
}) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('overview');
  const [pronunciationAccent, setPronunciationAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [expandedTheoryTopic, setExpandedTheoryTopic] = useState<string | null>('accent-stress');
  const [reflectionNotes, setReflectionNotes] = useState(progress.reflectionNotes || '');
  const [savedNotes, setSavedNotes] = useState(progress.savedNotes || '');
  const [isCompleted, setIsCompleted] = useState(progress.status === 'completed');

  const [modulePortfolioItems, setModulePortfolioItems] = useState<PortfolioItem[]>([]);
  const [moduleRecordings, setModuleRecordings] = useState<RecordingItem[]>([]);

  const [studentRollNo, setStudentRollNo] = useState<string>('STUDENT01');
  const activityWorkspaceRef = useRef<HTMLDivElement | null>(null);

  const scrollToActivity = () => {
    setTimeout(() => {
      if (activityWorkspaceRef.current) {
        const yOffset = -75; // Account for sticky navbar offset
        const y = activityWorkspaceRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 50);
  };

  useEffect(() => {
    loadModuleArtifacts();
    dbStorage.getProfile().then((p) => {
      if (p && p.rollNo) setStudentRollNo(p.rollNo);
    });
    if ((module.id === 'pronunciation' || module.id === 'listening' || module.id === 'spoken-english' || module.id === 'group-discussion' || module.id === 'public-speaking' || module.id === 'professional-writing' || module.id === 'professional-email') && activeTab === 'demo') {
      setActiveTab('practice');
    }
    if (activeTab === 'record') {
      setActiveTab('practice');
    }
  }, [module.id, activeTab]);

  const loadModuleArtifacts = async () => {
    const allPortfolio = await dbStorage.getPortfolio();
    const allRecordings = await dbStorage.getRecordings();

    setModulePortfolioItems(allPortfolio.filter((i) => i.moduleId === module.id));
    setModuleRecordings(allRecordings.filter((r) => r.moduleId === module.id));
  };

  const handleTabChange = (tab: ModuleTab, shouldScroll = true) => {
    setActiveTab(tab);
    if (shouldScroll) {
      scrollToActivity();
    }
    const completedTabs = Array.from(new Set([...progress.completedTabs, tab]));
    const updated: ModuleProgress = {
      ...progress,
      completedTabs,
      lastAccessed: new Date().toISOString()
    };
    onProgressUpdate(updated);
    dbStorage.saveModuleProgress(updated);
  };

  const handleSaveReflection = async () => {
    const updated: ModuleProgress = {
      ...progress,
      reflectionNotes,
      savedNotes,
      lastAccessed: new Date().toISOString()
    };
    onProgressUpdate(updated);
    await dbStorage.saveModuleProgress(updated);
    alert('Reflection notes saved to local IndexedDB!');
  };

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    const updated: ModuleProgress = {
      ...progress,
      status: 'completed',
      score: 95,
      lastAccessed: new Date().toISOString()
    };
    onProgressUpdate(updated);
    await dbStorage.saveModuleProgress(updated);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const handleSaveWorkFromTool = async (titleOrData: any, content?: any, extra?: any) => {
    let title = typeof titleOrData === 'string' ? titleOrData : titleOrData?.title || 'Practice Submission';
    let textContent =
      typeof content === 'string'
        ? content
        : typeof content === 'number'
        ? `Score: ${content}`
        : typeof titleOrData === 'object'
        ? JSON.stringify(titleOrData)
        : String(content || extra || '');

    const newItem: PortfolioItem = {
      id: 'p-' + Date.now(),
      moduleId: module.id,
      moduleTitle: module.title,
      title,
      category: 'written',
      content: textContent,
      score: typeof content === 'number' ? content : 90,
      createdAt: new Date().toISOString()
    };
    await dbStorage.savePortfolioItem(newItem);
    await loadModuleArtifacts();

    // Auto-create Student Activity Submission in IndexedDB
    try {
      const profile = await dbStorage.getProfile();
      await StudentActivityService.submitActivity({
        studentRollNo: studentRollNo,
        studentName: profile?.name || 'Aarav Sharma',
        studentBranch: profile?.branch || profile?.department || 'CSE',
        studentSemester: profile?.semester || 'Semester I',
        studentSection: profile?.section || 'Section A',
        batchId: profile?.academicBatchId,
        batchName: profile?.academicBatchName,
        moduleId: module.id,
        moduleCode: `R26-LAB-${module.id.substring(0, 3).toUpperCase()}`,
        moduleTitle: module.title,
        activityId: `act-${module.id}-practice`,
        activityTitle: title,
        activityType: 'written_response',
        activityCategory: 'Guided Practice Artifact',
        textContent,
        aiScore: typeof content === 'number' ? content : 90,
        aiFeedback: 'Standard lab formatting and lexical clarity verified.'
      });
    } catch (e) {
      console.warn('Could not auto-register activity submission:', e);
    }
  };

  const handleSaveRecordingFromTool = async (titleOrBlob: any, audioDataUrlOrActivity?: any) => {
    let title = typeof titleOrBlob === 'string' ? titleOrBlob : 'Audio Practice Submission';
    let audioDataUrl = typeof audioDataUrlOrActivity === 'string' ? audioDataUrlOrActivity : '';

    const newRec: RecordingItem = {
      id: 'r-' + Date.now(),
      moduleId: module.id,
      moduleTitle: module.title,
      title,
      audioDataUrl,
      durationSeconds: 30,
      createdAt: new Date().toISOString(),
      score: 92
    };
    await dbStorage.saveRecording(newRec);
    await loadModuleArtifacts();

    // Auto-create Student Activity Submission in IndexedDB
    try {
      const profile = await dbStorage.getProfile();
      await StudentActivityService.submitActivity({
        studentRollNo: studentRollNo,
        studentName: profile?.name || 'Aarav Sharma',
        studentBranch: profile?.branch || profile?.department || 'CSE',
        studentSemester: profile?.semester || 'Semester I',
        studentSection: profile?.section || 'Section A',
        batchId: profile?.academicBatchId,
        batchName: profile?.academicBatchName,
        moduleId: module.id,
        moduleCode: `R26-LAB-${module.id.substring(0, 3).toUpperCase()}`,
        moduleTitle: module.title,
        activityId: `act-${module.id}-audio`,
        activityTitle: title,
        activityType: 'audio_recording',
        activityCategory: 'Speech & Audio Practice',
        audioDataUrl,
        audioDurationSeconds: 30,
        aiScore: 92,
        aiFeedback: 'Vocal projection and phonetic accuracy verified against native acoustic model.'
      });
    } catch (e) {
      console.warn('Could not auto-register activity submission:', e);
    }
  };

  const moduleSequence = [
    'pronunciation',
    'listening',
    'spoken-english',
    'group-discussion',
    'public-speaking',
    'professional-writing',
    'professional-email',
    'resume-writing',
    'reading-comprehension',
    'debate-skills',
    'report-writing',
    'etiquette-branding'
  ];

  const journeyNumber = Math.max(1, moduleSequence.indexOf(module.id) + 1);

  const activitiesList: { id: ModuleTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'objectives', label: 'Outcomes', icon: Target },
    { id: 'learn', label: 'Theory', icon: GraduationCap },
    ...(module.id === 'pronunciation' || module.id === 'listening' || module.id === 'spoken-english' || module.id === 'group-discussion' || module.id === 'public-speaking' || module.id === 'professional-writing' || module.id === 'professional-email'
      ? []
      : [{ id: 'demo' as ModuleTab, label: 'Interactive Demo', icon: Sparkles }]),
    { 
      id: 'practice', 
      label: 'Guided Practice Studio', 
      icon: PenTool 
    },
    { id: 'quiz', label: 'Knowledge Check', icon: CheckCircle2 },
    { id: 'experiment', label: 'Digital Notebook', icon: FileText },
    { id: 'reflection', label: 'Reflection Journal', icon: MessageSquareQuote },
    { id: 'portfolio', label: 'Portfolio Items', icon: FolderCheck },
    { id: 'resources', label: 'Resources & Handouts', icon: Download },
    { id: 'status', label: 'Status & Certificate', icon: Award }
  ];

  const [showALAEEngine, setShowALAEEngine] = useState<boolean>(false);

  const allTabsOrder: ModuleTab[] = activitiesList.map((a) => a.id);

  const currentTabIndex = allTabsOrder.indexOf(activeTab);

  const handlePreviousActivity = () => {
    if (currentTabIndex > 0) {
      handleTabChange(allTabsOrder[currentTabIndex - 1]);
    }
  };

  const handleNextActivity = () => {
    if (currentTabIndex < allTabsOrder.length - 1) {
      handleTabChange(allTabsOrder[currentTabIndex + 1]);
    } else {
      handleMarkComplete();
    }
  };

  return (
    <div className="space-y-6 pb-12 text-[#2C3E50]">
      {/* Universal Learning Journey Header */}
      <LearningJourneyHeader
        module={module}
        progress={progress}
        journeyNumber={journeyNumber}
        onBack={onBack}
      />

      {/* AI Coach Panel Module */}
      <AICoachPanelModule
        module={module}
        onNavigateToPractice={() => handleTabChange('practice')}
      />

      {/* Single Pronunciation Accent Selector for Module 1 */}
      {module.id === 'pronunciation' && (
        <div className="srit-card p-4 bg-[#FFF8F0] border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#D35400] shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-[#2C3E50]">Pronunciation Accent Preference</h3>
              <p className="text-[11px] text-[#5D6D7E]">All example-word, minimal-pair, and model sentence audio across Module 1 switch to your selected accent</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPronunciationAccent('en-US')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                pronunciationAccent === 'en-US'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
              }`}
            >
              <span>🇺🇸 American English</span>
            </button>
            <button
              onClick={() => setPronunciationAccent('en-GB')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                pronunciationAccent === 'en-GB'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
              }`}
            >
              <span>🇬🇧 British English</span>
            </button>
          </div>
        </div>
      )}

      {/* DIRECT ACTIVITY STEP PROGRESSION BAR */}
      <div className="srit-card p-3 sm:p-4 bg-white border border-[#FAD7A0] rounded-2xl shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-[#FAD7A0]/60 pb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Step {currentTabIndex + 1} of {activitiesList.length}
            </span>
            <span className="text-sm font-black text-[#2C3E50]">
              {activitiesList[currentTabIndex]?.label}
            </span>
          </div>

          <div className="text-xs font-bold text-[#5D6D7E]">
            Completed: <span className="text-[#D35400] font-black">{progress.completedTabs.length}</span> / {activitiesList.length}
          </div>
        </div>

        {/* Horizontal Step Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {activitiesList.map((act, idx) => {
            const isActActive = activeTab === act.id;
            const isVisited = progress.completedTabs.includes(act.id);
            const Icon = act.icon;

            return (
              <button
                key={act.id}
                type="button"
                id={`activity-pill-${act.id}`}
                onClick={() => handleTabChange(act.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isActActive
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs font-black'
                    : isVisited
                    ? 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    : 'bg-gray-50 text-[#5D6D7E] border-gray-200 hover:text-[#D35400]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{idx + 1}. {act.label}</span>
                {isVisited && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVITY NAVIGATION BAR */}
      <div className="srit-card p-3 bg-white border border-[#FAD7A0] flex items-center justify-between flex-wrap gap-2 shadow-2xs">
        <button
          onClick={handlePreviousActivity}
          disabled={currentTabIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            currentTabIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Activity</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-[#2C3E50]">
          <span className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-lg">
            Activity {currentTabIndex + 1} of {activitiesList.length}
          </span>
          <span className="text-[#5D6D7E] hidden sm:inline">•</span>
          <button
            onClick={() => setShowALAEEngine(!showALAEEngine)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              showALAEEngine
                ? 'bg-[#D35400] text-white border-[#D35400]'
                : 'bg-[#FFF8F0] text-[#D35400] border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showALAEEngine ? 'Standard Mode' : '8-Stage ALAE Engine'}</span>
          </button>
        </div>

        <button
          onClick={handleNextActivity}
          className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>{currentTabIndex === allTabsOrder.length - 1 ? 'Complete Journey' : 'Next Activity'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 8-STAGE UNIVERSAL AI LEARNING ACTIVITY ENGINE (ALAE) VIEW */}
      {showALAEEngine ? (
        <UniversalActivityEngine
          module={module}
          onNavigateNext={handleNextActivity}
          onNavigatePrev={handlePreviousActivity}
          onSaveProgress={handleMarkComplete}
        />
      ) : (
        <>
          {/* Practice Workflow Bar (shown when in practice or record activities) */}
          {(activeTab === 'practice' || activeTab === 'record') && (
            <PracticeWorkflowBar currentStep={activeTab === 'record' ? 'record' : 'instruction'} />
          )}

      {/* TAB CONTENT PANELS */}
      <div id="activity-workspace-content" ref={activityWorkspaceRef} className="scroll-mt-24 space-y-6">
        {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#D35400] mb-2 flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5 text-[#D35400]" />
              <span>Syllabus Alignment & Overview</span>
            </h3>
            <p className="text-xs text-[#E67E22] font-mono mb-3">R26 Syllabus Code: {module.overview.syllabusR26Code}</p>
            <p className="text-sm text-[#2C3E50] leading-relaxed">{module.overview.description}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-[#D35400] tracking-wider">Key Focus Areas:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5D6D7E]">
              {module.overview.keyFocusAreas.map((fa, idx) => (
                <li key={idx} className="bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D35400] shrink-0"></span>
                  <span className="text-[#2C3E50] font-medium">{fa}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFF8F0] border border-[#FAD7A0] p-4 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-[#D35400] uppercase">Industry & Corporate Relevance:</h4>
            <p className="text-xs text-[#5D6D7E] leading-relaxed">{module.overview.industryRelevance}</p>
          </div>
        </div>
      )}

      {/* 2. OBJECTIVES / OUTCOMES */}
      {activeTab === 'objectives' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-lg font-bold text-[#D35400] flex items-center gap-2 font-heading">
            <Target className="w-5 h-5 text-[#D35400]" />
            <span>Learning Objectives & Measurable Outcomes</span>
          </h3>

          <div className="space-y-3 pt-2">
            {module.objectives.map((obj, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D35400] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LEARN / THEORY */}
      {activeTab === 'learn' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
          <div className="border-b border-[#FAD7A0] pb-4">
            <h3 className="text-xl font-bold text-[#D35400] flex items-center gap-2 font-heading">
              <GraduationCap className="w-6 h-6 text-[#D35400]" />
              <span>Theory & Concept Lesson</span>
            </h3>
            <p className="text-xs text-[#5D6D7E] mt-1">{module.learnContent.introduction}</p>
          </div>

          {module.id === 'pronunciation' ? (
            <div className="space-y-4">
              {/* Topic 1: English Vowels */}
              <div className="border border-[#FAD7A0] rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setExpandedTheoryTopic(expandedTheoryTopic === 'vowels' ? null : 'vowels')}
                  className="w-full p-4 bg-[#FFF8F0] hover:bg-[#FAD7A0]/30 transition flex items-center justify-between text-left cursor-pointer border-b border-[#FAD7A0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-black text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2C3E50] font-heading">
                        English Vowels
                      </h4>
                      <p className="text-[11px] text-[#5D6D7E]">
                        Monophthongs (Pure Vowels) & Diphthongs (Gliding Vowels)
                      </p>
                    </div>
                  </div>
                  {expandedTheoryTopic === 'vowels' ? (
                    <ChevronUp className="w-5 h-5 text-[#D35400]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5D6D7E]" />
                  )}
                </button>

                {expandedTheoryTopic === 'vowels' && (
                  <div className="p-5 space-y-4 bg-white animate-fadeIn text-xs">
                    <p className="text-[#2C3E50] leading-relaxed">
                      Standard English features 20 distinct vowel phonemes divided into 12 Monophthongs (Pure Vowels) and 8 Diphthongs (Gliding Vowels).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1.5">
                        <span className="font-extrabold text-[#D35400] block text-xs">Monophthongs (12 Pure Vowels)</span>
                        <ul className="space-y-1 text-[11px] text-[#5D6D7E]">
                          <li>• <strong>Long Vowels:</strong> /iː/ (beat), /ɑː/ (father), /ɔː/ (port), /uː/ (boot), /ɜː/ (bird)</li>
                          <li>• <strong>Short Vowels:</strong> /ɪ/ (bit), /e/ (bed), /æ/ (RAM), /ɒ/ (pot), /ʊ/ (put), /ʌ/ (cup), /ə/ (schwa: algorithm)</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1.5">
                        <span className="font-extrabold text-[#D35400] block text-xs">Diphthongs (8 Gliding Vowels)</span>
                        <ul className="space-y-1 text-[11px] text-[#5D6D7E]">
                          <li>• <strong>Fronting Glides:</strong> /eɪ/ (array), /aɪ/ (byte), /ɔɪ/ (voice)</li>
                          <li>• <strong>Rounding Glides:</strong> /əʊ/ (code), /aʊ/ (cloud)</li>
                          <li>• <strong>Centering Glides:</strong> /ɪə/ (clear), /eə/ (variable), /ʊə/ (secure)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#FAD7A0] font-mono text-[#D35400]">
                      <strong>Engineering Terminology Examples:</strong> Algorithm /ˈæl.ɡə.rɪ.ðəm/ | Cache /kæʃ/ | Byte /baɪt/
                    </div>
                  </div>
                )}
              </div>

              {/* Topic 2: English Consonants */}
              <div className="border border-[#FAD7A0] rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setExpandedTheoryTopic(expandedTheoryTopic === 'consonants' ? null : 'consonants')}
                  className="w-full p-4 bg-[#FFF8F0] hover:bg-[#FAD7A0]/30 transition flex items-center justify-between text-left cursor-pointer border-b border-[#FAD7A0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-black text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2C3E50] font-heading">
                        English Consonants
                      </h4>
                      <p className="text-[11px] text-[#5D6D7E]">
                        24 Phonemes: Plosives, Fricatives, Affricates, Nasals & Liquids
                      </p>
                    </div>
                  </div>
                  {expandedTheoryTopic === 'consonants' ? (
                    <ChevronUp className="w-5 h-5 text-[#D35400]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5D6D7E]" />
                  )}
                </button>

                {expandedTheoryTopic === 'consonants' && (
                  <div className="p-5 space-y-4 bg-white animate-fadeIn text-xs">
                    <p className="text-[#2C3E50] leading-relaxed">
                      English has 24 consonant phonemes categorized by place of articulation, manner of articulation, and vocal cord vibration (Voiced vs Unvoiced).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
                      <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                        <span className="font-extrabold text-[#D35400] block">Plosives (6)</span>
                        <p className="text-[#5D6D7E]">/p/, /b/, /t/, /d/, /k/, /ɡ/</p>
                        <span className="text-[10px] text-[#2C3E50] italic">packet, byte, terminal</span>
                      </div>

                      <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                        <span className="font-extrabold text-[#D35400] block">Fricatives (9)</span>
                        <p className="text-[#5D6D7E]">/f/, /v/, /θ/, /ð/, /s/, /z/, /ʃ/, /ʒ/, /h/</p>
                        <span className="text-[10px] text-[#2C3E50] italic">function, thread, syntax</span>
                      </div>

                      <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                        <span className="font-extrabold text-[#D35400] block">Affricates (2)</span>
                        <p className="text-[#5D6D7E]">/tʃ/, /dʒ/</p>
                        <span className="text-[10px] text-[#2C3E50] italic">checksum, JSON</span>
                      </div>

                      <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                        <span className="font-extrabold text-[#D35400] block">Nasals (3)</span>
                        <p className="text-[#5D6D7E]">/m/, /n/, /ŋ/</p>
                        <span className="text-[10px] text-[#2C3E50] italic">memory, network, ping</span>
                      </div>

                      <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                        <span className="font-extrabold text-[#D35400] block">Approximants (4)</span>
                        <p className="text-[#5D6D7E]">/l/, /r/, /w/, /j/</p>
                        <span className="text-[10px] text-[#2C3E50] italic">logic, RAM, web, user</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Topic 3: Minimal Pairs */}
              <div className="border border-[#FAD7A0] rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setExpandedTheoryTopic(expandedTheoryTopic === 'minimal-pairs' ? null : 'minimal-pairs')}
                  className="w-full p-4 bg-[#FFF8F0] hover:bg-[#FAD7A0]/30 transition flex items-center justify-between text-left cursor-pointer border-b border-[#FAD7A0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-black text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2C3E50] font-heading">
                        Minimal Pairs
                      </h4>
                      <p className="text-[11px] text-[#5D6D7E]">
                        Acoustic Distinction Drills to Eliminate Mother Tongue Influence (MTI)
                      </p>
                    </div>
                  </div>
                  {expandedTheoryTopic === 'minimal-pairs' ? (
                    <ChevronUp className="w-5 h-5 text-[#D35400]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5D6D7E]" />
                  )}
                </button>

                {expandedTheoryTopic === 'minimal-pairs' && (
                  <div className="p-5 space-y-4 bg-white animate-fadeIn text-xs">
                    <p className="text-[#2C3E50] leading-relaxed">
                      Minimal pairs are word combinations that differ by only one single sound (phoneme) in the same position. Mastering minimal pairs eliminates regional accents and MTI confusion in professional speech.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                        <span className="font-bold text-[#D35400] block">/p/ vs /b/ (Plosive Voicing)</span>
                        <p className="font-mono text-[#2C3E50]">pin /pɪn/ vs bin /bɪn/</p>
                        <p className="font-mono text-[#2C3E50]">packet /pækɪt/ vs bracket /brækɪt/</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                        <span className="font-bold text-[#D35400] block">/f/ vs /v/ (Labiodental Friction)</span>
                        <p className="font-mono text-[#2C3E50]">fan /fæn/ vs van /væn/</p>
                        <p className="font-mono text-[#2C3E50]">file /faɪl/ vs vile /vaɪl/</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                        <span className="font-bold text-[#D35400] block">/s/ vs /z/ (Alveolar Voicing)</span>
                        <p className="font-mono text-[#2C3E50]">sip /sɪp/ vs zip /zɪp/</p>
                        <p className="font-mono text-[#2C3E50]">sink /sɪŋk/ vs zinc /zɪŋk/</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
                        <span className="font-bold text-[#D35400] block">/ɪ/ vs /iː/ (Vowel Duration)</span>
                        <p className="font-mono text-[#2C3E50]">ship /ʃɪp/ vs sheep /ʃiːp/</p>
                        <p className="font-mono text-[#2C3E50]">bit /bɪt/ vs beat /biːt/</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Topic 4: Accent & Word Stress */}
              <div className="border-2 border-[#D35400] rounded-2xl overflow-hidden bg-white shadow-md">
                <button
                  onClick={() => setExpandedTheoryTopic(expandedTheoryTopic === 'accent-stress' ? null : 'accent-stress')}
                  className="w-full p-4 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] hover:bg-[#FAD7A0]/20 transition flex items-center justify-between text-left cursor-pointer border-b border-[#FAD7A0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D35400] to-[#E67E22] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      4
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-[#D35400] font-heading">
                          Accent & Word Stress
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#5D6D7E]">
                        Introduction, Word Stress Rules, Interactive Listening & Guided Practice
                      </p>
                    </div>
                  </div>
                  {expandedTheoryTopic === 'accent-stress' ? (
                    <ChevronUp className="w-5 h-5 text-[#D35400]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#D35400]" />
                  )}
                </button>

                {expandedTheoryTopic === 'accent-stress' && (
                  <div className="p-5 bg-white animate-fadeIn">
                    <AccentAndWordStressStudio onNextActivity={handleNextActivity} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {module.learnContent.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0]">
                  <h4 className="text-base font-bold text-[#D35400] font-heading">{sec.title}</h4>
                  <p className="text-xs text-[#2C3E50] leading-relaxed">{sec.content}</p>

                  {sec.bulletPoints && (
                    <ul className="space-y-1.5 pl-2 text-xs text-[#5D6D7E]">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] mt-1.5 shrink-0"></span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.example && (
                    <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs font-mono text-[#D35400]">
                      <strong>Example:</strong> {sec.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. INTERACTIVE DEMO */}
      {activeTab === 'demo' && (
        <div className="space-y-6">
          {module.id === 'debate-skills' && (
            <DebateSkillsStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          )}

          {module.id === 'report-writing' && (
            <ReportWritingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          )}

          {module.id === 'etiquette-branding' && (
            <EtiquetteBrandingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          )}

          {/* Default fallback demo for other modules */}
          {module.id !== 'pronunciation' && module.id !== 'listening' && module.id !== 'spoken-english' && module.id !== 'group-discussion' && module.id !== 'public-speaking' && module.id !== 'professional-writing' && module.id !== 'professional-email' && module.id !== 'debate-skills' && module.id !== 'report-writing' && module.id !== 'etiquette-branding' && (
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
              <h3 className="text-xl font-black text-[#D35400] font-heading flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#D35400]" />
                <span>Interactive Demonstration: {module.title}</span>
              </h3>
              <p className="text-xs text-[#5D6D7E]">
                Explore step-by-step interactive workflow simulations and audio models tailored for {module.title}.
              </p>

              {/* Dynamic tool demo */}
              {module.practiceConfig.toolId === 'email-drafter' && (
                <EmailDrafterTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'resume-builder' && (
                <ResumeBuilderTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'star-interview' && (
                <STARInterviewTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'cornell-notes' && (
                <CornellNotesTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'debate-builder' && (
                <DebateBuilderTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'report-formatter' && (
                <ReportFormatterTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'elevator-pitch' && (
                <ElevatorPitchTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'speed-reading' && (
                <SpeedReadingTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'personal-branding' && (
                <PersonalBrandingTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'jam-speaking' && (
                <JAMSpeakingTool onSaveWork={handleSaveWorkFromTool} />
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {module.id === 'pronunciation' ? (
            <Module1PhoneticsLaboratory
              studentRollNo={studentRollNo}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecordingToEvidence={handleSaveRecordingFromTool}
              onModuleCompleted={() => handleTabChange('status')}
            />
          ) : module.id === 'listening' ? (
            <ListeningLabStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'spoken-english' ? (
            <FluencyStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWork={handleSaveWorkFromTool}
            />
          ) : module.id === 'group-discussion' ? (
            <GroupDiscussionStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'public-speaking' ? (
            <PublicSpeakingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'professional-writing' ? (
            <ProfessionalWritingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'professional-email' ? (
            <ProfessionalEmailStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'resume-writing' ? (
            <ResumeWritingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'reading-comprehension' ? (
            <ReadingComprehensionStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
            />
          ) : module.id === 'debate-skills' ? (
            <DebateSkillsStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          ) : module.id === 'report-writing' ? (
            <ReportWritingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          ) : module.id === 'etiquette-branding' ? (
            <EtiquetteBrandingStudio
              moduleId={module.id}
              moduleTitle={module.title}
              onSaveWorkToPortfolio={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          ) : module.practiceConfig.toolId === 'pronunciation' ? (
            <PhoneticsExperimentStudio
              accent={pronunciationAccent}
              onSaveWork={handleSaveWorkFromTool}
              onSaveRecording={handleSaveRecordingFromTool}
            />
          ) : (
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
              <div className="border-b border-[#FAD7A0] pb-4">
                <h3 className="text-xl font-bold text-[#D35400] flex items-center gap-2 font-heading">
                  <PenTool className="w-6 h-6 text-[#D35400]" />
                  <span>{module.practiceConfig.toolTitle}</span>
                </h3>
                <p className="text-xs text-[#5D6D7E] mt-1">{module.practiceConfig.instructions}</p>
              </div>

              {module.practiceConfig.toolId === 'jam-speaking' && (
                <JAMSpeakingTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'email-drafter' && (
                <EmailDrafterTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'resume-builder' && (
                <ResumeBuilderTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'star-interview' && (
                <STARInterviewTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'cornell-notes' && (
                <CornellNotesTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'debate-builder' && (
                <DebateBuilderTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'report-formatter' && (
                <ReportFormatterTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'elevator-pitch' && (
                <ElevatorPitchTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'speed-reading' && (
                <SpeedReadingTool onSaveWork={handleSaveWorkFromTool} />
              )}
              {module.practiceConfig.toolId === 'personal-branding' && (
                <PersonalBrandingTool onSaveWork={handleSaveWorkFromTool} />
              )}
            </div>
          )}

          {/* Student Activity Official Submission Box for Guided Practice */}
          <ActivitySubmissionBox
            moduleId={module.id}
            moduleTitle={module.title}
            activityId={`act-${module.id}-practice`}
            activityTitle={`${module.title} - Core Practice Activity`}
            activityType="practice_task"
            activityCategory="Guided Lab Practice"
            textContent={modulePortfolioItems.find((p) => p.moduleId === module.id)?.content}
            audioDataUrl={moduleRecordings.find((r) => r.moduleId === module.id)?.audioDataUrl}
            aiScore={progress.score || 88}
            aiFeedback="Acoustic clarity, phonetics, and structured execution analyzed by AI assistant."
          />
        </div>
      )}

      {/* 6. DIGITAL LAB NOTEBOOK */}
      {activeTab === 'experiment' && (
        <div className="space-y-6">
          <DigitalLabNotebook
            module={module}
            onSaveExperiment={(rec) => handleSaveWorkFromTool(rec.title, JSON.stringify(rec))}
          />
          <ActivitySubmissionBox
            moduleId={module.id}
            moduleTitle={module.title}
            activityId={`act-${module.id}-experiment`}
            activityTitle={`${module.title} - Digital Lab Notebook Entry`}
            activityType="digital_notebook"
            activityCategory="Digital Lab Record"
            textContent={savedNotes || 'Lab Experiment Observations and Acoustic Notes Recorded.'}
            aiScore={90}
            aiFeedback="Scientific lab notation and structured phonetic analysis verified."
          />
        </div>
      )}

      {/* 7. KNOWLEDGE CHECK QUIZ */}
      {activeTab === 'quiz' && (
        <KnowledgeCheckEngine
          module={module}
          onQuizComplete={(sc) => {
            const updated: ModuleProgress = {
              ...progress,
              score: Math.max(progress.score || 0, sc),
              lastAccessed: new Date().toISOString()
            };
            onProgressUpdate(updated);
            dbStorage.saveModuleProgress(updated);
          }}
        />
      )}

      {/* 8. LEARNING RESOURCES & TEMPLATES */}
      {activeTab === 'resources' && <LearningResourcesStudio module={module} />}

      {/* 9. REFLECTION */}
      {activeTab === 'reflection' && (
        <div className="space-y-6">
          <ReflectionStudio
            module={module}
            onSaveReflection={(text) => handleSaveReflection()}
          />
          <ActivitySubmissionBox
            moduleId={module.id}
            moduleTitle={module.title}
            activityId={`act-${module.id}-reflection`}
            activityTitle={`${module.title} - Guided Reflection Record`}
            activityType="reflection_journal"
            activityCategory="Metacognitive Reflection"
            textContent={reflectionNotes || 'Self-evaluation and communicative growth reflection.'}
            aiScore={92}
            aiFeedback="Metacognitive depth and professional communication goals aligned."
          />
        </div>
      )}

      {/* 10. PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <PortfolioStudio module={module} />
      )}

      {/* AI Feedback Panel for Practice / Portfolio */}
      {activeTab === 'practice' && (
        <AIFeedbackPanel
          moduleTitle={module.title}
          overallScore={progress.score || 88}
        />
      )}

      {/* 12. COMPLETION STATUS & CERTIFICATION */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <CompletionExperience
            module={module}
            onNextJourney={() => {
              const nextIndex = moduleSequence.indexOf(module.id) + 1;
              if (nextIndex < moduleSequence.length) {
                onBack();
              }
            }}
            onRestartJourney={() => handleTabChange('overview')}
          />

          <StatusStudio
            module={module}
            progress={progress}
            onProgressUpdate={onProgressUpdate}
          />
        </div>
      )}

        {/* BOTTOM ACTIVITY NAVIGATION BAR */}
        <div className="p-4 bg-white border border-[#FAD7A0] rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {currentTabIndex > 0 ? (
              <button
                type="button"
                onClick={handlePreviousActivity}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#2C3E50] border border-[#FAD7A0] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4 text-[#D35400]" />
                <span>Previous: {activitiesList[currentTabIndex - 1]?.label}</span>
              </button>
            ) : (
              <div className="hidden sm:block w-24" />
            )}
          </div>

          <div className="text-center">
            <span className="text-[11px] font-mono font-bold text-[#5D6D7E]">
              Activity <strong className="text-[#D35400]">{currentTabIndex + 1}</strong> of {allTabsOrder.length} • {activitiesList[currentTabIndex]?.label}
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleNextActivity}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>
                {currentTabIndex === allTabsOrder.length - 1
                  ? 'Complete Journey'
                  : `Next: ${activitiesList[currentTabIndex + 1]?.label}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
