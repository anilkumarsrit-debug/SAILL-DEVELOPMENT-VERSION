import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  Mail,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Bookmark
} from 'lucide-react';

interface DeveloperInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperInfoModal: React.FC<DeveloperInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#FAD7A0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#2C3E50] relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white p-6 relative overflow-hidden">
            {/* Background Accent Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D35400]/30 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#D35400] text-white shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FAD7A0]">
                    Platform Visionary & Chief Architect
                  </span>
                  <h3 className="text-xl font-black font-serif text-white">
                    Innovation & Architecture
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar text-xs">
            {/* Profile Header Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] relative">
              {/* Photo Placeholder Frame */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#D35400] via-[#E67E22] to-[#2C3E50] p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-white flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-[#FAD7A0]">
                    {/* SVG Avatar Placeholder */}
                    <div className="w-16 h-16 rounded-full bg-[#FFF8F0] border-2 border-[#D35400] flex items-center justify-center text-[#D35400] shadow-xs mb-1">
                      <GraduationCap className="w-9 h-9" />
                    </div>
                    <span className="text-[9px] font-black text-[#D35400] uppercase font-mono">
                      IIT Madras PhD
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-[#D35400] text-white rounded-lg shadow-md border border-white">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Bio Details */}
              <div className="space-y-2.5 text-center sm:text-left flex-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D35400] text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#FAD7A0]" />
                    <span>Founder & Chief Architect, SAILL</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
                    Dr Anil Kumar D
                  </h2>
                  <p className="text-sm font-bold text-[#D35400]">
                    PhD – IIT Madras
                  </p>
                </div>

                <div className="space-y-0.5 text-xs text-[#5D6D7E] font-medium">
                  <p className="text-[#2C3E50] font-bold">Associate Professor of English</p>
                  <p className="text-[#E67E22] font-semibold">Department of Humanities and Sciences</p>
                  <p className="font-extrabold text-[#2C3E50] font-serif">
                    Srinivasa Ramanujan Institute of Technology (Autonomous)
                  </p>
                </div>

                {/* Social Placeholders */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <a
                    href="mailto:anil.english@srit.ac.in"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#D35400] font-bold rounded-xl text-[11px] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>anil.english@srit.ac.in</span>
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#2C3E50] hover:bg-[#34495E] text-white font-bold rounded-xl text-[11px] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#FAD7A0]" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-[#D35400] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#D35400]" />
                <span>Biography & Academic Vision</span>
              </h4>
              <p className="text-xs text-[#5D6D7E] leading-relaxed bg-[#FFF8F0]/50 p-4 rounded-2xl border border-[#FAD7A0]/60">
                Dr Anil Kumar D holds a doctorate in English from the prestigious <strong>Indian Institute of Technology Madras (IIT Madras)</strong>. As an educator and curriculum architect with over 15 years of experience, he conceives and builds Technology-Enhanced Language Learning (TELL) environments tailored specifically for engineering students. SAILL is his flagship AI-powered virtual laboratory designed to align with the R26 Regulations curriculum.
              </p>
            </div>

            {/* Key Achievements */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-[#E67E22] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#E67E22]" />
                <span>Key Professional Achievements</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2C3E50] text-[11px]">SAILL Platform Architecture</strong>
                    <p className="text-[11px] text-[#5D6D7E]">Engineered full 12-module R26 Communicative English Virtual Lab.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2C3E50] text-[11px]">IIT Madras Research Excellence</strong>
                    <p className="text-[11px] text-[#5D6D7E]">Specialized research in phonetics, speech mechanics, and ESP pedagogy.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2C3E50] text-[11px]">Rubric & Assessment Engine</strong>
                    <p className="text-[11px] text-[#5D6D7E]">Designed 100-mark standardized outcome-based rubric evaluations.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2C3E50] text-[11px]">International Publications</strong>
                    <p className="text-[11px] text-[#5D6D7E]">Authored peer-reviewed papers on AI integration in ELT.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Interests */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-[#2C3E50] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#2C3E50]" />
                <span>Research & Expertise Focus</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Artificial Intelligence in ELT',
                  'Phonetics & Acoustical Analysis',
                  'English for Specific Purposes (ESP)',
                  'Outcome-Based Education (OBE)',
                  'Computer-Assisted Language Learning (CALL)',
                  'Technical Writing & Corporate Skills'
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-xl font-bold text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-[#FFF8F0] border-t border-[#FAD7A0] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition shadow-xs"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
