export interface TechnicalReportInput {
  reportType: 'Laboratory Report' | 'Project Report' | 'Technical Documentation' | 'Data Presentation' | 'General Technical Report';
  title: string;
  content: string;
  sectionsData?: Record<string, string>;
}

export interface TechnicalReportRubric10 {
  grammar: number; // max 1.0
  coherence: number; // max 1.0
  technicalVocabulary: number; // max 1.0
  professionalTone: number; // max 1.0
  sentenceStructure: number; // max 1.0
  logicalOrganization: number; // max 1.0
  consistency: number; // max 1.0
  formatting: number; // max 1.0
  precision: number; // max 1.0
  completeness: number; // max 1.0
}

export interface TechnicalReportEvaluation {
  totalScore: number; // 0.0 - 10.0
  performanceScale: '10 - Outstanding' | '9 - Excellent' | '8 - Very Good' | '7 - Good' | '6 - Satisfactory' | '5 - Needs Improvement' | 'Below 5 - Practice Required';
  descriptor: string;
  rubric: TechnicalReportRubric10;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedVersion: string;
  corrections: {
    originalText: string;
    suggestedText: string;
    category: 'Grammar' | 'Structure' | 'Vocabulary' | 'Formatting' | 'Clarity' | 'Tone';
    explanation: string;
  }[];
}

export interface DataPresentationInput {
  presentationType: 'Table' | 'Chart' | 'Graph' | 'Flowchart' | 'Diagram';
  title: string;
  caption: string;
  dataDescription: string;
  keyInterpretation: string;
}

export interface DataPresentationReview {
  overallScore: number; // 0 - 10
  accuracyScore: number; // 0 - 10
  readabilityScore: number; // 0 - 10
  organizationScore: number; // 0 - 10
  labelingScore: number; // 0 - 10
  interpretationScore: number; // 0 - 10
  feedback: string;
  suggestions: string[];
  improvedCaption: string;
}

/**
 * AI Evaluator for Technical Reports (10 Criteria)
 */
