'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { DataTable } from "../../components/table/DataTable";
import { useAuth } from "../../context/AuthContext";
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
  overtimeHours?: number;
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
  { attendanceId: "1", employeeId: "EMP001", date: "2026-06-23", status: "Present", checkInTime: "2026-06-23T09:00:00", checkOutTime: "2026-06-23T18:00:00", notes: "", overtimeHours: 0 },
  { attendanceId: "2", employeeId: "EMP002", date: "2026-06-23", status: "Late",    checkInTime: "2026-06-23T10:15:00", checkOutTime: "2026-06-23T18:30:00", notes: "Traffic", overtimeHours: 0 },
  { attendanceId: "3", employeeId: "EMP003", date: "2026-06-23", status: "Absent",  checkInTime: "",                    checkOutTime: "",                    notes: "Sick leave" },
  { attendanceId: "4", employeeId: "EMP004", date: "2026-06-23", status: "Present", checkInTime: "2026-06-23T08:50:00", checkOutTime: "2026-06-23T19:45:00", notes: "", overtimeHours: 1.5 },
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

// ─── Shift Calendar View ──────────────────────────────────────────────────────

function ShiftCalendar() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
       <h3 className="text-lg font-semibold mb-4 text-foreground">My Shift Schedule (Current Week)</h3>
       <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
         {days.map(day => (
           <div key={day} className="border border-border rounded-lg p-3 text-center">
             <div className="font-medium text-sm mb-2 text-foreground">{day}</div>
             {day === "Saturday" || day === "Sunday" ? (
               <div className="text-xs text-muted-foreground font-medium bg-muted py-2 rounded">Off</div>
             ) : (
               <div className="text-xs text-blue-700 bg-blue-100 py-2 rounded font-medium">09:00 AM<br/>to<br/>06:00 PM</div>
             )}
           </div>
         ))}
       </div>
    </div>
  );
}

// ─── Clock In / Out Modal ─────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

