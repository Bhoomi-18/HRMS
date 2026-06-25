'use client';

import { useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { DataTable } from "../../components/table/DataTable";
import { useAuth } from "../../context/AuthContext";

type Expense = {
  expenseId: string;
  employeeId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: string;
  receiptUrl?: string;
};

const MOCK_EXPENSES: Expense[] = [
  { expenseId: "EX001", employeeId: "EMP001", date: "2026-06-15", category: "Travel", amount: 350.00, description: "Flight to NYC", status: "Approved" },
  { expenseId: "EX002", employeeId: "EMP002", date: "2026-06-18", category: "Meals", amount: 45.50, description: "Client Lunch", status: "Pending" },
  { expenseId: "EX003", employeeId: "EMP001", date: "2026-06-20", category: "Office Supplies", amount: 120.00, description: "Monitor stand & keyboard", status: "Pending" },
  { expenseId: "EX004", employeeId: "EMP003", date: "2026-06-21", category: "Travel", amount: 45.00, description: "Uber to airport", status: "Rejected" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function ExpensesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isManager = user?.role === "Manager";
  const isFinance = user?.role === "Finance";
  const isEmployee = user?.role === "Employee";
  const canApprove = isAdmin || isHR || isManager || isFinance;

  const [data, setData] = useState<Expense[]>(MOCK_EXPENSES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense>>({});
  
  const displayData = data.filter(item => {
    if (isEmployee) return item.employeeId === user?.id;
    return true;
  });

  function openAdd() {
    setFormData({
      employeeId: user?.id || "",
      date: new Date().toISOString().slice(0, 10),
      category: "Travel",
      amount: 0,
      description: "",
      status: "Pending"
    });
    setIsDrawerOpen(true);
  }

  function handleSave() {
    if (!formData.amount || !formData.description) {
      toast.error("Please fill required fields.");
      return;
    }
    const newRecord: Expense = {
      ...(formData as Expense),
      expenseId: `EX-${Date.now()}`,
    };
    setData(prev => [newRecord, ...prev]);
    toast.success("Expense claim submitted successfully.");
    setIsDrawerOpen(false);
  }

  function handleApproveReject(id: string, newStatus: string) {
    if (!canApprove) return;
    setData(prev => prev.map(ex => ex.expenseId === id ? { ...ex, status: newStatus } : ex));
    toast.success(`Expense ${newStatus.toLowerCase()} successfully.`);
  }

  const columns: ColumnDef<Expense, unknown>[] = [
    { accessorKey: "employeeId", header: "Emp ID" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "category", header: "Category" },
    { 
      accessorKey: "amount", 
      header: "Amount",
      cell: ({ getValue }) => <strong className="font-semibold">${Number(getValue()).toFixed(2)}</strong>
    },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={String(getValue())} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-blue-600 hover:underline">
              Receipt
            </button>
            {canApprove && record.status === "Pending" && (
              <>
                <button
                  onClick={() => handleApproveReject(record.expenseId, "Approved")}
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(record.expenseId, "Rejected")}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.expenses}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Expenses & Reimbursements</h1>
          <div className="flex items-center gap-3">
            {!isFinance && (
              <button
                onClick={openAdd}
                className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
              >
                + Claim Expense
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Claimed</p>
            <p className="text-2xl font-bold text-foreground">
              ${displayData.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">
              ${displayData.filter(d => d.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              ${displayData.filter(d => d.status === "Approved").reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <DataTable
          data={displayData}
          columns={columns}
          isLoading={false}
          filters={[{ type: "search", placeholder: "Search expenses..." }]}
          quickFiltersTopBar={[
            {
              type: "select",
              columnId: "status",
              label: "Status",
              options: [
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ]
            }
          ]}
          initialPageSize={10}
        />

        {/* Drawer for new claim */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-background shadow-2xl border-l border-border p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-6">Submit Expense Claim</h2>
              
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
                  <input type="date" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <select value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border">
                    <option value="Travel">Travel</option>
                    <option value="Meals">Meals</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Internet/Phone">Internet/Phone</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ($)</label>
                  <input type="number" value={formData.amount || ""} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full h-10 px-3 rounded-md border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                  <textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-md border border-border resize-none h-24" placeholder="Brief description of the expense..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Receipt Upload</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                    Click to upload or drag receipt here
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end gap-3 mt-auto">
                <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90">Submit Claim</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
