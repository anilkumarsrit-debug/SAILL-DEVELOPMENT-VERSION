import { ModuleConfig } from '../../types/moduleConfig';

export const module12Config: ModuleConfig = {
  moduleId: 'etiquette-branding',
  code: 'R26-LAB-12',
  title: 'Etiquette, Netiquette & Personal Branding',
  syllabusTopic: 'Workplace Etiquette, Digital Netiquette, LinkedIn Profile Optimization, Executive Presence & Personal Brand Positioning',
  description: 'Master professional workplace decorum, digital communication netiquette, LinkedIn profile optimization, digital footprint management, and professional personal branding.',

  notebookConfig: {
    experimentNumber: 'EXP-12',
    aim: 'To develop a professional workplace etiquette framework, audit digital netiquette, optimize an ATS-aligned LinkedIn profile, and define a unique personal brand statement.',
    apparatus: ['SAILL Personal Branding Studio', 'LinkedIn Profile Analyzer', 'Digital Footprint Auditor'],
    theory: 'Personal branding in engineering combines technical competence, professional etiquette (punctuality, active listening, cubicle decorum), digital netiquette (video call etiquette, Slack/Teams hygiene), and an optimized LinkedIn presence.',
    procedure: [
      'Conduct a 360-degree Workplace & Digital Netiquette audit across 12 professional benchmarks.',
      'Construct a compelling 3-sentence LinkedIn Headline & About section using targeted engineering keywords.',
      'Develop a Personal Brand Positioning Statement highlighting core technical skills and career aspirations.',
      'Formulate executive presence guidelines for online team meetings and corporate messaging platforms.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - ETIQUETTE, NETIQUETTE & PERSONAL BRANDING (EXP-12):

1. LINKEDIN PROFILE OPTIMIZATION:
   - Optimized Headline: "Computer Science & Engineering Undergrad @ SRIT | Full-Stack PWA & AI Developer | Building Scalable Cloud Apps with React & Node.js"
   - Executive About Section: "Passionate first-year CSE engineering student specializing in cloud-native application development, React UI/UX design, and AI integrations. Proficient in TypeScript, Python, and IndexedDB database architecture. Active contributor to campus open-source projects and R26 Language Lab innovations."

2. DIGITAL NETIQUETTE & WORKPLACE ETIQUETTE FRAMEWORK:
   - Video Call Hygiene: Camera on with neutral background, mute when not speaking, use raise-hand feature for questions.
   - Corporate Chat (Slack/Teams): Avoid fragmented 1-word messages ("Hey"); send structured single-message context.
   - Cubicle & Workplace Etiquette: Respect quiet zones, observe punctual arrival for standups, maintain professional attire.

3. PERSONAL BRAND POSITIONING STATEMENT:
   "I bridge technical AI engineering with clean user-centric software design to build performant, accessible digital tools that empower users."`,
    defaultReflection: 'Optimizing my LinkedIn headline and reviewing digital netiquette transformed how I present myself to recruiters. I learned that professional presence is as vital as coding skills.',
    rubricCriteria: [
      { name: 'LinkedIn Headline & About Quality', maxScore: 20, description: 'Keyword-rich, compelling, and professional headline and summary.' },
      { name: 'Digital Netiquette Awareness', maxScore: 20, description: 'Demonstrates clear hygiene standards for video calls and team chats.' },
      { name: 'Workplace Etiquette & Decorum', maxScore: 20, description: 'Applies professional workplace etiquette and cross-cultural respect.' },
      { name: 'Personal Brand Positioning', maxScore: 20, description: 'Clear, memorable brand statement highlighting core technical identity.' },
      { name: 'Digital Footprint & Executive Presence', maxScore: 20, description: 'Clean digital footprint, professional avatar, and polished tone.' }
    ],
    targetOutputs: ['LinkedIn Profile Audit Report', 'Personal Brand Statement', 'Netiquette Checklist'],
    facultySampleRemarks: 'Outstanding personal branding output. LinkedIn headline is keyword-dense and digital netiquette audit demonstrates high professional maturity. Approved.'
  },

  knowledgeCheck: {
    title: 'Etiquette, Netiquette & Personal Branding Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'eb-q1',
        type: 'mcq',
        prompt: 'Which LinkedIn headline is most effective for an engineering student seeking software development internships?',
        options: [
          '"Student at SRIT"',
          '"Looking for opportunities / hard worker"',
          '"CSE Engineering Student @ SRIT | Full-Stack Web Developer | React & Node.js Enthusiast"',
          '"Coding genius and tech guru"'
        ],
        correctAnswer: '"CSE Engineering Student @ SRIT | Full-Stack Web Developer | React & Node.js Enthusiast"',
        explanation: 'It includes education, specific role, and target technical keywords (React, Node.js) for recruiter searches.'
      },
      {
        id: 'eb-q2',
        type: 'mcq',
        prompt: 'In corporate messaging platforms (Slack, Microsoft Teams), what is best practice regarding messaging etiquette?',
        options: [
          'Sending 5 separate messages saying "Hi", "Are you free", "Quick question", "Hello", "Thanks"',
          'Sending a single structured message stating "Hi [Name], [Context/Question in 2-3 concise lines]"',
          'Calling without warning repeatedly',
          'Using informal slang and emojis exclusively'
        ],
        correctAnswer: 'Sending a single structured message stating "Hi [Name], [Context/Question in 2-3 concise lines]"',
        explanation: 'Single structured messages respect recipient attention and prevent notification spam.'
      },
      {
        id: 'eb-q3',
        type: 'true_false',
        prompt: 'True or False: Your public social media posts and digital footprint can be reviewed by corporate background check teams.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Recruiters routinely review candidate digital footprints to assess professional alignment.'
      },
      {
        id: 'eb-q4',
        type: 'fill_blank',
        prompt: 'Network etiquette guidelines governing respectful digital communication in video calls and chats are known as ______.',
        correctAnswer: 'netiquette',
        explanation: 'Netiquette is a portmanteau of network and etiquette.'
      }
    ]
  },

  resources: [
    {
      id: 'res-eb1',
      title: 'LinkedIn Profile Optimization & Personal Branding Guide',
      type: 'reference',
      description: 'Step-by-step guide to building a recruiter-ready LinkedIn profile and personal brand.',
      content: `LINKEDIN PROFILE OPTIMIZATION GUIDE FOR ENGINEERS

1. HEADLINE FORMULA:
   [Current Role/Branch] @ [College] | [Core Technical Skills] | [Building/Project Interest]
   Example: "CSE Undergrad @ SRIT | Python & Machine Learning | Building Open-Source AI Tools"

2. ABOUT SECTION STRUCTURE:
   - Paragraph 1: Who you are & your engineering passion.
   - Paragraph 2: Key technical competencies & major project achievements.
   - Paragraph 3: Career goals & invitation to connect.

3. DIGITAL NETIQUETTE CHEAT SHEET:
   - Video Calls: Mute when not speaking, test mic before joining, maintain eye contact with camera.
   - Email/Chat: Use professional salutations, avoid 1-word messages, maintain proper punctuation.`
    }
  ],

  recordWork: {
    title: 'Personal Branding Submissions',
    instructions: 'Upload optimized LinkedIn profile text drafts, brand positioning statements, and netiquette audit reports.',
    allowedFormats: ['pdf', 'docx'],
    submissionGuidelines: [
      'Include LinkedIn Headline and About section.',
      'State 3-sentence Personal Brand Positioning Statement.'
    ]
  },

  reflectionConfig: {
    title: 'Module 12 Reflection & Personal Brand Growth',
    instructions: 'Reflect on your workplace etiquette, digital footprint, and professional branding goals.',
    questions: [
      'How keyword-rich and recruiter-friendly is your updated LinkedIn profile headline?',
      'What changes did you make to improve your digital netiquette during video calls and messaging?',
      'How does your Personal Brand Statement differentiate you from other engineering graduates?',
      'What ongoing habits will you maintain to build a strong professional reputation in tech?'
    ],
    rubricFocus: ['Professional brand clarity', 'Netiquette maturity']
  },

  portfolioConfig: {
    title: 'Etiquette, Netiquette & Personal Branding Portfolio',
    artifactCategories: ['Optimized LinkedIn Profile Text', 'Personal Brand Statement', 'Digital Netiquette Audit'],
    rubricCriteria: ['Profile Quality (35%)', 'Brand Positioning (35%)', 'Netiquette & Tone (30%)']
  },

  statusConfig: {
    targetScore: 95,
    requiredTasks: [
      'Complete LinkedIn Profile Optimization Draft',
      'Formulate Personal Brand Positioning Statement',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-12'
    ],
    skillsMastered: ['LinkedIn Optimization', 'Digital Netiquette', 'Workplace Etiquette', 'Personal Branding'],
    recommendations: [
      'Update your LinkedIn profile with new project links every month.',
      'Maintain an active GitHub and LinkedIn presence sharing technical learning milestones.'
    ],
    passingThreshold: 75
  }
};
