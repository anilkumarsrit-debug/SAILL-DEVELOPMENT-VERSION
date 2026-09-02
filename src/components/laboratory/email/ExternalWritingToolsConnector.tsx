import React, { useState } from 'react';
import { Cpu, CheckCircle2, Sparkles, Sliders, ExternalLink, RefreshCw } from 'lucide-react';

interface ExternalWritingToolsConnectorProps {
  onSelectEngine?: (engineId: 'saill' | 'grammarly' | 'chatgpt' | 'gemini') => void;
}

export const ExternalWritingToolsConnector: React.FC<ExternalWritingToolsConnectorProps> = ({ onSelectEngine }) => {
  const [activeEngine, setActiveEngine] = useState<'saill' | 'grammarly' | 'chatgpt' | 'gemini'>('saill');

  const engines = [
    {
      id: 'saill' as const,
      name: 'SAILL On-Device AI Engine',
      badge: 'Native R26 Engine',
      description: 'Built-in offline-compatible AI evaluator calibrated specifically for R26 Communicative English Lab rubrics.',
      features: ['10-Parameter Scoring', 'Offline Support', 'Zero API Key Required', 'Instant Local Response'],
      isDefault: true
    },
    {
      id: 'grammarly' as const,
      name: 'Grammarly Integration',
      badge: 'External Connector',
      description: 'Modular connector placeholder for Grammarly SDK realtime proofreading and punctuation analysis.',
      features: ['Grammar Checking', 'Punctuation Suggestions', 'Tone Detection', 'Writing Clarity Score'],
      isDefault: false
    },
    {
      id: 'chatgpt' as const,
      name: 'ChatGPT Connector',
      badge: 'External Connector',
      description: 'Modular connector placeholder for OpenAI GPT-4o email refinement and personalized tone suggestions.',
      features: ['Grammar Refinement', 'Professional Tone Improvement', 'Alternative Sentences', 'Email Rewriting'],
      isDefault: false
    },
    {
      id: 'gemini' as const,
      name: 'Google Gemini AI Connector',
      badge: 'External Connector',
      description: 'Modular connector placeholder for Google Gemini Pro writing enhancement and multimodal review.',
      features: ['Writing Enhancement', 'Clarity Improvement', 'Contextual Diction', 'Multimodal Context'],
      isDefault: false
    }
  ];

  const handleSelect = (engineId: 'saill' | 'grammarly' | 'chatgpt' | 'gemini') => {
    setActiveEngine(engineId);
    if (onSelectEngine) {
      onSelectEngine(engineId);
    }
  };

  return (
    <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
            R26 AI Engine Settings
          </span>
          <h3 className="text-sm font-extrabold text-[#2C3E50] mt-1 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D35400]" />
            Modular AI Writing Tools & Connectors
          </h3>
          <p className="text-xs text-[#5D6D7E]">
            Switch between the native SAILL AI Engine or modular connectors for Grammarly, ChatGPT, and Gemini.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0] text-xs font-bold text-[#D35400] shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active: {engines.find((e) => e.id === activeEngine)?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {engines.map((eng) => {
          const isSelected = activeEngine === eng.id;
          return (
            <div
              key={eng.id}
              onClick={() => handleSelect(eng.id)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                  : 'bg-white border-[#FAD7A0] hover:border-[#E67E22]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-[#D35400] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {eng.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <h4 className="text-xs font-bold text-[#2C3E50] pt-1">{eng.name}</h4>
                <p className="text-[10px] text-[#5D6D7E] leading-relaxed">{eng.description}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-gray-100">
                <span className="text-[9px] font-bold text-[#D35400] uppercase block">Capabilities:</span>
                <ul className="space-y-0.5 text-[10px] text-[#2C3E50]">
                  {eng.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
