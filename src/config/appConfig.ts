/**
 * SAILL - SRIT AI Language Laboratory
 * Centralized Application Configuration
 *
 * @version 2.6.0
 * @description Master configuration constants for SAILL platform runtime,
 * institution branding, timeouts, limits, and service defaults.
 */

export const APP_CONFIG = {
  // Institutional Metadata
  institution: {
    name: 'Srinivasa Ramanujan Institute of Technology',
    shortName: 'SRIT',
    labName: 'SAILL AI Language Laboratory',
    department: 'Department of Humanities & Basic Sciences (English)',
    curriculumCode: 'R26',
    academicYear: '2025-2026'
  },

  // Version & Build Info
  version: '2.6.0-PROD',
  environment: 'production',

  // Audio Recording & WebAudio Parameters
  audio: {
    supportedMimeTypes: ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav'],
    preferredMimeType: 'audio/webm;codecs=opus',
    maxDurationSeconds: 180, // 3 minutes per recording
    sampleRate: 44100,
    minVolumeThresholdDb: -50
  },

  // AI Service Defaults
  ai: {
    defaultModel: 'gemini-1.5-flash',
    secondaryModel: 'gemini-1.5-pro',
    requestTimeoutMs: 15000, // 15 seconds timeout
    maxRetries: 2,
    enableLocalFailover: true
  },

  // Storage & Session Persistence
  storage: {
    dbName: 'saill_r26_database',
    portfolioStore: 'portfolio_items',
    recordingsStore: 'audio_recordings',
    progressStore: 'module_progress',
    localStorageKeys: {
      activeUser: 'saill_active_user',
      activeRole: 'saill_active_role',
      theme: 'saill_theme_preference'
    }
  },

  // System Health & Telemetry
  telemetry: {
    healthCheckIntervalMs: 30000, // 30 seconds
    maxLogHistory: 200
  }
} as const;

export type AppConfig = typeof APP_CONFIG;
