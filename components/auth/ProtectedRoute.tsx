'use client';

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (roles && !hasRole(roles as any[])) {
        router.push('/unauthorized');
      }
    }
  }, [loading, isAuthenticated, hasRole, roles, router]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (roles && !hasRole(roles as any[])) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
