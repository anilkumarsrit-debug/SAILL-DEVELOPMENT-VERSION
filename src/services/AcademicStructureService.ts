import {
  Department,
  Branch,
  AcademicYearEntity,
  SemesterEntity,
  SectionEntity,
  ProgrammeEntity
} from '../types/academic';
import { dbStorage } from '../lib/db';

const LOCAL_STORAGE_KEYS = {
  PROGRAMMES: 'saill_academic_programmes',
  DEPARTMENTS: 'saill_academic_departments',
  BRANCHES: 'saill_academic_branches',
  YEARS: 'saill_academic_years',
  SEMESTERS: 'saill_academic_semesters',
  SECTIONS: 'saill_academic_sections'
};

// Default Academic Structure collections for SAILL (Empty by default for clean state)
const DEFAULT_PROGRAMMES: ProgrammeEntity[] = [];
const DEFAULT_DEPARTMENTS: Department[] = [];
const DEFAULT_BRANCHES: Branch[] = [];
const DEFAULT_YEARS: AcademicYearEntity[] = [];
const DEFAULT_SEMESTERS: SemesterEntity[] = [];
const DEFAULT_SECTIONS: SectionEntity[] = [];

export class AcademicStructureService {
  /**
   * Synchronize localStorage with IndexedDB storage on load.
   * IndexedDB is the authoritative persistent store.
   */
  static async syncWithIndexedDB(): Promise<void> {
    const collections = [
      {
        key: LOCAL_STORAGE_KEYS.DEPARTMENTS,
        fetcher: () => dbStorage.getAllDepartments(),
        saver: (d: Department) => dbStorage.saveDepartment(d)
      },
      {
        key: LOCAL_STORAGE_KEYS.PROGRAMMES,
        fetcher: () => dbStorage.getAllProgrammes(),
        saver: (p: ProgrammeEntity) => dbStorage.saveProgramme(p)
      },
      {
        key: LOCAL_STORAGE_KEYS.BRANCHES,
        fetcher: () => dbStorage.getAllBranches(),
        saver: (b: Branch) => dbStorage.saveBranch(b)
      },
      {
        key: LOCAL_STORAGE_KEYS.YEARS,
        fetcher: () => dbStorage.getAllAcademicYears(),
        saver: (y: AcademicYearEntity) => dbStorage.saveAcademicYear(y)
      },
      {
        key: LOCAL_STORAGE_KEYS.SEMESTERS,
        fetcher: () => dbStorage.getAllSemesters(),
        saver: (s: SemesterEntity) => dbStorage.saveSemester(s)
      },
      {
        key: LOCAL_STORAGE_KEYS.SECTIONS,
        fetcher: () => dbStorage.getAllSections(),
        saver: (sec: SectionEntity) => dbStorage.saveSection(sec)
      }
    ];

    for (const col of collections) {
      let dbItems: any[] | null = null;
      let fetchError: any = null;

      try {
        dbItems = await col.fetcher();
      } catch (err) {
        fetchError = err;
      }

      const rawLocal = localStorage.getItem(col.key);
      let localItems: any[] = [];
      try {
        if (rawLocal) localItems = JSON.parse(rawLocal);
      } catch {
        localItems = [];
      }

      if (fetchError) {
        // CASE D: IndexedDB query failed (e.g. store missing or transaction error)
        // DO NOT treat as empty database. DO NOT overwrite LocalStorage!
        console.error(`[AcademicStructureService] IndexedDB query failed for ${col.key}. Preserving LocalStorage:`, fetchError);
        continue;
      }

      if (dbItems && dbItems.length > 0) {
        // CASE A: IndexedDB has records (Authoritative)
        // Hydrate LocalStorage cache from IndexedDB
        localStorage.setItem(col.key, JSON.stringify(dbItems));

        // If local items exist that are missing from IndexedDB, save them to IndexedDB
        for (const locItem of localItems) {
          if (!dbItems.some((dbItem: any) => dbItem.id === locItem.id)) {
            try {
              await col.saver(locItem);
            } catch (err) {
              console.warn(`[AcademicStructureService] Failed to persist missing local item to DB:`, err);
            }
          }
        }
      } else if (localItems.length > 0) {
        // CASE B: IndexedDB is empty AND LocalStorage contains records
        // Preserve LocalStorage. Persist local records into IndexedDB.
        // DO NOT replace LocalStorage with []
        for (const locItem of localItems) {
          try {
            await col.saver(locItem);
          } catch (err) {
            console.warn(`[AcademicStructureService] Failed to persist local item to DB:`, err);
          }
        }
      } else {
        // CASE C: Both IndexedDB and LocalStorage are empty
        // Maintain legitimate empty state
        if (!rawLocal) {
          localStorage.setItem(col.key, JSON.stringify([]));
        }
      }
    }

    // Automatically synchronize academic batches with active structure in IndexedDB
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch (err) {
      console.warn('[AcademicStructureService] Failed to auto-sync batches after DB sync:', err);
    }
  }

