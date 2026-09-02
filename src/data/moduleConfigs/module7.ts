import { ModuleConfig } from '../../types/moduleConfig';

export const module7Config: ModuleConfig = {
  moduleId: 'professional-email',
  code: 'R26-LAB-07',
  title: 'Professional Email Correspondence & Communication',
  syllabusTopic: 'Subject Line Precision, Professional Salutations, BLUF Framework, Professional Tone & Follow-Up Etiquette',
  description: 'Master formal email formatting, crafting compelling subject lines, the BLUF (Bottom Line Up Front) structure, professional call-to-action phrasing, and follow-up diplomacy.',

  notebookConfig: {
    experimentNumber: 'EXP-07',
    aim: 'To draft crisp, actionable formal engineering emails using the BLUF framework, clear subject lines, and professional sign-offs.',
    apparatus: ['SAILL Email Drafter Engine', 'BLUF Structure Inspector', 'Email Tone Analyzer'],
    theory: 'Corporate email communication requires concise subject lines (< 8 words), BLUF structure (core request in sentence 1), professional salutation, bulleted details, clear call to action (CTA), and professional signature.',
    procedure: [
      'Analyze the corporate scenario (e.g., Requesting a project deadline extension or bug escalation).',
      'Draft a specific, searchable subject line (e.g. "Project Alpha: 2-Day Extension Request - CSE Section A").',
      'Write opening BLUF sentence stating the exact purpose immediately.',
      'Provide concise bulleted justification and close with a clear deadline CTA.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - PROFESSIONAL EMAIL DRAFT (EXP-07):

SCENARIO: Requesting Project Deadline Extension from Faculty / Project Manager

SUBJECT: Project Alpha: Request for 2-Day Submission Extension - Reg.

DEAR PROF. SHARMA,

[BLUF SENTENCE]
I am writing to formally request a 2-day deadline extension for the Final Lab Report on Cloud Microservices, moving our submission date from July 28 to July 30, 2026.

[BACKGROUND & JUSTIFICATION]
During our benchmark load testing on the Cloud Run container server, our team encountered unexpected database connection pooling throttling. Extending our deadline will allow us to:
- Resolve the connection pool bottleneck under load.
- Re-run full test suites and capture complete telemetry metrics.
- Ensure our documentation meets SRIT R26 publication standards.

[CALL TO ACTION & SIGN-OFF]
Please let me know if this extension is approved. We appreciate your guidance and support.

RESPECTFULLY YOURS,
FIRST-YEAR ENGINEERING STUDENT
ROLL NO: 264G1A0501 | CSE-A
SRIT ANANTAPUR`,
    defaultReflection: 'Using the BLUF framework placed my main request right in the first sentence. The faculty reviewer can instantly understand my email without reading through paragraphs of background first.',
    rubricCriteria: [
      { name: 'Subject Line Quality', maxScore: 20, description: 'Specific, actionable, searchable, and concise (< 8 words).' },
      { name: 'BLUF Structure Execution', maxScore: 20, description: 'Bottom Line Up Front stated clearly in the first paragraph.' },
      { name: 'Tone & Professional Salutation', maxScore: 20, description: 'Respectful, formal, and free of casual slang or typos.' },
      { name: 'Formatting & Scannability', maxScore: 20, description: 'Short paragraphs, bullet points, and appropriate line spacing.' },
      { name: 'Call to Action (CTA) & Signature', maxScore: 20, description: 'Clear next steps, contact info, and formal professional sign-off.' }
    ],
    targetOutputs: ['Formal Email Draft', 'BLUF Checklist Analysis', 'Email Tone Assessment'],
    facultySampleRemarks: 'Perfect email structure. Subject line is searchable, BLUF is placed upfront, and formatting is professional. Approved.'
  },

  knowledgeCheck: {
    title: 'Professional Email Correspondence Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'pe-q1',
        type: 'mcq',
        prompt: 'What does the professional corporate email acronym BLUF stand for?',
        options: [
          'Bottom Line Up Front',
          'Brief Lines Under Format',
          'Basic Language Used First',
          'Business Letter Unified Form'
        ],
        correctAnswer: 'Bottom Line Up Front',
        explanation: 'BLUF stands for Bottom Line Up Front — stating the primary request or conclusion in sentence 1.'
      },
      {
        id: 'pe-q2',
        type: 'mcq',
        prompt: 'Which subject line is most professional and searchable for an engineering project submission?',
        options: [
          'CSE-A: Mini Project Report Submission - Team 04 - Reg.',
          'Submission',
          'URGENT PLEASE OPEN IMMEDIATELY!!!!!!',
          'Hey check this out'
        ],
        correctAnswer: 'CSE-A: Mini Project Report Submission - Team 04 - Reg.',
        explanation: 'It clearly specifies section, project context, team identification, and standard reference markers.'
      },
      {
        id: 'pe-q3',
        type: 'mcq',
        prompt: 'When addressing a university professor or department head for the first time via email, which salutation is appropriate?',
        options: [
          'Dear Prof. Sharma, or Dear Dr. Sharma,',
          'Hey buddy,',
          'Yo Prof,',
          'What\'s up,'
        ],
        correctAnswer: 'Dear Prof. Sharma, or Dear Dr. Sharma,',
        explanation: 'Formal titles followed by surname establish respect and academic decorum in initial outreach.'
      },
      {
        id: 'pe-q4',
        type: 'mcq',
        prompt: 'What is the primary functional difference between CC (Carbon Copy) and BCC (Blind Carbon Copy) in workplace correspondence?',
        options: [
          'CC recipients are visible to all parties to keep stakeholders informed; BCC hides recipient email addresses to preserve privacy and prevent accidental Reply-All storms',
          'CC encrypts the message; BCC deletes the email after 24 hours',
          'CC is for internal company employees only; BCC is for external clients only',
          'CC attaches files automatically; BCC prevents downloading attachments'
        ],
        correctAnswer: 'CC recipients are visible to all parties to keep stakeholders informed; BCC hides recipient email addresses to preserve privacy and prevent accidental Reply-All storms',
        explanation: 'CC keeps stakeholders looped in transparently, whereas BCC protects privacy.'
      },
      {
        id: 'pe-q5',
        type: 'mcq',
        prompt: 'How should an engineer formulate a clear Call to Action (CTA) in a formal request email?',
        options: [
          'State the exact expected deliverable, decision required, and clear calendar deadline (e.g. "Kindly approve the attached schema by Thursday, 4 PM")',
          'Write "Do something about this whenever you feel like it"',
          'Leave the end of the email blank so the recipient can guess what is needed',
          'Demand an immediate reply within 30 seconds'
        ],
        correctAnswer: 'State the exact expected deliverable, decision required, and clear calendar deadline (e.g. "Kindly approve the attached schema by Thursday, 4 PM")',
        explanation: 'A specific CTA eliminates ambiguity by defining the action item and target deadline.'
      },
      {
        id: 'pe-q6',
        type: 'mcq',
        prompt: 'What is the correct business etiquette when sending technical files or datasets via email?',
        options: [
          'Mention the attachment in the body text and share secure cloud repository links for files exceeding 10–25 MB',
          'Send 50 individual emails each containing a 1 MB chunk of data without explanation',
          'Rename executable viruses to .zip and send without mentioning them',
          'Never mention attachments and assume the recipient will search their spam folder'
        ],
        correctAnswer: 'Mention the attachment in the body text and share secure cloud repository links for files exceeding 10–25 MB',
        explanation: 'Noting attachments prevents missed files, and cloud links avoid inbox size limits.'
      },
      {
        id: 'pe-q7',
        type: 'mcq',
        prompt: 'Which closing sign-off is standard and polished for formal corporate and academic correspondence?',
        options: [
          'Sincerely, or Warm regards, followed by full name, roll number, and department',
          'Cya later,',
          'Peace out,',
          'Sent from my gaming console'
        ],
        correctAnswer: 'Sincerely, or Warm regards, followed by full name, roll number, and department',
        explanation: 'Formal sign-offs followed by complete credentials maintain professionalism and traceability.'
      },
      {
        id: 'pe-q8',
        type: 'mcq',
        prompt: 'Why should engineers avoid composing entire email sentences or subject lines in ALL CAPS?',
        options: [
          'In digital communication etiquette, ALL CAPS is universally interpreted as aggressive shouting',
          'Email servers automatically reject emails containing any uppercase characters',
          'Uppercase text consumes triple the internet bandwidth',
          'Screen readers cannot process capital letters'
        ],
        correctAnswer: 'In digital communication etiquette, ALL CAPS is universally interpreted as aggressive shouting',
        explanation: 'Using ALL CAPS creates an abrasive, unprofessional tone equivalent to shouting.'
      },
      {
        id: 'pe-q9',
        type: 'mcq',
        prompt: 'When a critical faculty or manager approval is overdue by three days, how should a follow-up email be phrased?',
        options: [
          'Politely restate the context, reference the previous thread date, emphasize the upcoming milestone, and inquire if any additional details are required',
          'Send an angry message threatening to escalate to the university chancellor',
          'Forward the original email 20 times in 10 minutes with no text',
          'Delete the project entirely and abandon the task'
        ],
        correctAnswer: 'Politely restate the context, reference the previous thread date, emphasize the upcoming milestone, and inquire if any additional details are required',
        explanation: 'A diplomatic follow-up preserves relationships while clearly communicating time-sensitive project dependencies.'
      },
      {
        id: 'pe-q10',
        type: 'mcq',
        prompt: 'How can the informal sentence "Your backend API is broken and keeping me from finishing my lab work" be transformed into professional, constructive email prose?',
        options: [
          'During API endpoint testing, we observed a 500 status code on the auth route. Could you please review the attached payload log so we can resume integration?',
          'Fix your broken code right now or we will fail the lab.',
          'Everything is ruined because the backend does not work.',
          'I am writing to report that the API developer is incompetent.'
        ],
        correctAnswer: 'During API endpoint testing, we observed a 500 status code on the auth route. Could you please review the attached payload log so we can resume integration?',
        explanation: 'Professional engineering correspondence describes objective technical observations (error codes, logs) and requests collaborative resolution.'
      }
    ]
  },

  resources: [
    {
      id: 'res-pe1',
      title: 'Corporate Email Architecture & BLUF Template',
      type: 'template',
      description: 'Standardized formal email templates for leave applications, project extensions, and job follow-ups.',
      content: `STANDARD FORMAL EMAIL TEMPLATE (BLUF)

SUBJECT: [Action/Topic]: [Brief Details] - [Your Name / Roll No]

DEAR [RECIPIENT NAME / TITLE],

[BLUF SENTENCE]
I am writing to [state exact purpose/request directly].

[JUSTIFICATION / BULLETED DETAILS]
Here are the key details regarding this request:
- Point 1: [Detail]
- Point 2: [Detail]

[CALL TO ACTION]
Could you please confirm if [specific request/approval] is possible by [Date/Time]?

THANK YOU FOR YOUR TIME AND ASSISTANCE.

SINCERELY,
[YOUR NAME]
[YOUR ROLL NO / DESIGNATION]
[SRIT ANANTAPUR]`
    }
  ],

  recordWork: {
    title: 'Professional Email Submissions',
    instructions: 'Submit drafted emails for corporate scenarios and faculty requests for AI tone and BLUF evaluation.',
    allowedFormats: ['docx', 'pdf'],
    submissionGuidelines: [
      'Subject line must be under 8 words.',
      'BLUF request must appear in sentence 1.'
    ]
  },

  reflectionConfig: {
    title: 'Module 7 Reflection & Email Writing Growth',
    instructions: 'Reflect on your formal email writing habits and tone appropriateness.',
    questions: [
      'How does applying BLUF change how quickly a manager or professor responds to your emails?',
      'Did you eliminate informal language (e.g. "hey", "thx", "plz") from your formal drafts?',
      'How scannable are your email bullet points on a mobile screen?',
      'What email habits will you maintain during campus placement communication?'
    ],
    rubricFocus: ['Professional tone maturity', 'BLUF adoption']
  },

  portfolioConfig: {
    title: 'Professional Email Artifacts Portfolio',
    artifactCategories: ['Project Extension Email', 'Faculty Request Email', 'Campus Placement Follow-Up'],
    rubricCriteria: ['BLUF & Clarity (35%)', 'Subject Line (30%)', 'Tone & Sign-Off (30%)']
  },

  statusConfig: {
    targetScore: 92,
    requiredTasks: [
      'Draft Formal Email using BLUF Framework',
      'Submit Email Draft to Portfolio',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-07'
    ],
    skillsMastered: ['BLUF Structure', 'Actionable Subject Lines', 'Professional Tone', 'Corporate Email Etiquette'],
    recommendations: [
      'Keep subject lines under 8 words with clear prefixes like [REQUEST] or [URGENT].',
      'Always proofread email drafts on mobile preview to ensure scannability.'
    ],
    passingThreshold: 75
  }
};
