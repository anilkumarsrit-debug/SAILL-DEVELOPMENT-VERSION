/**
 * SAILL - SRIT AI Language Laboratory
 * Learning Module Blueprint & Template Specification
 *
 * @version 2.6.0
 * @description Standardized data architecture for defining new educational modules
 * under the SRIT R26 English AI Language Laboratory curriculum.
 */

import { ModuleData, ModuleCategory, PracticeToolId } from '../types';

export interface ModuleTabConfig {
  id: string;
  title: string;
  iconName: string;
  type: 'concept' | 'interactive' | 'recording' | 'reflection' | 'quiz';
  description: string;
}

export interface EvaluationRubricCriteria {
  key: string;
  label: string;
  maxScore: number;
  weight: number;
  guidelines: string;
}

export interface SAILLModuleDefinition extends ModuleData {
  curriculumRef: string;
  tabsConfig: ModuleTabConfig[];
  rubricCriteria: EvaluationRubricCriteria[];
  aiPromptKey?: string;
  sampleAudioUrl?: string;
}

/**
 * Starter template factory for instantiating new curriculum modules.
 * Use this pattern when creating Module 09, Module 10, or custom specialized labs.
 */
export function createModuleTemplate(overrides?: Partial<SAILLModuleDefinition>): SAILLModuleDefinition {
  const category: ModuleCategory = 'Core Foundation';
  const toolId: PracticeToolId = 'pronunciation';

  return {
    id: 'module-template-id',
    code: 'R26-ENG-M99',
    title: 'New Learning Module Title',
    category,
    shortDesc: 'Interactive AI-Assisted Communication Practice',
    estimatedMinutes: 45,
    difficultyLevel: 'Intermediate',
    aiTools: ['AI Speech Coach', 'Phonetic Analyzer'],
    iconName: 'Sparkles',
    overview: {
      syllabusR26Code: 'SRIT-R26-BS-ENG-99',
      description: 'A comprehensive module designed to enhance student fluency, clarity, and confidence through interactive AI feedback.',
      keyFocusAreas: ['Fluency', 'Phonetic accuracy', 'Professional presentation'],
      industryRelevance: 'Essential for technical presentations, interviews, and global campus recruitment.',
      prerequisites: ['Basic English Grammar']
    },
    objectives: [
      'Understand core principles and theoretical framework',
      'Practice articulation with real-time speech recording',
      'Evaluate performance against standardized rubric',
      'Receive instant AI diagnostic feedback and corrective exercises'
    ],
    learnContent: {
      introduction: 'Welcome to the SAILL module. Follow the concepts, practice drills, and recording studio instructions.',
      sections: []
    },
    practiceConfig: {
      toolId,
      toolTitle: 'Interactive Speech Practice',
      instructions: 'Record your response clearly into the microphone.',
      prompts: ['Read the sample paragraph aloud focusing on stress and intonation.']
    },
    reflectionPrompts: [
      'What areas of pronunciation were most challenging for you in this module?',
      'How did the AI diagnostic feedback help clarify your speech patterns?'
    ],
    curriculumRef: 'SRIT-R26-BS-ENG-99',
    tabsConfig: [
      {
        id: 'overview',
        title: 'Concept & Theory',
        iconName: 'BookOpen',
        type: 'concept',
        description: 'Foundational concepts, audio demonstrations, and key rules.'
      },
      {
        id: 'practice',
        title: 'Guided Practice',
        iconName: 'Dumbbell',
        type: 'interactive',
        description: 'Interactive exercises with phrase drills and immediate visual prompts.'
      },
      {
        id: 'record',
        title: 'Recording Studio',
        iconName: 'Mic',
        type: 'recording',
        description: 'Record your oral submission for AI transcription and diagnostic scoring.'
      },
      {
        id: 'evaluation',
        title: 'Self & AI Diagnostics',
        iconName: 'Calculator',
        type: 'reflection',
        description: 'Review AI speech metrics, complete self-assessment, and claim portfolio entry.'
      }
    ],
    rubricCriteria: [
      { key: 'pronunciation', label: 'Pronunciation & Phonetics', maxScore: 10, weight: 0.3, guidelines: 'Clarity of phonemes, stress patterns, and intonation.' },
      { key: 'fluency', label: 'Fluency & Rhythm', maxScore: 10, weight: 0.25, guidelines: 'Smooth delivery without unnatural hesitations or pauses.' },
      { key: 'grammar', label: 'Grammar & Accuracy', maxScore: 10, weight: 0.25, guidelines: 'Correct tense usage, subject-verb agreement, and syntax.' },
      { key: 'vocabulary', label: 'Vocabulary & Diction', maxScore: 10, weight: 0.2, guidelines: 'Appropriate word choice and contextual vocabulary.' }
    ],
    aiPromptKey: 'SPEECH_EVALUATION_DEFAULT',
    ...overrides
  };
}
