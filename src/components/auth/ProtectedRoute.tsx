import React from 'react';
import { Page } from '../../types';
import { UserRole } from '../../types/auth';
import { hasPageAccess } from '../../utils/permissionMiddleware';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  page: Page;
  userRole?: UserRole | string | null;
  onReturnToDashboard: (page: Page) => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  page,
  userRole,
  onReturnToDashboard,
  children
}) => {
  // Check if current user role has authorization to access the specified page
  const isAuthorized = hasPageAccess(userRole, page);

  if (!isAuthorized) {
    return (
      <AccessDenied
        userRole={userRole}
        onReturnToDashboard={onReturnToDashboard}
      />
    );
  }

  return <>{children}</>;
};
