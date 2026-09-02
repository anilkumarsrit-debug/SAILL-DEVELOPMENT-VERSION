import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Page, StudentProfile, ModuleProgress, RecordingItem, PortfolioItem, UserRole } from './types';
import { getModuleById } from './data/modulesData';
import { dbStorage } from './lib/db';
import { usePWA, registerServiceWorker } from './lib/pwa';
import { AuthService } from './services/AuthService';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { normalizeRole } from './types/auth';

// Navigation & Layout Components
import { PublicNavbar } from './components/navigation/PublicNavbar';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { Breadcrumb, BreadcrumbItem } from './components/layout/Breadcrumb';
import { PWAInstallBanner } from './components/navigation/PWAInstallBanner';
import { OfflineIndicator } from './components/navigation/OfflineIndicator';
import { ApplicationSplashScreen } from './components/ApplicationSplashScreen';
import { HelpModal } from './components/HelpModal';
import { Footer } from './components/Footer';
import { SkeletonCard, SkeletonTable } from './components/ui/Skeleton';
import { NotificationProvider } from './context/NotificationContext';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import { BootstrapSetupWizardModal } from './components/admin/BootstrapSetupWizardModal';
import { QuickReviewButton } from './components/admin/QuickReviewButton';
import { PlatformInitializationService } from './services/PlatformInitializationService';
import { AcademicStructureService } from './services/AcademicStructureService';
import { ModuleReleaseService } from './services/ModuleReleaseService';

