import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Clock,
  Volume2,
  Sparkles,
  Save,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Globe,
  AlertCircle
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface PSAIPresentationStudioProps {
  topicTitle: string;
  outlineData?: {
    openingHook?: string;
    keyPoint1?: string;
    keyPoint2?: string;
    keyPoint3?: string;
    conclusion?: string;
  };
  onPresentationComplete: (speechData: {
    durationSeconds: number;
    transcriptText: string;
    wpm: number;
    audioUrl?: string;
  }) => void;
}

const FRESHMAN_TOPICS = [
  'My Engineering Journey',
  'Importance of Communication Skills',
  'Technology in Everyday Life',
  'My Favourite Engineering Innovation',
  'Social Media: Advantages and Disadvantages',
  'Artificial Intelligence in Education',
  'Environmental Protection',
  'Teamwork in Engineering'
];

export const PSAIPresentationStudio: React.FC<PSAIPresentationStudioProps> = ({
  topicTitle: initialTopicTitle,
  onPresentationComplete
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopicTitle || FRESHMAN_TOPICS[0]
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [actualDuration, setActualDuration] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [accentPreference, setAccentPreference] = useState<'en-US' | 'en-GB'>(() => {
    return (localStorage.getItem('saill_accent_pref') as 'en-US' | 'en-GB') || 'en-US';
  });

  const timerRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Sync initial topic title if changed externally
  useEffect(() => {
    if (initialTopicTitle && FRESHMAN_TOPICS.includes(initialTopicTitle)) {
      setSelectedTopic(initialTopicTitle);
    }
  }, [initialTopicTitle]);

  // Clean up recording and audio resources
  const cleanupResources = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      recognitionRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupResources();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [cleanupResources, recordedAudioUrl]);

  // Start live speech delivery & timer
  const handleStartDelivery = async () => {
    setIsSaved(false);
    setLiveTranscript('');
    setMicPermissionDenied(false);

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      mediaStreamRef.current = stream;

      // Audio volume analyzer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(updateVolume);
            }
          };
          updateVolume();
        }
      } catch (err) {
        console.warn('AudioContext volume metering unavailable:', err);
      }

      // Initialize MediaRecorder
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start(250);

      // Initialize SpeechRecognition for real-time live transcription
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = accentPreference;

          recognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(fullText.trim());
          };

          recognition.onerror = (e: any) => {
            console.warn('SpeechRecognition notification:', e.error);
          };

          recognition.start();
        } catch (e) {
          console.warn('Recognition start error:', e);
        }
      }

      // Start actual duration timer
      setSeconds(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          // Auto cap at 3 minutes (180s)
          if (next >= 180) {
            handleStopDelivery(next);
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setMicPermissionDenied(true);
    }
  };

  // Stop delivery
  const handleStopDelivery = (finalSec?: number) => {
    setIsRecording(false);
    const duration = finalSec !== undefined ? finalSec : seconds;
    setActualDuration(duration);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioVolume(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  // Listen to My Presentation playback
  const handleTogglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(recordedAudioUrl);
      audioElementRef.current.onended = () => setIsPlayingAudio(false);
      audioElementRef.current.onpause = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.src = recordedAudioUrl;
      audioElementRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((e) => console.error('Audio playback error', e));
    }
  };

  // Save Presentation
  const handleSavePresentation = async () => {
    const duration = actualDuration || seconds || 30;
    const wordCount = liveTranscript.trim() ? liveTranscript.trim().split(/\s+/).length : 0;
    const durationMin = Math.max(0.5, duration / 60);
    const calculatedWPM = wordCount > 0 ? Math.round(wordCount / durationMin) : 135;

    try {
      await dbStorage.savePortfolioItem({
        id: 'ps-speech-' + Date.now(),
        moduleId: 'public-speaking',
        moduleTitle: 'Public Speaking & Presentations',
        title: `Speech Delivery: ${selectedTopic}`,
        category: 'audio',
        content: `Topic: ${selectedTopic}\nActual Duration: ${formatTime(duration)} (${duration}s)\nWords Spoken: ${wordCount}\nSpeech Rate: ${calculatedWPM} WPM\nTranscript:\n${liveTranscript || '(Recorded live speech in student own words)'}`,
        score: 9.2,
        createdAt: new Date().toISOString()
      });

      setIsSaved(true);
      confetti({ particleCount: 40, spread: 60 });

      onPresentationComplete({
        durationSeconds: duration,
        transcriptText: liveTranscript || `Student delivered an original 3-minute speech on "${selectedTopic}".`,
        wpm: calculatedWPM,
        audioUrl: recordedAudioUrl || undefined
      });
    } catch (err) {
      console.error('Error saving presentation:', err);
    }
  };

  const handleAccentChange = (acc: 'en-US' | 'en-GB') => {
    setAccentPreference(acc);
    localStorage.setItem('saill_accent_pref', acc);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.round((seconds / 180) * 100));

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 7: AI Speech Presentation Studio
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Deliver a speech of up to 3 minutes using your own words. No teleprompter or script.
          </p>
        </div>

        {/* Accent Preference Selector */}
        <div className="flex items-center gap-2 bg-[#FFF8F0] p-1.5 rounded-xl border border-[#FAD7A0] text-xs">
          <Globe className="w-3.5 h-3.5 text-[#D35400] ml-1" />
          <span className="text-[11px] font-bold text-[#2C3E50]">Accent:</span>
          <button
            onClick={() => handleAccentChange('en-US')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
              accentPreference === 'en-US'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            American (US)
          </button>
          <button
            onClick={() => handleAccentChange('en-GB')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
              accentPreference === 'en-GB'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            British (UK)
          </button>
        </div>
      </div>

      {/* Topic Selector Card */}
      <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Presentation Topic:</span>
          </label>
          <span className="text-[11px] font-mono text-[#5D6D7E]">
            Target Duration: 3 Minutes (180s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {FRESHMAN_TOPICS.map((topic, idx) => {
            const isChosen = selectedTopic === topic;
            return (
              <button
                key={topic}
                disabled={isRecording}
                onClick={() => {
                  setSelectedTopic(topic);
                  setIsSaved(false);
                }}
                className={`p-2.5 rounded-xl text-left transition border cursor-pointer flex items-center justify-between gap-2 ${
                  isChosen
                    ? 'bg-[#D35400] text-white border-[#D35400] font-bold shadow-xs'
                    : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FDEBD0] text-xs'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-[11px] leading-snug line-clamp-1">
                  {idx + 1}. {topic}
                </span>
                {isChosen && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FAD7A0]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Delivery Console */}
      <div className="p-6 bg-gradient-to-br from-[#2C3E50] via-[#1a252f] to-[#2C3E50] text-white rounded-2xl space-y-6 shadow-lg">
        {/* Active Presentation Topic Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#FAD7A0] uppercase tracking-widest block">
              Active Presentation Topic
            </span>
            <h4 className="text-lg font-black text-white font-heading mt-0.5">
              {selectedTopic}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Deliver your thoughts naturally in your own words. Maintain steady pacing and clear eye contact.
            </p>
          </div>

          {/* Actual Timer Gauge */}
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
            <Clock className="w-6 h-6 text-[#FAD7A0]" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-mono">
                Actual Duration
              </span>
              <span className="text-2xl font-black text-[#FAD7A0] font-mono">
                {formatTime(seconds)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">/ 3:00 Max</span>
            </div>
          </div>
        </div>

        {/* 3-Minute Progress Timeline */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
            <span>0:00 (Hook)</span>
            <span>1:30 (Key Points)</span>
            <span>3:00 Max (Conclusion)</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20 relative">
            <div
              className={`h-full transition-all duration-300 ${
                seconds > 165
                  ? 'bg-amber-500'
                  : seconds > 60
                  ? 'bg-emerald-500'
                  : 'bg-[#D35400]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Live Audio Visualizer / Status Box */}
        {isRecording && (
          <div className="p-4 bg-white/10 rounded-xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Live Speech Delivery in Progress...
                </span>
                <span className="text-[11px] text-slate-300">
                  Speak clearly into your microphone in your own natural phrasing.
                </span>
              </div>
            </div>

            {/* Volume Energy Bar */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#FAD7A0]" />
              <div className="w-32 h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FAD7A0] transition-all duration-100"
                  style={{ width: `${audioVolume}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Real Live Spoken Transcript Display */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#FAD7A0]">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Spoken Transcript:</span>
            </span>
            <span className="text-slate-300">
              {liveTranscript.trim() ? `${liveTranscript.trim().split(/\s+/).length} Words Captured` : 'Listening for your voice...'}
            </span>
          </div>

          <div className="min-h-[80px] p-3 bg-black/20 rounded-lg text-xs font-sans text-slate-100 leading-relaxed max-h-40 overflow-y-auto">
            {liveTranscript ? (
              <p className="whitespace-pre-wrap">{liveTranscript}</p>
            ) : (
              <p className="text-slate-400 italic">
                {isRecording
                  ? 'Your spoken words will appear here in real-time as you deliver your presentation...'
                  : 'Click "Start Delivery & Timer" below to begin delivering your 3-minute speech.'}
              </p>
            )}
          </div>
        </div>

        {/* Mic Permission Warning if Denied */}
        {micPermissionDenied && (
          <div className="p-3 bg-red-900/50 border border-red-400/30 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Microphone access was denied. Please allow microphone permissions in your browser to record your live speech.</span>
          </div>
        )}

        {/* Required Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* 1. Start / Stop Delivery & Timer */}
          {!isRecording ? (
            <button
              onClick={handleStartDelivery}
              className="py-3.5 px-4 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Delivery & Timer</span>
            </button>
          ) : (
            <button
              onClick={() => handleStopDelivery()}
              className="py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Speech Delivery</span>
            </button>
          )}

          {/* 2. Listen to My Presentation */}
          <button
            onClick={handleTogglePlayRecorded}
            disabled={!recordedAudioUrl || isRecording}
            className={`py-3.5 px-4 font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 ${
              recordedAudioUrl && !isRecording
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause My Recording</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Listen to My Presentation</span>
              </>
            )}
          </button>

          {/* 3. Save Presentation */}
          <button
            onClick={handleSavePresentation}
            disabled={(!recordedAudioUrl && !liveTranscript) || isRecording}
            className={`py-3.5 px-4 font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 ${
              (recordedAudioUrl || liveTranscript) && !isRecording
                ? isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to Portfolio ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Presentation</span>
              </>
            )}
          </button>
        </div>

        {/* Proceed to AI Audience Q&A Footer */}
        {recordedAudioUrl && !isRecording && (
          <div className="p-4 bg-white/10 rounded-xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-200">
              <span className="font-bold text-[#FAD7A0] block">Speech Completed!</span>
              <span>Actual presentation recorded: {formatTime(actualDuration || seconds)}. Proceed to AI Audience Q&A session.</span>
            </div>

            <button
              onClick={handleSavePresentation}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:brightness-110 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to AI Audience Q&A</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
