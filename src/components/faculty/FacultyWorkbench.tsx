import React, { useState, useEffect } from 'react';
import { StudentProfile, PortfolioItem, UserRole } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { FacultyWorkbenchTabKey } from '../../types/faculty';
import { dbStorage } from '../../lib/db';
import { AuthService } from '../../services/AuthService';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { FacultyPermissionGuard } from '../../services/FacultyPermissionGuard';

import { FacultySidebar } from './FacultySidebar';
import { FacultyHomeTab } from './FacultyHomeTab';
import { FacultyClassesTab } from './FacultyClassesTab';
import { FacultyStudentsTab } from './FacultyStudentsTab';
import { FacultyStudentProfileModal } from './FacultyStudentProfileModal';
import { FacultyModulesTab } from './FacultyModulesTab';
import { FacultyReleaseModulesTab } from './FacultyReleaseModulesTab';
import { FacultyAssignmentsTab } from './FacultyAssignmentsTab';
import { FacultyProgressMonitorTab } from './FacultyProgressMonitorTab';
import { FacultyAIInsightsTab } from './FacultyAIInsightsTab';
import { FacultyAssessmentsTab } from './FacultyAssessmentsTab';
import { FacultyStudentPortfolioTab } from './FacultyStudentPortfolioTab';
import { FacultyReportsTab } from './FacultyReportsTab';
import { FacultySettingsTab } from './FacultySettingsTab';
import { FacultyModuleEvaluationTab } from './FacultyModuleEvaluationTab';
import { ShieldAlert } from 'lucide-react';

interface FacultyWorkbenchProps {
  portfolioItems: PortfolioItem[];
  onOpenModule: (moduleId: string) => void;
  activeRole?: UserRole;
}

export const FacultyWorkbench: React.FC<FacultyWorkbenchProps> = ({
  portfolioItems,
  onOpenModule,
  activeRole = 'FACULTY_INCHARGE'
}) => {
  const currentUser = AuthService.getCurrentUser();
  const currentEmpId = currentUser?.employeeId || currentUser?.username || 'EMP-ENG-101';
  const facultyName = currentUser?.name || 'Dr. V. Lakshmi';
  const department = currentUser?.department || 'Humanities & Sciences (English)';

  const [activeTab, setActiveTab] = useState<FacultyWorkbenchTabKey>('home');
  const [assignedStudents, setAssignedStudents] = useState<StudentProfile[]>([]);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<FacultyAssignment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [accountStatus, setAccountStatus] = useState<
    'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED'
  >('APPROVED');

  useEffect(() => {
    loadFacultyScopeData();
  }, [currentEmpId, activeRole]);

  const loadFacultyScopeData = async () => {
    try {
      // Check status from registered users / faculty account table
      const registeredUser = await dbStorage.getUserRegistration(currentEmpId);
      const facultyAccount = await dbStorage.getFacultyByEmployeeId(currentEmpId);

      if (registeredUser) {
        if (registeredUser.status === 'PENDING_APPROVAL') {
          setAccountStatus('PENDING_APPROVAL');
        } else if (registeredUser.status === 'REJECTED') {
          setAccountStatus('REJECTED');
        } else {
          setAccountStatus('APPROVED');
        }
      } else if (facultyAccount) {
        if (facultyAccount.status === 'pending') {
          setAccountStatus('PENDING_APPROVAL');
        } else if (facultyAccount.status === 'rejected') {
          setAccountStatus('REJECTED');
        } else {
          setAccountStatus('APPROVED');
        }
      } else {
        setAccountStatus('APPROVED');
      }

      const fetchedStudents = await dbStorage.getAllProfiles();
      setAllStudents(fetchedStudents);

      const allBatches = await dbStorage.getAllBatches();

      const isAdministrator =
        activeRole.toString().toUpperCase() === 'ADMINISTRATOR' ||
        currentUser?.role?.toUpperCase() === 'ADMINISTRATOR';

      if (isAdministrator) {
        const allAssigns = FacultyAssignmentService.getAllAssignments();
        setActiveAssignments(allAssigns);
        setAssignedStudents(fetchedStudents);
      } else {
        await FacultyAssignmentService.syncScope(
          currentEmpId,
          facultyName,
          department,
          allBatches,
          fetchedStudents
        );

        const myAssigns = FacultyAssignmentService.getAssignmentsForFaculty(currentEmpId);
        setActiveAssignments(myAssigns);

        const mapped = FacultyAssignmentService.getAssignedStudentsForFaculty(
          currentEmpId,
          fetchedStudents
        );
        setAssignedStudents(mapped);
      }
    } catch {
      setAccountStatus('APPROVED');
    }
  };

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
  };

  // Permission Verification Guard
  if (!FacultyPermissionGuard.isFacultyOrAdmin(activeRole)) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-300 shadow-lg text-center space-y-4 max-w-lg mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-[#2C3E50]">Access Restricted</h2>
        <p className="text-xs text-gray-600">
          Faculty Workspace is accessible exclusively to Faculty Incharges and Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start pb-12">
      {/* Fixed Left Sidebar Navigation */}
      <FacultySidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        facultyName={facultyName}
        employeeId={currentEmpId}
        department={department}
        assignedCount={assignedStudents.length}
      />

      {/* Main Tab Content Area */}
      <div className="flex-1 w-full min-w-0">
        {activeTab === 'home' && (
          <FacultyHomeTab
            assignments={activeAssignments}
            assignedStudents={assignedStudents}
            facultyName={facultyName}
            accountStatus={accountStatus}
            onSelectTab={setActiveTab}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'classes' && (
          <FacultyClassesTab
            assignments={activeAssignments}
            assignedStudents={assignedStudents}
            facultyName={facultyName}
            onSelectStudent={handleSelectStudent}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'students' && (
          <FacultyStudentsTab
            assignedStudents={assignedStudents}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'release-modules' && (
          <FacultyReleaseModulesTab
            assignments={activeAssignments}
            assignedStudents={assignedStudents}
          />
        )}

        {activeTab === 'modules' && (
          <FacultyModulesTab
            assignedStudents={assignedStudents}
            onOpenModule={onOpenModule}
          />
        )}

        {activeTab === 'assignments' && (
          <FacultyAssignmentsTab
            assignments={activeAssignments}
            allStudents={allStudents}
          />
        )}

        {activeTab === 'progress-monitor' && (
          <FacultyProgressMonitorTab
            assignedStudents={assignedStudents}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'module-scoring' && (
          <FacultyModuleEvaluationTab
            assignedStudents={assignedStudents}
            facultyId={currentEmpId}
            facultyName={facultyName}
            facultyDepartment={department}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'ai-insights' && <FacultyAIInsightsTab />}

        {activeTab === 'assessments' && (
          <FacultyAssessmentsTab
            assignedStudents={assignedStudents}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'portfolio' && (
          <FacultyStudentPortfolioTab assignedStudents={assignedStudents} />
        )}

        {activeTab === 'reports' && (
          <FacultyReportsTab
            assignedStudents={assignedStudents}
            facultyName={facultyName}
            department={department}
          />
        )}

        {activeTab === 'settings' && (
          <FacultySettingsTab
            facultyName={facultyName}
            employeeId={currentEmpId}
            department={department}
          />
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <FacultyStudentProfileModal
          student={selectedStudent}
          facultyId={currentEmpId}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};
