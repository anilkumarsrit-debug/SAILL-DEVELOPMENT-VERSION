import React, { useState } from 'react';
import { Mic, Video, Layout, Volume2, UserCheck, PenTool, Play, Users, HelpCircle, Award, BarChart3, BookOpen } from 'lucide-react';
import { PSIntroduction } from './ps/PSIntroduction';
import { PSVideoLibrary } from './ps/PSVideoLibrary';
import { PSFundamentals } from './ps/PSFundamentals';
import { PSVoiceDeliveryCoach } from './ps/PSVoiceDeliveryCoach';
import { PSBodyLanguageCoach } from './ps/PSBodyLanguageCoach';
import { PSStructureBuilder } from './ps/PSStructureBuilder';
import { PSAIPresentationStudio } from './ps/PSAIPresentationStudio';
import { PSAudienceSimulation } from './ps/PSAudienceSimulation';
import { PSQASession } from './ps/PSQASession';
import { PSAIEvaluationReport } from './ps/PSAIEvaluationReport';
import { PSPerformanceDashboard } from './ps/PSPerformanceDashboard';
import { PSReflectionJournal } from './ps/PSReflectionJournal';
import { evaluatePublicSpeaking10Marks, Presentation10MarkEvaluation, QAInteraction } from '../../services/ai/presentationCoach';

interface PublicSpeakingStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (data: any) => void;
}

export const PublicSpeakingStudio: React.FC<PublicSpeakingStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<
    'intro' | 'library' | 'fundamentals' | 'voice' | 'body' | 'builder' | 'studio' | 'audience' | 'qa' | 'evaluation' | 'dashboard' | 'reflection'
  >('intro');

  const [topicTitle, setTopicTitle] = useState<string>('My Engineering Journey');
  const [outlineData, setOutlineData] = useState<any>(null);
  const [speechData, setSpeechData] = useState<any>(null);
  const [qaList, setQaList] = useState<QAInteraction[]>([]);
  const [evaluation, setEvaluation] = useState<Presentation10MarkEvaluation | null>(null);

  const tabs = [
    { id: 'intro', label: '1. Introduction', icon: Mic },
    { id: 'library', label: '2. Video Library', icon: Video },
    { id: 'fundamentals', label: '3. Fundamentals', icon: Layout },
    { id: 'voice', label: '4. Voice Coach', icon: Volume2 },
    { id: 'body', label: '5. Body Language', icon: UserCheck },
    { id: 'builder', label: '6. Script Builder', icon: PenTool },
    { id: 'studio', label: '7. Speech Studio', icon: Play },
    { id: 'audience', label: '8. AI Audience', icon: Users },
    { id: 'qa', label: '9. Q&A Session', icon: HelpCircle },
    { id: 'evaluation', label: '10. AI Evaluation', icon: Award },
    { id: 'dashboard', label: '11. Dashboard', icon: BarChart3 },
    { id: 'reflection', label: '12-14. Reflection', icon: BookOpen }
  ];

  const handleSpeechComplete = async (sData: { durationSeconds: number; transcriptText: string; wpm: number }) => {
    setSpeechData(sData);
    setActiveTab('audience');
  };

  const handleQAComplete = async (qList: QAInteraction[]) => {
    setQaList(qList);
    const evalRes = await evaluatePublicSpeaking10Marks({
      topicTitle,
      presentationType: 'Public Speaking',
      speechDurationSeconds: speechData?.durationSeconds || 120,
      transcriptText: speechData?.transcriptText || 'Delivered presentation speech on ' + topicTitle,
      outlineData,
      qaList: qList
    });
    setEvaluation(evalRes);
    setActiveTab('evaluation');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation Strip */}
      <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#1a252f] to-[#2C3E50] text-white rounded-2xl border border-[#FAD7A0] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAD7A0] bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
              Module 5 • R26-LAB-05
            </span>
            <h2 className="text-xl font-black font-heading text-white mt-2">
              AI-Powered Public Speaking & Presentation Skills Laboratory
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              SRIT SAILL 10-Mark Assessment Framework • 5 Core Evaluation Criteria (2.0 Marks Each)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-[#FAD7A0] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              Active Studio Session
            </span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar border-t border-white/10 text-xs font-bold">
          {tabs.map((t) => {
            const IconComponent = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`px-3 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
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

      {/* Main Tab Panels */}
      <div>
        {activeTab === 'intro' && (
          <PSIntroduction
            onProceedToLibrary={() => setActiveTab('library')}
            onProceedToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'library' && <PSVideoLibrary />}

        {activeTab === 'fundamentals' && <PSFundamentals />}

        {activeTab === 'voice' && <PSVoiceDeliveryCoach />}

        {activeTab === 'body' && <PSBodyLanguageCoach />}

        {activeTab === 'builder' && (
          <PSStructureBuilder
            onOutlineSaved={(out) => {
              setOutlineData(out);
              if (out.topicTitle) setTopicTitle(out.topicTitle);
            }}
          />
        )}

        {activeTab === 'studio' && (
          <PSAIPresentationStudio
            topicTitle={topicTitle}
            outlineData={outlineData}
            onPresentationComplete={handleSpeechComplete}
          />
        )}

        {activeTab === 'audience' && (
          <PSAudienceSimulation
            topicTitle={topicTitle}
            onProceedToQA={() => setActiveTab('qa')}
          />
        )}

        {activeTab === 'qa' && (
          <PSQASession
            topicTitle={topicTitle}
            presentationType="Public Speaking"
            transcriptText={speechData?.transcriptText || ''}
            onQAComplete={handleQAComplete}
          />
        )}

        {activeTab === 'evaluation' && (
          evaluation ? (
            <PSAIEvaluationReport
              evaluation={evaluation}
              topicTitle={topicTitle}
            />
          ) : (
            <div className="srit-card p-8 bg-white border border-[#FAD7A0] rounded-2xl text-center space-y-3">
              <Award className="w-10 h-10 text-[#D35400] mx-auto" />
              <h3 className="text-base font-bold text-[#2C3E50]">No Presentation Evaluation Yet</h3>
              <p className="text-xs text-[#5D6D7E] max-w-md mx-auto">
                Deliver your speech in the <strong>Speech Studio</strong> or complete the <strong>Q&A Session</strong> to generate your 10-Mark SAILL Evaluation Report.
              </p>
              <button
                onClick={() => setActiveTab('studio')}
                className="px-5 py-2.5 bg-[#D35400] text-white font-bold rounded-xl text-xs hover:bg-[#E67E22] transition"
              >
                Go to Speech Studio
              </button>
            </div>
          )
        )}

        {activeTab === 'dashboard' && <PSPerformanceDashboard />}

        {activeTab === 'reflection' && <PSReflectionJournal />}
      </div>
    </div>
  );
};
