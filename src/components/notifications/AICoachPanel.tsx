import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Page } from '../../types';
import { Bot, Sparkles, ArrowRight, CheckCircle, Lightbulb, Zap } from 'lucide-react';

interface AICoachPanelProps {
  onNavigate?: (page: Page) => void;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({ onNavigate }) => {
  const { aiCoachMessages } = useNotifications();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-[#2C3E50] to-[#1A252F] text-white p-6 rounded-2xl shadow-xl space-y-5 relative overflow-hidden select-none">
      {/* Background Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D35400]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white rounded-xl shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg font-serif tracking-wide">Gemini AI Speech Coach</h3>
              <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Live Adaptive Engine
              </span>
            </div>
            <p className="text-xs text-gray-300">Personalized speech practice tips, pitch rhythm advice & module unlocks</p>
          </div>
        </div>
      </div>

      {/* AI Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiCoachMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#FAD7A0]/60 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#D35400]/80 text-[#FAD7A0] text-[10px] font-bold rounded-md uppercase font-mono">
                  {msg.category}
                </span>
                <span className="text-[10px] text-gray-400">{msg.createdDate}</span>
              </div>

              <h4 className="font-bold text-sm text-[#FAD7A0] group-hover:text-white transition">
                {msg.title}
              </h4>

              <p className="text-xs text-gray-200 leading-relaxed">{msg.message}</p>
            </div>

            {msg.actionText && msg.actionPage && onNavigate && (
              <button
                onClick={() => onNavigate(msg.actionPage!)}
                className="w-full py-2 px-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
              >
                <span>{msg.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Live AI Status Bar */}
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Continuous Speech Analytics: Gemini 1.5 Flash Model Connected</span>
        </div>
        <span className="text-[10px] text-gray-400">Updates after every pronunciation drill</span>
      </div>
    </div>
  );
};
