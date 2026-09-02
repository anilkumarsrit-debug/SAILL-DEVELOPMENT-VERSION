import { QuestionBankItem, DifficultyLevel, QuizAttemptRecord } from '../types/knowledgeCheck';
import { getQuestionBankForModule } from '../data/questionBanks';
import { GoogleGenAI } from '@google/genai';

/**
 * Fisher-Yates shuffle helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle choices for objective question options
 */
function shuffleQuestionOptions(q: QuestionBankItem): QuestionBankItem {
  if (q.type === 'mcq' || q.type === 'multiple_select' || q.type === 'scenario_based' || q.type === 'case_based') {
    if (q.options && q.options.length > 1) {
      return {
        ...q,
        options: shuffleArray(q.options)
      };
    }
  }
  return q;
}

/**
 * Generate AI Question via Gemini API when pool requires expansion
 */
export async function generateAIQuestionWithGemini(
  moduleId: string,
  difficulty: DifficultyLevel,
  topic: string = 'General Module Mastery',
  co: 'CO1' | 'CO2' | 'CO3' | 'CO4' | 'CO5' = 'CO1'
): Promise<QuestionBankItem> {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
  const apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined) || metaEnv?.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = `
You are an expert AI Assessment Architect for the SRIT AI Language Laboratory (SAILL).
Generate exactly 1 high-quality technical assessment question in JSON format for:
- Module: ${moduleId}
- Topic: ${topic}
- Course Outcome: ${co}
- Difficulty: ${difficulty}

Respond ONLY with valid JSON matching this schema:
{
  "id": "ai-gen-${Date.now()}-${Math.floor(Math.random()*1000)}",
  "moduleId": "${moduleId}",
  "topic": "${topic}",
  "courseOutcome": "${co}",
  "difficulty": "${difficulty}",
  "type": "mcq",
  "prompt": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Detailed educational explanation of why Option A is correct.",
  "keywords": ["Keyword1", "Keyword2"],
  "estimatedTimeSeconds": 30
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && parsed.prompt && parsed.options) {
        return parsed as QuestionBankItem;
      }
    } catch (err) {
      console.warn('Gemini API call fallback engaged for question generation:', err);
    }
  }

  // Fallback AI Question Generator
  const timestamp = Date.now();
  return {
    id: `ai-gen-fallback-${moduleId}-${timestamp}`,
    moduleId,
    topic,
    courseOutcome: co,
    difficulty,
    type: 'mcq',
    prompt: `[AI Adaptive Evaluator - ${difficulty}] Apply ${topic} principles in professional ${moduleId} engineering scenarios. Which option represents the optimal technical solution?`,
    options: [
      `Systematically apply standard ${moduleId} protocols with verified empirical benchmarks`,
      `Bypass verification steps and rely strictly on subjective estimation`,
      `Omit documentation and execute without team review`,
      `Defer decision indefinitely without recording data`
    ],
    correctAnswer: `Systematically apply standard ${moduleId} protocols with verified empirical benchmarks`,
    explanation: `Professional engineering standards require systematic protocol application, verified metrics, and empirical data validation.`,
    keywords: [topic, moduleId, 'AI Generated'],
    estimatedTimeSeconds: 30
  };
}

/**
 * Main Quiz Generator Function
 * Creates a unique 10-question quiz instance adhering to:
 * - 3 Easy
 * - 5 Medium
 * - 2 Hard
 * - Shuffled question order
 * - Shuffled answer choices
 * - Avoids recently attempted question IDs for the same student
 */
export async function generateAdaptiveQuiz(
  moduleId: string,
  studentId: string,
  previousAttempts: QuizAttemptRecord[] = []
): Promise<{ quizInstanceId: string; questions: QuestionBankItem[]; attemptNumber: number }> {
  // Collect recently attempted question IDs across recent attempts
  const recentAttemptQuestionIds = new Set<string>();
  const studentModuleAttempts = previousAttempts.filter((a) => a.moduleId === moduleId);
  const attemptNumber = studentModuleAttempts.length + 1;

  // Take question IDs from last 3 attempts
  studentModuleAttempts.slice(-3).forEach((att) => {
    (att.questionIds || []).forEach((qid) => recentAttemptQuestionIds.add(qid));
  });

  const fullBank = getQuestionBankForModule(moduleId);

  // Helper to pick N questions of given difficulty avoiding recent ones if possible
  const pickQuestionsByDifficulty = async (
    targetDifficulty: DifficultyLevel,
    count: number
  ): Promise<QuestionBankItem[]> => {
    let pool = fullBank.filter((q) => q.difficulty === targetDifficulty);
    
    // Filter out recently attempted questions if pool is large enough
    const unattemptedPool = pool.filter((q) => !recentAttemptQuestionIds.has(q.id));
    if (unattemptedPool.length >= count) {
      pool = unattemptedPool;
    }

    pool = shuffleArray(pool);
    const selected = pool.slice(0, count);

    // If pool was exhausted and didn't reach required count, fill with AI Generated questions
    while (selected.length < count) {
      const generated = await generateAIQuestionWithGemini(moduleId, targetDifficulty, 'Adaptive Practice', 'CO1');
      selected.push(generated);
    }

    return selected;
  };

  // 1. Pick balanced set: 3 Easy, 5 Medium, 2 Hard
  const easyQuestions = await pickQuestionsByDifficulty('Easy', 3);
  const mediumQuestions = await pickQuestionsByDifficulty('Medium', 5);
  const hardQuestions = await pickQuestionsByDifficulty('Hard', 2);

  // Combine and shuffle overall order
  let combined = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  combined = shuffleArray(combined);

  // Shuffle options for objective questions
  const finalQuestions = combined.map(shuffleQuestionOptions);

  const quizInstanceId = `quiz_${moduleId}_${studentId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return {
    quizInstanceId,
    questions: finalQuestions,
    attemptNumber
  };
}
