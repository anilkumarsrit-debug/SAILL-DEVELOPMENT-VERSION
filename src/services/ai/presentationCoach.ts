import { AIEvaluationResult } from '../../types';

export interface PublicSpeakingCriteria {
  organization: number;         // 0.0 - 2.0
  content: number;              // 0.0 - 2.0
  delivery: number;             // 0.0 - 2.0
  language: number;             // 0.0 - 2.0
  confidenceEngagement: number; // 0.0 - 2.0
}

export interface AudiencePersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  attitude: 'Curious' | 'Analytical' | 'Supportive' | 'Critical';
  currentReaction: 'Nodding' | 'Taking Notes' | 'Attentive' | 'Raising Hand' | 'Thoughtful';
  feedbackQuote: string;
}

export interface QAInteraction {
  id: string;
  askerName: string;
  askerRole: string;
  askerAvatar?: string;
  questionText: string;
  followUpQuestionText?: string;
  studentAnswer?: string;
  studentFollowUpAnswer?: string;
  aiEvaluation?: {
    score: number; // out of 2.0
    feedback: string;
    prepBreakdown?: {
      point: string;
      reason: string;
      example: string;
      pointSummary: string;
    };
  };
}

export interface Presentation10MarkEvaluation {
  totalScore: number; // 0.0 - 10.0
  performanceDescriptor: 'Distinction / Exemplary' | 'Proficient' | 'Developing' | 'Needs Focused Practice';
  criteria: PublicSpeakingCriteria;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  paceWPM: number;
  fillerWordCount: number;
  detectedFillerWords: string[];
  engagementPercent: number;
  qaPerformanceList: QAInteraction[];
  polishedOutlineSummary: string;
  suggestedNextStep: string;
}

export interface PresentationCoachInput {
  topicTitle: string;
  presentationType: 'Public Speaking' | 'JAM' | 'Elevator Pitch' | 'Technical Presentation' | 'Academic Defense' | 'Corporate Pitch';
  speechDurationSeconds: number;
  transcriptText?: string;
  hasAudioRecording?: boolean;
  outlineData?: {
    openingHook: string;
    keyPoint1: string;
    keyPoint2: string;
    keyPoint3: string;
    conclusion: string;
  };
  qaList?: QAInteraction[];
}

export interface PresentationFeedback extends AIEvaluationResult {
  paceWPM: number;
  fillerWordCount: number;
  detectedFillerWords: string[];
  engagementScore: number;
}

export async function analyzeSpeechMetrics(
  input: PresentationCoachInput
): Promise<PresentationFeedback> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const estimatedWPM = input.speechDurationSeconds > 0 
    ? Math.round(((input.transcriptText?.split(/\s+/).filter(Boolean).length || 120) / input.speechDurationSeconds) * 60)
    : 140;

  return {
    score: 86,
    overallFeedback: `Excellent speech delivery on "${input.topicTitle}". Your pace averaged ${estimatedWPM} WPM, which falls right in the optimal 130-150 WPM range for technical public speaking.`,
    strengths: [
      'Optimal speaking rate and clear pause strategy',
      'Strong opening hook to capture audience attention',
      'Confident projection and vocal modulation'
    ],
    improvements: [
      'Reduce filler pause words like "um" and "you know"',
      'Conclude with a high-impact call to action or summary statement'
    ],
    paceWPM: estimatedWPM,
    fillerWordCount: 2,
    detectedFillerWords: ['um', 'like'],
    engagementScore: 89,
    metrics: {
      Pace: `${estimatedWPM} WPM (Ideal: 130-150)`,
      FillerFrequency: 'Low (2 occurrences)',
      VocalClarity: '92%'
    },
    isSimulatedMode: true
  };
}

