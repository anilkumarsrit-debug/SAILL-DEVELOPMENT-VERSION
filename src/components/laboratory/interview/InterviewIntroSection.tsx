import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Volume2
} from 'lucide-react';
import { ExternalToolsConnector } from './ExternalToolsConnector';

interface InterviewIntroSectionProps {
  onCompleteActivity: () => void;
}

const TOP_HR_QUESTIONS = [
  {
    id: 1,
    question: 'Tell me about yourself.',
    purpose: 'Evaluates conciseness, communication clarity, professional self-image, and relevance to engineering role.',
    keyStrategy: 'Follow the PRESENT-PAST-FUTURE framework: 60-second summary of current degree, top 1-2 projects/skills, and career aspiration.',
    sampleOpening: 'I am a first-year Computer Science student at SRIT with a passion for web development and algorithm optimization...'
  },
  {
    id: 2,
    question: 'Why do you want to join our company?',
    purpose: 'Assesses candidate research, company alignment, genuine motivation, and long-term interest.',
    keyStrategy: 'Mention 2 specific things about the company: recent engineering innovation or client impact, and company core values.',
    sampleOpening: 'I have followed your software division’s recent advancements in cloud architecture, and I resonate deeply with your culture of rapid innovation...'
  },
  {
    id: 3,
    question: 'What is your biggest weakness, and how are you working on it?',
    purpose: 'Tests self-awareness, honesty, and proactive self-improvement mindset.',
    keyStrategy: 'Pick a real professional skill (e.g., public speaking, delegation), explain your self-awareness, and state concrete steps taken.',
    sampleOpening: 'Earlier, I found it challenging to present technical ideas to large audiences without nervous hesitation. To overcome this, I actively participate in the SAILL Language Lab...'
  },
  {
    id: 4,
    question: 'Where do you see yourself in 5 years?',
    purpose: 'Evaluates career ambition, stability, realistic goal setting, and retention probability.',
    keyStrategy: 'Focus on skill growth, domain mastery, and taking on technical ownership within the organization.',
    sampleOpening: 'In 5 years, I envision myself as a Senior Systems Engineer, leading project modules and mentoring junior developers...'
  },
  {
    id: 5,
    question: 'Describe a time you faced a conflict in a project team.',
    purpose: 'Evaluates emotional intelligence, team collaboration, active listening, and conflict resolution.',
    keyStrategy: 'Use the STAR method: Situation, Task, Action (empathy & active listening), and positive Result.',
    sampleOpening: 'During our mini-project, two team members disagreed on database architecture. I organized an objective benchmarking session...'
  }
];

