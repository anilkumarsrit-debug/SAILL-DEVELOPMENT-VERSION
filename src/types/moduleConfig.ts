import { QuizQuestion } from '../types';

export interface NotebookRubricCriterion {
  name: string;
  maxScore: number;
  description: string;
}

export interface NotebookConfig {
  experimentNumber: string;
  aim: string;
  apparatus: string[];
  theory: string;
  procedure: string[];
  defaultStudentWork: string;
  defaultReflection: string;
  rubricCriteria: NotebookRubricCriterion[];
  targetOutputs: string[];
  facultySampleRemarks: string;
}

export interface KnowledgeCheckConfig {
  title: string;
  passingScore: number; // e.g. 70
  shuffleQuestions: boolean;
  questions: QuizQuestion[];
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'reference' | 'worksheet' | 'template' | 'video' | 'reading' | 'ai_tool' | 'sample_doc' | 'audio' | 'infographic' | 'download';
  description: string;
  content: string;
  link?: string;
  downloadFileName?: string;
  iconName?: string;
  tags?: string[];
}

export interface RecordWorkConfig {
  title: string;
  instructions: string;
  allowedFormats: ('audio' | 'video' | 'pdf' | 'docx' | 'image')[];
  sampleAudioPrompts?: string[];
  submissionGuidelines: string[];
  maxFileMB?: number;
}

export interface ReflectionConfig {
  title: string;
  instructions: string;
  questions: string[];
  aiPrompts?: string[];
  rubricFocus: string[];
}

export interface PortfolioConfig {
  title: string;
  artifactCategories: string[];
  rubricCriteria: string[];
  benchmarkSampleTitle?: string;
  benchmarkSampleContent?: string;
}

export interface StatusMetric {
  label: string;
  value: string | number;
  target: string | number;
  status: 'completed' | 'in_progress' | 'pending';
  icon?: string;
}

export interface StatusConfig {
  targetScore: number;
  requiredTasks: string[];
  skillsMastered: string[];
  recommendations: string[];
  passingThreshold: number;
}

export interface ModuleConfig {
  moduleId: string;
  code: string;
  title: string;
  syllabusTopic: string;
  description: string;
  notebookConfig: NotebookConfig;
  knowledgeCheck: KnowledgeCheckConfig;
  resources: ResourceItem[];
  recordWork: RecordWorkConfig;
  reflectionConfig: ReflectionConfig;
  portfolioConfig: PortfolioConfig;
  statusConfig: StatusConfig;
}
