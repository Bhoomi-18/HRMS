'use client';

import { useState } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

type Contribution = {
  id: string;
  employeeId: string;
  type: string;
  amount: number;
  date: string;
  status: string;
};

const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: "1", employeeId: "EMP001", type: "401k", amount: 250, date: "2026-06-25", status: "Processed" },
  { id: "2", employeeId: "EMP002", type: "Health Insurance", amount: 120, date: "2026-06-25", status: "Processed" },
  { id: "3", employeeId: "EMP003", type: "PF", amount: 300, date: "2026-06-25", status: "Pending" },
];

export default function ContributionsPage() {
  const { user } = useAuth();
  const [data] = useState<Contribution[]>(MOCK_CONTRIBUTIONS);

  // Simple view
  const myContributions = data.filter(c => c.employeeId === user?.id || user?.role === "Finance" || user?.role === "Admin");

  return (
    <ProtectedRoute roles={["Admin", "Finance", "Employee", "Manager", "HR Manager"]}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">My Contributions / Deductions</h1>
          <p className="text-sm text-muted-foreground mt-1">View your recent statutory contributions and benefits.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myContributions.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No contributions found.
            </div>
          ) : (
            myContributions.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">{c.type}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${c.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Amount:</span>
                  <span className="font-medium text-foreground">${c.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Date:</span>
                  <span className="font-medium text-foreground">{c.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
