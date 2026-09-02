import { JourneyContentSchema } from '../../types';

export const journey01Content: JourneyContentSchema = {
  journeyId: 'journey-01',
  moduleId: 'pronunciation',
  code: 'SRIT-SAILL-M01',
  title: 'Pronunciation & Accent Training',
  shortDesc: 'Master standard Received Pronunciation (RP) & General American phonemes, IPA chart navigation, syllable stress, and MTI reduction.',
  metadata: {
    version: '1.0.0',
    createdDate: '2026-01-15',
    updatedDate: '2026-08-01',
    author: 'SRIT SAILL Instructional Design Team',
    status: 'published',
    tags: ['Phonetics', 'IPA', 'Speech Sound Foundations', 'Syllable Stress', 'MTI Reduction']
  },
  overview: {
    syllabus: 'Phase A: Speech Sound Foundations (Unit 1: IPA Explorer, Unit 2: Sound Library, Unit 3: Articulation Studio, Unit 4: Pronunciation Explorer, Unit 5: Foundation Assessment). Phase B: Accent & Word Stress.',
    targetAudience: 'B.Tech / MCA / M.Tech Students seeking accent neutralization and clear technical speech.',
    prerequisiteSkills: ['Basic English reading ability', 'Access to microphone and headphones']
  },
  outcomes: {
    primaryOutcome: 'Articulate 44 IPA English phonemes accurately and eliminate regional Mother Tongue Influence (MTI).',
    bloomTaxonomyLevel: 'Apply & Analyze',
    skillTags: ['Phonetic Clarity', 'IPA Mastery', 'Neutral Accent', 'Stress Placement']
  },
  theory: {
    summary: 'Phonetic accuracy involves mastering tongue placement, lip rounding, and breath control. The 44 IPA sounds comprise 20 vowels and 24 consonants.',
    keyPrinciples: [
      'Monophthongs require fixed vocal tract positions.',
      'Diphthongs transition glides from one vowel quality to another.',
      'Unstressed vowels in multisyllabic words weaken to schwa /ə/.'
    ],
    tableComparison: {
      headers: ['Sound Type', 'Count', 'Example Phonemes', 'Technical Word Context'],
      rows: [
        ['Monophthongs', '12', '/iː/, /ɪ/, /e/, /æ/', 'circuit /ˈsɜː.kɪt/'],
        ['Diphthongs', '8', '/eɪ/, /aɪ/, /ɔɪ/', 'data /ˈdeɪ.tə/'],
        ['Consonants', '24', '/θ/, /ð/, /ʃ/, /ʒ/', 'algorithm /ˈæl.ɡə.rɪ.ðəm/']
      ]
    }
  },
  interactiveDemoConfig: {
    demoTitle: 'Interactive IPA Visualizer & Articulation Model',
    interactiveType: 'ipa_interactive_chart',
    promptRef: 'PROMPT_M01_PRONUNCIATION_01'
  },
  knowledgeCheck: {
    questionBankRef: 'mcmf-qb-pron-01',
    totalQuestions: 10,
    passingScore: 80
  },
  notebookPrompts: [
    'Record your pronunciation of 5 technical engineering terms before and after reviewing IPA chart guides.',
    'Note down three words where you identified Mother Tongue Influence (MTI) during practice.'
  ],
  reflectionPrompts: [
    'Which specific phoneme sound required the most vocal adjustment today?',
    'How does reducing MTI improve your clarity in technical interviews?'
  ],
  portfolioConfig: {
    submissionTitle: 'Pronunciation Mastery Audio Artifact',
    requirements: [
      'Submit a 30-second audio recording delivering a neutral accent technical introduction.',
      'Provide an IPA transcript for 5 key terms in your speech.'
    ],
    rubrics: ['Phonetic Accuracy (40%)', 'Stress Alignment (30%)', 'Fluid Cadence (30%)']
  },
  resources: [
    { name: 'IPA Interactive Chart Reference (PDF)', type: 'pdf', url: '/resources/ipa_chart.pdf' },
    { name: 'SRIT MTI Neutralization Handbook', type: 'doc', url: '/resources/mti_handbook.docx' }
  ],
  activities: [
    {
      activityId: 'act-m01-01',
      title: 'IPA Monophthong Articulation Drill',
      learningOutcome: 'Distinguish between short /ɪ/ and long /iː/ vowel durations in technical words.',
      estimatedTime: '15 Mins',
      difficulty: 'Foundation',
      instructions: [
        'Listen to the native audio model.',
        'Observe tongue position in the organ of speech diagram.',
        'Record your voice and compare waveforms.'
      ],
      examples: [
        { id: 'ex-m01-01', title: 'Minimal Pair: Ship vs Sheep', text: 'ship /ʃɪp/ vs sheep /ʃiːp/', audioRef: 'aud-vow-01' }
      ],
      practiceDrills: [
        { drillId: 'dr-01', prompt: 'Record: "The chip was fitted into the system."', type: 'record', targetText: 'The chip was fitted into the system.' }
      ],
      knowledgeCheckRef: 'mcmf-qb-pron-01',
      reflectionPrompts: ['Did you notice a duration difference between short and long vowels?'],
      resources: [{ title: 'IPA Monophthong Guide', type: 'pdf', url: '/docs/monophthongs.pdf' }],
      promptRef: 'PROMPT_M01_PRONUNCIATION_01',
      audioReferences: ['aud-vow-01'],
      imageReferences: ['/images/organs_of_speech.png']
    }
  ],
  facultyNotes: {
    pedagogicalObjectives: [
      'Ensure B.Tech students recognize the contrast between vernacular vowel lengthening and standard RP/GA phonetics.',
      'Monitor Voice Onset Time (VOT) in stop consonants during lab recording sessions.'
    ],
    commonStudentPitfalls: [
      'Substituing /v/ for /w/ in words like "wavelength".',
      'Over-pronouncing silent letters in "circuit" or "subtle".'
    ],
    suggestedRemediation: [
      'Assign minimal pair contrast exercises in Universal Recorder.',
      'Use spectrogram feedback to highlight vowel duration differences.'
    ],
    ciaEvaluationRubric: [
      { criteria: 'Phonetic Accuracy & IPA Precision', weight: 0.4, maxMarks: 10 },
      { criteria: 'Syllable Stress & Rhythm', weight: 0.3, maxMarks: 10 },
      { criteria: 'MTI Elimination', weight: 0.3, maxMarks: 10 }
    ],
    confidentialInstructorKey: 'FACULTY_KEY_M01_CONFIDENTIAL_2026'
  }
};
