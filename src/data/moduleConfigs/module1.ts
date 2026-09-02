import { ModuleConfig } from '../../types/moduleConfig';

export const module1Config: ModuleConfig = {
  moduleId: 'pronunciation',
  code: 'R26-LAB-01',
  title: 'Phonetics & Pronunciation Practice',
  syllabusTopic: 'International Phonetic Alphabet (IPA), Minimal Pairs, Syllable Stress & Intonation',
  description: 'Master English phonemes, 44 IPA symbols, minimal pair articulation, syllable stress in technical vocabulary, and rising/falling intonation patterns.',
  
  notebookConfig: {
    experimentNumber: 'EXP-01',
    aim: 'To understand and produce standard English phonemes, minimal pairs, and correct syllable stress patterns in engineering terminology.',
    apparatus: ['SAILL AI Audio Engine', 'Digital Microphone', 'IPA Phoneme Interactive Chart', 'Spectrogram Audio Analyzer'],
    theory: 'English has 26 letters but 44 distinct sounds (20 vowels and 24 consonants). Pronunciation accuracy in technical terms prevents ambiguity during international technical reviews.',
    procedure: [
      'Study the 44 English IPA phonemes (12 monophthongs, 8 diphthongs, 24 consonants).',
      'Record minimal pair contrasts (/p/ vs /b/, /f/ vs /v/, /s/ vs /z/).',
      'Apply primary syllable stress rules to multisyllabic technical terms (e.g., op-ti-mi-ZA-tion).',
      'Analyze recorded spectrogram voice samples against native speaker acoustic benchmarks.'
    ],
    defaultStudentWork: `LABORATORY OUTPUT - PHONETICS & PRONUNCIATION (EXP-01):

1. IPA Articulation Drills Completed:
   - Pure Vowels: /iː/ (beat), /ɪ/ (bit), /æ/ (RAM), /ʌ/ (bus), /ɑː/ (data)
   - Diphthongs: /eɪ/ (array), /aɪ/ (byte), /əʊ/ (code)
   - Consonants: /θ/ (thread) vs /ð/ (this), /ʃ/ (shell) vs /tʃ/ (checksum)

2. Minimal Pair Acoustic Recording Results:
   - "ship" /ʃɪp/ vs "sheep" /ʃiːp/ -> Vowel duration ratio: 1:1.8 (Passed)
   - "fan" /fæn/ vs "van" /væn/ -> Voicing onset time: Correct
   - "think" /θɪŋk/ vs "sink" /sɪŋk/ -> Dental vs Alveolar friction: Correct

3. Syllable Stress Annotations:
   - AL-go-rithm /ˈæl.ɡə.rɪ.ðəm/ (Primary stress on 1st syllable)
   - Tech-NO-lo-gy /tekˈnɒl.ə.dʒi/ (Primary stress on 2nd syllable before -logy)
   - Au-to-MA-tion /ˌɔː.təˈmeɪ.ʃən/ (Primary stress on 3rd syllable before -tion)`,
    defaultReflection: 'I identified minor Mother Tongue Influence (MTI) in pronouncing /v/ and /w/ sounds. Using the interactive IPA audio chart helped me align tongue placement and breath control.',
    rubricCriteria: [
      { name: 'Phoneme Articulation & Clarity', maxScore: 20, description: 'Accurate production of 44 IPA sounds without MTI distortion.' },
      { name: 'Minimal Pairs Distinction', maxScore: 20, description: 'Clear acoustic contrast between similar vowel/consonant sounds.' },
      { name: 'Syllable Stress Placement', maxScore: 20, description: 'Correct primary and secondary stress on multi-syllable engineering terms.' },
      { name: 'Intonation & Rhythm', maxScore: 20, description: 'Natural falling intonation in statements and rising intonation in questions.' },
      { name: 'Fluency & Pacing', maxScore: 20, description: 'Smooth delivery without unwarranted pauses or fillers.' }
    ],
    targetOutputs: ['Audio Spectrogram Plot', 'Syllable Stress Annotated Script', 'Phoneme Mastery Scorecard'],
    facultySampleRemarks: 'Excellent articulation of unvoiced fricatives /θ/ and /ʃ/. Proper stress applied to multi-syllabic engineering vocabulary. Approved.'
  },

  knowledgeCheck: {
    title: 'Phonetics & Pronunciation Knowledge Check',
    passingScore: 75,
    shuffleQuestions: true,
    questions: [
      {
        id: 'p-q1',
        type: 'mcq',
        prompt: 'How many distinct phonemes (sounds) exist in standard English phonetics?',
        options: ['26 phonemes', '32 phonemes', '44 phonemes', '52 phonemes'],
        correctAnswer: '44 phonemes',
        explanation: 'Standard English comprises 44 phonemes: 20 vowels (12 monophthongs + 8 diphthongs) and 24 consonants.'
      },
      {
        id: 'p-q2',
        type: 'true_false',
        prompt: 'True or False: In minimal pairs like "ship" /ɪ/ and "sheep" /iː/, both vowel length and tongue tension differ.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. /ɪ/ is a short, lax vowel, whereas /iː/ is a long, tense vowel.'
      },
      {
        id: 'p-q3',
        type: 'fill_blank',
        prompt: 'In technical terms ending with suffix "-tion" (e.g. automation), primary syllable stress falls on the syllable ______ the suffix.',
        correctAnswer: 'before',
        explanation: 'Words ending in "-tion", "-sion", "-ic" always take primary stress on the immediate preceding syllable (e.g. au-to-MA-tion).'
      },
      {
        id: 'p-q4',
        type: 'mcq',
        prompt: 'Which phonetic symbol represents the unvoiced dental fricative sound in "thread"?',
        options: ['/ð/', '/θ/', '/ʃ/', '/tʃ/'],
        correctAnswer: '/θ/',
        explanation: '/θ/ is the unvoiced dental fricative (thin, thread), whereas /ð/ is voiced (this, father).'
      },
      {
        id: 'p-q5',
        type: 'mcq',
        prompt: 'Where does the primary stress fall in the technical word "ARCHITECTURE"?',
        options: ['1st syllable (AR-chi-tec-ture)', '2nd syllable (ar-CHI-tec-ture)', '3rd syllable (ar-chi-TEC-ture)', '4th syllable (ar-chi-tec-TURE)'],
        correctAnswer: '1st syllable (AR-chi-tec-ture)',
        explanation: 'Architecture is stressed on the first syllable: /ˈɑː.kɪ.tek.tʃər/.'
      }
    ]
  },

  resources: [
    {
      id: 'res-p1',
      title: 'Standard English 44 IPA Phonemes Chart & Guide',
      type: 'reference',
      description: 'Comprehensive technical reference guide detailing 20 vowels and 24 consonants with engineering keyword examples.',
      content: `STANDARD ENGLISH IPA PHONEMES GUIDE (R26 SYLLABUS)

VOWEL SOUNDS (20):
1. /iː/ - beat, cache, receive
2. /ɪ/ - bit, system, syntax
3. /e/ - bed, network, spec
4. /æ/ - RAM, algorithm, stack
5. /ɑː/ - data, father, benchmark
6. /ɒ/ - logic, process, prompt
7. /ɔː/ - port, core, board
8. /ʊ/ - put, push, full
9. /uː/ - boot, loop, execute
10. /ʌ/ - bus, buffer, null
11. /ɜː/ - server, word, search
12. /ə/ - Schwa (computer, driver)

DIPHTHONGS (8):
13. /eɪ/ - array, frame, gateway
14. /aɪ/ - byte, client, driver
15. /ɔɪ/ - voice, point, join
16. /əʊ/ - code, node, flow
17. /aʊ/ - cloud, cloud-native, output
18. /ɪə/ - clear, tear, peer
19. /eə/ - variable, share, parent
20. /ʊə/ - secure, pure, dual

CONSONANTS (24):
Plosives: /p/ /b/ /t/ /d/ /k/ /ɡ/
Fricatives: /f/ /v/ /θ/ /ð/ /s/ /z/ /ʃ/ /ʒ/ /h/
Affricates: /tʃ/ /dʒ/
Nasals: /m/ /n/ /ŋ/
Approximants: /l/ /r/ /j/ /w/`,
      downloadFileName: 'R26_Module01_IPA_Guide.txt'
    },
    {
      id: 'res-p2',
      title: 'Minimal Pairs Audio Drills Worksheet',
      type: 'worksheet',
      description: 'Contrastive drills to eliminate Mother Tongue Influence (MTI) in common technical speech.',
      content: `MINIMAL PAIR CONTRASTIVE DRILLS SHEET

1. /p/ vs /b/:
   - pack vs back
   - port vs board
   - pin vs bin

2. /f/ vs /v/:
   - file vs file
   - fan vs van
   - fast vs vast

3. /s/ vs /z/:
   - sip vs zip
   - price vs prize
   - bus vs buzz

4. /w/ vs /v/:
   - wet vs vet
   - wine vs vine
   - wheel vs veal`
    },
    {
      id: 'res-p3',
      title: 'Syllable Stress Rules for Technical Vocabulary',
      type: 'reading',
      description: 'Quick reference sheet for multi-syllabic engineering vocabulary stress patterns.',
      content: `SYLLABLE STRESS RULES FOR ENGINEERS

Rule 1: Suffix -tion / -sion -> Stress penult (one syllable before suffix)
- au-to-MA-tion
- op-ti-mi-ZA-tion
- con-fi-gu-RA-tion

Rule 2: Suffix -ic / -ical -> Stress penult
- al-go-RITH-mic
- e-LEC-tri-cal
- SYS-te-ma-tic

Rule 3: Suffix -logy / -graphy -> Stress antepenult (two syllables before suffix)
- tech-NO-lo-gy
- mi-cro-bi-O-logy
- cryp-TO-gra-phy`
    }
  ],

  recordWork: {
    title: 'Phonetics & Pronunciation Oral Submissions',
    instructions: 'Record your oral reading of the target technical script or upload audio recordings for AI voice analysis.',
    allowedFormats: ['audio'],
    sampleAudioPrompts: [
      'The search algorithm optimizes cloud memory cache efficiency.',
      'Artificial intelligence enhances automated system performance.',
      'Please verify the client server architecture protocols.'
    ],
    submissionGuidelines: [
      'Ensure background noise is below 30dB.',
      'Maintain an even distance of 10-15 cm from the microphone.',
      'Articulate consonants sharply and maintain natural pause phrasing.'
    ]
  },

  reflectionConfig: {
    title: 'Module 1 Self-Reflection & Phonetic Growth',
    instructions: 'Reflect on your pronunciation progress and MTI reduction strategies.',
    questions: [
      'Which specific English sounds (e.g. /θ/, /v/, /r/) do you find most challenging due to regional language influence?',
      'How does applying primary syllable stress change the clarity of your technical explanations?',
      'What strategies will you use to continue practice outside the language lab?',
      'How confident do you feel when pronouncing new technical terms in front of peers?'
    ],
    rubricFocus: ['Self-awareness of MTI', 'Actionable goal setting', 'Clarity of reflection']
  },

  portfolioConfig: {
    title: 'Phonetics & Pronunciation Artifacts Portfolio',
    artifactCategories: ['Spectrogram Analysis', 'Minimal Pair Audio Recording', 'Phonetic Script Markup'],
    rubricCriteria: ['Acoustic Accuracy (40%)', 'Stress Precision (30%)', 'Fluency & Pacing (30%)']
  },

  statusConfig: {
    targetScore: 90,
    requiredTasks: [
      'Explore 44 IPA Interactive Phoneme Chart',
      'Complete Minimal Pair Audio Recording',
      'Score 75%+ on Knowledge Check',
      'Submit Digital Lab Notebook EXP-01'
    ],
    skillsMastered: ['IPA Decoding', 'MTI Reduction', 'Syllable Stress Rules', 'Acoustic Clarity'],
    recommendations: [
      'Practice minimal pairs /θ/ vs /s/ for 5 minutes daily.',
      'Record technical definitions and compare pitch modulation with native benchmarks.'
    ],
    passingThreshold: 75
  }
};
