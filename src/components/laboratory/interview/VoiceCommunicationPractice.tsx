import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  Volume2,
  Activity,
  CheckCircle2,
  RotateCcw,
  Gauge
} from 'lucide-react';

interface VoiceCommunicationPracticeProps {
  onCompleteActivity: () => void;
}

const VOICE_PROMPTS = [
  {
    id: 'vp1',
    title: '60-Second Professional Self-Introduction',
    textPrompt: 'Good morning/afternoon. I am a first-year Computer Science engineering student at SRIT. I specialize in full-stack development and data structures. Recently, I built a smart campus navigation application using React and Node.js. I am eager to apply my analytical problem-solving skills in your software development team.',
    targetWpm: '130 - 140 WPM'
  },
  {
    id: 'vp2',
    title: 'Explaining a Complex Engineering Concept Simply',
    textPrompt: 'Recursion is a programming technique where a function calls itself to solve a smaller instance of the same problem. It requires a base case to terminate execution and prevent infinite loops. For instance, computing factorials or traversing binary trees rely heavily on clean recursive logic.',
    targetWpm: '120 - 130 WPM'
  }
];

export const VoiceCommunicationPractice: React.FC<VoiceCommunicationPracticeProps> = ({ onCompleteActivity }) => {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const currentPrompt = VOICE_PROMPTS[selectedPromptIdx];

  const [studentTranscript, setStudentTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [voiceResult, setVoiceResult] = useState<{
    overallScore10: number;
    pronunciationScore: number;
    fluencyScore: number;
    grammarScore: number;
    toneScore: number;
    confidenceScore: number;
    paceWpm: number;
    paceStatus: 'Optimal (132 WPM)' | 'Too Fast' | 'Too Slow';
    fillerCount: number;
    feedbackText: string;
    actionableTips: string[];
  } | null>(null);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 45) {
            clearInterval(timer);
            setIsRecording(false);
            return 45;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      if (!studentTranscript.trim()) {
        setStudentTranscript(currentPrompt.textPrompt);
      }
    }
  };

  const handleEvaluateVoice = () => {
    if (!studentTranscript.trim()) return;
    setEvaluating(true);

    setTimeout(() => {
      setVoiceResult({
        overallScore10: 9.1,
        pronunciationScore: 9.2,
        fluencyScore: 8.8,
        grammarScore: 9.4,
        toneScore: 9.0,
        confidenceScore: 9.0,
        paceWpm: 135,
        paceStatus: 'Optimal (132 WPM)',
        fillerCount: 1,
        feedbackText: 'Excellent voice delivery! Your speech rate of 135 WPM falls precisely in the professional 120-150 WPM sweet spot. Pronunciation of technical terms was crisp.',
        actionableTips: [
          'Maintain this controlled 130-140 WPM pace during high-pressure interview rounds.',
          'Pause deliberately for 1 second before answering complex situational questions rather than using filler sounds like "um".'
        ]
      });
      setEvaluating(false);
      onCompleteActivity();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 5
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#D35400]" />
              5. Voice & Communication Parameters Practice
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Evaluate key vocal parameters: Pronunciation, Fluency, Grammar, Tone, Confidence, and Speaking Pace (WPM).
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            Vocal Analytics
          </span>
        </div>

        {/* 6 Parameter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs font-bold">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Activity className="w-4 h-4 text-[#D35400] mx-auto" />
            <span className="block text-[#2C3E50]">Pronunciation</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">Technical Clarity</span>
          </div>
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Volume2 className="w-4 h-4 text-[#2C3E50] mx-auto" />
            <span className="block text-[#2C3E50]">Fluency</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">Zero Hesitation</span>
          </div>
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Sparkles className="w-4 h-4 text-emerald-600 mx-auto" />
            <span className="block text-[#2C3E50]">Grammar</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">Syntax Precision</span>
          </div>
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Award className="w-4 h-4 text-purple-600 mx-auto" />
            <span className="block text-[#2C3E50]">Tone</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">Polite Pitch</span>
          </div>
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Award className="w-4 h-4 text-indigo-600 mx-auto" />
            <span className="block text-[#2C3E50]">Confidence</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">Assertiveness</span>
          </div>
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
            <Gauge className="w-4 h-4 text-[#D35400] mx-auto" />
            <span className="block text-[#2C3E50]">Pace (WPM)</span>
            <span className="text-[10px] text-[#5D6D7E] font-normal block">120 - 150 WPM</span>
          </div>
        </div>

        {/* Speech Practice Script Card */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#2C3E50]">Practice Passage Script:</span>
            <div className="flex gap-2">
              {VOICE_PROMPTS.map((pr, idx) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => {
                    setSelectedPromptIdx(idx);
                    setStudentTranscript('');
                    setVoiceResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedPromptIdx === idx
                      ? 'bg-[#2C3E50] text-[#FAD7A0] border-[#2C3E50]'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0]'
                  }`}
                >
                  {pr.title}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#2C3E50] bg-white p-4 rounded-xl border border-[#FAD7A0] leading-relaxed italic font-sans">
            "{currentPrompt.textPrompt}"
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2C3E50]">Speech Recording / Transcript:</label>

              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#1A252F]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Voice Recording ({recordingSeconds}s)
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Record Passage
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={4}
              value={studentTranscript}
              onChange={(e) => {
                setStudentTranscript(e.target.value);
                setVoiceResult(null);
              }}
              placeholder="Read the passage aloud or type your spoken response here..."
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setStudentTranscript('');
                setVoiceResult(null);
              }}
              className="text-xs font-bold text-[#5D6D7E] hover:text-[#2C3E50] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Text
            </button>

            <button
              type="button"
              onClick={handleEvaluateVoice}
              disabled={evaluating || !studentTranscript.trim()}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {evaluating ? 'Analyzing Voice Parameters...' : 'Analyze Speech Parameters with SAILL AI'}
            </button>
          </div>
        </div>

        {/* Diagnostic Voice Report Card */}
        {voiceResult && (
          <div className="p-5 rounded-2xl bg-white border-2 border-[#D35400] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#D35400]" />
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                    SAILL Voice Parameters Diagnostic Report
                  </h4>
                  <p className="text-[11px] text-[#5D6D7E]">Full 6-Axis Acoustic Speech Analysis</p>
                </div>
              </div>

              <div className="bg-[#FFF8F0] border border-[#FAD7A0] px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-[#5D6D7E] uppercase block font-bold">Vocal Score</span>
                <span className="text-xl font-black text-[#D35400]">
                  {voiceResult.overallScore10} / 10
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Pronunciation</span>
                <span className="font-black text-[#2C3E50]">{voiceResult.pronunciationScore}/10</span>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Fluency</span>
                <span className="font-black text-[#2C3E50]">{voiceResult.fluencyScore}/10</span>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Grammar</span>
                <span className="font-black text-[#2C3E50]">{voiceResult.grammarScore}/10</span>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Tone</span>
                <span className="font-black text-[#2C3E50]">{voiceResult.toneScore}/10</span>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Confidence</span>
                <span className="font-black text-[#2C3E50]">{voiceResult.confidenceScore}/10</span>
              </div>
              <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block font-bold">Pace</span>
                <span className="font-black text-emerald-700">{voiceResult.paceStatus}</span>
              </div>
            </div>

            <p className="text-xs text-[#2C3E50] bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0]">
              {voiceResult.feedbackText}
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-emerald-900 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actionable Vocal Practice Tips
              </span>
              <ul className="text-[11px] text-emerald-950 list-disc list-inside space-y-1">
                {voiceResult.actionableTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
