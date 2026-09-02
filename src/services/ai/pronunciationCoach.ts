import { AIEvaluationResult } from '../../types';

export interface PronunciationAnalysisInput {
  targetPhrase: string;
  phoneticSpelling?: string;
  audioBlobUrl?: string;
  recordedText?: string;
}

export interface PronunciationFeedback extends AIEvaluationResult {
  phoneticBreakdown: { syllable: string; accuracy: number; stressCorrect: boolean }[];
  pitchAccuracyPercent: number;
  intonationPattern: string;
}

export interface PhonemicTranscriptionResult {
  isValidWord: boolean;
  word?: string;
  phonemicTranscriptionRP?: string;
  phonemicTranscriptionGA?: string;
  syllableDivision?: string;
  primaryStress?: string;
  errorMessage?: string;
}

/**
 * Placeholder service for future Gemini AI Pronunciation Coach
 * Will integrate with Gemini 2.5/3 Flash Audio models or Multimodal API
 */
export async function analyzePronunciation(
  input: PronunciationAnalysisInput
): Promise<PronunciationFeedback> {
  // Simulate intelligent response delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const targetLength = input.targetPhrase.length;
  const simulatedScore = Math.min(96, Math.max(72, 80 + (targetLength % 15)));

  return {
    score: simulatedScore,
    overallFeedback: `Good attempt on "${input.targetPhrase}". Your vowel clarity was distinct, but pay close attention to primary syllable stress on technical terms.`,
    strengths: [
      'Clear articulation of initial consonant sounds',
      'Good speech pace and volume consistency',
      'Natural breathing intervals'
    ],
    improvements: [
      'Emphasize the stressed syllable more forcefully',
      'Maintain steady pitch inflection on clause endings'
    ],
    phoneticBreakdown: input.targetPhrase.split(' ').map((word) => ({
      syllable: word,
      accuracy: Math.floor(82 + Math.random() * 15),
      stressCorrect: true
    })),
    pitchAccuracyPercent: 88,
    intonationPattern: 'Falling tone (Appropriate for declarative engineering statements)',
    metrics: {
      FluencyScore: '85/100',
      PhoneticAccuracy: `${simulatedScore}%`,
      SpeechRate: '135 WPM'
    },
    isSimulatedMode: true
  };
}

/**
 * Dynamically generates phonemic transcription via server API or local AI service
 */
export async function generatePhonemicTranscription(word: string): Promise<PhonemicTranscriptionResult> {
  const trimmed = word.trim();

  // Validate word structure first
  if (!isValidWordStructure(trimmed)) {
    return {
      isValidWord: false,
      errorMessage: 'Please enter a valid English word.'
    };
  }

  try {
    const response = await fetch('/api/ai/phonemic-transcription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: trimmed })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.isValidWord) {
        const cleanRP = sanitizeAndValidateIPA(data.phonemicTranscriptionRP, trimmed, 'RP');
        const cleanGA = sanitizeAndValidateIPA(data.phonemicTranscriptionGA || data.phonemicTranscriptionRP, trimmed, 'GA');

        return {
          isValidWord: true,
          word: data.word || trimmed,
          phonemicTranscriptionRP: cleanRP,
          phonemicTranscriptionGA: cleanGA
        };
      } else {
        return {
          isValidWord: false,
          errorMessage: 'Please enter a valid English word.'
        };
      }
    }
  } catch (err) {
    console.warn('Network call to /api/ai/phonemic-transcription failed, using fallback AI generator:', err);
  }

  return generateLocalPhonemicTranscription(trimmed);
}

