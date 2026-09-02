import React, { useState, useEffect } from 'react';
import {
  StudentActivitySubmission,
  ActivityType,
  StudentProfile
} from '../../types';
import { StudentActivityService } from '../../services/StudentActivityService';
import { AuthService } from '../../services/AuthService';
import { dbStorage } from '../../lib/db';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FileCheck,
  MessageSquare,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ActivitySubmissionBoxProps {
  moduleId: string;
  moduleCode?: string;
  moduleTitle: string;
  activityId: string;
  activityTitle: string;
  activityType: ActivityType;
  activityCategory?: string;
  
  // Current Work Payload from parent tool
  textContent?: string;
  audioDataUrl?: string;
  audioDurationSeconds?: number;
  mcqAnswers?: any[];
  scenarioDetails?: any;
  structuredData?: any;
  
  // AI score if evaluated
  aiScore?: number;
  aiFeedback?: string;
  aiMetrics?: Record<string, number | string>;

  // Callbacks
  onSubmissionComplete?: (submission: StudentActivitySubmission) => void;
  // Prop to let the parent know if the tool should disable editing
  onLockStateChange?: (isLocked: boolean) => void;
}

export const ActivitySubmissionBox: React.FC<ActivitySubmissionBoxProps> = ({
  moduleId,
  moduleCode,
  moduleTitle,
  activityId,
  activityTitle,
  activityType,
  activityCategory,
  textContent,
  audioDataUrl,
  audioDurationSeconds,
  mcqAnswers,
  scenarioDetails,
  structuredData,
  aiScore,
  aiFeedback,
  aiMetrics,
  onSubmissionComplete,
  onLockStateChange
}) => {
  const currentUser = AuthService.getCurrentUser();
  const studentRollNo = currentUser?.rollNo || currentUser?.username || '26691A0501';
  const studentName = currentUser?.name || 'Aarav Sharma';

  const [submission, setSubmission] = useState<StudentActivitySubmission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showPayloadDetails, setShowPayloadDetails] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSubmission();
  }, [studentRollNo, moduleId, activityId]);

  const loadSubmission = async () => {
    setLoading(true);
    try {
      const profile = await dbStorage.getProfileByRollNo(studentRollNo);
      setStudentProfile(profile);

      const sub = await StudentActivityService.getSubmission(studentRollNo, moduleId, activityId);
      setSubmission(sub);

      const isLocked = StudentActivityService.isActivityLocked(sub);
      if (onLockStateChange) {
        onLockStateChange(isLocked);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayAudio = (url: string) => {
    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = new Audio(url);
      setAudioElement(audio);
      audio.play();
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newSubmission = await StudentActivityService.submitActivity({
        studentRollNo,
        studentName,
        studentBranch: studentProfile?.branch || studentProfile?.department || 'CSE',
        studentSemester: studentProfile?.semester || 'Semester I',
        studentSection: studentProfile?.section || 'Section A',
        batchId: studentProfile?.academicBatchId,
        batchName: studentProfile?.academicBatchName,
        moduleId,
        moduleCode: moduleCode || `R26-LAB-${moduleId.substring(0, 3).toUpperCase()}`,
        moduleTitle,
        activityId,
        activityTitle,
        activityType,
        activityCategory: activityCategory || 'Core Lab Activity',
        textContent: textContent || submission?.textContent || '',
        audioDataUrl: audioDataUrl || submission?.audioDataUrl || '',
        audioDurationSeconds: audioDurationSeconds || submission?.audioDurationSeconds || 0,
        mcqAnswers: mcqAnswers || submission?.mcqAnswers,
        scenarioDetails: scenarioDetails || submission?.scenarioDetails,
        structuredData: structuredData || submission?.structuredData,
        aiScore: aiScore !== undefined ? aiScore : submission?.aiScore,
        aiFeedback: aiFeedback || submission?.aiFeedback,
        aiMetrics: aiMetrics || submission?.aiMetrics
      });

      setSubmission(newSubmission);
      setShowConfirmModal(false);
      setSubmitSuccessMsg('Activity successfully submitted to Faculty Incharge! Record is now locked.');
      setTimeout(() => setSubmitSuccessMsg(null), 5000);

      if (onSubmissionComplete) {
        onSubmissionComplete(newSubmission);
      }
      if (onLockStateChange) {
        onLockStateChange(true);
      }
    } catch (err) {
      console.error('Error submitting activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl animate-pulse text-xs text-gray-500 flex items-center justify-between">
        <span>Loading activity submission status...</span>
        <Clock className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  const isLocked = StudentActivityService.isActivityLocked(submission);
  const isReviewed = submission?.status === 'reviewed';
  const isResubmissionAllowed = submission?.status === 'resubmission_allowed';
  const hasSubmitted = !!submission;

  const hasContentToSubmit = !!(
    textContent ||
    audioDataUrl ||
    (mcqAnswers && mcqAnswers.length > 0) ||
    scenarioDetails ||
    structuredData ||
    submission?.textContent ||
    submission?.audioDataUrl
  );

  return (
    <div className="w-full space-y-4 my-6">
      {/* Toast Confirmation */}
      {submitSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submitSuccessMsg}</span>
        </div>
      )}

      {/* Main Submission State Card */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isReviewed
            ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
            : isLocked
            ? 'bg-amber-50/70 border-amber-300 shadow-xs'
            : isResubmissionAllowed
            ? 'bg-blue-50/80 border-blue-300 shadow-xs'
            : 'bg-white border-[#FAD7A0] shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-md border border-[#FAD7A0]">
                Activity Record
              </span>
              <h4 className="text-sm font-bold text-[#2C3E50]">{activityTitle}</h4>
            </div>
            <p className="text-xs text-gray-500">
              Module: <strong className="text-gray-700">{moduleTitle}</strong>
              {activityCategory ? ` • Category: ${activityCategory}` : ''}
            </p>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex items-center gap-2">
            {isReviewed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reviewed by Faculty (Locked)</span>
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 text-white font-extrabold text-xs rounded-full shadow-2xs">
                <Lock className="w-3.5 h-3.5" />
                <span>Submitted to Faculty (Locked)</span>
              </span>
            ) : isResubmissionAllowed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-full shadow-2xs animate-pulse">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resubmission Enabled</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-full border border-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Draft / Unsubmitted</span>
              </span>
            )}
          </div>
        </div>

        {/* Status Details / Notice */}
        <div className="py-3.5 text-xs space-y-3">
          {isReviewed ? (
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Faculty Evaluation Complete
                </span>
                <span className="text-[11px] text-gray-500 font-normal">
                  Reviewed on {new Date(submission.facultyReviewedAt || submission.submittedAt).toLocaleDateString()}
                </span>
              </div>
              {submission.facultyRemarks && (
                <div className="p-2.5 bg-emerald-50/60 rounded-lg text-xs text-[#2C3E50] border border-emerald-200/60">
                  <strong className="text-emerald-900 block mb-0.5">Faculty Incharge Remarks:</strong>
                  <p className="italic font-medium">"{submission.facultyRemarks}"</p>
                  {submission.facultyReviewerName && (
                    <span className="text-[10px] text-gray-500 block mt-1 text-right">
                      — {submission.facultyReviewerName}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : isLocked ? (
            <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Submission Locked for Official Faculty Review</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Submitted on <strong>{new Date(submission.submittedAt).toLocaleString()}</strong>.
                This activity record is permanently preserved in the SAILL system. Modifications are locked to ensure evaluation integrity unless your Faculty Incharge permits a resubmission.
              </p>
            </div>
          ) : isResubmissionAllowed ? (
            <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-2 text-blue-900">
              <div className="flex items-center gap-2 font-bold text-blue-800">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Faculty Allowed Resubmission</span>
              </div>
              {submission.resubmissionReason && (
                <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200 text-xs">
                  <strong className="text-blue-950 block mb-0.5">Faculty Guidance / Note:</strong>
                  <p className="italic text-gray-700">"{submission.resubmissionReason}"</p>
                </div>
              )}
              <p className="text-xs text-gray-600">
                You may make updates or record again, then click <strong>"Re-Submit Activity"</strong> below.
              </p>
            </div>
          ) : (
            <div className="text-gray-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
              <span>
                Complete the activity tasks above (speaking recording, text responses, or quiz) and click <strong>"Save & Submit Activity"</strong> to log your permanent record for Faculty Incharge evaluation.
              </span>
            </div>
          )}

          {/* AI Score (Preserved Distinctly from Faculty Score) */}
          {(submission?.aiScore !== undefined || aiScore !== undefined) && (
            <div className="p-3 bg-gradient-to-r from-[#FFF8F0] to-white rounded-xl border border-[#FAD7A0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    AI Automated Evaluation (Objective Benchmark)
                  </span>
                  <span className="text-xs text-[#2C3E50] font-medium">
                    {submission?.aiFeedback || aiFeedback || 'Speech clarity, acoustic phonetics, and fluency analyzed.'}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-black text-[#D35400]">
                  {submission?.aiScore ?? aiScore}%
                </span>
                <span className="text-[10px] text-gray-400 block font-semibold">AI Benchmark</span>
              </div>
            </div>
          )}

          {/* Payload Preview Dropdown (Audio player / Submitted Text) */}
          {(submission?.audioDataUrl || submission?.textContent || audioDataUrl || textContent) && (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowPayloadDetails(!showPayloadDetails)}
                className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-bold text-gray-700 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#D35400]" />
                  <span>View Submitted Activity Artifacts & Content</span>
                </span>
                {showPayloadDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {showPayloadDetails && (
                <div className="p-4 space-y-3 bg-white text-xs animate-fadeIn">
                  {/* Audio Recording */}
                  {(submission?.audioDataUrl || audioDataUrl) && (
                    <div className="p-3 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#D35400] block text-xs">Audio Recording Submission</span>
                        <span className="text-[11px] text-gray-500">
                          Duration: {submission?.audioDurationSeconds || audioDurationSeconds || '~'}s • Base64 Audio Record
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(submission?.audioDataUrl || audioDataUrl || '')}
                        className="px-3 py-1.5 bg-[#D35400] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#E67E22] transition cursor-pointer shadow-2xs"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Play Recording</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Written Content */}
                  {(submission?.textContent || textContent) && (
                    <div className="space-y-1">
                      <span className="font-bold text-gray-700 block text-xs">Written Response / Draft:</span>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans text-xs leading-relaxed">
                        {submission?.textContent || textContent}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button Area */}
        <div className="pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500 font-mono">
            Roll No: <strong>{studentRollNo}</strong> • {studentProfile?.branch || 'CSE'} - {studentProfile?.section || 'Sec A'}
          </span>

          {(!isLocked || isResubmissionAllowed) ? (
            <button
              type="button"
              disabled={!hasContentToSubmit || isSubmitting}
              onClick={() => setShowConfirmModal(true)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs ${
                !hasContentToSubmit || isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isResubmissionAllowed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-[#D35400] hover:bg-[#E67E22] text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isResubmissionAllowed ? 'Re-Submit Updated Activity' : 'Save & Submit Activity to Faculty'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1.5 rounded-xl border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Activity Locked (Submitted to Faculty)</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#FAD7A0] space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#D35400] flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-[#2C3E50]">
                Submit Activity for Faculty Evaluation?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                You are submitting <strong>"{activityTitle}"</strong> for <strong>{moduleTitle}</strong>.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Immutability Lock Notice:
                </span>
                <p className="text-[11px] text-amber-800">
                  Once submitted, you will not be able to alter this submission unless your Faculty Incharge unlocks it for resubmission.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
