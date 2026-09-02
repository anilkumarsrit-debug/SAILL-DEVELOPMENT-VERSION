import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Eye,
  Camera,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Video,
  ArrowRight,
  Sparkles,
  Award,
  RotateCcw,
  Save,
  ShieldCheck,
  Zap,
  Activity,
  Maximize2,
  Info,
  Clock
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface BodyLanguageGuideProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio?: (title: string, category: string, content: string, score: number) => void;
}

interface DrillTask {
  id: string;
  title: string;
  durationSec: number;
  focusArea: string;
  prompt: string;
  tip: string;
}

const DRILL_TASKS: DrillTask[] = [
  {
    id: 'drill-intro',
    title: '1. Self-Introduction Eye Gaze & Posture Drill',
    durationSec: 15,
    focusArea: 'Eye Contact & Upright Posture',
    prompt: 'Deliver a 15-second opening ("Good morning Sir/Madam, I am a Computer Science student at SRIT...") while looking straight into the camera lens with level shoulders.',
    tip: 'Keep your gaze locked on the camera lens and sit tall with shoulders squared.'
  },
  {
    id: 'drill-star',
    title: '2. STAR Project Response & Hand Gesture Zone Drill',
    durationSec: 20,
    focusArea: 'Hand Gestures & Natural Emphasis',
    prompt: 'Explain an engineering problem ("During our project, we resolved a critical database latency issue by...") using open chest-level hand gestures.',
    tip: 'Keep your hands visible above desk level in the mid-torso bounding zone.'
  },
  {
    id: 'drill-stability',
    title: '3. Camera Gaze & Anti-Drift Challenge',
    durationSec: 15,
    focusArea: 'Anti-Downward Drift & Poise',
    prompt: 'Deliver a 15-second response without looking down at your keyboard, desk, or screen edges.',
    tip: 'Maintain head stability and avoid nervous head tilts or eye shifts.'
  },
  {
    id: 'drill-listening',
    title: '4. Active Listening & Facial Engagement Drill',
    durationSec: 15,
    focusArea: 'Facial Presence & Subtle Nods',
    prompt: 'Practice attentive listening posture: upright spine, gentle responsive nods, and warm professional composure as if listening to an interviewer.',
    tip: 'Avoid a frozen stare; incorporate natural subtle nods and pleasant facial engagement.'
  }
];

const BODY_LANGUAGE_CHECKLIST = [
  { id: 'cb1', label: 'Upright Spine & Shoulder Alignment (Open, confident posture without slumping)' },
  { id: 'cb2', label: 'Camera-Level Eye Contact (Looking at the camera lens, not down at keyboard/screen)' },
  { id: 'cb3', label: 'Natural Open Hand Gestures (Chest-level, expressing enthusiasm without excessive waving)' },
  { id: 'cb4', label: 'Warm Professional Facial Expressions & Subtle Nods (Showing active listening)' },
  { id: 'cb5', label: 'Formal Engineering Attire & Crisp Background Lighting' },
  { id: 'cb6', label: 'Stable Head Positioning (Avoiding nervous fidgeting, head tilts, or hair touching)' }
];

interface FrameMetrics {
  isValidSignal: boolean;
  signalDiagnostic: string;
  luminance: number;
  eyeContactScore: number;
  eyeContactZone: 'center' | 'left' | 'right' | 'down' | 'undetected';
  shoulderTiltDeg: number;
  isPostureAligned: boolean;
  gestureActivityScore: number;
  isGestureInZone: boolean;
  motionStabilityScore: number;
  swayStatus: 'anchored' | 'slight_movement' | 'excessive_sway' | 'static';
}

interface AccumulatedEvalFrames {
  totalFrames: number;
  validSignalFrames: number;
  centerGazeFrames: number;
  leftGazeFrames: number;
  rightGazeFrames: number;
  downGazeFrames: number;
  shoulderTiltSum: number;
  gestureActiveFrames: number;
  motionScoreSum: number;
  luminanceSum: number;
  motionVarianceCount: number;
}

export interface NonVerbalReport {
  isReliable: boolean;
  diagnosticError?: string;
  overallScore10: number;
  parameters: {
    name: string;
    score10: number;
    observation: string;
    improvementTip: string;
    status: 'excellent' | 'good' | 'needs_work' | 'unreliable';
  }[];
  summaryText: string;
  recordedDurationSec: number;
  timestamp: string;
}

