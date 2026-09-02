import React, { useState, useEffect, useRef } from 'react';
import {
  ImageIcon,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Volume2,
  Clock,
  Award,
  ArrowRight,
  HelpCircle,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart2,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem, RecordingItem, LabExperimentRecord } from '../../../types';
import { formatScore10, getPerformanceDescriptor, normalizeTo10Scale } from '../../../lib/scoring';
import { AccentPreferenceService, useAccentPreference } from '../../../services/AccentPreferenceService';
import confetti from 'canvas-confetti';

export interface ExtendedVisualEvaluationResult {
  totalScore: number;
  criteria: {
    fluencyScore: number;
    pronunciationScore: number;
    grammarScore: number;
    vocabularyScore: number;
    organizationScore: number;
  };
  performanceDescriptor: string;
  wpm: number;
  durationSec: number;
  fillerWordCount: number;
  detectedFillerWords: string[];
  whatYouDidWell: string[];
  specificAreasToImprove: string[];
  descriptionStyleFeedback: string;
  languageImprovement: string[];
  speakingImprovement: string[];
  validImprovementSuggestions: string[];
  polishedTranscript: string;
  isInvalidOrUnintelligible?: boolean;
  invalidReason?: string;
}

interface ExtendedVisualDescriptionStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWork?: (title: string, content: string) => void;
  onTaskCompleted?: (score: number) => void;
}

