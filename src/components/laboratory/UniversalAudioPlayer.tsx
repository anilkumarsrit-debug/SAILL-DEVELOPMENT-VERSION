import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { announceToScreenReader } from '../../utils/a11y';

export interface UniversalAudioPlayerProps {
  audioSource?: string;
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  autoPlay?: boolean;
  showDuration?: boolean;
  showReplay?: boolean;
  variant?: 'card' | 'compact' | 'inline';
  className?: string;
  onEnded?: () => void;
}

export const UniversalAudioPlayer: React.FC<UniversalAudioPlayerProps> = ({
  audioSource,
  title,
  subtitle,
  autoplay = false,
  autoPlay = false,
  showDuration = true,
  showReplay = true,
  variant = 'card',
  className = '',
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

  const shouldAutoplay = autoplay || autoPlay;

  useEffect(() => {
    // Reset states when audioSource changes
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);
    setIsCompleted(false);
    setShowErrorToast(false);
  }, [audioSource]);

  // Format seconds into 0:00 string
  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (!audioSource) {
      setHasError(true);
      setShowErrorToast(true);
      announceToScreenReader('Audio source unavailable', 'assertive');
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    if (hasError) {
      setShowErrorToast(true);
      announceToScreenReader('Audio error: file unavailable', 'assertive');
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      announceToScreenReader('Audio playback paused');
    } else {
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            setIsPlaying(true);
            setIsCompleted(false);
            setHasError(false);
            announceToScreenReader(`Playing audio ${title || ''}`);
          })
          .catch((err) => {
            console.warn('Audio playback failed or file missing:', err);
            setIsLoading(false);
            setIsPlaying(false);
            setHasError(true);
            setShowErrorToast(true);
            announceToScreenReader('Audio playback error', 'assertive');
            setTimeout(() => setShowErrorToast(false), 3000);
          });
      }
    }
  };

  const handleReplay = () => {
    if (!audioRef.current || hasError) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsCompleted(false);
    announceToScreenReader('Replaying audio');
    handlePlayPause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    setCurrentTime(duration);
    announceToScreenReader('Audio playback completed');
    if (onEnded) onEnded();
  };

  const handleAudioError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setHasError(true);
    announceToScreenReader('Audio file error', 'assertive');
  };

  // INLINE VARIANT (For word tables / quick listen buttons)
  if (variant === 'inline') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <audio
          ref={audioRef}
          src={audioSource}
          autoPlay={shouldAutoplay}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          preload="metadata"
        />

        <button
          type="button"
          onClick={isCompleted && showReplay ? handleReplay : handlePlayPause}
          disabled={isLoading}
          aria-label={hasError ? 'Audio unavailable' : isPlaying ? `Pause ${title || 'audio'}` : `Listen to ${title || 'pronunciation'}`}
          className={`px-2.5 py-1.5 min-h-[38px] rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2 ${
            hasError
              ? 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0]/50'
              : isPlaying
              ? 'bg-[#2C3E50] text-white border border-[#2C3E50]'
              : isCompleted
              ? 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]/50'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#D35400] hover:text-white'
          }`}
          title={hasError ? 'Audio will be available soon' : isPlaying ? 'Pause Audio' : 'Listen Pronunciation'}
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin text-[#D35400]" aria-hidden="true" />
          ) : isCompleted && showReplay ? (
            <>
              <RotateCcw className="w-3 h-3 text-[#E67E22]" aria-hidden="true" />
              <span>Replay</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3 h-3 text-[#FAD7A0]" aria-hidden="true" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3 h-3 text-[#E67E22]" aria-hidden="true" />
              <span>Listen</span>
            </>
          )}
        </button>

        {showErrorToast && (
          <div role="alert" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#2C3E50] text-white text-[10px] font-bold rounded-md shadow-md whitespace-nowrap z-20 flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3 h-3 text-[#FAD7A0]" aria-hidden="true" />
            <span>Audio will be available soon.</span>
          </div>
        )}
      </div>
    );
  }

  // COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-xl bg-white border border-[#FAD7A0] shadow-2xs space-y-2 relative ${className}`}>
        <audio
          ref={audioRef}
          src={audioSource}
          autoPlay={shouldAutoplay}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          preload="metadata"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={isCompleted && showReplay ? handleReplay : handlePlayPause}
              disabled={isLoading}
              aria-label={isPlaying ? `Pause ${title || 'audio'}` : `Play ${title || 'audio'}`}
              className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center shrink-0 transition focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2 ${
                isPlaying
                  ? 'bg-[#2C3E50] text-white'
                  : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#D35400] hover:text-white'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : isCompleted && showReplay ? (
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0">
              {title && <h5 className="text-xs font-black text-[#2C3E50] truncate">{title}</h5>}
              {subtitle && <p className="text-[10px] text-[#5D6D7E] truncate">{subtitle}</p>}
            </div>
          </div>

          {showDuration && (
            <span className="text-[10px] font-mono text-[#5D6D7E] shrink-0" aria-label={`Current time ${formatTime(currentTime)} of ${formatTime(duration)}`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={hasError || duration === 0}
            aria-label={`Seek audio position for ${title || 'audio'}`}
            aria-valuemin={0}
            aria-valuemax={duration || 100}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            className="w-full h-2 bg-[#FAD7A0] rounded-lg appearance-none cursor-pointer accent-[#D35400] focus:outline-none focus:ring-2 focus:ring-[#D35400]"
          />
        </div>

        {showErrorToast && (
          <div role="alert" className="p-2 rounded-lg bg-[#FFF8F0] border border-[#FAD7A0] text-[10px] font-bold text-[#D35400] flex items-center gap-1.5 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Audio will be available soon.</span>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT FULL CARD VARIANT
  return (
    <div className={`p-5 rounded-2xl bg-white border border-[#FAD7A0] shadow-2xs space-y-4 relative ${className}`}>
      <audio
        ref={audioRef}
        src={audioSource}
        autoPlay={shouldAutoplay}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFF8F0] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center text-[#D35400] shrink-0" aria-hidden="true">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            {title && <h4 className="text-sm font-black text-[#2C3E50] font-heading">{title}</h4>}
            {subtitle && <p className="text-xs text-[#5D6D7E] font-medium">{subtitle}</p>}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto" aria-live="polite">
          {isCompleted ? (
            <span className="px-2.5 py-1 bg-[#2C3E50] text-white text-[10px] font-bold rounded-lg font-mono">
              Completed
            </span>
          ) : isPlaying ? (
            <span className="px-2.5 py-1 bg-[#D35400] text-white text-[10px] font-bold rounded-lg font-mono">
              Playing
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-bold rounded-lg font-mono">
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar & Time Display */}
      <div className="space-y-1.5">
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={hasError || duration === 0}
            aria-label={`Audio position slider for ${title || 'audio'}`}
            aria-valuemin={0}
            aria-valuemax={duration || 100}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            className="w-full h-2 bg-[#FAD7A0] rounded-lg appearance-none cursor-pointer accent-[#D35400] focus:outline-none focus:ring-2 focus:ring-[#D35400]"
          />
        </div>

        {showDuration && (
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5D6D7E]">
            <span aria-label={`Current playback time ${formatTime(currentTime)}`}>{formatTime(currentTime)}</span>
            <span aria-label={`Total audio duration ${formatTime(duration)}`}>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {/* Playback Control Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause Audio Playback' : 'Start Audio Playback'}
            className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2 ${
              isPlaying
                ? 'bg-[#2C3E50] text-white hover:bg-[#34495E]'
                : 'bg-[#D35400] text-white hover:bg-[#E67E22]'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                <span>Play</span>
              </>
            )}
          </button>

          {showReplay && (
            <button
              type="button"
              onClick={handleReplay}
              disabled={hasError}
              aria-label="Replay audio from beginning"
              className="px-3.5 py-2.5 min-h-[44px] bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0]/50 font-bold text-xs rounded-xl transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Replay</span>
            </button>
          )}
        </div>
      </div>

      {/* Missing file / Error banner */}
      {showErrorToast && (
        <div role="alert" className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] text-xs font-bold text-[#D35400] flex items-center gap-2 animate-fadeIn shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#D35400] shrink-0" aria-hidden="true" />
          <span>Audio will be available soon.</span>
        </div>
      )}
    </div>
  );
};

