import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module11Questions: QuestionBankItem[] = [
  {
    id: 'qb-rep-001',
    moduleId: 'report-writing',
    topic: 'Executive Summary Function',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the primary functional objective of an Executive Summary in an engineering technical report?',
    options: [
      'To provide a standalone synthesis of project objectives, methodology, key quantitative findings, and recommendations for decision-makers',
      'To list all bibliographic references in alphabetical order',
      'To provide personal acknowledgments and thank team members',
      'To paste unformatted source code and database migration files'
    ],
    correctAnswer: 'To provide a standalone synthesis of project objectives, methodology, key quantitative findings, and recommendations for decision-makers',
    explanation: 'Executive summaries condense the entire technical report into a concise overview enabling senior stakeholders to grasp key decisions and outcomes quickly.',
    keywords: ['Executive Summary', 'Technical Report', 'Synthesis'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-rep-002',
    moduleId: 'report-writing',
    topic: 'Impersonal Passive Voice in Engineering Methodology',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why is impersonal passive voice (e.g., "The microcontroller was calibrated at 3.3V") traditionally standard in experimental methodology sections?',
    options: [
      'It maintains objective scientific focus on the experimental apparatus and procedure rather than the subjective individual researcher',
      'Grammar rules strictly forbid the use of personal pronouns in all English documents',
      'Passive voice makes technical sentences 50% shorter',
      'Passive voice is required by compiler software parsers'
    ],
    correctAnswer: 'It maintains objective scientific focus on the experimental apparatus and procedure rather than the subjective individual researcher',
    explanation: 'Passive voice places primary emphasis on the empirical procedure, apparatus, and observed data rather than the persona of the investigator.',
    keywords: ['Passive Voice', 'Objectivity', 'Methodology'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-rep-003',
    moduleId: 'report-writing',
    topic: 'Figure and Table Caption Formatting Rules',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'According to IEEE standard technical publishing guidelines, how should Table titles and Figure captions be positioned relative to graphics?',
    options: [
      'Table titles are placed ABOVE the table; Figure captions are placed BELOW the figure',
      'Table titles are placed BELOW the table; Figure captions are placed ABOVE the figure',
      'Both Table titles and Figure captions must be placed on the left margin',
      'Captions are only placed in the Appendix and omitted from the main text'
    ],
    correctAnswer: 'Table titles are placed ABOVE the table; Figure captions are placed BELOW the figure',
    explanation: 'Standard IEEE style specifies Table titles above tables (e.g., TABLE I: EXPERIMENTAL PARAMETERS) and Figure captions below figures (e.g., Fig. 1. System Block Diagram).',
    keywords: ['Figure Captions', 'Table Titles', 'IEEE Formatting'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-rep-004',
    moduleId: 'report-writing',
    topic: 'IEEE In-Text Citation and Numeric References',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How are in-text source citations correctly formatted according to IEEE citation guidelines?',
    options: [
      'Using bracketed sequential numbers [1], [2] corresponding to chronological appearance in the reference list',
      'Writing author last names and publication years in parentheses (Smith, 2024)',
      'Adding footnotes at the bottom of each page with full web URLs',
      'Writing author names in bold red font without numbers'
    ],
    correctAnswer: 'Using bracketed sequential numbers [1], [2] corresponding to chronological appearance in the reference list',
    explanation: 'IEEE uses a bracketed numeric citation style [1] ordered sequentially by appearance in the text rather than alphabetical author-date formatting.',
    keywords: ['IEEE Citation', 'In-Text Citation', 'Numeric Style'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rep-005',
    moduleId: 'report-writing',
    topic: 'IEEE Technical Report Structural Architecture',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the standard structural sequence of major body sections in a formal IEEE engineering research report?',
    options: [
      'Title & Abstract -> Introduction -> System Model/Methodology -> Results & Discussion -> Conclusion -> References',
      'References -> Conclusion -> Results -> Methodology -> Introduction -> Title',
      'Introduction -> References -> System Model -> Abstract -> Conclusion -> Results',
      'Title -> Appendix -> Discussion -> Table of Contents -> Introduction'
    ],
    correctAnswer: 'Title & Abstract -> Introduction -> System Model/Methodology -> Results & Discussion -> Conclusion -> References',
    explanation: 'Standard report architecture moves logically from problem formulation (Introduction) through experimental execution (Methodology), empirical findings (Results), and synthesis (Conclusion).',
    keywords: ['Report Structure', 'IEEE Architecture', 'Section Ordering'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rep-006',
    moduleId: 'report-writing',
    topic: 'Quantitative Technical Precision vs Vague Adjectives',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which sentence best exemplifies rigorous, objective technical report writing?',
    options: [
      'The proposed caching layer reduced API endpoint latency by 34.2% from 180 ms to 118 ms under a simulated load of 5,000 concurrent requests.',
      'The new caching system is super fast and makes everything work amazingly well.',
      'We added some caching code and the database ran a whole lot quicker than before.',
      'The server was tested and everyone on our team was very happy with the results.'
    ],
    correctAnswer: 'The proposed caching layer reduced API endpoint latency by 34.2% from 180 ms to 118 ms under a simulated load of 5,000 concurrent requests.',
    explanation: 'Technical writing replaces subjective qualitative claims with verifiable quantitative metrics (34.2% reduction, 180ms to 118ms, 5k concurrency).',
    keywords: ['Quantitative Precision', 'Objective Tone', 'Technical Style'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rep-007',
    moduleId: 'report-writing',
    topic: 'Academic Integrity & Plagiarism Definition',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which statement accurately describes academic integrity and plagiarism standards in engineering technical documentation?',
    options: [
      'Paraphrasing ideas or summarizing experimental data from published literature still requires an explicit in-text citation attributing the original source',
      'Citations are only required when copying more than 50 consecutive words verbatim',
      'Modifying variable names in open-source code eliminates the need for source attribution',
      'Images taken from the web do not require source citations if used for educational labs'
    ],
    correctAnswer: 'Paraphrasing ideas or summarizing experimental data from published literature still requires an explicit in-text citation attributing the original source',
    explanation: 'Academic attribution applies to intellectual concepts, architectures, and data syntheses, not merely direct quotations. Omitting citations constitutes plagiarism.',
    keywords: ['Academic Integrity', 'Plagiarism', 'Attribution Rules'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rep-008',
    moduleId: 'report-writing',
    topic: 'Turnitin / iThenticate Similarity Index Thresholds',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In standard academic and conference evaluation audits (such as IEEE/Turnitin), what is the acceptable overall similarity threshold for student lab reports and research papers?',
    options: [
      'Below 10% to 15% (excluding standard bibliography references and common lab assignment templates)',
      'Below 50% similarity index',
      'Below 80% similarity index',
      'Exactly 0% (no overlapping engineering terminology permitted)'
    ],
    correctAnswer: 'Below 10% to 15% (excluding standard bibliography references and common lab assignment templates)',
    explanation: 'University and publisher guidelines generally cap acceptable similarity at 10–15%, ensuring authentic student synthesis while filtering template phrases.',
    keywords: ['Turnitin', 'Similarity Index', 'Plagiarism Audit'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-rep-009',
    moduleId: 'report-writing',
    topic: 'Acronym and Technical Abbreviation Protocol',
    courseOutcome: 'CO1',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What is the universally accepted standard for introducing technical acronyms (e.g., FPGA, API, EEPROM) in formal technical reports?',
    options: [
      'Spell out the full technical term on first occurrence followed immediately by the acronym in parentheses: Field Programmable Gate Array (FPGA)',
      'Use only the acronym without ever spelling out the full name',
      'Provide a handwritten glossary at the very end of the document',
      'Define acronyms only if they contain more than 10 letters'
    ],
    correctAnswer: 'Spell out the full technical term on first occurrence followed immediately by the acronym in parentheses: Field Programmable Gate Array (FPGA)',
    explanation: 'Standard style manuals require expanding the full noun phrase followed by the parenthetical abbreviation at first occurrence, establishing clear unambiguous terminology.',
    keywords: ['Acronyms', 'Terminology', 'Documentation Rigor'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-rep-010',
    moduleId: 'report-writing',
    topic: 'Case Study: Technical Report Audit and Quality Criteria',
    courseOutcome: 'CO1',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'During a faculty capstone report audit, Group A received 58/100 for informal first-person narrative ("We thought the sensor was cool"), missing captions, and unformatted URLs. Group B received 96/100. Which set of practices elevated Group B\'s score?',
    options: [
      'Impersonal objective tone, numbered figure/table captions with explicit text callouts, quantitative error analysis, and standard IEEE bracketed citations',
      'Using decorative colored fonts, clip art graphics, and 50 pages of raw unindexed printouts',
      'Writing the entire 20-page document in conversational bullet points with no paragraphs',
      'Omitting the conclusion and references to keep the document shorter'
    ],
    correctAnswer: 'Impersonal objective tone, numbered figure/table captions with explicit text callouts, quantitative error analysis, and standard IEEE bracketed citations',
    explanation: 'High-scoring engineering documentation exemplifies objective impersonal phrasing, rigorous cross-referenced graphic labeling, mathematical error analysis, and standard scholarly citations.',
    keywords: ['Report Audit', 'Case Study', 'Quality Standards'],
    estimatedTimeSeconds: 35
  }
];
