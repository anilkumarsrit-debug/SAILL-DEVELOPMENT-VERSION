import React, { useState } from 'react';
import { 
  AICoachId, 
  AICoachEvaluation, 
  PortfolioItem 
} from '../../types';
import { 
  AI_COACHES_CATALOG, 
  executeAICoachEvaluation, 
  saveAICoachToPortfolio 
} from '../../services/aiCoachesService';
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  Copy, 
  FolderPlus, 
  ArrowRight, 
  BarChart2, 
  Mic, 
  Volume2, 
  PenTool, 
  BookOpen, 
  FileText, 
  MessageSquareQuote, 
  Award, 
  Target, 
  GraduationCap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AICoachStudioModalProps {
  initialCoachId?: AICoachId;
  initialInput?: string;
  moduleId?: string;
  onClose: () => void;
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
  reflection: FolderPlus
};

export const AICoachStudioModal: React.FC<AICoachStudioModalProps> = ({
  initialCoachId = 'pronunciation',
  initialInput = '',
  moduleId,
  onClose,
  onPortfolioSaved
}) => {
  const [selectedCoachId, setSelectedCoachId] = useState<AICoachId>(initialCoachId);
  const [studentInput, setStudentInput] = useState<string>(initialInput);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<AICoachEvaluation | null>(null);
  const [savedToPortfolio, setSavedToPortfolio] = useState<boolean>(false);
  const [copiedCorrected, setCopiedCorrected] = useState<boolean>(false);

  const activeMeta = AI_COACHES_CATALOG[selectedCoachId] || AI_COACHES_CATALOG.grammar;

  const handleRunEvaluation = async () => {
    if (!studentInput.trim()) return;

    setIsEvaluating(true);
    setEvaluationResult(null);
    setSavedToPortfolio(false);

    try {
      const result = await executeAICoachEvaluation(selectedCoachId, studentInput, { moduleId });
      setEvaluationResult(result);
      if (result.score >= 80) {
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch {
          // fallback
        }
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSavePortfolio = async () => {
    if (!evaluationResult) return;
    const item = await saveAICoachToPortfolio(evaluationResult);
    setSavedToPortfolio(true);
    if (onPortfolioSaved) onPortfolioSaved(item);
  };

  const handleCopyCorrected = () => {
    if (evaluationResult?.correctedText) {
      navigator.clipboard.writeText(evaluationResult.correctedText);
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#FAD7A0] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FFF8F0] border-b border-[#FAD7A0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                SAILL AI Learning Engine
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#2C3E50] font-heading">
                Interactive AI Coach Studio
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#FAD7A0] text-[#5D6D7E] hover:text-[#D35400] hover:bg-[#FAD7A0] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Coach Selector Bar (Horizontal Scroll) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
              Select AI Coach ({Object.keys(AI_COACHES_CATALOG).length} Specialized Skills):
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {(Object.keys(AI_COACHES_CATALOG) as AICoachId[]).map((cId) => {
                const meta = AI_COACHES_CATALOG[cId];
                const Icon = COACH_ICONS[cId] || Sparkles;
                const isSelected = selectedCoachId === cId;
                return (
                  <button
                    key={cId}
                    onClick={() => {
                      setSelectedCoachId(cId);
                      setEvaluationResult(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                      isSelected
                        ? 'bg-[#D35400] text-white border-[#2C3E50] shadow-xs'
                        : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{meta.name.replace('AI ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Coach Description Banner */}
          <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#D35400] font-heading">{activeMeta.name}</h3>
              <span className="text-[10px] font-bold bg-white text-[#E67E22] px-2 py-0.5 rounded border border-[#FAD7A0]">
                {activeMeta.category}
              </span>
            </div>
            <p className="text-xs text-[#5D6D7E]">{activeMeta.description}</p>
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#5D6D7E]">Try Quick Sample Submissions:</label>
            <div className="flex flex-wrap gap-2">
              {activeMeta.samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setStudentInput(prompt)}
                  className="text-[11px] bg-white border border-[#FAD7A0] hover:border-[#D35400] hover:bg-[#FFF8F0] text-[#2C3E50] px-2.5 py-1 rounded-lg text-left transition line-clamp-1"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Input Text Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
              <span>Your Work Submission / Practice Text:</span>
              <span className="text-[10px] text-[#5D6D7E]">{studentInput.length} characters</span>
            </label>
            <textarea
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder={`Enter or paste your submission for ${activeMeta.name}...`}
              rows={4}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating || !studentInput.trim()}
            className={`w-full py-3 rounded-xl text-xs font-extrabold text-white transition flex items-center justify-center gap-2 shadow-md ${
              isEvaluating || !studentInput.trim()
                ? 'bg-[#5D6D7E]/50 cursor-not-allowed'
                : 'bg-[#D35400] hover:bg-[#E67E22]'
            }`}
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>SAILL AI Learning Engine Evaluating Submission...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Evaluate with {activeMeta.name}</span>
              </>
            )}
          </button>

          {/* EVALUATION RESULT DISPLAY */}
          {evaluationResult && (
            <div className="p-5 rounded-2xl bg-[#FFF8F0] border-2 border-[#FAD7A0] space-y-5 animate-in fade-in duration-300">
              
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#D35400] uppercase">AI Diagnostic Score:</span>
                    {evaluationResult.isSimulatedMode && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                        Local Intelligent Engine
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-extrabold text-[#2C3E50] font-heading mt-0.5">
                    {evaluationResult.coachName} Evaluation
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#D35400] font-heading">
                      {evaluationResult.score}
                    </span>
                    <span className="text-xs text-[#5D6D7E]"> / 100</span>
                  </div>

                  <button
                    onClick={handleSavePortfolio}
                    disabled={savedToPortfolio}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                      savedToPortfolio
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#D35400] hover:bg-[#E67E22] text-white'
                    }`}
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>{savedToPortfolio ? 'Saved to Portfolio!' : 'Save Result to Portfolio'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-1">
                <h5 className="text-xs font-bold text-[#D35400] uppercase">Diagnostic Feedback:</h5>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{evaluationResult.overallFeedback}</p>
              </div>

              {/* Strengths & Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Strengths</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                    {evaluationResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
                  <h5 className="text-xs font-bold text-[#D35400] flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-[#D35400]" />
                    <span>Actionable Suggestions</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                    {evaluationResult.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#D35400] font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sub-Metrics Scores */}
              <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-3">
                <h5 className="text-xs font-bold text-[#2C3E50] uppercase flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#D35400]" />
                  <span>Sub-Metric Performance Breakdown</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(evaluationResult.metrics).map(([mKey, mVal]) => (
                    <div key={mKey} className="bg-[#FFF8F0] p-2.5 rounded-lg border border-[#FAD7A0] text-center">
                      <span className="text-[10px] text-[#5D6D7E] block truncate font-medium">{mKey}</span>
                      <span className="text-sm font-black text-[#D35400]">{mVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guided Improvement Exercise */}
              <div className="bg-amber-500/10 border border-amber-300 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#D35400] uppercase flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-[#D35400]" />
                    <span>Guided Improvement Exercise: {evaluationResult.guidedImprovement.title}</span>
                  </h5>
                </div>
                <p className="text-xs text-[#2C3E50] italic font-medium">"{evaluationResult.guidedImprovement.exerciseText}"</p>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[#E67E22] uppercase">Action Steps:</span>
                  <ul className="space-y-1 text-xs text-[#5D6D7E]">
                    {evaluationResult.guidedImprovement.actionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished / Corrected Version */}
              {evaluationResult.correctedText && (
                <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-[#2C3E50] uppercase">Polished / Corrected Version:</h5>
                    <button
                      onClick={handleCopyCorrected}
                      className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#D35400] hover:text-white text-[#D35400] text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCorrected ? 'Copied!' : 'Copy Polish'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono bg-[#FFF8F0] p-3 rounded-lg border border-[#FAD7A0] text-[#2C3E50] leading-relaxed">
                    {evaluationResult.correctedText}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
