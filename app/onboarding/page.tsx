'use client';

import { useState } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const MOCK_TASKS: Task[] = [
  { id: "T1", title: "Complete HR Profile", completed: true },
  { id: "T2", title: "Sign Employee Handbook", completed: false },
  { id: "T3", title: "Setup IT Equipment & Credentials", completed: false },
  { id: "T4", title: "Schedule 1:1 with Manager", completed: false },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.onboarding}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Welcome to HRMS Pro, {user?.name}!</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Welcome Video Mock */}
            <div className="border border-border rounded-xl bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">A Message from Our CEO</h2>
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">▶️</span>
              </div>
              <p className="text-muted-foreground text-sm">
                We are thrilled to have you join our team. At HRMS Pro, we believe in empowering our employees to do their best work...
              </p>
            </div>

            {/* Meet the Team */}
            <div className="border border-border rounded-xl bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Your Team</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center bg-muted/30 p-4 rounded-xl border border-border min-w-[120px]">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl mb-2">👨‍💼</div>
                  <span className="font-medium text-sm">John Doe</span>
                  <span className="text-xs text-muted-foreground">Manager</span>
                </div>
                <div className="flex flex-col items-center bg-muted/30 p-4 rounded-xl border border-border min-w-[120px]">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-xl mb-2">👩‍💻</div>
                  <span className="font-medium text-sm">Jane Smith</span>
                  <span className="text-xs text-muted-foreground">Buddy</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Checklist */}
          <div className="space-y-6">
            
            <div className="border border-border rounded-xl bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
              <p className="text-sm text-muted-foreground mb-4">Complete these tasks to get started.</p>
              
              <div className="flex justify-between text-sm mb-1">
                <span>{progressPercent}% Completed</span>
                <span>{completedCount}/{tasks.length}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mb-6">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <label key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
