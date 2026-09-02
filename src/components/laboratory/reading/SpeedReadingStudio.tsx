import React, { useState, useEffect } from 'react';
import { Gauge, Play, RotateCcw, Check, ArrowRight, Clock, Award, Sparkles, AlertCircle } from 'lucide-react';

interface SpeedReadingStudioProps {
  onCompleteActivity: () => void;
}

export const SpeedReadingStudio: React.FC<SpeedReadingStudioProps> = ({ onCompleteActivity }) => {
  const passageText = `In modern cloud computing environments, container orchestration engines like Kubernetes automate the deployment, scaling, and operational management of containerized microservices across heterogeneous server clusters. Declarative configuration manifests specify target state properties such as replica counts, network ingress rules, resource limits, and persistent storage volume mounts. When hardware node failures or network partitions occur, self-healing control loops detect state drifts and automatically reschedule pod workloads onto healthy cluster nodes within seconds, guaranteeing continuous service availability for high-throughput enterprise web applications.`;

  const wordCount = passageText.split(/\s+/).length; // 79 words

  const [isReading, setIsReading] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [calculatedWpm, setCalculatedWpm] = useState<number | null>(null);

  // Comprehension Question
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [comprehensionScore, setComprehensionScore] = useState<number | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isReading) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const handleStartReading = () => {
    setElapsedSeconds(0);
    setCalculatedWpm(null);
    setSelectedAnswer(null);
    setComprehensionScore(null);
    setIsReading(true);
  };

  const handleFinishReading = () => {
    setIsReading(false);
    const minutes = Math.max(elapsedSeconds, 1) / 60;
    const wpm = Math.round(wordCount / minutes);
    setCalculatedWpm(wpm);
  };

  const handleCheckComprehension = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    // Option 1 is correct (Kubernetes automates container microservices deployment and self-healing)
    const score = optionIndex === 1 ? 100 : 40;
    setComprehensionScore(score);

    // Save to localStorage
    try {
      const history = JSON.parse(localStorage.getItem('srit_speed_reading_history') || '[]');
      history.push({
        date: new Date().toISOString(),
        wpm: calculatedWpm,
        timeSeconds: elapsedSeconds,
        comprehensionScore: score
      });
      localStorage.setItem('srit_speed_reading_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 8
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#D35400]" />
            8. Speed Reading & WPM Comprehension Studio
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Test your reading speed (Words Per Minute) and retention on dense engineering technical prose under timer conditions.
          </p>
        </div>

        {/* Timer Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl">
          <div className="flex items-center gap-3">
            {!isReading ? (
              <button
                type="button"
                onClick={handleStartReading}
                className="px-5 py-2.5 bg-[#D35400] text-white font-extrabold rounded-xl text-xs hover:bg-[#E67E22] transition flex items-center gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Reading Timer ({wordCount} Words)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishReading}
                className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl text-xs hover:bg-emerald-700 transition flex items-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>I Finished Reading!</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#2C3E50]">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#FAD7A0]">
              <Clock className="w-4 h-4 text-[#D35400]" />
              <span>Elapsed Time: {elapsedSeconds}s</span>
            </div>

            {calculatedWpm !== null && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D35400] text-[#D35400] font-black">
                <Gauge className="w-4 h-4" />
                <span>Speed: {calculatedWpm} WPM</span>
              </div>
            )}
          </div>
        </div>

        {/* Speed Passage Container */}
        <div className={`p-6 rounded-2xl border-2 transition ${isReading ? 'bg-white border-[#D35400] shadow-md' : 'bg-[#FFF8F0] border-[#FAD7A0]'}`}>
          <p className="font-mono text-xs text-[#2C3E50] leading-relaxed">
            "{passageText}"
          </p>
        </div>

        {/* Comprehension Verification Test (Appears after finishing) */}
        {calculatedWpm !== null && (
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-[#FAD7A0] pb-2">
              <h3 className="text-sm font-extrabold text-[#2C3E50]">Verify Comprehension to Validate WPM:</h3>
              <p className="text-xs text-[#5D6D7E]">What happens when a hardware node failure occurs in the cluster?</p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                'The cluster shuts down completely until manually restarted',
                'Self-healing control loops detect state drifts and reschedule workloads onto healthy nodes',
                'The user must buy new hardware servers immediately',
                'Kubernetes deletes all configuration manifests permanently'
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCheckComprehension(i)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedAnswer === i
                      ? 'bg-[#D35400] text-white font-bold border-[#D35400]'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswer === i && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {comprehensionScore !== null && (
              <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D35400] uppercase text-[10px]">Speed & Comprehension Result:</span>
                  <span className="font-black text-[#2C3E50] text-sm">{calculatedWpm} WPM • {comprehensionScore}% Accuracy</span>
                </div>
                <p className="text-[#5D6D7E]">
                  {comprehensionScore === 100
                    ? '🎉 Excellent speed reading performance! High speed maintained with 100% accurate information retention.'
                    : '⚡ Fast reading, but double-check key technical details to ensure complete retention.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 9: AI Reading Coach</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
