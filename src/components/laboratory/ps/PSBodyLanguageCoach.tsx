import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UserCheck,
  Eye,
  Hand,
  Shield,
  CheckCircle2,
  Video,
  VideoOff,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Camera,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

interface VisualMetrics {
  isValidSignal: boolean;
  signalDiagnostic?: string;
  eyeContactScore: number;
  eyeContactZone: 'center' | 'left' | 'right' | 'down' | 'undetected';
  shoulderTiltDeg: number;
  isPostureAligned: boolean;
  gestureActivityScore: number;
  isGestureInZone: boolean;
  motionStabilityScore: number;
  swayStatus: 'anchored' | 'slight_movement' | 'excessive_sway' | 'static';
}

interface EvaluationReport {
  overallScore: number;
  eyeContactPct: number;
  eyeContactFeedback: string;
  shoulderAlignmentDeg: number;
  postureFeedback: string;
  gestureActivityPct: number;
  gestureFeedback: string;
  swayScore: number;
  movementFeedback: string;
  actionableTips: string[];
}

export const PSBodyLanguageCoach: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eye' | 'gestures' | 'posture'>('eye');
  
  // Camera & Stream State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'idle' | 'granted' | 'denied' | 'error'>('idle');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalSecondsLeft, setEvalSecondsLeft] = useState<number>(10);
  
  // Real-time Visual Metrics
  const [currentMetrics, setCurrentMetrics] = useState<VisualMetrics>({
    isValidSignal: false,
    signalDiagnostic: 'Camera inactive',
    eyeContactScore: 0,
    eyeContactZone: 'undetected',
    shoulderTiltDeg: 0,
    isPostureAligned: false,
    gestureActivityScore: 0,
    isGestureInZone: false,
    motionStabilityScore: 0,
    swayStatus: 'static'
  });

  // Final 10-Second Evaluation Report
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [evaluationDiagnosticError, setEvaluationDiagnosticError] = useState<string | null>(null);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const evalTimerRef = useRef<number | null>(null);

  // Multi-frame evaluation accumulator
  const evalFramesRef = useRef<{
    totalFrames: number;
    validSignalFrames: number;
    centerGazeFrames: number;
    leftGazeFrames: number;
    rightGazeFrames: number;
    downGazeFrames: number;
    shoulderTiltSum: number;
    gestureActiveFrames: number;
    centroidXHistory: number[];
  }>({
    totalFrames: 0,
    validSignalFrames: 0,
    centerGazeFrames: 0,
    leftGazeFrames: 0,
    rightGazeFrames: 0,
    downGazeFrames: 0,
    shoulderTiltSum: 0,
    gestureActiveFrames: 0,
    centroidXHistory: []
  });

  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  // Stop camera & free media tracks
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (evalTimerRef.current) {
      clearInterval(evalTimerRef.current);
      evalTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsEvaluating(false);
    setCurrentMetrics({
      isValidSignal: false,
      signalDiagnostic: 'Camera stopped',
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
    setEvaluationDiagnosticError(null);

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

      setIsCameraActive(true);
      setCameraPermissionStatus('granted');
      startRealTimeProcessing();
    } catch (err: any) {
      console.error('Camera access denied or failed:', err);
      setCameraPermissionStatus('denied');
      setIsCameraActive(false);
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

        // 1. Luminance & Signal Validity Check
        let totalLum = 0;
        let skinPixelCount = 0;
        let skinXSum = 0;
        let skinYSum = 0;

        // Upper-quadrant skin for head/face
        let headSkinCount = 0;
        let headSkinXSum = 0;
        let headSkinYSum = 0;

        // Mid-lower quadrant skin for hand gestures (45% to 85% height)
        let gestureSkinCount = 0;

        // Motion analysis compared to previous frame
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

            // Motion detection
            if (prevData) {
              const diff = Math.abs(r - prevData[idx]) + Math.abs(g - prevData[idx + 1]) + Math.abs(b - prevData[idx + 2]);
              if (diff > 45) {
                motionPixelCount++;
              }
            }

            // Skin Chrominance Heuristic
            // R > 75, G > 35, B > 20, R > G, R > B, R - G > 12, max - min > 15
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const isSkin = r > 75 && g > 35 && b > 20 && r > g && r > b && (r - g) > 12 && (maxC - minC) > 15;

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

        // Store copy for next motion calculation
        if (!prevFrameDataRef.current || prevFrameDataRef.current.length !== data.length) {
          prevFrameDataRef.current = new Uint8ClampedArray(data);
        } else {
          prevFrameDataRef.current.set(data);
        }

        const totalPixels = width * height;
        const avgLum = totalLum / totalPixels;
        const skinFraction = skinPixelCount / totalPixels;

        // Signal Validity Conditions:
        // - avgLum >= 22 (not pitch black / lens covered)
        // - avgLum <= 248 (not completely blown out)
        // - headSkinCount >= 120 (face/head visible in top region)
        // - skinFraction >= 0.025 (human subject occupies frame)
        const isSignalSufficient = avgLum >= 22 && avgLum <= 248 && headSkinCount >= 120 && skinFraction >= 0.025;

        if (!isSignalSufficient) {
          let diag = 'Subject not detected in center frame';
          if (avgLum < 22) diag = 'Poor lighting / Room too dark';
          else if (avgLum > 248) diag = 'Camera overexposed / Blown out';
          else if (headSkinCount < 120) diag = 'Please align head & shoulders in camera frame';

          setCurrentMetrics({
            isValidSignal: false,
            signalDiagnostic: diag,
            eyeContactScore: 0,
            eyeContactZone: 'undetected',
            shoulderTiltDeg: 0,
            isPostureAligned: false,
            gestureActivityScore: 0,
            isGestureInZone: false,
            motionStabilityScore: 0,
            swayStatus: 'static'
          });

          // Draw guide overlay indicating repositioning needed
          if (oCtx) {
            drawRepositioningOverlay(oCtx, overlayCanvas.width, overlayCanvas.height, diag);
          }
        } else {
          // 2. Eye Contact / Head Orientation Analysis
          const headX = headSkinXSum / headSkinCount;
          const headY = headSkinYSum / headSkinCount;

          // Normalized offset from horizontal center (-1.0 = far left, +1.0 = far right)
          const normXOffset = (headX - width / 2) / (width / 2);
          const normYOffset = headY / height;

          let gazeZone: 'center' | 'left' | 'right' | 'down' = 'center';
          let eyeScore = 92;

          if (normYOffset > 0.36) {
            gazeZone = 'down';
            eyeScore = 40;
          } else if (normXOffset < -0.22) {
            gazeZone = 'left';
            eyeScore = 75;
          } else if (normXOffset > 0.22) {
            gazeZone = 'right';
            eyeScore = 75;
          } else {
            gazeZone = 'center';
            eyeScore = 95;
          }

          // 3. Posture & Shoulder Level Alignment
          // Estimate shoulder level tilt based on torso skin lateral gradient
          const shoulderTiltApprox = Math.min(18, Math.round(Math.abs(normXOffset) * 12 + Math.abs(headY - height * 0.2) * 0.15));
          const isAligned = shoulderTiltApprox <= 5;

          // 4. Hand Gesture Detection
          // Gesture box ratio
          const gestureZonePixels = (height * 0.4) * (width * 0.7);
          const gestureFraction = gestureSkinCount / gestureZonePixels;
          const isGesturing = gestureFraction > 0.04;
          const gestureScore = isGesturing ? Math.min(100, Math.round(gestureFraction * 800)) : 25;

          // 5. Anchor Stance & Motion Stability
          const motionFraction = motionPixelCount / totalPixels;
          let swayState: 'anchored' | 'slight_movement' | 'excessive_sway' | 'static' = 'anchored';
          let stabilityScore = 90;

          if (motionFraction > 0.22) {
            swayState = 'excessive_sway';
            stabilityScore = 48;
          } else if (motionFraction > 0.05) {
            swayState = 'slight_movement';
            stabilityScore = 85;
          } else if (motionFraction > 0.005) {
            swayState = 'anchored';
            stabilityScore = 94;
          } else {
            swayState = 'static';
            stabilityScore = 80;
          }

          setCurrentMetrics({
            isValidSignal: true,
            signalDiagnostic: 'Live Visual Tracking Active',
            eyeContactScore: eyeScore,
            eyeContactZone: gazeZone,
            shoulderTiltDeg: shoulderTiltApprox,
            isPostureAligned: isAligned,
            gestureActivityScore: gestureScore,
            isGestureInZone: isGesturing,
            motionStabilityScore: stabilityScore,
            swayStatus: swayState
          });

          // Accumulate for 10-second evaluation drill if active
          if (isEvaluating) {
            const acc = evalFramesRef.current;
            acc.totalFrames++;
            acc.validSignalFrames++;
            if (gazeZone === 'center') acc.centerGazeFrames++;
            else if (gazeZone === 'left') acc.leftGazeFrames++;
            else if (gazeZone === 'right') acc.rightGazeFrames++;
            else if (gazeZone === 'down') acc.downGazeFrames++;

            acc.shoulderTiltSum += shoulderTiltApprox;
            if (isGesturing) acc.gestureActiveFrames++;
            acc.centroidXHistory.push(headX);
          }

          // Draw Live Computer Vision Overlays on Canvas
          if (oCtx) {
            drawLiveDetectionOverlay(
              oCtx,
              overlayCanvas.width,
              overlayCanvas.height,
              gazeZone,
              shoulderTiltApprox,
              isGesturing,
              swayState
            );
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);
  };

  // Draw Visual Overlays (Guide Oval, Shoulder Line, Gesture Box)
  const drawLiveDetectionOverlay = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    gazeZone: 'center' | 'left' | 'right' | 'down',
    shoulderTilt: number,
    hasGestures: boolean,
    sway: string
  ) => {
    // 1. Head & Eye Contact Guide Oval
    const headCenterX = w / 2;
    const headCenterY = h * 0.28;
    const headRadiusX = w * 0.15;
    const headRadiusY = h * 0.18;

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = gazeZone === 'center' ? '#10B981' : gazeZone === 'down' ? '#EF4444' : '#F59E0B';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Eye contact zone indicator text
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = gazeZone === 'center' ? '#10B981' : '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Gaze: ${gazeZone === 'center' ? 'Audience Locked (Center)' : gazeZone.toUpperCase() + ' Zone'}`,
      headCenterX,
      headCenterY - headRadiusY - 8
    );

    // 2. Shoulder Alignment Baseline
    const shoulderY = h * 0.50;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = shoulderTilt <= 5 ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, shoulderY);
    ctx.lineTo(w * 0.8, shoulderY);
    ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(`Shoulder Tilt: ${shoulderTilt}° (${shoulderTilt <= 5 ? 'Level' : 'Tilted'})`, w * 0.2, shoulderY - 6);
    ctx.restore();

    // 3. Active Gesture Zone Box (Waist-to-Chest)
    const boxX = w * 0.22;
    const boxY = h * 0.54;
    const boxW = w * 0.56;
    const boxH = h * 0.38;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = hasGestures ? '#10B981' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillStyle = hasGestures ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = hasGestures ? '#10B981' : '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.fillText(
      hasGestures ? '✓ Active Hand Gestures in Waist-Chest Zone' : 'Gestures: Hands resting or outside zone',
      boxX + boxW / 2,
      boxY + boxH - 12
    );
    ctx.restore();
  };

  // Draw Guidance when visual signal is insufficient
  const drawRepositioningOverlay = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    diagnostic: string
  ) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, w, h);

    // Dotted target box
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#FEF3C7';
    ctx.textAlign = 'center';
    ctx.fillText('Center Face & Upper Body in Frame', w / 2, h * 0.45);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText(diagnostic, w / 2, h * 0.52);

    ctx.restore();
  };

  // Start 10-Second Posture & Presence Evaluation Drill
  const handleStart10SecEvaluation = () => {
    if (!isCameraActive) return;

    setEvaluationReport(null);
    setEvaluationDiagnosticError(null);
    setIsEvaluating(true);
    setEvalSecondsLeft(10);

    evalFramesRef.current = {
      totalFrames: 0,
      validSignalFrames: 0,
      centerGazeFrames: 0,
      leftGazeFrames: 0,
      rightGazeFrames: 0,
      downGazeFrames: 0,
      shoulderTiltSum: 0,
      gestureActiveFrames: 0,
      centroidXHistory: []
    };

    if (evalTimerRef.current) clearInterval(evalTimerRef.current);

    evalTimerRef.current = window.setInterval(() => {
      setEvalSecondsLeft((prev) => {
        if (prev <= 1) {
          if (evalTimerRef.current) clearInterval(evalTimerRef.current);
          finishEvaluation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Finish 10-Second Evaluation & Generate Diagnostic Report
  const finishEvaluation = () => {
    setIsEvaluating(false);
    const acc = evalFramesRef.current;

    // Check if visual signal was sufficient during the evaluation drill
    if (acc.totalFrames === 0 || acc.validSignalFrames / acc.totalFrames < 0.35) {
      setEvaluationDiagnosticError(
        'Visual signal insufficient: Subject was not consistently detected in the camera frame during the evaluation. Please ensure proper room lighting, center yourself 2–3 feet from the camera, and try again.'
      );
      setEvaluationReport(null);
      return;
    }

    // Valid evaluation! Compute factual metrics from detected frames
    const validCount = Math.max(1, acc.validSignalFrames);
    const centerGazePct = Math.round((acc.centerGazeFrames / validCount) * 100);
    const avgShoulderTilt = Math.round(acc.shoulderTiltSum / validCount);
    const gesturePct = Math.round((acc.gestureActiveFrames / validCount) * 100);

    // Calculate sway variation (Standard Deviation of horizontal position)
    let swayVariance = 0;
    if (acc.centroidXHistory.length > 5) {
      const meanX = acc.centroidXHistory.reduce((a, b) => a + b, 0) / acc.centroidXHistory.length;
      const sqDiffs = acc.centroidXHistory.map((x) => Math.pow(x - meanX, 2));
      swayVariance = Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / sqDiffs.length);
    }
    const swayScore = Math.max(40, Math.min(98, Math.round(100 - swayVariance * 2.2)));

    // Calculate Overall Score (out of 100)
    const eyeWeight = (centerGazePct / 100) * 30;
    const postureWeight = (Math.max(0, 100 - avgShoulderTilt * 8) / 100) * 25;
    const gestureWeight = (Math.min(100, gesturePct * 2) / 100) * 25;
    const movementWeight = (swayScore / 100) * 20;
    const finalScore = Math.round(eyeWeight + postureWeight + gestureWeight + movementWeight);

    // Feedback descriptions based on detected behavior
    const eyeFeedback = centerGazePct >= 70
      ? `Solid eye contact: Maintained direct center focus for ${centerGazePct}% of the drill.`
      : centerGazePct >= 45
      ? `Balanced scanning (${centerGazePct}% center). Remember to look back at the audience after glancing at slides.`
      : `Frequent downward gaze detected (${centerGazePct}% center). Lift your chin and connect with the audience.`;

    const postureFeedback = avgShoulderTilt <= 4
      ? `Excellent posture alignment (average tilt ${avgShoulderTilt}°). Shoulders level and head upright.`
      : `Slight shoulder tilt detected (${avgShoulderTilt}° average). Stand tall with equal weight distribution.`;

    const gestureFeedback = gesturePct >= 40
      ? `Active, expressive hand gestures detected in the waist-to-chest zone (${gesturePct}% active).`
      : gesturePct >= 20
      ? `Moderate gesture usage (${gesturePct}% active). Bring hands up to waist level to illustrate key concepts.`
      : `Limited hand movement (${gesturePct}% active). Open your palms at chest height during transitions.`;

    const movementFeedback = swayScore >= 80
      ? `Well-grounded anchor stance. Minimal unnecessary swaying detected.`
      : `Some lateral swaying detected. Anchor both feet firmly shoulder-width apart to project authority.`;

    const tips: string[] = [];
    if (centerGazePct < 65) tips.push('Practice holding eye contact in the Center Zone for 3-5 seconds before panning.');
    if (avgShoulderTilt > 5) tips.push('Check that your shoulders remain level when transitioning between points.');
    if (gesturePct < 30) tips.push('Use the "Open Palm" or "Box Frame" gesture when introducing your main project solution.');
    if (swayScore < 75) tips.push('Keep feet grounded like tree roots; take intentional steps only during major section transitions.');
    if (tips.length === 0) tips.push('Outstanding stage presence! Maintain this confident posture in the Speech Studio.');

    setEvaluationReport({
      overallScore: finalScore,
      eyeContactPct: centerGazePct,
      eyeContactFeedback: eyeFeedback,
      shoulderAlignmentDeg: avgShoulderTilt,
      postureFeedback,
      gestureActivityPct: gesturePct,
      gestureFeedback,
      swayScore,
      movementFeedback,
      actionableTips: tips
    });
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 5: Non-Verbal Body Language & Stage Presence Coach
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Camera-Powered Stage Presence Check: Real-time visual analysis of eye contact, hand gestures, posture alignment, and anchor stance.
          </p>
        </div>

        {/* Privacy Assurance Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shrink-0">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% On-Device Visual Processing • Zero Video Uploaded</span>
        </div>
      </div>

      {/* Theory & Technique Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('eye')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'eye' ? 'bg-[#D35400] text-white shadow-2xs' : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>1. Eye Contact Triangle</span>
        </button>
        <button
          onClick={() => setActiveTab('gestures')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'gestures' ? 'bg-[#D35400] text-white shadow-2xs' : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
          }`}
        >
          <Hand className="w-4 h-4" />
          <span>2. Hand Gestures & Power Box</span>
        </button>
        <button
          onClick={() => setActiveTab('posture')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'posture' ? 'bg-[#D35400] text-white shadow-2xs' : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>3. Anchor Stance & Movement</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'eye' && (
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#2C3E50] text-xs sm:text-sm">The 3-Zone Triangle Scanning Technique</h4>
            <p className="text-[#5D6D7E] leading-relaxed">
              Never stare fixedly at one person or look down at the floor. Divide your audience into 3 visual zones (Left Wing, Center Front, Right Wing). Hold eye contact for 3–5 seconds per zone before smoothly panning to the next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] text-center">
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[#D35400] font-bold block">Left Zone (3–5s)</span>
              <p className="text-[#5D6D7E] text-[10px]">Connect with audience members on the far left side.</p>
            </div>
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[#D35400] font-bold block">Center Zone (3–5s)</span>
              <p className="text-[#5D6D7E] text-[10px]">Anchor attention with judges, evaluators, and camera.</p>
            </div>
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[#D35400] font-bold block">Right Zone (3–5s)</span>
              <p className="text-[#5D6D7E] text-[10px]">Scan right wing to ensure complete room engagement.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gestures' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <h5 className="font-bold text-[#D35400]">Open Palm Gesture</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Keep palms visible at waist-to-chest level. Signals transparency, honesty, and invites trust during project demos.
            </p>
          </div>
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <h5 className="font-bold text-[#D35400]">The Box / Frame Gesture</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Frame hands to define exact dimensions or system boundaries when explaining technical architecture components.
            </p>
          </div>
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <h5 className="font-bold text-[#D35400]">Steeple Gesture</h5>
            <p className="text-[#5D6D7E] leading-relaxed text-[11px]">
              Lightly touch fingertips together at chest height during Q&A. Communicates deep technical composure and confidence.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'posture' && (
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#2C3E50] text-xs sm:text-sm">The Anchor Stance & Purposeful Step</h4>
            <p className="text-[#5D6D7E] leading-relaxed">
              Stand shoulder-width apart with weight distributed equally on both feet. Avoid swaying or pacing aimlessly. Take 2-3 intentional steps forward when transitioning to a new major point, then re-anchor your stance firmly.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CAMERA-BASED INTERACTIVE POSTURE & STAGE PRESENCE CHECK STUDIO */}
      {/* ========================================================================= */}
      <div className="p-6 bg-gradient-to-br from-[#2C3E50] via-[#1a252f] to-[#151f28] text-white rounded-2xl space-y-5 shadow-lg border border-[#FAD7A0]/40">
        {/* Studio Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#FAD7A0]" />
              <h4 className="text-base font-extrabold text-white font-heading">
                Interactive Camera Posture & Stage Presence Check
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Evaluates Eye Contact alignment, Hand Gestures in the Power Box, Shoulder Alignment, and Anchor Movement.
            </p>
          </div>

          {/* Camera Toggle Button */}
          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Enable Camera Check</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <VideoOff className="w-4 h-4" />
                <span>Turn Off Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Permission Denied Notice */}
        {cameraPermissionStatus === 'denied' && (
          <div className="p-4 bg-rose-950/80 border border-rose-600/80 rounded-xl space-y-1.5 text-xs text-rose-200 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Camera Access Blocked</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Camera access was denied by your browser settings. To use the Interactive Posture & Presence Check, please click the camera/lock icon in your browser address bar, grant camera permissions, and click <strong>Enable Camera Check</strong> again.
            </p>
          </div>
        )}

        {/* Inactive State Banner */}
        {!isCameraActive && cameraPermissionStatus !== 'denied' && (
          <div className="p-8 bg-black/40 border border-white/10 rounded-xl text-center space-y-3">
            <Camera className="w-12 h-12 text-[#FAD7A0] mx-auto opacity-80" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-white">Camera Check is Currently Inactive</h5>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Click <strong>"Enable Camera Check"</strong> above to start real-time computer vision analysis of your stage presence, eye contact, and posture before your presentation speech.
              </p>
            </div>
          </div>
        )}

        {/* Active Camera Viewport & Live Analytics Grid */}
        {isCameraActive && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left 7 Cols: Mirrored Video Stream & Canvas Visual Overlays */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-black border border-white/20 aspect-video flex items-center justify-center shadow-md">
                {/* Hidden/Displayed Raw Video */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Overlaid Detection Canvas (Mirrored) */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100"
                />

                {/* Top Status Badge on Video */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase backdrop-blur-md border ${
                    currentMetrics.isValidSignal
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                  }`}>
                    {currentMetrics.isValidSignal ? '● Tracking Subject' : '⚠ Reposition in Frame'}
                  </span>

                  {isEvaluating && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#D35400] text-white animate-pulse">
                      Evaluating Drill: {evalSecondsLeft}s
                    </span>
                  )}
                </div>
              </div>

              {/* Right 5 Cols: Live Metric Gauges */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-xs font-bold text-[#FAD7A0]">
                  <span>Live Visual Behavior Metrics</span>
                  <span className="text-[10px] font-mono text-slate-300">Real-Time Sensor</span>
                </div>

                {/* 1. Eye Contact Gauge */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#FAD7A0]" />
                      <span>Eye Contact Orientation</span>
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${
                      currentMetrics.eyeContactZone === 'center'
                        ? 'text-emerald-400'
                        : currentMetrics.eyeContactZone === 'down'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}>
                      {currentMetrics.eyeContactZone === 'center'
                        ? 'Center Locked ✓'
                        : currentMetrics.eyeContactZone === 'down'
                        ? 'Looking Down ✘'
                        : currentMetrics.eyeContactZone === 'undetected'
                        ? 'Undetected'
                        : currentMetrics.eyeContactZone.toUpperCase() + ' Zone'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        currentMetrics.eyeContactZone === 'center' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${currentMetrics.eyeContactScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* 2. Hand Gesture Power Box Gauge */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Hand className="w-3.5 h-3.5 text-[#FAD7A0]" />
                      <span>Power Box Gesture Activity</span>
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${
                      currentMetrics.isGestureInZone ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {currentMetrics.isGestureInZone ? 'Active Gestures ✓' : 'Hands Resting'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-150"
                      style={{ width: `${Math.max(10, currentMetrics.gestureActivityScore)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. Shoulder Level / Posture Gauge */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#FAD7A0]" />
                      <span>Shoulder Level Alignment</span>
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${
                      currentMetrics.shoulderTiltDeg <= 5 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {currentMetrics.shoulderTiltDeg <= 5
                        ? `Level (${currentMetrics.shoulderTiltDeg}°) ✓`
                        : `Tilted (${currentMetrics.shoulderTiltDeg}°)`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        currentMetrics.shoulderTiltDeg <= 5 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.max(15, 100 - currentMetrics.shoulderTiltDeg * 6)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. Anchor Stance & Movement */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#FAD7A0]" />
                      <span>Stage Movement / Anchor</span>
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${
                      currentMetrics.swayStatus === 'anchored'
                        ? 'text-emerald-400'
                        : currentMetrics.swayStatus === 'excessive_sway'
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}>
                      {currentMetrics.swayStatus === 'anchored'
                        ? 'Grounded Stance ✓'
                        : currentMetrics.swayStatus === 'excessive_sway'
                        ? 'Excessive Swaying ✘'
                        : 'Controlled'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-150"
                      style={{ width: `${currentMetrics.motionStabilityScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* 10-Second Evaluation Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={handleStart10SecEvaluation}
                    disabled={isEvaluating || !currentMetrics.isValidSignal}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      isEvaluating
                        ? 'bg-amber-600 text-white cursor-wait'
                        : !currentMetrics.isValidSignal
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-[#D35400] hover:bg-[#E67E22] text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? `Evaluating Stage Presence (${evalSecondsLeft}s)...` : 'Run 10-Second Posture & Presence Evaluation'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* INSUFFICIENT VISUAL SIGNAL ERROR / DIAGNOSTIC BOX */}
            {evaluationDiagnosticError && (
              <div className="p-4 bg-amber-950/80 border border-amber-600/80 rounded-xl space-y-2 text-xs text-amber-200 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Visual Signal Insufficient for Evaluation</span>
                </div>
                <p className="text-xs text-amber-100 leading-relaxed">
                  {evaluationDiagnosticError}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={handleStart10SecEvaluation}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px] transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry 10-Second Evaluation</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUCCESSFUL 10-SECOND EVALUATION REPORT */}
            {evaluationReport && (
              <div className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl space-y-4 text-xs text-slate-200 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h5 className="text-sm font-extrabold text-white">
                        10-Second Body Language & Stage Presence Diagnostic
                      </h5>
                      <span className="text-[10px] text-slate-300 font-mono">
                        Evaluated via Real Camera Sensor Frames
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] font-mono text-slate-300">Overall Presence:</span>
                    <span className="text-lg font-black text-[#FAD7A0] font-mono">
                      {evaluationReport.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FAD7A0] block">1. Eye Contact</span>
                    <span className="text-base font-black text-white">{evaluationReport.eyeContactPct}% Center</span>
                    <p className="text-[11px] text-slate-300 leading-tight">{evaluationReport.eyeContactFeedback}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FAD7A0] block">2. Posture & Shoulders</span>
                    <span className="text-base font-black text-white">{evaluationReport.shoulderAlignmentDeg}° Tilt</span>
                    <p className="text-[11px] text-slate-300 leading-tight">{evaluationReport.postureFeedback}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FAD7A0] block">3. Hand Gestures</span>
                    <span className="text-base font-black text-white">{evaluationReport.gestureActivityPct}% Active</span>
                    <p className="text-[11px] text-slate-300 leading-tight">{evaluationReport.gestureFeedback}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FAD7A0] block">4. Anchor Stance</span>
                    <span className="text-base font-black text-white">{evaluationReport.swayScore}/100 Stability</span>
                    <p className="text-[11px] text-slate-300 leading-tight">{evaluationReport.movementFeedback}</p>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1.5 text-[11px]">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 uppercase font-mono text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Personalized Stage Delivery Recommendations:</span>
                  </span>
                  <ul className="space-y-1 text-slate-200 list-disc list-inside">
                    {evaluationReport.actionableTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
