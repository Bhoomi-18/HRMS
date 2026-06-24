'use client';

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GET_ALL_EMPLOYEES } from "../../../graphql/query/employees";

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_EMPLOYEES = [
  { employeeId: "1", employeeCode: "EMP001", firstName: "Priya",   lastName: "Sharma",  email: "priya@hrms.com",   phone: "9876543210", department: "Engineering", designation: "SDE II",        joiningDate: "2022-03-15", employmentType: "Full-Time", salary: 85000,  status: "Active"   },
  { employeeId: "2", employeeCode: "EMP002", firstName: "Rahul",   lastName: "Verma",   email: "rahul@hrms.com",   phone: "9876543211", department: "HR",          designation: "HR Manager",     joiningDate: "2021-07-01", employmentType: "Full-Time", salary: 65000,  status: "Active"   },
  { employeeId: "3", employeeCode: "EMP003", firstName: "Anita",   lastName: "Patel",   email: "anita@hrms.com",   phone: "9876543212", department: "Finance",     designation: "Accountant",     joiningDate: "2020-11-20", employmentType: "Full-Time", salary: 72000,  status: "OnLeave"  },
  { employeeId: "4", employeeCode: "EMP004", firstName: "Suresh",  lastName: "Kumar",   email: "suresh@hrms.com",  phone: "9876543213", department: "Engineering", designation: "SDE III",        joiningDate: "2019-05-10", employmentType: "Full-Time", salary: 90000,  status: "Active"   },
  { employeeId: "5", employeeCode: "EMP005", firstName: "Meera",   lastName: "Joshi",   email: "meera@hrms.com",   phone: "9876543214", department: "Marketing",   designation: "Growth Lead",    joiningDate: "2023-01-22", employmentType: "Contract",  salary: 68000,  status: "Active"   },
  { employeeId: "6", employeeCode: "EMP006", firstName: "Vikram",  lastName: "Singh",   email: "vikram@hrms.com",  phone: "9876543215", department: "Engineering", designation: "Tech Lead",      joiningDate: "2018-09-30", employmentType: "Full-Time", salary: 105000, status: "Inactive" },
  { employeeId: "7", employeeCode: "EMP007", firstName: "Kavitha", lastName: "Nair",    email: "kavitha@hrms.com", phone: "9876543216", department: "HR",          designation: "HR Analyst",     joiningDate: "2022-08-14", employmentType: "Full-Time", salary: 62000,  status: "Active"   },
  { employeeId: "8", employeeCode: "EMP008", firstName: "Amit",    lastName: "Gupta",   email: "amit@hrms.com",    phone: "9876543217", department: "Finance",     designation: "Finance Manager", joiningDate: "2021-03-05", employmentType: "Full-Time", salary: 78000,  status: "OnLeave"  },
];

type Employee = typeof MOCK_EMPLOYEES[number];

type GetAllEmployeesResult = {
  getAllEmployees?: {
    data?: {
      employees?: Employee[];
    };
  };
};

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id as string;

  // ── GraphQL Data ─────────────────────────────────────────────────────────────
  const { data, loading } = useQuery<GetAllEmployeesResult>(GET_ALL_EMPLOYEES, {
    variables: { request: { pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 } } },
    errorPolicy: "ignore",
  });

  if (loading) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Loading profile...</div>;
  }

  // Fallback to mock data if GraphQL doesn't return employees
  const allEmployees: Employee[] = data?.getAllEmployees?.data?.employees ?? MOCK_EMPLOYEES;
  const emp = allEmployees.find(e => e.employeeId === id);

  if (!emp) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Employee not found</h1>
        <p className="text-muted-foreground mb-6">The employee ID you are looking for does not exist.</p>
        <Link href="/employees" className="rounded bg-foreground px-6 py-2 text-background hover:opacity-90 font-medium">
          Back to Employees
        </Link>
      </div>
    );
  }

  // Deterministic varying data based on employee string length and character codes
  const seed = emp.firstName.length + (emp.salary ?? 50000) % 100;
  
  const mockAttendance = {
    present: 110 + (seed % 15),
    absent: 2 + (seed % 8),
    late: 1 + (seed % 5),
    totalWorkingDays: 130,
  };

  const mockLeave = {
    sick: 1 + (seed % 4),
    casual: 2 + (seed % 6),
    earned: 1 + (seed % 3),
    pending: seed % 2,
  };

  const mockPayroll = [
    { month: "2026-05", basic: emp.salary ?? 60000, bonus: (seed % 3) * 5000, deductions: 2000, net: (emp.salary ?? 60000) + ((seed % 3) * 5000) - 2000, status: "Paid" },
    { month: "2026-04", basic: emp.salary ?? 60000, bonus: (seed % 4) * 2000, deductions: 2000, net: (emp.salary ?? 60000) + ((seed % 4) * 2000) - 2000, status: "Paid" },
    { month: "2026-03", basic: emp.salary ?? 60000, bonus: 0,                 deductions: 2000, net: (emp.salary ?? 60000) - 2000,                 status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employees" className="rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors">
            ← Back to Employees
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground ml-2">Employee Profile</h1>
        </div>
        <div className={`rounded-full px-4 py-1.5 text-sm font-semibold ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
          {emp.status}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Personal & Job Details */}
        <div className="space-y-6 lg:col-span-1">
          {/* Main Info Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-5 mb-8">
              <div className="h-20 w-20 rounded-full bg-foreground flex items-center justify-center text-3xl font-bold text-background shadow-inner uppercase">
                {emp.firstName?.[0] ?? "U"}{emp.lastName?.[0] ?? "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{emp.firstName} {emp.lastName}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">{emp.designation}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs">Employee Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-medium text-foreground">{emp.employeeCode}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">{emp.department}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{emp.email}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{emp.phone}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Joining Date</span>
                <span className="font-medium text-foreground">{emp.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summaries */}
        <div className="space-y-6 lg:col-span-2">
          {/* Attendance & Leave Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Attendance Summary */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-5 text-foreground">Attendance Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/40 rounded-xl border border-border hover:border-green-300 transition-colors">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Present</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{mockAttendance.present}</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border border-border hover:border-red-300 transition-colors">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Absent</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{mockAttendance.absent}</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border border-border hover:border-yellow-300 transition-colors">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Late</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{mockAttendance.late}</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Days</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{mockAttendance.totalWorkingDays}</p>
                </div>
              </div>
            </div>

            {/* Leave Summary */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-5 text-foreground">Leave Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sick</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{mockLeave.sick}</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Casual</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{mockLeave.casual}</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Earned</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{mockLeave.earned}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-1">{mockLeave.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Summary */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-5 text-foreground">Recent Payroll</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-md">Month</th>
                    <th className="px-4 py-3 font-medium">Basic</th>
                    <th className="px-4 py-3 font-medium">Bonus</th>
                    <th className="px-4 py-3 font-medium">Deductions</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-md">Net Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPayroll.map((pr, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4 font-semibold text-foreground">{pr.month}</td>
                      <td className="px-4 py-4">₹{pr.basic?.toLocaleString('en-IN') ?? 0}</td>
                      <td className="px-4 py-4 text-green-600 font-medium">+ ₹{pr.bonus?.toLocaleString('en-IN') ?? 0}</td>
                      <td className="px-4 py-4 text-red-600 font-medium">- ₹{pr.deductions?.toLocaleString('en-IN') ?? 0}</td>
                      <td className="px-4 py-4 text-right font-bold text-foreground text-base">₹{pr.net?.toLocaleString('en-IN') ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
