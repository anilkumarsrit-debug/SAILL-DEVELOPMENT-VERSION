import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  PhoneCall,
  Shirt,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ThumbsUp,
  Award,
  ChevronRight
} from 'lucide-react';

interface Scenario {
  id: string;
  topic: string;
  situation: string;
  options: {
    label: string;
    isBest: boolean;
    aiExplanation: string;
  }[];
}

export const WorkplaceEtiquetteStudio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedScenarioAnswers, setSelectedScenarioAnswers] = useState<Record<string, number>>({});

  const etiquetteTopics = [
    { id: 'greetings', title: '1. Professional Greetings', icon: <Users className="w-4 h-4 text-[#D35400]" />, desc: 'Firm handshake or respectful Namaste, eye contact, introducing self with role and department at SRIT.' },
    { id: 'office_behaviour', title: '2. Office Behaviour & Noise', icon: <Briefcase className="w-4 h-4 text-[#E67E22]" />, desc: 'Maintaining cubicle etiquette, keeping voice volume moderate, respecting personal workspace.' },
    { id: 'meeting_etiquette', title: '3. Meeting Etiquette', icon: <Award className="w-4 h-4 text-amber-600" />, desc: 'Punctuality, reviewing agenda prior, active listening without phone distractions, raising hand to contribute.' },
    { id: 'dress_code', title: '4. Dress Code Awareness', icon: <Shirt className="w-4 h-4 text-emerald-600" />, desc: 'Formal business attire for presentations/interviews, business casual for daily lab sessions.' },
    { id: 'time_management', title: '5. Time Management & Punctuality', icon: <Clock className="w-4 h-4 text-blue-600" />, desc: 'Arriving 5 mins early, meeting project deadlines, giving advance notice for absences.' },
    { id: 'telephone', title: '6. Telephone & Call Etiquette', icon: <PhoneCall className="w-4 h-4 text-purple-600" />, desc: 'Answering calls professionally, stating name and organization, taking clear messages.' },
    { id: 'conversations', title: '7. Professional Conversations', icon: <MessageSquare className="w-4 h-4 text-indigo-600" />, desc: 'Avoiding gossip, maintaining objective work-focused discussion, accepting constructive critique.' },
    { id: 'collaboration', title: '8. Team Collaboration', icon: <Users className="w-4 h-4 text-[#D35400]" />, desc: 'Sharing project updates transparently, helping team members, acknowledging peer contributions.' },
    { id: 'respectful_comm', title: '9. Respectful Workplace Communication', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, desc: 'Using inclusive language, valuing diverse perspectives, resolving conflicts calmly.' }
  ];

  const scenarios: Scenario[] = [
    {
      id: 'sc1',
      topic: 'Meeting Etiquette & Punctuality',
      situation: 'You are leading a project presentation for your SRIT capstone team. A senior faculty mentor arrives 10 minutes late while you are speaking.',
      options: [
        {
          label: 'Pause briefly, acknowledge the mentor politely with "Welcome Professor, we just covered the system architecture", and resume smoothly.',
          isBest: true,
          aiExplanation: 'Best Response: Demonstrates poise, emotional intelligence, and respect for senior leaders without derailing the meeting flow.'
        },
        {
          label: 'Stop your presentation completely and criticize the mentor for arriving late.',
          isBest: false,
          aiExplanation: 'Inappropriate: Confronting senior team members publicly damages professional relationships and violates meeting decorum.'
        },
        {
          label: 'Ignore the mentor entirely and pretend you did not notice them entering.',
          isBest: false,
          aiExplanation: 'Suboptimal: Completely ignoring incoming stakeholders misses an opportunity for welcoming inclusion.'
        }
      ]
    },
    {
      id: 'sc2',
      topic: 'Telephone & Formal Communication',
      situation: 'You receive a phone call from an HR recruiter regarding an engineering internship interview while you are in a noisy campus canteen.',
      options: [
        {
          label: 'Answer immediately and try to shout over the canteen noise to explain your credentials.',
          isBest: false,
          aiExplanation: 'Inappropriate: Background noise creates an unprofessional first impression and impairs clear communication.'
        },
        {
          label: 'Answer politely: "Good morning! Thank you for calling. May I call you back in 3 minutes from a quiet area?" then move to a quiet location immediately.',
          isBest: true,
          aiExplanation: 'Best Response: Shows composure, respect for clear communication, and quick initiative.'
        },
        {
          label: 'Reject the call and send a text saying "who is dis".',
          isBest: false,
          aiExplanation: 'Unprofessional: Casual text messages to recruiters harm your professional image.'
        }
      ]
    },
    {
      id: 'sc3',
      topic: 'Constructive Criticism & Peer Feedback',
      situation: 'During a lab review, a team member points out a mistake in your circuit schematic or code calculation in front of the lab instructor.',
      options: [
        {
          label: 'Become defensive and blame the team member for not checking earlier.',
          isBest: false,
          aiExplanation: 'Suboptimal: Defensive behavior indicates a lack of maturity and inability to receive feedback.'
        },
        {
          label: 'Thank them calmly: "Good catch! Let me update the calculation to ensure our lab report is accurate."',
          isBest: true,
          aiExplanation: 'Best Response: Demonstrates team alignment, growth mindset, and focus on project quality over personal ego.'
        },
        {
          label: 'Refuse to modify your calculation out of spite.',
          isBest: false,
          aiExplanation: 'Inappropriate: Endangers project accuracy and damages team trust.'
        }
      ]
    }
  ];

  const handleSelectOption = (scenarioId: string, optionIdx: number) => {
    setSelectedScenarioAnswers((prev) => ({ ...prev, [scenarioId]: optionIdx }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              2. Workplace Etiquette Studio
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Master 9 core workplace etiquette pillars and practice scenario-based decision making with real-time AI feedback.
            </p>
          </div>
        </div>

        {/* 9 Topics Overview Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
            Key Professional Etiquette Competencies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {etiquetteTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1 hover:border-[#D35400] transition"
              >
                <div className="flex items-center gap-2">
                  {topic.icon}
                  <h4 className="text-xs font-bold text-[#D35400] font-heading">{topic.title}</h4>
                </div>
                <p className="text-[11px] text-[#2C3E50] leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Practice Section */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-sm font-bold text-[#D35400] font-heading">
              Scenario-Based Workplace Practice & AI Analysis
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#FAD7A0] text-[#D35400]">
            Interactive Decision Simulation
          </span>
        </div>

        <div className="space-y-6">
          {scenarios.map((sc, idx) => (
            <div key={sc.id} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#D35400] text-white px-2 py-0.5 rounded">
                  Scenario {idx + 1}: {sc.topic}
                </span>
              </div>

              <p className="text-xs font-bold text-[#2C3E50] leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                "{sc.situation}"
              </p>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D35400]">Choose the most appropriate response:</span>
                {sc.options.map((opt, oIdx) => {
                  const isSelected = selectedScenarioAnswers[sc.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(sc.id, oIdx)}
                      className={`w-full text-left p-3 rounded-lg text-xs transition border flex flex-col gap-1 ${
                        isSelected
                          ? opt.isBest
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-white border-gray-200 hover:border-[#FAD7A0] text-[#2C3E50]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{opt.label}</span>
                        {isSelected && opt.isBest && (
                          <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </div>

                      {isSelected && (
                        <div className="mt-2 p-2 bg-white/80 rounded border border-gray-200 text-[11px] font-bold text-[#D35400] flex items-center gap-1.5 animate-fadeIn">
                          <Sparkles className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                          <span>{opt.aiExplanation}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
