import React, { useState } from 'react';
import {
  Globe,
  Mail,
  Video,
  Share2,
  Lock,
  Bot,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send,
  ArrowRight
} from 'lucide-react';
import { EtiquetteBrandingCoach } from '../../../services/ai/etiquetteBrandingCoach';

export const DigitalNetiquetteStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'principles' | 'rewrite' | 'evaluate'>('principles');

  // Rewrite state
  const [informalInput, setInformalInput] = useState<string>(
    'hey bro pls gimme the lab report code u tested yesterday I missed the class thx'
  );
  const [rewriteResult, setRewriteResult] = useState<{
    professionalVersion: string;
    keyImprovements: string[];
  } | null>(null);

  // Evaluate interactive activity state
  const [evaluatedScenarios, setEvaluatedScenarios] = useState<Record<number, 'appropriate' | 'inappropriate'>>({});

  const netiquettePillars = [
    { title: '1. Professional Email Behaviour', icon: <Mail className="w-4 h-4 text-[#D35400]" />, desc: 'Descriptive subject lines, professional greetings, concise structure, proper sign-offs.' },
    { title: '2. Video Meeting Etiquette', icon: <Video className="w-4 h-4 text-[#E67E22]" />, desc: 'Camera on with clean background, mute when silent, proper framing, professional attire.' },
    { title: '3. Social Media Responsibility', icon: <Share2 className="w-4 h-4 text-amber-600" />, desc: 'Understanding digital footprint, avoiding public complaints about employers/institution.' },
    { title: '4. Professional Instant Messaging', icon: <MessageSquare className="w-4 h-4 text-emerald-600" />, desc: 'Using Slack/Teams respectfully, avoiding midnight pinging unless urgent, clear context.' },
    { title: '5. Online Meeting Behaviour', icon: <Globe className="w-4 h-4 text-blue-600" />, desc: 'Raising hand before speaking, using in-meeting chat constructively, avoiding side chatter.' },
    { title: '6. Respectful Online Discussions', icon: <MessageSquare className="w-4 h-4 text-purple-600" />, desc: 'Disagreeing with ideas politely without personal attacks in forums or code reviews.' },
    { title: '7. Privacy & Confidentiality', icon: <Lock className="w-4 h-4 text-indigo-600" />, desc: 'Protecting sensitive lab data, proprietary code, NDA agreements, and personal IDs.' },
    { title: '8. Responsible AI Usage', icon: <Bot className="w-4 h-4 text-emerald-600" />, desc: 'Transparently disclosing AI assistance, avoiding plagiarism, auditing generated output.' }
  ];

  const digitalInteractions = [
    {
      id: 1,
      context: 'Slack / Teams Project Group',
      message: '"WHY IS THE CODE NOT WORKING??? WHO TOUCHED MY REPO AT 2 AM?? FIX THIS RIGHT NOW!!"',
      isAppropriate: false,
      reason: 'All caps tone expresses aggression. Public blame damages team morale instead of constructive debugging.'
    },
    {
      id: 2,
      context: 'Virtual Lab Session Chat',
      message: '"Hi team, I noticed a minor null pointer in module 4. I have created a pull request with the fix. Please review when free."',
      isAppropriate: true,
      reason: 'Polite, objective, solution-oriented, and provides clear actionable context for peers.'
    },
    {
      id: 3,
      context: 'Email to Faculty Lead',
      message: '"hey prof send me extension for lab submission I was busy with sports festival thx"',
      isAppropriate: false,
      reason: 'Lacks formal salutation, uses informal texting abbreviations, and demands an extension without polite justification.'
    }
  ];

  const handleRewrite = () => {
    if (!informalInput.trim()) return;
    const result = EtiquetteBrandingCoach.rewriteNetiquetteMessage(informalInput);
    setRewriteResult(result);
  };

  const handleClassifyInteraction = (id: number, classification: 'appropriate' | 'inappropriate') => {
    setEvaluatedScenarios((prev) => ({ ...prev, [id]: classification }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              3. Digital Communication & Netiquette
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Master online professional conduct across email, Slack/Teams, video conferences, social media, and AI tools.
            </p>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex gap-2 border-b border-gray-100 pb-2">
          <button
            onClick={() => setActiveTab('principles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'principles'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Netiquette Principles
          </button>
          <button
            onClick={() => setActiveTab('rewrite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'rewrite'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Message Professionalizer
          </button>
          <button
            onClick={() => setActiveTab('evaluate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'evaluate'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Audit Digital Behaviour
          </button>
        </div>

        {/* Tab 1: Netiquette Principles */}
        {activeTab === 'principles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {netiquettePillars.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  {p.icon}
                  <h3 className="text-xs font-bold text-[#D35400] font-heading">{p.title}</h3>
                </div>
                <p className="text-[11px] text-[#2C3E50] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Message Professionalizer */}
        {activeTab === 'rewrite' && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#2C3E50]">
              Convert informal or blunt messages into formal, netiquette-compliant professional emails/messages:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#D35400] block">Informal Draft Message:</label>
              <textarea
                value={informalInput}
                onChange={(e) => setInformalInput(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none font-mono"
                placeholder="Type your informal message here..."
              />
              <button
                onClick={handleRewrite}
                className="px-4 py-2 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#B94600] transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Transform to Professional Netiquette
              </button>
            </div>

            {rewriteResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold border-b border-emerald-200 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Netiquette Transformation Complete:</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Polished Professional Version:</span>
                  <pre className="p-3 bg-white border border-emerald-200 rounded-lg text-xs font-mono text-gray-800 whitespace-pre-wrap">
                    {rewriteResult.professionalVersion}
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Key Improvements Made:</span>
                  <ul className="list-disc pl-4 text-xs text-emerald-900 space-y-1">
                    {rewriteResult.keyImprovements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Audit Digital Behaviour */}
        {activeTab === 'evaluate' && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#2C3E50]">
              Evaluate real sample digital messages and identify appropriate vs inappropriate netiquette:
            </p>

            <div className="space-y-4">
              {digitalInteractions.map((item) => {
                const userChoice = evaluatedScenarios[item.id];
                return (
                  <div key={item.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                      Context: {item.context}
                    </span>

                    <p className="text-xs font-mono bg-white p-3 rounded-lg border border-gray-200 text-gray-800 italic">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleClassifyInteraction(item.id, 'appropriate')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                          userChoice === 'appropriate'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Appropriate
                      </button>

                      <button
                        onClick={() => handleClassifyInteraction(item.id, 'inappropriate')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                          userChoice === 'inappropriate'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Inappropriate
                      </button>
                    </div>

                    {userChoice && (
                      <div
                        className={`p-3 rounded-lg text-xs border space-y-1 ${
                          (userChoice === 'appropriate') === item.isAppropriate
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#D35400]" />
                          <span>
                            {(userChoice === 'appropriate') === item.isAppropriate
                              ? 'Correct Classification!'
                              : 'Review Netiquette Audit:'}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">{item.reason}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
