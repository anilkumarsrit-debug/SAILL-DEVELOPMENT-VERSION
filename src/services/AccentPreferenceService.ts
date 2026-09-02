import { useState, useEffect, useCallback } from 'react';

export type PronunciationAccent = 'en-US' | 'en-GB';

const STORAGE_KEY = 'saill_pronunciation_accent';
const ACCENT_CHANGE_EVENT = 'saill_pronunciation_accent_change';

export class AccentPreferenceService {
  private static cachedAccent: PronunciationAccent | null = null;

  public static getAccent(): PronunciationAccent {
    if (this.cachedAccent) {
      return this.cachedAccent;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en-US' || saved === 'en-GB') {
        this.cachedAccent = saved;
        return saved;
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    this.cachedAccent = 'en-US';
    return 'en-US';
  }

  public static setAccent(accent: PronunciationAccent): void {
    this.cachedAccent = accent;
    try {
      localStorage.setItem(STORAGE_KEY, accent);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(ACCENT_CHANGE_EVENT, { detail: { accent } })
      );
    }
  }

  public static subscribe(callback: (accent: PronunciationAccent) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ accent: PronunciationAccent }>;
      if (customEvent.detail?.accent) {
        callback(customEvent.detail.accent);
      } else {
        callback(this.getAccent());
      }
    };

    window.addEventListener(ACCENT_CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener(ACCENT_CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }

  /**
   * Speak text using Web Speech API with selected accent
   */
  public static speak(
    text: string,
    options?: {
      accent?: PronunciationAccent;
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available');
      options?.onError?.(new Error('Speech synthesis not available'));
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const accent = options?.accent || this.getAccent();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent;
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      // Select suitable voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = accent.toLowerCase();
        const matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase() === langPrefix ||
            v.lang.toLowerCase().startsWith(langPrefix.replace('-', '_')) ||
            v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
        );
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      if (options?.onEnd) {
        utterance.onend = () => options.onEnd?.();
      }

      if (options?.onError) {
        utterance.onerror = (e) => options.onError?.(e);
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech playback error:', err);
      options?.onError?.(err);
    }
  }

  public static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * Reusable React Hook for Pronunciation Accent
 */
export function useAccentPreference(): [
  PronunciationAccent,
  (accent: PronunciationAccent) => void
] {
  const [accent, setAccentState] = useState<PronunciationAccent>(() =>
    AccentPreferenceService.getAccent()
  );

  useEffect(() => {
    const unsubscribe = AccentPreferenceService.subscribe((newAccent) => {
      setAccentState(newAccent);
    });
    return unsubscribe;
  }, []);

  const updateAccent = useCallback((newAccent: PronunciationAccent) => {
    AccentPreferenceService.setAccent(newAccent);
    setAccentState(newAccent);
  }, []);

  return [accent, updateAccent];
}
