export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentMetadata {
  version: string;
  createdDate: string;
  updatedDate: string;
  author: string;
  status: ContentStatus;
  tags?: string[];
}

export interface FacultyNotes {
  pedagogicalObjectives: string[];
  commonStudentPitfalls: string[];
  suggestedRemediation: string[];
  ciaEvaluationRubric: { criteria: string; weight: number; maxMarks: number }[];
  confidentialInstructorKey?: string;
}

export interface ActivityExample {
  id: string;
  title: string;
  text: string;
  audioRef?: string;
  imageRef?: string;
}

export interface PracticeDrill {
  drillId: string;
  prompt: string;
  type: 'record' | 'written' | 'quiz' | 'interactive';
  targetText?: string;
  hint?: string;
}

export interface ActivityResource {
  title: string;
  type: 'pdf' | 'audio' | 'link' | 'doc';
  url: string;
}

export interface ActivitySchema {
  activityId: string;
  title: string;
  learningOutcome: string;
  estimatedTime: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  instructions: string[];
  examples: ActivityExample[];
  practiceDrills: PracticeDrill[];
  knowledgeCheckRef: string;
  reflectionPrompts: string[];
  resources: ActivityResource[];
  promptRef: string;
  audioReferences: string[];
  imageReferences: string[];
}

export interface JourneyContentSchema {
  journeyId: string;
  moduleId: string;
  code: string;
  title: string;
  shortDesc: string;
  metadata: ContentMetadata;
  activities: ActivitySchema[];
  overview: {
    syllabus: string;
    targetAudience: string;
    prerequisiteSkills: string[];
  };
  outcomes: {
    primaryOutcome: string;
    bloomTaxonomyLevel: string;
    skillTags: string[];
  };
  theory: {
    summary: string;
    keyPrinciples: string[];
    tableComparison?: { headers: string[]; rows: string[][] };
  };
  interactiveDemoConfig: {
    demoTitle: string;
    interactiveType: string;
    promptRef: string;
  };
  knowledgeCheck: {
    questionBankRef: string;
    totalQuestions: number;
    passingScore: number;
  };
  notebookPrompts: string[];
  reflectionPrompts: string[];
  portfolioConfig: {
    submissionTitle: string;
    requirements: string[];
    rubrics: string[];
  };
  resources: { name: string; type: string; url: string }[];
  facultyNotes: FacultyNotes;
}

export type QuestionBankCategory =
  | 'pronunciation'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'interview'
  | 'business_communication';

export interface QuestionBankEntry {
  id: string;
  category: QuestionBankCategory;
  journeyId?: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  promptRef?: string;
}

export type AudioCategory =
  | 'vowels'
  | 'consonants'
  | 'minimal_pairs'
  | 'word_stress'
  | 'sentence_stress'
  | 'intonation'
  | 'conversation'
  | 'presentation';

export interface AudioLibraryItem {
  id: string;
  category: AudioCategory;
  title: string;
  speakerGender: 'male' | 'female' | 'ai_neutral';
  accent: 'en-US' | 'en-GB' | 'en-IN';
  audioUrl: string;
  phoneticText: string;
  transcript: string;
  targetPhonemes: string[];
}

export interface PromptMapping {
  promptId: string;
  activityId: string;
  journeyId: string;
  systemPromptIdentifier: string;
  userPromptTemplate: string;
  description: string;
}
