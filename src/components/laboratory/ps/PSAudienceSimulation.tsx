import React, { useState, useEffect } from 'react';
import { Users, Eye, Sparkles, CheckCircle2, MessageSquare, ThumbsUp, Heart } from 'lucide-react';
import { AudiencePersona } from '../../../services/ai/presentationCoach';

interface PSAudienceSimulationProps {
  topicTitle: string;
  onProceedToQA: () => void;
}

export const PSAudienceSimulation: React.FC<PSAudienceSimulationProps> = ({
  topicTitle,
  onProceedToQA
}) => {
  const [audienceList, setAudienceList] = useState<AudiencePersona[]>([
    {
      id: 'aud-1',
      name: 'Dr. Ramesh V.',
      role: 'Senior Academic Faculty Judge',
      avatar: '👨‍🏫',
      attitude: 'Analytical',
      currentReaction: 'Nodding',
      feedbackQuote: `Clear problem framing on "${topicTitle}" and strong alignment with first-year academic standards.`
    },
    {
      id: 'aud-2',
      name: 'Priya Sharma',
      role: 'Corporate Campus Recruiter (TCS / Infosys)',
      avatar: '👩‍💼',
      attitude: 'Supportive',
      currentReaction: 'Taking Notes',
      feedbackQuote: 'Impressed by the structured pacing, confident vocal modulation, and absence of excessive filler words.'
    },
    {
      id: 'aud-3',
      name: 'Vikram Seth',
      role: 'Industry Enterprise Tech Lead',
      avatar: '👨‍💻',
      attitude: 'Critical',
      currentReaction: 'Thoughtful',
      feedbackQuote: 'Appreciated the practical examples. Looking forward to evaluating real-world application in the Q&A.'
    },
    {
      id: 'aud-4',
      name: 'Ananya Roy',
      role: 'Student Peer & Innovation Lead',
      avatar: '👩‍🎓',
      attitude: 'Curious',
      currentReaction: 'Raising Hand',
      feedbackQuote: 'Very relatable presentation! Eager to ask a follow-up query during the Q&A session.'
    }
  ]);

  useEffect(() => {
    setAudienceList([
      {
        id: 'aud-1',
        name: 'Dr. Ramesh V.',
        role: 'Senior Academic Faculty Judge',
        avatar: '👨‍🏫',
        attitude: 'Analytical',
        currentReaction: 'Nodding',
        feedbackQuote: `Clear problem framing on "${topicTitle}" and strong alignment with first-year academic standards.`
      },
      {
        id: 'aud-2',
        name: 'Priya Sharma',
        role: 'Corporate Campus Recruiter (TCS / Infosys)',
        avatar: '👩‍💼',
        attitude: 'Supportive',
        currentReaction: 'Taking Notes',
        feedbackQuote: 'Impressed by the structured pacing, confident vocal modulation, and absence of excessive filler words.'
      },
      {
        id: 'aud-3',
        name: 'Vikram Seth',
        role: 'Industry Enterprise Tech Lead',
        avatar: '👨‍💻',
        attitude: 'Critical',
        currentReaction: 'Thoughtful',
        feedbackQuote: 'Appreciated the practical examples. Looking forward to evaluating real-world application in the Q&A.'
      },
      {
        id: 'aud-4',
        name: 'Ananya Roy',
        role: 'Student Peer & Innovation Lead',
        avatar: '👩‍🎓',
        attitude: 'Curious',
        currentReaction: 'Raising Hand',
        feedbackQuote: 'Very relatable presentation! Eager to ask a follow-up query during the Q&A session.'
      }
    ]);
  }, [topicTitle]);

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 8: Live AI Audience Simulation & Sentiment Meter
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Simulated audience reactions for "{topicTitle}" from academic faculty judges, corporate recruiters, and peers.
          </p>
        </div>

        {/* Live Sentiment Gauge */}
        <div className="flex items-center gap-2 bg-[#FFF8F0] px-3.5 py-1.5 rounded-xl border border-[#FAD7A0]">
          <Sparkles className="w-4 h-4 text-[#D35400]" />
          <div className="text-xs">
            <span className="text-[10px] text-[#5D6D7E] block uppercase font-mono">Audience Sentiment</span>
            <span className="font-bold text-[#D35400]">92% High Engagement</span>
          </div>
        </div>
      </div>

      {/* Audience Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {audienceList.map((aud) => (
          <div key={aud.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3 relative overflow-hidden shadow-2xs">
            <div className="flex justify-between items-start">
              <span className="text-3xl">{aud.avatar}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                {aud.currentReaction}
              </span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-[#2C3E50] font-heading">{aud.name}</h4>
              <p className="text-[10px] text-[#5D6D7E] font-medium leading-tight">{aud.role}</p>
            </div>

            <div className="p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-[10px] text-[#2C3E50] italic leading-relaxed">
              "{aud.feedbackQuote}"
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onProceedToQA}
          className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Proceed to Interactive Audience Q&A Session</span>
        </button>
      </div>
    </div>
  );
};
