import React, { useState, useEffect } from 'react';
import { DEBATE_TOPICS, DebateCategory, DebateTopic } from '../../../services/ai/debateCoach';
import { AudioRecorder } from '../../practice/AudioRecorder';
import { Play, Pause, Clock, CheckCircle2, Shield, Send, Mic, Sparkles, Filter } from 'lucide-react';

interface StructuredDebateArenaProps {
  onSaveWork?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioDataUrl: string) => void;
}

export const StructuredDebateArena: React.FC<StructuredDebateArenaProps> = ({
  onSaveWork,
  onSaveRecording
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DebateCategory | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(DEBATE_TOPICS[0]);
  const [position, setPosition] = useState<'Affirmative' | 'Negative'>('Affirmative');

  // Timers
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number>(120); // 2 minutes prep
  const [isPrepRunning, setIsPrepRunning] = useState<boolean>(false);

  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [isSpeakingRunning, setIsSpeakingRunning] = useState<boolean>(false);

  const [studentTextResponse, setStudentTextResponse] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const categories: (DebateCategory | 'All')[] = [
    'All',
    'Technology',
    'Artificial Intelligence',
    'Education',
    'Environment',
    'Business',
    'Healthcare',
    'Engineering',
    'Social Issues',
    'Employment',
    'Ethics'
  ];

  const filteredTopics =
    selectedCategory === 'All'
      ? DEBATE_TOPICS
      : DEBATE_TOPICS.filter((t) => t.category === selectedCategory);

  // Prep timer effect
  useEffect(() => {
    let timer: any = null;
    if (isPrepRunning && prepSecondsLeft > 0) {
      timer = setInterval(() => {
        setPrepSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (prepSecondsLeft === 0) {
      setIsPrepRunning(false);
    }
    return () => clearInterval(timer);
  }, [isPrepRunning, prepSecondsLeft]);

  // Speaking timer effect
  useEffect(() => {
    let timer: any = null;
    if (isSpeakingRunning) {
      timer = setInterval(() => {
        setSpeakingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSpeakingRunning]);

  const handleSaveResponse = () => {
    if (!studentTextResponse.trim()) {
      alert('Please enter or record your debate response before saving.');
      return;
    }
    const data = JSON.stringify(
      {
        topic: selectedTopic.motion,
        category: selectedTopic.category,
        position,
        prepSecondsUsed: 120 - prepSecondsLeft,
        speakingSecondsUsed: speakingSeconds,
        response: studentTextResponse,
        savedAt: new Date().toISOString()
      },
      null,
      2
    );

    if (onSaveWork) {
      onSaveWork(`Debate Arena Speech [${position}]: ${selectedTopic.motion.substring(0, 30)}...`, data);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 3
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Structured Debate Arena
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Select a motion across 10 engineering and societal domains, choose your stance (Affirmative or Negative), run your preparation timer, and deliver your structured speech.
        </p>
      </div>

      {/* Domain Category Filter */}
      <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#D35400]">
          <Filter className="w-4 h-4" />
          <span>Filter Debate Motions by Domain:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const available = cat === 'All' ? DEBATE_TOPICS : DEBATE_TOPICS.filter((t) => t.category === cat);
                if (available.length > 0) setSelectedTopic(available[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Motion Selector Grid & Active Motion Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Motion Cards List */}
        <div className="space-y-3 lg:col-span-1 max-h-[500px] overflow-y-auto pr-1">
          <span className="text-xs font-bold text-[#2C3E50] block">Select Motion ({filteredTopics.length} available):</span>
          {filteredTopics.map((top) => (
            <button
              key={top.id}
              onClick={() => setSelectedTopic(top)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition space-y-1.5 ${
                selectedTopic.id === top.id
                  ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400] font-bold shadow-2xs'
                  : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#E67E22]'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#E67E22]">
                <span>{top.category}</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-[#FAD7A0]">Motion #{top.id}</span>
              </div>
              <p className="line-clamp-2">{top.motion}</p>
            </button>
          ))}
        </div>

        {/* Right: Active Arena Controller */}
        <div className="lg:col-span-2 srit-card p-6 bg-white border border-[#FAD7A0] space-y-5">
          {/* Active Motion Card */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
              {selectedTopic.category} Domain Motion
            </span>
            <h3 className="text-base font-bold text-[#2C3E50] font-heading">{selectedTopic.motion}</h3>
            <p className="text-xs text-[#5D6D7E]">{selectedTopic.context}</p>
          </div>

          {/* Stance Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2C3E50]">Choose Your Debate Stance:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPosition('Affirmative')}
                className={`py-3 rounded-xl text-xs font-bold border transition text-center ${
                  position === 'Affirmative'
                    ? 'bg-[#27AE60] text-white border-[#27AE60] shadow-xs'
                    : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                👍 Affirmative (FOR the Motion)
              </button>
              <button
                onClick={() => setPosition('Negative')}
                className={`py-3 rounded-xl text-xs font-bold border transition text-center ${
                  position === 'Negative'
                    ? 'bg-[#C0392B] text-white border-[#C0392B] shadow-xs'
                    : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                }`}
              >
                👎 Negative (AGAINST the Motion)
              </button>
            </div>
          </div>

          {/* Key Reference Points for Chosen Stance */}
          <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] text-xs space-y-1">
            <span className="font-bold text-[#D35400] block text-[11px]">
              Suggested Arguments for {position} Position:
            </span>
            <ul className="list-disc list-inside text-[#2C3E50] space-y-0.5">
              {(position === 'Affirmative' ? selectedTopic.affirmativeKeyPoints : selectedTopic.negativeKeyPoints).map(
                (pt, i) => (
                  <li key={i}>{pt}</li>
                )
              )}
            </ul>
          </div>

          {/* Dual Timers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prep Timer */}
            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D35400]" />
                  Preparation Timer
                </span>
                <span className="text-sm font-mono font-bold text-[#D35400]">
                  {formatTimer(prepSecondsLeft)}
                </span>
              </div>
              <button
                onClick={() => setIsPrepRunning(!isPrepRunning)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                  isPrepRunning ? 'bg-[#E67E22] text-white' : 'bg-[#D35400] text-white hover:bg-[#E67E22]'
                }`}
              >
                {isPrepRunning ? 'Pause Prep Timer' : 'Start 2-Min Prep Timer'}
              </button>
            </div>

            {/* Speaking Timer */}
            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#D35400]" />
                  Speaking Clock
                </span>
                <span className="text-sm font-mono font-bold text-[#2C3E50]">
                  {formatTimer(speakingSeconds)}
                </span>
              </div>
              <button
                onClick={() => setIsSpeakingRunning(!isSpeakingRunning)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                  isSpeakingRunning ? 'bg-[#C0392B] text-white' : 'bg-[#27AE60] text-white hover:bg-[#219653]'
                }`}
              >
                {isSpeakingRunning ? 'Stop Speaking Timer' : 'Start Speaking Timer'}
              </button>
            </div>
          </div>

          {/* Response Recorder & Text Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#2C3E50]">Record Speech & Text Transcript:</label>
            <textarea
              rows={4}
              placeholder={`Draft or type your ${position} speech opening statement here (Claim, Evidence, Reasoning)...`}
              value={studentTextResponse}
              onChange={(e) => setStudentTextResponse(e.target.value)}
              className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />

            <div className="pt-1">
              <AudioRecorder
                onRecordingComplete={(audioUrl) => {
                  if (onSaveRecording) {
                    onSaveRecording(`Debate Speech Audio [${position}]: ${selectedTopic.motion.substring(0, 25)}`, audioUrl);
                  }
                }}
              />
            </div>

            <button
              onClick={handleSaveResponse}
              className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSaved ? 'Response Recorded & Saved to Portfolio!' : 'Save Arena Speech to Notebook & Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
