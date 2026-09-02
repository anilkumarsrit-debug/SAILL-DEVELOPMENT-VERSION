import React, { useState } from 'react';
import { PracticeToolId, PortfolioItem, RecordingItem } from '../types';
import { dbStorage } from '../lib/db';
import { 
  PenTool, 
  Mic, 
  Mail, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Scale, 
  FileSpreadsheet, 
  Presentation, 
  Globe,
  Clock,
  Sparkles
} from 'lucide-react';

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
import { AICoachStudioModal } from '../components/ai/AICoachStudioModal';
import { AICoachId } from '../types';

const PRACTICE_TOOLS: { id: PracticeToolId; name: string; icon: React.FC<{ className?: string }>; desc: string; coachId: AICoachId }[] = [
  { id: 'pronunciation', name: 'IPA Pronunciation Voice Recorder', icon: Mic, desc: 'Phonetics, vowel charts & voice pitch analysis', coachId: 'pronunciation' },
  { id: 'jam-speaking', name: '60-Second JAM Speech Studio', icon: Clock, desc: 'Fluency without hesitation or repetition', coachId: 'speaking' },
  { id: 'email-drafter', name: 'Corporate Email Editor', icon: Mail, desc: 'Formal tone, subject lines & automated scorer', coachId: 'writing' },
  { id: 'resume-builder', name: 'ATS Engineering Resume Generator', icon: FileText, desc: 'Single-page resume & XYZ action verb formula', coachId: 'resume' },
  { id: 'star-interview', name: 'STAR Interview Builder', icon: Briefcase, desc: 'Behavioral & technical interview preparation', coachId: 'interview' },
  { id: 'cornell-notes', name: 'Cornell 3-Column Note-Taking', icon: BookOpen, desc: 'Active listening & lecture note synthesis', coachId: 'listening' },
  { id: 'debate-builder', name: 'CRE Debate Motion Builder', icon: Scale, desc: 'Claim, Reason, Evidence argumentation', coachId: 'debate' },
  { id: 'report-formatter', name: 'Technical Report Formatter', icon: FileSpreadsheet, desc: 'Lab report & executive summary structure', coachId: 'writing' },
  { id: 'elevator-pitch', name: '30-Second Elevator Pitch Studio', icon: Presentation, desc: 'Personal recruiter pitch formulation', coachId: 'presentation' },
  { id: 'speed-reading', name: 'Speed Reading & Comprehension', icon: BookOpen, desc: 'WPM rate & technical recall verification', coachId: 'reading' },
  { id: 'personal-branding', name: 'LinkedIn Brand Studio', icon: Globe, desc: 'Headline, bio & digital presence score', coachId: 'vocabulary' }
];

export const PracticeCenterPage: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<PracticeToolId>('pronunciation');
  const [activeCoachForModal, setActiveCoachForModal] = useState<AICoachId | null>(null);

  const activeToolObj = PRACTICE_TOOLS.find((t) => t.id === activeToolId) || PRACTICE_TOOLS[0];

  const handleSaveWritten = async (title: string, content: any) => {
    const textContent =
      typeof content === 'string'
        ? content
        : typeof content === 'number'
        ? `Score: ${content}`
        : JSON.stringify(content || '');

    const item: PortfolioItem = {
      id: 'p-' + Date.now(),
      moduleId: 'practice-hub',
      moduleTitle: 'Practice Hub Tool',
      title,
      category: 'written',
      content: textContent,
      score: typeof content === 'number' ? content : 90,
      createdAt: new Date().toISOString()
    };
    await dbStorage.savePortfolioItem(item);
    alert('Saved to Portfolio in IndexedDB!');
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] font-heading">Interactive Practice Center</h1>
            <p className="text-xs sm:text-sm text-[#5D6D7E]">
              Direct access to all 11 communicative tools, voice recorders, and generators
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveCoachForModal(activeToolObj.coachId)}
          className="px-4 py-2.5 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#D35400] hover:text-white text-[#D35400] font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#E67E22]" />
          <span>Evaluate Tool Output with AI Coach</span>
        </button>
      </div>

      {/* Tool Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {PRACTICE_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#5D6D7E] hover:text-[#D35400]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Practice Tool Studio Container */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
        {activeToolId === 'pronunciation' && <PronunciationTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'jam-speaking' && <JAMSpeakingTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'email-drafter' && <EmailDrafterTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'resume-builder' && <ResumeBuilderTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'star-interview' && <STARInterviewTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'cornell-notes' && <CornellNotesTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'debate-builder' && <DebateBuilderTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'report-formatter' && <ReportFormatterTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'elevator-pitch' && <ElevatorPitchTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'speed-reading' && <SpeedReadingTool onSaveWork={handleSaveWritten} />}
        {activeToolId === 'personal-branding' && <PersonalBrandingTool onSaveWork={handleSaveWritten} />}
      </div>

      {activeCoachForModal && (
        <AICoachStudioModal
          initialCoachId={activeCoachForModal}
          onClose={() => setActiveCoachForModal(null)}
        />
      )}
    </div>
  );
};
