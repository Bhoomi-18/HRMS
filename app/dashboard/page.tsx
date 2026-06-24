'use client';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const STATS = {
  totalEmployees: 142,
  presentToday: 128,
  pendingLeaves: 12,
  payrollProcessed: "98%",
};

const ATTENDANCE_MOCK = [
  { label: "Present", value: 128, color: "bg-green-500", percentage: 90 },
  { label: "Absent", value: 10, color: "bg-red-500", percentage: 7 },
  { label: "Late", value: 4, color: "bg-yellow-500", percentage: 3 },
];

const LEAVE_MOCK = [
  { label: "Sick Leave", count: 45, color: "bg-blue-500", max: 50 },
  { label: "Casual Leave", count: 30, color: "bg-indigo-500", max: 50 },
  { label: "Earned Leave", count: 18, color: "bg-purple-500", max: 50 },
  { label: "Maternity", count: 4, color: "bg-pink-500", max: 50 },
];

// ─── Components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
    </div>
  );
}

// Simple Horizontal Bar Chart using Tailwind
function HorizontalBarChart({ title, data }: { title: string; data: { label: string; count: number; color: string; max: number }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
      <h2 className="mb-6 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-5 flex-1 justify-center flex flex-col">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground font-semibold">{item.count}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                style={{ width: `${(item.count / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stacked Bar representation for Attendance
function AttendanceOverview() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Attendance Overview</h2>
      
      <div className="flex-1 flex flex-col justify-center">
        {/* Stacked Bar */}
        <div className="h-5 w-full flex overflow-hidden rounded-full mb-8 shadow-inner">
          {ATTENDANCE_MOCK.map((item, idx) => (
            <div 
              key={idx} 
              className={`h-full ${item.color} transition-all duration-1000 hover:opacity-80`} 
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {ATTENDANCE_MOCK.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${item.color} shadow-sm`} />
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-3xl font-bold text-foreground">{item.value}</span>
              <span className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the HRMS portal. Here's what is happening today.</p>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Employees"   value={STATS.totalEmployees}   icon="👥" />
        <StatCard label="Present Today"     value={STATS.presentToday}     icon="✅" />
        <StatCard label="Pending Leaves"    value={STATS.pendingLeaves}    icon="⏳" />
        <StatCard label="Payroll Processed" value={STATS.payrollProcessed} icon="💸" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceOverview />
        <HorizontalBarChart title="Leave Distribution" data={LEAVE_MOCK} />
      </div>
    </div>
  );
}