  // --- DEPARTMENTS ---
  static getDepartments(): Department[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DEPARTMENTS);
      if (!stored) {
        return DEFAULT_DEPARTMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_DEPARTMENTS;
    }
  }

  static async saveDepartment(dept: Omit<Department, 'id' | 'createdAt'> & { id?: string }): Promise<Department> {
    const list = this.getDepartments();
    const nowIso = new Date().toISOString().split('T')[0];

    let savedRecord: Department;

    if (dept.id) {
      // Edit
      const index = list.findIndex((d) => d.id === dept.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...dept };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: dept.id,
          code: dept.code.toUpperCase(),
          name: dept.name,
          headOfDepartment: dept.headOfDepartment || 'To be assigned',
          status: dept.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.unshift(savedRecord);
      }
    } else {
      // Check duplicate code or name
      const duplicate = list.find(
        (d) => d.code.toUpperCase() === dept.code.toUpperCase() || d.name.toLowerCase() === dept.name.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Department '${dept.name}' (${dept.code}) already exists.`);
      }

      savedRecord = {
        id: `DEPT-${Date.now()}`,
        code: dept.code.toUpperCase(),
        name: dept.name,
        headOfDepartment: dept.headOfDepartment || 'To be assigned',
        status: dept.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.unshift(savedRecord);
    }

    // Await authoritative IndexedDB write FIRST
    await dbStorage.saveDepartment(savedRecord);

    // Update LocalStorage cache
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEPARTMENTS, JSON.stringify(list));

    // Synchronize batches
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteDepartment(id: string): Promise<void> {
    await dbStorage.deleteDepartment(id);
    const list = this.getDepartments().filter((d) => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEPARTMENTS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleDepartmentStatus(id: string): Promise<Department> {
    const list = this.getDepartments();
    const item = list.find((d) => d.id === id);
    if (!item) throw new Error('Department not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveDepartment(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEPARTMENTS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  // --- BRANCHES ---
  static getBranches(): Branch[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BRANCHES);
      if (!stored) {
        return DEFAULT_BRANCHES;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BRANCHES;
    }
  }

  static async saveBranch(branch: Omit<Branch, 'id' | 'createdAt'> & { id?: string }): Promise<Branch> {
    const list = this.getBranches();
    const nowIso = new Date().toISOString().split('T')[0];

    let savedRecord: Branch;

    if (branch.id) {
      const index = list.findIndex((b) => b.id === branch.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...branch };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: branch.id,
          code: branch.code.toUpperCase(),
          name: branch.name,
          departmentName: branch.departmentName,
          status: branch.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.unshift(savedRecord);
      }
    } else {
      const duplicate = list.find(
        (b) => b.code.toUpperCase() === branch.code.toUpperCase() || b.name.toLowerCase() === branch.name.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Branch '${branch.name}' (${branch.code}) already exists.`);
      }

      savedRecord = {
        id: `BR-${Date.now()}`,
        code: branch.code.toUpperCase(),
        name: branch.name,
        departmentName: branch.departmentName,
        status: branch.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.unshift(savedRecord);
    }

    await dbStorage.saveBranch(savedRecord);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BRANCHES, JSON.stringify(list));

    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteBranch(id: string): Promise<void> {
    await dbStorage.deleteBranch(id);
    const list = this.getBranches().filter((b) => b.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BRANCHES, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleBranchStatus(id: string): Promise<Branch> {
    const list = this.getBranches();
    const item = list.find((b) => b.id === id);
    if (!item) throw new Error('Branch not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveBranch(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BRANCHES, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  // --- ACADEMIC YEARS ---
  static getAcademicYears(): AcademicYearEntity[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.YEARS);
      if (!stored) {
        return DEFAULT_YEARS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_YEARS;
    }
  }

  static async saveAcademicYear(year: Omit<AcademicYearEntity, 'id' | 'createdAt'> & { id?: string }): Promise<AcademicYearEntity> {
    const list = this.getAcademicYears();
    const nowIso = new Date().toISOString().split('T')[0];

    if (year.isCurrent) {
      for (const y of list) {
        if (y.isCurrent) {
          y.isCurrent = false;
          await dbStorage.saveAcademicYear(y);
        }
      }
    }

    let savedRecord: AcademicYearEntity;

    if (year.id) {
      const index = list.findIndex((y) => y.id === year.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...year };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: year.id,
          yearName: year.yearName,
          isCurrent: year.isCurrent,
          status: year.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.unshift(savedRecord);
      }
    } else {
      const duplicate = list.find((y) => y.yearName === year.yearName);
      if (duplicate) {
        throw new Error(`Academic Year '${year.yearName}' already exists.`);
      }

      savedRecord = {
        id: `AY-${Date.now()}`,
        yearName: year.yearName,
        isCurrent: year.isCurrent,
        status: year.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.unshift(savedRecord);
    }

    await dbStorage.saveAcademicYear(savedRecord);
    localStorage.setItem(LOCAL_STORAGE_KEYS.YEARS, JSON.stringify(list));

    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteAcademicYear(id: string): Promise<void> {
    await dbStorage.deleteAcademicYear(id);
    const list = this.getAcademicYears().filter((y) => y.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.YEARS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleAcademicYearStatus(id: string): Promise<AcademicYearEntity> {
    const list = this.getAcademicYears();
    const item = list.find((y) => y.id === id);
    if (!item) throw new Error('Academic Year not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveAcademicYear(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.YEARS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  // --- SEMESTERS ---
  static getSemesters(): SemesterEntity[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SEMESTERS);
      if (!stored) {
        return DEFAULT_SEMESTERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SEMESTERS;
    }
  }

  static async saveSemester(sem: Omit<SemesterEntity, 'id' | 'createdAt'> & { id?: string }): Promise<SemesterEntity> {
    const list = this.getSemesters();
    const nowIso = new Date().toISOString().split('T')[0];

    let savedRecord: SemesterEntity;

    if (sem.id) {
      const index = list.findIndex((s) => s.id === sem.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...sem };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: sem.id,
          semesterName: sem.semesterName,
          academicYear: sem.academicYear || '2026–2027',
          status: sem.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.push(savedRecord);
      }
    } else {
      savedRecord = {
        id: `SEM-${Date.now()}`,
        semesterName: sem.semesterName,
        academicYear: sem.academicYear || '2026–2027',
        status: sem.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.push(savedRecord);
    }

    await dbStorage.saveSemester(savedRecord);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEMESTERS, JSON.stringify(list));

    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteSemester(id: string): Promise<void> {
    await dbStorage.deleteSemester(id);
    const list = this.getSemesters().filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEMESTERS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleSemesterStatus(id: string): Promise<SemesterEntity> {
    const list = this.getSemesters();
    const item = list.find((s) => s.id === id);
    if (!item) throw new Error('Semester not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveSemester(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEMESTERS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  // --- SECTIONS ---
  static getSections(): SectionEntity[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS);
      if (!stored) {
        return DEFAULT_SECTIONS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SECTIONS;
    }
  }

  static async saveSection(sec: Omit<SectionEntity, 'id' | 'createdAt'> & { id?: string }): Promise<SectionEntity> {
    const list = this.getSections();
    const nowIso = new Date().toISOString().split('T')[0];

    let savedRecord: SectionEntity;

    if (sec.id) {
      const index = list.findIndex((s) => s.id === sec.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...sec };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: sec.id,
          sectionName: sec.sectionName.toUpperCase(),
          branch: sec.branch,
          status: sec.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.push(savedRecord);
      }
    } else {
      const duplicate = list.find(
        (s) => s.sectionName.toUpperCase() === sec.sectionName.toUpperCase() && s.branch === sec.branch
      );
      if (duplicate) {
        throw new Error(`Section '${sec.sectionName}' already exists under '${sec.branch}'.`);
      }

      savedRecord = {
        id: `SEC-${Date.now()}`,
        sectionName: sec.sectionName.toUpperCase(),
        branch: sec.branch,
        status: sec.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.push(savedRecord);
    }

    await dbStorage.saveSection(savedRecord);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(list));

    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteSection(id: string): Promise<void> {
    await dbStorage.deleteSection(id);
    const list = this.getSections().filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleSectionStatus(id: string): Promise<SectionEntity> {
    const list = this.getSections();
    const item = list.find((s) => s.id === id);
    if (!item) throw new Error('Section not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveSection(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  // --- PROGRAMMES ---
  static getProgrammes(): ProgrammeEntity[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRAMMES);
      if (!stored) {
        return DEFAULT_PROGRAMMES;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PROGRAMMES;
    }
  }

  static async saveProgramme(prog: Omit<ProgrammeEntity, 'id' | 'createdAt'> & { id?: string }): Promise<ProgrammeEntity> {
    const list = this.getProgrammes();
    const nowIso = new Date().toISOString().split('T')[0];

    let savedRecord: ProgrammeEntity;

    if (prog.id) {
      const index = list.findIndex((p) => p.id === prog.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...prog };
        savedRecord = list[index];
      } else {
        savedRecord = {
          id: prog.id,
          code: prog.code.toUpperCase(),
          name: prog.name,
          status: prog.status || 'ACTIVE',
          createdAt: nowIso
        };
        list.push(savedRecord);
      }
    } else {
      const duplicate = list.find(
        (p) => p.code.toUpperCase() === prog.code.toUpperCase() || p.name.toLowerCase() === prog.name.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Programme '${prog.name}' already exists.`);
      }

      savedRecord = {
        id: `PROG-${Date.now()}`,
        code: prog.code.toUpperCase(),
        name: prog.name,
        status: prog.status || 'ACTIVE',
        createdAt: nowIso
      };
      list.push(savedRecord);
    }

    await dbStorage.saveProgramme(savedRecord);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRAMMES, JSON.stringify(list));

    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}

    return savedRecord;
  }

  static async deleteProgramme(id: string): Promise<void> {
    await dbStorage.deleteProgramme(id);
    const list = this.getProgrammes().filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRAMMES, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  static async toggleProgrammeStatus(id: string): Promise<ProgrammeEntity> {
    const list = this.getProgrammes();
    const item = list.find((p) => p.id === id);
    if (!item) throw new Error('Programme not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dbStorage.saveProgramme(item);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRAMMES, JSON.stringify(list));
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
    return item;
  }

  /**
   * Helper to ensure complete parent academic structure exists before class creation.
   * Prevents duplicates and awaits all IndexedDB persistence calls.
   */
  static async ensureParentStructureExists(params: {
    saillDept: string;
    programme: string;
    branch: string;
    academicYear: string;
    semester: string;
    section: string;
  }): Promise<void> {
    const { saillDept, programme, branch, academicYear, semester, section } = params;

    // 1. Department
    const existingDepts = this.getDepartments();
    const deptMatch = existingDepts.find(
      (d) => d.name.toLowerCase() === saillDept.toLowerCase() || d.code.toUpperCase() === 'ENGL'
    );
    if (!deptMatch) {
      const code = 'ENGL';
      await this.saveDepartment({
        code,
        name: saillDept,
        headOfDepartment: 'To be assigned',
        status: 'ACTIVE'
      });
    }

    // 2. Programme
    const existingProgs = this.getProgrammes();
    const progMatch = existingProgs.find(
      (p) => p.name.toLowerCase() === programme.toLowerCase() || p.code.toUpperCase() === programme.replace(/[^a-zA-Z]/g, '').toUpperCase()
    );
    if (!progMatch) {
      const code = programme.replace(/[^a-zA-Z]/g, '').substring(0, 6).toUpperCase() || 'BTECH';
      await this.saveProgramme({
        code,
        name: programme,
        status: 'ACTIVE'
      });
    }

    // 3. Branch
    const existingBranches = this.getBranches();
    const branchMatch = existingBranches.find(
      (b) => b.name.toLowerCase() === branch.toLowerCase()
    );
    if (!branchMatch) {
      const code = branch.split(' ').map((w) => w[0]).join('').toUpperCase() || 'CIVIL';
      await this.saveBranch({
        code,
        name: branch,
        departmentName: saillDept,
        status: 'ACTIVE'
      });
    }

    // 4. Academic Year
    const existingYears = this.getAcademicYears();
    const yearMatch = existingYears.find(
      (y) => y.yearName === academicYear
    );
    if (!yearMatch) {
      await this.saveAcademicYear({
        yearName: academicYear,
        isCurrent: true,
        status: 'ACTIVE'
      });
    }

    // 5. Semester
    const semLabel = semester.startsWith('Semester') ? semester : `Semester ${semester}`;
    const existingSems = this.getSemesters();
    const semMatch = existingSems.find(
      (s) => s.semesterName === semLabel && s.academicYear === academicYear
    );
    if (!semMatch) {
      await this.saveSemester({
        semesterName: semLabel,
        academicYear: academicYear,
        status: 'ACTIVE'
      });
    }

    // 6. Section
    const secLabel = section.toUpperCase();
    const existingSecs = this.getSections();
    const secMatch = existingSecs.find(
      (s) => s.sectionName.toUpperCase() === secLabel && s.branch === branch
    );
    if (!secMatch) {
      await this.saveSection({
        sectionName: secLabel,
        branch: branch,
        status: 'ACTIVE'
      });
    }

    // Synchronize batches
    try {
      await dbStorage.syncBatchesWithAcademicStructure();
    } catch {}
  }

  // --- SAILL PROGRAM-CENTRIC ACADEMIC MODEL HELPERS ---
  static getAcademicOwner(): { department: string; subject: string; lab: string } {
    return {
      department: 'Humanities & Sciences',
      subject: 'English / Communicative English',
      lab: 'SAILL — SRIT AI Language Laboratory'
    };
  }

  static getPrograms(): Branch[] {
    return this.getBranches();
  }
}
