'use client';

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";

type Candidate = {
  id: string;
  name: string;
  role: string;
  stage: "Applied" | "Interviewing" | "Offered" | "Hired";
  appliedDate: string;
};

const MOCK_CANDIDATES: Candidate[] = [
  { id: "C1", name: "Alice Smith", role: "Frontend Developer", stage: "Applied", appliedDate: "2026-06-20" },
  { id: "C2", name: "Bob Johnson", role: "Backend Developer", stage: "Interviewing", appliedDate: "2026-06-15" },
  { id: "C3", name: "Charlie Brown", role: "Product Manager", stage: "Offered", appliedDate: "2026-06-10" },
  { id: "C4", name: "Diana Prince", role: "Frontend Developer", stage: "Interviewing", appliedDate: "2026-06-18" },
];

const STAGES = ["Applied", "Interviewing", "Offered", "Hired"] as const;

export default function RecruitmentPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [activeTab, setActiveTab] = useState<"kanban" | "jobs">("kanban");
  
  // Basic drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, stage: Candidate["stage"]) {
    e.preventDefault();
    if (!draggedId) return;
    setCandidates(prev => prev.map(c => c.id === draggedId ? { ...c, stage } : c));
    toast.success(`Candidate moved to ${stage}`);
    setDraggedId(null);
  }

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.recruitment}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Recruitment Dashboard</h1>
          <button
            onClick={() => toast.info("New Job Post creation would open here.")}
            className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
          >
            + Post a Job
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1 max-w-fit">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "kanban" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
          >
            Candidate Pipeline
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "jobs" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
          >
            Active Jobs
          </button>
        </div>

        {activeTab === "kanban" ? (
          <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
            {STAGES.map(stage => (
              <div 
                key={stage} 
                className="flex-1 min-w-[280px] bg-muted/30 rounded-xl p-4 border border-border"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{stage}</h3>
                  <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {candidates.filter(c => c.stage === stage).length}
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[150px]">
                  {candidates.filter(c => c.stage === stage).map(candidate => (
                    <div 
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id)}
                      className="bg-card border border-border rounded-lg p-3 shadow-sm cursor-move hover:shadow-md transition-all active:cursor-grabbing"
                    >
                      <h4 className="font-medium text-foreground mb-1">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{candidate.role}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Applied: {candidate.appliedDate}</span>
                        <span className="opacity-50">⣿</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-border rounded-xl p-5 bg-card shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">Frontend Developer</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Remote • Full-time</p>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Applicants: 2</span>
                <button className="text-blue-600 hover:underline">View</button>
              </div>
            </div>
            
            <div className="border border-border rounded-xl p-5 bg-card shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">Backend Developer</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">New York, NY • Full-time</p>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Applicants: 1</span>
                <button className="text-blue-600 hover:underline">View</button>
              </div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">Product Manager</h3>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Paused</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">San Francisco, CA • Full-time</p>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Applicants: 1</span>
                <button className="text-blue-600 hover:underline">View</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
