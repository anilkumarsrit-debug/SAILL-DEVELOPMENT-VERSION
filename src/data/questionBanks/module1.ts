import { QuestionBankItem } from '../../types/knowledgeCheck';

export const module1Questions: QuestionBankItem[] = [
  {
    id: 'qb-pron-001',
    moduleId: 'pronunciation',
    topic: 'IPA Phoneme Classification',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How many distinct phonemes (speech sounds) exist in standard Received Pronunciation (RP) English, and how are they categorized?',
    options: [
      '44 phonemes: 20 vowels (12 monophthongs + 8 diphthongs) and 24 consonants',
      '26 phonemes: 5 vowels and 21 consonants matching the alphabet letters',
      '52 phonemes: 26 uppercase sounds and 26 lowercase sounds',
      '36 phonemes: 18 oral vowels and 18 nasal consonants'
    ],
    correctAnswer: '44 phonemes: 20 vowels (12 monophthongs + 8 diphthongs) and 24 consonants',
    explanation: 'Standard English comprises 44 distinct phonemes: 20 vowel sounds (12 pure monophthongs and 8 gliding diphthongs) and 24 consonant sounds.',
    keywords: ['Phonemes', 'IPA', 'Vowels', 'Consonants'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-pron-002',
    moduleId: 'pronunciation',
    topic: 'Minimal Pairs Discrimination',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which pair of technical engineering terms represents a genuine "minimal pair" distinguished by a single vowel phoneme contrast?',
    options: [
      '"bit" /bɪt/ vs "byte" /baɪt/',
      '"cache" /kæʃ/ vs "storage" /ˈstɔː.rɪdʒ/',
      '"server" /ˈsɜː.vər/ vs "router" /ˈruː.tər/',
      '"input" /ˈɪn.pʊt/ vs "output" /ˈaʊt.pʊt/'
    ],
    correctAnswer: '"bit" /bɪt/ vs "byte" /baɪt/',
    explanation: '"bit" and "byte" differ by exactly one phonological segment: the short monophthong /ɪ/ versus the diphthong /aɪ/.',
    keywords: ['Minimal Pairs', 'Vowel Contrast', 'Phonetics'],
    estimatedTimeSeconds: 25
  },
  {
    id: 'qb-pron-003',
    moduleId: 'pronunciation',
    topic: 'Voiced vs Voiceless Dental Fricatives',
    courseOutcome: 'CO1',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which IPA phonetic symbol represents the voiceless dental fricative sound heard at the beginning of the word "thermal" or "theory"?',
    options: [
      '/θ/ (Theta)',
      '/ð/ (Eth)',
      '/ʃ/ (Esh)',
      '/ʒ/ (Ezh)'
    ],
    correctAnswer: '/θ/ (Theta)',
    explanation: 'The IPA symbol /θ/ denotes the voiceless dental fricative (as in "theory", "thermal", "throughput"), whereas /ð/ denotes the voiced dental fricative (as in "this", "algorithm").',
    keywords: ['IPA Symbols', 'Dental Fricative', 'Consonants'],
    estimatedTimeSeconds: 20
  },
  {
    id: 'qb-pron-004',
    moduleId: 'pronunciation',
    topic: 'Syllable Stress in -tion and -ic Suffixes',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'According to standard English syllable stress rules, which syllable receives the primary stress in the technical word "AUTOMATION"?',
    options: [
      '3rd syllable: au-to-MA-tion (/ˌɔː.təˈmeɪ.ʃən/)',
      '1st syllable: AU-to-ma-tion (/ˈɔː.tə.meɪ.ʃən/)',
      '2nd syllable: au-TO-ma-tion (/ɔːˈtɒ.meɪ.ʃən/)',
      '4th syllable: au-to-ma-TION (/ˌɔː.tə.meɪˈʃən/)'
    ],
    correctAnswer: '3rd syllable: au-to-MA-tion (/ˌɔː.təˈmeɪ.ʃən/)',
    explanation: 'Polysyllabic words ending in the suffix "-tion" or "-sion" consistently place primary stress on the penultimate syllable immediately preceding the suffix.',
    keywords: ['Syllable Stress', 'Suffix Rules', 'Automation'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-pron-005',
    moduleId: 'pronunciation',
    topic: 'Intonation Contours in Engineering Discourse',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which category of spoken engineering sentences standardly requires a FALLING intonation contour at the sentence termination?',
    options: [
      'Definitive declarative statements and Wh-information questions (e.g., "What is the clock speed?")',
      'Yes/No questions requiring simple confirmation (e.g., "Is the server online?")',
      'Incomplete introductory dependent clauses before a pause',
      'Polite echo requests asking the listener to repeat a statement'
    ],
    correctAnswer: 'Definitive declarative statements and Wh-information questions (e.g., "What is the clock speed?")',
    explanation: 'Standard English uses falling intonation for completed factual statements and information-seeking Wh-questions, while rising intonation signals Yes/No inquiries and unfinished lists.',
    keywords: ['Intonation', 'Pitch Contour', 'Wh-questions'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-pron-006',
    moduleId: 'pronunciation',
    topic: 'Syllable Stress Shift: Noun vs Verb Pairs',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In two-syllable functional word pairs, how does stress placement distinguish the noun form from the verb form in words like "record", "project", and "conduct"?',
    options: [
      'Nouns place primary stress on the 1st syllable; verbs place primary stress on the 2nd syllable',
      'Nouns place primary stress on the 2nd syllable; verbs place primary stress on the 1st syllable',
      'Both noun and verb forms must have identical monotonic stress on the last syllable',
      'Verbs receive no stress at all and are spoken entirely in whisper pitch'
    ],
    correctAnswer: 'Nouns place primary stress on the 1st syllable; verbs place primary stress on the 2nd syllable',
    explanation: 'In English disyllabic homographs, nouns and adjectives receive initial stress (e.g., RE-cord, PRO-ject), whereas verbs shift stress to the second syllable (e.g., re-CORD, pro-JECT).',
    keywords: ['Stress Shift', 'Noun Verb Contrast', 'Intelligibility'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-pron-007',
    moduleId: 'pronunciation',
    topic: 'Mother Tongue Influence (MTI) & Schwa /ə/ Reduction',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How does the central neutral vowel Schwa /ə/ function in reducing Mother Tongue Influence (MTI) during technical presentations?',
    options: [
      'It de-stresses and weakens unstressed vowels, creating natural English rhythmic cadence rather than pronouncing every vowel with full tense weight',
      'It adds extra aspiration puffs to vowel sounds at the end of every sentence',
      'It eliminates the need for consonants in technical vocabulary',
      'It converts British English sounds into American regional accents'
    ],
    correctAnswer: 'It de-stresses and weakens unstressed vowels, creating natural English rhythmic cadence rather than pronouncing every vowel with full tense weight',
    explanation: 'English is a stress-timed language where unstressed syllables weaken to schwa /ə/. MTI occurs when speakers articulate every vowel tensely with syllable-timed cadence.',
    keywords: ['Schwa', 'MTI Reduction', 'Stress-Timed Rhythm'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-pron-008',
    moduleId: 'pronunciation',
    topic: 'Aspiration and Voice Onset Time (VOT)',
    courseOutcome: 'CO1',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why must voiceless plosive consonants (/p/, /t/, /k/) be articulated with slight aspiration (puff of air) at the beginning of stressed syllables?',
    options: [
      'To provide sufficient Voice Onset Time (VOT) so listeners do not mishear them as voiced plosives (/b/, /d/, /g/)',
      'To increase speech volume without using a microphone',
      'To cool down the vocal cords during long presentations',
      'Because un-aspirated stops are prohibited in English spelling rules'
    ],
    correctAnswer: 'To provide sufficient Voice Onset Time (VOT) so listeners do not mishear them as voiced plosives (/b/, /d/, /g/)',
    explanation: 'In initial position, English voiceless plosives (/p/, /t/, /k/) require aspiration (VOT > 40ms) to ensure acoustic clarity and prevent confusion with voiced cognates (/b/, /d/, /g/).',
    keywords: ['Aspiration', 'Voice Onset Time', 'Plosives'],
    estimatedTimeSeconds: 30
  },
  {
    id: 'qb-pron-009',
    moduleId: 'pronunciation',
    topic: 'Phonetic Sound Analysis in Engineering Terms',
    courseOutcome: 'CO1',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'In the multisyllabic engineering word "SPECIFICATION" (/ˌspes.ɪ.fɪˈkeɪ.ʃən/), which syllable receives the SECONDARY stress and which receives the PRIMARY stress?',
    options: [
      'Secondary stress on 1st syllable (SPEC-); Primary stress on 4th syllable (-CA-)',
      'Primary stress on 1st syllable (SPEC-); Secondary stress on 5th syllable (-tion)',
      'Primary stress on 2nd syllable (-i-); Secondary stress on 3rd syllable (-fi-)',
      'Both Primary and Secondary stress occur simultaneously on the 5th syllable (-tion)'
    ],
    correctAnswer: 'Secondary stress on 1st syllable (SPEC-); Primary stress on 4th syllable (-CA-)',
    explanation: 'In "specification" (/ˌspes.ɪ.fɪˈkeɪ.ʃən/), secondary stress (ˌ) is on the initial syllable "spec-", while primary stress (ˈ) is on the penultimate syllable "-ca-".',
    keywords: ['Primary Stress', 'Secondary Stress', 'IPA Notation'],
    estimatedTimeSeconds: 35
  },
  {
    id: 'qb-pron-010',
    moduleId: 'pronunciation',
    topic: 'Connected Speech & C-V Linking',
    courseOutcome: 'CO1',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When pronouncing the phrase "run an algorithm" in natural connected technical speech, how does consonant-to-vowel (C-V) linking occur?',
    options: [
      'The final consonant of "run" and "an" smoothly glides into the subsequent initial vowels: /rʌ.nə.nǽl.ɡə.rɪ.ðəm/',
      'A hard 1-second glottal stop is placed between every single word with no connection',
      'The vowel sound of "run" is dropped completely, creating "rn n lgorithm"',
      'The final letter of each word is whispered while the initial letter is shouted'
    ],
    correctAnswer: 'The final consonant of "run" and "an" smoothly glides into the subsequent initial vowels: /rʌ.nə.nǽl.ɡə.rɪ.ðəm/',
    explanation: 'In fluent connected speech, a terminal consonant links smoothly to a following initial vowel (C-V linking), creating seamless acoustic phrasing without choppy word boundaries.',
    keywords: ['Connected Speech', 'Linking', 'C-V Phrasing'],
    estimatedTimeSeconds: 35
  }
];
