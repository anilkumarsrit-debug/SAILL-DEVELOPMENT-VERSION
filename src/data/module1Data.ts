import { ActivityStatus } from '../types';

export interface ArticulatorInfo {
  id: string;
  name: string;
  location: string;
  function: string;
  roleInSpeech: string;
  relevantSounds: string[];
}

export interface PhonemeRecord {
  symbol: string;
  category: 'Monophthong' | 'Diphthong' | 'Consonant';
  subcategory: string; // e.g., 'Long Vowel', 'Short Vowel', 'Plosive', 'Fricative', etc.
  exampleWord: string;
  ipaTranscription: string;
  articulationInfo: string;
  voicing: 'Voiced' | 'Unvoiced' | 'N/A';
  airflow: 'Explosive burst' | 'Friction stream' | 'Nasal stream' | 'Smooth glide' | 'Vowel resonant' | 'Explosive + friction';
  placeOfArticulation?: string;
  mannerOfArticulation?: string;
  exampleSentence: string;
  minimalPairRelationship?: string;
}

export interface MinimalPairItem {
  id: string;
  word1: string;
  word2: string;
  ipa1: string;
  ipa2: string;
  targetContrast: string;
  contrastCategory: string;
  exampleSentence: string;
}

export interface WordStressPracticeItem {
  id: string;
  word: string;
  syllableCount: number;
  syllableBreakdown: string[]; // e.g. ['ed', 'u', 'CA', 'tion']
  primaryStressIndex: number; // 0-indexed
  secondaryStressIndex?: number;
  ipa: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'other';
  ruleExplanation: string;
}

export interface ActivityDefinition {
  id: string;
  stageId: 'DISCOVER' | 'EXPLORE' | 'PRACTISE' | 'PERFORM' | 'ASSESS' | 'REFLECT';
  stageName: string;
  number: number;
  title: string;
  tagline: string;
  icon: string;
  estimatedMinutes: number;
  isRequired: boolean;
  minPassingScore?: number;
  description: string;
  learningObjectives: string[];
  instructions: string;
}

