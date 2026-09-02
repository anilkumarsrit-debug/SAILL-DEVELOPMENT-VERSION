import { normalizeTo10Scale, getPerformanceDescriptor } from '../../lib/scoring';

export interface SpokenEnglishEvaluationInput {
  mode: 'warmup' | 'guided' | 'picture' | 'situation' | 'story' | 'roleplay' | 'partner';
  topicOrPrompt: string;
  userTranscript: string;
  durationSeconds: number;
  keywordsToInclude?: string[];
  conversationHistory?: { role: 'ai' | 'user'; text: string }[];
}

export interface CriteriaBreakdown {
  fluencyScore: number; // 0 - 2
  pronunciationScore: number; // 0 - 2
  grammarScore: number; // 0 - 2
  vocabularyScore: number; // 0 - 2
  confidenceScore: number; // 0 - 2
}

export interface SpokenEnglishEvaluationResult {
  totalScore: number; // 0 - 10
  criteria: CriteriaBreakdown;
  performanceDescriptor: string;
  wpm: number;
  fillerWordCount: number;
  detectedFillerWords: string[];
  hesitationCount: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  correctedTranscript: string;
  followUpQuestion?: string;
  isSimulatedMode: boolean;
}

const COMMON_FILLERS = ['um', 'uh', 'ah', 'er', 'basically', 'you know', 'like', 'actually', 'sort of', 'kind of'];

