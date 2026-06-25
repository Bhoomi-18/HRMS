'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { PAGE_PERMISSIONS } from "../../config/rbac";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  // Fallback to empty string if pathname is null (e.g., during build)
  const currentPath = pathname || "";

  const allLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊", roles: PAGE_PERMISSIONS.dashboard },
    { name: "Employees", href: "/employees", icon: "👥", roles: PAGE_PERMISSIONS.employees },
    { name: "Attendance", href: "/attendance", icon: "📅", roles: PAGE_PERMISSIONS.attendance },
    { name: "Leave", href: "/leave", icon: "🌴", roles: PAGE_PERMISSIONS.leave },
    { name: "Payroll", href: "/payroll", icon: "💰", roles: PAGE_PERMISSIONS.payroll },
    { name: "Announcements", href: "/announcements", icon: "📢", roles: PAGE_PERMISSIONS.announcements },
    { name: "Expenses", href: "/expenses", icon: "💳", roles: PAGE_PERMISSIONS.expenses },
    { name: "Documents", href: "/documents", icon: "📄", roles: PAGE_PERMISSIONS.documents },
    { name: "Recruitment", href: "/recruitment", icon: "🎯", roles: PAGE_PERMISSIONS.recruitment },
    { name: "Onboarding", href: "/onboarding", icon: "🚀", roles: PAGE_PERMISSIONS.onboarding },
    { name: "Training", href: "/training", icon: "🎓", roles: PAGE_PERMISSIONS.training },
    { name: "Contributions", href: "/contributions", icon: "⭐", roles: PAGE_PERMISSIONS.contributions },
  ];

  const links = allLinks.filter(link => {
    if (!user) return false;
    return link.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="flex lg:hidden items-center justify-between bg-background border-b border-border p-4 sticky top-0 z-20">
        <span className="font-bold text-lg tracking-wide">HRMS Pro <span className="text-xs text-muted-foreground ml-1">v1.0</span></span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 border border-border rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            // X icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm transition-opacity lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border flex flex-col shrink-0 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-border">
          <span className="text-xl font-bold tracking-wider text-foreground">HRMS Pro <span className="text-xs font-normal text-muted-foreground ml-1">v1.0</span></span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg animate-pulse">
                <div className="h-6 w-6 rounded bg-muted"></div>
                <div className="h-4 w-24 rounded bg-muted"></div>
              </div>
            ))
          ) : (
            links.map((link) => {
              const isActive = currentPath.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-foreground text-background font-medium shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-lg opacity-90">{link.icon}</span>
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })
          )}
        </nav>

        {/* Footer info (optional) */}
        <div className="p-4 border-t border-border mt-auto hidden lg:block">
          {loading ? (
             <div className="flex items-center gap-3 animate-pulse">
               <div className="h-8 w-8 rounded-full bg-muted"></div>
               <div className="flex flex-col gap-1">
                 <div className="h-3 w-20 bg-muted rounded"></div>
                 <div className="h-2 w-24 bg-muted rounded"></div>
               </div>
             </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold border border-border text-white">
                {user.name.charAt(0)}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