export async function evaluatePublicSpeaking10Marks(
  input: PresentationCoachInput
): Promise<Presentation10MarkEvaluation> {
  // Simulate AI evaluation delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const text = input.transcriptText || '';
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length > 0 ? words.length : 110;
  const durationMin = Math.max(0.5, input.speechDurationSeconds / 60);
  const estimatedWPM = Math.round(wordCount / durationMin);

  // Detect filler words
  const fillersRegex = /\b(um|uh|like|you know|actually|basically|sort of|kind of|i mean|err|ah)\b/gi;
  const matches = text.match(fillersRegex) || [];
  const fillerWordCount = matches.length;
  const detectedFillerWords = Array.from(new Set(matches.map((m) => m.toLowerCase())));

  // Calculate 5 criteria (max 2.0 each = 10.0 Total)
  // 1. Organization (Structure, Hook, Transitions, Conclusion)
  let organization = 1.8;
  if (input.outlineData?.openingHook && input.outlineData?.conclusion) {
    organization = 1.95;
  }

  // 2. Content (Domain depth, relevance, technical clarity)
  let content = 1.8;
  if (wordCount > 150) content = 1.9;

  // 3. Delivery (Pace WPM ideal 130-150, low fillers)
  let delivery = 1.8;
  if (estimatedWPM >= 120 && estimatedWPM <= 160) delivery += 0.1;
  if (fillerWordCount <= 3) delivery += 0.1;

  // 4. Language (Vocabulary, grammar, articulation)
  let language = 1.85;

  // 5. Confidence & Audience Engagement (Poise, Q&A, impact)
  let confidenceEngagement = 1.8;
  if (input.qaList && input.qaList.length > 0) {
    const answeredCount = input.qaList.filter((q) => q.studentAnswer && q.studentAnswer.trim().length > 10).length;
    if (answeredCount >= 2) confidenceEngagement = 1.95;
  }

  // Cap each criterion at 2.0
  organization = Math.min(2.0, Number(organization.toFixed(2)));
  content = Math.min(2.0, Number(content.toFixed(2)));
  delivery = Math.min(2.0, Number(delivery.toFixed(2)));
  language = Math.min(2.0, Number(language.toFixed(2)));
  confidenceEngagement = Math.min(2.0, Number(confidenceEngagement.toFixed(2)));

  const totalScore = Number((organization + content + delivery + language + confidenceEngagement).toFixed(1));

  let performanceDescriptor: 'Distinction / Exemplary' | 'Proficient' | 'Developing' | 'Needs Focused Practice' = 'Proficient';
  if (totalScore >= 9.0) performanceDescriptor = 'Distinction / Exemplary';
  else if (totalScore >= 7.5) performanceDescriptor = 'Proficient';
  else if (totalScore >= 6.0) performanceDescriptor = 'Developing';
  else performanceDescriptor = 'Needs Focused Practice';

  const engagementPercent = Math.min(98, Math.max(70, Math.round(totalScore * 9.5)));

  return {
    totalScore,
    performanceDescriptor,
    criteria: {
      organization,
      content,
      delivery,
      language,
      confidenceEngagement
    },
    overallFeedback: `Impressive speech on "${input.topicTitle}". You maintained an average pace of ${estimatedWPM} WPM (Ideal: 130–150 WPM) with ${fillerWordCount} filler pauses detected. Your structure was clear with logical signpost transitions between core points.`,
    strengths: [
      `Optimal speech delivery rate at ${estimatedWPM} WPM ensuring high listener clarity.`,
      `Strong structural framework with distinct opening hook and summary call-to-action.`,
      `Effective engagement during the AI Audience Q&A session with confident poise.`
    ],
    improvements: [
      fillerWordCount > 3
        ? `Reduce vocal hesitations (${detectedFillerWords.join(', ')}) by utilizing strategic 1-second silent pauses instead.`
        : `Vary vocal pitch inflection when emphasizing key technical statistics.`,
      `Incorporate a rhetorical question or real-world case study in the opening hook.`
    ],
    paceWPM: estimatedWPM,
    fillerWordCount,
    detectedFillerWords: detectedFillerWords.length > 0 ? detectedFillerWords : ['none detected'],
    engagementPercent,
    qaPerformanceList: input.qaList || [],
    polishedOutlineSummary: `Topic: ${input.topicTitle} | Type: ${input.presentationType}\nHook: ${input.outlineData?.openingHook || 'Engineers shape the future through clear ideas.'}\nKey Takeaway: Delivered in ${input.speechDurationSeconds}s at ${estimatedWPM} WPM with score ${totalScore}/10.0.`,
    suggestedNextStep: 'Save this evaluation report to your SRIT SAILL Digital Portfolio and record a refined version in the Speech Studio.'
  };
}

