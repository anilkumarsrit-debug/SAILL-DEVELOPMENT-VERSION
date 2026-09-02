import { StudentActivitySubmission, ActivitySubmissionStatus, ActivityType, StudentProfile } from '../types';
import { dbStorage } from '../lib/db';
import { FacultyAssignmentService } from './FacultyAssignmentService';

export interface ModuleActivityConfig {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  type: ActivityType;
  category: string;
  description: string;
  instructions: string;
}

export class StudentActivityService {
  /**
   * Standard activity specifications for all 10 SAILL Modules
   */
  static getModuleActivities(moduleId: string): ModuleActivityConfig[] {
    const activitiesByModule: Record<string, ModuleActivityConfig[]> = {
      pronunciation: [
        {
          id: 'ipa-minimal-pairs',
          moduleId: 'pronunciation',
          moduleTitle: 'Phonetics & Pronunciation Practice',
          title: 'Minimal Pairs Acoustic Audio Drill',
          type: 'audio_recording',
          category: 'Acoustic Phonetics',
          description: 'Record minimal-pair word contrasts (/p/ vs /b/, /f/ vs /v/, /s/ vs /z/) to eliminate MTI.',
          instructions: 'Listen to the model audio, then record your clear articulation of the minimal pair sentences.'
        },
        {
          id: 'phoneme-articulation',
          moduleId: 'pronunciation',
          moduleTitle: 'Phonetics & Pronunciation Practice',
          title: 'Vowel & Diphthong Articulation Test',
          type: 'speaking_practice',
          category: 'Vowel Glides',
          description: 'Speak and record 5 technical vocabulary terms with fronting, rounding, and centering diphthongs.',
          instructions: 'Pronounce each word clearly using the target IPA vowel sound.'
        },
        {
          id: 'syllable-stress-drill',
          moduleId: 'pronunciation',
          moduleTitle: 'Phonetics & Pronunciation Practice',
          title: 'Word Stress & Pitch Shift Recitation',
          type: 'audio_recording',
          category: 'Suprasegmentals',
          description: 'Demonstrate primary and secondary stress placement on polysyllabic engineering terms.',
          instructions: 'Record your reading of the paragraph with accurate syllable stress and pitch contours.'
        }
      ],
      listening: [
        {
          id: 'dialogue-comprehension',
          moduleId: 'listening',
          moduleTitle: 'Active Listening & Comprehension',
          title: 'Technical Dialogue Audio Analysis',
          type: 'written_response',
          category: 'Active Listening',
          description: 'Listen to the engineering conference audio and transcribe the key technical requirements.',
          instructions: 'Summarize the 3 primary design constraints discussed by the lead engineer.'
        },
        {
          id: 'critical-inference-task',
          moduleId: 'listening',
          moduleTitle: 'Active Listening & Comprehension',
          title: 'Critical Inference & Speaker Intent Evaluation',
          type: 'scenario_response',
          category: 'Critical Listening',
          description: 'Analyze vocal inflection, tone shifts, and implicit priorities from the simulated client interview.',
          instructions: 'Detail the underlying concerns of the client and outline your proposed action points.'
        }
      ],
      'spoken-english': [
        {
          id: 'jam-speech',
          moduleId: 'spoken-english',
          moduleTitle: 'Spoken English & Situational Dialogues',
          title: 'JAM (Just A Minute) Extempore Audio Recording',
          type: 'audio_recording',
          category: 'Extempore Speaking',
          description: 'Deliver an uninterrupted 60-second spontaneous speech on a technical or professional prompt.',
          instructions: 'Speak clearly with minimal hesitation, natural connectors, and confident pacing.'
        },
        {
          id: 'situational-roleplay',
          moduleId: 'spoken-english',
          moduleTitle: 'Spoken English & Situational Dialogues',
          title: 'Workplace Situational Dialogue Simulation',
          type: 'speaking_practice',
          category: 'Situational English',
          description: 'Enact a client escalation or team stand-up conversation using appropriate professional registers.',
          instructions: 'Respond to the audio prompt maintaining a polite, assertive, and solution-focused tone.'
        }
      ],
      'group-discussion': [
        {
          id: 'gd-opening-speech',
          moduleId: 'group-discussion',
          moduleTitle: 'Group Discussion & Collaboration',
          title: 'GD Initiation & Point Substantiation Speech',
          type: 'audio_recording',
          category: 'GD Skills',
          description: 'Deliver a structured 90-second opening statement framing the GD topic with factual data.',
          instructions: 'State the premise, cite relevant examples, and invite collaboration.'
        },
        {
          id: 'gd-conflict-resolution',
          moduleId: 'group-discussion',
          moduleTitle: 'Group Discussion & Collaboration',
          title: 'Group Conflict Resolution & Consensus Synthesis',
          type: 'scenario_response',
          category: 'Consensus Building',
          description: 'Resolve a simulated stalemate between conflicting viewpoints in an engineering team discussion.',
          instructions: 'Draft a diplomatic rebuttal and summarize points of consensus.'
        }
      ],
      'public-speaking': [
        {
          id: 'technical-presentation',
          moduleId: 'public-speaking',
          moduleTitle: 'Public Speaking & Presentation Skills',
          title: 'Technical Presentation Audio/Speech Submission',
          type: 'audio_recording',
          category: 'Presentation Skills',
          description: 'Deliver a 2-minute slide-synced presentation introducing an innovative engineering prototype.',
          instructions: 'Structure your speech with Hook, Problem, Solution, Evidence, and Call to Action.'
        },
        {
          id: 'elevator-pitch',
          moduleId: 'public-speaking',
          moduleTitle: 'Public Speaking & Presentation Skills',
          title: '60-Second Elevator Pitch Submission',
          type: 'audio_recording',
          category: 'Pitch Delivery',
          description: 'Pitch yourself or your tech project to a panel of venture capitalists or recruiters in 60 seconds.',
          instructions: 'Record your high-energy, concise pitch highlighting unique value proposition.'
        }
      ],
      'professional-writing': [
        {
          id: 'executive-summary-draft',
          moduleId: 'professional-writing',
          moduleTitle: 'Professional Writing & Reporting',
          title: 'Technical Executive Summary & Report Draft',
          type: 'written_response',
          category: 'Technical Writing',
          description: 'Draft a 300-word formal executive summary on an engineering feasibility study.',
          instructions: 'Ensure clarity, concise phrasing, objective tone, and proper structural headings.'
        },
        {
          id: 'paragraph-cohesion-exercise',
          moduleId: 'professional-writing',
          moduleTitle: 'Professional Writing & Reporting',
          title: 'Paragraph Cohesion & Discourse Markers Exercise',
          type: 'practice_task',
          category: 'Syntactic Flow',
          description: 'Synthesize raw technical data points into a fluid, cohesive narrative using transitions.',
          instructions: 'Write the unified paragraph using contrastive, additive, and causal connectors.'
        }
      ],
      'professional-email': [
        {
          id: 'workplace-formal-email',
          moduleId: 'professional-email',
          moduleTitle: 'Workplace Communication & Email Drafting',
          title: 'Formal Stakeholder Email & Action Request',
          type: 'written_response',
          category: 'Business Communication',
          description: 'Compose a formal email requesting project budget approval from executive management.',
          instructions: 'Include appropriate subject line, salutation, executive context, bulleted requirements, and CTA.'
        },
        {
          id: 'escalation-tone-revision',
          moduleId: 'professional-email',
          moduleTitle: 'Workplace Communication & Email Drafting',
          title: 'Crisis Escalation & Diplomacy Tone Exercise',
          type: 'written_response',
          category: 'Email Etiquette',
          description: 'Rewrite an aggressive customer complaint response into an empathetic, professional email.',
          instructions: 'Acknowledge the delay, take accountability, and outline immediate corrective action.'
        }
      ],
      'resume-writing': [
        {
          id: 'ats-resume-composition',
          moduleId: 'resume-writing',
          moduleTitle: 'Resume Preparation, SOP & Interviews',
          title: 'ATS-Optimized Technical Resume Profile',
          type: 'written_response',
          category: 'Career Readiness',
          description: 'Create an ATS-compliant resume summary, technical skill matrix, and STAR achievement bullets.',
          instructions: 'Incorporate action verbs, quantified metrics, and relevant keyword density.'
        },
        {
          id: 'star-interview-response',
          moduleId: 'resume-writing',
          moduleTitle: 'Resume Preparation, SOP & Interviews',
          title: 'STAR Method Behavioral Interview Response',
          type: 'audio_recording',
          category: 'Interview Skills',
          description: 'Record an answer to: "Describe a time you solved a critical technical bottleneck under pressure."',
          instructions: 'Structure your audio response clearly: Situation, Task, Action, and Result.'
        }
      ],
      'reading-comprehension': [
        {
          id: 'cornell-notes-synthesis',
          moduleId: 'reading-comprehension',
          moduleTitle: 'Critical & Speed Reading',
          title: 'Cornell Note-Taking & Research Paper Synthesis',
          type: 'written_response',
          category: 'Critical Reading',
          description: 'Extract cues, main notes, and a concise 3-sentence summary from a complex IEEE paper abstract.',
          instructions: 'Submit your structured cues, detailed notes, and final synthesized takeaway.'
        },
        {
          id: 'speed-reading-analysis',
          moduleId: 'reading-comprehension',
          moduleTitle: 'Critical & Speed Reading',
          title: 'Speed Reading & Timed Comprehension Analysis',
          type: 'practice_task',
          category: 'Reading Fluency',
          description: 'Complete the 500-word reading passage at target WPM and answer detailed analytical questions.',
          instructions: 'Record your WPM rate, retention percentage, and key argument breakdown.'
        }
      ],
      'debate-skills': [
        {
          id: 'debate-rebuttal-speech',
          moduleId: 'debate-skills',
          moduleTitle: 'Debate Competencies & Critical Argumentation',
          title: 'Formal Parliamentary Debate Speech & Rebuttal',
          type: 'audio_recording',
          category: 'Debate Rhetoric',
          description: 'Deliver a 90-second Oxford-style debate speech opposing or proposing AI governance regulations.',
          instructions: 'Use the ARE framework (Assertion, Reasoning, Evidence) and deliver your counter-rebuttal.'
        },
        {
          id: 'logical-fallacies-analysis',
          moduleId: 'debate-skills',
          moduleTitle: 'Debate Competencies & Critical Argumentation',
          title: 'Logical Fallacy Identification & Rebuttal Strategy',
          type: 'scenario_response',
          category: 'Critical Thinking',
          description: 'Identify Strawman, Ad Hominem, and Slippery Slope fallacies in an opponent transcript.',
          instructions: 'Highlight the flawed arguments and draft sound logical counter-arguments.'
        }
      ],
      'report-writing': [
        {
          id: 'lab-investigation-report',
          moduleId: 'report-writing',
          moduleTitle: 'Technical Report Writing & Documentation',
          title: 'Engineering Lab Investigation & Findings Report',
          type: 'written_response',
          category: 'Documentation',
          description: 'Format a comprehensive technical report detailing experimental findings, tables, and conclusion.',
          instructions: 'Include Title, Abstract, Methodology, Findings, Recommendations, and References.'
        }
      ],
      'etiquette-branding': [
        {
          id: 'workplace-etiquette-scenario',
          moduleId: 'etiquette-branding',
          moduleTitle: 'Professional Etiquette & Personal Branding',
          title: 'Corporate Ethics & Workplace Etiquette Response',
          type: 'scenario_response',
          category: 'Workplace Ethics',
          description: 'Evaluate cross-cultural communication challenges and formulate ethical workplace responses.',
          instructions: 'Provide an actionable ethical resolution adhering to international corporate standards.'
        },
        {
          id: 'linkedin-branding-statement',
          moduleId: 'etiquette-branding',
          moduleTitle: 'Professional Etiquette & Personal Branding',
          title: 'Personal Branding & Executive Headline Statement',
          type: 'written_response',
          category: 'Personal Branding',
          description: 'Craft an impactful professional headline, bio summary, and portfolio value statement.',
          instructions: 'Showcase your technical domains, leadership strengths, and career trajectory.'
        }
      ]
    };

    return activitiesByModule[moduleId] || [
      {
        id: `${moduleId}-practice-submission`,
        moduleId,
        moduleTitle: 'Module Activity',
        title: 'Core Activity Practical Submission',
        type: 'practice_task',
        category: 'Practical Task',
        description: 'Complete and officially submit the core laboratory activity.',
        instructions: 'Follow the guided instructions and submit your work for faculty evaluation.'
      }
    ];
  }

