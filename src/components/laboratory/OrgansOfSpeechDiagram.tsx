import React, { useState, useEffect } from 'react';
import { Volume2, Info, Sparkles, Activity, Check, Wind, Radio, RefreshCw } from 'lucide-react';
import { AccentPreferenceService } from '../../services/AccentPreferenceService';

export interface AnatomicalOrgan {
  id: string;
  name: string;
  placeOfArticulation: string;
  description: string;
  phonemes: string[];
  exampleWords: string[];
  hotspot: { cx: number; cy: number; r: number };
}

export const ANATOMICAL_ORGANS: AnatomicalOrgan[] = [
  {
    id: 'lips',
    name: 'Lips (Labial)',
    placeOfArticulation: 'Bilabial & Labiodental',
    description: 'Active upper and lower lips form sounds by closing together (/p/, /b/, /m/), rounding (/uː/, /w/), or contacting upper teeth (/f/, /v/).',
    phonemes: ['/p/', '/b/', '/m/', '/w/', '/f/', '/v/', '/uː/', '/əʊ/'],
    exampleWords: ['packet', 'buffer', 'memory', 'web', 'function', 'variable'],
    hotspot: { cx: 72, cy: 190, r: 14 }
  },
  {
    id: 'teeth',
    name: 'Teeth (Dental)',
    placeOfArticulation: 'Dental & Labiodental',
    description: 'Upper incisors act as a passive articulator against which the lower lip or tongue tip rests to create friction.',
    phonemes: ['/θ/', '/ð/', '/f/', '/v/'],
    exampleWords: ['thread', 'this', 'format', 'vector'],
    hotspot: { cx: 90, cy: 178, r: 12 }
  },
  {
    id: 'alveolar_ridge',
    name: 'Alveolar Ridge',
    placeOfArticulation: 'Alveolar',
    description: 'The firm bony ridge immediately behind upper front teeth where the tongue tip or blade makes contact or creates narrow air gaps.',
    phonemes: ['/t/', '/d/', '/s/', '/z/', '/n/', '/l/'],
    exampleWords: ['terminal', 'database', 'syntax', 'zero', 'node', 'logic'],
    hotspot: { cx: 115, cy: 158, r: 12 }
  },
  {
    id: 'hard_palate',
    name: 'Hard Palate',
    placeOfArticulation: 'Palatal',
    description: 'The smooth, arching bony roof of the mouth used as a passive boundary for palatal approximants and palato-alveolar fricatives.',
    phonemes: ['/j/', '/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/'],
    exampleWords: ['yield', 'shell', 'decision', 'checksum', 'JSON'],
    hotspot: { cx: 160, cy: 148, r: 14 }
  },
  {
    id: 'soft_palate',
    name: 'Soft Palate (Velum)',
    placeOfArticulation: 'Velar',
    description: 'The flexible muscular flap at the back roof of the mouth. Raises to seal off nasal cavity for oral sounds; lowers for nasal sounds.',
    phonemes: ['/k/', '/ɡ/', '/ŋ/', '/w/'],
    exampleWords: ['kernel', 'gateway', 'ping', 'worker'],
    hotspot: { cx: 215, cy: 160, r: 14 }
  },
  {
    id: 'uvula',
    name: 'Uvula',
    placeOfArticulation: 'Uvular Boundary',
    description: 'The small conical muscular projection dangling at the posterior margin of the soft palate.',
    phonemes: ['[q]', '[χ]', 'Foreign accents & trills'],
    exampleWords: ['phonetic boundary marker'],
    hotspot: { cx: 238, cy: 195, r: 10 }
  },
  {
    id: 'tongue_tip',
    name: 'Tongue Tip (Apex)',
    placeOfArticulation: 'Apical Articulator',
    description: 'The extreme forward point of the tongue. Highly agile for tapping alveolar ridge (/t/, /d/) or protruding between teeth (/θ/, /ð/).',
    phonemes: ['/t/', '/d/', '/n/', '/θ/', '/ð/', '/s/', '/z/'],
    exampleWords: ['terminal', 'data', 'null', 'thread', 'this'],
    hotspot: { cx: 105, cy: 185, r: 12 }
  },
  {
    id: 'tongue_blade',
    name: 'Tongue Blade (Lamina)',
    placeOfArticulation: 'Laminal Articulator',
    description: 'The flat surface just behind tongue tip used against alveolar ridge and front hard palate.',
    phonemes: ['/ʃ/', '/ʒ/', '/tʃ/', '/dʒ/', '/s/', '/z/'],
    exampleWords: ['schema', 'measure', 'chart', 'Java'],
    hotspot: { cx: 130, cy: 180, r: 12 }
  },
  {
    id: 'tongue_front',
    name: 'Tongue Front (Dorsum)',
    placeOfArticulation: 'Anterior Dorsal',
    description: 'The main central body of tongue raised toward hard palate for front vowels (/iː/, /ɪ/, /e/) and palatals (/j/).',
    phonemes: ['/iː/', '/ɪ/', '/e/', '/æ/', '/j/'],
    exampleWords: ['beat', 'digital', 'network', 'RAM', 'yield'],
    hotspot: { cx: 155, cy: 185, r: 14 }
  },
  {
    id: 'tongue_back',
    name: 'Tongue Back (Post-Dorsum)',
    placeOfArticulation: 'Posterior Dorsal',
    description: 'The rear dorsal surface raised against soft palate for velar consonants (/k/, /ɡ/, /ŋ/) and back vowels (/uː/, /ɔː/).',
    phonemes: ['/k/', '/ɡ/', '/ŋ/', '/uː/', '/ɔː/', '/ɑː/'],
    exampleWords: ['key', 'git', 'string', 'execute', 'source'],
    hotspot: { cx: 190, cy: 195, r: 14 }
  },
  {
    id: 'tongue_root',
    name: 'Tongue Root',
    placeOfArticulation: 'Radical Articulator',
    description: 'The lower posterior wall of the tongue facing pharyngeal cavity.',
    phonemes: ['Pharyngeal resonance & low back vowels'],
    exampleWords: ['father', 'architecture'],
    hotspot: { cx: 215, cy: 235, r: 12 }
  },
  {
    id: 'pharynx',
    name: 'Pharynx Cavity',
    placeOfArticulation: 'Pharyngeal Resonator',
    description: 'The throat passage above larynx providing acoustic resonance for all vocalization.',
    phonemes: ['All English speech sounds'],
    exampleWords: ['resonance tube'],
    hotspot: { cx: 245, cy: 240, r: 14 }
  },
  {
    id: 'vocal_folds',
    name: 'Vocal Folds (Larynx)',
    placeOfArticulation: 'Glottal Voicing Generator',
    description: 'Twin muscular membranes inside larynx. Rapidly vibrate (100-300 Hz) for Voiced sounds; stay open for Unvoiced sounds.',
    phonemes: ['Voiced: /b/,/d/,/ɡ/,/v/,/z/,/m/,/n/,/iː/...', 'Unvoiced: /p/,/t/,/k/,/f/,/s/,/h/'],
    exampleWords: ['binary', 'variable', 'zero', 'signal'],
    hotspot: { cx: 240, cy: 285, r: 14 }
  },
  {
    id: 'nasal_cavity',
    name: 'Nasal Cavity',
    placeOfArticulation: 'Nasal Acoustic Resonator',
    description: 'Air passage through nasal chambers when soft palate is lowered. Gives distinct nasal resonance to /m/, /n/, and /ŋ/.',
    phonemes: ['/m/', '/n/', '/ŋ/'],
    exampleWords: ['memory', 'node', 'ping'],
    hotspot: { cx: 160, cy: 100, r: 18 }
  }
];

