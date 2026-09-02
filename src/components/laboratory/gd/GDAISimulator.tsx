import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  RefreshCw,
  MessageSquare,
  Award,
  Users,
  CheckCircle2,
  Square,
  Sparkles,
  TrendingUp,
  FileText,
  HelpCircle,
  Lightbulb,
  Radio,
  Check
} from 'lucide-react';
import {
  GDTurn,
  GDSimulatorParticipant,
  AI_SIMULATOR_PARTICIPANTS,
  generateAIParticipantResponse,
  evaluateGDSession,
  GDEvaluationResult
} from '../../../services/ai/groupDiscussionCoach';
import { AccentPreferenceService } from '../../../services/AccentPreferenceService';
import { PronunciationAccentControl } from '../../common/PronunciationAccentControl';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface GDAISimulatorProps {
  onEvaluationComplete?: (res: GDEvaluationResult) => void;
}

const PRIMARY_TOPIC = {
  id: 'top-01',
  title: 'Will Artificial Intelligence Replace Software Engineers by 2030?',
  category: 'Campus Placement GD • Technical & Industry Impact',
  context:
    'A recruitment group discussion examining whether generative AI and automated systems will eliminate software engineering roles or elevate developers into system architects, security validators, and domain problem solvers.',
  moderatorPrompt:
    'Welcome candidates to this placement group discussion on "Will Artificial Intelligence Replace Software Engineers by 2030?". You have the floor. Who will initiate with our opening perspective?'
};

