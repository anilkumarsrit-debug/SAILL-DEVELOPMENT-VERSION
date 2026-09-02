import { dbStorage } from '../lib/db';

export interface InstitutionConfig {
  institutionName: string;
  institutionShortName: string;
  logoUrl: string;
  academicYear: string;
  timeZone: string;
  country: string;
  state: string;
  city: string;
}

export interface BootstrapAdminData {
  fullName: string;
  email: string;
  mobile: string;
  employeeId: string;
}

export interface SystemConfig {
  theme: string;
  language: string;
  sessionTimeoutMinutes: number;
  aiProvider: string;
  academicCalendar: string;
  emailNotificationsEnabled: boolean;
  storageBackend: string;
}

export interface PlatformConfig {
  institution: InstitutionConfig;
  bootstrapAdmin: BootstrapAdminData;
  system: SystemConfig;
  installationTimestamp: string;
  isInitialized: boolean;
}

const DEFAULT_INSTITUTION: InstitutionConfig = {
  institutionName: 'Srinivasa Ramanujan Institute of Technology',
  institutionShortName: 'SRIT',
  logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
  academicYear: '2026-2027',
  timeZone: 'Asia/Kolkata (IST - UTC+05:30)',
  country: 'India',
  state: 'Andhra Pradesh',
  city: 'Ananthapuramu'
};

const DEFAULT_SYSTEM: SystemConfig = {
  theme: 'SRIT Saffron & Slate Theme',
  language: 'English (India)',
  sessionTimeoutMinutes: 60,
  aiProvider: 'Google Gemini 2.5 / 3.0 Engine',
  academicCalendar: 'CBCS R26 Semester Framework',
  emailNotificationsEnabled: true,
  storageBackend: 'IndexedDB + LocalStorage Sync'
};

export class PlatformInitializationService {
  private static STORAGE_KEY_INITIALIZED = 'saill_platform_initialized';
  private static STORAGE_KEY_CONFIG = 'saill_platform_config';
  private static STORAGE_KEY_TIMESTAMP = 'saill_installation_timestamp';

  /**
   * Check if the platform has completed the initial setup wizard.
   */
  public static isPlatformInitialized(): boolean {
    const isPlatformDone = localStorage.getItem(this.STORAGE_KEY_INITIALIZED) === 'true';
    const isBootstrapDone = localStorage.getItem('saill_bootstrap_initialized') === 'true';
    return isPlatformDone && isBootstrapDone;
  }

  /**
   * Authoritative recovery check against IndexedDB SAILL_Lab_DB -> administrators.
   * If BOOTSTRAP_ADMIN exists in IndexedDB:
   * 1. Treat platform as initialized.
   * 2. Restore LocalStorage initialization flags.
   * 3. Restore LocalStorage bootstrap admin profile if missing.
   */
  public static async checkAndRecoverInitialization(): Promise<boolean> {
    if (this.isPlatformInitialized()) {
      return true;
    }

    try {
      const db = await dbStorage.initDB();
      const bootstrapAdmin = await new Promise<any>((resolve) => {
        const tx = db.transaction('administrators', 'readonly');
        const store = tx.objectStore('administrators');
        const req = store.get('BOOTSTRAP_ADMIN');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });

      if (bootstrapAdmin) {
        localStorage.setItem(this.STORAGE_KEY_INITIALIZED, 'true');
        localStorage.setItem('saill_bootstrap_initialized', 'true');

        if (!localStorage.getItem('saill_bootstrap_admin_profile')) {
          localStorage.setItem('saill_bootstrap_admin_profile', JSON.stringify(bootstrapAdmin));
        }
        return true;
      }
    } catch (err) {
      console.warn('[PlatformInitializationService] Error checking IndexedDB for BOOTSTRAP_ADMIN:', err);
    }

    return false;
  }