// 1. STAGES AND ACTIVITIES LIST
export const MODULE1_ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'm1-a1',
    stageId: 'DISCOVER',
    stageName: 'Stage 1: Discover',
    number: 1,
    title: 'Why Pronunciation Matters',
    tagline: 'Understand the power of clear articulation in global technical engineering',
    icon: 'Sparkles',
    estimatedMinutes: 10,
    isRequired: true,
    description: 'Explore how clear phonetic articulation prevents miscommunication in international engineering teams, overcomes Mother Tongue Influence (MTI), and builds professional credibility.',
    learningObjectives: [
      'Understand the distinction between regional accent and phonetic intelligibility',
      'Identify common sources of Mother Tongue Influence (MTI) in Indian English context',
      'Recognize the impact of clear pronunciation in technical project reviews and presentations'
    ],
    instructions: 'Read the foundational principles below, review the video/audio case studies, and complete the quick diagnostic self-check.'
  },
  {
    id: 'm1-a2',
    stageId: 'DISCOVER',
    stageName: 'Stage 1: Discover',
    number: 2,
    title: 'How Speech Is Produced',
    tagline: 'Discover the mechanics of human speech generation and the vocal tract',
    icon: 'Activity',
    estimatedMinutes: 12,
    isRequired: true,
    description: 'Examine the physiological process of speech production: respiration in lungs, phonation in vocal folds, resonance in oral/nasal cavities, and articulation with speech organs.',
    learningObjectives: [
      'Trace the path of airflow from lungs to lips during speech production',
      'Distinguish between voiced and voiceless sounds through glottal vocal cord vibration',
      'Understand the role of oral and nasal resonance in producing distinct vowel and consonant phonemes'
    ],
    instructions: 'Study the speech production pathway diagram, listen to voiced vs voiceless audio comparisons, and answer the comprehension checkpoint.'
  },
  {
    id: 'm1-a3',
    stageId: 'EXPLORE',
    stageName: 'Stage 2: Explore',
    number: 3,
    title: 'Articulatory System Laboratory',
    tagline: 'Interactive exploration of the 14 vocal organs and articulators',
    icon: 'Cpu',
    estimatedMinutes: 20,
    isRequired: true,
    minPassingScore: 80,
    description: 'Interact with all 14 speech articulators. Learn their precise anatomical locations, motor functions, and exact roles in forming standard English speech sounds.',
    learningObjectives: [
      'Identify all 14 articulators on the anatomical vocal tract map',
      'Explain active vs passive articulators during sound production',
      'Achieve 80%+ accuracy in the interactive Articulator Identification Challenge'
    ],
    instructions: 'Explore each of the 14 articulators on the interactive diagram. Once all 14 are explored, complete the identification challenge to proceed.'
  },
  {
    id: 'm1-a4',
    stageId: 'EXPLORE',
    stageName: 'Stage 2: Explore',
    number: 4,
    title: 'Guided Practice Studio',
    tagline: '44-Phoneme Explorer & Word Pronunciation Guided Practice Studio',
    icon: 'Sparkles',
    estimatedMinutes: 25,
    isRequired: true,
    description: 'Master the 44 English IPA phonemes through interactive demonstration models (Part A) and apply the 6-step laboratory pronunciation practice drills on multisyllabic engineering vocabulary (Part B).',
    learningObjectives: [
      'Part A: Observe, decode, and compare all 44 IPA phonemes in British (RP) and American (GA) English',
      'Part B: Practice multisyllabic engineering vocabulary using the Listen-Observe-Say-Record-Replay-Improve loop',
      'Self-correct vowel duration, syllable prominence, and consonant articulation before submission'
    ],
    instructions: 'Part A: Explore the 44-phoneme inventory and listen to native audio models. Part B: Complete the pronunciation drills on the practice vocabulary words.'
  },
  {
    id: 'm1-a6',
    stageId: 'PRACTISE',
    stageName: 'Stage 3: Practise',
    number: 5,
    title: 'Minimal Pair Laboratory',
    tagline: 'Train your ears and voice on fine acoustic contrasts',
    icon: 'Sliders',
    estimatedMinutes: 20,
    isRequired: true,
    minPassingScore: 80,
    description: 'Master critical sound contrasts that cause MTI confusion, such as /p/ vs /b/, /f/ vs /v/, /s/ vs /z/, /θ/ vs /ð/, /ʃ/ vs /tʃ/, and /ɪ/ vs /iː/.',
    learningObjectives: [
      'Discriminate minimal pair sound differences with high acoustic accuracy',
      'Produce distinct vocal contrasts between similar consonant and vowel pairs',
      'Achieve at least 80% accuracy in the listening discrimination quiz'
    ],
    instructions: 'Complete the sound-discrimination listening tasks and record your pronunciation for each minimal pair drill.'
  },
  {
    id: 'm1-a7',
    stageId: 'PRACTISE',
    stageName: 'Stage 3: Practise',
    number: 6,
    title: 'Word Stress Laboratory',
    tagline: 'Master syllable stress rules and acoustic prominence',
    icon: 'Flame',
    estimatedMinutes: 20,
    isRequired: true,
    minPassingScore: 80,
    description: 'Learn how primary and secondary stress create rhythm and clarity in English. Understand stress tendencies in two-syllable nouns vs verbs, compound words, and suffix-driven rules (-tion, -ic, -logy).',
    learningObjectives: [
      'Identify syllable boundaries and primary stress placement in multi-syllable words',
      'Demonstrate stress prominence through vowel clarity, duration, pitch, and volume',
      'Achieve 80%+ accuracy on the Word Stress Identification Drill'
    ],
    instructions: 'Study the word stress principles, listen to stressed vs unstressed audio models, and complete the stress pattern identification drill.'
  },
  {
    id: 'm1-a8',
    stageId: 'PRACTISE',
    stageName: 'Stage 3: Practise',
    number: 7,
    title: 'AI Phonemic Transcription Laboratory',
    tagline: 'Generate and decode IPA transcriptions for any English word',
    icon: 'Sparkles',
    estimatedMinutes: 15,
    isRequired: true,
    description: 'Interactive AI transcription generator. Enter any technical word to view its IPA phonemic transcription, syllable structure, stress marks, and weak schwa vowels.',
    learningObjectives: [
      'Convert English orthography into accurate IPA phonemic notation',
      'Analyze weak vowel reductions (schwa /ə/) in unstressed syllables',
      'Switch between RP (British) and GA (American) pronunciation models'
    ],
    instructions: 'Enter technical words into the AI transcription engine. Listen to the AI model, observe the IPA breakdown, and record your voice comparison.'
  },
  {
    id: 'm1-a9',
    stageId: 'PRACTISE',
    stageName: 'Stage 3: Practise',
    number: 8,
    title: 'Connected Speech Practice',
    tagline: 'Word → Phrase → Sentence progression for natural flow',
    icon: 'Radio',
    estimatedMinutes: 15,
    isRequired: true,
    description: 'Build fluency through progressive oral drills moving from isolated words to linked phrases and full declarative/interrogative sentences.',
    learningObjectives: [
      'Apply linking, assimilation, and elision in connected spoken phrases',
      'Maintain appropriate falling tone on statements and rising tone on questions',
      'Record and replay 5 target words, 3 phrases, and 3 sentences'
    ],
    instructions: 'Follow the Word → Phrase → Sentence ladder. Record each item, listen to playback, and confirm completion.'
  },
  {
    id: 'm1-a10',
    stageId: 'PERFORM',
    stageName: 'Stage 4: Perform',
    number: 9,
    title: 'AI Pronunciation Laboratory',
    tagline: 'Real-time AI acoustic analysis and feedback',
    icon: 'Bot',
    estimatedMinutes: 20,
    isRequired: true,
    description: 'Record target technical sentences and receive automated AI evaluation covering target sound clarity, intelligibility, stress placement, and pitch modulation.',
    learningObjectives: [
      'Record technical statements and submit for instant AI evaluation',
      'Interpret AI feedback indicators: Meets Standard, Needs Improvement, Retry Required',
      'Iterate on weak sounds until achieving "Meets Standard" rating'
    ],
    instructions: 'Record the assigned technical prompts. Review the AI feedback panel, apply suggested adjustments, and re-record if needed.'
  },
  {
    id: 'm1-a11',
    stageId: 'PERFORM',
    stageName: 'Stage 4: Perform',
    number: 10,
    title: 'Phonemic Transcription Challenge',
    tagline: 'Transcribe 10 key technical engineering words into IPA',
    icon: 'FileText',
    estimatedMinutes: 15,
    isRequired: true,
    minPassingScore: 80,
    description: 'Test your IPA decoding ability by transcribing 10 multisyllabic engineering terms: education, communication, pronunciation, development, university, technology, important, opportunity, laboratory, examination.',
    learningObjectives: [
      'Accurately transcribe complex multi-syllable technical words into IPA notation',
      'Demonstrate correct placement of primary stress marks (ˈ) and secondary stress marks (ˌ)',
      'Achieve at least 80% transcription accuracy across all 10 challenge words'
    ],
    instructions: 'For each of the 10 target words, enter or select the correct IPA transcription. Submit your challenge once all 10 are completed.'
  },
  {
    id: 'm1-a12',
    stageId: 'PERFORM',
    stageName: 'Stage 4: Perform',
    number: 11,
    title: 'Word Stress Challenge',
    tagline: 'Record and demonstrate stress prominence on 10 technical terms',
    icon: 'Award',
    estimatedMinutes: 20,
    isRequired: true,
    minPassingScore: 80,
    description: 'Demonstrate oral mastery of word stress. Record 10 target technical terms without seeing pre-marked stress indicators, and let AI evaluate syllable prominence.',
    learningObjectives: [
      'Produce distinct primary stress prominence without visual assistance',
      'Maintain clear vowel quality in stressed syllables while shortening unstressed vowels',
      'Achieve at least 80% (8/10 "Meets Standard") on the Word Stress Challenge'
    ],
    instructions: 'Record each of the 10 words. Listen to the AI model after recording, observe AI stress placement analysis, and re-record if required.'
  },
  {
    id: 'm1-a13',
    stageId: 'ASSESS',
    stageName: 'Stage 5: Assess',
    number: 12,
    title: 'Module Knowledge Check',
    tagline: '20-question comprehensive assessment of phonetics theory',
    icon: 'HelpCircle',
    estimatedMinutes: 20,
    isRequired: true,
    minPassingScore: 70,
    description: 'A 20-question randomized test covering Articulation (4), Phonemes (6), Word Stress (5), IPA/Transcription (3), and Minimal Pairs (2).',
    learningObjectives: [
      'Demonstrate comprehensive mastery of Module 1 phonetics and stress theory',
      'Achieve a passing score of 70% or higher',
      'Review attempt history and detailed explanations for any incorrect answers'
    ],
    instructions: 'Answer all 20 multiple-choice, true/false, and fill-in-the-blank questions. Score at least 70% to pass. Unlimited attempts allowed.'
  },
  {
    id: 'm1-a14',
    stageId: 'ASSESS',
    stageName: 'Stage 5: Assess',
    number: 13,
    title: 'Final Pronunciation Assessment',
    tagline: '5-part comprehensive oral examination',
    icon: 'ShieldCheck',
    estimatedMinutes: 25,
    isRequired: true,
    minPassingScore: 70,
    description: 'Comprehensive oral examination comprising Part A: Word Production (20%), Part B: Minimal Pairs (15%), Part C: Word Stress (25%), Part D: Sentence Pronunciation (20%), and Part E: Guided Speaking (20%).',
    learningObjectives: [
      'Perform all 5 assessment sections with high phonetic accuracy and speech rate consistency',
      'Achieve at least 70% total overall score AND at least 60% on Part C (Word Stress)',
      'Submit recorded oral evidence to your Student Portfolio for Faculty review'
    ],
    instructions: 'Complete all 5 parts sequentially. Your audio recordings and answers will be evaluated and archived into your evidence portfolio.'
  },
  {
    id: 'm1-a15',
    stageId: 'REFLECT',
    stageName: 'Stage 6: Reflect',
    number: 14,
    title: 'Reflection & Portfolio',
    tagline: 'Self-reflection and evidence archiving',
    icon: 'PenTool',
    estimatedMinutes: 15,
    isRequired: true,
    description: 'Reflect on your phonetic development, document solved MTI challenges, and save your final pronunciation artifacts to your Student Portfolio.',
    learningObjectives: [
      'Formulate reflective answers on personal pronunciation growth and sound mastery',
      'Identify remaining phonetic target areas for continuous practice',
      'Archive reflection and recording evidence into IndexedDB student portfolio'
    ],
    instructions: 'Answer all 5 reflection prompts thoughtfully. Save your response to finalize Module 1.'
  }
];

