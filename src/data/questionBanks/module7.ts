import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module7Questions: QuestionBankItem[] = [
  {
    id: 'qb-em-001',
    moduleId: 'professional-email',
    topic: 'The BLUF Email Framework',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the professional corporate email acronym BLUF stand for?',
    options: [
      'Bottom Line Up Front',
      'Brief Lines Under Format',
      'Basic Language Used First',
      'Business Letter Unified Form'
    ],
    correctAnswer: 'Bottom Line Up Front',
    explanation: 'BLUF (Bottom Line Up Front) mandates stating the primary purpose, decision, or request in the opening sentence for rapid comprehension.',
    keywords: ['BLUF', 'Email Structure', 'Business Communication'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-em-002',
    moduleId: 'professional-email',
    topic: 'Email Subject Line Best Practices',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which of the following subject lines is the most effective, searchable, and professional for an engineering project submission?',
    options: [
      'CSE-A: Mini Project Report Submission - Team 04 - Reg.',
      'Submission',
      'URGENT PLEASE OPEN IMMEDIATELY!!!!!!',
      'Hey sir check this attached file'
    ],
    correctAnswer: 'CSE-A: Mini Project Report Submission - Team 04 - Reg.',
    explanation: 'A strong subject line includes section, project context, team identification, and standard reference markers for archival searchability.',
    keywords: ['Subject Line', 'Searchability', 'Clarity'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-em-003',
    moduleId: 'professional-email',
    topic: 'Professional Salutations',
    courseOutcome: 'CO4',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'When addressing a university professor or department head for the first time via email, which salutation is appropriate?',
    options: [
      'Dear Prof. Sharma, or Dear Dr. Sharma,',
      'Hey buddy,',
      'Yo Prof,',
      'What\'s up,'
    ],
    correctAnswer: 'Dear Prof. Sharma, or Dear Dr. Sharma,',
    explanation: 'Formal titles (Prof. / Dr.) followed by the surname establish respect and academic decorum in initial professional outreach.',
    keywords: ['Salutation', 'Etiquette', 'Academic Decorum'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-em-004',
    moduleId: 'professional-email',
    topic: 'CC vs BCC Protocols',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the primary functional difference between CC (Carbon Copy) and BCC (Blind Carbon Copy) in workplace correspondence?',
    options: [
      'CC recipients are visible to all parties to keep stakeholders informed; BCC hides recipient email addresses to preserve privacy and prevent accidental Reply-All storms',
      'CC encrypts the message; BCC deletes the email after 24 hours',
      'CC is for internal company employees only; BCC is for external clients only',
      'CC attaches files automatically; BCC prevents downloading attachments'
    ],
    correctAnswer: 'CC recipients are visible to all parties to keep stakeholders informed; BCC hides recipient email addresses to preserve privacy and prevent accidental Reply-All storms',
    explanation: 'CC keeps relevant collaborators looped in transparently, whereas BCC protects contact privacy when broadcasting to large groups.',
    keywords: ['CC', 'BCC', 'Email Protocol', 'Privacy'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-em-005',
    moduleId: 'professional-email',
    topic: 'Action-Oriented Call to Action (CTA)',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How should an engineer formulate a clear Call to Action (CTA) in a formal request email?',
    options: [
      'State the exact expected deliverable, decision required, and clear calendar deadline (e.g. "Kindly approve the attached schema by Thursday, 4 PM")',
      'Write "Do something about this whenever you feel like it"',
      'Leave the end of the email blank so the recipient can guess what is needed',
      'Demand an immediate reply within 30 seconds'
    ],
    correctAnswer: 'State the exact expected deliverable, decision required, and clear calendar deadline (e.g. "Kindly approve the attached schema by Thursday, 4 PM")',
    explanation: 'A specific CTA eliminates ambiguity by defining the concrete action item, assigned owner, and target deadline.',
    keywords: ['Call to Action', 'CTA', 'Deadlines', 'Deliverables'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-em-006',
    moduleId: 'professional-email',
    topic: 'Attachment Etiquette & Large Files',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the correct business etiquette when sending technical files or datasets via email?',
    options: [
      'Mention the attachment in the body text and share secure cloud repository links for files exceeding 10–25 MB',
      'Send 50 individual emails each containing a 1 MB chunk of data without explanation',
      'Rename executable viruses to .zip and send without mentioning them',
      'Never mention attachments and assume the recipient will search their spam folder'
    ],
    correctAnswer: 'Mention the attachment in the body text and share secure cloud repository links for files exceeding 10–25 MB',
    explanation: 'Explicitly noting attachments in the email body prevents missed files, while cloud links avoid exceeding recipient mailbox size limits.',
    keywords: ['Attachments', 'Cloud Links', 'File Sharing'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-em-007',
    moduleId: 'professional-email',
    topic: 'Tone Calibration & Professional Sign-offs',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which closing sign-off is standard and polished for formal corporate and academic correspondence?',
    options: [
      'Sincerely, or Warm regards, followed by full name, roll number, and department',
      'Cya later,',
      'Peace out,',
      'Sent from my gaming console'
    ],
    correctAnswer: 'Sincerely, or Warm regards, followed by full name, roll number, and department',
    explanation: 'Formal sign-offs followed by complete institutional credentials maintain professionalism and ensure sender traceability.',
    keywords: ['Sign-off', 'Signature', 'Professionalism'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-em-008',
    moduleId: 'professional-email',
    topic: 'Email Netiquette & Typography',
    courseOutcome: 'CO4',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why should engineers avoid composing entire email sentences or subject lines in ALL CAPS?',
    options: [
      'In digital communication etiquette, ALL CAPS is universally interpreted as aggressive shouting',
      'Email servers automatically reject emails containing any uppercase characters',
      'Uppercase text consumes triple the internet bandwidth',
      'Screen readers cannot process capital letters'
    ],
    correctAnswer: 'In digital communication etiquette, ALL CAPS is universally interpreted as aggressive shouting',
    explanation: 'Using ALL CAPS creates an abrasive, unprofessional tone equivalent to shouting at the recipient.',
    keywords: ['Netiquette', 'Typography', 'Tone'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-em-009',
    moduleId: 'professional-email',
    topic: 'Diplomatic Follow-Up & Escalation',
    courseOutcome: 'CO4',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When a critical faculty or manager approval is overdue by three days, how should a follow-up email be phrased?',
    options: [
      'Politely restate the context, reference the previous thread date, emphasize the upcoming milestone, and inquire if any additional details are required',
      'Send an angry message threatening to escalate to the university chancellor',
      'Forward the original email 20 times in 10 minutes with no text',
      'Delete the project entirely and abandon the task'
    ],
    correctAnswer: 'Politely restate the context, reference the previous thread date, emphasize the upcoming milestone, and inquire if any additional details are required',
    explanation: 'A diplomatic follow-up preserves positive relationships while clearly communicating time-sensitive project dependencies.',
    keywords: ['Follow-up', 'Diplomacy', 'Escalation'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-em-010',
    moduleId: 'professional-email',
    topic: 'Transforming Passive Complaints into Solution-Oriented Prose',
    courseOutcome: 'CO4',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'How can the informal sentence "Your backend API is broken and keeping me from finishing my lab work" be transformed into professional, constructive email prose?',
    options: [
      'During API endpoint testing, we observed a 500 status code on the auth route. Could you please review the attached payload log so we can resume integration?',
      'Fix your broken code right now or we will fail the lab.',
      'Everything is ruined because the backend does not work.',
      'I am writing to report that the API developer is incompetent.'
    ],
    correctAnswer: 'During API endpoint testing, we observed a 500 status code on the auth route. Could you please review the attached payload log so we can resume integration?',
    explanation: 'Professional engineering correspondence describes objective technical observations (error codes, logs) and requests collaborative resolution.',
    keywords: ['Constructive Communication', 'Technical Tone', 'Refactoring'],
    estimatedTimeSeconds: 35
  }
];
