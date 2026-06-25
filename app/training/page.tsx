'use client';

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";

type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number; // 0 to 100
  certified: boolean;
};

const MOCK_COURSES: Course[] = [
  { id: "C1", title: "Information Security Awareness 2026", category: "Compliance", duration: "1h 30m", progress: 100, certified: true },
  { id: "C2", title: "Advanced React & Next.js", category: "Tech Skills", duration: "4h 00m", progress: 65, certified: false },
  { id: "C3", title: "Workplace Harassment Prevention", category: "Compliance", duration: "1h 00m", progress: 0, certified: false },
  { id: "C4", title: "Leadership Fundamentals", category: "Soft Skills", duration: "3h 15m", progress: 15, certified: false },
  { id: "C5", title: "Data Privacy & GDPR", category: "Compliance", duration: "2h 00m", progress: 100, certified: true },
];

export default function TrainingPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [activeTab, setActiveTab] = useState<"catalog" | "my_learning">("my_learning");

  const myCourses = courses.filter(c => c.progress > 0 || c.certified);
  const availableCourses = courses.filter(c => c.progress === 0 && !c.certified);

  const earnedCertificates = courses.filter(c => c.certified).length;

  function startCourse(id: string) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, progress: 1 } : c));
    toast.success("Course enrolled successfully!");
    setActiveTab("my_learning");
  }

  function continueCourse(id: string) {
    toast.info("Opening course module...");
  }

  function downloadCertificate(title: string) {
    toast.success(`Downloaded certificate for ${title}`);
  }

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.training}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Training & Learning</h1>
          
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border">
            <span className="text-xl">🏆</span>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Certificates Earned</span>
              <span className="text-sm font-bold">{earnedCertificates}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1 max-w-fit">
          <button
            onClick={() => setActiveTab("my_learning")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "my_learning" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
          >
            My Learning
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "catalog" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
          >
            Course Catalog
          </button>
        </div>

        {activeTab === "my_learning" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myCourses.map(course => (
              <div key={course.id} className="border border-border rounded-xl p-5 bg-card shadow-sm flex flex-col hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">
                      {course.category}
                    </span>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">{course.title}</h3>
                  </div>
                  {course.certified && <span className="text-2xl" title="Certified">🎓</span>}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">Duration: {course.duration}</p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className={course.certified ? "text-green-600" : "text-muted-foreground"}>
                      {course.certified ? "Completed" : "In Progress"}
                    </span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${course.certified ? 'bg-green-600' : 'bg-foreground'}`} 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t border-border">
                    {course.certified ? (
                      <button 
                        onClick={() => downloadCertificate(course.title)}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        Download Certificate
                      </button>
                    ) : (
                      <button 
                        onClick={() => continueCourse(course.id)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Continue Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {myCourses.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">You haven't started any courses yet.</p>
                <button onClick={() => setActiveTab("catalog")} className="text-blue-600 hover:underline mt-2 text-sm">Browse Catalog</button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <div key={course.id} className="border border-border rounded-xl p-5 bg-card shadow-sm flex flex-col hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full mb-2 inline-block">
                      {course.category}
                    </span>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">{course.title}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">Duration: {course.duration}</p>

                <div className="mt-auto pt-4 border-t border-border">
                  <button 
                    onClick={() => startCourse(course.id)}
                    className="w-full rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity"
                  >
                    Start Course
                  </button>
                </div>
              </div>
            ))}
            {availableCourses.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">You've enrolled in all available courses!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
