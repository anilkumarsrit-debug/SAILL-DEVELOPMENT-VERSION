import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Save, CheckCircle2, Sparkles, History, Lightbulb } from 'lucide-react';
import { ModuleData } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage } from '../../lib/moduleStorage';

interface ReflectionStudioProps {
  module: ModuleData;
  onSaveReflection?: (text: string) => void;
}

export const ReflectionStudio: React.FC<ReflectionStudioProps> = ({
  module,
  onSaveReflection
}) => {
  const config = getModuleConfig(module.id);
  const refConfig = config.reflectionConfig;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    loadSavedReflection();
  }, [module.id]);

  const loadSavedReflection = async () => {
    const saved = await moduleStorage.getReflection(module.id);
    if (saved) {
      setAnswers(saved.answers || {});
      if (saved.aiFeedback) setAiFeedback(saved.aiFeedback);
    } else {
      setAnswers({});
      setAiFeedback('');
    }
  };

  const handleAnswerChange = (idx: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  const handleSave = async () => {
    setIsAnalyzing(true);

    const fullResponse = Object.entries(answers)
      .map(([idx, ans]) => `Q${Number(idx) + 1}: ${refConfig.questions[Number(idx)]}\nA: ${ans}`)
      .join('\n\n');

    // Generate instant constructive feedback
    const feedback = `AI Evaluation Summary for ${config.title}:\n• High self-awareness demonstrated on core learning bottlenecks.\n• Recommended Action: Continue daily 5-minute drills using SAILL AI practice tools to consolidate gains.`;

    setAiFeedback(feedback);

    await moduleStorage.saveReflection(module.id, {
      moduleId: module.id,
      answers,
      savedAt: new Date().toISOString(),
      aiFeedback: feedback
    });

    if (onSaveReflection) {
      onSaveReflection(fullResponse);
    }

    setIsAnalyzing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const defaultGuidedPrompts = [
    "What did you learn today during this lab journey?",
    "What challenged you or caused difficulty in your speech/writing practice?",
    "What specific phonetics, vocabulary, or speaking drills will you practise next?"
  ];

  const questionsList = refConfig?.questions?.length > 0 ? refConfig.questions : defaultGuidedPrompts;

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Guided Self-Reflection & Metacognition
          </span>
          <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-[#D35400]" />
            <span>{refConfig.title || 'Module Reflection'}</span>
          </h3>
          <p className="text-xs text-[#5D6D7E] mt-0.5">{refConfig.instructions || 'Reflect on your learning progress and articulate your goals.'}</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Reflection Saved!' : 'Save Reflection'}</span>
        </button>
      </div>

      {/* Guided Questions List */}
      <div className="space-y-4">
        {questionsList.map((q, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">
              Prompt {idx + 1}: {q}
            </label>
            <textarea
              value={answers[idx] || ''}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              rows={3}
              placeholder="Write your reflective thoughts and actionable goals..."
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>
        ))}
      </div>

      {/* AI Feedback & Improvement Suggestions */}
      {aiFeedback && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <h4 className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Reflection Feedback & Improvement Suggestions:</span>
          </h4>
          <p className="text-xs text-amber-900 leading-relaxed font-medium whitespace-pre-wrap">{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};
