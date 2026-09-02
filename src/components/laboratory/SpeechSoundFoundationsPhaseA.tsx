import React, { useState, useRef } from 'react';
import {
  Volume2,
  Mic,
  Play,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  BookOpen,
  Search,
  Award,
  Layers,
  Activity,
  Radio,
  ChevronRight,
  Info,
  Check,
  Flame,
  Globe,
  Sliders,
  HelpCircle,
  FileText,
  Save,
  Users,
  Lightbulb,
  ArrowRight,
  Trophy,
  ShieldCheck,
  Bookmark,
  Square,
  Lock,
  MessageSquare
} from 'lucide-react';
import { OrgansOfSpeechDiagram } from './OrgansOfSpeechDiagram';
import { analyzePronunciation, PronunciationFeedback } from '../../services/ai/pronunciationCoach';

export interface SoundDetail {
  symbol: string;
  name: string;
  category: 'short_vowel' | 'long_vowel' | 'diphthong' | 'consonant';
  categoryLabel: string;
  voicing: 'Voiced' | 'Unvoiced';
  placeOfArticulation: string;
  mannerOfArticulation: string;
  tonguePosition: string;
  lipPosition: string;
  jawPosition: string;
  letterPatterns: string;
  exampleWords: string[];
  sentenceSample: string;
  commonErrors: string;
  pronunciationTips: string;
}

