export interface ListeningVocabularyWord {
  id: string;
  word: string;
  pos: string; // noun, verb, adjective, etc.
  ipaUS: string;
  ipaUK: string;
  meaning: string;
  synonyms: string[];
  example: string;
}

export interface MCQActivity {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrueFalseActivity {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface FillInBlanksActivity {
  sentenceWithGaps: string; // Use ___ for gaps
  answers: string[];
  hints: string[];
}

export interface SequenceActivity {
  instruction: string;
  correctSequence: string[]; // Order of steps or events
}

export interface MatchingActivity {
  instruction: string;
  pairs: Array<{
    id: string;
    term: string;
    definition: string;
  }>;
}

export interface ShortAnswerActivity {
  question: string;
  sampleAnswer: string;
  keywords: string[];
}

export interface ListeningComprehensionSuite {
  mcq: MCQActivity;
  mcqs: MCQActivity[]; // 5 passage-specific MCQs per level
  trueFalse: TrueFalseActivity;
  fillInBlanks: FillInBlanksActivity;
  sequence: SequenceActivity;
  matching: MatchingActivity;
  shortAnswer: ShortAnswerActivity;
}

export type ListeningLevelId = 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5';

export interface ListeningPassage {
  id: string;
  levelId: ListeningLevelId;
  levelTitle: string;
  levelCategory: string;
  title: string;
  topic: string;
  speakerName: string;
  speakerRole: string;
  estimatedDuration: string;
  contentType: 'audio' | 'video_podcast' | 'workplace_scenario';
  transcriptUS: string;
  transcriptUK: string;
  signpostWords: string[];
  vocabularyList: ListeningVocabularyWord[];
  activities: ListeningComprehensionSuite;
}

export const LISTENING_LEVELS: Array<{
  id: ListeningLevelId;
  title: string;
  subtitle: string;
  shortDesc: string;
  iconName: string;
  badgeColor: string;
}> = [
  {
    id: 'level-1',
    title: 'Level 1',
    subtitle: 'Everyday Conversations & Orientation',
    shortDesc: 'Campus dialogue, student project coordination, and basic everyday campus scenarios.',
    iconName: 'MessageSquare',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'level-2',
    title: 'Level 2',
    subtitle: 'Elementary Technical Briefings',
    shortDesc: 'Laboratory safety protocols, hardware setup instructions, and practical team briefings.',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    id: 'level-3',
    title: 'Level 3',
    subtitle: 'Academic Lectures & Core Theory',
    shortDesc: 'First-year engineering lectures, computer science theory, and core technical seminars.',
    iconName: 'GraduationCap',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'level-4',
    title: 'Level 4',
    subtitle: 'Workplace & Agile Communication',
    shortDesc: 'Agile sprint standups, cross-functional engineering meetings, and system requirement reviews.',
    iconName: 'Briefcase',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'level-5',
    title: 'Level 5',
    subtitle: 'Advanced Technical Seminars & Keynotes',
    shortDesc: 'High-frequency AI system architecture, micro-latency trade-offs, and advanced engineering debates.',
    iconName: 'Cpu',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  }
];

export const LISTENING_PASSAGES: ListeningPassage[] = [
  {
    id: 'pass-level-1',
    levelId: 'level-1',
    levelTitle: 'Level 1',
    levelCategory: 'Campus Collaboration',
    title: 'First-Year Mini-Project Team Coordination',
    topic: 'Campus Project Collaboration & Task Division',
    speakerName: 'Ananya & Rahul',
    speakerRole: 'First-Year Engineering Students',
    estimatedDuration: '01:40',
    contentType: 'audio',
    transcriptUS:
      'Hey Rahul, thanks for meeting up after the physics lab. First, let us review our schedule for the engineering design project. Furthermore, we need to finalize our hardware components before Friday. In addition, I suggest we divide the responsibilities: I will write the Python sensor data logging script, while you handle the microcontroller circuit assembly. However, we must ensure both parts integrate seamlessly by next Monday. To summarize, our goal for today is purchasing the temperature sensor and testing the serial communication baud rate.',
    transcriptUK:
      'Hello Rahul, thank you for meeting up after the physics laboratory. Firstly, let us review our timetable for the engineering design project. Furthermore, we need to finalise our hardware components before Friday. In addition, I suggest we divide the responsibilities: I shall write the Python sensor data logging script, whilst you handle the microcontroller circuit assembly. However, we must ensure both parts integrate seamlessly by next Monday. To summarise, our objective for today is purchasing the temperature sensor and testing the serial communication baud rate.',
    signpostWords: ['First', 'Furthermore', 'In addition', 'However', 'To summarize'],
    vocabularyList: [
      {
        id: 'v-01',
        word: 'Integrate',
        pos: 'verb',
        ipaUS: '/ˈɪn.tə.ɡreɪt/',
        ipaUK: '/ˈɪn.tɪ.ɡreɪt/',
        meaning: 'Combine two or more things to form an effective, coordinated whole.',
        synonyms: ['Synthesize', 'Merge', 'Unify', 'Combine'],
        example: 'We must integrate the frontend interface with our database API.'
      },
      {
        id: 'v-02',
        word: 'Microcontroller',
        pos: 'noun',
        ipaUS: '/ˌmaɪ.kroʊ.kənˈtroʊ.lɚ/',
        ipaUK: '/ˌmaɪ.krəʊ.kənˈtrəʊ.lə/',
        meaning: 'A compact integrated circuit designed to govern a specific operation in an embedded system.',
        synonyms: ['Embedded Processor', 'MCU', 'Chip'],
        example: 'The Arduino microcontroller controls the sensor pin outputs.'
      },
      {
        id: 'v-03',
        word: 'Baud Rate',
        pos: 'noun',
        ipaUS: '/ˈbɔːd ˌreɪt/',
        ipaUK: '/ˈbɔːd ˌreɪt/',
        meaning: 'The rate at which data is transferred in a communication channel, measured in signal changes per second.',
        synonyms: ['Transfer Rate', 'Data Speed', 'Bit Rate'],
        example: 'The serial monitor was set to a baud rate of 9600.'
      }
    ],
    activities: {
      mcq: {
        question: 'What primary task is assigned to Rahul during the project discussion?',
        options: [
          'Writing the Python data logging script',
          'Handling the microcontroller circuit assembly',
          'Ordering the physics lab equipment',
          'Preparing the final presentation slides'
        ],
        correctIndex: 1,
        explanation: 'Ananya explicitly stated that Rahul will handle the microcontroller circuit assembly while she writes the Python script.'
      },
      mcqs: [
        {
          id: 'l1-q1',
          question: 'What primary task is assigned to Rahul during the project discussion?',
          options: [
            'Writing the Python data logging script',
            'Handling the microcontroller circuit assembly',
            'Ordering the physics lab equipment',
            'Preparing the final presentation slides'
          ],
          correctIndex: 1,
          explanation: 'Ananya explicitly stated that Rahul will handle the microcontroller circuit assembly while she writes the Python script.'
        },
        {
          id: 'l1-q2',
          question: 'By which day must the team finalize their hardware components?',
          options: ['Wednesday', 'Thursday', 'Friday', 'Next Monday'],
          correctIndex: 2,
          explanation: 'Ananya stated: "Furthermore, we need to finalize our hardware components before Friday."'
        },
        {
          id: 'l1-q3',
          question: 'What is the target integration deadline for both hardware and software?',
          options: ['This Friday', 'Next Monday', 'Next Wednesday', 'End of the semester'],
          correctIndex: 1,
          explanation: 'Ananya explicitly stated that both parts must integrate seamlessly by next Monday.'
        },
        {
          id: 'l1-q4',
          question: 'What specific hardware sensor are the students purchasing today?',
          options: ['Ultrasonic sensor', 'Temperature sensor', 'Infrared proximity sensor', 'Bluetooth module'],
          correctIndex: 1,
          explanation: 'Ananya noted that today\'s primary objective is purchasing the temperature sensor.'
        },
        {
          id: 'l1-q5',
          question: 'What communication parameter will the team test after purchasing the sensor?',
          options: ['Baud rate', 'Clock frequency', 'Voltage threshold', 'Gain factor'],
          correctIndex: 0,
          explanation: 'Testing the serial communication baud rate was highlighted as part of today\'s goal.'
        }
      ],
      trueFalse: {
        statement: 'The team aims to have both hardware and software integrated by next Friday.',
        isTrue: false,
        explanation: 'False. Ananya explicitly mentioned that both parts must integrate seamlessly by next Monday, not Friday.'
      },
      fillInBlanks: {
        sentenceWithGaps: 'The team needs to test the serial communication ___ rate after purchasing the ___ sensor.',
        answers: ['baud', 'temperature'],
        hints: ['Speed metric for serial ports', 'Thermal measurement device']
      },
      sequence: {
        instruction: 'Arrange the meeting agenda steps in the exact order discussed by the students:',
        correctSequence: [
          'Review physics lab project schedule',
          'Finalize hardware components before Friday',
          'Divide programming and circuit assembly tasks',
          'Purchase temperature sensor and test baud rate'
        ]
      },
      matching: {
        instruction: 'Match the signpost word to its functional purpose in the conversation:',
        pairs: [
          { id: 'm1', term: 'Furthermore', definition: 'Signals additional supporting information' },
          { id: 'm2', term: 'However', definition: 'Signals a contrast or crucial condition' },
          { id: 'm3', term: 'To summarize', definition: 'Signals concluding main takeaway points' }
        ]
      },
      shortAnswer: {
        question: 'According to the conversation, what is the main goal to complete today?',
        sampleAnswer: 'Purchasing the temperature sensor and testing the serial communication baud rate.',
        keywords: ['temperature', 'sensor', 'baud', 'rate', 'testing']
      }
    }
  },
  {
    id: 'pass-level-2',
    levelId: 'level-2',
    levelTitle: 'Level 2',
    levelCategory: 'Laboratory Safety & Hardware Setup',
    title: 'Microcontroller Hardware Lab Safety & Bench Setup',
    topic: 'Hardware Bench Safety Protocols & Circuit Verification',
    speakerName: 'Prof. K. Swaminathan',
    speakerRole: 'Senior Laboratory Instructor, SRIT',
    estimatedDuration: '01:55',
    contentType: 'audio',
    transcriptUS:
      'Welcome to the Microcontroller Hardware Laboratory. Before starting your bench experiments, please observe critical safety protocols. First, always wear an anti-static ESD wristband grounded to the workbench mat to prevent electrostatic discharge from destroying sensitive CMOS chips. Second, verify that your regulated bench power supply is set precisely to 5 Volts DC before toggling the main power switch. Furthermore, when wiring light-emitting diodes, you must insert a current-limiting resistor in series to prevent pin overcurrent. Most importantly, if you observe excessive heating or smell burning insulation, turn off the main switch immediately and alert the lab assistant. In conclusion, double-check your breadboard connections against the schematic diagram prior to applying power.',
    transcriptUK:
      'Welcome to the Microcontroller Hardware Laboratory. Before starting your bench experiments, please observe critical safety protocols. Firstly, always wear an anti-static ESD wristband grounded to the workbench mat to prevent electrostatic discharge from destroying sensitive CMOS chips. Secondly, verify that your regulated bench power supply is set precisely to 5 Volts DC before toggling the main power switch. Furthermore, when wiring light-emitting diodes, you must insert a current-limiting resistor in series to prevent pin overcurrent. Most importantly, if you observe excessive heating or smell burning insulation, turn off the main switch immediately and alert the lab assistant. In conclusion, double-check your breadboard connections against the schematic diagram prior to applying power.',
    signpostWords: ['First', 'Second', 'Furthermore', 'Most importantly', 'In conclusion'],
    vocabularyList: [
      {
        id: 'v-201',
        word: 'Electrostatic Discharge',
        pos: 'noun',
        ipaUS: '/iˌlek.troʊˈstæt̬.ɪk ˈdɪs.tʃɑːrdʒ/',
        ipaUK: '/iˌlek.trəʊˈstæt.ɪk ˈdɪs.tʃɑːdʒ/',
        meaning: 'The sudden flow of electricity between two electrically charged objects caused by contact or dielectric breakdown.',
        synonyms: ['ESD', 'Static Shock', 'Charge Discharge'],
        example: 'Wearing an ESD wristband prevents static damage to the microchip.'
      },
      {
        id: 'v-202',
        word: 'Current-Limiting Resistor',
        pos: 'noun',
        ipaUS: '/ˈkɝː.ənt ˈlɪm.ɪ.t̬ɪŋ rɪˈzɪs.tɚ/',
        ipaUK: '/ˈkʌr.ənt ˈlɪm.ɪ.tɪŋ rɪˈzɪs.tə/',
        meaning: 'A resistor placed in a circuit to regulate and limit electrical current to safe operating levels.',
        synonyms: ['Ballast Resistor', 'Protection Resistor'],
        example: 'A 220-ohm current-limiting resistor protects the LED from burnout.'
      },
      {
        id: 'v-203',
        word: 'Schematic',
        pos: 'noun',
        ipaUS: '/skəˈmæt̬.ɪk/',
        ipaUK: '/skɪˈmæt.ɪk/',
        meaning: 'A diagrammatic representation of an electrical or electronic circuit using standard symbolic figures.',
        synonyms: ['Circuit Diagram', 'Wiring Plan', 'Blueprint'],
        example: 'Verify your breadboard connections against the schematic diagram.'
      }
    ],
    activities: {
      mcq: {
        question: 'What safety device must students wear before handling sensitive CMOS chips?',
        options: ['Safety goggles', 'Anti-static ESD wristband', 'Insulated rubber gloves', 'Heat-resistant apron'],
        correctIndex: 1,
        explanation: 'Prof. Swaminathan specified wearing an anti-static ESD wristband grounded to the workbench mat.'
      },
      mcqs: [
        {
          id: 'l2-q1',
          question: 'What safety device must students wear before handling sensitive CMOS chips?',
          options: ['Safety goggles', 'Anti-static ESD wristband', 'Insulated rubber gloves', 'Heat-resistant apron'],
          correctIndex: 1,
          explanation: 'Prof. Swaminathan specified wearing an anti-static ESD wristband grounded to the workbench mat.'
        },
        {
          id: 'l2-q2',
          question: 'What is the required voltage setting for the regulated bench power supply?',
          options: ['3.3 Volts DC', '5 Volts DC', '12 Volts DC', '24 Volts AC'],
          correctIndex: 1,
          explanation: 'The instructor explicitly directed setting the power supply precisely to 5 Volts DC.'
        },
        {
          id: 'l2-q3',
          question: 'Why must a current-limiting resistor be wired in series with an LED?',
          options: ['To boost voltage output', 'To limit current and prevent pin overcurrent', 'To convert DC to AC', 'To generate clock signals'],
          correctIndex: 1,
          explanation: 'Inserting a current-limiting resistor in series prevents pin overcurrent damage.'
        },
        {
          id: 'l2-q4',
          question: 'What action must be taken immediately if excessive heating or burning insulation is noticed?',
          options: ['Increase the voltage setting', 'Turn off the main power switch immediately', 'Spray water on the breadboard', 'Ignore it if the LED is lit'],
          correctIndex: 1,
          explanation: 'The instructor instructed students to turn off the main power switch immediately and alert the assistant.'
        },
        {
          id: 'l2-q5',
          question: 'What step should be completed right before applying power to the circuit?',
          options: ['Calibrating the oscilloscope', 'Double-checking breadboard connections against the schematic diagram', 'Writing the project summary report', 'Cleaning the workbench desk'],
          correctIndex: 1,
          explanation: 'The instructor advised double-checking breadboard connections against the schematic diagram prior to applying power.'
        }
      ],
      trueFalse: {
        statement: 'Regulated power supply should be set to 12V DC before toggling the main switch.',
        isTrue: false,
        explanation: 'False. The power supply must be set precisely to 5 Volts DC.'
      },
      fillInBlanks: {
        sentenceWithGaps: 'Students must wear an anti-static ___ wristband and connect a current-limiting ___ in series with LEDs.',
        answers: ['ESD', 'resistor'],
        hints: ['Electrostatic Discharge acronym', 'Passive component limiting current']
      },
      sequence: {
        instruction: 'Order the laboratory safety procedure steps as delivered by the instructor:',
        correctSequence: [
          'Wear anti-static ESD wristband grounded to workbench mat',
          'Verify regulated bench power supply is set to 5 Volts DC',
          'Insert current-limiting resistor in series with LEDs',
          'Double-check breadboard connections against schematic diagram before powering on'
        ]
      },
      matching: {
        instruction: 'Match the laboratory item to its safety function:',
        pairs: [
          { id: 'm201', term: 'ESD Wristband', definition: 'Prevents static discharge from destroying CMOS chips' },
          { id: 'm202', term: 'Current-Limiting Resistor', definition: 'Prevents microcontroller pin overcurrent damage' },
          { id: 'm203', term: 'Schematic Diagram', definition: 'Standardized reference for correct breadboard wiring' }
        ]
      },
      shortAnswer: {
        question: 'What immediate action is required if burning insulation or component overheating occurs?',
        sampleAnswer: 'Turn off the main power switch immediately and alert the laboratory assistant.',
        keywords: ['turn', 'off', 'main', 'switch', 'immediately', 'alert', 'assistant']
      }
    }
  },
  {
    id: 'pass-level-3',
    levelId: 'level-3',
    levelTitle: 'Level 3',
    levelCategory: 'Engineering Lecture',
    title: 'Cloud Architecture & Virtualization Paradigm',
    topic: 'Computer Science & Engineering Core Lecture',
    speakerName: 'Dr. V. Ramanathan',
    speakerRole: 'Professor of Computer Science, SRIT',
    estimatedDuration: '02:15',
    contentType: 'audio',
    transcriptUS:
      'Good morning students. Today we explore Cloud Computing Architecture. First of all, cloud computing is defined as on-demand availability of computer system resources, particularly data storage and computing power, without direct active management by the user. Most importantly, cloud deployment models are categorized into three main layers: Infrastructure as a Service or IaaS, Platform as a Service or PaaS, and Software as a Service or SaaS. Consequently, organizations eliminate capital expenditure on physical datacenters. For instance, AWS EC2 provides virtualized compute instances that scale dynamically based on real-time traffic spikes. In conclusion, elasticity and fault tolerance are the foundational pillars of modern distributed engineering applications.',
    transcriptUK:
      'Good morning students. Today we explore Cloud Computing Architecture. First of all, cloud computing is defined as on-demand availability of computer system resources, particularly data storage and computing power, without direct active management by the user. Most importantly, cloud deployment models are categorised into three main layers: Infrastructure as a Service or IaaS, Platform as a Service or PaaS, and Software as a Service or SaaS. Consequently, organisations eliminate capital expenditure on physical datacentres. For instance, AWS EC2 provides virtualised compute instances that scale dynamically based on real-time traffic spikes. In conclusion, elasticity and fault tolerance are the foundational pillars of modern distributed engineering applications.',
    signpostWords: ['First of all', 'Most importantly', 'Consequently', 'For instance', 'In conclusion'],
    vocabularyList: [
      {
        id: 'v-04',
        word: 'Elasticity',
        pos: 'noun',
        ipaUS: '/ˌiː.læsˈtɪs.ə.t̬i/',
        ipaUK: '/ˌe.læsˈtɪs.ə.ti/',
        meaning: 'The ability of a cloud system to automatically provision and de-provision computing resources as workload demands change.',
        synonyms: ['Scalability', 'Flexibility', 'Adaptability'],
        example: 'Cloud elasticity allows websites to handle peak holiday shopping traffic seamlessly.'
      },
      {
        id: 'v-05',
        word: 'Capital Expenditure',
        pos: 'noun',
        ipaUS: '/ˈkæp.ə.t̬əl ɪkˈspen.də.tʃɚ/',
        ipaUK: '/ˈkæp.ɪ.təl ɪkˈspen.dɪ.tʃə/',
        meaning: 'Funds used by a business to acquire, upgrade, and maintain physical assets such as servers or property.',
        synonyms: ['CapEx', 'Capital Outlay', 'Fixed Asset Cost'],
        example: 'Migrating to PaaS converted CapEx costs into operational expenses.'
      },
      {
        id: 'v-06',
        word: 'Fault Tolerance',
        pos: 'noun',
        ipaUS: '/fɑːlt ˈtɑː.lɚ.əns/',
        ipaUK: '/fɔːlt ˈtɒl.ər.əns/',
        meaning: 'The property that enables a system to continue operating properly in the event of hardware or software component failure.',
        synonyms: ['Resilience', 'Redundancy', 'Fail-safe Capability'],
        example: 'Multi-region database backups ensure fault tolerance during outages.'
      }
    ],
    activities: {
      mcq: {
        question: 'Which cloud layer directly provides virtualized compute instances according to the lecture?',
        options: [
          'Software as a Service (SaaS)',
          'Infrastructure as a Service (IaaS)',
          'Platform as a Service (PaaS)',
          'Database as a Service (DBaaS)'
        ],
        correctIndex: 1,
        explanation: 'The professor cited AWS EC2 as an example of IaaS providing virtualized compute instances.'
      },
      mcqs: [
        {
          id: 'l3-q1',
          question: 'How is cloud computing defined in the lecture?',
          options: [
            'Local storage on physical hard drives',
            'On-demand availability of computer system resources without direct active management',
            'Manual server maintenance in remote locations',
            'Single-user desktop software execution'
          ],
          correctIndex: 1,
          explanation: 'Dr. Ramanathan defined cloud computing as on-demand availability of computer system resources without direct active management.'
        },
        {
          id: 'l3-q2',
          question: 'Which cloud deployment layer directly provides virtualized compute instances according to the lecture?',
          options: [
            'Software as a Service (SaaS)',
            'Infrastructure as a Service (IaaS)',
            'Platform as a Service (PaaS)',
            'Database as a Service (DBaaS)'
          ],
          correctIndex: 1,
          explanation: 'The professor cited AWS EC2 as an example of Infrastructure as a Service (IaaS).'
        },
        {
          id: 'l3-q3',
          question: 'What financial benefit do organizations realize by adopting cloud computing?',
          options: [
            'Elimination of capital expenditure (CapEx) on physical datacenters',
            'Reduction in internet bandwidth costs',
            'Free electricity for corporate offices',
            'Elimination of all software developer salaries'
          ],
          correctIndex: 0,
          explanation: 'Dr. Ramanathan stated that organizations eliminate capital expenditure on physical datacenters.'
        },
        {
          id: 'l3-q4',
          question: 'What are the two foundational pillars of modern distributed engineering applications?',
          options: [
            'Monolithic architecture and manual backups',
            'Elasticity and fault tolerance',
            'Single-threading and static scaling',
            'Hardware redundancy and proprietary OS'
          ],
          correctIndex: 1,
          explanation: 'In conclusion, Dr. Ramanathan stated that elasticity and fault tolerance are the foundational pillars.'
        },
        {
          id: 'l3-q5',
          question: 'What signpost phrase did the professor use when introducing the AWS EC2 compute instance example?',
          options: ['First of all', 'Most importantly', 'For instance', 'In conclusion'],
          correctIndex: 2,
          explanation: 'The professor used "For instance" to introduce AWS EC2 virtualized compute instances.'
        }
      ],
      trueFalse: {
        statement: 'Cloud computing requires direct active physical datacenter management by the end-user.',
        isTrue: false,
        explanation: 'False. Cloud computing provides resources without direct active physical management by the user.'
      },
      fillInBlanks: {
        sentenceWithGaps: 'The two foundational pillars of modern distributed engineering applications are ___ and fault ___.',
        answers: ['elasticity', 'tolerance'],
        hints: ['Dynamic resource scaling', 'Resilience to system failure']
      },
      sequence: {
        instruction: 'Order the lecture topics as presented by Dr. Ramanathan:',
        correctSequence: [
          'Definition of Cloud Computing resources',
          'Three main deployment layers (IaaS, PaaS, SaaS)',
          'Elimination of datacenter capital expenditure',
          'Elasticity and fault tolerance as foundational pillars'
        ]
      },
      matching: {
        instruction: 'Match the cloud computing term with its corresponding description:',
        pairs: [
          { id: 'm4', term: 'IaaS', definition: 'Virtual compute instances and raw infrastructure' },
          { id: 'm5', term: 'SaaS', definition: 'End-user cloud software applications' },
          { id: 'm6', term: 'Elasticity', definition: 'Dynamic scaling based on real-time traffic spikes' }
        ]
      },
      shortAnswer: {
        question: 'How does cloud adoption affect an organization capital expenditure?',
        sampleAnswer: 'It eliminates capital expenditure (CapEx) on physical datacenters by replacing it with pay-as-you-go cloud services.',
        keywords: ['eliminates', 'capital', 'expenditure', 'physical', 'datacenters']
      }
    }
  },
  {
    id: 'pass-level-4',
    levelId: 'level-4',
    levelTitle: 'Level 4',
    levelCategory: 'Agile Engineering Standup',
    title: 'Daily Agile Sprint Standup & Dependency Review',
    topic: 'Software Development Team Daily Sync',
    speakerName: 'Priya Sharma',
    speakerRole: 'Scrum Master & Senior Software Lead',
    estimatedDuration: '01:50',
    contentType: 'audio',
    transcriptUS:
      'Good morning team. Welcome to our daily Agile standup. First, let us quickly go around for updates. Yesterday, I completed refactoring the user authentication microservice and merged the pull request into staging. However, we encountered an unexpected API rate limiting issue with the payment gateway integration. In order to resolve this blocker, Rahul and I will conduct a pair programming session at 2 PM. Meanwhile, please ensure all unit test coverage remains above 85 percent before pushing code to the main branch. To summarize, our key objective before the end of Sprint 14 is resolving the payment blocker and deploying release build 2.4.',
    transcriptUK:
      'Good morning team. Welcome to our daily Agile standup. Firstly, let us quickly go around for updates. Yesterday, I completed refactoring the user authentication microservice and merged the pull request into staging. However, we encountered an unexpected API rate limiting issue with the payment gateway integration. In order to resolve this blocker, Rahul and I shall conduct a pair programming session at 2 PM. Meanwhile, please ensure all unit test coverage remains above 85 percent before pushing code to the main branch. To summarise, our key objective before the end of Sprint 14 is resolving the payment blocker and deploying release build 2.4.',
    signpostWords: ['First', 'However', 'In order to', 'Meanwhile', 'To summarize'],
    vocabularyList: [
      {
        id: 'v-07',
        word: 'Refactoring',
        pos: 'verb',
        ipaUS: '/riːˈfæk.tɚ.ɪŋ/',
        ipaUK: '/riːˈfæk.tər.ɪŋ/',
        meaning: 'Restructuring existing computer code without changing its external behavior to improve readability or reduce complexity.',
        synonyms: ['Restructuring', 'Optimizing', 'Clean Code Revision'],
        example: 'Refactoring the legacy module reduced code duplication.'
      },
      {
        id: 'v-08',
        word: 'Blocker',
        pos: 'noun',
        ipaUS: '/ˈblɑː.kɚ/',
        ipaUK: '/ˈblɒk.ə/',
        meaning: 'An impediment or critical issue that prevents team members from progressing on a task.',
        synonyms: ['Impediment', 'Obstacle', 'Bottleneck'],
        example: 'The API rate limit issue is an urgent sprint blocker.'
      },
      {
        id: 'v-09',
        word: 'Pair Programming',
        pos: 'noun',
        ipaUS: '/pɛr ˈproʊ.ɡræm.ɪŋ/',
        ipaUK: '/peə ˈprəʊ.ɡræm.ɪŋ/',
        meaning: 'An agile software technique where two programmers work together at one workstation.',
        synonyms: ['Collaborative Coding', 'Peer Development'],
        example: 'We used pair programming to solve the tricky memory leak bug.'
      }
    ],
    activities: {
      mcq: {
        question: 'What minimum unit test coverage threshold must be maintained before pushing code to the main branch?',
        options: ['70 percent', '80 percent', '85 percent', '95 percent'],
        correctIndex: 2,
        explanation: 'Priya explicitly requested the team to ensure unit test coverage remains above 85 percent.'
      },
      mcqs: [
        {
          id: 'l4-q1',
          question: 'What software component did Priya refactor yesterday?',
          options: ['Database backup daemon', 'User authentication microservice', 'Payment gateway SDK', 'Frontend CSS stylesheet'],
          correctIndex: 1,
          explanation: 'Priya reported completing refactoring of the user authentication microservice.'
        },
        {
          id: 'l4-q2',
          question: 'What unexpected blocker was encountered during payment gateway integration?',
          options: ['Database connection timeout', 'API rate limiting issue', 'Syntax compilation error', 'Expired SSL security certificate'],
          correctIndex: 1,
          explanation: 'Priya reported an unexpected API rate limiting issue with the payment gateway.'
        },
        {
          id: 'l4-q3',
          question: 'At what time is the pair programming session scheduled between Priya and Rahul?',
          options: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
          correctIndex: 2,
          explanation: 'Priya announced that Rahul and she will conduct a pair programming session at 2 PM.'
        },
        {
          id: 'l4-q4',
          question: 'What minimum unit test coverage threshold must be maintained before pushing code to main?',
          options: ['70 percent', '80 percent', '85 percent', '95 percent'],
          correctIndex: 2,
          explanation: 'Priya explicitly requested maintaining unit test coverage above 85 percent.'
        },
        {
          id: 'l4-q5',
          question: 'What are the two main objectives before the end of Sprint 14?',
          options: [
            'Hiring new engineers and updating documentation',
            'Resolving the payment blocker and deploying release build 2.4',
            'Migrating to a new Cloud provider and updating UI logos',
            'Canceling daily standups and rewriting unit tests'
          ],
          correctIndex: 1,
          explanation: 'The sprint objective is resolving the payment blocker and deploying release build 2.4.'
        }
      ],
      trueFalse: {
        statement: 'Priya and Rahul plan to conduct a pair programming session at 4 PM.',
        isTrue: false,
        explanation: 'False. The pair programming session is scheduled for 2 PM.'
      },
      fillInBlanks: {
        sentenceWithGaps: 'Yesterday, Priya finished refactoring the user ___ microservice and merged the pull request into ___.',
        answers: ['authentication', 'staging'],
        hints: ['Login security system', 'Pre-production environment']
      },
      sequence: {
        instruction: 'Order the Agile standup updates chronologically as reported:',
        correctSequence: [
          'Completion of authentication microservice refactoring',
          'Identification of payment gateway API rate limit blocker',
          'Scheduled 2 PM pair programming session with Rahul',
          'Reminder on 85% unit test coverage requirement'
        ]
      },
      matching: {
        instruction: 'Match the software engineering term to its definition in the standup context:',
        pairs: [
          { id: 'm7', term: 'Pull Request', definition: 'Code contribution submitted for peer code review' },
          { id: 'm8', term: 'Microservice', definition: 'Independently deployable modular service component' },
          { id: 'm9', term: 'Sprint 14', definition: 'Current iteration timebox for team deliverables' }
        ]
      },
      shortAnswer: {
        question: 'What are the two main goals for the team before the end of Sprint 14?',
        sampleAnswer: 'Resolving the payment gateway API blocker and deploying release build 2.4.',
        keywords: ['payment', 'blocker', 'deploying', 'release', '2.4']
      }
    }
  },
  {
    id: 'pass-level-5',
    levelId: 'level-5',
    levelTitle: 'Level 5',
    levelCategory: 'Advanced AI Systems Seminar',
    title: 'Ultra-Low Latency AI Architecture & Edge Optimization',
    topic: 'Edge Compute Optimization & High-Throughput Inference',
    speakerName: 'Dr. Aris Thorne',
    speakerRole: 'Distinguished AI Systems Architect',
    estimatedDuration: '02:25',
    contentType: 'audio',
    transcriptUS:
      'Welcome to the advanced seminar on Ultra-Low Latency AI Architecture. As real-time edge processing demands grow, achieving sub-millisecond inference latency requires rethinking model optimization and hardware acceleration. First, deploying tensor processing units on edge devices eliminates network round-trip overhead. Second, utilizing asynchronous non-blocking event loops ensures that incoming request queues never stall CPU worker threads. Furthermore, when balancing model precision against throughput, quantizing transformer weights from FP16 to INT8 reduces memory bandwidth bottlenecks by nearly 50 percent while preserving 98 percent of contextual accuracy. In addition, speculative decoding accelerates token generation speed by running a small draft model alongside the primary LLM. In conclusion, maintaining 99.999 percent SLA availability in production demands continuous profiling, dynamic batching, and robust fault-tolerant failovers.',
    transcriptUK:
      'Welcome to the advanced seminar on Ultra-Low Latency AI Architecture. As real-time edge processing demands grow, achieving sub-millisecond inference latency requires rethinking model optimisation and hardware acceleration. Firstly, deploying tensor processing units on edge devices eliminates network round-trip overhead. Secondly, utilising asynchronous non-blocking event loops ensures that incoming request queues never stall CPU worker threads. Furthermore, when balancing model precision against throughput, quantising transformer weights from FP16 to INT8 reduces memory bandwidth bottlenecks by nearly 50 percent while preserving 98 percent of contextual accuracy. In addition, speculative decoding accelerates token generation speed by running a small draft model alongside the primary LLM. In conclusion, maintaining 99.999 percent SLA availability in production demands continuous profiling, dynamic batching, and robust fault-tolerant failovers.',
    signpostWords: ['First', 'Second', 'Furthermore', 'In addition', 'In conclusion'],
    vocabularyList: [
      {
        id: 'v-501',
        word: 'Quantization',
        pos: 'noun',
        ipaUS: '/ˌkwɑːn.t̬əˈzeɪ.ʃən/',
        ipaUK: '/ˌkwɒn.taɪˈzeɪ.ʃən/',
        meaning: 'The process of mapping continuous values or large bit-width numbers (FP16) to a smaller discrete set of values (INT8) to reduce model memory footprint.',
        synonyms: ['Precision Reduction', 'Bit Compression', 'Weight Quantization'],
        example: 'Quantization reduced our LLM memory consumption by 50 percent.'
      },
      {
        id: 'v-502',
        word: 'Inference Latency',
        pos: 'noun',
        ipaUS: '/ˈɪn.fɚ.əns ˈleɪ.tən.si/',
        ipaUK: '/ˈɪn.fər.əns ˈleɪ.tən.si/',
        meaning: 'The total execution time required for a trained machine learning model to calculate a prediction from input data.',
        synonyms: ['Prediction Time', 'Execution Lag', 'Processing Delay'],
        example: 'Edge TPUs dropped inference latency below 3 milliseconds.'
      },
      {
        id: 'v-503',
        word: 'Speculative Decoding',
        pos: 'noun',
        ipaUS: '/ˈspek.jə.lə.t̬ɪv dɪˈkoʊ.dɪŋ/',
        ipaUK: '/ˈspek.jə.lə.tɪv dɪˈkəʊ.dɪŋ/',
        meaning: 'An optimization technique using a smaller, faster draft model to propose tokens that are validated in parallel by a target LLM.',
        synonyms: ['Draft Token Generation', 'Parallel Token Decoding'],
        example: 'Speculative decoding boosted token generation speed by 2.5x.'
      }
    ],
    activities: {
      mcq: {
        question: 'What is the primary advantage of deploying Tensor Processing Units (TPUs) directly on edge devices?',
        options: ['Reducing hardware purchasing costs', 'Eliminating network round-trip latency overhead', 'Increasing cloud server storage', 'Replacing all software programming languages'],
        correctIndex: 1,
        explanation: 'Deploying TPUs on edge devices eliminates network round-trip overhead, enabling real-time edge processing.'
      },
      mcqs: [
        {
          id: 'l5-q1',
          question: 'What is the primary advantage of deploying Tensor Processing Units (TPUs) directly on edge devices?',
          options: ['Reducing hardware purchasing costs', 'Eliminating network round-trip latency overhead', 'Increasing cloud server storage', 'Replacing all software programming languages'],
          correctIndex: 1,
          explanation: 'Deploying TPUs on edge devices eliminates network round-trip overhead, enabling real-time edge processing.'
        },
        {
          id: 'l5-q2',
          question: 'What architectural pattern is recommended to prevent incoming request queues from stalling CPU threads?',
          options: ['Synchronous blocking calls', 'Asynchronous non-blocking event loops', 'Sequential single-threaded polling', 'Manual thread interruption'],
          correctIndex: 1,
          explanation: 'Dr. Thorne emphasized that asynchronous non-blocking event loops ensure request queues never stall CPU worker threads.'
        },
        {
          id: 'l5-q3',
          question: 'By how much does model weight quantization from FP16 to INT8 reduce memory bandwidth bottlenecks?',
          options: ['10 percent', '25 percent', 'Nearly 50 percent', '75 percent'],
          correctIndex: 2,
          explanation: 'Quantizing transformer weights from FP16 to INT8 reduces memory bandwidth bottlenecks by nearly 50 percent.'
        },
        {
          id: 'l5-q4',
          question: 'How does speculative decoding accelerate token generation in transformer models?',
          options: [
            'By disabling all model attention layers',
            'By running a small draft model alongside the primary LLM',
            'By increasing GPU memory voltage',
            'By skipping prompt token validation'
          ],
          correctIndex: 1,
          explanation: 'Speculative decoding runs a small draft model alongside the primary LLM to speed up token generation.'
        },
        {
          id: 'l5-q5',
          question: 'What Service Level Agreement (SLA) uptime percentage was cited for production AI system availability?',
          options: ['95.0 percent', '99.0 percent', '99.9 percent', '99.999 percent'],
          correctIndex: 3,
          explanation: 'Dr. Thorne concluded that maintaining 99.999 percent SLA availability requires profiling, dynamic batching, and failovers.'
        }
      ],
      trueFalse: {
        statement: 'Quantizing transformer weights from FP16 to INT8 reduces memory bandwidth bottlenecks by 50% while maintaining 98% accuracy.',
        isTrue: true,
        explanation: 'True. Dr. Thorne explicitly stated that FP16 to INT8 quantization reduces memory bandwidth bottlenecks by nearly 50 percent while preserving 98 percent accuracy.'
      },
      fillInBlanks: {
        sentenceWithGaps: 'Edge TPUs eliminate network ___ overhead, and speculative ___ accelerates token generation.',
        answers: ['round-trip', 'decoding'],
        hints: ['Network latency back-and-forth', 'Draft model token generation technique']
      },
      sequence: {
        instruction: 'Order the edge AI optimization steps as presented in the seminar:',
        correctSequence: [
          'Deploy TPUs on edge devices to eliminate network round-trip latency',
          'Implement asynchronous non-blocking event loops for CPU request queues',
          'Quantize model weights from FP16 to INT8 to reduce memory bandwidth bottlenecks',
          'Apply speculative decoding with a draft model to accelerate token generation'
        ]
      },
      matching: {
        instruction: 'Match the advanced AI term with its architectural benefit:',
        pairs: [
          { id: 'm501', term: 'Edge TPU', definition: 'Eliminates network latency by executing inference locally' },
          { id: 'm502', term: 'INT8 Quantization', definition: 'Reduces memory bandwidth bottlenecks by nearly 50 percent' },
          { id: 'm503', term: 'Speculative Decoding', definition: 'Uses a small draft model to speed up LLM token output' }
        ]
      },
      shortAnswer: {
        question: 'What SLA uptime percentage must production AI systems maintain according to the seminar conclusion?',
        sampleAnswer: '99.999 percent availability.',
        keywords: ['99.999', 'percent', 'availability', 'SLA']
      }
    }
  }
];

export function getPassagesByLevel(levelId: ListeningLevelId): ListeningPassage[] {
  return LISTENING_PASSAGES.filter((p) => p.levelId === levelId);
}

export function getPassageById(id: string): ListeningPassage | undefined {
  return LISTENING_PASSAGES.find((p) => p.id === id);
}

export interface VocabularyPracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SustainableVocabularyWord extends ListeningVocabularyWord {
  passageHighlight?: string;
  passageContext?: string;
}

export const SUSTAINABLE_ENGINEERING_PASSAGE = {
  id: 'pass-sustainable-eng',
  title: 'Technology and Sustainable Engineering',
  category: 'Sustainable Technical Innovations & Clean Tech',
  topic: 'Green Technology, Renewable Integration, and Sustainable Engineering Practices',
  speakerName: 'Dr. Elena Vance',
  speakerRole: 'Senior Sustainable Systems Engineer',
  estimatedDuration: '02:30',
  contentType: 'audio' as const,
  transcriptUS: `Good morning, everyone. Welcome to today’s seminar on technology and sustainable engineering. To begin with, modern engineering is undergoing a fundamental paradigm shift. Historically, technical design focused almost exclusively on minimizing immediate manufacturing costs and maximizing operational output. Today, however, engineers must prioritize the entire product lifespan through a methodology known as Life Cycle Assessment, or LCA.

Specifically, Life Cycle Assessment evaluates environmental impacts from raw material extraction, through manufacturing and distribution, up to final disposal or recycling. For instance, in electronics manufacturing, over sixty percent of total carbon emissions occur before the product is even turned on for the first time. This is known as embodied carbon. Consequently, sustainable engineers are adopting circular economy design principles—designing hardware modules that can be easily repaired, upgraded, or disassembled rather than discarded in landfills.

On the other hand, clean energy infrastructure relies heavily on smart microgrid technology to integrate intermittent renewable sources, such as solar photovoltaic panels and wind turbines. Microgrids utilize advanced sensor networks and machine learning algorithms to balance power supply and demand in real time. For example, by predicting cloud cover and industrial load spikes, smart grid controllers reduce reliance on backup diesel generators by up to forty percent.

Ultimately, technology and sustainable engineering are not opposing forces, but complementary disciplines. As future engineers, your responsibility is not merely to build complex systems, but to build resilient, resource-efficient systems that minimize environmental footprints while enhancing societal well-being. Thank you.`,
  transcriptUK: `Good morning, everyone. Welcome to today’s seminar on technology and sustainable engineering. To begin with, modern engineering is undergoing a fundamental paradigm shift. Historically, technical design focused almost exclusively on minimising immediate manufacturing costs and maximising operational output. Today, however, engineers must prioritise the entire product lifespan through a methodology known as Life Cycle Assessment, or LCA.

Specifically, Life Cycle Assessment evaluates environmental impacts from raw material extraction, through manufacturing and distribution, up to final disposal or recycling. For instance, in electronics manufacturing, over sixty percent of total carbon emissions occur before the product is even turned on for the first time. This is known as embodied carbon. Consequently, sustainable engineers are adopting circular economy design principles—designing hardware modules that can be easily repaired, upgraded, or disassembled rather than discarded in landfills.

On the other hand, clean energy infrastructure relies heavily on smart microgrid technology to integrate intermittent renewable sources, such as solar photovoltaic panels and wind turbines. Microgrids utilise advanced sensor networks and machine learning algorithms to balance power supply and demand in real time. For example, by predicting cloud cover and industrial load spikes, smart grid controllers reduce reliance on backup diesel generators by up to forty percent.

Ultimately, technology and sustainable engineering are not opposing forces, but complementary disciplines. As future engineers, your responsibility is not merely to build complex systems, but to build resilient, resource-efficient systems that minimise environmental footprints while enhancing societal well-being. Thank you.`,
  signpostWords: ['To begin with', 'Specifically', 'For instance', 'Consequently', 'On the other hand', 'Ultimately'],
  
  // 5 Passage-Specific MCQs
  mcqs: [
    {
      id: 'se-q1',
      question: 'What is the primary thesis or main idea of Dr. Elena Vance\'s presentation?',
      options: [
        'Modern engineering must transition from short-term output optimization to long-term sustainable system design through Life Cycle Assessment.',
        'Electronics manufacturing should be completely suspended until solar panels reach 100% efficiency.',
        'Diesel generators are the most economical power source for modern industrial microgrids.',
        'Traditional engineering methods are far superior to automated sensor networks.'
      ],
      correctIndex: 0,
      explanation: 'Dr. Vance explicitly states that engineering is undergoing a paradigm shift towards prioritizing whole-life environmental impacts through Life Cycle Assessment and sustainable design.'
    },
    {
      id: 'se-q2',
      question: 'According to the passage, what proportion of total carbon emissions in electronics manufacturing is attributed to embodied carbon?',
      options: [
        'Less than fifteen percent',
        'Exactly thirty-five percent',
        'Over sixty percent',
        'Nearly ninety-five percent'
      ],
      correctIndex: 2,
      explanation: 'The speaker explicitly notes that in electronics manufacturing, over 60% of carbon emissions occur before the product is even turned on for the first time (embodied carbon).'
    },
    {
      id: 'se-q3',
      question: 'How do smart microgrid controllers reduce reliance on backup diesel generators by up to forty percent?',
      options: [
        'By utilizing machine learning and sensor networks to forecast weather and industrial load spikes in real time',
        'By forcing factories to operate only during daylight hours',
        'By converting mechanical waste into chemical battery storage',
        'By eliminating all high-voltage power transmission lines'
      ],
      correctIndex: 0,
      explanation: 'The passage highlights that smart grid controllers use sensor networks and machine learning to predict cloud cover and load spikes, balancing real-time power supply and reducing backup generator reliance by up to 40%.'
    },
    {
      id: 'se-q4',
      question: 'What can be inferred about products designed under traditional engineering principles prior to Life Cycle Assessment?',
      options: [
        'They were designed exclusively for easy disassembly and landfill prevention.',
        'They often focused on initial production costs while neglecting end-of-life disposal and embodied carbon.',
        'They relied entirely on photovoltaic solar panels for operational energy.',
        'They eliminated raw material extraction from global supply chains.'
      ],
      correctIndex: 1,
      explanation: 'The passage contrasts modern LCA with historical design, which focused almost exclusively on minimizing immediate manufacturing costs and maximizing operational output.'
    },
    {
      id: 'se-q5',
      question: 'What is Dr. Vance\'s overall purpose in concluding that technology and sustainable engineering are "complementary disciplines"?',
      options: [
        'To demonstrate that technological innovation can actively enable environmental sustainability when guided by proper design frameworks.',
        'To persuade engineers to stop developing new hardware and focus only on policy writing.',
        'To argue that renewable energy integration is technologically impossible for industrial grids.',
        'To promote the continuous expansion of non-recyclable electronic waste.'
      ],
      correctIndex: 0,
      explanation: 'Dr. Vance concludes by encouraging future engineers to build resilient, resource-efficient systems, highlighting that technology and sustainability reinforce each other.'
    }
  ],

  // 8 Vocabulary Items from this passage
  vocabularyList: [
    {
      id: 'v-se-1',
      word: 'Life Cycle Assessment (LCA)',
      pos: 'noun',
      ipaUS: '/laɪf ˈsaɪ.kəl əˈses.mənt/',
      ipaUK: '/laɪf ˈsaɪ.kəl əˈses.mənt/',
      meaning: 'A technique to evaluate environmental impacts associated with all stages of a product\'s life, from raw material extraction to disposal.',
      passageContext: 'Evaluates environmental impacts from raw material extraction through manufacturing to disposal or recycling.',
      synonyms: ['LCA', 'Cradle-to-Grave Analysis', 'Environmental Impact Assessment'],
      example: 'Conducting a Life Cycle Assessment revealed that packaging caused 40% of our carbon footprint.',
      passageHighlight: '...prioritize the entire product lifespan through a methodology known as Life Cycle Assessment, or LCA.'
    },
    {
      id: 'v-se-2',
      word: 'Embodied Carbon',
      pos: 'noun',
      ipaUS: '/ɪmˈbɑː.diːd ˈkɑːr.bən/',
      ipaUK: '/ɪmˈbɒd.id ˈkɑː.bən/',
      meaning: 'The greenhouse gas emissions created during the extraction, processing, manufacturing, and transport of building materials or hardware.',
      passageContext: 'Emissions produced before an electronic device is ever turned on for the first time.',
      synonyms: ['Embedded Emissions', 'Upstream Carbon Footprint'],
      example: 'By using recycled aluminum, engineers reduced the embodied carbon of the chassis by half.',
      passageHighlight: '...over sixty percent of total carbon emissions occur before the product is even turned on... This is known as embodied carbon.'
    },
    {
      id: 'v-se-3',
      word: 'Circular Economy',
      pos: 'noun',
      ipaUS: '/ˈsɝː.kjə.lɚ iˈkɑː.nə.mi/',
      ipaUK: '/ˈsɜː.kjə.lə iˈkɒn.ə.mi/',
      meaning: 'An economic system focused on eliminating waste through continual reuse, repair, remanufacturing, and recycling of materials.',
      passageContext: 'Designing hardware modules to be repaired, upgraded, or disassembled rather than landfilled.',
      synonyms: ['Closed-Loop System', 'Sustainable Material Flow'],
      example: 'Circular economy design principles ensure that old battery cells are reprocessed into new power units.',
      passageHighlight: '...sustainable engineers are adopting circular economy design principles—designing hardware modules that can be easily repaired...'
    },
    {
      id: 'v-se-4',
      word: 'Microgrid',
      pos: 'noun',
      ipaUS: '/ˈmaɪ.kroʊ.ɡrɪd/',
      ipaUK: '/ˈmaɪ.krəʊ.ɡrɪd/',
      meaning: 'A localized energy group of electricity sources and loads that operates synchronously with or independently from the main grid.',
      passageContext: 'Integrates intermittent renewable sources like solar and wind using sensors and machine learning.',
      synonyms: ['Localized Energy Network', 'Smart Distributed Grid'],
      example: 'The campus microgrid switched smoothly to battery power during the regional electrical blackout.',
      passageHighlight: '...clean energy infrastructure relies heavily on smart microgrid technology to integrate intermittent renewable sources...'
    },
    {
      id: 'v-se-5',
      word: 'Intermittent',
      pos: 'adjective',
      ipaUS: '/ˌɪn.t̬ɚˈmɪt.ənt/',
      ipaUK: '/ˌɪn.təˈmɪt.ənt/',
      meaning: 'Occurring at non-continuous intervals; stopping and starting irregularly.',
      passageContext: 'Describes renewable energy sources like solar panels and wind turbines that fluctuate with weather.',
      synonyms: ['Fluctuating', 'Sporadic', 'Variable'],
      example: 'Because solar generation is intermittent, smart storage systems store surplus energy during sunny hours.',
      passageHighlight: '...integrate intermittent renewable sources, such as solar photovoltaic panels and wind turbines.'
    },
    {
      id: 'v-se-6',
      word: 'Photovoltaic',
      pos: 'adjective',
      ipaUS: '/ˌfoʊ.toʊ.voʊlˈteɪ.ɪk/',
      ipaUK: '/ˌfəʊ.təʊ.vɒlˈteɪ.ɪk/',
      meaning: 'Relating to the direct generation of electricity from light solar radiation.',
      passageContext: 'Used in reference to solar panels converting sunlight directly into electric current.',
      synonyms: ['PV', 'Solar Electric'],
      example: 'Photovoltaic roof arrays generated clean power for the engineering lab.',
      passageHighlight: '...intermittent renewable sources, such as solar photovoltaic panels and wind turbines.'
    },
    {
      id: 'v-se-7',
      word: 'Resilient',
      pos: 'adjective',
      ipaUS: '/rɪˈzɪl.jənt/',
      ipaUK: '/rɪˈzɪl.i.ənt/',
      meaning: 'Able to withstand, recover quickly from, or adapt to difficult operational conditions or environmental disruptions.',
      passageContext: 'Building engineering systems that withstand environmental stress while sustaining essential functions.',
      synonyms: ['Durable', 'Robust', 'Adaptable'],
      example: 'Engineers designed a resilient power distribution layout that auto-reroutes electricity during storm damage.',
      passageHighlight: '...your responsibility is not merely to build complex systems, but to build resilient, resource-efficient systems...'
    },
    {
      id: 'v-se-8',
      word: 'Paradigm Shift',
      pos: 'noun',
      ipaUS: '/ˈper.ə.daɪm ˌʃɪft/',
      ipaUK: '/ˈpær.ə.daɪm ˌʃɪft/',
      meaning: 'A fundamental change in basic concepts, assumptions, or operational practices within a discipline.',
      passageContext: 'The fundamental transition in modern engineering from short-term cost minimization to whole-life sustainability.',
      synonyms: ['Fundamental Transformation', 'Structural Shift'],
      example: 'The shift toward cloud-native computing represented a major paradigm shift in software architecture.',
      passageHighlight: 'To begin with, modern engineering is undergoing a fundamental paradigm shift.'
    }
  ] as SustainableVocabularyWord[],

  // 5 Active Vocabulary Practice Questions
  vocabularyPractice: [
    {
      id: 'vp-1',
      question: 'Which term refers to the greenhouse gas emissions generated during raw material extraction, processing, and transport BEFORE a product is powered on?',
      options: ['Embodied Carbon', 'Photovoltaic', 'Intermittent', 'Microgrid'],
      correctIndex: 0,
      explanation: 'Embodied carbon accounts for all upstream emissions created prior to the operational use phase of a hardware product.'
    },
    {
      id: 'vp-2',
      question: 'Power sources like solar arrays and wind turbines whose energy generation stops and starts based on weather conditions are described as:',
      options: ['Circular', 'Intermittent', 'Resilient', 'Paradigm'],
      correctIndex: 1,
      explanation: 'Intermittent means occurring at irregular intervals or subject to natural weather fluctuations.'
    },
    {
      id: 'vp-3',
      question: 'What design framework aims to eliminate waste by creating hardware modules that can be easily repaired, upgraded, or recycled?',
      options: ['Life Cycle Assessment', 'Circular Economy', 'Decarbonization', 'Linear Manufacturing'],
      correctIndex: 1,
      explanation: 'A circular economy emphasizes closed-loop material flows, repairability, and disassembly to prevent landfill waste.'
    },
    {
      id: 'vp-4',
      question: 'What localized power network uses smart sensors and machine learning algorithms to balance renewable energy supply and demand?',
      options: ['Photovoltaic Array', 'Diesel Generator', 'Microgrid', 'Transformer Substation'],
      correctIndex: 2,
      explanation: 'A microgrid is a localized energy system that can manage distributed renewable energy independently or connected to the main grid.'
    },
    {
      id: 'vp-5',
      question: 'A fundamental structural change in the underlying assumptions and practices of engineering design is known as a:',
      options: ['Paradigm Shift', 'Life Cycle Assessment', 'Resilient Network', 'Load Spike'],
      correctIndex: 0,
      explanation: 'A paradigm shift describes a fundamental transformation in how a discipline or industry operates.'
    }
  ] as VocabularyPracticeQuestion[]
};

