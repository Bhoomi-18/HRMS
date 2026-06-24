'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/table/DataTable";
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

// ─── Leave Drawer (right-side form panel) ──────────────────────────────────

function LeaveDrawer({
  open, mode, form, onClose, onChange, onSave, saving,
}: {
  open: boolean;
  mode: "add" | "edit";
  form: Omit<Leave, "leaveId">;
  onClose: () => void;
  onChange: (field: keyof typeof EMPTY_FORM, value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
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
              value={form.employeeId}
              onChange={(e) => onChange("employeeId", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
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

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, refetch } = useQuery<GetAllLeaveResult>(GET_ALL_LEAVE, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createLeave] = useMutation(CREATE_LEAVE);
  const [updateLeave] = useMutation(UPDATE_LEAVE);
  const [deleteLeave] = useMutation(DELETE_LEAVE);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const leaveData: Leave[] = data?.getAllLeave?.data?.leave ?? localData;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY_FORM);
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(record: Leave) {
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
    setSaving(true);
    try {
      if (drawerMode === "add") {
        await createLeave({
          variables: { request: { requestParam: form } },
        }).catch(() => {
          // Optimistic local update when backend unavailable
          setLocalData((prev) => [
            ...prev,
            { ...form, leaveId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updateLeave({
          variables: { request: { requestParam: { ...form, leaveId: editingId } } },
        }).catch(() => {
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

  async function handleDelete(leaveId: string) {
    if (!window.confirm("Delete this leave record?")) return;
    await deleteLeave({
      variables: { request: { requestParam: { leaveId } } },
    }).catch(() => {
      setLocalData((prev) => prev.filter((l) => l.leaveId !== leaveId));
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row.original)}
            className="rounded border border-border px-2 py-1 text-xs hover:bg-muted/40"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.leaveId)}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-8">
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
          <button
            onClick={openAdd}
            className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
          >
            + Apply Leave
          </button>
        </div>
      </div>

      <DataTable
        data={leaveData}
        columns={columns}
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
  );
}
