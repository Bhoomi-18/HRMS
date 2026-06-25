'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { DataTable } from "../../components/table/DataTable";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_LEAVE } from "../../graphql/query/leave";
import { CREATE_LEAVE } from "../../graphql/mutation/createLeave";
import { UPDATE_LEAVE } from "../../graphql/mutation/updateLeave";
import { DELETE_LEAVE } from "../../graphql/mutation/deleteLeave";

// ─── Types ────────────────────────────────────────────────────────────────────

type Leave = {
  leaveId: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

type GetAllLeaveResult = {
  getAllLeave?: {
    data?: {
      leave?: Leave[];
    };
  };
};

// ─── Mock Data (fallback when GraphQL is not connected) ───────────────────────

const MOCK_LEAVE: Leave[] = [
  { leaveId: "1", employeeId: "EMP001", leaveType: "Sick",   startDate: "2026-06-20", endDate: "2026-06-22", reason: "Viral fever",       status: "Approved" },
  { leaveId: "2", employeeId: "EMP002", leaveType: "Casual", startDate: "2026-07-01", endDate: "2026-07-05", reason: "Family trip",       status: "Pending" },
  { leaveId: "3", employeeId: "EMP003", leaveType: "Earned", startDate: "2026-08-10", endDate: "2026-08-20", reason: "Vacation",          status: "Approved" },
  { leaveId: "4", employeeId: "EMP004", leaveType: "Sick",   startDate: "2026-06-24", endDate: "2026-06-24", reason: "Doctor appointment",status: "Pending" },
];

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Leave, "leaveId"> = {
  employeeId: "",
  leaveType: "Sick",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  reason: "",
  status: "Pending",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

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

// ─── Leave Balance Widget ─────────────────────────────────────────────────────

function LeaveBalanceWidget() {
  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-1">Total Allowed</p>
        <p className="text-2xl font-bold text-foreground">24</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-1">Used</p>
        <p className="text-2xl font-bold text-foreground">8</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
        <p className="text-2xl font-bold text-yellow-600">2</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-1">Available</p>
        <p className="text-2xl font-bold text-green-600">14</p>
      </div>
    </div>
  );
}

// ─── Leave Drawer (right-side form panel) ──────────────────────────────────

function LeaveDrawer({
  open,
  mode,
  form,
  onClose,
  onChange,
  onSave,
  saving,
}: {
  open: boolean;
  mode: "add" | "edit";
  form: Omit<Leave, "leaveId">;
  onClose: () => void;
  onChange: (field: keyof Omit<Leave, "leaveId">, value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { user } = useAuth();
  const isEmployee = user?.role === "Employee";

  if (!open) return null;
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden="true" />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full sm:w-[400px] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? "Apply Leave" : "Edit Leave"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "add" ? "Apply Leave" : "Edit Leave"}
          </h2>
          <button onClick={onClose} className="rounded border border-border px-2 py-1 text-sm" aria-label="Close">×</button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Employee ID</label>
            <input
              type="text"
              value={isEmployee ? user?.id : form.employeeId}
              onChange={(e) => onChange("employeeId", e.target.value)}
              disabled={isEmployee}
              className={`h-9 rounded border border-border px-3 text-sm text-foreground ${isEmployee ? 'bg-muted cursor-not-allowed' : 'bg-background'}`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Leave Type</label>
            <select
              value={form.leaveType}
              onChange={(e) => onChange("leaveType", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            >
              {["Sick", "Casual", "Earned"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <input
              type="date"
              value={form.startDate ? form.startDate.slice(0, 10) : ""}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <input
              type="date"
              value={form.endDate ? form.endDate.slice(0, 10) : ""}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            >
              {["Pending", "Approved", "Rejected"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Reason</label>
            <textarea
              value={form.reason}
              onChange={(e) => onChange("reason", e.target.value)}
              className="h-24 rounded border border-border bg-background px-3 py-2 text-sm text-foreground resize-none"
            />
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
            {saving ? "Saving…" : mode === "add" ? "Apply" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LeavePage() {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState<"add" | "edit">("add");
  const [editingId,  setEditingId]    = useState<string | null>(null);
  const [form,       setForm]         = useState<Omit<Leave, "leaveId">>(EMPTY_FORM);
  const [saving,     setSaving]       = useState(false);
  const [localData,  setLocalData]    = useState<Leave[]>(MOCK_LEAVE);

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isManager = user?.role === "Manager";
  const isEmployee = user?.role === "Employee";
  const isFinance = user?.role === "Finance";
  const canEditLeave = isAdmin || isHR || isManager;

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery<GetAllLeaveResult>(GET_ALL_LEAVE, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createLeave] = useMutation(CREATE_LEAVE);
  const [updateLeave] = useMutation(UPDATE_LEAVE);
  const [deleteLeave] = useMutation(DELETE_LEAVE);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const rawData: Leave[] = data?.getAllLeave?.data?.leave ?? localData;
  const leaveData = rawData.filter(item => {
    if (isEmployee) return item.employeeId === user?.id;
    return true;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setForm({ ...EMPTY_FORM, employeeId: isEmployee ? (user?.id ?? "") : "" });
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(record: Leave) {
    if (isFinance) {
      toast.error("You don't have permission for this action.");
      return;
    }
    const { leaveId, ...rest } = record;
    setForm(rest);
    setEditingId(leaveId);
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleFieldChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.leaveType || !form.startDate || !form.endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date cannot precede start date.");
      return;
    }

    setSaving(true);
    try {
      if (drawerMode === "add") {
        const payload = isEmployee ? { ...form, employeeId: user?.id || form.employeeId } : form;
        await createLeave({
          variables: { request: { requestParam: payload } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          // Optimistic local update when backend unavailable
          toast.error("Network error. Using mock data.");
          setLocalData((prev) => [
            ...prev,
            { ...payload, leaveId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updateLeave({
          variables: { request: { requestParam: { ...form, leaveId: editingId } } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          toast.error("Network error. Using mock data.");
          setLocalData((prev) =>
            prev.map((l) => (l.leaveId === editingId ? { ...form, leaveId: editingId } : l))
          );
        });
      }
      await refetch().catch(() => {});
    } finally {
      setSaving(false);
      closeDrawer();
    }
  }

  async function handleDelete(leaveId: string, status: string) {
    if (isFinance) {
      toast.error("You don't have permission for this action.");
      return;
    }
    if (isEmployee && status === "Approved") {
      toast.error("Cannot delete an approved leave.");
      return;
    }
    if (!canEditLeave && status === "Approved") {
      // Just enforcing the role based check just in case.
      toast.error("Cannot delete an approved leave.");
      return;
    }
    if (!window.confirm("Delete this leave record?")) return;
    await deleteLeave({
      variables: { request: { requestParam: { leaveId } } },
    }).then(() => toast.success("Action completed successfully.")).catch(() => {
      toast.error("Network error. Using mock data.");
      setLocalData((prev) => prev.filter((l) => l.leaveId !== leaveId));
    });
    await refetch().catch(() => {});
  }

  async function handleApproveReject(leaveId: string, newStatus: string) {
    if (!canEditLeave) return;
    const comment = window.prompt(`Enter comment for ${newStatus} (optional):`, "");
    if (comment === null) return; // User cancelled
    
    // In a real app we'd save the comment. For mock, we'll append it to reason or just update status.
    const record = localData.find(l => l.leaveId === leaveId);
    if (!record) return;

    const updatedReason = comment ? `${record.reason} | Note: ${comment}` : record.reason;

    await updateLeave({
      variables: { request: { requestParam: { ...record, status: newStatus, reason: updatedReason } } },
    }).then(() => toast.success(`Leave ${newStatus} successfully.`)).catch(() => {
      toast.error("Network error. Using mock data.");
      setLocalData((prev) =>
        prev.map((l) => (l.leaveId === leaveId ? { ...l, status: newStatus, reason: updatedReason } : l))
      );
    });
    await refetch().catch(() => {});
  }

  function handleExportCSV() {
    if (!leaveData || leaveData.length === 0) return;
    const headers = Object.keys(leaveData[0]).filter(k => k !== '__typename');
    const csvRows = [headers.join(',')];
    for (const row of leaveData) {
      const values = headers.map(header => {
        const val = row[header as keyof Leave];
        const strVal = String(val ?? "").replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leave.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ── Table columns ─────────────────────────────────────────────────────────────

  const columns: ColumnDef<Leave, unknown>[] = [
    { accessorKey: "employeeId", header: "Emp ID" },
    { accessorKey: "leaveType",  header: "Type" },
    { 
      accessorKey: "startDate",  
      header: "Start Date",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return val ? new Date(val).toLocaleDateString() : "-";
      }
    },
    { 
      accessorKey: "endDate", 
      header: "End Date",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return val ? new Date(val).toLocaleDateString() : "-";
      }
    },
    { accessorKey: "reason",     header: "Reason" },
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
        if (isFinance) {
          return <span className="text-xs text-muted-foreground">View Only</span>;
        }
        return (
          <div className="flex items-center gap-3">
            {canEditLeave && record.status === "Pending" ? (
              <>
                <button
                  onClick={() => handleApproveReject(record.leaveId, "Approved")}
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(record.leaveId, "Rejected")}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => openEdit(record)}
                className="text-sm font-medium text-foreground hover:underline"
              >
                {canEditLeave ? "Edit" : "View"}
              </button>
            )}
            
            {(canEditLeave || (isEmployee && record.status !== "Approved")) && (
              <button
                onClick={() => handleDelete(record.leaveId, record.status)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.leave}>
      <div className="min-h-screen bg-background p-6 md:p-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Leave Management</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="rounded border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Export CSV
            </button>
            {!isFinance && (
              <button
                onClick={openAdd}
                className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
              >
                + Apply Leave
              </button>
            )}
          </div>
        </div>

        {/* Leave Balance Widget (Visible mostly for employees) */}
        {isEmployee && <LeaveBalanceWidget />}

        <div className="hidden lg:block">
          <DataTable
            data={leaveData}
            columns={columns}
            isLoading={loading}
            filters={[{ type: "search", placeholder: "Search leave records…" }]}
            quickFiltersTopBar={[
              {
                type: "select",
                columnId: "status",
                label: "Status",
                options: [
                  { label: "Pending",  value: "Pending"  },
                  { label: "Approved", value: "Approved" },
                  { label: "Rejected", value: "Rejected" },
                ],
              },
              {
                type: "select",
                columnId: "leaveType",
                label: "Type",
                options: [
                  { label: "Sick",   value: "Sick"   },
                  { label: "Casual", value: "Casual" },
                  { label: "Earned", value: "Earned" },
                ],
              }
            ]}
            initialPageSize={10}
          />
        </div>

        <div className="flex flex-col gap-4 lg:hidden mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground"></div>
            </div>
          ) : leaveData.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No leave records found.
            </div>
          ) : (
            leaveData.map((record) => (
              <div key={record.leaveId} className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {record.leaveType} Leave
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Emp ID: {record.employeeId}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Start Date</p>
                    <p className="font-medium text-foreground">{record.startDate ? new Date(record.startDate).toLocaleDateString() : "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">End Date</p>
                    <p className="font-medium text-foreground">{record.endDate ? new Date(record.endDate).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
                {record.reason && (
                  <div className="bg-muted/50 p-2 rounded text-xs text-foreground/80 line-clamp-2">
                    {record.reason}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border mt-1">
                  {!isFinance && (
                    <>
                      {canEditLeave && record.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleApproveReject(record.leaveId, "Approved")}
                            className="flex-1 rounded bg-green-500 text-white py-1.5 text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveReject(record.leaveId, "Rejected")}
                            className="flex-1 rounded bg-red-500 text-white py-1.5 text-xs font-medium hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openEdit(record)}
                          className="flex-1 rounded border border-border py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                        >
                          {canEditLeave ? "Edit" : "View"}
                        </button>
                      )}
                      
                      {(canEditLeave || (isEmployee && record.status !== "Approved")) && (
                        <button
                          onClick={() => handleDelete(record.leaveId, record.status)}
                          className="flex-1 rounded border border-red-200 text-red-600 py-1.5 text-xs font-medium hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <LeaveDrawer
          open={drawerOpen}
          mode={drawerMode}
          form={form}
          onClose={closeDrawer}
          onChange={handleFieldChange}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </ProtectedRoute>
  );
}
