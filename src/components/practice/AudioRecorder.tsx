import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete?: (audioDataUrl: string, durationSeconds: number) => void;
  targetSampleText?: string;
  autoAnalyze?: boolean;
  moduleTitle?: string;
  onSaveRecording?: (title: string, audioUrl: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  targetSampleText,
  moduleTitle,
  onSaveRecording
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Text to Speech for Target Sample Text
  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBase64(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to Base64 for IndexedDB storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
          if (onRecordingComplete) {
            onRecordingComplete(base64data, recordingTime);
          }
          if (onSaveRecording) {
            onSaveRecording(moduleTitle || 'Audio Practice Submission', base64data);
          }
        };

        // Stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setErrorMessage('Microphone access denied or unavailable. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      {/* Target Sample TTS prompt if provided */}
      {targetSampleText && (
        <div className="mb-4 bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-indigo-200 text-sm">
            <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-medium italic">"{targetSampleText}"</span>
          </div>
          <button
            onClick={() => playTTS(targetSampleText)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Listen Model
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-rose-950/40 border border-rose-800/50 rounded-lg p-3 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-rose-500/20 transition flex items-center gap-2 group"
            >
              <Mic className="w-4 h-4 group-hover:scale-110 transition" />
              <span>{audioUrl ? 'Record Again' : 'Start Recording'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg shadow-md transition flex items-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording</span>
            </button>
          )}

          {/* Time Counter */}
          <div className="text-slate-300 font-mono text-sm bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-700">
            {formatTime(recordingTime)}
          </div>
        </div>

        {/* Live Audio Waves Effect when recording */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-6">
            <span className="w-1 bg-rose-500 rounded-full h-3 animate-bounce"></span>
            <span className="w-1 bg-rose-400 rounded-full h-5 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1 bg-rose-500 rounded-full h-4 animate-bounce [animation-delay:0.4s]"></span>
            <span className="w-1 bg-rose-300 rounded-full h-6 animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-1 bg-rose-500 rounded-full h-2 animate-bounce [animation-delay:0.3s]"></span>
            <span className="text-xs text-rose-400 font-medium ml-2">Recording Live Audio...</span>
          </div>
        )}

        {/* Playback Controls */}
        {audioUrl && !isRecording && (
          <div className="flex items-center gap-3">
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              onClick={togglePlayback}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Back'}</span>
            </button>

            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Audio Saved
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
