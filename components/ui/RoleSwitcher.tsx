'use client';

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { UserRole } from "../../context/AuthContext";

export function RoleSwitcher() {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null; // Don't show on login page

  const roles: { role: UserRole; name: string }[] = [
    { role: "Admin", name: "System Admin" },
    { role: "HR Manager", name: "HR Lead" },
    { role: "Manager", name: "John (Manager)" },
    { role: "Employee", name: "Sarah (Employee)" },
    { role: "Finance", name: "Finance Team" },
  ];

  function switchRole(role: UserRole, name: string) {
    const newUser = { ...user!, role, name };
    setUser(newUser);
    localStorage.setItem("hrms-user", JSON.stringify(newUser));
    toast.success(`Switched to ${role} view`);
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-48 rounded-xl border border-border bg-card p-2 shadow-xl animate-in slide-in-from-bottom-2">
          <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Demo Role Switcher
          </h4>
          <div className="space-y-1">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => switchRole(r.role, r.name)}
                className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  user.role === r.role
                    ? "bg-foreground text-background font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {r.name}
                {user.role === r.role && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        title="Switch Roles"
      >
        <span className="text-xl">🔄</span>
      </button>
    </div>
  );
}
