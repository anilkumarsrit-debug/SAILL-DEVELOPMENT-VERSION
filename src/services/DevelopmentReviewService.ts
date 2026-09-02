import { dbStorage } from '../lib/db';

export type ObservationCategory =
  | 'Pedagogy'
  | 'UI/UX'
  | 'AI Evaluation'
  | 'Assessment'
  | 'Audio'
  | 'Faculty'
  | 'Student'
  | 'Administrator'
  | 'Performance'
  | 'Security'
  | 'Bug'
  | 'Enhancement'
  | 'Feature Request';

export type ObservationPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ObservationStatus = 'Open' | 'In Progress' | 'Under Review' | 'Completed' | 'Closed';

export interface ObservationAttachment {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'pdf';
  size: string;
  url?: string;
}

export interface ReviewObservation {
  id: string;
  journey: string;
  phase: string;
  unit: string;
  activity: string;
  title: string;
  description: string;
  category: ObservationCategory;
  priority: ObservationPriority;
  status: ObservationStatus;
  assignedTo: string;
  dateCreated: string;
  updatedAt: string;
  softwareVersion: string;
  attachments: ObservationAttachment[];
}

export interface ReviewDashboardStats {
  totalIssues: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
  pedagogical: number;
  ui: number;
  ai: number;
  featureRequests: number;
}

export interface VersionRelease {
  version: string;
  releaseName: string;
  releaseDate: string;
  status: 'released' | 'in_development' | 'planned';
  description: string;
  linkedObservationIds: string[];
}

const STORAGE_KEY = 'saill_development_observations';