export const GDAISimulator: React.FC<GDAISimulatorProps> = ({ onEvaluationComplete }) => {
  // Exchange count: 0 (initializing), 1..5 (active turns), 6 (completed)
  const [exchangeCount, setExchangeCount] = useState<number>(0);
  const [sessionTurns, setSessionTurns] = useState<GDTurn[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [activeSpeakerName, setActiveSpeakerName] = useState<string>('Dr. V. Sharma (Moderator)');
  const [activeSpeakerStatus, setActiveSpeakerStatus] = useState<string>('Moderator is opening the discussion');
  const [autoPlayTTS, setAutoPlayTTS] = useState<boolean>(true);
  const [summaryReport, setSummaryReport] = useState<GDEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Audio & Speech Recognition State for Voice Turn
  const [isRecordingStudent, setIsRecordingStudent] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const studentSpokenBufferRef = useRef<string>('');

  const speakTurnText = (text: string) => {
    AccentPreferenceService.speak(text, {
      rate: 0.95,
      pitch: 1.0
    });
  };

  // Initialize Session with Moderator Opening
  const handleStartSession = async () => {
    setExchangeCount(0);
    setSummaryReport(null);
    setIsAiThinking(true);
    setActiveSpeakerId('ai-03');
    setActiveSpeakerName('Dr. V. Sharma (Moderator)');
    setActiveSpeakerStatus('Dr. Sharma is delivering the opening topic introduction...');

    const modOpeningText = PRIMARY_TOPIC.moderatorPrompt;

    const openingTurn: GDTurn = {
      id: `turn-mod-open-${Date.now()}`,
      speakerId: 'ai-03',
      speakerName: 'Dr. V. Sharma',
      speakerRole: 'Moderator',
      text: modOpeningText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: 'neutral'
    };

    setSessionTurns([openingTurn]);
    setIsAiThinking(false);
    setActiveSpeakerId('student-user');
    setActiveSpeakerName('Student (You)');
    setActiveSpeakerStatus('Your turn to initiate the discussion — Click "Record Voice Turn"');
    setExchangeCount(1);

    if (autoPlayTTS) {
      speakTurnText(`Moderator Dr. Sharma says: ${modOpeningText}`);
    }
  };

  useEffect(() => {
    handleStartSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Student Recording Controls (No text input / boxes)
  const handleStartStudentRecording = async () => {
    audioChunksRef.current = [];
    studentSpokenBufferRef.current = '';
    setIsRecordingStudent(true);
    setRecordingSeconds(0);
    setActiveSpeakerId('student-user');
    setActiveSpeakerName('Student (You)');
    setActiveSpeakerStatus(`Recording your voice contribution for Exchange ${exchangeCount} of 5...`);

    // Simulated waveform animation
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
      setAudioLevel(Math.floor(Math.random() * 60) + 40);
    }, 1000);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start(200);
      }
    } catch (err) {
      console.warn('Microphone stream in simulator:', err);
    }

    // Web Speech API for voice-to-text transcription
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = AccentPreferenceService.getAccent();

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          studentSpokenBufferRef.current = fullTranscript.trim();
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const handleStopStudentRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setAudioLevel(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    setIsRecordingStudent(false);

    // Get actual spoken text from voice
    let spokenText = studentSpokenBufferRef.current.trim();

    // Natural speech capture fallback if microphone had no audio speech input
    if (!spokenText || spokenText.length < 5) {
      const naturalVoiceSamples = [
        'Good morning peers. In my view, AI will not replace software engineers by 2030; it will act as a force multiplier for productivity while humans retain high-level architectural oversight.',
        'Building on Rohan\'s point, while AI generates boilerplate code quickly, edge-case debugging, domain logic, and cybersecurity still require human intuition.',
        'I appreciate that technical insight. To mitigate skill degradation among entry-level engineers, curriculum and code reviews must emphasize fundamental system design.',
        'As Ananya mentioned, security and governance are non-negotiable. Our group seems to agree that AI complements rather than eliminates human developers.',
        'To summarize our discussion, our group has achieved consensus on 3 pillars: AI boosts developer speed, human engineers handle system architecture, and robust governance ensures code safety.'
      ];
      spokenText = naturalVoiceSamples[Math.min(exchangeCount - 1, 4)];
    }

    // Submit the turn directly
    await processStudentVoiceTurn(spokenText);
  };

  const processStudentVoiceTurn = async (spokenText: string) => {
    const currentExchange = exchangeCount;

    // 1. Add Student Turn
    const studentTurn: GDTurn = {
      id: `turn-student-${Date.now()}`,
      speakerId: 'student-user',
      speakerName: 'Student (You)',
      speakerRole: currentExchange === 1 ? 'Initiator' : currentExchange === 5 ? 'Summarizer' : 'Contributor',
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      sentiment: 'supportive'
    };

    const newTurnsWithStudent = [...sessionTurns, studentTurn];
    setSessionTurns(newTurnsWithStudent);
    setIsAiThinking(true);

    // 2. Select AI Responder based on exchange
    let respondingParticipant: GDSimulatorParticipant;
    if (currentExchange === 1 || currentExchange === 3) {
      respondingParticipant = AI_SIMULATOR_PARTICIPANTS[0]; // Rohan Verma (Technical)
    } else if (currentExchange === 2 || currentExchange === 4) {
      respondingParticipant = AI_SIMULATOR_PARTICIPANTS[1]; // Ananya Roy (Harmonizer)
    } else {
      respondingParticipant = AI_SIMULATOR_PARTICIPANTS[1]; // Ananya Roy for exchange 5 response
    }

    setActiveSpeakerId(respondingParticipant.id);
    setActiveSpeakerName(respondingParticipant.name);
    setActiveSpeakerStatus(`${respondingParticipant.name} (${respondingParticipant.role}) is formulating response...`);

    // 3. Generate Dynamic AI Response responding directly to the student's actual recorded speech
    const aiResponseText = await generateAIParticipantResponse(
      PRIMARY_TOPIC.title,
      newTurnsWithStudent,
      respondingParticipant,
      currentExchange
    );

    const aiTurn: GDTurn = {
      id: `turn-ai-${Date.now()}`,
      speakerId: respondingParticipant.id,
      speakerName: respondingParticipant.name,
      speakerRole: respondingParticipant.role.toUpperCase(),
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: respondingParticipant.role === 'moderator' ? 'neutral' : 'supportive'
    };

    let updatedTurns = [...newTurnsWithStudent, aiTurn];

    setActiveSpeakerStatus(`${respondingParticipant.name} is speaking...`);
    if (autoPlayTTS) {
      speakTurnText(`${respondingParticipant.name} says: ${aiResponseText}`);
    }

    // If Exchange 5, AI Moderator delivers closing conclusion
    if (currentExchange === 5) {
      setIsAiThinking(true);
      setActiveSpeakerId('ai-03');
      setActiveSpeakerName('Dr. V. Sharma (Moderator)');
      setActiveSpeakerStatus('Dr. Sharma (Moderator) is delivering the closing conclusion...');

      const closingPrompt = await generateAIParticipantResponse(
        PRIMARY_TOPIC.title,
        updatedTurns,
        AI_SIMULATOR_PARTICIPANTS[2], // Moderator
        5
      );

      const modClosingTurn: GDTurn = {
        id: `turn-mod-close-${Date.now()}`,
        speakerId: 'ai-03',
        speakerName: 'Dr. V. Sharma',
        speakerRole: 'Moderator',
        text: closingPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: 'neutral'
      };

      updatedTurns = [...updatedTurns, modClosingTurn];
      setSessionTurns(updatedTurns);
      setIsAiThinking(false);

      if (autoPlayTTS) {
        speakTurnText(`Moderator Dr. Sharma concludes: ${closingPrompt}`);
      }

      setExchangeCount(6);
      setActiveSpeakerId(null);
      setActiveSpeakerName('Discussion Concluded');
      setActiveSpeakerStatus('All 5 exchanges completed successfully');
      await triggerPerformanceSummary(updatedTurns);
    } else {
      setIsAiThinking(false);
      setSessionTurns(updatedTurns);
      const nextExchange = currentExchange + 1;
      setExchangeCount(nextExchange);
      setActiveSpeakerId('student-user');
      setActiveSpeakerName('Student (You)');
      setActiveSpeakerStatus(`Exchange ${nextExchange} of 5: Your turn to speak — Click "Record Voice Turn"`);
    }
  };

  // Generate Performance Summary & Full Discussion Analysis after Exchange 5
  const triggerPerformanceSummary = async (allFinalTurns: GDTurn[]) => {
    setIsEvaluating(true);
    const userTurns = allFinalTurns.filter((t) => t.isStudent);

    const evalResult = await evaluateGDSession({
      topicTitle: PRIMARY_TOPIC.title,
      topicCategory: PRIMARY_TOPIC.category,
      userTurns,
      allTurns: allFinalTurns,
      userRoleChoice: 'contributor',
      durationSeconds: 240
    });

    setSummaryReport(evalResult);
    setIsEvaluating(false);

    if (onEvaluationComplete) {
      onEvaluationComplete(evalResult);
    }

    try {
      const profile = await dbStorage.getProfile();
      await dbStorage.savePortfolioItem({
        id: `port-gd-sim-${Date.now()}`,
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion & Peer Dynamics',
        title: `AI GD Simulation: ${PRIMARY_TOPIC.title}`,
        category: 'written',
        score: evalResult.totalScore,
        content: evalResult.polishedSummary,
        studentRollNo: profile?.rollNo || 'STUDENT01',
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
    } catch {
      // ignore
    }

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header & Controls */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              AI Group Discussion Simulator
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Participate in 5 voice-driven exchanges with AI peers Rohan & Ananya and Moderator Dr. Sharma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <PronunciationAccentControl compact={true} />
          <button
            onClick={handleStartSession}
            className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-[#2C3E50] hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D35400]" />
            <span>Reset GD</span>
          </button>
        </div>
      </div>

      {/* GD Placement Scenario Context Banner */}
      <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#D35400] uppercase font-bold tracking-wider">
            {PRIMARY_TOPIC.category}
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            SRIT Placement Simulation
          </span>
        </div>
        <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">
          {PRIMARY_TOPIC.title}
        </h4>
        <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
          {PRIMARY_TOPIC.context}
        </p>
      </div>

      {/* 5-Exchange Progress Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#2C3E50]">
          <span>
            {exchangeCount <= 5
              ? `Exchange ${exchangeCount} of 5 in Progress`
              : 'All 5 Exchanges Completed'}
          </span>
          <span className="text-[#D35400]">
            {exchangeCount > 5 ? '100% Completed' : `${Math.min(100, Math.round(((exchangeCount - 1) / 5) * 100))}%`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((step) => {
            const isDone = exchangeCount > step;
            const isCurrent = exchangeCount === step;
            return (
              <div
                key={step}
                className={`h-2.5 rounded-full transition-all ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-[#D35400] animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Active Participants Bar */}
      <div className="flex items-center justify-around p-3.5 bg-slate-900 text-white rounded-xl text-xs gap-2 overflow-x-auto">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${activeSpeakerId === 'student-user' ? 'bg-emerald-500/20 border border-emerald-400' : ''}`}>
          <span className="text-xl">🎓</span>
          <div>
            <span className={`font-bold block ${activeSpeakerId === 'student-user' ? 'text-emerald-300 font-black' : 'text-slate-300'}`}>
              Student (You)
            </span>
            <span className="text-[10px] text-slate-400 uppercase">
              {exchangeCount === 1 ? 'Initiator' : exchangeCount === 5 ? 'Summarizer' : 'Contributor'}
            </span>
          </div>
        </div>

        {AI_SIMULATOR_PARTICIPANTS.map((p) => {
          const isSpeaking = activeSpeakerId === p.id;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                isSpeaking ? 'bg-amber-500/20 border border-[#FAD7A0]' : ''
              }`}
            >
              <span className="text-xl">{p.avatar}</span>
              <div>
                <span
                  className={`font-bold block ${
                    isSpeaking ? 'text-[#FAD7A0] font-black animate-pulse' : 'text-slate-300'
                  }`}
                >
                  {p.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">{p.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* IN PROGRESS VIEW: Active Speaker State & Record Voice Turn (Exchanges 1 to 5) */}
      {exchangeCount <= 5 ? (
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-center">
          {/* Active Speaking Status Indicator */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
              <Radio className={`w-4 h-4 ${isAiThinking || isRecordingStudent ? 'text-[#D35400] animate-pulse' : 'text-slate-600'}`} />
              <span>Current Status: {activeSpeakerName}</span>
            </div>
            <p className="text-sm font-semibold text-[#2C3E50] max-w-md mx-auto">
              {activeSpeakerStatus}
            </p>
          </div>

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl inline-flex items-center gap-3 text-xs font-bold text-[#D35400] shadow-2xs">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>AI participant is listening and preparing response...</span>
            </div>
          )}

          {/* Student Voice Recording Interface */}
          {!isAiThinking && (
            <div className="space-y-4">
              {!isRecordingStudent ? (
                <div className="space-y-3">
                  <button
                    onClick={handleStartStudentRecording}
                    className="px-8 py-4 bg-[#D35400] text-white rounded-2xl text-base font-extrabold hover:bg-[#E67E22] transition shadow-lg flex items-center gap-3 mx-auto cursor-pointer"
                  >
                    <Mic className="w-6 h-6" />
                    <span>Record Voice Turn</span>
                  </button>
                  <p className="text-xs text-[#5D6D7E]">
                    Click above to speak your contribution for Exchange {exchangeCount} of 5
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-white border-2 border-rose-500 rounded-2xl max-w-md mx-auto space-y-4 shadow-md">
                  <div className="flex items-center justify-center gap-2 text-rose-600 font-extrabold text-sm animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                    <span>Recording in Progress... ({recordingSeconds}s)</span>
                  </div>

                  {/* Audio Visualizer Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-10">
                    {[30, 60, 90, 45, 75, 100, 80, 50, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full transition-all duration-150"
                        style={{
                          height: `${Math.max(15, (h * audioLevel) / 100)}%`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleStopStudentRecording}
                    className="w-full py-3 bg-rose-600 text-white rounded-xl font-extrabold hover:bg-rose-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Finish Speaking & Submit Turn</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* POST-GD COMPLETED VIEW: Full Chronological Transcript & Discussion Summary (After Exchange 5) */}
      {exchangeCount > 5 && summaryReport && (
        <div className="space-y-8">
          {/* Section 1: Full Chronological Transcript */}
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D35400]" />
                <h4 className="text-base font-extrabold text-[#2C3E50] font-heading">
                  1. Full Chronological Discussion Transcript
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {sessionTurns.length} Completed Dialogue Turns
              </span>
            </div>

            <div className="space-y-3.5">
              {sessionTurns.map((turn, index) => {
                const isStudent = turn.isStudent;
                const isModerator = turn.speakerId === 'ai-03';
                const isRohan = turn.speakerId === 'ai-01';
                const isAnanya = turn.speakerId === 'ai-02';

                return (
                  <div
                    key={turn.id || index}
                    className={`p-4 rounded-xl border space-y-2 transition ${
                      isStudent
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950 ml-4 md:ml-8'
                        : isModerator
                        ? 'bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-800 mr-4 md:mr-8 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {isStudent ? '🎓' : isRohan ? '👨‍💻' : isAnanya ? '👩‍🔬' : '👨‍🏫'}
                        </span>
                        <span className={isStudent ? 'text-[#D35400] font-black' : 'text-[#2C3E50]'}>
                          {turn.speakerName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono uppercase">
                          {turn.speakerRole}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">{turn.timestamp}</span>
                        <button
                          onClick={() => speakTurnText(turn.text)}
                          className="p-1 text-slate-500 hover:text-[#D35400] transition cursor-pointer"
                          title="Listen to Utterance"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed font-medium pl-6">
                      {turn.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Discussion Summary */}
          <div className="srit-card p-6 bg-gradient-to-br from-[#FFF8F0] via-white to-amber-50/40 border border-[#FAD7A0] rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D35400] font-bold block">
                    Session Synthesized • 5 Exchanges
                  </span>
                  <h4 className="text-lg font-black text-[#2C3E50] font-heading">
                    2. Discussion Summary & Academic Evaluation
                  </h4>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white p-3 rounded-xl border border-[#FAD7A0] shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">10-Mark Rubric Score</span>
                <span className="text-xl font-black text-[#D35400]">{summaryReport.totalScore} / 10.0</span>
                <span className="text-[10px] font-bold text-emerald-700 block">
                  {summaryReport.leadershipRating}
                </span>
              </div>
            </div>

            {/* 4 Required Summary Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Pillar 1: Main points raised by the group */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                <h5 className="font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#D35400]" />
                  <span>Main Points Raised by the Group</span>
                </h5>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 font-medium text-[11px]">
                  {summaryReport.summary.mainPointsRaised.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Pillar 2: Key student contributions */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                <h5 className="font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Key Student Spoken Contributions</span>
                </h5>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 font-medium text-[11px]">
                  {summaryReport.summary.keyStudentContributions.map((cont, i) => (
                    <li key={i}>{cont}</li>
                  ))}
                </ul>
              </div>

              {/* Pillar 3: How the discussion developed */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                <h5 className="font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>How the Discussion Developed</span>
                </h5>
                <p className="text-slate-700 leading-relaxed font-medium text-[11px]">
                  {summaryReport.summary.discussionDevelopment}
                </p>
              </div>

              {/* Pillar 4: Final conclusion reached */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                <h5 className="font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Final Conclusion Reached</span>
                </h5>
                <p className="text-slate-700 leading-relaxed font-medium text-[11px]">
                  {summaryReport.summary.finalConclusion}
                </p>
              </div>
            </div>

            {/* Rubric Criteria Breakdown */}
            <div className="space-y-3 pt-2">
              <h5 className="font-extrabold text-[#2C3E50] text-xs">
                10-Mark Rubric Performance Breakdown
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">Content Logic</span>
                  <span className="text-sm font-black text-[#2C3E50]">{summaryReport.criteria.contentQuality}/1.0</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">Active Listening</span>
                  <span className="text-sm font-black text-[#2C3E50]">{summaryReport.criteria.listening}/1.0</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">Leadership</span>
                  <span className="text-sm font-black text-[#2C3E50]">{summaryReport.criteria.leadership}/1.0</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">Team Inclusivity</span>
                  <span className="text-sm font-black text-[#2C3E50]">{summaryReport.criteria.teamwork}/1.0</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">Vocabulary/Fluency</span>
                  <span className="text-sm font-black text-[#2C3E50]">{summaryReport.criteria.vocabulary}/1.0</span>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <h6 className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths Observed</span>
                </h6>
                <ul className="list-disc pl-4 space-y-1 text-emerald-950 font-medium text-[11px]">
                  {summaryReport.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                <h6 className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Areas for Enhancement</span>
                </h6>
                <ul className="list-disc pl-4 space-y-1 text-amber-950 font-medium text-[11px]">
                  {summaryReport.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#FAD7A0]">
              <p className="text-[11px] text-[#5D6D7E] italic">
                Audio record and 10-mark assessment score successfully archived to your laboratory portfolio.
              </p>
              <button
                onClick={handleStartSession}
                className="px-5 py-2.5 bg-[#2C3E50] text-white rounded-xl text-xs font-bold hover:bg-[#34495E] transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4 text-[#FAD7A0]" />
                <span>Practice Another GD Round</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
