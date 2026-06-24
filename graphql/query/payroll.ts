import { gql } from "@apollo/client";

export const GET_ALL_PAYROLL = gql`
  query GetAllPayroll($request: GetAllPayrollRequestInput!) {
    getAllPayroll(request: $request) {
      data {
        payroll {
          payrollId
          employeeId
          month
          basicSalary
          bonus
          deductions
          netSalary
          paymentStatus
        }
      }
      message
      statusCode
      success
    }
  }
`;