/**
 * Generate AI Audience Q&A Questions based on Presentation Topic and student transcript
 */
export function generateAudienceQuestions(topicTitle: string, presentationType?: string, transcript?: string): QAInteraction[] {
  const normTitle = (topicTitle || '').toLowerCase();
  const lowerTranscript = (transcript || '').toLowerCase();

  // Extract any salient topic words from the transcript if present
  let contextMention = '';
  if (lowerTranscript.length > 20) {
    if (lowerTranscript.includes('curiosity') || lowerTranscript.includes('toy') || lowerTranscript.includes('childhood')) {
      contextMention = 'You highlighted how early curiosity shaped your outlook';
    } else if (lowerTranscript.includes('placement') || lowerTranscript.includes('interview') || lowerTranscript.includes('recruit')) {
      contextMention = 'You emphasized placement readiness and campus interviews';
    } else if (lowerTranscript.includes('upi') || lowerTranscript.includes('smartphone') || lowerTranscript.includes('payment')) {
      contextMention = 'You noted everyday technologies like digital UPI and mobile apps';
    } else if (lowerTranscript.includes('transistor') || lowerTranscript.includes('microchip') || lowerTranscript.includes('semiconductor')) {
      contextMention = 'You shared the revolutionary evolution of semiconductor transistors';
    } else if (lowerTranscript.includes('plastic') || lowerTranscript.includes('recycle') || lowerTranscript.includes('green') || lowerTranscript.includes('waste')) {
      contextMention = 'You brought up critical challenges like plastic waste and sustainability';
    } else if (lowerTranscript.includes('tutor') || lowerTranscript.includes('prompt') || lowerTranscript.includes('cheating') || lowerTranscript.includes('integrity')) {
      contextMention = 'You highlighted personal AI tutors and academic integrity';
    } else if (lowerTranscript.includes('conflict') || lowerTranscript.includes('standup') || lowerTranscript.includes('teammate')) {
      contextMention = 'You highlighted communication routines and team project division';
    }
  }

  // 1. My Engineering Journey
  if (normTitle.includes('journey') || normTitle.includes('engineering journey')) {
    return [
      {
        id: 'q-1',
        askerName: 'Dr. Ramesh V.',
        askerRole: 'Senior Academic Faculty Judge',
        askerAvatar: '👨‍🏫',
        questionText: contextMention
          ? `${contextMention}. In your first-year experience so far, what specific engineering concept or laboratory experiment sparked the greatest curiosity for you, and how did it change your perspective?`
          : `In your engineering journey so far, what specific laboratory experiment or technical concept sparked the greatest curiosity for you, and how did it shape your learning goals?`,
        followUpQuestionText: `How do you plan to balance hands-on laboratory projects with theoretical exams as you progress into higher semesters?`
      },
      {
        id: 'q-2',
        askerName: 'Priya Sharma',
        askerRole: 'Corporate Campus Recruiter (TCS / Infosys)',
        askerAvatar: '👩‍💼',
        questionText: `When discussing your career aspirations with placement interviewers, what unique personal project or technical skill will you highlight to stand out from other candidates?`,
        followUpQuestionText: `What specific engineering domain or industry challenge do you see yourself contributing to in the next 3 to 4 years?`
      },
      {
        id: 'q-3',
        askerName: 'Anil K.',
        askerRole: 'Student Peer & Tech Club Lead',
        askerAvatar: '👨‍🎓',
        questionText: `Transitioning into rigorous college engineering courses can be challenging. What personal study routine or time management habit has helped you the most?`,
        followUpQuestionText: `How do you handle moments of frustration when an experiment or coding exercise does not work on the first attempt?`
      }
    ];
  }

  // 2. Importance of Communication Skills
  if (normTitle.includes('communication') || normTitle.includes('soft skills')) {
    return [
      {
        id: 'q-1',
        askerName: 'Prof. Lakshmi N.',
        askerRole: 'Department Evaluator & Placement Mentor',
        askerAvatar: '👩‍🏫',
        questionText: contextMention
          ? `${contextMention}. Many engineering students mistakenly believe technical knowledge alone guarantees career success. What concrete project scenario best demonstrates the danger of poor communication?`
          : `Many engineering students focus entirely on coding and technical theory. What real-world project scenario best illustrates why communication skills are equally vital?`,
        followUpQuestionText: `When presenting complex technical blueprints or algorithms to non-technical clients, how do you simplify the explanation without losing key details?`
      },
      {
        id: 'q-2',
        askerName: 'Vikram Seth',
        askerRole: 'Corporate Technical Hiring Manager',
        askerAvatar: '👨‍💼',
        questionText: `During placement group discussions and interviews, how can an introverted candidate actively practice and demonstrate confident body language and voice modulation?`,
        followUpQuestionText: `What daily routine or practice exercise would you recommend to a first-year classmate struggling with stage fear?`
      },
      {
        id: 'q-3',
        askerName: 'Divya R.',
        askerRole: 'Student Innovation President',
        askerAvatar: '👩‍🎓',
        questionText: `In student group assignments, poor communication often leads to missed deadlines or duplicated work. What communication strategy works best for project teams?`,
        followUpQuestionText: `How do you address a team member who is reluctant to speak up during project planning meetings?`
      }
    ];
  }

  // 3. Technology in Everyday Life
  if (normTitle.includes('technology in everyday') || normTitle.includes('everyday life')) {
    return [
      {
        id: 'q-1',
        askerName: 'Dr. Ramesh V.',
        askerRole: 'Senior Academic Faculty Judge',
        askerAvatar: '👨‍🏫',
        questionText: contextMention
          ? `${contextMention}. As smart automation and embedded sensors enter our homes and canteens, what is one major data privacy concern future engineers must address?`
          : `As smart technology and embedded sensors integrate into daily appliances, what is one key security or privacy concern future engineers must solve?`,
        followUpQuestionText: `How can young engineers design smart devices that protect user privacy by default rather than as an afterthought?`
      },
      {
        id: 'q-2',
        askerName: 'Priya Sharma',
        askerRole: 'Corporate Campus Recruiter',
        askerAvatar: '👩‍💼',
        questionText: `With digital infrastructure like UPI and automated navigation revolutionizing daily routines in India, what next technology breakthrough do you foresee having the largest social impact?`,
        followUpQuestionText: `How do we ensure these technological innovations remain accessible and user-friendly for rural and elderly populations?`
      },
      {
        id: 'q-3',
        askerName: 'Kavita M.',
        askerRole: 'Peer & Campus Tech Representative',
        askerAvatar: '👩‍🎓',
        questionText: `Digital distraction and excessive screen time are growing challenges for college students. What practical boundary or rule do you use to keep technology as an asset rather than a distraction?`,
        followUpQuestionText: `Do you think tech companies should build stronger digital well-being constraints into operating systems for young adults?`
      }
    ];
  }

  // 4. My Favourite Engineering Innovation
  if (normTitle.includes('favourite') || normTitle.includes('favorite') || normTitle.includes('innovation')) {
    return [
      {
        id: 'q-1',
        askerName: 'Dr. Ramesh V.',
        askerRole: 'Senior Academic Faculty Judge',
        askerAvatar: '👨‍🏫',
        questionText: contextMention
          ? `${contextMention}. You spoke passionately about this engineering breakthrough. What was the fundamental limitation of the previous technology that this innovation solved?`
          : `You highlighted a transformative engineering innovation. What was the fundamental limitation of older systems that this innovation revolutionized?`,
        followUpQuestionText: `What technical or material constraints must engineers overcome today to make this technology even more energy-efficient?`
      },
      {
        id: 'q-2',
        askerName: 'Vikram Seth',
        askerRole: 'Industry Enterprise Tech Lead',
        askerAvatar: '👨‍💼',
        questionText: `How has this specific innovation enabled new industries and career paths globally over the past few decades?`,
        followUpQuestionText: `If you were awarded student research funding today, what next-generation enhancement would you build upon this innovation?`
      },
      {
        id: 'q-3',
        askerName: 'Anil K.',
        askerRole: 'Student Peer Innovator',
        askerAvatar: '👨‍🎓',
        questionText: `How can first-year students apply the core engineering principles behind this invention to solve local problems on our college campus or in our district?`,
        followUpQuestionText: `Which aspect of this invention inspires your own future semester projects the most?`
      }
    ];
  }

  // 5. Social Media: Advantages and Disadvantages
  if (normTitle.includes('social media') || normTitle.includes('media')) {
    return [
      {
        id: 'q-1',
        askerName: 'Prof. Lakshmi N.',
        askerRole: 'Academic Evaluator & Student Welfare',
        askerAvatar: '👩‍🏫',
        questionText: contextMention
          ? `${contextMention}. You balanced both sides of social media. How can first-year engineering students strategically leverage professional platforms like LinkedIn or GitHub without falling prey to digital distractions?`
          : `How can first-year engineering students strategically leverage professional platforms like LinkedIn or GitHub for learning and career networking without getting caught in unproductive doom-scrolling?`,
        followUpQuestionText: `What role should universities and colleges play in promoting digital wellness and cyber safety among students?`
      },
      {
        id: 'q-2',
        askerName: 'Priya Sharma',
        askerRole: 'Corporate Campus Recruiter',
        askerAvatar: '👩‍💼',
        questionText: `Recruiters often review a candidate’s online footprint. What are the essential guidelines for maintaining a positive, credible online professional portfolio?`,
        followUpQuestionText: `How should students handle misinformation or unverified technical claims circulating on social media?`
      },
      {
        id: 'q-3',
        askerName: 'Divya R.',
        askerRole: 'Student Representative',
        askerAvatar: '👩‍🎓',
        questionText: `Algorithm-driven content feeds can shorten attention spans. What personal discipline technique do you use during semester exam preparations to maintain deep focus?`,
        followUpQuestionText: `What constructive advice would you share with a classmate feeling stressed due to social comparison online?`
      }
    ];
  }

  // 6. Artificial Intelligence in Education
  if (normTitle.includes('artificial intelligence') || normTitle.includes('ai in education') || normTitle.includes('ai')) {
    return [
      {
        id: 'q-1',
        askerName: 'Dr. Ramesh V.',
        askerRole: 'Senior Academic Faculty Judge',
        askerAvatar: '👨‍🏫',
        questionText: contextMention
          ? `${contextMention}. AI tools can generate code and answers in seconds. Where should engineering students draw the ethical line between AI-assisted concept learning and academic dishonesty?`
          : `AI tools can generate code explanations and math solutions in seconds. Where should students draw the ethical line between AI-assisted learning and academic dishonesty?`,
        followUpQuestionText: `How should educators and lab evaluators adapt assessments to ensure students genuinely understand the underlying principles?`
      },
      {
        id: 'q-2',
        askerName: 'Vikram Seth',
        askerRole: 'EdTech & AI Industry Lead',
        askerAvatar: '👨‍💼',
        questionText: `How can adaptive AI tutors help bridge learning gaps for students from diverse backgrounds and vernacular medium schools?`,
        followUpQuestionText: `What essential human mentoring qualities can AI never replace in an educational institution?`
      },
      {
        id: 'q-3',
        askerName: 'Anil K.',
        askerRole: 'Peer & AI Club Lead',
        askerAvatar: '👨‍🎓',
        questionText: `What is your favorite everyday AI learning tool, and what prompting strategy do you use to get the most accurate explanations?`,
        followUpQuestionText: `How do you verify whether an AI-generated explanation or code snippet is factually correct?`
      }
    ];
  }

  // 7. Environmental Protection
  if (normTitle.includes('environment') || normTitle.includes('environmental') || normTitle.includes('green') || normTitle.includes('sustainability')) {
    return [
      {
        id: 'q-1',
        askerName: 'Dr. Ramesh V.',
        askerRole: 'Faculty Environmental Committee Chair',
        askerAvatar: '👨‍🏫',
        questionText: contextMention
          ? `${contextMention}. Engineers frequently face trade-offs between low manufacturing cost and eco-friendly design. How can young engineers champion sustainable materials in engineering projects?`
          : `Engineers often face trade-offs between low production costs and eco-friendly design. How can young engineers prioritize sustainability in real-world engineering projects?`,
        followUpQuestionText: `What circular lifecycle recycling system would you propose for electronic waste generated on campus?`
      },
      {
        id: 'q-2',
        askerName: 'Priya Sharma',
        askerRole: 'Corporate Sustainability Lead',
        askerAvatar: '👩‍💼',
        questionText: `Which clean technology or renewable energy sector do you believe has the greatest potential to reduce carbon emissions over the next decade?`,
        followUpQuestionText: `How can industries balance meeting high consumer demand with strict zero-pollution environmental norms?`
      },
      {
        id: 'q-3',
        askerName: 'Kavita M.',
        askerRole: 'Campus Eco-Club President',
        askerAvatar: '👩‍🎓',
        questionText: `What is one concrete, actionable initiative that SRIT students can implement this month to reduce single-use plastic waste on our campus?`,
        followUpQuestionText: `How can we motivate students to actively participate in campus energy saving and waste segregation drives?`
      }
    ];
  }

  // 8. Teamwork in Engineering (and default fallback)
  return [
    {
      id: 'q-1',
      askerName: 'Prof. Lakshmi N.',
      askerRole: 'Academic Capstone Coordinator',
      askerAvatar: '👩‍🏫',
      questionText: contextMention
        ? `${contextMention}. In engineering project teams, differing technical opinions can create friction. What structured approach do you recommend for resolving disagreements constructively?`
        : `In engineering project teams, differing technical opinions often arise. What structured method do you recommend for resolving disagreements constructively?`,
      followUpQuestionText: `How do you ensure task division and project milestones remain transparent across all team members?`
    },
    {
      id: 'q-2',
      askerName: 'Vikram Seth',
      askerRole: 'Corporate Project Hiring Director',
      askerAvatar: '👨‍💼',
      questionText: `Recruiters place high value on team collaboration. How do you handle a scenario where a team member is struggling or fails to deliver their module before a critical deadline?`,
      followUpQuestionText: `What leadership quality is most critical when steering a diverse team through a difficult technical bottleneck?`
    },
    {
      id: 'q-3',
      askerName: 'Divya R.',
      askerRole: 'Student Project Team Leader',
      askerAvatar: '👩‍🎓',
      questionText: `What digital collaboration tools or meeting routines (such as quick standups) have proved most effective in your group project experiences?`,
      followUpQuestionText: `How do you celebrate small milestones and keep team morale high when a project encounters unexpected roadblocks?`
    }
  ];
}

