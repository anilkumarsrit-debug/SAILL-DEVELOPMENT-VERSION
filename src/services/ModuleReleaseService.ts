import { dbStorage } from '../lib/db';

const RELEASED_MODULES_KEY = 'saill_class_released_modules';
const ADMIN_RELEASED_MODULES_KEY = 'saill_admin_released_modules';

export type ModuleAccessState =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'AVAILABLE'
  | 'LOCKED'
  | 'WAITING_FOR_FACULTY_RELEASE'
  | 'WAITING_FOR_ADMIN_RELEASE';

export interface ModuleAccessInfo {
  state: ModuleAccessState;
  isReleased: boolean;
  isAccessible: boolean;
  statusLabel: string;
  badgeClass: string;
  lockMessage?: string;
  adminReleased?: boolean;
}

export class ModuleReleaseService {
  /**
   * Admin Release Operations (ADMIN -> FACULTY)
   * Faculty modules remain LOCKED by default until Admin explicitly releases them.
   */
  static getAdminReleasedModuleIdsSync(): string[] {
    try {
      const stored = localStorage.getItem(ADMIN_RELEASED_MODULES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  }

  static async releaseModuleByAdmin(moduleId: string, adminName: string = 'Administrator'): Promise<string[]> {
    const current = this.getAdminReleasedModuleIdsSync();
    if (!current.includes(moduleId)) {
      current.push(moduleId);
      try {
        localStorage.setItem(ADMIN_RELEASED_MODULES_KEY, JSON.stringify(current));
      } catch {
        // ignore
      }
    }

    try {
      await dbStorage.saveAdminModuleRelease(moduleId, 'GLOBAL', adminName);
      await dbStorage.logAuditTrail(
        'ADMIN_MODULE_RELEASE',
        `Administrator released Module (${moduleId}) to Faculty Incharges.`,
        adminName,
        adminName,
        'ADMINISTRATOR'
      );
    } catch {
      // ignore
    }

    return current;
  }

  static async revokeModuleByAdmin(moduleId: string, adminName: string = 'Administrator'): Promise<string[]> {
    const current = this.getAdminReleasedModuleIdsSync().filter((id) => id !== moduleId);
    try {
      localStorage.setItem(ADMIN_RELEASED_MODULES_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }

    try {
      await dbStorage.revokeAdminModuleRelease(moduleId, 'GLOBAL');
      await dbStorage.logAuditTrail(
        'ADMIN_MODULE_REVOCATION',
        `Administrator locked Module (${moduleId}) from Faculty Incharges.`,
        adminName,
        adminName,
        'ADMINISTRATOR'
      );
    } catch {
      // ignore
    }

    return current;
  }

  static isAdminModuleReleased(moduleId: string): boolean {
    const released = this.getAdminReleasedModuleIdsSync();
    return released.includes(moduleId);
  }

  /**
   * Normalizes branch name to canonical code (e.g. "Computer Science & Engineering" -> "CSE")
   */
  static normalizeBranch(branch?: string): string {
    if (!branch) return 'CSE';
    const b = branch.trim().toLowerCase();
    if (b.includes('computer science') || b.includes('cse')) return 'CSE';
    if (b.includes('humanities') || b.includes('h&s') || b.includes('hs') || b.includes('english')) return 'HS';
    if (b.includes('civil') || b.includes('civ') || b.includes('ce')) return 'CIV';
    if (b.includes('mechanical') || b.includes('mech') || b.includes('me')) return 'ME';
    if (b.includes('electrical') || b.includes('eee')) return 'EEE';
    if (b.includes('electronics') || b.includes('ece')) return 'ECE';
    if (b.includes('information technology') || b.includes('it')) return 'IT';
    
    const cleaned = branch.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return cleaned || 'CSE';
  }

  /**
   * Normalizes semester string to canonical representation (e.g. "Semester II" -> "SEM-2")
   */
  static normalizeSemester(semester?: string): string {
    if (!semester) return 'SEM-1';
    const s = semester.trim().toLowerCase();
    if (s.includes('viii') || s.includes('8')) return 'SEM-8';
    if (s.includes('vii') || s.includes('7')) return 'SEM-7';
    if (s.includes('vi') || s.includes('6')) return 'SEM-6';
    if (s.includes('v') || s.includes('5')) return 'SEM-5';
    if (s.includes('iv') || s.includes('4')) return 'SEM-4';
    if (s.includes('iii') || s.includes('3')) return 'SEM-3';
    if (s.includes('ii') || s.includes('2')) return 'SEM-2';
    if (s.includes('i') || s.includes('1')) return 'SEM-1';
    return 'SEM-1';
  }

  /**
   * Normalizes section string to canonical representation (e.g. "A", "B", "C")
   */
  static normalizeSection(section?: string): string {
    if (!section) return 'A';
    const sec = section.trim().toUpperCase().replace(/SECTION/g, '').replace(/SEC/g, '').trim();
    return sec || 'A';
  }

  /**
   * Generate a canonical class/batch key string from branch, semester, section, or object.
   */
  static getClassKey(branchOrObj?: any, semester?: string, section?: string): string {
    if (typeof branchOrObj === 'object' && branchOrObj !== null) {
      if (branchOrObj.batchId) return branchOrObj.batchId;
      if (branchOrObj.id && branchOrObj.batchCode) return branchOrObj.id;
      return this.getClassKey(
        branchOrObj.branch || branchOrObj.department,
        branchOrObj.semester,
        branchOrObj.section
      );
    }

    const normBranch = this.normalizeBranch(branchOrObj);
    const normSem = this.normalizeSemester(semester);
    const normSec = this.normalizeSection(section);
    return `${normBranch}__${normSem}__${normSec}`;
  }

  /**
   * Resolve all candidate keys for a class/batch (explicit batch ID, normalized class key, raw class key, matched batch ID)
   */
  static async resolveAllClassKeys(
    branchOrObj?: any,
    semester?: string,
    section?: string
  ): Promise<string[]> {
    const keys = new Set<string>();

    let rawBranch = '';
    let rawSem = '';
    let rawSec = '';
    let explicitBatchId = '';

    if (typeof branchOrObj === 'object' && branchOrObj !== null) {
      explicitBatchId = branchOrObj.batchId || branchOrObj.academicBatchId || (branchOrObj.batchCode ? branchOrObj.id : '');
      rawBranch = branchOrObj.branch || branchOrObj.department || '';
      rawSem = branchOrObj.semester || '';
      rawSec = branchOrObj.section || '';
    } else if (typeof branchOrObj === 'string') {
      rawBranch = branchOrObj;
      rawSem = semester || '';
      rawSec = section || '';
    }

    if (explicitBatchId) keys.add(explicitBatchId);

    const normKey = this.getClassKey(rawBranch, rawSem, rawSec);
    keys.add(normKey);

    if (rawBranch || rawSem || rawSec) {
      const rawKey = `${rawBranch.trim()}__${rawSem.trim()}__${rawSec.trim()}`;
      if (rawKey.length > 3) keys.add(rawKey);
    }

    // Match existing batch in SAILL_Lab_DB
    try {
      const allBatches = await dbStorage.getAllBatches();
      const matched = allBatches.find((b) => {
        const bNormKey = this.getClassKey(b.branch || b.department, b.semester, b.section);
        return bNormKey === normKey || b.id === explicitBatchId;
      });
      if (matched) {
        keys.add(matched.id);
        if (matched.batchCode) keys.add(matched.batchCode);
      }
    } catch {
      // ignore
    }

    return Array.from(keys);
  }

  /**
   * Synchronously compute candidate keys
   */
  static getSyncKeys(classKeyOrObj?: any): string[] {
    const keys = new Set<string>();
    if (!classKeyOrObj) return ['default'];

    if (typeof classKeyOrObj === 'string') {
      keys.add(classKeyOrObj);
      keys.add(this.getClassKey(classKeyOrObj));
    } else if (typeof classKeyOrObj === 'object' && classKeyOrObj !== null) {
      if (classKeyOrObj.batchId) keys.add(classKeyOrObj.batchId);
      if (classKeyOrObj.id && classKeyOrObj.batchCode) keys.add(classKeyOrObj.id);

      const normKey = this.getClassKey(
        classKeyOrObj.branch || classKeyOrObj.department,
        classKeyOrObj.semester,
        classKeyOrObj.section
      );
      keys.add(normKey);

      const rawBranch = classKeyOrObj.branch || classKeyOrObj.department || '';
      const rawSem = classKeyOrObj.semester || '';
      const rawSec = classKeyOrObj.section || '';
      const rawKey = `${rawBranch.trim()}__${rawSem.trim()}__${rawSec.trim()}`;
      if (rawKey.length > 4) keys.add(rawKey);
    }

    return Array.from(keys);
  }

  /**
   * Synchronously get list of released module IDs for a class/batch.
   * Only returns modules explicitly released to this class.
   */
  static getReleasedModuleIdsForClass(classKeyOrObj?: any): string[] {
    return this.getReleasedModuleIdsForClassSync(classKeyOrObj);
  }

  static getReleasedModuleIdsForClassSync(classKeyOrObj?: any): string[] {
    const keys = this.getSyncKeys(classKeyOrObj);
    const releasedSet = new Set<string>();

    for (const key of keys) {
      try {
        const stored = localStorage.getItem(`${RELEASED_MODULES_KEY}__${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((m) => {
              if (typeof m === 'string') releasedSet.add(m);
            });
          }
        }
      } catch {
        // Fallback
      }
    }

    return Array.from(releasedSet);
  }

  /**
   * Release a module for a class/batch by Faculty.
   * Enforces Admin -> Faculty -> Student release hierarchy.
   */
  static async releaseModuleForClass(
    targetKeyOrObj: any,
    moduleId: string,
    releasedBy: string = 'FACULTY'
  ): Promise<string[]> {
    // 0. Prerequisite Check: Module MUST be approved/released by Admin first
    if (!this.isAdminModuleReleased(moduleId)) {
      throw new Error(
        `Hierarchy Enforcement: Module "${moduleId}" has not been released by the Administrator yet. Faculty can only release Admin-approved modules.`
      );
    }

    const keysSync = this.getSyncKeys(targetKeyOrObj);

    // 1. Update LocalStorage cache immediately
    for (const key of keysSync) {
      const current = this.getReleasedModuleIdsForClassSync(key);
      if (!current.includes(moduleId)) {
        current.push(moduleId);
        try {
          localStorage.setItem(`${RELEASED_MODULES_KEY}__${key}`, JSON.stringify(current));
        } catch {
          // Fallback
        }
      }
    }

    // 2. Resolve all canonical keys and persist to IndexedDB
    const allKeys = await this.resolveAllClassKeys(targetKeyOrObj);
    for (const key of allKeys) {
      await dbStorage.saveModuleRelease(key, moduleId, releasedBy);

      // Ensure LocalStorage cache is populated for every resolved key
      const current = this.getReleasedModuleIdsForClassSync(key);
      if (!current.includes(moduleId)) {
        current.push(moduleId);
        try {
          localStorage.setItem(`${RELEASED_MODULES_KEY}__${key}`, JSON.stringify(current));
        } catch {
          // Fallback
        }
      }
    }

    const primaryKey = allKeys[0] || keysSync[0] || 'default';
    return this.getReleasedModuleIdsForClassSync(primaryKey);
  }

  /**
   * Revoke/lock a module for a class/batch by Faculty.
   */
  static async revokeModuleForClass(
    targetKeyOrObj: any,
    moduleId: string
  ): Promise<string[]> {
    const keysSync = this.getSyncKeys(targetKeyOrObj);

    // 1. Update LocalStorage cache immediately
    for (const key of keysSync) {
      const current = this.getReleasedModuleIdsForClassSync(key).filter((id) => id !== moduleId);
      try {
        localStorage.setItem(`${RELEASED_MODULES_KEY}__${key}`, JSON.stringify(current));
      } catch {
        // ignore
      }
    }

    // 2. Resolve keys and remove from IndexedDB
    const allKeys = await this.resolveAllClassKeys(targetKeyOrObj);
    try {
      const db = await dbStorage.initDB();
      const tx = db.transaction('moduleReleases', 'readwrite');
      const store = tx.objectStore('moduleReleases');
      for (const key of allKeys) {
        store.delete(`${key}__${moduleId}`);
      }
    } catch {
      // ignore
    }

    const primaryKey = allKeys[0] || keysSync[0] || 'default';
    return this.getReleasedModuleIdsForClassSync(primaryKey);
  }

  /**
   * Synchronize LocalStorage cache with IndexedDB authoritative records
   */
  static async syncWithIndexedDB(classKeyOrObj?: any): Promise<string[]> {
    try {
      // 1. Sync Admin Releases from IndexedDB
      const adminDbRecords = await dbStorage.getAllAdminModuleReleases();
      if (adminDbRecords) {
        const adminSet = new Set<string>();
        adminDbRecords.forEach((r) => {
          if (r.released) adminSet.add(r.moduleId);
        });
        localStorage.setItem(ADMIN_RELEASED_MODULES_KEY, JSON.stringify(Array.from(adminSet)));
      }

      // 2. Sync Faculty Class Releases from IndexedDB
      const allDbRecords = await dbStorage.getAllModuleReleases();
      const batchMap = new Map<string, Set<string>>();

      allDbRecords.forEach((r) => {
        if (r.released && !r.id?.startsWith('ADMIN_RELEASE__') && !r.batchId?.startsWith('ADMIN__')) {
          if (!batchMap.has(r.batchId)) {
            batchMap.set(r.batchId, new Set<string>());
          }
          batchMap.get(r.batchId)!.add(r.moduleId);
        }
      });

      batchMap.forEach((modules, bId) => {
        const arr = Array.from(modules);
        try {
          localStorage.setItem(`${RELEASED_MODULES_KEY}__${bId}`, JSON.stringify(arr));
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore
    }

    return this.getReleasedModuleIdsForClassSync(classKeyOrObj);
  }

  /**
   * Check if a module is released for a class/batch.
   * Requires BOTH Admin Release to Faculty AND Faculty Release to that Class/Section.
   */
  static isModuleReleased(classKeyOrObj: any, moduleId: string): boolean {
    if (!this.isAdminModuleReleased(moduleId)) return false;
    const released = this.getReleasedModuleIdsForClassSync(classKeyOrObj);
    return released.includes(moduleId);
  }

  /**
   * Single Authoritative Source of Truth for Module Access State
   */
  static getModuleAccessInfo(
    classKeyOrObj: any,
    moduleId: string,
    modProgress?: { status?: string; completedTabs?: string[]; score?: number },
    role?: string
  ): ModuleAccessInfo {
    const normRole = (role || '').toUpperCase();

    // 1. ADMIN ACCESS: The Admin must never see modules as locked. All 10 modules always accessible.
    if (
      normRole === 'ADMINISTRATOR' ||
      normRole === 'ADMIN' ||
      classKeyOrObj === 'ADMINISTRATOR' ||
      classKeyOrObj === 'ADMIN'
    ) {
      const status = modProgress?.status || 'not_started';
      if (status === 'completed') {
        return {
          state: 'COMPLETED',
          isReleased: true,
          isAccessible: true,
          statusLabel: 'COMPLETED',
          badgeClass: 'bg-green-100 text-green-800 border-green-300',
          adminReleased: true
        };
      }
      if (status === 'in_progress') {
        return {
          state: 'IN_PROGRESS',
          isReleased: true,
          isAccessible: true,
          statusLabel: 'IN PROGRESS',
          badgeClass: 'bg-orange-100 text-[#D35400] border-orange-300',
          adminReleased: true
        };
      }
      return {
        state: 'AVAILABLE',
        isReleased: true,
        isAccessible: true,
        statusLabel: 'AVAILABLE (ADMIN)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        adminReleased: true
      };
    }

    // 2. Check Admin-to-Faculty Release Level
    const adminReleased = this.isAdminModuleReleased(moduleId);

    // If Faculty is checking their own access:
    if (normRole === 'FACULTY' || normRole === 'FACULTY_INCHARGE') {
      if (!adminReleased) {
        return {
          state: 'WAITING_FOR_ADMIN_RELEASE',
          isReleased: false,
          isAccessible: false,
          statusLabel: 'LOCKED (ADMIN)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          lockMessage: 'Module locked. Waiting for Administrator release to Faculty.',
          adminReleased: false
        };
      }
      return {
        state: 'AVAILABLE',
        isReleased: true,
        isAccessible: true,
        statusLabel: 'AVAILABLE',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        adminReleased: true
      };
    }

    // 3. STUDENT ACCESS:
    // If not released by Admin:
    if (!adminReleased) {
      return {
        state: 'WAITING_FOR_ADMIN_RELEASE',
        isReleased: false,
        isAccessible: false,
        statusLabel: 'LOCKED (ADMIN)',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        lockMessage: 'Module locked. Waiting for Administrator release.',
        adminReleased: false
      };
    }

    // If released by Admin but NOT released by Faculty for this student's class/section:
    const isReleasedToClass = this.isModuleReleased(classKeyOrObj, moduleId);
    if (!isReleasedToClass) {
      return {
        state: 'LOCKED',
        isReleased: false,
        isAccessible: false,
        statusLabel: 'LOCKED (FACULTY)',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        lockMessage: 'Module locked. Waiting for assigned Faculty release.',
        adminReleased: true
      };
    }

    // Once released by Faculty to this class:
    const status = modProgress?.status || 'not_started';
    if (status === 'completed') {
      return {
        state: 'COMPLETED',
        isReleased: true,
        isAccessible: true,
        statusLabel: 'COMPLETED',
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
        adminReleased: true
      };
    }

    if (status === 'in_progress') {
      return {
        state: 'IN_PROGRESS',
        isReleased: true,
        isAccessible: true,
        statusLabel: 'IN PROGRESS',
        badgeClass: 'bg-orange-100 text-[#D35400] border-orange-300',
        adminReleased: true
      };
    }

    return {
      state: 'AVAILABLE',
      isReleased: true,
      isAccessible: true,
      statusLabel: 'AVAILABLE',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      adminReleased: true
    };
  }
}

