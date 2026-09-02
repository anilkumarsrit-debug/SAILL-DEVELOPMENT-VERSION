import React, { useState } from 'react';
import { Cpu, CheckCircle2, Zap, Palette, Linkedin, Bot, Sparkles } from 'lucide-react';

export const EtiquetteConnectorsPanel: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'saill' | 'chatgpt' | 'canva' | 'linkedin'>('saill');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const connectors = [
    {
      id: 'saill',
      name: 'SAILL Native AI Engine',
      badge: 'Default • On-Premise',
      description: 'Integrated local AI engine tuned specifically for the R26 Communicative English Laboratory syllabus.',
      icon: <Cpu className="w-5 h-5 text-[#D35400]" />,
      features: ['10-Mark Rubric Evaluation', 'Digital Persona Audit', 'Instant Offline Response']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Professional Coach',
      badge: 'OpenAI GPT-4o Connector',
      description: 'Generates polished branding statements, executive bios, professional communication guidance, and career advice.',
      icon: <Bot className="w-5 h-5 text-emerald-600" />,
      features: ['Branding Statement Generator', 'Executive Bio Enhancer', 'Professional Etiquette Advice']
    },
    {
      id: 'canva',
      name: 'Canva AI Visual Studio',
      badge: 'Modular Visual Connector',
      description: 'Provides graphic layout ideas, LinkedIn banner templates, and visual personal branding assets.',
      icon: <Palette className="w-5 h-5 text-purple-600" />,
      features: ['LinkedIn Banner Ideas', 'Portfolio Graphics Layout', 'Visual Brand Assets']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn AI Optimization',
      badge: 'Profile Intelligence',
      description: 'Suggests high-impact headlines, About section keywords, skill recommendations, and profile optimization tips.',
      icon: <Linkedin className="w-5 h-5 text-blue-600" />,
      features: ['Headline Optimizer', 'Keyword Recommendation', 'Skill Endorsement Prep']
    }
  ];

  const handleSelectEngine = (id: 'saill' | 'chatgpt' | 'canva' | 'linkedin') => {
    setActiveEngine(id);
    const conn = connectors.find((c) => c.id === id);
    setStatusMsg(`Engine connector switched to ${conn?.name}`);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b border-[#FAD7A0] pb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#D35400] font-heading">
              AI & Brand Tool Connectors (R26 Syllabus)
            </h3>
            <p className="text-xs text-[#2C3E50]">
              Modular integration supporting ChatGPT, Canva AI, LinkedIn AI Features, and SAILL Native Engine.
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
              <div className="flex items-center gap-2">
                {conn.icon}
                <h4 className="text-xs font-bold text-[#D35400] font-heading">{conn.name}</h4>
              </div>
            </div>

            <span className="inline-block text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 font-bold">
              {conn.badge}
            </span>

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
