'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";

// ─── Mock Search Data ────────────────────────────────────────────────────────
const SEARCH_DATA = [
  { id: "1", title: "John Doe (EMP001)", type: "Employee", link: "/employees" },
  { id: "2", title: "Jane Smith (EMP002)", type: "Employee", link: "/employees" },
  { id: "3", title: "Leave Policy Update", type: "Announcement", link: "/announcements" },
  { id: "4", title: "September Payroll", type: "Payroll", link: "/payroll" },
  { id: "5", title: "Apply Sick Leave", type: "Leave", link: "/leave" },
  { id: "6", title: "Mark Attendance", type: "Attendance", link: "/attendance" },
];

// ─── Mock Notification Data ──────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: "n1", text: "📢 New Announcement: Town Hall", time: "5m ago", unread: true },
  { id: "n2", text: "🌴 Leave Pending: Jane Smith", time: "1h ago", unread: true },
  { id: "n3", text: "💰 Payroll Generated for Sept", time: "2h ago", unread: true },
  { id: "n4", text: "🎂 Employee Birthday: John Doe", time: "1d ago", unread: false },
];

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const filteredSearch = SEARCH_DATA.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (link: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    router.push(link);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 sm:px-6 shrink-0">
      
      {/* Left section: Global Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground">🔍</span>
            <input
              type="text"
              placeholder="Search employees, leaves, payroll..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchQuery && (
            <div className="absolute left-0 mt-2 w-full rounded-xl border border-border bg-background py-2 shadow-lg animate-in fade-in zoom-in-95">
              {filteredSearch.length > 0 ? (
                <ul>
                  {filteredSearch.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSearchSelect(item.link)}
                        className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted"
                      >
                        <span className="font-medium text-foreground">{item.title}</span>
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{item.type}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">No results found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Dark Mode Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-lg animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`flex flex-col gap-1 rounded-lg p-3 text-sm transition-colors hover:bg-muted ${n.unread ? 'bg-muted/30' : ''}`}>
                    <span className="font-medium text-foreground">{n.text}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-2">
                <button className="w-full rounded py-1.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 rounded-full border border-border bg-card p-1 pr-3 hover:bg-muted transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-xs font-bold text-white shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="hidden flex-col items-start text-left sm:flex">
                <span className="text-xs font-medium text-foreground leading-none">{user.name}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{user.role}</span>
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background py-1 shadow-lg animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-border mb-1 sm:hidden">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted">My Profile</button>
                <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted">Settings</button>
                <div className="my-1 border-t border-border"></div>
                <button 
                  onClick={() => { logout(); router.push('/login'); setIsProfileOpen(false); }} 
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-border cursor-pointer shrink-0" />
        )}
      </div>
    </header>
  );
}