export const MASTER_FOUNDATION_SOUNDS: SoundDetail[] = [
  // Short Vowels
  {
    symbol: '/ɪ/',
    name: 'Short Front Vowel (Kit / Bit)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid-High Front',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'High-Mid Front (slightly lower than /iː/)',
    lipPosition: 'Relaxed / Unrounded',
    jawPosition: 'Slightly open',
    letterPatterns: 'i (bit, digit), y (symbol), u (busy), e (pretty)',
    exampleWords: ['digital', 'signal', 'input', 'bit', 'system'],
    sentenceSample: 'Digital signals process user input into the system.',
    commonErrors: 'Unintentionally lengthening into /iː/ (e.g. saying "beet" for "bit").',
    pronunciationTips: 'Keep the tongue relaxed and short. Do not pull lips wide into a smile.'
  },
  {
    symbol: '/e/',
    name: 'Short Front Vowel (Dress / Bed)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid Front',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Mid Front',
    lipPosition: 'Medium Spread',
    jawPosition: 'Half Open',
    letterPatterns: 'e (bed, network), ea (head), a (any)',
    exampleWords: ['network', 'vector', 'method', 'bed', 'element'],
    sentenceSample: 'Deploy the vector method across network elements.',
    commonErrors: 'Lowering the jaw too much and sounding like /æ/ ("bat").',
    pronunciationTips: 'Mouth half-open, tongue forward in lower mouth area without excessive tension.'
  },
  {
    symbol: '/æ/',
    name: 'Short Front Vowel (Trap / Cat)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Low Front',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Low Front (flat on floor)',
    lipPosition: 'Spread / Unrounded',
    jawPosition: 'Wide Open',
    letterPatterns: 'a (cat, RAM, stack, packet)',
    exampleWords: ['RAM', 'stack', 'packet', 'cat', 'bandwidth'],
    sentenceSample: 'Stack memory packets inside RAM with high bandwidth.',
    commonErrors: 'Substituing /e/ or /aː/ (saying "pucket" or "paaket").',
    pronunciationTips: 'Open mouth wide, flatten tongue towards front floor of mouth, drop chin.'
  },
  {
    symbol: '/ɒ/',
    name: 'Short Back Vowel (Lot / Pot)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Low Back',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Low Back',
    lipPosition: 'Slightly Rounded',
    jawPosition: 'Open',
    letterPatterns: 'o (pot, logic, process), a (what, watch)',
    exampleWords: ['logic', 'process', 'option', 'pot', 'block'],
    sentenceSample: 'Verify logic options during data block processing.',
    commonErrors: 'Over-rounding lips into long /ɔː/ ("port") or unrounding to /ʌ/.',
    pronunciationTips: 'Short duration, slightly rounded lips, jaw open.'
  },
  {
    symbol: '/ʊ/',
    name: 'Short Back Vowel (Foot / Put)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid-High Back',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'High-Mid Back',
    lipPosition: 'Gently Rounded',
    jawPosition: 'Slightly Open',
    letterPatterns: 'u (put, buffer), oo (book), ou (could), o (wolf)',
    exampleWords: ['buffer', 'push', 'full', 'input', 'book'],
    sentenceSample: 'Push data packets until the buffer is full.',
    commonErrors: 'Lengthening into /uː/ ("boot") or flattening lips.',
    pronunciationTips: 'Very short vocal burst from back of tongue with soft lip rounding.'
  },
  {
    symbol: '/ʌ/',
    name: 'Short Central Vowel (Strut / Cup)',
    category: 'short_vowel',
    categoryLabel: 'Short Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Low-Mid Central',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Low-Mid Central',
    lipPosition: 'Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'u (cup, null, cluster), o (front, month), ou (touch)',
    exampleWords: ['cluster', 'null', 'bus', 'buffer', 'structure'],
    sentenceSample: 'The cluster bus handled null database queries.',
    commonErrors: 'Confusing with long /ɑː/ ("father") or /ɒ/ ("pot").',
    pronunciationTips: 'Relax the mouth completely, short energetic vocal burst.'
  },
  {
    symbol: '/ə/',
    name: 'Schwa Neutral Vowel (About / System)',
    category: 'short_vowel',
    categoryLabel: 'Schwa (Neutral)',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid Central',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Mid Central (Resting)',
    lipPosition: 'Completely Neutral',
    jawPosition: 'Relaxed / Resting',
    letterPatterns: 'a (about, data), e (system), o (method), u (supply)',
    exampleWords: ['algorithm', 'system', 'data', 'method', 'router'],
    sentenceSample: 'Run the search algorithm across system data.',
    commonErrors: 'Over-articulating unstressed vowels according to spelling rules.',
    pronunciationTips: 'The most frequent sound in English. Zero muscular tension, extremely short.'
  },

  // Long Vowels
  {
    symbol: '/iː/',
    name: 'Long Front Vowel (Fleece / Beat)',
    category: 'long_vowel',
    categoryLabel: 'Long Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'High Front',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'High Front (near hard palate)',
    lipPosition: 'Spread Wide (Smiling shape)',
    jawPosition: 'Almost Closed',
    letterPatterns: 'ee (see), ea (clean), ie (piece), e (routine, machine)',
    exampleWords: ['machine', 'clean', 'routine', 'beat', 'key'],
    sentenceSample: 'The machine processes clean data in routine tasks.',
    commonErrors: 'Shortening to /ɪ/ ("bit") in technical words like "machine".',
    pronunciationTips: 'Pull lip corners back into a smile and sustain the vocalization longer.'
  },
  {
    symbol: '/ɑː/',
    name: 'Long Back Vowel (Palm / Father)',
    category: 'long_vowel',
    categoryLabel: 'Long Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Low Back',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Low Back (flat on mouth floor)',
    lipPosition: 'Neutral / Unrounded',
    jawPosition: 'Wide Open',
    letterPatterns: 'a (father), ar (chart, architecture), ear (heart)',
    exampleWords: ['architecture', 'chart', 'hardware', 'father', 'archive'],
    sentenceSample: 'Review system architecture and hardware charts.',
    commonErrors: 'Shortening sound or nasalizing vowel.',
    pronunciationTips: 'Open mouth fully like a doctor examination, keep throat relaxed.'
  },
  {
    symbol: '/ɔː/',
    name: 'Long Back Vowel (Thought / Port)',
    category: 'long_vowel',
    categoryLabel: 'Long Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid-High Back',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'High-Mid Back',
    lipPosition: 'Strongly Rounded (O shape)',
    jawPosition: 'Half Open',
    letterPatterns: 'or (port, format), au (author), aw (law), al (talk)',
    exampleWords: ['source', 'format', 'restore', 'port', 'board'],
    sentenceSample: 'Restore the source code in the original format.',
    commonErrors: 'Unrounding lips or shortening sound to /ɒ/.',
    pronunciationTips: 'Firm lip rounding into an "O" ring, pull tongue back.'
  },
  {
    symbol: '/uː/',
    name: 'Long Back Vowel (Goose / Boot)',
    category: 'long_vowel',
    categoryLabel: 'Long Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'High Back',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'High Back (near soft palate)',
    lipPosition: 'Tight Pucker / Small Circle',
    jawPosition: 'Almost Closed',
    letterPatterns: 'oo (boot, loop), u (execute), ew (new), ou (route)',
    exampleWords: ['execute', 'routine', 'loop', 'boot', 'rule'],
    sentenceSample: 'Execute the recursive loop routine.',
    commonErrors: 'Shortening to /ʊ/ ("put") or failing to pucker lips.',
    pronunciationTips: 'Pucker lips tightly forward as if whistling, sustain the tone.'
  },
  {
    symbol: '/ɜː/',
    name: 'Long Central Vowel (Nurse / Bird)',
    category: 'long_vowel',
    categoryLabel: 'Long Vowel',
    voicing: 'Voiced',
    placeOfArticulation: 'Mid Central',
    mannerOfArticulation: 'Monophthong Vowel',
    tonguePosition: 'Mid Central',
    lipPosition: 'Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'er (server), ur (turn), ir (bird), or (word), ear (learn)',
    exampleWords: ['server', 'kernel', 'convert', 'circuit', 'virtual'],
    sentenceSample: 'Convert data types inside the virtual server kernel.',
    commonErrors: 'Heavy tongue trill or pronouncing letter "r" loudly in RP context.',
    pronunciationTips: 'Keep tongue relaxed in center of mouth, steady neutral sound.'
  },

  // Diphthongs
  {
    symbol: '/eɪ/',
    name: 'Closing Diphthong (Face / Bay)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Front',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Mid-Front gliding to High-Front',
    lipPosition: 'Spread to Neutral',
    jawPosition: 'Closing gesture',
    letterPatterns: 'a (state), ai (main), ay (array), ea (break), ei (eighth)',
    exampleWords: ['array', 'database', 'state', 'bay', 'mainframe'],
    sentenceSample: 'Save array state in the mainframe database.',
    commonErrors: 'Monophthongizing to flat /eː/ (common regional Indian English error).',
    pronunciationTips: 'Start at /e/ and glide smoothly up towards /ɪ/.'
  },
  {
    symbol: '/aɪ/',
    name: 'Closing Diphthong (Price / Buy)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Open-Front',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Low-Front gliding to High-Front',
    lipPosition: 'Neutral to Spread',
    jawPosition: 'Wide Open to Closing',
    letterPatterns: 'i (byte), y (type, pipeline), igh (high), ie (die)',
    exampleWords: ['byte', 'pipeline', 'compile', 'buy', 'client'],
    sentenceSample: 'Compile the byte stream in the client pipeline.',
    commonErrors: 'Truncating the glide or making second element too quiet.',
    pronunciationTips: 'Open wide on /a/ first, then glide tongue smoothly up to /ɪ/.'
  },
  {
    symbol: '/ɔɪ/',
    name: 'Closing Diphthong (Choice / Boy)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Back-Front',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Mid-Back gliding to High-Front',
    lipPosition: 'Rounded to Unrounded Spread',
    jawPosition: 'Half Open to Closing',
    letterPatterns: 'oi (point, voice), oy (deploy, boy)',
    exampleWords: ['voice', 'pointer', 'deploy', 'boy', 'noise'],
    sentenceSample: 'Deploy voice recognition pointer events.',
    commonErrors: 'Incomplete lip unrounding during transition.',
    pronunciationTips: 'Start with rounded lips on /ɔː/, then unround as you glide to /ɪ/.'
  },
  {
    symbol: '/əʊ/',
    name: 'Closing Diphthong (Goat / Code)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Central-Back',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Mid-Central gliding to High-Back',
    lipPosition: 'Neutral gliding to Rounded',
    jawPosition: 'Half Open to Closing',
    letterPatterns: 'o (code, node), oa (load), ow (flow), ou (shoulder)',
    exampleWords: ['code', 'node', 'protocol', 'go', 'overflow'],
    sentenceSample: 'Write modular code for every node protocol.',
    commonErrors: 'Replacing with flat monophthong /oː/.',
    pronunciationTips: 'Begin at neutral schwa /ə/ and round lips as you move towards /ʊ/.'
  },
  {
    symbol: '/aʊ/',
    name: 'Closing Diphthong (Mouth / Cow)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Open-Back',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Low Central gliding to High-Back',
    lipPosition: 'Neutral gliding to Rounded',
    jawPosition: 'Wide Open to Closing',
    letterPatterns: 'ou (cloud, bound), ow (outbound, cow)',
    exampleWords: ['cloud', 'bound', 'outbound', 'cow', 'amount'],
    sentenceSample: 'Monitor outbound traffic from cloud nodes.',
    commonErrors: 'Harsh abrupt onset without smooth glide.',
    pronunciationTips: 'Start with wide open mouth /a/ and glide towards rounded /ʊ/.'
  },
  {
    symbol: '/ɪə/',
    name: 'Centering Diphthong (Near / Here)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide High-Central',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'High-Front gliding to Mid-Central',
    lipPosition: 'Spread to Neutral',
    jawPosition: 'Closing to Half Open',
    letterPatterns: 'ear (clear), eer (tier), ere (here), ia (material)',
    exampleWords: ['clear', 'tier', 'period', 'here', 'material'],
    sentenceSample: 'Clear cache buffers during peak period.',
    commonErrors: 'Dropping the central schwa offglide.',
    pronunciationTips: 'Glide from high front /ɪ/ down to central relaxing schwa /ə/.'
  },
  {
    symbol: '/eə/',
    name: 'Centering Diphthong (Square / Hair)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Mid-Central',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'Mid-Front gliding to Mid-Central',
    lipPosition: 'Medium Spread to Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'are (declare, hardware), air (pair), ear (bear)',
    exampleWords: ['variable', 'declare', 'hardware', 'hair', 'parent'],
    sentenceSample: 'Declare global variable parameters in hardware.',
    commonErrors: 'Monophthongizing to /e/ or over-rhoticizing.',
    pronunciationTips: 'Glide from mid-front /e/ down to central relaxed /ə/.'
  },
  {
    symbol: '/ʊə/',
    name: 'Centering Diphthong (Cure / Pure)',
    category: 'diphthong',
    categoryLabel: 'Diphthong',
    voicing: 'Voiced',
    placeOfArticulation: 'Glide Back-Central',
    mannerOfArticulation: 'Diphthong Vowel',
    tonguePosition: 'High-Back gliding to Mid-Central',
    lipPosition: 'Rounded to Neutral',
    jawPosition: 'Closing to Half Open',
    letterPatterns: 'ure (secure, pure), ual (dual), oor (poor)',
    exampleWords: ['secure', 'pure', 'dual', 'tour', 'frequent'],
    sentenceSample: 'Ensure dual secure socket layer encryption.',
    commonErrors: 'Replacing with /ɔː/ ("shore" instead of "sure").',
    pronunciationTips: 'Glide from back rounded /ʊ/ down to schwa /ə/.'
  },

  // Consonants
  {
    symbol: '/p/',
    name: 'Unvoiced Bilabial Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Bilabial (Both Lips)',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Resting in lower mouth',
    lipPosition: 'Firmly Closed -> Sudden Release',
    jawPosition: 'Closed to Slightly Open',
    letterPatterns: 'p (packet, program), pp (apple)',
    exampleWords: ['packet', 'program', 'port', 'pin', 'compiler'],
    sentenceSample: 'Process the port packet program through compiler.',
    commonErrors: 'Lack of aspiration (puff of air) in initial position.',
    pronunciationTips: 'Press lips together, build air pressure, release with sudden unvoiced burst.'
  },
  {
    symbol: '/b/',
    name: 'Voiced Bilabial Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Voiced',
    placeOfArticulation: 'Bilabial (Both Lips)',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Resting in lower mouth',
    lipPosition: 'Firmly Closed -> Sudden Release',
    jawPosition: 'Closed to Slightly Open',
    letterPatterns: 'b (buffer, byte), bb (ribbon)',
    exampleWords: ['buffer', 'byte', 'binary', 'bin', 'bus'],
    sentenceSample: 'Buffer binary byte transfers on the system bus.',
    commonErrors: 'Devoicing final /b/ or weak vocal cord vibration.',
    pronunciationTips: 'Press lips together, vibrate vocal cords as you release air explosion.'
  },
  {
    symbol: '/t/',
    name: 'Unvoiced Alveolar Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Tongue tip against Alveolar Ridge',
    lipPosition: 'Neutral',
    jawPosition: 'Slightly Open',
    letterPatterns: 't (terminal, table), tt (pattern), ed (passed)',
    exampleWords: ['terminal', 'table', 'thread', 'time', 'text'],
    sentenceSample: 'Terminal thread table active.',
    commonErrors: 'Replacing with dental /t̪/ (touching teeth instead of ridge).',
    pronunciationTips: 'Touch tongue tip behind upper front teeth on gum ridge, release air burst.'
  },
  {
    symbol: '/d/',
    name: 'Voiced Alveolar Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Voiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Tongue tip against Alveolar Ridge',
    lipPosition: 'Neutral',
    jawPosition: 'Slightly Open',
    letterPatterns: 'd (database, driver), dd (address)',
    exampleWords: ['database', 'data', 'driver', 'door', 'node'],
    sentenceSample: 'Database driver initializes data nodes.',
    commonErrors: 'Substituting dental /d̪/ or weak voicing.',
    pronunciationTips: 'Tap tongue tip on alveolar ridge with vocal cord vibration.'
  },
  {
    symbol: '/k/',
    name: 'Unvoiced Velar Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Velar (Soft Palate)',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Back of tongue against Soft Palate',
    lipPosition: 'Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'k (key, kernel), c (cat, cache), ck (packet), ch (architecture)',
    exampleWords: ['key', 'kernel', 'cache', 'cat', 'code'],
    sentenceSample: 'Cache key kernel memory code.',
    commonErrors: 'Inadequate aspiration in initial position.',
    pronunciationTips: 'Raise back of tongue against soft palate, release unvoiced air burst.'
  },
  {
    symbol: '/ɡ/',
    name: 'Voiced Velar Plosive',
    category: 'consonant',
    categoryLabel: 'Consonant (Plosive)',
    voicing: 'Voiced',
    placeOfArticulation: 'Velar (Soft Palate)',
    mannerOfArticulation: 'Plosive / Stop',
    tonguePosition: 'Back of tongue against Soft Palate',
    lipPosition: 'Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'g (gateway, graph, group), gg (logging)',
    exampleWords: ['gateway', 'graph', 'group', 'git', 'algorithm'],
    sentenceSample: 'Git gateway graph group active in algorithm.',
    commonErrors: 'Devoicing at word endings.',
    pronunciationTips: 'Raise back tongue against soft palate, vibrate vocal cords on release.'
  },
  {
    symbol: '/f/',
    name: 'Unvoiced Labiodental Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Labiodental (Lower Lip + Upper Teeth)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Resting neutrally',
    lipPosition: 'Lower lip against upper incisors',
    jawPosition: 'Slightly Open',
    letterPatterns: 'f (file, function), ff (buffer), ph (photo), gh (rough)',
    exampleWords: ['function', 'field', 'file', 'fan', 'format'],
    sentenceSample: 'Function file field format initialized.',
    commonErrors: 'Confusing with bilabial /p/ or /v/.',
    pronunciationTips: 'Rest upper teeth gently on inside of lower lip, blow continuous air.'
  },
  {
    symbol: '/v/',
    name: 'Voiced Labiodental Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Voiced',
    placeOfArticulation: 'Labiodental (Lower Lip + Upper Teeth)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Resting neutrally',
    lipPosition: 'Lower lip against upper incisors',
    jawPosition: 'Slightly Open',
    letterPatterns: 'v (variable, vector, version)',
    exampleWords: ['variable', 'vector', 'version', 'van', 'virtual'],
    sentenceSample: 'Variable vector version verified in virtual lab.',
    commonErrors: 'CRITICAL MTI ERROR: Substituting bilabial /w/ ("wector" for "vector").',
    pronunciationTips: 'Upper teeth MUST touch lower lip. Vibrate vocal cords like a motor.'
  },
  {
    symbol: '/θ/',
    name: 'Unvoiced Dental Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Dental (Interdental Tongue Tip)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue tip between upper and lower front teeth',
    lipPosition: 'Unrounded Neutral',
    jawPosition: 'Slightly Open',
    letterPatterns: 'th (thin, thread, throughput, thesis, method)',
    exampleWords: ['thread', 'throughput', 'thesis', 'thin', 'method'],
    sentenceSample: 'Thread throughput thesis method verified.',
    commonErrors: 'CRITICAL MTI ERROR: Replacing with dental plosive /t̪/ ("trid" or "tin").',
    pronunciationTips: 'Place tongue tip between teeth! Push continuous hiss of air.'
  },
  {
    symbol: '/ð/',
    name: 'Voiced Dental Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Voiced',
    placeOfArticulation: 'Dental (Interdental Tongue Tip)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue tip between upper and lower front teeth',
    lipPosition: 'Unrounded Neutral',
    jawPosition: 'Slightly Open',
    letterPatterns: 'th (this, that, other, algorithm, weather)',
    exampleWords: ['this', 'that', 'other', 'algorithm', 'either'],
    sentenceSample: 'This database handles that algorithm.',
    commonErrors: 'CRITICAL MTI ERROR: Replacing with dental plosive /d̪/ ("dis" or "dat").',
    pronunciationTips: 'Tongue tip gently between teeth, add vocal cord vibration buzz.'
  },
  {
    symbol: '/s/',
    name: 'Unvoiced Alveolar Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue tip near alveolar ridge forming narrow channel',
    lipPosition: 'Slightly Spread',
    jawPosition: 'Teeth close together',
    letterPatterns: 's (syntax, system), ss (process), c (cell, cipher)',
    exampleWords: ['syntax', 'system', 'server', 'sip', 'script'],
    sentenceSample: 'Syntax system server script check.',
    commonErrors: 'Adding initial vowel sound (saying "is-system").',
    pronunciationTips: 'Bring teeth together, force continuous unvoiced hiss over tongue tip.'
  },
  {
    symbol: '/z/',
    name: 'Voiced Alveolar Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Voiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue tip near alveolar ridge forming narrow channel',
    lipPosition: 'Slightly Spread',
    jawPosition: 'Teeth close together',
    letterPatterns: 'z (zero, zone), s (is, optimized, user, files)',
    exampleWords: ['zero', 'zone', 'optimize', 'zip', 'user'],
    sentenceSample: 'Zero zone optimizes user files.',
    commonErrors: 'Devoicing to /s/ in plural noun endings.',
    pronunciationTips: 'Teeth together, vibrate vocal cords continuously like a bee buzzing.'
  },
  {
    symbol: '/ʃ/',
    name: 'Unvoiced Post-Alveolar Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Post-Alveolar (Palato-Alveolar)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue blade pulled back towards hard palate',
    lipPosition: 'Gently Rounded / Flared',
    jawPosition: 'Close Together',
    letterPatterns: 'sh (shell, shortcut), ch (machine), ti (action), ss (expression)',
    exampleWords: ['shell', 'schema', 'shortcut', 'ship', 'machine'],
    sentenceSample: 'Shell schema shortcut key active.',
    commonErrors: 'Substituting /s/ ("sell" for "shell").',
    pronunciationTips: 'Flare lips slightly, pull tongue back, produce soft "sh" air stream.'
  },
  {
    symbol: '/ʒ/',
    name: 'Voiced Post-Alveolar Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Voiced',
    placeOfArticulation: 'Post-Alveolar (Palato-Alveolar)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Tongue blade pulled back towards hard palate',
    lipPosition: 'Gently Rounded / Flared',
    jawPosition: 'Close Together',
    letterPatterns: 's (decision, version, measure, pleasure), z (azure)',
    exampleWords: ['decision', 'version', 'closure', 'measure', 'precision'],
    sentenceSample: 'Decision closure version released with high precision.',
    commonErrors: 'Replacing with /z/ or /dʒ/.',
    pronunciationTips: 'Same position as /ʃ/ but add strong vocal cord vibration ("zh").'
  },
  {
    symbol: '/h/',
    name: 'Unvoiced Glottal Fricative',
    category: 'consonant',
    categoryLabel: 'Consonant (Fricative)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Glottal (Vocal Folds / Throat)',
    mannerOfArticulation: 'Fricative',
    tonguePosition: 'Takes shape of following vowel',
    lipPosition: 'Takes shape of following vowel',
    jawPosition: 'Open according to following vowel',
    letterPatterns: 'h (header, heap, hash)',
    exampleWords: ['header', 'heap', 'hash', 'hat', 'host'],
    sentenceSample: 'Header hash heap table on server host.',
    commonErrors: 'Omitting sound or over-straining glottis.',
    pronunciationTips: 'Open glottis, exhale gentle breath of friction from back of throat.'
  },
  {
    symbol: '/tʃ/',
    name: 'Unvoiced Post-Alveolar Affricate',
    category: 'consonant',
    categoryLabel: 'Consonant (Affricate)',
    voicing: 'Unvoiced',
    placeOfArticulation: 'Post-Alveolar',
    mannerOfArticulation: 'Affricate (Stop + Fricative Combination)',
    tonguePosition: 'Alveolar stop position moving to post-alveolar friction',
    lipPosition: 'Slightly Rounded',
    jawPosition: 'Closing',
    letterPatterns: 'ch (checksum, chart, chunk), tch (switch), t (future)',
    exampleWords: ['checksum', 'chart', 'chunk', 'chin', 'architecture'],
    sentenceSample: 'Checksum chart chunk size processed.',
    commonErrors: 'Replacing with pure fricative /ʃ/.',
    pronunciationTips: 'Start with /t/ stop, instantly burst into /ʃ/ friction stream.'
  },
  {
    symbol: '/dʒ/',
    name: 'Voiced Post-Alveolar Affricate',
    category: 'consonant',
    categoryLabel: 'Consonant (Affricate)',
    voicing: 'Voiced',
    placeOfArticulation: 'Post-Alveolar',
    mannerOfArticulation: 'Affricate (Stop + Fricative Combination)',
    tonguePosition: 'Alveolar stop position moving to post-alveolar friction',
    lipPosition: 'Slightly Rounded',
    jawPosition: 'Closing',
    letterPatterns: 'j (JSON, java, job), g (digital, logic), dge (bridge)',
    exampleWords: ['JSON', 'Java', 'job', 'jam', 'digital'],
    sentenceSample: 'JSON Java job queue in digital lab.',
    commonErrors: 'Devoicing to /tʃ/ or replacing with approximant /j/.',
    pronunciationTips: 'Start with voiced /d/ stop, immediately release into voiced /ʒ/.'
  },
  {
    symbol: '/m/',
    name: 'Voiced Bilabial Nasal',
    category: 'consonant',
    categoryLabel: 'Consonant (Nasal)',
    voicing: 'Voiced',
    placeOfArticulation: 'Bilabial (Both Lips)',
    mannerOfArticulation: 'Nasal (Air passes through Nose)',
    tonguePosition: 'Resting in lower mouth',
    lipPosition: 'Firmly Closed',
    jawPosition: 'Closed',
    letterPatterns: 'm (memory, method), mm (command)',
    exampleWords: ['memory', 'method', 'module', 'man', 'mainframe'],
    sentenceSample: 'Memory method module loaded on mainframe.',
    commonErrors: 'Opening lips too early or choking nasal airflow.',
    pronunciationTips: 'Close lips completely, lower velum so voiced air resonates through nose.'
  },
  {
    symbol: '/n/',
    name: 'Voiced Alveolar Nasal',
    category: 'consonant',
    categoryLabel: 'Consonant (Nasal)',
    voicing: 'Voiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Nasal',
    tonguePosition: 'Tongue tip seals Alveolar Ridge',
    lipPosition: 'Neutral / Slightly Open',
    jawPosition: 'Slightly Open',
    letterPatterns: 'n (node, network), nn (scanner), kn (knowledge)',
    exampleWords: ['node', 'network', 'null', 'net', 'syntax'],
    sentenceSample: 'Node network null check active.',
    commonErrors: 'Nasalizing preceding vowels excessively.',
    pronunciationTips: 'Seal tongue tip on alveolar ridge, direct voiced airflow out nasal cavity.'
  },
  {
    symbol: '/ŋ/',
    name: 'Voiced Velar Nasal',
    category: 'consonant',
    categoryLabel: 'Consonant (Nasal)',
    voicing: 'Voiced',
    placeOfArticulation: 'Velar (Soft Palate)',
    mannerOfArticulation: 'Nasal',
    tonguePosition: 'Back of tongue seals against Soft Palate',
    lipPosition: 'Neutral',
    jawPosition: 'Half Open',
    letterPatterns: 'ng (ping, string, encoding), n before k/g (bank, sink)',
    exampleWords: ['ping', 'string', 'encoding', 'sing', 'link'],
    sentenceSample: 'Ping string encoding link verified.',
    commonErrors: 'Adding hard /ɡ/ or /k/ sound at the end (saying "sing-g").',
    pronunciationTips: 'Press back of tongue to soft palate, let nasal voice flow without releasing tongue.'
  },
  {
    symbol: '/l/',
    name: 'Voiced Alveolar Lateral Approximant',
    category: 'consonant',
    categoryLabel: 'Consonant (Lateral)',
    voicing: 'Voiced',
    placeOfArticulation: 'Alveolar Ridge',
    mannerOfArticulation: 'Lateral Approximant (Air flows around sides of tongue)',
    tonguePosition: 'Tongue tip touches Alveolar Ridge, sides lowered',
    lipPosition: 'Neutral',
    jawPosition: 'Slightly Open',
    letterPatterns: 'l (logic, loop), ll (parallel)',
    exampleWords: ['logic', 'library', 'loop', 'leg', 'parallel'],
    sentenceSample: 'Logic library loop check in parallel.',
    commonErrors: 'Confusing light /l/ (front) and dark /ɫ/ (back of tongue).',
    pronunciationTips: 'Touch tongue tip to ridge behind teeth, let air stream bypass sides.'
  },
  {
    symbol: '/r/',
    name: 'Voiced Post-Alveolar Approximant',
    category: 'consonant',
    categoryLabel: 'Consonant (Approximant)',
    voicing: 'Voiced',
    placeOfArticulation: 'Post-Alveolar',
    mannerOfArticulation: 'Approximant',
    tonguePosition: 'Tongue tip curled back slightly without touching palate roof',
    lipPosition: 'Slightly Rounded',
    jawPosition: 'Half Open',
    letterPatterns: 'r (route, runtime), rr (array), wr (write)',
    exampleWords: ['route', 'runtime', 'recursive', 'red', 'RAM'],
    sentenceSample: 'Route runtime recursive function.',
    commonErrors: 'Trilling/rolling tongue tip against teeth (flapped /r/).',
    pronunciationTips: 'Never let tongue tip touch mouth roof! Curl back slightly and vibrate vocal cords.'
  },
  {
    symbol: '/j/',
    name: 'Voiced Palatal Approximant',
    category: 'consonant',
    categoryLabel: 'Consonant (Approximant)',
    voicing: 'Voiced',
    placeOfArticulation: 'Palatal (Hard Palate)',
    mannerOfArticulation: 'Approximant (Glide)',
    tonguePosition: 'Middle of tongue raised high towards Hard Palate',
    lipPosition: 'Spread to Neutral',
    jawPosition: 'Closing gesture',
    letterPatterns: 'y (yield), u (user, utility), ew (few)',
    exampleWords: ['yield', 'utility', 'user', 'yes', 'cpu'],
    sentenceSample: 'Yield utility user session on CPU.',
    commonErrors: 'Pronouncing like fricative /dʒ/ ("joozer" for "user").',
    pronunciationTips: 'Smooth vowel-like glide from high front tongue position into following vowel.'
  },
  {
    symbol: '/w/',
    name: 'Voiced Labial-Velar Approximant',
    category: 'consonant',
    categoryLabel: 'Consonant (Approximant)',
    voicing: 'Voiced',
    placeOfArticulation: 'Labial-Velar (Lips + Soft Palate)',
    mannerOfArticulation: 'Approximant (Glide)',
    tonguePosition: 'Back of tongue raised towards Soft Palate',
    lipPosition: 'Tightly Rounded Pucker',
    jawPosition: 'Closing gesture',
    letterPatterns: 'w (web, worker), wh (what, wireframe), u (query)',
    exampleWords: ['web', 'wireframe', 'worker', 'win', 'wavelength'],
    sentenceSample: 'Web wireframe worker thread on short wavelength.',
    commonErrors: 'CRITICAL MTI ERROR: Touching teeth to lower lip like /v/ ("veb" for "web").',
    pronunciationTips: 'DO NOT touch teeth to lips! Pucker both lips into a small circle ring.'
  }
];