export const InterviewIntroSection: React.FC<InterviewIntroSectionProps> = ({ onCompleteActivity }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Audio Guide Banner */}
      <div className="srit-card p-4 bg-[#2C3E50] text-white border border-[#D35400] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAudio}
            className="p-3 bg-[#D35400] text-white rounded-xl hover:bg-[#B04300] transition shrink-0 shadow-xs"
          >
            <Volume2 className={`w-5 h-5 ${isAudioPlaying ? 'animate-pulse text-yellow-200' : ''}`} />
          </button>
          <div>
            <h4 className="text-xs font-bold text-[#FAD7A0] uppercase tracking-wider">Audio Masterclass</h4>
            <p className="text-xs text-gray-200">
              {isAudioPlaying
                ? 'Playing: "HR Interview Fundamentals & The Present-Past-Future Formula"'
                : 'Listen to 90-second audio guide on HR Placement Interview strategy.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAudio}
          className="text-xs font-bold px-3 py-1.5 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition self-end sm:self-center"
        >
          {isAudioPlaying ? 'Pause Audio' : 'Play Audio Guide'}
        </button>
      </div>

      {/* Main Intro Overview Card */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Activity 1
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            1. Introduction to HR Placement Interviews
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            The HR round is the final gatekeeper in campus recruitment. While technical rounds test what you know, the HR round tests who you are, how you communicate, and how you adapt to corporate culture.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <div className="p-2 rounded-lg bg-[#D35400] text-white w-fit">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">1. Culture Fit & Mindset</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Demonstrates adaptability, positive attitude, professional ethics, and eagerness to learn in team settings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <div className="p-2 rounded-lg bg-[#2C3E50] text-white w-fit">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">2. Communication & Tone</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Grammatical correctness, assertive yet polite tone, structured thoughts, and absence of MTI/filler clutter.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <div className="p-2 rounded-lg bg-emerald-600 text-white w-fit">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">3. Problem-Solving Logic</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              How you handle pressure, team deadlocks, deadlines, and project hurdles using structured logic (STAR framework).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white w-fit">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">4. Career Stability</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Clear alignment between your personal technical aspirations and the hiring organization’s long-term goals.
            </p>
          </div>
        </div>

        {/* Top HR Questions Explorer */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#D35400]" />
            Core HR Questions Breakdown & Answering Strategy
          </h3>

          <div className="space-y-2">
            {TOP_HR_QUESTIONS.map((item) => {
              const isOpen = expandedQuestion === item.id;
              return (
                <div key={item.id} className="border border-[#FAD7A0] rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedQuestion(isOpen ? null : item.id)}
                    className="w-full p-3.5 text-left flex items-center justify-between bg-[#FFF8F0] hover:bg-[#FAD7A0]/30 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#D35400] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        Q{item.id}
                      </span>
                      <span className="text-xs font-extrabold text-[#2C3E50]">{item.question}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#D35400]" /> : <ChevronDown className="w-4 h-4 text-[#5D6D7E]" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 space-y-3 bg-white text-xs text-[#2C3E50] border-t border-[#FAD7A0]">
                      <div>
                        <span className="font-bold text-[#D35400] block mb-0.5">What the Interviewer Evaluates:</span>
                        <p className="text-[#5D6D7E] leading-relaxed">{item.purpose}</p>
                      </div>

                      <div className="bg-[#FFF8F0] p-3 rounded-lg border border-[#FAD7A0]">
                        <span className="font-bold text-[#2C3E50] block mb-0.5">Winning Answering Strategy:</span>
                        <p className="text-[#2C3E50] leading-relaxed">{item.keyStrategy}</p>
                      </div>

                      <div>
                        <span className="font-bold text-emerald-800 block mb-0.5">Recommended Sample Opening:</span>
                        <p className="text-emerald-950 italic bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                          "{item.sampleOpening}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Do's and Don'ts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Do's of HR Placement Interviews
            </h4>
            <ul className="text-[11px] text-emerald-950 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Maintain steady, warm eye contact with the camera/interviewer.</li>
              <li>Use the STAR technique (Situation, Task, Action, Result) for behavioral answers.</li>
              <li>Back claims with concrete project metrics (e.g. "reduced latency by 18%").</li>
              <li>Acknowledge real areas of improvement with active solutions.</li>
              <li>Maintain an enthusiastic, respectful, and articulate tone throughout.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <h4 className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5 uppercase">
              <XCircle className="w-4 h-4 text-rose-600" /> Don'ts of HR Placement Interviews
            </h4>
            <ul className="text-[11px] text-rose-950 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Don't recite a memorized resume word-for-word.</li>
              <li>Avoid generic filler claims like "I am a perfectionist" as a weakness.</li>
              <li>Never speak negatively about past professors, teammates, or colleges.</li>
              <li>Don't slump or use defensive closed-arm body language.</li>
              <li>Avoid rushing through answers without taking a 2-second breath.</li>
            </ul>
          </div>
        </div>

        {/* Modular External Tools */}
        <ExternalToolsConnector />

        {/* Section Completion Trigger */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Understand HR round fundamentals before practicing questions.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Mark Intro Complete & Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
