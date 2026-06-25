import { UserRole } from "../context/AuthContext";

export const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ["Admin", "HR Manager", "Employee", "Finance"],
  employees: ["Admin", "HR Manager"],
  attendance: ["Admin", "HR Manager", "Employee"],
  leave: ["Admin", "HR Manager", "Employee", "Finance"],
  payroll: ["Admin", "Finance", "Employee"],
  announcements: ["Admin", "HR Manager", "Employee", "Finance"]
};
