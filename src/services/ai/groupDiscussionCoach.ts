import { normalizeTo10Scale, getPerformanceDescriptor } from '../../lib/scoring';
import { GoogleGenAI } from '@google/genai';

export type GDRole = 'initiator' | 'contributor' | 'harmonizer' | 'summarizer' | 'moderator';

export interface GDSimulatorParticipant {
  id: string;
  name: string;
  avatar: string;
  role: GDRole;
  title: string;
  personality: string;
  speakingStyle: string;
}

export interface GDTurn {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  text: string;
  timestamp: string;
  sentiment?: 'neutral' | 'supportive' | 'counter' | 'questioning';
  keyPoint?: string;
  isStudent?: boolean;
}

export interface GDCriteriaBreakdown {
  contentQuality: number;  // 0.0 - 1.0
  fluency: number;         // 0.0 - 1.0
  confidence: number;      // 0.0 - 1.0
  leadership: number;      // 0.0 - 1.0
  listening: number;       // 0.0 - 1.0
  teamwork: number;        // 0.0 - 1.0
  vocabulary: number;      // 0.0 - 1.0
  grammar: number;         // 0.0 - 1.0
  relevance: number;       // 0.0 - 1.0
  conclusion: number;      // 0.0 - 1.0
}

export interface GDEvaluationInput {
  topicTitle: string;
  topicCategory: string;
  userTurns: GDTurn[];
  allTurns: GDTurn[];
  userRoleChoice: string;
  durationSeconds: number;
}

export interface GDDiscussionSummary {
  mainPointsRaised: string[];
  keyStudentContributions: string[];
  discussionDevelopment: string;
  finalConclusion: string;
}

export interface GDEvaluationResult {
  totalScore: number; // 0.0 - 10.0
  criteria: GDCriteriaBreakdown;
  performanceDescriptor: string;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  leadershipRating: 'Outstanding Leader' | 'Strong Contributor' | 'Passive Listener' | 'Needs Active Engagement';
  participationRatePercent: number;
  keyContributions: string[];
  suggestedInterventions: string[];
  polishedSummary: string;
  summary: GDDiscussionSummary;
  isSimulatedMode: boolean;
}

export const AI_SIMULATOR_PARTICIPANTS: GDSimulatorParticipant[] = [
  {
    id: 'ai-01',
    name: 'Rohan Verma',
    avatar: '👨‍💻',
    role: 'contributor',
    title: 'Analytical & Technical Peer',
    personality: 'Focuses on engineering realities, empirical metrics, systems architecture, and tooling.',
    speakingStyle: 'Data-driven, respectful, structured.'
  },
  {
    id: 'ai-02',
    name: 'Ananya Roy',
    avatar: '👩‍🔬',
    role: 'harmonizer',
    title: 'Social Impact & Consensus Peer',
    personality: 'Highlights human, ethical, team synergy, and consensus dimensions.',
    speakingStyle: 'Empathic, inquisitive, constructive.'
  },
  {
    id: 'ai-03',
    name: 'Dr. V. Sharma',
    avatar: '👨‍🏫',
    role: 'moderator',
    title: 'GD Panel Evaluator & Moderator',
    personality: 'Conducts opening, turn-taking supervision, and closing consensus synthesis.',
    speakingStyle: 'Authoritative, objective, encouraging.'
  }
];

/**
 * Generates dynamic AI response responding directly to what the student uttered
 */
