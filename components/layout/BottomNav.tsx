'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { 
  Home, 
  CalendarDays, 
  Target, 
  GraduationCap, 
  Award,
  Users,
  Briefcase,
  PieChart,
  Megaphone,
  Palmtree
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  if (!user) return null;

  const currentPath = pathname || "";

  let tabs: Array<{ name: string; href: string; icon: React.ReactNode }> = [];

  switch(user.role) {
    case 'Employee':
      tabs = [
        { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Attendance', href: '/attendance', icon: <CalendarDays className="w-5 h-5" /> },
        { name: 'Performance', href: '/performance', icon: <Target className="w-5 h-5" /> }, // Not built yet, but in spec
        { name: 'Training', href: '/training', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Contributions', href: '/contributions', icon: <Award className="w-5 h-5" /> },
      ];
      break;
    case 'Manager':
      tabs = [
        { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Team', href: '/employees', icon: <Users className="w-5 h-5" /> },
        { name: 'Leave', href: '/leave', icon: <Palmtree className="w-5 h-5" /> },
        { name: 'Performance', href: '/performance', icon: <Target className="w-5 h-5" /> },
        { name: 'Training', href: '/training', icon: <GraduationCap className="w-5 h-5" /> },
      ];
      break;
    case 'HR Manager':
      tabs = [
        { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Recruitment', href: '/recruitment', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Analytics', href: '/dashboard', icon: <PieChart className="w-5 h-5" /> }, // Usually dashboard has analytics
        { name: 'Training', href: '/training', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Announcements', href: '/announcements', icon: <Megaphone className="w-5 h-5" /> },
      ];
      break;
    case 'Admin':
    default:
      tabs = [
        { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { name: 'Analytics', href: '/dashboard', icon: <PieChart className="w-5 h-5" /> },
        { name: 'Team', href: '/employees', icon: <Users className="w-5 h-5" /> },
        { name: 'Training', href: '/training', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Announcements', href: '/announcements', icon: <Megaphone className="w-5 h-5" /> },
      ];
      break;
  }

  // Cap tabs at 5 max for bottom nav standard
  tabs = tabs.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentPath.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium leading-none">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
