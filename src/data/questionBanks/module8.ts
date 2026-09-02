import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module8Questions: QuestionBankItem[] = [
  {
    id: 'qb-res-001',
    moduleId: 'resume-writing',
    topic: 'Google XYZ Bullet Formula',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the proven Google XYZ formula for writing high-impact engineering resume bullet points?',
    options: [
      'Accomplished [X], as measured by [Y], by doing [Z]',
      'eXplained [X], Yielded [Y], Zeroed errors [Z]',
      'Xeroxed [X], Yearned [Y], Zoomed [Z]',
      'XML [X], YAML [Y], Zsh [Z]'
    ],
    correctAnswer: 'Accomplished [X], as measured by [Y], by doing [Z]',
    explanation: 'The Google XYZ formula links the concrete achievement [X] with a measurable benchmark [Y] and specific technical execution [Z].',
    keywords: ['XYZ Formula', 'Resume Bullets', 'Impact Metrics'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-res-002',
    moduleId: 'resume-writing',
    topic: 'ATS Compatibility & Resume Layout',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why should entry-level engineering students avoid multi-column graphic resumes with graphical skill rating bars (e.g., 4/5 stars)?',
    options: [
      'ATS software parsers read linearly and often misparse or discard text inside multi-column tables, text boxes, and graphic elements',
      'Rating bars use too much memory on recruiter computers',
      'Graphic resumes are illegal under copyright law',
      'ATS software automatically converts all resumes into video files'
    ],
    correctAnswer: 'ATS software parsers read linearly and often misparse or discard text inside multi-column tables, text boxes, and graphic elements',
    explanation: 'ATS parsers process plain text linearly. Complex multi-column tables and rating bars disrupt parsing and lower keyword match scores.',
    keywords: ['ATS Compatibility', 'Single-Column', 'Parser Friendliness'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-res-003',
    moduleId: 'resume-writing',
    topic: 'Page Length Benchmark for Freshers',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the industry standard page length for an undergraduate engineering student resume applying for campus placements?',
    options: [
      'Exactly 1 page',
      '5 to 7 pages',
      '10 pages minimum',
      'Half a page with no project details'
    ],
    correctAnswer: 'Exactly 1 page',
    explanation: 'Campus recruiters scan resumes in 6-7 seconds. A tightly curated single page ensures high-impact readability.',
    keywords: ['Page Length', 'Resume Formatting', 'Conciseness'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-res-004',
    moduleId: 'resume-writing',
    topic: 'High-Impact Action Verbs',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which set of action verbs demonstrates the strongest engineering agency and technical initiative on a resume?',
    options: [
      'Architected, Developed, Optimized, Deployed, Benchmarked',
      'Helped, Handled, Did, Looked at, Tried',
      'Participated in, Watched, Stood near, Wondered about',
      'Chatted with, Browsed, Attended, Thought of'
    ],
    correctAnswer: 'Architected, Developed, Optimized, Deployed, Benchmarked',
    explanation: 'Dynamic engineering action verbs convey proactive technical contribution rather than passive participation.',
    keywords: ['Action Verbs', 'Resume Agency', 'Impact'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-res-005',
    moduleId: 'resume-writing',
    topic: 'Resume Section Hierarchy',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the optimal logical section order for a first-year / pre-final year engineering student resume?',
    options: [
      'Contact Information -> Education -> Technical Skills -> Technical Projects -> Certifications / Leadership',
      'High School Hobbies -> Primary School Marks -> Video Game High Scores -> References',
      'Full Horoscope -> Photo Gallery -> List of Movies Watched -> Contact Information',
      'Salary Demands -> Personal Opinions -> Family Tree -> Technical Skills'
    ],
    correctAnswer: 'Contact Information -> Education -> Technical Skills -> Technical Projects -> Certifications / Leadership',
    explanation: 'This standard hierarchy immediately presents university credentials, verified technical competencies, and project artifacts to recruiters.',
    keywords: ['Section Hierarchy', 'Resume Structure', 'Recruitment Standards'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-res-006',
    moduleId: 'resume-writing',
    topic: 'Quantifying Technical Project Impact',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which resume bullet point most effectively demonstrates quantified engineering impact?',
    options: [
      'Optimized SQL query indexing and caching, reducing database response latency by 42% for 12,000 active concurrent users',
      'Worked on databases and made things faster',
      'Responsible for writing backend code for our group website',
      'Understood how servers work in our college laboratory'
    ],
    correctAnswer: 'Optimized SQL query indexing and caching, reducing database response latency by 42% for 12,000 active concurrent users',
    explanation: 'Specific metrics (42% latency reduction, 12,000 users) combined with exact engineering methods (query indexing, caching) validate technical skill.',
    keywords: ['Quantified Impact', 'Metrics', 'Engineering Proof'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-res-007',
    moduleId: 'resume-writing',
    topic: 'Contact Header & Professional Hyperlinks',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What essential contact details and professional links should be included in the top header of an engineering resume?',
    options: [
      'Full Name, Professional Phone Number, Institutional Email, City/State, LinkedIn URL, and GitHub Portfolio Link',
      'Home Street Address, Father\'s Name, Blood Group, Marital Status, and Instagram Handle',
      'High School Student ID, Zodiac Sign, and Favorite Video Game URL',
      'Only a nickname with no contact number or email'
    ],
    correctAnswer: 'Full Name, Professional Phone Number, Institutional Email, City/State, LinkedIn URL, and GitHub Portfolio Link',
    explanation: 'Modern contact headers focus strictly on professional reachability and verified repository links (GitHub/LinkedIn), omitting outdated personal data.',
    keywords: ['Contact Header', 'Portfolio Links', 'Privacy'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-res-008',
    moduleId: 'resume-writing',
    topic: '3-Paragraph Cover Letter Architecture',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the standard structural purpose of Paragraph 2 in a 3-paragraph tailored cover letter?',
    options: [
      'Showcase 1-2 specific technical achievements and projects that directly match the core requirements of the job description',
      'List all elementary school achievements and childhood dreams',
      'Demand salary negotiations and signing bonuses',
      'Complain about competing companies in the industry'
    ],
    correctAnswer: 'Showcase 1-2 specific technical achievements and projects that directly match the core requirements of the job description',
    explanation: 'Paragraph 2 is the core proof section where candidates showcase targeted project evidence matching the employer\'s specific technical requirements.',
    keywords: ['Cover Letter', 'Body Paragraph', 'Targeted Alignment'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-res-009',
    moduleId: 'resume-writing',
    topic: 'Keyword Alignment with Job Descriptions',
    courseOutcome: 'CO4',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'How should a candidate strategically tailor their resume for a specific Software Engineer job description without "keyword stuffing"?',
    options: [
      'Analyze the target job description for required frameworks (e.g. React, Docker), and naturally weave those technologies into the context of actual project bullets',
      'Paste the entire job description in 1-point white font in the resume background',
      'Claim 15 years of industry experience in every programming language invented',
      'Copy and paste fake company names into the work experience section'
    ],
    correctAnswer: 'Analyze the target job description for required frameworks (e.g. React, Docker), and naturally weave those technologies into the context of actual project bullets',
    explanation: 'Ethical and effective ATS alignment weaves genuine target technologies into authentic project descriptions with verifiable implementation details.',
    keywords: ['Keyword Optimization', 'Job Tailoring', 'ATS Optimization'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-res-010',
    moduleId: 'resume-writing',
    topic: 'Technical Skills Categorization',
    courseOutcome: 'CO4',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'How should technical skills be formatted on a modern engineering resume to ensure maximum human and ATS readability?',
    options: [
      'Grouped into distinct categorized rows (e.g., Languages: Python, C++; Frameworks: React, Express; Databases: PostgreSQL, Redis; Tools: Git, Docker)',
      'Listed as a single random paragraph of 80 comma-separated keywords with no categorization',
      'Displayed inside multi-colored pie charts with percentage mastery circles',
      'Written in binary ASCII code so only computers can read them'
    ],
    correctAnswer: 'Grouped into distinct categorized rows (e.g., Languages: Python, C++; Frameworks: React, Express; Databases: PostgreSQL, Redis; Tools: Git, Docker)',
    explanation: 'Categorized skill groups (Languages, Frameworks, Developer Tools, Cloud) allow engineering managers to assess stack fit within 3 seconds.',
    keywords: ['Skill Categorization', 'Readability', 'ATS Layout'],
    estimatedTimeSeconds: 35
  }
];
