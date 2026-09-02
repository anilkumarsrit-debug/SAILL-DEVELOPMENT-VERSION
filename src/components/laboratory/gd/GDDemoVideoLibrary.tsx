import React, { useState } from 'react';
import { Video, Play, Pause, Volume2, Sparkles, AlertTriangle, CheckCircle2, Award, Clock, FileText, ChevronRight } from 'lucide-react';

export interface GDDemoVideoItem {
  id: string;
  category: 'excellent' | 'average' | 'poor' | 'placement';
  categoryLabel: string;
  title: string;
  topic: string;
  duration: string;
  thumbnailSvg: React.ReactNode;
  summary: string;
  evaluatorRating: string;
  evaluatorScore10: number;
  timestamps: {
    time: string;
    speaker: string;
    action: string;
    annotation: string;
    isGood: boolean;
  }[];
  keyTakeaways: string[];
  evaluatorNotes: string;
}

export const DEMO_VIDEOS: GDDemoVideoItem[] = [
  {
    id: 'demo-01',
    category: 'excellent',
    categoryLabel: 'Excellent Group Discussion',
    title: 'Model Placement GD: AI Ethics in Software Engineering',
    topic: 'Should Artificial Intelligence Development be Strictly Regulated Globally?',
    duration: '06:15',
    thumbnailSvg: (
      <svg viewBox="0 0 400 200" className="w-full h-44 rounded-xl bg-slate-900">
        <rect x="10" y="10" width="380" height="180" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="80" cy="80" r="28" fill="#22c55e" opacity="0.8" />
        <circle cx="160" cy="80" r="28" fill="#3b82f6" opacity="0.8" />
        <circle cx="240" cy="80" r="28" fill="#eab308" opacity="0.8" />
        <circle cx="320" cy="80" r="28" fill="#a855f7" opacity="0.8" />
        <text x="80" y="85" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">S1</text>
        <text x="160" y="85" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">S2</text>
        <text x="240" y="85" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">S3</text>
        <text x="320" y="85" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">S4</text>
        <rect x="40" y="130" width="320" height="35" rx="6" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
        <text x="200" y="152" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold">
          EXCELLENT: Smooth Turn-taking & PREP Consensus
        </text>
      </svg>
    ),
    summary: 'Demonstrates active listening, polite diplomatic rebuttals, data-backed contributions, and a collaborative consensus synthesis.',
    evaluatorRating: 'Outstanding (Grade A+)',
    evaluatorScore10: 9.6,
    timestamps: [
      {
        time: '00:15',
        speaker: 'Speaker 1 (Initiator)',
        action: 'Defined the topic and established core scope.',
        annotation: 'Great opening! Avoided taking a rigid side early and set a balanced framework.',
        isGood: true
      },
      {
        time: '01:40',
        speaker: 'Speaker 2',
        action: 'Provided empirical data on AI safety protocols.',
        annotation: 'Strong technical depth; cited real-world software safety standards.',
        isGood: true
      },
      {
        time: '03:10',
        speaker: 'Speaker 3',
        action: 'Politely intervened using "I agree with Speaker 2, however..."',
        annotation: 'Perfect diplomatic transition phrase. Kept the tone respectful.',
        isGood: true
      },
      {
        time: '05:30',
        speaker: 'Speaker 4 (Summarizer)',
        action: 'Synthesized arguments into 3 main recommendations.',
        annotation: 'Clear, concise group summary that captured both innovation and safety.',
        isGood: true
      }
    ],
    keyTakeaways: [
      'Initiate with a clear definition, not personal opinions.',
      'Acknowledge peer contributions before presenting counter-arguments.',
      'Use transition phrases like "Building upon that point..."',
      'Conclude with a collective group consensus.'
    ],
    evaluatorNotes: 'This group demonstrated high emotional intelligence. Evaluators rewarded them for mutual respect, equal time sharing, and clear synthesis.'
  },
  {
    id: 'demo-02',
    category: 'average',
    categoryLabel: 'Average Group Discussion',
    title: 'Standard Campus GD: Remote Work vs. Office Work',
    topic: 'Is Hybrid Work Model the Future of Engineering Teams?',
    duration: '05:40',
    thumbnailSvg: (
      <svg viewBox="0 0 400 200" className="w-full h-44 rounded-xl bg-slate-900">
        <rect x="10" y="10" width="380" height="180" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="100" cy="80" r="28" fill="#eab308" opacity="0.8" />
        <circle cx="200" cy="80" r="28" fill="#eab308" opacity="0.8" />
        <circle cx="300" cy="80" r="28" fill="#eab308" opacity="0.8" />
        <rect x="40" y="130" width="320" height="35" rx="6" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
        <text x="200" y="152" fill="#eab308" fontSize="12" textAnchor="middle" fontWeight="bold">
          AVERAGE: Repeating Points & Minor Interruptions
        </text>
      </svg>
    ),
    summary: 'Participants state relevant facts, but tend to repeat points without synthesizing new ideas or inviting quiet members.',
    evaluatorRating: 'Average (Grade B)',
    evaluatorScore10: 6.8,
    timestamps: [
      {
        time: '00:20',
        speaker: 'Speaker 1',
        action: 'Opened with general remarks about remote work.',
        annotation: 'Adequate opening, but lacked a structured scope or definition.',
        isGood: true
      },
      {
        time: '02:15',
        speaker: 'Speaker 2',
        action: 'Interrupted Speaker 1 mid-sentence.',
        annotation: 'Minor etiquette violation. Should have waited for a natural pause.',
        isGood: false
      },
      {
        time: '04:00',
        speaker: 'Speaker 3',
        action: 'Repeated Speaker 1\'s point about productivity.',
        annotation: 'Added no new value or technical example. Avoid echo statements.',
        isGood: false
      }
    ],
    keyTakeaways: [
      'Avoid interrupting peers abruptly.',
      'Do not repeat points already stated; add fresh dimensions or examples.',
      'Attempt to summarize key consensus points before time expires.'
    ],
    evaluatorNotes: 'Good basic language fluency, but lacked strategic group collaboration and leadership.'
  },
  {
    id: 'demo-03',
    category: 'poor',
    categoryLabel: 'Poor Group Discussion',
    title: 'Flawed GD: Cashless Economy & Digital Currency',
    topic: 'Will Cryptocurrencies Replace Fiat Money in India?',
    duration: '04:50',
    thumbnailSvg: (
      <svg viewBox="0 0 400 200" className="w-full h-44 rounded-xl bg-slate-900">
        <rect x="10" y="10" width="380" height="180" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="100" cy="80" r="28" fill="#ef4444" opacity="0.8" />
        <circle cx="200" cy="80" r="28" fill="#ef4444" opacity="0.8" />
        <circle cx="300" cy="80" r="28" fill="#ef4444" opacity="0.8" />
        <rect x="40" y="130" width="320" height="35" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
        <text x="200" y="152" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">
          POOR: Aggressive Interruptions & Fish Market Scenario
        </text>
      </svg>
    ),
    summary: 'High aggression, loud talking over peers, lack of eye contact, and abrupt ending without a group summary.',
    evaluatorRating: 'Unsatisfactory (Grade C)',
    evaluatorScore10: 4.2,
    timestamps: [
      {
        time: '00:10',
        speaker: 'Speaker 1',
        action: 'Shouted to gain early entry.',
        annotation: 'Critical error! Aggressive shouting creates a negative first impression.',
        isGood: false
      },
      {
        time: '01:30',
        speaker: 'Speaker 2 & 3',
        action: 'Simultaneous arguing over crypto volatility.',
        annotation: '"Fish market" scenario. Neither speaker listened to the other.',
        isGood: false
      },
      {
        time: '04:10',
        speaker: 'Group',
        action: 'Time expired without consensus or summary.',
        annotation: 'Group failed the primary objective of collaborative problem-solving.',
        isGood: false
      }
    ],
    keyTakeaways: [
      'Never raise your voice or argue aggressively.',
      'A GD is not a shouting match; volume does not equal logic.',
      'Maintain eye contact with the entire group, not the evaluator.'
    ],
    evaluatorNotes: 'Evaluators penalize candidate groups that descend into chaos. Self-restraint and mediation win marks.'
  },
  {
    id: 'demo-04',
    category: 'placement',
    categoryLabel: 'Campus Placement Group Discussion',
    title: 'Tier-1 IT Recruitment GD: Cloud vs. Edge Computing',
    topic: 'Is Edge Computing Eliminating the Need for Centralized Cloud Data Centers?',
    duration: '07:00',
    thumbnailSvg: (
      <svg viewBox="0 0 400 200" className="w-full h-44 rounded-xl bg-slate-900">
        <rect x="10" y="10" width="380" height="180" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="80" cy="80" r="28" fill="#38bdf8" opacity="0.8" />
        <circle cx="160" cy="80" r="28" fill="#22c55e" opacity="0.8" />
        <circle cx="240" cy="80" r="28" fill="#38bdf8" opacity="0.8" />
        <circle cx="320" cy="80" r="28" fill="#eab308" opacity="0.8" />
        <rect x="40" y="130" width="320" height="35" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="200" y="152" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
          PLACEMENT SIMULATION: Technical Precision & Leadership
        </text>
      </svg>
    ),
    summary: 'A realistic tech company placement drive simulation. Demonstrates technical domain vocabulary, latency calculations, and inviting silent peers.',
    evaluatorRating: 'Selected for Technical HR Round',
    evaluatorScore10: 9.2,
    timestamps: [
      {
        time: '00:25',
        speaker: 'Candidate A',
        action: 'Framed the hybrid architecture concept.',
        annotation: 'Excellent technical grounding. Used terms like "latency", "bandwidth", and "fog nodes".',
        isGood: true
      },
      {
        time: '03:15',
        speaker: 'Candidate B',
        action: 'Noticed Candidate D was silent and invited them to speak.',
        annotation: 'High Leadership & Teamwork mark! Inviting quiet members is prized by recruiters.',
        isGood: true
      },
      {
        time: '06:20',
        speaker: 'Candidate C',
        action: 'Summarized with a clear hybrid cloud-edge roadmap.',
        annotation: 'Clear technical synthesis.',
        isGood: true
      }
    ],
    keyTakeaways: [
      'Incorporate domain-specific engineering vocabulary.',
      'Demonstrate leadership by inviting quiet or hesitant candidates.',
      'Frame solutions around hybrid balance rather than extreme binary choices.'
    ],
    evaluatorNotes: 'Highly rated by technical HR panellists. Candidates B and C received top scores for teamwork and synthesis.'
  }
];

