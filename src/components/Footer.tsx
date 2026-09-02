import React from 'react';
import { Page } from '../types';
import { BookOpen, GraduationCap, Award, CheckCircle2, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-white border-t border-[#FAD7A0] text-[#2C3E50]">
      {/* Top Footer Banner / Quote */}
      <div className="bg-[#FFF8F0] border-b border-[#FAD7A0] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D35400] text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#D35400] uppercase tracking-wide font-heading">
                SRIT AI Language Laboratory (SAILL)
              </h4>
              <p className="text-xs text-[#5D6D7E]">
                R26 Communicative English Laboratory Syllabus for First-Year Engineering
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D35400] bg-white px-3.5 py-1.5 rounded-full border border-[#F8C471] shadow-xs">
            <Award className="w-4 h-4 text-[#E67E22]" />
            <span>Srinivasa Ramanujan Institute of Technology (Autonomous)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Institutional Column */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-8 bg-[#D35400] rounded-xs"></div>
            <div>
              <h3 className="font-extrabold text-base text-[#D35400] font-heading leading-tight">
                Srinivasa Ramanujan Institute of Technology (Autonomous)
              </h3>
              <p className="text-xs font-medium text-[#E67E22]">
                Ananthapuramu, Andhra Pradesh, India
              </p>
            </div>
          </div>

          <p className="text-xs text-[#5D6D7E] leading-relaxed max-w-lg">
            SAILL is designed to empower First-Year B.Tech engineering students with interactive phonetics practice, active listening strategies, corporate group discussion skills, STAR method interview readiness, and technical communication.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#D35400]">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs font-medium text-[#5D6D7E]">
            <li>
              <button
                onClick={() => onNavigate('landing')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5"
              >
                <span>Home & Syllabus Overview</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5"
              >
                <span>Student Lab Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('modules')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5"
              >
                <span>All 12 R26 Lab Modules</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('practice')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5"
              >
                <span>Practice Center</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('portfolio')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5"
              >
                <span>Student Lab Portfolio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('progress')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Progress Tracker & Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('system-health')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>System Health & Telemetry</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('qef-framework')}
                className="hover:text-[#D35400] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Quality & Release Readiness</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Syllabus & PWA Info */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#D35400]">
            R26 Regulation Features
          </h4>
          <div className="space-y-2 text-xs text-[#5D6D7E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>Offline PWA with IndexedDB</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>12 AI Tools Badge Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>Phonetics Audio Recording</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>Autonomous Academic Curriculum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#FAD7A0] py-4 px-4 sm:px-6 lg:px-8 bg-[#FFF8F0] text-[11px] text-[#5D6D7E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-medium">
            © {new Date().getFullYear()} Srinivasa Ramanujan Institute of Technology (Autonomous). All Rights Reserved. R26 Regulations - SAILL (SRIT AI Language Laboratory).
          </p>
          <div className="flex items-center gap-1 text-[#E67E22] font-semibold">
            <span>Learn • Practice • Communicate • Improve</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
