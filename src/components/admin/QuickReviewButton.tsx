import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  Terminal,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/AuthService';
import { normalizeRole } from '../../types/auth';
import {
  DevelopmentReviewService,
  ObservationCategory,
  ObservationPriority
} from '../../services/DevelopmentReviewService';

export const QuickReviewButton: React.FC = () => {
  const { user } = useAuth();
  const currentUser = user || AuthService.getCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ObservationCategory>('Pedagogy');
  const [priority, setPriority] = useState<ObservationPriority>('Medium');

  // Keyboard shortcut Ctrl + Shift + D - active ONLY after an authenticated Bootstrap Administrator logs in
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        const activeUser = AuthService.getCurrentUser();
        if (activeUser && normalizeRole(activeUser.role) === 'ADMINISTRATOR') {
          setIsOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Only render for Bootstrap Administrators / Admin role when logged in
  if (!currentUser || normalizeRole(currentUser.role) !== 'ADMINISTRATOR') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    DevelopmentReviewService.createObservation({
      journey: 'Journey 1: R26 Communicative English Lab',
      phase: 'Phase A: Speech Sound Foundations',
      unit: 'Active Studio Context',
      activity: 'Quick Review Observation',
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Open',
      assignedTo: 'Lead AI Engineer',
      softwareVersion: 'v1.2.0-A',
      attachments: []
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-[#FAD7A0] rounded-2xl shadow-2xl border-2 border-[#FAD7A0] flex items-center gap-2 cursor-pointer group"
        title="Quick Review Observation (Shortcut: Ctrl + Shift + D)"
      >
        <div className="p-1.5 bg-[#D35400] text-white rounded-xl shadow-xs group-hover:rotate-12 transition">
          <Terminal className="w-4 h-4 text-[#FAD7A0]" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-black uppercase tracking-wider font-serif">Quick Review</p>
          <p className="text-[9px] text-gray-300 font-mono">Ctrl + Shift + D</p>
        </div>
      </motion.button>

      {/* QUICK OBSERVATION MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2C38]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#FAD7A0]" />
                  <h3 className="text-sm font-black text-[#FAD7A0] font-serif">
                    Quick Review Observation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-300 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                {isSuccess ? (
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                    <h4 className="text-lg font-bold text-[#2C3E50]">Observation Recorded!</h4>
                    <p className="text-xs text-gray-500">
                      Logged directly into the Development Review Center.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                        Observation Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Quick title summary..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D35400]"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                        Observation Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Type empirical feedback, UI note, audio observation..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D35400]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ObservationCategory)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        >
                          <option value="Pedagogy">Pedagogy</option>
                          <option value="UI/UX">UI/UX</option>
                          <option value="AI Evaluation">AI Evaluation</option>
                          <option value="Assessment">Assessment</option>
                          <option value="Audio">Audio</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Bug">Bug</option>
                          <option value="Enhancement">Enhancement</option>
                          <option value="Feature Request">Feature Request</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                          Priority
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as ObservationPriority)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#D35400] text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Log Review</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
