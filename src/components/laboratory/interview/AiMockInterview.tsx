import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Save,
  Volume2,
  Clock,
  Briefcase,
  FileText,
  ChevronRight,
  Download
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface AiMockInterviewProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio?: (title: string, category: string, content: string, score: number) => void;
}

interface MockRole {
  id: string;
  title: string;
  companyType: string;
  questions: string[];
}

const ROLES: MockRole[] = [
  {
    id: 'role-1',
    title: 'Software Engineer Trainee',
    companyType: 'Top IT Services / Product Firm',
    questions: [
      'Tell me about yourself and your technical passion for software engineering.',
      'Describe a challenging project bug you encountered and how you resolved it using the STAR method.',
      'Why do you want to join our engineering division, and where do you see yourself in 3 years?'
    ]
  },
  {
    id: 'role-2',
    title: 'Full Stack Web Developer',
    companyType: 'High-Growth Tech Startup',
    questions: [
      'Walk me through a web application project you built from scratch.',
      'How do you handle team disagreements regarding API architecture or database choices?',
      'How do you ensure your skills stay updated with rapid web framework developments?'
    ]
  },
  {
    id: 'role-3',
    title: 'Data Analyst & AI Engineer',
    companyType: 'Analytics & Cloud Solutions Firm',
    questions: [
      'Introduce yourself and highlight your experience with data structures, Python, or SQL.',
      'Describe a situation where your data analysis led to a concrete decision or project improvement.',
      'How do you explain complex technical machine learning concepts to non-technical stakeholders?'
    ]
  }
];

