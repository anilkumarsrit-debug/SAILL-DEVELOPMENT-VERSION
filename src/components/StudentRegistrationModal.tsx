import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';
import { UniversalRegistrationForm } from './registration/UniversalRegistrationForm';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessEnter?: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Modal Header Bar */}
          <div className="px-6 py-4 bg-[#2C3E50] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FAD7A0]" />
              <h2 className="font-bold text-sm tracking-wide">
                SAILL • Universal Registration Portal
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
            <UniversalRegistrationForm
              isModal={true}
              onSuccessReturnToLogin={onClose}
              onCancel={onClose}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
