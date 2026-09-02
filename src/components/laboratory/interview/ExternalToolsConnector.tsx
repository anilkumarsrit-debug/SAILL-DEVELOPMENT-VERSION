import React, { useState } from 'react';
import { ExternalLink, Sparkles, Video, Bot, Globe, CheckCircle, Info } from 'lucide-react';

export const ExternalToolsConnector: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const tools = [
    {
      id: 'yoodli',
      name: 'Yoodli AI Speech Coach',
      tagline: 'Real-time filler word counter, pacing meter & body language coach.',
      icon: Video,
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-200',
      bgLight: 'bg-indigo-50',
      url: 'https://yoodli.ai',
      description: 'Yoodli uses AI to analyze your video responses for eye contact, gesture frequency, talking speed (WPM), and filler words (like "um", "ah", "you know").'
    },
    {
      id: 'google-warmup',
      name: 'Interview Warmup by Google',
      tagline: 'Practice field-specific interview questions with instant transcription.',
      icon: Globe,
      color: 'bg-blue-600',
      borderColor: 'border-blue-200',
      bgLight: 'bg-blue-50',
      url: 'https://grow.google/certificates/interview-warmup/',
      description: 'Google Interview Warmup analyzes your answers in real time, detecting key technical terms, job-specific vocabulary, and repetitive patterns.'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Placement Persona',
      tagline: 'Custom system prompt for interactive HR & Technical roleplay.',
      icon: Bot,
      color: 'bg-emerald-600',
      borderColor: 'border-emerald-200',
      bgLight: 'bg-emerald-50',
      url: 'https://chatgpt.com',
      description: 'Use custom ChatGPT prompts to simulate tough multi-round technical and HR interviews tailored to specific engineering job roles.'
    }
  ];

  return (
    <div className="srit-card p-5 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-3">
        <div>
          <h4 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2 font-heading">
            <Sparkles className="w-4 h-4 text-[#D35400]" />
            Modular External AI Interview Tools
          </h4>
          <p className="text-[11px] text-[#5D6D7E]">
            Optional connectors for specialized speech & interview practice. SAILL works 100% offline even if external services are unavailable.
          </p>
        </div>
        <span className="text-[10px] uppercase font-extrabold bg-[#D35400]/10 text-[#D35400] px-2.5 py-1 rounded-md">
          Modular Connectors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className={`p-3.5 rounded-xl border ${t.borderColor} bg-white hover:shadow-xs transition flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg text-white ${t.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-[#2C3E50]">{t.name}</h5>
                </div>
                <p className="text-[11px] text-[#5D6D7E] leading-relaxed line-clamp-2">
                  {t.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(t.id)}
                  className="text-[11px] font-bold text-[#5D6D7E] hover:text-[#2C3E50] flex items-center gap-1"
                >
                  <Info className="w-3 h-3" /> Info
                </button>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[11px] font-extrabold text-[#D35400] hover:underline flex items-center gap-1"
                >
                  Launch <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border-2 border-[#D35400] shadow-2xl">
            {tools
              .filter((t) => t.id === activeModal)
              .map((t) => (
                <div key={t.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold text-[#2C3E50] flex items-center gap-2">
                      <t.icon className="w-5 h-5 text-[#D35400]" />
                      {t.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="text-gray-400 hover:text-gray-600 font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-[#5D6D7E] leading-relaxed">{t.description}</p>

                  <div className="bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[#D35400]">
                      <CheckCircle className="w-3.5 h-3.5" /> Integration Status
                    </span>
                    <p className="text-[11px] text-[#5D6D7E]">
                      SAILL allows one-click launching. All practice scores and responses generated locally in SAILL are saved to your student laboratory portfolio.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Close
                    </button>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D35400] text-white hover:bg-[#B04300] flex items-center gap-1.5"
                    >
                      Open {t.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
