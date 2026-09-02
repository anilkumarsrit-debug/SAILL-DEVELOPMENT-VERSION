import React from 'react';
import { X, HelpCircle, BookOpen, Sparkles, Phone, Mail, CheckCircle, GraduationCap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#FAD7A0] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#2C3E50]">
        {/* Header */}
        <div className="bg-[#2C3E50] text-white p-6 flex items-center justify-between border-b border-[#34495E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D35400] text-white">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-serif text-[#FAD7A0]">
                SAILL Help & Academic Guide
              </h3>
              <p className="text-xs text-gray-300">
                SRIT AI Language Laboratory • R26 Regulations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#34495E] text-gray-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs">
          {/* Quick Start Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-[#D35400]">
                <BookOpen className="w-4 h-4" />
                <span>Navigating Lab Modules</span>
              </div>
              <p className="text-[#5D6D7E] leading-relaxed">
                Access 12 R26 Communicative English modules from the left sidebar. Each module contains syllabus objectives, drills, practice tools, and portfolio saving features.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-[#E67E22]">
                <Sparkles className="w-4 h-4" />
                <span>Using AI Practice Tools</span>
              </div>
              <p className="text-[#5D6D7E] leading-relaxed">
                Use speech recorders for pronunciation practice, JAM extempore drills, and STAR method interviews. AI coaches evaluate pace (WPM), clarity, and structure.
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-sm text-[#D35400] uppercase tracking-wider font-heading">
              Frequently Asked Questions (FAQs)
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <p className="font-bold text-[#2C3E50]">Q: How does offline recording work?</p>
                <p className="text-[#5D6D7E]">
                  All audio recordings and written notes are saved locally in browser IndexedDB storage, ensuring 100% offline access during laboratory sessions.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <p className="font-bold text-[#2C3E50]">Q: How are internal marks and rubrics evaluated?</p>
                <p className="text-[#5D6D7E]">
                  Faculty members review portfolio submissions using 100-mark standardized rubrics covering pronunciation, fluency, vocabulary, and task completion.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <p className="font-bold text-[#2C3E50]">Q: How do I change my perspective role?</p>
                <p className="text-[#5D6D7E]">
                  Click the Role Switcher in the top header bar to switch between Student, Faculty, HOD, Administrator, and Guest views.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support Box */}
          <div className="p-4 rounded-2xl bg-[#2C3E50] text-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#FAD7A0]">
              <GraduationCap className="w-5 h-5 text-[#D35400]" />
              <span>Laboratory Support & Assistance</span>
            </div>
            <p className="text-[#B0BEC5]">
              Department of Humanities and Sciences, Srinivasa Ramanujan Institute of Technology (Autonomous), Ananthapuramu, AP, India.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-semibold text-[#FAD7A0]">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#E67E22]" />
                saill-support@srit.ac.in
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#E67E22]" />
                SRIT Humanities Lab Office
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl transition"
          >
            Close Help Guide
          </button>
        </div>
      </div>
    </div>
  );
};
