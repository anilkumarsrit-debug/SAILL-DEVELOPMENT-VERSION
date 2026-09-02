import { QuestionBankItem, DifficultyLevel } from '../../types/knowledgeCheck';
import { module1Questions } from './module1';
import { module2Questions } from './module2';
import { module3Questions } from './module3';
import { module4Questions } from './module4';
import { module5Questions } from './module5';
import { module6Questions } from './module6';
import { module7Questions } from './module7';
import { module8Questions } from './module8';
import { module9Questions } from './module9';
import { module10Questions } from './module10';
import { module11Questions } from './module11';
import { module12Questions } from './module12';

export const ALL_QUESTION_BANKS: Record<string, QuestionBankItem[]> = {
  // Official Module IDs
  'pronunciation': module1Questions,
  'listening': module2Questions,
  'spoken-english': module3Questions,
  'group-discussion': module4Questions,
  'public-speaking': module5Questions,
  'professional-writing': module6Questions,
  'professional-email': module7Questions,
  'resume-writing': module8Questions,
  'reading-comprehension': module9Questions,
  'debate-skills': module10Questions,
  'report-writing': module11Questions,
  'etiquette-branding': module12Questions,

  // Tool & Legacy Aliases
  'jam-speaking': module3Questions,
  'gd-simulator': module4Questions,
  'presentation': module5Questions,
  'interview': module6Questions,
  'email-writing': module7Questions,
  'resume-builder': module8Questions,
  'reading': module9Questions,
  'debate': module10Questions,
  'personal-branding': module12Questions
};

/**
 * Retrieves banked questions for a given moduleId
 */
export function getQuestionBankForModule(moduleId: string): QuestionBankItem[] {
  return ALL_QUESTION_BANKS[moduleId] || module3Questions;
}

/**
 * Filter banked questions by difficulty
 */
export function getQuestionsByDifficulty(questions: QuestionBankItem[], difficulty: DifficultyLevel): QuestionBankItem[] {
  return questions.filter((q) => q.difficulty === difficulty);
}