export async function evaluateSpokenEnglish(
  input: SpokenEnglishEvaluationInput
): Promise<SpokenEnglishEvaluationResult> {
  // Simulate network latency for realistic AI evaluation experience
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const text = input.userTranscript.trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  const duration = Math.max(1, input.durationSeconds);
  const wpm = Math.round((wordCount / duration) * 60);

  // Detect filler words
  const lowerText = text.toLowerCase();
  const foundFillers: string[] = [];
  let fillerCount = 0;

  COMMON_FILLERS.forEach((filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      fillerCount += matches.length;
      foundFillers.push(filler);
    }
  });

  // Estimate hesitation pauses (based on ellipses, short fragments, filler density)
  const hesitationMatches = (text.match(/\.\.\.|\b(um|uh|ah|er)\b/gi) || []).length;
  const hesitationCount = Math.min(10, hesitationMatches + Math.floor(fillerCount * 0.8));

  // Score Criteria Calculation (each out of 2 marks)
  // 1. Fluency & Pace (0-2): Target WPM is 120-160, low fillers
  let fluencyScore = 2.0;
  if (wpm < 80 || wpm > 180) fluencyScore -= 0.5;
  if (wpm < 50 || wpm > 200) fluencyScore -= 0.5;
  if (fillerCount > 3) fluencyScore -= 0.5;
  fluencyScore = Math.max(0.5, Math.min(2.0, fluencyScore));

  // 2. Pronunciation & Intonation (0-2): estimated based on word complexity & length
  let pronunciationScore = 1.8;
  if (wordCount > 25) pronunciationScore = 2.0;
  else if (wordCount < 10) pronunciationScore = 1.0;

  // 3. Grammar & Structure (0-2): check punctuation, capital letters, length
  let grammarScore = 1.8;
  if (text.length > 50 && text.includes('.')) grammarScore = 2.0;
  if (text.length < 15) grammarScore = 1.2;

  // 4. Vocabulary (0-2): Check keywords inclusion if provided
  let vocabularyScore = 1.5;
  if (input.keywordsToInclude && input.keywordsToInclude.length > 0) {
    const matched = input.keywordsToInclude.filter((kw) =>
      lowerText.includes(kw.toLowerCase())
    );
    const ratio = matched.length / input.keywordsToInclude.length;
    vocabularyScore = Math.min(2.0, Math.max(0.5, Number((0.5 + ratio * 1.5).toFixed(1))));
  } else if (wordCount > 30) {
    vocabularyScore = 2.0;
  } else {
    vocabularyScore = 1.6;
  }

  // 5. Organization & Confidence (0-2): Based on structural markers
  let confidenceScore = 1.8;
  const structMarkers = ['first', 'second', 'because', 'therefore', 'however', 'for example', 'in conclusion', 'in my opinion'];
  const hasMarkers = structMarkers.some((m) => lowerText.includes(m));
  if (hasMarkers || wordCount > 35) confidenceScore = 2.0;

  // Calculate total score out of 10
  const rawTotal = fluencyScore + pronunciationScore + grammarScore + vocabularyScore + confidenceScore;
  const totalScore = normalizeTo10Scale(rawTotal);
  const performanceDescriptor = getPerformanceDescriptor(totalScore);

  // Generate strengths and improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wpm >= 110 && wpm <= 160) {
    strengths.push(`Optimal speaking pace of ${wpm} WPM (target range 130–150 WPM).`);
  } else if (wpm < 110) {
    improvements.push(`Pacing is slightly slow (${wpm} WPM). Practice speaking more continuously without long pauses.`);
  } else {
    improvements.push(`Pacing is rapid (${wpm} WPM). Slow down slightly to emphasize key technical terms.`);
  }

  if (fillerCount === 0) {
    strengths.push('Zero filler words detected! Excellent vocal control and steady phrasing.');
  } else {
    improvements.push(`Detected ${fillerCount} filler word(s) (${foundFillers.slice(0, 3).join(', ')}). Replace fillers with deliberate silent pauses.`);
  }

  if (vocabularyScore >= 1.8) {
    strengths.push('Rich domain vocabulary and relevant technical phrasing utilized.');
  } else {
    improvements.push('Incorporate more specialized technical vocabulary and transitional discourse markers.');
  }

  if (confidenceScore >= 1.8) {
    strengths.push('Clear logical structure and confident tone.');
  } else {
    improvements.push('Use the PREP method (Point, Reason, Example, Point) to organize your response cleanly.');
  }

  // Create corrected / polished transcript
  let correctedTranscript = text;
  if (foundFillers.length > 0) {
    let cleanText = text;
    foundFillers.forEach((f) => {
      cleanText = cleanText.replace(new RegExp(`\\b${f}\\b\\,?\\s?`, 'gi'), '');
    });
    // Capitalize first letter
    cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
    correctedTranscript = cleanText;
  }

  // Generate intelligent follow-up question for conversation partner mode
  let followUpQuestion: string | undefined = undefined;
  if (input.mode === 'partner') {
    if (lowerText.includes('ai') || lowerText.includes('intelligence') || lowerText.includes('robot')) {
      followUpQuestion = 'That is a compelling perspective on artificial intelligence! How do you think ethical considerations and data privacy should be managed in these automated systems?';
    } else if (lowerText.includes('project') || lowerText.includes('engineering') || lowerText.includes('code')) {
      followUpQuestion = 'Great point regarding project development! What specific strategies do you use when dealing with unexpected technical bugs or tight project deadlines?';
    } else if (lowerText.includes('communication') || lowerText.includes('team') || lowerText.includes('leader')) {
      followUpQuestion = 'I agree that team communication is vital. How would you handle a situation where a team member strongly disagrees with your technical design choice?';
    } else {
      followUpQuestion = `Building on your point about "${input.topicOrPrompt}", could you share a concrete example or personal experience that illustrates this in an engineering context?`;
    }
  }

  const overallFeedback = `Your speech delivery for "${input.topicOrPrompt}" achieved a score of ${totalScore}/10 (${performanceDescriptor}). You maintained an average pace of ${wpm} WPM with ${fillerCount} filler word(s) detected.`;

  return {
    totalScore,
    criteria: {
      fluencyScore: Number(fluencyScore.toFixed(1)),
      pronunciationScore: Number(pronunciationScore.toFixed(1)),
      grammarScore: Number(grammarScore.toFixed(1)),
      vocabularyScore: Number(vocabularyScore.toFixed(1)),
      confidenceScore: Number(confidenceScore.toFixed(1))
    },
    performanceDescriptor,
    wpm,
    fillerWordCount: fillerCount,
    detectedFillerWords: Array.from(new Set(foundFillers)),
    hesitationCount,
    overallFeedback,
    strengths,
    improvements,
    correctedTranscript,
    followUpQuestion,
    isSimulatedMode: true
  };
}
