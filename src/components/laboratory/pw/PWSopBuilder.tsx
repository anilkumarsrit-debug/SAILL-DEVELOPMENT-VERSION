import React, { useState } from 'react';
import { Compass, Sparkles, FolderCheck, CheckCircle2 } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWSopBuilderProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWSopBuilder: React.FC<PWSopBuilderProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [targetProgram, setTargetProgram] = useState('Master of Science in Artificial Intelligence & Computer Science');
  const [sec1Motivation, setSec1Motivation] = useState('My fascination with computer science began during my secondary schooling when I created an automated weather notification script in Python. At SRIT Anantapur, this curiosity evolved into a dedicated pursuit of intelligent software systems.');
  const [sec2SritProjects, setSec2SritProjects] = useState('During my B.Tech studies at SRIT, I spearheaded the development of an AI-powered writing evaluation engine for the SAILL laboratory. Working under Dr. Sharma, I designed Gemini API endpoints and integrated offline IndexedDB synchronization.');
  const [sec3CareerGoals, setSec3CareerGoals] = useState('My short-term goal post-graduation is to work as an AI Systems Engineer in global technology R&D teams. In the long term, I aspire to lead intelligent automation research, bridging academic algorithms with real-world industry applications.');
  const [sec4UniversityFit, setSec4UniversityFit] = useState('Your esteemed university offers unmatched research laboratories and a world-class faculty in Machine Learning. Collaborating with leading researchers will allow me to refine my technical rigour and contribute meaningfully to AI innovations.');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const fullSop = `STATEMENT OF PURPOSE (SOP)\nTarget Program: ${targetProgram}\n\n1. ACADEMIC BACKGROUND & MOTIVATION:\n${sec1Motivation}\n\n2. UNDERGRADUATE PROJECTS AT SRIT:\n${sec2SritProjects}\n\n3. CAREER GOALS:\n${sec3CareerGoals}\n\n4. PROGRAM ALIGNMENT & REASON FOR APPLYING:\n${sec4UniversityFit}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Statement of Purpose',
        content: fullSop,
        titleOrSubject: `SOP - ${targetProgram}`
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
    const fullSop = `# Statement of Purpose\nTarget Program: ${targetProgram}\n\n## Background & Motivation\n${sec1Motivation}\n\n## SRIT Projects & Experience\n${sec2SritProjects}\n\n## Career Goals\n${sec3CareerGoals}\n\n## Program Alignment\n${sec4UniversityFit}`;
    onSaveToPortfolio(`Statement of Purpose: ${targetProgram}`, 'Statement of Purpose', fullSop, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Statement of Purpose (SOP) Builder Instructions"
        transcript="Draft a compelling Statement of Purpose (SOP) for higher studies or competitive research fellowships. Articulate your academic motivation, technical projects at SRIT, short/long term goals, and university program alignment."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <Compass className="w-5 h-5 text-[#D35400]" /> Statement of Purpose (SOP) Step-by-Step Builder
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Target Academic Program / Fellowship Title:</label>
          <input
            type="text"
            value={targetProgram}
            onChange={(e) => setTargetProgram(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">1. Academic Background & Initial Motivation Spark:</label>
          <textarea
            rows={3}
            value={sec1Motivation}
            onChange={(e) => setSec1Motivation(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">2. SRIT B.Tech Engineering Projects & Technical Foundations:</label>
          <textarea
            rows={3}
            value={sec2SritProjects}
            onChange={(e) => setSec2SritProjects(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">3. Short-Term & Long-Term Career Goals:</label>
            <textarea
              rows={3}
              value={sec3CareerGoals}
              onChange={(e) => setSec3CareerGoals(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">4. Reason for Target Institution / University Fit:</label>
            <textarea
              rows={3}
              value={sec4UniversityFit}
              onChange={(e) => setSec4UniversityFit(e.target.value)}
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
            <Sparkles className="w-4 h-4" /> Evaluate Statement of Purpose (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">SOP Evaluation Scorecard</h4>
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
