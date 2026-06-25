'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { Navbar } from "./Navbar";
import { AuthProvider } from "../../context/AuthContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/unauthorized';

  if (isAuthPage) {
    return (
      <AuthProvider>
        <div className="flex min-h-screen w-full bg-background">
          {children}
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="flex h-screen flex-col lg:flex-row overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden w-full lg:ml-64">
          <Navbar />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <Breadcrumb />
            <div className="flex-1">
              {children}
            </div>
            {/* Global Footer */}
            <footer className="w-full border-t border-border py-4 px-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground bg-background/50 shrink-0">
              <p>© 2026 HRMS Pro. All rights reserved.</p>
              <p>Developed by Team</p>
            </footer>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
