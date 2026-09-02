import { normalizeTo10Scale, getPerformanceDescriptor } from '../../lib/scoring';

export type DebateCategory =
  | 'Technology'
  | 'Artificial Intelligence'
  | 'Education'
  | 'Environment'
  | 'Business'
  | 'Healthcare'
  | 'Engineering'
  | 'Social Issues'
  | 'Employment'
  | 'Ethics';

export interface DebateTopic {
  id: string;
  category: DebateCategory;
  motion: string;
  context: string;
  affirmativeKeyPoints: string[];
  negativeKeyPoints: string[];
  suggestedEvidence: string[];
}

export interface RebuttalEvaluationInput {
  motion: string;
  aiArgument: string;
  studentRebuttal: string;
  durationSeconds?: number;
}

export interface RebuttalEvaluationResult {
  totalScore: number; // 0 - 10
  logic: number; // 0 - 10
  evidence: number; // 0 - 10
  organization: number; // 0 - 10
  language: number; // 0 - 10
  professionalTone: number; // 0 - 10
  confidence: number; // 0 - 10
  descriptor: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface SimulatorState {
  topic: DebateTopic;
  position: 'Affirmative' | 'Negative';
  prepNotes: string;
  openingStatement: string;
  aiOpponentArgument: string;
  studentRebuttal: string;
  aiCounterargument: string;
  studentClosingStatement: string;
}

export interface SimulatorRubricEvaluation {
  totalScore: number; // 0 - 10
  descriptor: string;
  rubrics: {
    content: number; // 0 - 10
    reasoning: number;
    evidence: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    professionalTone: number;
    criticalThinking: number;
    persuasiveness: number;
    organization: number;
  };
  overallFeedback: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  facultyCommentSuggestion: string;
}

export interface FallacyItem {
  id: string;
  name: string;
  definition: string;
  example: string;
  whyFallacious: string;
  sampleQuestion: {
    argumentText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// 10 Curated Categories of R26 Debate Topics
export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 'dt-tech-1',
    category: 'Technology',
    motion: 'This House believes that tech corporations should be legally mandated to make proprietary software open-source after 5 years.',
    context: 'Examines balance between intellectual property incentives and democratizing technology for global innovation.',
    affirmativeKeyPoints: [
      'Prevents artificial monopolies and digital obsolescence.',
      'Accelerates scientific research and interoperability.'
    ],
    negativeKeyPoints: [
      'Reduces R&D financial incentives for tech pioneers.',
      'Raises cybersecurity concerns if legacy vulnerabilities are exposed.'
    ],
    suggestedEvidence: ['Gartner software lifecycle studies', 'Linux Foundation economic impact reports']
  },
  {
    id: 'dt-ai-1',
    category: 'Artificial Intelligence',
    motion: 'This House would prohibit autonomous AI systems from making binding medical diagnosis decisions without human oversight.',
    context: 'Focuses on medical ethics, algorithmic bias, and accountability in life-critical engineering systems.',
    affirmativeKeyPoints: [
      'Preserves human empathy and clinical judgment.',
      'Clarifies legal liability in medical malpractice cases.'
    ],
    negativeKeyPoints: [
      'Diagnostic AI exhibits lower error rates in early cancer detection than general practitioners.',
      'Scales healthcare delivery to rural and underserved regions.'
    ],
    suggestedEvidence: ['WHO AI Health Guidelines', 'Lancet Oncology diagnostic accuracy statistics']
  },
  {
    id: 'dt-edu-1',
    category: 'Education',
    motion: 'This House believes engineering curricula should replace traditional written final exams with project-based portfolio evaluations.',
    context: 'Debates assessment methodology in technical higher education.',
    affirmativeKeyPoints: [
      'Reflects real-world engineering teamwork and problem solving.',
      'Eliminates rote memorization in favor of practical synthesis.'
    ],
    negativeKeyPoints: [
      'Standardized exams ensure objective, uniform evaluation standards.',
      'Project grading is subject to team free-riding and subjective evaluator bias.'
    ],
    suggestedEvidence: ['IEEE Education Society workforce studies', 'ABET accreditation benchmarks']
  },
  {
    id: 'dt-env-1',
    category: 'Environment',
    motion: 'This House would impose carbon taxes directly on cloud computing data centers.',
    context: 'Addresses the carbon footprint of hyperscale data infrastructure.',
    affirmativeKeyPoints: [
      'Incentivizes tech firms to transition to 100% renewable energy.',
      'Internalizes environmental externalities of AI model training.'
    ],
    negativeKeyPoints: [
      'Increased costs will be passed on to startups and educational institutions.',
      'May drive data centers to regions with lax environmental regulations.'
    ],
    suggestedEvidence: ['IEA Data Center Energy Report', 'Greenpeace Clean Cloud Index']
  },
  {
    id: 'dt-bus-1',
    category: 'Business',
    motion: 'This House believes tech startups should prioritize profitability over rapid user acquisition.',
    context: 'Contrasts sustainable unit economics with venture-capital-driven hypergrowth.',
    affirmativeKeyPoints: [
      'Builds resilient companies resistant to economic downturns.',
      'Protects employees from sudden mass layoffs during market contractions.'
    ],
    negativeKeyPoints: [
      'Hypergrowth creates winner-take-all network effects essential in modern tech.',
      'Early profitability constraints stifle risky, groundbreaking technological bets.'
    ],
    suggestedEvidence: ['Harvard Business Review startup failure analysis', 'YC benchmark reports']
  },
  {
    id: 'dt-health-1',
    category: 'Healthcare',
    motion: 'This House believes DNA sequencing data should be strictly classified as non-commercial private property.',
    context: 'Examines genetic privacy vs pharmaceutical research monetization.',
    affirmativeKeyPoints: [
      'Prevents price discrimination by health insurance underwriters.',
      'Protects citizens from non-consensual genetic surveillance.'
    ],
    negativeKeyPoints: [
      'Commercial genomic databases accelerate rare disease drug discovery.',
      'Anonymized aggregate data sharing benefits public health epidemiology.'
    ],
    suggestedEvidence: ['Global Alliance for Genomics and Health privacy frameworks', 'Bioethics Council reports']
  },
  {
    id: 'dt-[#eng-1',
    category: 'Engineering',
    motion: 'This House believes ethical engineering reviews should carry veto power over product launch timelines.',
    context: 'Focuses on safety-first engineering vs commercial time-to-market pressure.',
    affirmativeKeyPoints: [
      'Prevents catastrophic failures (e.g. aerospace or structural engineering faults).',
      'Upholds professional engineering codes of ethics.'
    ],
    negativeKeyPoints: [
      'Veto power can be abused by risk-averse committees to stall innovation.',
      'Iterative deployment with post-launch monitoring allows faster user value.'
    ],
    suggestedEvidence: ['National Society of Professional Engineers (NSPE) Code of Ethics', 'Boeing 737 MAX case study']
  },
  {
    id: 'dt-soc-1',
    category: 'Social Issues',
    motion: 'This House would regulate algorithm-driven social media recommendation feeds as public utilities.',
    context: 'Addresses algorithmic echo chambers, mental health, and democratic discourse.',
    affirmativeKeyPoints: [
      'Reduces radicalization and misinformation spread.',
      'Enforces transparency in content moderation algorithms.'
    ],
    negativeKeyPoints: [
      'Infringes on private corporate freedom of speech and platform design.',
      'Government oversight risks political censorship of opposing viewpoints.'
    ],
    suggestedEvidence: ['Stanford Internet Observatory reports', 'EU Digital Services Act provisions']
  },
  {
    id: 'dt-emp-1',
    category: 'Employment',
    motion: 'This House believes a 4-day work week should be mandated across all engineering technology sectors.',
    context: 'Debates productivity, burnout prevention, and work-life harmony in engineering.',
    affirmativeKeyPoints: [
      'Reduces cognitive fatigue, resulting in lower software bug rates.',
      'Boosts employee retention and mental well-being.'
    ],
    negativeKeyPoints: [
      'Reduces total operational output in continuous manufacturing and tech support.',
      'Creates scheduling friction in global cross-time-zone engineering projects.'
    ],
    suggestedEvidence: ['4 Day Week Global trials in UK & Japan', 'Gallup Workplace Productivity Index']
  },
  {
    id: 'dt-eth-1',
    category: 'Ethics',
    motion: 'This House believes developers of generative AI should pay licensing royalties to human artists whose work was included in training datasets.',
    context: 'Explores copyright law, fair use, and creator compensation in the AI era.',
    affirmativeKeyPoints: [
      'Protects artistic livelihoods from devaluation by automated systems.',
      'Establishes fair compensation for intellectual property utilization.'
    ],
    negativeKeyPoints: [
      'Training models on public data is analogous to human learning and falls under fair use.',
      'Royalty tracking across billions of parameter tokens is technically infeasible.'
    ],
    suggestedEvidence: ['US Copyright Office Generative AI Guidance', 'WIPO IP and Frontier Technologies reports']
  }
];

export const FALLACIES_LIST: FallacyItem[] = [
  {
    id: 'f-1',
    name: 'Ad Hominem',
    definition: 'Attacking the opponent\'s character, background, or personal traits instead of engaging with their actual argument.',
    example: '"We cannot trust Professor Rao\'s solar panel efficiency study because he is known to be arrogant in faculty meetings."',
    whyFallacious: 'A person\'s demeanor or personal habits do not invalidate the scientific accuracy of their data.',
    sampleQuestion: {
      argumentText: '"My opponent claims open-source code is safer, but he failed his database exam last semester, so his technical opinion is worthless."',
      options: ['Strawman', 'Ad Hominem', 'False Dilemma', 'Circular Reasoning'],
      correctIndex: 1,
      explanation: 'This attacks the person\'s exam history rather than addressing the security merits of open-source software.'
    }
  },
  {
    id: 'f-2',
    name: 'Strawman',
    definition: 'Misrepresenting, exaggerating, or oversimplifying an opponent\'s argument to make it easier to attack.',
    example: '"Opponent wants to increase server backup frequency? So basically you want us to burn our entire IT budget on hard drives and bankrupt the college!"',
    whyFallacious: 'The opponent suggested a routine backup update, not bankrupting the college.',
    sampleQuestion: {
      argumentText: '"If we allow students to use calculators in basic math, next thing you know they won\'t even know how to add 2+2 without an iPad!"',
      options: ['Strawman', 'Appeal to Emotion', 'Bandwagon', 'Hasty Generalization'],
      correctIndex: 0,
      explanation: 'Distorts a reasonable tool policy into an extreme caricature of total mathematical illiteracy.'
    }
  },
  {
    id: 'f-3',
    name: 'False Dilemma',
    definition: 'Presenting only two extreme choices when additional viable alternatives exist.',
    example: '"Either we switch to 100% renewable energy by next month, or we accept total climate destruction."',
    whyFallacious: 'Ignores phased transitions, hybrid grids, and nuclear energy integration.',
    sampleQuestion: {
      argumentText: '"Either our engineering lab adopts AI tools immediately, or our graduates will be completely unemployable in the modern job market."',
      options: ['Slippery Slope', 'False Dilemma', 'Ad Hominem', 'Bandwagon'],
      correctIndex: 1,
      explanation: 'Frames the situation as a binary choice between immediate adoption or total failure, ignoring gradual integration.'
    }
  },
  {
    id: 'f-4',
    name: 'Slippery Slope',
    definition: 'Asserting without evidence that a small initial step will inevitably trigger a chain reaction leading to extreme consequences.',
    example: '"If we grant smart devices access to home Wi-Fi, cybercriminals will take over power grids and cause national blackout chaos."',
    whyFallacious: 'Assumes an unstoppable catastrophic sequence without demonstrating causal links.',
    sampleQuestion: {
      argumentText: '"If we let students submit lab reports 10 minutes late today, tomorrow no one will submit assignments, and eventually the entire university accreditation will fail!"',
      options: ['Circular Reasoning', 'Slippery Slope', 'Hasty Generalization', 'Strawman'],
      correctIndex: 1,
      explanation: 'Unreasonably escalates a minor grace period into institutional collapse.'
    }
  },
  {
    id: 'f-5',
    name: 'Appeal to Emotion',
    definition: 'Manipulating feelings (fear, pity, guilt, pride) instead of presenting a valid logical argument.',
    example: '"Think of the poor helpless computers sitting turned off at night! We must leave them powered on forever!"',
    whyFallacious: 'Emotional appeals do not provide logical or empirical evidence for decision-making.',
    sampleQuestion: {
      argumentText: '"Imagine the heartbreak of a student whose code fails at midnight! That is why we should abolish all coding assignment deadlines!"',
      options: ['Appeal to Emotion', 'Ad Hominem', 'False Dilemma', 'Bandwagon'],
      correctIndex: 0,
      explanation: 'Relies on emotional pity rather than assessing academic learning objectives.'
    }
  },
  {
    id: 'f-6',
    name: 'Bandwagon',
    definition: 'Arguing that a claim must be true or desirable simply because many people or top companies believe/do it.',
    example: '"Every top Silicon Valley company uses Python, so C++ is obsolete and should never be taught in universities."',
    whyFallacious: 'Popularity does not equal technological necessity for embedded systems or low-level performance.',
    sampleQuestion: {
      argumentText: '"Over 90% of students use AI for essay writing, so SRIT should make AI essay generation mandatory for all courses."',
      options: ['Circular Reasoning', 'Bandwagon', 'Strawman', 'Ad Hominem'],
      correctIndex: 1,
      explanation: 'Appeals to popular usage statistics to justify academic policy rather than evaluating pedagogical value.'
    }
  },
  {
    id: 'f-7',
    name: 'Hasty Generalization',
    definition: 'Drawing a broad, sweeping conclusion based on an insufficient or unrepresentative sample size.',
    example: '"My laptop crashed twice after updating Windows 11, so Windows 11 is guaranteed to crash every single computer on campus."',
    whyFallacious: 'Generalizes two personal incidents to millions of devices without statistical validity.',
    sampleQuestion: {
      argumentText: '"I interviewed two software engineers who said they rarely use calculus, so calculus should be removed from all engineering degrees worldwide."',
      options: ['False Dilemma', 'Hasty Generalization', 'Appeal to Emotion', 'Slippery Slope'],
      correctIndex: 1,
      explanation: 'Extrapolates a global curriculum recommendation from a sample size of just two individuals.'
    }
  },
  {
    id: 'f-8',
    name: 'Circular Reasoning',
    definition: 'An argument where the conclusion is already assumed in the premise.',
    example: '"Quantum computing is superior because it operates using quantum mechanics, which makes it superior."',
    whyFallacious: 'Restates the assertion in different words without providing external supporting evidence.',
    sampleQuestion: {
      argumentText: '"This proprietary engineering software is trustworthy because the company advertisement states that they are a trusted brand."',
      options: ['Circular Reasoning', 'Ad Hominem', 'Strawman', 'False Dilemma'],
      correctIndex: 0,
      explanation: 'Uses the claim of being trusted to prove that the software is trustworthy.'
    }
  }
];

export async function evaluateRebuttal(input: RebuttalEvaluationInput): Promise<RebuttalEvaluationResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = input.studentRebuttal.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return {
      totalScore: 4,
      logic: 4,
      evidence: 3,
      organization: 4,
      language: 5,
      professionalTone: 5,
      confidence: 4,
      descriptor: 'Requires Additional Practice',
      feedback: 'Your rebuttal response is too brief. Provide a structured response with a clear counter-claim, empirical evidence, and logical breakdown.',
      strengths: ['Initial attempt recorded'],
      improvements: ['Expand length to at least 40-80 words', 'Cite specific counter-evidence or statistics']
    };
  }

  // Calculate scores based on argument structure indicators
  const hasEvidenceKeywords = /(percent|statistic|study|data|research|according to|for instance|for example|ieee|report)/i.test(text);
  const hasLogicConnectors = /(however|furthermore|consequently|therefore|despite|specifically|whereas|in contrast)/i.test(text);
  const hasRefutationMarkers = /(opponent claims|while it is true|the flaw in this|this overlooks|fails to consider)/i.test(text);

  let logic = 7;
  let evidence = 6;
  let organization = 7;
  let language = 8;
  let professionalTone = 8;
  let confidence = 7;

  if (hasRefutationMarkers) logic += 1.5;
  if (hasLogicConnectors) organization += 1.5;
  if (hasEvidenceKeywords) evidence += 2.5;
  if (wordCount > 50) confidence += 1.5;

  logic = Math.min(10, Math.round(logic));
  evidence = Math.min(10, Math.round(evidence));
  organization = Math.min(10, Math.round(organization));
  language = Math.min(10, Math.round(language));
  professionalTone = Math.min(10, Math.round(professionalTone));
  confidence = Math.min(10, Math.round(confidence));

  const avgScore = Math.round((logic + evidence + organization + language + professionalTone + confidence) / 6);
  const totalScore = normalizeTo10Scale(avgScore);
  const descriptor = getPerformanceDescriptor(totalScore);

  return {
    totalScore,
    logic,
    evidence,
    organization,
    language,
    professionalTone,
    confidence,
    descriptor,
    feedback: `Good rebuttal execution. You effectively addressed the core premise of "${input.motion.substring(0, 45)}...". ${
      hasEvidenceKeywords ? 'Great use of evidence and empirical support.' : 'To improve further, integrate specific numerical statistics or academic references.'
    }`,
    strengths: [
      hasRefutationMarkers ? 'Direct refutation of opponent premise' : 'Clear counter-assertion',
      hasLogicConnectors ? 'Smooth transitional logic' : 'Audible structure',
      'Maintained respectful academic tone'
    ],
    improvements: [
      hasEvidenceKeywords ? 'Elaborate on real-world engineering case studies' : 'Incorporate concrete statistics (e.g. percentages or studies)',
      'Conclude with a sharp impact statement reinforcing your team position'
    ]
  };
}