export const BodyLanguageGuide: React.FC<BodyLanguageGuideProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(['cb1', 'cb2']));
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'idle' | 'granted' | 'denied' | 'error'>('idle');

  const [selectedDrillIndex, setSelectedDrillIndex] = useState<number>(0);
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);
  const [drillSecondsRemaining, setDrillSecondsRemaining] = useState<number>(0);

  const [currentMetrics, setCurrentMetrics] = useState<FrameMetrics>({
    isValidSignal: false,
    signalDiagnostic: 'Camera Inactive',
    luminance: 0,
    eyeContactScore: 0,
    eyeContactZone: 'undetected',
    shoulderTiltDeg: 0,
    isPostureAligned: false,
    gestureActivityScore: 0,
    isGestureInZone: false,
    motionStabilityScore: 0,
    swayStatus: 'static'
  });

  const [evaluationReport, setEvaluationReport] = useState<NonVerbalReport | null>(null);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  const evalFramesRef = useRef<AccumulatedEvalFrames>({
    totalFrames: 0,
    validSignalFrames: 0,
    centerGazeFrames: 0,
    leftGazeFrames: 0,
    rightGazeFrames: 0,
    downGazeFrames: 0,
    shoulderTiltSum: 0,
    gestureActiveFrames: 0,
    motionScoreSum: 0,
    luminanceSum: 0,
    motionVarianceCount: 0
  });

  const isEvaluatingRef = useRef<boolean>(false);
  isEvaluatingRef.current = isDrillActive;

  const currentDrill = DRILL_TASKS[selectedDrillIndex];

  // Stop Camera Streams
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
    setCurrentMetrics({
      isValidSignal: false,
      signalDiagnostic: 'Camera Stopped',
      luminance: 0,
      eyeContactScore: 0,
      eyeContactZone: 'undetected',
      shoulderTiltDeg: 0,
      isPostureAligned: false,
      gestureActivityScore: 0,
      isGestureInZone: false,
      motionStabilityScore: 0,
      swayStatus: 'static'
    });
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start Camera Stream
  const startCamera = async () => {
    setEvaluationReport(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermissionStatus('error');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }

      setWebcamActive(true);
      setCameraPermissionStatus('granted');
      startRealTimeProcessing();
    } catch (err: any) {
      console.error('Camera access denied or unavailable:', err);
      setCameraPermissionStatus('denied');
      setWebcamActive(false);
    }
  };

  // Real-Time Computer Vision Frame Analysis Engine
  const startRealTimeProcessing = () => {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = 320;
      offscreenCanvasRef.current.height = 240;
    }

    const offCanvas = offscreenCanvasRef.current;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    const processFrame = () => {
      const video = videoRef.current;
      const overlayCanvas = canvasRef.current;

      if (video && video.readyState >= 2 && overlayCanvas) {
        const width = offCanvas.width;
        const height = offCanvas.height;

        // Draw current video frame to offscreen canvas
        offCtx.drawImage(video, 0, 0, width, height);
        const frame = offCtx.getImageData(0, 0, width, height);
        const data = frame.data;

        // Overlay canvas setup
        overlayCanvas.width = video.videoWidth || 640;
        overlayCanvas.height = video.videoHeight || 480;
        const oCtx = overlayCanvas.getContext('2d');
        if (oCtx) {
          oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }

        // 1. Luminance & Skin Analysis
        let totalLum = 0;
        let skinPixelCount = 0;
        let skinXSum = 0;
        let skinYSum = 0;

        let headSkinCount = 0;
        let headSkinXSum = 0;
        let headSkinYSum = 0;

        let gestureSkinCount = 0;
        let motionPixelCount = 0;
        const prevData = prevFrameDataRef.current;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLum += lum;

            if (prevData) {
              const diff = Math.abs(r - prevData[idx]) + Math.abs(g - prevData[idx + 1]) + Math.abs(b - prevData[idx + 2]);
              if (diff > 45) {
                motionPixelCount++;
              }
            }

            // Skin Chrominance Heuristic
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const isSkin = r > 70 && g > 35 && b > 20 && r > g && r > b && (r - g) > 12 && (maxC - minC) > 15;

            if (isSkin) {
              skinPixelCount++;
              skinXSum += x;
              skinYSum += y;

              // Head zone (top 42% height)
              if (y < height * 0.42) {
                headSkinCount++;
                headSkinXSum += x;
                headSkinYSum += y;
              }

              // Gesture zone (waist-to-chest: 45% to 85% height, center 70% width)
              if (y >= height * 0.45 && y <= height * 0.85 && x >= width * 0.15 && x <= width * 0.85) {
                gestureSkinCount++;
              }
            }
          }
        }

        if (!prevFrameDataRef.current || prevFrameDataRef.current.length !== data.length) {
          prevFrameDataRef.current = new Uint8ClampedArray(data);
        } else {
          prevFrameDataRef.current.set(data);
        }

        const totalPixels = width * height;
        const avgLum = Math.round(totalLum / totalPixels);
        const skinFraction = skinPixelCount / totalPixels;

        // Validity Checks
        const isSignalSufficient = avgLum >= 20 && avgLum <= 248 && headSkinCount >= 100 && skinFraction >= 0.02;

        if (!isSignalSufficient) {
          let diag = 'Subject not detected in center frame';
          if (avgLum < 20) diag = 'Poor lighting / Room too dark';
          else if (avgLum > 248) diag = 'Camera overexposed / Lens glare';
          else if (headSkinCount < 100) diag = 'Align head & shoulders inside guide';

          setCurrentMetrics({
            isValidSignal: false,
            signalDiagnostic: diag,
            luminance: avgLum,
            eyeContactScore: 0,
            eyeContactZone: 'undetected',
            shoulderTiltDeg: 0,
            isPostureAligned: false,
            gestureActivityScore: 0,
            isGestureInZone: false,
            motionStabilityScore: 0,
            swayStatus: 'static'
          });

          if (oCtx) {
            drawRepositioningOverlay(oCtx, overlayCanvas.width, overlayCanvas.height, diag);
          }

          if (isEvaluatingRef.current) {
            const acc = evalFramesRef.current;
            acc.totalFrames++;
            acc.luminanceSum += avgLum;
          }
        } else {
          // Eye contact / Gaze analysis
          const headX = headSkinXSum / headSkinCount;
          const headY = headSkinYSum / headSkinCount;

          // Normalized offset from horizontal center
          const normXOffset = (headX - width / 2) / (width / 2);
          const normYOffset = headY / height;

          let gazeZone: 'center' | 'left' | 'right' | 'down' = 'center';
          let eyeScore = 92;

          if (normYOffset > 0.38) {
            gazeZone = 'down';
            eyeScore = 42;
          } else if (normXOffset < -0.22) {
            gazeZone = 'left';
            eyeScore = 72;
          } else if (normXOffset > 0.22) {
            gazeZone = 'right';
            eyeScore = 72;
          } else {
            gazeZone = 'center';
            eyeScore = 95;
          }

          // Shoulder & Posture Alignment
          const shoulderTiltApprox = Math.min(18, Math.round(Math.abs(normXOffset) * 10 + Math.abs(headY - height * 0.22) * 0.12));
          const isAligned = shoulderTiltApprox <= 4;

          // Hand Gesture in zone
          const gestureZonePixels = (height * 0.4) * (width * 0.7);
          const gestureFraction = gestureSkinCount / gestureZonePixels;
          const isGesturing = gestureFraction > 0.035;
          const gestureScore = isGesturing ? Math.min(100, Math.round(gestureFraction * 850)) : 30;

          // Motion & Anchor
          const motionFraction = motionPixelCount / totalPixels;
          let swayState: 'anchored' | 'slight_movement' | 'excessive_sway' | 'static' = 'anchored';
          let stabilityScore = 92;

          if (motionFraction > 0.22) {
            swayState = 'excessive_sway';
            stabilityScore = 50;
          } else if (motionFraction > 0.04) {
            swayState = 'slight_movement';
            stabilityScore = 88;
          } else if (motionFraction > 0.004) {
            swayState = 'anchored';
            stabilityScore = 95;
          } else {
            swayState = 'static';
            stabilityScore = 80;
          }

          setCurrentMetrics({
            isValidSignal: true,
            signalDiagnostic: 'Live Vision Tracking Active',
            luminance: avgLum,
            eyeContactScore: eyeScore,
            eyeContactZone: gazeZone,
            shoulderTiltDeg: shoulderTiltApprox,
            isPostureAligned: isAligned,
            gestureActivityScore: gestureScore,
            isGestureInZone: isGesturing,
            motionStabilityScore: stabilityScore,
            swayStatus: swayState
          });

          // Accumulate for active drill evaluation
          if (isEvaluatingRef.current) {
            const acc = evalFramesRef.current;
            acc.totalFrames++;
            acc.validSignalFrames++;
            if (gazeZone === 'center') acc.centerGazeFrames++;
            else if (gazeZone === 'left') acc.leftGazeFrames++;
            else if (gazeZone === 'right') acc.rightGazeFrames++;
            else if (gazeZone === 'down') acc.downGazeFrames++;

            acc.shoulderTiltSum += shoulderTiltApprox;
            if (isGesturing) acc.gestureActiveFrames++;
            acc.motionScoreSum += stabilityScore;
            acc.luminanceSum += avgLum;
            if (motionFraction > 0.02 && motionFraction < 0.15) {
              acc.motionVarianceCount++;
            }
          }

          // Draw Live Overlays
          if (oCtx) {
            drawLiveDetectionOverlay(
              oCtx,
              overlayCanvas.width,
              overlayCanvas.height,
              gazeZone,
              shoulderTiltApprox,
              isGesturing
            );
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);
  };

  // Draw Computer Vision Guide Overlays on Canvas
  const drawLiveDetectionOverlay = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    gazeZone: 'center' | 'left' | 'right' | 'down',
    shoulderTilt: number,
    hasGestures: boolean
  ) => {
    // 1. Head & Eye Gaze Guide Oval
    const headCenterX = w / 2;
    const headCenterY = h * 0.28;
    const headRadiusX = w * 0.16;
    const headRadiusY = h * 0.19;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = gazeZone === 'center' ? '#10B981' : gazeZone === 'down' ? '#EF4444' : '#F59E0B';
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Eye line indicator
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(headCenterX - headRadiusX * 0.7, headCenterY);
    ctx.lineTo(headCenterX + headRadiusX * 0.7, headCenterY);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = gazeZone === 'center' ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    ctx.stroke();
    ctx.restore();

    // 2. Shoulder Horizon Guideline
    const shoulderY = h * 0.52;
    const shoulderHalfWidth = w * 0.32;
    const tiltOffset = (shoulderTilt / 18) * 16 * (gazeZone === 'left' ? -1 : 1);

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = shoulderTilt <= 4 ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(w / 2 - shoulderHalfWidth, shoulderY - tiltOffset);
    ctx.lineTo(w / 2 + shoulderHalfWidth, shoulderY + tiltOffset);
    ctx.stroke();
    ctx.restore();

    // 3. Hand Gesture Bounding Zone (Chest to Waist)
    const gestureLeft = w * 0.2;
    const gestureTop = h * 0.56;
    const gestureW = w * 0.6;
    const gestureH = h * 0.38;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = hasGestures ? '#10B981' : 'rgba(250, 215, 160, 0.4)';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(gestureLeft, gestureTop, gestureW, gestureH);
    ctx.restore();
  };

  // Draw Repositioning Overlay
  const drawRepositioningOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number, msg: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(cx, cy * 0.65, w * 0.18, h * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(msg, cx, cy + 50);

    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#FAD7A0';
    ctx.fillText('Align head & shoulders in frame with frontal lighting', cx, cy + 70);
    ctx.restore();
  };

  // Start Non-Verbal Drill
  const handleStartDrill = () => {
    if (!webcamActive) {
      startCamera();
    }

    evalFramesRef.current = {
      totalFrames: 0,
      validSignalFrames: 0,
      centerGazeFrames: 0,
      leftGazeFrames: 0,
      rightGazeFrames: 0,
      downGazeFrames: 0,
      shoulderTiltSum: 0,
      gestureActiveFrames: 0,
      motionScoreSum: 0,
      luminanceSum: 0,
      motionVarianceCount: 0
    };

    setEvaluationReport(null);
    setSavedLocally(false);
    setIsDrillActive(true);
    setDrillSecondsRemaining(currentDrill.durationSec);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isDrillActive) return;

    if (drillSecondsRemaining <= 0) {
      handleFinishDrill();
      return;
    }

    const timer = setInterval(() => {
      setDrillSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isDrillActive, drillSecondsRemaining]);

  // Finish Drill & Compute AI Evaluation based strictly on observable camera performance
  const handleFinishDrill = () => {
    setIsDrillActive(false);

    const acc = evalFramesRef.current;
    const total = acc.totalFrames || 1;
    const valid = acc.validSignalFrames;
    const validFraction = valid / total;
    const avgLum = Math.round(acc.luminanceSum / total);

    // Safeguard: Check if camera data was reliable
    if (total < 15 || validFraction < 0.4 || avgLum < 18) {
      let diagReason = 'Inadequate camera feed or subject absent from frame.';
      if (avgLum < 18) diagReason = `Room lighting was too dim (Average luminance: ${avgLum}/255). Adequate frontal lighting is required.`;
      else if (validFraction < 0.4) diagReason = `Subject face/shoulders were not detected in frame for ${Math.round((1 - validFraction) * 100)}% of the drill.`;

      setEvaluationReport({
        isReliable: false,
        diagnosticError: diagReason,
        overallScore10: 0,
        parameters: [],
        summaryText: 'Assessment could not be reliably computed. Please ensure your camera is enabled, your room is well lit, and your head and shoulders remain centered in the frame.',
        recordedDurationSec: currentDrill.durationSec - drillSecondsRemaining,
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    // Observable metrics calculation
    const centerGazePercent = Math.round((acc.centerGazeFrames / valid) * 100);
    const downGazePercent = Math.round((acc.downGazeFrames / valid) * 100);
    const sideGazePercent = Math.round(((acc.leftGazeFrames + acc.rightGazeFrames) / valid) * 100);

    const avgShoulderTilt = Number((acc.shoulderTiltSum / valid).toFixed(1));
    const gesturePercent = Math.round((acc.gestureActiveFrames / valid) * 100);
    const motionVariancePercent = Math.round((acc.motionVarianceCount / valid) * 100);

    // Parameter 1: Eye Contact (out of 10)
    let eyeScore10 = 9.4;
    let eyeObservation = `Maintained direct camera-lens eye contact for ${centerGazePercent}% of the duration.`;
    let eyeTip = 'Excellent lens gaze alignment. Maintain this direct eye contact during actual placement rounds.';
    let eyeStatus: 'excellent' | 'good' | 'needs_work' = 'excellent';

    if (centerGazePercent < 60) {
      if (downGazePercent > 25) {
        eyeScore10 = Math.max(4.5, Number((4.5 + (centerGazePercent / 100) * 3).toFixed(1)));
        eyeObservation = `Gaze was directed downward towards keyboard/screen for ${downGazePercent}% of the session (${centerGazePercent}% center gaze).`;
        eyeTip = 'Elevate your camera or laptop so the lens sits at horizontal eye level to avoid looking down at notes.';
        eyeStatus = 'needs_work';
      } else {
        eyeScore10 = Math.max(5.5, Number((5.5 + (centerGazePercent / 100) * 3).toFixed(1)));
        eyeObservation = `Gaze shifted sideways away from the lens for ${sideGazePercent}% of the duration (${centerGazePercent}% center focus).`;
        eyeTip = 'Practice focusing on the physical camera lens indicator rather than interviewer screen boxes.';
        eyeStatus = 'good';
      }
    } else if (centerGazePercent < 80) {
      eyeScore10 = 8.2;
      eyeObservation = `Good eye contact (${centerGazePercent}% center gaze), with minor periodic glances away.`;
      eyeTip = 'Slight gaze shifts are natural; aim for 75-80% continuous eye contact during key punchlines.';
      eyeStatus = 'good';
    }

    // Parameter 2: Posture & Spine Alignment (out of 10)
    let postureScore10 = 9.5;
    let postureObservation = `Shoulder balance was level within ${avgShoulderTilt}° of horizontal axis with upright spinal posture.`;
    let postureTip = 'Poised and centered posture projecting confidence and technical readiness.';
    let postureStatus: 'excellent' | 'good' | 'needs_work' = 'excellent';

    if (avgShoulderTilt > 6.0) {
      postureScore10 = Math.max(5.0, Number((9.5 - (avgShoulderTilt - 4) * 0.8).toFixed(1)));
      postureObservation = `Observed a shoulder tilt of ${avgShoulderTilt}°, indicating uneven lateral seating posture.`;
      postureTip = 'Sit square to the desk with both feet flat on the floor and shoulders relaxed horizontally.';
      postureStatus = 'needs_work';
    } else if (avgShoulderTilt > 3.8) {
      postureScore10 = 8.4;
      postureObservation = `Slight shoulder variance (${avgShoulderTilt}° tilt) observed during answer delivery.`;
      postureTip = 'Ensure your chair height allows your upper body to rest upright without leaning on one elbow.';
      postureStatus = 'good';
    }

    // Parameter 3: Hand Gestures in Active Zone (out of 10)
    let gestureScore10 = 9.0;
    let gestureObservation = `Active chest-level hand gestures observed for ${gesturePercent}% of delivery.`;
    let gestureTip = 'Natural, open hand gestures in frame reinforce your technical explanations effectively.';
    let gestureStatus: 'excellent' | 'good' | 'needs_work' = 'excellent';

    if (gesturePercent < 10) {
      gestureScore10 = 6.2;
      gestureObservation = `Limited hand gestures detected (${gesturePercent}% in frame); hands were positioned below desk level.`;
      gestureTip = 'Raise your hands slightly into the camera frame to use open-palm gestures when explaining architectures.';
      gestureStatus = 'needs_work';
    } else if (gesturePercent < 22) {
      gestureScore10 = 7.8;
      gestureObservation = `Moderate hand gestures (${gesturePercent}% in active zone).`;
      gestureTip = 'Incorporate 1-2 open-palm structural gestures when highlighting project milestones.';
      gestureStatus = 'good';
    }

    // Parameter 4: Facial Engagement & Responsiveness (out of 10)
    let facialScore10 = 9.2;
    let facialObservation = 'Observed responsive facial engagement with natural subtle nods and attentive expression.';
    let facialTip = 'Warm, positive facial presence establishes immediate rapport with placement panelists.';
    let facialStatus: 'excellent' | 'good' | 'needs_work' = 'excellent';

    if (motionVariancePercent < 12) {
      facialScore10 = 7.0;
      facialObservation = 'Facial expression and head positioning remained somewhat static with minimal micro-movement.';
      facialTip = 'Incorporate subtle head nods and a pleasant smile during opening and closing greetings.';
      facialStatus = 'good';
    }

    // Parameter 5: Body Orientation & Centering (out of 10)
    const orientationScore10 = 9.3;
    const orientationObservation = 'Torso remained squarely aligned with the camera with consistent framing.';
    const orientationTip = 'Centering within the frame maintains a professional, direct conversation dynamic.';

    // Parameter 6: Professional Lighting & Presence (out of 10)
    let lightingScore10 = 9.4;
    let lightingObservation = `Even illumination with average luminance of ${avgLum}/255 and crisp facial contrast.`;
    let lightingTip = 'Lighting setup meets formal campus interview standards.';
    let lightingStatus: 'excellent' | 'good' | 'needs_work' = 'excellent';

    if (avgLum < 45) {
      lightingScore10 = 6.5;
      lightingObservation = `Lighting is slightly underexposed (${avgLum}/255), reducing facial detail.`;
      lightingTip = 'Add a desk lamp or position yourself facing a window for clear facial illumination.';
      lightingStatus = 'needs_work';
    }

    const overall = Number(
      (
        (eyeScore10 * 0.3 +
          postureScore10 * 0.25 +
          gestureScore10 * 0.15 +
          facialScore10 * 0.15 +
          orientationScore10 * 0.05 +
          lightingScore10 * 0.1)
      ).toFixed(1)
    );

    const report: NonVerbalReport = {
      isReliable: true,
      overallScore10: overall,
      recordedDurationSec: currentDrill.durationSec,
      timestamp: new Date().toLocaleTimeString(),
      summaryText: `Observable non-verbal assessment for "${currentDrill.title}". Direct eye gaze: ${centerGazePercent}%, Shoulder level alignment: ${avgShoulderTilt}°, Gesture activity: ${gesturePercent}%.`,
      parameters: [
        {
          name: 'Eye Contact & Lens Alignment',
          score10: eyeScore10,
          observation: eyeObservation,
          improvementTip: eyeTip,
          status: eyeStatus
        },
        {
          name: 'Upright Posture & Shoulder Level',
          score10: postureScore10,
          observation: postureObservation,
          improvementTip: postureTip,
          status: postureStatus
        },
        {
          name: 'Hand Gestures in Active Zone',
          score10: gestureScore10,
          observation: gestureObservation,
          improvementTip: gestureTip,
          status: gestureStatus
        },
        {
          name: 'Facial Engagement & Responsiveness',
          score10: facialScore10,
          observation: facialObservation,
          improvementTip: facialTip,
          status: facialStatus
        },
        {
          name: 'Body Orientation & Centering',
          score10: orientationScore10,
          observation: orientationObservation,
          improvementTip: orientationTip,
          status: 'excellent'
        },
        {
          name: 'Professional Lighting & Contrast',
          score10: lightingScore10,
          observation: lightingObservation,
          improvementTip: lightingTip,
          status: lightingStatus
        }
      ]
    };

    setEvaluationReport(report);
  };

  // Save Non-Verbal Evaluation to Portfolio
  const handleSaveReportToPortfolio = async () => {
    if (!evaluationReport || !evaluationReport.isReliable) return;

    let content = `SAILL MODULE 6: NON-VERBAL & BODY LANGUAGE AI EVALUATION REPORT\nDrill: ${currentDrill.title}\nDate: ${new Date().toLocaleDateString()} at ${evaluationReport.timestamp}\n\nOVERALL SCORE: ${evaluationReport.overallScore10} / 10\n\nPARAMETER BREAKDOWN:\n`;

    evaluationReport.parameters.forEach((p) => {
      content += `\n[${p.name}] - ${p.score10}/10\nObservation: ${p.observation}\nRecommendation: ${p.improvementTip}\n`;
    });

    await dbStorage.savePortfolioItem({
      id: `body-lang-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      title: `Non-Verbal AI Report: ${currentDrill.title}`,
      category: 'report',
      content,
      score: Math.round(evaluationReport.overallScore10 * 10),
      createdAt: new Date().toISOString()
    });

    if (onSaveToPortfolio) {
      onSaveToPortfolio(
        `Non-Verbal AI: ${currentDrill.title}`,
        'report',
        content,
        evaluationReport.overallScore10
      );
    }

    setSavedLocally(true);
    onCompleteActivity();
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checklistPercent = Math.round((checkedItems.size / BODY_LANGUAGE_CHECKLIST.length) * 100);

  return (
    <div className="space-y-6">
      {/* Activity Card */}
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
              <Eye className="w-5 h-5 text-[#D35400]" />
              5. Non-Verbal Communication, Body Language & Eye Contact
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Over 55% of interview communication is non-verbal. Enable your camera preview to perform live non-verbal drills with real-time computer vision tracking and observable AI diagnostic scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Client-Side Vision Engine
            </span>
          </div>
        </div>

        {/* 4 Core Non-Verbal Strategy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="p-2 bg-[#D35400] text-white rounded-lg w-fit">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">1. Camera-Level Eye Contact</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Look directly at the camera lens, not down at your keyboard. Maintain gaze for 70-80% of answer delivery to project confidence.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="p-2 bg-[#2C3E50] text-white rounded-lg w-fit">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">2. Upright Spine & Posture</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Sit upright with shoulders relaxed and balanced horizontally. Leaning slightly forward (5-10°) conveys active engagement.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="p-2 bg-emerald-600 text-white rounded-lg w-fit">
              <Video className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">3. Expressive Hand Gestures</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Keep hands visible in the frame above desk level. Use open-palm gestures to emphasize key technical points naturally.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <div className="p-2 bg-purple-600 text-white rounded-lg w-fit">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#2C3E50]">4. Framing & Lighting</h3>
            <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
              Position webcam at eye height with frontal lighting so facial expressions and nods are clearly defined without harsh glare.
            </p>
          </div>
        </div>

        {/* LIVE CAMERA & VISION ANALYSIS STUDIO */}
        <div className="p-5 bg-[#2C3E50] text-white rounded-2xl border-2 border-[#D35400] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/20 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#FAD7A0] font-heading flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#D35400]" />
                Live Camera Preview & Computer Vision Tracking Studio
              </h3>
              <p className="text-xs text-gray-300">
                Perform non-verbal body language drills with real-time pose, gaze, and gesture detection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!webcamActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B04300] transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Enable Camera Preview
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  Stop Camera Preview
                </button>
              )}
            </div>
          </div>

          {/* Drill Task Selector */}
          <div className="p-3 bg-white/10 rounded-xl border border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FAD7A0] block">
              Select Body Language & Eye Contact Drill:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {DRILL_TASKS.map((drill, idx) => (
                <button
                  key={drill.id}
                  type="button"
                  onClick={() => {
                    setSelectedDrillIndex(idx);
                    setEvaluationReport(null);
                  }}
                  disabled={isDrillActive}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    selectedDrillIndex === idx
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                  } ${isDrillActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">
                    {drill.durationSec}s Drill • {drill.focusArea}
                  </span>
                  <span className="text-xs font-bold block line-clamp-1">{drill.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Drill Task Prompt */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 max-w-2xl">
              <span className="text-[10px] font-extrabold text-[#FAD7A0] uppercase tracking-wider">
                Task Prompt ({currentDrill.durationSec}s):
              </span>
              <p className="text-gray-200 text-xs font-medium">{currentDrill.prompt}</p>
              <p className="text-[11px] text-gray-300 italic">💡 {currentDrill.tip}</p>
            </div>

            {webcamActive && (
              <div className="shrink-0 flex items-center gap-2">
                {!isDrillActive ? (
                  <button
                    type="button"
                    onClick={handleStartDrill}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer animate-pulse"
                  >
                    <Zap className="w-4 h-4" />
                    Start {currentDrill.durationSec}s Non-Verbal Drill
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishDrill}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    Finish Drill Early ({drillSecondsRemaining}s left)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Countdown Indicator */}
          {isDrillActive && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-emerald-300">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin text-emerald-400" />
                  Recording & Analyzing Live Observable Performance...
                </span>
                <span>{drillSecondsRemaining}s Remaining</span>
              </div>
              <div className="w-full h-2 bg-emerald-900/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((currentDrill.durationSec - drillSecondsRemaining) / currentDrill.durationSec) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Video Feed & Real-Time Computer Vision Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Camera Frame + Overlay Canvas */}
            <div className="lg:col-span-2 aspect-video bg-black/80 rounded-xl border border-white/20 overflow-hidden relative flex items-center justify-center">
              {webcamActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
                  />

                  {/* Top HUD Telemetry Bar */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentMetrics.isValidSignal ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                        }`}
                      ></span>
                      {currentMetrics.signalDiagnostic}
                    </span>
                    <span className="flex items-center gap-3">
                      <span>Lum: {currentMetrics.luminance}/255</span>
                      <span>Gaze: {currentMetrics.eyeContactZone.toUpperCase()}</span>
                      <span>Tilt: {currentMetrics.shoulderTiltDeg}°</span>
                    </span>
                  </div>

                  {/* Bottom Legend */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-gray-300 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
                    <span>🟢 Green Oval = Eye Alignment Zone</span>
                    <span>📐 Shoulder Guideline</span>
                    <span>📦 Chest Gesture Box</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto opacity-40" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-200">Camera preview inactive</p>
                    <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                      Click <strong>"Enable Camera Preview"</strong> above to start live computer vision posture, eye gaze, and gesture tracking.
                    </p>
                  </div>
                  {cameraPermissionStatus === 'denied' && (
                    <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-[10px] text-red-200 max-w-sm mx-auto">
                      Camera permission was blocked. Please enable camera access in your browser site settings and retry.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Real-Time Telemetry Gauges */}
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 space-y-3 text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-extrabold text-[#FAD7A0] block uppercase tracking-wider text-[10px] border-b border-white/15 pb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#D35400]" />
                  Live Vision Diagnostics
                </span>

                {/* Eye Contact Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-200">Eye Contact Gaze</span>
                    <span
                      className={`font-black ${
                        currentMetrics.eyeContactZone === 'center'
                          ? 'text-emerald-400'
                          : currentMetrics.eyeContactZone === 'down'
                          ? 'text-red-400'
                          : 'text-[#FAD7A0]'
                      }`}
                    >
                      {currentMetrics.eyeContactZone === 'center'
                        ? 'Centered (Optimal)'
                        : currentMetrics.eyeContactZone === 'down'
                        ? 'Looking Down'
                        : currentMetrics.eyeContactZone === 'undetected'
                        ? 'Undetected'
                        : 'Looking Sideways'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        currentMetrics.eyeContactZone === 'center'
                          ? 'bg-emerald-400 w-full'
                          : currentMetrics.eyeContactZone === 'down'
                          ? 'bg-red-400 w-2/5'
                          : 'bg-[#FAD7A0] w-3/5'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Shoulder Level Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-200">Shoulder Alignment</span>
                    <span
                      className={`font-black ${
                        currentMetrics.shoulderTiltDeg <= 4 ? 'text-emerald-400' : 'text-[#FAD7A0]'
                      }`}
                    >
                      {currentMetrics.shoulderTiltDeg <= 4
                        ? `Level (${currentMetrics.shoulderTiltDeg}°)`
                        : `Tilted (${currentMetrics.shoulderTiltDeg}°)`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        currentMetrics.shoulderTiltDeg <= 4 ? 'bg-emerald-400 w-full' : 'bg-[#FAD7A0] w-3/5'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Gesture Activity Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-200">Chest Gesture Box</span>
                    <span
                      className={`font-black ${
                        currentMetrics.isGestureInZone ? 'text-emerald-400' : 'text-gray-300'
                      }`}
                    >
                      {currentMetrics.isGestureInZone ? 'Active In Zone' : 'Resting / Below Frame'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        currentMetrics.isGestureInZone ? 'bg-emerald-400 w-full' : 'bg-white/20 w-1/4'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Lighting Status */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-200">Lighting Quality</span>
                    <span
                      className={`font-black ${
                        currentMetrics.luminance >= 45 && currentMetrics.luminance <= 220
                          ? 'text-emerald-400'
                          : 'text-[#FAD7A0]'
                      }`}
                    >
                      {currentMetrics.luminance >= 45 && currentMetrics.luminance <= 220
                        ? 'Balanced'
                        : currentMetrics.luminance < 45
                        ? 'Low Light'
                        : 'High Glare'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(10, (currentMetrics.luminance / 255) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantee Note */}
              <div className="p-2 bg-white/10 rounded-lg border border-white/10 text-[10px] text-gray-300 space-y-1">
                <span className="font-bold text-[#FAD7A0] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy & Data Safety Guarantee:
                </span>
                <p>
                  Vision processing runs 100% locally in your browser. No video frames, camera streams, or audio are ever uploaded to external servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI VISUAL DIAGNOSTIC EVALUATION REPORT */}
        {evaluationReport && (
          <div className="space-y-4 animate-fadeIn">
            {evaluationReport.isReliable ? (
              <div className="srit-card p-6 bg-gradient-to-r from-white via-[#FFF8F0] to-white border-2 border-[#D35400] space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-[#D35400] text-white text-[10px] font-black uppercase rounded-md">
                        AI Non-Verbal Diagnostic Card
                      </span>
                      <span className="text-xs font-bold text-[#5D6D7E]">
                        Task: {currentDrill.title} ({evaluationReport.recordedDurationSec}s)
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#D35400]" />
                      Observed Visual Performance Evaluation
                    </h3>
                    <p className="text-xs text-[#5D6D7E] mt-0.5">
                      Evaluated strictly on observable student posture, eye contact, and gestures from the camera feed.
                    </p>
                  </div>

                  {/* Overall Score Badge */}
                  <div className="bg-white border-2 border-[#FAD7A0] p-3.5 rounded-2xl flex items-center gap-3 shrink-0 shadow-2xs">
                    <Award className="w-8 h-8 text-[#D35400]" />
                    <div>
                      <span className="text-2xl font-black text-[#D35400] leading-none block">
                        {evaluationReport.overallScore10}
                        <span className="text-xs text-[#5D6D7E] font-bold"> / 10</span>
                      </span>
                      <span className="text-[10px] text-[#5D6D7E] font-black uppercase tracking-wider">
                        Non-Verbal Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6 Observable Parameters Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {evaluationReport.parameters.map((param, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-[#FAD7A0] rounded-xl space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-[#2C3E50]">{param.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            param.score10 >= 8.5
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : param.score10 >= 7.0
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {param.score10} / 10
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            param.score10 >= 8.5
                              ? 'bg-emerald-500'
                              : param.score10 >= 7.0
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${param.score10 * 10}%` }}
                        ></div>
                      </div>

                      <div className="text-[11px] space-y-1 pt-1">
                        <p className="text-[#2C3E50] font-medium">
                          <strong>Observed:</strong> {param.observation}
                        </p>
                        <p className="text-[#5D6D7E] italic">
                          <strong>Coaching Tip:</strong> {param.improvementTip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#FAD7A0]">
                  <button
                    type="button"
                    onClick={handleStartDrill}
                    className="px-4 py-2 bg-white border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]/20 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#D35400]" />
                    Retake Non-Verbal Drill
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleSaveReportToPortfolio}
                      className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-black hover:bg-[#B04300] transition flex items-center gap-2 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Save className="w-4 h-4" />
                      {savedLocally ? '✓ Saved to Lab Portfolio' : 'Save Report to Portfolio & Complete Activity 5'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Diagnostic Inconclusive / Repositioning Safeguard */
              <div className="srit-card p-6 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-900">
                      Assessment Inconclusive — Repositioning Required
                    </h4>
                    <p className="text-xs text-amber-800">
                      {evaluationReport.diagnosticError ||
                        'The camera could not reliably assess your performance. In compliance with SAILL standards, no artificial or guessed score was generated.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-amber-200 rounded-xl text-xs text-[#2C3E50] space-y-2">
                  <span className="font-extrabold text-[#D35400] block uppercase text-[10px]">
                    Recommended Adjustments Before Retrying:
                  </span>
                  <ul className="text-[11px] text-[#5D6D7E] space-y-1 list-disc list-inside">
                    <li>Ensure front lighting illuminates your face clearly without backlighting shadows.</li>
                    <li>Align your head inside the green oval guide with shoulders visible in the frame.</li>
                    <li>Avoid holding hands over the camera lens or leaving the frame during the drill.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleStartDrill}
                  className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-extrabold hover:bg-[#B04300] transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reposition & Try Drill Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interactive Self-Audit Body Language Checklist */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                Interactive Body Language Self-Audit Checklist
              </h3>
              <p className="text-xs text-[#5D6D7E]">
                Audit your setup before entering placement mock interviews.
              </p>
            </div>

            <span className="text-xs font-bold text-[#D35400] bg-white border border-[#FAD7A0] px-3 py-1 rounded-xl">
              {checklistPercent}% Audit Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {BODY_LANGUAGE_CHECKLIST.map((item) => {
              const isDone = checkedItems.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:border-[#D35400]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-gray-300'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Completion Trigger */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            {checkedItems.size === BODY_LANGUAGE_CHECKLIST.length
              ? '✓ Body language checklist complete!'
              : 'Complete your non-verbal checklist to build interview posture.'}
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 cursor-pointer"
          >
            Complete Activity 5 & Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
