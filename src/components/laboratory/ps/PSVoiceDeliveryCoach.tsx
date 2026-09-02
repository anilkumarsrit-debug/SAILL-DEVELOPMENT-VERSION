import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Gauge,
  HelpCircle,
  FileEdit
} from 'lucide-react';

interface DrillPrompt {
  id: string;
  title: string;
  category: string;
  text: string;
  targetWPM: string;
  focusArea: string;
}

export const PSVoiceDeliveryCoach: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [drillMode, setDrillMode] = useState<'mic' | 'manual'>('mic');

  // Real Speech Analysis State
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'recording' | 'success' | 'unreliable' | 'permission_denied'>('idle');
  const [detectedTranscript, setDetectedTranscript] = useState<string>('');
  const [manualTranscriptInput, setManualTranscriptInput] = useState<string>('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);

  // Performance Metrics
  const [actualWPM, setActualWPM] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [fillerCount, setFillerCount] = useState<number>(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [promptAccuracy, setPromptAccuracy] = useState<number>(0);
  const [audioVolumeEnergy, setAudioVolumeEnergy] = useState<number>(0);

  // Audio & Recognition References
  const timerRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const peakVolumeRef = useRef<number>(0);
  const totalVolumeSamplesRef = useRef<number[]>([]);

  const practicePrompts: DrillPrompt[] = [
    {
      id: 'p-1',
      title: 'Technical Pitch Opening',
      category: 'Hook & Problem',
      text: 'Good morning judges. Our team designed an automated microgrid optimization platform that reduces energy loss by 28 percent using machine learning predictions.',
      targetWPM: '135–145 WPM',
      focusArea: 'Vocal projection and clear number pronunciation (28 percent).'
    },
    {
      id: 'p-2',
      title: 'Vocal Modulation & Emphasis Drill',
      category: 'Inflection & Pace',
      text: 'When we deployed the algorithm in our campus laboratory, memory overhead dropped significantly, while throughput reached over ten thousand requests per second!',
      targetWPM: '130–140 WPM',
      focusArea: 'Raise pitch on "significantly" and emphasize "ten thousand".'
    },
    {
      id: 'p-3',
      title: 'Q&A Confidence & Silent Pausing',
      category: 'Pause Control',
      text: 'That is a crucial trade-off question. We chose asynchronous message queues precisely to ensure that temporary database latency does not impact end-user transactions.',
      targetWPM: '125–135 WPM',
      focusArea: 'Insert a 1-second silent breath after "question" instead of saying "um".'
    }
  ];

  const activePrompt = practicePrompts[selectedPromptIndex];

  // Clean up media and recognition on unmount
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

  // Analyze spoken transcript for real metrics
  const analyzeRealSpeechPerformance = (transcript: string, durationSec: number, audioEnergyPeak: number) => {
    const trimmed = transcript.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const detectedWordsCount = words.length;

    // Check if speech was reliably detected
    // If no words recognized AND duration was very short or audio energy was zero/near silent
    if (detectedWordsCount === 0 || durationSec < 1.2 || (detectedWordsCount === 0 && audioEnergyPeak < 0.05)) {
      setDetectionStatus('unreliable');
      setActualWPM(0);
      setWordCount(0);
      setFillerCount(0);
      setDetectedFillers([]);
      setPromptAccuracy(0);
      return;
    }

    // Speech detected successfully! Calculate real metrics
    setDetectionStatus('success');
    setWordCount(detectedWordsCount);

    const durationMin = Math.max(0.02, durationSec / 60);
    const calculatedPace = Math.round(detectedWordsCount / durationMin);
    setActualWPM(calculatedPace);

    // Detect actual filler words from student's transcript
    const fillerRegex = /\b(um|uh|er|ah|like|you know|basically|actually|literally|so yeah|right|i mean|sort of|kind of)\b/gi;
    const fillerMatches = trimmed.match(fillerRegex) || [];
    setFillerCount(fillerMatches.length);
    const uniqueFillers = Array.from(new Set(fillerMatches.map((m) => m.toLowerCase())));
    setDetectedFillers(uniqueFillers);

    // Calculate prompt match accuracy
    const promptWords = activePrompt.text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const spokenLower = trimmed.toLowerCase();
    let matchedCount = 0;
    promptWords.forEach((pw) => {
      if (spokenLower.includes(pw)) matchedCount++;
    });
    const accuracyPct = Math.min(100, Math.round((matchedCount / promptWords.length) * 100));
    setPromptAccuracy(accuracyPct);
  };

  const handleStartRecording = async () => {
    // Reset state
    setDetectionStatus('recording');
    setSecondsElapsed(0);
    setDetectedTranscript('');
    setRecordedAudioUrl(null);
    setActualWPM(0);
    setWordCount(0);
    setFillerCount(0);
    setDetectedFillers([]);
    setPromptAccuracy(0);
    audioChunksRef.current = [];
    peakVolumeRef.current = 0;
    totalVolumeSamplesRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Set up Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const monitorVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioVolumeEnergy(normalized);

        const energyFraction = avg / 255;
        if (energyFraction > peakVolumeRef.current) {
          peakVolumeRef.current = energyFraction;
        }
        totalVolumeSamplesRef.current.push(energyFraction);

        animFrameRef.current = requestAnimationFrame(monitorVolume);
      };
      monitorVolume();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start(200);

      // Set up SpeechRecognition if supported
      let accumulatedTranscript = '';
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentSessionText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSessionText += event.results[i][0].transcript + ' ';
          }
          accumulatedTranscript = currentSessionText.trim();
          setDetectedTranscript(accumulatedTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      // Start elapsed timer
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setDetectionStatus('permission_denied');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop audio stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Calculate final duration and audio peak
    const duration = Math.max(1, secondsElapsed);
    const peak = peakVolumeRef.current;

    // Use current transcript in state
    // Give a short 300ms buffer for final recognition callbacks to settle
    setTimeout(() => {
      setDetectedTranscript((finalText) => {
        analyzeRealSpeechPerformance(finalText, duration, peak);
        return finalText;
      });
    }, 350);
  };

  const handleAnalyzeManualInput = () => {
    if (!manualTranscriptInput.trim()) {
      setDetectionStatus('unreliable');
      return;
    }
    const duration = Math.max(3, secondsElapsed || 10);
    setDetectedTranscript(manualTranscriptInput.trim());
    analyzeRealSpeechPerformance(manualTranscriptInput.trim(), duration, 0.8);
  };

  const handleToggleAudioPlayback = () => {
    if (!recordedAudioRef.current) return;
    if (isPlayingRecorded) {
      recordedAudioRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 4: Voice & Delivery Mechanics Coach
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Real Voice Analysis: Detects actual vocal audio, calculates real Speaking Pace (WPM), and tracks actual filler words.
          </p>
        </div>

        {/* Drill Mode Toggle */}
        <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              setDrillMode('mic');
              setDetectionStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              drillMode === 'mic' ? 'bg-[#D35400] text-white shadow-2xs' : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Microphone Voice Drill</span>
          </button>

          <button
            onClick={() => {
              setDrillMode('manual');
              setDetectionStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              drillMode === 'manual' ? 'bg-[#D35400] text-white shadow-2xs' : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Text / Manual Analysis</span>
          </button>
        </div>
      </div>

      {/* 4 Vocal Delivery Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="font-bold text-[#D35400] text-[11px] block">1. Ideal Speaking Pace</span>
          <p className="text-xs font-mono font-bold text-[#2C3E50]">130 – 150 WPM</p>
          <p className="text-[10px] text-[#5D6D7E]">Prevents rushing technical terms or sounding sluggish.</p>
        </div>

        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="font-bold text-[#D35400] text-[11px] block">2. Pitch Modulation</span>
          <p className="text-xs font-mono font-bold text-[#2C3E50]">Dynamic Range</p>
          <p className="text-[10px] text-[#5D6D7E]">Vary intonation to emphasize key engineering statistics.</p>
        </div>

        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="font-bold text-[#D35400] text-[11px] block">3. Strategic Pausing</span>
          <p className="text-xs font-mono font-bold text-[#2C3E50]">1–2 Sec Silence</p>
          <p className="text-[10px] text-[#5D6D7E]">Replace "um" / "uh" with silent diaphragmatic breathing.</p>
        </div>

        <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="font-bold text-[#D35400] text-[11px] block">4. Volume Projection</span>
          <p className="text-xs font-mono font-bold text-[#2C3E50]">Diaphragmatic</p>
          <p className="text-[10px] text-[#5D6D7E]">Project voice clearly to reach the back auditorium row.</p>
        </div>
      </div>

      {/* Main Voice Drill Studio Card */}
      <div className="p-5 bg-gradient-to-br from-[#2C3E50] via-[#1f2d3a] to-[#1a252f] text-white rounded-2xl space-y-4 shadow-lg border border-[#FAD7A0]/30">
        {/* Top Bar on Studio */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAD7A0]">
              Speech Delivery & Acoustics Engine
            </span>
            <h4 className="text-base font-extrabold text-white">Live Microphone Voice Drill & WPM Analyzer</h4>
          </div>

          {/* Drill Prompt Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {practicePrompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPromptIndex(idx);
                  setDetectionStatus('idle');
                  setDetectedTranscript('');
                  setSecondsElapsed(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  selectedPromptIndex === idx ? 'bg-[#D35400] text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Drill {idx + 1}: {p.category}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Target Prompt */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#FAD7A0]">
            <span className="font-bold uppercase">Target Prompt: {activePrompt.title}</span>
            <span>Target Pace: {activePrompt.targetWPM}</span>
          </div>
          <p className="text-xs sm:text-sm text-white leading-relaxed font-sans font-medium">
            "{activePrompt.text}"
          </p>
          <div className="text-[10px] text-slate-300 font-mono pt-1">
            <strong className="text-[#FAD7A0]">Focus:</strong> {activePrompt.focusArea}
          </div>
        </div>

        {/* Live Audio Energy VU Meter (When Recording) */}
        {isRecording && (
          <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1.5 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Listening to Live Microphone Voice Input...</span>
              </span>
              <span className="text-slate-300">Level: {audioVolumeEnergy}%</span>
            </div>
            {/* Energy Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#D35400] transition-all duration-75"
                style={{ width: `${Math.max(5, audioVolumeEnergy)}%` }}
              ></div>
            </div>
            {detectedTranscript && (
              <p className="text-[11px] text-slate-300 italic truncate pt-1">
                Transcribing: "{detectedTranscript}"
              </p>
            )}
          </div>
        )}

        {/* Permission Denied Notice */}
        {detectionStatus === 'permission_denied' && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-700/80 rounded-xl space-y-1 text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Microphone Access Blocked</span>
            </div>
            <p className="text-[11px] text-rose-200">
              Please allow microphone access in your browser settings to record, or switch to the <strong>Text / Manual Analysis</strong> tab above.
            </p>
          </div>
        )}

        {/* Manual Input Mode Form */}
        {drillMode === 'manual' && (
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
            <label className="text-[11px] font-bold text-[#FAD7A0] block">
              Enter or Paste Your Spoken Speech Transcript:
            </label>
            <textarea
              rows={3}
              value={manualTranscriptInput}
              onChange={(e) => setManualTranscriptInput(e.target.value)}
              placeholder="Paste what you spoke aloud or type your speech to analyze real WPM pace and filler words..."
              className="w-full p-2.5 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#D35400]"
            />
            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] font-mono text-slate-300">
                Duration Estimate: 15s • Word count: {manualTranscriptInput.trim().split(/\s+/).filter(Boolean).length}
              </div>
              <button
                onClick={handleAnalyzeManualInput}
                className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition"
              >
                Analyze Speech Metrics
              </button>
            </div>
          </div>
        )}

        {/* Live Controls Bar (Mic Mode) */}
        {drillMode === 'mic' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Live Voice Drill</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Analyze Real Speech</span>
                </button>
              )}

              <div className="text-xs font-mono bg-white/10 px-3 py-2 rounded-xl border border-white/10 shrink-0">
                <span className="text-slate-300">Timer: </span>
                <span className="text-[#FAD7A0] font-bold">{secondsElapsed}s</span>
              </div>
            </div>

            {/* Live Metrics Display */}
            <div className="flex items-center gap-4 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/10 w-full sm:w-auto justify-around">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Detected Pace</span>
                <span className={`font-bold ${actualWPM >= 120 && actualWPM <= 160 ? 'text-emerald-400' : 'text-[#FAD7A0]'}`}>
                  {detectionStatus === 'success' ? `${actualWPM} WPM` : '---'}
                </span>
              </div>
              <div className="border-l border-white/20 pl-3">
                <span className="text-[10px] text-slate-400 block uppercase">Real Fillers</span>
                <span className={`font-bold ${fillerCount === 0 && detectionStatus === 'success' ? 'text-emerald-400' : 'text-[#FAD7A0]'}`}>
                  {detectionStatus === 'success' ? `${fillerCount} Detected` : '---'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1. UNRELIABLE / NO SPEECH DETECTED WARNING CARD */}
        {detectionStatus === 'unreliable' && (
          <div className="p-4 bg-amber-950/80 border border-amber-600/80 rounded-xl space-y-2 text-xs text-amber-200 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Speech could not be reliably detected. Please record again.</span>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed">
              No clear vocal audio or speech transcript was recognized during the recording. To ensure accurate WPM and filler scoring:
            </p>
            <ul className="text-[11px] text-amber-200/90 list-disc list-inside space-y-0.5">
              <li>Ensure your microphone permissions are allowed and your input is not muted.</li>
              <li>Speak clearly into the microphone at normal volume for at least 3–5 seconds.</li>
              <li>Or switch to <strong>Text / Manual Analysis</strong> above if using a device without microphone support.</li>
            </ul>
            <button
              onClick={() => {
                setDetectionStatus('idle');
                setSecondsElapsed(0);
              }}
              className="mt-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px] transition inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Recording Again</span>
            </button>
          </div>
        )}

        {/* 2. SUCCESSFUL REAL PERFORMANCE FEEDBACK */}
        {detectionStatus === 'success' && (
          <div className="p-4 bg-white/10 border border-white/15 rounded-xl space-y-3 text-xs text-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#FAD7A0] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D35400]" />
                <span>Real Voice Delivery Performance Report</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
                Verified Speech Analysis
              </span>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-black/30 rounded-lg border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Actual Speaking Rate</span>
                <span className="text-base font-black text-[#FAD7A0]">{actualWPM} WPM</span>
                <span className="text-[10px] text-slate-300 block">
                  {actualWPM >= 130 && actualWPM <= 150
                    ? 'Target Pace (Optimal)'
                    : actualWPM < 130
                    ? 'Slow Pace (< 130 WPM)'
                    : 'Fast Pace (> 150 WPM)'}
                </span>
              </div>

              <div className="p-2.5 bg-black/30 rounded-lg border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Actual Filler Words</span>
                <span className={`text-base font-black ${fillerCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {fillerCount} Detected
                </span>
                <span className="text-[10px] text-slate-300 block truncate">
                  {detectedFillers.length > 0 ? detectedFillers.join(', ') : 'Zero verbal fillers'}
                </span>
              </div>

              <div className="p-2.5 bg-black/30 rounded-lg border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Spoken Word Count</span>
                <span className="text-base font-black text-white">{wordCount} Words</span>
                <span className="text-[10px] text-slate-300 block">
                  Duration: {secondsElapsed}s • Accuracy: {promptAccuracy}%
                </span>
              </div>
            </div>

            {/* Spoken Transcript Showcase */}
            <div className="p-3 bg-black/40 rounded-lg border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-[#FAD7A0] uppercase block">
                Detected Spoken Transcript:
              </span>
              <p className="text-xs text-white leading-relaxed font-sans italic">
                "{detectedTranscript}"
              </p>
            </div>

            {/* Tailored Performance Guidance */}
            <div className="space-y-1.5 text-[11px] text-slate-200">
              <p className="leading-relaxed">
                <strong>Pace Evaluation:</strong>{' '}
                {actualWPM >= 125 && actualWPM <= 155
                  ? `Your speaking pace was ${actualWPM} WPM, which is within the optimal 130–150 WPM target for engineering and technical presentations.`
                  : actualWPM < 125
                  ? `Your speaking pace was ${actualWPM} WPM (on the slower side). Practice maintaining forward flow to keep audience attention.`
                  : `Your speaking pace was ${actualWPM} WPM (fast). Slow down slightly to give listeners time to digest complex technical points.`}
              </p>

              <p className="leading-relaxed">
                <strong>Filler Word Control:</strong>{' '}
                {fillerCount === 0
                  ? 'Outstanding pause discipline! Zero filler words detected in your delivery.'
                  : fillerCount <= 2
                  ? `Low filler frequency (${fillerCount} detected: "${detectedFillers.join('", "')}"). Practice replacing pauses with 1-second silent breathing.`
                  : `Detected ${fillerCount} filler occurrences ("${detectedFillers.join('", "')}"). Focus on slowing down and pausing in silence rather than using vocal crutches.`}
              </p>
            </div>

            {/* Audio Playback Controls */}
            {recordedAudioUrl && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <audio
                  ref={recordedAudioRef}
                  src={recordedAudioUrl}
                  onEnded={() => setIsPlayingRecorded(false)}
                  className="hidden"
                />
                <button
                  onClick={handleToggleAudioPlayback}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {isPlayingRecorded ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingRecorded ? 'Pause Recording' : 'Listen to Your Recording'}</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400">Audio Recorded: {secondsElapsed}s</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
