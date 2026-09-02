import React, { useState, useEffect, useRef } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { analyzeSpeechMetrics, PresentationFeedback } from '../../services/ai';
import { Volume2, Sparkles, Clock, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor } from '../../lib/scoring';

const JAM_TOPICS = [
  'How Renewable Energy Will Shape Future Smart Cities',
  'Why Cybersecurity is Vital for Modern Banking Apps',
  'The Role of Robotics in Healthcare and Surgery',
  'Impact of Artificial Intelligence on First-Year Engineers',
  'Why Clean Code and Documentation Matter in Tech',
  'The Importance of Electric Vehicles in Green Transportation'
];

interface JAMSpeakingToolProps {
  onSaveWork?: (title: string, audioDataUrl: string, feedback: PresentationFeedback) => void;
}

export const JAMSpeakingTool: React.FC<JAMSpeakingToolProps> = ({ onSaveWork }) => {
  const [currentTopic, setCurrentTopic] = useState(JAM_TOPICS[0]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<PresentationFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timerIntervalRef = useRef<number | null>(null);

  const generateNewTopic = () => {
    const randomIndex = Math.floor(Math.random() * JAM_TOPICS.length);
    setCurrentTopic(JAM_TOPICS[randomIndex]);
    setTimerSeconds(60);
    setIsTimerRunning(false);
    setFeedback(null);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const start60sTimer = () => {
    setTimerSeconds(60);
    setIsTimerRunning(true);
    setFeedback(null);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRecordingComplete = async (audioDataUrl: string, durationSec: number) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSpeechMetrics({
        topicTitle: currentTopic,
        presentationType: 'JAM',
        speechDurationSeconds: durationSec || 60,
        hasAudioRecording: true
      });
      setFeedback(result);
      if (onSaveWork) {
        onSaveWork(`JAM Speech: ${currentTopic}`, audioDataUrl, result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <span>Just A Minute (JAM) Fluency Challenge</span>
            </h3>
            <p className="text-xs text-slate-400">
              Speak spontaneously for 60 seconds without hesitation, repetition, or deviation.
            </p>
          </div>

          <button
            onClick={generateNewTopic}
            className="px-4 py-2 bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold rounded-xl transition flex items-center gap-2 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New Topic</span>
          </button>
        </div>

        {/* Assigned Topic Showcase */}
        <div className="bg-slate-900/90 border border-indigo-800/50 p-6 rounded-xl mb-6 text-center">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider block mb-1">Assigned Speech Topic:</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">{currentTopic}</h2>
        </div>

        {/* 60 Second Countdown Timer */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-300 font-medium">JAM 60-Second Challenge Timer:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-black font-mono px-3 py-1 rounded-lg border ${
              timerSeconds <= 10 ? 'bg-rose-950/80 text-rose-400 border-rose-700 animate-pulse' : 'bg-slate-800 text-indigo-300 border-slate-700'
            }`}>
              {timerSeconds}s
            </span>
            <button
              onClick={start60sTimer}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
            >
              Start 60s Timer
            </button>
          </div>
        </div>

        {/* Audio Recorder */}
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      </div>

      {/* AI Speech Analysis Feedback */}
      {isAnalyzing && (
        <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-2xl p-6 text-center animate-pulse py-8">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">Evaluating JAM Speech Delivery...</h4>
          <p className="text-xs text-indigo-200">Calculating Words Per Minute (WPM), pace consistency, and pause frequency</p>
        </div>
      )}

      {feedback && !isAnalyzing && (
        <div className="bg-slate-800/90 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">AI Presentation Coach Evaluation</h4>
                <p className="text-xs text-slate-400">JAM Speech Performance Report</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Score</span>
              <span className="text-xl font-black text-emerald-400">
                {formatScore10(feedback.score)} ({getPerformanceDescriptor(feedback.score)})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 block mb-1">Speaking Pace</span>
              <span className="text-lg font-bold text-indigo-300">{feedback.paceWPM} WPM</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 block mb-1">Engagement</span>
              <span className="text-lg font-bold text-emerald-300">{feedback.engagementScore}%</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 block mb-1">Filler Pause Words</span>
              <span className="text-lg font-bold text-amber-300">{feedback.fillerWordCount} detected</span>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            {feedback.overallFeedback}
          </p>
        </div>
      )}
    </div>
  );
};