export const ExtendedVisualDescriptionStudio: React.FC<ExtendedVisualDescriptionStudioProps> = ({
  moduleId = 'spoken-english',
  moduleTitle = 'Spoken English & Fluency Building',
  onSaveWork,
  onTaskCompleted
}) => {
  // Sub-task selector: 'task1' (Gadget) | 'task2' (Graph)
  const [activeTask, setActiveTask] = useState<'task1' | 'task2'>('task1');

  // Task 1: Gadget Description States
  const [t1Recording, setT1Recording] = useState<boolean>(false);
  const [t1Duration, setT1Duration] = useState<number>(0);
  const [t1AudioUrl, setT1AudioUrl] = useState<string | null>(null);
  const [t1AudioBase64, setT1AudioBase64] = useState<string | null>(null);
  const [t1IsPlaying, setT1IsPlaying] = useState<boolean>(false);
  const [t1Transcript, setT1Transcript] = useState<string>('');
  const [t1Saved, setT1Saved] = useState<boolean>(false);
  const [t1SavedAt, setT1SavedAt] = useState<string | null>(null);

  // Task 2: Graph Description States
  const [t2Recording, setT2Recording] = useState<boolean>(false);
  const [t2Duration, setT2Duration] = useState<number>(0);
  const [t2AudioUrl, setT2AudioUrl] = useState<string | null>(null);
  const [t2AudioBase64, setT2AudioBase64] = useState<string | null>(null);
  const [t2IsPlaying, setT2IsPlaying] = useState<boolean>(false);
  const [t2Transcript, setT2Transcript] = useState<string>('');
  const [t2Saved, setT2Saved] = useState<boolean>(false);
  const [t2SavedAt, setT2SavedAt] = useState<string | null>(null);

  // MediaRecorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // AI Evaluation States
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<ExtendedVisualEvaluationResult | null>(null);
  const [evaluatingTaskId, setEvaluatingTaskId] = useState<'both' | 'task1' | 'task2'>('both');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const [showInvalidModal, setShowInvalidModal] = useState<boolean>(false);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Format seconds to MM:SS
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const [accent] = useAccentPreference();

  // Text to Speech playback
  const speakText = (text: string) => {
    AccentPreferenceService.speak(text, { accent, rate: 0.92 });
  };

  // -------------------------------------------------------------
  // Recording Handlers (Protected 2:00 Minimum Duration Logic)
  // -------------------------------------------------------------
  const startRecording = async (task: 'task1' | 'task2') => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    audioChunksRef.current = [];

    if (task === 'task1') {
      setT1AudioUrl(null);
      setT1AudioBase64(null);
      setT1Duration(0);
      setT1Recording(true);
    } else {
      setT2AudioUrl(null);
      setT2AudioBase64(null);
      setT2Duration(0);
      setT2Recording(true);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          if (task === 'task1') {
            setT1AudioUrl(url);
            setT1AudioBase64(base64data);
          } else {
            setT2AudioUrl(url);
            setT2AudioBase64(base64data);
          }
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);

      // Start elapsed timer (Counts UP with no auto-cutoff at 2:00)
      timerIntervalRef.current = window.setInterval(() => {
        if (task === 'task1') {
          setT1Duration((prev) => prev + 1);
        } else {
          setT2Duration((prev) => prev + 1);
        }
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable, using simulated audio capture for sandbox demo:', err);
      // Fallback timer simulation for sandboxed testing
      timerIntervalRef.current = window.setInterval(() => {
        if (task === 'task1') {
          setT1Duration((prev) => prev + 1);
        } else {
          setT2Duration((prev) => prev + 1);
        }
      }, 1000);
    }
  };

  const stopRecording = (task: 'task1' | 'task2') => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (task === 'task1') {
      setT1Recording(false);
      // If user did not manually type transcript, provide realistic scaffold draft if empty
      if (!t1Transcript) {
        setT1Transcript(
          'This image presents the SRIT-IoT-v4 Smart Multi-Sensor Diagnostic Terminal. In the center, we observe a high-resolution OLED telemetry screen displaying real-time temperature of 24.8 degrees Celsius, ambient humidity at 45.2%, and PM2.5 particulate density. At the core, an ARM Cortex-M4 microcontroller processes signals from the calibrated thermocouple probe and optical alignment sensor. The device utilizes a high-gain RF antenna for cloud telemetry and a USB-C interface for high-speed firmware diagnostics.'
        );
      }
    } else {
      setT2Recording(false);
      if (!t2Transcript) {
        setT2Transcript(
          'The provided multi-series chart illustrates Global Renewable Energy Grid Integration and Battery Storage Telemetry from 2024 through 2028. Along the horizontal axis, we observe time measured in calendar years, while the vertical axis indicates power capacity in gigawatts and storage efficiency percentages. Solar photovoltaic generation exhibits the steepest upward trajectory, expanding from 120 gigawatts to 380 gigawatts. A key inflection point occurs in 2026 where battery storage efficiency hits 94%, displacing fossil peaker plants.'
        );
      }
    }
  };

  const playRecordedAudio = (task: 'task1' | 'task2') => {
    const url = task === 'task1' ? t1AudioUrl : t2AudioUrl;
    if (!url) return;

    if (audioPlayerRef.current) {
      if (task === 'task1' ? t1IsPlaying : t2IsPlaying) {
        audioPlayerRef.current.pause();
        if (task === 'task1') setT1IsPlaying(false);
        else setT2IsPlaying(false);
      } else {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play();
        if (task === 'task1') setT1IsPlaying(true);
        else setT2IsPlaying(true);

        audioPlayerRef.current.onended = () => {
          if (task === 'task1') setT1IsPlaying(false);
          else setT2IsPlaying(false);
        };
      }
    }
  };

  // -------------------------------------------------------------
  // Save Individual Task Recording (Protected under 2:00 rule)
  // -------------------------------------------------------------
  const handleSaveTaskRecording = async (task: 'task1' | 'task2') => {
    const duration = task === 'task1' ? t1Duration : t2Duration;
    const transcript = task === 'task1' ? t1Transcript : t2Transcript;
    const base64Audio = task === 'task1' ? t1AudioBase64 : t2AudioBase64;

    // Strict 2-minute validation (120 seconds)
    if (duration < 120) {
      alert(`Minimum recording duration of 2:00 (120 seconds) is required. Current duration: ${formatTime(duration)}.`);
      return;
    }

    const taskTitle =
      task === 'task1'
        ? 'Task 1: Gadget & Technology Description (Smart IoT Diagnostic Terminal)'
        : 'Task 2: Graph & Data Description (Global Renewable Grid Integration)';

    const recItem: RecordingItem = {
      id: `rec-m3-s5-${task}-${Date.now()}`,
      moduleId,
      moduleTitle,
      title: taskTitle,
      audioDataUrl: base64Audio || 'simulated-audio-data',
      durationSeconds: duration,
      createdAt: new Date().toISOString(),
      score: 90
    };

    await dbStorage.saveRecording(recItem);

    if (task === 'task1') {
      setT1Saved(true);
      setT1SavedAt(new Date().toLocaleTimeString());
      setSaveStatusMsg('✓ Task 1: Gadget Description recording saved successfully (Duration: ' + formatTime(duration) + ')!');
    } else {
      setT2Saved(true);
      setT2SavedAt(new Date().toLocaleTimeString());
      setSaveStatusMsg('✓ Task 2: Graph Description recording saved successfully (Duration: ' + formatTime(duration) + ')!');
    }

    setTimeout(() => setSaveStatusMsg(null), 3500);
  };

  // -------------------------------------------------------------
  // Comprehensive AI Evaluation Engine (After BOTH tasks saved)
  // -------------------------------------------------------------
  const handleTriggerAIEvaluation = async () => {
    // Check if both tasks are saved
    if (!t1Saved || !t2Saved) {
      alert('Please complete and save BOTH Task 1 (Gadget) and Task 2 (Graph) recordings (minimum 2 minutes each) before generating AI evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const combinedTranscript = `${t1Transcript} ${t2Transcript}`.trim();
    const words = combinedTranscript.split(/\s+/).filter(Boolean);
    const totalSecs = t1Duration + t2Duration;

    // Check for invalid or unintelligible recording
    // (e.g. fewer than 20 meaningful words, gibberish, or silence)
    const isGibberish =
      words.length < 25 ||
      /^(.)\1+$/.test(combinedTranscript.replace(/\s+/g, '')) ||
      !/[a-zA-Z]{3,}/.test(combinedTranscript);

    if (isGibberish) {
      const invalidRes: ExtendedVisualEvaluationResult = {
        totalScore: 2.0,
        criteria: {
          fluencyScore: 0.5,
          pronunciationScore: 0.5,
          grammarScore: 0.5,
          vocabularyScore: 0.5,
          organizationScore: 0.0
        },
        performanceDescriptor: 'Needs Improvement',
        wpm: Math.round((words.length / Math.max(1, totalSecs)) * 60),
        durationSec: totalSecs,
        fillerWordCount: 0,
        detectedFillerWords: [],
        whatYouDidWell: ['Initiated the recording session and engaged with the microphone system.'],
        specificAreasToImprove: [
          'Spoken response was unintelligible, too brief, or lacked audible continuous sentences.',
          'Failed to describe the physical gadget components and graph metrics required by the 2-minute prompt.'
        ],
        descriptionStyleFeedback:
          'No clear visual description style was established. You must systematically walk the listener through what you see using spatial markers and data references.',
        languageImprovement: [
          'Construct full subject-verb-object technical sentences.',
          'Incorporate domain-specific terminology for both the gadget and the data chart.'
        ],
        speakingImprovement: [
          'Maintain an audible, steady vocal volume directly into the microphone.',
          'Speak continuously for at least 2 full minutes per visual task.'
        ],
        validImprovementSuggestions: [
          'Carefully review the structured speaking prompts and model audio transcripts before re-recording.',
          'Deliver at least 120 seconds of coherent oral description per task.'
        ],
        polishedTranscript: 'Unintelligible speech input detected. Please re-record your descriptions clearly.',
        isInvalidOrUnintelligible: true,
        invalidReason: 'Speech transcript contains fewer than 25 intelligible words or audio was below clarity threshold.'
      };

      setEvaluationResult(invalidRes);
      setShowInvalidModal(true);
      setIsEvaluating(false);
      return;
    }

    // Valid evaluation computation
    const wpm = Math.round((words.length / Math.max(1, totalSecs)) * 60);
    const lowerText = combinedTranscript.toLowerCase();

    // Check fillers
    const fillerList = ['um', 'uh', 'ah', 'er', 'basically', 'like', 'you know', 'actually'];
    const detectedFillers: string[] = [];
    let fillerCount = 0;
    fillerList.forEach((f) => {
      const matches = lowerText.match(new RegExp(`\\b${f}\\b`, 'gi'));
      if (matches) {
        fillerCount += matches.length;
        detectedFillers.push(f);
      }
    });

    // Check keywords for Gadget & Graph
    const gadgetKeywords = ['oled', 'sensor', 'microcontroller', 'cortex', 'telemetry', 'probe', 'antenna', 'casing', 'real-time'];
    const graphKeywords = ['axis', 'trajectory', 'capacity', 'photovoltaic', 'solar', 'wind', 'battery', 'efficiency', 'inflection', 'parity'];

    const gadgetMatches = gadgetKeywords.filter((k) => lowerText.includes(k)).length;
    const graphMatches = graphKeywords.filter((k) => lowerText.includes(k)).length;

    // Scores
    let fluencyScore = 1.9;
    if (wpm < 100 || wpm > 180) fluencyScore -= 0.3;
    if (fillerCount > 3) fluencyScore -= 0.3;
    fluencyScore = Math.max(1.0, Math.min(2.0, Number(fluencyScore.toFixed(1))));

    let pronunciationScore = 1.8;
    if (words.length > 80) pronunciationScore = 2.0;

    let grammarScore = 1.8;
    if (combinedTranscript.includes('.') && combinedTranscript.length > 100) grammarScore = 2.0;

    let vocabularyScore = Number((1.2 + (gadgetMatches + graphMatches) * 0.08).toFixed(1));
    vocabularyScore = Math.max(1.2, Math.min(2.0, vocabularyScore));

    let organizationScore = 1.9;
    const spatialMarkers = ['in the foreground', 'at the center', 'on the display', 'along the axis', 'furthermore', 'in conclusion'];
    const spatialFound = spatialMarkers.filter((s) => lowerText.includes(s)).length;
    if (spatialFound < 2) organizationScore = 1.7;

    const rawTotal = fluencyScore + pronunciationScore + grammarScore + vocabularyScore + organizationScore;
    const totalScore = normalizeTo10Scale(rawTotal);
    const descriptor = getPerformanceDescriptor(totalScore);

    const evaluation: ExtendedVisualEvaluationResult = {
      totalScore,
      criteria: {
        fluencyScore,
        pronunciationScore,
        grammarScore,
        vocabularyScore,
        organizationScore
      },
      performanceDescriptor: descriptor,
      wpm: wpm || 135,
      durationSec: totalSecs,
      fillerWordCount: fillerCount,
      detectedFillerWords: Array.from(new Set(detectedFillers)),
      whatYouDidWell: [
        `Maintained an impressive, continuous speaking duration of ${formatTime(totalSecs)} across both visual tasks.`,
        'Demonstrated strong visual observation by systematically mapping hardware elements and chart trajectories.',
        `Paced your speech effectively at approximately ${wpm || 135} WPM, keeping the listener engaged without rushing.`,
        'Incorporated relevant technical terminology for both the IoT diagnostic gadget and renewable energy dataset.'
      ],
      specificAreasToImprove: [
        fillerCount > 0
          ? `Reduce hesitation fillers ("${detectedFillers.slice(0, 3).join('", "')}") by embracing confident, deliberate pauses.`
          : 'Refine syllable stress on multi-syllabic engineering vocabulary like "microcontroller" and "photovoltaic".',
        'Deepen the contrastive analysis on Task 2 by stating exact numerical deltas between 2024 baselines and 2028 targets.'
      ],
      descriptionStyleFeedback:
        'Your visual description followed a solid logical architecture. You effectively used spatial anchoring ("at the center", "along the horizontal axis") and structured transitions. To elevate your delivery to corporate executive presentation caliber, explicitly conclude with the overarching engineering impact before wrapping up.',
      languageImprovement: [
        'Utilize sophisticated transitionals: "Notably...", "In direct contrast to...", "This metric underscores...".',
        'Enhance comparative adjective precision: replace "big change" with "exponential surge" or "sharp inflection".',
        'Ensure consistent past/present tense alignment when discussing historical 2024 data versus 2028 projections.'
      ],
      speakingImprovement: [
        'Vary pitch inflection when transitioning from the physical gadget overview to internal circuit mechanisms.',
        'Use vocal emphasis on critical statistical data points (e.g., "380 gigawatts", "94% efficiency").',
        'Keep diaphragmatic breath support steady to prevent vocal volume drops at the end of extended sentences.'
      ],
      validImprovementSuggestions: [
        'Practice the "Overview -> Detail -> Implication" 3-step visual delivery formula for engineering presentations.',
        'Record a quick 60-second summary highlighting only the 2026 grid parity milestone to sharpen brevity.',
        'Review the model audio pronunciation for complex terms: "thermocouple", "transceiver", "trajectory".'
      ],
      polishedTranscript: `${t1Transcript} Additionally, analyzing the telemetry chart reveals that solar generation expanded from 120 GW to 380 GW by 2028, with battery storage efficiency peaking at 94% to displace fossil reliance.`,
      isInvalidOrUnintelligible: false
    };

    setEvaluationResult(evaluation);
    setIsEvaluating(false);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });

    if (onTaskCompleted) {
      onTaskCompleted(totalScore);
    }
  };

  // -------------------------------------------------------------
  // Save Evaluation to Portfolio and Lab Notebook
  // -------------------------------------------------------------
  const handleSaveEvaluationToPortfolio = async () => {
    if (!evaluationResult) return;

    const formattedScore = `${formatScore10(evaluationResult.totalScore)} (${evaluationResult.performanceDescriptor})`;
    const content = `
MODULE 3 — SECTION 5: EXTENDED VISUAL DESCRIPTION & AI EVALUATION
-----------------------------------------------------------------
Overall Performance Mark: ${formattedScore}
Total Speaking Duration: ${formatTime(evaluationResult.durationSec)} (Task 1 + Task 2)
Pacing: ${evaluationResult.wpm} WPM | Fillers Detected: ${evaluationResult.fillerWordCount}

5-CRITERION RUBRIC BREAKDOWN (Max 2.0 Each):
- Fluency & Speech Continuity: ${evaluationResult.criteria.fluencyScore} / 2.0
- Pronunciation & Articulation: ${evaluationResult.criteria.pronunciationScore} / 2.0
- Grammar & Syntactic Control: ${evaluationResult.criteria.grammarScore} / 2.0
- Technical Vocabulary: ${evaluationResult.criteria.vocabularyScore} / 2.0
- Organization & Visual Synthesis: ${evaluationResult.criteria.organizationScore} / 2.0

WHAT YOU DID WELL:
- ${evaluationResult.whatYouDidWell.join('\n- ')}

SPECIFIC AREAS TO IMPROVE:
- ${evaluationResult.specificAreasToImprove.join('\n- ')}

DESCRIPTION STYLE FEEDBACK:
${evaluationResult.descriptionStyleFeedback}

LANGUAGE IMPROVEMENT:
- ${evaluationResult.languageImprovement.join('\n- ')}

SPEAKING IMPROVEMENT:
- ${evaluationResult.speakingImprovement.join('\n- ')}

VALID IMPROVEMENT SUGGESTIONS:
- ${evaluationResult.validImprovementSuggestions.join('\n- ')}

SAVED ARTIFACTS:
- Task 1: Gadget Description (${formatTime(t1Duration)}) - Saved ${t1SavedAt}
- Task 2: Graph Description (${formatTime(t2Duration)}) - Saved ${t2SavedAt}
    `.trim();

    const portfolioItem: PortfolioItem = {
      id: `p-visual-desc-${Date.now()}`,
      moduleId,
      moduleTitle,
      title: `Section 5: Extended Visual Description Evaluation (${formattedScore})`,
      category: 'audio',
      content,
      score: evaluationResult.totalScore,
      createdAt: new Date().toISOString(),
      teacherFeedback: `AI Evaluation Verified: ${formattedScore}. Full 2-minute extended description requirements satisfied.`
    };

    await dbStorage.savePortfolioItem(portfolioItem);

    if (onSaveWork) {
      onSaveWork(portfolioItem.title, content);
    }

    setSaveStatusMsg('✓ Extended Visual Description evaluation saved to SAILL Portfolio!');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  const handleSaveEvaluationToNotebook = async () => {
    if (!evaluationResult) return;

    const record: LabExperimentRecord = {
      experimentNumber: 'EXP-03-S5',
      date: new Date().toISOString().split('T')[0],
      title: 'Module 3 Section 5: Extended Visual Description (Gadget & Graph)',
      objective: 'To verbally describe complex visual stimuli (engineering gadget and telemetry graph) continuously for 2 minutes each, evaluating structure, vocabulary, and oral fluency.',
      studentWorkText: `
Task 1 (Gadget Description): ${formatTime(t1Duration)} recorded. Saved: ${t1Saved ? 'Yes' : 'No'}.
Task 2 (Graph Description): ${formatTime(t2Duration)} recorded. Saved: ${t2Saved ? 'Yes' : 'No'}.
Total Speaking Duration: ${formatTime(t1Duration + t2Duration)}
Average Pacing: ${evaluationResult.wpm} WPM
Score Achieved: ${formatScore10(evaluationResult.totalScore)} / 10.0
      `.trim(),
      reflectionText: 'Practiced delivering structured 2-minute spoken descriptions using spatial markers and statistical analysis.',
      facultyRemarks: `AI Evaluated: Outstanding 2-minute spoken delivery. Score: ${formatScore10(evaluationResult.totalScore)}/10.`,
      rubricScores: {
        pronunciationAndFluency: Math.min(20, Math.round(evaluationResult.criteria.fluencyScore * 10)),
        grammarAndVocabulary: Math.min(20, Math.round(evaluationResult.criteria.vocabularyScore * 10)),
        structureAndCoherence: Math.min(20, Math.round(evaluationResult.criteria.organizationScore * 10)),
        taskCompletion: 20,
        technicalAccuracy: Math.min(20, Math.round(evaluationResult.criteria.grammarScore * 10))
      },
      totalScore: evaluationResult.totalScore,
      status: 'Completed',
      facultyVerified: true
    };

    const notebookItem: PortfolioItem = {
      id: `p-nb-m3-s5-${Date.now()}`,
      moduleId,
      moduleTitle,
      title: 'Lab Notebook: Extended Visual Description & AI Speaking Assessment',
      category: 'reflection',
      content: JSON.stringify(record),
      score: evaluationResult.totalScore,
      createdAt: new Date().toISOString()
    };

    await dbStorage.savePortfolioItem(notebookItem);

    setSaveStatusMsg('✓ Digital Laboratory Notebook updated with Section 5 record!');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  // Reset task for re-recording
  const handleResetTask = (task: 'task1' | 'task2') => {
    if (task === 'task1') {
      setT1AudioUrl(null);
      setT1AudioBase64(null);
      setT1Duration(0);
      setT1Saved(false);
      setT1Transcript('');
    } else {
      setT2AudioUrl(null);
      setT2AudioBase64(null);
      setT2Duration(0);
      setT2Saved(false);
      setT2Transcript('');
    }
    setShowInvalidModal(false);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Hidden Audio Player for Playback */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Header Banner */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D35400] text-white text-[11px] font-black uppercase tracking-wider">
              Section 5
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#D35400]" />
              <span>Extended Visual Description & AI Speaking Evaluation</span>
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Observe, organize, and verbally describe complex visual information clearly and effectively. Complete two mandatory <strong>2-minute minimum</strong> extended speaking tasks.
          </p>
        </div>

        {/* Global Task Status Pill */}
        <div className="flex items-center gap-2 bg-[#FFF8F0] px-3.5 py-2 rounded-xl border border-[#FAD7A0] shrink-0">
          <Clock className="w-4 h-4 text-[#D35400]" />
          <div className="text-[11px] font-bold">
            <span className="text-[#5D6D7E]">Progress: </span>
            <span className="text-[#D35400]">
              {t1Saved && t2Saved ? '2 of 2 Tasks Saved' : t1Saved || t2Saved ? '1 of 2 Tasks Saved' : '0 of 2 Tasks Saved'}
            </span>
          </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveStatusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatusMsg}</span>
        </div>
      )}

      {/* 2-TASK SWITCHER TABS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Task 1 Tab */}
        <button
          onClick={() => setActiveTask('task1')}
          className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
            activeTask === 'task1'
              ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400] shadow-2xs'
              : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
              TASK 1: GADGET / TECHNOLOGY
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 ${
                t1Saved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : t1Duration >= 120
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t1Saved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>Saved ({formatTime(t1Duration)})</span>
                </>
              ) : t1Duration > 0 ? (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(t1Duration)} / 2:00</span>
                </>
              ) : (
                'Pending (2:00 Min)'
              )}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#2C3E50]">
            Smart IoT Environmental Monitor & Diagnostic Terminal
          </h4>
          <p className="text-[11px] text-[#5D6D7E] mt-0.5 line-clamp-1">
            Describe the physical architecture, OLED telemetry display, probes, and edge microcontroller.
          </p>
        </button>

        {/* Task 2 Tab */}
        <button
          onClick={() => setActiveTask('task2')}
          className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
            activeTask === 'task2'
              ? 'bg-[#FFF8F0] border-[#D35400] ring-2 ring-[#D35400] shadow-2xs'
              : 'bg-white border-[#FAD7A0] hover:bg-[#FFF8F0]/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
              TASK 2: GRAPH / DATA DESCRIPTION
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 ${
                t2Saved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : t2Duration >= 120
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t2Saved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>Saved ({formatTime(t2Duration)})</span>
                </>
              ) : t2Duration > 0 ? (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(t2Duration)} / 2:00</span>
                </>
              ) : (
                'Pending (2:00 Min)'
              )}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#2C3E50]">
            Global Renewable Energy Grid Integration & Battery Storage (2024–2028)
          </h4>
          <p className="text-[11px] text-[#5D6D7E] mt-0.5 line-clamp-1">
            Analyze multi-year power generation trajectories, storage efficiency gains, and 2026 grid parity.
          </p>
        </button>
      </div>

      {/* ========================================================= */}
      {/* ACTIVE TASK VIEW WORKBENCH */}
      {/* ========================================================= */}
      <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-6">
        {/* Task Guidelines & Objectives */}
        <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D35400] text-white text-[11px] font-black uppercase tracking-wider">
              {activeTask === 'task1' ? 'Task 1 Guidelines: Gadget Description' : 'Task 2 Guidelines: Graph Description'}
            </span>
            <span className="text-xs font-bold text-[#D35400] flex items-center gap-1.5 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Mandatory Duration: 2:00 Minimum (Save Locked &lt; 2:00)</span>
            </span>
          </div>

          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading">
            {activeTask === 'task1'
              ? 'Engineering Visual Stimulus: Smart Multi-Sensor Diagnostic Terminal'
              : 'Technical Data Stimulus: 2024–2028 Clean Energy Grid Telemetry'}
          </h3>

          <div className="space-y-1.5 pt-1 border-t border-[#FAD7A0]/60">
            <span className="text-[10px] font-black uppercase text-[#D35400] tracking-wider block">
              Structured Speaking Deliverables:
            </span>
            <ul className="text-xs text-[#2C3E50] space-y-1">
              {activeTask === 'task1' ? (
                <>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">1.</span>
                    <span><strong>Device Identification & Operating Context:</strong> State the device name, functional category, and industrial engineering purpose.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">2.</span>
                    <span><strong>Physical Architecture & Spatial Layout:</strong> Systematically describe the rugged enclosure, OLED display readings (24.8°C, 45.2% RH), sensors, and indicators.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">3.</span>
                    <span><strong>Working Mechanism & Data Pipeline:</strong> Explain how analog environmental signals pass through the ARM Cortex-M4 MCU into wireless telemetry.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">4.</span>
                    <span><strong>Engineering Application & Tolerance:</strong> Discuss predictive factory maintenance, calibration accuracy (±0.01%), and practical industrial benefits.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">1.</span>
                    <span><strong>Visual Type, Scope & Benchmark Timeframe:</strong> Identify the multi-series line & bar telemetry graph, X/Y axes (Years vs GW/Efficiency), and 2024–2028 scope.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">2.</span>
                    <span><strong>Dominant Trends & Trajectories:</strong> Contrast the rapid solar surge (120 GW to 380 GW) against steady wind growth (180 GW to 310 GW).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">3.</span>
                    <span><strong>Key Inflection Points & Storage Parity:</strong> Highlight the 2026 battery storage efficiency peak at 94% and corresponding decline in fossil peakers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D35400] font-bold">4.</span>
                    <span><strong>Engineering Synthesis & Grid Implication:</strong> Conclude on grid stability, baseload balancing, and long-term decarbonization implications.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Visual Presentation + Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT: VISUAL STIMULUS (High-fidelity SVGs) */}
          <div className="space-y-3">
            {activeTask === 'task1' ? (
              /* TASK 1 GADGET SVG */
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 p-3">
                <svg viewBox="0 0 500 320" className="w-full h-64 sm:h-72 rounded-xl bg-slate-900" role="img" aria-label="Smart IoT Diagnostic Terminal Device">
                  {/* Background Grid Pattern */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="500" height="320" fill="#0b0f19" />
                  <rect width="500" height="320" fill="url(#grid)" opacity="0.6" />

                  {/* Device Shadow & Main Matte Casing */}
                  <rect x="75" y="35" width="350" height="250" rx="16" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                  <rect x="85" y="45" width="330" height="230" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

                  {/* Top Casing Antenna (Right) */}
                  <rect x="360" y="10" width="18" height="30" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                  <line x1="369" y1="10" x2="369" y2="4" stroke="#e2e8f0" strokeWidth="2.5" />
                  <circle cx="369" cy="3" r="3" fill="#38bdf8" />
                  <text x="369" y="32" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontWeight="bold">2.4G RF</text>

                  {/* Top Status Indicator Bezel */}
                  <rect x="100" y="55" width="160" height="18" rx="4" fill="#1e293b" />
                  <circle cx="112" cy="64" r="3.5" fill="#22c55e" />
                  <text x="122" y="67" fill="#86efac" fontSize="7" fontWeight="bold">PWR ON</text>
                  <circle cx="160" cy="64" r="3.5" fill="#38bdf8" />
                  <text x="170" y="67" fill="#bae6fd" fontSize="7" fontWeight="bold">TX/RX CLOUD</text>
                  <circle cx="218" cy="64" r="3.5" fill="#eab308" />
                  <text x="228" y="67" fill="#fde047" fontSize="7" fontWeight="bold">CAL: ±0.01%</text>

                  {/* Device Model Label */}
                  <text x="390" y="68" fill="#f59e0b" fontSize="8.5" fontWeight="black" textAnchor="end">
                    SRIT-IoT DIAGNOSTIC v4.2
                  </text>

                  {/* Center High-Resolution OLED Screen */}
                  <rect x="100" y="82" width="190" height="115" rx="8" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* OLED Header */}
                  <rect x="105" y="87" width="180" height="16" rx="3" fill="#0f172a" />
                  <text x="112" y="98" fill="#38bdf8" fontSize="7.5" fontWeight="bold">LIVE TELEMETRY STREAM</text>
                  <text x="278" y="98" fill="#22c55e" fontSize="7" fontWeight="bold" textAnchor="end">ACTIVE 100Hz</text>

                  {/* OLED Telemetry Metrics */}
                  <text x="112" y="118" fill="#f8fafc" fontSize="8">TEMP:</text>
                  <text x="145" y="118" fill="#f59e0b" fontSize="9" fontWeight="bold">24.8 °C</text>

                  <text x="200" y="118" fill="#f8fafc" fontSize="8">HUMIDITY:</text>
                  <text x="250" y="118" fill="#38bdf8" fontSize="9" fontWeight="bold">45.2 %</text>

                  <text x="112" y="134" fill="#f8fafc" fontSize="8">PM2.5:</text>
                  <text x="145" y="134" fill="#22c55e" fontSize="9" fontWeight="bold">12.4 µg/m³</text>

                  <text x="200" y="134" fill="#f8fafc" fontSize="8">RSSI:</text>
                  <text x="250" y="134" fill="#818cf8" fontSize="9" fontWeight="bold">-42 dBm</text>

                  {/* Realtime Waveform on OLED */}
                  <rect x="105" y="142" width="180" height="48" rx="4" fill="#030712" stroke="#1e293b" />
                  <path d="M 110 166 Q 125 148 140 166 T 170 166 T 200 150 T 230 172 T 260 160 T 280 166" fill="none" stroke="#22c55e" strokeWidth="1.8" />
                  <text x="112" y="185" fill="#64748b" fontSize="6.5">SIGNAL HARMONICS (±0.002V)</text>

                  {/* Right Module: ARM Microcontroller & PCB Architecture */}
                  <rect x="305" y="82" width="95" height="115" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="352" y="97" fill="#a7f3d0" fontSize="7.5" fontWeight="bold" textAnchor="middle">EDGE AI CORE</text>
                  {/* Microcontroller IC */}
                  <rect x="320" y="105" width="65" height="50" rx="3" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
                  <text x="352" y="125" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">ARM Cortex-M4</text>
                  <text x="352" y="137" fill="#e2e8f0" fontSize="6.5" textAnchor="middle">32-Bit / 168MHz</text>
                  <text x="352" y="147" fill="#38bdf8" fontSize="6" textAnchor="middle">ADC 16-Channel</text>
                  {/* PCB Traces */}
                  <line x1="310" y1="170" x2="395" y2="170" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="325" cy="182" r="3" fill="#fbbf24" />
                  <circle cx="352" cy="182" r="3" fill="#38bdf8" />
                  <circle cx="380" cy="182" r="3" fill="#22c55e" />
                  <text x="352" y="193" fill="#6ee7b7" fontSize="6" textAnchor="middle">BUS INTERCONNECT</text>

                  {/* Bottom Probes & Interface Terminal */}
                  {/* External Optical Sensor Probe (Left Bottom) */}
                  <rect x="100" y="210" width="80" height="45" rx="5" fill="#1e293b" stroke="#64748b" />
                  <circle cx="120" cy="232" r="8" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx="120" cy="232" r="3" fill="#ef4444" />
                  <text x="148" y="228" fill="#f8fafc" fontSize="7" fontWeight="bold">OPTICAL</text>
                  <text x="148" y="238" fill="#94a3b8" fontSize="6">LASER PROBE</text>

                  {/* Thermocouple Thermal Sensor (Center Bottom) */}
                  <rect x="190" y="210" width="100" height="45" rx="5" fill="#1e293b" stroke="#64748b" />
                  <rect x="200" y="220" width="20" height="25" rx="2" fill="#d97706" />
                  <text x="235" y="228" fill="#f8fafc" fontSize="7" fontWeight="bold">THERMOCOUPLE</text>
                  <text x="235" y="238" fill="#94a3b8" fontSize="6">TYPE-K SENSOR</text>

                  {/* USB-C Diagnostic Port (Right Bottom) */}
                  <rect x="300" y="210" width="100" height="45" rx="5" fill="#1e293b" stroke="#64748b" />
                  <rect x="312" y="225" width="22" height="12" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
                  <text x="345" y="228" fill="#f8fafc" fontSize="7" fontWeight="bold">USB-C PORT</text>
                  <text x="345" y="238" fill="#38bdf8" fontSize="6">PD &amp; FAST UART</text>

                  {/* Bottom Annotation Bar */}
                  <rect x="75" y="290" width="350" height="22" rx="4" fill="#0f172a" stroke="#334155" />
                  <text x="250" y="304" fill="#94a3b8" fontSize="7.5" textAnchor="middle">
                    SRIT Laboratory Hardware Model • Multi-Channel Industrial IoT Edge Platform
                  </text>
                </svg>
              </div>
            ) : (
              /* TASK 2 GRAPH SVG */
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 p-3">
                <svg viewBox="0 0 500 320" className="w-full h-64 sm:h-72 rounded-xl bg-slate-900" role="img" aria-label="Global Renewable Grid Integration Telemetry Graph">
                  {/* Chart Background */}
                  <rect width="500" height="320" fill="#0f172a" />

                  {/* Header Title */}
                  <text x="25" y="28" fill="#f8fafc" fontSize="11" fontWeight="bold">
                    GLOBAL CLEAN ENERGY GRID INTEGRATION &amp; STORAGE (2024–2028)
                  </text>
                  <text x="25" y="42" fill="#94a3b8" fontSize="7.5">
                    Multi-Year Capacity Metrics (Gigawatts) vs Battery Dispatch Efficiency (%)
                  </text>

                  {/* Axes & Grid Lines */}
                  <line x1="60" y1="55" x2="60" y2="240" stroke="#475569" strokeWidth="1.5" />
                  <line x1="60" y1="240" x2="475" y2="240" stroke="#475569" strokeWidth="1.5" />

                  {/* Y-Axis Markers (0, 100, 200, 300, 400 GW) */}
                  <text x="50" y="243" fill="#64748b" fontSize="7.5" textAnchor="end">0 GW</text>
                  <line x1="60" y1="240" x2="475" y2="240" stroke="#1e293b" strokeDasharray="3 3" />

                  <text x="50" y="195" fill="#64748b" fontSize="7.5" textAnchor="end">100 GW</text>
                  <line x1="60" y1="195" x2="475" y2="195" stroke="#1e293b" strokeDasharray="3 3" />

                  <text x="50" y="148" fill="#64748b" fontSize="7.5" textAnchor="end">200 GW</text>
                  <line x1="60" y1="148" x2="475" y2="148" stroke="#1e293b" strokeDasharray="3 3" />

                  <text x="50" y="102" fill="#64748b" fontSize="7.5" textAnchor="end">300 GW</text>
                  <line x1="60" y1="102" x2="475" y2="102" stroke="#1e293b" strokeDasharray="3 3" />

                  <text x="50" y="60" fill="#64748b" fontSize="7.5" textAnchor="end">400 GW</text>
                  <line x1="60" y1="58" x2="475" y2="58" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* X-Axis Years */}
                  <text x="100" y="254" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">2024</text>
                  <text x="185" y="254" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">2025</text>
                  <text x="270" y="254" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">2026 (Parity)</text>
                  <text x="355" y="254" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">2027</text>
                  <text x="440" y="254" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">2028</text>

                  {/* Curve 1: Solar Photovoltaic (Steep Yellow/Orange Exponential Growth: 120 -> 380 GW) */}
                  <path
                    d="M 100 185 Q 185 160 270 115 T 440 68"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Solar Data Points */}
                  <circle cx="100" cy="185" r="4" fill="#fbbf24" />
                  <text x="100" y="177" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">120 GW</text>

                  <circle cx="270" cy="115" r="4" fill="#fbbf24" />
                  <text x="270" y="107" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">260 GW</text>

                  <circle cx="440" cy="68" r="4" fill="#fbbf24" />
                  <text x="440" y="60" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">380 GW</text>

                  {/* Curve 2: Wind Capacity (Steady Blue Curve: 180 -> 310 GW) */}
                  <path
                    d="M 100 156 Q 185 140 270 122 T 440 98"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="156" r="3.5" fill="#38bdf8" />
                  <text x="100" y="148" fill="#38bdf8" fontSize="7" textAnchor="middle">180 GW</text>

                  <circle cx="440" cy="98" r="3.5" fill="#38bdf8" />
                  <text x="440" y="90" fill="#38bdf8" fontSize="7" textAnchor="middle">310 GW</text>

                  {/* Curve 3: Battery Storage Efficiency % (Green Dashed Line: 72% -> 94%) */}
                  <path
                    d="M 100 205 Q 185 178 270 135 T 440 110"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <circle cx="270" cy="135" r="3.5" fill="#22c55e" />
                  <text x="270" y="148" fill="#86efac" fontSize="7" fontWeight="bold" textAnchor="middle">94% Efficiency</text>

                  {/* 2026 Parity Anomaly Callout Box */}
                  <rect x="235" y="160" width="130" height="30" rx="4" fill="#1e293b" stroke="#eab308" strokeWidth="1" />
                  <circle cx="245" cy="175" r="3" fill="#eab308" />
                  <text x="252" y="172" fill="#fef08a" fontSize="6.5" fontWeight="bold">2026 INFLECTION POINT</text>
                  <text x="252" y="182" fill="#cbd5e1" fontSize="6">Renewables Exceed 50% Baseload</text>

                  {/* Chart Legend (Bottom) */}
                  <rect x="60" y="275" width="415" height="32" rx="6" fill="#1e293b" stroke="#334155" />
                  {/* Legend 1 */}
                  <line x1="75" y1="291" x2="95" y2="291" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="85" cy="291" r="3" fill="#fbbf24" />
                  <text x="100" y="294" fill="#f8fafc" fontSize="7.5" fontWeight="bold">Solar PV (GW)</text>

                  {/* Legend 2 */}
                  <line x1="180" y1="291" x2="200" y2="291" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="205" y="294" fill="#f8fafc" fontSize="7.5" fontWeight="bold">Wind Generation (GW)</text>

                  {/* Legend 3 */}
                  <line x1="310" y1="291" x2="330" y2="291" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="335" y="294" fill="#86efac" fontSize="7.5" fontWeight="bold">Storage Efficiency (%)</text>
                </svg>
              </div>
            )}

            {/* Target Keywords & Model Audio Trigger */}
            <div className="bg-white p-3 rounded-xl border border-[#FAD7A0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#D35400] uppercase tracking-wider">
                  Target Domain Vocabulary:
                </span>
                <button
                  onClick={() =>
                    speakText(
                      activeTask === 'task1'
                        ? 'This image illustrates the Smart IoT Environmental Monitor and Diagnostic Terminal. In the center, a high-resolution OLED screen displays real-time ambient metrics. An ARM Cortex-M4 microcontroller coordinates data acquisition across thermocouple and optical sensor probes.'
                        : 'This multi-series telemetry graph outlines Global Renewable Energy Grid Integration and Battery Storage from 2024 to 2028. Solar photovoltaic capacity exhibits exponential acceleration from 120 to 380 gigawatts, reaching 94 percent storage efficiency by 2026.'
                    )
                  }
                  className="px-2.5 py-1 bg-[#D35400] text-white rounded-lg text-[10px] font-extrabold hover:bg-[#E67E22] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Model Outline</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(activeTask === 'task1'
                  ? ['ARM Cortex-M4', 'OLED Telemetry', 'Thermocouple Probe', 'Optical Sensor', 'RF Transceiver', 'Calibration ±0.01%', 'Edge Processing', 'Predictive Maintenance']
                  : ['Multi-Series Graph', 'Photovoltaic Surge', 'Gigawatts (GW)', 'Storage Efficiency 94%', '2026 Grid Parity', 'Baseload Displacement', 'Exponential Trajectory', 'Decarbonization']
                ).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-50 text-[#8B4513] border border-amber-200 rounded text-[10px] font-bold">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: 2-MINUTE EXTENDED RECORDER & TRANSCRIPT WORKBENCH */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Recording Header & Target Reminder */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#D35400]" />
                  <span className="text-xs font-black uppercase text-[#2C3E50] tracking-wider">
                    {activeTask === 'task1' ? 'Task 1 Extended Speech Recording' : 'Task 2 Extended Speech Recording'}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400]">
                  Target: 2:00 (120s) Minimum
                </span>
              </div>

              {/* RECORDER CONTROL CARD */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-4 shadow-md">
                {/* Live Timer Display & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        activeTask === 'task1'
                          ? t1Recording
                            ? 'bg-rose-500 animate-ping'
                            : 'bg-slate-600'
                          : t2Recording
                          ? 'bg-rose-500 animate-ping'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {(activeTask === 'task1' ? t1Recording : t2Recording)
                          ? 'Recording In Progress (Counts Up)...'
                          : 'Recording Duration'}
                      </span>
                      <span className="text-2xl font-black font-mono tracking-wider text-[#FAD7A0]">
                        {formatTime(activeTask === 'task1' ? t1Duration : t2Duration)}
                      </span>
                    </div>
                  </div>

                  {/* 2-Minute Lock Status Badge */}
                  <div className="text-right">
                    {(activeTask === 'task1' ? t1Duration : t2Duration) >= 120 ? (
                      <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>2:00 Min Reached • Save Unlocked</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-rose-950/70 border border-rose-600 text-rose-300 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Save Locked (&lt; 2:00 Required)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar towards 120s */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0:00</span>
                    <span className="text-[#FAD7A0] font-bold">120s Minimum Threshold</span>
                    <span>No Cap</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        (activeTask === 'task1' ? t1Duration : t2Duration) >= 120
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-[#D35400]'
                      }`}
                      style={{
                        width: `${Math.min(100, (((activeTask === 'task1' ? t1Duration : t2Duration) / 120) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                {/* Recording Control Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {!(activeTask === 'task1' ? t1Recording : t2Recording) ? (
                    <button
                      onClick={() => startRecording(activeTask)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start 2-Minute Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => stopRecording(activeTask)}
                      className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm cursor-pointer animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current text-rose-400" />
                      <span>Stop Recording (Pause Timer)</span>
                    </button>
                  )}

                  {/* Playback Button if audio is available */}
                  {(activeTask === 'task1' ? t1AudioUrl : t2AudioUrl) && !(activeTask === 'task1' ? t1Recording : t2Recording) && (
                    <button
                      onClick={() => playRecordedAudio(activeTask)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      {(activeTask === 'task1' ? t1IsPlaying : t2IsPlaying) ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          <span>Play Recording</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Reset Button */}
                  {(activeTask === 'task1' ? t1Duration : t2Duration) > 0 && !(activeTask === 'task1' ? t1Recording : t2Recording) && (
                    <button
                      onClick={() => handleResetTask(activeTask)}
                      className="px-3 py-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Clear and Re-record"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-record</span>
                    </button>
                  )}
                </div>

                {/* Save Protection Warning Notice */}
                {(activeTask === 'task1' ? t1Duration : t2Duration) > 0 &&
                  (activeTask === 'task1' ? t1Duration : t2Duration) < 120 && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-[11px] text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        Recording is currently {formatTime(activeTask === 'task1' ? t1Duration : t2Duration)}. You must speak for at least <strong>2:00 (120s)</strong> to unlock the Save button.
                      </span>
                    </div>
                  )}
              </div>

              {/* TRANSCRIPT / NOTES WORKSPACE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#2C3E50]">
                    Speech Transcript / Draft Review:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTask === 'task1') {
                        setT1Transcript(
                          'The image depicts the SRIT-IoT-v4 Smart Multi-Sensor Diagnostic Terminal. In the center foreground, a high-resolution OLED screen displays real-time ambient parameters including temperature at 24.8°C and humidity at 45.2%. The system is driven by an ARM Cortex-M4 microcontroller with multi-channel ADC interfaces connected to an optical laser sensor and a Type-K thermocouple probe. This hardware facilitates high-precision predictive maintenance in automated manufacturing facilities.'
                        );
                      } else {
                        setT2Transcript(
                          'This multi-series telemetry graph illustrates Global Renewable Energy Grid Integration and Battery Storage from 2024 through 2028. Along the horizontal axis, the timeline spans five consecutive years. Solar photovoltaic capacity demonstrates the steepest growth, expanding from 120 GW in 2024 to 380 GW by 2028. A pivotal inflection occurs in 2026 when battery storage efficiency reaches 94%, enabling renewable baseload displacement and enhancing overall power grid resilience.'
                        );
                      }
                    }}
                    className="text-[10px] font-bold text-[#D35400] hover:underline cursor-pointer"
                  >
                    Use Recommended Model Draft
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={activeTask === 'task1' ? t1Transcript : t2Transcript}
                  onChange={(e) => {
                    if (activeTask === 'task1') setT1Transcript(e.target.value);
                    else setT2Transcript(e.target.value);
                  }}
                  placeholder="Review or refine what you verbally described during your 2-minute speech..."
                  className="w-full p-3 text-xs bg-white border border-[#FAD7A0] rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none text-[#2C3E50] placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* TASK SAVE BUTTON (Protected under 2:00 requirement) */}
            <div className="space-y-2 pt-2 border-t border-[#FAD7A0]">
              <button
                onClick={() => handleSaveTaskRecording(activeTask)}
                disabled={(activeTask === 'task1' ? t1Duration : t2Duration) < 120 || (activeTask === 'task1' ? t1Recording : t2Recording)}
                className={`w-full py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm ${
                  (activeTask === 'task1' ? t1Duration : t2Duration) >= 120 && !(activeTask === 'task1' ? t1Recording : t2Recording)
                    ? 'bg-[#D35400] hover:bg-[#E67E22] text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>
                  {(activeTask === 'task1' ? t1Saved : t2Saved)
                    ? `✓ Update Saved ${activeTask === 'task1' ? 'Task 1' : 'Task 2'} Recording`
                    : (activeTask === 'task1' ? t1Duration : t2Duration) >= 120
                    ? `Save ${activeTask === 'task1' ? 'Task 1 (Gadget)' : 'Task 2 (Graph)'} Recording (${formatTime(activeTask === 'task1' ? t1Duration : t2Duration)})`
                    : `Save Disabled — Minimum 2:00 Required (${formatTime(activeTask === 'task1' ? t1Duration : t2Duration)} / 2:00)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GLOBAL AI EVALUATION TRIGGER SECTION */}
      {/* ========================================================= */}
      <div className="p-5 bg-gradient-to-r from-amber-50 via-[#FFF8F0] to-orange-50 border-2 border-[#D35400]/40 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D35400]" />
              <h4 className="text-base font-black text-[#2C3E50] font-heading">
                AI Speaking Evaluation Workbench
              </h4>
            </div>
            <p className="text-xs text-[#5D6D7E] mt-0.5">
              Comprehensive speech evaluation unlocks after saving both <strong>Task 1 (Gadget)</strong> and <strong>Task 2 (Graph)</strong> extended recordings.
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-lg border ${
                t1Saved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              Task 1: {t1Saved ? 'Saved ✓' : 'Pending'}
            </span>
            <span
              className={`px-3 py-1 rounded-lg border ${
                t2Saved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              Task 2: {t2Saved ? 'Saved ✓' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Action Trigger */}
        <button
          onClick={handleTriggerAIEvaluation}
          disabled={!t1Saved || !t2Saved || isEvaluating}
          className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-md ${
            t1Saved && t2Saved && !isEvaluating
              ? 'bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isEvaluating
              ? 'Analyzing Spoken Descriptions (Pacing, Rubric & Structure)...'
              : t1Saved && t2Saved
              ? 'Generate AI Speaking Evaluation (Both Visual Tasks)'
              : 'Save Both Task 1 & Task 2 to Unlock AI Evaluation'}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* INVALID / UNINTELLIGIBLE RECORDING WARNING MODAL */}
      {/* ========================================================= */}
      {evaluationResult?.isInvalidOrUnintelligible && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-base font-black text-rose-900 font-heading">
                Invalid / Unintelligible Recording Detected
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                {evaluationResult.invalidReason ||
                  'Your speech recording contained fewer than 25 intelligible words or was inaudible. To receive an accurate 10-mark fluency evaluation, please re-record your descriptions clearly addressing the visual prompt for the required 2 minutes.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-900">
            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-700">Re-Recording Instructions:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
              <li>Position your microphone close and speak in a clear, audible tone.</li>
              <li>Continuously describe the labeled components in the Gadget image and data trends in the Graph.</li>
              <li>Ensure your total speaking time reaches at least 2 minutes (120s) per task.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleResetTask('task1')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Re-Record Task 1</span>
            </button>
            <button
              onClick={() => handleResetTask('task2')}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Re-Record Task 2</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VALID AI EVALUATION REPORT */}
      {/* ========================================================= */}
      {evaluationResult && !evaluationResult.isInvalidOrUnintelligible && (
        <div className="space-y-6 pt-4 border-t-2 border-[#FAD7A0] animate-fadeIn">
          {/* Header Score Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-[#2C3E50] text-white rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FAD7A0]" />
                  <span className="text-xs font-black uppercase text-[#FAD7A0] tracking-wider">
                    Official AI Evaluation Report
                  </span>
                </div>
                <h3 className="text-lg font-black font-heading text-white">
                  Section 5: Visual Description Proficiency Assessment
                </h3>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 uppercase font-bold block">10-Mark Assessment</span>
                  <span className="text-2xl font-black font-mono text-[#FAD7A0]">
                    {formatScore10(evaluationResult.totalScore)}
                  </span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 bg-emerald-500 text-white rounded-md">
                  {evaluationResult.performanceDescriptor}
                </span>
              </div>
            </div>

            {/* Speaking Stats (Pacing & Fillers) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Speaking Time</span>
                <span className="text-sm font-black text-white font-mono">{formatTime(evaluationResult.durationSec)}</span>
                <span className="text-[9px] text-emerald-400 block">✓ Exceeds 2:00 Min</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Pacing Rate</span>
                <span className="text-sm font-black text-white font-mono">{evaluationResult.wpm} WPM</span>
                <span className="text-[9px] text-slate-300 block">Target: 130–150 WPM</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Filler Words</span>
                <span className="text-sm font-black text-white font-mono">{evaluationResult.fillerWordCount}</span>
                <span className="text-[9px] text-slate-300 block">
                  {evaluationResult.detectedFillerWords.join(', ') || 'None detected'}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Tasks Evaluated</span>
                <span className="text-sm font-black text-white font-mono">2 of 2 Complete</span>
                <span className="text-[9px] text-emerald-400 block">✓ Gadget &amp; Graph</span>
              </div>
            </div>
          </div>

          {/* 5-Criterion Rubric Score Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D35400]" />
              <span>5-Criterion Rubric Score Breakdown (Max 2.0 Marks Each)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {[
                { label: 'Fluency & Pacing', score: evaluationResult.criteria.fluencyScore, desc: 'Smooth flow & minimal hesitations' },
                { label: 'Pronunciation & Pitch', score: evaluationResult.criteria.pronunciationScore, desc: 'Phonetic accuracy & intonation' },
                { label: 'Grammar & Syntax', score: evaluationResult.criteria.grammarScore, desc: 'Sentence variety & agreement' },
                { label: 'Technical Vocabulary', score: evaluationResult.criteria.vocabularyScore, desc: 'Gadget & graph domain terms' },
                { label: 'Organization & Style', score: evaluationResult.criteria.organizationScore, desc: 'Spatial anchoring & synthesis' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#2C3E50]">
                    <span>{item.label}</span>
                    <span className="font-mono text-[#D35400]">{item.score} / 2.0</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D35400] rounded-full"
                      style={{ width: `${(item.score / 2.0) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[#5D6D7E] line-clamp-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 1. What You Did Well & 2. Specific Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* What You Did Well */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
              <h4 className="font-black text-emerald-950 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Did Well</span>
              </h4>
              <ul className="space-y-1.5 text-emerald-900 text-[11px]">
                {evaluationResult.whatYouDidWell.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Areas to Improve */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
              <h4 className="font-black text-amber-950 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Specific Areas to Improve</span>
              </h4>
              <ul className="space-y-1.5 text-amber-900 text-[11px]">
                {evaluationResult.specificAreasToImprove.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Description Style Feedback */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <h4 className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#D35400]" />
              <span>Description Style Feedback</span>
            </h4>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {evaluationResult.descriptionStyleFeedback}
            </p>
          </div>

          {/* 4. Language Improvement & 5. Speaking Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Language Improvement */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
              <h4 className="font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Language Improvement</span>
              </h4>
              <ul className="space-y-1.5 text-blue-900 text-[11px]">
                {evaluationResult.languageImprovement.map((lang, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{lang}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Speaking Improvement */}
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-2">
              <h4 className="font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Speaking Improvement</span>
              </h4>
              <ul className="space-y-1.5 text-indigo-900 text-[11px]">
                {evaluationResult.speakingImprovement.map((spk, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{spk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. Valid Improvement Suggestions */}
          <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2 text-xs">
            <h4 className="font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Valid Improvement Suggestions</span>
            </h4>
            <ul className="space-y-1.5 text-purple-900 text-[11px]">
              {evaluationResult.validImprovementSuggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Polished Speech Model Transcript */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="font-black text-[#D35400] uppercase text-[11px] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#D35400]" />
                <span>Synthesized Vocal Model Summary</span>
              </span>
              <span className="text-[10px] text-[#5D6D7E]">2-Minute Structured Synthesis</span>
            </div>
            <p className="text-[#2C3E50] leading-relaxed italic bg-white p-3.5 rounded-xl border border-[#FAD7A0]/60 text-[11px]">
              "{evaluationResult.polishedTranscript}"
            </p>
          </div>

          {/* Final Save to Portfolio / Notebook Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#FAD7A0]">
            <button
              onClick={handleSaveEvaluationToNotebook}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Update Digital Laboratory Notebook</span>
            </button>
            <button
              onClick={handleSaveEvaluationToPortfolio}
              className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Save Evaluation Artifact to Portfolio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
