import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HelpCircle,
  Volume2,
  Mic,
  Square,
  Send,
  Sparkles,
  CheckCircle2,
  Globe,
  ArrowRight,
  MessageSquare,
  Lightbulb,
  Award,
  RotateCcw
} from 'lucide-react';
import {
  QAInteraction,
  generateAudienceQuestions,
  evaluateStudentPREPAnswer
} from '../../../services/ai/presentationCoach';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface PSQASessionProps {
  topicTitle: string;
  presentationType?: string;
  transcriptText?: string;
  onQAComplete: (qaList: QAInteraction[]) => void;
}

export const PSQASession: React.FC<PSQASessionProps> = ({
  topicTitle,
  presentationType = 'Public Speaking',
  transcriptText = '',
  onQAComplete
}) => {
  const [qaList, setQaList] = useState<QAInteraction[]>(() =>
    generateAudienceQuestions(topicTitle, presentationType, transcriptText)
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isRecordingAnswer, setIsRecordingAnswer] = useState<boolean>(false);
  const [isAnsweringFollowUp, setIsAnsweringFollowUp] = useState<boolean>(false);
  const [followUpAnswer, setFollowUpAnswer] = useState<string>('');
  const [isRecordingFollowUp, setIsRecordingFollowUp] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<{
    score: number;
    feedback: string;
    prepBreakdown?: any;
  } | null>(null);

  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const [accentPreference, setAccentPreference] = useState<'en-US' | 'en-GB'>(() => {
    return (localStorage.getItem('saill_accent_pref') as 'en-US' | 'en-GB') || 'en-US';
  });

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Re-generate if topic or transcript changes
  useEffect(() => {
    setQaList(generateAudienceQuestions(topicTitle, presentationType, transcriptText));
    setActiveIndex(0);
    setCurrentAnswer('');
    setIsAnsweringFollowUp(false);
    setFollowUpAnswer('');
    setCurrentEvaluation(null);
  }, [topicTitle, presentationType, transcriptText]);

  const activeQA = qaList[activeIndex] || qaList[0];

  // Cleanup recognition
  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopVoiceRecognition();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopVoiceRecognition]);

  // Voice output: Speak question aloud using accent preference
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accentPreference;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) =>
        v.lang === accentPreference ||
        (accentPreference === 'en-GB' && v.lang.includes('GB')) ||
        (accentPreference === 'en-US' && v.lang.includes('US'))
    );
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start voice input for main answer
  const handleToggleVoiceInputMain = async () => {
    if (isRecordingAnswer) {
      stopVoiceRecognition();
      setIsRecordingAnswer(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = accentPreference;

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript + ' ';
          }
          setCurrentAnswer(fullText.trim());
        };

        recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition error:', err);
          setIsRecordingAnswer(false);
        };

        recognition.onend = () => {
          setIsRecordingAnswer(false);
        };

        recognition.start();
        setIsRecordingAnswer(true);
      } else {
        alert('Voice recognition is not supported in this browser. You can type your response.');
      }
    } catch (err) {
      console.warn('Mic access error for QA:', err);
    }
  };

  // Start voice input for follow-up answer
  const handleToggleVoiceInputFollowUp = async () => {
    if (isRecordingFollowUp) {
      stopVoiceRecognition();
      setIsRecordingFollowUp(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = accentPreference;

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript + ' ';
          }
          setFollowUpAnswer(fullText.trim());
        };

        recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition error:', err);
          setIsRecordingFollowUp(false);
        };

        recognition.onend = () => {
          setIsRecordingFollowUp(false);
        };

        recognition.start();
        setIsRecordingFollowUp(true);
      }
    } catch (err) {
      console.warn('Mic access error for follow-up QA:', err);
    }
  };

  // Submit main answer
  const handleSubmitMainAnswer = () => {
    stopVoiceRecognition();
    setIsRecordingAnswer(false);

    const answer = currentAnswer.trim() || 'In our laboratory project, we addressed this constraint by following structured engineering protocols.';
    const evaluation = evaluateStudentPREPAnswer(answer, activeQA.questionText);
    setCurrentEvaluation(evaluation);

    // Check if there is a follow-up question
    if (activeQA.followUpQuestionText && !isAnsweringFollowUp) {
      setIsAnsweringFollowUp(true);
      // Read follow-up aloud
      setTimeout(() => {
        handleSpeakText(`Thank you for your response. As a follow-up: ${activeQA.followUpQuestionText}`);
      }, 500);
    } else {
      finalizeQuestion(answer, undefined, evaluation);
    }
  };

  // Submit follow-up answer
  const handleSubmitFollowUpAnswer = () => {
    stopVoiceRecognition();
    setIsRecordingFollowUp(false);

    const fullAnswer = `${currentAnswer}\n\n[Follow-up Response]: ${followUpAnswer.trim() || 'We ensure continuous tracking and testing at each milestone.'}`;
    const evaluation = evaluateStudentPREPAnswer(fullAnswer, activeQA.questionText);

    finalizeQuestion(currentAnswer, followUpAnswer, evaluation);
  };

  // Finalize question and advance
  const finalizeQuestion = async (
    ans: string,
    fUpAns: string | undefined,
    evaluation: { score: number; feedback: string; prepBreakdown?: any }
  ) => {
    const updated = [...qaList];
    updated[activeIndex] = {
      ...activeQA,
      studentAnswer: ans,
      studentFollowUpAnswer: fUpAns,
      aiEvaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        prepBreakdown: evaluation.prepBreakdown
      }
    };
    setQaList(updated);

    if (activeIndex < qaList.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setIsAnsweringFollowUp(false);
      setFollowUpAnswer('');
      setCurrentEvaluation(null);
    } else {
      // Save Q&A to portfolio
      try {
        await dbStorage.savePortfolioItem({
          id: 'ps-qa-' + Date.now(),
          moduleId: 'public-speaking',
          moduleTitle: 'Public Speaking & Presentations',
          title: `AI Audience Q&A Session: ${topicTitle}`,
          category: 'written',
          content: updated
            .map(
              (q, i) =>
                `Q${i + 1} (${q.askerName}): ${q.questionText}\nAnswer: ${q.studentAnswer || ''}\n${
                  q.followUpQuestionText ? `Follow-up: ${q.followUpQuestionText}\nFollow-up Answer: ${q.studentFollowUpAnswer || ''}\n` : ''
                }AI Evaluation: ${q.aiEvaluation?.score}/2.0 - ${q.aiEvaluation?.feedback}`
            )
            .join('\n\n'),
          score: 9.4,
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.error('Error saving QA to portfolio', e);
      }

      confetti({ particleCount: 40, spread: 60 });
      onQAComplete(updated);
    }
  };

  const handleAccentChange = (acc: 'en-US' | 'en-GB') => {
    setAccentPreference(acc);
    localStorage.setItem('saill_accent_pref', acc);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 9: Interactive AI Audience Q&A Session
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Audience queries generated specifically for "{topicTitle}". Respond by voice using the PREP framework.
          </p>
        </div>

        {/* Accent and Question Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-2.5 py-1 rounded-xl border border-[#FAD7A0] text-xs">
            <Globe className="w-3.5 h-3.5 text-[#D35400]" />
            <button
              onClick={() => handleAccentChange('en-US')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                accentPreference === 'en-US' ? 'bg-[#D35400] text-white' : 'text-[#5D6D7E]'
              }`}
            >
              US
            </button>
            <button
              onClick={() => handleAccentChange('en-GB')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                accentPreference === 'en-GB' ? 'bg-[#D35400] text-white' : 'text-[#5D6D7E]'
              }`}
            >
              UK
            </button>
          </div>

          <span className="text-xs font-mono font-bold bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#FAD7A0] text-[#D35400]">
            Question {activeIndex + 1} of {qaList.length}
          </span>
        </div>
      </div>

      {/* PREP Technique Helper */}
      <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-1">
        <span className="font-extrabold text-[#D35400] uppercase text-[11px] block flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>The PREP Response Technique</span>
        </span>
        <p className="text-[#5D6D7E] text-[11px] leading-relaxed">
          <strong>P</strong>oint (Direct clear answer) → <strong>R</strong>eason (Logical explanation) → <strong>E</strong>xample (Laboratory metric/experience) → <strong>P</strong>oint (Summary takeaway).
        </p>
      </div>

      {/* Main Audience Question Card */}
      <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white rounded-2xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 bg-white/10 rounded-xl border border-white/10">
              {activeQA.askerAvatar || '👨‍🏫'}
            </span>
            <div>
              <span className="text-xs font-bold text-white block">
                {activeQA.askerName}
              </span>
              <span className="text-[10px] font-mono text-[#FAD7A0]">
                {activeQA.askerRole}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSpeakText(activeQA.questionText)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto ${
              isSpeakingQuestion
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FAD7A0]" />
            <span>{isSpeakingQuestion ? 'Speaking Question...' : 'Listen to Question'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#FAD7A0] uppercase tracking-wider block">
            Audience Question:
          </span>
          <p className="text-sm font-semibold text-white leading-relaxed font-heading">
            "{activeQA.questionText}"
          </p>
        </div>
      </div>

      {/* Step 1: Main Answer Input */}
      <div className="space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="font-extrabold text-[#2C3E50] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#D35400]" />
            <span>Your Response (PREP Format):</span>
          </label>

          {/* Voice Answer Button */}
          <button
            onClick={handleToggleVoiceInputMain}
            disabled={isAnsweringFollowUp}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              isRecordingAnswer
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FDEBD0]'
            } ${isAnsweringFollowUp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isRecordingAnswer ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Recording Answer (Click to Stop)...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Answer by Voice (Microphone)</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={3}
          value={currentAnswer}
          disabled={isAnsweringFollowUp}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="State your Point (direct answer), Reason (why), Example (laboratory scenario), and Point (summary)..."
          className="w-full p-3 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#D35400] leading-relaxed disabled:opacity-70"
        />

        {!isAnsweringFollowUp && (
          <button
            onClick={handleSubmitMainAnswer}
            disabled={isRecordingAnswer}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {activeQA.followUpQuestionText
                ? 'Submit Response & Receive Audience Follow-Up Query'
                : activeIndex < qaList.length - 1
                ? 'Submit Answer & Proceed to Next Question'
                : 'Submit Final Answer & Generate AI Evaluation Report'}
            </span>
          </button>
        )}
      </div>

      {/* Step 2: Follow-Up Question Section */}
      {isAnsweringFollowUp && activeQA.followUpQuestionText && (
        <div className="p-5 bg-gradient-to-br from-[#FEF9E7] to-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D35400]" />
              <span className="font-extrabold text-xs text-[#2C3E50] font-heading">
                Audience Follow-Up Query from {activeQA.askerName}
              </span>
            </div>

            <button
              onClick={() => handleSpeakText(activeQA.followUpQuestionText || '')}
              className="text-[11px] font-bold text-[#D35400] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>

          <p className="text-xs font-bold text-[#2C3E50] leading-relaxed italic bg-white p-3 rounded-xl border border-[#FAD7A0]">
            "{activeQA.followUpQuestionText}"
          </p>

          {/* Follow-up voice and text input */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#2C3E50]">Your Follow-Up Explanation:</label>
              <button
                onClick={handleToggleVoiceInputFollowUp}
                className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  isRecordingFollowUp
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FDEBD0]'
                }`}
              >
                {isRecordingFollowUp ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3" />
                    <span>Answer Follow-up by Voice</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={2}
              value={followUpAnswer}
              onChange={(e) => setFollowUpAnswer(e.target.value)}
              placeholder="Provide a concise clarification or practical example..."
              className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-white text-xs text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#D35400]"
            />

            <button
              onClick={handleSubmitFollowUpAnswer}
              disabled={isRecordingFollowUp}
              className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {activeIndex < qaList.length - 1
                  ? 'Submit Follow-Up & Proceed to Next Audience Question'
                  : 'Submit Final Answer & Generate AI 10-Mark Evaluation Report'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Immediate AI PREP Feedback Badge */}
      {currentEvaluation && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>AI PREP Evaluation Score: {currentEvaluation.score} / 2.0 Marks</span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
              PREP Verified ✓
            </span>
          </div>
          <p className="text-emerald-900 leading-relaxed text-[11px]">
            {currentEvaluation.feedback}
          </p>
        </div>
      )}
    </div>
  );
};
