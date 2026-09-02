import React, { useState } from 'react';
import { UserCheck, Sparkles, FolderCheck, CheckCircle2 } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWLinkedInBuilderProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWLinkedInBuilder: React.FC<PWLinkedInBuilderProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [headline, setHeadline] = useState('First-Year B.Tech Computer Science Student @ SRIT | Python & AI Developer | Building Open Source Tools');
  const [aboutSection, setAboutSection] = useState('Passionate first-year engineering student pursuing B.Tech in Computer Science at Srinivasa Ramanujan Institute of Technology (SRIT). Experienced in Python, Data Structures, and React.js. Currently working on AI-driven educational applications for SAILL laboratory. Eager to collaborate on open-source projects and cloud infrastructure.');
  const [featuredProjects, setFeaturedProjects] = useState('1. SAILL AI Writing Coach - React & Gemini API Integration\n2. Android Campus Navigation App - Java & SQLite');
  const [topSkills, setTopSkills] = useState('Python, Java, React.js, Tailwind CSS, Data Structures, Git, AI Prompt Engineering, Technical Communication');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const profileText = `LINKEDIN PROFILE\nHEADLINE:\n${headline}\n\nABOUT:\n${aboutSection}\n\nPROJECTS:\n${featuredProjects}\n\nTOP SKILLS:\n${topSkills}`;

    try {
      const res = await evaluateDocument({
        documentType: 'LinkedIn Profile',
        content: profileText,
        titleOrSubject: headline
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    const profileText = `Headline: ${headline}\n\nAbout:\n${aboutSection}\n\nFeatured Projects:\n${featuredProjects}\n\nSkills:\n${topSkills}`;
    onSaveToPortfolio('LinkedIn Profile Copy', 'LinkedIn Profile', profileText, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="LinkedIn Profile Builder Instructions"
        transcript="Craft an impactful LinkedIn Headline, recruiter-friendly About Summary, and featured project list. Include target technical keywords to maximize searchability for campus internships."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <UserCheck className="w-5 h-5 text-[#D35400]" /> LinkedIn Personal Brand Builder
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">
            Professional Headline (Formula: [Degree/Branch at SRIT] | [Technical Focus] | [Target Value]):
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">About Summary (150 - 250 Words):</label>
          <textarea
            rows={5}
            value={aboutSection}
            onChange={(e) => setAboutSection(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Featured Projects & Demos:</label>
            <textarea
              rows={3}
              value={featuredProjects}
              onChange={(e) => setFeaturedProjects(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Top Endorsed Technical Skills:</label>
            <textarea
              rows={3}
              value={topSkills}
              onChange={(e) => setTopSkills(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Profile & Searchability (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">LinkedIn Searchability Score</h4>
            <span className="text-2xl font-black text-[#D35400]">{evalResult.score10} / 10</span>
          </div>
          <p className="text-xs text-[#5D6D7E]">{evalResult.overallFeedback}</p>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className="px-4 py-2 border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0]"
            >
              <FolderCheck className="w-4 h-4 inline mr-1" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
