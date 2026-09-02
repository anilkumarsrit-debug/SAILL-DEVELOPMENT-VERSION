import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Cpu,
  Target,
  Award,
  Database,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface AboutSaillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSaillModal: React.FC<AboutSaillModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-3xl w-full border-2 border-[#FAD7A0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#2C3E50] relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#2C3E50] via-[#D35400] to-[#2C3E50] text-white p-6 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white text-[#D35400] shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FAD7A0]">
                    SRIT AI Language Laboratory
                  </span>
                  <h3 className="text-xl font-black font-serif text-white">
                    About SAILL Platform
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar text-xs">
            {/* Platform Credits Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-[#FFF8F0] border-2 border-[#FAD7A0] shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-3 text-[#D35400] font-black text-sm uppercase tracking-wider font-heading">
                <Award className="w-5 h-5" />
                <span>Platform Credits</span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-[#FAD7A0]">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C3E50]">
                      SAILL – SRIT AI Language Laboratory
                    </h4>
                    <p className="text-[11px] font-semibold text-[#D35400]">
                      AI-Powered Virtual English Language Laboratory Platform
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#D35400] text-white text-[10px] font-black font-mono rounded-lg shrink-0 self-start sm:self-auto">
                    Version 1.0
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-2">
                  <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-wider block font-heading">
                    Conceptualized, Designed & Developed by
                  </span>

                  <div>
                    <h3 className="text-lg font-black text-[#2C3E50] font-heading">
                      Dr Anil Kumar D
                    </h3>
                    <p className="text-xs font-bold text-[#D35400]">
                      Associate Professor of English
                    </p>
                    <p className="text-[11px] text-[#5D6D7E] font-medium">
                      Department of Humanities & Sciences
                    </p>
                    <p className="text-[11px] font-extrabold text-[#2C3E50]">
                      SRIT (Autonomous)
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold">
                    <span className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-lg">
                      PhD – IIT Madras
                    </span>
                    <span className="px-2.5 py-1 bg-[#2C3E50] text-white rounded-lg">
                      Founder & Chief Architect, SAILL
                    </span>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-1.5">
                  <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-wider block font-heading">
                    Platform Mission Statement
                  </span>
                  <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
                    &ldquo;To democratize access to high-impact English communication training for engineering undergraduates through AI-augmented phonetics feedback, outcome-based rubric evaluations, and interactive syllabus-aligned laboratory modules.&rdquo;
                  </p>
                </div>

                {/* Acknowledgements */}
                <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-1.5">
                  <span className="text-[10px] font-black text-[#D35400] uppercase tracking-wider block font-heading">
                    Institutional Acknowledgements
                  </span>
                  <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
                    Sincere gratitude is extended to the Management, Principal, and Head of the Department of Humanities and Sciences at Srinivasa Ramanujan Institute of Technology (Autonomous) for their constant encouragement, support, and vision in bringing the SAILL Virtual Language Laboratory to life.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#E67E22] font-black text-xs uppercase tracking-wider font-heading">
                <Target className="w-4 h-4" />
                <span>Platform Objectives</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Develop student oral fluency, stress-intonation, and phonetics accuracy.",
                  "Enhance written communication including ATS resumes, emails, and technical reports.",
                  "Provide offline-first PWA accessibility via local browser IndexedDB persistence.",
                  "Integrate AI-driven speech feedback, WPM speed calculation, and rubric evaluation."
                ].map((obj, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-[#FAD7A0] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                    <span className="text-[11px] text-[#2C3E50] font-semibold">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features & AI Integration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Features */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <div className="flex items-center gap-2 text-[#2C3E50] font-black text-xs uppercase tracking-wider font-heading">
                  <Layers className="w-4 h-4 text-[#D35400]" />
                  <span>Key Features</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#5D6D7E]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
                    <span>12 Standardized R26 Laboratory Practice Modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
                    <span>Digital Lab Notebook & Work Record Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
                    <span>Interactive IPA Sound Chart & Phonetics Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
                    <span>Faculty CO-PO Attainment & Knowledge Check Analytics</span>
                  </li>
                </ul>
              </div>

              {/* AI Integration */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <div className="flex items-center gap-2 text-[#2C3E50] font-black text-xs uppercase tracking-wider font-heading">
                  <Cpu className="w-4 h-4 text-[#E67E22]" />
                  <span>AI Integration</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#5D6D7E]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>Gemini AI Grammar, Pronunciation & Tone Review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>Real-Time Voice WPM Pace & Filler Word Detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>STAR Method Interview Coaching & Debate Evaluation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>Automated Knowledge Check Engine with Adaptive Questions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Platform Benefits & Technology Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#D35400] font-black text-xs uppercase tracking-wider font-heading">
                  <Award className="w-4 h-4" />
                  <span>Student & Institutional Benefits</span>
                </div>
                <p className="text-[11px] text-[#5D6D7E] leading-relaxed p-3 rounded-xl bg-white border border-[#FAD7A0]">
                  Students gain placement readiness, self-paced speech practice without stage fear, and zero data loss thanks to local device persistence. Faculty receive automated CO-PO mapping and student progress tracking.
                </p>
              </div>

              {/* Technology Stack */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#2C3E50] font-black text-xs uppercase tracking-wider font-heading">
                  <Database className="w-4 h-4 text-[#2C3E50]" />
                  <span>Technology Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['React 18', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'PWA Offline', 'Google Gemini AI', 'Web Audio API', 'Recharts'].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-extrabold rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#FFF8F0] border-t border-[#FAD7A0] flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D35400]" />
              R26 Autonomous Curriculum Certified
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