// Lazy-loaded Pages - Phase 1 & 2 & 3
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const RegisterChoicePage = lazy(() => import('./pages/RegisterChoicePage').then(m => ({ default: m.RegisterChoicePage })));
const StudentRegisterPage = lazy(() => import('./pages/StudentRegisterPage').then(m => ({ default: m.StudentRegisterPage })));
const FacultyRegisterPage = lazy(() => import('./pages/FacultyRegisterPage').then(m => ({ default: m.FacultyRegisterPage })));
const PendingApprovalPage = lazy(() => import('./pages/PendingApprovalPage').then(m => ({ default: m.PendingApprovalPage })));
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const LaboratoryModulesPage = lazy(() => import('./pages/LaboratoryModulesPage').then(m => ({ default: m.LaboratoryModulesPage })));
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetailPage').then(m => ({ default: m.ModuleDetailPage })));
const PracticeCenterPage = lazy(() => import('./pages/PracticeCenterPage').then(m => ({ default: m.PracticeCenterPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const ProgressDashboardPage = lazy(() => import('./pages/ProgressDashboardPage').then(m => ({ default: m.ProgressDashboardPage })));
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage').then(m => ({ default: m.StudentProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AILearningEnginePage = lazy(() => import('./pages/AILearningEnginePage').then(m => ({ default: m.AILearningEnginePage })));

// Lazy-loaded Pages - Phase 4 Academic Management & Quality
const FacultyDashboardPage = lazy(() => import('./pages/FacultyDashboardPage').then(m => ({ default: m.FacultyDashboardPage })));
const DigitalAttendancePage = lazy(() => import('./pages/DigitalAttendancePage').then(m => ({ default: m.DigitalAttendancePage })));
const RubricAssessmentPage = lazy(() => import('./pages/RubricAssessmentPage').then(m => ({ default: m.RubricAssessmentPage })));
const InternalMarkCalculatorPage = lazy(() => import('./pages/InternalMarkCalculatorPage').then(m => ({ default: m.InternalMarkCalculatorPage })));
const AcademicAnalyticsPage = lazy(() => import('./pages/AcademicAnalyticsPage').then(m => ({ default: m.AcademicAnalyticsPage })));
const FacultyPortfolioReviewPage = lazy(() => import('./pages/FacultyPortfolioReviewPage').then(m => ({ default: m.FacultyPortfolioReviewPage })));
const AcademicReportsPage = lazy(() => import('./pages/AcademicReportsPage').then(m => ({ default: m.AcademicReportsPage })));
const AIFacultyAssistantPage = lazy(() => import('./pages/AIFacultyAssistantPage').then(m => ({ default: m.AIFacultyAssistantPage })));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const AdminControlPage = lazy(() => import('./pages/AdminControlPage').then(m => ({ default: m.AdminControlPage })));
const SystemHealthPage = lazy(() => import('./pages/SystemHealthPage').then(m => ({ default: m.SystemHealthPage })));
const QEFFrameworkPage = lazy(() => import('./pages/QEFFrameworkPage').then(m => ({ default: m.QEFFrameworkPage })));
const ProductionCertificationPage = lazy(() => import('./pages/ProductionCertificationPage').then(m => ({ default: m.ProductionCertificationPage })));

const PageFallback = () => (
  <div className="space-y-6 animate-pulse p-4">
    <SkeletonCard />
    <SkeletonTable rows={4} />
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  // Layout states for Collapsible Left Sidebar (with localStorage persistence) & Help Modal
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('saill_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Platform Initialization Engine (PIE) State
  const [isBootstrapOpen, setIsBootstrapOpen] = useState<boolean>(() => {
    return !PlatformInitializationService.isPlatformInitialized();
  });

  const handleBootstrapComplete = () => {
    setIsBootstrapOpen(false);
    AuthService.logout();
    setActiveRole('STUDENT');
    setCurrentPage('login');
  };

  const { isOffline, isInstallable, isInstalled, triggerInstall } = usePWA();

  useEffect(() => {
    registerServiceWorker();
    loadAppData();

    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get('page');
    const tokenParam = searchParams.get('token');

    if (pageParam === 'reset-password' || tokenParam) {
      if (tokenParam) {
        setResetToken(tokenParam);
      }
      setCurrentPage('reset-password');
    } else if (pageParam === 'forgot-password') {
      setCurrentPage('forgot-password');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('saill_sidebar_collapsed', String(next));
      return next;
    });
  };

  const loadAppData = async () => {
    const isInit = await PlatformInitializationService.checkAndRecoverInitialization();
    setIsBootstrapOpen(!isInit);

    await AcademicStructureService.syncWithIndexedDB().catch(() => {});

    const sessionUser = AuthService.getCurrentUser();
    if (sessionUser) {
      setActiveRole(normalizeRole(sessionUser.role));
    } else {
      setActiveRole('STUDENT');
    }

    let prof = await dbStorage.getProfile();
    const prog = await dbStorage.getProgressMap();
    const recs = await dbStorage.getRecordings();
    const port = await dbStorage.getPortfolio();

    if (sessionUser) {
      if (sessionUser.role === 'STUDENT') {
        const studentFromDB = sessionUser.rollNo ? await dbStorage.getProfileByRollNo(sessionUser.rollNo) : null;
        if (studentFromDB) {
          prof = {
            ...studentFromDB,
            name: sessionUser.name || studentFromDB.name,
            rollNo: sessionUser.rollNo || studentFromDB.rollNo,
            email: sessionUser.email || studentFromDB.email || prof.email
          };
        } else {
          prof = {
            ...prof,
            name: sessionUser.name || prof.name || 'Demo Student',
            email: sessionUser.email || prof.email || '',
            department: sessionUser.department || prof.department || 'CSE',
            rollNo: sessionUser.rollNo || prof.rollNo || '264G1A0501'
          };
        }
      }
    }

    setProfile(prof);
    setProgressMap(prog);
    setRecordings(recs);
    setPortfolioItems(port);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModule = (moduleId: string) => {
    if (activeRole === 'STUDENT' && profile) {
      const accessInfo = ModuleReleaseService.getModuleAccessInfo(
        profile,
        moduleId,
        progressMap[moduleId]
      );
      if (!accessInfo.isAccessible) {
        return;
      }
    }
    setSelectedModuleId(moduleId);
    setCurrentPage('module-detail');
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Security Guard: Prevent direct navigation or refresh access to locked modules for students
  useEffect(() => {
    if (currentPage === 'module-detail' && selectedModuleId && activeRole === 'STUDENT' && profile) {
      const accessInfo = ModuleReleaseService.getModuleAccessInfo(
        profile,
        selectedModuleId,
        progressMap[selectedModuleId]
      );
      if (!accessInfo.isAccessible) {
        setCurrentPage('dashboard');
        setSelectedModuleId('pronunciation');
      }
    }
  }, [currentPage, selectedModuleId, activeRole, profile, progressMap]);

  const handleProfileUpdate = async (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    await loadAppData();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setActiveRole('STUDENT');
    handleNavigate('landing');
    await loadAppData();
  };

  const handleProgressUpdate = async (updatedProgress: ModuleProgress) => {
    const newMap = { ...progressMap, [updatedProgress.moduleId]: updatedProgress };
    setProgressMap(newMap);
    await dbStorage.saveModuleProgress(updatedProgress);
  };

  // Scroll to section helper on Public Landing Page
  const scrollToPublicSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] text-[#2C3E50] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-[#D35400]">Loading SAILL Academic System...</p>
        </div>
      </div>
    );
  }

  const selectedModule = selectedModuleId ? getModuleById(selectedModuleId) : null;
  const currentModuleProgress: ModuleProgress =
    selectedModuleId && progressMap[selectedModuleId]
      ? progressMap[selectedModuleId]
      : {
          moduleId: selectedModuleId || '',
          status: 'not_started',
          completedTabs: [],
          savedNotes: '',
          score: 0,
          reflectionNotes: '',
          lastAccessed: new Date().toISOString()
        };

  const isPublicWebsite =
    currentPage === 'landing' ||
    currentPage === 'login' ||
    currentPage === 'forgot-password' ||
    currentPage === 'reset-password' ||
    currentPage === 'register-choice' ||
    currentPage === 'register-student' ||
    currentPage === 'register-faculty' ||
    currentPage === 'pending-approval';

  // Dynamic Breadcrumb Generator
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    switch (currentPage) {
      case 'dashboard':
        return [{ label: 'Student Workspace' }];
      case 'faculty-dashboard':
        return [{ label: 'Faculty Workbench' }];
      case 'admin-control':
        return [{ label: 'Administrator Command Center' }];
      case 'modules':
        return [{ label: 'Lab Modules' }];
      case 'module-detail':
        return [
          { label: 'Lab Modules', page: 'modules' },
          { label: selectedModule ? selectedModule.title : 'Module Detail' }
        ];
      case 'ai-engine':
        return [{ label: 'AI Learning Engine' }];
      case 'practice':
        return [{ label: 'Practice Centre' }];
      case 'portfolio':
        return [{ label: 'Student Portfolio' }];
      case 'progress':
        return [{ label: 'Progress Dashboard' }];
      case 'profile':
        return [{ label: 'Student Profile' }];
      case 'settings':
        return [{ label: 'System Settings' }];
      case 'announcements':
        return [{ label: 'Notices & Announcements' }];
      case 'attendance':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'Digital Attendance' }];
      case 'rubrics':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'Rubric Assessment' }];
      case 'internal-marks':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'CIA Internal Marks' }];
      case 'analytics':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'Academic Analytics & CO-PO' }];
      case 'reports':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'Academic Reports' }];
      case 'faculty-assistant':
        return [{ label: 'Faculty Workbench', page: 'faculty-dashboard' }, { label: 'AI Faculty Assistant' }];
      case 'system-health':
        return [{ label: 'Admin Command Center', page: 'admin-control' }, { label: 'System Health' }];
      case 'qef-framework':
        return [{ label: 'Admin Command Center', page: 'admin-control' }, { label: 'QEF Quality Framework' }];
      case 'production-certification':
        return [{ label: 'Admin Command Center', page: 'admin-control' }, { label: 'V1.0 Certification' }];
      default:
        return [{ label: currentPage.replace('-', ' ').toUpperCase() }];
    }
  };

  // If platform is NOT initialized, display ONLY BootstrapSetupWizardModal screen
  if (isBootstrapOpen) {
    return (
      <GlobalErrorBoundary onNavigateHome={() => {}}>
        <NotificationProvider activeRole="ADMINISTRATOR">
          <div className="min-h-screen bg-[#1F2C38] flex items-center justify-center p-4">
            <BootstrapSetupWizardModal
              isOpen={true}
              onComplete={handleBootstrapComplete}
            />
          </div>
        </NotificationProvider>
      </GlobalErrorBoundary>
    );
  }

  return (
    <GlobalErrorBoundary onNavigateHome={() => handleNavigate('landing')}>
      <NotificationProvider activeRole={activeRole}>
        <div className="min-h-screen bg-[#FFF8F0]/40 text-[#2C3E50] flex flex-col font-sans selection:bg-[#D35400] selection:text-white">
          {/* Skip to Main Content Link for Keyboard Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#D35400] focus:text-white focus:font-extrabold focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to main content
          </a>

          {/* Splash Screen */}
          {showSplash && (
            <ApplicationSplashScreen onComplete={() => setShowSplash(false)} />
          )}

          {/* ==================================================== */}
          {/* EXPERIENCE 1: PUBLIC WEBSITE LAYOUT                 */}
          {/* ==================================================== */}
          {isPublicWebsite ? (
            <>
              {/* Public Website Header Navbar */}
              <PublicNavbar
                onLoginClick={() => handleNavigate('login')}
                onRegisterClick={() => handleNavigate('register-choice')}
                onScrollToSection={(sectionId) => {
                  if (currentPage !== 'landing') {
                    handleNavigate('landing');
                    setTimeout(() => scrollToPublicSection(sectionId), 100);
                  } else {
                    scrollToPublicSection(sectionId);
                  }
                }}
              />

              {/* Public Main Canvas */}
              <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 focus:outline-none">
                <Suspense fallback={<PageFallback />}>
                  {currentPage === 'landing' && (
                    <LandingPage
                      profile={profile}
                      onNavigate={handleNavigate}
                      onOpenModule={handleOpenModule}
                    />
                  )}
                  {currentPage === 'login' && (
                    <LoginPage
                      onNavigate={handleNavigate}
                      onProfileUpdate={handleProfileUpdate}
                      onLoginSuccess={() => loadAppData()}
                    />
                  )}
                  {currentPage === 'forgot-password' && (
                    <ForgotPasswordPage
                      onNavigate={handleNavigate}
                      onSelectTokenForReset={(tok) => {
                        setResetToken(tok);
                        handleNavigate('reset-password');
                      }}
                    />
                  )}
                  {currentPage === 'reset-password' && (
                    <ResetPasswordPage
                      token={resetToken}
                      onNavigate={handleNavigate}
                    />
                  )}
                  {currentPage === 'register-choice' && (
                    <RegisterChoicePage onNavigate={handleNavigate} />
                  )}
                  {currentPage === 'register-student' && (
                    <StudentRegisterPage
                      onNavigate={handleNavigate}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  )}
                  {currentPage === 'register-faculty' && (
                    <FacultyRegisterPage onNavigate={handleNavigate} />
                  )}
                  {currentPage === 'pending-approval' && (
                    <PendingApprovalPage onNavigate={handleNavigate} onLogout={handleLogout} />
                  )}
                </Suspense>
              </main>

              {/* Institutional Public Footer */}
              <Footer onNavigate={handleNavigate} />
            </>
          ) : (
            /* ==================================================== */
            /* EXPERIENCE 2: AUTHENTICATED LEARNING PORTAL LAYOUT  */
            /* ==================================================== */
            <>
              {/* Internal Portal Top Navbar */}
              <Navbar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                profile={profile}
                activeRole={activeRole}
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={toggleSidebar}
                onOpenHelp={() => setIsHelpOpen(true)}
                onLogout={handleLogout}
              />

              {/* Desktop Smart Sidebar */}
              <div className="hidden lg:block">
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={handleNavigate}
                  activeRole={activeRole}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={toggleSidebar}
                  onOpenHelp={() => setIsHelpOpen(true)}
                  onLogout={handleLogout}
                />
              </div>

              {/* Mobile Slide-Over Drawer Overlay */}
              {isMobileSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                  <div
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                  />
                  <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#2C3E50]">
                    <Sidebar
                      currentPage={currentPage}
                      onNavigate={handleNavigate}
                      activeRole={activeRole}
                      isCollapsed={false}
                      onToggleCollapse={() => setIsMobileSidebarOpen(false)}
                      onOpenHelp={() => {
                        setIsMobileSidebarOpen(false);
                        setIsHelpOpen(true);
                      }}
                      onLogout={handleLogout}
                      onMobileClose={() => setIsMobileSidebarOpen(false)}
                    />
                  </div>
                </div>
              )}

              {/* Help & Support Modal */}
              <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

              {/* Portal Content Container with Margin Offset */}
              <div
                className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${
                  isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'
                }`}
              >
                {/* Offline Indicator */}
                {isOffline && <OfflineIndicator />}

                {/* PWA Install Banner */}
                {isInstallable && !bannerDismissed && (
                  <PWAInstallBanner
                    onInstall={() => triggerInstall()}
                    onDismiss={() => setBannerDismissed(true)}
                  />
                )}

                {/* Top Breadcrumb Navigation */}
                <div className="no-print bg-white/80 border-b border-[#FAD7A0]/60 px-4 sm:px-6 lg:px-8 py-2.5 backdrop-blur-xs">
                  <Breadcrumb items={getBreadcrumbItems()} onNavigate={handleNavigate} />
                </div>

                {/* Portal Main Content Area Protected by RBAC */}
                <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 focus:outline-none">
                  <ProtectedRoute
                    page={currentPage}
                    userRole={activeRole}
                    onReturnToDashboard={handleNavigate}
                  >
                    <Suspense fallback={<PageFallback />}>
                      {currentPage === 'dashboard' && (
                        <StudentDashboardPage
                          profile={profile}
                          progressMap={progressMap}
                          recordings={recordings}
                          portfolioItems={portfolioItems}
                          onNavigate={handleNavigate}
                          onOpenModule={handleOpenModule}
                        />
                      )}

                      {currentPage === 'modules' && (
                        <LaboratoryModulesPage
                          profile={profile}
                          progressMap={progressMap}
                          onOpenModule={handleOpenModule}
                          activeRole={activeRole}
                        />
                      )}

                      {currentPage === 'ai-engine' && (
                        <AILearningEnginePage
                          profile={profile}
                          onNavigatePage={handleNavigate}
                          onPortfolioSaved={() => loadAppData()}
                        />
                      )}

                      {currentPage === 'module-detail' && selectedModule && (
                        <ModuleDetailPage
                          module={selectedModule}
                          progress={currentModuleProgress}
                          onBack={() => handleNavigate('modules')}
                          onProgressUpdate={handleProgressUpdate}
                        />
                      )}

                      {currentPage === 'practice' && <PracticeCenterPage />}

                      {currentPage === 'portfolio' && <PortfolioPage profile={profile} />}

                      {currentPage === 'progress' && (
                        <ProgressDashboardPage profile={profile} progressMap={progressMap} />
                      )}

                      {currentPage === 'profile' && (
                        <StudentProfilePage profile={profile} onProfileUpdate={setProfile} />
                      )}

                      {currentPage === 'settings' && (
                        <SettingsPage
                          isInstallable={isInstallable}
                          isInstalled={isInstalled}
                          onInstall={() => triggerInstall()}
                          onResetData={loadAppData}
                        />
                      )}

                      {/* Phase 4 Academic Management Views */}
                      {currentPage === 'faculty-dashboard' && (
                        <FacultyDashboardPage
                          profile={profile}
                          portfolioItems={portfolioItems}
                          onNavigatePage={handleNavigate}
                          activeRole={activeRole}
                          onOpenModule={handleOpenModule}
                        />
                      )}

                      {currentPage === 'attendance' && <DigitalAttendancePage />}

                      {currentPage === 'rubrics' && <RubricAssessmentPage />}

                      {currentPage === 'internal-marks' && <InternalMarkCalculatorPage />}

                      {currentPage === 'analytics' && <AcademicAnalyticsPage />}

                      {currentPage === 'portfolio-review' && <FacultyPortfolioReviewPage />}

                      {currentPage === 'reports' && <AcademicReportsPage />}

                      {currentPage === 'faculty-assistant' && <AIFacultyAssistantPage />}

                      {currentPage === 'announcements' && (
                        <AnnouncementsPage onNavigatePage={handleNavigate} activeRole={activeRole} />
                      )}

                      {currentPage === 'admin-control' && (
                        <AdminControlPage onOpenModule={handleOpenModule} />
                      )}

                      {currentPage === 'system-health' && <SystemHealthPage />}

                      {currentPage === 'qef-framework' && <QEFFrameworkPage />}

                      {currentPage === 'production-certification' && <ProductionCertificationPage />}
                    </Suspense>
                  </ProtectedRoute>
                </main>

                {/* Portal Footer */}
                <Footer onNavigate={handleNavigate} />
              </div>

              {/* Mobile Bottom Navigation Bar */}
              <div className="no-print">
                <MobileNav currentPage={currentPage} onNavigate={handleNavigate} activeRole={activeRole} />
              </div>

              {/* Administrator Quick Review Floating Button */}
              <QuickReviewButton />

              {/* Bootstrap Administrator One-Time Setup Wizard Modal */}
              <BootstrapSetupWizardModal
                isOpen={isBootstrapOpen}
                onComplete={handleBootstrapComplete}
              />
            </>
          )}
        </div>
      </NotificationProvider>
    </GlobalErrorBoundary>
  );
}
