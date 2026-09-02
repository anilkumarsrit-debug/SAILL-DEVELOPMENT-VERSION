import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Eye,
  MessageSquare
} from 'lucide-react';

export const IntroductionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'examples' | 'quiz'>('pillars');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const pillars = [
    {
      title: 'Importance of Professional Behaviour',
      icon: <Briefcase className="w-5 h-5 text-[#D35400]" />,
      desc: 'Professional behavior defines how colleagues, managers, and clients perceive your credibility. In engineering workplaces, technical knowledge must be backed by reliability, respect, and emotional intelligence.'
    },
    {
      title: 'First Impressions & Digital Presence',
      icon: <Eye className="w-5 h-5 text-[#E67E22]" />,
      desc: '70% of professional evaluations happen within the first 30 seconds of an interaction—whether via an elevator pitch, a LinkedIn headline, or a video meeting greeting.'
    },
    {
      title: 'Corporate Expectations in Engineering',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      desc: 'Global tech companies expect punctuality, proactive communication, adherence to NDA/confidentiality rules, constructive conflict resolution, and active participation in agile sprints.'
    },
    {
      title: 'Academic Professionalism at SRIT',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Demonstrating academic integrity, submitting laboratory work punctually, addressing faculty with respect, and adhering to campus dress codes build the foundation for career readiness.'
    },
    {
      title: 'Ethical Communication & AI Usage',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      desc: 'Ethical communication requires honesty, proper citation of technical sources, responsible AI tool usage (transparency without plagiarism), and inclusive language across diverse teams.'
    }
  ];

  const conductExamples = [
    {
      domain: 'Workplace Greetings & Meetings',
      professional: 'Arriving 5 minutes early, making eye contact, giving a firm handshake or respectful namaste, and keeping phone on silent during discussions.',
      unprofessional: 'Slouching into the meeting room 10 minutes late, checking personal social media messages during project updates, and interrupting colleagues.'
    },
    {
      domain: 'Digital & Email Netiquette',
      professional: 'Using descriptive email subject lines, starting with formal salutations, proofreading before sending, and copying relevant team leads transparently.',
      unprofessional: 'Sending ALL CAPS angry emails, using informal text slang ("pls fix dis bro") to professors/managers, or forwarding confidential company documents.'
    },
    {
      domain: 'LinkedIn & Social Media',
      professional: 'Maintaining a clean professional bio, sharing B.Tech project updates with IEEE context, and engaging in constructive industry discussions.',
      unprofessional: 'Posting controversial rants, using casual party photos as a professional avatar, or plagiarizing others\' technical project write-ups.'
    },
    {
      domain: 'Virtual Video Calls',
      professional: 'Testing camera/mic before joining, keeping camera ON with a clean neutral background, muting when not speaking, and using the raise-hand feature.',
      unprofessional: 'Attending virtual meetings in casual sleepwear, eating noisy snacks on open mic, or abruptly dropping off without sending a chat notice.'
    }
  ];

  const quizQuestions = [
    {
      q: 'Which of the following is considered best practice when emailing an engineering professor or hiring manager?',
      options: [
        'Use "Hey bro" as the opening greeting to sound friendly.',
        'Include a clear, concise subject line and a formal salutation like "Dear Dr. / Professor".',
        'Write the entire message in capital letters for urgency.',
        'Omit your name and roll number since they can check the sender address.'
      ],
      correct: 1,
      explanation: 'Descriptive subject lines and formal salutations establish immediate respect and academic professionalism.'
    },
    {
      q: 'What is the recommended approach for camera protocols during virtual team meetings?',
      options: [
        'Keep camera off and never speak unless directly called upon.',
        'Keep camera ON with a clean, well-lit neutral background and professional attire.',
        'Eat food on camera to save time during project meetings.',
        'Use distracting animated background filters.'
      ],
      correct: 1,
      explanation: 'Maintaining eye contact and professional attire on camera builds trust and engagement in remote work environments.'
    },
    {
      q: 'Which LinkedIn headline best represents a high-impact B.Tech engineering student at SRIT?',
      options: [
        'Student at College',
        'B.Tech CSE Student @ SRIT | Full-Stack & Cloud Architecture Enthusiast | Building IoT Solutions',
        'Looking for any job urgently',
        'Gamer & Coder'
      ],
      correct: 1,
      explanation: 'Specific headlines mentioning branch, institution, technical skill focus, and target domains attract recruiters.'
    }
  ];

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleEvaluateQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              1. Introduction to Professional Etiquette
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Foundation of corporate behavior, first impressions, ethical communication, and academic professionalism.
            </p>
          </div>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex gap-2 border-b border-gray-100 pb-2">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'pillars'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Core Pillars
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'examples'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Professional vs Unprofessional Conduct
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#D35400] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Self-Check Quiz
          </button>
        </div>

        {/* Tab 1: Core Pillars */}
        {activeTab === 'pillars' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 hover:shadow-2xs transition"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]">
                    {p.icon}
                  </div>
                  <h3 className="text-xs font-bold text-[#D35400] font-heading">{p.title}</h3>
                </div>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Professional vs Unprofessional Conduct */}
        {activeTab === 'examples' && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#2C3E50]">
              Compare real-world engineering scenarios to recognize expected workplace behavior:
            </p>
            <div className="grid grid-cols-1 gap-4">
              {conductExamples.map((item, idx) => (
                <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-[#D35400] font-heading block border-b pb-1">
                    {item.domain}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Professional Conduct</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">{item.professional}</p>
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Unprofessional Conduct</span>
                      </div>
                      <p className="text-xs text-rose-900 leading-relaxed">{item.unprofessional}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Self-Check Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#2C3E50]">
              Test your understanding of corporate etiquette and digital professionalism:
            </p>

            <div className="space-y-4">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
                  <p className="text-xs font-bold text-[#D35400]">
                    Q{qIdx + 1}: {q.q}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerSelect(qIdx, oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition ${
                          selectedAnswers[qIdx] === oIdx
                            ? 'bg-[#D35400] text-white border-[#D35400]'
                            : 'bg-white text-[#2C3E50] border-gray-200 hover:border-[#FAD7A0]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {quizScore !== null && (
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-xs text-[#2C3E50]">
                      <span className="font-bold text-[#D35400]">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleEvaluateQuiz}
                className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B94600] transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Submit Self-Check Answers
              </button>

              {quizScore !== null && (
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Quiz Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