// Seed observations for realistic initial review center
const INITIAL_SEED_OBSERVATIONS: ReviewObservation[] = [
  {
    id: 'OBS-2026-001',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 1: IPA Explorer',
    activity: 'Interactive Vowel & Consonant Chart',
    title: 'IPA Audio Sample Playback Latency Optimization',
    description: 'When switching rapidly between monophthongs and diphthongs, web audio synthesis context occasionally queued audio buffers. Added audio context caching and instant cancellation on tab switch.',
    category: 'Audio',
    priority: 'High',
    status: 'Completed',
    assignedTo: 'Audio Systems Specialist',
    dateCreated: '2026-08-01T10:30:00.000Z',
    updatedAt: '2026-08-03T14:20:00.000Z',
    softwareVersion: 'v1.2.0-A',
    attachments: [
      { id: 'att-01', name: 'ipa_waveform_analysis.png', type: 'image', size: '1.2 MB' },
      { id: 'att-02', name: 'vowel_formant_f1_f2_spec.pdf', type: 'pdf', size: '450 KB' }
    ]
  },
  {
    id: 'OBS-2026-002',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 3: Articulation Studio',
    activity: '3D Vocal Tract Real-Time Animation',
    title: 'Sagittal Cross-Section Vocal Organ Highlighting',
    description: 'Ensure tongue placement and velum position animations match IPA place of articulation (bilabial vs alveolar vs velar) with clear color contrast for SRIT students.',
    category: 'UI/UX',
    priority: 'Critical',
    status: 'Completed',
    assignedTo: 'Lead UI/UX Designer',
    dateCreated: '2026-08-02T09:15:00.000Z',
    updatedAt: '2026-08-04T11:00:00.000Z',
    softwareVersion: 'v1.2.0-A',
    attachments: [
      { id: 'att-03', name: 'vocal_tract_sagittal_mock.png', type: 'image', size: '2.4 MB' }
    ]
  },
  {
    id: 'OBS-2026-003',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 4: Pronunciation Explorer',
    activity: 'SRIT Acoustic Analysis & Pitch Contour',
    title: 'Acoustic Formant F1/F2 Mapping Precision Evaluation',
    description: 'Refined pitch contour frequency boundaries for Indian English speakers to eliminate false negative penalties on mild Mother Tongue Influence (MTI) pitch patterns.',
    category: 'Pedagogy',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Phonetics Pedagogy Lead',
    dateCreated: '2026-08-04T16:00:00.000Z',
    updatedAt: '2026-08-05T09:45:00.000Z',
    softwareVersion: 'v1.2.0-A',
    attachments: [
      { id: 'att-04', name: 'mti_pitch_contour_sample.wav', type: 'audio', size: '3.1 MB' }
    ]
  },
  {
    id: 'OBS-2026-004',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase B: Accent & Word Stress',
    unit: 'Unit 2: Syllable Stress Rules',
    activity: 'Noun vs Verb Stress Shift Quiz',
    title: 'AI Speech Evaluation Feedback Tone Calibration',
    description: 'Calibrated AI speech recognition responses to provide encouraging pedagogical hints for engineering students during syllable stress diagnostic attempts.',
    category: 'AI Evaluation',
    priority: 'Medium',
    status: 'Under Review',
    assignedTo: 'AI Research Scientist',
    dateCreated: '2026-08-05T11:20:00.000Z',
    updatedAt: '2026-08-06T14:10:00.000Z',
    softwareVersion: 'v1.1.0',
    attachments: []
  },
  {
    id: 'OBS-2026-005',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 5: Foundation Assessment',
    activity: 'Integrated Speech Diagnostic',
    title: 'Automated Diagnostic Report Generation in PDF',
    description: 'Add 10-mark scale breakdown table and faculty signature block to exported student diagnostic reports for departmental record keeping.',
    category: 'Assessment',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Departmental Evaluation Committee',
    dateCreated: '2026-08-06T08:30:00.000Z',
    updatedAt: '2026-08-06T08:30:00.000Z',
    softwareVersion: 'v1.2.0-A',
    attachments: [
      { id: 'att-05', name: 'sample_diagnostic_template.pdf', type: 'pdf', size: '620 KB' }
    ]
  },
  {
    id: 'OBS-2026-006',
    journey: 'Journey 2: Professional Communication & Placement Prep',
    phase: 'Phase C: Executive Speech & JAM',
    unit: 'Unit 1: Just A Minute (JAM)',
    activity: 'Live Speech Audio Recorder & Timer',
    title: 'JAM Timer Pause/Resume Audio Glitch Fix',
    description: 'Fixed minor audio stream interruption when pausing the 60-second JAM challenge countdown timer midway.',
    category: 'Bug',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Frontend Engineer',
    dateCreated: '2026-07-28T14:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
    softwareVersion: 'v1.0.0',
    attachments: []
  },
  {
    id: 'OBS-2026-007',
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 2: Sound Library',
    activity: 'Minimal Pair Pronunciation Matrix',
    title: 'Interactive Minimal Pair Comparison Feature Request',
    description: 'Faculty request to allow side-by-side comparative audio playback for contrastive sound pairs like /p/ vs /b/ and /s/ vs /z/.',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Product Design Team',
    dateCreated: '2026-08-06T15:00:00.000Z',
    updatedAt: '2026-08-06T15:00:00.000Z',
    softwareVersion: 'v1.3.0-Planned',
    attachments: []
  }
];

export const VERSION_RELEASES: VersionRelease[] = [
  {
    version: 'v1.2.0-A',
    releaseName: 'Speech Sound Foundations Release',
    releaseDate: '2026-08-06',
    status: 'released',
    description: 'Major release featuring 5 comprehensive Units for Phase A Speech Sound Foundations with interactive IPA chart, Sagittal vocal tract visuals, Minimal pair matrix, and diagnostic assessments.',
    linkedObservationIds: ['OBS-2026-001', 'OBS-2026-002', 'OBS-2026-003', 'OBS-2026-005']
  },
  {
    version: 'v1.1.0',
    releaseName: 'Academic Governance & Batch Management',
    releaseDate: '2026-07-15',
    status: 'released',
    description: 'Introduced SRIT Section & Batch transfer, Faculty Incharge scoping, and automated student profile assignment.',
    linkedObservationIds: ['OBS-2026-004']
  },
  {
    version: 'v1.0.0',
    releaseName: 'SAILL Core Laboratory Launch',
    releaseDate: '2026-06-01',
    status: 'released',
    description: 'Initial release of SRIT AI Language Laboratory platform.',
    linkedObservationIds: ['OBS-2026-006']
  }
];