  /**
   * Submit an activity record for a student
   */
  static async submitActivity(
    submission: Omit<StudentActivitySubmission, 'id' | 'submittedAt' | 'status'>
  ): Promise<StudentActivitySubmission> {
    const studentRollNo = submission.studentRollNo.trim().toUpperCase();
    const id = `sub_${studentRollNo}_${submission.moduleId.trim()}_${submission.activityId.trim()}`;
    const nowIso = new Date().toISOString();

    const record: StudentActivitySubmission = {
      ...submission,
      id,
      studentRollNo,
      submittedAt: nowIso,
      status: 'submitted',
      facultyReviewed: false
    };

    const saved = await dbStorage.saveActivitySubmission(record);

    // Add audit log
    await dbStorage.addAuditLog(
      studentRollNo,
      submission.studentName || studentRollNo,
      'student',
      'ACTIVITY_SUBMITTED',
      `Student ${studentRollNo} submitted activity "${submission.activityTitle}" in module ${submission.moduleTitle}.`
    );

    return saved;
  }

  /**
   * Get single activity submission
   */
  static async getSubmission(
    studentRollNo: string,
    moduleId: string,
    activityId: string
  ): Promise<StudentActivitySubmission | null> {
    return await dbStorage.getActivitySubmission(studentRollNo, moduleId, activityId);
  }

