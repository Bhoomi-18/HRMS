'use client';

import Link from "next/link";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// ─── Mock Data ─────────────────────────────────────────────────────────────

const STATS = {
  totalEmployees: 142,
  presentToday: 128,
  absentToday: 14,
  onLeave: 12,
  payrollThisMonth: "$124,500",
  activeAnnouncements: 3,
  attendancePercentage: "90%",
  newHiresThisMonth: 5,
};

const ATTENDANCE_TREND = [
  { name: 'Mon', present: 130, absent: 12 },
  { name: 'Tue', present: 132, absent: 10 },
  { name: 'Wed', present: 128, absent: 14 },
  { name: 'Thu', present: 135, absent: 7 },
  { name: 'Fri', present: 125, absent: 17 },
];

const DEPARTMENT_DISTRIBUTION = [
  { name: 'Engineering', count: 65 },
  { name: 'Sales', count: 35 },
  { name: 'Marketing', count: 20 },
  { name: 'HR', count: 12 },
  { name: 'Finance', count: 10 },
];

const LEAVE_DISTRIBUTION = [
  { name: 'Sick Leave', value: 45 },
  { name: 'Casual Leave', value: 30 },
  { name: 'Earned Leave', value: 18 },
  { name: 'Maternity', value: 4 },
];

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

const RECENT_ANNOUNCEMENTS = [
  { id: 1, title: "Quarterly Town Hall", date: "Today, 10:00 AM", priority: "High" },
  { id: 2, title: "Server Maintenance", date: "Yesterday", priority: "Critical" },
  { id: 3, title: "New Health Benefits", date: "2 days ago", priority: "Normal" },
  { id: 4, title: "Office Party Registration", date: "Last Week", priority: "Normal" },
  { id: 5, title: "Public Holiday Notice", date: "Last Week", priority: "High" },
];

const UPCOMING_PAYROLL = [
  { id: 1, title: "Mid-Month Advance", date: "15th This Month", status: "Processing" },
  { id: 2, title: "Full Month Salary", date: "Last Working Day", status: "Scheduled" },
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

// ─── Main Page ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isFinance = user?.role === "Finance";
  const isEmployee = user?.role === "Employee";

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(clockInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-muted border border-border"></div>)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <div className="xl:col-span-2 space-y-6">
             <div className="h-[350px] rounded-xl bg-muted border border-border"></div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="h-[300px] rounded-xl bg-muted border border-border"></div>
               <div className="h-[300px] rounded-xl bg-muted border border-border"></div>
             </div>
           </div>
           <div className="space-y-6">
             <div className="h-[200px] rounded-xl bg-muted border border-border"></div>
             <div className="h-[300px] rounded-xl bg-muted border border-border"></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.dashboard}>
      <div className="min-h-screen bg-background p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Good Morning, {user?.name || "User"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Role: {user?.role || "Unknown"}</p>
          <p className="text-sm font-medium text-foreground mt-2">{currentDate}</p>
        </div>
        <div className="hidden sm:flex items-center justify-center rounded-lg border border-border bg-card px-6 py-4 shadow-sm">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{currentTime}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isEmployee ? (
          <>
            <StatCard label="My Attendance %" value="90%" icon="📈" />
            <StatCard label="My Leaves Taken" value="4" icon="🌴" />
            <StatCard label="Available Leaves" value="14" icon="✅" />
            <StatCard label="Next Payroll" value="$4,200" icon="💰" />
            <StatCard label="Active Announcements" value="3" icon="📢" />
          </>
        ) : (
          <>
            <StatCard label="Total Employees" value={STATS.totalEmployees} icon="👥" />
            {!isFinance && (
              <>
                <StatCard label="Present Today" value={STATS.presentToday} icon="🟢" />
                <StatCard label="Absent Today" value={STATS.absentToday} icon="🔴" />
              </>
            )}
            <StatCard label="Employees On Leave" value={STATS.onLeave} icon="🌴" />
            {!isHR && (
              <StatCard label="Payroll This Month" value={STATS.payrollThisMonth} icon="💰" />
            )}
            <StatCard label="Active Announcements" value={STATS.activeAnnouncements} icon="📢" />
            {!isFinance && (
              <>
                <StatCard label="Attendance %" value={STATS.attendancePercentage} icon="📈" />
                <StatCard label="New Hires This Month" value={STATS.newHiresThisMonth} icon="🆕" />
              </>
            )}
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Empty State Fallback */}
          {!isAdmin && !isHR && !isFinance && !isEmployee && (
            <div className="rounded-xl border border-border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-4">📊</span>
              <p className="text-muted-foreground font-medium">No charts available for your role.</p>
            </div>
          )}
          
          {/* Employee Overview Card (Replaces Charts) */}
          {isEmployee && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">My Overview</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Leaves Taken</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Next Payroll</span>
                  <span className="font-medium">$4,200</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Announcements</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Trend Line Chart */}
          {!isEmployee && !isFinance && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Attendance Trend</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ATTENDANCE_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!isEmployee && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution Bar Chart */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Department Distribution</h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEPARTMENT_DISTRIBUTION} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leave Distribution Pie Chart */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Leave Distribution</h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={LEAVE_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {LEAVE_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {(isAdmin || isHR) && (
                <Link href="/employees" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">👥</span>
                  <span className="text-xs font-medium text-center">Add Employee</span>
                </Link>
              )}
              <Link href="/attendance" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors">
                <span className="text-2xl">📅</span>
                <span className="text-xs font-medium text-center">Mark Attendance</span>
              </Link>
              <Link href="/leave" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors">
                <span className="text-2xl">🌴</span>
                <span className="text-xs font-medium text-center">{isFinance ? "View Leave" : "Apply Leave"}</span>
              </Link>
              {(isAdmin || isHR) && (
                <Link href="/announcements" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">📢</span>
                  <span className="text-xs font-medium text-center">Create Notice</span>
                </Link>
              )}
              {(isFinance || isEmployee) && (
                <Link href="/payroll" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">💰</span>
                  <span className="text-xs font-medium text-center">View Payroll</span>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
              <Link href="/announcements" className="text-sm font-medium text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {RECENT_ANNOUNCEMENTS.map(ann => (
                <div key={ann.id} className="flex gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{ann.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ann.date}</p>
                  </div>
                  {ann.priority === 'Critical' && <span className="h-fit rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Critical</span>}
                  {ann.priority === 'High' && <span className="h-fit rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">High</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payroll */}
          {!isHR && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming Payroll</h2>
              <div className="space-y-3">
                {UPCOMING_PAYROLL.map(payroll => (
                  <div key={payroll.id} className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
                    <div>
                      <p className="text-sm font-medium text-foreground">{payroll.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{payroll.date}</p>
                    </div>
                    <span className={`text-xs font-medium ${payroll.status === 'Processing' ? 'text-blue-600' : 'text-muted-foreground'}`}>
                      {payroll.status}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/payroll" className="mt-4 block w-full rounded-md border border-border bg-background py-2 text-center text-sm font-medium hover:bg-muted/50 transition-colors">
                {isEmployee ? "View My Payroll" : "Manage Payroll"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
