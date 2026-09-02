import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Volume2,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { announceToScreenReader } from '../../utils/a11y';

export interface UniversalRecorderProps {
  title?: string;
  description?: string;
  maximumDuration?: number; // Maximum recording duration in seconds
  showPlayback?: boolean; // Default true
  showDelete?: boolean; // Default true
  showReRecord?: boolean; // Default true
  autoStop?: boolean; // Default true (stop automatically when maximumDuration reached)
  variant?: 'card' | 'compact' | 'inline'; // Default 'card'
  className?: string;
  isProcessingAI?: boolean;
  onSubmitForAI?: (audioBlob: Blob, audioUrl: string) => void;
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  onDeleteRecording?: () => void;
}

export type RecorderStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'paused'
  | 'recorded'
  | 'permission_denied'
  | 'error';

export const UniversalRecorder: React.FC<UniversalRecorderProps> = ({
  title = 'Voice Recording',
  description = 'Click Start Recording to begin.',
  maximumDuration = 60,
  showPlayback = true,
  showDelete = true,
  showReRecord = true,
  autoStop = true,
  variant = 'card',
  className = '',
  isProcessingAI = false,
  onSubmitForAI,
  onRecordingComplete,
  onDeleteRecording
}) => {
  // State variables
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Playback state for the recorded audio
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(0);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio visualizer state (volume level 0-100)
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mm}:${ss}`;
  };

  // Cleanup helper for media stream and timers
  const stopMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setVolumeLevel(0);
  }, []);

  // Revoke blob URL on unmount or reset
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, stopMediaStream]);

  // Audio level visualizer loop
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setVolumeLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch {
      // Ignore visualizer failure silently
    }
  };

  // Start recording handler
  const startRecording = async () => {
    setErrorMessage('');
    setStatus('requesting');

    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('error');
      setErrorMessage('Audio recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Determine best mimeType supported
      let mimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm'
        });
        const url = URL.createObjectURL(finalBlob);

        setAudioBlob(finalBlob);
        setAudioUrl(url);
        setStatus('recorded');
        announceToScreenReader('Voice recording complete and ready for playback or evaluation');

        if (onRecordingComplete) {
          onRecordingComplete(finalBlob, url);
        }
        stopMediaStream();
      };

      mediaRecorder.start(100); // collect 100ms chunks
      setStatus('recording');
      setRecordingTime(0);
      announceToScreenReader('Voice recording started');

      setupAudioVisualizer(stream);

      // Start recording timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const nextTime = prevTime + 1;
          if (autoStop && maximumDuration && nextTime >= maximumDuration) {
            stopRecording();
          }
          return nextTime;
        });
      }, 1000);
    } catch (err: unknown) {
      stopMediaStream();
      const errorObj = err as { name?: string; message?: string };
      if (
        errorObj.name === 'NotAllowedError' ||
        errorObj.name === 'PermissionDeniedError' ||
        errorObj.message?.includes('Permission denied')
      ) {
        setStatus('permission_denied');
        setErrorMessage('Microphone permission is required for pronunciation practice.');
      } else if (errorObj.name === 'NotFoundError') {
        setStatus('error');
        setErrorMessage('No microphone detected. Please connect a microphone and try again.');
      } else {
        setStatus('error');
        setErrorMessage('Could not access microphone. Please check browser settings and try again.');
      }
    }
  };

  // Stop recording handler
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')
    ) {
      mediaRecorderRef.current.stop();
    } else {
      stopMediaStream();
      setStatus('recorded');
    }
  };

  // Pause or resume recording
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } else if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const nextTime = prevTime + 1;
          if (autoStop && maximumDuration && nextTime >= maximumDuration) {
            stopRecording();
          }
          return nextTime;
        });
      }, 1000);
    }
  };

  // Re-record handler
  const handleReRecord = () => {
    if (isPlaying && playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      setIsPlaying(false);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setPlaybackDuration(0);
    setStatus('idle');
    setErrorMessage('');
    startRecording();
  };

  // Delete recording handler
  const handleDelete = () => {
    if (isPlaying && playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      setIsPlaying(false);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setPlaybackDuration(0);
    setStatus('idle');
    setErrorMessage('');

    if (onDeleteRecording) {
      onDeleteRecording();
    }
  };

  // Play / Pause recorded audio
  const handlePlayPauseRecorded = () => {
    if (!playbackAudioRef.current) return;

    if (isPlaying) {
      playbackAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      playbackAudioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Handle recorded audio events
  const handleAudioTimeUpdate = () => {
    if (playbackAudioRef.current) {
      setPlaybackTime(playbackAudioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (playbackAudioRef.current) {
      setPlaybackDuration(playbackAudioRef.current.duration || recordingTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleSeekPlayback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setPlaybackTime(newTime);
    if (playbackAudioRef.current) {
      playbackAudioRef.current.currentTime = newTime;
    }
  };

  // COMPACT / INLINE VARIANT
  if (variant === 'compact' || variant === 'inline') {
    return (
      <div className={`p-3 rounded-xl bg-white border border-[#FAD7A0] shadow-2xs space-y-2.5 ${className}`}>
        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={playbackAudioRef}
            src={audioUrl}
            onTimeUpdate={handleAudioTimeUpdate}
            onLoadedMetadata={handleAudioLoadedMetadata}
            onEnded={handleAudioEnded}
          />
        )}

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                status === 'recording'
                  ? 'bg-[#D35400] text-white animate-pulse'
                  : status === 'recorded'
                  ? 'bg-[#2C3E50] text-white'
                  : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-black text-[#2C3E50] truncate">{title}</h5>
              <p className="text-[10px] text-[#5D6D7E] truncate font-medium">
                {status === 'recording'
                  ? '🔴 Recording in progress...'
                  : status === 'recorded'
                  ? '✓ Recording Completed'
                  : description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className="text-[10px] font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0] shrink-0">
            {status === 'recording' ? formatTime(recordingTime) : status === 'recorded' ? formatTime(playbackDuration || recordingTime) : 'Ready'}
          </span>
        </div>

        {/* Permission Denied / Error State */}
        {(status === 'permission_denied' || status === 'error') && (
          <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#D35400] font-bold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage || 'Microphone error'}</span>
            </div>
            <button
              type="button"
              onClick={startRecording}
              className="px-2.5 py-1 bg-[#D35400] text-white text-[10px] font-bold rounded-md hover:bg-[#E67E22] transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        {status === 'idle' && (
          <button
            type="button"
            onClick={startRecording}
            className="w-full py-2 bg-[#D35400] text-white text-xs font-bold rounded-lg hover:bg-[#E67E22] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Start Recording</span>
          </button>
        )}

        {status === 'requesting' && (
          <div className="w-full py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Requesting Mic Permission...</span>
          </div>
        )}

        {status === 'recording' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stopRecording}
              className="flex-1 py-1.5 bg-[#D35400] text-white text-xs font-bold rounded-lg hover:bg-[#E67E22] transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording</span>
            </button>
            <button
              type="button"
              onClick={togglePauseRecording}
              className="px-3 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] text-xs font-bold rounded-lg hover:bg-[#FAD7A0]/50 transition cursor-pointer"
            >
              Pause
            </button>
          </div>
        )}

        {status === 'recorded' && (
          <div className="space-y-2">
            {/* Playback seeker */}
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max={playbackDuration || recordingTime || 100}
                value={playbackTime}
                onChange={handleSeekPlayback}
                className="w-full h-1 bg-[#FAD7A0] rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

            <div className="flex items-center justify-between gap-1.5">
              {showPlayback && (
                <button
                  type="button"
                  onClick={handlePlayPauseRecorded}
                  className="px-3 py-1 bg-[#2C3E50] text-white text-xs font-bold rounded-lg hover:bg-[#34495E] transition flex items-center gap-1 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              )}

              {showReRecord && (
                <button
                  type="button"
                  onClick={handleReRecord}
                  className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[11px] font-bold rounded-lg hover:bg-[#FAD7A0]/50 transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-record</span>
                </button>
              )}

              {showDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-50 transition flex items-center gap-1 cursor-pointer"
                  title="Delete Recording"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT FULL CARD VARIANT
  return (
    <div className={`p-6 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-5 relative overflow-hidden ${className}`}>
      {/* Hidden Audio Element for Recorded Playback */}
      {audioUrl && (
        <audio
          ref={playbackAudioRef}
          src={audioUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onEnded={handleAudioEnded}
        />
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFF8F0] pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              status === 'recording'
                ? 'bg-[#D35400] text-white ring-4 ring-[#D35400]/20 animate-pulse'
                : status === 'recorded'
                ? 'bg-[#2C3E50] text-white'
                : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400]'
            }`}
          >
            <Mic className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-base font-black text-[#2C3E50] font-heading">{title}</h4>
            <p className="text-xs text-[#5D6D7E] font-medium mt-0.5">{description}</p>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {status === 'recording' && (
            <span className="px-3 py-1 bg-[#D35400] text-white text-xs font-bold rounded-lg font-mono flex items-center gap-1.5 animate-pulse shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-white shrink-0 animate-ping" />
              <span>🔴 Recording...</span>
            </span>
          )}

          {status === 'paused' && (
            <span className="px-3 py-1 bg-[#E67E22] text-white text-xs font-bold rounded-lg font-mono flex items-center gap-1">
              <span>⏸ Paused</span>
            </span>
          )}

          {status === 'recorded' && (
            <span className="px-3 py-1 bg-[#2C3E50] text-white text-xs font-bold rounded-lg font-mono flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FAD7A0]" />
              <span>✓ Recording Completed</span>
            </span>
          )}

          {status === 'idle' && (
            <span className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg font-mono">
              Ready
            </span>
          )}

          {(status === 'permission_denied' || status === 'error') && (
            <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg font-mono">
              Error
            </span>
          )}
        </div>
      </div>

      {/* ERROR / PERMISSION DENIED BANNER */}
      {(status === 'permission_denied' || status === 'error') && (
        <div className="p-4 bg-[#FFF8F0] border-2 border-[#D35400] rounded-xl space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#D35400] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-black text-[#2C3E50] font-heading">
                Microphone Access Required
              </h5>
              <p className="text-xs text-[#5D6D7E] leading-relaxed">
                {errorMessage || 'Microphone permission is required for pronunciation practice.'}
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#E67E22] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* RECORDING VISUALIZER & TIMER PANEL */}
      {(status === 'recording' || status === 'paused' || status === 'idle' || status === 'requesting') && (
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl flex flex-col items-center justify-center space-y-3 text-center relative">
          {/* Animated Waveform Bars */}
          <div className="flex items-center justify-center gap-1.5 h-10 my-1">
            {[40, 75, 50, 90, 60, 100, 70, 85, 45, 95, 65, 30].map((height, i) => {
              const isActive = status === 'recording';
              // Dynamic height scaling based on volumeLevel when active
              const barScale = isActive ? Math.max(0.25, (volumeLevel / 100) * (height / 100) + 0.3) : 0.2;
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isActive ? 'bg-[#D35400]' : 'bg-[#FAD7A0]'
                  }`}
                  style={{
                    height: `${Math.round(40 * barScale)}px`
                  }}
                />
              );
            })}
          </div>

          {/* Timer Display */}
          <div className="font-mono text-2xl font-black text-[#2C3E50] tracking-wider flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D35400]" />
            <span>{formatTime(recordingTime)}</span>
            {maximumDuration && (
              <span className="text-xs font-sans text-[#5D6D7E] font-medium">
                / {formatTime(maximumDuration)}
              </span>
            )}
          </div>

          {/* Status Hint */}
          <p className="text-xs text-[#5D6D7E] font-medium">
            {status === 'idle' && 'Click Start Recording to begin.'}
            {status === 'requesting' && 'Accessing microphone... Please allow browser permission.'}
            {status === 'recording' && 'Speak clearly into your microphone.'}
            {status === 'paused' && 'Recording paused. Click Resume to continue.'}
          </p>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {status === 'idle' && (
              <button
                type="button"
                onClick={startRecording}
                className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl hover:bg-[#E67E22] transition flex items-center gap-2 shadow-sm cursor-pointer scale-105"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            )}

            {status === 'requesting' && (
              <button
                disabled
                type="button"
                className="px-6 py-2.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Starting...</span>
              </button>
            )}

            {(status === 'recording' || status === 'paused') && (
              <>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl hover:bg-[#E67E22] transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Recording</span>
                </button>

                <button
                  type="button"
                  onClick={togglePauseRecording}
                  className="px-4 py-2.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]/50 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {status === 'paused' ? 'Resume' : 'Pause'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* COMPLETED RECORDING PLAYBACK PANEL */}
      {status === 'recorded' && (
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-[#2C3E50]">
            <span className="flex items-center gap-1.5 text-[#D35400]">
              <CheckCircle2 className="w-4 h-4 text-[#D35400]" />
              <span>✓ Recording Completed</span>
            </span>
            <span className="font-mono text-[#5D6D7E]">
              Duration: {formatTime(playbackDuration || recordingTime)}
            </span>
          </div>

          {/* Seek Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={playbackDuration || recordingTime || 100}
              value={playbackTime}
              onChange={handleSeekPlayback}
              className="w-full h-1.5 bg-[#FAD7A0] rounded-lg appearance-none cursor-pointer accent-[#D35400]"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-[#5D6D7E]">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(playbackDuration || recordingTime)}</span>
            </div>
          </div>

          {/* Action Buttons: Play, Re-record, Delete, Submit */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#FAD7A0]/40">
            <div className="flex flex-wrap items-center gap-2">
              {showPlayback && (
                <button
                  type="button"
                  disabled={isProcessingAI}
                  onClick={handlePlayPauseRecorded}
                  className="px-4 py-2 bg-[#2C3E50] text-white text-xs font-extrabold rounded-xl hover:bg-[#34495E] disabled:opacity-50 transition flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Play Recording</span>
                    </>
                  )}
                </button>
              )}

              {onSubmitForAI && audioBlob && audioUrl && (
                <button
                  type="button"
                  disabled={isProcessingAI}
                  onClick={() => onSubmitForAI(audioBlob, audioUrl)}
                  className="px-4 py-2 bg-[#D35400] text-white hover:bg-[#E67E22] disabled:opacity-50 text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FAD7A0]" />
                      <span>Submit Recording</span>
                    </>
                  )}
                </button>
              )}

              {showReRecord && (
                <button
                  type="button"
                  disabled={isProcessingAI}
                  onClick={handleReRecord}
                  className="px-3.5 py-2 bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF8F0] disabled:opacity-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              )}
            </div>

            {showDelete && (
              <button
                type="button"
                disabled={isProcessingAI}
                onClick={handleDelete}
                className="px-3.5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
