import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  FileText,
  Newspaper,
  Target,
  Lightbulb,
  Sliders,
  Gauge,
  Bot,
  GitCompare,
  BarChart2,
  BookMarked,
  Award,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

import { ExternalReadingToolsConnector } from './reading/ExternalReadingToolsConnector';
import { ReadingIntroSection } from './reading/ReadingIntroSection';
import { ReadingStrategyStudio } from './reading/ReadingStrategyStudio';
import { ArticleReadingLab } from './reading/ArticleReadingLab';
import { EditorialReadingLab } from './reading/EditorialReadingLab';
import { MainIdeaFinder } from './reading/MainIdeaFinder';
import { InferenceBuilder } from './reading/InferenceBuilder';
import { ToneAnalyzer } from './reading/ToneAnalyzer';
import { SpeedReadingStudio } from './reading/SpeedReadingStudio';
import { AiReadingCoach } from './reading/AiReadingCoach';
import { ComparativeReadingLab } from './reading/ComparativeReadingLab';
import { ReadingPerformanceAnalytics } from './reading/ReadingPerformanceAnalytics';
import { ReadingReflectionJournal } from './reading/ReadingReflectionJournal';
import { ReadingLabNotebook } from './reading/ReadingLabNotebook';
import { ReadingPortfolioShowcase } from './reading/ReadingPortfolioShowcase';

interface ReadingComprehensionStudioProps {
  moduleId: string;
  moduleTitle: string;
  onSaveWorkToPortfolio?: (item: any) => void;
}

export const ReadingComprehensionStudio: React.FC<ReadingComprehensionStudioProps> = ({
  moduleId,
  moduleTitle,
  onSaveWorkToPortfolio
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const sections = [
    { id: 1, name: '1. Introduction', icon: BookOpen },
    { id: 2, name: '2. Strategy Studio', icon: Brain },
    { id: 3, name: '3. Article Lab', icon: FileText },
    { id: 4, name: '4. Editorial Lab', icon: Newspaper },
    { id: 5, name: '5. Main Idea', icon: Target },
    { id: 6, name: '6. Inference Builder', icon: Lightbulb },
    { id: 7, name: '7. Tone Analyzer', icon: Sliders },
    { id: 8, name: '8. Speed Reading', icon: Gauge },
    { id: 9, name: '9. AI Coach', icon: Bot },
    { id: 10, name: '10. Comparative Lab', icon: GitCompare },
    { id: 11, name: '11. Performance', icon: BarChart2 },
    { id: 12, name: '12. Reflection', icon: BookOpen },
    { id: 13, name: '13. Notebook', icon: BookMarked },
    { id: 14, name: '14. Portfolio', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* R26 AI Tools Integrated Banner */}
      <ExternalReadingToolsConnector />

      {/* 14-Section Dashboard Bar */}
      <div className="srit-card p-4 bg-white border border-[#FAD7A0] rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#D35400] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
              R26 Syllabus Matrix
            </span>
            <span className="text-xs font-extrabold text-[#2C3E50]">14 Lab Activity Modules</span>
          </div>
          <span className="text-xs text-[#5D6D7E] font-bold">
            Step {activeSection} of 14
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FAD7A0]">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-xs'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Section Render */}
      {activeSection === 1 && (
        <ReadingIntroSection onCompleteActivity={() => setActiveSection(2)} />
      )}
      {activeSection === 2 && (
        <ReadingStrategyStudio onCompleteActivity={() => setActiveSection(3)} />
      )}
      {activeSection === 3 && (
        <ArticleReadingLab onCompleteActivity={() => setActiveSection(4)} />
      )}
      {activeSection === 4 && (
        <EditorialReadingLab onCompleteActivity={() => setActiveSection(5)} />
      )}
      {activeSection === 5 && (
        <MainIdeaFinder onCompleteActivity={() => setActiveSection(6)} />
      )}
      {activeSection === 6 && (
        <InferenceBuilder onCompleteActivity={() => setActiveSection(7)} />
      )}
      {activeSection === 7 && (
        <ToneAnalyzer onCompleteActivity={() => setActiveSection(8)} />
      )}
      {activeSection === 8 && (
        <SpeedReadingStudio onCompleteActivity={() => setActiveSection(9)} />
      )}
      {activeSection === 9 && (
        <AiReadingCoach onCompleteActivity={() => setActiveSection(10)} />
      )}
      {activeSection === 10 && (
        <ComparativeReadingLab onCompleteActivity={() => setActiveSection(11)} />
      )}
      {activeSection === 11 && (
        <ReadingPerformanceAnalytics onCompleteActivity={() => setActiveSection(12)} />
      )}
      {activeSection === 12 && (
        <ReadingReflectionJournal onCompleteActivity={() => setActiveSection(13)} />
      )}
      {activeSection === 13 && (
        <ReadingLabNotebook onCompleteActivity={() => setActiveSection(14)} />
      )}
      {activeSection === 14 && (
        <ReadingPortfolioShowcase onSaveToPortfolio={onSaveWorkToPortfolio} />
      )}
    </div>
  );
};