  /**
   * Get all submissions for a student (optionally filtered by module)
   */
  static async getSubmissionsForStudent(
    studentRollNo: string,
    moduleId?: string
  ): Promise<StudentActivitySubmission[]> {
    return await dbStorage.getActivitySubmissionsForStudent(studentRollNo, moduleId);
  }

  /**
   * Get all submissions belonging ONLY to students assigned to the given faculty
   */
  static async getSubmissionsForFaculty(
    facultyId: string,
    allStudents: StudentProfile[],
    moduleId?: string,
    isAdministrator = false
  ): Promise<StudentActivitySubmission[]> {
    const allSubmissions = await dbStorage.getAllActivitySubmissions();

    if (isAdministrator) {
      if (moduleId) {
        return allSubmissions.filter((s) => s.moduleId === moduleId);
      }
      return allSubmissions;
    }

    const assignedStudents = FacultyAssignmentService.getAssignedStudentsForFaculty(
      facultyId,
      allStudents
    );
    const assignedRollNos = new Set(assignedStudents.map((s) => s.rollNo.toUpperCase().trim()));

    const filtered = allSubmissions.filter((sub) =>
      assignedRollNos.has(sub.studentRollNo.toUpperCase().trim())
    );

    if (moduleId) {
      return filtered.filter((s) => s.moduleId === moduleId);
    }
    return filtered;
  }