  /**
   * Retrieve active or default platform configuration
   */
  public static getPlatformConfig(): PlatformConfig {
    let savedProfile: any = null;
    try {
      const rawProfile = localStorage.getItem('saill_bootstrap_admin_profile');
      if (rawProfile) {
        savedProfile = JSON.parse(rawProfile);
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw) as PlatformConfig;
        if (savedProfile && savedProfile.fullName) {
          parsed.bootstrapAdmin = {
            fullName: savedProfile.fullName,
            email: savedProfile.email || parsed.bootstrapAdmin?.email || 'admin@srit.ac.in',
            mobile: savedProfile.mobile || parsed.bootstrapAdmin?.mobile || '',
            employeeId: savedProfile.employeeId || parsed.bootstrapAdmin?.employeeId || 'EMP-SRIT-ADMIN01'
          };
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    return {
      institution: DEFAULT_INSTITUTION,
      bootstrapAdmin: {
        fullName: savedProfile?.fullName || 'Dr. A. Srinivasulu',
        email: savedProfile?.email || 'admin@srit.ac.in',
        mobile: savedProfile?.mobile || '9848012345',
        employeeId: savedProfile?.employeeId || 'EMP-SRIT-ADMIN01'
      },
      system: DEFAULT_SYSTEM,
      installationTimestamp: new Date().toISOString(),
      isInitialized: this.isPlatformInitialized()
    };
  }

  /**
   * Complete the 4-step Platform Initialization Process
   */
  public static async completePlatformInitialization(
    institution: InstitutionConfig,
    bootstrapAdmin: BootstrapAdminData,
    system: SystemConfig,
    rawPassword: string
  ): Promise<PlatformConfig> {
    const timestamp = new Date().toISOString();
    const adminUsername = 'BOOTSTRAP_ADMIN';

    // 1. Create Bootstrap Administrator in dbStorage
    const adminAccount = {
      username: adminUsername,
      fullName: bootstrapAdmin.fullName.trim(),
      email: bootstrapAdmin.email.trim().toLowerCase(),
      mobile: bootstrapAdmin.mobile.trim(),
      employeeId: bootstrapAdmin.employeeId?.trim() || 'EMP-BOOTSTRAP-001',
      institutionName: institution.institutionName.trim(),
      role: 'administrator' as const,
      passwordHash: '',
      createdAt: timestamp
    };

    await dbStorage.saveBootstrapAdministrator(adminAccount, rawPassword);

    // 2. Build full platform configuration object
    const fullConfig: PlatformConfig = {
      institution,
      bootstrapAdmin,
      system,
      installationTimestamp: timestamp,
      isInitialized: true
    };

    // 3. Persist flags and configuration
    localStorage.setItem(this.STORAGE_KEY_INITIALIZED, 'true');
    localStorage.setItem('saill_bootstrap_initialized', 'true');
    localStorage.setItem(this.STORAGE_KEY_TIMESTAMP, timestamp);
    localStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(fullConfig));

    // 4. Audit Log
    await dbStorage.logAuditTrail(
      'SYSTEM_INITIALIZATION',
      `Platform Initialization Engine (PIE) completed. Institution: ${institution.institutionName} (${institution.institutionShortName}). Bootstrap Admin: ${bootstrapAdmin.email}`,
      adminUsername,
      bootstrapAdmin.fullName,
      'administrator'
    );

    return fullConfig;
  }

  /**
   * Developer-Only Internal Reset Function
   * Completely clears platform initialization status to allow re-running PIE.
   */
  public static resetPlatformInitialization(): void {
    localStorage.removeItem(this.STORAGE_KEY_INITIALIZED);
    localStorage.removeItem('saill_bootstrap_initialized');
    localStorage.removeItem(this.STORAGE_KEY_CONFIG);
    localStorage.removeItem(this.STORAGE_KEY_TIMESTAMP);
    localStorage.removeItem('saill_active_admin');
    console.warn('[PIE Developer Reset] Platform initialization reset! Reload page to re-trigger Initial Setup Wizard.');
  }
}

// Expose Developer Reset on Window object for internal testing/debugging
if (typeof window !== 'undefined') {
  (window as unknown as { __resetSAILLPlatformInitialization: () => void }).__resetSAILLPlatformInitialization = () => {
    PlatformInitializationService.resetPlatformInitialization();
    window.location.reload();
  };
}
