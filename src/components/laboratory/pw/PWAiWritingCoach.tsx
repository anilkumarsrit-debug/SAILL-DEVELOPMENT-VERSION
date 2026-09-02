import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Copy, FolderCheck, RefreshCw, FileText } from 'lucide-react';
import { evaluateDocument, WritingCoachInput, WritingDocumentType, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWAiWritingCoachProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWAiWritingCoach: React.FC<PWAiWritingCoachProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [docType, setDocType] = useState<WritingDocumentType>('Professional Email');
  const [customText, setCustomText] = useState('Respected HOD Sir, I am writing this to ask for permission to take 2 days off because I want to join the state hackathon. My project team needs my presence to finish backend API coding. Please give OD.');
  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleAnalyze = async () => {
    if (!customText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await evaluateDocument({
        documentType: docType,
        content: customText
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyImproved = () => {
    if (!evalResult?.improvedVersion) return;
    navigator.clipboard.writeText(evalResult.improvedVersion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    onSaveToPortfolio(`AI Coach Review (${docType})`, docType, `Original Text:\n${customText}\n\nAI Polished Version:\n${evalResult.improvedVersion || customText}`, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="AI Writing Coach Instructions"
        transcript="Paste any formal document or draft into the AI Writing Coach. The engine analyzes 9 core dimensions including Grammar, Vocabulary, Professional Tone, Structure, Clarity, Coherence, Conciseness, and delivers a 10-mark SAILL score."
      />

      {/* Input Form */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3 flex-wrap gap-2">
          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D35400]" /> Real-Time AI Writing Analysis Engine
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5D6D7E]">Document Type:</span>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as WritingDocumentType)}
              className="bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2C3E50]"
            >
              <option value="Professional Email">Professional Email</option>
              <option value="Formal Letter">Formal Letter</option>
              <option value="Workplace Communication">Workplace Communication</option>
              <option value="Meeting Minutes">Meeting Minutes</option>
              <option value="Technical Report">Technical Report</option>
              <option value="Engineering Resume">Engineering Resume</option>
              <option value="LinkedIn Profile">LinkedIn Profile</option>
              <option value="Statement of Purpose">Statement of Purpose</option>
              <option value="Project Abstract">Project Abstract</option>
              <option value="General Writing">General Writing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">
            Paste Your Draft Text below for SAILL AI Evaluation:
          </label>
          <textarea
            rows={8}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your email, report, letter, or resume text here..."
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-sans focus:outline-none focus:border-[#D35400]"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Word Count: {customText.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !customText.trim()}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Analyzing 9 Writing Dimensions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run 10-Mark AI Diagnostic
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6 animate-fadeIn">
          {/* Header Score Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-3 py-1 rounded-md">
                SAILL 9-Dimension Diagnostic Output
              </span>
              <h3 className="text-xl font-extrabold text-[#2C3E50] font-heading mt-1">
                AI Writing Evaluation Report
              </h3>
            </div>

            <div className="bg-[#FFF8F0] border border-[#FAD7A0] px-5 py-3 rounded-2xl text-center">
              <span className="text-3xl font-black text-[#D35400] block">{evalResult.score10} / 10</span>
              <span className="text-[10px] text-[#5D6D7E] font-bold uppercase">{evalResult.performanceLevel}</span>
            </div>
          </div>

          {/* 9 Dimensions Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase">Content Structure</span>
              <span className="text-sm font-black text-[#2C3E50]">{evalResult.rubric.contentStructure} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase">Vocabulary & Verbs</span>
              <span className="text-sm font-black text-[#2C3E50]">{evalResult.rubric.vocabularyActionVerbs} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase">Grammar & Mechanics</span>
              <span className="text-sm font-black text-[#2C3E50]">{evalResult.rubric.grammarMechanics} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase">Tone & Courtesy</span>
              <span className="text-sm font-black text-[#2C3E50]">{evalResult.rubric.toneProfessionalism} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase">Clarity & Conciseness</span>
              <span className="text-sm font-black text-[#2C3E50]">{evalResult.rubric.clarityConciseness} / 2.0</span>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs sm:text-sm text-[#2C3E50]">
            <strong className="text-[#D35400]">Overall Summary:</strong> {evalResult.overallFeedback}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-900 uppercase mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths Identified
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {evalResult.strengths.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 uppercase mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Areas for Refinement
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-800">
                {evalResult.improvements.map((imp, idx) => (
                  <li key={idx}>• {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Verbs Cloud */}
          {evalResult.suggestedActionVerbs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">Recommended Engineering Action Verbs:</label>
              <div className="flex flex-wrap gap-1.5">
                {evalResult.suggestedActionVerbs.map((v, i) => (
                  <span key={i} className="text-xs bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] font-bold px-2.5 py-1 rounded-lg">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Polished Draft Preview */}
          {evalResult.improvedVersion && (
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-[#D35400] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> High-Impact AI Rewritten Version
                </h4>
                <button
                  type="button"
                  onClick={handleCopyImproved}
                  className="text-xs text-[#D35400] font-bold hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Rewritten Text'}
                </button>
              </div>

              <pre className="text-xs text-[#2C3E50] whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-[#FAD7A0] leading-relaxed">
                {evalResult.improvedVersion}
              </pre>
            </div>
          )}

          {/* Portfolio Action */}
          <div className="flex justify-end pt-3 border-t border-[#FAD7A0]">
            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className="px-5 py-2.5 bg-white border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] transition flex items-center gap-2"
            >
              <FolderCheck className="w-4 h-4" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add Analysis & Polished Version to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
