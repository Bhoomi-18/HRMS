'use client';

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { DataTable } from "../../components/table/DataTable";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_PAYROLL } from "../../graphql/query/payroll";
import { CREATE_PAYROLL } from "../../graphql/mutation/createPayroll";
import { UPDATE_PAYROLL } from "../../graphql/mutation/updatePayroll";
import { DELETE_PAYROLL } from "../../graphql/mutation/deletePayroll";

// ─── Types ────────────────────────────────────────────────────────────────────

type Payroll = {
  payrollId: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentStatus: string;
  country?: "IN" | "US";
};

type GetAllPayrollResult = {
  getAllPayroll?: {
    data?: {
      payroll?: Payroll[];
    };
  };
};

// ─── Mock Data (fallback when GraphQL is not connected) ───────────────────────

const MOCK_PAYROLL: Payroll[] = [
  { payrollId: "1", employeeId: "EMP001", month: "2026-06", basicSalary: 5000, bonus: 500, deductions: 200, netSalary: 5300, paymentStatus: "Paid", country: "US" },
  { payrollId: "2", employeeId: "EMP002", month: "2026-06", basicSalary: 60000, bonus: 0,   deductions: 3000, netSalary: 57000, paymentStatus: "Pending", country: "IN" },
  { payrollId: "3", employeeId: "EMP003", month: "2026-06", basicSalary: 4500, bonus: 200, deductions: 100, netSalary: 4600, paymentStatus: "Paid", country: "US" },
  { payrollId: "4", employeeId: "EMP004", month: "2026-05", basicSalary: 55000, bonus: 1000, deductions: 1500, netSalary: 54500, paymentStatus: "Paid", country: "IN" },
];

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Payroll, "payrollId"> = {
  employeeId: "",
  month: new Date().toISOString().slice(0, 7), // YYYY-MM
  basicSalary: 0,
  bonus: 0,
  deductions: 0,
  netSalary: 0,
  paymentStatus: "Pending",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Paid:    "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed:  "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── Compliance Dashboard ──────────────────────────────────────────────────────

function ComplianceDashboard() {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Tax Filing (US/IN)</p>
          <p className="text-lg font-semibold text-foreground">Q2 Completed</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">100%</span>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">PF / 401k Remittance</p>
          <p className="text-lg font-semibold text-foreground">May Processed</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Done</span>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between border-l-4 border-l-yellow-500">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Statutory Audits</p>
          <p className="text-lg font-semibold text-foreground">Upcoming</p>
        </div>
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Pending</span>
      </div>
    </div>
  );
}

// ─── Payslip Modal ────────────────────────────────────────────────────────────

