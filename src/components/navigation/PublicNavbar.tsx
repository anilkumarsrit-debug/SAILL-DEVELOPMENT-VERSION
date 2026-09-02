/**
 * SAILL - SRIT AI Language Laboratory
 * Public Website Header Navbar
 *
 * @version 1.0.0
 * @description Dedicated public navigation header for the SAILL public website.
 * Provides institutional branding, informational page section anchors, and prominent Login / Register buttons.
 */

import React, { useState, useEffect } from 'react';
import { GraduationCap, LogIn, UserPlus, Menu, X, BookOpen, Sparkles, Compass, Phone, Volume2, VolumeX } from 'lucide-react';
import { IntroAudioService } from '../../services/IntroAudioService';

export interface PublicNavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onLoginClick,
  onRegisterClick,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => IntroAudioService.isSoundEnabled());
  const [isPlaying, setIsPlaying] = useState<boolean>(() => IntroAudioService.isPlaying());

  useEffect(() => {
    const unsub = IntroAudioService.subscribe((playing, enabled) => {
      setIsPlaying(playing);
      setSoundEnabled(enabled);
    });
    return () => unsub();
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

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#FAD7A0] shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Institutional Logo & Title */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white p-0.5 shadow-md group-hover:bg-[#E67E22] transition flex items-center justify-center font-black">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-[#D35400] tracking-tight font-serif leading-none">
                SAILL
              </span>
              <span className="text-[10px] font-extrabold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-1.5 py-0.5 rounded-xs">
                R26
              </span>
            </div>
            <p className="text-[11px] font-semibold text-gray-600 tracking-wide leading-tight hidden sm:block">
              SRIT AI Language Laboratory
            </p>
          </div>
        </div>

        {/* Center: Informational Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#2C3E50]">
          <button
            onClick={() => handleNavClick('hero')}
            className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer py-1"
          >
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleNavClick('curriculum')}
            className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer py-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>Academic Curriculum</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D35400]" />
            <span>Platform Features</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#2C3E50]" />
            <span>About SAILL</span>
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Phone className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>Contact</span>
          </button>
        </nav>

        {/* Right: Auth Action Buttons & Sound Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound ON/OFF Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              soundEnabled
                ? 'bg-[#FFF8F0] border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0]'
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
            }`}
            title={soundEnabled ? 'Mute Intro Music' : 'Unmute Intro Music'}
            aria-label={soundEnabled ? 'Mute Intro Music' : 'Unmute Intro Music'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#D35400]" />
                <span className="hidden lg:inline text-[11px] font-extrabold">Sound ON</span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2 bg-[#D35400] rounded-full animate-pulse"></span>
                    <span className="w-0.5 h-3 bg-[#E67E22] rounded-full animate-pulse delay-75"></span>
                    <span className="w-0.5 h-1.5 bg-[#D35400] rounded-full animate-pulse delay-150"></span>
                  </span>
                )}
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span className="hidden lg:inline text-[11px] font-extrabold">Sound OFF</span>
              </>
            )}
          </button>

          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] hover:text-[#2C3E50] transition shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400]"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:shadow-md transition shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-[#FFF8F0] hover:text-[#D35400] transition border border-gray-200"
            title="Toggle Public Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#FAD7A0] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-xs font-bold text-[#2C3E50]">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#D35400] transition"
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('curriculum')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#D35400] transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#E67E22]" />
              <span>Academic Curriculum</span>
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#D35400] transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D35400]" />
              <span>Platform Features</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#D35400] transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#2C3E50]" />
              <span>About SAILL</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#FFF8F0] hover:text-[#D35400] transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#E67E22]" />
              <span>Contact & Support</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