// 2. THE 14 ARTICULATORS DATA
export const ARTICULATORS_14: ArticulatorInfo[] = [
  { id: 'art-1', name: 'Lips (Labia)', location: 'Frontmost boundary of oral cavity', function: 'Puckering, rounding, spreading, and bilabial closure', roleInSpeech: 'Produces bilabial plosives (/p/, /b/), nasal (/m/), fricatives (/f/, /v/), and rounded vowels (/uː/, /ɔː/).', relevantSounds: ['/p/', '/b/', '/m/', '/f/', '/v/', '/w/', '/uː/'] },
  { id: 'art-2', name: 'Teeth (Dental)', location: 'Upper and lower incisors', function: 'Passive barrier for tongue tip contact and airflow friction', roleInSpeech: 'Crucial for dental fricatives (/θ/, /ð/) and labiodental fricatives (/f/, /v/).', relevantSounds: ['/θ/', '/ð/', '/f/', '/v/'] },
  { id: 'art-3', name: 'Alveolar Ridge', location: 'Bony ridge behind upper front teeth', function: 'Passive contact point for tongue tip and blade', roleInSpeech: 'Forms alveolar plosives (/t/, /d/), fricatives (/s/, /z/), nasal (/n/), and lateral (/l/).', relevantSounds: ['/t/', '/d/', '/s/', '/z/', '/n/', '/l/'] },
  { id: 'art-4', name: 'Hard Palate', location: 'Bony roof of front oral cavity', function: 'Immovable smooth ceiling for tongue dorsum', roleInSpeech: 'Enables palatal approximant (/j/) and post-alveolar affricates/fricatives (/ʃ/, /ʒ/, /tʃ/, /dʒ/).', relevantSounds: ['/j/', '/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/'] },
  { id: 'art-5', name: 'Soft Palate (Velum)', location: 'Muscular posterior portion of roof of mouth', function: 'Raises to seal nasal cavity (oral sounds) or lowers (nasal sounds)', roleInSpeech: 'Forms velar plosives (/k/, /ɡ/) and velar nasal (/ŋ/). Controls oral vs nasal resonance.', relevantSounds: ['/k/', '/ɡ/', '/ŋ/'] },
  { id: 'art-6', name: 'Uvula', location: 'Flexible fleshy pendant hanging from velum rear', function: 'Acts as posterior boundary marker of velum', roleInSpeech: 'Aids in velic closure sealing during high-pressure oral plosives and fricatives.', relevantSounds: ['/k/', '/ɡ/'] },
  { id: 'art-7', name: 'Tongue Tip (Apex)', location: 'Flexible anterior point of tongue', function: 'High-speed active mover contacting teeth, alveolar ridge, or palate', roleInSpeech: 'Produces /t/, /d/, /θ/, /ð/, /s/, /z/, /n/, /l/, /r/.', relevantSounds: ['/t/', '/d/', '/θ/', '/ð/', '/s/', '/z/', '/n/', '/l/', '/r/'] },
  { id: 'art-8', name: 'Tongue Blade (Lamina)', location: 'Surface area immediately behind tongue tip', function: 'Shapes narrow friction constrictions behind alveolar ridge', roleInSpeech: 'Forms post-alveolar sounds /ʃ/, /ʒ/, /tʃ/, /dʒ/.', relevantSounds: ['/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/'] },
  { id: 'art-9', name: 'Tongue Front', location: 'Main anterior body of tongue below hard palate', function: 'Raises towards hard palate for front vowels and palatal glides', roleInSpeech: 'Crucial for high front vowels (/iː/, /ɪ/, /e/, /æ/) and glide /j/.', relevantSounds: ['/iː/', '/ɪ/', '/e/', '/æ/', '/j/'] },
  { id: 'art-10', name: 'Tongue Back (Dorsum)', location: 'Posterior surface facing soft palate', function: 'Raises against velum for back sounds and back vowels', roleInSpeech: 'Produces velar consonants (/k/, /ɡ/, /ŋ/) and back vowels (/uː/, /ʊ/, /ɔː/, /ɒ/, /ɑː/).', relevantSounds: ['/k/', '/ɡ/', '/ŋ/', '/uː/', '/ɔː/', '/ɑː/'] },
  { id: 'art-11', name: 'Jaw (Mandible)', location: 'Lower moveable facial bone structure', function: 'Controls degree of mouth opening and vertical displacement', roleInSpeech: 'Adjusts oral volume and vowel height (open vowels like /æ/, /ɑː/ vs close vowels like /iː/, /uː/).', relevantSounds: ['/æ/', '/ɑː/', '/ɒ/', '/aɪ/', '/aʊ/'] },
  { id: 'art-12', name: 'Pharynx', location: 'Muscular throat cavity behind oral/nasal passages', function: 'Resonating chamber modifying voice timbre and pitch', roleInSpeech: 'Adds warmth and acoustic depth to vowels and resonant approximants.', relevantSounds: ['/ɑː/', '/ɔː/', '/ɜː/'] },
  { id: 'art-13', name: 'Larynx / Vocal Folds', location: 'Voice box containing twin muscular vocal cords', function: 'Rapid vibration creates fundamental pitch and voicing', roleInSpeech: 'Differentiates all voiced phonemes (vowels, /b/, /d/, /ɡ/, /v/, /z/, /m/, /n/) from unvoiced (/p/, /t/, /k/, /f/, /s/).', relevantSounds: ['All Voiced Phonemes'] },
  { id: 'art-14', name: 'Glottis', location: 'Aperture/space between active vocal cords', function: 'Opens for unvoiced breath stream or closes for glottal stop', roleInSpeech: 'Produces glottal fricative (/h/) and glottal stop sound variations.', relevantSounds: ['/h/'] }
];