function PayslipModal({ open, record, onClose }: { open: boolean, record: Payroll | null, onClose: () => void }) {
  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">✕</button>
        
        <div className="border-b border-border pb-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-foreground">Payslip</h2>
            {record.country && (
              <span className="text-lg" title={record.country === "IN" ? "India" : "United States"}>
                {record.country === "IN" ? "🇮🇳" : "🇺🇸"}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">For the month of {record.month}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Employee ID</span>
            <span className="font-medium text-foreground">{record.employeeId}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">Basic Salary</span>
            <span className="font-medium text-foreground">{record.country === "IN" ? "₹" : "$"}{record.basicSalary.toFixed(2)}</span>
          </div>
          {record.country === "IN" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">HRA (Housing Rent Allowance)</span>
              <span className="font-medium text-foreground">₹{(record.basicSalary * 0.4).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bonus</span>
            <span className="font-medium text-foreground">{record.country === "IN" ? "₹" : "$"}{record.bonus.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>{record.country === "IN" ? "Deductions (PF / ESI / TDS)" : "Deductions (Federal / State / 401k)"}</span>
            <span>-{record.country === "IN" ? "₹" : "$"}{record.deductions.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-border pt-4 mt-4 text-lg">
            <span className="font-bold text-foreground">Net Pay</span>
            <span className="font-bold text-green-600">{record.country === "IN" ? "₹" : "$"}{record.netSalary.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <button onClick={() => {
            toast.success("Payslip PDF downloaded!");
            onClose();
          }} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payroll Drawer (right-side form panel) ──────────────────────────────────

function PayrollDrawer({
  open, mode, form, onClose, onChange, onSave, saving,
}: {
  open: boolean;
  mode: "add" | "edit";
  form: Omit<Payroll, "payrollId">;
  onClose: () => void;
  onChange: (field: keyof typeof EMPTY_FORM, value: string | number) => void;
  onSave: () => void;
  saving: boolean;
}) {
  // Auto-calculate net salary when inputs change
  const calculatedNet = useMemo(() => {
    const b = Number(form.basicSalary) || 0;
    const bo = Number(form.bonus) || 0;
    const d = Number(form.deductions) || 0;
    return b + bo - d;
  }, [form.basicSalary, form.bonus, form.deductions]);

  // Sync calculated net salary to form if it differs
  if (form.netSalary !== calculatedNet) {
    onChange("netSalary", calculatedNet);
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden="true" />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full sm:w-[400px] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? "Add Payroll" : "Edit Payroll"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "add" ? "Add Payroll" : "Edit Payroll"}
          </h2>
          <button onClick={onClose} className="rounded border border-border px-2 py-1 text-sm" aria-label="Close">×</button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Employee ID</label>
            <input
              type="text"
              value={form.employeeId}
              onChange={(e) => onChange("employeeId", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Month (YYYY-MM)</label>
            <input
              type="month"
              value={form.month}
              onChange={(e) => onChange("month", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Basic Salary</label>
            <input
              type="number"
              value={form.basicSalary}
              onChange={(e) => onChange("basicSalary", Number(e.target.value))}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Bonus</label>
            <input
              type="number"
              value={form.bonus}
              onChange={(e) => onChange("bonus", Number(e.target.value))}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Deductions</label>
            <input
              type="number"
              value={form.deductions}
              onChange={(e) => onChange("deductions", Number(e.target.value))}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Net Salary</label>
            <input
              type="number"
              value={calculatedNet}
              disabled
              className="h-9 rounded border border-border bg-muted px-3 text-sm text-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Calculated automatically (Basic + Bonus - Deductions).</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Payment Status</label>
            <select
              value={form.paymentStatus}
              onChange={(e) => onChange("paymentStatus", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            >
              {["Pending", "Paid", "Failed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border p-4">
          <button onClick={onClose} className="rounded border border-border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "add" ? "Save Record" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayrollPage() {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState<"add" | "edit">("add");
  const [editingId,  setEditingId]    = useState<string | null>(null);
  const [form,       setForm]         = useState<Omit<Payroll, "payrollId">>(EMPTY_FORM);
  const [saving,     setSaving]       = useState(false);
  const [localData,  setLocalData]    = useState<Payroll[]>(MOCK_PAYROLL);
  
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isEmployee = user?.role === "Employee";
  const isFinance = user?.role === "Finance";
  const canManagePayroll = isAdmin || isFinance;

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery<GetAllPayrollResult>(GET_ALL_PAYROLL, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createPayroll] = useMutation(CREATE_PAYROLL);
  const [updatePayroll] = useMutation(UPDATE_PAYROLL);
  const [deletePayroll] = useMutation(DELETE_PAYROLL);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const rawData: Payroll[] = data?.getAllPayroll?.data?.payroll ?? localData;
  const payrollData = rawData.filter(item => {
    if (isEmployee) return item.employeeId === user?.id;
    return true;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    if (isEmployee) {
      toast.error("You don't have permission for this action.");
      return;
    }
    setForm(EMPTY_FORM);
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(record: Payroll) {
    if (!canManagePayroll) {
      toast.error("You don't have permission for this action.");
      return;
    }
    const { payrollId, ...rest } = record;
    setForm(rest);
    setEditingId(payrollId);
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleFieldChange(field: keyof typeof EMPTY_FORM, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.employeeId || !form.month || !form.paymentStatus) {
      toast.error("Please fill in all required fields (Employee ID, Month, Payment Status).");
      return;
    }
    if (form.basicSalary < 0 || form.bonus < 0 || form.deductions < 0) {
      toast.error("Salary amounts cannot be negative.");
      return;
    }
    setSaving(true);
    try {
      if (drawerMode === "add") {
        await createPayroll({
          variables: { request: { requestParam: form } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          // Optimistic local update when backend unavailable
          toast.error("Network error. Using mock data.");
          setLocalData((prev) => [
            ...prev,
            { ...form, payrollId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updatePayroll({
          variables: { request: { requestParam: { ...form, payrollId: editingId } } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          toast.error("Network error. Using mock data.");
          setLocalData((prev) =>
            prev.map((p) => (p.payrollId === editingId ? { ...form, payrollId: editingId } : p))
          );
        });
      }
      await refetch().catch(() => {});
    } finally {
      setSaving(false);
      closeDrawer();
    }
  }

  async function handleDelete(payrollId: string) {
    if (!canManagePayroll) {
      toast.error("You don't have permission for this action.");
      return;
    }
    if (!window.confirm("Delete this payroll record?")) return;
    await deletePayroll({
      variables: { request: { requestParam: { payrollId } } },
    }).then(() => toast.success("Action completed successfully.")).catch(() => {
      toast.error("Network error. Using mock data.");
      setLocalData((prev) => prev.filter((p) => p.payrollId !== payrollId));
    });
    await refetch().catch(() => {});
  }

  function handleExportCSV() {
    if (!payrollData || payrollData.length === 0) return;
    const headers = Object.keys(payrollData[0]).filter(k => k !== '__typename');
    const csvRows = [headers.join(',')];
    for (const row of payrollData) {
      const values = headers.map(header => {
        const val = row[header as keyof Payroll];
        const strVal = String(val ?? "").replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payroll.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Generate unique months for the filter dropdown
  const uniqueMonths = Array.from(new Set(payrollData.map((p) => p.month))).sort((a, b) => b.localeCompare(a));
  const monthOptions = uniqueMonths.map((m) => ({ label: m, value: m }));

  // ── Table columns ─────────────────────────────────────────────────────────────

  const columns: ColumnDef<Payroll, unknown>[] = [
    { accessorKey: "employeeId", header: "Emp ID" },
    { accessorKey: "month",      header: "Month" },
    { 
      accessorKey: "basicSalary",  
      header: "Basic",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`
    },
    { 
      accessorKey: "bonus", 
      header: "Bonus",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`
    },
    { 
      accessorKey: "deductions", 
      header: "Deductions",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`
    },
    { 
      accessorKey: "netSalary", 
      header: "Net Salary",
      cell: ({ getValue }) => <strong className="font-semibold text-foreground">${Number(getValue()).toFixed(2)}</strong>
    },
    {
      accessorKey: "paymentStatus",
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
            <button
              onClick={() => {
                setSelectedPayslip(record);
                setPayslipModalOpen(true);
              }}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View Payslip
            </button>
            {canManagePayroll && (
              <>
                <button
                  onClick={() => openEdit(record)}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(record.payrollId)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.payroll}>
      <div className="min-h-screen bg-background p-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Payroll Management</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="rounded border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Export CSV
            </button>
            {!isEmployee && (
              <button
                onClick={openAdd}
                className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
              >
                + Add Payroll
              </button>
            )}
          </div>
        </div>

        {canManagePayroll && <ComplianceDashboard />}

        <div className="hidden md:block">
          <DataTable
            data={payrollData}
            columns={columns}
            isLoading={loading}
            filters={[{ type: "search", placeholder: "Search payroll records…" }]}
            quickFiltersTopBar={[
              {
                type: "select",
                columnId: "paymentStatus",
                label: "Payment Status",
                options: [
                  { label: "Pending", value: "Pending" },
                  { label: "Paid",    value: "Paid"    },
                  { label: "Failed",  value: "Failed"  },
                ],
              },
              {
                type: "select",
                columnId: "month",
                label: "Month",
                options: monthOptions,
              }
            ]}
            initialPageSize={10}
          />
        </div>

        {/* Mobile View: Stacked Cards */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : payrollData.map((record) => (
            <div key={record.payrollId} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{record.month}</h3>
                  <p className="text-sm text-muted-foreground">Emp ID: {record.employeeId}</p>
                </div>
                <StatusBadge status={record.paymentStatus} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Basic</p>
                  <p className="font-medium text-foreground">${record.basicSalary.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bonus</p>
                  <p className="font-medium text-foreground">${record.bonus.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground text-red-500">Deductions</p>
                  <p className="font-medium text-foreground text-red-500">-${record.deductions.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground text-green-600">Net Salary</p>
                  <p className="font-bold text-foreground text-green-600">${record.netSalary.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-border">
                <button
                  onClick={() => {
                    setSelectedPayslip(record);
                    setPayslipModalOpen(true);
                  }}
                  className="flex-1 text-center rounded bg-foreground px-3 py-2 text-sm text-background hover:opacity-90 font-medium"
                >
                  View Payslip
                </button>
                {canManagePayroll && (
                  <>
                    <button
                      onClick={() => openEdit(record)}
                      className="flex-1 rounded border border-border px-3 py-2 text-sm hover:bg-muted/40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.payrollId)}
                      className="flex-none rounded border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <PayrollDrawer
          open={drawerOpen}
          mode={drawerMode}
          form={form}
          onClose={closeDrawer}
          onChange={handleFieldChange}
          onSave={handleSave}
          saving={saving}
        />

        <PayslipModal
          open={payslipModalOpen}
          record={selectedPayslip}
          onClose={() => setPayslipModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
