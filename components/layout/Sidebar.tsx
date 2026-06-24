'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Fallback to empty string if pathname is null (e.g., during build)
  const currentPath = pathname || "";

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Employees", href: "/employees", icon: "👥" },
    { name: "Attendance", href: "/attendance", icon: "📅" },
    { name: "Leave", href: "/leave", icon: "🌴" },
    { name: "Payroll", href: "/payroll", icon: "💰" },
  ];

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden flex items-center justify-between bg-background border-b border-border p-4 sticky top-0 z-20">
        <span className="font-bold text-lg tracking-wide">HRMS</span>
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
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:h-screen ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="hidden lg:flex h-16 items-center justify-center border-b border-border">
          <span className="text-xl font-bold tracking-wider text-foreground">HRMS Portal</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4 lg:mt-0">
          {links.map((link) => {
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
          })}
        </nav>

        {/* Footer info (optional) */}
        <div className="p-4 border-t border-border mt-auto hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold border border-border">
              A
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@hrms.local</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