// 3. THE 44 PHONEMES COMPLETE DATABASE
export const ALL_44_PHONEMES: PhonemeRecord[] = [
  // 12 Monophthongs
  { symbol: '/iː/', category: 'Monophthong', subcategory: 'Long Vowel', exampleWord: 'beat', ipaTranscription: '/biːt/', articulationInfo: 'Unrounded lips spread wide, tongue front high near hard palate.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'The machine processes clean data in routine tasks.', minimalPairRelationship: 'Contrast with short /ɪ/ (beat /biːt/ vs bit /bɪt/)' },
  { symbol: '/ɪ/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'bit', ipaTranscription: '/bɪt/', articulationInfo: 'Relaxed unrounded lips, tongue slightly lower than for /iː/.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Digital signals process user input.', minimalPairRelationship: 'Contrast with long /iː/ (ship /ʃɪp/ vs sheep /ʃiːp/)' },
  { symbol: '/e/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'bed', ipaTranscription: '/bed/', articulationInfo: 'Medium open lips, tongue mid-front position.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Deploy the vector method across network nodes.', minimalPairRelationship: 'Contrast with /æ/ (bed /bed/ vs bad /bæd/)' },
  { symbol: '/æ/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'cat', ipaTranscription: '/kæt/', articulationInfo: 'Open jaw, tongue low front near bottom teeth.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Stack memory packets inside RAM.', minimalPairRelationship: 'Contrast with /e/ (cat /kæt/ vs cut /kʌt/)' },
  { symbol: '/ɑː/', category: 'Monophthong', subcategory: 'Long Vowel', exampleWord: 'father', ipaTranscription: '/ˈfɑː.ðər/', articulationInfo: 'Jaw wide open, tongue low back in oral floor.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Review system architecture and hardware charts.', minimalPairRelationship: 'Contrast with /ʌ/ (part /pɑːt/ vs pert /pɜːt/)' },
  { symbol: '/ɒ/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'pot', ipaTranscription: '/pɒt/', articulationInfo: 'Slightly rounded open lips, tongue low back.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Verify logic options during processing.', minimalPairRelationship: 'Contrast with /ɔː/ (pot /pɒt/ vs port /pɔːt/)' },
  { symbol: '/ɔː/', category: 'Monophthong', subcategory: 'Long Vowel', exampleWord: 'port', ipaTranscription: '/pɔːt/', articulationInfo: 'Firmly rounded lips into O shape, tongue pulled back.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Restore the source code in the original format.', minimalPairRelationship: 'Contrast with /ɒ/ (cord /kɔːd/ vs cod /kɒd/)' },
  { symbol: '/ʊ/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'put', ipaTranscription: '/pʊt/', articulationInfo: 'Fairly rounded lips, tongue high back position.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Push data until the buffer is full.', minimalPairRelationship: 'Contrast with /uː/ (full /fʊl/ vs fool /fuːl/)' },
  { symbol: '/uː/', category: 'Monophthong', subcategory: 'Long Vowel', exampleWord: 'boot', ipaTranscription: '/buːt/', articulationInfo: 'Tightly puckered rounded lips, tongue high back.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Execute the recursive loop routine.', minimalPairRelationship: 'Contrast with /ʊ/ (look /lʊk/ vs Luke /luːk/)' },
  { symbol: '/ʌ/', category: 'Monophthong', subcategory: 'Short Vowel', exampleWord: 'cup', ipaTranscription: '/kʌp/', articulationInfo: 'Neutral open mouth, tongue mid-low central.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'The cluster bus handled null queries.', minimalPairRelationship: 'Contrast with /æ/ (cup /kʌp/ vs cap /kæp/)' },
  { symbol: '/ɜː/', category: 'Monophthong', subcategory: 'Long Vowel', exampleWord: 'bird', ipaTranscription: '/bɜːd/', articulationInfo: 'Neutral lips, tongue held flat in central mouth.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Convert data types inside the server kernel.', minimalPairRelationship: 'Contrast with /ə/ in stressed position' },
  { symbol: '/ə/', category: 'Monophthong', subcategory: 'Schwa (Neutral)', exampleWord: 'about', ipaTranscription: '/əˈbaʊt/', articulationInfo: 'Completely relaxed neutral jaw and lips. Most common unstressed vowel.', voicing: 'Voiced', airflow: 'Vowel resonant', exampleSentence: 'Run the search algorithm across system data.', minimalPairRelationship: 'Unstressed central vowel reduction' },

  // 8 Diphthongs
  { symbol: '/eɪ/', category: 'Diphthong', subcategory: 'Fronting Glide', exampleWord: 'array', ipaTranscription: '/əˈreɪ/', articulationInfo: 'Glides smoothly from mid-open /e/ up towards close front /ɪ/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Save array state in the relational database.', minimalPairRelationship: '/eɪ/ vs /e/ (late /leɪt/ vs let /let/)' },
  { symbol: '/aɪ/', category: 'Diphthong', subcategory: 'Fronting Glide', exampleWord: 'byte', ipaTranscription: '/baɪt/', articulationInfo: 'Glides from open central /a/ up towards close /ɪ/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Compile the byte stream in the build pipeline.', minimalPairRelationship: '/aɪ/ vs /aʊ/ (bite /baɪt/ vs bout /baʊt/)' },
  { symbol: '/ɔɪ/', category: 'Diphthong', subcategory: 'Fronting Glide', exampleWord: 'voice', ipaTranscription: '/vɔɪs/', articulationInfo: 'Glides from rounded back /ɔː/ towards unrounded front /ɪ/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Deploy voice recognition pointer events.', minimalPairRelationship: '/ɔɪ/ vs /aɪ/ (boy /bɔɪ/ vs buy /baɪ/)' },
  { symbol: '/əʊ/', category: 'Diphthong', subcategory: 'Rounding Glide', exampleWord: 'code', ipaTranscription: '/kəʊd/', articulationInfo: 'Glides from neutral schwa /ə/ to rounded back /ʊ/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Write modular code for every node protocol.', minimalPairRelationship: '/əʊ/ vs /ɔː/ (code /kəʊd/ vs cord /kɔːd/)' },
  { symbol: '/aʊ/', category: 'Diphthong', subcategory: 'Rounding Glide', exampleWord: 'cloud', ipaTranscription: '/klaʊd/', articulationInfo: 'Glides from open /a/ up towards rounded back /ʊ/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Monitor outbound traffic from cloud nodes.', minimalPairRelationship: '/aʊ/ vs /əʊ/ (loud /laʊd/ vs load /ləʊd/)' },
  { symbol: '/ɪə/', category: 'Diphthong', subcategory: 'Centering Glide', exampleWord: 'clear', ipaTranscription: '/klɪə/', articulationInfo: 'Glides from high front /ɪ/ down towards central schwa /ə/ (Non-rhotic RP).', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Clear cache buffers during peak period.', minimalPairRelationship: 'Varies between RP /ɪə/ and GA /ɪr/' },
  { symbol: '/eə/', category: 'Diphthong', subcategory: 'Centering Glide', exampleWord: 'variable', ipaTranscription: '/ˈveə.ri.ə.bəl/', articulationInfo: 'Glides from mid-front /e/ down towards schwa /ə/ (Non-rhotic RP).', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Declare global variable parameters.', minimalPairRelationship: 'Varies between RP /eə/ and GA /er/' },
  { symbol: '/ʊə/', category: 'Diphthong', subcategory: 'Centering Glide', exampleWord: 'secure', ipaTranscription: '/sɪˈkjʊə/', articulationInfo: 'Glides from close back /ʊ/ down towards central schwa /ə/.', voicing: 'Voiced', airflow: 'Smooth glide', exampleSentence: 'Ensure dual secure socket encryption.', minimalPairRelationship: 'Varies between RP /ʊə/ and GA /ʊr/ or /ɔː/' },

  // 24 Consonants
  // Plosives (6)
  { symbol: '/p/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'packet', ipaTranscription: '/ˈpæk.ɪt/', articulationInfo: 'Unvoiced bilabial stop: press both lips, sudden unvoiced burst.', voicing: 'Unvoiced', airflow: 'Explosive burst', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Plosive', exampleSentence: 'Process the port packet program.', minimalPairRelationship: '/p/ vs /b/ (pack /pæk/ vs back /bæk/)' },
  { symbol: '/b/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'buffer', ipaTranscription: '/ˈbʌf.ər/', articulationInfo: 'Voiced bilabial stop: press both lips, voiced air burst.', voicing: 'Voiced', airflow: 'Explosive burst', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Plosive', exampleSentence: 'Buffer binary byte transfers.', minimalPairRelationship: '/b/ vs /p/ (bin /bɪn/ vs pin /pɪn/)' },
  { symbol: '/t/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'terminal', ipaTranscription: '/ˈtɜː.mɪ.nəl/', articulationInfo: 'Unvoiced alveolar stop: tongue tip on alveolar ridge, unvoiced burst.', voicing: 'Unvoiced', airflow: 'Explosive burst', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Plosive', exampleSentence: 'Terminal thread table active.', minimalPairRelationship: '/t/ vs /d/ (time /taɪm/ vs dime /daɪm/)' },
  { symbol: '/d/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'database', ipaTranscription: '/ˈdeɪ.tə.beɪs/', articulationInfo: 'Voiced alveolar stop: tongue tip on alveolar ridge, voiced burst.', voicing: 'Voiced', airflow: 'Explosive burst', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Plosive', exampleSentence: 'Database driver initializes data.', minimalPairRelationship: '/d/ vs /t/ (door /dɔː/ vs tour /tʊə/)' },
  { symbol: '/k/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'kernel', ipaTranscription: '/ˈkɜː.nəl/', articulationInfo: 'Unvoiced velar stop: back of tongue against soft palate, unvoiced burst.', voicing: 'Unvoiced', airflow: 'Explosive burst', placeOfArticulation: 'Velar', mannerOfArticulation: 'Plosive', exampleSentence: 'Cache key kernel memory.', minimalPairRelationship: '/k/ vs /ɡ/ (coat /kəʊt/ vs goat /ɡəʊt/)' },
  { symbol: '/ɡ/', category: 'Consonant', subcategory: 'Plosive', exampleWord: 'gateway', ipaTranscription: '/ˈɡeɪt.weɪ/', articulationInfo: 'Voiced velar stop: back of tongue against soft palate, voiced burst.', voicing: 'Voiced', airflow: 'Explosive burst', placeOfArticulation: 'Velar', mannerOfArticulation: 'Plosive', exampleSentence: 'Git gateway graph group.', minimalPairRelationship: '/ɡ/ vs /k/ (gate /ɡeɪt/ vs kate /keɪt/)' },

  // Fricatives (9)
  { symbol: '/f/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'function', ipaTranscription: '/ˈfʌŋk.ʃən/', articulationInfo: 'Unvoiced labiodental: upper teeth gently touch lower lip, continuous air.', voicing: 'Unvoiced', airflow: 'Friction stream', placeOfArticulation: 'Labiodental', mannerOfArticulation: 'Fricative', exampleSentence: 'Function file field format.', minimalPairRelationship: '/f/ vs /v/ (fan /fæn/ vs van /væn/)' },
  { symbol: '/v/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'variable', ipaTranscription: '/ˈveə.ri.ə.bəl/', articulationInfo: 'Voiced labiodental: upper teeth gently touch lower lip with vocal vibration.', voicing: 'Voiced', airflow: 'Friction stream', placeOfArticulation: 'Labiodental', mannerOfArticulation: 'Fricative', exampleSentence: 'Variable vector version verified.', minimalPairRelationship: '/v/ vs /w/ (vet /vet/ vs wet /wet/)' },
  { symbol: '/θ/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'thread', ipaTranscription: '/θred/', articulationInfo: 'Unvoiced dental: tongue tip between upper and lower front teeth, push air.', voicing: 'Unvoiced', airflow: 'Friction stream', placeOfArticulation: 'Dental', mannerOfArticulation: 'Fricative', exampleSentence: 'Thread throughput thesis.', minimalPairRelationship: '/θ/ vs /ð/ (thin /θɪn/ vs this /ðɪs/)' },
  { symbol: '/ð/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'this', ipaTranscription: '/ðɪs/', articulationInfo: 'Voiced dental: tongue tip between teeth with vocal cord vibration.', voicing: 'Voiced', airflow: 'Friction stream', placeOfArticulation: 'Dental', mannerOfArticulation: 'Fricative', exampleSentence: 'This database handles that query.', minimalPairRelationship: '/ð/ vs /d/ (then /ðen/ vs den /den/)' },
  { symbol: '/s/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'syntax', ipaTranscription: '/ˈsɪn.tæks/', articulationInfo: 'Unvoiced alveolar hiss: teeth close together, unvoiced airstream across ridge.', voicing: 'Unvoiced', airflow: 'Friction stream', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Fricative', exampleSentence: 'Syntax system server check.', minimalPairRelationship: '/s/ vs /z/ (sip /sɪp/ vs zip /zɪp/)' },
  { symbol: '/z/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'zero', ipaTranscription: '/ˈzɪə.rəʊ/', articulationInfo: 'Voiced alveolar buzz: teeth close together, voiced vocal cords.', voicing: 'Voiced', airflow: 'Friction stream', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Fricative', exampleSentence: 'Zero zone optimize zipper.', minimalPairRelationship: '/z/ vs /s/ (buzz /bʌz/ vs bus /bʌs/)' },
  { symbol: '/ʃ/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'schema', ipaTranscription: '/ˈskiː.mə/', articulationInfo: 'Unvoiced post-alveolar: tongue blade raised behind alveolar ridge, flared lips.', voicing: 'Unvoiced', airflow: 'Friction stream', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Fricative', exampleSentence: 'Shell schema shortcut key.', minimalPairRelationship: '/ʃ/ vs /tʃ/ (ship /ʃɪp/ vs chip /tʃɪp/)' },
  { symbol: '/ʒ/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'version', ipaTranscription: '/ˈvɜː.ʃən/', articulationInfo: 'Voiced post-alveolar: same position as /ʃ/ with vocal cord vibration.', voicing: 'Voiced', airflow: 'Friction stream', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Fricative', exampleSentence: 'Decision closure version release.', minimalPairRelationship: '/ʒ/ vs /dʒ/ (measure /ˈmeʒ.ər/ vs major /ˈmeɪ.dʒər/)' },
  { symbol: '/h/', category: 'Consonant', subcategory: 'Fricative', exampleWord: 'header', ipaTranscription: '/ˈhed.ər/', articulationInfo: 'Unvoiced glottal: open glottis exhaling gentle breath from throat.', voicing: 'Unvoiced', airflow: 'Friction stream', placeOfArticulation: 'Glottal', mannerOfArticulation: 'Fricative', exampleSentence: 'Header hash heap table.', minimalPairRelationship: '/h/ vs vowel onset (hat /hæt/ vs at /æt/)' },

  // Affricates (2)
  { symbol: '/tʃ/', category: 'Consonant', subcategory: 'Affricate', exampleWord: 'checksum', ipaTranscription: '/ˈtʃek.sʌm/', articulationInfo: 'Unvoiced affricate: plosive stop /t/ immediately releasing into fricative /ʃ/.', voicing: 'Unvoiced', airflow: 'Explosive + friction', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Affricate', exampleSentence: 'Checksum chart chunk size.', minimalPairRelationship: '/tʃ/ vs /dʒ/ (cheap /tʃiːp/ vs jeep /dʒiːp/)' },
  { symbol: '/dʒ/', category: 'Consonant', subcategory: 'Affricate', exampleWord: 'JSON', ipaTranscription: '/ˈdʒeɪ.sən/', articulationInfo: 'Voiced affricate: voiced stop /d/ releasing into voiced fricative /ʒ/.', voicing: 'Voiced', airflow: 'Explosive + friction', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Affricate', exampleSentence: 'JSON Java job queue.', minimalPairRelationship: '/dʒ/ vs /tʃ/ (joke /dʒəʊk/ vs choke /tʃəʊk/)' },

  // Nasals (3)
  { symbol: '/m/', category: 'Consonant', subcategory: 'Nasal', exampleWord: 'memory', ipaTranscription: '/ˈmem.ər.i/', articulationInfo: 'Voiced bilabial nasal: close lips, lower soft palate, send sound out through nose.', voicing: 'Voiced', airflow: 'Nasal stream', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Nasal', exampleSentence: 'Memory method module loaded.', minimalPairRelationship: '/m/ vs /n/ (sum /sʌm/ vs sun /sʌn/)' },
  { symbol: '/n/', category: 'Consonant', subcategory: 'Nasal', exampleWord: 'network', ipaTranscription: '/ˈnet.wɜːk/', articulationInfo: 'Voiced alveolar nasal: tongue tip on alveolar ridge, air exits through nose.', voicing: 'Voiced', airflow: 'Nasal stream', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Nasal', exampleSentence: 'Node network null check.', minimalPairRelationship: '/n/ vs /ŋ/ (sin /sɪn/ vs sing /sɪŋ/)' },
  { symbol: '/ŋ/', category: 'Consonant', subcategory: 'Nasal', exampleWord: 'ping', ipaTranscription: '/pɪŋ/', articulationInfo: 'Voiced velar nasal: back of tongue seals against soft palate, sound exits nose.', voicing: 'Voiced', airflow: 'Nasal stream', placeOfArticulation: 'Velar', mannerOfArticulation: 'Nasal', exampleSentence: 'Ping string encoding active.', minimalPairRelationship: '/ŋ/ vs /n/ (sing /sɪŋ/ vs sin /sɪn/)' },

  // Approximants (4)
  { symbol: '/l/', category: 'Consonant', subcategory: 'Approximant', exampleWord: 'logic', ipaTranscription: '/ˈlɒdʒ.ɪk/', articulationInfo: 'Voiced alveolar lateral: tongue tip touches alveolar ridge, air passes sides.', voicing: 'Voiced', airflow: 'Smooth glide', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Lateral Approximant', exampleSentence: 'Logic library loop check.', minimalPairRelationship: '/l/ vs /r/ (light /laɪt/ vs right /raɪt/)' },
  { symbol: '/r/', category: 'Consonant', subcategory: 'Approximant', exampleWord: 'runtime', ipaTranscription: '/ˈrʌn.taɪm/', articulationInfo: 'Voiced post-alveolar approximant: curl tongue tip back without touching palate.', voicing: 'Voiced', airflow: 'Smooth glide', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Approximant', exampleSentence: 'Route runtime recursive function.', minimalPairRelationship: '/r/ vs /l/ (red /red/ vs led /led/)' },
  { symbol: '/j/', category: 'Consonant', subcategory: 'Approximant', exampleWord: 'yield', ipaTranscription: '/jiːld/', articulationInfo: 'Voiced palatal approximant: middle of tongue raises near hard palate, glides rapidly.', voicing: 'Voiced', airflow: 'Smooth glide', placeOfArticulation: 'Palatal', mannerOfArticulation: 'Approximant', exampleSentence: 'Yield utility user session.', minimalPairRelationship: '/j/ vs vowel onset (year /jɪə/ vs ear /ɪə/)' },
  { symbol: '/w/', category: 'Consonant', subcategory: 'Approximant', exampleWord: 'worker', ipaTranscription: '/ˈwɜː.kər/', articulationInfo: 'Voiced labial-velar approximant: round lips tightly, raise back of tongue, glide out.', voicing: 'Voiced', airflow: 'Smooth glide', placeOfArticulation: 'Labial-velar', mannerOfArticulation: 'Approximant', exampleSentence: 'Web wireframe worker thread.', minimalPairRelationship: '/w/ vs /v/ (west /west/ vs vest /vest/)' }
];

// 4. MINIMAL PAIR DRILLS (10 STANDARD CONTRASTS)
export const MINIMAL_PAIRS_LIST: MinimalPairItem[] = [
  { id: 'mp-1', word1: 'ship', word2: 'sheep', ipa1: '/ʃɪp/', ipa2: '/ʃiːp/', targetContrast: '/ɪ/ vs /iː/', contrastCategory: 'Short /ɪ/ vs Long /iː/ Vowel', exampleSentence: 'The cargo ship delivered sheep monitoring hardware.' },
  { id: 'mp-2', word1: 'fan', word2: 'van', ipa1: '/fæn/', ipa2: '/væn/', targetContrast: '/f/ vs /v/', contrastCategory: 'Unvoiced vs Voiced Labiodental Fricative', exampleSentence: 'The cooling fan inside the delivery van worked efficiently.' },
  { id: 'mp-3', word1: 'sip', word2: 'zip', ipa1: '/sɪp/', ipa2: '/zɪp/', targetContrast: '/s/ vs /z/', contrastCategory: 'Unvoiced vs Voiced Alveolar Hiss', exampleSentence: 'Take a sip while compressing the zip file.' },
  { id: 'mp-4', word1: 'thin', word2: 'tin', ipa1: '/θɪn/', ipa2: '/tɪn/', targetContrast: '/θ/ vs /t/', contrastCategory: 'Dental Fricative /θ/ vs Alveolar Plosive /t/', exampleSentence: 'The thin metal plate was made of tin alloy.' },
  { id: 'mp-5', word1: 'ship', word2: 'chip', ipa1: '/ʃɪp/', ipa2: '/tʃɪp/', targetContrast: '/ʃ/ vs /tʃ/', contrastCategory: 'Post-alveolar Fricative /ʃ/ vs Affricate /tʃ/', exampleSentence: 'We shipped the semiconductor chip to the lab.' },
  { id: 'mp-6', word1: 'bit', word2: 'beat', ipa1: '/bɪt/', ipa2: '/biːt/', targetContrast: '/ɪ/ vs /iː/', contrastCategory: 'Short Vowel Lax /ɪ/ vs Tense Long /iː/', exampleSentence: 'Every bit of data helps beat the latency benchmark.' },
  { id: 'mp-7', word1: 'full', word2: 'fool', ipa1: '/fʊl/', ipa2: '/fuːl/', targetContrast: '/ʊ/ vs /uː/', contrastCategory: 'Short /ʊ/ vs Long /uː/', exampleSentence: 'Do not be fooled when the memory buffer is full.' },
  { id: 'mp-8', word1: 'coat', word2: 'goat', ipa1: '/kəʊt/', ipa2: '/ɡəʊt/', targetContrast: '/k/ vs /ɡ/', contrastCategory: 'Unvoiced vs Voiced Velar Plosive', exampleSentence: 'He wore a coat while walking near the mountain goat.' },
  { id: 'mp-9', word1: 'cheap', word2: 'jeep', ipa1: '/tʃiːp/', ipa2: '/dʒiːp/', targetContrast: '/tʃ/ vs /dʒ/', contrastCategory: 'Unvoiced /tʃ/ vs Voiced /dʒ/ Affricate', exampleSentence: 'The field engineers rented a cheap jeep for site inspection.' },
  { id: 'mp-10', word1: 'sing', word2: 'sin', ipa1: '/sɪŋ/', ipa2: '/sɪn/', targetContrast: '/ŋ/ vs /n/', contrastCategory: 'Velar Nasal /ŋ/ vs Alveolar Nasal /n/', exampleSentence: 'Do not mix up the ping signal with an active sin function.' }
];

// 5. WORD STRESS PRACTICE ITEMS
export const WORD_STRESS_ITEMS: WordStressPracticeItem[] = [
  { id: 'ws-1', word: 'TAble', syllableCount: 2, syllableBreakdown: ['TA', 'ble'], primaryStressIndex: 0, ipa: '/ˈteɪ.bəl/', partOfSpeech: 'noun', ruleExplanation: 'Two-syllable nouns usually take primary stress on the 1st syllable.' },
  { id: 'ws-2', word: 'DOCtor', syllableCount: 2, syllableBreakdown: ['DOC', 'tor'], primaryStressIndex: 0, ipa: '/ˈdɒk.tər/', partOfSpeech: 'noun', ruleExplanation: 'Two-syllable nouns usually take primary stress on the 1st syllable.' },
  { id: 'ws-3', word: 'HAPpy', syllableCount: 2, syllableBreakdown: ['HAP', 'py'], primaryStressIndex: 0, ipa: '/ˈhæp.i/', partOfSpeech: 'adjective', ruleExplanation: 'Two-syllable adjectives usually take primary stress on the 1st syllable.' },
  { id: 'ws-4', word: 'reLAX', syllableCount: 2, syllableBreakdown: ['re', 'LAX'], primaryStressIndex: 1, ipa: '/rɪˈlæks/', partOfSpeech: 'verb', ruleExplanation: 'Two-syllable verbs often take primary stress on the 2nd syllable.' },
  { id: 'ws-5', word: 'beGIN', syllableCount: 2, syllableBreakdown: ['be', 'GIN'], primaryStressIndex: 1, ipa: '/bɪˈɡɪn/', partOfSpeech: 'verb', ruleExplanation: 'Two-syllable verbs often take primary stress on the 2nd syllable.' },
  { id: 'ws-6', word: 'deCIDE', syllableCount: 2, syllableBreakdown: ['de', 'CIDE'], primaryStressIndex: 1, ipa: '/dɪˈsaɪd/', partOfSpeech: 'verb', ruleExplanation: 'Two-syllable verbs often take primary stress on the 2nd syllable.' },
  { id: 'ws-7', word: 'rePLY', syllableCount: 2, syllableBreakdown: ['re', 'PLY'], primaryStressIndex: 1, ipa: '/rɪˈplaɪ/', partOfSpeech: 'verb', ruleExplanation: 'Two-syllable verbs often take primary stress on the 2nd syllable.' },
  { id: 'ws-8', word: 'eduCAtion', syllableCount: 4, syllableBreakdown: ['ed', 'u', 'CA', 'tion'], primaryStressIndex: 2, secondaryStressIndex: 0, ipa: '/ˌedʒ.ʊˈkeɪ.ʃən/', partOfSpeech: 'noun', ruleExplanation: 'Words ending in -tion take primary stress on the syllable immediately preceding the suffix.' },
  { id: 'ws-9', word: 'phoNEtic', syllableCount: 3, syllableBreakdown: ['pho', 'NET', 'ic'], primaryStressIndex: 1, ipa: '/fəˈnet.ɪk/', partOfSpeech: 'adjective', ruleExplanation: 'Words ending in -ic or -ical take primary stress on the syllable immediately preceding the suffix.' },
  { id: 'ws-10', word: 'elecTRIcity', syllableCount: 5, syllableBreakdown: ['e', 'lec', 'TRI', 'ci', 'ty'], primaryStressIndex: 2, secondaryStressIndex: 0, ipa: '/ɪˌlekˈtrɪs.ə.ti/', partOfSpeech: 'noun', ruleExplanation: 'Words ending in -city take primary stress on the antepenultimate or preceding syllable.' }
];

// 6. THE 10 TARGET CHALLENGE WORDS FOR TRANSCRIPTION & STRESS
export const CHALLENGE_10_WORDS = [
  { id: 'ch-1', word: 'education', ipaRP: '/ˌedʒ.ʊˈkeɪ.ʃən/', ipaGA: '/ˌedʒ.əˈkeɪ.ʃən/', syllableCount: 4, primaryStressIndex: 2, stressedSyllable: 'CA' },
  { id: 'ch-2', word: 'communication', ipaRP: '/kəˌmjuː.nɪˈkeɪ.ʃən/', ipaGA: '/kəˌmjuː.nəˈkeɪ.ʃən/', syllableCount: 5, primaryStressIndex: 3, stressedSyllable: 'CA' },
  { id: 'ch-3', word: 'pronunciation', ipaRP: '/prəˌnʌn.siˈeɪ.ʃən/', ipaGA: '/prəˌnʌn.siˈeɪ.ʃən/', syllableCount: 5, primaryStressIndex: 3, stressedSyllable: 'A' },
  { id: 'ch-4', word: 'development', ipaRP: '/dɪˈvel.əp.mənt/', ipaGA: '/dɪˈvel.əp.mənt/', syllableCount: 4, primaryStressIndex: 1, stressedSyllable: 'VEL' },
  { id: 'ch-5', word: 'university', ipaRP: '/ˌjuː.nɪˈvɜː.sə.ti/', ipaGA: '/ˌjuː.nəˈvɜːr.sə.t̬i/', syllableCount: 5, primaryStressIndex: 2, stressedSyllable: 'VER' },
  { id: 'ch-6', word: 'technology', ipaRP: '/tekˈnɒl.ə.dʒi/', ipaGA: '/tekˈnɑː.lə.dʒi/', syllableCount: 4, primaryStressIndex: 1, stressedSyllable: 'NOL' },
  { id: 'ch-7', word: 'important', ipaRP: '/ɪmˈpɔː.tənt/', ipaGA: '/ɪmˈpɔːr.tənt/', syllableCount: 3, primaryStressIndex: 1, stressedSyllable: 'POR' },
  { id: 'ch-8', word: 'opportunity', ipaRP: '/ˌɒp.əˈtjuː.nə.ti/', ipaGA: '/ˌɑː.pɚˈtuː.nə.t̬i/', syllableCount: 5, primaryStressIndex: 3, stressedSyllable: 'TU' },
  { id: 'ch-9', word: 'laboratory', ipaRP: '/ləˈbɒr.ə.tr̩i/', ipaGA: '/ˈlæb.rə.tɔːr.i/', syllableCount: 5, primaryStressIndex: 1, stressedSyllable: 'BOR' },
  { id: 'ch-10', word: 'examination', ipaRP: '/ɪɡˌzæm.ɪˈneɪ.ʃən/', ipaGA: '/ɪɡˌzæm.əˈneɪ.ʃən/', syllableCount: 5, primaryStressIndex: 3, stressedSyllable: 'NA' }
];

// 7. 20-QUESTION RANDOMIZED KNOWLEDGE CHECK QUESTION BANK
export const KNOWLEDGE_CHECK_20_QUESTIONS = [
  // Articulation (4)
  {
    id: 'kc-1',
    category: 'Articulation',
    type: 'mcq',
    prompt: 'Which vocal organs are involved in producing the labiodental fricative sounds /f/ and /v/?',
    options: ['Upper and lower lips', 'Upper teeth and lower lip', 'Tongue tip and alveolar ridge', 'Tongue back and soft palate'],
    correctAnswer: 'Upper teeth and lower lip',
    explanation: 'Labiodental fricatives (/f/, /v/) are articulated by placing the upper incisors gently against the lower lip.'
  },
  {
    id: 'kc-2',
    category: 'Articulation',
    type: 'mcq',
    prompt: 'What happens to the velum (soft palate) when producing a nasal consonant such as /m/ or /n/?',
    options: ['It raises to block the nasal cavity', 'It lowers to allow air to pass through the nasal cavity', 'It vibrates rapidly against the tongue', 'It remains completely stationary'],
    correctAnswer: 'It lowers to allow air to pass through the nasal cavity',
    explanation: 'The velum lowers during nasal sounds (/m/, /n/, /ŋ/) to direct the voiced airstream through the nasal cavity.'
  },
  {
    id: 'kc-3',
    category: 'Articulation',
    type: 'true_false',
    prompt: 'True or False: The difference between voiced sounds (e.g. /z/) and voiceless sounds (e.g. /s/) is vocal cord vibration in the larynx.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'True. Voiced phonemes involve active vocal cord vibration in the larynx, whereas voiceless phonemes pass unvoiced air.'
  },
  {
    id: 'kc-4',
    category: 'Articulation',
    type: 'mcq',
    prompt: 'Which articulator is considered active when producing alveolar plosives /t/ and /d/?',
    options: ['Hard palate', 'Tongue tip', 'Lower teeth', 'Soft palate'],
    correctAnswer: 'Tongue tip',
    explanation: 'The tongue tip is the active articulator moving upwards to touch the passive alveolar ridge.'
  },

  // Phonemes (6)
  {
    id: 'kc-5',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'How many total phonemes exist in standard Received Pronunciation (RP) English?',
    options: ['26 phonemes', '32 phonemes', '44 phonemes', '52 phonemes'],
    correctAnswer: '44 phonemes',
    explanation: 'English has 44 phonemes: 20 vowels (12 monophthongs + 8 diphthongs) and 24 consonants.'
  },
  {
    id: 'kc-6',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'Which of the following IPA symbols represents a pure long vowel sound?',
    options: ['/ɪ/', '/iː/', '/eɪ/', '/ə/'],
    correctAnswer: '/iː/',
    explanation: '/iː/ (as in "beat") is a long monophthong pure vowel.'
  },
  {
    id: 'kc-7',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'What defines a diphthong vowel phoneme?',
    options: ['A single static vowel sound', 'A gliding movement from one vowel quality to another within a single syllable', 'A combination of two consonant stops', 'An unvoiced nasal resonance'],
    correctAnswer: 'A gliding movement from one vowel quality to another within a single syllable',
    explanation: 'Diphthongs are gliding vowels (/eɪ/, /aɪ/, /ɔɪ/, /əʊ/, /aʊ/, /ɪə/, /eə/, /ʊə/).'
  },
  {
    id: 'kc-8',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'Which symbol represents the unvoiced dental fricative in the technical term "thread"?',
    options: ['/ð/', '/θ/', '/ʃ/', '/s/'],
    correctAnswer: '/θ/',
    explanation: '/θ/ is the unvoiced dental fricative (thin, thread). /ð/ is voiced (this, that).'
  },
  {
    id: 'kc-9',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'What is the most common unstressed central vowel sound in the English language called?',
    options: ['Glottal stop', 'Schwa (/ə/)', 'Diphthong', 'Plosive burst'],
    correctAnswer: 'Schwa (/ə/)',
    explanation: 'The schwa (/ə/) is the neutral, relaxed vowel found in unstressed syllables (e.g., algorithm /ˈæl.ɡə.rɪ.ðəm/).'
  },
  {
    id: 'kc-10',
    category: 'Phonemes',
    type: 'mcq',
    prompt: 'Which consonant category includes explosive release of built-up air pressure (/p/, /b/, /t/, /d/, /k/, /ɡ/)?',
    options: ['Fricatives', 'Plosives', 'Nasals', 'Approximants'],
    correctAnswer: 'Plosives',
    explanation: 'Plosives (stops) involve complete oral closure followed by an explosive burst of air.'
  },

  // Word Stress (5)
  {
    id: 'kc-11',
    category: 'Word Stress',
    type: 'mcq',
    prompt: 'Where does primary syllable stress usually fall in English words ending with the suffix "-tion" (e.g., automation)?',
    options: ['On the first syllable', 'On the suffix itself', 'On the syllable immediately preceding the suffix', 'On the final syllable'],
    correctAnswer: 'On the syllable immediately preceding the suffix',
    explanation: 'Words ending in "-tion", "-sion", and "-ic" take primary stress on the immediate preceding syllable (au-to-MA-tion).'
  },
  {
    id: 'kc-12',
    category: 'Word Stress',
    type: 'mcq',
    prompt: 'How does a speaker acoustic prominence manifest on a stressed syllable in English?',
    options: ['Loudness alone', 'A combination of vowel clarity, longer duration, pitch prominence, and volume', 'Whispering the syllable', 'Dropping the pitch dramatically'],
    correctAnswer: 'A combination of vowel clarity, longer duration, pitch prominence, and volume',
    explanation: 'Stressed syllables are prominent through full vowel quality, extended duration, pitch change, and loudness.'
  },
  {
    id: 'kc-13',
    category: 'Word Stress',
    type: 'mcq',
    prompt: 'What is the general tendency for primary stress placement in two-syllable English nouns vs verbs?',
    options: ['Nouns stress 2nd syllable; Verbs stress 1st syllable', 'Nouns stress 1st syllable; Verbs tend to stress 2nd syllable', 'Both always stress the 2nd syllable', 'No pattern exists'],
    correctAnswer: 'Nouns stress 1st syllable; Verbs tend to stress 2nd syllable',
    explanation: 'Common two-syllable nouns tend to stress the 1st syllable (DOCtor), while verbs tend to stress the 2nd (reLAX).'
  },
  {
    id: 'kc-14',
    category: 'Word Stress',
    type: 'mcq',
    prompt: 'Where does primary stress fall in the word "architecture"?',
    options: ['1st syllable (AR-chi-tec-ture)', '2nd syllable (ar-CHI-tec-ture)', '3rd syllable (ar-chi-TEC-ture)', '4th syllable (ar-chi-tec-TURE)'],
    correctAnswer: '1st syllable (AR-chi-tec-ture)',
    explanation: 'Architecture is stressed on the first syllable: /ˈɑː.kɪ.tek.tʃər/.'
  },
  {
    id: 'kc-15',
    category: 'Word Stress',
    type: 'mcq',
    prompt: 'Where does primary stress fall in the technical adjective "algorithmic"?',
    options: ['1st syllable (AL-go-rith-mic)', '2nd syllable (al-GO-rith-mic)', '3rd syllable (al-go-RITH-mic)', '4th syllable (al-go-rith-MIC)'],
    correctAnswer: '3rd syllable (al-go-RITH-mic)',
    explanation: 'Words ending in -ic take primary stress on the syllable before suffix: /ˌæl.ɡəˈrɪð.mɪk/.'
  },

  // IPA / Transcription (3)
  {
    id: 'kc-16',
    category: 'IPA / Transcription',
    type: 'mcq',
    prompt: 'In IPA transcription, what does the high vertical tick symbol (ˈ) placed before a syllable represent?',
    options: ['Secondary stress', 'Primary stress', 'Glottal stop', 'Rising pitch'],
    correctAnswer: 'Primary stress',
    explanation: 'The high tick (ˈ) denotes primary stress (e.g. /ˈmʌn.i/). A low tick (ˌ) denotes secondary stress.'
  },
  {
    id: 'kc-17',
    category: 'IPA / Transcription',
    type: 'mcq',
    prompt: 'Which IPA transcription correctly represents the word "computer"?',
    options: ['/kɒm.pjuː.tər/', '/kəmˈpjuː.tər/', '/kʌm.pju.ter/', '/kæmˈpjuː.tər/'],
    correctAnswer: '/kəmˈpjuː.tər/',
    explanation: 'The first syllable is an unstressed schwa /kəm/, followed by primary stress on /pjuː/.'
  },
  {
    id: 'kc-18',
    category: 'IPA / Transcription',
    type: 'mcq',
    prompt: 'Which IPA symbol corresponds to the final nasal sound in "encoding"?',
    options: ['/m/', '/n/', '/ŋ/', '/ɡ/'],
    correctAnswer: '/ŋ/',
    explanation: '/ŋ/ is the velar nasal sound present at the end of -ing words.'
  },

  // Minimal Pairs (2)
  {
    id: 'kc-19',
    category: 'Minimal Pairs',
    type: 'mcq',
    prompt: 'Which pair of words represents a minimal pair contrasting /f/ and /v/?',
    options: ['fan and van', 'fan and fun', 'van and ban', 'fast and last'],
    correctAnswer: 'fan and van',
    explanation: 'Fan /fæn/ and van /væn/ differ only in the initial consonant (/f/ vs /v/).'
  },
  {
    id: 'kc-20',
    category: 'Minimal Pairs',
    type: 'mcq',
    prompt: 'In minimal pair practice, why is distinguishing "ship" /ʃɪp/ from "sheep" /ʃiːp/ critical for speakers?',
    options: ['To practice pitch accent', 'Because /ɪ/ is short lax and /iː/ is long tense, preventing semantic confusion', 'Because both words are spelled identically', 'To improve nasal resonance'],
    correctAnswer: 'Because /ɪ/ is short lax and /iː/ is long tense, preventing semantic confusion',
    explanation: 'Confounding short /ɪ/ and long /iː/ leads to misunderstanding in words like ship/sheep, bit/beat, fit/feet.'
  }
];

// 8. FINAL PRONUNCIATION ASSESSMENT PARTS A-E STRUCTURE
export const FINAL_ASSESSMENT_CONFIG = {
  title: 'Final Pronunciation & Phonetics Assessment (R26-LAB-01)',
  passingThresholdOverall: 70,
  passingThresholdWordStressComponent: 60,
  parts: [
    {
      id: 'part-a',
      title: 'Part A: Word Pronunciation',
      instructions: 'Record the correct oral pronunciation for each of the 5 engineering vocabulary terms. Read → Record → Replay → Re-record.',
      items: [
        { id: 'pa-1', word: 'architecture', ipa: '/ˈɑː.kɪ.tek.tʃər/' },
        { id: 'pa-2', word: 'optimization', ipa: '/ˌɒp.tɪ.maɪˈzeɪ.ʃən/' },
        { id: 'pa-3', word: 'algorithm', ipa: '/ˈæl.ɡə.rɪ.ðəm/' },
        { id: 'pa-4', word: 'configuration', ipa: '/kənˌfɪɡ.əˈreɪ.ʃən/' },
        { id: 'pa-5', word: 'methodology', ipa: '/ˌmeθ.əˈdɒl.ə.dʒi/' }
      ]
    },
    {
      id: 'part-b',
      title: 'Part B: Minimal Pairs',
      instructions: 'Pronounce and record both words in each minimal pair, clearly demonstrating acoustic sound contrast.',
      items: [
        { id: 'pb-1', word1: 'ship', word2: 'sheep', targetContrast: '/ɪ/ vs /iː/' },
        { id: 'pb-2', word1: 'fan', word2: 'van', targetContrast: '/f/ vs /v/' },
        { id: 'pb-3', word1: 'thin', word2: 'this', targetContrast: '/θ/ vs /ð/' },
        { id: 'pb-4', word1: 'code', word2: 'coat', targetContrast: '/d/ vs /t/' }
      ]
    },
    {
      id: 'part-c',
      title: 'Part C: Word Stress',
      instructions: 'Record all 5 technical terms with correct primary stress placement. Stress placement is hidden prior to recording.',
      note: 'CRITICAL: Must achieve at least 60% on Part C to pass the entire Module 1.',
      items: [
        { id: 'pc-1', word: 'development', syllableCount: 4, targetStress: 'de-VEL-op-ment', stressedSyllable: '2nd syllable (VEL)' },
        { id: 'pc-2', word: 'technology', syllableCount: 4, targetStress: 'tech-NOL-o-gy', stressedSyllable: '2nd syllable (NOL)' },
        { id: 'pc-3', word: 'university', syllableCount: 5, targetStress: 'u-ni-VER-si-ty', stressedSyllable: '3rd syllable (VER)' },
        { id: 'pc-4', word: 'important', syllableCount: 3, targetStress: 'im-POR-tant', stressedSyllable: '2nd syllable (POR)' },
        { id: 'pc-5', word: 'opportunity', syllableCount: 5, targetStress: 'op-por-TU-ni-ty', stressedSyllable: '3rd syllable (TU)' }
      ]
    },
    {
      id: 'part-d',
      title: 'Part D: Connected Speech',
      instructions: 'Record each short connected-speech engineering sentence with proper linking, rhythm, and word grouping.',
      items: [
        { id: 'pd-1', sentence: 'An algorithm optimizes data processing speed in real time.' },
        { id: 'pd-2', sentence: 'The system engineering team integrated new software modules smoothly.' },
        { id: 'pd-3', sentence: 'Data security protocols protect cloud servers from cyber threats.' }
      ]
    },
    {
      id: 'part-e',
      title: 'Part E: Short Paragraph Reading',
      instructions: 'Read and record the short academic paragraph in one continuous, fluent take with natural rhythm and clear phoneme articulation.',
      paragraphText: 'Modern software engineering relies on automated optimization algorithms and secure network protocols. Clear technical communication ensures seamless team collaboration, preventing costly implementation errors in real-time embedded systems.',
      items: [
        {
          id: 'pe-1',
          paragraph: 'Modern software engineering relies on automated optimization algorithms and secure network protocols. Clear technical communication ensures seamless team collaboration, preventing costly implementation errors in real-time embedded systems.'
        }
      ]
    }
  ]
};

// 9. REFLECTION PROMPTS (5 MANDATORY QUESTIONS)
export const MODULE1_REFLECTION_PROMPTS = [
  'Which specific English sounds (e.g. /θ/, /ð/, /v/, /w/, /r/, /iː/) were easiest for you to produce during this laboratory?',
  'Which phonemes or minimal pairs presented the greatest difficulty due to your regional language influence (MTI)?',
  'What specific pronunciation or stress problem did you notice during your voice playback analysis?',
  'What concrete improvement did you make between your first recording attempt and your final submission?',
  'What specific pronunciation strategy or daily practice drill will you continue using to maintain vocal clarity?'
];