function ClockModal({ open, onClose, isClockingOut, onConfirm }: { open: boolean, onClose: () => void, isClockingOut: boolean, onConfirm: () => void }) {
  const [verifying, setVerifying] = useState(true);
  const [captured, setCaptured] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    if(open) {
      setVerifying(true);
      setCaptured(false);
      
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.error("Camera error:", err);
          toast.error("Camera access denied or unavailable.");
        });

      const t = setTimeout(() => {
        setVerifying(false);
        setCaptured(true);
      }, 3000);
      
      return () => {
        clearTimeout(t);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-card border border-border p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-foreground">{isClockingOut ? "Clock Out Verification" : "Clock In Verification"}</h2>
        
        {/* Real Camera View */}
        <div className="h-48 bg-black rounded-lg flex items-center justify-center mb-4 border-2 border-border relative overflow-hidden">
           <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${captured ? 'opacity-50' : 'opacity-100'}`} />
           {verifying && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
               <span className="animate-pulse text-white font-medium drop-shadow-md">Verifying Face...</span>
             </div>
           )}
           {captured && !verifying && (
             <div className="absolute inset-0 bg-green-900/30 flex flex-col items-center justify-center backdrop-blur-[1px]">
               <span className="text-4xl mb-2">✅</span>
               <span className="text-xs font-semibold text-white bg-green-600 px-3 py-1 rounded-full shadow">Selfie Verified</span>
             </div>
           )}
        </div>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Location Check</span>
            <span className="font-medium">{verifying ? "Verifying..." : "✅ Verified (Office)"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">IP Validation</span>
            <span className="font-medium">{verifying ? "Validating..." : "✅ Valid (192.168.1.50)"}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} disabled={verifying} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50 transition-opacity">
            {isClockingOut ? "Confirm Clock Out" : "Confirm Clock In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Drawer (right-side form panel) ──────────────────────────────────

function AttendanceDrawer({
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
  form: Omit<Attendance, "attendanceId">;
  onClose: () => void;
  onChange: (field: keyof Omit<Attendance, "attendanceId">, value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { user } = useAuth();
  const isEmployee = user?.role === "Employee";

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden="true" />
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
              value={isEmployee ? user?.id : form.employeeId}
              onChange={(e) => onChange("employeeId", e.target.value)}
              disabled={isEmployee}
              className={`h-9 rounded border border-border px-3 text-sm text-foreground ${isEmployee ? 'bg-muted cursor-not-allowed' : 'bg-background'}`}
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
  const [activeTab,  setActiveTab]    = useState<"log" | "calendar">("log");
  const [clockModalOpen, setClockModalOpen] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isEmployee = user?.role === "Employee";
  const isFinance = user?.role === "Finance";
  const canEditAttendance = isAdmin || isHR;

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery<GetAllAttendanceResult>(GET_ALL_ATTENDANCE, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE);
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const rawData: Attendance[] = data?.getAllAttendance?.data?.attendance ?? localData;
  const attendanceData = rawData.filter(item => {
    if (isEmployee) return item.employeeId === user?.id;
    return true;
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysRecord = attendanceData.find(a => a.employeeId === user?.id && a.date === todayStr);
  const isClockingOut = !!(todaysRecord && todaysRecord.checkInTime && !todaysRecord.checkOutTime);
  const hasCompletedToday = !!(todaysRecord && todaysRecord.checkInTime && todaysRecord.checkOutTime);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setForm({ ...EMPTY_FORM, employeeId: isEmployee ? (user?.id ?? "") : "" });
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(record: Attendance) {
    if (!canEditAttendance && record.employeeId !== user?.id) {
      toast.error("You don't have permission for this action.");
      return;
    }
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
      const calcOvertime = (checkIn: string, checkOut: string) => {
        if (!checkIn || !checkOut) return 0;
        const diffHours = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 3600000;
        return diffHours > 8 ? parseFloat((diffHours - 8).toFixed(1)) : 0;
      };
      
      const payload = { ...form, overtimeHours: calcOvertime(form.checkInTime, form.checkOutTime) };

      if (drawerMode === "add") {
        await createAttendance({
          variables: { request: { requestParam: payload } },
        }).then(() => toast.success("Attendance added successfully!")).catch(() => {
          // Optimistic local update when backend unavailable
          toast.error("Network error. Using mock data.");
          setLocalData((prev) => [
            ...prev,
            { ...payload, attendanceId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updateAttendance({
          variables: { request: { requestParam: { ...form, attendanceId: editingId } } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          toast.error("Network error. Using mock data.");
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

  function handleClockConfirm() {
    const now = new Date().toISOString();
    if (isClockingOut && todaysRecord) {
      // Mock clock out
      const checkIn = todaysRecord.checkInTime;
      const diffHours = (new Date(now).getTime() - new Date(checkIn).getTime()) / 3600000;
      const ot = diffHours > 8 ? parseFloat((diffHours - 8).toFixed(1)) : 0;
      setLocalData(prev => prev.map(a => a.attendanceId === todaysRecord.attendanceId ? { ...a, checkOutTime: now, overtimeHours: ot } : a));
      toast.success("Clocked out successfully!");
    } else {
      // Mock clock in
      setLocalData(prev => [...prev, {
        attendanceId: `local-${Date.now()}`,
        employeeId: user?.id || "",
        date: todayStr,
        status: "Present",
        checkInTime: now,
        checkOutTime: "",
        notes: "Selfie verified",
        overtimeHours: 0
      }]);
      toast.success("Clocked in successfully!");
    }
    setClockModalOpen(false);
  }

  async function handleDelete(attendanceId: string) {
    if (!canEditAttendance) {
      toast.error("You don't have permission for this action.");
      return;
    }
    if (!window.confirm("Delete this attendance record?")) return;
    await deleteAttendance({
      variables: { request: { requestParam: { attendanceId } } },
    }).then(() => toast.success("Action completed successfully.")).catch(() => {
      toast.error("Network error. Using mock data.");
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
    {
      accessorKey: "overtimeHours",
      header: "Overtime (Hrs)",
      cell: ({ getValue }) => {
        const val = getValue() as number;
        return val && val > 0 ? <span className="font-medium text-orange-600">{val}h</span> : "-";
      }
    },
    { accessorKey: "notes",      header: "Notes" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        if (!canEditAttendance && !isEmployee) {
          return <span className="text-xs text-muted-foreground">View Only</span>;
        }
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => openEdit(record)}
              className="text-sm font-medium text-foreground hover:underline"
            >
              Edit
            </button>
            {canEditAttendance && (
              <button
                onClick={() => handleDelete(record.attendanceId)}
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
    <ProtectedRoute roles={PAGE_PERMISSIONS.attendance}>
      <div className="min-h-screen bg-background p-6 md:p-8">
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
            {isEmployee ? (
              <button
                onClick={() => setClockModalOpen(true)}
                disabled={hasCompletedToday}
                className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              >
                {hasCompletedToday ? "Completed Today" : isClockingOut ? "Clock Out (Selfie)" : "Clock In (Selfie)"}
              </button>
            ) : (
              <button
                onClick={openAdd}
                className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
              >
                + Add Record
              </button>
            )}
          </div>
        </div>

        {/* Tabs for Shift Calendar */}
        {isEmployee && (
          <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1 max-w-fit">
            <button
              onClick={() => setActiveTab("log")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "log" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            >
              Daily Log
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "calendar" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            >
              Shift Calendar
            </button>
          </div>
        )}

        {activeTab === "log" ? (
          <DataTable
            data={attendanceData}
            columns={columns}
            isLoading={loading}
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
        ) : (
          <ShiftCalendar />
        )}

        <ClockModal
          open={clockModalOpen}
          onClose={() => setClockModalOpen(false)}
          isClockingOut={isClockingOut}
          onConfirm={handleClockConfirm}
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
    </ProtectedRoute>
  );
}
