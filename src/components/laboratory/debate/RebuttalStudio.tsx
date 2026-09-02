import React, { useState } from 'react';
import { evaluateRebuttal, RebuttalEvaluationResult } from '../../../services/ai/debateCoach';
import { AudioRecorder } from '../../practice/AudioRecorder';
import { MessageSquareQuote, Sparkles, Award, CheckCircle2, RefreshCw, Send, ShieldAlert } from 'lucide-react';

interface RebuttalStudioProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const RebuttalStudio: React.FC<RebuttalStudioProps> = ({ onSaveWork }) => {
  const sampleOpponentArguments = [
    {
      id: 'arg-1',
      motion: 'This House would prohibit autonomous AI systems from making binding medical diagnosis decisions without human oversight.',
      opponentPosition: 'Negative Opponent Statement',
      opponentSpeech:
        'My worthy opponent claims human oversight is mandatory. However, diagnostic AI algorithms trained on 500,000 oncology scans exhibit a 98.4% accuracy rate compared to the 84% average of human radiologists. Mandating manual doctor reviews creates bottleneck delays that result in treatment delays for critical oncology patients.'
    },
    {
      id: 'arg-2',
      motion: 'This House believes that tech corporations should be legally mandated to make proprietary software open-source after 5 years.',
      opponentPosition: 'Affirmative Opponent Statement',
      opponentSpeech:
        'Proprietary software monopolies restrict technological advancement. By forcing open-source release after 5 years, global engineers can fix security flaws and democratize artificial intelligence for developing nations without enriching trillion-dollar conglomerates.'
    }
  ];

  const [activeArgIndex, setActiveArgIndex] = useState(0);
  const [studentRebuttal, setStudentRebuttal] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<RebuttalEvaluationResult | null>(null);

  const currentOpponent = sampleOpponentArguments[activeArgIndex];

  const handleEvaluate = async () => {
    if (!studentRebuttal.trim()) {
      alert('Please enter or record your rebuttal speech before evaluating.');
      return;
    }
    setIsEvaluating(true);
    try {
      const res = await evaluateRebuttal({
        motion: currentOpponent.motion,
        aiArgument: currentOpponent.opponentSpeech,
        studentRebuttal
      });
      setEvaluation(res);

      if (onSaveWork) {
        onSaveWork(
          `Rebuttal Practice: ${currentOpponent.motion.substring(0, 30)}...`,
          JSON.stringify({ opponent: currentOpponent.opponentSpeech, rebuttal: studentRebuttal, evaluation: res }, null, 2)
        );
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 4
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Rebuttal Practice Studio
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Read or listen to an opponent's strong argument, deconstruct its logical premises, construct an immediate counter-rebuttal, and receive instant 6-metric AI evaluation.
        </p>
      </div>

      {/* Opponent Selection & Display */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
            Select Opponent Argument Case:
          </span>
          <div className="flex items-center gap-2">
            {sampleOpponentArguments.map((arg, idx) => (
              <button
                key={arg.id}
                onClick={() => {
                  setActiveArgIndex(idx);
                  setEvaluation(null);
                  setStudentRebuttal('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeArgIndex === idx
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                Argument Scenario {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Display Opponent Argument Box */}
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#C0392B] bg-[#FDEDEC] px-2 py-0.5 rounded border border-[#FAD7A0]">
              {currentOpponent.opponentPosition}
            </span>
            <span className="text-[11px] font-bold text-[#5D6D7E]">Motion: {currentOpponent.motion}</span>
          </div>
          <p className="text-xs text-[#2C3E50] font-serif italic bg-[#FFF8F0] p-3 rounded-lg border border-[#FAD7A0]/60 leading-relaxed">
            "{currentOpponent.opponentSpeech}"
          </p>
        </div>

        {/* Student Rebuttal Response Workspace */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-[#2C3E50]">
            Draft & Record Your Rebuttal Speech:
          </label>
          <textarea
            rows={4}
            placeholder="Address the opponent's claim directly. Point out logic flaws, challenge sample statistics, or introduce counter-evidence..."
            value={studentRebuttal}
            onChange={(e) => setStudentRebuttal(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />

          <AudioRecorder />

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Rebuttal Logic & Tone...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Rebuttal Performance (6 Criteria)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Evaluation Report (6 Criteria) */}
      {evaluation && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D35400]" />
              <h3 className="text-lg font-bold text-[#D35400] font-heading">
                AI Rebuttal Evaluation Report
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-[#D35400]">{evaluation.totalScore} / 10</span>
              <span className="text-xs text-[#5D6D7E] block">{evaluation.descriptor}</span>
            </div>
          </div>

          {/* 6 Rubric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Logic</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.logic} / 10</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Evidence</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.evidence} / 10</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Organization</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.organization} / 10</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Language</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.language} / 10</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Professional Tone</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.professionalTone} / 10</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">Confidence</span>
              <span className="text-base font-bold text-[#D35400]">{evaluation.confidence} / 10</span>
            </div>
          </div>

          <p className="text-xs text-[#2C3E50] leading-relaxed p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
            {evaluation.feedback}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Strengths
              </span>
              <ul className="text-[11px] text-emerald-900 list-disc list-inside space-y-0.5">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Areas for Growth
              </span>
              <ul className="text-[11px] text-amber-900 list-disc list-inside space-y-0.5">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