export const GDDemoVideoLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'excellent' | 'average' | 'poor' | 'placement'>('all');
  const [activeVideoId, setActiveVideoId] = useState<string>('demo-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const filteredVideos = DEMO_VIDEOS.filter(
    (v) => selectedCategory === 'all' || v.category === selectedCategory
  );

  const currentVideo = DEMO_VIDEOS.find((v) => v.id === activeVideoId) || DEMO_VIDEOS[0];

  const speakTranscriptAction = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 2: GD Demo Video Library & Performance Breakdown
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Analyze authentic sample group discussions across performance grades with timestamped commentary and evaluator notes.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        {[
          { id: 'all', label: 'All Videos' },
          { id: 'excellent', label: '• Excellent GD' },
          { id: 'average', label: '• Average GD' },
          { id: 'poor', label: '• Poor GD' },
          { id: 'placement', label: '• Campus Placement GD' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              selectedCategory === cat.id
                ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs font-black'
                : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-amber-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Video Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Player & Timestamps (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            {currentVideo.thumbnailSvg}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  speakTranscriptAction(`Playing GD demo: ${currentVideo.title}. Topic is: ${currentVideo.topic}`);
                }}
                className="w-16 h-16 rounded-full bg-[#D35400] text-white flex items-center justify-center hover:scale-105 transition shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white flex justify-between items-center text-xs">
              <div>
                <span className="font-extrabold text-[#FAD7A0] block">{currentVideo.title}</span>
                <span className="text-[10px] text-slate-300">Topic: {currentVideo.topic}</span>
              </div>
              <span className="font-mono bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">
                {currentVideo.duration}
              </span>
            </div>
          </div>

          {/* Evaluator Score Banner */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#E67E22]">Evaluator Grade</span>
              <h4 className="font-black text-[#2C3E50] text-sm">{currentVideo.evaluatorRating}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-[#5D6D7E]">Score</span>
              <span className="text-2xl font-black font-mono text-[#D35400] block">
                {currentVideo.evaluatorScore10} / 10
              </span>
            </div>
          </div>

          {/* Timestamped Commentary & Action Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase text-[#2C3E50] tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D35400]" />
              <span>Timestamped Action Log & Evaluator Annotations</span>
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {currentVideo.timestamps.map((ts, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border space-y-1 ${
                    ts.isGood
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-[#2C3E50]">
                      {ts.time}
                    </span>
                    <span className="uppercase text-[10px]">{ts.speaker}</span>
                  </div>
                  <p className="font-semibold text-xs">{ts.action}</p>
                  <p className="text-[10px] italic opacity-90">💡 Evaluator Note: {ts.annotation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Selector List & Key Takeaways (1 Col) */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#2C3E50] block uppercase">
            Select Video Demo ({filteredVideos.length})
          </span>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {filteredVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setActiveVideoId(video.id);
                  setIsPlaying(false);
                }}
                className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  activeVideoId === video.id
                    ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#D35400] text-white flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-extrabold text-[#2C3E50] block leading-tight line-clamp-1">
                    {video.title}
                  </span>
                  <span className="text-[10px] text-[#D35400] font-bold block">{video.categoryLabel}</span>
                  <span className="text-[10px] text-[#5D6D7E] block font-mono">Score: {video.evaluatorScore10}/10</span>
                </div>
              </button>
            ))}
          </div>

          {/* Key Takeaways Card */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-black text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Key Evaluator Takeaways</span>
            </h4>
            <ul className="space-y-1.5 text-amber-900 text-[11px] list-disc list-inside">
              {currentVideo.keyTakeaways.map((kw, i) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
