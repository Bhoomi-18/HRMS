'use client';

import { useState } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Admin");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Hardcoded mock accounts
    const mockAccounts = [
      { email: "admin@hrms.com", password: "admin123", role: "Admin" as UserRole, id: "ADMIN_1", name: "System Admin" },
      { email: "hr@hrms.com", password: "hr123", role: "HR Manager" as UserRole, id: "HR_1", name: "HR Manager" },
      { email: "manager@hrms.com", password: "manager123", role: "Manager" as UserRole, id: "MGR_1", name: "Engineering Manager" },
      { email: "employee@hrms.com", password: "employee123", role: "Employee" as UserRole, id: "EMP001", name: "John Doe" },
      { email: "finance@hrms.com", password: "finance123", role: "Finance" as UserRole, id: "FIN_1", name: "Finance User" },
    ];

    const account = mockAccounts.find(a => a.email === email && a.password === password && a.role === role);

    if (account) {
      login({ id: account.id, name: account.name, email: account.email, role: account.role });
      router.push("/dashboard");
    } else {
      setError("Invalid credentials or role mismatch.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">HRMS Pro</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to access your portal</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="name@hrms.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
            >
              <option value="Admin">Admin</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-border"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-foreground py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          <p className="mb-2 font-medium">Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>Admin:</strong> admin@hrms.com</p>
              <p><strong>HR:</strong> hr@hrms.com</p>
              <p><strong>Manager:</strong> manager@hrms.com</p>
            </div>
            <div>
              <p><strong>Employee:</strong> employee@hrms.com</p>
              <p><strong>Finance:</strong> finance@hrms.com</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] opacity-70">Password for all is {`{role}123`} (e.g. admin123)</p>
        </div>
      </div>
    </div>
  );
}