export async function evaluateSimulatorSession(state: SimulatorState): Promise<SimulatorRubricEvaluation> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const totalWords = (state.openingStatement + ' ' + state.studentRebuttal + ' ' + state.studentClosingStatement).split(/\s+/).filter(Boolean).length;

  const content = Math.min(10, 7 + (totalWords > 100 ? 2 : 1));
  const reasoning = Math.min(10, 8 + (state.studentRebuttal.length > 50 ? 1.5 : 0.5));
  const evidence = Math.min(10, /(data|study|percent|report|evidence|research|ieee)/i.test(state.studentRebuttal + state.openingStatement) ? 9 : 6);
  const grammar = 9;
  const vocabulary = 8;
  const fluency = Math.min(10, 7 + (totalWords > 80 ? 2 : 1));
  const professionalTone = 9;
  const criticalThinking = Math.min(10, reasoning + 0.5);
  const persuasiveness = Math.min(10, content + 0.5);
  const organization = 8.5;

  const sum = content + reasoning + evidence + grammar + vocabulary + fluency + professionalTone + criticalThinking + persuasiveness + organization;
  const rawAvg = sum / 10;
  const totalScore = normalizeTo10Scale(rawAvg);
  const descriptor = getPerformanceDescriptor(totalScore);

  return {
    totalScore,
    descriptor,
    rubrics: {
      content: Math.round(content),
      reasoning: Math.round(reasoning),
      evidence: Math.round(evidence),
      grammar: Math.round(grammar),
      vocabulary: Math.round(vocabulary),
      fluency: Math.round(fluency),
      professionalTone: Math.round(professionalTone),
      criticalThinking: Math.round(criticalThinking),
      persuasiveness: Math.round(persuasiveness),
      organization: Math.round(organization)
    },
    overallFeedback: `Outstanding performance in the AI Debate Simulator on the motion: "${state.topic.motion}". Your opening speech established a solid Claim-Evidence-Reasoning foundation, and your rebuttal effectively disassembled the AI opponent's counter-arguments.`,
    keyStrengths: [
      'Structured Claim-Evidence-Reasoning delivery',
      'Quick logical identification of opponent assumptions during rebuttal',
      'Exemplary professional debate etiquette and academic vocabulary'
    ],
    areasForGrowth: [
      'Incorporate additional quantitative benchmarks during the opening speech',
      'Extend the closing statement to synthesize both speaker turns into a final impact calculus'
    ],
    facultyCommentSuggestion: `Student demonstrated strong critical thinking and structured argumentation on ${state.topic.category} debate motion. Evaluated at ${totalScore}/10 (${descriptor}).`
  };
}
