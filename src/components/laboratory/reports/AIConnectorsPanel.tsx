import React, { useState } from 'react';
import { Cpu, CheckCircle2, Zap, Settings2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const AIConnectorsPanel: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'grammarly' | 'chatgpt' | 'hemingway' | 'saill'>('saill');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const connectors = [
    {
      id: 'saill',
      name: 'SAILL Native AI Engine',
      badge: 'Default • On-Premise',
      description: 'Integrated local AI engine tuned specifically for the R26 Communicative English Laboratory syllabus.',
      features: ['10-Mark Rubric Evaluation', 'IEEE Format Validation', 'Instant Offline Response']
    },
    {
      id: 'grammarly',
      name: 'Grammarly Business',
      badge: 'Enterprise Integration',
      description: 'Advanced real-time grammar review, professional tone consistency, and executive writing suggestions.',
      features: ['Grammar & Punctuation Audit', 'Tone Alignment', 'Plagiarism Detection']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Technical Writer',
      badge: 'OpenAI GPT-4o Connector',
      description: 'Generates structured report abstracts, technical vocabulary enhancements, and section breakdowns.',
      features: ['Report Abstract Generation', 'IEEE Citation Assistant', 'Technical Vocabulary Expansion']
    },
    {
      id: 'hemingway',
      name: 'Hemingway Editor Engine',
      badge: 'Readability Analyzer',
      description: 'Highlights complex sentences, passive voice usage, and wordiness to achieve peak technical conciseness.',
      features: ['Readability Grade Score', 'Passive Voice Detection', 'Sentence Simplification']
    }
  ];

  const handleSelectEngine = (id: 'grammarly' | 'chatgpt' | 'hemingway' | 'saill') => {
    setActiveEngine(id);
    setStatusMsg(`Engine switched to ${connectors.find((c) => c.id === id)?.name}`);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b border-[#FAD7A0] pb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#D35400] font-heading">
              AI Technical Writing Engine Connectors
            </h3>
            <p className="text-xs text-[#2C3E50]">
              Modular integration supporting Grammarly Business, ChatGPT, Hemingway Editor, and SAILL Native Engine.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-600" />
          Active: {connectors.find((c) => c.id === activeEngine)?.name}
        </span>
      </div>

      {statusMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {connectors.map((conn) => (
          <div
            key={conn.id}
            onClick={() => handleSelectEngine(conn.id as any)}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
              activeEngine === conn.id
                ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                : 'bg-white border-gray-200 hover:border-[#FAD7A0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#D35400] font-heading">{conn.name}</h4>
              <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 font-bold">
                {conn.badge}
              </span>
            </div>

            <p className="text-[11px] text-[#2C3E50] leading-relaxed">{conn.description}</p>

            <div className="space-y-1 border-t border-gray-100 pt-2">
              {conn.features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-[#E67E22] shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
