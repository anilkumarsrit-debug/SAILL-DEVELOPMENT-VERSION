import React, { useState } from 'react';
import { Sparkles, FolderCheck, BookMarked } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWProjectAbstractProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWProjectAbstract: React.FC<PWProjectAbstractProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [projectTitle, setProjectTitle] = useState('SAILL: AI-Powered Communicative English Laboratory Platform for Engineering Colleges');
  const [background, setBackground] = useState('Communicative competence is vital for engineering placement outcomes. However, traditional language labs rely on static audio drills that lack real-time personalized feedback.');
  const [problemStatement, setProblemStatement] = useState('Students in rural engineering institutes frequently encounter Mother Tongue Influence (MTI) and hesitations without access to 24/7 dedicated language tutors.');
  const [methodology, setMethodology] = useState('We engineer SAILL, a full-stack Progressive Web Application (PWA) integrating Gemini API endpoints, Web Speech Synthesis, and client-side IndexedDB persistence for offline accessibility.');
  const [resultsOutcomes, setResultsOutcomes] = useState('Evaluations across 12 R26 syllabus modules demonstrate an 88% improvement in student writing scores and 34% reduction in speech hesitation pauses during simulated practice.');
  const [keywords, setKeywords] = useState('Artificial Intelligence in Education, AI Language Lab, Progressive Web Application (PWA), Gemini API, Technical Writing, Speech Recognition.');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const abstractText = `PROJECT ABSTRACT\nTitle: ${projectTitle}\n\nBACKGROUND & PROBLEM:\n${background}\n\nSPECIFIC PROBLEM STATEMENT:\n${problemStatement}\n\nPROPOSED METHODOLOGY:\n${methodology}\n\nRESULTS & EXPECTED OUTCOMES:\n${resultsOutcomes}\n\nINDEX TERMS / KEYWORDS:\n${keywords}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Project Abstract',
        content: abstractText,
        titleOrSubject: projectTitle
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
    const abstractText = `Abstract Title: ${projectTitle}\n\nBackground:\n${background}\n\nProblem Statement:\n${problemStatement}\n\nMethodology:\n${methodology}\n\nResults:\n${resultsOutcomes}\n\nKeywords: ${keywords}`;
    onSaveToPortfolio(`Project Abstract: ${projectTitle}`, 'Project Abstract', abstractText, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Project Abstract Writing Activity Instructions"
        transcript="Write concise 150-200 word project abstracts for IEEE symposium papers and B.Tech lab project submissions. Cover background, problem, methodology, outcomes, and IEEE Index Terms."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <BookMarked className="w-5 h-5 text-[#D35400]" /> IEEE Project Abstract Builder
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Project Title:</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">1. Background Context:</label>
            <textarea
              rows={3}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">2. Specific Problem Statement:</label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">3. Proposed Technical Methodology:</label>
            <textarea
              rows={3}
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">4. Results & Key Impact Metrics:</label>
            <textarea
              rows={3}
              value={resultsOutcomes}
              onChange={(e) => setResultsOutcomes(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">5. IEEE Index Terms / Keywords:</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Abstract (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">Project Abstract Scorecard</h4>
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
