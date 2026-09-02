export interface ProgrammeEntity {
  id: string;
  code: string;
  name: string; // e.g. 'B.Tech', 'M.Tech', 'MBA', 'MCA'
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  departmentId?: string;
  departmentName: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface AcademicYearEntity {
  id: string;
  yearName: string; // e.g., '2026–2027'
  isCurrent: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SemesterEntity {
  id: string;
  semesterName: string; // e.g., 'Semester I'
  academicYear: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SectionEntity {
  id: string;
  sectionName: string; // e.g., 'CSE-A'
  branch: string;
  branchName?: string;
  academicYear?: string;
  semester?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface FacultyAssignment {
  id: string;
  allocationId?: string;
  facultyId: string; // Employee ID
  facultyName: string;
  department: string;
  branch: string;
  academicYear: string;
  semester: string;
  section: string;
  sections?: string[];
  assignedDate: string;
  allocationTimestamp?: string;
  lastUpdated?: string;
  assignedBy: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FacultyAssignmentPayload {
  facultyId: string;
  facultyName: string;
  department: string;
  branch: string;
  academicYear: string;
  semester: string;
  section: string;
  sections?: string[];
  isOverride?: boolean;
}

export type AcademicStructureType = 'department' | 'programme' | 'branch' | 'academicYear' | 'semester' | 'section' | 'classWizard';

export interface ModuleReleaseRecord {
  id: string; // `${batchId}__${moduleId}`
  batchId: string;
  moduleId: string;
  released: boolean;
  releasedAt: string;
  releasedBy: string;
}