interface OrgansOfSpeechDiagramProps {
  accent?: 'en-US' | 'en-GB';
  selectedPhonemeSymbol?: string;
  activeVoicing?: 'Voiced' | 'Unvoiced';
  placeOfArticulation?: string;
  mannerOfArticulation?: string;
  activeArticulators?: string[];
  tonguePosition?: string;
  lipShape?: string;
  velumPosition?: string;
  airflowPath?: string;
  isPlayingAudio?: boolean;
  onOrganSelect?: (organ: AnatomicalOrgan) => void;
}

export const OrgansOfSpeechDiagram: React.FC<OrgansOfSpeechDiagramProps> = ({
  accent = 'en-US',
  selectedPhonemeSymbol,
  activeVoicing = 'Voiced',
  placeOfArticulation = 'Alveolar',
  mannerOfArticulation,
  activeArticulators = ['tongue_tip', 'alveolar_ridge'],
  tonguePosition = 'alveolar_touch',
  lipShape = 'neutral',
  velumPosition = 'raised',
  airflowPath = 'oral',
  isPlayingAudio = false,
  onOrganSelect
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<AnatomicalOrgan>(ANATOMICAL_ORGANS[0]);
  const [animPulse, setAnimPulse] = useState(0);

  // Sync animation timer when audio is playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAnimPulse((prev) => (prev + 1) % 100);
      }, 50);
    } else {
      setAnimPulse(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const speakText = (text: string) => {
    AccentPreferenceService.speak(text, { accent });
  };

  const handleOrganClick = (organ: AnatomicalOrgan) => {
    setSelectedOrgan(organ);
    if (onOrganSelect) onOrganSelect(organ);
  };

  // Determine which articulators should be highlighted based on props or manual selection
  const highlightedOrganIds = selectedPhonemeSymbol
    ? activeArticulators
    : [selectedOrgan.id];

  const isVoiced = activeVoicing === 'Voiced';
  const isNasalFlow = velumPosition === 'lowered' || airflowPath === 'nasal';

  // Dynamic Tongue Path based on tonguePosition
  const getTonguePath = () => {
    switch (tonguePosition) {
      case 'high_front': // /iː/, /ɪ/
        return "M 95 210 Q 110 170 145 152 Q 170 165 190 190 Q 215 220 215 240 L 110 240 Z";
      case 'high_back': // /uː/, /ʊ/
        return "M 95 215 Q 120 200 150 185 Q 185 155 205 160 Q 220 190 215 240 L 110 240 Z";
      case 'low_front': // /æ/
        return "M 90 220 Q 110 210 140 208 Q 175 210 195 215 Q 215 230 215 240 L 100 240 Z";
      case 'low_back': // /ɑː/
        return "M 90 220 Q 120 215 150 212 Q 180 205 200 210 Q 215 230 215 240 L 100 240 Z";
      case 'alveolar_touch': // /t/, /d/, /n/, /l/
        return "M 92 215 Q 105 168 116 158 Q 135 185 170 195 Q 205 220 215 240 L 100 240 Z";
      case 'velar_touch': // /k/, /ɡ/, /ŋ/
        return "M 90 220 Q 120 210 155 195 Q 195 160 215 162 Q 220 210 215 240 L 100 240 Z";
      case 'palatal_touch': // /j/, /ʃ/, /tʃ/
        return "M 92 215 Q 120 185 152 152 Q 175 168 195 190 Q 215 220 215 240 L 100 240 Z";
      case 'dental_gap': // /θ/, /ð/
        return "M 82 188 Q 105 182 135 185 Q 170 195 195 210 Q 215 225 215 240 L 95 240 Z";
      case 'mid_central': // /ə/, /ɜː/
      default:
        return "M 92 218 Q 115 195 145 185 Q 180 185 200 198 Q 215 220 215 240 L 100 240 Z";
    }
  };

  // Dynamic Lips Path
  const getLipsPath = () => {
    if (lipShape === 'closed') {
      return {
        upper: "M 66 170 Q 75 175 88 175",
        lower: "M 66 210 Q 75 205 88 205"
      };
    }
    if (lipShape === 'rounded') {
      return {
        upper: "M 68 168 Q 78 160 88 170",
        lower: "M 68 212 Q 78 220 88 210"
      };
    }
    if (lipShape === 'spread') {
      return {
        upper: "M 62 172 Q 75 165 88 172",
        lower: "M 62 208 Q 75 215 88 208"
      };
    }
    // neutral / default
    return {
      upper: "M 65 170 Q 76 168 88 174",
      lower: "M 65 210 Q 76 212 88 206"
    };
  };

  const lipPaths = getLipsPath();

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              Realistic Speech Anatomy
            </span>
            <span className="text-xs text-[#5D6D7E] font-medium">14 Active & Passive Articulators</span>
          </div>
          <h3 className="text-xl font-black text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <span>Realistic Anatomical Vocal Tract Diagram</span>
            {isPlayingAudio && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                <Radio className="w-3.5 h-3.5" /> Articulating Audio...
              </span>
            )}
          </h3>
        </div>

        {/* Selected Phoneme Status Badge */}
        {selectedPhonemeSymbol && (
          <div className="flex items-center gap-3 bg-[#FFF8F0] border border-[#FAD7A0] px-3.5 py-2 rounded-xl">
            <span className="text-xl font-black font-mono text-[#D35400] bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              {selectedPhonemeSymbol}
            </span>
            <div className="text-[11px]">
              <span className="font-bold text-[#2C3E50] block">{placeOfArticulation}</span>
              <span className={`font-extrabold uppercase ${isVoiced ? 'text-emerald-600' : 'text-amber-600'}`}>
                {activeVoicing} • {mannerOfArticulation || 'Articulator'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: SVG Vocal Tract + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Anatomical SVG Canvas */}
        <div className="lg:col-span-7 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider">
              Anatomical Side-View Diagram
            </span>
            <span className="text-[10px] font-semibold text-[#5D6D7E]">
              Click any organ to inspect
            </span>
          </div>

          <svg
            viewBox="0 0 320 340"
            className="w-full max-w-[310px] h-auto select-none drop-shadow-sm"
          >
            <defs>
              {/* Airflow Gradient */}
              <linearGradient id="oralAirflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E67E22" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="nasalAirflowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E67E22" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
              </linearGradient>

              {/* Glowing Filter for Highlighted Articulators */}
              <filter id="organGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Head & Neck Outline */}
            <path
              d="M 120 20 C 190 20 270 60 270 140 C 270 200 255 240 255 310 L 210 310 C 210 275 220 250 195 245 C 130 245 110 225 65 210 C 50 190 65 175 75 175 C 90 175 110 175 125 175 C 160 175 170 205 160 215 C 120 215 95 200 88 190 C 80 190 60 190 60 170 C 60 150 100 120 160 120 C 210 120 230 140 230 180"
              fill="#FFFFFF"
              stroke="#2C3E50"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Nasal Cavity Outline */}
            <path
              d="M 110 135 C 130 75, 200 70, 245 120 C 225 145, 175 140, 110 135 Z"
              fill={highlightedOrganIds.includes('nasal_cavity') ? '#DBEAFE' : '#F1F5F9'}
              stroke={highlightedOrganIds.includes('nasal_cavity') ? '#3B82F6' : '#94A3B8'}
              strokeWidth={highlightedOrganIds.includes('nasal_cavity') ? 2.5 : 1.5}
              filter={highlightedOrganIds.includes('nasal_cavity') ? 'url(#organGlow)' : undefined}
            />
            <text x="175" y="105" fontSize="9" fontWeight="bold" fill="#3B82F6" textAnchor="middle">
              Nasal Cavity
            </text>

            {/* Hard Palate (Bony Roof) */}
            <path
              d="M 108 158 Q 155 142 205 158"
              fill="none"
              stroke={highlightedOrganIds.includes('hard_palate') ? '#D35400' : '#64748B'}
              strokeWidth={highlightedOrganIds.includes('hard_palate') ? 4 : 2.5}
              strokeLinecap="round"
            />

            {/* Soft Palate / Velum */}
            <path
              d={velumPosition === 'lowered' ? "M 205 158 Q 225 175 230 200" : "M 205 158 Q 225 162 238 180"}
              fill="none"
              stroke={highlightedOrganIds.includes('soft_palate') ? '#D35400' : '#E67E22'}
              strokeWidth={highlightedOrganIds.includes('soft_palate') ? 4 : 2.5}
              strokeLinecap="round"
            />

            {/* Uvula */}
            <circle
              cx="238"
              cy={velumPosition === 'lowered' ? "202" : "185"}
              r="4"
              fill={highlightedOrganIds.includes('uvula') ? '#D35400' : '#E67E22'}
            />

            {/* Alveolar Ridge Bump */}
            <path
              d="M 100 168 Q 110 160 120 156"
              fill="none"
              stroke={highlightedOrganIds.includes('alveolar_ridge') ? '#D35400' : '#0F172A'}
              strokeWidth={highlightedOrganIds.includes('alveolar_ridge') ? 4.5 : 2.5}
            />

            {/* Upper Teeth & Lower Teeth */}
            <rect
              x="88"
              y="168"
              width="6"
              height="12"
              rx="2"
              fill={highlightedOrganIds.includes('teeth') ? '#F59E0B' : '#FFFFFF'}
              stroke="#2C3E50"
              strokeWidth="1.5"
            />
            <rect
              x="86"
              y="200"
              width="6"
              height="12"
              rx="2"
              fill={highlightedOrganIds.includes('teeth') ? '#F59E0B' : '#FFFFFF'}
              stroke="#2C3E50"
              strokeWidth="1.5"
            />

            {/* Dynamic Lips */}
            <path
              d={lipPaths.upper}
              fill="none"
              stroke={highlightedOrganIds.includes('lips') ? '#D35400' : '#E11D48'}
              strokeWidth={highlightedOrganIds.includes('lips') ? 5 : 3.5}
              strokeLinecap="round"
            />
            <path
              d={lipPaths.lower}
              fill="none"
              stroke={highlightedOrganIds.includes('lips') ? '#D35400' : '#E11D48'}
              strokeWidth={highlightedOrganIds.includes('lips') ? 5 : 3.5}
              strokeLinecap="round"
            />

            {/* Dynamic Tongue Shape */}
            <path
              d={getTonguePath()}
              fill={
                highlightedOrganIds.some((id) => id.startsWith('tongue'))
                  ? '#D35400'
                  : '#F8C471'
              }
              fillOpacity={highlightedOrganIds.some((id) => id.startsWith('tongue')) ? '0.9' : '0.75'}
              stroke="#D35400"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Vocal Folds & Larynx Box */}
            <rect
              x="225"
              y="270"
              width="30"
              height="25"
              rx="4"
              fill={isVoiced ? '#DC2626' : '#94A3B8'}
              fillOpacity={isVoiced ? (isPlayingAudio ? '0.9' : '0.7') : '0.4'}
              stroke={highlightedOrganIds.includes('vocal_folds') ? '#D35400' : '#2C3E50'}
              strokeWidth="2"
              filter={isVoiced && isPlayingAudio ? 'url(#organGlow)' : undefined}
            />
            {/* Vocal Folds Vibration Lines */}
            {isVoiced && (
              <g className={isPlayingAudio ? 'animate-pulse' : undefined}>
                <line x1="230" y1="280" x2="250" y2="280" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="230" y1="285" x2="250" y2="285" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 2" />
              </g>
            )}

            {/* Animated Airflow Paths */}
            {isNasalFlow ? (
              /* Nasal Airflow Stream */
              <path
                d="M 240 280 L 245 220 L 235 160 L 210 110 Q 160 85, 90 125"
                fill="none"
                stroke="url(#nasalAirflowGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeDashoffset={isPlayingAudio ? -animPulse * 2 : 0}
                strokeLinecap="round"
              />
            ) : (
              /* Oral Airflow Stream */
              <path
                d="M 240 280 L 245 230 L 210 185 Q 150 170, 70 190"
                fill="none"
                stroke="url(#oralAirflowGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeDashoffset={isPlayingAudio ? -animPulse * 2 : 0}
                strokeLinecap="round"
              />
            )}

            {/* Hotspots for all 14 organs */}
            {ANATOMICAL_ORGANS.map((organ) => {
              const isHL = highlightedOrganIds.includes(organ.id);
              return (
                <g
                  key={organ.id}
                  onClick={() => handleOrganClick(organ)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={organ.hotspot.cx}
                    cy={organ.hotspot.cy}
                    r={organ.hotspot.r}
                    fill={isHL ? '#D35400' : '#FFF8F0'}
                    fillOpacity={isHL ? 0.95 : 0.6}
                    stroke={isHL ? '#2C3E50' : '#D35400'}
                    strokeWidth={isHL ? 3 : 1.5}
                    className="transition-all duration-300 hover:scale-125 origin-center"
                  />
                  <text
                    x={organ.hotspot.cx}
                    y={organ.hotspot.cy + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="black"
                    fill={isHL ? '#FFFFFF' : '#D35400'}
                    className="pointer-events-none"
                  >
                    ●
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Airflow & Voicing Legend Bar */}
          <div className="w-full mt-3 pt-3 border-t border-[#FAD7A0] flex flex-wrap items-center justify-between text-[11px] gap-2">
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#D35400]" />
              <span className="font-bold text-[#2C3E50]">Airflow:</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#FAD7A0] font-semibold text-[#D35400]">
                {isNasalFlow ? 'Nasal Resonant Flow' : 'Oral Expiratory Stream'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#D35400]" />
              <span className="font-bold text-[#2C3E50]">Larynx State:</span>
              <span
                className={`px-2 py-0.5 rounded border font-extrabold uppercase ${
                  isVoiced
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {activeVoicing} (Vocal Folds {isVoiced ? 'Vibrating' : 'Open'})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Organ Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                {selectedOrgan.placeOfArticulation}
              </span>
              <button
                onClick={() => speakText(selectedOrgan.name + '. ' + selectedOrgan.description)}
                className="p-2 bg-white border border-[#FAD7A0] hover:bg-[#D35400] hover:text-white text-[#D35400] rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Explain Organ</span>
              </button>
            </div>

            <h4 className="text-lg font-black text-[#2C3E50] font-heading">{selectedOrgan.name}</h4>
            <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">{selectedOrgan.description}</p>

            {/* Phonemes Produced */}
            <div className="pt-2 border-t border-[#FAD7A0] space-y-1.5">
              <span className="text-[10px] font-bold text-[#E67E22] uppercase tracking-wider block">
                Phonemes Associated with this Articulator:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedOrgan.phonemes.map((ph, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-black bg-white text-[#D35400] border border-[#FAD7A0] px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    {ph}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Example Words */}
            <div className="pt-2 border-t border-[#FAD7A0] space-y-1.5">
              <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider block">
                Engineering Word Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedOrgan.exampleWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => speakText(word)}
                    className="text-xs font-semibold bg-white text-[#2C3E50] border border-[#FAD7A0] px-2.5 py-1 rounded-lg hover:border-[#D35400] hover:text-[#D35400] transition flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3 h-3 text-[#E67E22]" />
                    <span>{word}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Selection Buttons for all 14 Organ Hotspots */}
          <div className="p-4 rounded-2xl bg-white border border-[#FAD7A0] space-y-2">
            <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider block">
              Direct Articulator Selector (14 Organs):
            </span>
            <div className="flex flex-wrap gap-1">
              {ANATOMICAL_ORGANS.map((organ) => {
                const isSelected = selectedOrgan.id === organ.id;
                return (
                  <button
                    key={organ.id}
                    onClick={() => handleOrganClick(organ)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                      isSelected
                        ? 'bg-[#D35400] text-white shadow-2xs'
                        : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#5D6D7E] hover:text-[#D35400]'
                    }`}
                  >
                    {organ.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
