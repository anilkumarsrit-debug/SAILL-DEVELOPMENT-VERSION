import React from 'react';
import {
  Bot,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  FileJson
} from 'lucide-react';
import { AIProcessingStatus, EvaluatePronunciationResponse } from '../../types/aiEvaluation';

interface AIEvaluationStatusCardProps {
  status: AIProcessingStatus;
  response: EvaluatePronunciationResponse | null;
  errorMessage: string | null;
  targetWord: string;
  onRetry?: () => void;
  className?: string;
}

export const AIEvaluationStatusCard: React.FC<AIEvaluationStatusCardProps> = ({
  status,
  response,
  errorMessage,
  targetWord,
  onRetry,
  className = ''
}) => {
  if (status === 'idle') return null;

  return (
    <div className={`p-5 rounded-2xl border shadow-xs transition-all ${className} ${
      status === 'processing'
        ? 'bg-gradient-to-br from-[#FFF8F0] to-white border-[#D35400] ring-2 ring-[#D35400]/20 animate-pulse'
        : status === 'success'
        ? 'bg-[#FFF8F0] border-[#FAD7A0]'
        : 'bg-red-50/60 border-red-200'
    }`}>
      {/* PROCESSING STATE */}
      {status === 'processing' && (
        <div className="flex flex-col items-center justify-center text-center space-y-3.5 py-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#D35400] text-white flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-[#FAD7A0] shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 text-[#D35400] animate-spin" />
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#2C3E50] font-heading flex items-center justify-center gap-2">
              <span>🤖 AI is analysing your pronunciation...</span>
            </h4>
            <p className="text-xs text-[#5D6D7E] font-medium">
              Target Word: <span className="font-bold text-[#D35400] font-mono">"{targetWord}"</span>
            </p>
          </div>

          {/* Wait Time Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#FAD7A0] rounded-full text-[11px] font-mono text-[#D35400] font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Estimated wait time: ~2 seconds • Please wait...</span>
          </div>
        </div>
      )}

      {/* SUCCESS STATE */}
      {status === 'success' && response && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between gap-3 border-b border-[#FAD7A0]/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#D35400] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#2C3E50] font-heading flex items-center gap-1.5">
                  <span>Recording Saved & Transmitted</span>
                  <span className="px-2 py-0.5 bg-[#2C3E50] text-white text-[9px] font-mono rounded">
                    JSON ACK
                  </span>
                </h4>
                <p className="text-xs text-[#D35400] font-bold mt-0.5">
                  {response.message || 'Pronunciation received successfully.'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-white border border-[#FAD7A0] text-[#2C3E50] text-[10px] font-mono font-bold rounded-lg shrink-0">
              {response.processing || 'completed'}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#FAD7A0] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5D6D7E] font-medium">Target Word:</span>
              <span className="font-mono font-black text-[#2C3E50] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                {response.targetWord || targetWord}
              </span>
            </div>

            <p className="text-xs text-[#5D6D7E] font-medium border-t border-[#FFF8F0] pt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D35400] shrink-0" />
              <span>This recording will be evaluated by AI in the next step.</span>
            </p>
          </div>

          {/* Raw JSON Response Preview */}
          <details className="group text-[11px] font-mono">
            <summary className="cursor-pointer text-[#5D6D7E] hover:text-[#2C3E50] font-bold flex items-center gap-1 list-none select-none">
              <FileJson className="w-3.5 h-3.5 text-[#D35400]" />
              <span>View Gemini API JSON Response</span>
            </summary>
            <pre className="mt-2 p-3 bg-[#2C3E50] text-emerald-400 rounded-xl overflow-x-auto text-[10px] leading-relaxed">
{JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* FAILURE / ERROR STATE */}
      {(status === 'failure' || status === 'retry') && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs font-black text-red-800 font-heading">
                AI Transmission Failed
              </h4>
              <p className="text-xs text-red-600 leading-relaxed font-medium">
                {errorMessage || 'Could not communicate with the AI evaluation server.'}
              </p>
            </div>
          </div>

          {onRetry && (
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={onRetry}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Transmission</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
