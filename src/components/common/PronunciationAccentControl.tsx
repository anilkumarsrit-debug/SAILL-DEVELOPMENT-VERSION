import React from 'react';
import { Globe, Check, Volume2 } from 'lucide-react';
import { useAccentPreference, PronunciationAccent } from '../../services/AccentPreferenceService';

interface PronunciationAccentControlProps {
  className?: string;
  compact?: boolean;
  moduleId?: string;
  onAccentChange?: (accent: PronunciationAccent) => void;
}

export const PronunciationAccentControl: React.FC<PronunciationAccentControlProps> = ({
  className = '',
  compact = false,
  moduleId,
  onAccentChange
}) => {
  const [accent, setAccent] = useAccentPreference();

  const handleSelect = (newAccent: PronunciationAccent) => {
    setAccent(newAccent);
    if (onAccentChange) {
      onAccentChange(newAccent);
    }
  };

  if (compact) {
    return (
      <div
        id="pronunciation-accent-preference-compact"
        className={`inline-flex items-center gap-1.5 p-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs ${className}`}
      >
        <div className="flex items-center gap-1 px-2 text-[#D35400] font-bold text-[11px]">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Accent:</span>
        </div>
        <button
          type="button"
          id="accent-american-btn"
          onClick={() => handleSelect('en-US')}
          className={`px-2.5 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
            accent === 'en-US'
              ? 'bg-[#D35400] text-white shadow-2xs'
              : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
          }`}
          aria-pressed={accent === 'en-US'}
        >
          <span>🇺🇸 American English</span>
          {accent === 'en-US' && <Check className="w-3 h-3 ml-0.5 shrink-0" />}
        </button>
        <button
          type="button"
          id="accent-british-btn"
          onClick={() => handleSelect('en-GB')}
          className={`px-2.5 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
            accent === 'en-GB'
              ? 'bg-[#D35400] text-white shadow-2xs'
              : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
          }`}
          aria-pressed={accent === 'en-GB'}
        >
          <span>🇬🇧 British English</span>
          {accent === 'en-GB' && <Check className="w-3 h-3 ml-0.5 shrink-0" />}
        </button>
      </div>
    );
  }

  return (
    <div
      id="pronunciation-accent-preference-panel"
      className={`srit-card p-4 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#D35400]/10 border border-[#FAD7A0] flex items-center justify-center text-[#D35400] shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#2C3E50]">
              Pronunciation Accent Preference
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#D35400] text-white rounded-md">
              {accent === 'en-US' ? 'US Active' : 'UK Active'}
            </span>
          </div>
          <p className="text-[11px] text-[#5D6D7E] mt-0.5">
            Model audio, phonetics samples, listening passages, and spoken simulations use your selected accent.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          type="button"
          id="accent-american-btn-main"
          onClick={() => handleSelect('en-US')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            accent === 'en-US'
              ? 'bg-[#D35400] text-white shadow-xs font-black'
              : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400] hover:border-[#D35400]'
          }`}
          aria-pressed={accent === 'en-US'}
        >
          <span>🇺🇸 American English</span>
          {accent === 'en-US' && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>

        <button
          type="button"
          id="accent-british-btn-main"
          onClick={() => handleSelect('en-GB')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            accent === 'en-GB'
              ? 'bg-[#D35400] text-white shadow-xs font-black'
              : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400] hover:border-[#D35400]'
          }`}
          aria-pressed={accent === 'en-GB'}
        >
          <span>🇬🇧 British English</span>
          {accent === 'en-GB' && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>
      </div>
    </div>
  );
};
