'use client';

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { PAGE_PERMISSIONS } from "../../config/rbac";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_ANNOUNCEMENT } from "../../graphql/query/announcement";
import { CREATE_ANNOUNCEMENT } from "../../graphql/mutation/createAnnouncement";
import { UPDATE_ANNOUNCEMENT } from "../../graphql/mutation/updateAnnouncement";
import { DELETE_ANNOUNCEMENT } from "../../graphql/mutation/deleteAnnouncement";

export type Announcement = {
  announcementId: string;
  title: string;
  category: string;
  priority: string;
  content: string;
  visibilityScope: string;
  expiryDate: string;
  views: number;
  acknowledgements: number;
  likes: number;
  comments: number;
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    announcementId: "A1",
    title: "Quarterly Town Hall",
    category: "General",
    priority: "High",
    content: "Join us for the Q3 town hall meeting.",
    visibilityScope: "All",
    expiryDate: "2026-07-01",
    views: 145,
    acknowledgements: 120,
    likes: 85,
    comments: 12,
  },
  {
    announcementId: "A2",
    title: "Server Maintenance",
    category: "IT",
    priority: "Critical",
    content: "Servers will be down for 2 hours.",
    visibilityScope: "All",
    expiryDate: "2026-06-25",
    views: 89,
    acknowledgements: 50,
    likes: 10,
    comments: 4,
  },
];

type GetAllAnnouncementResult = {
  getAllAnnouncement?: {
    data?: {
      announcement?: Announcement[];
    };
  };
};

