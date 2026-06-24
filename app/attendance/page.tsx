'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/table/DataTable";
import { GET_ALL_ATTENDANCE } from "../../graphql/query/attendance";
import { CREATE_ATTENDANCE } from "../../graphql/mutation/createAttendance";
import { UPDATE_ATTENDANCE } from "../../graphql/mutation/updateAttendance";
import { DELETE_ATTENDANCE } from "../../graphql/mutation/deleteAttendance";

// ─── Types ────────────────────────────────────────────────────────────────────

type Attendance = {
  attendanceId: string;
  employeeId: string;
  date: string;
  status: string;
  checkInTime: string;
  checkOutTime: string;
  notes: string;
};

type GetAllAttendanceResult = {
  getAllAttendance?: {
    data?: {
      attendance?: Attendance[];
    };
  };
};

// ─── Mock Data (fallback when GraphQL is not connected) ───────────────────────

const MOCK_ATTENDANCE: Attendance[] = [
  { attendanceId: "1", employeeId: "EMP001", date: "2026-06-23", status: "Present", checkInTime: "2026-06-23T09:00:00", checkOutTime: "2026-06-23T18:00:00", notes: "" },
  { attendanceId: "2", employeeId: "EMP002", date: "2026-06-23", status: "Late",    checkInTime: "2026-06-23T10:15:00", checkOutTime: "2026-06-23T18:30:00", notes: "Traffic" },
  { attendanceId: "3", employeeId: "EMP003", date: "2026-06-23", status: "Absent",  checkInTime: "",                    checkOutTime: "",                    notes: "Sick leave" },
  { attendanceId: "4", employeeId: "EMP004", date: "2026-06-23", status: "Present", checkInTime: "2026-06-23T08:50:00", checkOutTime: "2026-06-23T17:45:00", notes: "" },
];

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Attendance, "attendanceId"> = {
  employeeId: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Present",
  checkInTime: "",
  checkOutTime: "",
  notes: "",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Present: "bg-green-100 text-green-800",
    Absent:  "bg-red-100 text-red-800",
    Late:    "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── Attendance Drawer (right-side form panel) ──────────────────────────────────

function AttendanceDrawer({
  open, mode, form, onClose, onChange, onSave, saving,
}: {
  open: boolean;
  mode: "add" | "edit";
  form: Omit<Attendance, "attendanceId">;
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
        aria-label={mode === "add" ? "Mark Attendance" : "Edit Attendance"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "add" ? "Mark Attendance" : "Edit Attendance"}
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
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
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
              {["Present", "Absent", "Late"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Check-In Time</label>
            <input
              type="datetime-local"
              value={form.checkInTime}
              onChange={(e) => onChange("checkInTime", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Check-Out Time</label>
            <input
              type="datetime-local"
              value={form.checkOutTime}
              onChange={(e) => onChange("checkOutTime", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
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
            {saving ? "Saving…" : mode === "add" ? "Save Record" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState<"add" | "edit">("add");
  const [editingId,  setEditingId]    = useState<string | null>(null);
  const [form,       setForm]         = useState<Omit<Attendance, "attendanceId">>(EMPTY_FORM);
  const [saving,     setSaving]       = useState(false);
  const [localData,  setLocalData]    = useState<Attendance[]>(MOCK_ATTENDANCE);

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, refetch } = useQuery<GetAllAttendanceResult>(GET_ALL_ATTENDANCE, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE);
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const attendanceData: Attendance[] = data?.getAllAttendance?.data?.attendance ?? localData;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY_FORM);
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(record: Attendance) {
    const { attendanceId, ...rest } = record;
    setForm(rest);
    setEditingId(attendanceId);
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
        await createAttendance({
          variables: { request: { requestParam: form } },
        }).catch(() => {
          // Optimistic local update when backend unavailable
          setLocalData((prev) => [
            ...prev,
            { ...form, attendanceId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updateAttendance({
          variables: { request: { requestParam: { ...form, attendanceId: editingId } } },
        }).catch(() => {
          setLocalData((prev) =>
            prev.map((a) => (a.attendanceId === editingId ? { ...form, attendanceId: editingId } : a))
          );
        });
      }
      await refetch().catch(() => {});
    } finally {
      setSaving(false);
      closeDrawer();
    }
  }

  async function handleDelete(attendanceId: string) {
    if (!window.confirm("Delete this attendance record?")) return;
    await deleteAttendance({
      variables: { request: { requestParam: { attendanceId } } },
    }).catch(() => {
      setLocalData((prev) => prev.filter((a) => a.attendanceId !== attendanceId));
    });
    await refetch().catch(() => {});
  }

  function handleExportCSV() {
    if (!attendanceData || attendanceData.length === 0) return;
    const headers = Object.keys(attendanceData[0]).filter(k => k !== '__typename');
    const csvRows = [headers.join(',')];
    for (const row of attendanceData) {
      const values = headers.map(header => {
        const val = row[header as keyof Attendance];
        const strVal = String(val ?? "").replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ── Table columns ─────────────────────────────────────────────────────────────

  const columns: ColumnDef<Attendance, unknown>[] = [
    { accessorKey: "employeeId", header: "Emp ID" },
    { accessorKey: "date",       header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={String(getValue())} />,
    },
    { 
      accessorKey: "checkInTime",  
      header: "Check-In",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return val ? new Date(val).toLocaleTimeString() : "-";
      }
    },
    { 
      accessorKey: "checkOutTime", 
      header: "Check-Out",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return val ? new Date(val).toLocaleTimeString() : "-";
      }
    },
    { accessorKey: "notes",      header: "Notes" },
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
            onClick={() => handleDelete(row.original.attendanceId)}
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
        <h1 className="text-2xl font-semibold text-foreground">Attendance Management</h1>
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
            + Mark Attendance
          </button>
        </div>
      </div>

      <DataTable
        data={attendanceData}
        columns={columns}
        filters={[{ type: "search", placeholder: "Search records…" }]}
        quickFiltersTopBar={[
          {
            type: "select",
            columnId: "status",
            label: "Status",
            options: [
              { label: "Present", value: "Present" },
              { label: "Absent",  value: "Absent"  },
              { label: "Late",    value: "Late"    },
            ],
          }
        ]}
        initialPageSize={10}
      />

      <AttendanceDrawer
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
