import { UserRole } from "../context/AuthContext";

export const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ["Admin", "HR Manager", "Manager", "Employee", "Finance"],
  employees: ["Admin", "HR Manager", "Manager"],
  attendance: ["Admin", "HR Manager", "Manager", "Employee"],
  leave: ["Admin", "HR Manager", "Manager", "Employee", "Finance"],
  payroll: ["Admin", "HR Manager", "Manager", "Finance", "Employee"],
  announcements: ["Admin", "HR Manager", "Manager", "Employee", "Finance"],
  expenses: ["Admin", "HR Manager", "Manager", "Employee", "Finance"],
  documents: ["Admin", "HR Manager", "Employee"],
  recruitment: ["Admin", "HR Manager", "Manager"],
  onboarding: ["Admin", "HR Manager", "Manager", "Employee"],
  training: ["Admin", "HR Manager", "Manager", "Employee", "Finance"]
};
