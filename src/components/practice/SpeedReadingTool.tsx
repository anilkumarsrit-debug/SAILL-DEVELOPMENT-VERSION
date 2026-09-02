import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Clock, Play, RotateCcw } from 'lucide-react';

interface SpeedReadingToolProps {
  onSaveWork?: (title: string, score: number) => void;
}

export const SpeedReadingTool: React.FC<SpeedReadingToolProps> = ({ onSaveWork }) => {
  const [isReading, setIsReading] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [wpm, setWpm] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const wordCount = 185;

  useEffect(() => {
    let timer: number;
    if (isReading) {
      timer = window.setInterval(() => {
        setReadingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReading]);

  const startPassageTimer = () => {
    setIsReading(true);
    setReadingTime(0);
    setWpm(null);
    setQuizScore(null);
  };

  const finishPassageTimer = () => {
    setIsReading(false);
    if (readingTime > 0) {
      const calculatedWpm = Math.round((wordCount / readingTime) * 60);
      setWpm(calculatedWpm);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const evaluateQuiz = () => {
    // Q0 correct is 1, Q1 correct is 0
    let score = 0;
    if (selectedAnswers[0] === 1) score += 50;
    if (selectedAnswers[1] === 0) score += 50;
    setQuizScore(score);
    if (onSaveWork) {
      onSaveWork('Speed Reading & Comprehension Test', score);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Speed Reading & Tech Comprehension</h3>
            <p className="text-xs text-slate-400">Measure Words Per Minute (WPM) and technical recall accuracy</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isReading ? (
            <button
              onClick={startPassageTimer}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Reading Timer</span>
            </button>
          ) : (
            <button
              onClick={finishPassageTimer}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finished Reading Passage</span>
            </button>
          )}
          <span className="text-xs font-mono text-indigo-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            {readingTime}s
          </span>
        </div>
      </div>

      {wpm !== null && (
        <div className="bg-indigo-950/60 border border-indigo-800 p-4 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-200">Your Calculated Reading Speed:</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{wpm} WPM</span>
        </div>
      )}

      {/* Reading Passage */}
      <div className="bg-slate-900/90 border border-slate-700 p-5 rounded-xl leading-relaxed text-slate-200 text-sm space-y-3 font-sans">
        <h4 className="font-bold text-white text-base">The Evolution of Edge Computing and Neural Processing Units</h4>
        <p>
          As internet-of-things (IoT) deployments proliferate across industrial engineering, traditional cloud-centric computing architectures encounter bandwidth bottlenecks and latency constraints. Edge computing mitigates these issues by processing data locally at the network boundary, near the sensor source.
        </p>
        <p>
          Dedicated Neural Processing Units (NPUs) now enable real-time machine learning inference directly on low-power embedded microcontrollers. By running quantized computer vision and anomaly detection models on the edge, engineering systems achieve sub-millisecond response times while preserving user data privacy and reducing transmission energy consumption by up to 60%.
        </p>
      </div>

      {/* Comprehension Quiz */}
      <div className="space-y-4 border-t border-slate-700/80 pt-4">
        <h4 className="text-sm font-bold text-white">Comprehension Verification Questions:</h4>

        <div className="space-y-2 text-xs">
          <p className="font-semibold text-slate-200">1. What primary limitation of cloud computing does edge computing resolve?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['High hardware manufacturing cost', 'Bandwidth bottlenecks and latency constraints', 'Lack of wireless protocols', 'Database encryption failure'].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(0, idx)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  selectedAnswers[0] === idx ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-semibold text-slate-200">2. By what percentage can edge AI reduce transmission energy consumption?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Up to 60%', 'Up to 25%', 'Up to 90%', 'Up to 10%'].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(1, idx)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  selectedAnswers[1] === idx ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={evaluateQuiz}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
        >
          Check Comprehension Score
        </button>

        {quizScore !== null && (
          <div className="bg-emerald-950/40 border border-emerald-800 p-3 rounded-xl text-center text-xs font-bold text-emerald-300">
            Comprehension Score: {quizScore}% Correct!
          </div>
        )}
      </div>
    </div>
  );
};