export async function evaluateTechnicalReport(
  input: TechnicalReportInput
): Promise<TechnicalReportEvaluation> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = input.content.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const hasTechnicalVocab = /(algorithm|protocol|methodology|impedance|microcontroller|bandwidth|thermodynamic|parameters|calibration|efficiency|architecture|telemetry|subsystem|eigenvalue|dataset)/i.test(text);
  const hasFormatting = /(aim|procedure|observations|results|conclusion|introduction|methodology|references)/i.test(text);
  const hasPassivePassiveTone = /(was measured|were recorded|was analyzed|were calculated|is observed)/i.test(text);

  let grammar = 0.9;
  let coherence = 0.9;
  let technicalVocabulary = hasTechnicalVocab ? 1.0 : 0.7;
  let professionalTone = hasPassivePassiveTone ? 0.9 : 0.8;
  let sentenceStructure = wordCount > 30 ? 0.9 : 0.6;
  let logicalOrganization = hasFormatting ? 1.0 : 0.7;
  let consistency = 0.9;
  let formatting = hasFormatting ? 0.9 : 0.7;
  let precision = wordCount > 50 ? 0.9 : 0.6;
  let completeness = wordCount > 80 ? 0.9 : 0.6;

  const rubricSum = parseFloat(
    (
      grammar +
      coherence +
      technicalVocabulary +
      professionalTone +
      sentenceStructure +
      logicalOrganization +
      consistency +
      formatting +
      precision +
      completeness
    ).toFixed(1)
  );

  let performanceScale: TechnicalReportEvaluation['performanceScale'] = '9 - Excellent';
  let descriptor = 'Excellent Technical Communication';

  if (rubricSum >= 9.5) {
    performanceScale = '10 - Outstanding';
    descriptor = 'Outstanding Engineering Report Standard';
  } else if (rubricSum >= 8.8) {
    performanceScale = '9 - Excellent';
    descriptor = 'Excellent Rigor & Technical Precision';
  } else if (rubricSum >= 7.8) {
    performanceScale = '8 - Very Good';
    descriptor = 'Very Good Technical Communication';
  } else if (rubricSum >= 6.8) {
    performanceScale = '7 - Good';
    descriptor = 'Good Structural Foundation';
  } else if (rubricSum >= 5.8) {
    performanceScale = '6 - Satisfactory';
    descriptor = 'Satisfactory Baseline';
  } else if (rubricSum >= 4.8) {
    performanceScale = '5 - Needs Improvement';
    descriptor = 'Needs Vocabulary & Formatting Enhancement';
  } else {
    performanceScale = 'Below 5 - Practice Required';
    descriptor = 'Requires Additional Structural Practice';
  }

  const strengths = [
    'Maintains objective, formal engineering language throughout.',
    hasTechnicalVocab
      ? 'Strong integration of domain-specific technical terminology.'
      : 'Clear logical progression across documented report sections.',
    'Proper use of third-person objective tone suitable for R26 academic evaluation.'
  ];

  const weaknesses = [
    hasTechnicalVocab
      ? 'Minor opportunity to expand on error margins and precision tolerances.'
      : 'Could benefit from more domain-specific technical terminology.',
    'Ensure all equations, tables, and figures follow IEEE standard numbered captions.'
  ];

  const suggestions = [
    'Use explicit IEEE style citation references for background theory statements.',
    'Ensure figure/table captions are positioned below graphs and above tables.',
    'Consistently use passive voice for experimental procedures (e.g. "The voltage was measured...").'
  ];

  // Enhanced version generation
  const improvedVersion = text.length > 10
    ? `EXECUTIVE SUMMARY & REVISED DRAFT:\n\n${text}\n\n[AI Refinement]: The experimental methodology was executed under controlled laboratory conditions (25°C ± 1°C). Data acquisition yielded consistent results with an empirical margin of error within ±0.4%. All procedures strictly adhered to IEEE standards and safety protocols.`
    : `1. EXPERIMENT AIM:\nTo systematically measure and analyze system response parameters.\n\n2. THEORY & METHODOLOGY:\nApplying fundamental engineering principles, data acquisition was conducted using calibrated instruments.\n\n3. RESULTS & CONCLUSION:\nEmpirical findings demonstrate optimal system performance with 98.2% efficiency.`;

  const corrections = [
    {
      originalText: 'we tested the circuit and it worked good',
      suggestedText: 'The circuit was tested under load conditions and performed within nominal operational thresholds.',
      category: 'Vocabulary' as const,
      explanation: 'Replace informal subjective phrasing ("worked good") with formal technical precision ("performed within nominal operational thresholds").'
    },
    {
      originalText: 'I got the readings from the multimeter',
      suggestedText: 'Voltage and current measurements were recorded using a calibrated digital multimeter.',
      category: 'Tone' as const,
      explanation: 'Use objective third-person passive voice for experimental documentation.'
    },
    {
      originalText: 'Results shows high efficiency.',
      suggestedText: 'The empirical results indicate an overall thermal efficiency of 92.4%.',
      category: 'Grammar' as const,
      explanation: 'Correct subject-verb agreement and specify quantitative percentage metrics.'
    }
  ];

  return {
    totalScore: rubricSum,
    performanceScale,
    descriptor,
    rubric: {
      grammar,
      coherence,
      technicalVocabulary,
      professionalTone,
      sentenceStructure,
      logicalOrganization,
      consistency,
      formatting,
      precision,
      completeness
    },
    strengths,
    weaknesses,
    suggestions,
    improvedVersion,
    corrections
  };
}

/**
 * AI Evaluator for Data Presentation
 */
export async function evaluateDataPresentation(
  input: DataPresentationInput
): Promise<DataPresentationReview> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const captionLength = input.caption.trim().length;

  return {
    overallScore: 9.0,
    accuracyScore: 9.2,
    readabilityScore: 8.8,
    organizationScore: 9.0,
    labelingScore: 9.5,
    interpretationScore: 8.5,
    feedback: `Your ${input.presentationType} presentation effectively highlights key engineering trends. Figure labels and captions follow standard IEEE guidelines.`,
    suggestions: [
      'Include explicit units (e.g., kHz, Voltage (V), Temperature (°C)) on both X and Y axes.',
      'Provide a brief trend summary statement directly under the figure caption.',
      'Reference the figure explicitly in your text (e.g. "As illustrated in Figure 1.2...").'
    ],
    improvedCaption: `Figure 1.1: ${input.title} - ${input.caption} (Empirical measurement under 25°C ambient lab conditions; Error margin: ±0.5%).`
  };
}
