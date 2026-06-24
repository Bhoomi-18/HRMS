'use client';

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/table/DataTable";
import { GET_ALL_EMPLOYEES } from "../../graphql/query/employees";
import { CREATE_EMPLOYEE } from "../../graphql/mutation/createEmployee";
import { UPDATE_EMPLOYEE } from "../../graphql/mutation/updateEmployee";
import { DELETE_EMPLOYEE } from "../../graphql/mutation/deleteEmployee";

// ─── Types ────────────────────────────────────────────────────────────────────

type Employee = {
  employeeId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  salary: number;
  status: string;
};

// Describes the shape Apollo returns for the getAllEmployees query
type GetAllEmployeesResult = {
  getAllEmployees?: {
    data?: {
      employees?: Employee[];
    };
  };
};

// ─── Mock Data (fallback when GraphQL is not connected) ───────────────────────

const MOCK_EMPLOYEES: Employee[] = [
  { employeeId: "1", employeeCode: "EMP001", firstName: "Priya",   lastName: "Sharma",  email: "priya@hrms.com",   phone: "9876543210", department: "Engineering", designation: "SDE II",        joiningDate: "2022-03-15", employmentType: "Full-Time", salary: 85000,  status: "Active"   },
  { employeeId: "2", employeeCode: "EMP002", firstName: "Rahul",   lastName: "Verma",   email: "rahul@hrms.com",   phone: "9876543211", department: "HR",          designation: "HR Manager",     joiningDate: "2021-07-01", employmentType: "Full-Time", salary: 65000,  status: "Active"   },
  { employeeId: "3", employeeCode: "EMP003", firstName: "Anita",   lastName: "Patel",   email: "anita@hrms.com",   phone: "9876543212", department: "Finance",     designation: "Accountant",     joiningDate: "2020-11-20", employmentType: "Full-Time", salary: 72000,  status: "OnLeave"  },
  { employeeId: "4", employeeCode: "EMP004", firstName: "Suresh",  lastName: "Kumar",   email: "suresh@hrms.com",  phone: "9876543213", department: "Engineering", designation: "SDE III",        joiningDate: "2019-05-10", employmentType: "Full-Time", salary: 90000,  status: "Active"   },
  { employeeId: "5", employeeCode: "EMP005", firstName: "Meera",   lastName: "Joshi",   email: "meera@hrms.com",   phone: "9876543214", department: "Marketing",   designation: "Growth Lead",    joiningDate: "2023-01-22", employmentType: "Contract",  salary: 68000,  status: "Active"   },
  { employeeId: "6", employeeCode: "EMP006", firstName: "Vikram",  lastName: "Singh",   email: "vikram@hrms.com",  phone: "9876543215", department: "Engineering", designation: "Tech Lead",      joiningDate: "2018-09-30", employmentType: "Full-Time", salary: 105000, status: "Inactive" },
  { employeeId: "7", employeeCode: "EMP007", firstName: "Kavitha", lastName: "Nair",    email: "kavitha@hrms.com", phone: "9876543216", department: "HR",          designation: "HR Analyst",     joiningDate: "2022-08-14", employmentType: "Full-Time", salary: 62000,  status: "Active"   },
  { employeeId: "8", employeeCode: "EMP008", firstName: "Amit",    lastName: "Gupta",   email: "amit@hrms.com",    phone: "9876543217", department: "Finance",     designation: "Finance Manager", joiningDate: "2021-03-05", employmentType: "Full-Time", salary: 78000,  status: "OnLeave"  },
];

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Employee, "employeeId"> = {
  employeeCode: "", firstName: "", lastName: "", email: "",
  phone: "", department: "", designation: "", joiningDate: "",
  employmentType: "Full-Time", salary: 0, status: "Active",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active:   "bg-green-100 text-green-800",
    OnLeave:  "bg-yellow-100 text-yellow-800",
    Inactive: "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── Employee Drawer (right-side form panel) ──────────────────────────────────

function EmployeeDrawer({
  open, mode, form, onClose, onChange, onSave, saving,
}: {
  open: boolean;
  mode: "add" | "edit";
  form: Omit<Employee, "employeeId">;
  onClose: () => void;
  onChange: (field: keyof typeof EMPTY_FORM, value: string | number) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const fields: Array<{ key: keyof typeof EMPTY_FORM; label: string; type?: string }> = [
    { key: "employeeCode",  label: "Employee Code" },
    { key: "firstName",     label: "First Name" },
    { key: "lastName",      label: "Last Name" },
    { key: "email",         label: "Email",        type: "email" },
    { key: "phone",         label: "Phone" },
    { key: "department",    label: "Department" },
    { key: "designation",   label: "Designation" },
    { key: "joiningDate",   label: "Joining Date", type: "date" },
    { key: "salary",        label: "Salary",       type: "number" },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden="true" />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full sm:w-[400px] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? "Add Employee" : "Edit Employee"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "add" ? "Add Employee" : "Edit Employee"}
          </h2>
          <button onClick={onClose} className="rounded border border-border px-2 py-1 text-sm" aria-label="Close">×</button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <input
                type={type ?? "text"}
                value={String(form[key] ?? "")}
                onChange={(e) => onChange(key, type === "number" ? Number(e.target.value) : e.target.value)}
                className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
              />
            </div>
          ))}

          {/* Select fields */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Employment Type</label>
            <select
              value={form.employmentType}
              onChange={(e) => onChange("employmentType", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            >
              {["Full-Time", "Part-Time", "Contract", "Intern"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="h-9 rounded border border-border bg-background px-3 text-sm text-foreground"
            >
              {["Active", "OnLeave", "Inactive"].map((s) => (
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
            {saving ? "Saving…" : mode === "add" ? "Add Employee" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState<"add" | "edit">("add");
  const [editingId,  setEditingId]    = useState<string | null>(null);
  const [form,       setForm]         = useState<Omit<Employee, "employeeId">>(EMPTY_FORM);
  const [saving,     setSaving]       = useState(false);
  const [localData,  setLocalData]    = useState<Employee[]>(MOCK_EMPLOYEES);

  // ── GraphQL hooks ────────────────────────────────────────────────────────────
  const { data, refetch } = useQuery<GetAllEmployeesResult>(GET_ALL_EMPLOYEES, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  // Use live data if available, otherwise use local state (mock or optimistic)
  const employees: Employee[] = data?.getAllEmployees?.data?.employees ?? localData;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY_FORM);
    setDrawerMode("add");
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(emp: Employee) {
    const { employeeId, ...rest } = emp;
    setForm(rest);
    setEditingId(employeeId);
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
    setSaving(true);
    try {
      if (drawerMode === "add") {
        await createEmployee({
          variables: { request: { requestParam: form } },
        }).catch(() => {
          // Optimistic local update when backend unavailable
          setLocalData((prev) => [
            ...prev,
            { ...form, employeeId: `local-${Date.now()}` },
          ]);
        });
      } else if (editingId) {
        await updateEmployee({
          variables: { request: { requestParam: { ...form, employeeId: editingId } } },
        }).catch(() => {
          setLocalData((prev) =>
            prev.map((e) => (e.employeeId === editingId ? { ...form, employeeId: editingId } : e))
          );
        });
      }
      await refetch().catch(() => {});
    } finally {
      setSaving(false);
      closeDrawer();
    }
  }

  async function handleDelete(employeeId: string) {
    if (!window.confirm("Delete this employee?")) return;
    await deleteEmployee({
      variables: { request: { requestParam: { employeeId } } },
    }).catch(() => {
      setLocalData((prev) => prev.filter((e) => e.employeeId !== employeeId));
    });
    await refetch().catch(() => {});
  }

  function handleExportCSV() {
    if (!employees || employees.length === 0) return;
    const headers = Object.keys(employees[0]).filter(k => k !== '__typename');
    const csvRows = [headers.join(',')];
    for (const row of employees) {
      const values = headers.map(header => {
        const val = row[header as keyof Employee];
        const strVal = String(val ?? "").replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ── Table columns ─────────────────────────────────────────────────────────────

  const columns: ColumnDef<Employee, unknown>[] = [
    { accessorKey: "employeeCode", header: "Code" },
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    { accessorKey: "email",          header: "Email" },
    { accessorKey: "department",     header: "Department" },
    { accessorKey: "designation",    header: "Designation" },
    { accessorKey: "employmentType", header: "Type" },
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
          <Link
            href={`/employees/${row.original.employeeId}`}
            className="rounded bg-foreground px-2 py-1 text-xs text-background hover:opacity-90 font-medium"
          >
            Profile
          </Link>
          <button
            onClick={() => openEdit(row.original)}
            className="rounded border border-border px-2 py-1 text-xs hover:bg-muted/40"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.employeeId)}
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
        <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
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
            + Add Employee
          </button>
        </div>
      </div>

      <DataTable
        data={employees}
        columns={columns}
        filters={[{ type: "search", placeholder: "Search employees…" }]}
        quickFiltersTopBar={[
          {
            type: "select",
            columnId: "status",
            label: "Status",
            options: [
              { label: "Active",   value: "Active"   },
              { label: "On Leave", value: "OnLeave"  },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            type: "select",
            columnId: "department",
            label: "Department",
            options: Array.from(new Set(employees.map((e) => e.department))).map((d) => ({
              label: d,
              value: d,
            })),
          },
        ]}
        initialPageSize={10}
      />

      <EmployeeDrawer
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