  /**
   * Mark activity as Reviewed by Faculty with optional remarks
   */
  static async markActivityReviewed(
    submissionId: string,
    facultyId: string,
    facultyName: string,
    remarks: string
  ): Promise<StudentActivitySubmission | null> {
    const updated = await dbStorage.updateActivitySubmissionStatus(
      submissionId,
      'reviewed',
      remarks,
      facultyId,
      facultyName
    );

    if (updated) {
      await dbStorage.addAuditLog(
        facultyId,
        facultyName,
        'faculty_incharge',
        'ACTIVITY_REVIEWED',
        `Faculty ${facultyName} reviewed activity "${updated.activityTitle}" for student ${updated.studentName} (${updated.studentRollNo}).`
      );
    }

    return updated;
  }

  /**
   * Allow student resubmission with reason
   */
  static async allowResubmission(
    submissionId: string,
    facultyId: string,
    facultyName: string,
    resubmissionReason: string
  ): Promise<StudentActivitySubmission | null> {
    const updated = await dbStorage.updateActivitySubmissionStatus(
      submissionId,
      'resubmission_allowed',
      undefined,
      facultyId,
      facultyName,
      resubmissionReason
    );

    if (updated) {
      await dbStorage.addAuditLog(
        facultyId,
        facultyName,
        'faculty_incharge',
        'RESUBMISSION_ALLOWED',
        `Faculty ${facultyName} enabled resubmission for "${updated.activityTitle}" (Student: ${updated.studentRollNo}). Note: ${resubmissionReason}`
      );
    }

    return updated;
  }

  /**
   * Check if an activity is currently locked from student editing
   */
  static isActivityLocked(submission: StudentActivitySubmission | null | undefined): boolean {
    if (!submission) return false;
    // Locked if submitted or reviewed. Unlocked if resubmission_allowed or not submitted.
    return submission.status === 'submitted' || submission.status === 'reviewed';
  }
}
