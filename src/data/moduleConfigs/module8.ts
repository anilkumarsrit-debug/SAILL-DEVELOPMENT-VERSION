import { ModuleConfig } from '../../types/moduleConfig';

export const module8Config: ModuleConfig = {
  moduleId: 'resume-writing',
  code: 'R26-LAB-08',
  title: 'Resume & Cover Letter Writing for Placements',
  syllabusTopic: 'ATS Optimization, Action Verbs, XYZ Formatting Method, Section Hierarchy & Cover Letter Drafting',
  description: 'Master Applicant Tracking System (ATS) resume building, the Google XYZ bullet formula (Accomplished X by doing Y measured by Z), action verb selection, and tailored cover letters.',

  notebookConfig: {
    experimentNumber: 'EXP-08',
    aim: 'To construct an ATS-optimized single-page engineering resume using the Google XYZ bullet method and draft a tailored placement cover letter.',
    apparatus: ['SAILL ATS Resume Parser', 'Action Verb Generator', 'XYZ Formula Validator'],
    theory: 'Modern campus recruitment uses ATS software to screen resumes. High-scoring resumes use single-column layouts, standard headers, domain keywords, and quantified XYZ impact bullets.',
    procedure: [
      'Structure standard single-column sections: Contact Info, Education, Technical Skills, Projects, Experience, Certifications.',
      'Format project bullet points using the XYZ formula: Accomplished [X] as measured by [Y] by doing [Z].',
      'Incorporate strong action verbs (Architected, Developed, Optimized, Deployed) and domain keywords.',
      'Draft a 3-paragraph tailored cover letter highlighting technical alignment with target engineering roles.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - ATS RESUME & COVER LETTER (EXP-08):

1. GOOGLE XYZ FORMULA RESUME BULLETS:
   - Project 1: "Developed a real-time speech recognition engine achieving 94% accuracy across 12 regional accents by training custom neural network pipelines on Google Cloud Run."
   - Project 2: "Optimized database query response latency by 42% for 10,000 active concurrent users by implementing Redis caching and indexing key schemas."
   - Experience: "Architected 5 automated CI/CD deployment pipelines, reducing build failure rates from 18% to 2% using GitHub Actions and Docker."

2. TECHNICAL SKILLS CATEGORIZATION:
   - Languages: Python, TypeScript, C++, SQL
   - Frameworks: React.js, Node.js, Express, Tailwind CSS
   - Cloud & Tools: Google Cloud Run, Docker, Git, IndexedDB, Firebase

3. TAILORED COVER LETTER HIGHLIGHT:
   "As a First-Year Computer Science & Engineering student at SRIT with hands-on experience building full-stack web applications and AI tools, I am eager to contribute to your engineering internship program..."`,
    defaultReflection: 'Applying the XYZ formula transformed vague descriptions ("worked on a web app") into high-impact quantified achievements ("Optimized query latency by 42%").',
    rubricCriteria: [
      { name: 'ATS Compatibility & Formatting', maxScore: 20, description: 'Single-column layout, standard fonts, clear headings, zero graphic clutter.' },
      { name: 'XYZ Bullet Impact & Metrics', maxScore: 20, description: 'Quantified results with clear Action, Task, and Measurable Metric.' },
      { name: 'Strong Action Verbs Usage', maxScore: 20, description: 'Uses powerful engineering action verbs (Engineered, Deployed, Built).' },
      { name: 'Keyword Alignment', maxScore: 20, description: 'Includes essential technical domain skills matching industry job descriptions.' },
      { name: 'Cover Letter Customization', maxScore: 20, description: 'Tailored 3-paragraph letter demonstrating genuine company/role fit.' }
    ],
    targetOutputs: ['Single-Page ATS Resume PDF/Draft', 'XYZ Bullet Checklist Report', 'Tailored Cover Letter'],
    facultySampleRemarks: 'Outstanding resume formatting. Every bullet point follows the XYZ formula with impressive quantified metrics. Approved for campus recruitment drive.'
  },

  knowledgeCheck: {
    title: 'Resume & Cover Letter Writing Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'r-q1',
        type: 'mcq',
        prompt: 'What does the Google XYZ bullet formula for resumes stand for?',
        options: [
          'Accomplished [X], as measured by [Y], by doing [Z]',
          'eXamine [X], Yield [Y], Zero errors [Z]',
          'X-ray, Yellow, Zone',
          'XML, Yttrium, Zinc'
        ],
        correctAnswer: 'Accomplished [X], as measured by [Y], by doing [Z]',
        explanation: 'Google XYZ formula: Accomplished [X] (result), as measured by [Y] (metric), by doing [Z] (method/technology).'
      },
      {
        id: 'r-q2',
        type: 'mcq',
        prompt: 'Why should entry-level engineering students avoid multi-column graphic resumes with rating sliders (e.g. 4/5 stars in Python)?',
        options: [
          'ATS software parsers often fail to extract text from multi-column graphical layouts accurately',
          'They take too long to print',
          'Rating sliders are forbidden by law',
          'Graphic resumes use too much ink'
        ],
        correctAnswer: 'ATS software parsers often fail to extract text from multi-column graphical layouts accurately',
        explanation: 'ATS parsers read left-to-right top-to-bottom and often mangle multi-column tables and skill bars.'
      },
      {
        id: 'r-q3',
        type: 'mcq',
        prompt: 'What is the industry standard page length for an undergraduate engineering student resume applying for campus placements?',
        options: [
          'Exactly 1 page',
          '5 to 7 pages',
          '10 pages minimum',
          'Half a page with no project details'
        ],
        correctAnswer: 'Exactly 1 page',
        explanation: 'Campus recruiters scan resumes in 6-7 seconds. A tightly curated single page ensures high-impact readability.'
      },
      {
        id: 'r-q4',
        type: 'mcq',
        prompt: 'Which set of action verbs demonstrates the strongest engineering agency and technical initiative on a resume?',
        options: [
          'Architected, Developed, Optimized, Deployed, Benchmarked',
          'Helped, Handled, Did, Looked at, Tried',
          'Participated in, Watched, Stood near, Wondered about',
          'Chatted with, Browsed, Attended, Thought of'
        ],
        correctAnswer: 'Architected, Developed, Optimized, Deployed, Benchmarked',
        explanation: 'Dynamic engineering action verbs convey proactive technical contribution rather than passive participation.'
      },
      {
        id: 'r-q5',
        type: 'mcq',
        prompt: 'What is the optimal logical section order for a first-year / pre-final year engineering student resume?',
        options: [
          'Contact Information -> Education -> Technical Skills -> Technical Projects -> Certifications / Leadership',
          'High School Hobbies -> Primary School Marks -> Video Game High Scores -> References',
          'Full Horoscope -> Photo Gallery -> List of Movies Watched -> Contact Information',
          'Salary Demands -> Personal Opinions -> Family Tree -> Technical Skills'
        ],
        correctAnswer: 'Contact Information -> Education -> Technical Skills -> Technical Projects -> Certifications / Leadership',
        explanation: 'This standard hierarchy immediately presents university credentials, verified technical competencies, and project artifacts.'
      },
      {
        id: 'r-q6',
        type: 'mcq',
        prompt: 'Which resume bullet point most effectively demonstrates quantified engineering impact?',
        options: [
          'Optimized SQL query indexing and caching, reducing database response latency by 42% for 12,000 active concurrent users',
          'Worked on databases and made things faster',
          'Responsible for writing backend code for our group website',
          'Understood how servers work in our college laboratory'
        ],
        correctAnswer: 'Optimized SQL query indexing and caching, reducing database response latency by 42% for 12,000 active concurrent users',
        explanation: 'Specific metrics (42% latency reduction, 12,000 users) combined with exact engineering methods validate technical skill.'
      },
      {
        id: 'r-q7',
        type: 'mcq',
        prompt: 'What essential contact details and professional links should be included in the top header of an engineering resume?',
        options: [
          'Full Name, Professional Phone Number, Institutional Email, City/State, LinkedIn URL, and GitHub Portfolio Link',
          'Home Street Address, Father\'s Name, Blood Group, Marital Status, and Instagram Handle',
          'High School Student ID, Zodiac Sign, and Favorite Video Game URL',
          'Only a nickname with no contact number or email'
        ],
        correctAnswer: 'Full Name, Professional Phone Number, Institutional Email, City/State, LinkedIn URL, and GitHub Portfolio Link',
        explanation: 'Modern contact headers focus strictly on professional reachability and verified repository links (GitHub/LinkedIn).'
      },
      {
        id: 'r-q8',
        type: 'mcq',
        prompt: 'What is the standard structural purpose of Paragraph 2 in a 3-paragraph tailored cover letter?',
        options: [
          'Showcase 1-2 specific technical achievements and projects that directly match the core requirements of the job description',
          'List all elementary school achievements and childhood dreams',
          'Demand salary negotiations and signing bonuses',
          'Complain about competing companies in the industry'
        ],
        correctAnswer: 'Showcase 1-2 specific technical achievements and projects that directly match the core requirements of the job description',
        explanation: 'Paragraph 2 is the core proof section where candidates showcase targeted project evidence matching the employer\'s requirements.'
      },
      {
        id: 'r-q9',
        type: 'mcq',
        prompt: 'How should a candidate strategically tailor their resume for a specific Software Engineer job description without "keyword stuffing"?',
        options: [
          'Analyze the target job description for required frameworks (e.g. React, Docker), and naturally weave those technologies into the context of actual project bullets',
          'Paste the entire job description in 1-point white font in the resume background',
          'Claim 15 years of industry experience in every programming language invented',
          'Copy and paste fake company names into the work experience section'
        ],
        correctAnswer: 'Analyze the target job description for required frameworks (e.g. React, Docker), and naturally weave those technologies into the context of actual project bullets',
        explanation: 'Ethical and effective ATS alignment weaves genuine target technologies into authentic project descriptions.'
      },
      {
        id: 'r-q10',
        type: 'mcq',
        prompt: 'How should technical skills be formatted on a modern engineering resume to ensure maximum human and ATS readability?',
        options: [
          'Grouped into distinct categorized rows (e.g., Languages: Python, C++; Frameworks: React, Express; Databases: PostgreSQL, Redis; Tools: Git, Docker)',
          'Listed as a single random paragraph of 80 comma-separated keywords with no categorization',
          'Displayed inside multi-colored pie charts with percentage mastery circles',
          'Written in binary ASCII code so only computers can read them'
        ],
        correctAnswer: 'Grouped into distinct categorized rows (e.g., Languages: Python, C++; Frameworks: React, Express; Databases: PostgreSQL, Redis; Tools: Git, Docker)',
        explanation: 'Categorized skill groups allow engineering managers to assess stack fit within 3 seconds.'
      }
    ]
  },

  resources: [
    {
      id: 'res-r1',
      title: 'ATS Resume Action Verbs List & XYZ Guide',
      type: 'reference',
      description: 'Categorized list of 100+ high-impact action verbs for engineering project bullets.',
      content: `ENGINEERING ACTION VERBS & XYZ BULLET FORMULA

CATEGORIZED ACTION VERBS:
- Software Development: Architected, Programmed, Built, Refactored, Deployed, Integrated
- Optimization & Performance: Accelerated, Streamlined, Reduced, Quantified, Enhanced
- Research & Analytics: Modeled, Analyzed, Simulated, Formulated, Benchmark, Audited
- Leadership & Project: Directed, Coordinated, Spearheaded, Managed, Standardized

THE XYZ FORMULA EXAMPLE:
- Weak Bullet: "Built a website for student attendance."
- Strong XYZ Bullet: "Engineered a responsive PWA attendance system used by 500+ SRIT students, reducing morning roll-call duration by 60% using IndexedDB offline sync."`
    }
  ],

  recordWork: {
    title: 'Resume & Cover Letter Submissions',
    instructions: 'Upload your single-page ATS-optimized resume draft and cover letter for AI parser evaluation.',
    allowedFormats: ['pdf', 'docx'],
    submissionGuidelines: [
      'Ensure single-column layout with clean standard headings.',
      'Quantify at least 3 project bullet points using the XYZ formula.'
    ]
  },

  reflectionConfig: {
    title: 'Module 8 Reflection & Career Branding',
    instructions: 'Reflect on your resume ATS score and career positioning strategy.',
    questions: [
      'How many quantifiable metrics (%, x, numbers) did you include in your project section?',
      'Did your resume pass the ATS single-column parser test cleanly?',
      'How effectively does your cover letter communicate your passion for engineering roles?',
      'What technical projects will you build next to strengthen your resume further?'
    ],
    rubricFocus: ['Career self-awareness', 'Metric orientation']
  },

  portfolioConfig: {
    title: 'Resume & Career Portfolio',
    artifactCategories: ['ATS-Optimized Resume Draft', 'XYZ Bullet Sheet', 'Placement Cover Letter'],
    rubricCriteria: ['ATS Compatibility (35%)', 'XYZ Metrics (35%)', 'Overall Presentation (30%)']
  },

  statusConfig: {
    targetScore: 95,
    requiredTasks: [
      'Construct ATS-Optimized Single-Page Resume',
      'Draft Placement Cover Letter',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-08'
    ],
    skillsMastered: ['ATS Optimization', 'XYZ Bullet Formula', 'Action Verbs Selection', 'Cover Letter Customization'],
    recommendations: [
      'Keep resume strictly to 1 page with 0.5-inch margins.',
      'Re-scan resume against target job description keywords before every placement drive.'
    ],
    passingThreshold: 75
  }
};
