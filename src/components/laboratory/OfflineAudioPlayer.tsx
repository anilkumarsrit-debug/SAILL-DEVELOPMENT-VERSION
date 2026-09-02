import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, FileText, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { dbStorage } from '../../lib/db';
import { PortfolioItem } from '../../types';

interface AudioPassage {
  id: string;
  title: string;
  topic: string;
  duration: string;
  transcript: string;
}

const AUDIO_PASSAGES: AudioPassage[] = [
  {
    id: 'pass-01',
    title: 'Cloud Computing Infrastructure & Virtualization',
    topic: 'Engineering Lecture - Module 02',
    duration: '01:45',
    transcript:
      'Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, companies access technology services, such as computing power, storage, and databases, on an as-needed basis from a cloud provider. Major models include IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service). High availability, fault tolerance, and automatic scaling are fundamental principles of modern cloud architecture.'
  },
  {
    id: 'pass-02',
    title: 'Artificial Intelligence & Neural Networks',
    topic: 'Emerging Tech - Module 02',
    duration: '02:10',
    transcript:
      'Artificial intelligence systems mimic human cognitive functions such as learning, reasoning, and problem-solving. Machine learning, a core subset of AI, enables algorithms to parse data, learn from patterns, and make informed decisions without explicit programming. Deep neural networks, inspired by biological human brain architecture, consist of input layers, hidden feature extraction layers, and output decision layers. Backpropagation optimizes neuron weights to minimize loss functions during training.'
  },
  {
    id: 'pass-03',
    title: 'Agile Software Development & DevOps Standups',
    topic: 'Corporate Industry Practice - Module 02',
    duration: '01:30',
    transcript:
      'Agile methodology emphasizes iterative development, continuous integration, and frequent client feedback. In modern engineering teams, daily standup meetings keep developers aligned. Each participant answers three core questions: What did I complete yesterday? What will I work on today? Are there any blockers or impediments in my progress? Continuous deployment pipelines automatically run unit tests and deploy code artifacts to staging environments.'
  }
];

interface OfflineAudioPlayerProps {
  moduleId: string;
  moduleTitle: string;
  onSaveNotesToPortfolio?: (title: string, content: string) => void;
}

export const OfflineAudioPlayer: React.FC<OfflineAudioPlayerProps> = ({
  moduleId,
  moduleTitle,
  onSaveNotesToPortfolio
}) => {
  const [selectedPassage, setSelectedPassage] = useState<AudioPassage>(AUDIO_PASSAGES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Cornell Notes local state
  const [cues, setCues] = useState<string>('');
  const [mainNotes, setMainNotes] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser does not support Speech Synthesis audio playback.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedPassage.transcript);
    utterance.rate = playbackSpeed;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      handleStop();
    }
  };

  const handleSaveCornellNotes = async () => {
    const formattedContent = JSON.stringify({
      passageTitle: selectedPassage.title,
      cues,
      mainNotes,
      summary,
      date: new Date().toLocaleDateString()
    });

    if (onSaveNotesToPortfolio) {
      onSaveNotesToPortfolio(`Cornell Notes: ${selectedPassage.title}`, formattedContent);
    } else {
      const item: PortfolioItem = {
        id: 'p-' + Date.now(),
        moduleId,
        moduleTitle,
        title: `Cornell Notes: ${selectedPassage.title}`,
        category: 'written',
        content: formattedContent,
        score: 95,
        createdAt: new Date().toISOString()
      };
      await dbStorage.savePortfolioItem(item);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Passage Selector Tabs */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Offline Audio Passage Library
          </span>
          <span className="text-xs text-[#5D6D7E] font-medium">Select lecture to listen & take notes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {AUDIO_PASSAGES.map((pass) => {
            const isSelected = selectedPassage.id === pass.id;
            return (
              <button
                key={pass.id}
                onClick={() => {
                  handleStop();
                  setSelectedPassage(pass);
                }}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#D35400] text-white border-[#2C3E50] shadow-2xs'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold block uppercase ${isSelected ? 'text-white/80' : 'text-[#E67E22]'}`}>
                    {pass.topic}
                  </span>
                  <h4 className="text-xs font-black line-clamp-1 mt-0.5">{pass.title}</h4>
                </div>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90' : 'text-[#5D6D7E]'}`}>
                  Duration ~ {pass.duration}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Controls Console */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
          <div>
            <h3 className="text-lg font-black text-[#D35400] font-heading">{selectedPassage.title}</h3>
            <span className="text-xs text-[#5D6D7E] font-medium">{selectedPassage.topic}</span>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 bg-[#FFF8F0] border border-[#FAD7A0] p-1 rounded-xl">
            <span className="text-[10px] font-extrabold text-[#D35400] px-2">Speed:</span>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 text-[10px] font-extrabold rounded-lg transition ${
                  playbackSpeed === s ? 'bg-[#D35400] text-white' : 'text-[#5D6D7E] hover:text-[#D35400]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl flex items-center justify-center gap-1.5 h-16 shadow-inner">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-[#D35400] animate-pulse' : 'bg-[#FAD7A0]'
              }`}
              style={{
                height: isPlaying ? `${Math.floor(Math.random() * 32) + 12}px` : '12px',
                animationDelay: `${i * 50}ms`
              }}
            ></div>
          ))}
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePlay}
            className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Audio' : 'Play Audio Lecture'}</span>
          </button>

          <button
            onClick={handleStop}
            className="px-4 py-2 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#5D6D7E] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTranscript ? 'Hide Transcript' : 'Show Read Transcript'}</span>
          </button>
        </div>

        {/* Optional Transcript Display */}
        {showTranscript && (
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl text-xs text-[#2C3E50] leading-relaxed font-mono shadow-2xs">
            <strong className="text-[#D35400] block mb-1">Lecture Transcript:</strong>
            "{selectedPassage.transcript}"
          </div>
        )}
      </div>

      {/* CORNELL 3-COLUMN NOTE-TAKING DRAWER */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div>
            <h3 className="text-base font-black text-[#D35400] font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D35400]" />
              <span>Interactive Cornell Note-Taking System</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">Organize lecture cues, detailed notes, and summary while listening</p>
          </div>

          <button
            onClick={handleSaveCornellNotes}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Notes Saved!' : 'Save Cornell Notes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Column 1: Cues (35%) */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
              1. Cue Column (Main Ideas / Questions / Keywords)
            </label>
            <textarea
              value={cues}
              onChange={(e) => setCues(e.target.value)}
              placeholder="e.g. What is Cloud Computing? What are IaaS vs PaaS vs SaaS?"
              rows={6}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>

          {/* Column 2: Main Notes (65%) */}
          <div className="md:col-span-8 space-y-2">
            <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
              2. Lecture Notes Column (Bullet Points, Abbreviations, Key Facts)
            </label>
            <textarea
              value={mainNotes}
              onChange={(e) => setMainNotes(e.target.value)}
              placeholder="e.g. - IT resources delivered on-demand via internet
- Pay-as-you-go pricing model
- Eliminates physical server datacenter overhead"
              rows={6}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>

          {/* Bottom Row: Summary Section */}
          <div className="md:col-span-12 space-y-2 pt-2 border-t border-[#FAD7A0]">
            <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
              3. Summary Section (2-3 Sentences Synthesizing Core Lecture Learning)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a concise 2-sentence summary of the main takeaway..."
              rows={3}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