export class DevelopmentReviewService {
  /**
   * Fetch all review observations from storage or seed
   */
  static getAllObservations(): ReviewObservation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as ReviewObservation[];
      }
    } catch {
      // Fallback to seed
    }
    // Seed storage on first access
    this.saveObservations(INITIAL_SEED_OBSERVATIONS);
    return INITIAL_SEED_OBSERVATIONS;
  }

  /**
   * Save observations list to storage
   */
  static saveObservations(items: ReviewObservation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist development observations:', e);
    }
  }

  /**
   * Get single observation
   */
  static getObservationById(id: string): ReviewObservation | null {
    const list = this.getAllObservations();
    return list.find((o) => o.id === id) || null;
  }

  /**
   * Create new observation
   */
  static createObservation(data: Omit<ReviewObservation, 'id' | 'dateCreated' | 'updatedAt'>): ReviewObservation {
    const list = this.getAllObservations();
    const count = list.length + 1;
    const newId = `OBS-2026-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newObs: ReviewObservation = {
      ...data,
      id: newId,
      dateCreated: now,
      updatedAt: now,
      softwareVersion: data.softwareVersion || 'v1.2.0-A',
      attachments: data.attachments || []
    };

    const updatedList = [newObs, ...list];
    this.saveObservations(updatedList);
    return newObs;
  }

  /**
   * Update an existing observation
   */
  static updateObservation(id: string, updates: Partial<ReviewObservation>): ReviewObservation {
    const list = this.getAllObservations();
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Observation '${id}' not found.`);
    }

    const updatedObs: ReviewObservation = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedObs;
    this.saveObservations(list);
    return updatedObs;
  }

  /**
   * Delete observation
   */
  static deleteObservation(id: string): void {
    const list = this.getAllObservations();
    const filtered = list.filter((o) => o.id !== id);
    this.saveObservations(filtered);
  }

  /**
   * Compute Dashboard Metrics
   */
  static getDashboardStats(): ReviewDashboardStats {
    const list = this.getAllObservations();

    return {
      totalIssues: list.length,
      open: list.filter((o) => o.status === 'Open').length,
      inProgress: list.filter((o) => o.status === 'In Progress' || o.status === 'Under Review').length,
      resolved: list.filter((o) => o.status === 'Completed' || o.status === 'Closed').length,
      critical: list.filter((o) => o.priority === 'Critical').length,
      pedagogical: list.filter((o) => o.category === 'Pedagogy').length,
      ui: list.filter((o) => o.category === 'UI/UX').length,
      ai: list.filter((o) => o.category === 'AI Evaluation').length,
      featureRequests: list.filter((o) => o.category === 'Feature Request').length
    };
  }

  /**
   * Filter and search observations
   */
  static filterObservations(params: {
    journey?: string;
    phase?: string;
    category?: string;
    priority?: string;
    status?: string;
    keyword?: string;
  }): ReviewObservation[] {
    let list = this.getAllObservations();

    if (params.journey && params.journey !== 'ALL') {
      list = list.filter((o) => o.journey.toLowerCase().includes(params.journey!.toLowerCase()));
    }

    if (params.phase && params.phase !== 'ALL') {
      list = list.filter((o) => o.phase.toLowerCase().includes(params.phase!.toLowerCase()));
    }

    if (params.category && params.category !== 'ALL') {
      list = list.filter((o) => o.category === params.category);
    }

    if (params.priority && params.priority !== 'ALL') {
      list = list.filter((o) => o.priority === params.priority);
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((o) => o.status === params.status);
    }

    if (params.keyword && params.keyword.trim()) {
      const kw = params.keyword.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(kw) ||
          o.description.toLowerCase().includes(kw) ||
          o.id.toLowerCase().includes(kw) ||
          o.assignedTo.toLowerCase().includes(kw) ||
          o.activity.toLowerCase().includes(kw)
      );
    }

    return list;
  }
}
