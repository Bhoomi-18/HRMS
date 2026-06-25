'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show on root page or absolute unhandled paths
  if (!pathname || pathname === "/") return null;

  const pathSegments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const breadcrumbs = [];
  
  // Always start with Dashboard as root for HRMS context
  breadcrumbs.push({ name: "Dashboard", href: "/dashboard" });

  let currentPath = "";
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    
    // Skip re-adding dashboard since it's hardcoded as root
    if (segment.toLowerCase() === "dashboard") continue;

    // Capitalize and format segment (e.g., "employee-profile" -> "Employee Profile")
    let name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // Dynamic ID check (heuristic: ID is usually numbers or long hashes)
    if (segment.length >= 10 || !isNaN(Number(segment))) {
       if (pathSegments[i-1] === "employees") {
          name = "Employee Profile";
       } else {
          name = "Details";
       }
    }

    breadcrumbs.push({ name, href: currentPath });
  }

  // Deduplicate breadcrumbs by href (avoids "Dashboard > Dashboard" if pathname is /dashboard)
  const uniqueBreadcrumbs = breadcrumbs.filter((v, i, a) => a.findIndex(t => (t.href === v.href)) === i);

  return (
    <nav 
      className="flex items-center text-sm text-muted-foreground px-6 pt-6 md:px-8 pb-2 animate-in fade-in duration-500 overflow-x-auto whitespace-nowrap" 
      aria-label="Breadcrumb"
    >
      {uniqueBreadcrumbs.map((crumb, index) => {
        const isLast = index === uniqueBreadcrumbs.length - 1;
        return (
          <Fragment key={crumb.href}>
            {isLast ? (
              <span className="font-semibold text-foreground" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="hover:text-foreground transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                {crumb.name}
              </Link>
            )}
            {!isLast && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mx-2 text-muted-foreground/50 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