// Dictionary Search database for Unit 4 (Pronunciation Explorer)
export interface DictionaryItem {
  word: string;
  ipa: string;
  syllables: string[];
  primaryStressIndex: number;
  category: string;
  definition: string;
  sampleSentence: string;
}

export const SEARCHABLE_DICTIONARY: DictionaryItem[] = [
  {
    word: 'algorithm',
    ipa: '/ˈæl.ɡə.rɪ.ðəm/',
    syllables: ['al', 'go', 'rithm'],
    primaryStressIndex: 0,
    category: 'Computer Science',
    definition: 'A step-by-step procedure or formula for solving a problem.',
    sampleSentence: 'The search algorithm processes query terms in logarithmic time.'
  },
  {
    word: 'architecture',
    ipa: '/ˈɑː.kɪ.tek.tʃər/',
    syllables: ['ar', 'chi', 'tec', 'ture'],
    primaryStressIndex: 0,
    category: 'Software Engineering',
    definition: 'The fundamental structure and layout of a software system.',
    sampleSentence: 'Microservices architecture enables independent deployment.'
  },
  {
    word: 'asynchronous',
    ipa: '/eɪˈsɪŋ.krə.nəs/',
    syllables: ['a', 'syn', 'chro', 'nous'],
    primaryStressIndex: 1,
    category: 'Networking & Systems',
    definition: 'Executing operations independently of the main application thread.',
    sampleSentence: 'Asynchronous callbacks handle non-blocking database queries.'
  },
  {
    word: 'circuit',
    ipa: '/ˈsɜː.kɪt/',
    syllables: ['cir', 'cuit'],
    primaryStressIndex: 0,
    category: 'Electronics',
    definition: 'A closed path through which electric current can flow.',
    sampleSentence: 'Integrated circuits house millions of transistors.'
  },
  {
    word: 'database',
    ipa: '/ˈdeɪ.tə.beɪs/',
    syllables: ['da', 'ta', 'base'],
    primaryStressIndex: 0,
    category: 'Data Management',
    definition: 'An organized collection of structured information or data.',
    sampleSentence: 'The relational database guarantees transactional consistency.'
  },
  {
    word: 'microprocessor',
    ipa: '/ˈmaɪ.krəʊˌprəʊ.ses.ər/',
    syllables: ['mi', 'cro', 'pro', 'ces', 'sor'],
    primaryStressIndex: 2,
    category: 'Hardware',
    definition: 'An integrated circuit containing CPU functions on a single chip.',
    sampleSentence: 'The multi-core microprocessor executes instruction pipelines.'
  },
  {
    word: 'synchronous',
    ipa: '/ˈsɪŋ.krə.nəs/',
    syllables: ['syn', 'chro', 'nous'],
    primaryStressIndex: 0,
    category: 'Systems',
    definition: 'Occurring or operating at the same time or rate.',
    sampleSentence: 'Synchronous replication ensures zero data loss across nodes.'
  },
  {
    word: 'throughput',
    ipa: '/ˈθruː.pʊt/',
    syllables: ['through', 'put'],
    primaryStressIndex: 0,
    category: 'Networks',
    definition: 'The rate of successful message delivery over a communication channel.',
    sampleSentence: 'Network throughput increased after upgrading fiber cables.'
  },
  {
    word: 'variable',
    ipa: '/ˈveə.ri.ə.bəl/',
    syllables: ['va', 'ri', 'a', 'ble'],
    primaryStressIndex: 0,
    category: 'Programming',
    definition: 'A named storage location containing a value that can change.',
    sampleSentence: 'Declare local variables with explicit TypeScript types.'
  },
  {
    word: 'wavelength',
    ipa: '/ˈweɪv.leŋθ/',
    syllables: ['wave', 'length'],
    primaryStressIndex: 0,
    category: 'Physics & Telecom',
    definition: 'The distance between successive crests of a wave.',
    sampleSentence: 'Fiber optics transmit data using modulated laser wavelengths.'
  }
];

