/**
 * SAILL - SRIT AI Language Laboratory
 * Centralized English Dictionary (Localization Preparation)
 */

export const enLocale = {
  app: {
    title: 'SAILL - SRIT AI Language Laboratory',
    tagline: 'Srinivasa Ramanujan Institute of Technology',
    syllabus: 'R26 Syllabus & AI Speech Analytics'
  },
  nav: {
    dashboard: 'Dashboard',
    home: 'Home',
    modules: 'Modules',
    aiCoach: 'AI Coach',
    notices: 'Notices',
    profile: 'Profile',
    batchManagement: 'Batch Management',
    students: 'Student Records',
    faculty: 'Faculty Assignments',
    settings: 'System Settings',
    logout: 'Log Out',
    toggleSidebar: 'Toggle Navigation Sidebar'
  },
  recorder: {
    startRecording: 'Start Voice Recording',
    stopRecording: 'Stop Recording',
    pauseRecording: 'Pause Recording',
    resumeRecording: 'Resume Recording',
    playRecording: 'Play Recorded Audio',
    pausePlayback: 'Pause Playback',
    deleteRecording: 'Delete Recording',
    submitForAI: 'Analyze with SAILL AI',
    recordingInProgress: 'Voice recording in progress',
    recordingPaused: 'Recording paused',
    recordingCompleted: 'Recording complete. Ready for analysis.',
    permissionDenied: 'Microphone access denied. Please allow microphone permission in browser settings.'
  },
  audioPlayer: {
    play: 'Play Audio',
    pause: 'Pause Audio',
    replay: 'Replay Audio',
    seek: 'Audio playback position',
    volume: 'Audio volume level'
  },
  a11y: {
    skipToContent: 'Skip to main content',
    requiredField: 'Required field',
    closeModal: 'Close dialog',
    offlineNotice: 'System operating in offline mode. Local storage active.'
  }
};

export type LocaleDictionary = typeof enLocale;
