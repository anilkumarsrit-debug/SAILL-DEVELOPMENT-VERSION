import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Layers,
  FileText,
  Clock,
  Gauge,
  Award,
  BookOpen,
  ArrowRight,
  Tv
} from 'lucide-react';

interface TranscriptSegment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
  stage: string;
}

interface VideoItem {
  id: string;
  modelNumber: number;
  modelLabel: string;
  category: 'placement' | 'academic' | 'corporate' | 'motivational';
  categoryLabel: string;
  title: string;
  speaker: string;
  role: string;
  duration: string;
  durationSeconds: number;
  wpmRate: number;
  thumbnailGradient: string;
  slideTheme: {
    bg: string;
    accent: string;
    border: string;
  };
  openingHook: string;
  keyTakeaways: string[];
  strengths: string[];
  slides: {
    title: string;
    subtitle: string;
    bullets: string[];
    highlight: string;
  }[];
  transcript: TranscriptSegment[];
}

export const PSVideoLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'placement' | 'academic' | 'corporate' | 'motivational'>('all');
  const [activeVideoId, setActiveVideoId] = useState<string>('v-placement-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'slides' | 'analysis' | 'takeaways'>('transcript');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  const playbackTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const videoList: VideoItem[] = [
    {
      id: 'v-placement-1',
      modelNumber: 1,
      modelLabel: 'Model Presentation 1',
      category: 'placement',
      categoryLabel: 'Campus Placement Presentations',
      title: 'Model Presentation 1: 3-Minute Technical Elevator Pitch (TCS / Infosys Placement)',
      speaker: 'Siddharth M. (B.Tech CSE, SRIT Alumnus)',
      role: 'Campus Placement Top Performer',
      duration: '3:15',
      durationSeconds: 195,
      wpmRate: 142,
      thumbnailGradient: 'from-blue-700 via-indigo-900 to-slate-900',
      slideTheme: {
        bg: 'from-blue-950 to-slate-900',
        accent: '#60A5FA',
        border: 'border-blue-500/40'
      },
      openingHook: '"Imagine reducing database query latency by 40% using just 50 lines of clean cache middleware..."',
      slides: [
        {
          title: '01. The Latency Bottleneck',
          subtitle: 'Real-world problem statement in mobile transactions',
          bullets: [
            '40% user drop-off observed when API responses exceed 300ms',
            'Relational database locks create high concurrency queuing bottlenecks',
            'Target objective: Sub-50ms query response at zero infrastructure cost surge'
          ],
          highlight: 'Metric Impact: 320ms -> 45ms Latency Reduction'
        },
        {
          title: '02. Solution Architecture',
          subtitle: 'Intelligent multi-tier Redis in-memory cache layer',
          bullets: [
            'Implemented LRU (Least Recently Used) cache eviction policy in Node.js',
            'Automated cache-aside synchronization with PostgreSQL database',
            'Fault-tolerant fallback to primary DB during transient network blips'
          ],
          highlight: 'Architecture: Microservice caching pattern'
        },
        {
          title: '03. Benchmarking & Business Impact',
          subtitle: 'Experimental validation across 10,000 simulated client requests',
          bullets: [
            'System throughput scaled to 2,400 requests/sec with zero 500 errors',
            'CPU utilization on database server dropped from 88% down to 24%',
            'Readiness to contribute production-grade TypeScript engineering on day one'
          ],
          highlight: 'Call to Action: Ready for enterprise full-stack deployment'
        }
      ],
      keyTakeaways: [
        'Uses the Problem-Solution-Impact structure within the first 60 seconds.',
        'Maintains ideal 140 WPM pace without rushing technical jargon.',
        'Closes with a clear call to action regarding campus project contributions.'
      ],
      strengths: [
        'Vocal projection and crisp articulation of algorithmic concepts.',
        'Zero filler words ("um", "uh") during high-pressure Q&A.',
        'Open palm gestures to signal confidence and transparency.'
      ],
      transcript: [
        {
          time: '0:00',
          seconds: 0,
          stage: 'Hook & Opening',
          speaker: 'Siddharth M.',
          text: 'Good morning respected recruiters and panel members. Did you know that over 40% of mobile app drop-offs occur due to slow database response times? In e-commerce and fintech, even a two-hundred millisecond delay translates into direct revenue loss.'
        },
        {
          time: '0:38',
          seconds: 38,
          stage: 'Problem & Engineering Challenge',
          speaker: 'Siddharth M.',
          text: 'To solve this engineering challenge during my major project, our team designed an intelligent caching layer using Redis and Node.js. Traditional relational databases bottleneck under concurrent load, whereas our in-memory cache intercepts ninety percent of repetitive queries.'
        },
        {
          time: '1:18',
          seconds: 78,
          stage: 'Experimental Validation',
          speaker: 'Siddharth M.',
          text: 'In our rigorous benchmarking tests across ten thousand simulated requests, response time dropped from three hundred twenty milliseconds down to just forty-five milliseconds. Database CPU usage dropped by over sixty percent.'
        },
        {
          time: '2:05',
          seconds: 125,
          stage: 'Learning & Reflection',
          speaker: 'Siddharth M.',
          text: 'This experience taught me how to profile system performance, optimize algorithmic throughput, and write modular, test-driven TypeScript code aligned with clean architecture principles.'
        },
        {
          time: '2:45',
          seconds: 165,
          stage: 'Call to Action',
          speaker: 'Siddharth M.',
          text: 'Thank you for your time, and I look forward to contributing these problem-solving skills to your enterprise cloud and backend engineering teams.'
        }
      ]
    },
    {
      id: 'v-academic-1',
      modelNumber: 2,
      modelLabel: 'Model Presentation 2',
      category: 'academic',
      categoryLabel: 'Academic Presentations',
      title: 'Model Presentation 2: Final Year B.Tech Project Viva & Research Paper Defense',
      speaker: 'Ananya Roy (M.Tech AI Scholar)',
      role: 'Research Presenter & IEEE Student Member',
      duration: '4:30',
      durationSeconds: 270,
      wpmRate: 135,
      thumbnailGradient: 'from-emerald-800 via-teal-950 to-slate-900',
      slideTheme: {
        bg: 'from-emerald-950 to-slate-900',
        accent: '#34D399',
        border: 'border-emerald-500/40'
      },
      openingHook: '"Respected Committee Members, today I present our novel transformer architecture for low-resource Indian languages..."',
      slides: [
        {
          title: '01. Research Motivation & Gap',
          subtitle: 'Addressing low-resource multilingual NLP limitations',
          bullets: [
            'Current LLMs require 7B+ parameters, exceeding edge smartphone capacity',
            'Telugu and regional dialects suffer from high tokenization fragmentation',
            'Goal: 8-bit quantized transformer with <100MB RAM footprint'
          ],
          highlight: 'Focus: Low-Resource Indic Neural Translation'
        },
        {
          title: '02. Methodology & Quantization',
          subtitle: 'Post-training quantization and cross-lingual distillation',
          bullets: [
            'Trained on 450,000 paired bilingual sentences with byte-pair encoding',
            'Applied dynamic weight quantization from Float32 to Int8 precision',
            'Perplexity degradation was constrained to less than 1.4 BLEU points'
          ],
          highlight: 'Memory Footprint: Reduced by 65%'
        },
        {
          title: '03. Validation & IEEE Findings',
          subtitle: 'Experimental results on low-power IoT microcontrollers',
          bullets: [
            'Inference latency achieved: 112ms per translated sentence on Raspberry Pi 4',
            'Validation BLEU score reached 34.8 on the benchmark IndicCorp test set',
            'Ready to address technical queries from the examination committee'
          ],
          highlight: 'Published: IEEE Conference on Intelligent Systems 2026'
        }
      ],
      keyTakeaways: [
        'Structures research slides into Objective, Methodology, Results, and Future Work.',
        'Explains mathematical equations visually without overloading slides.',
        'Handles peer critique with calm, evidence-based academic responses.'
      ],
      strengths: [
        'Excellent slide design following the 6x6 minimalist rule.',
        'Precise signpost transitions ("Having examined dataset preprocessing, let us turn to neural accuracy...")',
        'Balanced pitch inflection when highlighting 94.2% model accuracy.'
      ],
      transcript: [
        {
          time: '0:00',
          seconds: 0,
          stage: 'Formal Introduction',
          speaker: 'Ananya Roy',
          text: 'Respected Dean, Faculty Committee Members, and peers: welcome to our research paper defense on Low-Resource Multilingual Neural Machine Translation. Today, linguistic barriers prevent millions of rural citizens from accessing telemedicine and digital governance services.'
        },
        {
          time: '0:55',
          seconds: 55,
          stage: 'Research Gap & Problem',
          speaker: 'Ananya Roy',
          text: 'Existing state-of-the-art transformer architectures demand gigabytes of GPU memory, making on-device execution impossible for rural healthcare workers equipped only with budget smartphones.'
        },
        {
          time: '1:50',
          seconds: 110,
          stage: 'Methodology & Optimization',
          speaker: 'Ananya Roy',
          text: 'Our proposed approach introduces an eight-bit integer quantized encoder-decoder model. By applying knowledge distillation and vocabulary pruning, we compressed the model footprint by sixty-five percent while preserving ninety-four percent translation fidelity.'
        },
        {
          time: '3:05',
          seconds: 185,
          stage: 'Results & Hardware Proof',
          speaker: 'Ananya Roy',
          text: 'As demonstrated in Figure 3, inference latency on low-power hardware dropped below one hundred twenty milliseconds, allowing real-time voice translation at thirty-four point eight BLEU score.'
        },
        {
          time: '4:00',
          seconds: 240,
          stage: 'Conclusion & Q&A Invitation',
          speaker: 'Ananya Roy',
          text: 'In conclusion, this research proves that neural efficiency can democratize technology access. We now welcome any technical queries from the honorable examination committee.'
        }
      ]
    },
    {
      id: 'v-corporate-1',
      modelNumber: 3,
      modelLabel: 'Model Presentation 3',
      category: 'corporate',
      categoryLabel: 'Corporate Presentations',
      title: 'Model Presentation 3: Cloud Architecture & Serverless Modernization Proposal',
      speaker: 'Vikram Seth (Senior Cloud Architect)',
      role: 'Enterprise Solutions Director',
      duration: '5:10',
      durationSeconds: 310,
      wpmRate: 148,
      thumbnailGradient: 'from-purple-900 via-indigo-950 to-slate-900',
      slideTheme: {
        bg: 'from-purple-950 to-slate-900',
        accent: '#C084FC',
        border: 'border-purple-500/40'
      },
      openingHook: '"Executive stakeholders, transitioning our legacy monolith to serverless microservices will save $120,000 annually..."',
      slides: [
        {
          title: '01. The Cost of Legacy Monoliths',
          subtitle: 'Current downtime risks and fixed server overhead',
          bullets: [
            'Single point of failure: 8% payment gateway drop-off during peak sales',
            'Over-provisioned idle VM instances costing $18,500 every single month',
            'Manual deployment cycles bottleneck feature release to once per 6 weeks'
          ],
          highlight: 'Financial Loss: $140K in annual missed transactions'
        },
        {
          title: '02. Serverless Modernization Plan',
          subtitle: 'Event-driven AWS Lambda & DynamoDB migration',
          bullets: [
            'Auto-scales from 100 to 50,000 concurrent transactions in <2 seconds',
            'Zero idle cost: Billing triggers strictly per millisecond of compute used',
            'Zero-downtime blue-green canary deployment pipelines via GitHub Actions'
          ],
          highlight: 'Architecture: 99.99% Enterprise SLA Guarantee'
        },
        {
          title: '03. ROI & Phased Rollout Schedule',
          subtitle: 'Clear milestone payback in under 7 months',
          bullets: [
            'Phase 1 (Month 1-2): Authentication and Payment Gateway Isolation',
            'Phase 2 (Month 3-4): Catalog & Inventory event queues migration',
            'Projected bottom-line savings: $120,000 net annual operating reduction'
          ],
          highlight: 'Payback Period: 7 Months with 300% ROI'
        }
      ],
      keyTakeaways: [
        'Translates complex cloud architecture diagrams into financial ROI for executives.',
        'Uses persuasive contrast ("Current Downtime Cost vs Cloud Reliability").',
        'Confidently navigates stakeholder risk questions.'
      ],
      strengths: [
        'Authoritative posture with firm eye contact across the boardroom.',
        'Strategic 2-second pauses before delivering key financial statistics.',
        'High audience engagement with interactive polling.'
      ],
      transcript: [
        {
          time: '0:00',
          seconds: 0,
          stage: 'Executive Hook',
          speaker: 'Vikram Seth',
          text: 'Good afternoon, executive leadership team. Transitioning our legacy monolithic infrastructure to event-driven serverless microservices will save our enterprise one hundred twenty thousand dollars annually while eliminating downtime during peak festival sales.'
        },
        {
          time: '1:15',
          seconds: 75,
          stage: 'Financial Risk Context',
          speaker: 'Vikram Seth',
          text: 'Last quarter, server timeouts caused an eight percent abandonment rate at checkout. Furthermore, our current dedicated cloud servers cost eighteen thousand five hundred dollars monthly, even when operating at twenty percent baseline traffic.'
        },
        {
          time: '2:30',
          seconds: 150,
          stage: 'Technical Strategy',
          speaker: 'Vikram Seth',
          text: 'By migrating payment and catalog pipelines to serverless functions with DynamoDB, our infrastructure auto-scales effortlessly to fifty thousand concurrent shoppers in under two seconds. Crucially, we pay zero dollars when the system is idle.'
        },
        {
          time: '3:50',
          seconds: 230,
          stage: 'ROI & Milestone Roadmap',
          speaker: 'Vikram Seth',
          text: 'Our phased migration roadmap guarantees zero customer disruption across ninety days. The capital investment achieves a complete payback within seven months, backed by a ninety-nine point nine nine percent uptime guarantee.'
        },
        {
          time: '4:45',
          seconds: 285,
          stage: 'Call for Approval',
          speaker: 'Vikram Seth',
          text: 'We request your authorization to commence Phase One sprint kickoff this Monday. Thank you, and I am ready to address any operational or security questions.'
        }
      ]
    },
    {
      id: 'v-motivational-1',
      modelNumber: 4,
      modelLabel: 'Model Presentation 4',
      category: 'motivational',
      categoryLabel: 'Motivational & Keynotes',
      title: 'Model Presentation 4: Keynote on Engineering Ethics & Human-AI Synergy',
      speaker: 'Dr. Radhika Nair (Tech Futurist)',
      role: 'Keynote Speaker & Author',
      duration: '6:00',
      durationSeconds: 360,
      wpmRate: 130,
      thumbnailGradient: 'from-amber-700 via-orange-950 to-slate-900',
      slideTheme: {
        bg: 'from-amber-950 to-slate-900',
        accent: '#FBBF24',
        border: 'border-amber-500/40'
      },
      openingHook: '"What happens when code no longer just executes commands, but makes decisions that impact human lives?"',
      slides: [
        {
          title: '01. The Great Responsibility',
          subtitle: 'From mechanical computation to autonomous decision making',
          bullets: [
            'Software engineers are now the architects of civil societal trust',
            'Algorithms determine credit approval, healthcare triage, and justice',
            'The pivotal question is no longer "Can we build it?" but "Should we build it?"'
          ],
          highlight: 'Keynote Pillar: Ethics by Design'
        },
        {
          title: '02. Human-AI Symbiosis',
          subtitle: 'Amplifying empathy alongside computational velocity',
          bullets: [
            'AI excels at pattern recognition; humans excel at moral reasoning',
            'Protecting user data privacy is not a feature; it is a fundamental human right',
            'Designing inclusive algorithms that reflect our collective humanity'
          ],
          highlight: 'Vision: AI Augmenting Human Dignity'
        },
        {
          title: '03. The Engineer’s Oath',
          subtitle: 'A call to action for the next generation of engineers',
          bullets: [
            'Write code that champions equity, transparency, and accessible education',
            'Refuse to compromise system security or bias audits for quick profits',
            'Build technology that leaves our communities more united, just, and empowered'
          ],
          highlight: 'Closing Aphorism: Build with Empathy & Conscience'
        }
      ],
      keyTakeaways: [
        'Captivates audience using personal narrative and ethical dilemmas.',
        'Masters vocal dynamics—dropping volume for suspense and raising pitch for inspiration.',
        'Employs full stage movement and open posture.'
      ],
      strengths: [
        'Mastery of story arc (Hook -> Tension -> Paradigm Shift -> Inspiring Vision).',
        'Zero slide text clutter; relies on high-impact visual imagery.',
        'Memorable closing aphorism that stays with the audience.'
      ],
      transcript: [
        {
          time: '0:00',
          seconds: 0,
          stage: 'Story Hook & Tension',
          speaker: 'Dr. Radhika Nair',
          text: 'Ten years ago, in a quiet computer vision lab, we wrote a script that automated medical scan classification. That night, I realized a profound truth: technology is never neutral. The algorithms we compile hold real human consequences.'
        },
        {
          time: '1:30',
          seconds: 90,
          stage: 'The Ethical Dilemma',
          speaker: 'Dr. Radhika Nair',
          text: 'When software decides who receives a loan, who gets admitted for emergency triage, or how autonomous vehicles react in an emergency, code transforms from mere syntax into social policy.'
        },
        {
          time: '3:05',
          seconds: 185,
          stage: 'The Paradigm Shift',
          speaker: 'Dr. Radhika Nair',
          text: 'The true promise of Artificial Intelligence is not replacing human beings—it is elevating human empathy. We need engineers who possess mathematical rigor in their intellect, and profound moral conviction in their hearts.'
        },
        {
          time: '4:40',
          seconds: 280,
          stage: 'Inspiring Vision',
          speaker: 'Dr. Radhika Nair',
          text: 'As first-year engineers sitting in this auditorium today, you hold the keyboards that will script the digital destiny of our nation. Do not simply build for speed and quarterly metrics.'
        },
        {
          time: '5:35',
          seconds: 335,
          stage: 'Climactic Call to Action',
          speaker: 'Dr. Radhika Nair',
          text: 'Build for human dignity, build for lasting inclusion, and build with unwavering integrity. Thank you.'
        }
      ]
    }
  ];

  const currentVideo = videoList.find((v) => v.id === activeVideoId) || videoList[0];

  const filteredVideos = selectedCategory === 'all'
    ? videoList
    : videoList.filter((v) => v.category === selectedCategory);

  // Clean up audio on unmount or switch
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    stopAudio();
    setCurrentTime(0);
    setActiveSegmentIndex(0);
  }, [activeVideoId, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Audio Equalizer Waveform Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 36;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          const freq1 = Math.sin(phase + i * 0.4) * 0.5 + 0.5;
          const freq2 = Math.cos(phase * 1.5 + i * 0.3) * 0.5 + 0.5;
          barHeight = Math.max(6, (freq1 * 0.6 + freq2 * 0.4) * (height - 8) * (isMuted ? 0.1 : volume));
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient color for bars
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#D35400');
        grad.addColorStop(1, '#FAD7A0');

        ctx.fillStyle = isPlaying ? grad : '#5D6D7E';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08 * playbackRate;
      }
      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackRate, volume, isMuted]);

  // Start speech playback from a given time/segment
  const startSpeechFromSegment = (segIdx: number, startSecOffset = 0) => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setActiveSegmentIndex(segIdx);
    const targetSegment = currentVideo.transcript[segIdx];
    const segmentStartTime = targetSegment.seconds + startSecOffset;
    setCurrentTime(segmentStartTime);
    setIsPlaying(true);

    // Speak all remaining transcript segments sequentially
    const speakRemaining = (idx: number) => {
      if (idx >= currentVideo.transcript.length) {
        setIsPlaying(false);
        setCurrentTime(currentVideo.durationSeconds);
        return;
      }

      const seg = currentVideo.transcript[idx];
      setActiveSegmentIndex(idx);

      if ('speechSynthesis' in window && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(seg.text);
        utterance.rate = playbackRate * (currentVideo.wpmRate / 140);
        utterance.volume = isMuted ? 0 : volume;
        utterance.pitch = 1.0;

        // Select suitable English voice
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Daniel')));
        if (engVoice) utterance.voice = engVoice;

        utterance.onend = () => {
          if (idx + 1 < currentVideo.transcript.length) {
            speakRemaining(idx + 1);
          } else {
            setIsPlaying(false);
            setCurrentTime(currentVideo.durationSeconds);
          }
        };

        utterance.onerror = () => {
          // Fallback advance
          if (idx + 1 < currentVideo.transcript.length) {
            speakRemaining(idx + 1);
          } else {
            setIsPlaying(false);
          }
        };

        synthUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    };

    speakRemaining(segIdx);

    // Run local clock timer
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    playbackTimerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= currentVideo.durationSeconds) {
          if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
          setIsPlaying(false);
          return currentVideo.durationSeconds;
        }

        // Sync segment index
        const matchIdx = currentVideo.transcript.findIndex((s, i) => {
          const nextSec = currentVideo.transcript[i + 1]?.seconds || currentVideo.durationSeconds + 1;
          return next >= s.seconds && next < nextSec;
        });
        if (matchIdx !== -1 && matchIdx !== activeSegmentIndex) {
          setActiveSegmentIndex(matchIdx);
        }

        return next;
      });
    }, 1000 / playbackRate);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      if (currentTime >= currentVideo.durationSeconds) {
        setCurrentTime(0);
        startSpeechFromSegment(0);
      } else {
        startSpeechFromSegment(activeSegmentIndex);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSec = Number(e.target.value);
    setCurrentTime(newSec);
    const matchIdx = currentVideo.transcript.findIndex((s, i) => {
      const nextSec = currentVideo.transcript[i + 1]?.seconds || currentVideo.durationSeconds + 1;
      return newSec >= s.seconds && newSec < nextSec;
    });
    const targetIdx = matchIdx !== -1 ? matchIdx : 0;
    if (isPlaying) {
      stopAudio();
      startSpeechFromSegment(targetIdx);
    } else {
      setActiveSegmentIndex(targetIdx);
    }
  };

  const formatSecToMin = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header & Filter Controls */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] flex items-center justify-center font-bold">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
                Curated Presentation Video & Model Library
              </h3>
              <p className="text-xs text-[#5D6D7E] mt-0.5">
                4 Official Benchmark Model Presentations with Interactive Audio/Video Speech Synthesizer & Visual Deck
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold shrink-0">
          {[
            { id: 'all', label: 'All 4 Models' },
            { id: 'placement', label: 'Placement' },
            { id: 'academic', label: 'Academic' },
            { id: 'corporate', label: 'Corporate' },
            { id: 'motivational', label: 'Keynote' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D35400] text-white shadow-2xs font-black'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Video & Model Audio Playback Stage */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visual Stage Player Card */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentVideo.thumbnailGradient} text-white shadow-lg relative overflow-hidden space-y-4 border border-white/10`}>
            {/* Top Bar on Player */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[#FAD7A0]">
                  {currentVideo.modelLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-200 bg-black/40 px-2.5 py-1 rounded-md">
                  {currentVideo.categoryLabel}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#FAD7A0] font-bold flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{currentVideo.wpmRate} WPM</span>
                </span>
                <span className="text-slate-300">
                  {formatSecToMin(currentTime)} / {currentVideo.duration}
                </span>
              </div>
            </div>

            {/* Stage Body / Active Visual Slide Preview */}
            <div className="py-2 space-y-3">
              <div>
                <h4 className="text-lg sm:text-xl font-black font-heading leading-tight text-white">
                  {currentVideo.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Speaker: <strong className="text-white">{currentVideo.speaker}</strong> • {currentVideo.role}
                </p>
              </div>

              {/* Active Spoken Segment Highlight Banner */}
              <div className="p-3.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#FAD7A0] font-bold uppercase flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                    <span>Active Section: {currentVideo.transcript[activeSegmentIndex]?.stage || 'Presentation Opening'}</span>
                  </span>
                  <span className="text-slate-300">Timestamp: {currentVideo.transcript[activeSegmentIndex]?.time}</span>
                </div>
                <p className="text-xs text-white leading-relaxed font-sans italic">
                  "{currentVideo.transcript[activeSegmentIndex]?.text}"
                </p>
              </div>

              {/* Live Audio Equalizer Waveform */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
                  <span>Audio Spectrum / Speech Synthesizer Output</span>
                  <span>{isPlaying ? 'Live Model Playback Active' : 'Ready to Play'}</span>
                </div>
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={34}
                  className="w-full h-8 bg-black/50 rounded-lg border border-white/10"
                />
              </div>
            </div>

            {/* Timeline Scrub Bar */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min={0}
                max={currentVideo.durationSeconds}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-300">
                <span>{formatSecToMin(currentTime)}</span>
                <span>{currentVideo.duration}</span>
              </div>
            </div>

            {/* Player Control Bar */}
            <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause Model Speech' : 'Play Benchmark Audio'}</span>
                </button>

                <button
                  onClick={() => {
                    stopAudio();
                    setCurrentTime(0);
                    startSpeechFromSegment(0);
                  }}
                  title="Restart from beginning"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Volume Controls */}
              <div className="flex items-center gap-3 text-xs">
                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-[11px] font-mono">
                  <span className="text-slate-300 text-[10px]">Speed:</span>
                  {[0.75, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-1.5 py-0.5 rounded transition ${
                        playbackRate === rate ? 'bg-[#D35400] text-white font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Volume Mute Toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-[#FAD7A0]" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Transcript, Presentation Deck, Strengths, Key Takeaways */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'transcript' ? 'bg-[#D35400] text-white shadow-2xs font-black' : 'bg-[#FFF8F0] text-[#2C3E50] hover:bg-[#FAD7A0]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Interactive Transcript</span>
              </button>

              <button
                onClick={() => setActiveTab('slides')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'slides' ? 'bg-[#D35400] text-white shadow-2xs font-black' : 'bg-[#FFF8F0] text-[#2C3E50] hover:bg-[#FAD7A0]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Visual Presentation Deck</span>
              </button>

              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'analysis' ? 'bg-[#D35400] text-white shadow-2xs font-black' : 'bg-[#FFF8F0] text-[#2C3E50] hover:bg-[#FAD7A0]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Delivery Strengths</span>
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'takeaways' ? 'bg-[#D35400] text-white shadow-2xs font-black' : 'bg-[#FFF8F0] text-[#2C3E50] hover:bg-[#FAD7A0]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Takeaways</span>
              </button>
            </div>

            {/* TAB CONTENT: Transcript */}
            {activeTab === 'transcript' && (
              <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <h5 className="font-extrabold text-[#2C3E50] uppercase text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D35400]" />
                    <span>Click Any Paragraph to Jump & Listen</span>
                  </h5>
                  <span className="text-[10px] text-[#5D6D7E] font-mono">Pace: {currentVideo.wpmRate} WPM</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {currentVideo.transcript.map((seg, idx) => {
                    const isCurrent = activeSegmentIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => startSpeechFromSegment(idx)}
                        className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                          isCurrent
                            ? 'bg-white border-[#D35400] ring-2 ring-[#D35400]/20 shadow-xs'
                            : 'bg-white/80 border-[#FAD7A0] hover:bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#D35400] bg-[#FFF8F0] px-1.5 py-0.5 rounded font-mono">
                              {seg.time}
                            </span>
                            <span className="font-bold text-[#2C3E50]">{seg.stage}</span>
                          </div>
                          {isCurrent && isPlaying && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                              <Volume2 className="w-3 h-3" />
                              <span>Speaking...</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#2C3E50] leading-relaxed">{seg.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Slides */}
            {activeTab === 'slides' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentVideo.slides.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2 text-xs shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-[#FAD7A0] font-bold uppercase block">
                          Slide 0{idx + 1} • {s.subtitle}
                        </span>
                        <h6 className="font-bold text-sm text-white">{s.title}</h6>
                        <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                          {s.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-2 bg-white/10 rounded-lg text-[10px] font-mono text-[#FAD7A0] font-bold border border-white/10">
                        {s.highlight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Analysis */}
            {activeTab === 'analysis' && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2.5 text-xs">
                <h5 className="font-extrabold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Demonstrated Delivery Strengths</span>
                </h5>
                <ul className="space-y-2 text-emerald-950 text-xs">
                  {currentVideo.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-emerald-200/60 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB CONTENT: Takeaways */}
            {activeTab === 'takeaways' && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2.5 text-xs">
                <h5 className="font-extrabold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D35400]" />
                  <span>Actionable Takeaways for Engineering Students</span>
                </h5>
                <ul className="space-y-2 text-amber-950 text-xs">
                  {currentVideo.keyTakeaways.map((kt, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-2xs">
                      <ArrowRight className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
                      <span>{kt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Model Presentations Selector (All 4 Models) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Select Model Presentation</span>
            </h4>
            <span className="text-[10px] font-bold text-[#5D6D7E] bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#FAD7A0]">
              {filteredVideos.length} Available
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredVideos.map((v) => {
              const isSelected = v.id === activeVideoId;
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveVideoId(v.id);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400]/30 shadow-md'
                      : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]/70'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-[#D35400] uppercase font-mono bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                      {v.modelLabel}
                    </span>
                    <span className="text-[#5D6D7E] font-mono font-bold">{v.duration}</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-extrabold text-[#2C3E50] leading-snug">
                      {v.title}
                    </h5>
                    <p className="text-[11px] text-[#5D6D7E] mt-0.5">{v.speaker} • {v.role}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#FAD7A0]/60">
                    <span className="text-[#D35400] font-bold font-mono">Pace: {v.wpmRate} WPM</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      isSelected && isPlaying
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : isSelected
                        ? 'bg-[#D35400] text-white'
                        : 'bg-gray-100 text-[#5D6D7E]'
                    }`}>
                      {isSelected && isPlaying ? 'Playing Audio' : isSelected ? 'Selected' : 'Select Model'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-1 text-[#5D6D7E]">
            <span className="font-bold text-[#D35400] block text-[11px]">Pedagogical Guidance:</span>
            <p className="text-[11px] leading-relaxed">
              Listen to the pace, articulation, and hook strategies across all 4 presentations before recording your own speech in the Voice Coach and Speech Studio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
