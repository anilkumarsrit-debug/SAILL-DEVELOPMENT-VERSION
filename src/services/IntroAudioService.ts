/**
 * SAILL - Virtual English Language Laboratory
 * Professional Background Intro Music Service
 * 
 * Plays real audio asset (/audio/saill_intro.wav) with smooth fade-in/fade-out,
 * user-triggered unlock support, sound preference persistence, and Web Audio fallback.
 * 
 * Duration: ~13 seconds with gentle fade-in and smooth fade-out.
 */

type StateChangeListener = (isPlaying: boolean, soundEnabled: boolean) => void;

class IntroAudioServiceImpl {
  private audioElement: HTMLAudioElement | null = null;
  private isCurrentlyPlaying: boolean = false;
  private fadeInterval: NodeJS.Timeout | null = null;
  private stopTimer: NodeJS.Timeout | null = null;
  private listeners: Set<StateChangeListener> = new Set();

  private readonly STORAGE_KEY_ENABLED = 'saill_intro_sound_enabled';
  private readonly SESSION_KEY_PLAYED = 'saill_intro_music_played';
  private readonly AUDIO_PATH = '/audio/saill_intro.wav';

  /**
   * Check if intro sound is enabled in user preferences (defaults to true)
   */
  public isSoundEnabled(): boolean {
    try {
      const val = localStorage.getItem(this.STORAGE_KEY_ENABLED);
      return val !== 'false'; // Defaults to true
    } catch {
      return true;
    }
  }

  /**
   * Toggle user sound preference
   */
  public setSoundEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_ENABLED, String(enabled));
      if (!enabled && this.isCurrentlyPlaying) {
        this.stopIntroMusic();
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Could not save sound preference:', e);
    }
  }

  public toggleSound(): boolean {
    const next = !this.isSoundEnabled();
    this.setSoundEnabled(next);
    return next;
  }

  /**
   * Check if intro music has already played in this browser session
   */
  public hasPlayedInSession(): boolean {
    try {
      return sessionStorage.getItem(this.SESSION_KEY_PLAYED) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Mark that intro music has played in current session so it doesn't replay on navigation
   */
  public markPlayedInSession(): void {
    try {
      sessionStorage.setItem(this.SESSION_KEY_PLAYED, 'true');
    } catch {
      // Ignore sessionStorage errors in restricted sandboxes
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.isCurrentlyPlaying, this.isSoundEnabled());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const enabled = this.isSoundEnabled();
    this.listeners.forEach((l) => l(this.isCurrentlyPlaying, enabled));
  }

  /**
   * Plays the professional welcome intro music from the real audio asset.
   * Handles smooth fade-in (1.5s) and fade-out (3.0s) at a comfortable low volume.
   */
  public async playIntroMusic(force: boolean = false): Promise<boolean> {
    if (!force && (!this.isSoundEnabled() || this.hasPlayedInSession())) {
      return false;
    }

    if (this.isCurrentlyPlaying && this.audioElement) {
      return true;
    }

    this.cleanup();

    try {
      const audio = new Audio(this.AUDIO_PATH);
      this.audioElement = audio;
      audio.preload = 'auto';
      audio.volume = 0.01; // Start with gentle fade-in

      const targetVolume = 0.35; // Comfortable, soft ambient background volume

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        await playPromise;
      }

      this.markPlayedInSession();
      this.isCurrentlyPlaying = true;
      this.notifyListeners();

      // Smooth Fade-in
      let currentVol = 0.01;
      const fadeInStep = (targetVolume - 0.01) / 30; // 30 steps over ~1.5s
      const fadeInInterval = setInterval(() => {
        if (!this.audioElement || !this.isCurrentlyPlaying) {
          clearInterval(fadeInInterval);
          return;
        }
        currentVol = Math.min(targetVolume, currentVol + fadeInStep);
        this.audioElement.volume = currentVol;
        if (currentVol >= targetVolume) {
          clearInterval(fadeInInterval);
        }
      }, 50);

      // Start fade out at 9.5s
      const fadeOutDelay = 9500;
      setTimeout(() => {
        if (!this.audioElement || !this.isCurrentlyPlaying) return;
        let fadeOutVol = this.audioElement.volume;
        const fadeOutInterval = setInterval(() => {
          if (!this.audioElement || !this.isCurrentlyPlaying) {
            clearInterval(fadeOutInterval);
            return;
          }
          fadeOutVol = Math.max(0, fadeOutVol - 0.015);
          this.audioElement.volume = fadeOutVol;
          if (fadeOutVol <= 0.01) {
            clearInterval(fadeOutInterval);
            this.stopIntroMusic();
          }
        }, 50);
      }, fadeOutDelay);

      // End of playback handler
      audio.onended = () => {
        this.stopIntroMusic();
      };

      // Auto stop safety timer (13.5s)
      this.stopTimer = setTimeout(() => {
        this.stopIntroMusic();
      }, 13500);

      return true;
    } catch (err) {
      console.warn('HTML5 Audio playback encountered autoplay lock, trying Web Audio fallback...', err);
      return this.playWebAudioFallback();
    }
  }

  /**
   * Web Audio API Synthesizer fallback if HTML5 Audio encounters strict policy
   */
  private async playWebAudioFallback(): Promise<boolean> {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return false;

      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.markPlayedInSession();
      this.isCurrentlyPlaying = true;
      this.notifyListeners();

      const startTime = ctx.currentTime + 0.05;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, startTime);
      masterGain.gain.exponentialRampToValueAtTime(0.2, startTime + 1.5);
      masterGain.gain.setValueAtTime(0.2, startTime + 9.5);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 12.8);

      masterGain.connect(ctx.destination);

      // Gentle piano / chords
      const freqs = [146.83, 220.0, 277.18, 369.99, 440.0, 554.37];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startTime + idx * 0.25);
        g.gain.setValueAtTime(0.03, startTime + idx * 0.25);
        g.gain.exponentialRampToValueAtTime(0.0001, startTime + 12.5);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(startTime + idx * 0.25);
        osc.stop(startTime + 12.8);
      });

      this.stopTimer = setTimeout(() => {
        this.isCurrentlyPlaying = false;
        this.notifyListeners();
        ctx.close().catch(() => {});
      }, 13000);

      return true;
    } catch {
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  /**
   * Stops current audio with smooth fast fade to eliminate clicks
   */
  public stopIntroMusic(): void {
    this.cleanup();
    this.isCurrentlyPlaying = false;
    this.notifyListeners();
  }

  private cleanup(): void {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignored
      }
      this.audioElement = null;
    }
  }
}

export const IntroAudioService = new IntroAudioServiceImpl();