export default function AnnouncementsPage() {
  const [localData, setLocalData] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  
  const { data, loading, refetch } = useQuery<GetAllAnnouncementResult>(GET_ALL_ANNOUNCEMENT, {
    variables: { request: { requestParam: {}, pageCriteria: { enablePage: false } } },
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT);
  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT);
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT);

  const announcements: Announcement[] = data?.getAllAnnouncement?.data?.announcement || localData;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [isAddOpen,  setIsAddOpen]   = useState(false);
  const [editingId,  setEditingId]   = useState<string | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isHR = user?.role === "HR Manager";
  const isEmployee = user?.role === "Employee";
  const isFinance = user?.role === "Finance";
  const canManageAnnouncements = isAdmin || isHR;
  
  const [formData, setFormData] = useState<Partial<Announcement>>({});

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter ? a.category === categoryFilter : true;
      const matchPri = priorityFilter ? a.priority === priorityFilter : true;
      return matchSearch && matchCat && matchPri;
    });
  }, [announcements, search, categoryFilter, priorityFilter]);

  const uniqueCategories = Array.from(new Set(announcements.map(a => a.category)));
  const uniquePriorities = Array.from(new Set(announcements.map(a => a.priority)));

  function openAdd() {
    if (!canManageAnnouncements) {
      toast.error("You don't have permission for this action.");
      return;
    }
    setFormData({});
    setEditingId(null);
    setIsAddOpen(true);
  }

  function openEdit(item: Announcement) {
    if (!canManageAnnouncements) {
      toast.error("You don't have permission for this action.");
      return;
    }
    const { announcementId, ...rest } = item;
    setFormData(rest);
    setEditingId(announcementId);
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAnnouncement({
          variables: { request: { requestParam: { ...formData, announcementId: editingId } } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          toast.error("Network error. Mocking update.");
          setLocalData(prev => prev.map(a => a.announcementId === editingId ? { ...formData, announcementId: editingId } as Announcement : a));
        });
      } else {
        await createAnnouncement({
          variables: { request: { requestParam: formData } },
        }).then(() => toast.success("Action completed successfully.")).catch(() => {
          toast.error("Network error. Mocking create.");
          setLocalData(prev => [...prev, { ...formData, announcementId: `local-${Date.now()}` } as Announcement]);
        });
      }
      await refetch().catch(() => {});
      setIsAddOpen(false);
    } catch (e) {
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!canManageAnnouncements) {
      toast.error("You don't have permission for this action.");
      return;
    }
    if (!window.confirm("Delete this announcement?")) return;
    await deleteAnnouncement({ variables: { request: { requestParam: { announcementId: id } } } })
      .then(() => toast.success("Announcement deleted successfully!"))
      .catch(() => { toast.error("Network error. Using mock data."); setLocalData(prev => prev.filter(a => a.announcementId !== id)); });
    await refetch().catch(() => {});
  };

  return (
    <ProtectedRoute roles={PAGE_PERMISSIONS.announcements}>
      <div className="min-h-screen bg-background p-6 md:p-8 animate-in fade-in duration-500">
        
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Announcements</h1>
          {canManageAnnouncements && (
            <button onClick={openAdd} className="rounded bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              + Create Announcement
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <input 
            type="text" 
            placeholder="Search title..." 
            className="h-9 w-full sm:w-[260px] rounded border border-border bg-background px-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="h-9 rounded border border-border bg-background px-3 w-full sm:w-auto"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="h-9 rounded border border-border bg-background px-3 w-full sm:w-auto"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {uniquePriorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-border rounded-xl p-5 bg-card h-[200px] animate-pulse flex flex-col">
                <div className="h-6 w-3/4 bg-muted rounded mb-4"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-muted rounded mb-6"></div>
                <div className="mt-auto h-4 w-1/3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-background flex flex-col items-center">
            <span className="text-4xl mb-4 opacity-80">📢</span>
            <h3 className="text-lg font-medium text-foreground">No announcements found</h3>
            <p className="text-sm text-muted-foreground mt-1">There are no active announcements matching your criteria right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((item) => (
              <div key={item.announcementId} className="border border-border rounded-xl p-5 bg-card shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-foreground truncate mr-2" title={item.title}>{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${item.priority === 'Critical' ? 'bg-red-100 text-red-700' : item.priority === 'High' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">{item.content}</p>
                
                <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground mb-4">
                  <div><span className="font-medium text-foreground">Category:</span> {item.category}</div>
                  <div><span className="font-medium text-foreground">Expires:</span> {item.expiryDate}</div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1" title="Views">
                      👁️ {item.views}
                    </span>
                    <span className="flex items-center gap-1" title="Likes">
                      ❤️ {item.likes}
                    </span>
                    <span className="flex items-center gap-1" title="Comments">
                      💬 {item.comments}
                    </span>
                    <span className="flex items-center gap-1" title="Acknowledgements">
                      ✅ {item.acknowledgements}
                    </span>
                  </div>
                  
                  {canManageAnnouncements && (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-sm font-medium hover:underline text-foreground">Edit</button>
                      <button onClick={() => handleDelete(item.announcementId)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal (Drawer) */}
        {isAddOpen && (
          <div className="fixed right-0 top-0 z-50 flex h-full w-full sm:w-[400px] flex-col border-l border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-medium">{editingId ? "Edit Announcement" : "Create Announcement"}</h3>
              <button className="rounded px-2 py-1 hover:bg-muted" onClick={() => setIsAddOpen(false)}>×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <input className="w-full rounded border border-border p-2 text-sm" placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <input className="w-full rounded border border-border p-2 text-sm" placeholder="Category" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <input className="w-full rounded border border-border p-2 text-sm" placeholder="Priority" value={formData.priority || ""} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} />
              <textarea className="w-full rounded border border-border p-2 text-sm" rows={4} placeholder="Content" value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
              <input type="date" className="w-full rounded border border-border p-2 text-sm" placeholder="Expiry Date" value={formData.expiryDate || ""} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
            </div>
            <div className="border-t border-border p-4">
              <button onClick={handleSave} className="w-full rounded bg-black px-4 py-2 text-white">Save</button>
            </div>
          </div>
        )}
        {isAddOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setIsAddOpen(false)} />}
      </div>
    </ProtectedRoute>
  );
}
