import React, { useState } from 'react';
import { Layout, Check, ShieldCheck, ArrowRight, Info, AlertTriangle } from 'lucide-react';

interface EmailStructureNetiquetteProps {
  onCompleteActivity: () => void;
}

export const EmailStructureNetiquette: React.FC<EmailStructureNetiquetteProps> = ({ onCompleteActivity }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'netiquette'>('structure');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const emailAnatomyParts = [
    {
      id: 'subject',
      label: '1. Professional Subject Line',
      example: '[Request] Internship NOC Permission - Roll No 264G1A0501',
      description: 'Concise, actionable, and specific summary. Include brackets for categories like [Submission], [Inquiry], or [Request].'
    },
    {
      id: 'greeting',
      label: '2. Formal Salutation / Greeting',
      example: 'Dear Dr. R. V. Sharma, / Dear Hiring Manager,',
      description: 'Address the recipient respectfully by title and last name. Avoid casual greetings like "Hey", "Hi guys", or "Yo".'
    },
    {
      id: 'opening',
      label: '3. Opening & Purpose Statement',
      example: 'I am writing to request On-Duty (OD) permission for participating in the State Level Hackathon...',
      description: 'State your primary purpose in sentence 1. Busy recipients should immediately know why you are emailing.'
    },
    {
      id: 'details',
      label: '4. Supporting Context & Bullet Points',
      example: 'Event Date: July 28-29, 2026\nVenue: JNTU Anantapur\nAttached: Official Selection Letter',
      description: 'Provide key dates, event details, or attached documents. Use bullet points for readability.'
    },
    {
      id: 'closing',
      label: '5. Actionable Closing & Polite Call-to-Action',
      example: 'I would appreciate your approval at your earliest convenience.',
      description: 'Reiterate the next step politely using modal verbs ("would appreciate", "kindly review").'
    },
    {
      id: 'signoff',
      label: '6. Professional Sign-Off',
      example: 'Sincerely, / Best regards, / Respectfully,',
      description: 'Use standard formal sign-offs. Capitalize only the first word.'
    },
    {
      id: 'signature',
      label: '7. Student / Professional Signature',
      example: 'Anil Kumar\nB.Tech Computer Science & Engineering (Year I)\nSrinivasa Ramanujan Institute of Technology (SRIT)\nRoll No: 264G1A0501 | Email: anil.cse26@srit.ac.in',
      description: 'Complete signature block including name, branch, college, roll number, and contact details.'
    }
  ];

  const netiquetteRules = [
    {
      title: 'Professional Language & Avoiding Slang',
      do: 'Use standard academic and workplace English words.',
      dont: 'Never use textspeak or internet slang like "plz", "thx", "btw", "u", "asap".',
      icon: Check
    },
    {
      title: 'Tone & Politeness Indicators',
      do: 'Use modal verbs ("Could you kindly...", "I would be grateful...")',
      dont: 'Avoid imperative commands like "Give me leave", "Check this code now".',
      icon: Check
    },
    {
      title: 'Capitalization & Punctuation',
      do: 'Use standard title case for subject and sentence case for paragraphs.',
      dont: 'NEVER WRITE ENTIRE SENTENCES IN ALL CAPS (it equals shouting) or all lowercase.',
      icon: Check
    },
    {
      title: 'Respectful Communication & Professional Distance',
      do: 'Maintain formal professional boundaries with faculty and recruiters.',
      dont: 'Do not share personal emotional rants or overly informal life updates.',
      icon: Check
    },
    {
      title: 'Grammar Accuracy & Proofreading',
      do: 'Proofread carefully or use AI review tools before pressing Send.',
      dont: 'Avoid sending emails with spelling errors in the professor\'s or company\'s name.',
      icon: Check
    }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Section 2
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#D35400]" />
              2. Email Anatomy, Structure & Netiquette
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Master the 7 essential structural building blocks of formal emails and standard digital netiquette rules.
            </p>
          </div>

          <div className="flex gap-1 bg-[#FFF8F0] p-1 rounded-xl border border-[#FAD7A0] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('structure')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'structure'
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#2C3E50] hover:text-[#D35400]'
              }`}
            >
              Email Anatomy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('netiquette')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'netiquette'
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'text-[#2C3E50] hover:text-[#D35400]'
              }`}
            >
              Email Netiquette
            </button>
          </div>
        </div>

        {activeTab === 'structure' ? (
          <div className="space-y-6">
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center gap-2 text-xs text-[#2C3E50]">
              <Info className="w-4 h-4 text-[#D35400] shrink-0" />
              <span>Hover over or click any structural component below to see its specific rules and formatting examples.</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Email Canvas Mockup */}
              <div className="lg:col-span-7 bg-[#FAFAFA] border-2 border-[#FAD7A0] rounded-2xl p-5 space-y-3 font-mono text-xs shadow-xs">
                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="text-[10px] text-gray-400 font-sans uppercase font-bold">Email Header</div>
                  <div
                    onMouseEnter={() => setHoveredPart('subject')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'subject'
                        ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <span className="text-gray-400 font-sans">Subject: </span>
                    [Request] Internship NOC Permission - Roll No 264G1A0501
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-gray-800">
                  <div
                    onMouseEnter={() => setHoveredPart('greeting')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'greeting' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent'
                    }`}
                  >
                    Dear Dr. R. V. Sharma,
                  </div>

                  <div
                    onMouseEnter={() => setHoveredPart('opening')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'opening' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent'
                    }`}
                  >
                    I am writing to request On-Duty (OD) permission for participating in the State Level Smart India Hackathon taking place at JNTU Anantapur.
                  </div>

                  <div
                    onMouseEnter={() => setHoveredPart('details')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'details' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent'
                    }`}
                  >
                    • Event Dates: July 28 - July 29, 2026<br />
                    • Event Venue: JNTU Anantapur Campus<br />
                    • Attached Document: Official Selection Call Letter
                  </div>

                  <div
                    onMouseEnter={() => setHoveredPart('closing')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'closing' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent'
                    }`}
                  >
                    I would deeply appreciate your kind approval at your earliest convenience so that our team can complete registration.
                  </div>

                  <div
                    onMouseEnter={() => setHoveredPart('signoff')}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      hoveredPart === 'signoff' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent'
                    }`}
                  >
                    Sincerely,
                  </div>

                  <div
                    onMouseEnter={() => setHoveredPart('signature')}
                    className={`p-2 rounded-lg border transition cursor-pointer whitespace-pre-wrap ${
                      hoveredPart === 'signature' ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400]' : 'border-transparent text-gray-600'
                    }`}
                  >
                    Anil Kumar{"\n"}B.Tech Computer Science & Engineering (Year I){"\n"}Srinivasa Ramanujan Institute of Technology (SRIT){"\n"}Roll No: 264G1A0501 | Email: anil.cse26@srit.ac.in
                  </div>
                </div>
              </div>

              {/* Structure Explanation Cards */}
              <div className="lg:col-span-5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {emailAnatomyParts.map((part) => {
                  const isHovered = hoveredPart === part.id;
                  return (
                    <div
                      key={part.id}
                      onMouseEnter={() => setHoveredPart(part.id)}
                      onMouseLeave={() => setHoveredPart(null)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        isHovered
                          ? 'bg-[#FFF8F0] border-[#D35400] shadow-xs'
                          : 'bg-white border-[#FAD7A0] hover:border-[#E67E22]'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-[#2C3E50] mb-1">{part.label}</h4>
                      <p className="text-[11px] text-[#5D6D7E] leading-relaxed mb-2">{part.description}</p>
                      <div className="p-2 bg-white rounded-lg border border-[#FAD7A0] text-[10px] font-mono text-[#D35400] whitespace-pre-wrap">
                        {part.example}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Netiquette Rules Tab */
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center gap-2 text-xs text-[#2C3E50]">
              <ShieldCheck className="w-5 h-5 text-[#D35400] shrink-0" />
              <span>Netiquette governs digital behavior, ensuring your communication reflects dignity, clarity, and professionalism.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {netiquetteRules.map((rule, idx) => (
                <div key={idx} className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-[#2C3E50] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {rule.title}
                  </h4>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[10px] uppercase block text-emerald-800">DO:</span>
                        <span>{rule.do}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[10px] uppercase block text-red-800">DON'T:</span>
                        <span>{rule.dont}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Understand structural blueprints and netiquette rules before building subject lines.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Subject Line Builder <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
