import { Payroll, Expense, Document, Candidate, Course, ValueContribution } from "../types";

export const MOCK_PAYROLL: Payroll[] = [
  { payrollId: "PR001", employeeId: "EMP001", month: "September 2026", basicSalary: 5000, bonus: 500, deductions: 200, netSalary: 5300, status: "Processed", country: "US" },
  { payrollId: "PR002", employeeId: "EMP002", month: "September 2026", basicSalary: 4500, bonus: 300, deductions: 150, netSalary: 4650, status: "Pending", country: "IN" },
];

export const MOCK_EXPENSES: Expense[] = [
  { expenseId: "EX001", employeeId: "EMP001", date: "2026-06-15", category: "Travel", amount: 350.00, description: "Flight to NYC", status: "Approved" },
  { expenseId: "EX002", employeeId: "EMP002", date: "2026-06-18", category: "Meals", amount: 45.50, description: "Client Lunch", status: "Pending" },
];

export const MOCK_DOCUMENTS: Document[] = [
  { documentId: "DOC1", employeeId: "EMP001", title: "Passport", category: "Identity", uploadDate: "2024-01-15", expiryDate: "2026-06-30", status: "Verified" },
  { documentId: "DOC3", employeeId: "EMP002", title: "Form 16 / W2", category: "Tax", uploadDate: "2025-04-10", status: "Pending" },
];

export const MOCK_CANDIDATES: Candidate[] = [
  { id: "C1", name: "Alice Smith", role: "Frontend Developer", stage: "Applied", appliedDate: "2026-06-20" },
  { id: "C2", name: "Bob Johnson", role: "Backend Developer", stage: "Interviewing", appliedDate: "2026-06-15" },
];

export const MOCK_COURSES: Course[] = [
  { id: "C1", title: "Information Security Awareness 2026", category: "Compliance", duration: "1h 30m", progress: 100, certified: true },
  { id: "C2", title: "Advanced React & Next.js", category: "Tech Skills", duration: "4h 00m", progress: 65, certified: false },
];

export const MOCK_CONTRIBUTIONS: ValueContribution[] = [
  { id: "V1", employeeId: "EMP001", employeeName: "Sarah Connor", points: 1250, category: "Mentorship", description: "Mentored 3 junior devs", date: "2026-05-10" },
  { id: "V2", employeeId: "EMP002", employeeName: "John Smith", points: 950, category: "Open Source", description: "Contributed to core library", date: "2026-06-01" },
  { id: "V3", employeeId: "EMP003", employeeName: "Alice Wonderland", points: 800, category: "Culture", description: "Organized team building", date: "2026-06-15" },
];
