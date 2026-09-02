import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Page, StudentProfile } from '../types';
import { AcademicCurriculumNavigator } from '../components/curriculum/AcademicCurriculumNavigator';
import { IntroAudioService } from '../services/IntroAudioService';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Mic,
  Award,
  CheckCircle2,
  GraduationCap,
  Cpu,
  Layers,
  BookCheck,
  ShieldCheck,
  Zap,
  Building2,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Square,
  Music
} from 'lucide-react';

interface LandingPageProps {
  profile?: StudentProfile | null;
  onNavigate: (page: Page) => void;
  onOpenModule?: (moduleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => IntroAudioService.isSoundEnabled());
  const [isPlaying, setIsPlaying] = useState<boolean>(() => IntroAudioService.isPlaying());

  useEffect(() => {
    const unsub = IntroAudioService.subscribe((playing, enabled) => {
      setIsPlaying(playing);
      setSoundEnabled(enabled);
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      IntroAudioService.stopIntroMusic();
    } else {
      if (!soundEnabled) {
        IntroAudioService.setSoundEnabled(true);
      }
      IntroAudioService.playIntroMusic(true).catch(() => {});
    }
  };

  const handleToggleSoundPref = () => {
    const next = IntroAudioService.toggleSound();
    setSoundEnabled(next);
  };
  return (
    <div className="space-y-12 pb-16 text-[#2C3E50]">
      {/* ==================================================== */}
      {/* 1. HERO SECTION (LOGOS, TITLE, TAGLINE, PUBLIC CTAS) */}
      {/* ==================================================== */}
      <section id="hero" className="relative overflow-hidden rounded-3xl bg-white border-2 border-[#FAD7A0] p-6 sm:p-12 shadow-xl">
        {/* Background Gradients */}
        <div className="absolute -right-24 -top-24 w-[450px] h-[450px] bg-gradient-to-br from-[#FFF8F0] via-[#FAD7A0]/40 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -left-24 -bottom-24 w-[450px] h-[450px] bg-gradient-to-tr from-[#D35400]/10 via-[#FAD7A0]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Logo Bar (SRIT & SAILL Logos) */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* SRIT Logo Badge */}
              <div className="px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] shadow-2xs flex items-center gap-2.5 hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6 text-[#D35400]" />
                <div className="text-left leading-tight">
                  <span className="block text-xs font-black text-[#D35400] font-heading">
                    SRIT AUTONOMOUS
                  </span>
                  <span className="block text-[10px] font-semibold text-[#5D6D7E]">
                    Engineering College
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-[#FAD7A0] hidden sm:block" />

              {/* SAILL Logo Badge */}
              <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white shadow-2xs flex items-center gap-2.5 hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-6 h-6 text-[#FAD7A0]" />
                <div className="text-left leading-tight">
                  <span className="block text-xs font-black text-white font-heading">
                    SAILL LAB
                  </span>
                  <span className="block text-[10px] font-bold text-[#FAD7A0]">
                    R26 Syllabus
                  </span>
                </div>
              </div>
            </div>

            {/* Application Name & Tagline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black text-[#2C3E50] tracking-tight font-heading">
                SAILL
              </h1>
              <p className="text-lg sm:text-2xl font-black text-[#D35400] font-serif tracking-wide">
                SRIT AI Language Laboratory
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-[#E67E22] font-black text-xs uppercase tracking-widest shadow-2xs">
                <span>Learn. Practice. Communicate. Excel.</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#5D6D7E] max-w-2xl mx-auto leading-relaxed font-medium">
              A state-of-the-art AI-powered Virtual English Language Laboratory aligned with the R26 Communicative English Laboratory syllabus, designed to develop communication, employability, and professional skills for engineering students.
            </p>

            {/* Public Action Buttons -> Navigate to dedicated auth pages */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Access SAILL Portal (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('register-choice')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register for SAILL</span>
              </button>
            </div>

            {/* Ambient Intro Audio Control Pill */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-xs font-semibold text-[#5D6D7E] shadow-2xs">
                <button
                  onClick={handleTogglePlay}
                  className="flex items-center gap-1.5 text-[#D35400] hover:text-[#E67E22] font-bold cursor-pointer transition"
                  title={isPlaying ? 'Pause Intro Music' : 'Play SAILL Welcome Intro Music'}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-[#D35400]" />
                      <span>Intro Music Playing</span>
                      <span className="flex items-center gap-0.5 ml-1">
                        <span className="w-1 h-2 bg-[#D35400] rounded-full animate-pulse"></span>
                        <span className="w-1 h-3.5 bg-[#E67E22] rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 h-2 bg-[#D35400] rounded-full animate-pulse delay-150"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-[#D35400]" />
                      <span>Play Intro Music (14s)</span>
                    </>
                  )}
                </button>

                <span className="w-px h-3.5 bg-[#FAD7A0]" />

                <button
                  onClick={handleToggleSoundPref}
                  className="hover:text-[#D35400] transition flex items-center gap-1 cursor-pointer"
                  title={soundEnabled ? 'Mute Background Audio' : 'Enable Background Audio'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#D35400]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span className="text-[11px]">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. ACADEMIC CURRICULUM SECTION */}
      {/* ==================================================== */}
      <section id="curriculum" className="space-y-6 pt-2">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-extrabold uppercase tracking-widest shadow-2xs">
            <Layers className="w-4 h-4 text-[#E67E22]" />
            <span>Academic Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
            Academic Overview & R26 Regulations
          </h2>
          <p className="text-xs text-[#5D6D7E] font-medium max-w-xl mx-auto">
            Explore the 9 foundational curriculum pillars governing the SRIT R26 Communicative English Laboratory.
          </p>
        </div>

        {/* Responsive Grid/Rows Academic Curriculum Navigator */}
        <AcademicCurriculumNavigator />
      </section>

      {/* ==================================================== */}
      {/* 3. PLATFORM FEATURES SECTION */}
      {/* ==================================================== */}
      <section id="features" className="space-y-6 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-extrabold uppercase tracking-widest shadow-2xs">
            <Zap className="w-4 h-4 text-[#D35400]" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
            Designed for Autonomous LMS Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border-2 border-[#FAD7A0] space-y-3 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] flex items-center justify-center font-black">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#2C3E50]">AI Speech & Pronunciation</h3>
            <p className="text-xs text-[#5D6D7E] leading-relaxed">
              Real-time speech evaluation measuring Words Per Minute (WPM), pitch, phonemes, and filler word density.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border-2 border-[#FAD7A0] space-y-3 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#E67E22] border border-[#FAD7A0] flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#2C3E50]">OBE Rubrics & Marks</h3>
            <p className="text-xs text-[#5D6D7E] leading-relaxed">
              Standardized assessment rubrics linked to Course Outcomes (CO1-CO5) for day-to-day lab evaluation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border-2 border-[#FAD7A0] space-y-3 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] flex items-center justify-center font-black">
              <BookCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#2C3E50]">Digital Learning Portfolio</h3>
            <p className="text-xs text-[#5D6D7E] leading-relaxed">
              IndexedDB local storage engine preserving student audio recordings, transcriptions, and continuous scores.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. ABOUT SAILL & INSTITUTIONAL VISION */}
      {/* ==================================================== */}
      <section id="about" className="p-8 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] rounded-3xl border-2 border-[#FAD7A0] shadow-md space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] rounded-lg text-xs font-mono font-bold">
              <Building2 className="w-4 h-4" />
              <span>Department of Humanities & Sciences (English)</span>
            </div>
            <h3 className="text-2xl font-black text-[#2C3E50] font-heading">
              Srinivasa Ramanujan Institute of Technology (Autonomous)
            </h3>
            <p className="text-xs text-[#5D6D7E] leading-relaxed max-w-2xl">
              Chief Architect: Dr Anil Kumar D (PhD, IIT Madras). SAILL provides a complete digital framework separating Educational Content, Interactive UI, and AI Evaluation Engines.
            </p>
          </div>

          <button
            onClick={() => onNavigate('register-choice')}
            className="px-6 py-3 bg-[#D35400] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-[#E67E22] transition shrink-0 cursor-pointer"
          >
            Get Started with SAILL
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. CONTACT / SUPPORT SECTION */}
      {/* ==================================================== */}
      <section id="contact" className="p-6 bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#D35400]" />
            <h4 className="font-extrabold text-sm text-[#2C3E50]">Institutional Support & Guidance</h4>
          </div>
          <span className="text-xs text-[#5D6D7E]">Rotational Batch Incharges & System Administrator</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5D6D7E]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#D35400] shrink-0" />
            <span>Rotary Nagar, Ananthapuramu, AP - 515701</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#E67E22] shrink-0" />
            <span>principal@srit.ac.in | admin@srit.ac.in</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2C3E50] shrink-0" />
            <span>Dept of H&S (English), SRIT Autonomous</span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. INSTITUTIONAL FOOTER */}
      {/* ==================================================== */}
      <footer className="pt-6 border-t border-[#FAD7A0] text-center text-xs text-[#5D6D7E] space-y-2">
        <p className="font-semibold">
          © 2026 Srinivasa Ramanujan Institute of Technology (Autonomous). All Rights Reserved.
        </p>
        <p className="text-[11px] text-gray-600">
          SAILL R26 Communicative English Laboratory Platform • Developed by Dr Anil Kumar D
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