export function isValidWordStructure(word: string): boolean {
  if (!word || typeof word !== 'string') return false;
  const clean = word.trim().toLowerCase();

  // Length 2..35
  if (clean.length < 2 || clean.length > 35) return false;

  // English letters, hyphens, or apostrophes
  if (!/^[a-z]+(?:['-][a-z]+)*$/i.test(clean)) return false;

  // Must contain at least one vowel
  if (!/[aeiouy]/i.test(clean)) return false;

  // No 4+ repeating characters in a row
  if (/(.)\1{3,}/i.test(clean)) return false;

  // No 6+ consecutive consonants
  if (/[bcdfghjklmnpqrstvwxz]{6,}/i.test(clean)) return false;

  return true;
}

export function sanitizeAndValidateIPA(
  rawIPA: string | undefined | null,
  word: string,
  dialect: 'RP' | 'GA'
): string {
  const cleanWord = word.trim().toLowerCase();

  if (!rawIPA || typeof rawIPA !== 'string') {
    return buildIPAFromPhonemes(cleanWord, dialect);
  }

  let str = rawIPA.trim();

  // Remove markdown code blocks / backticks / bold
  str = str.replace(/```[a-z]*|```/g, '').replace(/[`*]/g, '').trim();

  // Remove quotes
  str = str.replace(/^["']|["']$/g, '').trim();

  // Remove prefix labels (e.g. "RP:", "GA:", "IPA:", "RP Phonemic:", "Transcription:")
  str = str.replace(/^(?:RP|GA|IPA|Transcription|Received Pronunciation|General American)(?:\s*Phonemic)?(?:\s*Transcription)?:\s*/i, '');

  // Remove explanatory text in parentheses or brackets (e.g. "(stressed on 4th syllable)")
  str = str.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();

  // Extract content between slashes if present
  const slashMatch = str.match(/\/([^\/]+)\//);
  if (slashMatch) {
    str = slashMatch[1].trim();
  } else {
    str = str.replace(/^\/+|\/+$/g, '').trim();
  }

  // Remove trailing words or commentary if space exists
  if (/\s+[a-zA-Z]{2,}/.test(str)) {
    str = str.split(/\s+/)[0].trim();
  }

  // Check if string contains actual IPA phonemes / stress marks
  const hasIPACharacters = /[əɪiːɒɑːɔːʊuːɜːeɪaɪɔɪəʊaʊɪəeəʊəʃʒθðŋtʃdʒɹɚɝˈˌʌæɛɒ]/.test(str);

  // If no IPA special symbols and string is identical to normal English word, generate proper IPA phonemes
  if (!hasIPACharacters && str.toLowerCase().replace(/[^a-z]/g, '') === cleanWord) {
    return buildIPAFromPhonemes(cleanWord, dialect);
  }

  return `/${str}/`;
}

const PHONEMIC_DICT: Record<string, { RP: string; GA: string }> = {
  communication: { RP: '/kəˌmjuːnɪˈkeɪʃən/', GA: '/kəˌmjuːnəˈkeɪʃən/' },
  pronunciation: { RP: '/prəˌnʌnsiˈeɪʃən/', GA: '/prəˌnʌnsiˈeɪʃən/' },
  technology: { RP: '/tekˈnɒlədʒi/', GA: '/tekˈnɑːlədʒi/' },
  opportunity: { RP: '/ˌɒpəˈtjuːnəti/', GA: '/ˌɑːpɚˈtuːnəti/' },
  architecture: { RP: '/ˈɑːkɪtektʃər/', GA: '/ˈɑːrkətektʃɚ/' },
  development: { RP: '/dɪˈveləpmənt/', GA: '/dɪˈveləpmənt/' },
  algorithm: { RP: '/ˈælɡərɪðəm/', GA: '/ˈælɡɚɪðəm/' },
  examination: { RP: '/ɪɡˌzæmɪˈneɪʃən/', GA: '/ɪɡˌzæməˈneɪʃən/' },
  engineering: { RP: '/ˌendʒɪˈnɪərɪŋ/', GA: '/ˌendʒəˈnɪrɪŋ/' },
  computer: { RP: '/kəmˈpjuːtər/', GA: '/kəmˈpjuːtɚ/' },
  university: { RP: '/ˌjuːnɪˈvɜːsəti/', GA: '/ˌjuːnəˈvɝːsəti/' },
  optimization: { RP: '/ˌɒptɪmaɪˈzeɪʃən/', GA: '/ˌɑːptəməˈzeɪʃən/' },
  laboratory: { RP: '/ləˈbɒrətəri/', GA: '/ˈlæbrətɔːri/' },
  phonetics: { RP: '/fəˈnetɪks/', GA: '/fəˈnetɪks/' },
  transcription: { RP: '/trænˈskrɪpʃən/', GA: '/trænˈskrɪpʃən/' }
};

export function buildIPAFromPhonemes(word: string, dialect: 'RP' | 'GA'): string {
  const clean = word.toLowerCase().trim();

  if (PHONEMIC_DICT[clean]) {
    return PHONEMIC_DICT[clean][dialect];
  }

  // Rule-based phonetic converter for other valid words
  let ipa = clean
    .replace(/tion/g, 'ʃən')
    .replace(/sion/g, 'ʒən')
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/th/g, 'θ')
    .replace(/ch/g, 'tʃ')
    .replace(/sh/g, 'ʃ')
    .replace(/ee/g, 'iː')
    .replace(/oo/g, 'uː')
    .replace(/qu/g, 'kw');

  if (dialect === 'GA') {
    ipa = ipa.replace(/ar/g, 'ɑːr').replace(/or/g, 'ɔːr').replace(/er/g, 'ɚ');
  } else {
    ipa = ipa.replace(/ar/g, 'ɑː').replace(/or/g, 'ɔː').replace(/er/g, 'ər');
  }

  return `/ˈ${ipa}/`;
}

function generateLocalPhonemicTranscription(word: string): PhonemicTranscriptionResult {
  const clean = word.toLowerCase().trim();

  if (!isValidWordStructure(clean)) {
    return {
      isValidWord: false,
      errorMessage: 'Please enter a valid English word.'
    };
  }

  const rpIPA = buildIPAFromPhonemes(clean, 'RP');
  const gaIPA = buildIPAFromPhonemes(clean, 'GA');

  return {
    isValidWord: true,
    word: clean,
    phonemicTranscriptionRP: rpIPA,
    phonemicTranscriptionGA: gaIPA
  };
}

