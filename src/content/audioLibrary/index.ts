import { AudioLibraryItem, AudioCategory } from '../types';

export const MASTER_AUDIO_LIBRARY: AudioLibraryItem[] = [
  // VOWELS
  {
    id: 'aud-vow-01',
    category: 'vowels',
    title: 'Short Vowel /ɪ/ vs Long Vowel /iː/',
    speakerGender: 'ai_neutral',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: '/ʃɪp/ vs /ʃiːp/',
    transcript: 'ship, sheep, fit, feet, sit, seat',
    targetPhonemes: ['/ɪ/', '/iː/']
  },
  {
    id: 'aud-vow-02',
    category: 'vowels',
    title: 'Neutral Schwa /ə/ in Multisyllable Words',
    speakerGender: 'ai_neutral',
    accent: 'en-GB',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: '/əˈbaʊt/ /ˈsɜː.kɪt/',
    transcript: 'about, circuit, data, system, algorithm',
    targetPhonemes: ['/ə/']
  },

  // CONSONANTS
  {
    id: 'aud-con-01',
    category: 'consonants',
    title: 'Voiced Dental Fricative /ð/ and Unvoiced /θ/',
    speakerGender: 'ai_neutral',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: '/θɪŋk/ vs /ðɪs/',
    transcript: 'think, thought, method, algorithm, this, that, smother',
    targetPhonemes: ['/θ/', '/ð/']
  },

  // MINIMAL PAIRS
  {
    id: 'aud-min-01',
    category: 'minimal_pairs',
    title: 'Labiodental /v/ vs Bilabial /w/',
    speakerGender: 'female',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: '/vine/ vs /wine/',
    transcript: 'vine, wine, vest, west, verse, worse',
    targetPhonemes: ['/v/', '/w/']
  },

  // WORD STRESS
  {
    id: 'aud-str-01',
    category: 'word_stress',
    title: 'Engineering Vocabulary Primary Stress Shifts',
    speakerGender: 'male',
    accent: 'en-IN',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: 'ˈæt.əm vs əˈtɒm.ɪk',
    transcript: 'atom, atomic, photograph, photographer, photographic',
    targetPhonemes: ['primary_stress', 'secondary_stress']
  },

  // SENTENCE STRESS
  {
    id: 'aud-sen-01',
    category: 'sentence_stress',
    title: 'Technical Proposition Emphasis',
    speakerGender: 'ai_neutral',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: 'The ALGORITHM optimizes PERFORMANCE.',
    transcript: 'The optimization algorithm increased system throughput significantly.',
    targetPhonemes: ['content_word_stress']
  },

  // INTONATION
  {
    id: 'aud-int-01',
    category: 'intonation',
    title: 'Falling Intonation in Wh-Questions & Statements',
    speakerGender: 'female',
    accent: 'en-GB',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: '↘ What is the maximum throughput?',
    transcript: 'What is the maximum operating temperature of the microcontroller?',
    targetPhonemes: ['falling_contour']
  },

  // CONVERSATION
  {
    id: 'aud-cnv-01',
    category: 'conversation',
    title: 'Professional Group Discussion Intervention',
    speakerGender: 'male',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: 'I agree with the previous speaker...',
    transcript: 'I agree with the previous speaker regarding cloud scalability, but we must also address security compliance.',
    targetPhonemes: ['polite_assertion']
  },

  // PRESENTATION
  {
    id: 'aud-prs-01',
    category: 'presentation',
    title: 'Keynote Speech Hook & Delivery',
    speakerGender: 'female',
    accent: 'en-US',
    audioUrl: 'https://actions.google.com/sounds/v1/human/human_voice_cough.ogg',
    phoneticText: 'Welcome stakeholders...',
    transcript: 'Good morning ladies and gentlemen. Today I will present our groundbreaking findings in quantum artificial intelligence.',
    targetPhonemes: ['projection', 'pause_boundaries']
  }
];

export function getAudioLibraryByCategory(category: AudioCategory): AudioLibraryItem[] {
  return MASTER_AUDIO_LIBRARY.filter((item) => item.category === category);
}

export function getAudioLibraryById(id: string): AudioLibraryItem | undefined {
  return MASTER_AUDIO_LIBRARY.find((item) => item.id === id);
}
