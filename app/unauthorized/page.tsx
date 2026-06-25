'use client';

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center space-y-4 max-w-md rounded-2xl border border-border bg-card p-12 shadow-sm">
        <span className="text-6xl" aria-label="Access Denied">🚫</span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page based on your current role.</p>
        
        <div className="flex w-full flex-col gap-3 pt-4">
          <Link 
            href="/dashboard"
            className="w-full rounded-md bg-foreground py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Back to Dashboard
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full rounded-md border border-border py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