interface SpeechSoundFoundationsPhaseAProps {
  accent?: 'en-US' | 'en-GB';
  onCompletePhase?: () => void;
  onSaveWork?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioDataUrl: string) => void;
}

export const SpeechSoundFoundationsPhaseA: React.FC<SpeechSoundFoundationsPhaseAProps> = ({
  accent = 'en-US',
  onCompletePhase,
  onSaveWork,
  onSaveRecording
}) => {
  // Navigation across 5 Guided Learning Units
  const [activeUnit, setActiveUnit] = useState<number>(1);
  const [completedUnits, setCompletedUnits] = useState<number[]>([1]);

  // Unit 1: Interactive IPA Explorer state
  const [ipaCategoryTab, setIpaCategoryTab] = useState<'short_vowel' | 'long_vowel' | 'diphthong' | 'consonant'>('short_vowel');
  const [selectedIpaSound, setSelectedIpaSound] = useState<SoundDetail>(MASTER_FOUNDATION_SOUNDS[0]);
  const [isUnit1Recording, setIsUnit1Recording] = useState(false);
  const [unit1AudioUrl, setUnit1AudioUrl] = useState<string | null>(null);
  const [unit1Evaluation, setUnit1Evaluation] = useState<PronunciationFeedback | null>(null);
  const [isEvaluatingUnit1, setIsEvaluatingUnit1] = useState(false);

  // Unit 2: Speech Sound Library filter
  const [libraryFilterCategory, setLibraryFilterCategory] = useState<string>('all');
  const [librarySearch, setLibrarySearch] = useState<string>('');

  // Unit 3: Articulation Studio state
  const [selectedArticSound, setSelectedArticSound] = useState<SoundDetail>(MASTER_FOUNDATION_SOUNDS[8]); // /iː/

  // Unit 4: Pronunciation Explorer state
  const [explorerSearch, setExplorerSearch] = useState<string>('algorithm');
  const [selectedDictItem, setSelectedDictItem] = useState<DictionaryItem>(SEARCHABLE_DICTIONARY[0]);
  const [isExplorerRecording, setIsExplorerRecording] = useState(false);
  const [explorerAudioUrl, setExplorerAudioUrl] = useState<string | null>(null);
  const [explorerEval, setExplorerEval] = useState<PronunciationFeedback | null>(null);
  const [savedToNotebook, setSavedToNotebook] = useState(false);

  // Unit 5: Foundation Assessment state
  const [quizPart1Answer, setQuizPart1Answer] = useState<number | null>(null);
  const [quizPart2Answer, setQuizPart2Answer] = useState<number | null>(null);
  const [assessmentAudio1, setAssessmentAudio1] = useState<string | null>(null);
  const [assessmentAudio2, setAssessmentAudio2] = useState<string | null>(null);
  const [isRecordingPart3, setIsRecordingPart3] = useState(false);
  const [isRecordingPart4, setIsRecordingPart4] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScoreCard, setAssessmentScoreCard] = useState<{
    ipaRecognition: number;
    listeningDiscrimination: number;
    phonemeClarity: number;
    wordStress: number;
    overallPercentage: number;
  } | null>(null);

  // Completion Badge Modal
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);

  // MediaRecorder Ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // TTS Helper
  const playNativeTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = accent;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Recording Helper
  const startRecordingStream = async (onFinish: (audioUrl: string) => void) => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const url = reader.result as string;
          onFinish(url);
        };
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
    } catch {
      alert('Microphone access is required for speech recording.');
    }
  };

  const stopRecordingStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Unit 1 Recording Handler
  const handleToggleUnit1Recording = () => {
    if (isUnit1Recording) {
      setIsUnit1Recording(false);
      stopRecordingStream();
    } else {
      setIsUnit1Recording(true);
      setUnit1Evaluation(null);
      startRecordingStream(async (audioUrl) => {
        setUnit1AudioUrl(audioUrl);
        setIsEvaluatingUnit1(true);
        const feedback = await analyzePronunciation({
          targetPhrase: selectedIpaSound.exampleWords[0] || selectedIpaSound.symbol,
          audioBlobUrl: audioUrl
        });
        setUnit1Evaluation(feedback);
        setIsEvaluatingUnit1(false);
      });
    }
  };

  // Unit 4 Recording Handler
  const handleToggleExplorerRecording = () => {
    if (isExplorerRecording) {
      setIsExplorerRecording(false);
      stopRecordingStream();
    } else {
      setIsExplorerRecording(true);
      setExplorerEval(null);
      startRecordingStream(async (audioUrl) => {
        setExplorerAudioUrl(audioUrl);
        const fb = await analyzePronunciation({
          targetPhrase: selectedDictItem.word,
          audioBlobUrl: audioUrl
        });
        setExplorerEval(fb);
      });
    }
  };

  const handleSaveExplorerToNotebook = () => {
    setSavedToNotebook(true);
    if (onSaveWork) {
      onSaveWork(
        `Pronunciation Explorer: ${selectedDictItem.word}`,
        `Word: ${selectedDictItem.word}\nIPA: ${selectedDictItem.ipa}\nBreakdown: ${selectedDictItem.syllables.join(' · ')}\nDefinition: ${selectedDictItem.definition}`
      );
    }
  };

  // Unit 5 Recording Handlers
  const handleToggleAssessmentPart3 = () => {
    if (isRecordingPart3) {
      setIsRecordingPart3(false);
      stopRecordingStream();
    } else {
      setIsRecordingPart3(true);
      startRecordingStream((url) => setAssessmentAudio1(url));
    }
  };

  const handleToggleAssessmentPart4 = () => {
    if (isRecordingPart4) {
      setIsRecordingPart4(false);
      stopRecordingStream();
    } else {
      setIsRecordingPart4(true);
      startRecordingStream((url) => setAssessmentAudio2(url));
    }
  };

  // Assessment Submission
  const handleCalculateAssessment = () => {
    const ipaScore = quizPart1Answer === 2 ? 100 : 50;
    const listScore = quizPart2Answer === 1 ? 100 : 50;
    const phonemeScore = assessmentAudio1 ? 90 : 60;
    const wordScore = assessmentAudio2 ? 92 : 60;
    const overall = Math.round((ipaScore + listScore + phonemeScore + wordScore) / 4);

    setAssessmentScoreCard({
      ipaRecognition: ipaScore,
      listeningDiscrimination: listScore,
      phonemeClarity: phonemeScore,
      wordStress: wordScore,
      overallPercentage: overall
    });
    setAssessmentSubmitted(true);
    setShowCompletionBadge(true);
    setCompletedUnits([1, 2, 3, 4, 5]);

    if (onSaveWork) {
      onSaveWork(
        'Phase A: Speech Sound Foundations Assessment',
        `Overall Foundation Assessment Score: ${overall}%\nIPA Recognition: ${ipaScore}%\nListening Discrimination: ${listScore}%\nPhoneme Clarity: ${phonemeScore}%\nWord Stress: ${wordScore}%`
      );
    }
  };

  const handleNavigateUnit = (unitNum: number) => {
    setActiveUnit(unitNum);
    if (!completedUnits.includes(unitNum)) {
      setCompletedUnits((prev) => [...prev, unitNum]);
    }
  };

  const filteredLibrarySounds = MASTER_FOUNDATION_SOUNDS.filter((s) => {
    const matchesCategory = libraryFilterCategory === 'all' || s.category === libraryFilterCategory;
    const matchesSearch =
      s.symbol.toLowerCase().includes(librarySearch.toLowerCase()) ||
      s.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      s.exampleWords.some((w) => w.toLowerCase().includes(librarySearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredDictItems = SEARCHABLE_DICTIONARY.filter(
    (d) =>
      d.word.toLowerCase().includes(explorerSearch.toLowerCase()) ||
      d.ipa.toLowerCase().includes(explorerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* TOP BANNER */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <Volume2 className="w-64 h-64 text-[#D35400]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-2.5 py-1 rounded">
                Journey 1 • Module 01
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16A085] bg-[#E8F8F5] border border-[#A3E4D7] px-2.5 py-1 rounded">
                Phase A: Speech Sound Foundations
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#D35400] font-heading flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D35400]" />
              <span>Speech Sound Foundations</span>
            </h1>
            <p className="text-xs text-[#5D6D7E] mt-1 max-w-2xl">
              Master the foundational 44 International Phonetic Alphabet (IPA) phonemes, articulatory gestures,
              and sound mechanics before progressing to accent neutralization and complex word stress.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0]">
            <Trophy className="w-8 h-8 text-[#D35400]" />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#7F8C8D]">Phase Progress</p>
              <p className="text-sm font-extrabold text-[#D35400] font-mono">
                {Math.round((completedUnits.length / 5) * 100)}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* GUIDED SEQUENCE NAVIGATOR */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { id: 1, name: 'Unit 1: IPA Explorer', icon: Radio },
            { id: 2, name: 'Unit 2: Sound Library', icon: BookOpen },
            { id: 3, name: 'Unit 3: Articulation Studio', icon: Activity },
            { id: 4, name: 'Unit 4: Pronunciation Explorer', icon: Search },
            { id: 5, name: 'Unit 5: Foundation Assessment', icon: Award }
          ].map((u) => {
            const Icon = u.icon;
            const isActive = activeUnit === u.id;
            const isDone = completedUnits.includes(u.id);

            return (
              <button
                key={u.id}
                onClick={() => handleNavigateUnit(u.id)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-md'
                    : isDone
                    ? 'bg-[#E8F8F5] text-[#16A085] border-[#A3E4D7] hover:bg-[#D1F2EB]'
                    : 'bg-slate-50 text-[#5D6D7E] border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDone ? 'text-[#16A085]' : 'text-[#7F8C8D]'}`} />
                  {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A085]" />}
                  {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </div>
                <span className="text-xs font-bold leading-tight">{u.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* UNIT 1: INTERACTIVE IPA EXPLORER */}
      {activeUnit === 1 && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#FAD7A0] pb-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-[#D35400] font-heading flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#D35400]" />
                  <span>Unit 1 – Interactive IPA Explorer</span>
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  Select any phonetic symbol to listen to native audio, review articulation mechanics, and evaluate your sound production using AI.
                </p>
              </div>

              {/* Sound Category Tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'short_vowel', label: 'Short Vowels' },
                  { id: 'long_vowel', label: 'Long Vowels' },
                  { id: 'diphthong', label: 'Diphthongs' },
                  { id: 'consonant', label: 'Consonants' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const cat = tab.id as any;
                      setIpaCategoryTab(cat);
                      const first = MASTER_FOUNDATION_SOUNDS.find((s) => s.category === cat);
                      if (first) setSelectedIpaSound(first);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      ipaCategoryTab === tab.id
                        ? 'bg-[#D35400] text-white shadow-sm'
                        : 'text-[#5D6D7E] hover:text-[#2C3E50]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IPA GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 mb-6">
              {MASTER_FOUNDATION_SOUNDS.filter((s) => s.category === ipaCategoryTab).map((sound) => {
                const isSelected = selectedIpaSound.symbol === sound.symbol;

                return (
                  <button
                    key={sound.symbol}
                    onClick={() => setSelectedIpaSound(sound)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'bg-[#FFF8F0] border-[#D35400] shadow-md ring-2 ring-[#D35400]/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-[#FAD7A0]'
                    }`}
                  >
                    <span className="text-xl font-extrabold font-mono text-[#2C3E50] block">{sound.symbol}</span>
                    <span className="text-[10px] text-[#7F8C8D] font-medium block truncate mt-1">
                      {sound.exampleWords[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SELECTED PHONEME CARD */}
            <div className="p-6 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#D35400] text-white flex items-center justify-center font-mono font-extrabold text-2xl shadow-md">
                    {selectedIpaSound.symbol}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded">
                      {selectedIpaSound.categoryLabel}
                    </span>
                    <h3 className="text-base font-extrabold text-[#2C3E50] mt-1">{selectedIpaSound.name}</h3>
                    <p className="text-xs text-[#7F8C8D]">{selectedIpaSound.placeOfArticulation} • {selectedIpaSound.voicing}</p>
                  </div>
                </div>

                {/* Native Audio Player */}
                <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3">
                  <p className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#D35400]" />
                    <span>Native Model Audio</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playNativeTTS(selectedIpaSound.exampleWords[0])}
                      className="px-3 py-2 bg-[#D35400] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#E67E22]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Word ({selectedIpaSound.exampleWords[0]})</span>
                    </button>

                    <button
                      onClick={() => playNativeTTS(selectedIpaSound.sentenceSample)}
                      className="px-3 py-2 bg-slate-100 text-[#2C3E50] rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Play Sentence</span>
                    </button>
                  </div>
                </div>

                {/* Example Words */}
                <div>
                  <p className="text-xs font-bold text-[#2C3E50] mb-2">Example Words:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIpaSound.exampleWords.map((word) => (
                      <span
                        key={word}
                        onClick={() => playNativeTTS(word)}
                        className="cursor-pointer px-2.5 py-1 bg-white border border-[#FAD7A0] text-xs font-semibold text-[#2C3E50] rounded-lg hover:border-[#D35400] hover:text-[#D35400] transition-colors"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Articulation Guidance */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#FAD7A0]">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#D35400] flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Speech Articulation Rules</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <p><strong className="text-[#2C3E50]">Tongue Position:</strong> {selectedIpaSound.tonguePosition}</p>
                  <p><strong className="text-[#2C3E50]">Lip Shape:</strong> {selectedIpaSound.lipPosition}</p>
                  <p><strong className="text-[#2C3E50]">Jaw Opening:</strong> {selectedIpaSound.jawPosition}</p>
                  <p><strong className="text-[#2C3E50]">Spelling Patterns:</strong> {selectedIpaSound.letterPatterns}</p>
                </div>

                <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                  <p className="text-[11px] text-[#2C3E50] italic">
                    &ldquo;{selectedIpaSound.pronunciationTips}&rdquo;
                  </p>
                </div>
              </div>

              {/* Record & AI Evaluation */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#FAD7A0]">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16A085] flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  <span>AI Speech Evaluation</span>
                </h4>

                <p className="text-xs text-[#5D6D7E]">
                  Record your voice pronouncing <strong>&ldquo;{selectedIpaSound.exampleWords[0]}&rdquo;</strong> to receive instant phonetic feedback.
                </p>

                <button
                  onClick={handleToggleUnit1Recording}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    isUnit1Recording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-[#16A085] text-white hover:bg-[#117A65]'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isUnit1Recording ? 'Stop Recording Voice...' : 'Record Voice Sample'}</span>
                </button>

                {isEvaluatingUnit1 && (
                  <p className="text-xs text-[#D35400] font-bold flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Engine analyzing phoneme resonance...</span>
                  </p>
                )}

                {unit1Evaluation && !isEvaluatingUnit1 && (
                  <div className="p-3 bg-[#E8F8F5] border border-[#A3E4D7] rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#16A085]">AI Phonetic Accuracy</span>
                      <span className="text-sm font-extrabold text-[#16A085] font-mono">{unit1Evaluation.score}%</span>
                    </div>
                    <p className="text-xs text-[#2C3E50]">{unit1Evaluation.overallFeedback}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleNavigateUnit(2)}
                className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#E67E22] transition-colors"
              >
                <span>Continue to Unit 2: Speech Sound Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT 2: SPEECH SOUND LIBRARY */}
      {activeUnit === 2 && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#FAD7A0] pb-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-[#D35400] font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D35400]" />
                  <span>Unit 2 – Speech Sound Library</span>
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  Browse reusable reference cards containing letter patterns, native audio models, common student errors, and key tips.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <Search className="w-3.5 h-3.5 text-[#7F8C8D] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search sounds or words..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#D35400]"
                  />
                </div>

                <select
                  value={libraryFilterCategory}
                  onChange={(e) => setLibraryFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#2C3E50] font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="short_vowel">Short Vowels</option>
                  <option value="long_vowel">Long Vowels</option>
                  <option value="diphthong">Diphthongs</option>
                  <option value="consonant">Consonants</option>
                </select>
              </div>
            </div>

            {/* REFERENCE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibrarySounds.map((sound) => (
                <div
                  key={sound.symbol}
                  className="p-5 rounded-2xl bg-white border border-[#FAD7A0] hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] font-mono font-extrabold text-base rounded-lg">
                          {sound.symbol}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-[#2C3E50]">{sound.name}</p>
                          <p className="text-[10px] text-[#7F8C8D]">{sound.categoryLabel}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => playNativeTTS(sound.exampleWords[0])}
                        className="p-2 bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] rounded-lg hover:bg-[#D35400] hover:text-white transition-colors"
                        title="Play Native Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                      <p><strong className="text-[#2C3E50]">Letter Patterns:</strong> {sound.letterPatterns}</p>
                      <p><strong className="text-[#2C3E50]">Key Words:</strong> {sound.exampleWords.join(', ')}</p>
                    </div>

                    <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                      <p className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                        <Info className="w-3 h-3 text-rose-600" />
                        <span>Common Error:</span>
                      </p>
                      <p className="text-[10px] text-rose-700 leading-snug">{sound.commonErrors}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[10px] text-[#2C3E50]">
                    <strong className="text-[#D35400] block mb-0.5">Pronunciation Tip:</strong>
                    {sound.pronunciationTips}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => handleNavigateUnit(1)}
                className="px-4 py-2 border border-slate-200 text-[#5D6D7E] rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back to Unit 1
              </button>

              <button
                onClick={() => handleNavigateUnit(3)}
                className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#E67E22]"
              >
                <span>Continue to Unit 3: Articulation Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT 3: ARTICULATION STUDIO */}
      {activeUnit === 3 && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="flex justify-between items-center border-b border-[#FAD7A0] pb-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-[#D35400] font-heading flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#D35400]" />
                  <span>Unit 3 – Articulation Studio</span>
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  Detailed anatomical parameters for vocal tract articulators (Lips, Teeth, Tongue, Palate, Velum, and Vocal Cords).
                </p>
              </div>

              <select
                value={selectedArticSound.symbol}
                onChange={(e) => {
                  const s = MASTER_FOUNDATION_SOUNDS.find((snd) => snd.symbol === e.target.value);
                  if (s) setSelectedArticSound(s);
                }}
                className="px-3 py-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#D35400]"
              >
                {MASTER_FOUNDATION_SOUNDS.map((snd) => (
                  <option key={snd.symbol} value={snd.symbol}>
                    {snd.symbol} - {snd.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ORGANS OF SPEECH INTERACTIVE DIAGRAM */}
              <div>
                <OrgansOfSpeechDiagram accent={accent} />
              </div>

              {/* ARTICULATION INFORMATION PANEL */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-[#D35400] text-white flex items-center justify-center font-mono font-extrabold text-xl">
                      {selectedArticSound.symbol}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#2C3E50]">{selectedArticSound.name}</h3>
                      <p className="text-xs text-[#7F8C8D]">{selectedArticSound.categoryLabel}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Place of Articulation</span>
                      <strong className="text-[#2C3E50]">{selectedArticSound.placeOfArticulation}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Manner of Articulation</span>
                      <strong className="text-[#2C3E50]">{selectedArticSound.mannerOfArticulation}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Voicing State</span>
                      <strong className={selectedArticSound.voicing === 'Voiced' ? 'text-[#16A085]' : 'text-[#D35400]'}>
                        {selectedArticSound.voicing}
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Tongue Position</span>
                      <strong className="text-[#2C3E50]">{selectedArticSound.tonguePosition}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Lip Position</span>
                      <strong className="text-[#2C3E50]">{selectedArticSound.lipPosition}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                      <span className="text-[10px] text-[#7F8C8D] block uppercase font-bold">Jaw Position</span>
                      <strong className="text-[#2C3E50]">{selectedArticSound.jawPosition}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2">
                    <h4 className="text-xs font-bold text-[#D35400] flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      <span>Articulatory Instruction</span>
                    </h4>
                    <p className="text-xs text-[#2C3E50] leading-relaxed">
                      {selectedArticSound.sentenceSample}
                    </p>
                  </div>
                </div>

                {/* ANIMATION / DIAGRAM PLACEHOLDER */}
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7F8C8D] bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Future Animation Canvas Placeholder
                  </span>
                  <p className="text-xs text-[#5D6D7E]">
                    3D Sagittal Vocal Tract Motion Animation Ready for Next-Gen Phonetics Renderer Integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => handleNavigateUnit(2)}
                className="px-4 py-2 border border-slate-200 text-[#5D6D7E] rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back to Unit 2
              </button>

              <button
                onClick={() => handleNavigateUnit(4)}
                className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#E67E22]"
              >
                <span>Continue to Unit 4: Pronunciation Explorer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT 4: PRONUNCIATION EXPLORER */}
      {activeUnit === 4 && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#FAD7A0] pb-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-[#D35400] font-heading flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#D35400]" />
                  <span>Unit 4 – Pronunciation Explorer</span>
                </h2>
                <p className="text-xs text-[#5D6D7E] mt-0.5">
                  Look up technical terminology, inspect IPA transcriptions, syllable breakdowns, primary stress marks, and record practice attempts.
                </p>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#7F8C8D] absolute left-3 top-3" />
                <input
                  type="text"
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  placeholder="Type engineering word..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D35400] font-semibold"
                />
              </div>
            </div>

            {/* DICTIONARY LIST & DETAIL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredDictItems.map((item) => (
                  <button
                    key={item.word}
                    onClick={() => {
                      setSelectedDictItem(item);
                      setExplorerEval(null);
                      setSavedToNotebook(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedDictItem.word === item.word
                        ? 'bg-[#FFF8F0] border-[#D35400] shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-[#2C3E50]">{item.word}</span>
                      <span className="text-[10px] font-mono text-[#D35400] font-bold">{item.ipa}</span>
                    </div>
                    <span className="text-[10px] text-[#7F8C8D] block mt-0.5">{item.category}</span>
                  </button>
                ))}
              </div>

              {/* DETAILED WORD CARD */}
              <div className="md:col-span-2 p-6 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-6">
                <div className="flex items-start justify-between border-b border-[#FAD7A0] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded">
                      {selectedDictItem.category}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#2C3E50] mt-1">{selectedDictItem.word}</h3>
                    <p className="text-sm font-mono text-[#D35400] font-bold mt-1">{selectedDictItem.ipa}</p>
                  </div>

                  <button
                    onClick={() => playNativeTTS(selectedDictItem.word)}
                    className="p-3 bg-[#D35400] text-white rounded-xl shadow-sm hover:bg-[#E67E22] transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Native Audio</span>
                  </button>
                </div>

                {/* SYLLABLE BREAKDOWN & PRIMARY STRESS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-[#7F8C8D]">Syllable Breakdown</span>
                    <div className="flex items-center gap-1.5 pt-1">
                      {selectedDictItem.syllables.map((syl, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                            idx === selectedDictItem.primaryStressIndex
                              ? 'bg-[#D35400] text-white shadow-sm'
                              : 'bg-slate-100 text-[#2C3E50]'
                          }`}
                        >
                          {syl}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#7F8C8D] mt-1">
                      Primary stress on Syllable {selectedDictItem.primaryStressIndex + 1} ({selectedDictItem.syllables[selectedDictItem.primaryStressIndex].toUpperCase()})
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-[#7F8C8D]">Definition</span>
                    <p className="text-xs text-[#2C3E50] pt-1">{selectedDictItem.definition}</p>
                  </div>
                </div>

                {/* SAMPLE SENTENCE */}
                <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2">
                  <span className="text-[10px] uppercase font-extrabold text-[#7F8C8D]">Example Usage</span>
                  <p className="text-xs text-[#2C3E50] italic">&ldquo;{selectedDictItem.sampleSentence}&rdquo;</p>
                </div>

                {/* RECORDING & SAVE TO NOTEBOOK */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleToggleExplorerRecording}
                    className={`flex-1 w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isExplorerRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#16A085] text-white hover:bg-[#117A65]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isExplorerRecording ? 'Recording Word...' : 'Record Word Pronunciation'}</span>
                  </button>

                  <button
                    onClick={handleSaveExplorerToNotebook}
                    disabled={savedToNotebook}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      savedToNotebook
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedToNotebook ? 'Saved to Notebook!' : 'Save to Digital Notebook'}</span>
                  </button>
                </div>

                {explorerEval && (
                  <div className="p-4 bg-[#E8F8F5] border border-[#A3E4D7] rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#16A085]">AI Evaluation Score</span>
                      <span className="text-sm font-extrabold text-[#16A085] font-mono">{explorerEval.score}%</span>
                    </div>
                    <p className="text-xs text-[#2C3E50]">{explorerEval.overallFeedback}</p>
                  </div>
                )}

                {/* FUTURE DICTIONARY INTEGRATION BANNER */}
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                  <p className="text-[10px] text-[#7F8C8D] font-bold">
                    🚀 Interface ready for future Lexicon & Oxford / Cambridge Dictionary API integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => handleNavigateUnit(3)}
                className="px-4 py-2 border border-slate-200 text-[#5D6D7E] rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Back to Unit 3
              </button>

              <button
                onClick={() => handleNavigateUnit(5)}
                className="px-5 py-2.5 bg-[#D35400] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#E67E22]"
              >
                <span>Continue to Unit 5: Foundation Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT 5: FOUNDATION ASSESSMENT */}
      {activeUnit === 5 && (
        <div className="space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="border-b border-[#FAD7A0] pb-4 mb-6">
              <h2 className="text-lg font-extrabold text-[#D35400] font-heading flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D35400]" />
                <span>Unit 5 – Foundation Assessment</span>
              </h2>
              <p className="text-xs text-[#5D6D7E] mt-0.5">
                Complete all 4 parts of the speech foundations benchmark to earn the Speech Sound Explorer Badge.
              </p>
            </div>

            {!assessmentSubmitted ? (
              <div className="space-y-6">
                {/* PART 1: IPA RECOGNITION */}
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                  <span className="text-[10px] uppercase font-black text-[#D35400]">Part 1 • IPA Symbol Recognition</span>
                  <p className="text-xs font-extrabold text-[#2C3E50]">
                    Which IPA symbol represents the short vowel sound in the technical word &ldquo;stack&rdquo; (/stæk/)?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 1, label: '/e/' },
                      { id: 2, label: '/æ/' },
                      { id: 3, label: '/ɑː/' },
                      { id: 4, label: '/ʌ/' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizPart1Answer(opt.id)}
                        className={`p-3 rounded-xl border text-center font-mono font-bold text-sm transition-all ${
                          quizPart1Answer === opt.id
                            ? 'bg-[#D35400] text-white border-[#D35400]'
                            : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PART 2: LISTENING DISCRIMINATION */}
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                  <span className="text-[10px] uppercase font-black text-[#D35400]">Part 2 • Audio Listening Discrimination</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playNativeTTS('The chip was installed into the circuit board.')}
                      className="px-3 py-2 bg-[#D35400] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Audio Sample</span>
                    </button>
                    <p className="text-xs text-[#5D6D7E]">Did you hear short /ɪ/ (&ldquo;chip&rdquo;) or long /iː/ (&ldquo;cheap&rdquo;)?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 1, label: 'Short Vowel /ɪ/ (chip /ʃɪp/)' },
                      { id: 2, label: 'Long Vowel /iː/ (cheap /tʃiːp/)' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizPart2Answer(opt.id)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          quizPart2Answer === opt.id
                            ? 'bg-[#D35400] text-white border-[#D35400]'
                            : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PART 3: INDIVIDUAL SOUND PRONUNCIATION */}
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                  <span className="text-[10px] uppercase font-black text-[#D35400]">Part 3 • Individual Phoneme Recording</span>
                  <p className="text-xs font-extrabold text-[#2C3E50]">
                    Record your voice articulating the unvoiced dental fricative <strong>/θ/</strong> (as in &ldquo;thread&rdquo;).
                  </p>

                  <button
                    onClick={handleToggleAssessmentPart3}
                    className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 ${
                      isRecordingPart3
                        ? 'bg-rose-600 text-white animate-pulse'
                        : assessmentAudio1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#16A085] text-white hover:bg-[#117A65]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {isRecordingPart3
                        ? 'Recording Sound...'
                        : assessmentAudio1
                        ? 'Recorded! Click to re-record'
                        : 'Record Sound /θ/'}
                    </span>
                  </button>
                </div>

                {/* PART 4: TECHNICAL WORD PRONUNCIATION */}
                <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
                  <span className="text-[10px] uppercase font-black text-[#D35400]">Part 4 • Technical Word Recording</span>
                  <p className="text-xs font-extrabold text-[#2C3E50]">
                    Record your voice pronouncing: <strong>&ldquo;architecture&rdquo;</strong> (/ˈɑː.kɪ.tek.tʃər/).
                  </p>

                  <button
                    onClick={handleToggleAssessmentPart4}
                    className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 ${
                      isRecordingPart4
                        ? 'bg-rose-600 text-white animate-pulse'
                        : assessmentAudio2
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#16A085] text-white hover:bg-[#117A65]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {isRecordingPart4
                        ? 'Recording Word...'
                        : assessmentAudio2
                        ? 'Recorded! Click to re-record'
                        : 'Record Word "architecture"'}
                    </span>
                  </button>
                </div>

                <button
                  onClick={handleCalculateAssessment}
                  className="w-full py-3 bg-[#D35400] text-white rounded-xl text-xs font-extrabold hover:bg-[#E67E22] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Foundation Assessment for AI Evaluation</span>
                </button>
              </div>
            ) : (
              /* SCORE CARD DISPLAY */
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#E8F8F5] border border-[#A3E4D7] text-center space-y-2">
                  <Award className="w-12 h-12 text-[#16A085] mx-auto" />
                  <h3 className="text-xl font-extrabold text-[#16A085] font-heading">
                    Phase A Assessment Completed!
                  </h3>
                  <p className="text-xs text-[#2C3E50]">
                    Your overall Speech Sound Foundations proficiency score is recorded in your SAILL Lab Portfolio.
                  </p>
                  <span className="text-3xl font-black text-[#16A085] font-mono block">
                    {assessmentScoreCard?.overallPercentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] text-center">
                    <span className="text-[10px] text-[#7F8C8D] uppercase font-bold block">IPA Recognition</span>
                    <strong className="text-lg font-mono text-[#D35400]">{assessmentScoreCard?.ipaRecognition}%</strong>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] text-center">
                    <span className="text-[10px] text-[#7F8C8D] uppercase font-bold block">Listening Discrim.</span>
                    <strong className="text-lg font-mono text-[#D35400]">{assessmentScoreCard?.listeningDiscrimination}%</strong>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] text-center">
                    <span className="text-[10px] text-[#7F8C8D] uppercase font-bold block">Phoneme Clarity</span>
                    <strong className="text-lg font-mono text-[#D35400]">{assessmentScoreCard?.phonemeClarity}%</strong>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] text-center">
                    <span className="text-[10px] text-[#7F8C8D] uppercase font-bold block">Word Stress</span>
                    <strong className="text-lg font-mono text-[#D35400]">{assessmentScoreCard?.wordStress}%</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setAssessmentSubmitted(false)}
                    className="px-4 py-2 border border-slate-200 text-[#5D6D7E] rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Retake Assessment
                  </button>

                  <button
                    onClick={() => {
                      if (onCompletePhase) onCompletePhase();
                    }}
                    className="px-5 py-2.5 bg-[#16A085] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#117A65]"
                  >
                    <span>Proceed to Phase B: Accent & Word Stress</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FACULTY SUPPORT PLACEHOLDERS PANEL */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3 mb-4">
          <h3 className="text-sm font-extrabold text-[#D35400] font-heading flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D35400]" />
            <span>Faculty Pedagogical Support & Remediation Guide</span>
          </h3>
          <span className="text-[10px] font-bold text-[#7F8C8D]">SRIT Faculty Resource</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-1.5">
            <h4 className="text-xs font-bold text-[#D35400] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Common Errors</span>
            </h4>
            <p className="text-[11px] text-[#5D6D7E] leading-snug">
              Substituting /v/ for /w/ (&ldquo;veblength&rdquo;), shortening long vowels (/iː/ to /ɪ/), and flattening diphthongs.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-1.5">
            <h4 className="text-xs font-bold text-[#D35400] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Frequent Mispronunciations</span>
            </h4>
            <p className="text-[11px] text-[#5D6D7E] leading-snug">
              Words: &ldquo;circuit&rdquo; (/ˈsɜː.kɪt/), &ldquo;architecture&rdquo; (/ˈɑː.kɪ.tek.tʃər/), &ldquo;algorithm&rdquo; (/ˈæl.ɡə.rɪ.ðəm/).
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-1.5">
            <h4 className="text-xs font-bold text-[#D35400] flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Classroom Activities</span>
            </h4>
            <p className="text-[11px] text-[#5D6D7E] leading-snug">
              Minimal pair peer drills, mirror articulation checks, and spectrogram formants comparison during lab hours.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-1.5">
            <h4 className="text-xs font-bold text-[#D35400] flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Recommended Practice</span>
            </h4>
            <p className="text-[11px] text-[#5D6D7E] leading-snug">
              15 minutes daily Universal Recorder drills on unvoiced dental fricatives and short/long vowel minimal pairs.
            </p>
          </div>
        </div>
      </div>

      {/* COMPLETION EXPERIENCE & BADGE MODAL */}
      {showCompletionBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border-2 border-[#FAD7A0] text-center space-y-6 shadow-2xl animate-scaleIn">
            <div className="w-20 h-20 rounded-full bg-[#FFF8F0] border-2 border-[#D35400] flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10 text-[#D35400]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-3 py-1 rounded-full">
                Badge Awarded
              </span>
              <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
                Speech Sound Explorer Badge
              </h2>
              <p className="text-xs text-[#5D6D7E]">
                Congratulations! You have successfully completed Journey 1 • Phase A: Speech Sound Foundations. Your progress has been updated in SAILL.
              </p>
            </div>

            <div className="p-4 bg-[#E8F8F5] border border-[#A3E4D7] rounded-2xl">
              <p className="text-xs font-bold text-[#16A085]">
                Unlocked Phase B: Accent, Word Stress & Intonation Studio
              </p>
            </div>

            <button
              onClick={() => {
                setShowCompletionBadge(false);
                if (onCompletePhase) onCompletePhase();
              }}
              className="w-full py-3 bg-[#D35400] text-white rounded-xl text-xs font-extrabold hover:bg-[#E67E22] transition-colors shadow-md"
            >
              Continue to Phase B
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
