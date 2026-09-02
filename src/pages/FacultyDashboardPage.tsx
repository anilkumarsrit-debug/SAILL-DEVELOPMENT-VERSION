import React from 'react';
import { Page, StudentProfile, PortfolioItem, UserRole } from '../types';
import { FacultyWorkbench } from '../components/faculty/FacultyWorkbench';

interface FacultyDashboardPageProps {
  profile: StudentProfile | null;
  portfolioItems: PortfolioItem[];
  onNavigatePage: (page: Page) => void;
  activeRole?: UserRole;
  onOpenModule?: (moduleId: string) => void;
}

export const FacultyDashboardPage: React.FC<FacultyDashboardPageProps> = ({
  portfolioItems,
  onNavigatePage,
  activeRole = 'FACULTY_INCHARGE',
  onOpenModule
}) => {
  const handleOpenModule = (moduleId: string) => {
    if (onOpenModule) {
      onOpenModule(moduleId);
    } else {
      onNavigatePage('modules');
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      <FacultyWorkbench
        portfolioItems={portfolioItems}
        onOpenModule={handleOpenModule}
        activeRole={activeRole}
      />
    </div>
  );
};
