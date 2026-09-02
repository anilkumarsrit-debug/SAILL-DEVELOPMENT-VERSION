import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Pause, RefreshCw } from 'lucide-react';

interface PWAudioPlaceholderProps {
  title: string;
  transcript: string;
  category?: 'Welcome' | 'Instructions' | 'Encouragement' | 'Completion';
}

export const PWAudioPlaceholder: React.FC<PWAudioPlaceholderProps> = ({
  title,
  transcript,
  category = 'Instructions'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getBadgeColor = () => {
    switch (category) {
      case 'Welcome':
        return 'bg-[#FFF8F0] border-[#FAD7A0] text-[#D35400]';
      case 'Encouragement':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Completion':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 sm:p-4 my-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggleSpeech}
          className={`p-2.5 rounded-xl transition shrink-0 flex items-center justify-center shadow-xs ${
            isPlaying
              ? 'bg-[#D35400] text-white animate-pulse'
              : 'bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF8F0]'
          }`}
          title={isPlaying ? 'Pause Audio' : 'Listen to Audio Guidance'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor()}`}>
              🔊 Audio Guidance: {category}
            </span>
            <span className="text-xs font-bold text-[#2C3E50]">{title}</span>
          </div>
          <p className="text-xs text-[#5D6D7E] italic leading-relaxed">
            "{transcript}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={toggleSpeech}
          className="text-xs font-bold text-[#D35400] hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isPlaying ? 'Pause' : 'Listen'}
        </button>
      </div>
    </div>
  );
};