export async function generateAIParticipantResponse(
  topicTitle: string,
  history: GDTurn[],
  participant: GDSimulatorParticipant,
  exchangeIndex: number = 1
): Promise<string> {
  const studentTurns = history.filter((t) => t.isStudent);
  const lastStudentTurn = studentTurns.length > 0 ? studentTurns[studentTurns.length - 1] : null;
  const studentSpokenText = lastStudentTurn?.text || '';
  const lower = studentSpokenText.toLowerCase();

  // Moderator opening & closing
  if (participant.role === 'moderator') {
    if (exchangeIndex >= 5) {
      return `Thank you everyone. Time is up. We have heard comprehensive viewpoints balancing automated tools, human software architecture, and team collaboration. I appreciate the structured reasoning and respectful turn-taking demonstrated throughout this discussion.`;
    }
    return `Welcome candidates to this campus recruitment GD on "${topicTitle}". You have an open floor for collaborative dialogue. Please present your initial position, define the scope, and share your reasoning. Who would like to initiate?`;
  }

  // Try Gemini API for dynamic contextual AI responses if key is configured
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
  const apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined) || metaEnv?.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10 && studentSpokenText.trim().length > 3) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const historyContext = history.slice(-6).map((t) => `${t.speakerName} (${t.speakerRole}): "${t.text}"`).join('\n');
      const prompt = `You are role-playing as "${participant.name}", a participant in a First-Year Engineering placement Group Discussion on the topic: "${topicTitle}".
Your persona: ${participant.title}. ${participant.personality}
Your speaking style: ${participant.speakingStyle}.

Recent conversation history:
${historyContext}

The student just spoke: "${studentSpokenText}"

Respond directly to the student's point in 2-3 concise spoken sentences (35-65 words). Stay in character as ${participant.name}. Be polite, professional, and conversational. Do not use quotes or prefixes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = (response.text || '').trim();
      if (responseText && responseText.length > 15) {
        return responseText;
      }
    } catch (e) {
      console.warn('Gemini dynamic GD participant response fallback:', e);
    }
  }

  // Natural fallback delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Extract keywords to ground response dynamically in student's actual contribution
  let extractedSnippet = 'your argument';
  if (lower.includes('replace') || lower.includes('job') || lower.includes('career')) {
    extractedSnippet = 'the concern around developer workforce transition';
  } else if (lower.includes('code') || lower.includes('syntax') || lower.includes('copilot') || lower.includes('tool')) {
    extractedSnippet = 'your point regarding automated code generation tools';
  } else if (lower.includes('architecture') || lower.includes('design') || lower.includes('system') || lower.includes('complex')) {
    extractedSnippet = 'your insight on system architecture and high-level engineering';
  } else if (lower.includes('test') || lower.includes('security') || lower.includes('vulnerability') || lower.includes('debug')) {
    extractedSnippet = 'the emphasis you placed on cybersecurity and verification';
  } else if (lower.includes('agree') || lower.includes('consensus') || lower.includes('hybrid') || lower.includes('balance')) {
    extractedSnippet = 'your proposal for a balanced collaborative framework';
  } else if (studentSpokenText.trim().length > 15) {
    const words = studentSpokenText.trim().split(/\s+/).slice(0, 6).join(' ');
    extractedSnippet = `"${words}..."`;
  }

  // Exchange 1: Rohan Verma (Technical Peer) responds to Student's opening
  if (exchangeIndex === 1) {
    if (lower.includes('not replace') || lower.includes('cannot') || lower.includes('human')) {
      return `I agree with ${extractedSnippet}. In real enterprise development, while LLMs generate standard boilerplate code quickly, 70% of engineering time goes into domain modeling, legacy integration, and edge-case debugging. What do you think about how this affects entry-level developers specifically?`;
    } else if (lower.includes('will replace') || lower.includes('automation') || lower.includes('fast')) {
      return `That is a thought-provoking perspective regarding ${extractedSnippet}. However, looking at current compiler and autonomous agent research, AI still struggles with context-heavy architectural decisions and business logic alignment. How do you propose companies handle AI reliability risks?`;
    } else {
      return `I appreciate how you initiated the scope focusing on ${extractedSnippet}. Looking at industry benchmarks, AI is augmenting programmer velocity by roughly 30%, but human oversight remains legally and technically essential. What are your thoughts on quality assurance?`;
    }
  }

  // Exchange 2: Ananya Roy (Harmonizer & Ethics Peer) responds to Student's second turn
  if (exchangeIndex === 2) {
    if (lower.includes('entry') || lower.includes('student') || lower.includes('skill') || lower.includes('learn')) {
      return `Building directly on ${extractedSnippet}, we also need to consider the human learning curve. If juniors rely solely on AI assistance without understanding core data structures, problem-solving intuition may diminish. How should universities adapt their training?`;
    } else if (lower.includes('security') || lower.includes('risk') || lower.includes('privacy') || lower.includes('data')) {
      return `You highlighted a vital dimension regarding ${extractedSnippet}. Intellectual property leaks and hallucinated dependencies pose real corporate hazards. Balanced developer governance and code audit guidelines must accompany any AI adoption.`;
    } else {
      return `I resonate with ${extractedSnippet}. Alongside technical viability, developer satisfaction and creative problem-solving are core to team culture. AI should free engineers from repetitive tasks rather than diminish their creative ownership.`;
    }
  }

  // Exchange 3: Rohan Verma (Technical Peer) responds to Student's third turn
  if (exchangeIndex === 3) {
    return `That reinforces the engineering consensus regarding ${extractedSnippet}. In high-scale distributed systems, automated tooling handles repetitive telemetry and unit tests, allowing engineers to focus on fault tolerance and system resilience. It appears we are moving toward a symbiotic co-pilot model rather than outright replacement.`;
  }

  // Exchange 4: Ananya Roy (Harmonizer) agrees and invites consensus
  if (exchangeIndex === 4) {
    return `I completely align with ${extractedSnippet}. Our group is reaching a mature consensus: AI transforms the developer role from syntax writing to system orchestrator and validator. Before our session concludes, would someone like to summarize our 3 unified recommendations?`;
  }

  // Exchange 5: Ananya Roy responds to student's final summary turn
  if (exchangeIndex === 5) {
    return `Excellent synthesis. You have captured our core takeaways accurately: developer empowerment, architectural ownership, and robust governance. I believe our group has arrived at a very solid consensus.`;
  }

  // Fallback / General turn
  return `Building upon ${extractedSnippet}, our discussion clearly demonstrates that combining AI speed with human contextual reasoning delivers the highest quality engineering outcomes.`;
}

/**
 * Computes 10-Mark Rubric Evaluation based on 5-Exchange interactive GD session
 */
export async function evaluateGDSession(input: GDEvaluationInput): Promise<GDEvaluationResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const userTurnCount = input.userTurns.length;
  const totalTurns = Math.max(1, input.allTurns.length);
  const participationRatePercent = Math.min(100, Math.round((userTurnCount / totalTurns) * 100));

  const fullUserText = input.userTurns.map((t) => t.text).join(' ');
  const lowerText = fullUserText.toLowerCase();
  const totalUserWords = fullUserText.split(/\s+/).filter(Boolean).length;

  // Criteria scoring 0.0 - 1.0
  let contentQuality = 0.8;
  if (totalUserWords >= 40 && (lowerText.includes('system') || lowerText.includes('architecture') || lowerText.includes('engineer') || lowerText.includes('data') || lowerText.includes('code') || lowerText.includes('ai'))) contentQuality = 1.0;
  else if (totalUserWords < 15) contentQuality = 0.6;

  let fluency = 0.9;
  if (totalUserWords >= 30 && !lowerText.includes('um') && !lowerText.includes('uh')) fluency = 1.0;

  let confidence = userTurnCount >= 4 ? 1.0 : userTurnCount >= 2 ? 0.8 : 0.6;

  let leadership = 0.8;
  if (input.userRoleChoice === 'initiator' || lowerText.includes('summarize') || lowerText.includes('consensus') || lowerText.includes('recommend') || userTurnCount >= 5) {
    leadership = 1.0;
  } else if (userTurnCount >= 3) {
    leadership = 0.9;
  }

  let listening = 0.8;
  if (lowerText.includes('rohan') || lowerText.includes('ananya') || lowerText.includes('agree') || lowerText.includes('point') || lowerText.includes('as mentioned') || lowerText.includes('building on')) {
    listening = 1.0;
  }

  let teamwork = 0.8;
  if (lowerText.includes('our group') || lowerText.includes('we') || lowerText.includes('together') || lowerText.includes('peers') || userTurnCount >= 4) {
    teamwork = 1.0;
  }

  let vocabulary = 0.8;
  if (lowerText.includes('perspective') || lowerText.includes('dimension') || lowerText.includes('framework') || lowerText.includes('consequently') || lowerText.includes('architecture') || lowerText.includes('oversight')) {
    vocabulary = 1.0;
  }

  let grammar = totalUserWords >= 25 ? 1.0 : 0.8;
  let relevance = lowerText.includes('ai') || lowerText.includes('engineer') || lowerText.includes('software') || lowerText.includes('developer') ? 1.0 : 0.8;
  let conclusion = userTurnCount >= 4 || lowerText.includes('conclusion') || lowerText.includes('summar') ? 1.0 : 0.8;

  const criteria: GDCriteriaBreakdown = {
    contentQuality: Number(contentQuality.toFixed(1)),
    fluency: Number(fluency.toFixed(1)),
    confidence: Number(confidence.toFixed(1)),
    leadership: Number(leadership.toFixed(1)),
    listening: Number(listening.toFixed(1)),
    teamwork: Number(teamwork.toFixed(1)),
    vocabulary: Number(vocabulary.toFixed(1)),
    grammar: Number(grammar.toFixed(1)),
    relevance: Number(relevance.toFixed(1)),
    conclusion: Number(conclusion.toFixed(1))
  };

  const totalScore = Number(
    (
      criteria.contentQuality +
      criteria.fluency +
      criteria.confidence +
      criteria.leadership +
      criteria.listening +
      criteria.teamwork +
      criteria.vocabulary +
      criteria.grammar +
      criteria.relevance +
      criteria.conclusion
    ).toFixed(1)
  );

  let leadershipRating: GDEvaluationResult['leadershipRating'] = 'Strong Contributor';
  if (totalScore >= 8.8 && criteria.leadership >= 0.9) {
    leadershipRating = 'Outstanding Leader';
  } else if (totalScore < 6.0) {
    leadershipRating = 'Needs Active Engagement';
  }

  const strengths: string[] = [];
  if (criteria.listening >= 0.9) strengths.push('Active Collaborative Listening: Effectively acknowledged and built upon peer arguments (Rohan & Ananya).');
  if (criteria.leadership >= 0.9) strengths.push('Strategic GD Facilitation: Steered the team toward a balanced, multi-dimensional consensus.');
  if (criteria.contentQuality >= 0.9) strengths.push('Technical Reasoning: Grounded points in software engineering realities rather than emotional assertions.');
  if (criteria.teamwork >= 0.9) strengths.push('Inclusive Language: Employed cooperative phrasing ("our group", "we agree") fostering team cohesion.');
  if (strengths.length === 0) strengths.push('Maintained polite turn-taking and consistent participation throughout the session.');

  const improvements: string[] = [];
  if (criteria.listening < 1.0) improvements.push('Reference peers explicitly using phrases like "As Rohan noted..." or "Building on Ananya\'s point..." to maximize listening marks.');
  if (criteria.vocabulary < 1.0) improvements.push('Incorporate professional discourse markers like "Nonetheless", "Furthermore", and "Consequently".');
  if (criteria.conclusion < 1.0) improvements.push('Initiate a closing consensus summary before the moderator concludes the round.');
  if (improvements.length === 0) improvements.push('Continue practicing diplomatic re-entry phrases when multiple peers speak simultaneously.');

  const keyContributions = input.userTurns.map((t) => t.text).filter(Boolean);
  if (keyContributions.length === 0) {
    keyContributions.push('Participated actively across 5 structured dialogue exchanges.');
  }

  // Construct structured 4-part Discussion Summary
  const mainPointsRaised = [
    'AI Tools as Force Multipliers: Generative AI and automated testing accelerate boilerplate development and syntax routines by 30-40%.',
    'Human Architectural Primacy: High-level system design, edge-case debugging, domain logic, and fault tolerance remain irreplaceable human engineering competencies.',
    'Junior Developer Skill Evolution: Ensuring foundational problem-solving and algorithmic thinking are not lost to over-reliance on code assistants.',
    'Security, IP & Governance: Code vulnerability scanning, data privacy protection, and ethical oversight are vital requirements for AI adoption.'
  ];

  const keyStudentContributionsList = input.userTurns.map((t, idx) => {
    const roleLabel = idx === 0 ? 'Opening / Initiation' : idx === 4 ? 'Synthesis / Summary' : `Exchange Turn ${idx + 1}`;
    return `${roleLabel}: "${t.text}"`;
  });

  const discussionDevelopment = `The group discussion progressed across 5 collaborative stages. The session opened with the student defining the core scope of AI integration in software engineering. In the second and third exchanges, Rohan and Ananya introduced technical feasibility constraints and socio-educational implications for junior engineers. The fourth exchange consolidated these perspectives into a collaborative framework, and the final exchange culminated in a unified consensus summarizing the synergistic future of software engineering.`;

  const finalConclusion = `The group reached an unequivocal consensus: Artificial Intelligence will not eliminate software engineers by 2030. Instead, AI serves as an empowering co-pilot that elevates the software engineer's role from low-level coding to high-level system architecture, security validation, and domain-driven innovation.`;

  const suggestedInterventions = [
    'Initiation: "Good morning peers, today\'s topic invites us to examine developer tooling, system architecture, and human oversight..."',
    'Diplomatic Buffer: "I appreciate that economic point, however, from a software security perspective..."',
    'Consensus Synthesis: "To conclude our group discussion, we have achieved consensus that AI acts as an engineering co-pilot rather than a human replacement..."'
  ];

  const polishedSummary = `In this interactive GD on "${input.topicTitle}", the student completed 5 full exchanges with AI peers and moderator, demonstrating ${leadershipRating.toLowerCase()} performance (${totalScore}/10). Key contributions articulated: ${
    keyContributions[0] || 'balanced software engineering and collaboration insights'
  }.`;

  return {
    totalScore,
    criteria,
    performanceDescriptor: getPerformanceDescriptor(totalScore),
    overallFeedback: `Evaluated under the SRIT SAILL 10-Mark GD Framework. Your total mark is ${totalScore}/10 (${getPerformanceDescriptor(totalScore)}). You completed 5 structured exchanges with AI peers Rohan & Ananya and Moderator Dr. Sharma.`,
    strengths,
    improvements,
    leadershipRating,
    participationRatePercent,
    keyContributions,
    suggestedInterventions,
    polishedSummary,
    summary: {
      mainPointsRaised,
      keyStudentContributions: keyStudentContributionsList,
      discussionDevelopment,
      finalConclusion
    },
    isSimulatedMode: true
  };
}

