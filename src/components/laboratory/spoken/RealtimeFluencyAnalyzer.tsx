import React from 'react';
import { Activity, Gauge, Zap, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor } from '../../../lib/scoring';

interface RealtimeFluencyAnalyzerProps {
  wpm: number;
  fillerWordCount: number;
  detectedFillerWords: string[];
  hesitationCount: number;
  totalScore: number;
  isAnalyzing?: boolean;
}

export const RealtimeFluencyAnalyzer: React.FC<RealtimeFluencyAnalyzerProps> = ({
  wpm,
  fillerWordCount,
  detectedFillerWords,
  hesitationCount,
  totalScore,
  isAnalyzing = false
}) => {
  const isWpmIdeal = wpm >= 120 && wpm <= 160;

  return (
    <div className="srit-card p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#D35400]" />
          <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">
            Section 10: Real-Time Fluency & Speech Metrics Engine
          </h4>
        </div>
        {isAnalyzing ? (
          <span className="text-xs font-bold text-[#D35400] flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing Acoustic & Speech Signals...</span>
          </span>
        ) : (
          <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
            Speech Metrics Computed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* WPM Gauge */}
        <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[#5D6D7E]">
            <span className="font-bold uppercase text-[10px] text-[#E67E22]">Speech Rate (WPM)</span>
            <Gauge className="w-4 h-4 text-[#D35400]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#2C3E50]">{wpm}</span>
            <span className="text-[10px] text-[#5D6D7E]">Words / Min</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-300 ${
                isWpmIdeal ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (wpm / 180) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#5D6D7E]">
            Target: <strong className="text-[#2C3E50]">130–150 WPM</strong> ({isWpmIdeal ? 'Ideal' : 'Adjustment Recommended'})
          </p>
        </div>

        {/* Filler Word Counter */}
        <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[#5D6D7E]">
            <span className="font-bold uppercase text-[10px] text-[#E67E22]">Filler Words</span>
            <AlertCircle className="w-4 h-4 text-[#D35400]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#2C3E50]">{fillerWordCount}</span>
            <span className="text-[10px] text-[#5D6D7E]">Occurrences</span>
          </div>
          <div className="flex flex-wrap gap-1 min-h-[22px]">
            {detectedFillerWords.length > 0 ? (
              detectedFillerWords.map((fw, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold"
                >
                  "{fw}"
                </span>
              ))
            ) : (
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                No vocal fillers detected
              </span>
            )}
          </div>
        </div>

        {/* Hesitation Pause Counter */}
        <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[#5D6D7E]">
            <span className="font-bold uppercase text-[10px] text-[#E67E22]">Hesitation Pauses</span>
            <Zap className="w-4 h-4 text-[#D35400]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#2C3E50]">{hesitationCount}</span>
            <span className="text-[10px] text-[#5D6D7E]">Stalls / Long Pauses</span>
          </div>
          <p className="text-[10px] text-[#5D6D7E]">
            {hesitationCount === 0
              ? 'Smooth continuous delivery'
              : 'Replace pauses with breath control'}
          </p>
        </div>

        {/* Overall Score */}
        <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[#5D6D7E]">
            <span className="font-bold uppercase text-[10px] text-[#E67E22]">Fluency Mark Scale</span>
            <Sparkles className="w-4 h-4 text-[#D35400]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#D35400]">
              {formatScore10(totalScore)}
            </span>
          </div>
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            {getPerformanceDescriptor(totalScore)}
          </span>
        </div>
      </div>
    </div>
  );
};
