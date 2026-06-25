'use client';

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";

type Document = {
  documentId: string;
  employeeId: string;
  title: string;
  category: string;
  uploadDate: string;
  expiryDate?: string;
  status: string; // "Verified", "Pending", "Expired"
};

const MOCK_DOCUMENTS: Document[] = [
  { documentId: "DOC1", employeeId: "EMP001", title: "Passport", category: "Identity", uploadDate: "2024-01-15", expiryDate: "2026-06-30", status: "Verified" },
  { documentId: "DOC2", employeeId: "EMP001", title: "Offer Letter", category: "Employment", uploadDate: "2024-01-10", status: "Verified" },
  { documentId: "DOC3", employeeId: "EMP002", title: "Form 16 / W2", category: "Tax", uploadDate: "2025-04-10", status: "Pending" },
  { documentId: "DOC4", employeeId: "EMP003", title: "Work Visa", category: "Identity", uploadDate: "2022-05-12", expiryDate: "2023-05-12", status: "Expired" },
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isEmployee = user?.role === "Employee";
  const canVerify = isAdmin || isHR;

  const [data, setData] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({});
  const [search, setSearch] = useState("");

  const displayData = data.filter(item => {
    if (isEmployee) return item.employeeId === user?.id;
    return true;
  }).filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()));

  const expiringSoonCount = displayData.filter(d => {
    if (!d.expiryDate || d.status === "Expired") return false;
    const daysToExpiry = (new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return daysToExpiry > 0 && daysToExpiry <= 30; // Expiring in next 30 days
  }).length;

  const pendingVerificationCount = displayData.filter(d => d.status === "Pending").length;

  function openUpload() {
    setFormData({
      employeeId: user?.id || "",
      title: "",
      category: "Identity",
      uploadDate: new Date().toISOString().slice(0, 10),
      status: "Pending"
    });
    setIsDrawerOpen(true);
  }

  function handleSave() {
    if (!formData.title) {
      toast.error("Please enter a document title.");
      return;
    }
    const newRecord: Document = {
      ...(formData as Document),
      documentId: `DOC-${Date.now()}`,
    };
    setData(prev => [newRecord, ...prev]);
    toast.success("Document uploaded successfully.");
    setIsDrawerOpen(false);
  }

  function handleVerify(id: string) {
    if (!canVerify) return;
    setData(prev => prev.map(doc => doc.documentId === id ? { ...doc, status: "Verified" } : doc));
    toast.success("Document verified.");
  }

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.documents}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Document Repository</h1>
          <button
            onClick={openUpload}
            className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            + Upload Document
          </button>
        </div>

        {/* Alerts & Widgets */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {expiringSoonCount > 0 && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">Expiring Documents</h3>
                  <p className="text-sm text-yellow-700">You have {expiringSoonCount} document(s) expiring within 30 days.</p>
                </div>
              </div>
            </div>
          )}
          {canVerify && pendingVerificationCount > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-semibold text-blue-800">Verification Required</h3>
                  <p className="text-sm text-blue-700">{pendingVerificationCount} document(s) require HR verification.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex">
          <input
            type="text"
            placeholder="Search documents by title or category..."
            className="h-10 w-full sm:w-[320px] rounded-md border border-border bg-background px-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((doc) => (
            <div key={doc.documentId} className="border border-border rounded-xl p-5 bg-card shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xl">
                    {doc.category === 'Identity' ? '🛂' : doc.category === 'Tax' ? '📄' : '💼'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground truncate max-w-[150px]" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs text-muted-foreground">{doc.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                  doc.status === 'Expired' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1 mb-4 flex-1">
                {!isEmployee && <div><span className="font-medium text-foreground">Emp ID:</span> {doc.employeeId}</div>}
                <div><span className="font-medium text-foreground">Uploaded:</span> {doc.uploadDate}</div>
                {doc.expiryDate && <div><span className="font-medium text-foreground">Expires:</span> <span className={new Date(doc.expiryDate) < new Date() ? "text-red-600 font-semibold" : ""}>{doc.expiryDate}</span></div>}
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                <button className="text-sm font-medium text-blue-600 hover:underline">View/Download</button>
                {canVerify && doc.status === "Pending" && (
                  <button onClick={() => handleVerify(doc.documentId)} className="text-sm font-medium text-green-600 hover:underline">Verify Now</button>
                )}
              </div>
            </div>
          ))}
          {displayData.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
              No documents found.
            </div>
          )}
        </div>

        {/* Upload Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-background shadow-2xl border-l border-border p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-6">Upload Document</h2>
              
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Document Title</label>
                  <input type="text" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border" placeholder="e.g. Work Visa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <select value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border">
                    <option value="Identity">Identity (Passport, ID)</option>
                    <option value="Tax">Tax (W2, Form 16)</option>
                    <option value="Employment">Employment (Offer Letter, Contract)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Expiry Date (Optional)</label>
                  <input type="date" value={formData.expiryDate || ""} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">File Upload</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                    Click to browse files (PDF, JPG, PNG)
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end gap-3 mt-auto">
                <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90">Upload</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
