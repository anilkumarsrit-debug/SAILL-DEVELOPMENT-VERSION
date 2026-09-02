/**
 * SAILL - SRIT AI Language Laboratory
 * Feature Flags Configuration & Management Architecture
 *
 * @version 2.6.0
 * @description Centralized runtime feature toggle configuration to enable/disable
 * experimental tools, AI features, local failovers, and analytics safely.
 */

export interface FeatureFlags {
  enableAiRecordingAnalysis: boolean;
  enableLocalFailover: boolean;
  enableSpeechSynthesis: boolean;
  enablePortfolioExports: boolean;
  enableFacultyInChargeApproval: boolean;
  enableTelemetryLogging: boolean;
  enableOfflineMode: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableAiRecordingAnalysis: true,
  enableLocalFailover: true,
  enableSpeechSynthesis: true,
  enablePortfolioExports: true,
  enableFacultyInChargeApproval: true,
  enableTelemetryLogging: true,
  enableOfflineMode: true,
};

class FeatureFlagService {
  private flags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('saill_feature_flags');
        if (stored) {
          this.flags = { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) };
        }
      } catch {
        // Fallback to default flags
      }
    }
  }

  public isEnabled(flag: keyof FeatureFlags): boolean {
    return !!this.flags[flag];
  }

  public setFlag(flag: keyof FeatureFlags, enabled: boolean): void {
    this.flags[flag] = enabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('saill_feature_flags', JSON.stringify(this.flags));
      } catch {
        // Ignore storage error
      }
    }
  }

  public getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  public resetFlags(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS };
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('saill_feature_flags');
    }
  }
}

export const featureFlags = new FeatureFlagService();