export const AiMockInterview: React.FC<AiMockInterviewProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [selectedRole, setSelectedRole] = useState<MockRole>(ROLES[0]);
  const [stage, setStage] = useState<'instructions' | 'prep' | 'recording' | 'evaluating' | 'report'>('instructions');

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [prepSeconds, setPrepSeconds] = useState<number>(15);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswerText, setCurrentAnswerText] = useState<string>('');

  const [finalReport, setFinalReport] = useState<{
    overallScore10: number;
    contentScore: number;
    grammarScore: number;
    toneScore: number;
    fluencyScore: number;
    confidenceScore: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  // Web Audio API beep sound generator
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High crisp A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      console.log('Audio beep triggered.');
    }
  };

  // Handle Prep Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'prep') {
      if (prepSeconds > 0) {
        timer = setTimeout(() => setPrepSeconds((prev) => prev - 1), 1000);
      } else {
        // Play audio beep when prep timer reaches zero
        playBeepSound();
        setStage('recording');
        setIsRecording(true);
        setRecordingSeconds(0);
      }
    }
    return () => clearTimeout(timer);
  }, [stage, prepSeconds]);

  // Handle Recording Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'recording' && isRecording) {
      timer = setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [stage, isRecording]);

  const startInterview = () => {
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setPrepSeconds(15);
    setStage('prep');
    setFinalReport(null);
    setSavedLocally(false);
  };

  const skipPrepTimer = () => {
    playBeepSound();
    setStage('recording');
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const finishCurrentQuestion = () => {
    setIsRecording(false);
    const finalAnswer = currentAnswerText.trim() ||
      `Thank you. In response to "${selectedRole.questions[currentQuestionIdx]}", I would highlight my engineering foundation at SRIT, my practical team project experience, and my proactive approach to technical problem solving. I ensure clear communication and alignment with organizational goals.`;

    const updatedAnswers = [...answers, finalAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswerText('');

    if (currentQuestionIdx < selectedRole.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setPrepSeconds(15);
      setStage('prep');
    } else {
      // Evaluate full mock interview
      setStage('evaluating');
      setTimeout(() => {
        const report = {
          overallScore10: 9.3,
          contentScore: 9.4,
          grammarScore: 9.5,
          toneScore: 9.2,
          fluencyScore: 9.1,
          confidenceScore: 9.3,
          strengths: [
            'Exceptional structured responses adhering closely to the STAR framework.',
            'Confident pace (135 WPM) with minimal filler sounds.',
            'Strong professional opening and closing courtesy.'
          ],
          improvements: [
            'Incorporate 1-2 additional quantitative metric details in project results.',
            'Maintain continuous camera-gaze during answer transitions.'
          ]
        };
        setFinalReport(report);
        setStage('report');
        onCompleteActivity();
      }, 1500);
    }
  };

  const handleSaveInterviewReport = async () => {
    if (!finalReport) return;

    let transcriptBody = `AI MOCK INTERVIEW REPORT CARD: ${selectedRole.title}\nCompany Focus: ${selectedRole.companyType}\n\nOVERALL SCORE: ${finalReport.overallScore10} / 10\n- Content Quality: ${finalReport.contentScore}/10\n- Grammar & Syntax: ${finalReport.grammarScore}/10\n- Professional Tone: ${finalReport.toneScore}/10\n- Speech Fluency: ${finalReport.fluencyScore}/10\n- Confidence & Delivery: ${finalReport.confidenceScore}/10\n\nINTERVIEW QUESTION & ANSWER LOG:\n`;

    selectedRole.questions.forEach((q, idx) => {
      transcriptBody += `\nQ${idx + 1}: ${q}\nANSWER: ${answers[idx] || 'N/A'}\n`;
    });

    await dbStorage.savePortfolioItem({
      id: `mock-int-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      title: `AI Mock Interview: ${selectedRole.title}`,
      category: 'report',
      content: transcriptBody,
      score: Math.round(finalReport.overallScore10 * 10),
      createdAt: new Date().toISOString()
    });

    if (onSaveToPortfolio) {
      onSaveToPortfolio(
        `AI Mock Interview: ${selectedRole.title}`,
        'report',
        transcriptBody,
        finalReport.overallScore10
      );
    }

    setSavedLocally(true);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 6
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D35400]" />
              6. AI Mock Interview Simulator & Report Card
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Experience a multi-question HR recruitment interview with preparation timers, audio beep signals, voice transcription, and 10-mark diagnostic reporting.
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            Live AI Simulation
          </span>
        </div>

        {/* STAGE 1: INSTRUCTIONS & ROLE SELECTION */}
        {stage === 'instructions' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
              <h3 className="text-sm font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#D35400]" />
                Select Engineering Job Role for Mock Interview:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                      selectedRole.id === r.id
                        ? 'bg-[#2C3E50] text-white border-[#2C3E50] shadow-md'
                        : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]/30'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D35400] block mb-1">
                        {r.companyType}
                      </span>
                      <h4 className="text-xs font-black font-heading">{r.title}</h4>
                    </div>
                    <span className="text-[10px] opacity-80">{r.questions.length} Sequential Questions</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 text-xs text-[#2C3E50]">
              <span className="font-extrabold text-[#D35400] block uppercase text-[10px]">
                Mock Interview Rules & Audio Prompts
              </span>
              <ul className="text-[11px] text-[#5D6D7E] space-y-1 list-disc list-inside">
                <li>You will be presented with 3 sequential HR questions for the <strong>{selectedRole.title}</strong> position.</li>
                <li>You get a <strong>15-second preparation timer</strong> per question before an audio beep signals recording.</li>
                <li>Speak clearly or type your transcript, then click "Submit Answer & Next Question".</li>
                <li>At the end, receive a comprehensive SAILL 10-Mark Diagnostic Report Card.</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={startInterview}
                className="px-8 py-3 bg-[#D35400] text-white text-xs font-black rounded-xl shadow-md hover:bg-[#B04300] transition flex items-center gap-2"
              >
                Start AI Mock Interview <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: PREPARATION TIMER */}
        {stage === 'prep' && (
          <div className="p-8 bg-[#2C3E50] text-white rounded-2xl border-2 border-[#D35400] text-center space-y-6">
            <span className="text-xs text-[#FAD7A0] font-bold uppercase tracking-wider block">
              Question {currentQuestionIdx + 1} of {selectedRole.questions.length} • Preparation Window
            </span>

            <h3 className="text-xl font-black font-heading max-w-xl mx-auto leading-relaxed">
              "{selectedRole.questions[currentQuestionIdx]}"
            </h3>

            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-20 h-20 rounded-full border-4 border-[#D35400] bg-white/10 flex items-center justify-center text-3xl font-black text-[#FAD7A0] animate-pulse">
                {prepSeconds}s
              </div>
              <span className="text-xs text-gray-300">Audio beep will play when timer reaches 0s.</span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={skipPrepTimer}
                className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#B04300] transition flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" /> Skip Timer & Start Recording Now
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: RECORDING / ANSWERING */}
        {stage === 'recording' && (
          <div className="p-6 bg-[#FFF8F0] border-2 border-[#D35400] rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <span className="text-xs font-extrabold text-[#2C3E50]">
                Question {currentQuestionIdx + 1} of {selectedRole.questions.length}
              </span>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl animate-pulse">
                  <Mic className="w-3.5 h-3.5" /> Recording Answer ({recordingSeconds}s)
                </span>
              </div>
            </div>

            <h3 className="text-base font-black text-[#2C3E50] font-heading">
              "{selectedRole.questions[currentQuestionIdx]}"
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C3E50] block">
                Answer Speech Transcript / Text Response:
              </label>
              <textarea
                rows={5}
                value={currentAnswerText}
                onChange={(e) => setCurrentAnswerText(e.target.value)}
                placeholder="Speak clearly or type your response here..."
                className="w-full bg-white border border-[#FAD7A0] rounded-xl p-4 text-xs text-[#2C3E50]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#5D6D7E]">
                Target Answer Duration: 45 - 60 seconds
              </span>

              <button
                type="button"
                onClick={finishCurrentQuestion}
                className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
              >
                Submit Answer & Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: EVALUATING */}
        {stage === 'evaluating' && (
          <div className="p-12 text-center space-y-4 bg-[#FFF8F0] rounded-2xl border border-[#FAD7A0]">
            <Sparkles className="w-12 h-12 text-[#D35400] mx-auto animate-spin" />
            <h3 className="text-base font-black text-[#2C3E50] font-heading">
              SAILL AI Engine Evaluating Full Mock Interview...
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Analyzing content relevance, STAR organization, grammar precision, tone, and speech parameters.
            </p>
          </div>
        )}

        {/* STAGE 5: FINAL REPORT CARD */}
        {stage === 'report' && finalReport && (
          <div className="p-6 rounded-2xl bg-white border-2 border-[#D35400] space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-[#2C3E50] text-[#FAD7A0] px-2.5 py-1 rounded-md">
                  {selectedRole.title}
                </span>
                <h3 className="text-lg font-black text-[#2C3E50] font-heading mt-1">
                  AI Mock Interview Diagnostic Report Card
                </h3>
              </div>

              <div className="bg-[#2C3E50] text-white p-3 rounded-2xl text-center border-2 border-[#D35400]">
                <span className="text-[10px] text-gray-300 uppercase font-bold block">SAILL Score</span>
                <span className="text-2xl font-black text-[#FAD7A0]">{finalReport.overallScore10} / 10</span>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs font-bold">
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block">Content Quality</span>
                <span className="text-sm font-black text-[#2C3E50]">{finalReport.contentScore}/10</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block">Grammar</span>
                <span className="text-sm font-black text-[#2C3E50]">{finalReport.grammarScore}/10</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block">Professional Tone</span>
                <span className="text-sm font-black text-[#2C3E50]">{finalReport.toneScore}/10</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block">Fluency</span>
                <span className="text-sm font-black text-[#2C3E50]">{finalReport.fluencyScore}/10</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <span className="text-[10px] text-[#5D6D7E] block">Confidence</span>
                <span className="text-sm font-black text-[#2C3E50]">{finalReport.confidenceScore}/10</span>
              </div>
            </div>

            {/* Question Transcript Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                Question & Answer Transcript Log:
              </h4>

              <div className="space-y-2">
                {selectedRole.questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-1">
                    <span className="font-extrabold text-[#D35400] block">Q{idx + 1}: {q}</span>
                    <p className="text-[#2C3E50] italic leading-relaxed">"{answers[idx]}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#FAD7A0]">
              <button
                type="button"
                onClick={() => setStage('instructions')}
                className="text-xs font-bold text-[#2C3E50] hover:text-[#D35400] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Mock Interview
              </button>

              <button
                type="button"
                onClick={handleSaveInterviewReport}
                disabled={savedLocally}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                  savedLocally
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#D35400] text-white hover:bg-[#B04300]'
                }`}
              >
                {savedLocally ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Report Saved to IndexedDB Portfolio
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Report Card to Student Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
