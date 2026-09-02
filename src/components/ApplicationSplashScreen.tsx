import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Mic,
  Cpu,
  Volume2,
  VolumeX,
  Award,
  ArrowRight,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { IntroAudioService } from '../services/IntroAudioService';

interface ApplicationSplashScreenProps {
  onComplete: () => void;
}

export const ApplicationSplashScreen: React.FC<ApplicationSplashScreenProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing SAILL Neural Engine...');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => IntroAudioService.isSoundEnabled());
  const [isPlaying, setIsPlaying] = useState<boolean>(() => IntroAudioService.isPlaying());

  // Listen to Intro Audio state & attempt playback on mount
  useEffect(() => {
    const unsubscribe = IntroAudioService.subscribe((playing, enabled) => {
      setIsPlaying(playing);
      setSoundEnabled(enabled);
    });

    // Auto-attempt playback when starting screen mounts
    IntroAudioService.playIntroMusic(false).catch(() => {});

    // Try again on first user gesture if browser autoplay blocked it
    const handleFirstGesture = () => {
      if (IntroAudioService.isSoundEnabled() && !IntroAudioService.isPlaying() && !IntroAudioService.hasPlayedInSession()) {
        IntroAudioService.playIntroMusic(false).catch(() => {});
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      unsubscribe();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleToggleSound = () => {
    const next = IntroAudioService.toggleSound();
    setSoundEnabled(next);
    if (next) {
      IntroAudioService.playIntroMusic(true).catch(() => {});
    } else {
      IntroAudioService.stopIntroMusic();
    }
  };

  const handleFinish = () => {
    IntroAudioService.stopIntroMusic();
    onComplete();
  };

  // Auto-advance screens 1 -> 2 -> 3 -> 4
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentScreen === 1) {
      timer = setTimeout(() => {
        setCurrentScreen(2);
      }, 2600);
    } else if (currentScreen === 2) {
      timer = setTimeout(() => {
        setCurrentScreen(3);
      }, 2600);
    } else if (currentScreen === 3) {
      timer = setTimeout(() => {
        setCurrentScreen(4);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Screen 4 progress bar logic
  useEffect(() => {
    if (currentScreen !== 4) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleFinish();
          }, 350);
          return 100;
        }
        const next = prev + 3;
        if (next < 25) {
          setStatusMessage('Initializing SAILL Academic Engine...');
        } else if (next < 55) {
          setStatusMessage('Loading R26 Communicative English Syllabus...');
        } else if (next < 85) {
          setStatusMessage('Preparing AI Speech & Phonetics Studio...');
        } else {
          setStatusMessage('Environment Ready! Launching Platform...');
        }
        return next;
      });
    }, 55);

    return () => clearInterval(interval);
  }, [currentScreen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2C3E50] text-white p-6 overflow-hidden select-none"
    >
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-[#D35400]/25 via-[#E67E22]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-[#FAD7A0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Action Controls: Sound ON/OFF & Skip / Enter */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        <button
          onClick={handleToggleSound}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 backdrop-blur-md cursor-pointer border ${
            soundEnabled
              ? 'bg-white/15 hover:bg-white/25 border-[#FAD7A0]/40 text-[#FAD7A0]'
              : 'bg-white/5 hover:bg-white/10 border-white/20 text-gray-400'
          }`}
          title={soundEnabled ? 'Mute Intro Music' : 'Unmute Intro Music'}
          aria-label={soundEnabled ? 'Mute Intro Music' : 'Unmute Intro Music'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#FAD7A0]" />
              <span className="hidden xs:inline">{isPlaying ? 'Sound Playing' : 'Sound ON'}</span>
              {isPlaying && (
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-1 h-2 bg-[#FAD7A0] rounded-full animate-pulse"></span>
                  <span className="w-1 h-3.5 bg-[#E67E22] rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-[#FAD7A0] rounded-full animate-pulse delay-150"></span>
                </span>
              )}
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden xs:inline">Sound OFF</span>
            </>
          )}
        </button>

        <button
          onClick={handleFinish}
          className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] border border-[#FAD7A0]/40 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer shadow-md"
        >
          <span>Enter SAILL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Lightweight Academic Background Icons */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-12 p-3 bg-white/5 border border-white/10 rounded-2xl text-[#FAD7A0] opacity-40 pointer-events-none hidden sm:block"
      >
        <BookOpen className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-20 p-3 bg-white/5 border border-white/10 rounded-2xl text-[#E67E22] opacity-40 pointer-events-none hidden sm:block"
      >
        <Mic className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-20 p-3 bg-white/5 border border-white/10 rounded-2xl text-[#D35400] opacity-40 pointer-events-none hidden sm:block"
      >
        <GraduationCap className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 right-24 p-3 bg-white/5 border border-white/10 rounded-2xl text-[#FAD7A0] opacity-40 pointer-events-none hidden sm:block"
      >
        <Cpu className="w-6 h-6" />
      </motion.div>

      {/* Stage Step Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {[1, 2, 3, 4].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentScreen(step as 1 | 2 | 3 | 4)}
            className={`transition-all cursor-pointer ${
              currentScreen === step
                ? 'w-8 h-2.5 bg-[#D35400] rounded-full shadow-md'
                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40 rounded-full'
            }`}
            title={`Go to Stage ${step}`}
          />
        ))}
      </div>

      {/* Main Animated Sequence Container */}
      <div className="relative z-10 max-w-xl w-full text-center px-4">
        <AnimatePresence mode="wait">
          {/* ==================================================== */}
          {/* SCREEN 1: Institution & Platform Identity */}
          {/* ==================================================== */}
          {currentScreen === 1 && (
            <motion.div
              key="screen-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Logos Row */}
              <div className="flex items-center justify-center gap-4">
                {/* SRIT Logo Badge */}
                <div className="p-3.5 bg-gradient-to-br from-[#FFF8F0] to-[#FAD7A0] rounded-2xl shadow-xl border border-[#FAD7A0] text-[#2C3E50] flex items-center gap-2.5">
                  <GraduationCap className="w-8 h-8 text-[#D35400]" />
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-black uppercase text-[#D35400] tracking-wider">
                      SRIT Logo
                    </span>
                    <span className="block text-[10px] font-extrabold text-[#2C3E50]/80">
                      Autonomous Institution
                    </span>
                  </div>
                </div>

                <div className="w-px h-10 bg-white/20" />

                {/* SAILL Logo Badge */}
                <div className="p-3.5 bg-gradient-to-br from-[#D35400] to-[#E67E22] rounded-2xl shadow-xl border border-[#F8C471]/30 text-white flex items-center gap-2.5">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-[#FAD7A0] animate-pulse" />
                    <Volume2 className="w-4 h-4 text-white absolute -bottom-1 -right-1" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-base font-black tracking-wider text-white font-heading">
                      SAILL Logo
                    </span>
                    <span className="block text-[9px] font-bold text-[#FAD7A0] uppercase">
                      AI Language Lab
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Identity */}
              <div className="space-y-3 pt-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-heading">
                  SAILL
                </h1>

                <p className="text-xl sm:text-2xl font-bold tracking-wide text-[#FAD7A0] font-heading">
                  SRIT AI Language Laboratory
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      IntroAudioService.setSoundEnabled(true);
                      IntroAudioService.playIntroMusic(true).catch(() => {});
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg border border-[#FAD7A0]/30 hover:scale-105 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-[#FAD7A0]" />
                    <span>{isPlaying ? 'Playing Intro Sound' : 'Start with Sound'}</span>
                  </button>

                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAD7A0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                  >
                    <span>Enter SAILL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 2: Technology & Syllabus Alignment */}
          {/* ==================================================== */}
          {currentScreen === 2 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white text-xs font-black uppercase tracking-widest shadow-md">
                <Cpu className="w-4 h-4 text-[#FAD7A0]" />
                <span>Powered by Artificial Intelligence</span>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight">
                  AI-Powered Virtual English Language Laboratory
                </h2>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <div className="flex items-center justify-center gap-2 text-[#FAD7A0] font-extrabold text-sm sm:text-base">
                    <Award className="w-5 h-5 text-[#E67E22]" />
                    <span>Aligned with the R26 Communicative English Laboratory syllabus.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 3: Professional Authorship Credits */}
          {/* ==================================================== */}
          {currentScreen === 3 && (
            <motion.div
              key="screen-3"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-5"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8F0] text-[#D35400] text-[11px] font-black uppercase tracking-wider shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-[#D35400]" />
                <span>Conceptualized, Designed & Developed</span>
              </div>

              <span className="block text-xs uppercase tracking-widest text-[#FAD7A0] font-mono">
                by
              </span>

              {/* Author Card Frame */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border-2 border-[#FAD7A0]/40 shadow-2xl backdrop-blur-md space-y-3 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
                  Dr Anil Kumar D
                </h2>

                <div className="space-y-1 text-xs sm:text-sm text-[#FAD7A0] font-semibold">
                  <p className="font-bold text-white">Associate Professor of English</p>
                  <p className="text-[#FAD7A0]/90">Department of Humanities & Sciences</p>
                  <p className="font-black text-amber-300 font-heading">SRIT (Autonomous)</p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-black">
                  <span className="px-3 py-1 rounded-xl bg-[#D35400] text-white font-mono border border-white/20">
                    PhD – IIT Madras
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-white border border-white/20">
                    Founder & Chief Architect, SAILL Platform
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 4: Loading & Transitioning to Environment */}
          {/* ==================================================== */}
          {currentScreen === 4 && (
            <motion.div
              key="screen-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAD7A0] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#E67E22] animate-spin" />
                  <span>Launching Virtual Language Laboratory</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  Preparing Your Learning Environment...
                </h2>
              </div>

              {/* Progress Outer Track */}
              <div className="space-y-3 pt-2">
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D35400] via-[#E67E22] to-[#FAD7A0] rounded-full transition-all duration-100 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Status Text & Percentage */}
                <div className="flex items-center justify-between text-xs font-bold text-gray-300 px-1">
                  <span className="text-[#FAD7A0] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{statusMessage}</span>
                  </span>
                  <span className="font-mono text-[#FAD7A0]">{progress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

