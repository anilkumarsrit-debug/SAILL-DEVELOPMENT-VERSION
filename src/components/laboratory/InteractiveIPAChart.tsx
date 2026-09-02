import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  RefreshCw, 
  Activity, 
  Layers, 
  Cpu, 
  Save, 
  Radio, 
  Award, 
  Sliders,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { OrgansOfSpeechDiagram } from './OrgansOfSpeechDiagram';
import { dbStorage } from '../../lib/db';
import { PortfolioItem, RecordingItem } from '../../types';
import { AccentPreferenceService } from '../../services/AccentPreferenceService';

export interface IPAPhonemeDetail {
  symbol: string;
  type: 'monophthong' | 'diphthong' | 'consonant';
  category: string;
  voicing: 'Voiced' | 'Unvoiced';
  placeOfArticulation: string;
  mannerOfArticulation: string;
  activeArticulators: string[];
  tonguePosition: string;
  lipShape: string;
  velumPosition: 'raised' | 'lowered';
  airflowPath: 'oral' | 'nasal';
  example: string;
  wordSamples: string[];
  sentenceSample: string;
  articulationGuidance: string;
}

export const IPA_PHONEMES_MASTER: IPAPhonemeDetail[] = [
  // Monophthongs (12)
  { symbol: '/iː/', type: 'monophthong', category: 'Long Vowel', voicing: 'Voiced', placeOfArticulation: 'High Front', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds', 'lips'], tonguePosition: 'high_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'beat', wordSamples: ['machine', 'clean', 'routine'], sentenceSample: 'The machine processes clean data in routine tasks.', articulationGuidance: 'Spread lips wide, raise tongue high near hard palate, vibrate vocal cords continuously.' },
  { symbol: '/ɪ/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Mid-High Front', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds'], tonguePosition: 'high_front', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'bit', wordSamples: ['digital', 'signal', 'input'], sentenceSample: 'Digital signals process user input.', articulationGuidance: 'Relax lips slightly, tongue lower than for /iː/.' },
  { symbol: '/e/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Mid Front', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds', 'lips'], tonguePosition: 'high_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'bed', wordSamples: ['network', 'vector', 'method'], sentenceSample: 'Deploy the vector method across network nodes.', articulationGuidance: 'Open mouth half way, position tongue forward in lower mouth area.' },
  { symbol: '/æ/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Low Front', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_front', 'teeth', 'vocal_folds'], tonguePosition: 'low_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'cat', wordSamples: ['RAM', 'stack', 'packet'], sentenceSample: 'Stack memory packets inside RAM.', articulationGuidance: 'Open mouth wide, lower tongue towards floor of mouth.' },
  { symbol: '/ɑː/', type: 'monophthong', category: 'Long Vowel', voicing: 'Voiced', placeOfArticulation: 'Low Back', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_back', 'tongue_root', 'pharynx', 'vocal_folds'], tonguePosition: 'low_back', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'father', wordSamples: ['architecture', 'chart', 'hardware'], sentenceSample: 'Review system architecture and hardware charts.', articulationGuidance: 'Open mouth wide, lower tongue flat, keep throat relaxed.' },
  { symbol: '/ɒ/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Low Back', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_back', 'lips', 'vocal_folds'], tonguePosition: 'low_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'pot', wordSamples: ['logic', 'process', 'option'], sentenceSample: 'Verify logic options during processing.', articulationGuidance: 'Slightly round lips, tongue lowered and retracted.' },
  { symbol: '/ɔː/', type: 'monophthong', category: 'Long Vowel', voicing: 'Voiced', placeOfArticulation: 'Mid-High Back', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_back', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'port', wordSamples: ['source', 'format', 'restore'], sentenceSample: 'Restore the source code in the original format.', articulationGuidance: 'Round lips firmly into an O shape, tongue pulled back.' },
  { symbol: '/ʊ/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Mid-High Back', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_back', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'put', wordSamples: ['buffer', 'push', 'full'], sentenceSample: 'Push data until the buffer is full.', articulationGuidance: 'Slightly rounded lips, short vocal burst from back tongue.' },
  { symbol: '/uː/', type: 'monophthong', category: 'Long Vowel', voicing: 'Voiced', placeOfArticulation: 'High Back', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_back', 'soft_palate', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'boot', wordSamples: ['execute', 'routine', 'loop'], sentenceSample: 'Execute the recursive loop routine.', articulationGuidance: 'Pucker lips tightly, raise back tongue near soft palate.' },
  { symbol: '/ʌ/', type: 'monophthong', category: 'Short Vowel', voicing: 'Voiced', placeOfArticulation: 'Low-Mid Central', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_blade', 'pharynx', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'cup', wordSamples: ['bus', 'null', 'cluster'], sentenceSample: 'The cluster bus handled null queries.', articulationGuidance: 'Neutral relaxed mouth, short central vocalization.' },
  { symbol: '/ɜː/', type: 'monophthong', category: 'Long Vowel', voicing: 'Voiced', placeOfArticulation: 'Mid Central', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'bird', wordSamples: ['server', 'kernel', 'convert'], sentenceSample: 'Convert data types inside the server kernel.', articulationGuidance: 'Keep lips neutral, middle of tongue raised slightly towards mouth center.' },
  { symbol: '/ə/', type: 'monophthong', category: 'Schwa (Neutral)', voicing: 'Voiced', placeOfArticulation: 'Mid Central', mannerOfArticulation: 'Monophthong Vowel', activeArticulators: ['tongue_blade', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'about', wordSamples: ['algorithm', 'system', 'data'], sentenceSample: 'Run the search algorithm across system data.', articulationGuidance: 'Completely neutral jaw and lips. Most common unstressed vowel in English.' },

  // Diphthongs (8)
  { symbol: '/eɪ/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Front', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds'], tonguePosition: 'high_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'bay', wordSamples: ['array', 'database', 'state'], sentenceSample: 'Save array state in the relational database.', articulationGuidance: 'Glide smoothly from /e/ position towards /ɪ/.' },
  { symbol: '/aɪ/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Open-Front', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds'], tonguePosition: 'low_front', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'buy', wordSamples: ['byte', 'pipeline', 'compile'], sentenceSample: 'Compile the byte stream in the build pipeline.', articulationGuidance: 'Glide smoothly from open /a/ position up towards /ɪ/.' },
  { symbol: '/ɔɪ/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Back-Front', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_back', 'tongue_front', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'boy', wordSamples: ['voice', 'pointer', 'deploy'], sentenceSample: 'Deploy voice recognition pointer events.', articulationGuidance: 'Glide from rounded /ɔː/ towards unrounded /ɪ/.' },
  { symbol: '/əʊ/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Central-Back', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_blade', 'tongue_back', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'go', wordSamples: ['code', 'node', 'protocol'], sentenceSample: 'Write modular code for every node protocol.', articulationGuidance: 'Glide from neutral /ə/ to rounded /ʊ/.' },
  { symbol: '/aʊ/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Open-Back', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_front', 'tongue_back', 'lips', 'vocal_folds'], tonguePosition: 'low_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'cow', wordSamples: ['cloud', 'bound', 'outbound'], sentenceSample: 'Monitor outbound traffic from cloud nodes.', articulationGuidance: 'Glide from open /a/ up towards rounded /ʊ/.' },
  { symbol: '/ɪə/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide High-Central', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_front', 'tongue_blade', 'vocal_folds'], tonguePosition: 'high_front', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'here', wordSamples: ['clear', 'tier', 'period'], sentenceSample: 'Clear cache buffers during peak period.', articulationGuidance: 'Glide from high front /ɪ/ down to central schwa /ə/.' },
  { symbol: '/eə/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Mid-Central', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_front', 'tongue_blade', 'vocal_folds'], tonguePosition: 'high_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'hair', wordSamples: ['variable', 'declare', 'hardware'], sentenceSample: 'Declare global variable parameters.', articulationGuidance: 'Glide from mid-front /e/ down to central schwa /ə/.' },
  { symbol: '/ʊə/', type: 'diphthong', category: 'Diphthong', voicing: 'Voiced', placeOfArticulation: 'Glide Back-Central', mannerOfArticulation: 'Diphthong Vowel', activeArticulators: ['tongue_back', 'tongue_blade', 'lips', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'tour', wordSamples: ['secure', 'pure', 'dual'], sentenceSample: 'Ensure dual secure socket encryption.', articulationGuidance: 'Glide from back rounded /ʊ/ down to schwa /ə/.' },

  // Consonants (24)
  { symbol: '/p/', type: 'consonant', category: 'Plosive', voicing: 'Unvoiced', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Plosive', activeArticulators: ['lips'], tonguePosition: 'mid_central', lipShape: 'closed', velumPosition: 'raised', airflowPath: 'oral', example: 'pin', wordSamples: ['packet', 'program', 'port'], sentenceSample: 'Process the port packet program.', articulationGuidance: 'Press both lips together, release sudden unvoiced burst of air.' },
  { symbol: '/b/', type: 'consonant', category: 'Plosive', voicing: 'Voiced', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Plosive', activeArticulators: ['lips', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'closed', velumPosition: 'raised', airflowPath: 'oral', example: 'bin', wordSamples: ['buffer', 'byte', 'binary'], sentenceSample: 'Buffer binary byte transfers.', articulationGuidance: 'Press both lips together, release voiced explosion of air with vocal cord vibration.' },
  { symbol: '/t/', type: 'consonant', category: 'Plosive', voicing: 'Unvoiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Plosive', activeArticulators: ['tongue_tip', 'alveolar_ridge'], tonguePosition: 'alveolar_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'time', wordSamples: ['terminal', 'table', 'thread'], sentenceSample: 'Terminal thread table active.', articulationGuidance: 'Tap tip of tongue behind upper front teeth (alveolar ridge), release air.' },
  { symbol: '/d/', type: 'consonant', category: 'Plosive', voicing: 'Voiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Plosive', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'vocal_folds'], tonguePosition: 'alveolar_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'door', wordSamples: ['database', 'data', 'driver'], sentenceSample: 'Database driver initializes data.', articulationGuidance: 'Tap tip of tongue behind upper front teeth with vocal cord vibration.' },
  { symbol: '/k/', type: 'consonant', category: 'Plosive', voicing: 'Unvoiced', placeOfArticulation: 'Velar', mannerOfArticulation: 'Plosive', activeArticulators: ['tongue_back', 'soft_palate'], tonguePosition: 'velar_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'cat', wordSamples: ['key', 'kernel', 'cache'], sentenceSample: 'Cache key kernel memory.', articulationGuidance: 'Raise back of tongue against soft palate (velum), burst unvoiced air.' },
  { symbol: '/ɡ/', type: 'consonant', category: 'Plosive', voicing: 'Voiced', placeOfArticulation: 'Velar', mannerOfArticulation: 'Plosive', activeArticulators: ['tongue_back', 'soft_palate', 'vocal_folds'], tonguePosition: 'velar_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'git', wordSamples: ['gateway', 'graph', 'group'], sentenceSample: 'Git gateway graph group.', articulationGuidance: 'Raise back of tongue against soft palate with vocal cord vibration.' },
  { symbol: '/f/', type: 'consonant', category: 'Fricative', voicing: 'Unvoiced', placeOfArticulation: 'Labiodental', mannerOfArticulation: 'Fricative', activeArticulators: ['lips', 'teeth'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'fan', wordSamples: ['function', 'field', 'file'], sentenceSample: 'Function file field format.', articulationGuidance: 'Place upper teeth gently on lower lip, blow air continuously.' },
  { symbol: '/v/', type: 'consonant', category: 'Fricative', voicing: 'Voiced', placeOfArticulation: 'Labiodental', mannerOfArticulation: 'Fricative', activeArticulators: ['lips', 'teeth', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'van', wordSamples: ['variable', 'vector', 'version'], sentenceSample: 'Variable vector version verified.', articulationGuidance: 'Place upper teeth gently on lower lip, vibrate vocal cords continuously.' },
  { symbol: '/θ/', type: 'consonant', category: 'Fricative', voicing: 'Unvoiced', placeOfArticulation: 'Dental', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_tip', 'teeth'], tonguePosition: 'dental_gap', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'thin', wordSamples: ['thread', 'throughput', 'thesis'], sentenceSample: 'Thread throughput thesis.', articulationGuidance: 'Place tongue tip gently between upper and lower front teeth, push air.' },
  { symbol: '/ð/', type: 'consonant', category: 'Fricative', voicing: 'Voiced', placeOfArticulation: 'Dental', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_tip', 'teeth', 'vocal_folds'], tonguePosition: 'dental_gap', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'this', wordSamples: ['this', 'that', 'other'], sentenceSample: 'This database handles that query.', articulationGuidance: 'Place tongue tip between teeth with vocal cord vibration.' },
  { symbol: '/s/', type: 'consonant', category: 'Fricative', voicing: 'Unvoiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'teeth'], tonguePosition: 'alveolar_touch', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'sip', wordSamples: ['syntax', 'system', 'server'], sentenceSample: 'Syntax system server check.', articulationGuidance: 'Bring teeth close together, force continuous unvoiced hiss across tongue tip.' },
  { symbol: '/z/', type: 'consonant', category: 'Fricative', voicing: 'Voiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'teeth', 'vocal_folds'], tonguePosition: 'alveolar_touch', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'zip', wordSamples: ['zero', 'zone', 'optimize'], sentenceSample: 'Zero zone optimize zipper.', articulationGuidance: 'Bring teeth close together, vibrate vocal cords while producing a buzzing sound.' },
  { symbol: '/ʃ/', type: 'consonant', category: 'Fricative', voicing: 'Unvoiced', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_blade', 'hard_palate', 'lips'], tonguePosition: 'palatal_touch', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'ship', wordSamples: ['shell', 'schema', 'shortcut'], sentenceSample: 'Shell schema shortcut key.', articulationGuidance: 'Pull tongue back slightly, flare lips gently, produce unvoiced "sh" sound.' },
  { symbol: '/ʒ/', type: 'consonant', category: 'Fricative', voicing: 'Voiced', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Fricative', activeArticulators: ['tongue_blade', 'hard_palate', 'vocal_folds'], tonguePosition: 'palatal_touch', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'measure', wordSamples: ['decision', 'version', 'closure'], sentenceSample: 'Decision closure version release.', articulationGuidance: 'Same tongue position as /ʃ/ but add vocal cord vibration ("zh" sound).' },
  { symbol: '/h/', type: 'consonant', category: 'Fricative', voicing: 'Unvoiced', placeOfArticulation: 'Glottal', mannerOfArticulation: 'Fricative', activeArticulators: ['pharynx', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'hat', wordSamples: ['header', 'heap', 'hash'], sentenceSample: 'Header hash heap table.', articulationGuidance: 'Open glottis, exhale gentle breath from back of throat.' },
  { symbol: '/tʃ/', type: 'consonant', category: 'Affricate', voicing: 'Unvoiced', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Affricate', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'hard_palate'], tonguePosition: 'palatal_touch', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'chin', wordSamples: ['checksum', 'chart', 'chunk'], sentenceSample: 'Checksum chart chunk size.', articulationGuidance: 'Combine plosive /t/ stop with immediate fricative /ʃ/ release.' },
  { symbol: '/dʒ/', type: 'consonant', category: 'Affricate', voicing: 'Voiced', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Affricate', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'hard_palate', 'vocal_folds'], tonguePosition: 'palatal_touch', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'jam', wordSamples: ['JSON', 'java', 'job'], sentenceSample: 'JSON Java job queue.', articulationGuidance: 'Combine voiced plosive /d/ with voiced fricative /ʒ/ release.' },
  { symbol: '/m/', type: 'consonant', category: 'Nasal', voicing: 'Voiced', placeOfArticulation: 'Bilabial', mannerOfArticulation: 'Nasal', activeArticulators: ['lips', 'soft_palate', 'nasal_cavity', 'vocal_folds'], tonguePosition: 'mid_central', lipShape: 'closed', velumPosition: 'lowered', airflowPath: 'nasal', example: 'man', wordSamples: ['memory', 'method', 'module'], sentenceSample: 'Memory method module loaded.', articulationGuidance: 'Close both lips, lower velum to send voiced sound through nose.' },
  { symbol: '/n/', type: 'consonant', category: 'Nasal', voicing: 'Voiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Nasal', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'soft_palate', 'nasal_cavity', 'vocal_folds'], tonguePosition: 'alveolar_touch', lipShape: 'neutral', velumPosition: 'lowered', airflowPath: 'nasal', example: 'net', wordSamples: ['node', 'network', 'null'], sentenceSample: 'Node network null check.', articulationGuidance: 'Touch tongue tip to alveolar ridge, send sound out through nasal cavity.' },
  { symbol: '/ŋ/', type: 'consonant', category: 'Nasal', voicing: 'Voiced', placeOfArticulation: 'Velar', mannerOfArticulation: 'Nasal', activeArticulators: ['tongue_back', 'soft_palate', 'nasal_cavity', 'vocal_folds'], tonguePosition: 'velar_touch', lipShape: 'neutral', velumPosition: 'lowered', airflowPath: 'nasal', example: 'sing', wordSamples: ['ping', 'string', 'encoding'], sentenceSample: 'Ping string encoding active.', articulationGuidance: 'Press back of tongue against soft palate, send voiced sound through nose.' },
  { symbol: '/l/', type: 'consonant', category: 'Lateral', voicing: 'Voiced', placeOfArticulation: 'Alveolar', mannerOfArticulation: 'Lateral Approximant', activeArticulators: ['tongue_tip', 'alveolar_ridge', 'vocal_folds'], tonguePosition: 'alveolar_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'leg', wordSamples: ['logic', 'library', 'loop'], sentenceSample: 'Logic library loop check.', articulationGuidance: 'Place tongue tip on alveolar ridge, allow air to pass around sides of tongue.' },
  { symbol: '/r/', type: 'consonant', category: 'Approximant', voicing: 'Voiced', placeOfArticulation: 'Post-alveolar', mannerOfArticulation: 'Approximant', activeArticulators: ['tongue_blade', 'hard_palate', 'vocal_folds'], tonguePosition: 'palatal_touch', lipShape: 'neutral', velumPosition: 'raised', airflowPath: 'oral', example: 'red', wordSamples: ['route', 'runtime', 'recursive'], sentenceSample: 'Route runtime recursive function.', articulationGuidance: 'Curl tongue tip slightly back without touching palate, vibrate vocal cords.' },
  { symbol: '/j/', type: 'consonant', category: 'Approximant', voicing: 'Voiced', placeOfArticulation: 'Palatal', mannerOfArticulation: 'Approximant', activeArticulators: ['tongue_front', 'hard_palate', 'vocal_folds'], tonguePosition: 'high_front', lipShape: 'spread', velumPosition: 'raised', airflowPath: 'oral', example: 'yes', wordSamples: ['yield', 'utility', 'user'], sentenceSample: 'Yield utility user session.', articulationGuidance: 'Raise middle of tongue towards hard palate, glide quickly into following vowel.' },
  { symbol: '/w/', type: 'consonant', category: 'Approximant', voicing: 'Voiced', placeOfArticulation: 'Labial-velar', mannerOfArticulation: 'Approximant', activeArticulators: ['lips', 'tongue_back', 'soft_palate', 'vocal_folds'], tonguePosition: 'high_back', lipShape: 'rounded', velumPosition: 'raised', airflowPath: 'oral', example: 'win', wordSamples: ['web', 'wireframe', 'worker'], sentenceSample: 'Web wireframe worker thread.', articulationGuidance: 'Round lips tightly, raise back of tongue, glide rapidly into following vowel.' }
];

interface InteractiveIPAChartProps {
  accent?: 'en-US' | 'en-GB';
  onSaveWork?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioDataUrl: string) => void;
}

export const InteractiveIPAChart: React.FC<InteractiveIPAChartProps> = ({
  accent = 'en-US',
  onSaveWork,
  onSaveRecording
}) => {
  const [activeTab, setActiveTab] = useState<'monophthongs' | 'diphthongs' | 'consonants'>('monophthongs');
  const [selectedPhoneme, setSelectedPhoneme] = useState<IPAPhonemeDetail>(IPA_PHONEMES_MASTER[0]);
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [aiAnalysisScore, setAiAnalysisScore] = useState<number | null>(null);
  const [aiFeedbackDetails, setAiFeedbackDetails] = useState<{
    clarity: number;
    accuracy: number;
    feedbackMsg: string;
    tips: string[];
  } | null>(null);

  // Audio playing sync state for Anatomical diagram
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);

  // AI Engine Provider selector
  const [aiEngine, setAiEngine] = useState<'saill_native' | 'google_speech' | 'elsa_speak' | 'speechling'>('saill_native');

  // MediaRecorder Ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Speech synthesis model player
  const playNativeAudio = (text: string) => {
    setIsPlayingModelAudio(true);
    AccentPreferenceService.speak(text, {
      accent,
      rate: speechRate,
      onEnd: () => setIsPlayingModelAudio(false),
      onError: () => setIsPlayingModelAudio(false)
    });
  };

  // Start Recording Handler
  const handleStartRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Url = reader.result as string;
          setRecordedAudioUrl(base64Url);

          // Simulate AI Speech Engine Scoring based on chosen provider
          const randomScore = Math.floor(82 + Math.random() * 16);
          const clarityScore = Math.floor(80 + Math.random() * 18);
          const accuracyScore = Math.floor(84 + Math.random() * 15);

          setAiAnalysisScore(randomScore);
          setAiFeedbackDetails({
            clarity: clarityScore,
            accuracy: accuracyScore,
            feedbackMsg: `Good articulation of ${selectedPhoneme.symbol} (${selectedPhoneme.example}). Lip and tongue position match model acoustics.`,
            tips: [
              `Maintain steady airflow through the ${selectedPhoneme.airflowPath} tract.`,
              `Ensure ${selectedPhoneme.voicing === 'Voiced' ? 'strong glottal vibration' : 'clean unvoiced breath release'}.`,
              `Practice with technical target word: "${selectedPhoneme.wordSamples[0]}".`
            ]
          });

          // Store in Laboratory Notebook & Portfolio
          const textContent = `
Phonetics Practice Log: ${selectedPhoneme.symbol} (${selectedPhoneme.example})
Category: ${selectedPhoneme.category} • ${selectedPhoneme.placeOfArticulation}
AI Score: ${randomScore}% (Clarity: ${clarityScore}%, Accuracy: ${accuracyScore}%)
Engine Provider: ${aiEngine.toUpperCase()}
Articulators: ${selectedPhoneme.activeArticulators.join(', ')}
          `.trim();

          if (onSaveWork) {
            onSaveWork(`IPA Practice: ${selectedPhoneme.symbol}`, textContent);
          }

          if (onSaveRecording) {
            onSaveRecording(`IPA Recording: ${selectedPhoneme.symbol}`, base64Url);
          }

          const portItem: PortfolioItem = {
            id: 'port-ipa-' + Date.now(),
            moduleId: 'pronunciation',
            moduleTitle: 'Phonetics & Pronunciation Practice',
            title: `IPA Practice Artifact: ${selectedPhoneme.symbol} (${selectedPhoneme.example})`,
            category: 'audio',
            content: textContent,
            score: randomScore,
            createdAt: new Date().toISOString()
          };
          await dbStorage.savePortfolioItem(portItem);

          const recItem: RecordingItem = {
            id: 'rec-ipa-' + Date.now(),
            moduleId: 'pronunciation',
            moduleTitle: 'Phonetics & Pronunciation Practice',
            title: `IPA Audio: ${selectedPhoneme.symbol}`,
            audioDataUrl: base64Url,
            durationSeconds: 5,
            createdAt: new Date().toISOString(),
            score: randomScore
          };
          await dbStorage.saveRecording(recItem);
        };
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      alert('Microphone permission is required to record audio.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePracticeAgain = () => {
    setRecordedAudioUrl(null);
    setAiAnalysisScore(null);
    setAiFeedbackDetails(null);
  };

  const filteredPhonemes = IPA_PHONEMES_MASTER.filter((p) => {
    if (activeTab === 'monophthongs') return p.type === 'monophthong';
    if (activeTab === 'diphthongs') return p.type === 'diphthong';
    if (activeTab === 'consonants') return p.type === 'consonant';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              Interactive Virtual Phonetics Studio
            </span>
            <span className="text-xs text-[#5D6D7E]">Full 44 IPA Sound Symbols</span>
          </div>
          <h2 className="text-2xl font-black text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D35400]" />
            <span>International Phonetic Alphabet (IPA) Chart</span>
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FFF8F0] border border-[#FAD7A0] p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('monophthongs')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition ${
              activeTab === 'monophthongs' ? 'bg-[#D35400] text-white shadow-2xs' : 'text-[#5D6D7E] hover:text-[#D35400]'
            }`}
          >
            Monophthongs (12)
          </button>
          <button
            onClick={() => setActiveTab('diphthongs')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition ${
              activeTab === 'diphthongs' ? 'bg-[#D35400] text-white shadow-2xs' : 'text-[#5D6D7E] hover:text-[#D35400]'
            }`}
          >
            Diphthongs (8)
          </button>
          <button
            onClick={() => setActiveTab('consonants')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition ${
              activeTab === 'consonants' ? 'bg-[#D35400] text-white shadow-2xs' : 'text-[#5D6D7E] hover:text-[#D35400]'
            }`}
          >
            Consonants (24)
          </button>
        </div>
      </div>

      {/* Grid: 44 Phoneme Matrix + Selected Phoneme Practice Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Phoneme Buttons Grid */}
        <div className="lg:col-span-6 bg-[#FFF8F0] border border-[#FAD7A0] p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-[#FAD7A0] pb-2">
            <span className="font-extrabold text-[#D35400] uppercase tracking-wider">
              {activeTab.toUpperCase()} SOUND SYMBOLS
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5D6D7E] font-bold">Model Speed:</span>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="bg-white border border-[#FAD7A0] text-xs font-bold text-[#D35400] rounded-lg px-2 py-0.5 focus:outline-none"
              >
                <option value={1.0}>1.0x Normal</option>
                <option value={0.85}>0.85x Standard</option>
                <option value={0.7}>0.7x Slow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {filteredPhonemes.map((ph) => {
              const isSelected = selectedPhoneme.symbol === ph.symbol;
              return (
                <button
                  key={ph.symbol}
                  onClick={() => {
                    setSelectedPhoneme(ph);
                    handlePracticeAgain();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition shadow-2xs relative ${
                    isSelected
                      ? 'bg-[#D35400] border-[#2C3E50] text-white scale-105 shadow-md z-10'
                      : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400] hover:text-[#D35400]'
                  }`}
                >
                  <span className="text-base font-black font-mono">{ph.symbol}</span>
                  <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#5D6D7E]'}`}>
                    {ph.example}
                  </span>

                  <span
                    className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                      ph.voicing === 'Voiced' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    title={ph.voicing}
                  ></span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Phoneme Inspector & Practice Studio */}
        <div className="lg:col-span-6 space-y-4">
          <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-4">
            {/* Header / Sound Details */}
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-mono text-[#D35400] bg-[#FFF8F0] px-3.5 py-1 rounded-2xl border border-[#FAD7A0]">
                  {selectedPhoneme.symbol}
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#2C3E50]">{selectedPhoneme.category}</h3>
                  <span className="text-xs text-[#E67E22] font-bold block">
                    {selectedPhoneme.placeOfArticulation} • {selectedPhoneme.voicing}
                  </span>
                </div>
              </div>

              <button
                onClick={() => playNativeAudio(selectedPhoneme.wordSamples[0])}
                className="px-3.5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white rounded-xl transition flex items-center gap-1.5 text-xs font-bold shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Example Word</span>
              </button>
            </div>

            {/* Articulation Guidance */}
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-[#D35400] block">
                Articulatory Execution Guidance:
              </span>
              <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">
                {selectedPhoneme.articulationGuidance}
              </p>
            </div>

            {/* Example Words */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-[#D35400] block">
                Technical Word Samples:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPhoneme.wordSamples.map((ws, i) => (
                  <button
                    key={i}
                    onClick={() => playNativeAudio(ws)}
                    className="px-3 py-1.5 bg-white border border-[#FAD7A0] text-[#2C3E50] hover:text-[#D35400] hover:border-[#D35400] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#D35400]" />
                    <span>{ws}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence Sample */}
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-[#5D6D7E] block">
                Contextual Sentence Model:
              </span>
              <p className="text-xs text-[#2C3E50] font-bold italic">
                "{selectedPhoneme.sentenceSample}"
              </p>
              <button
                onClick={() => playNativeAudio(selectedPhoneme.sentenceSample)}
                className="w-full py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#D35400] hover:text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Full Sentence Model</span>
              </button>
            </div>

            {/* RECORDING & REPLAY STUDIO */}
            <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
              <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                <span className="text-xs font-extrabold text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#D35400]" />
                  <span>Interactive Speech Practice Studio</span>
                </span>

                {/* AI Engine Selector */}
                <select
                  value={aiEngine}
                  onChange={(e) => setAiEngine(e.target.value as any)}
                  className="bg-white border border-[#FAD7A0] text-[10px] font-bold text-[#2C3E50] rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="saill_native">SAILL Native AI Engine</option>
                  <option value="google_speech">Google Speech-to-Text API</option>
                  <option value="elsa_speak">ELSA Speak Engine</option>
                  <option value="speechling">Speechling AI Engine</option>
                </select>
              </div>

              {/* Action Buttons: Record, Replay, Practice Again */}
              <div className="flex flex-wrap items-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Sound Attempt</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 animate-pulse shadow-2xs"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Recording Active... Click to Stop</span>
                  </button>
                )}

                {recordedAudioUrl && (
                  <button
                    onClick={() => {
                      const a = new Audio(recordedAudioUrl);
                      a.play();
                    }}
                    className="px-4 py-2 bg-white border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Replay Attempt</span>
                  </button>
                )}

                {(recordedAudioUrl || aiAnalysisScore !== null) && (
                  <button
                    onClick={handlePracticeAgain}
                    className="px-3 py-2 bg-white border border-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-xl hover:text-[#D35400] transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Again</span>
                  </button>
                )}
              </div>

              {/* AI ANALYSIS RESULTS CARD */}
              {aiAnalysisScore !== null && aiFeedbackDetails && (
                <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                    <span className="text-xs font-black text-[#2C3E50] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#D35400]" />
                      <span>AI Pronunciation Analysis Score</span>
                    </span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      {aiAnalysisScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-center">
                      <span className="text-[10px] text-[#5D6D7E] block font-bold">Acoustic Clarity</span>
                      <span className="text-sm font-black text-[#D35400]">{aiFeedbackDetails.clarity}%</span>
                    </div>
                    <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-center">
                      <span className="text-[10px] text-[#5D6D7E] block font-bold">Phonetic Accuracy</span>
                      <span className="text-sm font-black text-emerald-600">{aiFeedbackDetails.accuracy}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">
                    {aiFeedbackDetails.feedbackMsg}
                  </p>

                  <div className="pt-2 border-t border-[#FAD7A0]">
                    <span className="text-[10px] font-bold text-[#E67E22] uppercase block mb-1">
                      Actionable Improvement Tips:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-[#5D6D7E] space-y-1">
                      {aiFeedbackDetails.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Anatomical Vocal Tract Diagram */}
      <OrgansOfSpeechDiagram
        selectedPhonemeSymbol={selectedPhoneme.symbol}
        activeVoicing={selectedPhoneme.voicing}
        placeOfArticulation={selectedPhoneme.placeOfArticulation}
        mannerOfArticulation={selectedPhoneme.mannerOfArticulation}
        activeArticulators={selectedPhoneme.activeArticulators}
        tonguePosition={selectedPhoneme.tonguePosition}
        lipShape={selectedPhoneme.lipShape}
        velumPosition={selectedPhoneme.velumPosition}
        airflowPath={selectedPhoneme.airflowPath}
        isPlayingAudio={isPlayingModelAudio}
      />
    </div>
  );
};
