import { ModuleData } from '../types';

export const R26_MODULES: ModuleData[] = [
  {
    id: 'pronunciation',
    code: 'R26-LAB-01',
    title: 'Phonetics & Pronunciation Practice',
    category: 'Core Foundation',
    shortDesc: 'Master English phonemes, International Phonetic Alphabet (IPA), minimal pairs, and word stress for technical clarity.',
    estimatedMinutes: 45,
    difficultyLevel: 'Beginner',
    aiTools: ['ELSA Speak', 'Google Speech Recognition', 'Speechling'],
    iconName: 'Mic',
    overview: {
      syllabusR26Code: 'R26-ENG-L101',
      description: 'First-Year Engineering Communicative English Lab Module 1 focuses on standard pronunciation, overcoming Mother Tongue Influence (MTI), understanding IPA symbols, vowel/consonant charts, minimal pairs, and intonation in engineering terminology.',
      keyFocusAreas: [
        'IPA Vowels & Consonants Chart',
        'Minimal Pairs Practice (/p/ vs /b/, /f/ vs /v/, /s/ vs /z/)',
        'Syllable Stress in Technical Terms (e.g., Algorithm, Architecture, Technology)',
        'Intonation & Pitch Modulation'
      ],
      industryRelevance: 'Accurate pronunciation ensures software and engineering professionals communicate unambiguously during international client calls, code reviews, and technical presentations.',
      prerequisites: ['Basic familiarity with English alphabet and simple vocabulary.']
    },
    objectives: [
      'Identify and produce standard English IPA sounds correctly.',
      'Differentiate subtle minimal pair contrast sounds without MTI interference.',
      'Apply primary and secondary syllable stress rules to technical words.',
      'Use falling and rising intonation patterns in technical statements and inquiries.'
    ],
    learnContent: {
      introduction: 'Pronunciation is the foundation of oral intelligibility. In engineering communications, pronouncing terms like "cache", "null", "hierarchy", and "procedure" correctly instills immediate professional confidence.',
      sections: [
        {
          title: '1. The International Phonetic Alphabet (IPA)',
          content: 'English has 26 letters but 44 distinct sounds (20 vowels and 24 consonants). IPA provides a precise sound symbol for every phoneme.',
          bulletPoints: [
            'Monophthongs (Pure Vowels): /iː/ (as in "beat"), /ɪ/ (as in "bit"), /æ/ (as in "RAM")',
            'Diphthongs (Gliding Vowels): /aɪ/ (as in "byte"), /eɪ/ (as in "array")',
            'Consonants (Voiced vs Unvoiced): /p/ vs /b/, /t/ vs /d/, /θ/ (thin) vs /ð/ (this)'
          ],
          example: 'Algorithm: /ˈæl.ɡə.rɪ.ðəm/ | Architecture: /ˈɑː.kɪ.tek.tʃər/',
          audioSampleText: 'The algorithm optimizes memory cache efficiency.',
          keyTakeaway: 'Always check phonemes in a pronouncing dictionary when learning new technical terminology.'
        },
        {
          title: '2. Syllable Stress Rules in Engineering Terms',
          content: 'English is a stress-timed language. Correctly stressing the primary syllable changes meaning and improves listener comprehension.',
          bulletPoints: [
            'Nouns vs Verbs: "PRO-ject" (noun) vs "pro-JECT" (verb)',
            'Suffix -logy: Stress the syllable before -logy (tech-NO-logy, bi-O-logy)',
            'Suffix -tion: Stress the syllable before -tion (op-ti-mi-ZA-tion, au-to-MA-tion)'
          ],
          example: 'Computer -> com-PU-ter | Development -> de-VEL-op-ment',
          audioSampleText: 'Automation accelerates system development.',
          keyTakeaway: 'In English, vowel sounds in unstressed syllables usually reduce to a schwa /ə/ sound.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'pronunciation',
      toolTitle: 'Interactive IPA & Voice Recorder',
      instructions: 'Select a target phrase or technical term, click Play to listen to native model audio, then record your voice to analyze clarity.',
      prompts: [
        'The algorithm optimizes memory cache efficiency.',
        'Artificial intelligence enhances automated system performance.',
        'Please verify the client server architecture protocols.'
      ]
    },
    reflectionPrompts: [
      'Which specific English sounds (e.g. /θ/, /v/, /r/) do you find most challenging due to regional language influence?',
      'How does correct syllable stress impact your confidence during technical presentations?'
    ]
  },
  {
    id: 'listening',
    code: 'R26-LAB-02',
    title: 'Listening Comprehension & Note-Taking',
    category: 'Core Foundation',
    shortDesc: 'Develop active listening strategies, accent comprehension, and structured Cornell note-taking for lectures and meetings.',
    estimatedMinutes: 40,
    difficultyLevel: 'Beginner',
    aiTools: ['Otter.ai', 'YouTube Auto Captions', 'Whisper AI'],
    iconName: 'Headphones',
    overview: {
      syllabusR26Code: 'R26-ENG-L102',
      description: 'Module 2 trains students in active listening techniques, identifying key ideas vs supporting details in engineering lectures, handling global English accents, and mastering Cornell note-taking.',
      keyFocusAreas: [
        'Active vs Passive Listening',
        'Cornell Note-Taking System (Cue, Notes, Summary)',
        'Recognizing Signpost Words (e.g., Furthermore, On the contrary, In conclusion)',
        'Listening for Implicit Meaning'
      ],
      industryRelevance: 'Engineers spend over 60% of technical meeting time listening to client requirements, team standups, and technical instructions.',
      prerequisites: ['Basic listening comprehension skills.']
    },
    objectives: [
      'Distinguish main ideas from supporting details in technical audio clips.',
      'Organize lecture notes efficiently using the Cornell 3-column system.',
      'Identify signpost words that signal shifts in logic or emphasis.',
      'Summarize key takeaways accurately from spoken audio passages.'
    ],
    learnContent: {
      introduction: 'Active listening requires intentional concentration, filtering out distraction, and synthesizing incoming spoken information into actionable structured notes.',
      sections: [
        {
          title: '1. The Cornell Note-Taking System',
          content: 'The Cornell method divides a page into Cues (left column), Main Notes (right column), and Summary (bottom section) for maximum retention.',
          bulletPoints: [
            'Notes Column: Record main ideas using abbreviations and bullet points during the lecture.',
            'Cue Column: Formulate key questions and keywords within 24 hours after listening.',
            'Summary Section: Write a brief 2-3 sentence overview of the core message.'
          ],
          example: 'Cue: "What is latency?" | Notes: "Latency = round-trip time delay in ms. Affected by distance & network hops."',
          keyTakeaway: 'Cornell notes turn passive listening into an active revision framework.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'cornell-notes',
      toolTitle: 'Interactive Cornell Note Generator',
      instructions: 'Listen to the audio excerpt on Cloud Computing and draft structured Cornell notes including Cues, Detailed Notes, and a final Summary.',
      prompts: [
        'Cloud computing delivers scalable infrastructure, platforms, and software over the internet with pay-as-you-go pricing.'
      ]
    },
    reflectionPrompts: [
      'How does structured note-taking help you retain technical lecture information compared to verbatim writing?',
      'What strategies can you use when a speaker talks quickly or uses unfamiliar technical accents?'
    ]
  },
  {
    id: 'spoken-english',
    code: 'R26-LAB-03',
    title: 'Spoken English & Fluency Building',
    category: 'Speaking & Delivery',
    shortDesc: 'Eliminate hesitation pauses, reduce filler words, and build rapid oral response confidence with JAM sessions.',
    estimatedMinutes: 50,
    difficultyLevel: 'Intermediate',
    aiTools: ['Speeko', 'ChatGPT', 'Google Assistant'],
    iconName: 'MessageSquare',
    overview: {
      syllabusR26Code: 'R26-ENG-L103',
      description: 'Module 3 enhances spontaneous speaking confidence through Just-A-Minute (JAM) topics, conversational fluency drills, eliminating pause fillers (e.g. "um", "ah", "like"), and mastering sentence rhythm.',
      keyFocusAreas: [
        'Just-A-Minute (JAM) Speaking Rules',
        'Eliminating Vocal Hesitancies & Filler Words',
        'Thought Groups and Pausing for Emphasis',
        'Extempore Topic Structuring (PREP Method)'
      ],
      industryRelevance: 'Fluency and articulate spontaneity are crucial during agile standups, impromptu technical queries, and interactive client discussions.',
      prerequisites: ['Module 1 Pronunciation basics.']
    },
    objectives: [
      'Speak continuously for 60 seconds on an extempore topic without grammatical stalls or excessive pauses.',
      'Identify and minimize personal filler words ("um", "you know", "basically").',
      'Structure impromptu thoughts quickly using the PREP (Point, Reason, Example, Point) framework.',
      'Control speech rate (130-150 words per minute) for maximum audience clarity.'
    ],
    learnContent: {
      introduction: 'Fluency is not about speaking fast; it is about smooth, continuous flow of thoughts expressed with natural pacing and minimal hesitation.',
      sections: [
        {
          title: '1. The PREP Framework for Impromptu Speaking',
          content: 'When given a sudden topic, use PREP to organize your response in under 5 seconds:',
          bulletPoints: [
            'P - Point: State your main thesis clearly.',
            'R - Reason: Explain why you hold this view.',
            'E - Example: Share a specific concrete instance or technical example.',
            'P - Point: Restate your core position emphatically.'
          ],
          example: 'Topic: Is AI replacing programmers? -> Point: AI augments programmers, not replaces them...',
          keyTakeaway: 'Structure prevents hesitation. When you know your blueprint, filler words vanish.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'jam-speaking',
      toolTitle: 'JAM (Just-A-Minute) Extempore Timer',
      instructions: 'Pick an extempore prompt, review the 5-second outline, and press Start Recording to deliver a 60-second speech without long pauses.',
      prompts: [
        'Impact of Renewable Energy on Engineering Solutions',
        'Why Cybersecurity Matters for First-Year Students',
        'The Evolution of Smartphones from Communication to AI Hubs'
      ]
    },
    reflectionPrompts: [
      'How many filler words did you notice in your 60-second recording?',
      'Did the PREP structure help you keep speaking without blanking out?'
    ]
  },
  {
    id: 'group-discussion',
    code: 'R26-LAB-04',
    title: 'Group Discussion Techniques',
    category: 'Speaking & Delivery',
    shortDesc: 'Master GD roles, entry strategies, constructive agreement/disagreement, and consensus building for placement drives.',
    estimatedMinutes: 50,
    difficultyLevel: 'Intermediate',
    aiTools: ['ChatGPT', 'Gemini', 'Mentimeter'],
    iconName: 'Users',
    overview: {
      syllabusR26Code: 'R26-ENG-L104',
      description: 'Module 4 prepares engineering candidates for placement Group Discussions (GD). Learn roles (Initiator, Moderator, Harmonizer, Summarizer), polite intervention, logical rebuttal, and group consensus tactics.',
      keyFocusAreas: [
        'Types of GD Topics (Factual, Opinionated, Abstract, Case Studies)',
        'GD Dynamics: Body Language, Eye Contact, Voice Modulation',
        'Polite Interruptions & Re-entry Phrases',
        'Summarizing & Synthesis Skills'
      ],
      industryRelevance: 'Group Discussions are the primary screening round during campus recruitment drives by major IT and core engineering corporations.',
      prerequisites: ['Spoken English & Fluency basics.']
    },
    objectives: [
      'Initiate or enter a GD constructively using formal transition phrases.',
      'Express disagreement firmly yet politely without interrupting aggressively.',
      'Synthesize multiple opposing viewpoints into a unified group summary.',
      'Demonstrate active collaborative listening during GD simulations.'
    ],
    learnContent: {
      introduction: 'A Group Discussion is a collaborative problem-solving exercise, not a debate. Evaluators assess team spirit, reasoning depth, and articulate leadership.',
      sections: [
        {
          title: '1. Strategic Phrases for GD Interventions',
          content: 'Mastering functional language allows you to navigate intense group discussions smoothly:',
          bulletPoints: [
            'Initiating: "Good morning peers, the topic before us today is... Let us define the key scope..."',
            'Agreeing & Building: "I completely align with my friend\'s point regarding X, and I would like to add..."',
            'Polite Disagreement: "That is a valid perspective, however, considering the technical constraints..."',
            'Summarizing: "As time draws to a close, let us synthesize the key takeaways agreed upon by the group..."'
          ],
          keyTakeaway: 'Quality of contributions outweighs quantity of talk time.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'gd-simulator',
      toolTitle: 'Interactive GD Roleplay Simulator',
      instructions: 'Select a GD topic, read simulated peer arguments, choose your intervention tactic, and record your response.',
      prompts: [
        'Topic: Should Artificial Intelligence replace traditional engineering entrance exams?',
        'Topic: Work From Home vs Hybrid Models for Software Engineering Teams'
      ]
    },
    reflectionPrompts: [
      'Were you able to intervene politely without sounding aggressive or timid?',
      'Which GD role (Initiator, Harmonizer, Summarizer) best suits your personal communication style?'
    ]
  },
  {
    id: 'public-speaking',
    code: 'R26-LAB-05',
    title: 'Public Speaking & Presentations',
    category: 'Speaking & Delivery',
    shortDesc: 'Structure impactful technical presentations, slide design principles, hook techniques, and speech delivery mechanics.',
    estimatedMinutes: 55,
    difficultyLevel: 'Intermediate',
    aiTools: ['Beautiful.ai', 'Gamma', 'Microsoft Copilot'],
    iconName: 'Presentation',
    overview: {
      syllabusR26Code: 'R26-ENG-L105',
      description: 'Module 5 equips students with public speaking tools: crafting 3-minute elevator pitches, designing technical presentation decks, mastering stage presence, vocal dynamics, and audience Q&A handling.',
      keyFocusAreas: [
        'The 3-Part Presentation Structure (Hook, Body, Call-to-Action)',
        'Slide Aesthetics: 6x6 Rule, Visual Hierarchy, Minimalism',
        'Vocal Dynamics: Volume, Modulation, Strategic Pauses',
        'Elevator Pitch Framework for Project Demos'
      ],
      industryRelevance: 'Presenting technical solutions clearly to stakeholders, management, and clients is a core engineering competency.',
      prerequisites: ['Fluency and pronunciation fundamentals.']
    },
    objectives: [
      'Deliver a concise 3-minute technical project presentation or elevator pitch.',
      'Apply the 6x6 rule to slide presentations to prevent cognitive overload.',
      'Use vocal modulation to maintain audience engagement during technical talks.',
      'Answer audience questions confidently during project Q&A sessions.'
    ],
    learnContent: {
      introduction: 'Great presenters are made, not born. By combining a compelling opening hook with logical slide hierarchy and confident body posture, any engineer can deliver memorable presentations.',
      sections: [
        {
          title: '1. The 3-Minute Technical Elevator Pitch',
          content: 'An elevator pitch summarizes a complex project or technical idea in under 180 seconds:',
          bulletPoints: [
            '0:00 - 0:30 (Hook & Problem): "Did you know that 40% of energy is wasted in..."',
            '0:30 - 1:30 (Solution & Architecture): "Our AI-powered smart grid system solves this by..."',
            '1:30 - 2:30 (Validation & Results): "In preliminary testing at SRIT lab, efficiency increased by 28%..."',
            '2:30 - 3:00 (Call to Action): "We invite you to collaborate on our upcoming pilot test..."'
          ],
          keyTakeaway: 'Focus on problem-solution-impact rather than hyper-dense technical jargon.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'elevator-pitch',
      toolTitle: '3-Minute Presentation Pitch Studio',
      instructions: 'Select your project pitch scenario, record your presentation slide by slide, and check your pace and time compliance.',
      prompts: [
        'Pitching an IoT-based Automated Agriculture Sensor Network to Faculty Judges',
        'Demonstrating a Student Mobile App for SRIT Campus Navigation'
      ]
    },
    reflectionPrompts: [
      'Did your speech finish within the 3-minute time limit?',
      'How effective was your opening hook in grabbing attention?'
    ]
  },
  {
    id: 'professional-writing',
    code: 'R26-LAB-06',
    title: 'Interview Skills & Mock Interviews',
    category: 'Career Readiness',
    shortDesc: 'Master HR interview strategies, STAR method responses, body language, voice parameters, and realistic AI mock interviews with 10-mark evaluation.',
    estimatedMinutes: 60,
    difficultyLevel: 'Advanced',
    aiTools: ['AI Mock Interviewer', 'Yoodli', 'Google Interview Warmup', 'ChatGPT'],
    iconName: 'UserCheck',
    overview: {
      syllabusR26Code: 'R26-ENG-L106',
      description: 'Module 6 prepares engineering students for technical and HR placement interviews. It covers HR round strategies, STAR method framework (Situation, Task, Action, Result), non-verbal cues & body language, speech & voice parameters, and AI mock interview simulations with 10-mark SAILL diagnostic reporting.',
      keyFocusAreas: [
        'Introduction to HR Interviews & Core Placement Questions',
        'STAR Method Response Builder (Situation, Task, Action, Result)',
        'Body Language, Posture & Eye Contact Strategy',
        'Voice & Communication Parameters (Pronunciation, Fluency, Grammar, Tone, Confidence, Pace)',
        'AI Mock Interview Simulator with Preparation Timer & 10-Mark Diagnostic Report',
        'Modular Connectors for Yoodli, Google Interview Warmup & ChatGPT'
      ],
      industryRelevance: 'Interview excellence is the final gatekeeper for high-paying software and engineering campus placements in top multinational IT and core engineering firms.',
      prerequisites: ['Basic conversational fluency, technical project background, and professional composure.']
    },
    objectives: [
      'Structure behavioral interview responses using the STAR method for maximum clarity and impact.',
      'Formulate clear, concise, and grammatically accurate answers to top HR placement questions.',
      'Apply professional non-verbal body language, gaze control, and positive posture during interviews.',
      'Perform complete AI mock interview simulations with prep timers, audio beep signals, and automated 10-mark SAILL diagnostic reports.',
      'Analyze voice and speech parameters (pronunciation, fluency, grammar, tone, confidence, pace) to refine communication performance.'
    ],
    learnContent: {
      introduction: 'An interview is a two-way professional conversation where interviewers evaluate your technical competence, culture fit, problem-solving mindset, and communication clarity.',
      sections: [
        {
          title: '1. The Structure of Campus HR Interviews',
          content: 'HR interview rounds assess candidate stability, team collaboration, learning agility, and communicative confidence.',
          bulletPoints: [
            'Introduction: Deliver a crisp 60-second elevator pitch highlighting engineering background and core skills.',
            'Behavioral Questions: Demonstrate problem-solving using concrete past experiences.',
            'Culture Fit & Motivation: Articulate why you want to join the company and your career alignment.',
            'Closing: Ask 1-2 thoughtful, informed questions about company engineering culture or tech stacks.'
          ],
          keyTakeaway: 'Structure, authenticity, and calm confidence matter more than memorized rehearsed scripts.'
        },
        {
          title: '2. The STAR Method Framework',
          content: 'The STAR method ensures concise, structured, and impact-driven answers to behavioral interview questions.',
          bulletPoints: [
            'Situation (15%): Briefly describe the background, project, or context.',
            'Task (15%): Explain your specific goal or challenge.',
            'Action (50%): Detail the exact steps YOU took, tools used, and problem-solving logic.',
            'Result (20%): Share the quantifiable outcome, metrics, learning, or success.'
          ],
          keyTakeaway: 'Focus 50% of your time on Action—interviewers want to know what YOU personally accomplished.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'star-interview',
      toolTitle: 'Interactive Interview Skills & Mock Interview Studio',
      instructions: 'Select from 10 specialized interview activities, practice HR simulation questions, build STAR responses, and perform complete AI mock interviews.',
      prompts: [
        'Introduce yourself highlighting your engineering specialization, key projects, and career aspirations.',
        'Use the STAR framework to describe a challenging technical bug or team conflict you resolved.'
      ]
    },
    reflectionPrompts: [
      'Which vocal parameter (fluency, pace, tone, grammar, confidence) requires the most practice before your placement drive?',
      'How did structuring your project story with the STAR method improve your answer clarity?'
    ]
  },
  {
    id: 'professional-email',
    code: 'R26-LAB-07',
    title: 'Professional Email & Business Writing',
    category: 'Professional Writing',
    shortDesc: 'Write clear, concise, and polite business emails, technical requests, leave applications, and workplace correspondence.',
    estimatedMinutes: 45,
    difficultyLevel: 'Intermediate',
    aiTools: ['Grammarly', 'ChatGPT', 'Gemini'],
    iconName: 'Mail',
    overview: {
      syllabusR26Code: 'R26-ENG-L107',
      description: 'Module 7 teaches technical and corporate correspondence: subject lines, formal salutations, polite tone, request structures, follow-up etiquette, and avoiding informal messaging jargon in academic/workplace emails.',
      keyFocusAreas: [
        'Anatomy of a Professional Email (Subject, Greeting, Body, Call to Action, Sign-off)',
        'Tone & Politeness Indicators (Modal verbs: Could, Would, May)',
        'Writing Academic Requests to Professors & HODs',
        'Corporate Follow-up & Status Update Templates'
      ],
      industryRelevance: 'Email is the primary formal communication medium in corporate engineering workplaces worldwide.',
      prerequisites: ['Basic sentence composition skills.']
    },
    objectives: [
      'Draft concise, action-oriented email subject lines.',
      'Compose polite formal emails requesting internship permissions or project guidance.',
      'Apply proper salutations, paragraph formatting, and professional email sign-offs.',
      'Proofread written correspondence to eliminate grammatical and tone defects.'
    ],
    learnContent: {
      introduction: 'Professional emails should be concise, scannable, and respectful. Busy managers and professors decide whether to read your email based on the subject line alone.',
      sections: [
        {
          title: '1. Email Structure Checklist',
          content: 'Follow this 5-point blueprint for every academic and professional email:',
          bulletPoints: [
            '1. Actionable Subject Line: "[Request] Internship NOC Permission - Roll No 26SR1A0501"',
            '2. Salutation: "Dear Dr. / Prof. [Name]," (Avoid informal "Hi bro" or missing greetings)',
            '3. Core Purpose (Sentence 1): State why you are writing immediately.',
            '4. Key Context / Bullet Points: Keep details scannable.',
            '5. Professional Sign-off: "Sincerely," or "Warm regards," followed by full credentials.'
          ],
          keyTakeaway: 'Never leave the subject line blank or write the entire email in the subject line.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'email-drafter',
      toolTitle: 'Interactive Email Drafter & Evaluator',
      instructions: 'Select a writing scenario (e.g., requesting OD permission for a tech fest), draft your subject and email body, and submit for automated evaluation.',
      prompts: [
        'Draft an email to HOD requesting 2 days On-Duty (OD) leave for participating in a State Hackathon.',
        'Write a polite follow-up email to a company HR regarding your summer internship application status.'
      ]
    },
    reflectionPrompts: [
      'Is your subject line specific enough that a recipient knows what is needed at a glance?',
      'Did you use modal verbs ("Would it be possible...", "I would appreciate...") to maintain a polite tone?'
    ]
  },
  {
    id: 'resume-writing',
    code: 'R26-LAB-08',
    title: 'Resume & Cover Letter Writing',
    category: 'Career Readiness',
    shortDesc: 'Craft ATS-compliant engineering resumes, action-verb bullet points, professional summary, and cover letter templates.',
    estimatedMinutes: 50,
    difficultyLevel: 'Intermediate',
    aiTools: ['Kickresume', 'Resume.io', 'Jobscan', 'ChatGPT'],
    iconName: 'FileText',
    overview: {
      syllabusR26Code: 'R26-ENG-L108',
      description: 'Module 8 guides first-year engineering students in creating professional, ATS-friendly resumes and tailored cover letters. Learn action verbs, quantifying project achievements, section formatting, and avoiding common resume flaws.',
      keyFocusAreas: [
        'ATS (Applicant Tracking System) Formatting Standards',
        'Action Verb + Task + Impact Formula for Bullet Points',
        'Structuring Student Education, Skills, Projects, & Certifications',
        'Writing Tailored Cover Letters for Engineering Internships'
      ],
      industryRelevance: 'A well-crafted resume opens doors to campus interviews and competitive corporate internships.',
      prerequisites: ['Professional email writing basics.']
    },
    objectives: [
      'Draft an ATS-formatted 1-page engineering resume.',
      'Write impact-driven project bullet points starting with strong action verbs (e.g., Developed, Engineered, Optimized).',
      'Create a compelling 3-paragraph internship cover letter.',
      'Eliminate formatting errors, inconsistent fonts, and typos.'
    ],
    learnContent: {
      introduction: 'Resumes are scanned by ATS software and HR recruiters in under 7 seconds. Clear hierarchy, concise action verbs, and quantifiable results make your application stand out.',
      sections: [
        {
          title: '1. The High-Impact Bullet Point Formula',
          content: 'Transform passive descriptions into powerful achievement statements:',
          bulletPoints: [
            'Weak: "Was part of a team that made an Android app."',
            'Strong: "Engineered a native Android campus navigation app using Java & SQLite, reducing new student navigation delays by 40%."'
          ],
          keyTakeaway: 'Always begin project bullets with active verbs (Designed, Built, Implemented, Spearheaded).'
        }
      ]
    },
    practiceConfig: {
      toolId: 'resume-builder',
      toolTitle: 'Interactive Engineering Resume Builder',
      instructions: 'Fill in your profile, project achievements, and technical skill sets to generate a clean, ATS-formatted resume preview and score.',
      prompts: [
        'Create a student resume profile for First-Year B.Tech Computer Science student at SRIT.',
        'Write 3 high-impact bullet points for a Python lab mini-project.'
      ]
    },
    reflectionPrompts: [
      'Do your project bullets contain quantifiable metrics (e.g. percentages, user counts, performance speed)?',
      'Is your resume layout clean, single-column, and free of complex tables or graphics that confuse ATS scanners?'
    ]
  },
  {
    id: 'reading-comprehension',
    code: 'R26-LAB-09',
    title: 'Reading Comprehension & Critical Thinking',
    category: 'Core Foundation',
    shortDesc: 'Enhance technical reading speed, skimming, scanning, inferential reasoning, and vocabulary building.',
    estimatedMinutes: 40,
    difficultyLevel: 'Intermediate',
    aiTools: ['QuillBot', 'Speechify', 'NotebookLM'],
    iconName: 'BookOpen',
    overview: {
      syllabusR26Code: 'R26-ENG-L109',
      description: 'Module 9 focuses on technical reading strategies: Skimming for main concepts, Scanning for specific technical parameters, vocabulary acquisition from context, and evaluating logical claims in research papers.',
      keyFocusAreas: [
        'Skimming vs Scanning Techniques',
        'Inferential vs Literal Reading Questions',
        'Contextual Vocabulary Building in Engineering Texts',
        'Identifying Author Bias & Argument Strength'
      ],
      industryRelevance: 'Engineers digest hundreds of pages of documentation, API specs, research papers, and technical standards annually.',
      prerequisites: ['Basic English reading ability.']
    },
    objectives: [
      'Skim technical passages at 250+ words per minute to extract main themes.',
      'Scan dense specification documents to locate target data rapidly.',
      'Deduce the meaning of unfamiliar technical terms using context clues.',
      'Answer critical thinking comprehension questions accurately.'
    ],
    learnContent: {
      introduction: 'Critical reading enables engineers to evaluate complex documentation efficiently, spot logical flaws, and synthesize information for problem-solving.',
      sections: [
        {
          title: '1. Skimming vs Scanning',
          content: 'Different reading tasks require distinct speed techniques:',
          bulletPoints: [
            'Skimming: Reading headings, first/last sentences of paragraphs to get an overall conceptual map.',
            'Scanning: Rapidly sweeping eyes down a text searching for specific keywords, numbers, or dates.'
          ],
          keyTakeaway: 'Do not read technical documentation word-for-word on your first pass.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'speed-reading',
      toolTitle: 'Speed Reading & Passage Comprehension Quiz',
      instructions: 'Read the technical passage on Quantum Computing within the timer limit, then answer the critical analysis questions.',
      prompts: [
        'Passage: Quantum computing leverages qubits, superposition, and entanglement to perform complex computations...'
      ]
    },
    reflectionPrompts: [
      'Did skimming help you locate answer areas faster during the comprehension quiz?',
      'How can active vocabulary logging improve your technical reading comprehension?'
    ]
  },
  {
    id: 'debate-skills',
    code: 'R26-LAB-10',
    title: 'Debate & Argumentation Skills',
    category: 'Speaking & Delivery',
    shortDesc: 'Construct persuasive arguments, identify logical fallacies, execute parliamentary rebuttals, and speak convincingly.',
    estimatedMinutes: 50,
    difficultyLevel: 'Advanced',
    aiTools: ['ChatGPT', 'Claude', 'Kialo Edu'],
    iconName: 'Scale',
    overview: {
      syllabusR26Code: 'R26-ENG-L110',
      description: 'Module 10 trains students in formal argumentation, constructing claims supported by evidence, spotting logical fallacies (Ad Hominem, Strawman, False Dilemma), and delivering persuasive debate speeches.',
      keyFocusAreas: [
        'Claim-Evidence-Reasoning (CER) Framework',
        'Identifying Common Logical Fallacies',
        'Rebuttal Tactics & Points of Information (POI)',
        'Persuasive Rhetoric (Ethos, Pathos, Logos)'
      ],
      industryRelevance: 'Engineers must defend technical design choices, budget allocations, and architectural decisions during engineering review boards.',
      prerequisites: ['Group Discussion and Spoken English skills.']
    },
    objectives: [
      'Structure a debate motion argument using Claim, Evidence, and Reasoning.',
      'Identify and refute logical fallacies in opposing statements.',
      'Use Ethos, Pathos, and Logos effectively during persuasive oral debates.',
      'Deliver a 2-minute rebuttal speech addressing core counter-arguments.'
    ],
    learnContent: {
      introduction: 'Debate cultivates intellectual agility. The ability to argue both sides of a technical topic objectively strengthens decision-making and critical thinking.',
      sections: [
        {
          title: '1. The CER Argumentation Blueprint',
          content: 'Every persuasive point must contain three elements:',
          bulletPoints: [
            'Claim: State your position clearly ("SRIT should mandate open-source tools in all computer labs").',
            'Evidence: Provide statistics or expert data ("Open-source adoption saves $15k per lab in licensing").',
            'Reasoning: Explain how the evidence proves the claim logically.'
          ],
          keyTakeaway: 'An assertion without evidence is merely an opinion.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'debate-builder',
      toolTitle: 'Interactive Debate Motion Builder',
      instructions: 'Choose a debate motion, construct your CER argument for or against, and record your rebuttal to simulated counter-claims.',
      prompts: [
        'Motion: This House believes that autonomous AI systems should be granted patent ownership rights.',
        'Motion: Nuclear energy is essential for achieving carbon-neutral technology infrastructure.'
      ]
    },
    reflectionPrompts: [
      'Were you able to identify any logical fallacies in your opponent\'s simulated arguments?',
      'How does supporting claims with concrete evidence make your arguments more persuasive?'
    ]
  },
  {
    id: 'report-writing',
    code: 'R26-LAB-11',
    title: 'Report Writing & Technical Communication',
    category: 'Professional Writing',
    shortDesc: 'Format technical reports, lab manuals, executive summaries, data visual captions, and project documentation.',
    estimatedMinutes: 55,
    difficultyLevel: 'Advanced',
    aiTools: ['Grammarly Business', 'ChatGPT', 'Hemingway Editor'],
    iconName: 'FileCheck',
    overview: {
      syllabusR26Code: 'R26-ENG-L111',
      description: 'Module 11 covers engineering report writing: lab reports, feasibility studies, project progress reports, technical specifications, formatting executive summaries, citing sources, and clear passive-to-active style.',
      keyFocusAreas: [
        'Structure of Technical Reports (Title, Abstract, Intro, Methodology, Results, Conclusion)',
        'Writing Concise Executive Summaries',
        'Data Presentation (Table captions, Figure labeling, Trend description)',
        'IEEE Citation & Academic Integrity Standards'
      ],
      industryRelevance: 'Engineers document software architecture, hardware tests, and project outcomes in formal technical reports.',
      prerequisites: ['Professional writing and email fundamentals.']
    },
    objectives: [
      'Structure a 3-page technical report following standard engineering guidelines.',
      'Write a clear 150-word Executive Summary summarizing a complex technical project.',
      'Label and describe data charts and figures accurately.',
      'Apply IEEE style referencing for academic and technical sources.'
    ],
    learnContent: {
      introduction: 'Technical reports communicate complex data clearly, objectively, and concisely. Well-structured reports allow decision-makers to grasp findings immediately.',
      sections: [
        {
          title: '1. Executive Summary Formula',
          content: 'An executive summary distills an entire 30-page report into one standalone page:',
          bulletPoints: [
            'Background & Objective: What problem was investigated?',
            'Methodology: How was the experiment or project conducted?',
            'Key Findings: What were the top 2-3 data results?',
            'Recommendations: What actionable next steps should be taken?'
          ],
          keyTakeaway: 'The executive summary is the most frequently read section of any engineering report.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'report-formatter',
      toolTitle: 'Technical Report Formatter & Abstract Builder',
      instructions: 'Input project findings, format section headings, write an executive summary, and verify technical tone compliance.',
      prompts: [
        'Draft an Executive Summary for a B.Tech Environmental Engineering Water Quality Analysis Report at SRIT Campus.'
      ]
    },
    reflectionPrompts: [
      'Is your executive summary understandable to a non-technical manager?',
      'Did you cite external data sources using proper IEEE format?'
    ]
  },
  {
    id: 'etiquette-branding',
    code: 'R26-LAB-12',
    title: 'Etiquette, Netiquette & Personal Branding',
    category: 'Career Readiness',
    shortDesc: 'Develop professional workplace etiquette, virtual meeting netiquette, LinkedIn profile branding, and digital presence.',
    estimatedMinutes: 45,
    difficultyLevel: 'Intermediate',
    aiTools: ['ChatGPT', 'Canva AI', 'LinkedIn AI'],
    iconName: 'UserCheck',
    overview: {
      syllabusR26Code: 'R26-ENG-L112',
      description: 'Module 12 covers corporate etiquette, online virtual meeting protocols (Netiquette), professional attire, handshake/greeting norms, creating an impactful LinkedIn profile, and managing digital engineering identity.',
      keyFocusAreas: [
        'Workplace & Classroom Etiquette',
        'Virtual Meeting Netiquette (Camera, Mute protocols, Professional Background)',
        'Building a High-Impact Engineering LinkedIn Profile',
        'Managing Online Reputation & Digital Footprint'
      ],
      industryRelevance: 'Professional presence and netiquette build trust with colleagues, recruiters, and global team members.',
      prerequisites: ['Resume writing and career readiness basics.']
    },
    objectives: [
      'Formulate professional netiquette rules for virtual technical meetings.',
      'Craft a compelling LinkedIn Headline and About Summary for engineering students.',
      'Demonstrate appropriate corporate body language and greeting etiquette.',
      'Maintain an active, positive professional digital footprint.'
    ],
    learnContent: {
      introduction: 'Personal branding is what people say about your professional capability when you leave the room. A strong LinkedIn profile paired with impeccable workplace etiquette accelerates career trajectory.',
      sections: [
        {
          title: '1. LinkedIn Headline Formula for Engineering Students',
          content: 'Your headline should express your branch, target domains, and key project highlights:',
          bulletPoints: [
            'Formula: [Branch/Degree Student at SRIT] | [Key Technical Skills / Projects] | [Target Role / Passion]',
            'Example: "First-Year Computer Science Student @ SRIT | Python & AI Enthusiast | Building Open Source ML Tools"'
          ],
          keyTakeaway: 'Avoid generic headlines like "Student at SRIT". Show your specific technical focus.'
        }
      ]
    },
    practiceConfig: {
      toolId: 'personal-branding',
      toolTitle: 'LinkedIn & Professional Brand Generator',
      instructions: 'Craft your LinkedIn Headline, About section, and practice writing a virtual meeting netiquette policy for online classes.',
      prompts: [
        'Write a 150-word LinkedIn About summary for a First-Year Mechanical Engineering student interested in Robotics.',
        'Draft a 5-point Netiquette checklist for virtual lab sessions.'
      ]
    },
    reflectionPrompts: [
      'Does your LinkedIn headline immediately convey your engineering focus area?',
      'How can you ensure your social media presence reflects professional standards?'
    ]
  }
];

export function getModuleById(id: string): ModuleData | undefined {
  return R26_MODULES.find((m) => m.id === id);
}

export function getModulesByCategory(category: string): ModuleData[] {
  return R26_MODULES.filter((m) => m.category === category);
}
