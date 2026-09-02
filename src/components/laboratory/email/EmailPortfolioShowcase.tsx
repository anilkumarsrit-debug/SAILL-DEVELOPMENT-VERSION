import React, { useState } from 'react';
import { Award, Briefcase, Mail, AlertOctagon, Sparkles, CheckCircle2, ArrowRight, Share2, Download } from 'lucide-react';

interface PortfolioItemCard {
  id: string;
  category: string;
  title: string;
  subject: string;
  body: string;
  score: number;
  facultyFeedback: string;
  badge: string;
}

interface EmailPortfolioShowcaseProps {
  onCompleteActivity: () => void;
}

export const EmailPortfolioShowcase: React.FC<EmailPortfolioShowcaseProps> = ({ onCompleteActivity }) => {
  const [items] = useState<PortfolioItemCard[]>([
    {
      id: 'port-01',
      category: 'Best Professional Email',
      title: 'Infosys Summer Internship Application',
      subject: '[Application] Summer Software Engineering Internship 2026 - Anil Kumar (264G1A0501)',
      body: 'Dear Hiring Manager,\n\nI am writing to formally express my enthusiastic interest in the Summer Software Engineering Internship position at Tech Corp. I am currently a First-Year B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT).\n\nThrough my rigorous academic coursework, I have developed a solid foundation in Data Structures, Algorithms, and Object-Oriented Software Design in Java and Python...',
      score: 9.8,
      facultyFeedback: 'Pristine professional presentation! Ready for direct corporate submission.',
      badge: 'Corporate Ready'
    },
    {
      id: 'port-02',
      category: 'Best Complaint Email',
      title: 'Lab Equipment Maintenance Complaint',
      subject: '[Technical Complaint] Monitor & USB Peripheral Issue - Language Lab PC 14',
      body: 'Dear Lab In-Charge,\n\nI would like to bring to your notice a technical issue with Computer System No. 14 in the Language Laboratory. During our morning speech drill, the monitor failed to display video and the optical mouse was unresponsive...\n\nCould you kindly inspect or replace the faulty peripheral when convenient?\n\nThank you for your support.',
      score: 9.5,
      facultyFeedback: 'Firm, constructive problem description without emotional or aggressive tone.',
      badge: 'Constructive Diction'
    },
    {
      id: 'port-03',
      category: 'Best Request Email',
      title: 'On-Duty Leave Request for State Hackathon',
      subject: '[Leave Request] On-Duty Permission for State Hackathon - 264G1A0501',
      body: 'Dear Dr. R. V. Sharma,\n\nI am writing to request On-Duty (OD) leave for two days, from July 28 to July 29, 2026, to participate in the State Level Smart India Hackathon taking place at JNTU Anantapur...\n\nI have attached the official call letter for your kind perusal.\n\nSincerely,\nAnil Kumar (264G1A0501)',
      score: 9.6,
      facultyFeedback: 'Includes all mandatory credentials, dates, and attachments clearly.',
      badge: 'Academic Excellence'
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>('port-01');
  const activeItem = items.find((i) => i.id === activeTab) || items[0];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 12
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            12. Student Email Portfolio Showcase
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Showcase of your benchmark professional emails, complaint drafts, request letters, and faculty feedback endorsements.
          </p>
        </div>

        {/* Portfolio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === item.id
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{item.category}</span>
            </button>
          ))}
        </div>

        {/* Active Showcase Item */}
        <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-white px-2 py-0.5 rounded-md border border-[#FAD7A0]">
                {activeItem.badge}
              </span>
              <h3 className="text-base font-extrabold text-[#2C3E50] mt-1">{activeItem.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-[#FAD7A0] text-center">
                <span className="text-[9px] font-bold uppercase text-[#D35400] block">Score</span>
                <span className="text-sm font-black text-[#2C3E50]">{activeItem.score} / 10</span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-white p-5 rounded-xl border border-[#FAD7A0] space-y-3 font-mono text-xs text-[#2C3E50] shadow-2xs">
            <div>
              <span className="text-[10px] text-[#D35400] font-sans block font-bold">Subject Line:</span>
              <span className="font-extrabold text-[#2C3E50]">{activeItem.subject}</span>
            </div>
            <div className="border-t border-[#FAD7A0] pt-3 whitespace-pre-wrap leading-relaxed text-[#2C3E50]">
              {activeItem.body}
            </div>
          </div>

          {/* Faculty Endorsement */}
          <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase text-[10px] block text-emerald-800">Faculty Endorsement:</span>
              <span className="italic">{activeItem.facultyFeedback}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Congratulations on completing all 12 sections of Module 7 (Professional Email & Business Writing)!
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Finish & Save Portfolio Module
          </button>
        </div>
      </div>
    </div>
  );
};
