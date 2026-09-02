import { FacultyAssignment, FacultyAssignmentPayload } from '../types/academic';
import { StudentProfile } from '../types';
import { dbStorage } from '../lib/db';

const STORAGE_KEY = 'saill_faculty_assignments';

// Initial empty faculty assignments
const DEFAULT_ASSIGNMENTS: FacultyAssignment[] = [];

export class FacultyAssignmentService {
  static async initFromDB(): Promise<FacultyAssignment[]> {
    try {
      const dbAssignments = await dbStorage.getAllFacultyAssignments();
      if (dbAssignments && dbAssignments.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbAssignments));
        return dbAssignments;
      } else {
        const local = this.getAllAssignments();
        for (const item of local) {
          await dbStorage.saveFacultyAssignment(item);
        }
        return local;
      }
    } catch {
      return this.getAllAssignments();
    }
  }

  static getAllAssignments(): FacultyAssignment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
        return DEFAULT_ASSIGNMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  }

  static getAssignmentsForFaculty(facultyId: string): FacultyAssignment[] {
    const normId = facultyId.trim().toUpperCase();
    return this.getAllAssignments().filter(
      (a) => a.facultyId.trim().toUpperCase() === normId && a.status === 'ACTIVE'
    );
  }

  static async syncScope(
    facultyId: string,
    facultyName: string,
    department: string,
    allBatches: any[],
    allStudents: StudentProfile[]
  ): Promise<FacultyAssignment[]> {
    const normId = facultyId.trim().toUpperCase();

    // 1. Sync mapped students
    const myStudents = allStudents.filter(
      (s) => s.assignedFacultyId && s.assignedFacultyId.trim().toUpperCase() === normId
    );

    for (const st of myStudents) {
      const stBranch = st.branch || st.department || 'Civil Engineering';
      const stSem = st.semester || 'Semester II';
      const stSec = st.section || 'A';
      const stYear = st.academicYear || '2026–27';

      const matchingBatch = allBatches.find((b) => {
        const bBranch = (b.branch || b.department || '').toLowerCase();
        const bSem = (b.semester || '').toLowerCase();
        const bSec = (b.section || '').toUpperCase();
        return (
          (bBranch.includes(stBranch.toLowerCase()) || stBranch.toLowerCase().includes(bBranch)) &&
          (bSem.includes(stSem.toLowerCase()) || stSem.toLowerCase().includes(bSem)) &&
          (bSec === stSec.toUpperCase())
        );
      });

      if (matchingBatch && matchingBatch.assignedFacultyInchargeId !== normId) {
        matchingBatch.assignedFacultyInchargeId = normId;
        matchingBatch.assignedFacultyInchargeName = facultyName;
        try {
          await dbStorage.updateBatch(matchingBatch.id, {
            assignedFacultyInchargeId: normId,
            assignedFacultyInchargeName: facultyName
          }, 'System');
        } catch {
          // ignore
        }
      }

      try {
        await this.createAssignment(
          {
            facultyId: normId,
            facultyName: facultyName,
            department: department || 'Humanities & Sciences',
            branch: stBranch,
            academicYear: stYear,
            semester: stSem,
            section: stSec,
            isOverride: true
          },
          'System'
        );
      } catch {
        // duplicate expected
      }
    }

    // 2. Sync assigned batches
    const myBatches = allBatches.filter(
      (b) => b.assignedFacultyInchargeId && b.assignedFacultyInchargeId.trim().toUpperCase() === normId
    );

    for (const b of myBatches) {
      try {
        await this.createAssignment(
          {
            facultyId: normId,
            facultyName: b.assignedFacultyInchargeName || facultyName,
            department: b.saillDepartment || b.department || 'Humanities & Sciences',
            branch: b.branch || b.department,
            academicYear: b.academicYear || '2026–27',
            semester: b.semester || 'Semester II',
            section: b.section || 'A',
            isOverride: true
          },
          'System'
        );
      } catch {
        // duplicate expected
      }
    }

    return this.getAssignmentsForFaculty(normId);
  }

  static async createAssignment(
    payload: FacultyAssignmentPayload,
    assignedBy = 'Administrator'
  ): Promise<FacultyAssignment> {
    const list = this.getAllAssignments();
    const normFacultyId = payload.facultyId.trim().toUpperCase();

    // Check duplicate assignment for the same faculty
    const duplicate = list.find(
      (a) =>
        a.facultyId.trim().toUpperCase() === normFacultyId &&
        a.branch.trim().toLowerCase() === payload.branch.trim().toLowerCase() &&
        a.section.trim().toLowerCase() === payload.section.trim().toLowerCase() &&
        a.academicYear.trim().toLowerCase() === payload.academicYear.trim().toLowerCase() &&
        a.semester.trim().toLowerCase() === payload.semester.trim().toLowerCase() &&
        a.status === 'ACTIVE'
    );

    if (duplicate) {
      throw new Error(
        `Duplicate Assignment Error: ${payload.facultyName} (${payload.facultyId}) is ALREADY assigned to ${payload.branch} - Section ${payload.section} (${payload.academicYear}, ${payload.semester}).`
      );
    }

    // Check if section is already assigned to a DIFFERENT active faculty member
    const conflicting = list.find(
      (a) =>
        a.facultyId.trim().toUpperCase() !== normFacultyId &&
        a.branch.trim().toLowerCase() === payload.branch.trim().toLowerCase() &&
        a.section.trim().toLowerCase() === payload.section.trim().toLowerCase() &&
        a.academicYear.trim().toLowerCase() === payload.academicYear.trim().toLowerCase() &&
        a.semester.trim().toLowerCase() === payload.semester.trim().toLowerCase() &&
        a.status === 'ACTIVE'
    );

    if (conflicting && !payload.isOverride) {
      throw new Error(
        `Section Conflict Warning: ${payload.branch} - Section ${payload.section} is currently assigned to ${conflicting.facultyName} (${conflicting.facultyId}). Enable "Override Assignment" if you wish to reassign.`
      );
    }

    // If override, deactivate conflicting previous assignment
    if (conflicting && payload.isOverride) {
      conflicting.status = 'INACTIVE';
      conflicting.lastUpdated = new Date().toISOString();
    }

    const nowIso = new Date().toISOString().split('T')[0];
    const allocId = `FAE-ALLOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestampIso = new Date().toISOString();

    const newRecord: FacultyAssignment = {
      id: `FA-${Date.now()}`,
      allocationId: allocId,
      facultyId: normFacultyId,
      facultyName: payload.facultyName.trim(),
      department: payload.department,
      branch: payload.branch,
      academicYear: payload.academicYear,
      semester: payload.semester,
      section: payload.section,
      sections: payload.sections || [payload.section],
      assignedDate: nowIso,
      allocationTimestamp: timestampIso,
      lastUpdated: timestampIso,
      assignedBy: assignedBy,
      status: 'ACTIVE'
    };

    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Persist permanently to IndexedDB
    try {
      await dbStorage.saveFacultyAssignment(newRecord);
    } catch (e) {
      console.warn('Failed to save faculty assignment to IndexedDB:', e);
    }

    // Log Audit Trail
    try {
      await dbStorage.logAuditTrail(
        'FACULTY_ALLOCATION_UPDATE',
        `Allocated Academic Scope [Alloc ID: ${allocId}] to ${payload.facultyName} (${normFacultyId}): ${payload.branch} - Section ${payload.section} (${payload.academicYear}, ${payload.semester}).${payload.isOverride ? ' (Overridden)' : ''}`,
        assignedBy,
        assignedBy,
        'ADMINISTRATOR'
      );
    } catch {
      // Audit log fallback
    }

    // Trigger auto-mapping for unmapped students
    try {
      await dbStorage.autoMapUnmappedStudents();
    } catch {
      // Ignore fallback
    }

    return newRecord;
  }

  /**
   * Save Multi-section Allocation for a Faculty member
   */
  static async saveMultiSectionAllocation(
    payload: {
      facultyId: string;
      facultyName: string;
      department: string;
      branch: string;
      academicYear: string;
      semester: string;
      sections: string[]; // e.g. ['Section A', 'Section B'] or ['CSE-A', 'CSE-B']
      isOverride?: boolean;
    },
    assignedBy = 'Administrator'
  ): Promise<FacultyAssignment[]> {
    const results: FacultyAssignment[] = [];
    const allocId = `FAE-ALLOC-${Date.now()}`;
    const timestampIso = new Date().toISOString();

    for (const sectionName of payload.sections) {
      const record = await this.createAssignment(
        {
          facultyId: payload.facultyId,
          facultyName: payload.facultyName,
          department: payload.department,
          branch: payload.branch,
          academicYear: payload.academicYear,
          semester: payload.semester,
          section: sectionName,
          sections: payload.sections,
          isOverride: payload.isOverride
        },
        assignedBy
      );
      record.allocationId = allocId;
      record.allocationTimestamp = timestampIso;
      results.push(record);
    }

    return results;
  }

  /**
   * Workload Summary calculation
   */
  static getFacultyWorkload(facultyId: string, allStudents: StudentProfile[]) {
    const activeAssignments = this.getAssignmentsForFaculty(facultyId);
    const assignedStudents = this.getAssignedStudentsForFaculty(facultyId, allStudents);

    // Calculate unique sections
    const uniqueSections = new Set(activeAssignments.map((a) => `${a.branch}-${a.section}`));

    // Total modules in SAILL curriculum (Modules 1-10)
    const totalModules = 10;

    // Calculate average progress across mapped students
    let totalScore = 0;
    let pendingReviews = 0;

    assignedStudents.forEach((student) => {
      const score = student.overallScore || student.averageScore || student.overallProgressPercentage || 0;
      totalScore += score;

      // Pending reviews if portfolio items exist with pending evaluation
      if (student.portfolioItems) {
        const unreviewed = student.portfolioItems.filter((item) => !item.facultyFeedback && !item.graded);
        pendingReviews += unreviewed.length;
      }
    });

    const averageProgress =
      assignedStudents.length > 0 ? Math.round(totalScore / assignedStudents.length) : 0;

    return {
      totalSections: uniqueSections.size,
      totalStudents: assignedStudents.length,
      totalModules,
      averageProgress,
      pendingReviews
    };
  }

  static async updateAssignment(id: string, updatedPayload: Partial<FacultyAssignmentPayload>): Promise<FacultyAssignment> {
    const list = this.getAllAssignments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Assignment record not found.');
    }

    list[index] = { ...list[index], ...updatedPayload, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    try {
      await dbStorage.saveFacultyAssignment(list[index]);
    } catch {
      // fallback
    }
    return list[index];
  }

  static async deleteAssignment(id: string): Promise<void> {
    const list = this.getAllAssignments().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    try {
      await dbStorage.deleteFacultyAssignment(id);
    } catch {
      // fallback
    }
  }

  static async toggleAssignmentStatus(id: string): Promise<FacultyAssignment> {
    const list = this.getAllAssignments();
    const item = list.find((a) => a.id === id);
    if (!item) throw new Error('Assignment record not found.');
    item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    item.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    try {
      await dbStorage.saveFacultyAssignment(item);
    } catch {
      // fallback
    }
    return item;
  }

  /**
   * Automatic Student Mapping
   * Dynamically filters students based on active FacultyAssignments.
   * Matches Branch, Academic Year / Year, Semester, and Section.
   */
  static getAssignedStudentsForFaculty(
    facultyId: string,
    allStudents: StudentProfile[]
  ): StudentProfile[] {
    const normId = facultyId.trim().toUpperCase();
    const activeAssignments = this.getAssignmentsForFaculty(facultyId);

    return allStudents.filter((student) => {
      // 1. Explicit Direct Manual Assignment Match
      if (student.assignedFacultyId && student.assignedFacultyId.trim().toUpperCase() === normId) {
        return true;
      }

      if (!activeAssignments || activeAssignments.length === 0) {
        return false;
      }

      return activeAssignments.some((assignment) => {
        // 1. Branch Match (Exact or substring/department)
        const sBranch = (student.branch || student.department || '').toLowerCase();
        const aBranch = (assignment.branch || assignment.department || '').toLowerCase();
        const branchMatch =
          sBranch === aBranch ||
          sBranch.includes(aBranch) ||
          aBranch.includes(sBranch) ||
          (sBranch.includes('cse') && aBranch.includes('cse')) ||
          (sBranch.includes('ece') && aBranch.includes('ece'));

        // 2. Section Match
        const sSec = (student.section || '').toUpperCase().trim();
        const aSec = (assignment.section || '').toUpperCase().trim();
        const sectionMatch =
          sSec === aSec ||
          sSec.endsWith(aSec) ||
          aSec.endsWith(sSec) ||
          sSec.includes(aSec);

        // 3. Year / Academic Year Match
        const sYear = (student.year || student.academicYear || '').toLowerCase();
        const aYear = (assignment.academicYear || '').toLowerCase();
        const yearMatch =
          !sYear ||
          !aYear ||
          sYear.includes('2026') ||
          aYear.includes('2026') ||
          sYear.includes(aYear) ||
          aYear.includes(sYear) ||
          sYear.includes('i year') ||
          sYear.includes('r26');

        // 4. Semester Match
        const sSem = (student.semester || '').toLowerCase();
        const aSem = (assignment.semester || '').toLowerCase();
        const semMatch =
          !sSem ||
          !aSem ||
          sSem === aSem ||
          sSem.includes('semester i') ||
          aSem.includes('semester i');

        return branchMatch && sectionMatch && yearMatch && semMatch;
      });
    });
  }
}
