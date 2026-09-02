import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Bell
} from 'lucide-react';
import { FacultyAccount, StudentProfile } from '../types';
import { FacultyAssignment } from '../types/academic';
import { dbStorage } from '../lib/db';
import { FacultyAssignmentService } from '../services/FacultyAssignmentService';

// Sidebar & Views
import { AdminSidebar, AdminTabKey } from '../components/admin/AdminSidebar';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminEvaluationMonitoringTab } from '../components/admin/AdminEvaluationMonitoringTab';
import { UserManagementTab } from '../components/admin/UserManagementTab';
import { AcademicManagerTab } from '../components/admin/AcademicManagerTab';
import { ModuleManagementTab } from '../components/admin/ModuleManagementTab';
import { FacultyCardsTab } from '../components/admin/FacultyCardsTab';
import { StudentCardsTab } from '../components/admin/StudentCardsTab';
import { AIMonitoringTab } from '../components/admin/AIMonitoringTab';
import { ReportsAnalyticsTab } from '../components/admin/ReportsAnalyticsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { ActivityLogsTab } from '../components/admin/ActivityLogsTab';
import { DeveloperConsoleTab } from '../components/admin/DeveloperConsoleTab';

interface AdminControlPageProps {
  onOpenModule?: (moduleId: string) => void;
}

export const AdminControlPage: React.FC<AdminControlPageProps> = ({ onOpenModule }) => {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [pendingRegistrations, setPendingRegistrations] = useState<FacultyAccount[]>([]);
  const [pendingStudents, setPendingStudents] = useState<StudentProfile[]>([]);
  const [allFaculty, setAllFaculty] = useState<FacultyAccount[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pending = await dbStorage.getPendingFacultyRegistrations();
      const pendingStus = await dbStorage.getPendingStudentRegistrations();
      const facs = await dbStorage.getAllFaculty();
      const stus = await dbStorage.getAllProfiles();
      const asgs = FacultyAssignmentService.getAllAssignments();

      setPendingRegistrations(pending);
      setPendingStudents(pendingStus);
      setAllFaculty(facs);
      setStudents(stus);
      setAssignments(asgs);
    } catch {
      // Fallback load
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveFacultyFromDash = async (empId: string) => {
    try {
      await dbStorage.approveFacultyAccount(empId, 'Administrator');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve account.');
    }
  };

  const handleRejectFacultyFromDash = async (empId: string) => {
    const reason = prompt(
      `Enter rejection reason for employee ID ${empId}:`,
      'Registration details could not be verified'
    );
    if (!reason) return;
    try {
      await dbStorage.rejectFacultyAccount(empId, reason, 'Administrator');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject account.');
    }
  };

  const handleResetFacultyPassword = async (empId: string, name: string) => {
    const newPass = prompt(`Enter new password for Faculty ${name} (${empId}):`, 'SritFaculty#2026');
    if (!newPass) return;
    try {
      await dbStorage.resetFacultyPassword(empId, newPass, 'Administrator');
      alert(`Password for ${name} successfully reset.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reset password.');
    }
  };

  const handleToggleFacultyStatus = async (empId: string) => {
    try {
      await dbStorage.toggleFacultyStatus(empId, 'Administrator');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const handleResetStudentPassword = async (rollNo: string, name: string) => {
    const newPass = prompt(`Enter new password for Student ${name} (${rollNo}):`, 'SritStudent#2026');
    if (!newPass) return;
    try {
      await dbStorage.resetStudentPassword(rollNo, newPass, 'Administrator');
      alert(`Password for student ${name} (${rollNo}) reset successfully.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reset student password.');
    }
  };

  const handleDeleteStudent = async (rollNo: string, name: string) => {
    if (!confirm(`Are you sure you want to delete student profile ${name} (${rollNo})?`)) return;
    try {
      await dbStorage.deleteStudentProfile(rollNo);
      alert(`Student profile ${name} deleted.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete student profile.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#FFF8F0]/40 -m-6 text-[#2C3E50]">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={pendingRegistrations.length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* MAIN COMMAND CENTER CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden space-y-6">
        {/* Command Center Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white rounded-2xl border-2 border-[#FAD7A0]/30 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D35400] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FAD7A0]" />
                <span>SRIT Administrator Command Center</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight font-serif text-[#FAD7A0]">
                Academic Governance & Lab Operations Portal
              </h1>
              <p className="text-xs text-gray-200">
                SRIT Department of English & Humanities • R26 Communicative English Laboratory
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={loadData}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 border border-white/20 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FAD7A0] ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sync Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE TAB VIEW RENDERER */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              studentsCount={students.length}
              facultyCount={allFaculty.length}
              assignmentsCount={assignments.length}
              pendingRegistrations={pendingRegistrations}
              pendingStudentsCount={pendingStudents.length}
              pendingStudents={pendingStudents}
              students={students}
              allFaculty={allFaculty}
              assignments={assignments}
              onNavigateTab={setActiveTab}
              onApproveFaculty={handleApproveFacultyFromDash}
              onRejectFaculty={handleRejectFacultyFromDash}
              onRefreshData={loadData}
            />
          )}

          {activeTab === 'monitoring' && (
            <AdminEvaluationMonitoringTab
              students={students}
              allFaculty={allFaculty}
              assignments={assignments}
              onRefreshData={loadData}
            />
          )}

          {activeTab === 'users' && (
            <UserManagementTab
              pendingRegistrations={pendingRegistrations}
              allFaculty={allFaculty}
              students={students}
              onRefreshData={loadData}
            />
          )}

          {activeTab === 'academic' && <AcademicManagerTab />}

          {activeTab === 'modules' && <ModuleManagementTab onOpenModule={onOpenModule} />}

          {activeTab === 'faculty' && (
            <FacultyCardsTab
              facultyList={allFaculty}
              studentsList={students}
              assignmentsList={assignments}
              onOpenAssignModal={() => setActiveTab('academic')}
              onResetPassword={handleResetFacultyPassword}
              onToggleStatus={handleToggleFacultyStatus}
              onRefreshData={loadData}
            />
          )}

          {activeTab === 'students' && (
            <StudentCardsTab
              studentsList={students}
              facultyList={allFaculty}
              assignmentsList={assignments}
              onResetPassword={handleResetStudentPassword}
              onDeleteStudent={handleDeleteStudent}
              onRefreshData={loadData}
            />
          )}

          {activeTab === 'ai-monitoring' && <AIMonitoringTab />}

          {activeTab === 'reports' && <ReportsAnalyticsTab />}

          {activeTab === 'settings' && <AdminSettingsTab />}

          {activeTab === 'activity-logs' && <ActivityLogsTab />}

          {activeTab === 'developer-console' && <DeveloperConsoleTab />}
        </div>
      </main>
    </div>
  );
};