/**
 * Evaluate student's PREP answer to audience query
 */
export function evaluateStudentPREPAnswer(answerText: string, questionText: string): {
  score: number;
  feedback: string;
  prepBreakdown: {
    point: string;
    reason: string;
    example: string;
    pointSummary: string;
  };
} {
  const trimmed = (answerText || '').trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 6) {
    return {
      score: 1.0,
      feedback: 'Brief response. Try structuring with the PREP method (Point, Reason, Example, Point) to provide a complete answer.',
      prepBreakdown: {
        point: 'Direct answer was very brief.',
        reason: 'Missing technical justification.',
        example: 'No specific project example or metric cited.',
        pointSummary: 'Add a concluding takeaway.'
      }
    };
  }

  const hasReasonWord = /\b(because|due to|as a result|since|reason|therefore|so that|in order to)\b/i.test(trimmed);
  const hasExampleWord = /\b(for example|such as|in our lab|for instance|like|in my experience|metric|project|experiment)\b/i.test(trimmed);
  const hasConclusionWord = /\b(in conclusion|to conclude|hence|overall|thus|in summary|ultimately|in short)\b/i.test(trimmed);

  let score = 1.6;
  if (wordCount > 18) score += 0.1;
  if (hasReasonWord) score += 0.1;
  if (hasExampleWord) score += 0.1;
  if (hasConclusionWord) score += 0.1;

  score = Math.min(2.0, Number(score.toFixed(1)));

  return {
    score,
    feedback: score >= 1.8
      ? 'Outstanding response! You effectively stated a clear point, supported it with sound reasoning, and grounded it with relevant examples.'
      : 'Solid response. To reach exemplary marks, explicitly ground your point with a concrete real-world or laboratory example.',
    prepBreakdown: {
      point: words.slice(0, Math.min(10, words.length)).join(' ') + '...',
      reason: hasReasonWord ? 'Clear justification identified.' : 'Consider adding explicit logical reasoning ("because / in order to").',
      example: hasExampleWord ? 'Effective example / project context cited.' : 'Add a concrete scenario or metric for extra impact.',
      pointSummary: hasConclusionWord ? 'Strong takeaway statement.' : 'Conclude with a final summary sentence.'
    }
  };
}

