export type UserRole = "Admin" | "HR Manager" | "Manager" | "Employee" | "Finance";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  managerId?: string;
  avatar?: string;
};

export type Payroll = {
  payrollId: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: string;
  country?: "IN" | "US";
};

export type Expense = {
  expenseId: string;
  employeeId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: string;
  receiptUrl?: string;
};

export type Document = {
  documentId: string;
  employeeId: string;
  title: string;
  category: string;
  uploadDate: string;
  expiryDate?: string;
  status: string;
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  stage: "Applied" | "Interviewing" | "Offered" | "Hired";
  appliedDate: string;
};

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

export type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number;
  certified: boolean;
};

export type ValueContribution = {
  id: string;
  employeeId: string;
  employeeName: string;
  points: number;
  category: string;
  description: string;
  date: string;
};
